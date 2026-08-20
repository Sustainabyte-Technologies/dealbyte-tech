import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Pipeline value by stage
    const dealsByStage = await this.prisma.deal.groupBy({
      by: ['stage'],
      _count: true,
      _sum: { value: true },
    });

    // Deals won this month
    const dealsWonThisMonth = await this.prisma.deal.count({
      where: {
        stage: 'WON',
        updatedAt: { gte: startOfMonth },
      },
    });

    // Total pipeline value (active deals)
    const activePipeline = await this.prisma.deal.aggregate({
      where: {
        stage: { in: ['ENQUIRY', 'QUOTED', 'NEGOTIATION'] },
      },
      _sum: { value: true },
      _count: true,
    });

    // Recent deals
    const recentDeals = await this.prisma.deal.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        service: { select: { name: true } },
        owner: { select: { name: true } },
      },
    });

    return {
      funnel: dealsByStage,
      dealsWonThisMonth,
      activePipeline: {
        totalValue: activePipeline._sum.value || 0,
        count: activePipeline._count,
      },
      recentDeals,
    };
  }

  async getCostingMargin() {
    // Avg margin by service
    const marginByService = await this.prisma.quote.groupBy({
      by: ['serviceId'],
      _avg: { marginPct: true },
      _count: true,
      _sum: { finalQuote: true },
    });

    // Enrich with service names
    const serviceIds = marginByService.map((m) => m.serviceId);
    const services = await this.prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, name: true },
    });
    const serviceMap = new Map(services.map((s) => [s.id, s.name]));

    const enriched = marginByService.map((m) => ({
      serviceId: m.serviceId,
      serviceName: serviceMap.get(m.serviceId) || 'Unknown',
      avgMarginPct: m._avg.marginPct,
      quoteCount: m._count,
      totalValue: m._sum.finalQuote,
    }));

    // Low-margin deals (below threshold)
    const thresholdConfig = await this.prisma.systemConfig.findUnique({
      where: { key: 'APPROVAL_MARGIN_THRESHOLD' },
    });
    const threshold = parseFloat(thresholdConfig?.value || '25');

    const lowMarginQuotes = await this.prisma.quote.findMany({
      where: { marginPct: { lt: threshold } },
      orderBy: { marginPct: 'asc' },
      take: 20,
      include: {
        deal: { include: { service: { select: { name: true } } } },
        createdBy: { select: { name: true } },
      },
    });

    return {
      marginByService: enriched,
      lowMarginQuotes,
      threshold,
    };
  }

  async getProposalTracker() {
    const proposals = await this.prisma.proposal.findMany({
      orderBy: { generatedAt: 'desc' },
      include: {
        deal: {
          include: {
            service: { select: { name: true } },
            owner: { select: { id: true, name: true } },
          },
        },
        quote: { select: { id: true, finalQuote: true } },
      },
    });

    // Flag stale deals (> 30 days since last update with no activity)
    const now = new Date();
    const staleDays = 30;

    const enriched = proposals.map((p) => {
      const daysSinceGenerated = Math.floor(
        (now.getTime() - p.generatedAt.getTime()) / (1000 * 60 * 60 * 24),
      );
      return {
        ...p,
        isStale: daysSinceGenerated > staleDays && p.status !== 'SENT',
        daysSinceGenerated,
      };
    });

    return enriched;
  }

  async getServicePerformance() {
    // Value and win rate per service
    const allDeals = await this.prisma.deal.groupBy({
      by: ['serviceId', 'stage'],
      _count: true,
      _sum: { value: true },
    });

    // Group by service
    const serviceStats = new Map<
      string,
      { total: number; won: number; lost: number; totalValue: number; wonValue: number }
    >();

    for (const d of allDeals) {
      const existing = serviceStats.get(d.serviceId) || {
        total: 0, won: 0, lost: 0, totalValue: 0, wonValue: 0,
      };
      existing.total += d._count;
      existing.totalValue += Number(d._sum.value || 0);

      if (d.stage === 'WON') {
        existing.won += d._count;
        existing.wonValue += Number(d._sum.value || 0);
      }
      if (d.stage === 'LOST') {
        existing.lost += d._count;
      }
      serviceStats.set(d.serviceId, existing);
    }

    // Enrich with service names
    const serviceIds = [...serviceStats.keys()];
    const services = await this.prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, name: true, category: true },
    });
    const serviceMap = new Map(services.map((s) => [s.id, s]));

    const result = [...serviceStats.entries()].map(([id, stats]) => ({
      serviceId: id,
      serviceName: serviceMap.get(id)?.name || 'Unknown',
      category: serviceMap.get(id)?.category || 'Unknown',
      totalDeals: stats.total,
      wonDeals: stats.won,
      lostDeals: stats.lost,
      winRate: stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0,
      totalValue: stats.totalValue,
      wonValue: stats.wonValue,
    }));

    return result.sort((a, b) => b.wonValue - a.wonValue);
  }
}

'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { costingApi } from '@/lib/api/costing';
import {
  Sparkles,
  Layers,
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';

interface IrBlasterPagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
  costingSheet?: any;
}

export function IrBlasterPages(props: IrBlasterPagesProps) {
  const {
    deal,
    proposal,
    proposalRef,
    proposalDate,
    finalPrice,
    formatCurrency,
  } = props;
  const totalPages = 4;

  const clientName = deal?.clientName || (proposal as any)?.clientName || proposal?.quote?.deal?.clientName || 'L&T Valves';
  const projectName = deal?.projectName || (deal as any)?.projectName || 'Plant 1';

  // Dynamic Costing Sheet Resolution from DB or payload
  const { data: dbCostingSheet } = useQuery({
    queryKey: ['ir-blaster-costing-sheet', clientName],
    queryFn: async () => {
      if (!clientName) return null;
      try {
        const sheets = await costingApi.getSheets({ clientName });
        if (sheets && sheets.length > 0) {
          const matched = sheets.find(
            (s: any) =>
              s.subService?.toLowerCase().includes('ir blaster') ||
              s.subService?.toLowerCase().includes('ir') ||
              s.serviceCategory?.toLowerCase().includes('iot') ||
              s.serviceCategory?.toLowerCase().includes('control')
          );
          if (matched) return matched;
          return sheets[0];
        }
      } catch (e) {
        console.error('Error fetching costing sheets for IR blaster proposal', e);
      }
      return null;
    },
    staleTime: 30000,
  });

  const costingSheet =
    props.costingSheet ||
    (proposal as any)?.costingSheet ||
    (proposal as any)?.costing_sheet ||
    (proposal as any)?.costingData ||
    (proposal as any)?.costing_data ||
    (proposal as any)?.quote?.costingSheet ||
    (deal as any)?.costingSheet ||
    (deal as any)?.quote?.costingSheet ||
    dbCostingSheet ||
    {};

  const calcRowPrice = (unitCost: number, marginPct: number = 40): number => {
    if (marginPct >= 100) return unitCost * 2;
    return Math.round(unitCost / Math.max(0.01, (100 - marginPct) / 100));
  };

  // Extract hardware rows from IoT / IR blaster costing
  const rawHwRows: any[] =
    costingSheet.iotControlsHardwareRows ||
    costingSheet.instrumentRows?.iotControlsHardwareRows ||
    costingSheet.hardwareRows ||
    [];
  const activeHwRows = rawHwRows.filter((r) => Number(r.quantity || r.qty || 0) > 0);

  // Extract Opex / Software / Cloud rows
  const rawOpexRows: any[] =
    costingSheet.iotControlsOpexRows ||
    costingSheet.opexRows ||
    costingSheet.cloudRows ||
    [];
  const activeOpexRows = rawOpexRows.filter((r) => Number(r.qty || r.quantity || 0) > 0);

  // Installation & Commissioning
  const instCost = Number(
    costingSheet.totalInstallationCost ||
    costingSheet.emsManpowerTotalPrice ||
    costingSheet.emsManpowerTotalCost ||
    0
  );

  interface CommercialRow {
    description: string;
    count: string | number;
    unit: string;
    cost: number;
  }

  const commercialItems: CommercialRow[] = [];

  // 1. Hardware Items
  if (activeHwRows.length > 0) {
    activeHwRows.forEach((r) => {
      const q = Number(r.quantity || r.qty || 1);
      const unitPrice = r.unitPrice
        ? Number(r.unitPrice)
        : calcRowPrice(Number(r.unitCost || 4500), Number(r.marginPct ?? 40));
      commercialItems.push({
        description: r.productDescription || r.itemDescription || 'New IR Blaster Hardware Unit',
        count: q,
        unit: r.uom || 'Nos',
        cost: Math.round(q * unitPrice),
      });
    });
  }

  // 2. Installation & Commissioning
  if (instCost > 0) {
    commercialItems.push({
      description: 'Installation, Testing & Commissioning Charges',
      count: 1,
      unit: 'Job',
      cost: instCost,
    });
  }

  // 3. Cloud / OptiByte Platform Opex
  if (activeOpexRows.length > 0) {
    activeOpexRows.forEach((r) => {
      const q = Number(r.qty || r.quantity || 1);
      const unitPrice = r.unitPrice
        ? Number(r.unitPrice)
        : calcRowPrice(Number(r.unitCost || 3000), Number(r.marginPct ?? 40));
      commercialItems.push({
        description: r.scopeDescription || r.itemDescription || 'OptiByte Energy Management Cloud License',
        count: q,
        unit: r.uom || 'Nos/Yr',
        cost: Math.round(q * unitPrice),
      });
    });
  }

  // 4. Packaging Charges (3%)
  const packaging3Pct = Number(costingSheet.iotHardware3PctPrice || costingSheet.cpmHardware3PctPrice || 0);
  if (packaging3Pct > 0) {
    commercialItems.push({
      description: 'Packaging, Handling & Transit Insurance (3%)',
      count: 1,
      unit: 'Lot',
      cost: packaging3Pct,
    });
  }

  // 5. Negotiation Buffer
  const bufferAmount = Number(costingSheet.bufferAmount || 0);
  if (bufferAmount > 0) {
    commercialItems.push({
      description: `Negotiation & Contingency Buffer (${costingSheet.bufferPct || 10}%)`,
      count: '',
      unit: '',
      cost: bufferAmount,
    });
  }

  // Dynamic fallback for IR Blaster (7 units at L&T Valves or client)
  const defaultQuantity = activeHwRows.length > 0 ? Number(activeHwRows[0].quantity || activeHwRows[0].qty || 7) : 7;
  const fallbackCommercialItems: CommercialRow[] = [
    {
      description: 'New IR Blaster – AC Energy Automation Hardware (Plug & Play Retrofit Unit)',
      count: defaultQuantity,
      unit: 'Nos',
      cost: defaultQuantity * 7500,
    },
    {
      description: 'Installation, Mounting, Wiring Alignment, Testing & Commissioning',
      count: defaultQuantity,
      unit: 'Nos',
      cost: defaultQuantity * 2500,
    },
    {
      description: 'OptiByte Cloud Platform Software & Centralized AC Telemetry License (Yearly)',
      count: defaultQuantity,
      unit: 'Nos',
      cost: defaultQuantity * 3500,
    },
    {
      description: 'Freight, Packaging & Handling Charges (3%)',
      count: 1,
      unit: 'Lot',
      cost: Math.round(defaultQuantity * 7500 * 0.03),
    },
  ];

  const displayCommercialItems = commercialItems.length > 0 ? commercialItems : fallbackCommercialItems;
  const calculatedTotal = displayCommercialItems.reduce((sum, item) => sum + item.cost, 0);
  const displayFinalTotal = finalPrice && finalPrice > 0 ? finalPrice : calculatedTotal;

  const PageHeader = ({ subtitle = 'IR Blaster – AC Energy Solutions Proposal' }: { subtitle?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2.5 gap-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
        <h2 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
          {clientName} — IR Blaster AC Energy Automation
        </h2>
        <div className="text-[10.5px] font-mono text-slate-500 mt-0.5 flex items-center gap-2">
          <span>Ref: <strong>{proposalRef}</strong></span>
          <span>•</span>
          <span>Date: <strong>{proposalDate}</strong></span>
        </div>
      </div>
      <div className="flex items-center justify-end shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Logo" className="h-10 sm:h-12 w-auto object-contain" />
      </div>
    </div>
  );

  const PageFooter = ({ pageNum }: { pageNum: number }) => (
    <div className="relative z-10 border-t border-slate-200 pt-2.5 mt-3 flex items-center justify-between text-[9.5px] text-slate-400 font-medium">
      <span>Quotation No: <strong>{proposalRef}</strong></span>
      <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page {pageNum} of {totalPages}</span>
    </div>
  );

  const PageShell = ({ pageNum, subtitle, children }: { pageNum: number; subtitle?: string; children: React.ReactNode }) => (
    <div
      className="proposal-page relative z-10 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-[800px] mx-auto text-slate-800 h-[1130px] min-h-[1130px] max-h-[1130px] flex flex-col justify-between overflow-hidden"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <div className="border-2 border-slate-900 p-4 sm:p-6 flex-1 flex flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.14] bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/watermark-transparent.png')", backgroundSize: 'contain' }}
          aria-hidden="true"
        />
        <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            <PageHeader subtitle={subtitle} />
            {children}
          </div>
        </div>
        <PageFooter pageNum={pageNum} />
      </div>
    </div>
  );

  return (
    <>
      {/* ── PAGE 1: COVER PAGE & SCOPE OF WORK ── */}
      <div
        className="proposal-page relative z-10 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-[800px] mx-auto text-slate-800 h-[1130px] min-h-[1130px] max-h-[1130px] flex flex-col justify-between overflow-hidden"
        style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
      >
        <div className="border-2 border-slate-900 p-5 sm:p-7 flex-1 flex flex-col justify-between relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.14] bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/watermark-transparent.png')", backgroundSize: 'contain' }}
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-4 gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Official Commercial Proposal
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 uppercase">
                  IR Blaster – AC Energy Solutions
                </h1>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Document Ref: <span className="font-bold text-slate-800">{proposalRef}</span> • Date: <span className="font-bold text-slate-800">{proposalDate}</span>
                </p>
              </div>
              <div className="flex items-center justify-end shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Logo" className="h-12 sm:h-14 w-auto object-contain" />
              </div>
            </div>

            {/* Prepared For Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Proposal Prepared For:</p>
                <h3 className="text-lg font-black text-slate-900">{clientName}</h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Service Scope: <span className="font-bold text-slate-800">IoT &amp; Control — New IR Blaster AC Energy Automation</span>
                </p>
              </div>
              {(proposal as any)?.clientLogo && (
                <div className="h-14 w-32 bg-white p-1 flex items-center justify-center shrink-0 border border-slate-100 rounded-lg shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={(proposal as any).clientLogo} alt="Client Logo" className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>

            {/* Scope of Work */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
              <h3 className="font-bold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600" /> Scope of Work:
              </h3>
              <p className="text-slate-800 text-[11.5px] leading-relaxed font-medium">
                In this proposal, we will carry out the supply, installation, testing, and commissioning of {defaultQuantity > 0 ? defaultQuantity : 'Seven'} IR Blasters at {clientName}.
              </p>
            </div>

            {/* About Sustainabyte */}
            <div className="space-y-2.5 pt-1">
              <h3 className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight text-base">
                About Sustainabyte:
              </h3>
              <div className="space-y-2 text-slate-800 font-normal text-left text-[11px] leading-relaxed">
                <p>
                  Sustainabyte is a private limited company, based out in Chennai, with client base spreading across 3 countries. It is a climate-tech start-up, predominantly focusing on energy conservation methodologies across Industries, Commercial building and residential complexes. Sustainabyte.ai is dedicated to leveraging advanced technology for global sustainability.
                </p>
                <p>
                  Our mission is to minimize environmental impact while enhancing operational efficiency through innovative solutions. Sustainabyte is a technology-driven sustainability company, providing cutting-edge solutions for enterprises to identify, plan and operationalize their Net Zero Carbon ambitions.
                </p>
                <p>
                  We implement our flagship IoT solution — OptiByte — as an overlay on the client’s existing systems, connecting data points to provide a bird’s eye view. Our reporting module presents ESG scores, operational efficiency KPIs and delivers measurable results within 30–60 days.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 border-t border-slate-200 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Quotation No: <strong>{proposalRef}</strong></span>
            <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page 1 of {totalPages}</span>
          </div>
        </div>
      </div>

      {/* ── PAGE 2: ABOUT IR BLASTER & KEY FEATURES ── */}
      <PageShell pageNum={2} subtitle="Product Showcase & Technical Capabilities">
        <div className="space-y-3 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          {/* Section 1: About IR Blaster */}
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-600" /> About IR Blaster – AC Energy Solutions:
            </h3>

            {/* Product Image + Bullet points */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-50/70 p-3 rounded-xl border border-slate-200">
              <div className="sm:col-span-4 flex justify-center bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/irimag11.jpeg"
                  alt="IR Blaster Smart Unit"
                  className="w-full max-h-[190px] object-contain rounded-md"
                />
              </div>
              <div className="sm:col-span-8 space-y-1.5 text-slate-800 text-[10.5px]">
                <p className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold shrink-0">▪</span>
                  <span><strong>Smart Connected Systems:</strong> Turns standalone AC units into intelligent, cloud-connected automated systems.</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold shrink-0">▪</span>
                  <span><strong>Operational Alignment:</strong> Eliminates operational inconsistencies and strictly aligns room cooling with defined enterprise temperature standards.</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold shrink-0">▪</span>
                  <span><strong>Secure Cloud Framework:</strong> Operates on a secure, cloud-connected framework for real-time remote configuration, event logging, and proactive diagnostics.</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold shrink-0">▪</span>
                  <span><strong>Plug &amp; Play Retrofit:</strong> Easy, non-invasive installation — No complex rewiring or internal AC modifications required.</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold shrink-0">▪</span>
                  <span><strong>Universal HVAC Compatibility:</strong> Works seamlessly with all major HVAC brands, compatible with split, cassette, and package AC units.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Key Features Grid */}
          <div className="pt-1">
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" /> Key Features:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-white rounded-xl border border-slate-300 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                  <Activity className="h-4 w-4 text-rose-500" /> Smart Alarms
                </div>
                <p className="text-[10px] text-slate-600 leading-snug">
                  Automated instant notifications &amp; alerts for AC units inadvertently left ON during non-working, idle, or weekend hours.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-300 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                  <Layers className="h-4 w-4 text-indigo-600" /> Centralized Control
                </div>
                <p className="text-[10px] text-slate-600 leading-snug">
                  Unified enterprise dashboard to manage, monitor, and configure multiple distributed AC units across multiple zones from a single platform.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-300 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-teal-600" /> Setpoint Management
                </div>
                <p className="text-[10px] text-slate-600 leading-snug">
                  Enforce strict cooling temperature limits (e.g. 24°C–26°C) to prevent local overcooling, user tampering, and excessive power draw.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-300 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                  <Sparkles className="h-4 w-4 text-emerald-600" /> Intelligent Scheduling
                </div>
                <p className="text-[10px] text-slate-600 leading-snug">
                  Automate scheduled ON/OFF cycles based on shift timings, calendar holidays, and real-time occupancy profiles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 3: ARCHITECTURE & BUSINESS BENEFITS ── */}
      <PageShell pageNum={3} subtitle="System Architecture & Energy Conservation Benefits">
        <div className="space-y-3 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          {/* Section 1: Solution Architecture Diagram */}
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2 flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-600" /> Solution Architecture:
            </h3>

            <div className="w-full rounded-xl border border-slate-300 overflow-hidden bg-white p-2 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/irarchitec.png"
                alt="IR Blaster Solution Architecture"
                className="w-full h-auto max-h-[260px] object-contain rounded-lg mx-auto"
              />
            </div>
          </div>

          {/* Section 2: Benefits & Sustainability Impact */}
          <div className="pt-1">
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-emerald-600" /> Benefits &amp; Measurable Energy Impact:
            </h3>

            <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-200 text-[10.5px] text-slate-800">
              <p className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>10–15% Direct Energy Savings:</strong> Substantial energy reduction achieved by eliminating unnecessary idle runtime, schedule adherence, and setpoint discipline.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>BEE Standard Alignment:</strong> Ensures measurable temperature discipline in strict alignment with BEE (Bureau of Energy Efficiency) recommendations.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Every 1°C Optimization:</strong> Statistically proven that each 1°C increase in temperature setpoint yields <strong>6% to 10% direct energy savings</strong>.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Net Zero Carbon Acceleration:</strong> Directly supports enterprise Net Zero ESG strategy by lowering Scope 2 HVAC carbon emissions.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Enhanced Operational Reliability:</strong> Extends AC compressor lifespan and optimizes enterprise facility operating overheads.</span>
              </p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: COMMERCIAL INVESTMENT & TERMS & CONDITIONS ── */}
      <PageShell pageNum={4} subtitle="Commercial Investment, Terms & Conditions & Authorization">
        <div className="space-y-3 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          {/* Commercials Table */}
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-cyan-700" /> Commercials:
            </h3>

            <div className="border border-slate-900 rounded-md overflow-hidden text-xs shadow-xs mb-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-100 text-slate-900 font-black text-center text-xs">
                    <th colSpan={4} className="py-1 px-3 uppercase tracking-wider text-center font-black text-xs">
                      {clientName} — {projectName}
                    </th>
                  </tr>
                  <tr className="border-b border-slate-900 bg-white font-extrabold text-[11px] text-slate-900">
                    <th className="py-1.5 px-3 border-r border-slate-900 text-left font-extrabold">Description</th>
                    <th className="py-1.5 px-2 border-r border-slate-900 text-center w-16 font-extrabold">Count</th>
                    <th className="py-1.5 px-2 border-r border-slate-900 text-center w-16 font-extrabold">Unit</th>
                    <th className="py-1.5 px-3 text-right w-28 font-extrabold">Cost (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 text-slate-900 text-[10px]">
                  {displayCommercialItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-1 px-3 border-r border-slate-900 font-medium text-slate-900 leading-tight">
                        {item.description}
                      </td>
                      <td className="py-1 px-2 border-r border-slate-900 text-center font-bold text-slate-800">
                        {item.count !== undefined && item.count !== null && item.count !== 0 ? item.count : ''}
                      </td>
                      <td className="py-1 px-2 border-r border-slate-900 text-center font-medium text-slate-700">
                        {item.unit || ''}
                      </td>
                      <td className="py-1 px-3 text-right font-mono font-bold text-slate-950">
                        {formatCurrency(item.cost).replace('₹', '').trim()}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-900 font-black bg-slate-100 text-xs">
                    <td colSpan={3} className="py-1.5 px-4 text-center uppercase tracking-wider font-black border-r border-slate-900">
                      Total Commercial Investment
                    </td>
                    <td className="py-1.5 px-3 text-right font-black font-mono text-slate-950 text-xs">
                      {formatCurrency(displayFinalTotal).replace('₹', '').trim()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Support Required & Terms & Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[9.5px]">
            {/* Support Required */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-950 text-[10px] underline underline-offset-2 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-indigo-600" /> Support required from the client:
              </h4>
              <p className="flex items-start gap-1">
                <span>•</span>
                <span>SPOC (Single point of Contact) for support and coordination during installation and Commissioning phase.</span>
              </p>
              <p className="flex items-start gap-1">
                <span>•</span>
                <span>Accessibility to each air-conditioned area.</span>
              </p>
              <p className="flex items-start gap-1">
                <span>•</span>
                <span>1 person required from client side with knowledge of electrical routing and manpower support for installation.</span>
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-950 text-[10px] underline underline-offset-2 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" /> Terms and Conditions:
              </h4>
              <p><strong>Payment schedule:</strong></p>
              <p className="pl-2">• Supply of hardware – 100% upfront</p>
              <p className="pl-2">• Installation and commissioning – 50% Advance &amp; 50% After successful installation</p>
              <p>• Applicable taxes and duties will be extra.</p>
              <p>• Timelines for execution mutually agreed during project kick-off.</p>
              <p>• Client to provide authority approvals, passes &amp; secure storage area.</p>
              <p>• Any material beyond scope charged at actuals.</p>
            </div>
          </div>

          {/* Authorization & Bank Details */}
          <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-200 text-xs">
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-900 text-[10.5px]">Submitted By:</h4>
              <p className="font-black text-slate-950 text-xs">Thanakarthik</p>
              <p className="font-semibold text-slate-700 text-[10.5px]">Founder &amp; CEO, Sustainabyte Technologies</p>
              <p className="font-mono text-slate-800 text-[10px]">+91-8377007638 • thanakarthik@sustainabyte.ai</p>
            </div>

            <div className="space-y-0.5 text-[9.5px] font-mono text-slate-800">
              <h4 className="font-bold text-slate-900 text-[10.5px] font-sans underline underline-offset-2">Bank Account Details:</h4>
              <p><strong>A/C Name:</strong> SUSTAINABYTE TECHNOLOGIES PVT LTD</p>
              <p><strong>Bank:</strong> Bank of Baroda • <strong>IFSC:</strong> BARB0VELACH</p>
              <p><strong>A/C No:</strong> 35860200000750 (Velachery Branch)</p>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
}

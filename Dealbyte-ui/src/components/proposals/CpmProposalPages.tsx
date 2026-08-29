'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { costingApi } from '@/lib/api/costing';
import {
  INITIAL_CPM_HARDWARE_ROWS,
  INITIAL_CPM_ELECTRICAL_ROWS,
  INITIAL_CPM_ON_PREMISE_ROWS,
  INITIAL_CPM_CLOUD_CHARGE_ROWS,
} from '@/components/costing/constants';

interface CpmProposalPagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
  costingSheet?: any;
}

export function CpmProposalPages(props: CpmProposalPagesProps) {
  const {
    deal,
    proposal,
    proposalRef,
    proposalDate,
    finalPrice,
    formatCurrency,
  } = props;
  const totalPages = 8;

  const PageHeader = ({ subtitle = 'Central Plant Monitoring (CPM) System Proposal' }: { subtitle?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2 gap-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
        <h2 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
          {deal?.clientName || 'Valued Client'} — Central Plant Monitoring (CPM)
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

  const allClients = [
    'Mazaya Business Avenue, Dubai',
    'ASHRAE Level 2 audit at 6 Commercial Buildings, Dubai',
    'Danat Al Emarat Hospital, Dubai by Aatral',
    'Suzlon Energy Pvt Ltd',
    'Velmurugan Industries Ltd',
    'Capital Land by Orien Energy',
    'Casagrand Eco Tech, Sholinganallur',
    'Tidal Park, Pattabiram',
    'TNQ Software, Tharamani',
    'Embassy Tech Village, Kadubisenahalli, Bengaluru',
    'Embassy ETZ, Pune',
    'Firstsource Limited, Vijayawada',
    'Firstsource Limited, Hyderabad',
    'Firstsource Limited, Chennai',
    'Valeo Software, Sholinganallur',
    'Solidpro, Chennai',
    'SRM University, Chennai',
    'Development Environergy Services Limited - IIT Hyderabad',
    'Aatral Engineering',
    'Velmurugan Heavy Engineering Industries Pvt Ltd',
    '20cube Logistics Solutions Pvt Ltd',
    'Danfoss Industries Pvt Ltd',
    'Knowledge Bridge',
    'S G Snacks India Pvt Ltd',
    'Parekhplast India Limited',
    'PMEL Oragadam Pvt Ltd - Unit 3 & 4',
    'Lucas TVS Limited - Padi',
    'Visalam Technologies LLP',
    'Adspaas Polymer Solutions Limited',
    'Wheels India Limited',
    'India Metal One Steel Plate Processing Pvt Ltd',
    'Aisan Auto Parts India Pvt Ltd',
    'Whirlpool of India Limited',
    'ITC - Medak Ltd',
    'Kone Elevator India Pvt Ltd',
    'KPR Mill Limited',
    'Concorde Textiles Ltd',
    'Arni Engineering Tech Pvt Ltd',
    'Growserve Enterprises - Ashirwad',
    'Vashi Integrated Solutions Limited',
    'Ahlstrom Fiber Composite Pvt Ltd',
  ];

  // Dynamically fetch and resolve the client's current saved costing sheet
  const clientName = deal?.clientName || (proposal as any)?.clientName || proposal?.quote?.deal?.clientName;

  const { data: dbCostingSheet } = useQuery({
    queryKey: ['cpm-proposal-costing-sheet', clientName],
    queryFn: async () => {
      if (!clientName) return null;
      try {
        const sheets = await costingApi.getSheets({ clientName });
        if (sheets && sheets.length > 0) {
          const cpm = sheets.find(
            (s: any) =>
              s.isCpm ||
              s.subService?.toLowerCase().includes('cpm') ||
              s.subService?.toLowerCase().includes('chiller') ||
              s.serviceCategory?.toLowerCase().includes('chiller')
          );
          if (cpm) return cpm;
          return sheets[0];
        }
      } catch (e) {
        console.error('Error fetching costing sheets for proposal', e);
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

  // Step 1: Hardware Capex Matrix
  const rawHwRows: any[] = costingSheet.cpmHardwareRows || costingSheet.instrumentRows?.cpmHardwareRows || [];
  const activeHwRows = rawHwRows.filter((r) => Number(r.qty || 0) > 0);

  // Step 2: Electrical Consumables
  const rawElecRows: any[] = costingSheet.cpmElectricalRows || costingSheet.instrumentRows?.cpmElectricalRows || [];
  const activeElecRows = rawElecRows.filter((r) => Number(r.qty || 0) > 0);

  // Step 4: Installation Charges
  const instPrice = Number(
    costingSheet.cpmInstManpowerTotalPrice ||
    costingSheet.totalInstallationCost ||
    costingSheet.cpmInstallationTotalPrice ||
    costingSheet.cpmInstManpowerTotalCost ||
    0
  );

  // Step 3: Testing & Commissioning
  const commPrice = Number(
    costingSheet.cpmCommissioningTotalPrice ||
    costingSheet.totalCommissioningCost ||
    costingSheet.cpmCommissioningTotalCost ||
    0
  );

  // Step 6: Software & Cloud Charges
  const rawCloudRows: any[] = costingSheet.cpmCloudChargeRows || costingSheet.cpmCloudRows || [];
  const activeCloudRows = rawCloudRows.filter((r) => Number(r.qty || 0) > 0);
  const cloudPrice = Number(costingSheet.cpmCloudChargeTotalPrice || costingSheet.totalCloudCost || costingSheet.cpmCloudTotalPrice || 0);

  // Step 5: On-Premise Application Charges
  const rawOnPremiseRows: any[] = costingSheet.cpmOnPremiseRows || [];
  const activeOnPremiseRows = rawOnPremiseRows.filter((r) => Number(r.qty || 0) > 0);
  const onPremisePrice = Number(costingSheet.cpmOnPremiseTotalPrice || costingSheet.totalOnPremiseCost || 0);

  interface ProposalCommercialRow {
    description: string;
    count: string | number;
    unit: string;
    cost: number;
  }

  const commercialItems: ProposalCommercialRow[] = [];

  // Add Step 1 Hardware Items
  activeHwRows.forEach((r) => {
    const unitPrice = r.unitPrice ? Number(r.unitPrice) : calcRowPrice(Number(r.unitCost || 0), Number(r.marginPct ?? 40));
    const totalRowPrice = Math.round(Number(r.qty || 1) * unitPrice);
    commercialItems.push({
      description: r.brand ? `${r.itemDescription} (${r.brand})` : r.itemDescription,
      count: r.qty,
      unit: r.uom || 'Nos',
      cost: totalRowPrice,
    });
  });

  // Add Step 2 Electrical Consumables
  activeElecRows.forEach((r) => {
    const unitPrice = r.unitPrice ? Number(r.unitPrice) : calcRowPrice(Number(r.unitCost || 0), Number(r.marginPct ?? 40));
    const totalRowPrice = Math.round(Number(r.qty || 1) * unitPrice);
    commercialItems.push({
      description: r.brand ? `${r.itemDescription} (${r.brand})` : r.itemDescription,
      count: r.qty,
      unit: r.uom || 'Mtr',
      cost: totalRowPrice,
    });
  });

  // Add Step 4 Installation Charges
  if (instPrice > 0) {
    commercialItems.push({
      description: 'Installation Charges',
      count: '',
      unit: '',
      cost: instPrice,
    });
  }

  // Add Step 3 Testing & Commissioning
  if (commPrice > 0) {
    commercialItems.push({
      description: 'Testing & Commissioning',
      count: '',
      unit: '',
      cost: commPrice,
    });
  }

  // Add Step 6 Cloud & Software Subscriptions
  if (activeCloudRows.length > 0) {
    activeCloudRows.forEach((r) => {
      const unitPrice = r.unitPrice ? Number(r.unitPrice) : calcRowPrice(Number(r.unitCost || 0), Number(r.marginPct ?? 40));
      const totalRowPrice = Math.round(Number(r.qty || 1) * unitPrice);
      commercialItems.push({
        description: (r as any).component || (r.basis ? `Cloud & Software Subscription (${r.basis})` : 'Software cost / Cloud Charges'),
        count: r.qty || '',
        unit: (r as any).uom || 'Subscription',
        cost: totalRowPrice,
      });
    });
  } else if (cloudPrice > 0) {
    commercialItems.push({
      description: 'Software cost',
      count: '',
      unit: '',
      cost: cloudPrice,
    });
  }

  // Add Step 5 On-Premise Application Cost
  if (activeOnPremiseRows.length > 0) {
    activeOnPremiseRows.forEach((r) => {
      const unitPrice = r.unitPrice ? Number(r.unitPrice) : calcRowPrice(Number(r.unitCost || 0), Number(r.marginPct ?? 40));
      const totalRowPrice = Math.round(Number(r.qty || 1) * unitPrice);
      commercialItems.push({
        description: (r as any).commercialLayer || (r as any).itemDescription || 'Application / Configuration Cost',
        count: r.qty || '',
        unit: (r as any).uom || 'Platform',
        cost: totalRowPrice,
      });
    });
  } else if (onPremisePrice > 0) {
    commercialItems.push({
      description: 'Application Cost',
      count: '',
      unit: '',
      cost: onPremisePrice,
    });
  }

  // Add 3% Packaging Charges if calculated in costing
  const cpmHardware3PctPrice = Number(costingSheet.cpmHardware3PctPrice || 0);
  if (cpmHardware3PctPrice > 0) {
    commercialItems.push({
      description: 'Packaging Charges (3% of Total Hardware & Consumables)',
      count: 1,
      unit: 'Lot',
      cost: cpmHardware3PctPrice,
    });
  }

  // Add Negotiation Buffer if present
  const cpmBufferAmount = Number(costingSheet.cpmBufferAmount || costingSheet.bufferAmount || 0);
  if (cpmBufferAmount > 0) {
    commercialItems.push({
      description: `Negotiation & Contingency Buffer (${costingSheet.bufferPct || 10}%)`,
      count: '',
      unit: '',
      cost: cpmBufferAmount,
    });
  }

  // Dynamic Fallback Rows computed directly from Master CPM Costing Catalog Models & Formulas
  const fallbackCommercialItems: ProposalCommercialRow[] = [
    ...INITIAL_CPM_HARDWARE_ROWS.map((r) => ({
      description: r.itemDescription,
      count: r.qty > 0 ? r.qty : 1,
      unit: r.uom || 'Nos',
      cost: Math.round((r.qty > 0 ? r.qty : 1) * calcRowPrice(r.unitCost, r.marginPct ?? 40)),
    })),
    ...INITIAL_CPM_ELECTRICAL_ROWS.map((r) => ({
      description: r.itemDescription,
      count: r.qty > 0 ? r.qty : (r.uom === 'Mtr' ? 100 : 1),
      unit: r.uom || 'Mtr',
      cost: Math.round((r.qty > 0 ? r.qty : (r.uom === 'Mtr' ? 100 : 1)) * calcRowPrice(r.unitCost, r.marginPct ?? 40)),
    })),
    { description: 'Installation Charges', count: '', unit: '', cost: 45000 },
    { description: 'Testing & Commissioning', count: '', unit: '', cost: 120000 },
    ...INITIAL_CPM_CLOUD_CHARGE_ROWS.map((r) => ({
      description: r.basis ? `Cloud & Software Subscription (${r.basis})` : 'Software cost',
      count: r.qty > 0 ? r.qty : '',
      unit: 'Subscription',
      cost: Math.round((r.qty > 0 ? r.qty : 1) * calcRowPrice(r.unitCost, r.marginPct ?? 40)),
    })),
    ...INITIAL_CPM_ON_PREMISE_ROWS.map((r) => ({
      description: r.commercialLayer || 'Application Cost',
      count: r.qty > 0 ? r.qty : '',
      unit: 'Platform',
      cost: Math.round((r.qty > 0 ? r.qty : 1) * calcRowPrice(r.unitCost, r.marginPct ?? 40)),
    })),
  ];

  const displayCommercialItems = commercialItems.length > 0 ? commercialItems : fallbackCommercialItems;
  const calculatedCommercialTotal = displayCommercialItems.reduce((sum, item) => sum + item.cost, 0);
  const displayFinalTotal = finalPrice && finalPrice > 0 ? finalPrice : calculatedCommercialTotal;

  return (
    <>
      {/* ── PAGE 1: COVER PAGE & ABOUT SUSTAINABYTE ── */}
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
                  Central Plant Monitoring (CPM) System
                </h1>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono font-medium">
                  <span>Ref: <strong className="text-slate-800">{proposalRef}</strong></span>
                  <span>•</span>
                  <span>Date: <strong className="text-slate-800">{proposalDate}</strong></span>
                </div>
              </div>
              <div className="flex items-center justify-end shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Logo" className="h-16 sm:h-20 w-auto object-contain" />
              </div>
            </div>

            {/* Proposal Prepared For */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Proposal Prepared For:</p>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{deal?.clientName || 'Valued Client'}</h2>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Service Scope: <span className="font-bold text-slate-800">Chiller Management / CPM (Central Plant Monitoring)</span>
                </p>
              </div>
              {(proposal as any)?.clientLogo && (
                <div className="h-14 w-32 bg-white p-1 flex items-center justify-center shrink-0 border border-slate-100 rounded-lg shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={(proposal as any).clientLogo} alt="Client Logo" className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>

            {/* About Sustainabyte */}
            <div className="space-y-2.5 pt-1">
              <h3 className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight text-base">
                About Sustainabyte:
              </h3>
              <div className="space-y-2.5 text-slate-800 font-normal text-left text-[11px] leading-relaxed">
                <p>
                  Sustainabyte is a private limited company, based out in Chennai, with client base spreading across 3 countries. It is a climate-tech start-up, predominantly focusing on energy conservation methodologies across Industries, Commercial building and residential complexes. Sustainabyte.ai is dedicated to leveraging advanced technology for global sustainability.
                </p>
                <p>
                  Our mission is to minimize environmental impact while enhancing operational efficiency through innovative solutions. Sustainabyte is a technology-driven sustainability company, providing cutting-edge solutions for enterprises, to identify, plan and operationalize their Net Zero Carbon ambitions. Our mission is to deliver sustainable prosperity for companies, by balancing people, planet and profit. We demonstrate this by leveraging proprietary machine-learning algorithms, which provide measurable outcomes.
                </p>
                <p>
                  Our goal is to collaborate with companies and help them to work smarter, make critical decisions more quickly and consume less. In addition, by doing this at scale, we will make a significant impact on the carbon footprint of commercial and industrial assets, globally. At Sustainabyte, we understand how important it is to be productive and sustainable. As a first step, we provide expert advisory to create a blueprint for sustainability roadmap and Net Zero Carbon Goals.
                </p>
                <p>
                  We implement our flagship IoT solution — OptiByte — our technology platform, as an overlay on the client’s existing systems, connecting data points to provide a bird’s eye view, which, really is making the invisible, visible. Our reporting module then presents the ESG scores, operational efficiency KPI has and compares it against the milestones. This drives a program of continuous improvement by identifying improvement opportunities and recommended changes to deliver empirical and tangible sustainability goals. We pride in delivering results as early as in 30-60 days.
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

      {/* ── PAGE 2: CPM SYSTEM ARCHITECTURE DIAGRAM ── */}
      <PageShell pageNum={2} subtitle="Annexure – II: Central Plant Monitoring (CPM) System Architecture">
        <div className="space-y-3 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2">
              Central Plant Monitoring (CPM) System Architecture:
            </h3>

            {/* Architecture Diagram */}
            <div className="w-full rounded-xl border border-slate-300 overflow-hidden bg-white p-2 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cpm-architecture.png"
                alt="Central Plant Monitoring (CPM) System Architecture"
                className="w-full h-auto max-h-[500px] object-contain rounded-lg mx-auto"
              />
            </div>

            {/* Key Architecture Notes */}
            <div className="mt-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-[9.5px] text-slate-800">
              <p className="font-bold text-slate-950 text-[10px]">Key System Architecture Specifications:</p>
              <p className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold shrink-0">•</span>
                <span><strong>Field Equipment Integration:</strong> All field devices (water cooled chillers, primary/secondary pumps, condenser water pumps, cooling tower fans, makeup pump) connect to the DDC Panel using hardwired I/O.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold shrink-0">•</span>
                <span><strong>Energy Meters (Soft Integration):</strong> Energy meters connected directly to DDC Panel via Modbus RTU (RS485) network for power monitoring and telemetry.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold shrink-0">•</span>
                <span><strong>DDC Panel &amp; Local Server:</strong> DDC Panel publishes data to Local Server / Workstation (MQTT Broker) over the local LAN switch for local visualization (Web HMI).</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold shrink-0">•</span>
                <span><strong>Cloud Uplink:</strong> Local server securely forwards telemetry to the Sustainabyte Cloud Platform through HTTPS (REST API) for real-time dashboarding and AI-driven chiller optimization.</span>
              </p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 3: ANNEXURE I — COMMERCIAL INVESTMENT (DYNAMIC CURRENT CPM COST) ── */}
      <PageShell pageNum={3} subtitle="Annexure – I: Commercial Investment & Bill of Quantities">
        <div className="space-y-3 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2">
              Annexure – I: Commercial Investment (Current CPM Cost)
            </h3>

            {/* Commercials Table matching user image */}
            <div className="border border-slate-900 rounded-md overflow-hidden text-xs shadow-xs mb-3">
              <table className="w-full text-left border-collapse">
                <thead>
                  {/* Plant 1 Top Header Row */}
                  <tr className="border-b border-slate-900 bg-slate-100 text-slate-900 font-black text-center text-xs">
                    <th colSpan={4} className="py-1 px-3 uppercase tracking-wider text-center font-black text-xs">
                      {deal?.projectName || deal?.clientName || 'Plant 1'}
                    </th>
                  </tr>
                  {/* Column Headers */}
                  <tr className="border-b border-slate-900 bg-white font-extrabold text-[11px] text-slate-900">
                    <th className="py-1.5 px-3 border-r border-slate-900 text-left font-extrabold">Description</th>
                    <th className="py-1.5 px-2 border-r border-slate-900 text-center w-16 font-extrabold">Count</th>
                    <th className="py-1.5 px-2 border-r border-slate-900 text-center w-16 font-extrabold">Unit</th>
                    <th className="py-1.5 px-3 text-right w-28 font-extrabold">Cost</th>
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
                  {/* Total Row */}
                  <tr className="border-t-2 border-slate-900 font-black bg-slate-100 text-xs">
                    <td colSpan={3} className="py-1.5 px-4 text-center uppercase tracking-wider font-black border-r border-slate-900">
                      Total
                    </td>
                    <td className="py-1.5 px-3 text-right font-black font-mono text-slate-950 text-xs">
                      {formatCurrency(displayFinalTotal).replace('₹', '').trim()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Technical & Commercial Notes */}
          <div className="space-y-1.5 pt-1 border-t border-slate-200">
            <h4 className="font-bold text-slate-950 text-xs underline underline-offset-4">
              Notes &amp; Assumptions:
            </h4>
            <div className="space-y-1 pl-2 text-slate-800 text-[10px] leading-relaxed">
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Cabling quantity is considered as per BOQ/Thumb-rule Basis. Any increase/decrease in the quantity shall be billed against the consumed quantity after complete execution of project.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Controller quantity is calculated as per the provided IO summary/equipment quantity, any changes in the same will have price impact.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Mod-bus card for the VFD/ chiller in client&apos;s scope.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Installation and services of Sensors, Valves, BTU meters, Flow meters, VFD etc. is not in our scope.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Any Civil work and electrical works not in our scope.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Water, Power &amp; Scaffolding to be provided at FOC at site, unless otherwise agreed mutually.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Any change in the quantity will have price impact on the quoted price.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Adapter box &amp; Network Switch is not in our scope of supply/installation.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Field devices are considered as per the standard design/as per BOQ. Any changes in quantity will have price impact.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Drawings need to be shared for optimization of the project.</span>
              </p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: ANNEXURE III — TERMS & CONDITIONS & COMMERCIAL CONDITIONS ── */}
      <PageShell pageNum={4} subtitle="Annexure – III: Terms, Commercial Conditions & Basis of Offer">
        <div className="space-y-4 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-3">
              Terms &amp; Conditions:
            </h3>
            <div className="space-y-2.5 text-slate-800 text-[11px] leading-relaxed">
              <p>1) Offer Validity: One Month (30 Days)</p>
              <div>
                <p>2) Payment Terms:</p>
                <div className="pl-6 space-y-1 text-slate-700">
                  <p>• 50% advance against Pro-Forma Invoice</p>
                  <p>• 40% against Supply within 15 days</p>
                  <p>• 10% after completion of the project</p>
                </div>
              </div>
              <p>3) Taxes: As per GST @ 18% (Material Packing &amp; Forwarding / Transport: Inclusive).</p>
              <p>4) Delivery: 10 to 12 Weeks from the approved date of PO and Design Document by Customer as per site requirement.</p>
              <p>5) Warranty for Supply: 1 year from the date of Delivery of the material at site.</p>
              <p>6) If any Power fluctuations / variations for input voltage to Field devices / controllers, device failure is in customer scope.</p>
              <p>7) For any environmental effects, damages of devices / controller failure customer is responsible.</p>
              <p>8) 5 to 6 weeks after receiving the materials at site Installation &amp; Commissioning will be completed.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-950 text-xs underline underline-offset-4">
              Limitation to Liability:
            </h4>
            <p className="text-slate-700 text-[10.5px] leading-relaxed">
              The maximum liability of the Seller for any and all claims, losses, damages, costs and expenses arising from or in connection with this Agreement shall not exceed the amounts actually received by the Seller under this Agreement.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 5: CONTRACTUAL ARTICLES 1 TO 10 ── */}
      <PageShell pageNum={5} subtitle="Contractual Articles — Scope, Approvals & Financial Terms">
        <div className="space-y-2 text-slate-900 text-left font-normal text-[9.5px] leading-relaxed">
          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 1: Scope of Work</h3>
            <p className="text-slate-700">Restricted to the supply, packing, forwarding, transportation, erection, testing, and commissioning of equipment as per agreed BOQ, drawings, and technical specifications. Buyer shall ensure civil foundations are ready on time. Seller does not consider civil works in scope.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 2: Priority of Documents</h3>
            <p className="text-slate-700">Sequence: a) Contract Agreement, b) Letter of Award, c) Minutes of Meeting, d) Seller’s Offer, e) General Conditions of Contract, f) Schedules &amp; Annexures, g) Technical Specifications.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 3: Drawings / Dimension Sheets</h3>
            <p className="text-slate-700">Drawings submitted for Buyer approval shall be approved within 5 days. Basic Single Line Diagram (SLD) and layout submitted within 10 days of Contract coming into force.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 4: Coming into Force</h3>
            <p className="text-slate-700">Contract comes into force when signed, agreed 50% advance received, full site access granted, kick-off meeting held, and drawings approved. Notice to Proceed (NTP) issued by Buyer marks Work Starting Date.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 5: Offer Validity &amp; Article 6: Contract Price</h3>
            <p className="text-slate-700">Offer valid for 30 days. Price inclusive of freight up to site, exclusive of taxes and duties. Payments in INR.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 7: Transfer of Risk &amp; Title</h3>
            <p className="text-slate-700">Ownership and title retained by Seller until entire purchase price is fully paid. Risk passes as per Incoterms.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 8: Taxes, Duties &amp; Statutory Variations</h3>
            <p className="text-slate-700">Taxes as per GST. Any statutory variation, new levies, or reclassifications shall be to Buyer&apos;s account.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 9: Terms of Payment</h3>
            <p className="text-slate-700">Payments released within 7 days of invoice. Measurements certified within 5 days. Overdue payments accrue interest @ 18% p.a.</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-950 text-xs">Article 10: Variation / Change Management</h3>
            <p className="text-slate-700">Request for Change (RFC) evaluated within 7 calendar days. Changes up to ±10% at agreed rates; changes exceeding 10% subject to revised prices. Additional scope executed on Cost Plus 25% profit margin.</p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 6: CONTRACTUAL ARTICLES 11 TO 20 ── */}
      <PageShell pageNum={6} subtitle="Contractual Articles — Testing, Warranty, Liability & IP">
        <div className="space-y-2 text-slate-900 text-left font-normal text-[9.5px] leading-relaxed">
          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 11: Testing Charges &amp; Inspection</h3>
            <p className="text-slate-700">Routine/acceptance tests conducted as per IS standards. Buyer factory inspection costs borne by Buyer. Dispatch authorization issued within 2 days of test clearance.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 12: Goods Receipts and Storage</h3>
            <p className="text-slate-700">Goods Receipt issued within 48 hours of delivery. Storage due to Buyer delay charged at 0.5% per week plus demurrage.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 13: Completion Period</h3>
            <p className="text-slate-700">Delivery timeline extended for payment delays, scope changes, hindrances, or Force Majeure without penalty to Seller.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 15: Overall Limitation to Liability</h3>
            <p className="text-slate-700">Neither party liable for indirect, incidental, special or consequential damages. Maximum total liability of Seller shall not exceed amounts actually received under this Agreement.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 16: Warranty (Products &amp; Services)</h3>
            <p className="text-slate-700"><strong>Products:</strong> 1 Year from handover. Repair/replacement of faulty parts due to design/manufacturing defects. Misuse/voltage spikes excluded.<br /><strong>Services:</strong> 30-day notification for remedial service at no additional cost.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 17: Buyer’s Obligations</h3>
            <p className="text-slate-700">Buyer provides electricity, water, gas, site office, storage sheds, and site security free of cost throughout execution.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 18: Assignment &amp; Sub-Contract</h3>
            <p className="text-slate-700">Seller permitted to engage specialized subcontractors without absolving overall obligations.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 19: Intellectual Property &amp; Software License</h3>
            <p className="text-slate-700">Single, non-exclusive, non-transferable software license for the specified site. All IPR and algorithms remain exclusive property of Sustainabyte.</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-950 text-xs">Article 20: IP Indemnification &amp; Liquidated Damages</h3>
            <p className="text-slate-700">Seller indemnifies Buyer against valid patent claims. Liquidated damages for solely Seller-caused delays capped at 0.25% per week up to maximum 2.5% of unexecuted contract value as sole and exclusive remedy.</p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 7: CONTRACTUAL ARTICLES 21 TO 31 ── */}
      <PageShell pageNum={7} subtitle="Contractual Articles — Termination, Acceptance, Insurance & Legal">
        <div className="space-y-2 text-slate-900 text-left font-normal text-[9.5px] leading-relaxed">
          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 21: Communication &amp; Article 22: Suspension</h3>
            <p className="text-slate-700">Written notice via email/letter valid. Buyer/Seller suspension terms defined. Idle resource costs during suspension payable by Buyer.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 23: Termination / Cancellation</h3>
            <p className="text-slate-700">30 days written notice for insolvency, persistent non-performance, or payment withholding. In event of Buyer cancellation, Seller entitled to full payment for work done plus 10% termination fee.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 24: Force Majeure</h3>
            <p className="text-slate-700">Events beyond reasonable control (natural disasters, war, government orders) extend performance timelines without breach.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 25: Applicable Law &amp; Dispute Resolution</h3>
            <p className="text-slate-700">Governed by laws of India. Disputes resolved by 3-arbitrator panel under Arbitration and Conciliation Act 1996 in New Delhi in English.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 26: Provisional Acceptance (PAC) &amp; Article 27: Final Acceptance (FAC)</h3>
            <p className="text-slate-700">PAC issued upon equipment installation/testing; punch-lists rectified post-PAC. FAC issued after material reconciliation and handover. Commercial use constitutes deemed acceptance.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 28: General Indemnification &amp; Article 29: Insurance</h3>
            <p className="text-slate-700">Mutual indemnity for bodily injury and physical damage caused by gross negligence. Seller maintains Transit &amp; EAR Policy; Buyer maintains premises insurance.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 30: Confidentiality / Do Not Disclose (DND)</h3>
            <p className="text-slate-700">Standard strict non-disclosure obligations for proprietary software, pricing, algorithms, and technical documentation.</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-950 text-xs">Article 31: Miscellaneous</h3>
            <p className="text-slate-700">No set-off rights. Overrun charges: INR 10,000 per man-day/month for client-caused commissioning delays. Water &amp; electricity provided free by Purchaser.</p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 8: TEAM EXPERTISE, CLIENT TRACK RECORD & AUTHORIZATION ── */}
      <PageShell pageNum={8} subtitle="Team Expertise, Client Track Record & Authorization">
        <div className="space-y-3 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          {/* Client Track Record */}
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-xs mb-1.5">
              Team Expertise &amp; Enterprise Clients (42 References):
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-1.5 text-[9.5px] py-1">
              {allClients.map((client, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-800">
                  <span className="font-bold text-slate-900 w-5 shrink-0 text-right text-[10px]">{idx + 1}.</span>
                  <span className="truncate font-medium text-slate-900" title={client}>{client}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted By & Bank Details */}
          <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-slate-200 text-xs">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-xs">Submitted by,</h4>
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Logo" className="h-7 w-auto object-contain" />
              </div>
              <div className="space-y-0.5 text-slate-900">
                <p className="font-black text-slate-950 text-xs">Thanakarthik</p>
                <p className="font-semibold text-slate-700 text-[11px]">Founder &amp; CEO</p>
                <p className="font-mono text-slate-800 text-[11px]">+91-8377007638</p>
                <p className="text-slate-600 font-mono text-[10.5px]">thanakarthik@sustainabyte.ai</p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-xs underline underline-offset-4">Bank Account details:</h4>
              <div className="space-y-0.5 text-[10px] text-slate-800 font-mono">
                <p><strong className="text-slate-900">Name:</strong> SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED</p>
                <p><strong className="text-slate-900">Bank:</strong> Bank of Baroda</p>
                <p><strong className="text-slate-900">Account number:</strong> 35860200000750</p>
                <p><strong className="text-slate-900">IFSC:</strong> BARB0VELACH (fifth letter is ZERO)</p>
                <p><strong className="text-slate-900">Branch:</strong> VELACHERY BRANCH</p>
              </div>
            </div>
          </div>

          {/* THANK YOU */}
          <div className="pt-2 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-slate-900">THANK YOU</p>
          </div>
        </div>
      </PageShell>
    </>
  );
}

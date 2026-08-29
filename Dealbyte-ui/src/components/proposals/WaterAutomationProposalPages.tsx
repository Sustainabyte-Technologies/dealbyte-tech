'use client';

import React from 'react';
import {
  Droplets,
  Activity,
  CheckCircle2,
  Gauge,
  Zap,
  ShieldCheck,
  Building2,
  Radio,
  Cpu,
  Wrench,
  FileCheck,
  AlertTriangle,
  Clock,
  Settings,
  Layers,
  Sparkles,
} from 'lucide-react';

interface WaterAutomationProposalPagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
  costingSheet?: any;
}

export function WaterAutomationProposalPages({
  deal,
  proposal,
  proposalRef,
  proposalDate,
  finalPrice,
  formatCurrency,
  costingSheet: propCostingSheet,
}: WaterAutomationProposalPagesProps) {
  const totalPages = 4;

  const clientName =
    deal?.clientName ||
    (proposal as any)?.clientName ||
    proposal?.quote?.deal?.clientName ||
    'Valued Client';

  const costingSheet =
    propCostingSheet ||
    (proposal as any)?.costingSheet ||
    (proposal as any)?.costing_sheet ||
    (proposal as any)?.costingData ||
    (proposal as any)?.costing_data ||
    (proposal as any)?.quote?.costingSheet ||
    (deal as any)?.costingSheet ||
    (deal as any)?.quote?.costingSheet ||
    {};

  // Extract Hardware and Scope line items from Costing Sheet
  const rawGatewayRows: any[] =
    costingSheet.emsGatewayHardwareRows ||
    costingSheet.instrumentRows?.emsGatewayHardwareRows ||
    [];
  const activeGatewayRows = rawGatewayRows.filter((r) => Number(r.qty || 0) > 0);

  const rawElecRows: any[] =
    costingSheet.emsElectricalHardwareRows ||
    costingSheet.instrumentRows?.emsElectricalHardwareRows ||
    [];
  const activeElecRows = rawElecRows.filter((r) => Number(r.qty || 0) > 0);

  const rawPlatformRows: any[] =
    costingSheet.emsPlatformRows ||
    costingSheet.instrumentRows?.emsPlatformRows ||
    [];
  const activePlatformRows = rawPlatformRows.filter((r) => Number(r.qty || 0) > 0);

  const rawRecurringRows: any[] =
    costingSheet.emsRecurringRows ||
    costingSheet.instrumentRows?.emsRecurringRows ||
    [];
  const activeRecurringRows = rawRecurringRows.filter((r) => Number(r.qty || 0) > 0);

  const rawAutoManpowerRows: any[] =
    costingSheet.caaAutoManpowerRows ||
    costingSheet.instrumentRows?.caaAutoManpowerRows ||
    [];
  const activeAutoManpowerRows = rawAutoManpowerRows.filter((r) => Number(r.days || r.qty || 0) > 0);

  const rawInstManpowerRows: any[] =
    costingSheet.caaInstManpowerRows ||
    costingSheet.instrumentRows?.caaInstManpowerRows ||
    [];
  const activeInstManpowerRows = rawInstManpowerRows.filter((r) => Number(r.days || r.qty || 0) > 0);

  // Helper calculations for dynamic commercial summary matching Costing Sheet Step 5
  const calcPrice = (cost: number, margin: number = 40) => {
    const m = Math.min(99.9, Math.max(0, margin));
    return m >= 100 ? cost : cost / ((100 - m) / 100);
  };
  const roundToNearest = (val: number, nearest: number = 100) => {
    const step = Number(nearest) || 1;
    return Math.ceil(val / step) * step;
  };

  const bufferPct = costingSheet.bufferPct !== undefined ? Number(costingSheet.bufferPct) : 10;
  const roundingNearest = costingSheet.roundingNearest !== undefined ? Number(costingSheet.roundingNearest) : 100;

  // 1. Gateway Hardware (1a)
  const item1a = activeGatewayRows[0] || rawGatewayRows[0];
  const item1Price = item1a ? (item1a.qty || 1) * calcPrice(item1a.unitCost || 0, item1a.marginPct ?? 40) : (costingSheet.emsTotalStep1CustomerPrice || 0);
  const item1Contingency = Math.round(item1Price / Math.max(0.01, (100 - bufferPct) / 100));
  const item1Rounded = roundToNearest(item1Contingency, roundingNearest);

  // 2. Meters & Additional Hardware (1b, 1c...)
  const item1bRows = activeGatewayRows.length > 1 ? activeGatewayRows.slice(1) : rawGatewayRows.slice(1);
  const item2Price = item1bRows.length > 0
    ? item1bRows.reduce((sum, r) => sum + (r.qty || 0) * calcPrice(r.unitCost || 0, r.marginPct ?? 40), 0)
    : 0;
  const item2Contingency = Math.round(item2Price / Math.max(0.01, (100 - bufferPct) / 100));
  const item2Rounded = roundToNearest(item2Contingency, roundingNearest);
  const item2Description = item1bRows.length > 0
    ? item1bRows.map((r) => r.description).join('; ')
    : 'Hydrostatic Level Sensors, Actuator Valves & Gateway Modules';
  const item2Qty = item1bRows.reduce((sum, r) => sum + Number(r.qty || 0), 0) || 8;
  const item2Uom = item1bRows[0]?.uom || 'Nos';

  // 3. Electrical Accessories Total (2a, 2b, 2c...)
  const item3Rows = activeElecRows.length > 0 ? activeElecRows : rawElecRows;
  const item3Price = item3Rows.length > 0
    ? item3Rows.reduce((sum, r) => sum + (r.qty || 0) * calcPrice(r.unitCost || 0, r.marginPct ?? 40), 0)
    : (costingSheet.emsElectricalHardwareTotalPrice || 0);
  const item3Contingency = Math.round(item3Price / Math.max(0.01, (100 - bufferPct) / 100));
  const item3Rounded = roundToNearest(item3Contingency, roundingNearest);
  const item3Description = item3Rows.length > 0
    ? item3Rows.map((r) => r.description).join('; ')
    : 'Supply of electrical consumables such as flexible hose, cable ties and all other accessories';
  const item3Qty = item3Rows.length > 0 ? item3Rows.reduce((sum, r) => sum + Number(r.qty || 0), 0) : 1;
  const item3Uom = item3Rows[0]?.uom || 'Job';

  // 4. Man Days / Automation Mandays
  const autoPrice = costingSheet.airAutoManpowerTotalPrice !== undefined ? costingSheet.airAutoManpowerTotalPrice : (costingSheet.emsTotalStep2CustomerPrice || costingSheet.instrumentRows?.caaAutoCustomerPrice || 0);
  const autoContingency = Math.round(autoPrice / Math.max(0.01, (100 - bufferPct) / 100));
  const autoRounded = roundToNearest(autoContingency, roundingNearest);

  // 5. Man Days / Installation Mandays
  const instPrice = costingSheet.airInstManpowerTotalPrice !== undefined ? costingSheet.airInstManpowerTotalPrice : (costingSheet.emsTotalStep3CustomerPrice || costingSheet.instrumentRows?.caaInstCustomerPrice || 0);
  const instContingency = Math.round(instPrice / Math.max(0.01, (100 - bufferPct) / 100));
  const instRounded = roundToNearest(instContingency, roundingNearest);

  // 6. Platform Setup
  const platformPrice = costingSheet.emsPlatformTotalPrice || costingSheet.emsTotalStep4CustomerPrice || 0;
  const platformContingency = Math.round(platformPrice / Math.max(0.01, (100 - bufferPct) / 100));
  const platformRounded = roundToNearest(platformContingency, roundingNearest);
  const platformDescription = activePlatformRows.length > 0
    ? activePlatformRows.map((r) => r.description).join('. ')
    : 'OptiByte Aqua Dashboard Configuration, Edge Gateway Setup & Cloud SCADA Provisioning';
  const platformQty = activePlatformRows[0]?.qty || 1;
  const platformUom = activePlatformRows[0]?.uom || 'Job';

  // 7. Recurring Cloud Charges
  const recurringPrice = costingSheet.emsRecurringYearlyTotalPrice || costingSheet.emsTotalStep5CustomerPrice || 0;
  const recurringContingency = Math.round(recurringPrice / Math.max(0.01, (100 - bufferPct) / 100));
  const recurringRounded = roundToNearest(recurringContingency, roundingNearest);
  const recurringDescription = activeRecurringRows.length > 0
    ? activeRecurringRows.map((r) => r.description).join('. ')
    : '24/7 Cloud Hosting, SMS/WhatsApp Anomaly Alerts, Water Tank Level Telemetry & SLA Support';
  const recurringQty = activeRecurringRows[1]?.qty || activeRecurringRows[0]?.qty || 1;
  const recurringUom = activeRecurringRows[1]?.uom || activeRecurringRows[0]?.uom || 'Year';

  const commercialSummaryItems = [
    {
      sNo: 1,
      description: item1a?.description || 'Hydrostatic Level Sensors & IoT Gateway Controller Modules',
      qty: item1a?.qty || 8,
      uom: item1a?.uom || 'Buildings',
      customerPrice: item1Rounded || costingSheet.emsTotalStep1CustomerPrice || 0,
      isRecurring: false,
    },
    ...(item1bRows.length > 0 ? [{
      sNo: 2,
      description: item2Description,
      qty: item2Qty,
      uom: item2Uom,
      customerPrice: item2Rounded || 0,
      isRecurring: false,
    }] : []),
    ...(item3Rows.length > 0 ? [{
      sNo: item1bRows.length > 0 ? 3 : 2,
      description: item3Description,
      qty: item3Qty,
      uom: item3Uom,
      customerPrice: item3Rounded || 0,
      isRecurring: false,
    }] : []),
    {
      sNo: (item1bRows.length > 0 ? 3 : 2) + (item3Rows.length > 0 ? 1 : 0),
      description: 'Automation & Interlocking: Pump Controller Integration & Auxiliary Panel Interfacing',
      qty: 1,
      uom: 'Job',
      customerPrice: autoRounded || costingSheet.emsTotalStep2CustomerPrice || 0,
      isRecurring: false,
    },
    {
      sNo: (item1bRows.length > 0 ? 3 : 2) + (item3Rows.length > 0 ? 1 : 0) + 1,
      description: 'Installation & Commissioning: Field Retrofit, Sensor Mounting, Wiring & Startup Testing',
      qty: 1,
      uom: 'Job',
      customerPrice: instRounded || costingSheet.emsTotalStep3CustomerPrice || 0,
      isRecurring: false,
    },
    {
      sNo: (item1bRows.length > 0 ? 3 : 2) + (item3Rows.length > 0 ? 1 : 0) + 2,
      description: platformDescription,
      qty: platformQty,
      uom: platformUom,
      customerPrice: platformRounded || costingSheet.emsTotalStep4CustomerPrice || 0,
      isRecurring: false,
    },
    {
      sNo: (item1bRows.length > 0 ? 3 : 2) + (item3Rows.length > 0 ? 1 : 0) + 3,
      description: recurringDescription,
      qty: recurringQty,
      uom: recurringUom,
      customerPrice: recurringRounded || costingSheet.emsTotalStep5CustomerPrice || 0,
      isRecurring: true,
    },
  ].map((item, idx) => ({ ...item, sNo: idx + 1 }));

  const computedTotalCustomerPrice = commercialSummaryItems.reduce((sum, r) => sum + Number(r.customerPrice || 0), 0);

  const displayFinalPrice = finalPrice || computedTotalCustomerPrice || Number(costingSheet.finalQuote || 0);

  const PageHeader = ({ subtitle = 'Technical Proposal & Implementation Scope' }: { subtitle?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2.5 gap-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
        <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
          {clientName} — Water Automation
        </h2>
        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
          <span>Ref: <strong>{proposalRef}</strong></span>
        </div>
      </div>
      <div className="flex items-center justify-end shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Logo" className="h-12 sm:h-14 w-auto object-contain" />
      </div>
    </div>
  );

  const PageFooter = ({ pageNum }: { pageNum: number }) => (
    <div className="relative z-10 border-t border-slate-200 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
      <span>Ref: {proposalRef}</span>
      <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page {pageNum} of {totalPages}</span>
    </div>
  );

  const PageShell = ({ pageNum, subtitle, children }: { pageNum: number; subtitle?: string; children: React.ReactNode }) => (
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
        <div className="relative z-10 flex flex-col flex-1 justify-between">
          <PageHeader subtitle={subtitle} />
          <div className="flex-1 my-3 overflow-hidden flex flex-col justify-start gap-2.5">
            {children}
          </div>
          <PageFooter pageNum={pageNum} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* ========================================================================= */}
      {/* PAGE 1: Scope of Work & Solution Architecture */}
      {/* ========================================================================= */}
      <PageShell pageNum={1} subtitle="Executive Summary & Scope of Work">
        <div className="bg-gradient-to-r from-cyan-900 via-blue-950 to-slate-900 text-white rounded-xl p-3 shadow-sm border border-cyan-800/40">
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300">
              Scope of Work: Fully Automated Water Supply System (8 Buildings)
            </h3>
          </div>
          <p className="text-[10.5px] leading-relaxed text-slate-200">
            This technical scope outlines the turnkey design, supply, installation, and commissioning of a <strong>Fully Automated Water Supply &amp; Level Automation System</strong> across <strong>8 Buildings</strong> at <strong>{clientName}</strong>. The solution utilizes hydrostatic level sensors, motorized actuator valves, and smart pump automation controllers for intelligent 24/7 autonomous water distribution.
          </p>
        </div>

        {/* System Architecture Diagram */}
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="text-[11px] font-black text-blue-950 uppercase tracking-wide flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-blue-600" /> End-to-End Water IoT &amp; Automation Architecture
            </span>
            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              OptiByte Aqua Engine
            </span>
          </div>
          <div className="w-full h-44 bg-white rounded-lg border border-slate-200/90 overflow-hidden flex items-center justify-center p-1 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/iot-solution-architecture.png"
              alt="Water Automation Architecture"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Detailed Scope of Deliverables */}
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="h-3.5 w-3.5 text-cyan-700" />
              <h4 className="text-[11px] font-extrabold text-slate-900 uppercase">
                Core Automation Deliverables (8 Buildings)
              </h4>
            </div>
            <span className="text-[9px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
              Turnkey Execution
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[9.5px] leading-tight text-slate-700">
            <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200 space-y-1">
              <p className="font-bold text-blue-950 uppercase text-[9.5px]">Sensor &amp; Actuator Infrastructure</p>
              <ul className="list-disc pl-3 space-y-0.5">
                <li>Install &amp; commission level-based water automation for overhead tanks (OHT) in <strong>8 buildings</strong>.</li>
                <li>Provide industrial level sensors and actuator-controlled valves for inlet and outlet lines integrated with pump controllers.</li>
                <li>Retrofit sensors into existing overhead and underground tanks (UGT) without major civil modification.</li>
              </ul>
            </div>
            <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200 space-y-1">
              <p className="font-bold text-emerald-950 uppercase text-[9.5px]">Pump Interlocking &amp; Isolation</p>
              <ul className="list-disc pl-3 space-y-0.5">
                <li>Automate pump start/stop based on precise tank levels to prevent <strong>dry-run, overflow, and manual intervention</strong>.</li>
                <li>Interface with existing pump starter panels (DOL / Star-Delta / VFD) using auxiliary contacts for start/stop.</li>
                <li>Provide separate isolation for each tank so other tanks continue to operate during maintenance.</li>
              </ul>
            </div>
          </div>

          {/* Centralized Monitoring */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-2 rounded-lg text-[9.5px] text-blue-950">
            <p className="font-black uppercase flex items-center gap-1.5 mb-0.5">
              <Radio className="h-3.5 w-3.5 text-blue-700" /> Centralized Cloud &amp; Local HMI/SCADA Dashboard
            </p>
            <p className="leading-tight text-slate-700">
              Provide centralized 24/7 monitoring (local HMI/SCADA and cloud dashboard) displaying real-time water levels across all 8 buildings, pump run/trip status, flow volume, and automatic anomaly alerting.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ========================================================================= */}
      {/* PAGE 2: Key Benefits & Building Automation Matrix */}
      {/* ========================================================================= */}
      <PageShell pageNum={2} subtitle="Key Benefits & Technical Advantages">
        {/* 4 Core Value Propositions */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h4 className="text-[11px] font-extrabold text-slate-900 uppercase">
                Key Strategic Benefits
              </h4>
            </div>
            <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
              High ROI &amp; Reliability
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">1</span>
                <h5 className="font-bold text-[10.5px] text-blue-950">Zero Manual Supervision</h5>
              </div>
              <p className="text-[9.5px] text-slate-600 leading-tight">
                Completely eliminates manual supervision and physical inspection of water levels, valve operations, and pump scheduling.
              </p>
            </div>

            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">2</span>
                <h5 className="font-bold text-[10.5px] text-emerald-950">Zero Water &amp; Energy Wastage</h5>
              </div>
              <p className="text-[9.5px] text-slate-600 leading-tight">
                Eliminates tank overflow water wastage and prevents energy wastage caused by dry-running, uncoordinated pumping, or excess run hours.
              </p>
            </div>

            <div className="p-2.5 bg-purple-50/70 border border-purple-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-purple-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">3</span>
                <h5 className="font-bold text-[10.5px] text-purple-950">Extended Pump &amp; Motor Life</h5>
              </div>
              <p className="text-[9.5px] text-slate-600 leading-tight">
                Protects heavy pumping assets against short-cycling, cavitations, thermal overload, and dry-run damage, dramatically extending overhaul cycles.
              </p>
            </div>

            <div className="p-2.5 bg-cyan-50/70 border border-cyan-200/80 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-cyan-600 text-white font-black text-[10px] flex items-center justify-center shrink-0">4</span>
                <h5 className="font-bold text-[10.5px] text-cyan-950">Centralized Rapid Response</h5>
              </div>
              <p className="text-[9.5px] text-slate-600 leading-tight">
                Instant SMS/Cloud threshold alerts and centralized visibility enable proactive maintenance, minimizing plant water outage downtime.
              </p>
            </div>
          </div>
        </div>

        {/* 8 Buildings Automation Deployment Matrix */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-600" />
              <h4 className="text-[11px] font-extrabold text-slate-900 uppercase">
                8 Buildings Level &amp; Actuation Matrix
              </h4>
            </div>
            <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Multi-Node Edge Network
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-[9px]">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((bNum) => (
              <div key={bNum} className="p-2 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <p className="font-black text-[9.5px] text-slate-900">Building #{bNum}</p>
                <div className="space-y-0.5 text-slate-600 text-[8px]">
                  <p className="text-blue-700 font-semibold">• OHT Level Sensor</p>
                  <p className="text-cyan-700 font-semibold">• Actuator Valve</p>
                  <p className="text-emerald-700 font-semibold">• Pump Interlock</p>
                  <p className="text-purple-700 font-semibold">• Local Isolation</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[9px] pt-1">
            <div className="p-1.5 bg-blue-50/60 rounded border border-blue-200 text-blue-950 font-bold">
              Hydrostatic Level Precision: ±0.25% FS
            </div>
            <div className="p-1.5 bg-cyan-50/60 rounded border border-cyan-200 text-cyan-950 font-bold">
              Motorized Actuator Run: 15–30s Modulating
            </div>
            <div className="p-1.5 bg-emerald-50/60 rounded border border-emerald-200 text-emerald-950 font-bold">
              DOL / Star-Delta Auxiliary Relay Tapping
            </div>
          </div>
        </div>
      </PageShell>

      {/* ========================================================================= */}
      {/* PAGE 3: Client Scope, Terms & Responsibilities */}
      {/* ========================================================================= */}
      <PageShell pageNum={3} subtitle="Client Scope & Execution Conditions">
        <div className="space-y-3">
          {/* Client Support Scope */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 pb-1.5 mb-2 border-b border-slate-100">
              <Building2 className="h-4 w-4 text-cyan-700" />
              <h4 className="text-xs font-black text-slate-900 uppercase">
                Support Required from the Client ({clientName})
              </h4>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-slate-700 leading-tight">
              <li className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                <CheckCircle2 className="h-3 w-3 text-cyan-600 shrink-0 mt-0.5" />
                <span><strong>Technicians for Wiring:</strong> All meter changes and cable looping work to be executed by customer's qualified technicians.</span>
              </li>
              <li className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                <CheckCircle2 className="h-3 w-3 text-cyan-600 shrink-0 mt-0.5" />
                <span><strong>Dedicated SPOC:</strong> A Single Point of Contact (SPOC) from engineering for support and coordination during installation and commissioning phases.</span>
              </li>
              <li className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                <CheckCircle2 className="h-3 w-3 text-cyan-600 shrink-0 mt-0.5" />
                <span><strong>Alerts &amp; Reports Review:</strong> Designated SPOC to review daily water automation alerts, alarms, and analytical reports as per plant guidelines.</span>
              </li>
              <li className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                <CheckCircle2 className="h-3 w-3 text-cyan-600 shrink-0 mt-0.5" />
                <span><strong>Unrestricted Site Accessibility:</strong> Seamless access permits to overhead tanks, pump houses, and electrical rooms across all 8 buildings.</span>
              </li>
              <li className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200 col-span-1 md:col-span-2">
                <CheckCircle2 className="h-3 w-3 text-cyan-600 shrink-0 mt-0.5" />
                <span><strong>Integration Shutdowns:</strong> Planned maintenance shutdown windows required for new sensor tappings and energy meter integration if any.</span>
              </li>
            </ul>
          </div>

          {/* Project Exclusions & Execution Conditions */}
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3.5">
            <div className="flex items-center gap-2 pb-1.5 mb-2 border-b border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h4 className="text-xs font-black text-amber-950 uppercase">
                General Execution Terms &amp; Exclusions
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[9.5px] text-amber-900 leading-tight">
              <p className="bg-white/80 p-2 rounded border border-amber-200/60">
                • <strong>Boarding &amp; Travel:</strong> Boarding, lodging, and food expenses for on-site engineers are under client scope.
              </p>
              <p className="bg-white/80 p-2 rounded border border-amber-200/60">
                • <strong>Statutory Permits:</strong> All authority approvals, work permissions, and security site passes to be provided by client.
              </p>
              <p className="bg-white/80 p-2 rounded border border-amber-200/60">
                • <strong>Third-Party Contractors:</strong> Client is responsible for site coordination with any third-party civil or electrical contractors.
              </p>
              <p className="bg-white/80 p-2 rounded border border-amber-200/60">
                • <strong>Storage &amp; Integration:</strong> Secure on-site locked storage for instruments and all necessary soft integration credentials.
              </p>
              <p className="bg-white/80 p-2 rounded border border-amber-200/60 col-span-1 md:col-span-2">
                • <strong>Scope Boundary:</strong> Any additional materials, cabling, or hardware beyond the explicitly stated bill of materials will be charged as actuals.
              </p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ========================================================================= */}
      {/* PAGE 4: Commercial Investment, Payment Schedule & Acceptance */}
      {/* ========================================================================= */}
      <PageShell pageNum={4} subtitle="Commercial Breakdown & Payment Milestones">
        {/* Commercial Costing Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h4 className="text-xs font-black text-slate-900 uppercase">
              Commercial Summary &amp; Bill of Materials
            </h4>
            <span className="text-[10px] font-bold text-slate-500">All prices in INR (₹)</span>
          </div>

          <table className="w-full text-left text-[9.5px] border-collapse mb-2">
            <thead>
              <tr className="bg-slate-900 text-white font-bold">
                <th className="py-1.5 px-2 text-center w-8 rounded-l">S.No</th>
                <th className="py-1.5 px-2">Item Description</th>
                <th className="py-1.5 px-2 text-center w-12">Qty</th>
                <th className="py-1.5 px-2 text-center w-12">UoM</th>
                <th className="py-1.5 px-2 text-right w-28 rounded-r">Customer Price (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {commercialSummaryItems.map((item) => (
                <tr key={`wa_comm_${item.sNo}`} className="hover:bg-slate-50/50">
                  <td className="py-1 px-2 text-center font-bold text-slate-500">{item.sNo}</td>
                  <td className="py-1 px-2 font-semibold text-slate-900 leading-tight text-[9px]">{item.description}</td>
                  <td className="py-1 px-2 text-center font-bold text-slate-700">{item.qty}</td>
                  <td className="py-1 px-2 text-center text-slate-600">{item.uom}</td>
                  <td className="py-1 px-2 text-right font-bold text-slate-900">
                    ₹{formatCurrency(item.customerPrice).replace('₹', '')}{item.isRecurring ? ' /yr' : ''}
                  </td>
                </tr>
              ))}
              <tr className="bg-cyan-50/80 font-black text-cyan-950 border-t-2 border-cyan-300">
                <td colSpan={4} className="py-1.5 px-2 text-right uppercase tracking-wider text-[10px]">
                  Total Project Investment (Exclusive of GST):
                </td>
                <td className="py-1.5 px-2 text-right text-xs font-black text-cyan-900">
                  ₹{formatCurrency(computedTotalCustomerPrice || displayFinalPrice || 0).replace('₹', '')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Milestone Payment Schedule */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <h4 className="text-xs font-black text-slate-900 uppercase flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-600" /> Milestone Payment Schedule
            </h4>
            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Commercial Terms
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[9.5px]">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 space-y-0.5">
              <p className="font-bold text-blue-950">1. Hardware Supply</p>
              <p className="text-xs font-black text-blue-700">100% Upfront</p>
              <p className="text-[8.5px] text-slate-500">Against proforma invoice prior to dispatch.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 space-y-0.5">
              <p className="font-bold text-cyan-950">2. Software &amp; Platform</p>
              <p className="text-xs font-black text-cyan-700">70% Adv / 30% Final</p>
              <p className="text-[8.5px] text-slate-500">70% advance, 30% post dashboard finalization.</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 space-y-0.5">
              <p className="font-bold text-emerald-950">3. Installation &amp; I&amp;C</p>
              <p className="text-xs font-black text-emerald-700">70% Adv / 30% Final</p>
              <p className="text-[8.5px] text-slate-500">70% advance, 30% post site handover.</p>
            </div>
          </div>
        </div>

        {/* Acceptance Sign-Off */}
        <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/70 text-[9.5px]">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-bold text-slate-800 uppercase mb-2">Submitted By:</p>
              <p className="font-bold text-slate-900">Sustainabyte Technologies Pvt Ltd</p>
              <p className="text-slate-600 text-[8.5px]">Authorized Solution Engineer</p>
              <div className="border-b border-dashed border-slate-400 mt-6 mb-1 w-3/4"></div>
              <p className="text-[8px] text-slate-500">Authorized Signatory &amp; Stamp</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 uppercase mb-2">Accepted &amp; Confirmed By:</p>
              <p className="font-bold text-slate-900">{clientName}</p>
              <p className="text-slate-600 text-[8.5px]">Client Plant Management / Representative</p>
              <div className="border-b border-dashed border-slate-400 mt-6 mb-1 w-3/4"></div>
              <p className="text-[8px] text-slate-500">Signature, Name &amp; Company Stamp</p>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  );
}

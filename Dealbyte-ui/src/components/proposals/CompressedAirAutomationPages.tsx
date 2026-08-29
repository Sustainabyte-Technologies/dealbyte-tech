'use client';

import React from 'react';
import {
  Wind,
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
} from 'lucide-react';

interface CompressedAirAutomationPagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
  costingSheet?: any;
}

export function CompressedAirAutomationPages({
  deal,
  proposal,
  proposalRef,
  proposalDate,
  finalPrice,
  formatCurrency,
  costingSheet: propCostingSheet,
}: CompressedAirAutomationPagesProps) {
  const totalPages = 5;

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

  // Extract Hardware and Manpower line items from Costing Sheet
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
  const item1Price = item1a ? (item1a.qty || 3) * calcPrice(item1a.unitCost || 175000, item1a.marginPct ?? 40) : 750000;
  const item1Contingency = Math.round(item1Price / Math.max(0.01, (100 - bufferPct) / 100));
  const item1Rounded = roundToNearest(item1Contingency, roundingNearest);

  // 2. Meters & Additional Hardware (1b, 1c...)
  const item1bRows = activeGatewayRows.length > 1 ? activeGatewayRows.slice(1) : rawGatewayRows.slice(1);
  const item2Price = item1bRows.length > 0
    ? item1bRows.reduce((sum, r) => sum + (r.qty || 0) * calcPrice(r.unitCost || 0, r.marginPct ?? 40), 0)
    : 737571.44;
  const item2Contingency = Math.round(item2Price / Math.max(0.01, (100 - bufferPct) / 100));
  const item2Rounded = roundToNearest(item2Contingency, roundingNearest);
  const item2Description = item1bRows.length > 0
    ? item1bRows.map((r) => r.description).join('; ')
    : 'Gateway with Panel Board, DDC Controller, I/O Module, Relay Module & services including AI-based insights, leakage identification using ultrasonic acoustic leak detector, re-verification support and IM&V support; Supply of Energy Meter with necessary accessories and wall mounting Panel; Vibration Sensor for Compressors; Temperature & Humidity Sensor; Pressure; DP; Communication Cable (RS 485) & Power Cables';
  const item2Qty = item1bRows.length > 0 ? item1bRows.reduce((sum, r) => sum + Number(r.qty || 0), 0) : 11;
  const item2Uom = item1bRows[0]?.uom || 'Nos';

  // 3. Electrical Accessories Total (2a, 2b, 2c...)
  const item3Rows = activeElecRows.length > 0 ? activeElecRows : rawElecRows;
  const item3Price = item3Rows.length > 0
    ? item3Rows.reduce((sum, r) => sum + (r.qty || 0) * calcPrice(r.unitCost || 0, r.marginPct ?? 40), 0)
    : (costingSheet.emsElectricalHardwareTotalPrice || 1547000);
  const item3Contingency = Math.round(item3Price / Math.max(0.01, (100 - bufferPct) / 100));
  const item3Rounded = roundToNearest(item3Contingency, roundingNearest);
  const item3Description = item3Rows.length > 0
    ? item3Rows.map((r) => r.description).join('; ')
    : 'Supply of electrical consumables such as flexible hose, cable ties and all other accessories';
  const item3Qty = item3Rows.length > 0 ? item3Rows.reduce((sum, r) => sum + Number(r.qty || 0), 0) : 7;
  const item3Uom = item3Rows[0]?.uom || 'Job';

  // 4. Man Days / Automation Mandays
  const autoPrice = costingSheet.airAutoManpowerTotalPrice !== undefined ? costingSheet.airAutoManpowerTotalPrice : (costingSheet.instrumentRows?.caaAutoCustomerPrice || 216000);
  const autoContingency = Math.round(autoPrice / Math.max(0.01, (100 - bufferPct) / 100));
  const autoRounded = roundToNearest(autoContingency, roundingNearest);

  // 5. Man Days / Installation Mandays
  const instPrice = costingSheet.airInstManpowerTotalPrice !== undefined ? costingSheet.airInstManpowerTotalPrice : (costingSheet.instrumentRows?.caaInstCustomerPrice || 78929);
  const instContingency = Math.round(instPrice / Math.max(0.01, (100 - bufferPct) / 100));
  const instRounded = roundToNearest(instContingency, roundingNearest);

  // 6. Platform Setup
  const platformPrice = costingSheet.emsPlatformTotalPrice || costingSheet.emsTotalStep4CustomerPrice || 28571;
  const platformContingency = Math.round(platformPrice / Math.max(0.01, (100 - bufferPct) / 100));
  const platformRounded = roundToNearest(platformContingency, roundingNearest);
  const platformDescription = activePlatformRows.length > 0
    ? activePlatformRows.map((r) => r.description).join('. ')
    : 'IoT device configuration, protocol setup (Modbus, BACnet, MQTT), and integration with BMS/EMS platforms Network connectivity, dashboard mapping, alarm configuration, and cloud/server integration support System commissioning including startup, functional testing, calibration, and performance verification Troubleshooting, integration testing, client demonstration, and final handover support Electrical power/control cable laying, routing, termination, tagging, and insulation testing as per standard';
  const platformQty = activePlatformRows[0]?.qty || 20;
  const platformUom = activePlatformRows[0]?.uom || 'Nodes';

  // 7. Recurring Cloud Charges
  const recurringPrice = costingSheet.emsRecurringYearlyTotalPrice || costingSheet.emsTotalStep5CustomerPrice || 33432;
  const recurringContingency = Math.round(recurringPrice / Math.max(0.01, (100 - bufferPct) / 100));
  const recurringRounded = roundToNearest(recurringContingency, roundingNearest);
  const recurringDescription = activeRecurringRows.length > 0
    ? activeRecurringRows.map((r) => r.description).join('. ')
    : 'OptiByte Dashboard, Intelligent reporting, Group and machine level reporting, Email on any threshold value breach, Alert on Mobile(via SMS), Auto detection of anomalies, water flow rate, water capacity. We will check with the pH and TDS meter, if we can integrate it with our dashboard';
  const recurringQty = activeRecurringRows[1]?.qty || activeRecurringRows[0]?.qty || 20;
  const recurringUom = activeRecurringRows[1]?.uom || activeRecurringRows[0]?.uom || 'Nodes';

  const commercialSummaryItems = [
    {
      sNo: 1,
      description: item1a?.description || 'Flanged Type Vortex Precious Flow Meter High Pressure with digital communication feasibility (RS 485)',
      qty: item1a?.qty || 3,
      uom: item1a?.uom || 'Nos',
      customerPrice: item1Rounded || 833400,
      isRecurring: false,
    },
    {
      sNo: 2,
      description: item2Description,
      qty: item2Qty,
      uom: item2Uom,
      customerPrice: item2Rounded || 819600,
      isRecurring: false,
    },
    {
      sNo: 3,
      description: item3Description,
      qty: item3Qty,
      uom: item3Uom,
      customerPrice: item3Rounded || 1718900,
      isRecurring: false,
    },
    {
      sNo: 4,
      description: 'Automation, Programming & Commissioning Scope: PLC/Controller logic programming, compressor sequencing, instrument loops & engineering commissioning',
      qty: 1,
      uom: 'Job',
      customerPrice: autoRounded || 240000,
      isRecurring: false,
    },
    {
      sNo: 5,
      description: 'Installation, Cabling & Electrical Mounting Scope: On-site IoT gateway deployment, CT/Meter termination, cable laying, conduit routing & electrical mounting',
      qty: 1,
      uom: 'Job',
      customerPrice: instRounded || 87700,
      isRecurring: false,
    },
    {
      sNo: 6,
      description: platformDescription,
      qty: platformQty,
      uom: platformUom,
      customerPrice: platformRounded || 31800,
      isRecurring: false,
    },
    {
      sNo: 7,
      description: recurringDescription,
      qty: recurringQty,
      uom: recurringUom,
      customerPrice: recurringRounded || 37200,
      isRecurring: true,
    },
  ];

  const computedTotalCustomerPrice = commercialSummaryItems.reduce((sum, r) => sum + Number(r.customerPrice || 0), 0);
  const displayFinalPrice = finalPrice || computedTotalCustomerPrice || Number(costingSheet.finalQuote || 0);

  const PageHeader = ({ subtitle = 'Technical Proposal & Implementation Scope' }: { subtitle?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2.5 gap-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
        <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
          {clientName} — Compressed Air Automation
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
      {/* PAGE 1: Executive Summary, Introduction & Plant Demand Monitoring */}
      {/* ========================================================================= */}
      <PageShell pageNum={1} subtitle="Executive Summary & Demand Profiling">
        <div className="bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 text-white rounded-xl p-3 shadow-sm border border-sky-800/40">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="h-4 w-4 text-sky-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-sky-300">
              Introduction &amp; Digitalization Objective
            </h3>
          </div>
          <p className="text-[10.5px] leading-relaxed text-slate-200">
            This scope outlines the monitoring and automation of the industrial compressed air network at <strong>{clientName}</strong>.
            The solution focuses on analyzing dynamic plant air demand, evaluating real-time compressor efficiency (SEC), optimizing multi-compressor
            lead–lag sequencing, and executing ultrasonic leak management to eliminate waste and maximize energy savings.
          </p>
        </div>

        {/* Row 1: Basic Representation of Flow Monitoring */}
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <span className="text-[11px] font-black text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-indigo-600" /> Basic Flow Monitoring Architecture
            </span>
            <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              OptiByte Flow Engine
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-36 bg-white rounded-lg border border-slate-200/90 overflow-hidden flex flex-col items-center justify-center p-1 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/air sutomation1.png"
                alt="Basic Flow Monitoring Architecture"
                className="w-full h-full object-contain"
              />
              <span className="text-[8px] font-bold text-slate-500 mt-0.5">OptiByte Flow Header Layout</span>
            </div>
            <div className="h-36 bg-white rounded-lg border border-slate-200/90 overflow-hidden flex flex-col items-center justify-center p-1 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/compressed 3.png"
                alt="Compressed Air Demand & Flow Calibration"
                className="w-full h-full object-contain"
              />
              <span className="text-[8px] font-bold text-slate-500 mt-0.5">Flow &amp; Power Telemetry Tap</span>
            </div>
          </div>
        </div>

        {/* Row 2: 1. Plant Demand Monitoring */}
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Gauge className="h-3.5 w-3.5 text-sky-600" />
              <h4 className="text-[11px] font-extrabold text-slate-900 uppercase">
                1. Plant Demand Monitoring &amp; Right-Sizing
              </h4>
            </div>
            <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              High-Speed Dynamic Logging
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] leading-tight text-slate-700">
            <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200">
              <p className="font-bold text-sky-950 uppercase text-[9.5px] mb-0.5">Objective &amp; Scope</p>
              <ul className="list-disc pl-3 space-y-0.5 text-[9.5px]">
                <li>Assess total plant compressed air demand under varying production loads through precision flow metering.</li>
                <li>Identify peak, base, and off-shift demand periods for compression right-sizing and balance.</li>
              </ul>
            </div>
            <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-200">
              <p className="font-bold text-emerald-950 uppercase text-[9.5px] mb-0.5">Deliverables &amp; Benefits</p>
              <ul className="list-disc pl-3 space-y-0.5 text-[9.5px]">
                <li>High-resolution demand profile reports with machine-level usage breakdowns.</li>
                <li>Actionable right-sizing recommendations preventing artificial over-pressurization.</li>
              </ul>
            </div>
          </div>

          {/* Row-wise Flow Dashboard Preview */}
          <div className="w-full h-40 bg-white rounded-lg border border-slate-200/90 overflow-hidden flex items-center justify-center p-1 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/air automatio2.png"
              alt="Sample Dashboard Flow Monitoring Representation"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Key KPIs Row */}
          <div className="grid grid-cols-3 gap-2 bg-sky-50/70 p-1.5 rounded-lg border border-sky-200/60 text-center">
            <div>
              <p className="text-[8.5px] font-bold text-sky-900 uppercase">System Pressure</p>
              <p className="text-[9.5px] font-black text-slate-900">Header Min / Avg / Max (bar)</p>
            </div>
            <div>
              <p className="text-[8.5px] font-bold text-sky-900 uppercase">Flow &amp; Demand Profile</p>
              <p className="text-[9.5px] font-black text-slate-900">Current &amp; Peak (CFM / m³/hr)</p>
            </div>
            <div>
              <p className="text-[8.5px] font-bold text-sky-900 uppercase">Leakage Index</p>
              <p className="text-[9.5px] font-black text-slate-900">Off-Shift Flow (% Base Load)</p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ========================================================================= */}
      {/* PAGE 2: Compressor Efficiency & Lead-Lag Sequencing Optimization */}
      {/* ========================================================================= */}
      <PageShell pageNum={2} subtitle="Efficiency Analytics & Lead–Lag Sequencing">
        {/* Row 1: 2. Compressor Efficiency Monitoring */}
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-amber-600" />
              <h4 className="text-[11px] font-extrabold text-slate-900 uppercase">
                2. Compressor Efficiency Monitoring (SEC &amp; FAD)
              </h4>
            </div>
            <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
              ISO 1217 Standard
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] leading-tight text-slate-700">
            <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200/60">
              <p className="font-bold text-amber-950 uppercase text-[9.5px] mb-0.5">Objective &amp; Scope</p>
              <p className="text-[9.5px]">
                Establish Specific Energy Consumption (SEC in kW/100 CFM or kWh/m³) by correlating measured mass air flow with true RMS electrical power. Enables true merit-order ranking of all compressors from highest to lowest efficiency.
              </p>
            </div>
            <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200/60">
              <p className="font-bold text-amber-950 uppercase text-[9.5px] mb-0.5">Core Benefits</p>
              <p className="text-[9.5px]">
                Eliminates running degraded machines on base load. Compares actual performance against OEM test certificates and triggers condition-based maintenance before major breakdown occurs.
              </p>
            </div>
          </div>

          {/* Row-wise Compressor Efficiency Visual */}
          <div className="w-full h-44 bg-white rounded-lg border border-slate-200/90 overflow-hidden flex items-center justify-center p-1 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/airautomatio3.png"
              alt="Compressor Efficiency Monitoring Representation"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-center text-[9px]">
            <div className="p-1 bg-slate-100 rounded font-semibold text-slate-800">
              <span className="text-[7.5px] block text-slate-500 uppercase">Specific Power</span>
              kW/m³ or kW/100 CFM
            </div>
            <div className="p-1 bg-slate-100 rounded font-semibold text-slate-800">
              <span className="text-[7.5px] block text-slate-500 uppercase">Free Air Delivery</span>
              FAD @ Operating Bar
            </div>
            <div className="p-1 bg-slate-100 rounded font-semibold text-slate-800">
              <span className="text-[7.5px] block text-slate-500 uppercase">Energy Metric</span>
              kWh / Cost per m³
            </div>
            <div className="p-1 bg-slate-100 rounded font-semibold text-slate-800">
              <span className="text-[7.5px] block text-slate-500 uppercase">Health Score</span>
              Temp, Starts, Vibration
            </div>
          </div>
        </div>

        {/* Row 2: 3. Sequencing for Compressor Energy Optimization */}
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Settings className="h-3.5 w-3.5 text-indigo-600" />
              <h4 className="text-[11px] font-extrabold text-slate-900 uppercase">
                3. Intelligent Sequencing &amp; Automated Lead–Lag Control
              </h4>
            </div>
            <span className="text-[9px] font-black bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded">
              PLC / SCADA Integration
            </span>
          </div>

          {/* Row-wise Compressor Sequencing Graph */}
          <div className="w-full h-44 bg-white rounded-lg border border-slate-200/90 overflow-hidden flex items-center justify-center p-1 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/airautomation.png"
              alt="Sample Compressor Performance Representation"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-[9.5px] leading-tight text-slate-700 bg-slate-50/80 p-2 rounded-lg border border-slate-200">
            <ul className="list-disc pl-3 space-y-0.5">
              <li><strong>Dynamic Priority Control:</strong> Automatically engages the most efficient compressor to meet fluctuating base and peak demands.</li>
              <li><strong>Unload Elimination:</strong> Eliminates blow-off losses and wasteful unloaded run hours, reducing power consumption by 15% to 30%.</li>
            </ul>
            <ul className="list-disc pl-3 space-y-0.5">
              <li><strong>Balanced Running Hours:</strong> Equalizes wear and tear across machines, extending equipment lifespan and overhaul intervals.</li>
              <li><strong>Narrow Pressure Band:</strong> Stabilizes plant header pressure within ±0.1 bar, saving ~7% power per 1 bar reduction.</li>
            </ul>
          </div>
        </div>
      </PageShell>

      {/* ========================================================================= */}
      {/* PAGE 3: IoT Compressor Monitoring & Ultrasonic Leakage Management */}
      {/* ========================================================================= */}
      <PageShell pageNum={3} subtitle="IoT Architecture & Ultrasonic Leak Management">
        {/* Row 1: IoT Monitoring in Compressors */}
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-purple-600" />
              <h4 className="text-[11px] font-extrabold text-slate-900 uppercase">
                IoT Monitoring Architecture in HP Compressors
              </h4>
            </div>
            <span className="text-[9px] font-black bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
              Edge Pro IIoT
            </span>
          </div>

          {/* Row-wise HP Compressor Monitoring Preview */}
          <div className="w-full h-36 bg-white rounded-lg border border-slate-200/90 overflow-hidden flex items-center justify-center p-1 shadow-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/airautomation5.png"
              alt="IoT Monitoring in HP Compressors Representation"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-[9.5px]">
            <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
              <p className="font-bold text-slate-900 mb-0.5 flex items-center gap-1">
                <Radio className="h-3 w-3 text-sky-600" /> Telemetry Points
              </p>
              <p className="text-slate-600 text-[9px] leading-tight">
                Pressure transducers, PT100 temperature sensors, power analyzers &amp; vibration transmitters.
              </p>
            </div>
            <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
              <p className="font-bold text-slate-900 mb-0.5 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-amber-600" /> Smart Alerting
              </p>
              <p className="text-slate-600 text-[9px] leading-tight">
                Instant SMS/WhatsApp alerts for thermal spikes, abnormal cycling, filter drop, or pressure loss.
              </p>
            </div>
            <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
              <p className="font-bold text-slate-900 mb-0.5 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-600" /> Predictive Health
              </p>
              <p className="text-slate-600 text-[9px] leading-tight">
                Early fault detection on stage compression, oil temperature, and valve degradation.
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Ultrasonic Leakage Identification & Tagging (Complete Lifecycle Gallery) */}
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Wrench className="h-3.5 w-3.5 text-rose-600" />
              <h4 className="text-[11px] font-extrabold text-slate-900 uppercase">
                Ultrasonic Leakage Identification, Tagging &amp; Validation
              </h4>
            </div>
            <span className="text-[9px] font-black bg-rose-100 text-rose-900 px-2 py-0.5 rounded">
              Acoustic Loss Prevention
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-700 leading-tight bg-slate-50/80 p-1.5 rounded-lg border border-slate-200">
            <p>
              <strong>Acoustic Imaging:</strong> Pinpoints high-frequency acoustic waves (20–100 kHz) down to 0.05 mm @ 7 bar during full production.
            </p>
            <p>
              <strong>Serialized Metallic Tagging:</strong> Barcode tagged with location, dB level, CFM loss, and annualized financial loss.
            </p>
          </div>

          {/* 3-Image Leakage Lifecycle Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="h-32 bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col items-center justify-center p-1 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/airautomation6.png"
                alt="Ultrasonic Leak Detector Device"
                className="w-full h-full object-contain"
              />
              <span className="text-[8px] font-bold text-slate-500 mt-0.5">Acoustic Detector Unit</span>
            </div>
            <div className="h-32 bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col items-center justify-center p-1 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/compress ai1.png"
                alt="Ultrasonic Acoustic Camera Display"
                className="w-full h-full object-contain"
              />
              <span className="text-[8px] font-bold text-slate-500 mt-0.5">Live Loss &amp; dB Screen</span>
            </div>
            <div className="h-32 bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col items-center justify-center p-1 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/compressrd air 2.png"
                alt="Serialized Metallic Barcode Tag on Pipe"
                className="w-full h-full object-contain"
              />
              <span className="text-[8px] font-bold text-slate-500 mt-0.5">Physical Field Tag</span>
            </div>
          </div>

          {/* Implementation Validation Card */}
          <div className="bg-emerald-50/80 border border-emerald-200 p-1.5 rounded-lg">
            <p className="text-[9.5px] font-black text-emerald-950 uppercase flex items-center gap-1.5 mb-0.5">
              <FileCheck className="h-3 w-3 text-emerald-700" /> Implementation Validation &amp; Savings Verification
            </p>
            <p className="text-[8.5px] text-emerald-900 leading-tight">
              Post-rectification audit to re-measure baseline flow, specific power, and artificial demand reduction. Documented report provides transparent proof of kilowatt and cost savings achieved.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ========================================================================= */}
      {/* PAGE 4: Client Scope, Implementation Deliverables & Exclusions */}
      {/* ========================================================================= */}
      <PageShell pageNum={4} subtitle="Responsibility Matrix & Execution Terms">
        <div className="space-y-3">
          {/* Client Support Scope */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 pb-1.5 mb-2 border-b border-slate-100">
              <Building2 className="h-4 w-4 text-sky-700" />
              <h4 className="text-xs font-black text-slate-900 uppercase">
                Support Required from Client ({clientName})
              </h4>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-slate-700 leading-tight">
              <li className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                <CheckCircle2 className="h-3 w-3 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>HP Compressor Oil Tank Provisions:</strong> Sensor ports for HP oil tank are in Danfoss scope with OEM support. Sensor supply is under Sustainabyte scope.</span>
              </li>
              <li className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                <CheckCircle2 className="h-3 w-3 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Dedicated SPOC:</strong> A Single Point of Contact from plant engineering for coordination, access permits, and execution phases.</span>
              </li>
              <li className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                <CheckCircle2 className="h-3 w-3 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Pipeline Specialist:</strong> 1 knowledgeable technician from client to assist during flow meter mounting and line tapping.</span>
              </li>
              <li className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                <CheckCircle2 className="h-3 w-3 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Tapping Points &amp; Flanges:</strong> 1/2&quot; Ball valve tapping points for pressure sensors; necessary counter-flanges &amp; gaskets for flow meters.</span>
              </li>
              <li className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                <CheckCircle2 className="h-3 w-3 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Power &amp; Storage:</strong> 230V AC UPS power supply point for gateways/controllers and safe on-site storage for instruments.</span>
              </li>
              <li className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                <CheckCircle2 className="h-3 w-3 text-sky-600 shrink-0 mt-0.5" />
                <span><strong>Ladders &amp; Scaffoldings:</strong> Site ladders, scaffoldings, safety caution boards, and scissor lifts as required for high overhead pipelines.</span>
              </li>
            </ul>
          </div>

          {/* General Exclusions */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
            <div className="flex items-center gap-2 pb-1.5 mb-2 border-b border-slate-100">
              <ShieldCheck className="h-4 w-4 text-amber-700" />
              <h4 className="text-xs font-black text-slate-900 uppercase">
                General Project Exclusions
              </h4>
            </div>
            <p className="text-[10px] text-slate-600 leading-tight mb-2">
              This technical offer covers only the equipment, engineering services, and IoT deliverables explicitly stated. Items excluded:
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[9.5px] text-slate-700">
              <span className="p-1.5 bg-amber-50/60 rounded border border-amber-200/50">• Site accommodation and personal boarding.</span>
              <span className="p-1.5 bg-amber-50/60 rounded border border-amber-200/50">• Civil/builder works, panel plinths, and structural wall cutting.</span>
              <span className="p-1.5 bg-amber-50/60 rounded border border-amber-200/50">• Disposal of redundant pipes or decommissioned equipment.</span>
              <span className="p-1.5 bg-amber-50/60 rounded border border-amber-200/50">• Provision and cost of fuel/power for commissioning trials.</span>
            </div>
          </div>

          {/* Project Execution Timeline */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-3 shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold text-sky-400 uppercase">Delivery &amp; Commissioning Lead Time</p>
              <p className="text-xs font-black text-white">Hardware Delivery: 10–12 Weeks | Site Installation &amp; Commissioning: 6–8 Weeks</p>
              <p className="text-[9px] text-slate-300">Execution schedules align with plant maintenance shutdown windows agreed upon at kickoff.</p>
            </div>
            <Clock className="h-7 w-7 text-sky-400 shrink-0" />
          </div>
        </div>
      </PageShell>

      {/* ========================================================================= */}
      {/* PAGE 5: Commercial Breakdown, Terms & Conditions & Sign-off */}
      {/* ========================================================================= */}
      <PageShell pageNum={5} subtitle="Commercial Proposal & Terms and Conditions">
        {/* Commercials Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
          <div className="flex items-center justify-between pb-1 mb-2 border-b border-slate-100">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
              Commercial Price Summary
            </h4>
            <span className="text-[9px] font-black bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
              All Prices in INR (₹)
            </span>
          </div>

          <table className="w-full text-left text-[9.5px] border-collapse mb-2">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-300">
                <th className="p-1 px-1.5 text-center w-8">S.No</th>
                <th className="p-1 px-2">Item Description</th>
                <th className="p-1 px-1.5 text-center w-12">Qty</th>
                <th className="p-1 px-1.5 text-center w-12">UoM</th>
                <th className="p-1 px-2 text-right w-28">Customer Price (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {commercialSummaryItems.map((item) => (
                <tr key={`ca_comm_${item.sNo}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-1 px-1.5 text-center font-bold text-slate-500">{item.sNo}</td>
                  <td className="p-1 px-2 font-semibold text-slate-900 leading-tight text-[9px]">{item.description}</td>
                  <td className="p-1 px-1.5 text-center font-bold text-slate-700">{item.qty}</td>
                  <td className="p-1 px-1.5 text-center text-slate-600">{item.uom}</td>
                  <td className="p-1 px-2 text-right font-bold text-slate-900">
                    ₹{formatCurrency(item.customerPrice).replace('₹', '')}{item.isRecurring ? ' /yr' : ''}
                  </td>
                </tr>
              ))}
              <tr className="bg-emerald-50/80 font-black text-emerald-950 border-t-2 border-emerald-300">
                <td colSpan={4} className="p-1.5 px-2 text-right uppercase tracking-wider text-[10px]">
                  TOTAL COMMERCIAL INVESTMENT (EXCLUSIVE OF GST):
                </td>
                <td className="p-1.5 px-2 text-right text-xs font-black text-emerald-800">
                  ₹{formatCurrency(computedTotalCustomerPrice || displayFinalPrice || 3768600).replace('₹', '')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-2xs">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-1.5 pb-1 border-b border-slate-200">
            Terms &amp; Conditions
          </h4>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9.5px] text-slate-700 leading-snug">
            <li>• <strong>Offer Validity:</strong> 1 Month from quotation date.</li>
            <li>• <strong>Taxes:</strong> GST @ 18% extra as applicable.</li>
            <li>• <strong>Payment Schedule:</strong> 50% advance against Pro-Forma Invoice; 40% against material supply within 15 days; 10% after successful project commissioning.</li>
            <li>• <strong>Freight &amp; Handling:</strong> Material Packing &amp; Forwarding / Transport Inclusive.</li>
            <li>• <strong>Delivery Period:</strong> 10 to 12 Weeks from approved date of PO.</li>
            <li>• <strong>Warranty:</strong> 12 Months from the date of material delivery at site.</li>
            <li>• <strong>Installation Schedule:</strong> Completed within 6–8 weeks upon material arrival and shutdown clearance.</li>
            <li>• <strong>Power Quality:</strong> Protection from plant input power surges/voltage spikes to field controllers is under client care.</li>
          </ul>
        </div>

        {/* Authorization Sign-off */}
        <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-end text-[10px]">
          <div>
            <p className="font-bold text-slate-500 uppercase text-[9px]">Proposal Prepared &amp; Submitted By:</p>
            <p className="font-black text-slate-900 text-xs mt-0.5">Sustainabyte Technologies Pvt Ltd</p>
            <p className="text-slate-600 text-[9px]">Industrial Energy Optimization &amp; IoT Automation Division</p>
            <p className="text-slate-500 font-mono text-[9px]">Date: {proposalDate}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-500 uppercase text-[9px]">Accepted &amp; Confirmed By:</p>
            <p className="font-black text-slate-900 text-xs mt-0.5">{clientName}</p>
            <div className="w-36 border-b border-slate-400 mt-4 mb-1"></div>
            <p className="text-slate-400 text-[8px]">Authorized Signatory &amp; Company Seal</p>
          </div>
        </div>
      </PageShell>
    </div>
  );
}

'use client';

import React from 'react';

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
  const totalPages = 6;

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
  const item1aQty = Number(item1a?.qty || 0);
  const item1aPrice = item1a && item1aQty > 0 ? item1aQty * calcPrice(Number(item1a.unitCost || 0), item1a.marginPct ?? 40) : (activeGatewayRows.length === 0 ? 750000 : 0);
  const item1aContingency = Math.round(item1aPrice / Math.max(0.01, (100 - bufferPct) / 100));
  const final1a = roundToNearest(item1aContingency, roundingNearest);

  // 2. Additional Gateway / Instruments (1b, 1c...)
  const item1bRows = activeGatewayRows.length > 1 ? activeGatewayRows.slice(1) : (activeGatewayRows.length === 0 ? rawGatewayRows.slice(1) : []);
  const item1bQty = item1bRows.reduce((sum, r) => sum + Number(r.qty || 0), 0);
  const item1bPrice = item1bRows.reduce((sum, r) => sum + Number(r.qty || 0) * calcPrice(Number(r.unitCost || 0), r.marginPct ?? 40), 0);
  const item1bContingency = Math.round(item1bPrice / Math.max(0.01, (100 - bufferPct) / 100));
  const final1b = roundToNearest(item1bContingency, roundingNearest);
  const item1bDescription = item1bRows.length > 0
    ? item1bRows.map((r) => r.description).join('; ')
    : 'Gateway with Panel Board, DDC Controller, I/O Module, Relay Module & services including AI-based insights, leakage identification using ultrasonic acoustic leak detector, re-verification support and IM&V support';

  // 3. Electrical Consumables
  const totalElecPrice = (activeElecRows.length > 0 ? activeElecRows : rawElecRows).reduce((sum, r) => {
    const qty = Number(r.qty || 0);
    const unitPrice = calcPrice(Number(r.unitCost || 0), r.marginPct ?? 40);
    return sum + qty * unitPrice;
  }, 0);
  const item2Price = totalElecPrice > 0 ? totalElecPrice : (activeElecRows.length === 0 ? 1547000 : 0);
  const item2Contingency = Math.round(item2Price / Math.max(0.01, (100 - bufferPct) / 100));
  const final2 = roundToNearest(item2Contingency, roundingNearest);
  const item2Qty = (activeElecRows.length > 0 ? activeElecRows : rawElecRows).reduce((sum, r) => sum + Number(r.qty || 0), 0) || 1;
  const item2Description = (activeElecRows.length > 0 ? activeElecRows : rawElecRows).map((r) => r.description).join('; ') || 'Supply of electrical consumables such as flexible hose, cable ties and all other accessories';

  // 4. Packaging Charges (DO NOT add contingency buffer)
  const packagingPct = costingSheet.emsPackagingPct !== undefined ? Number(costingSheet.emsPackagingPct) : (costingSheet.packagingPct !== undefined ? Number(costingSheet.packagingPct) : 3);
  const hwBasePrice = item1aPrice + item1bPrice + item2Price;
  const autoPackagingPrice = Math.round(hwBasePrice * (packagingPct / 100));
  const effectivePackagingPrice = costingSheet.emsPackagingManualPrice !== undefined && costingSheet.emsPackagingManualPrice !== null
    ? Number(costingSheet.emsPackagingManualPrice)
    : (costingSheet.emsEffectivePackagingPrice !== undefined ? Number(costingSheet.emsEffectivePackagingPrice) : autoPackagingPrice);
  const finalPkg = roundToNearest(effectivePackagingPrice, roundingNearest);

  // 5. Automation, Programming & Commissioning Scope
  const autoManpowerPrice = Number(
    costingSheet.caaAutoManpowerTotalPrice ||
    costingSheet.airAutoManpowerTotalPrice ||
    costingSheet.autoPrice ||
    costingSheet.automationTotalPrice ||
    252000
  );
  const autoContingency = Math.round(autoManpowerPrice / Math.max(0.01, (100 - bufferPct) / 100));
  const finalAuto = roundToNearest(autoContingency, roundingNearest);

  // 6. Installation, Cabling & Electrical Mounting Scope
  const instManpowerPrice = Number(
    costingSheet.caaInstManpowerTotalPrice ||
    costingSheet.airInstManpowerTotalPrice ||
    costingSheet.instPrice ||
    costingSheet.installationTotalPrice ||
    92083
  );
  const instContingency = Math.round(instManpowerPrice / Math.max(0.01, (100 - bufferPct) / 100));
  const finalInst = roundToNearest(instContingency, roundingNearest);

  // 7. Platform Setup Scope
  const totalPlatformPrice = (activePlatformRows.length > 0 ? activePlatformRows : rawPlatformRows).reduce((sum, r) => {
    const qty = Number(r.qty || 0);
    const unitPrice = calcPrice(Number(r.unitCost || 0), r.marginPct ?? 40);
    return sum + qty * unitPrice;
  }, 0);
  const item3Price = totalPlatformPrice > 0 ? totalPlatformPrice : (activePlatformRows.length === 0 ? 28571 : 0);
  const item3Contingency = Math.round(item3Price / Math.max(0.01, (100 - bufferPct) / 100));
  const final3 = roundToNearest(item3Contingency, roundingNearest);
  const platformQty = activePlatformRows[0]?.qty || rawPlatformRows[0]?.qty || 20;
  const platformUom = activePlatformRows[0]?.uom || rawPlatformRows[0]?.uom || 'Nodes';

  // 8. Recurring Cloud Charges
  const totalRecurPrice = (activeRecurringRows.length > 0 ? activeRecurringRows : rawRecurringRows).reduce((sum, r) => {
    const qty = Number(r.qty || 0);
    const unitPrice = calcPrice(Number(r.unitCost || 0), r.marginPct ?? 40);
    return sum + qty * unitPrice;
  }, 0);
  const item5Price = totalRecurPrice > 0 ? totalRecurPrice : (activeRecurringRows.length === 0 ? 33432 : 0);
  const item5Contingency = Math.round(item5Price / Math.max(0.01, (100 - bufferPct) / 100));
  const final5 = roundToNearest(item5Contingency, roundingNearest);
  const recurQty = activeRecurringRows[1]?.qty || activeRecurringRows[0]?.qty || rawRecurringRows[1]?.qty || rawRecurringRows[0]?.qty || 20;
  const recurUom = activeRecurringRows[1]?.uom || activeRecurringRows[0]?.uom || rawRecurringRows[1]?.uom || rawRecurringRows[0]?.uom || 'Nodes';

  const dbLineItems: any[] =
    (proposal as any)?.quote?.lineItems ||
    (proposal as any)?.lineItems ||
    (deal as any)?.quote?.lineItems ||
    (deal as any)?.lineItems ||
    [];

  let commercialSummaryItems: any[] = [];

  const hasValidDbLinePrices = dbLineItems.length > 0 && dbLineItems.some((li) => Number(li.total || li.totalPrice || li.customerPrice || (Number(li.unitRate || li.unitPrice || 0) * Number(li.qty || li.quantity || 1))) > 0);

  if (hasValidDbLinePrices) {
    commercialSummaryItems = dbLineItems.map((li, idx) => {
      const desc = li.description || li.itemDescription || li.name || '';
      const isRecurring = Boolean(
        li.isRecurring ||
        desc.toLowerCase().includes('recurring') ||
        desc.toLowerCase().includes('annual') ||
        desc.toLowerCase().includes('dashboard') ||
        desc.toLowerCase().includes('/yr')
      );
      const rawPrice = Number(
        li.total !== undefined && li.total !== null
          ? li.total
          : (li.totalPrice !== undefined && li.totalPrice !== null
            ? li.totalPrice
            : (li.customerPrice !== undefined && li.customerPrice !== null
              ? li.customerPrice
              : (Number(li.unitRate ?? li.unitPrice ?? 0) * Number(li.qty ?? li.quantity ?? 1))))
      ) || 0;

      return {
        sNo: li.sNo || `${idx + 1}`,
        description: desc,
        qty: Number(li.qty ?? li.quantity ?? 1),
        uom: li.uom || (li.unit ? li.unit : (desc.toLowerCase().includes('gateway') || desc.toLowerCase().includes('meter') ? 'Nos' : (desc.toLowerCase().includes('node') ? 'Nodes' : 'Job'))),
        customerPrice: rawPrice,
        isRecurring,
      };
    });
  } else {
    let sNoCounter = 1;

    if (final1a > 0) {
      commercialSummaryItems.push({
        sNo: sNoCounter++,
        description: item1a?.description || 'Flanged Type Vortex Precious Flow Meter High Pressure with digital communication feasibility (RS 485)',
        qty: item1aQty || 1,
        uom: item1a?.uom || 'Nos',
        customerPrice: final1a,
      });
    }

    if (final1b > 0) {
      commercialSummaryItems.push({
        sNo: sNoCounter++,
        description: item1bDescription,
        qty: item1bQty || 1,
        uom: item1bRows[0]?.uom || 'Nos',
        customerPrice: final1b,
      });
    }

    if (final2 > 0) {
      commercialSummaryItems.push({
        sNo: sNoCounter++,
        description: item2Description,
        qty: item2Qty,
        uom: 'Job',
        customerPrice: final2,
      });
    }

    if (finalPkg > 0) {
      commercialSummaryItems.push({
        sNo: sNoCounter++,
        description: `Packaging & Forwarding Charges (${packagingPct}% of Total Hardware & Electrical Supplies)`,
        qty: 1,
        uom: 'Job',
        customerPrice: finalPkg,
      });
    }

    if (finalAuto > 0) {
      commercialSummaryItems.push({
        sNo: sNoCounter++,
        description: 'Automation, Programming & Commissioning Scope: PLC/Controller logic programming, compressor sequencing, instrument loops & engineering commissioning',
        qty: 1,
        uom: 'Job',
        customerPrice: finalAuto,
      });
    }

    if (finalInst > 0) {
      commercialSummaryItems.push({
        sNo: sNoCounter++,
        description: 'Installation, Cabling & Electrical Mounting Scope: On-site IoT gateway deployment, CT/Meter termination, cable laying, conduit routing & electrical mounting',
        qty: 1,
        uom: 'Job',
        customerPrice: finalInst,
      });
    }

    if (final3 > 0) {
      commercialSummaryItems.push({
        sNo: sNoCounter++,
        description: activePlatformRows.length > 0 ? activePlatformRows.map((r) => r.description).join('. ') : 'IoT device configuration, protocol setup (Modbus, BACnet, MQTT), and integration with RMS/EMS platforms Network connectivity, dashboard mapping, alarm configuration, and cloud/server integration support System commissioning including startup, functional testing, calibration, and performance verification Troubleshooting, integration testing, client demonstration, and final handover support Electrical power/control cable laying, routing, termination, tagging, and insulation testing as per standard',
        qty: platformQty,
        uom: platformUom,
        customerPrice: final3,
      });
    }

    if (final5 > 0) {
      commercialSummaryItems.push({
        sNo: sNoCounter++,
        description: activeRecurringRows.length > 0 ? activeRecurringRows.map((r) => r.description).join('. ') : 'OptiByte Dashboard, Intelligent reporting, Group and machine level reporting, Email on any threshold value breach, Alert on Mobile(via SMS), Auto detection of anomalies, water flow rate, water capacity. We will check with the pH and TDS meter, if we can integrate it with our dashboard',
        qty: recurQty,
        uom: recurUom,
        customerPrice: final5,
        isRecurring: true,
      });
    }
  }

  const computedTotalCustomerPrice = commercialSummaryItems.reduce((sum, r) => sum + Number(r.customerPrice || 0), 0);
  const displayTotal = Number(proposal?.quote?.totalAmount) || finalPrice || computedTotalCustomerPrice;

  const PageLogo = () => (
    <div className="flex justify-end pb-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Pvt Ltd" className="h-14 w-auto object-contain" />
    </div>
  );

  const PageShell = ({ pageNum, children }: { pageNum: number; children: React.ReactNode }) => (
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
        <div className="relative z-10 flex-1 flex flex-col justify-between h-full">
          <div className="flex-1 flex flex-col justify-between">
            {children}
          </div>
          <div className="text-center pt-3 shrink-0">
            <span className="text-[12px] text-slate-500">{pageNum}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── PAGE 1: COVER PAGE ── */}
      <PageShell pageNum={1}>
        <PageLogo />
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 my-auto">
          <h1 className="text-[22px] font-bold text-black underline underline-offset-4 decoration-1 leading-relaxed">
            Techno Commercial Proposal for Compressed Air Automation &amp; Monitoring
          </h1>
          {(proposal as any)?.clientLogo && (
            <div className="py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={(proposal as any).clientLogo} alt={`${clientName} Logo`} className="max-h-[120px] w-auto object-contain mx-auto" />
            </div>
          )}
          <div className="text-center text-[12px] text-black space-y-1">
            <p>Quotation No: {proposalRef}</p>
            <p>Date: {proposalDate}</p>
          </div>
        </div>
        <div className="mt-auto shrink-0 pt-4">
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-300 text-[10px] text-black leading-snug">
            <div>
              <p className="font-bold text-[11px] mb-1">COPYRIGHT</p>
              <p>&copy; This Report is the copyright of <strong><u>Sustainabyte Technologies Pvt Ltd</u></strong>. Any unauthorised reproduction or usage by any person other than the addressee is strictly prohibited</p>
            </div>
            <div>
              <p className="font-bold text-[11px] mb-1">CONFIDENTIAL</p>
              <p>All reasonable precautionary methods in handling the document and the information contained herein should be taken to prevent any third party from obtaining access. No responsibility is taken by <u>Sustainabyte Technologies Pvt Ltd</u> for the use of this document by any third party.</p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 2: ABOUT SUSTAINABYTE ── */}
      <PageShell pageNum={2}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1">
            About Sustainabyte:
          </h2>
          <div className="space-y-4 text-[12px] text-black leading-relaxed">
            <p>
              Sustainabyte is a private limited company, based out in Chennai, with client base spreading across 3 countries. It is a climate-tech start-up, predominantly focussing on energy conservation methodologies across Industries, Commercial building and residential complexes.
            </p>
            <p>
              Sustainabyte.ai is dedicated to leveraging advanced technology for global sustainability. Our mission is to minimize environmental impact while enhancing operational efficiency through innovative solutions
            </p>
            <p>
              Sustainabyte is a technology-driven sustainability company, providing cutting-edge solutions for enterprises, to identify, plan and operationalize their Net Zero Carbon ambitions.
            </p>
            <p>
              Our mission is to deliver sustainable prosperity for companies, by balancing people, planet and profit. We demonstrate this by leveraging proprietary machine-learning algorithms, which provide measurable outcomes.
            </p>
            <p>
              Our goal is to collaborate with companies and help them to work smarter, make critical decisions more quickly and consume less. In addition, by doing this at scale, we will make a significant impact on the carbon footprint of commercial and industrial assets, globally.
            </p>
            <p>
              At Sustainabyte, we understand how important it is to be productive and sustainable. As a first step, we provide expert advisory to create a blueprint for sustainability roadmap and Net Zero Carbon Goals.
            </p>
            <p>
              We implement our flagship IoT solution — OptiByte — our technology platform, as an overlay on the client&apos;s existing systems, connecting data points to provide a bird&apos;s eye view, which, really is making the invisible, visible. Our reporting module then presents the ESG scores, operational efficiency KPI has and compares it against the milestones. This drives a program of continuous improvement by identifying improvement opportunities and recommended changes to deliver empirical and tangible sustainability goals. We pride in delivering results as early as in 30-60 days.
            </p>
            <p>
              Climate change is the biggest humanitarian crisis staring in our face today, and we must act now to decarbonize and protect our planet for future generations. Our mission is to create a balance between people, planet, and profit, which balances the 3 key pillars of any business- Sustainability, Operational Excellence and Workplace.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 3: DEMAND PROFILING & FLOW ARCHITECTURE ── */}
      <PageShell pageNum={3}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Introduction &amp; Digitalization Objective:
            </h2>
            <p className="text-[12px] text-black leading-relaxed">
              This scope outlines the monitoring and automation of the industrial compressed air network at <strong>{clientName}</strong>.
              The solution focuses on analyzing dynamic plant air demand, evaluating real-time compressor efficiency (SEC), optimizing multi-compressor
              lead–lag sequencing, and executing ultrasonic leak management to eliminate waste and maximize energy savings.
            </p>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Basic Flow Monitoring Architecture:
            </h2>
            <div className="grid grid-cols-2 gap-4 my-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/air sutomation1.png" alt="OptiByte Flow Header Layout" className="w-full h-auto max-h-[140px] object-contain border border-slate-300" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/compressed 3.png" alt="Flow & Power Telemetry Tap" className="w-full h-auto max-h-[140px] object-contain border border-slate-300" />
            </div>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              1. Plant Demand Monitoring &amp; Right-Sizing:
            </h2>
            <ul className="space-y-1 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li><strong>Objective &amp; Scope:</strong> Assess total plant compressed air demand under varying production loads through precision flow metering; identify peak, base, and off-shift demand periods for compression right-sizing.</li>
              <li><strong>Deliverables &amp; Benefits:</strong> High-resolution demand profile reports with machine-level usage breakdowns and actionable right-sizing recommendations preventing artificial over-pressurization.</li>
            </ul>
          </div>

          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/air automatio2.png" alt="Sample Dashboard Flow Monitoring" className="w-full h-auto max-h-[140px] object-contain border border-slate-300" />
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: COMPRESSOR EFFICIENCY & SEQUENCING ── */}
      <PageShell pageNum={4}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              2. Compressor Efficiency Monitoring (SEC &amp; FAD):
            </h2>
            <ul className="space-y-1 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li><strong>Objective &amp; Scope:</strong> Establish Specific Energy Consumption (SEC in kW/100 CFM or kWh/m³) by correlating measured mass air flow with true RMS electrical power for merit-order compressor ranking.</li>
              <li><strong>Core Benefits:</strong> Eliminates running degraded machines on base load. Compares actual performance against OEM test certificates and triggers condition-based maintenance.</li>
            </ul>
          </div>

          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/airautomatio3.png" alt="Compressor Efficiency Monitoring" className="w-full h-auto max-h-[140px] object-contain border border-slate-300" />
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              3. Intelligent Sequencing &amp; Automated Lead–Lag Control:
            </h2>
            <ul className="space-y-1 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li><strong>Dynamic Priority Control:</strong> Automatically engages the most efficient compressor to meet fluctuating base and peak demands.</li>
              <li><strong>Unload Elimination:</strong> Eliminates blow-off losses and wasteful unloaded run hours, reducing power consumption by 15% to 30%.</li>
              <li><strong>Balanced Running Hours:</strong> Equalizes wear and tear across machines, extending equipment lifespan.</li>
              <li><strong>Narrow Pressure Band:</strong> Stabilizes plant header pressure within &plusmn;0.1 bar, saving ~7% power per 1 bar reduction.</li>
            </ul>
          </div>

          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/airautomation.png" alt="Compressor Sequencing Graph" className="w-full h-auto max-h-[140px] object-contain border border-slate-300" />
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 5: IOT ARCHITECTURE & ULTRASONIC LEAKAGE ── */}
      <PageShell pageNum={5}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              IoT Monitoring Architecture in HP Compressors:
            </h2>
            <div className="flex justify-center my-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/airautomation5.png" alt="IoT Monitoring in HP Compressors" className="w-full h-auto max-h-[140px] object-contain border border-slate-300" />
            </div>
            <ul className="space-y-1 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li><strong>Telemetry Points:</strong> Pressure transducers, PT100 temperature sensors, power analyzers &amp; vibration transmitters.</li>
              <li><strong>Smart Alerting:</strong> Instant SMS/WhatsApp alerts for thermal spikes, abnormal cycling, filter drop, or pressure loss.</li>
              <li><strong>Predictive Health:</strong> Early fault detection on stage compression, oil temperature, and valve degradation.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Ultrasonic Leakage Identification, Tagging &amp; Validation:
            </h2>
            <ul className="space-y-1 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li><strong>Acoustic Imaging:</strong> Pinpoints high-frequency acoustic waves (20–100 kHz) down to 0.05 mm @ 7 bar during full production.</li>
              <li><strong>Serialized Metallic Tagging:</strong> Barcode tagged with location, dB level, CFM loss, and annualized financial loss.</li>
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/airautomation6.png" alt="Acoustic Detector Unit" className="w-full h-auto max-h-[110px] object-contain border border-slate-300" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/compress ai1.png" alt="Live Loss & dB Screen" className="w-full h-auto max-h-[110px] object-contain border border-slate-300" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/compressrd air 2.png" alt="Physical Field Tag" className="w-full h-auto max-h-[110px] object-contain border border-slate-300" />
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 6: COMMERCIALS, TERMS, SUBMITTED BY & BANK DETAILS ── */}
      <PageShell pageNum={6}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <div className="flex items-end justify-between mb-2">
              <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1">
                Commercials:
              </h2>
              <div className="text-[11px] font-semibold text-slate-800">
                Customer: <span className="font-bold text-black">{clientName}</span>
              </div>
            </div>
            <table className="w-full border-collapse border border-black text-[11px] text-black">
              <thead>
                <tr className="bg-[#C6EFCE]">
                  <th className="border border-black py-1.5 px-2 text-center font-bold w-10">S.No</th>
                  <th className="border border-black py-1.5 px-2 text-left font-bold">Scope Description</th>
                  <th className="border border-black py-1.5 px-2 text-center font-bold w-12">Qty</th>
                  <th className="border border-black py-1.5 px-2 text-center font-bold w-12">UoM</th>
                  <th className="border border-black py-1.5 px-2 text-right font-bold w-28">Customer Price (INR)</th>
                </tr>
              </thead>
              <tbody>
                {commercialSummaryItems.map((item) => (
                  <tr key={`ca_comm_${item.sNo}`}>
                    <td className="border border-black py-1.5 px-2 text-center">{item.sNo}</td>
                    <td className="border border-black py-1.5 px-2">{item.description}</td>
                    <td className="border border-black py-1.5 px-2 text-center">{item.qty}</td>
                    <td className="border border-black py-1.5 px-2 text-center">{item.uom}</td>
                    <td className="border border-black py-1.5 px-2 text-right font-bold">
                      {formatCurrency(item.customerPrice)}{item.isRecurring ? ' /yr' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colSpan={4} className="border border-black py-2 px-2 text-center font-bold text-[12px]">Total</td>
                  <td className="border border-black py-2 px-2 text-right font-bold text-[12px]">
                    {formatCurrency(displayTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-1.5">
              Terms and Conditions:
            </h2>
            <ul className="space-y-1 text-[11px] text-black list-disc pl-6 leading-snug">
              <li>Offer Validity: 1 Month from quotation date.</li>
              <li>Taxes: GST @ 18% extra as applicable.</li>
              <li>Payment Schedule: 50% advance against Pro-Forma Invoice; 40% against material supply within 15 days; 10% after successful project commissioning.</li>
              <li>Delivery Period: 10 to 12 Weeks from approved date of PO.</li>
              <li>Warranty: 12 Months from the date of material delivery at site.</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-200">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-black">Submitted By,</p>
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Pvt Ltd" className="h-8 w-auto object-contain" />
              </div>
              <div className="text-[11px] text-black space-y-0.5">
                <p className="font-bold">Mr. Thanakarthik Kumar K</p>
                <p>Founder &amp; Managing Director</p>
                <p className="font-bold">Contact:</p>
                <p>Call: 8377007638</p>
                <p>Mail: thanakarthik@sustainabyte.ai</p>
              </div>
            </div>

            <div className="space-y-0.5 text-[11px] text-black">
              <p className="font-bold">Bank Account details:</p>
              <p>Bank – Bank of Baroda</p>
              <p>Account Number – 35860200000750</p>
              <p>IFSC – BARB0VELACH (fifth letter is ZERO)</p>
              <p>Branch – VELACHERY BRANCH</p>
              <p>GSTIN NO – 33ABNCS4869A1Z7</p>
              <p>PAN Number – ABNCS4869A</p>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-[16px] font-black uppercase tracking-widest text-black">THANK YOU</p>
          </div>
        </div>
      </PageShell>
    </>
  );
}

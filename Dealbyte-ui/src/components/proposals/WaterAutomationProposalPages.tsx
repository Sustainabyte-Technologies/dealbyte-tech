'use client';

import React from 'react';

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

  const item1a = activeGatewayRows[0] || rawGatewayRows[0];
  const item1Cost = item1a ? (item1a.qty || 8) * calcPrice(item1a.unitCost || 45000, item1a.marginPct ?? 40) : 600000;
  const item1WithContingency = Math.round(item1Cost / Math.max(0.01, (100 - bufferPct) / 100));
  const item1Rounded = roundToNearest(item1WithContingency, roundingNearest);

  const item1bRows = (activeGatewayRows.length > 1 ? activeGatewayRows.slice(1) : rawGatewayRows.slice(1));
  const item2Description = item1bRows[0]?.description || 'Actuator Controlled Motorized Valves (Inlet & Outlet)';
  const item2Qty = item1bRows[0]?.qty || 8;
  const item2Uom = item1bRows[0]?.uom || 'Nos';
  const item2Cost = item1bRows.reduce((sum, r) => sum + Number(r.qty || 1) * calcPrice(Number(r.unitCost || 22000), r.marginPct ?? 40), 0) || 293333;
  const item2WithContingency = Math.round(item2Cost / Math.max(0.01, (100 - bufferPct) / 100));
  const item2Rounded = roundToNearest(item2WithContingency, roundingNearest);

  const item3Rows = (activeElecRows.length > 0 ? activeElecRows : rawElecRows);
  const item3Description = item3Rows[0]?.description || 'Electrical Enclosures, Contactor Interlocks & RS-485 Modbus Cabling';
  const item3Qty = item3Rows[0]?.qty || 8;
  const item3Uom = item3Rows[0]?.uom || 'Sets';
  const item3Cost = item3Rows.reduce((sum, r) => sum + Number(r.qty || 1) * calcPrice(Number(r.unitCost || 12000), r.marginPct ?? 40), 0) || 160000;
  const item3WithContingency = Math.round(item3Cost / Math.max(0.01, (100 - bufferPct) / 100));
  const item3Rounded = roundToNearest(item3WithContingency, roundingNearest);

  const totalAutoInstCost = (Number(costingSheet.emsTotalStep2Price) || 150000) + (Number(costingSheet.emsTotalStep3Price) || 120000);
  const autoWithContingency = Math.round((totalAutoInstCost * 0.55) / Math.max(0.01, (100 - bufferPct) / 100));
  const autoRounded = roundToNearest(autoWithContingency, roundingNearest);
  const instWithContingency = Math.round((totalAutoInstCost * 0.45) / Math.max(0.01, (100 - bufferPct) / 100));
  const instRounded = roundToNearest(instWithContingency, roundingNearest);

  const platformDescription = activePlatformRows[0]?.description || rawPlatformRows[0]?.description || 'OptiByte Aqua Cloud Platform Licensing & Multi-Building Real-Time Telemetry';
  const platformQty = activePlatformRows[0]?.qty || rawPlatformRows[0]?.qty || 1;
  const platformUom = activePlatformRows[0]?.uom || rawPlatformRows[0]?.uom || 'Year';
  const platformCost = (activePlatformRows.length > 0 ? activePlatformRows : rawPlatformRows).reduce((sum, r) => sum + Number(r.qty || 1) * calcPrice(Number(r.unitCost || 250000), r.marginPct ?? 40), 0) || 416667;
  const platformWithContingency = Math.round(platformCost / Math.max(0.01, (100 - bufferPct) / 100));
  const platformRounded = roundToNearest(platformWithContingency, roundingNearest);

  const recurringDescription = activeRecurringRows[1]?.description || activeRecurringRows[0]?.description || 'Annual Maintenance Contract, 24/7 Monitoring SLA & Firmware Maintenance';
  const recurringQty = activeRecurringRows[1]?.qty || activeRecurringRows[0]?.qty || 1;
  const recurringUom = activeRecurringRows[1]?.uom || activeRecurringRows[0]?.uom || 'Year';
  const recurringCost = (activeRecurringRows.length > 0 ? activeRecurringRows : rawRecurringRows).reduce((sum, r) => sum + Number(r.qty || 1) * calcPrice(Number(r.unitCost || 120000), r.marginPct ?? 40), 0) || 200000;
  const recurringWithContingency = Math.round(recurringCost / Math.max(0.01, (100 - bufferPct) / 100));
  const recurringRounded = roundToNearest(recurringWithContingency, roundingNearest);

  const dbLineItems: any[] =
    (proposal as any)?.quote?.lineItems ||
    (proposal as any)?.lineItems ||
    (deal as any)?.quote?.lineItems ||
    (deal as any)?.lineItems ||
    [];

  const commercialSummaryItems = dbLineItems.length > 0
    ? dbLineItems.map((li, idx) => {
        const desc = li.description || li.itemDescription || li.name || '';
        const isRecurring = Boolean(
          li.isRecurring ||
          desc.toLowerCase().includes('recurring') ||
          desc.toLowerCase().includes('annual') ||
          desc.toLowerCase().includes('dashboard') ||
          desc.toLowerCase().includes('/yr')
        );
        const rawPrice = Number(li.totalPrice !== undefined ? li.totalPrice : (li.customerPrice !== undefined ? li.customerPrice : (Number(li.unitPrice || 0) * Number(li.quantity || li.qty || 1))));
        return {
          sNo: li.sNo || `${idx + 1}`,
          description: desc,
          qty: Number(li.quantity || li.qty || 1),
          uom: li.uom || (li.unit ? li.unit : (desc.toLowerCase().includes('sensor') || desc.toLowerCase().includes('meter') || desc.toLowerCase().includes('valve') ? 'Nos' : 'Job')),
          customerPrice: rawPrice,
          isRecurring,
        };
      })
    : [
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
  const displayFinalPrice = Number(proposal?.quote?.totalAmount) || finalPrice || computedTotalCustomerPrice || Number(costingSheet.finalQuote || 0);

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
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <div className="space-y-4 flex-1">
            {children}
          </div>
          <div className="text-center pt-3">
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
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
          <h1 className="text-[22px] font-bold text-black underline underline-offset-4 decoration-1 leading-relaxed">
            Techno Commercial Proposal for Water Automation &amp; Monitoring
          </h1>
          {(proposal as any)?.clientLogo && (
            <div className="py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={(proposal as any).clientLogo} alt={`${clientName} Logo`} className="max-h-[120px] w-auto object-contain mx-auto" />
            </div>
          )}
          <div className="text-left text-[12px] text-black space-y-1">
            <p>Quotation No: {proposalRef}</p>
            <p>Date: {proposalDate}</p>
          </div>
        </div>
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

      {/* ── PAGE 3: SCOPE OF WORK & ARCHITECTURE ── */}
      <PageShell pageNum={3}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Scope of Work: Fully Automated Water Supply System (8 Buildings)
            </h2>
            <p className="text-[12px] text-black leading-relaxed">
              This technical scope outlines the turnkey design, supply, installation, and commissioning of a <strong>Fully Automated Water Supply &amp; Level Automation System</strong> across <strong>8 Buildings</strong> at <strong>{clientName}</strong>. The solution utilizes hydrostatic level sensors, motorized actuator valves, and smart pump automation controllers for intelligent 24/7 autonomous water distribution.
            </p>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              End-to-End Water IoT &amp; Automation Architecture:
            </h2>
            <div className="flex justify-center my-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/iot-solution-architecture.png"
                alt="Water Automation Architecture"
                className="w-full h-auto max-h-[160px] object-contain border border-slate-300"
              />
            </div>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Core Automation Deliverables:
            </h2>
            <ul className="space-y-1.5 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li><strong>Sensor &amp; Actuator Infrastructure:</strong> Install &amp; commission level-based water automation for overhead tanks (OHT) in 8 buildings with industrial level sensors and actuator-controlled valves.</li>
              <li><strong>Pump Interlocking &amp; Isolation:</strong> Automate pump start/stop based on precise tank levels to prevent dry-run, overflow, and manual intervention. Interface with existing pump starter panels (DOL / Star-Delta / VFD).</li>
              <li><strong>Centralized Cloud Dashboard:</strong> 24/7 real-time monitoring of water levels across all 8 buildings, pump status, and automatic anomaly alerting.</li>
            </ul>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: KEY BENEFITS & CLIENT RESPONSIBILITY ── */}
      <PageShell pageNum={4}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Key Strategic Benefits:
            </h2>
            <ul className="space-y-1.5 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li><strong>Zero Manual Supervision:</strong> Completely eliminates manual supervision and physical inspection of water levels, valve operations, and pump scheduling.</li>
              <li><strong>Zero Water &amp; Energy Wastage:</strong> Eliminates tank overflow water wastage and prevents energy wastage caused by dry-running or excess run hours.</li>
              <li><strong>Extended Pump &amp; Motor Life:</strong> Protects heavy pumping assets against short-cycling, cavitations, thermal overload, and dry-run damage.</li>
              <li><strong>Centralized Rapid Response:</strong> Instant SMS/Cloud threshold alerts and centralized visibility enable proactive maintenance.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Support Required from the Client:
            </h2>
            <ul className="space-y-1.5 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li><strong>Technicians for Wiring:</strong> All meter changes and cable looping work to be executed by customer&apos;s qualified technicians.</li>
              <li><strong>Dedicated SPOC:</strong> A Single Point of Contact (SPOC) from engineering for support and coordination during installation.</li>
              <li><strong>Unrestricted Site Accessibility:</strong> Seamless access permits to overhead tanks, pump houses, and electrical rooms across all 8 buildings.</li>
              <li><strong>Integration Shutdowns:</strong> Planned maintenance shutdown windows required for new sensor tappings.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              General Execution Terms &amp; Exclusions:
            </h2>
            <ul className="space-y-1 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li>Boarding, lodging, and food expenses for on-site engineers are under client scope.</li>
              <li>All authority approvals, work permissions, and security site passes to be provided by client.</li>
              <li>Client is responsible for site coordination with any third-party civil or electrical contractors.</li>
              <li>Any additional materials, cabling, or hardware beyond the explicitly stated bill of materials will be charged as actuals.</li>
            </ul>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 5: COMMERCIALS, PAYMENT TERMS & BANK DETAILS ── */}
      <PageShell pageNum={5}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Commercials:
            </h2>
            <table className="w-full border-collapse border border-black text-[11px] text-black">
              <thead>
                <tr className="bg-[#C6EFCE]">
                  <th className="border border-black py-1.5 px-2 text-center font-bold w-10">S.No</th>
                  <th className="border border-black py-1.5 px-2 text-left font-bold">Item Description</th>
                  <th className="border border-black py-1.5 px-2 text-center font-bold w-12">Qty</th>
                  <th className="border border-black py-1.5 px-2 text-center font-bold w-14">UoM</th>
                  <th className="border border-black py-1.5 px-2 text-right font-bold w-28">Customer Price (INR)</th>
                </tr>
              </thead>
              <tbody>
                {commercialSummaryItems.map((item) => (
                  <tr key={`wa_comm_${item.sNo}`}>
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
                    {formatCurrency(computedTotalCustomerPrice || displayFinalPrice || 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-1.5">
              Milestone Payment Schedule:
            </h2>
            <ul className="space-y-1 text-[11px] text-black list-disc pl-6 leading-snug">
              <li><strong>Hardware Supply:</strong> 100% Upfront against proforma invoice prior to dispatch.</li>
              <li><strong>Software &amp; Platform:</strong> 70% advance, 30% post dashboard finalization.</li>
              <li><strong>Installation &amp; I&amp;C:</strong> 70% advance, 30% post site handover.</li>
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

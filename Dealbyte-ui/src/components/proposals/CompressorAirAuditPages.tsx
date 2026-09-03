'use client';

import React from 'react';

interface CompressorAirAuditPagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
}

export function CompressorAirAuditPages({
  deal,
  proposal,
  proposalRef,
  proposalDate,
  finalPrice,
  formatCurrency,
}: CompressorAirAuditPagesProps) {
  const totalPages = 12;
  const clientName = deal?.clientName || (proposal as any)?.clientName || 'Valued Client';

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
            Techno Commercial Proposal for Compressed Air Audit
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

      {/* ── PAGE 3: METHODOLOGY OVERVIEW ── */}
      <PageShell pageNum={3}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1">
            Methodology Overview:
          </h2>
          <p className="text-[12px] text-black leading-relaxed">
            A comprehensive compressed air audit covers the complete lifecycle: Generation, Distribution, and End Use. Our engineers utilize precision acoustic imaging, mass flow measurement, and electrical telemetry to pinpoint inefficiencies across the facility.
          </p>
          <div className="flex justify-center my-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/compred5.png" alt="Compressed Air System Overview" className="w-full h-auto max-h-[220px] object-contain border border-slate-300" />
          </div>
          <ul className="space-y-1.5 text-[12px] text-black list-disc pl-6 leading-relaxed">
            <li><strong>Phase-1:</strong> Distribution Loss Assessment, Ultrasonic Leak Detection &amp; Flow Measurement</li>
            <li><strong>Phase-2:</strong> Implementation &amp; Rectification Support (Spares &amp; Valve Replacements)</li>
            <li><strong>Phase-3:</strong> Implementation Validation &amp; Savings Verification</li>
          </ul>
        </div>
      </PageShell>

      {/* ── PAGE 4: LEAKAGE IDENTIFICATION ── */}
      <PageShell pageNum={4}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1">
            Leakage Identification &amp; Tagging:
          </h2>
          <p className="text-[12px] text-black leading-relaxed">
            Ultrasonic leak detection is performed across all generation, storage, distribution, and end-use points. Every identified leak is tagged with a physical identifier and logged into the comprehensive audit ledger.
          </p>
          <div className="grid grid-cols-2 gap-4 my-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/compress ai1.png" alt="Ultrasonic Acoustic Camera Display" className="w-full h-auto max-h-[160px] object-contain border border-slate-300" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/compressrd air 2.png" alt="Physical Leak Tag on Line" className="w-full h-auto max-h-[160px] object-contain border border-slate-300" />
          </div>
          <ul className="space-y-1.5 text-[12px] text-black list-disc pl-6 leading-relaxed">
            <li>Quantifies CFM loss and financial cost per individual leak point.</li>
            <li>Enables maintenance teams to execute structured, prioritized repairs.</li>
            <li>Prevents recurring compressed air energy losses.</li>
          </ul>
        </div>
      </PageShell>

      {/* ── PAGE 5: LEAK DETECTOR DEVICE SPECIFICATIONS ── */}
      <PageShell pageNum={5}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1">
            Our Leakage Detector Overview:
          </h2>
          <div className="flex justify-center my-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/compressed 3.png" alt="Ultrasonic Leak Detector Device" className="w-full h-auto max-h-[160px] object-contain border border-slate-300" />
          </div>
          <ul className="space-y-1.5 text-[12px] text-black list-disc pl-6 leading-relaxed">
            <li><strong>Principle:</strong> Ultrasonic high-frequency sound detection (20 kHz to 100 kHz).</li>
            <li><strong>Detection Capability:</strong> Identifies pinhole leaks down to 0.05 mm at 7 bar from several meters away.</li>
            <li><strong>Portability:</strong> Lightweight handheld unit with rechargeable battery providing 6–10 hours runtime.</li>
            <li><strong>Applications:</strong> Compressed air pipelines, gas lines, vacuum systems, steam traps, and valves without shutting down operations.</li>
          </ul>
        </div>
      </PageShell>

      {/* ── PAGE 6: COMMERCIALS & SUPPORT REQUIRED ── */}
      <PageShell pageNum={6}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Commercials:
            </h2>
            <table className="w-full border-collapse border border-black text-[12px] text-black">
              <thead>
                <tr className="bg-[#C6EFCE]">
                  <th className="border border-black py-2 px-3 text-center font-bold w-14">Sl.No</th>
                  <th className="border border-black py-2 px-3 text-left font-bold">Scope Description</th>
                  <th className="border border-black py-2 px-3 text-center font-bold w-20">Quantity</th>
                  <th className="border border-black py-2 px-3 text-right font-bold w-32">Total Price (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black py-2 px-3 text-center">1</td>
                  <td className="border border-black py-2 px-3">
                    <p className="font-bold">Distribution Loss Assessment &amp; Flow Measurement</p>
                    <ul className="text-[11px] list-disc pl-4 mt-1 space-y-0.5">
                      <li>Leakage Identification from generation to end point including machineries</li>
                      <li>Baseline Data Collection</li>
                      <li>Documentation &amp; Report Preparation (Off Site)</li>
                    </ul>
                  </td>
                  <td className="border border-black py-2 px-3 text-center">01</td>
                  <td className="border border-black py-2 px-3 text-right font-bold">{formatCurrency(finalPrice)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colSpan={3} className="border border-black py-2.5 px-3 text-center font-bold text-[13px]">Total</td>
                  <td className="border border-black py-2.5 px-3 text-right font-bold text-[13px]">{formatCurrency(finalPrice)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Support required from the client:
            </h2>
            <ul className="space-y-1 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li>SPOC (Single point of Contact) for support and coordination during the audit phase.</li>
              <li>Accessibility to each area.</li>
              <li>1 person required from client side with knowledge on compressed air line to reach out from generation to end use.</li>
            </ul>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 7: TERMS & PHASE-2 SCOPE ── */}
      <PageShell pageNum={7}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Terms and Conditions:
            </h2>
            <ul className="space-y-1.5 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li><strong>Payment schedule:</strong> 50% advance against the PO and remaining 50% against the report submission.</li>
              <li>Applicable Taxes and duties will be extra.</li>
              <li>Boarding and Travel Expenses are inclusive of the cost mentioned above.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Phase-2 Implementation (By Customer Preference):
            </h2>
            <ul className="space-y-1.5 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li>Correcting air leakages and addressing other compressed air optimization opportunities.</li>
              <li>Once leaks are repaired, improvements are validated through energy meters or flow data.</li>
              <li>Supplying required materials and spares during implementation ensures timely execution.</li>
            </ul>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 8: PHASE-3 VALIDATION ── */}
      <PageShell pageNum={8}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1">
            Phase-3 Implementation Validation:
          </h2>
          <p className="text-[12px] text-black leading-relaxed">
            Implementation Validation ensures that recommended energy conservation measures and rectification works are executed as planned and deliver expected results by comparing post-implementation data against baseline.
          </p>
          <div className="flex justify-center my-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/compresd6.png" alt="Ultrasonic Acoustic Camera Validation Screen" className="w-full h-auto max-h-[300px] object-contain border border-slate-300" />
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 9: AIR COMPRESSOR EFFICIENCY AUDIT ── */}
      <PageShell pageNum={9}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1">
            Air Compressor Efficiency Audit:
          </h2>
          <p className="text-[12px] text-black leading-relaxed">
            An Air Compressor Efficiency Audit is an in-depth evaluation of your entire compressed air system. Its primary goal is to find ways to reduce energy consumption, improve system performance, and lower operating costs without disrupting production.
          </p>
          <ul className="space-y-1.5 text-[12px] text-black list-disc pl-6 leading-relaxed">
            <li><strong>Measurement:</strong> Continuous monitoring of mass flow, power, and header pressure.</li>
            <li><strong>SEC Analysis:</strong> Establishes Specific Energy Consumption (kW/100 CFM or kWh/m³).</li>
            <li><strong>Actionable Recommendations:</strong> Right-sizing, load/unload optimization, pressure band reduction, and leak fixing.</li>
          </ul>
        </div>
      </PageShell>

      {/* ── PAGE 10: DEMAND FLOW MEASUREMENT ── */}
      <PageShell pageNum={10}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1">
            Demand Flow Measurement:
          </h2>
          <p className="text-[12px] text-black leading-relaxed">
            Demand Flow Measurement accurately measures how much compressed air is consumed by the plant at different times of the day using inline mass flow meters.
          </p>
          <div className="flex justify-center my-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/compresed4.png" alt="Demand Flow Measurement Meter Position" className="w-full h-auto max-h-[220px] object-contain border border-slate-300" />
          </div>
          <ul className="space-y-1.5 text-[12px] text-black list-disc pl-6 leading-relaxed">
            <li><strong>Right-sizing:</strong> Prevents running oversized compressors, avoiding wasted electricity.</li>
            <li><strong>Off-Shift Flow:</strong> Measures non-production baseline to quantify total leakage loss.</li>
            <li><strong>Energy Savings:</strong> Delivers up to 20–30% in overall power cost savings.</li>
          </ul>
        </div>
      </PageShell>

      {/* ── PAGE 11: SUBMITTED BY & BANK DETAILS ── */}
      <PageShell pageNum={11}>
        <PageLogo />
        <div className="space-y-6 flex-1">
          <div className="space-y-2">
            <p className="text-[12px] font-bold text-black">Submitted By,</p>
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Pvt Ltd" className="h-10 w-auto object-contain" />
            </div>
            <div className="text-[12px] text-black space-y-0.5">
              <p className="font-bold">Mr. Thanakarthik Kumar K</p>
              <p>Founder &amp; Managing Director</p>
              <p className="font-bold">Contact:</p>
              <p>Call: 8377007638</p>
              <p>Mail: thanakarthik@sustainabyte.ai</p>
            </div>
          </div>

          <div className="space-y-1 text-[12px] text-black pt-4 border-t border-slate-200">
            <p className="font-bold">Bank Account details:</p>
            <p>Bank – Bank of Baroda</p>
            <p>Account Number – 35860200000750</p>
            <p>IFSC – BARB0VELACH (fifth letter is ZERO)</p>
            <p>Branch – VELACHERY BRANCH</p>
            <p>GSTIN NO – 33ABNCS4869A1Z7</p>
            <p>PAN Number – ABNCS4869A</p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 12: THANK YOU ── */}
      <PageShell pageNum={12}>
        <PageLogo />
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-[28px] font-black uppercase tracking-widest text-black">
            THANK YOU
          </p>
          <p className="text-[13px] text-slate-700 max-w-md mx-auto leading-relaxed">
            We appreciate the opportunity to collaborate on optimizing your compressed air efficiency and sustainability goals.
          </p>
        </div>
      </PageShell>
    </>
  );
}

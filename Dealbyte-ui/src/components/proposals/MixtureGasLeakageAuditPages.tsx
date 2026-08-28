'use client';

import React from 'react';

interface MixtureGasLeakageAuditPagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
}

export function MixtureGasLeakageAuditPages({
  deal,
  proposal,
  proposalRef,
  proposalDate,
  finalPrice,
  formatCurrency,
}: MixtureGasLeakageAuditPagesProps) {
  const totalPages = 3;

  const PageHeader = ({ subtitle = 'Detailed Scope of Work & Detection Methodology' }: { subtitle?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2.5 gap-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
        <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
          {deal?.clientName || 'Valued Client'} — Mixture Gas Leakage Audit
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
        <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
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

          <div className="relative z-10 space-y-6">
            {/* Header / Logo */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-4 gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Official Commercial Proposal
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 uppercase">
                  Gas System Leakage Audit
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
                  Service Scope: <span className="font-bold text-slate-800">Energy Audit Services — Mixture Gas Leakage Audit</span>
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
            <div className="space-y-3 pt-1">
              <h3 className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight text-lg">
                About Sustainabyte:
              </h3>
              <div className="space-y-3 text-slate-800 font-normal text-left text-xs leading-relaxed">
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

          <div className="relative z-10 border-t border-slate-200 pt-3 mt-6 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Ref: {proposalRef}</span>
            <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page 1 of {totalPages}</span>
          </div>
        </div>
      </div>

      {/* ── PAGE 2: SCOPE OF WORK, TIMELINE & LEAKAGE DETECTOR OVERVIEW ── */}
      <PageShell pageNum={2} subtitle="Scope of Work, Timeline & Detection Technology">
        <div className="space-y-3.5 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          {/* Gas System Leakage Audit Scope */}
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2">
              Gas System Leakage Audit:
            </h3>
            <div className="space-y-2 text-slate-800 text-[11px]">
              <div>
                <p className="font-bold text-slate-950">
                  • System Mapping and Data Collection:
                </p>
                <p className="pl-4 text-slate-800">
                  Conduct a comprehensive mapping of the entire gas system, including Gas Yard to end-use equipment.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-950">
                  • Leakage Audit:
                </p>
                <p className="pl-4 text-slate-800">
                  Perform a detailed inspection to identify and quantify gas leaks throughout the system, evaluating their impact on overall system.
                </p>
                <p className="pl-6 text-slate-700 text-[10.5px] italic mt-0.5">
                  ➢ The audit will be conducted using precision acoustic imager to detect leakage in compressed air and Gas system.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-950">
                  • Reporting:
                </p>
                <ul className="pl-4 space-y-0.5 list-disc text-slate-800 text-[10.5px]">
                  <li>
                    Provide a comprehensive report detailing including Provide actionable recommendations for optimizing the gas system based on leakage audit including leak repairs and potential energy-saving opportunities.
                  </li>
                  <li>
                    Tagging each leakage with mentioned details about location of the leakage, intensity of the leakage, replacement part and repair instruction.
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-slate-950">
                  • Timeline:
                </p>
                <div className="pl-4 space-y-0.5 text-slate-800 text-[10.5px]">
                  <p><strong className="text-slate-900">Day 1:</strong> Data Collection, Leakage Audit (Pre Audit).</p>
                  <p><strong className="text-slate-900">Day 2:</strong> Analysis and Report Submission (Off Site).</p>
                  <p><strong className="text-slate-900">Day 3:</strong> Post Audit (Once the Rectifications Completed).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Leakage Detector Overview */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2">
              Our Leakage Detector Overview:
            </h3>

            <div className="space-y-1.5 text-slate-800 text-[10.5px]">
              <p className="flex items-start gap-2">
                <span className="text-slate-900 font-bold shrink-0">▪</span>
                <span><strong className="text-slate-950 font-bold">Leak Detection Principle</strong> – Identifies high-frequency ultrasonic sound waves generated when compressed air, gas, or vacuum escapes through small openings.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-slate-900 font-bold shrink-0">▪</span>
                <span><strong className="text-slate-950 font-bold">Frequency Range</strong> – Typically operates between 20 kHz to 100 kHz, beyond the range of human hearing.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-slate-900 font-bold shrink-0">▪</span>
                <span><strong className="text-slate-950 font-bold">Detection Capability</strong> – Can locate very small leaks (as small as 0.05 mm at ~7 bar) from several meters away.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-slate-900 font-bold shrink-0">▪</span>
                <span><strong className="text-slate-950 font-bold">Feedback System</strong> – Provides both audio (headphones) and visual (display or LED bar graph) indications to pinpoint leaks.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-slate-900 font-bold shrink-0">▪</span>
                <span><strong className="text-slate-950 font-bold">Sensitivity &amp; Adjustability</strong> – Equipped with adjustable sensitivity to distinguish between background noise and actual leak sounds.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-slate-900 font-bold shrink-0">▪</span>
                <span><strong className="text-slate-950 font-bold">Portability &amp; Power</strong> – Lightweight, handheld device powered by rechargeable or replaceable batteries with 6–10 hours’ runtime.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-slate-900 font-bold shrink-0">▪</span>
                <span><strong className="text-slate-950 font-bold">Applications</strong> – Used for compressed air systems, gas pipelines, vacuum systems, steam traps, and refrigerant leak detection without interrupting operations.</span>
              </p>
            </div>

            {/* Centered Image matching layout */}
            <div className="pt-3 flex justify-center">
              <div className="rounded-xl border border-slate-300 overflow-hidden bg-white p-1.5 shadow-sm max-w-[420px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/compressed 3.png"
                  alt="Precision Acoustic Ultrasonic Leak Detector in Operation"
                  className="w-full h-auto max-h-[220px] object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 3: COMMERCIALS, CLIENT SUPPORT, TERMS & BANK DETAILS ── */}
      <PageShell pageNum={3} subtitle="Commercial Investment, Terms & Authorization">
        <div className="space-y-4 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          {/* Commercials / Cost Estimate */}
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2">
              Mixture Gas Leakage Audit Commercials:
            </h3>

            <div className="border border-slate-900 rounded-xl overflow-hidden text-xs shadow-xs mb-3">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white font-extrabold text-[11px] tracking-wide">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-12">S.No</th>
                    <th className="py-2.5 px-4 w-3/5">Scope Description</th>
                    <th className="py-2.5 px-3 text-center">Timeline</th>
                    <th className="py-2.5 px-4 text-right w-36">Customer Price (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 text-xs">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-700 align-top">1</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 leading-relaxed align-top">
                      <p className="font-bold text-slate-950 text-xs mb-1">
                        Gas System Leakage Audit (Mixture Gas Line)
                      </p>
                      <ul className="space-y-0.5 pl-3 text-[10.5px] text-slate-700 font-normal list-disc">
                        <li>System mapping from Gas Yard to end-use equipment</li>
                        <li>Detailed acoustic imager inspection &amp; quantified leak evaluation</li>
                        <li>Individual leakage tagging with location, intensity, replacement part &amp; repair instructions</li>
                        <li>Off-site detailed analysis, energy-saving report &amp; post-rectification audit</li>
                      </ul>
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-slate-700 align-top text-xs">
                      3 Days
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-950 text-sm align-top">
                      {formatCurrency(finalPrice)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-slate-900 text-white p-3 px-5 flex justify-between items-center font-extrabold text-xs sm:text-sm">
                <span className="tracking-wide uppercase text-xs">TOTAL COMMERCIAL INVESTMENT</span>
                <span className="text-emerald-400 text-base sm:text-lg font-black tracking-tight">
                  {formatCurrency(finalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Support Required from Client */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-950 text-xs">
              Support required from the client:
            </h4>
            <div className="space-y-1 pl-4 text-slate-800 text-[10.5px]">
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>SPOC (Single point of Contact) for support and coordination during the audit phase</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>Accessibility to each area.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>1 person required from client side with knowledge on Mixed Gas line to reach out from the generation to end use for leakage identifications</span>
              </p>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-1.5 pt-1 border-t border-slate-200">
            <h4 className="font-bold text-slate-950 text-xs">
              Terms and Conditions:
            </h4>
            <div className="space-y-1 pl-4 text-slate-800 text-[10.5px]">
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>Payment schedule: 50% advance against the PO and remaining 50% against the report submission.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>Applicable taxes and duties will be extra.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>Boarding and Travel Expenses are inclusive of the cost mentioned above.</span>
              </p>
            </div>
          </div>

          {/* Submitted By */}
          <div className="space-y-1 pt-2 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs">Submitted by,</h4>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Logo" className="h-8 w-auto object-contain" />
            </div>
            <div className="space-y-0.5 text-xs text-slate-900">
              <p className="font-black text-slate-950">Thanakarthik</p>
              <p className="font-semibold text-slate-700">Founder &amp; Managing Director</p>
              <p className="font-mono text-slate-800">+91-8377007638</p>
              <p className="text-slate-600 font-mono">thanakarthik@sustainabyte.ai</p>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs underline underline-offset-4">Bank Account details:</h4>
            <div className="space-y-0.5 text-[11px] text-slate-800 font-mono">
              <p><strong className="text-slate-900">Bank</strong> – Bank of Baroda</p>
              <p><strong className="text-slate-900">Account Number</strong> – 35860200000750</p>
              <p><strong className="text-slate-900">IFSC</strong> – BARB0VELACH (fifth letter is ZERO)</p>
              <p><strong className="text-slate-900">Branch</strong> – VELACHERY BRANCH</p>
              <p><strong className="text-slate-900">GSTIN NO</strong> – 33ABNCS4869A1Z7</p>
              <p><strong className="text-slate-900">PAN Number</strong> – ABNCS4869A</p>
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

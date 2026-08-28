'use client';

import React from 'react';

interface DewPointHardwarePagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
}

export function DewPointHardwarePages({
  deal,
  proposal,
  proposalRef,
  proposalDate,
  finalPrice,
  formatCurrency,
}: DewPointHardwarePagesProps) {
  const totalPages = 4;

  const PageHeader = ({ subtitle = 'Hardware Supply & Platform Scope' }: { subtitle?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2.5 gap-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
        <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
          {deal?.clientName || 'Valued Client'} — Dew Point Sensor Supply
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
                  Hardware Supply — Dew Point Sensor
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
                  Service Scope: <span className="font-bold text-slate-800">Hardware / Dew Point Sensor Supply</span>
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

      {/* ── PAGE 2: SCOPE OF WORK, DIFFERENTIATION & PLATFORM BENEFITS ── */}
      <PageShell pageNum={2} subtitle="Scope of Work & Platform Capabilities">
        <div className="space-y-4 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          {/* Scope of Work */}
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1.5">
              Scope of Work:
            </h3>
            <p className="text-slate-800 text-[11px] leading-relaxed">
              In this Current proposal, the scope of work is for the supply of an dew point sensor excluding installation and commissioning focuses solely on delivering the hardware to the specified site. This includes product specifications, delivery requirements, documentation, and quality standards, ensuring the meter is ready for later installation by others.
            </p>
          </div>

          {/* How are we different from other suppliers */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2">
              How are we different from other suppliers?
            </h3>
            <div className="grid grid-cols-2 gap-2.5 text-[11px]">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <p><strong className="text-slate-950 font-bold">• End-to-end support:</strong> Sustainabyte assists with installation and commissioning, ensuring timely project completion.</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <p><strong className="text-slate-950 font-bold">• IoT based insights:</strong> Sustainabyte offers support for an IoT-based real-time online monitoring dashboard.</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <p><strong className="text-slate-950 font-bold">• Energy Savings:</strong> Sustainabyte evaluates and guides industries in achieving energy savings.</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <p><strong className="text-slate-950 font-bold">• Custom Visualization:</strong> The dashboard’s visualization can be tailored to meet each customer’s specific requirements.</p>
              </div>
            </div>
          </div>

          {/* Potential benefits of our platform – All 4 phases */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2">
              Potential benefits of our platform – All 4 phases:
            </h3>
            <div className="grid grid-cols-5 gap-2 text-[10.5px]">
              <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 flex flex-col justify-between">
                <p className="font-bold text-emerald-950">1. Up Time</p>
                <p className="text-emerald-800 text-[10px] mt-1">Equipment Downtime reduction</p>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 flex flex-col justify-between">
                <p className="font-bold text-emerald-950">2. Energy Savings</p>
                <p className="text-emerald-800 text-[10px] mt-1">Energy &amp; Utility Cost Reduction (1–10%)</p>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 flex flex-col justify-between">
                <p className="font-bold text-emerald-950">3. Zero Carbon</p>
                <p className="text-emerald-800 text-[10px] mt-1">Contribute to Net Carbon Zero (Scope 1 &amp; 2)</p>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 flex flex-col justify-between">
                <p className="font-bold text-emerald-950">4. HC Optimization</p>
                <p className="text-emerald-800 text-[10px] mt-1">~1.5 HC worth manual effort saved daily</p>
              </div>
              <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 flex flex-col justify-between">
                <p className="font-bold text-emerald-950">5. Cost Saving</p>
                <p className="text-emerald-800 text-[10px] mt-1">Up to 50% CapEx &amp; 30-50% Commissioning</p>
              </div>
            </div>
          </div>

          {/* Benefits of our Platform */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1.5">
              Benefits of our Platform:
            </h3>
            <div className="space-y-1.5 text-slate-800 text-[10.5px]">
              <p className="flex items-start gap-2">
                <span className="text-slate-900 font-bold shrink-0">1.</span>
                <span><strong className="text-slate-950 font-bold">Real-time alerting:</strong> When an asset malfunctions, you can automatically alert the right engineer, and have it repaired before it gets worse.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-slate-900 font-bold shrink-0">2.</span>
                <span><strong className="text-slate-950 font-bold">Peak load reporting:</strong> Clear insights and trend tracking on load distribution to prevent peak penalties and optimize operations.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-slate-900 font-bold shrink-0">3.</span>
                <span><strong className="text-slate-950 font-bold">Customization:</strong> The dashboard visualization and parameters can be tailored to meet unique customer specifications.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-slate-900 font-bold shrink-0">4.</span>
                <span><strong className="text-slate-950 font-bold">AI led anomaly detection:</strong> Immediately act when anomalies occur (in performance or consumption) to massively reduce time and keep assets performing at their peak.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-slate-900 font-bold shrink-0">5.</span>
                <span><strong className="text-slate-950 font-bold">Data driven decision making:</strong> Daily report, Data available to download from minute, hourly, daily, monthly to yearly levels right from the tool level.</span>
              </p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 3: DASHBOARD VISUALS (ROW-WISE & INCREASED SIZE) ── */}
      <PageShell pageNum={3} subtitle="Optibyte Platform Telemetry & Analytics">
        <div className="space-y-4 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-3">
              Dashboard Visuals:
            </h3>

            {/* Row 1: Global Consumption & Hourly Trend */}
            <div className="space-y-4">
              <div className="w-full rounded-xl border border-slate-300 overflow-hidden bg-slate-950 p-2 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dashboard1.png"
                  alt="Optibyte Global Consumption & Hourly Trend Dashboard"
                  className="w-full h-auto max-h-[390px] object-contain rounded-lg mx-auto"
                />
              </div>

              {/* Row 2: Global Chiller Real-Time Telemetry */}
              <div className="w-full rounded-xl border border-slate-300 overflow-hidden bg-slate-950 p-2 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dashboard2.png"
                  alt="Optibyte Real-Time Process Parameters & Telemetry Dashboard"
                  className="w-full h-auto max-h-[390px] object-contain rounded-lg mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: COMMERCIAL INVESTMENT, TERMS & AUTHORIZATION ── */}
      <PageShell pageNum={4} subtitle="Commercial Investment, Terms & Authorization">
        <div className="space-y-5 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          {/* Commercials / Cost Estimate */}
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2">
              Commercials:
            </h3>

            <div className="border border-slate-900 rounded-xl overflow-hidden text-xs shadow-xs mb-3">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white font-extrabold text-[11px] tracking-wide">
                  <tr>
                    <th className="py-3 px-3 text-center w-12">S.No</th>
                    <th className="py-3 px-4 w-3/5">Scope Description</th>
                    <th className="py-3 px-3 text-center">Delivery Period</th>
                    <th className="py-3 px-4 text-right w-36">Customer Price (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 text-xs">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-3 text-center font-bold text-slate-700 align-top">1</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 leading-relaxed align-top">
                      <p className="font-bold text-slate-950 text-xs mb-1">
                        Supply of Dew Point Sensor
                      </p>
                      <p className="text-[10.5px] text-slate-600 font-normal">
                        Supply of precision calibrated dew point sensor hardware with manufacturer documentation, quality standards, and technical data sheets ready for site integration.
                      </p>
                    </td>
                    <td className="py-3.5 px-3 text-center font-medium text-slate-700 align-top text-xs">
                      6–8 Weeks
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-950 text-sm align-top">
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

          {/* Terms and Conditions */}
          <div className="space-y-1.5 pt-1 border-t border-slate-200">
            <h4 className="font-bold text-slate-950 text-xs mb-1">
              Terms and Conditions:
            </h4>
            <div className="space-y-1 pl-4 text-slate-800 text-[10.5px]">
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>Payment schedule: 100% payment for hardware advance against the PO.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>Applicable taxes and duties will be extra</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>Delivery Period: Within 6-8 weeks from date of receipt of advance along with P.O.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>Installation &amp; Commissioning will be done at extra cost</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>Warranty: 12 months from the date of supply.</span>
              </p>
            </div>
          </div>

          {/* Submitted By & Bank Details */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-xs">
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-xs">Submitted by,</h4>
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Logo" className="h-8 w-auto object-contain" />
              </div>
              <div className="space-y-0.5 text-slate-900">
                <p className="font-black text-slate-950 text-xs">Mr. Thanakarthik Kumar K</p>
                <p className="font-semibold text-slate-700 text-[11px]">Founder &amp; Managing Director</p>
                <p className="font-mono text-slate-800 text-[11px]">+91-8377007638</p>
                <p className="text-slate-600 font-mono text-[10.5px]">thanakarthik@sustainabyte.ai</p>
              </div>
            </div>

            <div className="space-y-1">
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
          </div>

          {/* THANK YOU */}
          <div className="pt-3 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-slate-900">THANK YOU</p>
          </div>
        </div>
      </PageShell>
    </>
  );
}

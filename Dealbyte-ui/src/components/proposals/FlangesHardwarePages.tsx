'use client';

import React from 'react';

interface FlangesHardwarePagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
}

export function FlangesHardwarePages({
  deal,
  proposal,
  proposalRef,
  proposalDate,
  finalPrice,
  formatCurrency,
}: FlangesHardwarePagesProps) {
  const totalPages = 2;

  const PageHeader = ({ subtitle = 'Hardware Supply & Commercial Scope' }: { subtitle?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2.5 gap-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
        <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
          {deal?.clientName || 'Valued Client'} — Flanges Supply
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
        <div className="relative z-10 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
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
                  Hardware Supply — Flanges
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
                  Service Scope: <span className="font-bold text-slate-800">Hardware / Flanges Supply</span>
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

      {/* ── PAGE 2: SCOPE, COMMERCIALS, TERMS & BANK DETAILS ── */}
      <PageShell pageNum={2} subtitle="Scope of Supply, Commercial Investment & Terms">
        <div className="space-y-4 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          {/* Scope of Supply */}
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1.5">
              Scope of Supply:
            </h3>
            <p className="text-slate-800 text-[11px] leading-relaxed">
              In this current proposal, the scope of work is for the supply of industrial flanges focusing solely on delivering the hardware to the specified site. This includes product specifications, delivery requirements, manufacturer documentation, and quality standards, ensuring all flange components and accessories are ready for installation by site engineers.
            </p>
          </div>

          {/* Commercials / Cost Estimate Table */}
          <div className="pt-2 border-t border-slate-200">
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
                        Supply of Industrial Flanges
                      </p>
                      <p className="text-[10.5px] text-slate-600 font-normal">
                        Supply of high-grade industrial flange fittings, standard dimension tolerances, pressure class compliance, and material inspection certification ready for piping integration.
                      </p>
                    </td>
                    <td className="py-3.5 px-3 text-center font-medium text-slate-700 align-top text-xs">
                      Immediate
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

          {/* Support Required from Client & Terms and Conditions */}
          <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-200">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-950 text-xs underline underline-offset-4">
                Support required from the client:
              </h4>
              <div className="space-y-1 text-slate-800 text-[10.5px]">
                <p className="flex items-start gap-1.5">
                  <span className="text-slate-900 font-bold">•</span>
                  <span>SPOC (Single point of Contact) for support and coordination during the audit phase</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-slate-900 font-bold">•</span>
                  <span>Accessibility to each area.</span>
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-950 text-xs underline underline-offset-4">
                Terms and Conditions:
              </h4>
              <div className="space-y-1 text-slate-800 text-[10.5px]">
                <p className="flex items-start gap-1.5">
                  <span className="text-slate-900 font-bold">•</span>
                  <span>Payment schedule: 70% advance against the PO and 30% Against Delivery</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-slate-900 font-bold">•</span>
                  <span>Applicable taxes and duties will be extra</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-slate-900 font-bold">•</span>
                  <span>Boarding and Travel Expenses are inclusive of the cost mentioned above.</span>
                </p>
              </div>
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
                <p className="font-black text-slate-950 text-xs">Satish Kumar N</p>
                <p className="font-semibold text-slate-700 text-[11px]">Manager - Sales &amp; Operations</p>
                <p className="font-mono text-slate-800 text-[11px]">+91-7502244664</p>
                <p className="text-slate-600 font-mono text-[10.5px]">satishkumar@sustainabyte.ai</p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-xs underline underline-offset-4">Bank Account details:</h4>
              <div className="space-y-0.5 text-[11px] text-slate-800 font-mono">
                <p><strong className="text-slate-900">Name:</strong> SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED</p>
                <p><strong className="text-slate-900">Bank:</strong> Bank of Baroda</p>
                <p><strong className="text-slate-900">Account number:</strong> 35860200000750</p>
                <p><strong className="text-slate-900">IFSC:</strong> BARB0VELACH (fifth letter is ZERO)</p>
                <p><strong className="text-slate-900">Branch:</strong> VELACHERY BRANCH</p>
              </div>
            </div>
          </div>

          {/* THANK YOU */}
          <div className="pt-4 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-slate-900">THANK YOU</p>
          </div>
        </div>
      </PageShell>
    </>
  );
}

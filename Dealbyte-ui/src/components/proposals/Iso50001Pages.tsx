'use client';

import React from 'react';

interface Iso50001PagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
}

export const ISO_50001_CLIENTS_LIST = [
  'Aatral Engineering',
  'Velmurugan Heavy Engineering Industries Private Limited',
  '20cube Logistics Solutions Private Limited',
  'Danfoss Industries Private Limited',
  'Knowledge Bridge',
  'S G Snacks India Pvt. Ltd.',
  '20cube Logistics Solutions Private Limited',
  'Parekhplast India Limited',
  'PMEL Oragadam Private Limited - Unit 3',
  'PMEL Oragadam Private Limited - Unit 4',
  'Lucas TVS Limited - Padi',
  'Visalam Technologies LLP',
  'Adspaas Polymer Solutions Limited',
  'Wheels India Limited',
  'India Metal One Steel Plate Processing Pvt. Ltd',
  'India Metal One Steel Plate Processing Pvt. Ltd',
  'Glow guard (A Unit Of Green Pearl Engineering Construction Corporation Pvt Ltd) (SRM University)',
  'Aisan Auto Parts India Private Limited',
  'India Metal One Steel Plate Processing Pvt. Ltd',
  'Whirlpool of India Limited',
  'ITC - Medak Ltd',
  'Kone Elevator India Private Limited',
  'KPR Mill Limited',
  'Arni Engineering Tech Private Ltd',
  'Growserve Enterprises - Ashirwad',
  'Vashi Integrated Solution Limited',
  'Development Environergy Services Limited - IIT Hyderabad',
];

export function Iso50001Pages({
  deal,
  proposal,
  proposalRef,
  proposalDate,
  finalPrice,
  formatCurrency,
}: Iso50001PagesProps) {
  const totalPages = 5;

  const PageHeader = ({ subtitle = 'Detailed Scope of Work & Implementation Framework' }: { subtitle?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2.5 gap-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
        <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
          {deal?.clientName || 'Valued Client'} — Energy Management System (ISO 50001)
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
        <div className="relative z-10 space-y-3.5 flex-1 flex flex-col justify-between">
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
      {/* ── PAGE 1: COVER PAGE ── */}
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
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-4 gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Official Commercial Proposal
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 uppercase">
                  Energy Management System (ISO 50001)
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

            <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Proposal Prepared For:</p>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{deal?.clientName || 'Valued Client'}</h2>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Service Scope: <span className="font-bold text-slate-800">ISO 50001 Energy Management System (EnMS) Consultancy &amp; Implementation</span>
                </p>
              </div>
              {(proposal as any)?.clientLogo && (
                <div className="h-14 w-32 bg-white p-1 flex items-center justify-center shrink-0 border border-slate-100 rounded-lg shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={(proposal as any).clientLogo} alt="Client Logo" className="max-h-full max-w-full object-contain" />
                </div>
              )}
            </div>

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

      {/* ── PAGE 2: SCOPE OF WORK (9 PILLARS) ── */}
      <PageShell pageNum={2} subtitle="Scope of Work: ISO 50001 Energy Management System">
        <div className="space-y-2.5 text-slate-900 text-left font-normal text-[11px] leading-snug">
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
              Scope of Work:
            </h3>
            <p className="font-bold text-slate-900 text-xs mb-0.5">
              Energy Management System
            </p>
            <p className="text-slate-800 text-[11px] italic mb-1.5">
              This Energy Management System includes
            </p>
          </div>

          <div className="space-y-2 text-slate-800">
            {/* 1 */}
            <div>
              <p className="font-bold text-slate-950 text-[11px]">1. Energy Review &amp; Baseline Establishment</p>
              <ul className="pl-4 space-y-0.5 list-disc text-slate-800 text-[10px]">
                <li>Conduct a detailed energy review of all major energy-consuming systems.</li>
                <li>Develop the Energy Baseline (EnB) based on historical data.</li>
                <li>Identify Significant Energy Uses (SEUs) and opportunities for improvement.</li>
              </ul>
            </div>

            {/* 2 */}
            <div>
              <p className="font-bold text-slate-950 text-[11px]">2. Energy Performance Indicators (EnPIs) Development</p>
              <ul className="pl-4 space-y-0.5 list-disc text-slate-800 text-[10px]">
                <li>Define suitable EnPIs for monitoring and evaluating energy performance.</li>
                <li>Establish system for periodic tracking and reporting.</li>
              </ul>
            </div>

            {/* 3 */}
            <div>
              <p className="font-bold text-slate-950 text-[11px]">3. Gap Analysis &amp; Compliance Assessment</p>
              <ul className="pl-4 space-y-0.5 list-disc text-slate-800 text-[10px]">
                <li>Perform a gap analysis of current practices against ISO 50001 requirements.</li>
                <li>Provide a roadmap and action plan to achieve compliance.</li>
              </ul>
            </div>

            {/* 4 */}
            <div>
              <p className="font-bold text-slate-950 text-[11px]">4. Energy Management System Documentation</p>
              <ul className="pl-4 space-y-0.5 list-disc text-slate-800 text-[10px]">
                <li>Prepare and implement mandatory ISO 50001 documents:
                  <div className="pl-4 space-y-0.5 mt-0.5">
                    <p>• Energy Policy</p>
                    <p>• Procedures, SOPs, and Work Instructions</p>
                    <p>• Roles, Responsibilities &amp; Authorities</p>
                    <p>• Risk assessment and operational control documents</p>
                  </div>
                </li>
                <li>Create templates for monitoring, measurement, and reporting.</li>
              </ul>
            </div>

            {/* 5 */}
            <div>
              <p className="font-bold text-slate-950 text-[11px]">5. Training &amp; Capacity Building</p>
              <ul className="pl-4 space-y-0.5 list-disc text-slate-800 text-[10px]">
                <li>Conduct awareness training for employees at all levels.</li>
                <li>Conduct specialized training for the Energy Team on EnMS implementation and SEU management.</li>
              </ul>
            </div>

            {/* 6 */}
            <div>
              <p className="font-bold text-slate-950 text-[11px]">6. Identification of Energy Saving Opportunities</p>
              <ul className="pl-4 space-y-0.5 list-disc text-slate-800 text-[10px]">
                <li>Evaluate operational controls, processes, and equipment efficiency.</li>
                <li>Provide a detailed list of energy conservation measures (ECMs) with estimated savings.</li>
              </ul>
            </div>

            {/* 7 */}
            <div>
              <p className="font-bold text-slate-950 text-[11px]">7. Internal Audit Preparation &amp; Support</p>
              <ul className="pl-4 space-y-0.5 list-disc text-slate-800 text-[10px]">
                <li>Develop an internal audit plan, checklist, and guidelines.</li>
                <li>Conduct mock/internal audits and issue audit reports.</li>
              </ul>
            </div>

            {/* 8 */}
            <div>
              <p className="font-bold text-slate-950 text-[11px]">8. Management Review Facilitation</p>
              <ul className="pl-4 space-y-0.5 list-disc text-slate-800 text-[10px]">
                <li>Guide management review meetings as per ISO 50001 requirements.</li>
                <li>Ensure top management involvement and decision-making for continual improvement.</li>
              </ul>
            </div>

            {/* 9 */}
            <div>
              <p className="font-bold text-slate-950 text-[11px]">9. Implementation Monitoring &amp; Corrective Actions</p>
              <ul className="pl-4 space-y-0.5 list-disc text-slate-800 text-[10px]">
                <li>Review implementation status, assign corrective actions, and track closure.</li>
                <li>Update EnMS documents based on feedback.</li>
              </ul>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 3: ENERGY MONITORING IMPLEMENTATION & LIST OF CUSTOMERS ── */}
      <PageShell pageNum={3} subtitle="Energy Monitoring Infrastructure & Track Record">
        <div className="space-y-4 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          {/* Energy Monitoring System Implementation */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm">
              Energy Monitoring System Implementation
            </h3>
            <ul className="pl-4 space-y-1 text-slate-800 text-[11px] list-disc">
              <li>Creating Basic Energy Monitoring infrastructure including connecting 2 existing energy meters and additional 6 Energy meters and applicable modems and consumables.</li>
              <li>Implementing equipment level energy monitoring system using meters with critical alerts and alarms.</li>
              <li>Providing Custom dashboards and enabling alerts &amp; reports.</li>
            </ul>
          </div>

          {/* List of Customers */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm">
              List of Customers:
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-[10.5px]">
              {ISO_50001_CLIENTS_LIST.map((client, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-800 py-0.5">
                  <span className="font-bold text-slate-900 shrink-0">{idx + 1}.</span>
                  <span className="font-normal leading-tight">{client}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: COMMERCIAL BREAKDOWN ── */}
      <PageShell pageNum={4} subtitle="Commercial Investment & Pricing Breakdown">
        <div className="space-y-4 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1.5">
            Cost Estimate:
          </h3>

          <div className="border border-slate-900 rounded-xl overflow-hidden text-xs shadow-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white font-extrabold text-[11px] tracking-wide">
                <tr>
                  <th className="py-3 px-3 text-center w-14">S.No</th>
                  <th className="py-3 px-4 w-3/5">Scope Description</th>
                  <th className="py-3 px-3 text-center">Project Timeline</th>
                  <th className="py-3 px-4 text-right w-36">Customer Price (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800 text-xs">
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-3 text-center font-bold text-slate-700 align-top">1</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 leading-relaxed align-top">
                    <p className="font-bold text-slate-950 text-xs mb-1">
                      Energy Management System (ISO 50001) Implementation &amp; Energy Monitoring
                    </p>
                    <ul className="space-y-0.5 pl-3 text-[10.5px] text-slate-700 font-normal list-disc">
                      <li>9-Pillar ISO 50001 EnMS Gap Analysis, Documentation &amp; Internal Audit Preparation</li>
                      <li>Energy Monitoring System Infrastructure (2 Existing + 6 Additional Meters)</li>
                      <li>SEU Identification, EnPIs Development, Custom Dashboards, Alerts &amp; Reports</li>
                    </ul>
                  </td>
                  <td className="py-3.5 px-3 text-center font-medium text-slate-700 align-top text-xs">
                    4–6 Weeks
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-slate-950 text-sm align-top">
                    {formatCurrency(finalPrice)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="bg-slate-900 text-white p-3.5 px-5 flex justify-between items-center font-extrabold text-xs sm:text-sm">
              <span className="tracking-wide uppercase text-xs">TOTAL COMMERCIAL INVESTMENT (INCL. ALL EXPENSES)</span>
              <span className="text-emerald-400 text-base sm:text-lg font-black tracking-tight">
                {formatCurrency(finalPrice)}
              </span>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 5: TERMS, SIGNATORY & BANK DETAILS ── */}
      <PageShell pageNum={5} subtitle="Commercial Proposal (Final Terms & Authorization)">
        <div className="space-y-5 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          {/* Terms and Conditions */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1.5">
              Terms and Conditions:
            </h3>
            <div className="space-y-1 pl-4 text-slate-800 text-[11px]">
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>Payment schedule 40% advance against PO , 20% after Site Completion and 40% against Report Submission</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>Applicable taxes and duties will be extra</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>Boarding and Travel Expenses are inclusive .</span>
              </p>
            </div>
          </div>

          {/* Submitted By */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs">Submitted by,</h4>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Logo" className="h-10 w-auto object-contain" />
            </div>
            <div className="space-y-0.5 text-xs text-slate-900 pt-0.5">
              <p className="font-black text-slate-950 text-sm">Thanakarthik</p>
              <p className="font-semibold text-slate-700">Founder &amp; Managing Director</p>
              <p className="font-mono text-slate-800">+91-8377007638</p>
              <p className="text-slate-600 font-mono">thanakarthik@sustainabyte.ai</p>
            </div>
          </div>

          {/* Bank Details */}
          <div className="space-y-1.5 pt-2">
            <h4 className="font-bold text-slate-900 text-xs underline underline-offset-4">Bank Account details:</h4>
            <div className="space-y-0.5 text-xs text-slate-800 font-mono">
              <p><strong className="text-slate-900">Bank</strong> – Bank of Baroda</p>
              <p><strong className="text-slate-900">Account Number</strong> – 35860200000750</p>
              <p><strong className="text-slate-900">IFSC</strong> – BARB0VELACH (fifth letter is ZERO)</p>
              <p><strong className="text-slate-900">Branch</strong> – VELACHERY BRANCH</p>
              <p><strong className="text-slate-900">GSTIN NO</strong> – 33ABNCS4869A1Z7</p>
              <p><strong className="text-slate-900">PAN Number</strong> – ABNCS4869A</p>
            </div>
          </div>

          {/* THANK YOU */}
          <div className="pt-6 text-center border-t border-slate-100">
            <p className="text-base font-black uppercase tracking-widest text-slate-900">THANK YOU</p>
          </div>
        </div>
      </PageShell>
    </>
  );
}

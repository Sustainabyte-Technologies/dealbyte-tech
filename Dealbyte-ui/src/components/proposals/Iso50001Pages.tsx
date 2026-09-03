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
  const totalPages = 6;

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
          <div className="space-y-4 flex-1">{children}</div>
          <div className="text-center pt-3">
            <span className="text-[12px] text-slate-500">{pageNum}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const PageLogo = () => (
    <div className="flex justify-end pb-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Pvt Ltd" className="h-14 w-auto object-contain" />
    </div>
  );

  return (
    <>
      {/* ── PAGE 1: COVER PAGE ── */}
      <PageShell pageNum={1}>
        <PageLogo />
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
          <h1 className="text-[22px] font-bold text-black underline underline-offset-4 decoration-1 leading-relaxed">
            Techno Commercial Proposal for Energy Management System (ISO 50001)
          </h1>
          {(proposal as any)?.clientLogo && (
            <div className="py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={(proposal as any).clientLogo} alt={`${deal?.clientName || 'Client'} Logo`} className="max-h-[120px] w-auto object-contain mx-auto" />
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

      {/* ── PAGE 3: SCOPE OF WORK (PILLARS 1-5) ── */}
      <PageShell pageNum={3}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">Scope of Work:</h2>
          <p className="font-bold text-[12px] text-black mb-1">Energy Management System</p>
          <p className="text-[12px] text-black mb-2 italic">This Energy Management System includes:</p>

          <div className="space-y-2.5 text-[11.5px] text-black leading-relaxed">
            <div>
              <p className="font-bold">1. Energy Review &amp; Baseline Establishment</p>
              <ul className="pl-6 list-disc space-y-0.5">
                <li>Conduct a detailed energy review of all major energy-consuming systems.</li>
                <li>Develop the Energy Baseline (EnB) based on historical data.</li>
                <li>Identify Significant Energy Uses (SEUs) and opportunities for improvement.</li>
              </ul>
            </div>

            <div>
              <p className="font-bold">2. Energy Performance Indicators (EnPIs) Development</p>
              <ul className="pl-6 list-disc space-y-0.5">
                <li>Define suitable EnPIs for monitoring and evaluating energy performance.</li>
                <li>Establish system for periodic tracking and reporting.</li>
              </ul>
            </div>

            <div>
              <p className="font-bold">3. Gap Analysis &amp; Compliance Assessment</p>
              <ul className="pl-6 list-disc space-y-0.5">
                <li>Perform a gap analysis of current practices against ISO 50001 requirements.</li>
                <li>Provide a roadmap and action plan to achieve compliance.</li>
              </ul>
            </div>

            <div>
              <p className="font-bold">4. Energy Management System Documentation</p>
              <ul className="pl-6 list-disc space-y-0.5">
                <li>Prepare and implement mandatory ISO 50001 documents: Energy Policy, Procedures, SOPs, Roles/Responsibilities, Risk assessment.</li>
                <li>Create templates for monitoring, measurement, and reporting.</li>
              </ul>
            </div>

            <div>
              <p className="font-bold">5. Training &amp; Capacity Building</p>
              <ul className="pl-6 list-disc space-y-0.5">
                <li>Conduct awareness training for employees at all levels.</li>
                <li>Conduct specialized training for the Energy Team on EnMS implementation and SEU management.</li>
              </ul>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: CONTINUATION SCOPE & CLIENTS ── */}
      <PageShell pageNum={4}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div className="space-y-2 text-[11.5px] text-black leading-relaxed">
            <div>
              <p className="font-bold">6. Identification of Energy Saving Opportunities</p>
              <ul className="pl-6 list-disc space-y-0.5">
                <li>Evaluate operational controls, processes, and equipment efficiency.</li>
                <li>Provide a detailed list of energy conservation measures (ECMs) with estimated savings.</li>
              </ul>
            </div>

            <div>
              <p className="font-bold">7. Internal Audit Preparation &amp; Support</p>
              <ul className="pl-6 list-disc space-y-0.5">
                <li>Develop an internal audit plan, checklist, and guidelines.</li>
                <li>Conduct mock/internal audits and issue audit reports.</li>
              </ul>
            </div>

            <div>
              <p className="font-bold">8. Management Review Facilitation</p>
              <ul className="pl-6 list-disc space-y-0.5">
                <li>Guide management review meetings as per ISO 50001 requirements.</li>
                <li>Ensure top management involvement and decision-making for continual improvement.</li>
              </ul>
            </div>

            <div>
              <p className="font-bold">9. Implementation Monitoring &amp; Corrective Actions</p>
              <ul className="pl-6 list-disc space-y-0.5">
                <li>Review implementation status, assign corrective actions, and track closure.</li>
                <li>Update EnMS documents based on feedback.</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Energy Monitoring System Implementation:
            </h2>
            <ul className="pl-6 list-disc space-y-1 text-[12px] text-black">
              <li>Creating Basic Energy Monitoring infrastructure including connecting 2 existing energy meters and additional 6 Energy meters and applicable modems and consumables.</li>
              <li>Implementing equipment level energy monitoring system using meters with critical alerts and alarms.</li>
              <li>Providing Custom dashboards and enabling alerts &amp; reports.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              List of Customers:
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-[11px] text-black">
              {ISO_50001_CLIENTS_LIST.map((client, idx) => (
                <div key={idx} className="flex items-start gap-1">
                  <span className="font-bold shrink-0">{idx + 1}.</span>
                  <span className="leading-tight">{client}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 5: COMMERCIALS ── */}
      <PageShell pageNum={5}>
        <PageLogo />
        <div className="space-y-5 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-3">
              Commercials:
            </h2>
            <table className="w-full border-collapse border border-black text-[12px] text-black">
              <thead>
                <tr className="bg-[#C6EFCE]">
                  <th className="border border-black py-2 px-3 text-center font-bold w-14">S.No</th>
                  <th className="border border-black py-2 px-3 text-left font-bold">Scope Description</th>
                  <th className="border border-black py-2 px-3 text-center font-bold w-28">Project Timeline</th>
                  <th className="border border-black py-2 px-3 text-right font-bold w-32">Customer Price (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black py-2 px-3 text-center">1</td>
                  <td className="border border-black py-2 px-3">
                    <p className="font-bold">Energy Management System (ISO 50001) Implementation &amp; Energy Monitoring</p>
                    <ul className="text-[11px] list-disc pl-4 mt-1 space-y-0.5">
                      <li>9-Pillar ISO 50001 EnMS Gap Analysis, Documentation &amp; Internal Audit Preparation</li>
                      <li>Energy Monitoring System Infrastructure (2 Existing + 6 Additional Meters)</li>
                      <li>SEU Identification, EnPIs Development, Custom Dashboards, Alerts &amp; Reports</li>
                    </ul>
                  </td>
                  <td className="border border-black py-2 px-3 text-center">4–6 Weeks</td>
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
        </div>
      </PageShell>

      {/* ── PAGE 6: TERMS, SUBMITTED BY & BANK DETAILS ── */}
      <PageShell pageNum={6}>
        <PageLogo />
        <div className="space-y-5 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-3">
              Terms and Conditions:
            </h2>
            <ul className="space-y-1.5 text-[12px] text-black list-disc pl-8 leading-relaxed">
              <li>Payment schedule 40% advance against PO , 20% after Site Completion and 40% against Report Submission</li>
              <li>Applicable taxes and duties will be extra</li>
              <li>Boarding and Travel Expenses are inclusive.</li>
            </ul>
          </div>

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

          <div className="space-y-1 text-[12px] text-black">
            <p className="font-bold">Bank Account details:</p>
            <p>Bank – Bank of Baroda</p>
            <p>Account Number – 35860200000750</p>
            <p>IFSC – BARB0VELACH (fifth letter is ZERO)</p>
            <p>Branch – VELACHERY BRANCH</p>
            <p>GSTIN NO – 33ABNCS4869A1Z7</p>
            <p>PAN Number – ABNCS4869A</p>
          </div>

          <div className="text-center pt-4">
            <p className="text-[18px] font-black uppercase tracking-widest text-black">THANK YOU</p>
          </div>
        </div>
      </PageShell>
    </>
  );
}

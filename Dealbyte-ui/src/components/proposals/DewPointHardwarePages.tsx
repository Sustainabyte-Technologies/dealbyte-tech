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
  const totalPages = 5;

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

  const PageLogo = () => (
    <div className="flex justify-end pb-2 shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Pvt Ltd" className="h-14 w-auto object-contain" />
    </div>
  );

  return (
    <>
      {/* ── PAGE 1: COVER PAGE ── */}
      <PageShell pageNum={1}>
        <PageLogo />
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 my-auto">
          <h1 className="text-[22px] font-bold text-black underline underline-offset-4 decoration-1 leading-relaxed">
            Techno Commercial Proposal for Supply of Dew Point Sensor
          </h1>
          {(proposal as any)?.clientLogo && (
            <div className="py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={(proposal as any).clientLogo} alt={`${deal?.clientName || 'Client'} Logo`} className="max-h-[120px] w-auto object-contain mx-auto" />
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

      {/* ── PAGE 3: SCOPE OF WORK & BENEFITS ── */}
      <PageShell pageNum={3}>
        <PageLogo />
        <div className="space-y-5 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-3">Scope of Work:</h2>
            <p className="text-[12px] text-black leading-relaxed">
              In this Current proposal, the scope of work is for the supply of an dew point sensor excluding installation and commissioning focuses solely on delivering the hardware to the specified site. This includes product specifications, delivery requirements, documentation, and quality standards, ensuring the meter is ready for later installation by others.
            </p>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-3">How are we different from other suppliers?</h2>
            <ul className="space-y-1.5 text-[12px] text-black list-disc pl-8 leading-relaxed">
              <li><strong>End-to-end support:</strong> Sustainabyte assists with installation and commissioning, ensuring timely project completion.</li>
              <li><strong>IoT based insights:</strong> Sustainabyte offers support for an IoT-based real-time online monitoring dashboard.</li>
              <li><strong>Energy Savings:</strong> Sustainabyte evaluates and guides industries in achieving energy savings.</li>
              <li><strong>Custom Visualization:</strong> The dashboard&apos;s visualization can be tailored to meet each customer&apos;s specific requirements.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-3">Potential benefits of our platform:</h2>
            <ul className="space-y-1.5 text-[12px] text-black list-disc pl-8 leading-relaxed">
              <li><strong>Up Time</strong> – Equipment Downtime reduction</li>
              <li><strong>Energy Savings</strong> – Up to 20% Energy Savings</li>
              <li><strong>Operation Cost</strong> – Up to 15% Reduction</li>
              <li><strong>Manpower</strong> – Up to 20% Optimization</li>
              <li><strong>Machine Life</strong> – Up to 25% Enhancement</li>
            </ul>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: DASHBOARD VIEWS ── */}
      <PageShell pageNum={4}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1">Dashboard View:</h2>
          <div className="space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dashboard1.png" alt="Optibyte Global Consumption & Hourly Trend Dashboard" className="w-full h-auto object-contain border border-slate-300" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dashboard2.png" alt="Optibyte Real-Time Process Parameters & Telemetry Dashboard" className="w-full h-auto object-contain border border-slate-300" />
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 5: COMMERCIALS, TERMS & BANK DETAILS ── */}
      <PageShell pageNum={5}>
        <PageLogo />
        <div className="space-y-5 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-3">Commercials:</h2>
            <table className="w-full border-collapse border border-black text-[12px] text-black">
              <thead>
                <tr className="bg-[#C6EFCE]">
                  <th className="border border-black py-2 px-3 text-center font-bold w-14">S.No</th>
                  <th className="border border-black py-2 px-3 text-left font-bold">Scope Description</th>
                  <th className="border border-black py-2 px-3 text-center font-bold w-28">Delivery Period</th>
                  <th className="border border-black py-2 px-3 text-right font-bold w-32">Customer Price (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black py-2 px-3 text-center">1</td>
                  <td className="border border-black py-2 px-3">
                    <p className="font-bold">Supply of Dew Point Sensor</p>
                    <p className="text-[11px]">Supply of precision calibrated dew point sensor hardware with manufacturer documentation, quality standards, and technical data sheets ready for site integration.</p>
                  </td>
                  <td className="border border-black py-2 px-3 text-center">6–8 Weeks</td>
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
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-3">Terms and Conditions:</h2>
            <ul className="space-y-1.5 text-[12px] text-black list-disc pl-8 leading-relaxed">
              <li>Payment schedule: 100% payment for hardware advance against the PO.</li>
              <li>Applicable taxes and duties will be extra</li>
              <li>Delivery Period: Within 6-8 weeks from date of receipt of advance along with P.O.</li>
              <li>Installation &amp; Commissioning will be done at extra cost</li>
              <li>Warranty: 12 months from the date of supply.</li>
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

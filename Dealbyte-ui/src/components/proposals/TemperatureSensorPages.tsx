'use client';

import React from 'react';
import { getClientPresetLogo } from '@/components/costing/constants';

interface TemperatureSensorPagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
  costingSheet?: any;
  clientLogo?: string | null;
  clientName?: string;
}

export function TemperatureSensorPages({
  deal,
  proposal,
  proposalRef,
  proposalDate,
  finalPrice,
  formatCurrency,
  costingSheet: propCostingSheet,
  clientLogo,
  clientName: passedClientName,
}: TemperatureSensorPagesProps) {
  const totalPages = 6;

  const clientName =
    passedClientName ||
    deal?.clientName ||
    (proposal as any)?.clientName ||
    proposal?.quote?.deal?.clientName ||
    'Valued Client';

  const resolvedClientLogo =
    clientLogo ||
    (proposal as any)?.clientLogo ||
    (proposal as any)?.deal?.clientLogo ||
    (deal as any)?.clientLogo ||
    (proposal?.quote as any)?.clientLogo ||
    getClientPresetLogo(clientName);

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

  // Extract hardware line items or fallback to dynamic defaults
  const rawHwRows: any[] =
    costingSheet.hardwareRows ||
    costingSheet.iotControlsHardwareRows ||
    costingSheet.emsGatewayHardwareRows ||
    costingSheet.instrumentRows?.hardwareRows ||
    [];
  const activeHwRows = rawHwRows.filter((r) => Number(r.quantity || r.qty || 0) > 0);

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
      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 1: COVER PAGE                                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={1}>
        <PageLogo />

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 my-auto">
          <h1 className="text-[22px] font-bold text-black underline underline-offset-4 decoration-1 leading-relaxed max-w-xl">
            Techno Commercial Proposal for Cold Storage Temperature &amp; Humidity Monitoring Solution
          </h1>

          <div className="py-2 flex flex-col items-center justify-center space-y-3">
            {resolvedClientLogo ? (
              <div className="py-2 max-w-[280px] max-h-[130px] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolvedClientLogo}
                  alt={`${clientName} Logo`}
                  className="max-h-[120px] max-w-full object-contain mx-auto"
                />
              </div>
            ) : null}
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Prepared for</p>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{clientName}</h2>
            </div>
          </div>

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

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 2: ABOUT SUSTAINABYTE                                        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
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
              Sustainabyte.ai is dedicated to leveraging advanced technology for global sustainability. Our mission is to minimize environmental impact while enhancing operational efficiency through innovative solutions.
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

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 3: OBJECTIVE & SCOPE OF WORK (PART 1)                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={3}>
        <PageLogo />

        <div className="space-y-4 flex-1">
          {/* Section 2: Objective */}
          <div>
            <h2 className="text-[15px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              2. Objective
            </h2>
            <p className="text-[11.5px] text-black mb-1.5 font-medium">The primary objectives of this project are:</p>
            <ul className="space-y-1 text-[11px] text-black list-disc pl-6 leading-snug">
              <li><strong>Product Safety &amp; Quality:</strong> Ensure freshness and compliance with food safety standards.</li>
              <li><strong>Real-Time Monitoring:</strong> Continuous tracking of temperature and humidity via IoT sensors.</li>
              <li><strong>Alerts &amp; Notifications:</strong> Immediate alerts through SMS/email/app in case of deviations.</li>
              <li><strong>Data Analytics &amp; Reports:</strong> Historical data analysis for audits, compliance, and trend insights.</li>
              <li><strong>Operational Efficiency:</strong> Reduced manual checks and labor dependency.</li>
              <li><strong>Energy Savings:</strong> Optimizing cold storage operation and preventing overuse of compressors.</li>
              <li><strong>Reduced Wastage:</strong> Minimizes product spoilage and financial loss.</li>
            </ul>
          </div>

          {/* Section 3: Scope of Work (3.1 to 3.3) */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <h2 className="text-[15px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              3. Scope of Work
            </h2>

            <div>
              <p className="text-[12px] font-bold text-black">3.1 Site Survey &amp; Assessment</p>
              <ul className="space-y-0.5 text-[11px] text-black list-disc pl-6 leading-snug">
                <li>Conduct an initial survey of cold storage facilities.</li>
                <li>Identify critical monitoring points (storage chambers, loading/unloading areas, sensitive product zones).</li>
                <li>Assess existing infrastructure, connectivity options (GSM) and power availability.</li>
              </ul>
            </div>

            <div>
              <p className="text-[12px] font-bold text-black">3.2 Sensor Deployment</p>
              <ul className="space-y-0.5 text-[11px] text-black list-disc pl-6 leading-snug">
                <li>Supply and install IoT-enabled temperature and humidity sensors in designated cold storage units.</li>
                <li>Ensure calibration and testing for accuracy and reliability.</li>
                <li>Position sensors strategically for optimal coverage.</li>
              </ul>
            </div>

            <div>
              <p className="text-[12px] font-bold text-black">3.3 Connectivity &amp; Data Transmission</p>
              <ul className="space-y-0.5 text-[11px] text-black list-disc pl-6 leading-snug">
                <li>Establish reliable connectivity (Wi-Fi/GSM/LoRa) for real-time data transfer.</li>
                <li>Deploy IoT gateways (if required) for multi-sensor integration.</li>
                <li>Ensure secure and encrypted data transmission to Sustainabyte Cloud Platform.</li>
              </ul>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 4: SCOPE OF WORK (PART 2) & APPROACH                          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={4}>
        <PageLogo />

        <div className="space-y-4 flex-1">
          {/* Section 3 Continued: 3.4 to 3.7 */}
          <div className="space-y-2.5">
            <h2 className="text-[15px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              3. Scope of Work (Continued)
            </h2>

            <div>
              <p className="text-[12px] font-bold text-black">3.4 Centralized Dashboard &amp; Analytics</p>
              <p className="text-[11px] text-black leading-snug mb-1">
                Provide a cloud-based dashboard accessible via web and mobile. Features include:
              </p>
              <ul className="space-y-0.5 text-[11px] text-black list-disc pl-6 leading-snug">
                <li>Real-time monitoring of temperature and humidity.</li>
                <li>Threshold-based alerts (SMS, Email, Mobile App).</li>
                <li>Data storage and retrieval for historical analysis.</li>
                <li>Graphs, trend analysis, and audit-ready reports.</li>
              </ul>
            </div>

            <div>
              <p className="text-[12px] font-bold text-black">3.5 Alerts &amp; Notifications</p>
              <ul className="space-y-0.5 text-[11px] text-black list-disc pl-6 leading-snug">
                <li>Configure alert thresholds for each storage unit.</li>
                <li>Provide instant notifications to designated personnel in case of deviation.</li>
                <li>Enable escalation matrix (if first alert not acknowledged).</li>
              </ul>
            </div>

            <div>
              <p className="text-[12px] font-bold text-black">3.6 Reporting &amp; Compliance</p>
              <ul className="space-y-0.5 text-[11px] text-black list-disc pl-6 leading-snug">
                <li>Automated daily, weekly, and monthly reports.</li>
                <li>Exportable data for audits and regulatory compliance.</li>
                <li>Custom report generation as per client requirements.</li>
              </ul>
            </div>

            <div>
              <p className="text-[12px] font-bold text-black">3.7 Maintenance &amp; Support</p>
              <ul className="space-y-0.5 text-[11px] text-black list-disc pl-6 leading-snug">
                <li>Provide ongoing technical support and troubleshooting.</li>
                <li>Remote monitoring and health check of devices.</li>
                <li>Annual calibration and servicing of sensors.</li>
                <li>Replacement of faulty devices (under SLA).</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Approach */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <h2 className="text-[15px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              4. Approach
            </h2>

            <div className="space-y-1.5 text-[11px] text-black">
              <div>
                <p className="font-bold text-[11.5px]">1. Implementation</p>
                <ul className="list-disc pl-6 space-y-0.5">
                  <li>Install and calibrate temperature &amp; humidity sensors.</li>
                  <li>Connect and integrate sensors with the IoT gateway / communication module.</li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-[11.5px]">2. Monitoring &amp; Validation</p>
                <ul className="list-disc pl-6 space-y-0.5">
                  <li>Capture real-time operational data.</li>
                  <li>Compare trends against manual records for accuracy.</li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-[11.5px]">3. Review &amp; Sign-off</p>
                <ul className="list-disc pl-6 space-y-0.5">
                  <li>Present results and reports via the Optibyte AI platform.</li>
                  <li>Obtain client approval for full-scale rollout.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 5: DELIVERABLES, ADVANTAGE & CONCLUSION                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={5}>
        <PageLogo />

        <div className="space-y-4 flex-1">
          {/* Section 5: Deliverables */}
          <div className="space-y-2">
            <h2 className="text-[15px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              5. Deliverables
            </h2>

            <div>
              <p className="text-[12px] font-bold text-black mb-1">One-time services</p>
              <ul className="space-y-1 text-[11.5px] text-black list-disc pl-6 leading-snug">
                <li>Commissioning IoT sensors across cold storage units.</li>
                <li>Fully functional cloud-based dashboard.</li>
                <li>User access credentials for client staff.</li>
                <li>Alert and notification system configured as per the operations team.</li>
                <li>Documentation including system architecture, user manual, and troubleshooting guide.</li>
              </ul>
            </div>

            <div className="pt-1">
              <p className="text-[12px] font-bold text-black mb-1">Full-Scale Deployment of Optibyte</p>
              <ul className="space-y-1 text-[11.5px] text-black list-disc pl-6 leading-snug">
                <li>Implement a complete AI and IoT-based platform for a cold storage monitoring solution.</li>
                <li>Optibyte will deliver advanced, in-depth, AI/ML-enabled insights and analytics to drive continuous energy optimization.</li>
              </ul>
            </div>
          </div>

          {/* Section 6: Advantage */}
          <div className="pt-2 border-t border-slate-200 space-y-1.5">
            <h2 className="text-[15px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              6. Advantage
            </h2>
            <ul className="space-y-1 text-[11.5px] text-black list-disc pl-6 leading-snug">
              <li>Prevents product spoilage by real-time detection of anomalies.</li>
              <li>Reduces manual monitoring workload.</li>
              <li>Provides compliance-ready data.</li>
              <li>Enhances brand reputation through food safety assurance.</li>
            </ul>
          </div>

          {/* Section 7: Conclusion */}
          <div className="pt-2 border-t border-slate-200 space-y-1.5">
            <h2 className="text-[15px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              7. Conclusion
            </h2>
            <p className="text-[11.5px] text-black leading-relaxed">
              The proposed approach ensures a systematic and scalable implementation of Cold storage monitoring. This will validate technical feasibility and establish a strong foundation for a full-scale digitalization initiative using AI &amp; IoT Platform, Optibyte.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* PAGE 6: COMMERCIALS, SUPPORT, TERMS & BANK DETAILS                 */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <PageShell pageNum={6}>
        <PageLogo />

        <div className="space-y-3.5 flex-1 text-[11px] text-black">
          {/* Commercials Table */}
          <div>
            <h2 className="text-[15px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Commercials:
            </h2>
            <table className="w-full border-collapse border border-black text-[11px] text-black">
              <thead>
                <tr className="bg-[#C6EFCE]">
                  <th className="border border-black py-1.5 px-2 text-center font-bold w-12">S.No</th>
                  <th className="border border-black py-1.5 px-2 text-left font-bold">Description</th>
                  <th className="border border-black py-1.5 px-2 text-center font-bold w-16">Quantity</th>
                  <th className="border border-black py-1.5 px-2 text-right font-bold w-28">Price (INR)</th>
                </tr>
              </thead>
              <tbody>
                {activeHwRows.length > 0 ? (
                  activeHwRows.map((r, idx) => (
                    <tr key={idx}>
                      <td className="border border-black py-1.5 px-2 text-center">{idx + 1}</td>
                      <td className="border border-black py-1.5 px-2">
                        <p className="font-bold">{r.productDescription || r.description || 'Supply of Temperature & Humidity Sensor'}</p>
                      </td>
                      <td className="border border-black py-1.5 px-2 text-center">{r.quantity || r.qty || 1}</td>
                      <td className="border border-black py-1.5 px-2 text-right font-bold">
                        {(Number(r.customerPrice) || (Number(r.unitPrice || 0) * Number(r.quantity || 1)) || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td className="border border-black py-1.5 px-2 text-center">1</td>
                      <td className="border border-black py-1.5 px-2">
                        <p className="font-bold">Supply of Temperature &amp; Humidity IoT Sensors &amp; Gateway Modules</p>
                        <p className="text-[10px]">Supply of precision temperature and humidity sensors with calibrated accuracy, telemetry gateway, and site accessories.</p>
                      </td>
                      <td className="border border-black py-1.5 px-2 text-center">1 Lot</td>
                      <td className="border border-black py-1.5 px-2 text-right font-bold">
                        {finalPrice > 0 ? formatCurrency(finalPrice) : '₹ 1,50,000.00'}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
              <tfoot>
                <tr className="font-bold bg-slate-50">
                  <td colSpan={3} className="border border-black py-1.5 px-2 text-center font-bold text-[11.5px]">
                    Total
                  </td>
                  <td className="border border-black py-1.5 px-2 text-right font-bold text-[11.5px]">
                    {formatCurrency(finalPrice && finalPrice > 0 ? finalPrice : 150000)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Support Required From Client */}
          <div>
            <h3 className="text-[12px] font-bold text-black mb-1">
              Support required from the client:
            </h3>
            <ul className="space-y-0.5 text-[10.5px] text-black list-disc pl-5 leading-tight">
              <li>SPOC (Single point of Contact) for support and coordination during the installation and Commissioning phase.</li>
              <li>Installation from the client side.</li>
              <li>SPOC to review alerts and Reports as per requirements.</li>
              <li>Accessibility to each area.</li>
              <li>1 person required from the client side with knowledge of electrical routing, and provide manual support to lay the cable.</li>
            </ul>
          </div>

          {/* Terms and Conditions */}
          <div>
            <h3 className="text-[12px] font-bold text-black mb-1">
              Terms and Conditions:
            </h3>
            <ul className="space-y-0.5 text-[10.5px] text-black list-disc pl-5 leading-tight">
              <li><strong>Payment schedule:</strong> Supply of hardware – 100% upfront; Software Charges – 70% advance against the PO, and the remaining 30% after Dashboard confirmation by the client.</li>
              <li>Applicable taxes and duties will be extra.</li>
              <li>The timelines for execution will be mutually discussed and agreed upon during the project kick-off discussion.</li>
              <li>All kinds of authority approvals, work permission, and site passes if required.</li>
              <li>The client should coordinate with any third-party contractors&apos; coordination at the site.</li>
              <li>Secure onsite storage area and all soft integration support.</li>
              <li>Post installation and commission, any site visit for maintenance and troubleshooting will be charged as actual (i.e., after the first year).</li>
              <li>Any material beyond the current scope will be charged as actuals.</li>
            </ul>
          </div>

          {/* Submitted By & Bank Account Details */}
          <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-300 text-[10.5px]">
            <div className="space-y-1">
              <p className="font-bold text-black">Submitted by,</p>
              <div className="flex items-center gap-2 py-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Pvt Ltd" className="h-8 w-auto object-contain" />
              </div>
              <p className="font-bold">Mr. Thanakarthik Kumar K</p>
              <p>Founder &amp; Managing Director</p>
              <p>Call: +91-8377007638</p>
              <p>Mail: thanakarthik@sustainabyte.ai</p>
            </div>

            <div className="space-y-0.5 bg-slate-50 p-2 border border-slate-300 rounded text-[10px]">
              <p className="font-bold text-black border-b border-slate-200 pb-0.5 mb-0.5">Bank Account details:</p>
              <p>Bank: Bank of Baroda</p>
              <p>Account Number: 35860200000750</p>
              <p>IFSC: BARB0VELACH (fifth letter is ZERO)</p>
              <p>Branch: VELACHERY BRANCH</p>
              <p>GSTIN NO: 33ABNCS4869A1Z7</p>
              <p>PAN Number: ABNCS4869A</p>
            </div>
          </div>

          {/* THANK YOU */}
          <div className="text-center pt-1">
            <p className="text-[14px] font-black uppercase tracking-widest text-black">THANK YOU</p>
          </div>
        </div>
      </PageShell>
    </>
  );
}

'use client';

import React from 'react';

interface CpmProposalPagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
}

export function CpmProposalPages({
  deal,
  proposal,
  proposalRef,
  proposalDate,
  finalPrice,
  formatCurrency,
}: CpmProposalPagesProps) {
  const totalPages = 8;

  const PageHeader = ({ subtitle = 'Central Plant Monitoring (CPM) System Proposal' }: { subtitle?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2 gap-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
        <h2 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
          {deal?.clientName || 'Valued Client'} — Central Plant Monitoring (CPM)
        </h2>
        <div className="text-[10.5px] font-mono text-slate-500 mt-0.5 flex items-center gap-2">
          <span>Ref: <strong>{proposalRef}</strong></span>
          <span>•</span>
          <span>Date: <strong>{proposalDate}</strong></span>
        </div>
      </div>
      <div className="flex items-center justify-end shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Logo" className="h-10 sm:h-12 w-auto object-contain" />
      </div>
    </div>
  );

  const PageFooter = ({ pageNum }: { pageNum: number }) => (
    <div className="relative z-10 border-t border-slate-200 pt-2.5 mt-3 flex items-center justify-between text-[9.5px] text-slate-400 font-medium">
      <span>Quotation No: <strong>{proposalRef}</strong></span>
      <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page {pageNum} of {totalPages}</span>
    </div>
  );

  const PageShell = ({ pageNum, subtitle, children }: { pageNum: number; subtitle?: string; children: React.ReactNode }) => (
    <div
      className="proposal-page relative z-10 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-[800px] mx-auto text-slate-800 h-[1130px] min-h-[1130px] max-h-[1130px] flex flex-col justify-between overflow-hidden"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <div className="border-2 border-slate-900 p-4 sm:p-6 flex-1 flex flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.14] bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/watermark-transparent.png')", backgroundSize: 'contain' }}
          aria-hidden="true"
        />
        <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-2.5">
            <PageHeader subtitle={subtitle} />
            {children}
          </div>
        </div>
        <PageFooter pageNum={pageNum} />
      </div>
    </div>
  );

  const allClients = [
    'Mazaya Business Avenue, Dubai',
    'ASHRAE Level 2 audit at 6 Commercial Buildings, Dubai',
    'Danat Al Emarat Hospital, Dubai by Aatral',
    'Suzlon Energy Pvt Ltd',
    'Velmurugan Industries Ltd',
    'Capital Land by Orien Energy',
    'Casagrand Eco Tech, Sholinganallur',
    'Tidal Park, Pattabiram',
    'TNQ Software, Tharamani',
    'Embassy Tech Village, Kadubisenahalli, Bengaluru',
    'Embassy ETZ, Pune',
    'Firstsource Limited, Vijayawada',
    'Firstsource Limited, Hyderabad',
    'Firstsource Limited, Chennai',
    'Valeo Software, Sholinganallur',
    'Solidpro, Chennai',
    'SRM University, Chennai',
    'Development Environergy Services Limited - IIT Hyderabad',
    'Aatral Engineering',
    'Velmurugan Heavy Engineering Industries Pvt Ltd',
    '20cube Logistics Solutions Pvt Ltd',
    'Danfoss Industries Pvt Ltd',
    'Knowledge Bridge',
    'S G Snacks India Pvt Ltd',
    'Parekhplast India Limited',
    'PMEL Oragadam Pvt Ltd - Unit 3 & 4',
    'Lucas TVS Limited - Padi',
    'Visalam Technologies LLP',
    'Adspaas Polymer Solutions Limited',
    'Wheels India Limited',
    'India Metal One Steel Plate Processing Pvt Ltd',
    'Aisan Auto Parts India Pvt Ltd',
    'Whirlpool of India Limited',
    'ITC - Medak Ltd',
    'Kone Elevator India Pvt Ltd',
    'KPR Mill Limited',
    'Concorde Textiles Ltd',
    'Arni Engineering Tech Pvt Ltd',
    'Growserve Enterprises - Ashirwad',
    'Vashi Integrated Solutions Limited',
    'Ahlstrom Fiber Composite Pvt Ltd',
  ];

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

          <div className="relative z-10 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-4 gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Official Commercial Proposal
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 uppercase">
                  Central Plant Monitoring (CPM) System
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
                  Service Scope: <span className="font-bold text-slate-800">Chiller Management / CPM (Central Plant Monitoring)</span>
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
            <div className="space-y-2.5 pt-1">
              <h3 className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight text-base">
                About Sustainabyte:
              </h3>
              <div className="space-y-2.5 text-slate-800 font-normal text-left text-[11px] leading-relaxed">
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

          <div className="relative z-10 border-t border-slate-200 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Quotation No: <strong>{proposalRef}</strong></span>
            <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page 1 of {totalPages}</span>
          </div>
        </div>
      </div>

      {/* ── PAGE 2: CPM SYSTEM ARCHITECTURE DIAGRAM ── */}
      <PageShell pageNum={2} subtitle="Annexure – II: Central Plant Monitoring (CPM) System Architecture">
        <div className="space-y-3 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2">
              Central Plant Monitoring (CPM) System Architecture:
            </h3>

            {/* Architecture Diagram */}
            <div className="w-full rounded-xl border border-slate-300 overflow-hidden bg-white p-2 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cpm-architecture.png"
                alt="Central Plant Monitoring (CPM) System Architecture"
                className="w-full h-auto max-h-[500px] object-contain rounded-lg mx-auto"
              />
            </div>

            {/* Key Architecture Notes */}
            <div className="mt-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1 text-[9.5px] text-slate-800">
              <p className="font-bold text-slate-950 text-[10px]">Key System Architecture Specifications:</p>
              <p className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold shrink-0">•</span>
                <span><strong>Field Equipment Integration:</strong> All field devices (water cooled chillers, primary/secondary pumps, condenser water pumps, cooling tower fans, makeup pump) connect to the DDC Panel using hardwired I/O.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold shrink-0">•</span>
                <span><strong>Energy Meters (Soft Integration):</strong> Energy meters connected directly to DDC Panel via Modbus RTU (RS485) network for power monitoring and telemetry.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold shrink-0">•</span>
                <span><strong>DDC Panel &amp; Local Server:</strong> DDC Panel publishes data to Local Server / Workstation (MQTT Broker) over the local LAN switch for local visualization (Web HMI).</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold shrink-0">•</span>
                <span><strong>Cloud Uplink:</strong> Local server securely forwards telemetry to the Sustainabyte Cloud Platform through HTTPS (REST API) for real-time dashboarding and AI-driven chiller optimization.</span>
              </p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 3: ANNEXURE I — COMMERCIAL INVESTMENT (DYNAMIC CURRENT CPM COST) ── */}
      <PageShell pageNum={3} subtitle="Annexure – I: Commercial Investment & Bill of Quantities">
        <div className="space-y-3 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2">
              Annexure – I: Commercial Investment (Current CPM Cost)
            </h3>

            {/* Commercials Table */}
            <div className="border border-slate-900 rounded-xl overflow-hidden text-xs shadow-xs mb-3">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white font-extrabold text-[10.5px] tracking-wide">
                  <tr>
                    <th className="py-2 px-3 text-center w-12">S.No</th>
                    <th className="py-2 px-4 w-3/5">Scope Description</th>
                    <th className="py-2 px-3 text-center">Delivery Period</th>
                    <th className="py-2 px-4 text-right w-36">Customer Price (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 text-xs">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700 align-top">1</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900 leading-relaxed align-top">
                      <p className="font-bold text-slate-950 text-xs mb-0.5">
                        Central Plant Monitoring (CPM) System &amp; Chiller Automation
                      </p>
                      <p className="text-[10px] text-slate-600 font-normal leading-relaxed">
                        Complete turn-key supply: Server PC / Workstation with 21&quot; Colour Monitor, Sensor package (RTD, Pressure transmitters, Flow Switches), DDC Controller Panels with I/O modules, Shielded twisted-pair RS-485 cable, GI Cable Trays (300mm &amp; 100mm), PVC conduit &amp; flexible hoses, installation charges, testing &amp; commissioning, software licenses, and cloud application charges.
                      </p>
                    </td>
                    <td className="py-2.5 px-3 text-center font-medium text-slate-700 align-top text-xs">
                      10–12 Weeks
                    </td>
                    <td className="py-2.5 px-4 text-right font-black text-slate-950 text-sm align-top">
                      {formatCurrency(finalPrice)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-slate-900 text-white p-2.5 px-5 flex justify-between items-center font-extrabold text-xs sm:text-sm">
                <span className="tracking-wide uppercase text-xs">TOTAL COMMERCIAL INVESTMENT</span>
                <span className="text-emerald-400 text-base sm:text-lg font-black tracking-tight">
                  {formatCurrency(finalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Technical & Commercial Notes */}
          <div className="space-y-1.5 pt-1 border-t border-slate-200">
            <h4 className="font-bold text-slate-950 text-xs underline underline-offset-4">
              Notes &amp; Assumptions:
            </h4>
            <div className="space-y-1 pl-2 text-slate-800 text-[10px] leading-relaxed">
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Cabling quantity is considered as per BOQ/Thumb-rule Basis. Any increase/decrease in the quantity shall be billed against the consumed quantity after complete execution of project.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Controller quantity is calculated as per the provided IO summary/equipment quantity, any changes in the same will have price impact.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Mod-bus card for the VFD/ chiller in client&apos;s scope.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Installation and services of Sensors, Valves, BTU meters, Flow meters, VFD etc. is not in our scope.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Any Civil work and electrical works not in our scope.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Water, Power &amp; Scaffolding to be provided at FOC at site, unless otherwise agreed mutually.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Any change in the quantity will have price impact on the quoted price.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Adapter box &amp; Network Switch is not in our scope of supply/installation.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Field devices are considered as per the standard design/as per BOQ. Any changes in quantity will have price impact.</span>
              </p>
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>Drawings need to be shared for optimization of the project.</span>
              </p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: ANNEXURE III — TERMS & CONDITIONS & COMMERCIAL CONDITIONS ── */}
      <PageShell pageNum={4} subtitle="Annexure – III: Terms, Commercial Conditions & Basis of Offer">
        <div className="space-y-2.5 text-slate-900 text-left font-normal text-[10px] leading-relaxed">
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-xs mb-1.5">
              Terms &amp; Conditions:
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[9.5px]">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1">
                <p><strong>1) Offer Validity:</strong> One Month from date of issue.</p>
                <p><strong>2) Payment Terms:</strong> 50% advance against Pro-Forma Invoice, 40% against Supply within 15 days, and 10% after completion of the project.</p>
                <p><strong>3) Taxes:</strong> As per GST @ 18% (Material Packing &amp; Forwarding / Transport: Inclusive).</p>
                <p><strong>4) Delivery:</strong> 10 to 12 Weeks from approved PO and Design Document.</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1">
                <p><strong>5) Warranty for Supply:</strong> 1 year from the date of material delivery at site.</p>
                <p><strong>6) Power Fluctuations:</strong> Input voltage protection for field devices in customer scope.</p>
                <p><strong>7) Environmental:</strong> Customer responsible for external site damage/environment.</p>
                <p><strong>8) Commissioning:</strong> Completed 5 to 6 weeks after receiving material at site.</p>
              </div>
            </div>
          </div>

          <div className="space-y-1 border-t border-slate-200 pt-1.5">
            <h4 className="font-bold text-slate-950 text-[10.5px]">Commercial &amp; Operating Clauses:</h4>
            <div className="space-y-1 text-slate-700 text-[9px] leading-relaxed">
              <p><strong>Price Basis:</strong> The price quoted is in accordance with the man basis as per working days approved by client. Any statutory changes in taxes/duties during contractual period will be charged extra. Valid for 30 days.</p>
              <p><strong>Exclusion of Work:</strong> Any kind of Civil, Carpentry, and Plumbing &amp; Electrical works required to the mains of power supply system.</p>
              <p><strong>Delay in Payment:</strong> Timely receipt of payment is the essence of this contract. Delay constitutes ground for schedule extension and 18% p.a. interest on delayed amounts.</p>
              <p><strong>Order Cancellation:</strong> Customer liable to pay 5% of project price as penalty. If cancelled at advance stage, actual losses incurred shall be reimbursed.</p>
              <p><strong>Storage at Site:</strong> The customer shall make available proper, weatherproof, locked storage space for materials during execution.</p>
              <p><strong>Force Majeure:</strong> Neither party liable for delays caused by Act of God, fire, epidemic, riots, war, strikes, or lockout.</p>
            </div>
          </div>

          <div className="space-y-1 border-t border-slate-200 pt-1.5">
            <h4 className="font-bold text-slate-950 text-[10.5px]">Basis of Offer &amp; General Exclusions:</h4>
            <div className="space-y-0.5 text-slate-700 text-[9px] leading-relaxed">
              <p>• UPS Power point, LAN point, static IP, and electricity shall be provided by client.</p>
              <p>• Ducting, false ceiling, civil, welding, and plumbing works are excluded.</p>
              <p>• Ladders, scaffoldings, safety walls, cautions boards, and material lifts in customer scope.</p>
              <p>• Site accommodation, removal of redundant equipment, and builder work are excluded.</p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 5: CONTRACTUAL ARTICLES 1 TO 10 ── */}
      <PageShell pageNum={5} subtitle="Contractual Articles — Scope, Approvals & Financial Terms">
        <div className="space-y-2 text-slate-900 text-left font-normal text-[9.5px] leading-relaxed">
          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 1: Scope of Work</h3>
            <p className="text-slate-700">Restricted to the supply, packing, forwarding, transportation, erection, testing, and commissioning of equipment as per agreed BOQ, drawings, and technical specifications. Buyer shall ensure civil foundations are ready on time. Seller does not consider civil works in scope.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 2: Priority of Documents</h3>
            <p className="text-slate-700">Sequence: a) Contract Agreement, b) Letter of Award, c) Minutes of Meeting, d) Seller’s Offer, e) General Conditions of Contract, f) Schedules &amp; Annexures, g) Technical Specifications.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 3: Drawings / Dimension Sheets</h3>
            <p className="text-slate-700">Drawings submitted for Buyer approval shall be approved within 5 days. Basic Single Line Diagram (SLD) and layout submitted within 10 days of Contract coming into force.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 4: Coming into Force</h3>
            <p className="text-slate-700">Contract comes into force when signed, agreed 50% advance received, full site access granted, kick-off meeting held, and drawings approved. Notice to Proceed (NTP) issued by Buyer marks Work Starting Date.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 5: Offer Validity &amp; Article 6: Contract Price</h3>
            <p className="text-slate-700">Offer valid for 30 days. Price inclusive of freight up to site, exclusive of taxes and duties. Payments in INR.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 7: Transfer of Risk &amp; Title</h3>
            <p className="text-slate-700">Ownership and title retained by Seller until entire purchase price is fully paid. Risk passes as per Incoterms.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 8: Taxes, Duties &amp; Statutory Variations</h3>
            <p className="text-slate-700">Taxes as per GST. Any statutory variation, new levies, or reclassifications shall be to Buyer&apos;s account.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 9: Terms of Payment</h3>
            <p className="text-slate-700">Payments released within 7 days of invoice. Measurements certified within 5 days. Overdue payments accrue interest @ 18% p.a.</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-950 text-xs">Article 10: Variation / Change Management</h3>
            <p className="text-slate-700">Request for Change (RFC) evaluated within 7 calendar days. Changes up to ±10% at agreed rates; changes exceeding 10% subject to revised prices. Additional scope executed on Cost Plus 25% profit margin.</p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 6: CONTRACTUAL ARTICLES 11 TO 20 ── */}
      <PageShell pageNum={6} subtitle="Contractual Articles — Testing, Warranty, Liability & IP">
        <div className="space-y-2 text-slate-900 text-left font-normal text-[9.5px] leading-relaxed">
          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 11: Testing Charges &amp; Inspection</h3>
            <p className="text-slate-700">Routine/acceptance tests conducted as per IS standards. Buyer factory inspection costs borne by Buyer. Dispatch authorization issued within 2 days of test clearance.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 12: Goods Receipts and Storage</h3>
            <p className="text-slate-700">Goods Receipt issued within 48 hours of delivery. Storage due to Buyer delay charged at 0.5% per week plus demurrage.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 13: Completion Period</h3>
            <p className="text-slate-700">Delivery timeline extended for payment delays, scope changes, hindrances, or Force Majeure without penalty to Seller.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 15: Overall Limitation to Liability</h3>
            <p className="text-slate-700">Neither party liable for indirect, incidental, special or consequential damages. Maximum total liability of Seller shall not exceed amounts actually received under this Agreement.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 16: Warranty (Products &amp; Services)</h3>
            <p className="text-slate-700"><strong>Products:</strong> 1 Year from handover. Repair/replacement of faulty parts due to design/manufacturing defects. Misuse/voltage spikes excluded.<br /><strong>Services:</strong> 30-day notification for remedial service at no additional cost.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 17: Buyer’s Obligations</h3>
            <p className="text-slate-700">Buyer provides electricity, water, gas, site office, storage sheds, and site security free of cost throughout execution.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 18: Assignment &amp; Sub-Contract</h3>
            <p className="text-slate-700">Seller permitted to engage specialized subcontractors without absolving overall obligations.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 19: Intellectual Property &amp; Software License</h3>
            <p className="text-slate-700">Single, non-exclusive, non-transferable software license for the specified site. All IPR and algorithms remain exclusive property of Sustainabyte.</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-950 text-xs">Article 20: IP Indemnification &amp; Liquidated Damages</h3>
            <p className="text-slate-700">Seller indemnifies Buyer against valid patent claims. Liquidated damages for solely Seller-caused delays capped at 0.25% per week up to maximum 2.5% of unexecuted contract value as sole and exclusive remedy.</p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 7: CONTRACTUAL ARTICLES 21 TO 31 ── */}
      <PageShell pageNum={7} subtitle="Contractual Articles — Termination, Acceptance, Insurance & Legal">
        <div className="space-y-2 text-slate-900 text-left font-normal text-[9.5px] leading-relaxed">
          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 21: Communication &amp; Article 22: Suspension</h3>
            <p className="text-slate-700">Written notice via email/letter valid. Buyer/Seller suspension terms defined. Idle resource costs during suspension payable by Buyer.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 23: Termination / Cancellation</h3>
            <p className="text-slate-700">30 days written notice for insolvency, persistent non-performance, or payment withholding. In event of Buyer cancellation, Seller entitled to full payment for work done plus 10% termination fee.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 24: Force Majeure</h3>
            <p className="text-slate-700">Events beyond reasonable control (natural disasters, war, government orders) extend performance timelines without breach.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 25: Applicable Law &amp; Dispute Resolution</h3>
            <p className="text-slate-700">Governed by laws of India. Disputes resolved by 3-arbitrator panel under Arbitration and Conciliation Act 1996 in New Delhi in English.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 26: Provisional Acceptance (PAC) &amp; Article 27: Final Acceptance (FAC)</h3>
            <p className="text-slate-700">PAC issued upon equipment installation/testing; punch-lists rectified post-PAC. FAC issued after material reconciliation and handover. Commercial use constitutes deemed acceptance.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 28: General Indemnification &amp; Article 29: Insurance</h3>
            <p className="text-slate-700">Mutual indemnity for bodily injury and physical damage caused by gross negligence. Seller maintains Transit &amp; EAR Policy; Buyer maintains premises insurance.</p>
          </div>

          <div className="border-b border-slate-200 pb-1">
            <h3 className="font-bold text-slate-950 text-xs">Article 30: Confidentiality / Do Not Disclose (DND)</h3>
            <p className="text-slate-700">Standard strict non-disclosure obligations for proprietary software, pricing, algorithms, and technical documentation.</p>
          </div>

          <div>
            <h3 className="font-bold text-slate-950 text-xs">Article 31: Miscellaneous</h3>
            <p className="text-slate-700">No set-off rights. Overrun charges: INR 10,000 per man-day/month for client-caused commissioning delays. Water &amp; electricity provided free by Purchaser.</p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 8: TEAM EXPERTISE, CLIENT TRACK RECORD & AUTHORIZATION ── */}
      <PageShell pageNum={8} subtitle="Team Expertise, Client Track Record & Authorization">
        <div className="space-y-3 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          {/* Client Track Record */}
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-xs mb-1.5">
              Team Expertise &amp; Enterprise Clients (42 References):
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-[8.5px]">
              {allClients.map((client, idx) => (
                <div key={idx} className="bg-slate-50 p-1 rounded border border-slate-200 flex items-center gap-1">
                  <span className="text-[8px] font-bold text-emerald-700 w-4 shrink-0">{idx + 1}.</span>
                  <span className="font-semibold text-slate-800 truncate" title={client}>{client}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted By & Bank Details */}
          <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-slate-200 text-xs">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-xs">Submitted by,</h4>
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Logo" className="h-7 w-auto object-contain" />
              </div>
              <div className="space-y-0.5 text-slate-900">
                <p className="font-black text-slate-950 text-xs">Thanakarthik</p>
                <p className="font-semibold text-slate-700 text-[11px]">Founder &amp; CEO</p>
                <p className="font-mono text-slate-800 text-[11px]">+91-8377007638</p>
                <p className="text-slate-600 font-mono text-[10.5px]">thanakarthik@sustainabyte.ai</p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-xs underline underline-offset-4">Bank Account details:</h4>
              <div className="space-y-0.5 text-[10px] text-slate-800 font-mono">
                <p><strong className="text-slate-900">Name:</strong> SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED</p>
                <p><strong className="text-slate-900">Bank:</strong> Bank of Baroda</p>
                <p><strong className="text-slate-900">Account number:</strong> 35860200000750</p>
                <p><strong className="text-slate-900">IFSC:</strong> BARB0VELACH (fifth letter is ZERO)</p>
                <p><strong className="text-slate-900">Branch:</strong> VELACHERY BRANCH</p>
              </div>
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

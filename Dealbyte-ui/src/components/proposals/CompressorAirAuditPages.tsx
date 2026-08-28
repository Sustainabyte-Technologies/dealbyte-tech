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

  const PageHeader = ({ subtitle = 'Detailed Scope of Work & Detection Methodology' }: { subtitle?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2.5 gap-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
        <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{deal?.clientName || 'Apollo Tyres Ltd'} — Compressor Air Leakage Audit</h2>
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
                  Proposal for Energy Audit Services
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
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{deal?.clientName || 'Apollo Tyres Ltd'}</h2>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Service Scope: <span className="font-bold text-slate-800">Compressor air leakage audit</span>
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

      {/* ── PAGE 2: BASIC NETWORK & WHAT IS COMPRESSED AIR AUDIT ── */}
      <PageShell pageNum={2} subtitle="Basic Compressed Air Network & Overview">
        <div className="space-y-3 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1.5">
              Basic Compressed Air Network:
            </h3>
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white p-2 shadow-2xs mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/compresed sir leakage audit.png" alt="Basic Compressed Air Network Schematic" className="w-full h-auto max-h-[210px] object-contain mx-auto" />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1.5">
              What is Compressed Air Audit?
            </h3>
            <div className="space-y-1.5 text-slate-800 text-[10.5px]">
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">▪</span>
                <span>A Compressed Air Audit is a systematic study of the compressed air system to identify:</span>
              </p>
              <div className="pl-6 space-y-0.5 font-medium text-slate-900">
                <p>➢ energy losses</p>
                <p>➢ Inefficiencies</p>
                <p>➢ opportunities for cost savings</p>
              </div>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">▪</span><span>It involves analysing compressors, air distribution lines, storage tanks, valves, dryers, and end-use equipment.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">▪</span><span>The main purpose is to measure air demand, detect leakages, check pressure drops, and evaluate operating patterns.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">▪</span><span>By doing this, we can highlight unnecessary energy consumption, calculate the financial loss, and suggest corrective measures for improving system reliability and reducing operating costs.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">▪</span><span>In short, a compressed air audit helps customers save energy, lower production costs, and ensure a more reliable and sustainable operation.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">▪</span><span>A Compressed Air Audit is like a health check-up for your compressed air system. It helps identify hidden leaks, pressure losses, and inefficient operations that quietly increase your power bills.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">▪</span><span>With our audit, we can show you exactly where your system is wasting energy and how much money you can save by fixing it.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">▪</span><span>Many industries reduce their compressor power cost by 20–30% after an audit, while also improving reliability and productivity. This is a fast-return investment that directly lowers your operating cost.</span></p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 3: HOW COMPRESSED AIR WASTES MONEY, BENEFITS & INCLUDES ── */}
      <PageShell pageNum={3} subtitle="Loss Analysis & Audit Benefits">
        <div className="space-y-3 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <div>
            <p className="text-slate-800 text-[10.5px]">
              Compressed air is often called the <strong>“fourth utility”</strong> in industries, but it is also one of the costliest utilities to generate. Every leak in the system is like leaving a tap open only worse, because producing compressed air costs <strong>7–8 times more energy</strong> than water pumping.
            </p>
            <p className="font-semibold text-slate-900 mt-1">For example:</p>
            <ul className="pl-5 space-y-0.5 list-disc text-slate-800 text-[10.5px]">
              <li>A single 3 mm leak can waste up to 30–35 CFM, which equals <strong>₹2–3 lakhs per year</strong> in electricity cost (depending on power tariff).</li>
              <li>Leaks also force compressors to run longer, increasing maintenance cost and reducing equipment life.</li>
              <li>As more air leaks out, the system pressure drops, which can affect production quality and efficiency.</li>
            </ul>
            <p className="text-slate-800 text-[10.5px] mt-1">
              By repairing leaks and optimizing the air system, customers typically save <strong>20–30%</strong> of their compressed air cost. That means direct profit without changing production.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-3 items-center p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
            <div className="col-span-5 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/compress ai1.png" alt="Leaking Pipe Graphic" className="max-h-[110px] w-auto object-contain" />
            </div>
            <div className="col-span-7 text-[11px] text-amber-950 leading-snug font-medium italic">
              “Every hissing sound you hear in your plant is not just air — it’s your money leaking out. A small investment in leak detection and repair will save you lakhs of rupees every year.”
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
              Benefits of Compressed Air Audit:
            </h3>
            <ul className="pl-5 space-y-0.5 list-disc text-slate-800 text-[10.5px]">
              <li>Reduce artificial air demand</li>
              <li>Operate compressors at high efficiency</li>
              <li>Reduce the losses in filters, dryers</li>
              <li>Know the actual air delivered by the compressor against design value</li>
              <li>Find out the volume of air leakage in the plant</li>
              <li>Identification of air leakage spots in the plant</li>
              <li>Compressed air cost is recovered through reduced system costs over a short period.</li>
            </ul>
          </div>

          <div className="pt-1 border-t border-slate-100">
            <h4 className="font-bold text-slate-950 text-xs mb-1">
              Compressed Air Audit Includes:
            </h4>
            <ul className="pl-5 space-y-0.5 list-disc text-slate-800 text-[10.5px]">
              <li><strong>Phase-1</strong> Collecting data, Savings Calculation &amp; Documentation</li>
              <li><strong>Phase-2</strong> Implementing the scopes of identified in the Phase-1</li>
            </ul>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: PHASE-1 ACTIVITIES, LEAKAGE IDENTIFICATION & 2 IMAGES ── */}
      <PageShell pageNum={4} subtitle="Detailed Scope of Work & Detection Methodology">
        <div className="space-y-3 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <p className="text-[11px] font-bold text-slate-900">• Phase-3 Implementation Validation</p>

          <div>
            <h3 className="font-bold text-slate-950 text-xs leading-snug">
              Phase-1 Air Audit We Conduct Several Activities in the Compressed air Network:
            </h3>
            <div className="pl-3 space-y-1 text-[10.5px] text-slate-800 mt-1">
              <div>
                <p className="font-semibold text-slate-900">- Flow Study across Generation &amp; Demand Side:</p>
                <p className="pl-4">1. Compressor Efficiency (FAD)</p>
                <p className="pl-4">2. Demand Flow Measurement</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">- Distribution Loss Identification:</p>
                <p className="pl-4">1. Leakage Identification</p>
                <p className="pl-4">2. Network Analysing (Pressure Drop Analysis)</p>
              </div>
              <p className="font-semibold text-slate-900">- Baseline Data Collection</p>
              <p className="font-semibold text-slate-900">- Documentation &amp; Report Preparation (Off Site)</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
              Leakage Identification:
            </h3>
            <div className="space-y-1 text-slate-800 text-[10.5px]">
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>Leakage identification and tagging is a systematic approach to controlling compressed air losses.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>During an audit, each leakage point is detected using ultrasonic detectors and then physically tagged with a unique identification label.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>This tagging ensures that every leak location is documented, prioritized, and can be easily tracked for repair.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>By tagging each leak point, plants gain a clear action plan for maintenance teams, enabling them to fix the leaks in a structured way instead of random patchwork.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>This process not only quantifies the cost of each leakage but also helps in monitoring recurring problem areas, ensuring long-term energy savings and reliable system performance.</span></p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white p-1.5 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/compressed air leakage .png" alt="Ultrasonic Leak Detection Readout Screen" className="w-full h-[155px] object-contain rounded" />
            </div>
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white p-1.5 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/compressed 3.png" alt="Physical Leak Tagging Label" className="w-full h-[155px] object-contain rounded" />
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 5: OUR LEAKAGE DETECTOR OVERVIEW ── */}
      <PageShell pageNum={5} subtitle="Detector Specifications & Technology">
        <div className="space-y-4 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-base mb-2">
            Our Leakage Detector Overview:
          </h3>
          <div className="space-y-2 text-slate-800 text-[11px]">
            <p className="flex items-start gap-2">
              <span className="text-slate-900 font-bold">▪</span>
              <span><strong>Leak Detection Principle –</strong> Identifies high-frequency ultrasonic sound waves generated when compressed air, gas, or vacuum escapes through small openings.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-slate-900 font-bold">▪</span>
              <span><strong>Frequency Range –</strong> Typically operates between 20 kHz to 100 kHz, beyond the range of human hearing.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-slate-900 font-bold">▪</span>
              <span><strong>Detection Capability –</strong> Can locate very small leaks (as small as 0.05 mm at ~7 bar) from several meters away.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-slate-900 font-bold">▪</span>
              <span><strong>Feedback System –</strong> Provides both audio (headphones) and visual (display or LED bar graph) indications to pinpoint leaks.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-slate-900 font-bold">▪</span>
              <span><strong>Sensitivity &amp; Adjustability –</strong> Equipped with adjustable sensitivity to distinguish between background noise and actual leak sounds.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-slate-900 font-bold">▪</span>
              <span><strong>Portability &amp; Power –</strong> Lightweight, handheld device powered by rechargeable or replaceable batteries with 6–10 hours’ runtime.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-slate-900 font-bold">▪</span>
              <span><strong>Applications –</strong> Used for compressed air systems, gas pipelines, vacuum systems, steam traps, and refrigerant leak detection without interrupting operations.</span>
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 6: TECHNICIAN IMAGE, COMMERCIALS & SUPPORT REQUIRED ── */}
      <PageShell pageNum={6} subtitle="Commercial Proposal (Final Terms & Authorization)">
        <div className="space-y-3.5 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <div className="flex justify-center">
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white p-1.5 shadow-2xs max-w-[380px] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/compressrd air 2.png" alt="Technician using Ultrasonic Leak Detector" className="w-full h-auto max-h-[220px] object-contain rounded mx-auto" />
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1.5">
              Commercials:
            </h3>
            <div className="border border-slate-900 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-white font-bold text-[11px]">
                  <tr>
                    <th className="py-2 px-3 text-center w-14 border-r border-slate-700">Sl.No</th>
                    <th className="py-2 px-4 border-r border-slate-700">Scope Description</th>
                    <th className="py-2 px-3 text-center w-20 border-r border-slate-700">Quantity</th>
                    <th className="py-2 px-4 text-right w-36">TotalPrice in INR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 text-[11px]">
                  <tr>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 border-r border-slate-200 align-top">1</td>
                    <td className="py-3 px-4 text-slate-900 border-r border-slate-200 leading-relaxed font-medium">
                      <p className="font-bold text-slate-950 mb-0.5">Distribution Loss Assessment &amp; Flow Measurement</p>
                      <ul className="space-y-0.5 pl-3 text-[10px] text-slate-700 list-disc">
                        <li>Leakage Identification from generation to end point including machineries</li>
                        <li>Baseline Data Collection</li>
                        <li>Documentation &amp; Report Preparation (Off Site)</li>
                      </ul>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 border-r border-slate-200 align-top">01</td>
                    <td className="py-3 px-4 text-right font-black text-slate-950 text-sm align-top">
                      {formatCurrency(finalPrice)}/-
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-500 italic mt-1 font-medium">
              Note: Please find below the commercials for Phase-2 Implementation, which is chargeable as per the actuals.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
              Support required from the client:
            </h3>
            <p className="flex items-start gap-1.5 text-[10.5px] text-slate-800">
              <span className="text-slate-900 font-bold">•</span>
              <span>SPOC (Single point of Contact) for support and coordination during the audit phase</span>
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 7: SUPPORT CONTD, TERMS & PHASE-2 SCOPE ── */}
      <PageShell pageNum={7} subtitle="Commercial Proposal (Final Terms & Authorization)">
        <div className="space-y-3.5 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <div className="space-y-1 text-[10.5px] text-slate-800">
            <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>Accessibility to each area.</span></p>
            <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>1 person required from client side with knowledge on Compressed air line to reach out from the generation to end use for leakage identifications.</span></p>
          </div>

          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1.5">
              Terms and Conditions:
            </h3>
            <div className="space-y-1 pl-4 text-slate-800 text-[10.5px]">
              <p className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span><strong>Payment schedule:</strong> 50% advance against the PO and remaining 50% against the report submission (Implementation Charges and Hardware Charges will be extra and it will be submitted after the report submission).</span>
              </p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>Applicable Taxes and duties will be extra.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>Boarding and Travel Expenses are inclusive of the cost mentioned above.</span></p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
              Phase-2 Implementing the scopes of identified in the Phase-1 (By Customer Preference):
            </h3>
            <div className="space-y-1.5 text-slate-800 text-[10.5px] leading-relaxed">
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>Correcting air leakages and addressing other compressed air optimization opportunities are among the most effective ways to prove tangible savings to customers.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>Once leaks are repaired, and improvements such as pressure optimization, proper compressor sequencing, or storage enhancement are implemented, the results can be validated through energy meters or flow data.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>By comparing the baseline measurements with post-implementation readings, the reduction in power consumption or compressed air demand becomes evident.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>This data-driven validation not only quantifies the savings achieved but also builds customer confidence, as the improvements are backed by measurable reductions in kW usage, flow demand, or operating hours, directly translating into cost savings and improved system reliability.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>Additionally, supplying the required materials and spares during implementation ensures timely execution, smooth operation, and sustainability of the optimization measures.</span></p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 8: PHASE-3 VALIDATION & ACOUSTIC CAMERA IMAGE ── */}
      <PageShell pageNum={8} subtitle="Detailed Scope of Work & Detection Methodology">
        <div className="space-y-3.5 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1.5">
              Phase-3 Implementation Validation:
            </h3>
            <div className="space-y-1.5 text-slate-800 text-[10.5px]">
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>Implementation Validation ensures that the recommended energy conservation measures and rectification works in the compressed air system are executed as planned and deliver the expected results.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>This process involves verifying the corrective actions, re-measuring the system parameters such as pressure, flow and power consumption, and comparing them with the baseline data.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>Successful validation confirms that leak rectification, drain automation, and compressor optimization measures are effectively reducing losses and improving efficiency.</span></p>
              <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span><span>Documented results provide transparency, build customer confidence, and prove the actual energy and cost savings achieved through the implementation.</span></p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white p-2 shadow-sm my-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/compresd6.png" alt="Ultrasonic Acoustic Camera Validation Screen" className="w-full h-auto max-h-[340px] object-contain mx-auto" />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-950 text-sm">Other Audit Services:</h4>
            <h5 className="font-bold text-slate-900 text-xs mt-1">Compressor Efficiency (FAD):</h5>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 9: COMPRESSOR EFFICIENCY (FAD) ── */}
      <PageShell pageNum={9} subtitle="Other Audit Services & Measurement Methodologies">
        <div className="space-y-3.5 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
            Compressor Efficiency (FAD):
          </h3>
          <p className="text-slate-800 text-[10.5px]">
            A Compressor Efficiency Study is as if an energy audit focused only on your air compressors. It helps you understand how efficiently your compressors are converting electricity into usable compressed air.
          </p>
          <p className="text-slate-800 text-[10.5px]">
            In many plants, compressors consume up to <strong>20–30%</strong> of total electricity, but often operate below optimal efficiency due to:
          </p>
          <div className="pl-6 space-y-0.5 text-slate-800 text-[10.5px]">
            <p>➢ wrong sizing</p>
            <p>➢ poor controls</p>
            <p>➢ pressure drops</p>
            <p>➢ leakages.</p>
          </div>
          <p className="text-slate-800 text-[10.5px]">
            During the study, we measure actual power consumption, flow (CFM), pressure levels, and operating patterns. From this data, we calculate the specific power (kW per CFM), which is the true indicator of compressor efficiency. By comparing this with industry benchmarks, we can show you how much extra energy (and money) your system is consuming.
          </p>
          <p className="text-slate-800 text-[10.5px]">
            The outcome is a clear set of recommendations such as:
          </p>
          <div className="pl-6 space-y-0.5 text-slate-800 text-[10.5px]">
            <p>➢ right-sizing compressors</p>
            <p>➢ optimizing load/unload cycles</p>
            <p>➢ reducing pressure band</p>
            <p>➢ fixing leaks</p>
          </div>
          <p className="text-slate-800 text-[10.5px] font-semibold">
            Which leads to lower energy bills, reduced maintenance, and more reliable compressed air supply.
          </p>
        </div>
      </PageShell>

      {/* ── PAGE 10: SCHEMATICS & DEMAND FLOW MEASUREMENT ── */}
      <PageShell pageNum={10} subtitle="Other Audit Services & Measurement Methodologies">
        <div className="space-y-3.5 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <div className="rounded-lg border border-slate-200 overflow-hidden bg-white p-1.5 shadow-2xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/compred5.png" alt="Compressor Efficiency FAD Flow Meter Position" className="w-full h-auto max-h-[160px] object-contain mx-auto" />
          </div>

          <div>
            <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
              Demand Flow Measurement:
            </h3>
            <p className="text-slate-800 text-[10.5px] leading-relaxed">
              Demand Flow Measurement is the process of accurately measuring how much compressed air is actually being consumed by the plant at different times of the day. It is done using a flow meter installed in the pipeline. This data helps identify the true air requirement of the plant, instead of relying only on compressor capacity.
            </p>
            <div className="space-y-1 pl-1 text-[10.5px] text-slate-800 mt-1">
              <p>• <strong>Right-sizing compressors:</strong> Often, plants run oversized compressors, wasting electricity. Flow data shows the actual demand so you can optimize.</p>
              <p>• <strong>Leak detection:</strong> By measuring flow during non-production hours, leaks can be quantified in terms of CFM and cost.</p>
              <p>• <strong>Energy savings:</strong> With clear demand patterns, compressors can be operated efficiently, saving up to 20–30% of power cost.</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 overflow-hidden bg-white p-1.5 shadow-2xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/compresed4.png" alt="Demand Flow Measurement Meter Position" className="w-full h-auto max-h-[160px] object-contain mx-auto" />
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 11: SUBMITTED BY & BANK ACCOUNT DETAILS ── */}
      <PageShell pageNum={11} subtitle="Commercial Proposal (Final Terms & Authorization)">
        <div className="space-y-6 text-slate-900 text-left font-normal text-[11px] leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">Submitted By,</h4>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Logo" className="h-10 w-auto object-contain" />
            </div>
            <div className="space-y-0.5 text-xs text-slate-900 pt-1">
              <p className="font-black text-slate-950 text-sm">Thanakarthik Kumar</p>
              <p className="font-semibold text-slate-700">Founder &amp; Managing Director</p>
              <p className="font-mono text-slate-800">+91-8377007638</p>
              <p className="text-slate-600 font-mono">thanakarthik@sustainabyte.ai</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-900 text-xs underline underline-offset-4">Bank Account details:</h4>
            <div className="space-y-1 text-xs text-slate-800 font-mono">
              <p><strong className="text-slate-900">Bank:</strong> Bank of Baroda</p>
              <p><strong className="text-slate-900">Account Number:</strong> 35860200000750</p>
              <p><strong className="text-slate-900">IFSC:</strong> BARB0VELACH (fifth letter is ZERO)</p>
              <p><strong className="text-slate-900">Branch:</strong> VELACHERY BRANCH</p>
              <p><strong className="text-slate-900">GSTIN NO:</strong> 33ABNCS4869A1Z7</p>
              <p><strong className="text-slate-900">PAN Number:</strong> ABNCS4869A</p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 12: THANK YOU ── */}
      <PageShell pageNum={12} subtitle="Commercial Proposal (Final Terms & Authorization)">
        <div className="flex-1 flex flex-col items-center justify-center min-h-[600px] text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-widest uppercase mb-4">
            THANK YOU
          </h1>
          <p className="text-sm font-semibold text-slate-600 tracking-wide max-w-md mx-auto">
            We appreciate the opportunity to collaborate on optimizing your compressed air efficiency and sustainability goals.
          </p>
        </div>
      </PageShell>
    </>
  );
}

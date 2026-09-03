'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { costingApi } from '@/lib/api/costing';

interface IrBlasterPagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
  costingSheet?: any;
}

export function IrBlasterPages(props: IrBlasterPagesProps) {
  const {
    deal,
    proposal,
    proposalRef,
    proposalDate,
    finalPrice,
    formatCurrency,
  } = props;
  const totalPages = 5;

  const clientName = deal?.clientName || (proposal as any)?.clientName || proposal?.quote?.deal?.clientName || 'Valued Client';
  const projectName = deal?.projectName || (deal as any)?.projectName || 'Plant 1';

  // Dynamic Costing Sheet Resolution from DB or payload
  const { data: dbCostingSheet } = useQuery({
    queryKey: ['ir-blaster-costing-sheet', clientName],
    queryFn: async () => {
      if (!clientName) return null;
      try {
        const sheets = await costingApi.getSheets({ clientName });
        if (sheets && sheets.length > 0) {
          const matched = sheets.find(
            (s: any) =>
              s.subService?.toLowerCase().includes('ir blaster') ||
              s.subService?.toLowerCase().includes('ir') ||
              s.serviceCategory?.toLowerCase().includes('iot') ||
              s.serviceCategory?.toLowerCase().includes('control')
          );
          if (matched) return matched;
          return sheets[0];
        }
      } catch (e) {
        console.error('Error fetching costing sheets for IR blaster proposal', e);
      }
      return null;
    },
    staleTime: 30000,
  });

  const costingSheet =
    props.costingSheet ||
    (proposal as any)?.costingSheet ||
    (proposal as any)?.costing_sheet ||
    (proposal as any)?.costingData ||
    (proposal as any)?.costing_data ||
    (proposal as any)?.quote?.costingSheet ||
    (deal as any)?.costingSheet ||
    (deal as any)?.quote?.costingSheet ||
    dbCostingSheet ||
    {};

  const hardwareRows: any[] =
    costingSheet.hardwareRows ||
    costingSheet.iotControlsHardwareRows ||
    costingSheet.instrumentRows?.hardwareRows ||
    [];

  const commercialItems: { description: string; count: number; unit: string; cost: number }[] = [];
  const defaultQuantity =
    hardwareRows.length > 0
      ? hardwareRows.reduce((acc, row) => acc + (Number(row.quantity || row.qty) || 0), 0)
      : 7;

  if (hardwareRows.length > 0) {
    hardwareRows.forEach((row) => {
      const q = Number(row.quantity || row.qty || 1);
      const cp = Number(row.customerPrice || 0);
      const uc = Number(row.unitPrice || row.unitCost || 0);
      const cost = cp > 0 ? cp : uc * q;
      commercialItems.push({
        description: row.productDescription || row.description || 'IR Blaster Unit',
        count: q,
        unit: row.uom || 'Nos',
        cost: cost,
      });
    });
  }

  const fallbackCommercialItems = [
    {
      description: 'Supply of IR Blasters (AC Energy Automation Module)',
      count: defaultQuantity,
      unit: 'Nos',
      cost: defaultQuantity * 7500,
    },
    {
      description: 'Installation, Cable Looping, Testing & Commissioning Charges',
      count: defaultQuantity,
      unit: 'Nos',
      cost: defaultQuantity * 3500,
    },
    {
      description: 'Freight, Packaging & Handling Charges (3%)',
      count: 1,
      unit: 'Lot',
      cost: Math.round(defaultQuantity * 7500 * 0.03),
    },
  ];

  const displayCommercialItems = commercialItems.length > 0 ? commercialItems : fallbackCommercialItems;
  const calculatedTotal = displayCommercialItems.reduce((sum, item) => sum + item.cost, 0);
  const displayFinalTotal = finalPrice && finalPrice > 0 ? finalPrice : calculatedTotal;

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
            Techno Commercial Proposal for IR Blaster – AC Energy Automation
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

      {/* ── PAGE 3: SCOPE OF WORK & PRODUCT SHOWCASE ── */}
      <PageShell pageNum={3}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Scope of Work:
            </h2>
            <p className="text-[12px] text-black leading-relaxed">
              In this proposal, we will carry out the supply, installation, testing, and commissioning of {defaultQuantity > 0 ? defaultQuantity : 'Seven'} IR Blasters at {clientName}.
            </p>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              About IR Blaster – AC Energy Solutions:
            </h2>
            <div className="flex justify-center my-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/irimag11.jpeg"
                alt="IR Blaster Smart Unit"
                className="w-full h-auto max-h-[160px] object-contain border border-slate-300"
              />
            </div>
            <ul className="space-y-1 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li><strong>Smart Connected Systems:</strong> Turns standalone AC units into intelligent, cloud-connected automated systems.</li>
              <li><strong>Operational Alignment:</strong> Eliminates operational inconsistencies and strictly aligns room cooling with defined enterprise temperature standards.</li>
              <li><strong>Secure Cloud Framework:</strong> Operates on a secure, cloud-connected framework for real-time remote configuration, event logging, and proactive diagnostics.</li>
              <li><strong>Plug &amp; Play Retrofit:</strong> Easy, non-invasive installation — No complex rewiring or internal AC modifications required.</li>
              <li><strong>Universal HVAC Compatibility:</strong> Works seamlessly with all major HVAC brands, compatible with split, cassette, and package AC units.</li>
            </ul>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: SOLUTION ARCHITECTURE & BENEFITS ── */}
      <PageShell pageNum={4}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Solution Architecture:
            </h2>
            <div className="flex justify-center my-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/irarchitec.png"
                alt="IR Blaster Solution Architecture"
                className="w-full h-auto max-h-[220px] object-contain border border-slate-300"
              />
            </div>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Benefits &amp; Measurable Energy Impact:
            </h2>
            <ul className="space-y-1.5 text-[12px] text-black list-disc pl-6 leading-relaxed">
              <li><strong>10–15% Direct Energy Savings:</strong> Substantial energy reduction achieved by eliminating unnecessary idle runtime, schedule adherence, and setpoint discipline.</li>
              <li><strong>BEE Standard Alignment:</strong> Ensures measurable temperature discipline in strict alignment with BEE (Bureau of Energy Efficiency) recommendations.</li>
              <li><strong>Every 1°C Optimization:</strong> Statistically proven that each 1°C increase in temperature setpoint yields <strong>6% to 10% direct energy savings</strong>.</li>
              <li><strong>Net Zero Carbon Acceleration:</strong> Directly supports enterprise Net Zero ESG strategy by lowering Scope 2 HVAC carbon emissions.</li>
              <li><strong>Enhanced Operational Reliability:</strong> Extends AC compressor lifespan and optimizes enterprise facility operating overheads.</li>
            </ul>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 5: COMMERCIALS, TERMS & BANK DETAILS ── */}
      <PageShell pageNum={5}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Commercials:
            </h2>
            <table className="w-full border-collapse border border-black text-[11px] text-black">
              <thead>
                <tr className="bg-[#C6EFCE]">
                  <th className="border border-black py-1.5 px-2 text-center font-bold w-10">S.No</th>
                  <th className="border border-black py-1.5 px-2 text-left font-bold">Description</th>
                  <th className="border border-black py-1.5 px-2 text-center font-bold w-14">Count</th>
                  <th className="border border-black py-1.5 px-2 text-center font-bold w-14">Unit</th>
                  <th className="border border-black py-1.5 px-2 text-right font-bold w-28">Cost (INR)</th>
                </tr>
              </thead>
              <tbody>
                {displayCommercialItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-black py-1.5 px-2 text-center">{idx + 1}</td>
                    <td className="border border-black py-1.5 px-2">{item.description}</td>
                    <td className="border border-black py-1.5 px-2 text-center">{item.count || ''}</td>
                    <td className="border border-black py-1.5 px-2 text-center">{item.unit || ''}</td>
                    <td className="border border-black py-1.5 px-2 text-right font-bold">
                      {formatCurrency(item.cost)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colSpan={4} className="border border-black py-2 px-2 text-center font-bold text-[12px]">Total Commercial Investment</td>
                  <td className="border border-black py-2 px-2 text-right font-bold text-[12px]">
                    {formatCurrency(displayFinalTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-1.5">
              Support required from the client:
            </h2>
            <ul className="space-y-1 text-[11px] text-black list-disc pl-6 leading-snug">
              <li>SPOC (Single point of Contact) for support and coordination during installation and Commissioning phase.</li>
              <li>Accessibility to each air-conditioned area.</li>
              <li>1 person required from client side with knowledge of electrical routing and manpower support for installation.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-1.5">
              Terms and Conditions:
            </h2>
            <ul className="space-y-1 text-[11px] text-black list-disc pl-6 leading-snug">
              <li>Supply of hardware – 100% upfront</li>
              <li>Installation and commissioning – 50% Advance &amp; 50% After successful installation</li>
              <li>Applicable taxes and duties will be extra.</li>
              <li>Timelines for execution mutually agreed during project kick-off.</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-200">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-black">Submitted By,</p>
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Pvt Ltd" className="h-8 w-auto object-contain" />
              </div>
              <div className="text-[11px] text-black space-y-0.5">
                <p className="font-bold">Mr. Thanakarthik Kumar K</p>
                <p>Founder &amp; Managing Director</p>
                <p className="font-bold">Contact:</p>
                <p>Call: 8377007638</p>
                <p>Mail: thanakarthik@sustainabyte.ai</p>
              </div>
            </div>

            <div className="space-y-0.5 text-[11px] text-black">
              <p className="font-bold">Bank Account details:</p>
              <p>Bank – Bank of Baroda</p>
              <p>Account Number – 35860200000750</p>
              <p>IFSC – BARB0VELACH (fifth letter is ZERO)</p>
              <p>Branch – VELACHERY BRANCH</p>
              <p>GSTIN NO – 33ABNCS4869A1Z7</p>
              <p>PAN Number – ABNCS4869A</p>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-[16px] font-black uppercase tracking-widest text-black">THANK YOU</p>
          </div>
        </div>
      </PageShell>
    </>
  );
}

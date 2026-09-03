'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { costingApi } from '@/lib/api/costing';
import {
  INITIAL_CPM_HARDWARE_ROWS,
  INITIAL_CPM_ELECTRICAL_ROWS,
  INITIAL_CPM_ON_PREMISE_ROWS,
  INITIAL_CPM_CLOUD_CHARGE_ROWS,
} from '@/components/costing/constants';

interface CpmProposalPagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
  costingSheet?: any;
}

export function CpmProposalPages(props: CpmProposalPagesProps) {
  const {
    deal,
    proposal,
    proposalRef,
    proposalDate,
    finalPrice,
    formatCurrency,
  } = props;
  const totalPages = 9;

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

  const clientName = deal?.clientName || (proposal as any)?.clientName || proposal?.quote?.deal?.clientName;

  const { data: dbCostingSheet } = useQuery({
    queryKey: ['cpm-proposal-costing-sheet', clientName],
    queryFn: async () => {
      if (!clientName) return null;
      try {
        const sheets = await costingApi.getSheets({ clientName });
        if (sheets && sheets.length > 0) {
          const cpm = sheets.find(
            (s: any) =>
              s.isCpm ||
              s.subService?.toLowerCase().includes('cpm') ||
              s.subService?.toLowerCase().includes('chiller') ||
              s.serviceCategory?.toLowerCase().includes('chiller')
          );
          if (cpm) return cpm;
          return sheets[0];
        }
      } catch (e) {
        console.error('Error fetching costing sheets for proposal', e);
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

  const calcRowPrice = (unitCost: number, marginPct: number = 40): number => {
    if (marginPct >= 100) return unitCost * 2;
    return Math.round(unitCost / Math.max(0.01, (100 - marginPct) / 100));
  };

  const rawHwRows: any[] = costingSheet.cpmHardwareRows || costingSheet.instrumentRows?.cpmHardwareRows || [];
  const activeHwRows = rawHwRows.filter((r) => Number(r.qty || 0) > 0);

  const rawElecRows: any[] = costingSheet.cpmElectricalRows || costingSheet.instrumentRows?.cpmElectricalRows || [];
  const activeElecRows = rawElecRows.filter((r) => Number(r.qty || 0) > 0);

  const rawOnPremRows: any[] = costingSheet.cpmOnPremiseRows || costingSheet.instrumentRows?.cpmOnPremiseRows || [];
  const activeOnPremRows = rawOnPremRows.filter((r) => Number(r.qty || 0) > 0);

  const rawCloudRows: any[] = costingSheet.cpmCloudChargeRows || costingSheet.instrumentRows?.cpmCloudChargeRows || [];
  const activeCloudRows = rawCloudRows.filter((r) => Number(r.qty || 0) > 0);

  const hasCostingData = activeHwRows.length > 0 || activeElecRows.length > 0 || activeOnPremRows.length > 0 || activeCloudRows.length > 0;

  const totalHwPrice = (activeHwRows.length > 0 ? activeHwRows : INITIAL_CPM_HARDWARE_ROWS).reduce(
    (sum, r) => sum + Number(r.qty || 1) * calcRowPrice(Number(r.unitCost || 0), r.marginPct ?? 40),
    0
  );
  const totalElecPrice = (activeElecRows.length > 0 ? activeElecRows : INITIAL_CPM_ELECTRICAL_ROWS).reduce(
    (sum, r) => sum + Number(r.qty || 1) * calcRowPrice(Number(r.unitCost || 0), r.marginPct ?? 40),
    0
  );
  const totalOnPremPrice = (activeOnPremRows.length > 0 ? activeOnPremRows : INITIAL_CPM_ON_PREMISE_ROWS).reduce(
    (sum, r) => sum + Number(r.qty || 1) * calcRowPrice(Number(r.unitCost || 0), r.marginPct ?? 40),
    0
  );
  const totalCloudPrice = (activeCloudRows.length > 0 ? activeCloudRows : INITIAL_CPM_CLOUD_CHARGE_ROWS).reduce(
    (sum, r) => sum + Number(r.qty || 1) * calcRowPrice(Number(r.unitCost || 0), r.marginPct ?? 40),
    0
  );

  const autoEngineeringPrice = (costingSheet.cpmTotalStep5CustomerPrice !== undefined && Number(costingSheet.cpmTotalStep5CustomerPrice) > 0)
    ? Number(costingSheet.cpmTotalStep5CustomerPrice)
    : (costingSheet.cpmAutoEngineeringFee !== undefined && Number(costingSheet.cpmAutoEngineeringFee) > 0)
      ? Number(costingSheet.cpmAutoEngineeringFee)
      : Math.round((totalHwPrice + totalElecPrice + totalOnPremPrice + totalCloudPrice) * 0.15);

  const pmcPrice = (costingSheet.cpmTotalStep6CustomerPrice !== undefined && Number(costingSheet.cpmTotalStep6CustomerPrice) > 0)
    ? Number(costingSheet.cpmTotalStep6CustomerPrice)
    : (costingSheet.cpmPmcFee !== undefined && Number(costingSheet.cpmPmcFee) > 0)
      ? Number(costingSheet.cpmPmcFee)
      : Math.round((totalHwPrice + totalElecPrice + totalOnPremPrice + totalCloudPrice) * 0.05);

  const fallbackCommercialItems = [
    { description: 'Supply of DDC Panel & CPM Edge Controllers', count: 1, unit: 'Set', cost: 180000 },
    { description: 'Energy Meters, Power Transducers & Flow Meter Retrofit', count: 4, unit: 'Sets', cost: 156000 },
    { description: 'Temperature Sensors (PT100) & Pressure Transmitters', count: 8, unit: 'Nos', cost: 72000 },
    { description: 'Electrical Consumables, Loop Cabling & Trunking Accessories', count: 1, unit: 'Lot', cost: 65000 },
    { description: 'OptiByte Plant IQ Cloud Platform Licensing (Year 1)', count: 1, unit: 'Year', cost: 120000 },
    { description: 'Engineering, Programming, Site Integration & Commissioning', count: 1, unit: 'Job', cost: 85000 },
  ];

  const dynamicCommercialItems = [
    ...(activeHwRows.length > 0
      ? activeHwRows.map((r) => ({
          description: r.description || 'Hardware Item',
          count: Number(r.qty || 1),
          unit: r.uom || 'Nos',
          cost: Number(r.qty || 1) * calcRowPrice(Number(r.unitCost || 0), r.marginPct ?? 40),
        }))
      : totalHwPrice > 0
        ? [{ description: 'Supply of CPM Field Instruments & DDC Panels', count: 1, unit: 'Lot', cost: totalHwPrice }]
        : []),
    ...(activeElecRows.length > 0
      ? activeElecRows.map((r) => ({
          description: r.description || 'Electrical Consumables',
          count: Number(r.qty || 1),
          unit: r.uom || 'Lot',
          cost: Number(r.qty || 1) * calcRowPrice(Number(r.unitCost || 0), r.marginPct ?? 40),
        }))
      : totalElecPrice > 0
        ? [{ description: 'Electrical Cabling, Modbus Network & Panel Accessories', count: 1, unit: 'Lot', cost: totalElecPrice }]
        : []),
    ...(activeOnPremRows.length > 0
      ? activeOnPremRows.map((r) => ({
          description: r.description || 'On-Premise Software / HMI',
          count: Number(r.qty || 1),
          unit: r.uom || 'Nos',
          cost: Number(r.qty || 1) * calcRowPrice(Number(r.unitCost || 0), r.marginPct ?? 40),
        }))
      : totalOnPremPrice > 0
        ? [{ description: 'On-Premise CPM Scada / HMI Software License', count: 1, unit: 'Job', cost: totalOnPremPrice }]
        : []),
    ...(activeCloudRows.length > 0
      ? activeCloudRows.map((r) => ({
          description: r.description || 'Cloud Platform License',
          count: Number(r.qty || 1),
          unit: r.uom || 'Year',
          cost: Number(r.qty || 1) * calcRowPrice(Number(r.unitCost || 0), r.marginPct ?? 40),
        }))
      : totalCloudPrice > 0
        ? [{ description: 'OptiByte Central Plant Cloud Analytics Platform (Annual)', count: 1, unit: 'Year', cost: totalCloudPrice }]
        : []),
    ...(autoEngineeringPrice > 0
      ? [{ description: 'Engineering, Programming, Site Integration & Startup', count: 1, unit: 'Job', cost: autoEngineeringPrice }]
      : []),
    ...(pmcPrice > 0
      ? [{ description: 'Project Management, Testing & Commissioning Supervision (PMC)', count: 1, unit: 'Job', cost: pmcPrice }]
      : []),
  ];

  const displayCommercialItems = (hasCostingData && dynamicCommercialItems.length > 0)
    ? dynamicCommercialItems
    : fallbackCommercialItems;

  const calculatedTotal = displayCommercialItems.reduce((sum, item) => sum + item.cost, 0);
  const displayFinalTotal = finalPrice && finalPrice > 0 ? finalPrice : (calculatedTotal > 0 ? calculatedTotal : 678000);

  return (
    <>
      {/* ── PAGE 1: COVER PAGE ── */}
      <PageShell pageNum={1}>
        <PageLogo />
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
          <h1 className="text-[22px] font-bold text-black underline underline-offset-4 decoration-1 leading-relaxed">
            Techno Commercial Proposal for Central Plant Monitoring (CPM) System
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

      {/* ── PAGE 3: CPM SYSTEM ARCHITECTURE ── */}
      <PageShell pageNum={3}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
            Central Plant Monitoring (CPM) System Architecture:
          </h2>
          <div className="flex justify-center my-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cpm-architecture.png"
              alt="CPM System Architecture"
              className="w-full h-auto max-h-[220px] object-contain border border-slate-300"
            />
          </div>
          <ul className="space-y-1.5 text-[12px] text-black list-disc pl-6 leading-relaxed">
            <li><strong>Field Instrumentation:</strong> Precision temperature sensors (PT100), pressure transmitters, and electromagnetic flow meters hardwired to DDC panels.</li>
            <li><strong>Energy Meters:</strong> Connected directly to DDC Panel via Modbus RTU (RS485) network for power monitoring and telemetry.</li>
            <li><strong>DDC Panel &amp; Local Server:</strong> DDC Panel publishes data to Local Server over local LAN for Web HMI visualization and cloud uplink.</li>
          </ul>
        </div>
      </PageShell>

      {/* ── PAGE 4: COMMERCIALS & NOTES ── */}
      <PageShell pageNum={4}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Commercial Investment:
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
              Notes &amp; Assumptions:
            </h2>
            <ul className="space-y-1 text-[11px] text-black list-disc pl-6 leading-snug">
              <li>Cabling quantity is considered as per BOQ/Thumb-rule Basis. Billed as per actuals.</li>
              <li>Mod-bus card for the VFD/chiller in client&apos;s scope.</li>
              <li>Installation and services of Sensors, Valves, BTU meters, Flow meters in our scope as specified.</li>
              <li>Water, Power &amp; Scaffolding to be provided at FOC at site.</li>
            </ul>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 5: TERMS & CONDITIONS ── */}
      <PageShell pageNum={5}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1">
            Terms &amp; Conditions:
          </h2>
          <ul className="space-y-1.5 text-[12px] text-black list-disc pl-6 leading-relaxed">
            <li><strong>Commercial Price Basis:</strong> Rates quoted are valid for 30 days from proposal date.</li>
            <li><strong>Payment Terms:</strong> 50% advance against PO, 40% on material delivery, 10% on commissioning.</li>
            <li><strong>Taxes &amp; Duties:</strong> GST extra as applicable at statutory rates.</li>
            <li><strong>Delivery:</strong> 6–8 weeks from receipt of clear order and advance payment.</li>
            <li><strong>Warranty:</strong> 12 months from the date of handover against manufacturing defects.</li>
          </ul>

          <div className="pt-2">
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Limitation of Liability:
            </h2>
            <p className="text-[12px] text-black leading-relaxed">
              The maximum liability of the Seller for any and all claims, losses, damages, costs and expenses arising from or in connection with this Agreement shall not exceed the amounts actually received by the Seller under this Agreement.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 6: CONTRACTUAL ARTICLES 1 TO 10 ── */}
      <PageShell pageNum={6}>
        <PageLogo />
        <div className="space-y-2 text-[11px] text-black leading-relaxed flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
            Contractual Articles (1 – 10):
          </h2>
          <div><p className="font-bold">Article 1: Scope of Work</p><p>Restricted to the supply, erection, testing, and commissioning of equipment as per agreed BOQ.</p></div>
          <div><p className="font-bold">Article 2: Priority of Documents</p><p>Contract Agreement &gt; Letter of Award &gt; Seller Offer &gt; GCC &gt; Technical Specs.</p></div>
          <div><p className="font-bold">Article 3: Drawings / Dimension Sheets</p><p>Drawings submitted for Buyer approval shall be approved within 5 days.</p></div>
          <div><p className="font-bold">Article 4: Coming into Force</p><p>Contract comes into force when signed and agreed advance received.</p></div>
          <div><p className="font-bold">Article 5: Offer Validity &amp; Article 6: Contract Price</p><p>Offer valid for 30 days. Price inclusive of freight up to site, exclusive of taxes.</p></div>
          <div><p className="font-bold">Article 7: Transfer of Risk &amp; Title</p><p>Ownership retained by Seller until entire purchase price is fully paid.</p></div>
          <div><p className="font-bold">Article 8: Taxes &amp; Duties</p><p>Taxes as per GST. Any statutory variation to Buyer account.</p></div>
          <div><p className="font-bold">Article 9: Terms of Payment</p><p>Payments released within 7 days of invoice. Measurements certified within 5 days.</p></div>
          <div><p className="font-bold">Article 10: Variation / Change Management</p><p>RFC evaluated within 7 calendar days. Additional scope on agreed rates.</p></div>
        </div>
      </PageShell>

      {/* ── PAGE 7: CONTRACTUAL ARTICLES 11 TO 20 ── */}
      <PageShell pageNum={7}>
        <PageLogo />
        <div className="space-y-2 text-[11px] text-black leading-relaxed flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
            Contractual Articles (11 – 20):
          </h2>
          <div><p className="font-bold">Article 11: Testing Charges &amp; Inspection</p><p>Routine/acceptance tests conducted as per IS standards.</p></div>
          <div><p className="font-bold">Article 12: Goods Receipts and Storage</p><p>Goods Receipt issued within 48 hours of delivery.</p></div>
          <div><p className="font-bold">Article 13: Completion Period</p><p>Delivery timeline extended for payment delays or Force Majeure.</p></div>
          <div><p className="font-bold">Article 15: Overall Limitation to Liability</p><p>Maximum liability capped at total amounts actually received under this agreement.</p></div>
          <div><p className="font-bold">Article 16: Warranty</p><p>1 Year from handover against design and manufacturing defects.</p></div>
          <div><p className="font-bold">Article 17: Buyer’s Obligations</p><p>Buyer provides electricity, water, site office, and secure storage sheds.</p></div>
          <div><p className="font-bold">Article 18: Assignment &amp; Sub-Contract</p><p>Seller permitted to engage specialized subcontractors.</p></div>
          <div><p className="font-bold">Article 19: Intellectual Property</p><p>Single, non-exclusive license. All IPR remains exclusive to Sustainabyte.</p></div>
          <div><p className="font-bold">Article 20: Liquidated Damages</p><p>Capped at 0.25% per week up to maximum 2.5% of unexecuted contract value.</p></div>
        </div>
      </PageShell>

      {/* ── PAGE 8: CONTRACTUAL ARTICLES 21 TO 31 ── */}
      <PageShell pageNum={8}>
        <PageLogo />
        <div className="space-y-2 text-[11px] text-black leading-relaxed flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
            Contractual Articles (21 – 31):
          </h2>
          <div><p className="font-bold">Article 21: Communication &amp; Article 22: Suspension</p><p>Written notice via email/letter valid.</p></div>
          <div><p className="font-bold">Article 23: Termination</p><p>30 days written notice for insolvency or persistent non-performance.</p></div>
          <div><p className="font-bold">Article 24: Force Majeure</p><p>Events beyond reasonable control extend performance timelines without breach.</p></div>
          <div><p className="font-bold">Article 25: Applicable Law</p><p>Governed by laws of India, arbitration in New Delhi in English.</p></div>
          <div><p className="font-bold">Article 26: Acceptance (PAC &amp; FAC)</p><p>PAC issued upon equipment installation; commercial use constitutes deemed acceptance.</p></div>
          <div><p className="font-bold">Article 28: Indemnification &amp; Article 29: Insurance</p><p>Mutual indemnity for bodily injury and physical damage caused by gross negligence.</p></div>
          <div><p className="font-bold">Article 30: Confidentiality</p><p>Strict non-disclosure obligations for proprietary software and algorithms.</p></div>
          <div><p className="font-bold">Article 31: Miscellaneous</p><p>No set-off rights. Water &amp; electricity provided free by Purchaser.</p></div>
        </div>
      </PageShell>

      {/* ── PAGE 9: CLIENT REFERENCES, SUBMITTED BY & BANK DETAILS ── */}
      <PageShell pageNum={9}>
        <PageLogo />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Team Expertise &amp; Enterprise Clients:
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-[10.5px] text-black">
              {allClients.slice(0, 30).map((client, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="font-bold shrink-0">{idx + 1}.</span>
                  <span className="truncate">{client}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
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

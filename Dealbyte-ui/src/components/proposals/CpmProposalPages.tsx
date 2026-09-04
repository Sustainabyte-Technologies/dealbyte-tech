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

  const PageLogo = () => (
    <div className="flex justify-end pb-1 shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Pvt Ltd" className="h-12 w-auto object-contain" />
    </div>
  );

  const PageHeader = ({ annexure }: { annexure?: string }) => (
    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-300 text-[10.5px] text-slate-700 font-medium shrink-0">
      <div className="flex flex-col space-y-0.5">
        <span>Quotation No: <strong className="text-black font-semibold">{proposalRef || 'STPL-26-83/v1'}</strong></span>
        <span>Date : <strong className="text-black font-semibold">{proposalDate || '10th August 2026'}</strong></span>
      </div>
      {annexure && (
        <span className="text-[11.5px] font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300 tracking-wide">
          {annexure}
        </span>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Pvt Ltd" className="h-9 w-auto object-contain" />
    </div>
  );

  const PageShell = ({ pageNum, children }: { pageNum: number; children: React.ReactNode }) => (
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
        <div className="relative z-10 flex-1 flex flex-col justify-between h-full overflow-hidden">
          <div className="flex-1 flex flex-col justify-start overflow-hidden">
            {children}
          </div>
          <div className="text-center pt-2 shrink-0 border-t border-slate-200 mt-2">
            <span className="text-[11px] text-slate-500 font-medium">{pageNum}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const keyProjects = [
    'Mazaya Business Avenue ,Dubai',
    'ASHRAE Level 2 audit at 6 Commercial Building ,Dubai',
    'Danat Al Emarat Hospital , Dubai by Aatral',
    'Suzlon Energy Pvt Ltd',
    'Velmurugan Industries ltd',
    'Capital Land by orien Energy',
    'Casagrand Eco tech ,Sollinganallur',
    'Tidal Park ,Pattabiram',
    'TNQ software Tharamani,',
    'Embassy Tech village Kadu bisenahalli Bengaluru',
    'Embassy ETZ pune',
    'First source Limited Vijayawada',
    'First source Limited ,Hyderabad',
    'First source Limited Chennai',
    'Valeo software Sholinganallur',
    'Soildpro ,Chennai',
    'SRM University Chennai',
    'Development Environergy Services Limited -IIT Hyderabad',
  ];

  const otherCustomers = [
    'Aatral Engineering',
    'Velmurugan Heavy Engineering Industries Private Limited',
    '20cube Logistics Solutions Private Limited',
    'Danfoss Industries Private Limited',
    'Knowledge Bridge',
    'S G Snacks India Pvt. Ltd.',
    '20cube Logistics Solutions Private Limited',
    'Parekhplast India Limited',
    'PMEL Oragadam Private Limited -Unit 3 & 4',
    'Lucas Tvs Limited-Padi',
    'Visalam Technologies LLP',
    'Adspaas Polymer Solutions Limited',
    'Wheels India Limited',
    'India Metal One Steel Plate Processing Pvt. Ltd',
    'Aisan Auto Parts India Private Limited',
    'Whirlpool of India Limited',
    'ITC -Medak Ltd',
    'Kone Elevator India Private Limited',
    'KPR Mill Limited',
    'Concorde Textiles ltd',
    'Arni Engineerig Tech Private Ltd',
    'Growserve Enterprises-Ashirwad',
    'Vashi Integrated Solution Limited',
    'Ahlstrom Fiber composite Pvt Ltd',
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
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 my-auto">
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Technical &amp; Commercial Proposal
            </span>
            <h1 className="text-[23px] font-bold text-slate-900 leading-snug max-w-[650px] mx-auto pt-2">
              Techno Commercial Proposal for Central Plant Monitoring (CPM) System
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Chiller Management &bull; Central Plant Management (CPM)
            </p>
          </div>

          {(proposal as any)?.clientLogo && (
            <div className="py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={(proposal as any).clientLogo} alt={`${deal?.clientName || 'Client'} Logo`} className="max-h-[110px] w-auto object-contain mx-auto" />
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-center text-[12px] text-slate-800 space-y-1.5 w-full max-w-[400px]">
            <p className="font-semibold text-slate-900 text-[13px]">{clientName || 'Valued Customer'}</p>
            <p><span className="text-slate-500">Quotation No:</span> <span className="font-bold text-slate-900">{proposalRef || 'STPL-26-83/v1'}</span></p>
            <p><span className="text-slate-500">Date :</span> <span className="font-bold text-slate-900">{proposalDate || '10th August 2026'}</span></p>
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
        <PageHeader />
        <div className="space-y-4 flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1">
            About Sustainabyte:
          </h2>
          <div className="space-y-3.5 text-[11.5px] text-black leading-relaxed">
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

      {/* ── PAGE 3: CPM SYSTEM ARCHITECTURE ── */}
      <PageShell pageNum={3}>
        <PageHeader />
        <div className="space-y-4 flex-1">
          <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-1">
            Central Plant Monitoring (CPM) System Architecture:
          </h2>
          <div className="flex justify-center my-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cpm-architecture.png"
              alt="CPM System Architecture"
              className="w-full h-auto max-h-[260px] object-contain border border-slate-300 rounded-lg p-2 bg-slate-50"
            />
          </div>
          <div className="space-y-2.5 text-[11.5px] text-black leading-relaxed">
            <p className="font-semibold text-slate-900">
              The OptiByte Central Plant Monitoring (CPM) architecture provides end-to-end plant telemetry, automation supervisory control, and real-time efficiency analytics:
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <strong>Field Instrumentation:</strong> Precision temperature sensors (PT100), differential pressure transmitters, and electromagnetic flow meters hardwired directly to high-reliability DDC panels.
              </li>
              <li>
                <strong>Energy Meters &amp; Transducers:</strong> Connected directly to the DDC Panel network via Modbus RTU (RS485) communication bus for instant power, voltage, current, and harmonics telemetry.
              </li>
              <li>
                <strong>DDC Panel &amp; Local Plant Server:</strong> Edge controllers process input/output loops locally. Real-time data is served to the local Web HMI dashboard over Ethernet LAN for continuous operator control.
              </li>
              <li>
                <strong>OptiByte Cloud Analytics Platform:</strong> Secure gateway uplinks telemetry to the cloud engine, enabling automated COP/kW-per-TR calculations, predictive maintenance alerts, and ASHRAE performance reporting.
              </li>
            </ul>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: ANNEXURE - II: COMMERCIAL INVESTMENT ── */}
      <PageShell pageNum={4}>
        <PageHeader annexure="Annexure – II" />
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-3">
              Commercial Investment:
            </h2>
            <table className="w-full border-collapse border border-black text-[11px] text-black">
              <thead>
                <tr className="bg-[#C6EFCE]">
                  <th className="border border-black py-2 px-2 text-center font-bold w-10">S.No</th>
                  <th className="border border-black py-2 px-2 text-left font-bold">Description</th>
                  <th className="border border-black py-2 px-2 text-center font-bold w-14">Count</th>
                  <th className="border border-black py-2 px-2 text-center font-bold w-14">Unit</th>
                  <th className="border border-black py-2 px-2 text-right font-bold w-28">Cost (INR)</th>
                </tr>
              </thead>
              <tbody>
                {displayCommercialItems.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/70' : ''}>
                    <td className="border border-black py-2 px-2 text-center">{idx + 1}</td>
                    <td className="border border-black py-2 px-2">{item.description}</td>
                    <td className="border border-black py-2 px-2 text-center">{item.count || ''}</td>
                    <td className="border border-black py-2 px-2 text-center">{item.unit || ''}</td>
                    <td className="border border-black py-2 px-2 text-right font-bold">
                      {formatCurrency(item.cost)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold bg-slate-100">
                  <td colSpan={4} className="border border-black py-2.5 px-2 text-center font-bold text-[12px]">Total Commercial Investment</td>
                  <td className="border border-black py-2.5 px-2 text-right font-bold text-[12px] text-emerald-800">
                    {formatCurrency(displayFinalTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="pt-2 text-[11px] text-slate-700 italic">
            * Commercial figures above reflect the comprehensive scope of hardware, automation engineering, and project commissioning as per the approved bill of quantities (BOQ). Detailed notes and scope boundaries are enumerated in the subsequent section.
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 5: NOTES & SCOPE OF WORK ── */}
      <PageShell pageNum={5}>
        <PageHeader annexure="Annexure – II" />
        <div className="space-y-4 flex-1 text-[11px] text-black leading-relaxed">
          <div>
            <h2 className="text-[16px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Notes:
            </h2>
            <ul className="space-y-1.5 list-none pl-1">
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>Cabling quantity is considered as per BOQ/Thumb-rule Basis. Any increase/decrease in the quantity shall be billed against the consumed quantity after complete execution of project.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>Controller quantity is calculated as per the provided IO summary/equipment quantity, any changes in the same will have price impact.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>Mod-bus card for the VFD/ chiller in client&apos;s scope.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>Installation and services of Sensors, Valves, BTU meters, Flow meters, VFD etc. is not in our scope.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>Any Civil work and electrical works not in our scope.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>Water, Power &amp; Scaffolding to be provided at FOC at site, unless otherwise agreed mutually.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>Any change in the quantity will have price impact on the quoted price.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>Adapter box &amp; Network Switch is not in our scope of supply/installation.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>Field devices are considered as per the standard design/as per BOQ. Any changes in quantity will have price impact.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>Drawings need to be shared for optimization of the project.</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <h2 className="text-[15px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Basis of Offer and Scope of work for Sustainabyte.ai:
            </h2>
            <ul className="space-y-1.5 list-none pl-1">
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>UPS Power Point if required will be provided by Client.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>Any additional item required as per site requirement will be under customer scope (or) provide on extra chargeable basis.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>We considered ducting, false ceiling, Civil, electrical, Welding, plumbing work will not be in our scope which obstruct/ required for our activity.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>Arrange the Ladders &amp; scaffoldings as per site requirement is under customer scope.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>Safety Walls, Safety Caution Boards &amp; Directions, Material Lifts &amp; Man lifts provided by customer for working area floors.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">▪</span>
                <span>LAN point and static IP, Power shall be provided by customer.</span>
              </li>
            </ul>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 6: ANNEXURE - III: TERMS & CONDITIONS ── */}
      <PageShell pageNum={6}>
        <PageHeader annexure="Annexure – III" />
        <div className="space-y-3 flex-1 text-[10.5px] text-black leading-relaxed">
          <div>
            <h2 className="text-[15px] font-bold text-black underline underline-offset-4 decoration-1 mb-1.5">
              Terms &amp; Conditions:
            </h2>
            <ol className="space-y-1 pl-4 list-decimal">
              <li><strong>Offer Validity:</strong> One Month (30 days from proposal date).</li>
              <li>
                <strong>Payment Terms:</strong>
                <p className="pl-2">50% advance against Pro-Forma Invoice, 40% against Supply within 15 days and 10 % after completion of the project.</p>
              </li>
              <li>
                <strong>Taxes:</strong> As per GST @18% (Material Packing &amp; Forwarding / Transport: Inclusive).
              </li>
              <li>
                <strong>Delivery:</strong> 10 to 12 Weeks from the approved date of PO and Design Document by Customer as per site requirement.
              </li>
              <li>
                <strong>Warranty for Supply:</strong> 1 year from the date of Deliver the material at site.
              </li>
              <li>
                If any Power fluctuations / variations for input voltage to Field devices / controllers, for device failure customer has to consider in their scope.
              </li>
              <li>
                For any environmental effects, damages of devices / controller failure customer are responsible.
              </li>
              <li>
                5 to 6 weeks after receiving the materials at site Installation &amp; Commissioning will be completed.
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-bold text-[11.5px] text-black mb-1">Limitation to Liability:</h3>
            <p className="text-justify leading-snug">
              Notwithstanding anything in the Contract to the contrary and to the extent permitted by applicable law, (a) in no event shall either Party, its officers, directors, or employees be liable for any form of incidental, consequential, indirect, special or punitive damages of any kind, or for loss of revenue or profits, loss of business, loss of information or data, or other financial loss, whether such damages arise in contract, tort or otherwise, irrespective of fault, negligence or strict liability or whether such Party has been advised in advance of the possibility of such damages; and (b) the maximum liability of the Seller for any and all claims, losses, damages, costs and expenses arising from or on connection with this Agreement shall not exceed the amounts actually received by the Seller / Service Provider under this Agreement.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11.5px] text-black mb-1">Price:</h3>
            <ol className="space-y-0.5 pl-4 list-decimal text-[10px]">
              <li>The Price quoted is in accordance with the Man Basis as per working days as per approved by the client. Any change in the Work due to Customer’s / Consultant written request, Statutory Regulations by local authority shall be subject to extra charge payable to Sustainabyte.ai.</li>
              <li>The change in the scope of work and cost thereof shall be as per mutual consent.</li>
              <li>Price quoted are FOR site basis variation including but not limited to change in interpretation by State Government, new levy of taxes and duties, introduction of new taxes and duties through amendment / circulars which causes any change in the rate of taxes and duties during the contractual period will be charged extra.</li>
              <li>The price quoted for this job shall be valid till 30DAYS from the date of this quote.</li>
              <li>The price escalation clause will be applied in case of delay attributable to clients.</li>
            </ol>
          </div>

          <div className="space-y-1 text-[10px] pt-1">
            <p><strong>Exclusion of work:</strong> Any kind of Civil, Carpentry, and Plumbing &amp; Electrical Works required to the mains of the power supply system.</p>
            <p><strong>Delay in payment:</strong> Timely receipt of payment from the customer is the essence of this job. Any delay of payment shall constitute ground for extension of delivery and delay in execution of project without liquidated damages, in addition to interest of 18% p.a. on delayed payment.</p>
            <p><strong>Order Cancellation:</strong> In case of order cancellation, customer is liable to pay 5% of project price as penalty charges. In case order gets cancelled at advance stage of project completion then the actual loss incurred by us on this project will be reimbursed by customer provided vendor is not at fault.</p>
            <p><strong>Storage at Site:</strong> The customer shall make available proper storage place for the storage of material during the execution of this job.</p>
            <p><strong>Force Majeure Conditions:</strong> The Company shall not be held liable for any delay in delivery of equipment or execution of the project caused due to force majeure conditions occurring either at customer’s end or at the Company’s end. Such force majeure conditions include Act of God, Fire, Epidemic, Food, Riots, War, Sabotage, strike, and lock-ups.</p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 7: GENERAL EXCLUSIONS & GCC ARTICLES 1 TO 4 ── */}
      <PageShell pageNum={7}>
        <PageHeader annexure="Annexure – III" />
        <div className="space-y-3 flex-1 text-[10px] text-black leading-relaxed">
          <div>
            <h2 className="text-[14px] font-bold text-black underline underline-offset-4 decoration-1 mb-1">
              General Exclusion:
            </h2>
            <p className="mb-1">
              This technical offer is valid for the supply of equipment and services in strict compliance with the specified quantities, and the detailed technical description included in this quotation. Generally speaking, all equipment or services not explicitly mentioned in our offer are not included, such as:
            </p>
            <ul className="space-y-0.5 list-none pl-2">
              <li>▪ Site accommodation and storage facilities.</li>
              <li>▪ Removal and disposal of redundant equipment and materials.</li>
              <li>▪ Attendance upon other parties.</li>
              <li>▪ Work area lighting and temporary electrical supplies.</li>
              <li>▪ Builders work, panel bases and plinths, removal and replacement of building fabric elements, cutting holes and chases, making good and painting.</li>
              <li>▪ Draining down, refilling, venting and system balancing.</li>
              <li>▪ Provision and cost of fuel and power for installation, commissioning and demonstration.</li>
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-2 space-y-2">
            <div>
              <h3 className="font-bold text-[11.5px] text-black">Article 1: Scope</h3>
              <p className="text-justify">
                The scope of work is restricted to the supply, packing, forwarding, transportation, erection, testing, and commissioning of the equipment as per the agreed BOQ, drawings, and technical specifications. This specified scope shall be completed within the agreed timelines and in accordance with the other provisions and obligations of each Party. Unless specifically agreed by us in writing, no other supply or services shall be considered part of the scope, deliverables, or obligations of Sustainabyte.ai. The Buyer shall ensure that all civil foundations are ready on time as per the drawings for all equipment. Any delay in providing or rework of the foundations shall be attributable to the Buyer. It is also categorically agreed between the Parties that the Seller shall not consider any civil works as part of its scope of work.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[11.5px] text-black">Article 2: Priority of Documents</h3>
              <p>
                The documents forming the Contract are to be taken as mutually explanatory of one another. For the purpose of interpretation, the priority of the documents shall be in accordance with the following sequence:
              </p>
              <p className="pl-3 italic font-medium">
                a) The Contract Agreement &nbsp;|&nbsp; b) The Letter of Award &nbsp;|&nbsp; c) Minutes of Meeting &nbsp;|&nbsp; d) Seller’s Offer &nbsp;|&nbsp; e) General Conditions of Contract &nbsp;|&nbsp; f) Schedules &amp; Annexures &nbsp;|&nbsp; g) The Technical Specifications
              </p>
              <p>If any ambiguity or discrepancy arises or is found in the documents, the same shall be mutually resolved between the Parties.</p>
            </div>

            <div>
              <h3 className="font-bold text-[11.5px] text-black">Article 3: Drawings / Dimension Sheets</h3>
              <p className="text-justify">
                All drawings, data sheets, specifications, and other documents submitted for the Buyer&apos;s approval shall be approved within 5 days. All such documents shall form an integral part of the Contract, and the same shall be binding upon the Parties. The agreed documents, drawings, and data sheets shall be duly signed and stamped to ascertain their authenticity and correctness. It is agreed between the Parties that the basic Single Line Diagram (SLD) and Layout will be submitted within 10 days of the Contract coming into force. The Seller shall submit the General Arrangement (GA) drawings, SLD, and Guaranteed Technical Particulars (GTP) to the Buyer for its approval.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[11.5px] text-black">Article 4: Coming into Force</h3>
              <p className="text-justify">
                The Contract shall come into force on the day when all the following conditions are met: (1) Agreement/Contract document duly signed by the authorized representatives of both Parties; (2) The agreed 50% payment has been received by the Seller; (3) Full access to and possession of the site have been granted to the Seller for site activities; (4) A kick-off meeting between the Buyer and the Seller has been held, and the Minutes of Meeting have been distributed; (5) Drawings have been approved by the Buyer.
              </p>
              <p className="text-justify">
                Upon fulfilment of the above conditions, the Buyer shall issue a Notice to Proceed (&quot;NTP&quot;) to the Seller, which shall be the Work Starting Date and shall be construed as the Zero (0) Date of the agreed schedule. The NTP shall be issued only after the completion of the last condition (or milestone) from the above conditions. However, the Contract shall come into force within one month from the effective date of the Contract.
              </p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 8: GCC ARTICLES 5 TO 10 ── */}
      <PageShell pageNum={8}>
        <PageHeader annexure="Annexure – III" />
        <div className="space-y-2.5 flex-1 text-[10px] text-black leading-relaxed">
          <h2 className="text-[14px] font-bold text-black underline underline-offset-4 decoration-1 mb-1">
            General Conditions of Contract (Articles 5 – 10):
          </h2>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 5: Offer Validity</h3>
            <p>The Seller’s Offer is valid for 30 days from the date of the Offer, after the expiry of which it shall be subject to confirmation or revision, if any, by the Seller.</p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 6: Contract Price</h3>
            <p className="text-justify">
              The Contract Price is based on the scope, specifications, drawings, layout, technical specifications, and provisions of the Contract agreed between the Parties. The Price is inclusive of freight up to the Site for the supply of equipment and materials. The Contract Price is exclusive of taxes and duties, which shall be charged to the Contract on an actual basis. Applicable road permits (waybills) and Form-C for CST transactions, or any other applicable permits/forms at the Project Site, shall be provided by the Buyer prior to the readiness of the equipment, materials, or goods. In the event of any default or failure by the Buyer to provide the applicable waybills, all applicable taxes and duties shall be charged to the Buyer. The Buyer shall make all payments in Indian Rupees (INR), unless otherwise agreed between the Parties.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 7: Transfer of Risk and Title</h3>
            <p className="text-justify">
              Ownership and title to the Products sold under the Contract shall be retained by the Seller until the entire purchase price and all other sums due under the Contract have been fully paid. The Buyer agrees to do all things required to protect the Seller’s ownership and title to the Products and not to do anything prejudicial to, or in any way affecting, the Seller’s ownership and title to the Products without the Seller’s written consent. The risk of loss or damage to the Products shall pass to the Buyer as per the Incoterms agreed in the Contract.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 8: Taxes, Duties and Statutory Variations</h3>
            <p className="text-justify">
              Taxes and duties applicable to the Seller’s quoted Price shall be as per the Seller’s Price Offer. The Contract Price does not include Entry Tax, Octroi, Labor Cess, etc., which shall be charged extra on an actual basis. Wherever applicable, certificates for concessions on sales tax and the required statutory forms shall be issued by the Buyer along with the due payment. Any statutory variation, including any change, addition, deletion, abolition, repeal, or reclassification arising due to a change in law and/or directives issued by the authorized authorities, shall be exclusively to the Buyer’s account.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 9: Terms of Payment</h3>
            <p className="text-justify">
              The Buyer shall release all payments due to the Seller on a pro-rata basis within 7 days from the date of receipt of the relevant documents, in accordance with the following Terms of Payment:
            </p>
            <p className="font-semibold pt-0.5">9.1 Supply Portion: 15 days’ credit.</p>
            <p className="text-justify">
              The Seller shall raise progressive running account bills on a fortnightly basis. The Buyer shall certify all measurements within 5 days of submission. In the event that the Buyer fails to make the due payment within the agreed stipulated timeframe, the Seller shall be entitled to charge interest at the rate of 18% per annum on all overdue payments until the date the payments are received.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 10: Variation / Change Management</h3>
            <p className="text-justify">
              Either Party shall have the right to propose changes to the other Party that are considered necessary or desirable to improve the quality, efficiency, or safety of the works agreed under the Contract. Such proposals may include changes in scope, design, specifications, calculations, makes, sizes, quantities, deliverables, milestones, schedule, or documents (&quot;Change&quot;). The requesting Party shall prepare the Change Requirement or Request for Change (RFC), describing the affected item, purpose, justification, impact, and effective timeline. The receiving Party shall communicate its decision within 7 (seven) calendar days. Upon agreement, the Buyer shall amend the relevant documents within 7 calendar days.
            </p>
            <p className="text-justify">
              Any Change up to &plusmn;10% of the Contract Price may be considered at the agreed Prices/Rates, along with the necessary extension of time. For Changes exceeding 10%, the same shall be subject to the Seller&apos;s acceptance of revised prices and delivery periods. Any additional or new work shall be carried out on a Cost Plus basis and charged as <strong>Cost + Overheads + 25% Profit Margin</strong>.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 9: GCC ARTICLES 11 TO 15 ── */}
      <PageShell pageNum={9}>
        <PageHeader annexure="Annexure – III" />
        <div className="space-y-3 flex-1 text-[10px] text-black leading-relaxed">
          <h2 className="text-[14px] font-bold text-black underline underline-offset-4 decoration-1 mb-1">
            General Conditions of Contract (Articles 11 – 15):
          </h2>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 11: Testing Charges / Inspection</h3>
            <p className="text-justify">
              The Parties agree that the Seller shall be responsible for carrying out routine/acceptance tests as per the relevant IS (Indian Standards) for the final Equipment. However, if the Buyer desires to witness the routine tests, the same shall be mutually agreed between the Parties. Type tests shall not be conducted. In case the Buyer wishes to conduct Type Tests, the same shall be carried out at the Buyer&apos;s cost, along with the applicable additional time required.
            </p>
            <p className="text-justify">
              In the event of the Buyer&apos;s inspection at the manufacturer&apos;s works, all costs towards logistics, travel, accommodation, conveyance, and allowances of the Buyer&apos;s personnel shall be borne by the Buyer. The Seller shall provide 3 (three) days&apos; prior intimation to the Buyer. Upon clearance of the inspection, the Buyer shall provide the Dispatch Authorization within 2 (two) days, enabling shipment. It is agreed that the Buyer shall carry out inspections only for Transformers and LT Panels at the manufacturer&apos;s works. Equipment erection, functional testing, and commissioning shall be carried out at the Site in accordance with the User and Maintenance Manual.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 12: Goods Receipts and Storage</h3>
            <p className="text-justify">
              The Parties agree that, upon delivery of all materials to the designated stores, the Buyer shall issue the Goods Receipt within 48 hours, failing which the materials shall be deemed to have been delivered and accepted by the Buyer. All measurements of the works shall be certified by the Buyer within 5 days, so that correct and complete invoices can be raised in a timely manner.
            </p>
            <p className="text-justify">
              In case storage of goods becomes necessary because immediate dispatch to destination is not possible due to lack of instructions from the Buyer, Buyer&apos;s default, unavailability of transport facilities, or reasons attributable to the Buyer, the cost of such storage at &frac12;% per week of the basic price, along with demurrage and incidental charges on actual basis, shall be to the Buyer&apos;s account.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 13: Completion Period</h3>
            <p className="text-justify">
              The Seller shall complete its scope of work as per the agreed schedule or as extended by the Buyer. The Notice to Proceed (NTP) shall be considered the Work Starting Date. During delivery, the Seller shall be entitled to supply materials/services in partial or complete lots, and corresponding payments shall be released by the Buyer. The completion period shall be duly extended upon: Buyer delays or failures; payment not received on time; scope changes; hindrances on Buyer&apos;s side; temporary contract suspension; or Force Majeure conditions. Once delays are removed, a revised delivery schedule will be submitted.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 15: Overall Limitation to Liability</h3>
            <p className="text-justify">
              Notwithstanding anything to the contrary contained in the Contract, and to the extent permitted by applicable law: (a) in no event shall either Party, or its officers, directors, or employees, be liable for any incidental, consequential, indirect, special, or punitive damages of any kind, or for any loss of revenue or profits, loss of business, loss of information or data, or any other financial loss, whether such damages arise in contract, tort, or otherwise, irrespective of fault, negligence, or strict liability; and (b) the maximum liability of the Seller for any and all claims, losses, damages, costs, and expenses arising from or in connection with this Contract shall not exceed the amounts actually received by the Seller under this Contract.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 10: GCC ARTICLES 16, 17, 18 ── */}
      <PageShell pageNum={10}>
        <PageHeader annexure="Annexure – III" />
        <div className="space-y-3 flex-1 text-[10px] text-black leading-relaxed">
          <h2 className="text-[14px] font-bold text-black underline underline-offset-4 decoration-1 mb-1">
            General Conditions of Contract (Articles 16 – 18):
          </h2>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 16: Warranty</h3>
            <p className="font-semibold">Warranty Period: One (1) year from the date of handover.</p>
            <p className="text-justify pt-0.5">
              <strong>Products:</strong> During the warranty period for Products, the Seller undertakes to repair and/or replace any part found faulty due to errors in design, manufacture, or defective materials. Complaints shall be made in writing without undue delay. The warranty shall be honored only when repairs have been carried out by the Seller or authorized agents using genuine parts. Defective parts shall be forwarded carriage paid to the Seller and remain Seller property. If the Seller performs repairs at the Buyer&apos;s site, warranty covers only material and effective working-hour costs; travel time, lodging, and board shall be charged to the Buyer.
            </p>
            <p className="text-justify pt-0.5">
              Warranty does not cover damages caused by Buyer misuse, improper application, incorrect electrical current, inadequate water/drainage, corrosive atmosphere, unauthorized repairs, transit accidents, tampering, exposure to elements, or Force Majeure.
            </p>
            <p className="text-justify pt-0.5">
              <strong>Services:</strong> All Services shall be carried out in a professional manner in accordance with industry standards. For any deficiencies notified in writing within thirty (30) days following completion of Services, the Seller shall provide remedial Services at no cost.
            </p>
            <p className="text-justify pt-0.5 font-medium">
              THESE WARRANTIES ARE THE BUYER&apos;S EXCLUSIVE WARRANTIES AND REPLACE ALL OTHER WARRANTIES OR CONDITIONS, EXPRESS OR IMPLIED, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 17: Buyer’s Obligations</h3>
            <p className="text-justify">
              During the entire duration of the Contract, both Parties shall ensure fulfilment of their respective obligations. Unless otherwise specifically agreed, electricity, water, and gas required for construction purposes (including connection and consumption) shall be provided by the Buyer free of cost throughout the performance of the Contract. The Buyer shall also provide, free of cost, a site office, storage facilities for Equipment and materials, and security for the stores and site.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 18: Assignment and Sub-Contract</h3>
            <p className="text-justify">
              Neither Party shall assign the Contract (in whole or in part) or any of its obligations without the prior written consent of the other Party, even if such entity belongs to the same group of companies. The Seller shall be permitted to subcontract the Contract (in whole or in part) to any third-party subcontractor. However, this shall not absolve the Seller of its obligations, performance, or responsibilities under the Contract.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 11: GCC ARTICLES 19 & 20 ── */}
      <PageShell pageNum={11}>
        <PageHeader annexure="Annexure – III" />
        <div className="space-y-3 flex-1 text-[9.8px] text-black leading-relaxed">
          <h2 className="text-[14px] font-bold text-black underline underline-offset-4 decoration-1 mb-1">
            General Conditions of Contract (Articles 19 – 20):
          </h2>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 19: Intellectual Property &amp; Software License</h3>
            <p className="text-justify">
              Any drawings, designs, technical documents, know-how, and confidential information, whether patented or not, shall remain the exclusive property of the respective Party. The Seller grants the Buyer a non-exclusive, non-transferable, and terminable (upon default) right to use the software or Intellectual Property Rights (IPR) supplied, solely at the relevant site. No ownership or licensing rights transfer to the Buyer.
            </p>
            <p className="text-justify pt-0.5">
              <strong>SOFTWARE LICENSE:</strong> The Seller grants the Buyer a single, non-exclusive license, terminable upon default, solely at the specified site. The Buyer shall not assign, sublicense, distribute, or copy any Software (except as necessary for authorized use). Each copy must bear confidentiality notices. Updated software remains subject to all license conditions. Upon termination, software and all copies shall be returned to the Seller. Software not manufactured by the Seller is subject to respective manufacturer license terms.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 20: Intellectual Property Indemnification</h3>
            <p className="text-justify">
              The Seller shall defend, indemnify, and hold harmless the Buyer against any valid claim that the Buyer&apos;s use or sale of Products infringes any Indian patent or copyright, provided the Buyer gives prompt written notice, allows sole control of defense, and cooperates fully. The Seller may: (a) procure the right to continue using; (b) replace/modify to make non-infringing; or (c) grant credit based on depreciated value and accept return.
            </p>
            <p className="text-justify pt-0.5">
              The Seller shall not be liable for claims based on: (i) modified form; (ii) combination with external goods/services; (iii) process practice; or (iv) information/assistance furnished. In no event shall total liability under this section exceed the aggregate amount paid by Buyer for the allegedly infringing Product. The Buyer shall indemnify the Seller against infringement claims arising from Seller&apos;s compliance with Buyer&apos;s designs or specifications.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 20: Liquidated Damages</h3>
            <p className="text-justify">
              If the Seller fails to meet the Completion Schedule as mutually agreed, the Buyer shall have the right to recover or deduct from the Seller&apos;s due claims an amount equivalent to <strong>0.25% of the value of the unexecuted portion of the Contract per week</strong> until the equipment is delivered or activity performed, subject to a <strong>maximum ceiling of 2.5% of the value of the unexecuted portion</strong> of the Contract.
            </p>
            <p className="text-justify pt-0.5">
              Such liquidated damages shall be the sole remedy available to the Buyer against the Seller for said delay in achieving overall completion. Liquidated damages shall be applicable only where delays are solely attributable to the Seller, apart from the right to terminate once the maximum cap is reached.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 12: GCC ARTICLES 21 & 22 ── */}
      <PageShell pageNum={12}>
        <PageHeader annexure="Annexure – III" />
        <div className="space-y-3 flex-1 text-[10px] text-black leading-relaxed">
          <h2 className="text-[14px] font-bold text-black underline underline-offset-4 decoration-1 mb-1">
            General Conditions of Contract (Articles 21 – 22):
          </h2>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 21: Communication</h3>
            <p className="text-justify">
              Any written communication exchanged or recorded by or between the Parties through any medium, including emails, Minutes of Meeting, letters, faxes, transmittals, and telegrams, shall be valid and effective for conveying instructions, directions, or requirements to each other under this Contract.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 22: Suspension</h3>
            <p className="text-justify font-semibold">Suspension by the Buyer:</p>
            <p className="text-justify">
              The Buyer may suspend, at any time and for any reason, any part of or the whole of the Work by giving at least 7 days&apos; written notice to the Seller, specifying the part of or the whole of the Work to be suspended, the effective date of suspension, and tentative resumption date. Upon receipt, the Seller shall cease work on the specified part while continuing unsuspended work.
            </p>
            <p className="text-justify">
              During suspension, the Seller shall be entitled to full payment for all Work performed up to the date of suspension and reimbursement of all fair and reasonable costs, including idle resources, demobilization, and remobilization. The Buyer may authorize resumption upon 7 days&apos; notice. In the event of suspension due to an act or omission of either Party or Force Majeure, a Change Order extending the Delivery Schedule shall be executed.
            </p>
            <p className="text-justify font-semibold pt-1">Suspension by the Seller:</p>
            <p className="text-justify">
              The Seller shall have the right to suspend execution of the Works, in whole or in part, due to any of the following reasons not attributable to the Seller:
            </p>
            <ul className="space-y-0.5 list-disc pl-4 text-[9.5px]">
              <li>Delay or default by the Buyer in providing an encumbrance-free site, site access, or approach road.</li>
              <li>Seller&apos;s payments are withheld or suspended beyond a reasonable time limit.</li>
              <li>The Buyer persistently fails to comply with its obligations in a timely manner (drawings, documents, measurements certification).</li>
              <li>Occurrence of a Force Majeure event.</li>
              <li>Change in Law or Government directive making performance impracticable or impossible.</li>
              <li>Repeated suspensions of work or work being withheld by the Buyer.</li>
              <li>Any other reason for which the Seller is not liable and due to which it is not feasible to continue Works.</li>
            </ul>
            <p className="text-justify pt-1">
              If any of the above conditions continue for more than 15 days, the Seller may demobilize resources with compensation for time and cost. If suspension continues for more than 90 days, the Seller shall be entitled to terminate the Contract with full payment for all completed Work.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 13: GCC ARTICLE 23 ── */}
      <PageShell pageNum={13}>
        <PageHeader annexure="Annexure – III" />
        <div className="space-y-2.5 flex-1 text-[9.8px] text-black leading-relaxed">
          <h2 className="text-[14px] font-bold text-black underline underline-offset-4 decoration-1 mb-1">
            General Conditions of Contract (Article 23):
          </h2>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 23: Termination / Cancellation</h3>
            <p className="text-justify">
              Either Party may terminate the Contract by giving the other Party 30 days&apos; prior written notice for: insolvency or bankruptcy; general arrangement with creditors; unreasonable failure to fulfil contractual obligations; material misrepresentation; Force Majeure continuing for 3 months or more; Buyer failure to take delivery for more than 3 months; repeated work suspension exceeding 3 months; or Change in Law rendering performance impossible.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[10.5px] text-black">Termination by the Employer for Default:</h3>
            <p className="text-justify">
              If the Seller is in default, this clause applies only under the following conditions: (a) Notice shall be in writing; (b) Permitted only in the event of a material breach not remedied within a predefined period; (c) Wherever possible, limited only to the affected scope of work; and (d) In cases of delay, permitted only after the maximum liquidated damages ceiling (2.5%) has been reached.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[10.5px] text-black">Termination by the Seller:</h3>
            <p className="text-justify">
              The Seller may terminate or cancel the Contract by giving 30 days&apos; prior written notice for any of the following reasons:
            </p>
            <ol className="space-y-0.5 list-decimal pl-4 text-[9.2px]">
              <li>Insolvency, receivership, or bankruptcy proceedings commenced by or against the Buyer.</li>
              <li>Seller&apos;s payments are withheld or suspended beyond a reasonable time limit.</li>
              <li>Buyer fails to fulfil contractual obligations or makes false material representations.</li>
              <li>Buyer assigns or transfers the Contract without authorization.</li>
              <li>Buyer persistently fails to comply with obligations (approvals, measurements certification).</li>
              <li>Force Majeure continues for 3 months or more.</li>
              <li>Buyer fails to take delivery of materials for more than 3 months.</li>
              <li>Repeated suspension of Work attributable to Buyer.</li>
              <li>Change in Law rendering performance impracticable.</li>
              <li>Buyer fails to provide encumbrance-free land or access to Project Site is restricted.</li>
            </ol>
            <p className="text-justify pt-1 font-medium">
              Financial Settlement on Termination: In the event of termination or project abandonment, the Seller shall be entitled to full payment for all Work performed (certified or uncertified), all payments due against confirmed commitments for ordered materials, goods, and subcontractor services, reasonable profit on the terminated portion, plus a termination fee equal to <strong>10% of the Contract Price</strong>, in addition to all other legal remedies.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 14: GCC ARTICLES 24 & 25 ── */}
      <PageShell pageNum={14}>
        <PageHeader annexure="Annexure – III" />
        <div className="space-y-3 flex-1 text-[10px] text-black leading-relaxed">
          <h2 className="text-[14px] font-bold text-black underline underline-offset-4 decoration-1 mb-1">
            General Conditions of Contract (Articles 24 – 25):
          </h2>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 24: Force Majeure</h3>
            <p className="text-justify">
              No delay or failure in performance shall constitute a breach or give rise to claims if resulting from Force Majeure events beyond reasonable control, including:
            </p>
            <ul className="space-y-1 list-none pl-2 text-[9.5px]">
              <li><strong>(a) Natural Events:</strong> Fire, flood, heavy rains, snow, lightning, drought, storm, typhoon, earthquake, tsunami, landslides, washouts, epidemics, unusual inclement weather, or Acts of God.</li>
              <li><strong>(b) Civil &amp; Political Events:</strong> War (declared or undeclared), hostilities, explosions, insurrection, rebellion, sabotage, vandalism, riots, strikes, freight embargoes, civil commotion, or labour disturbances.</li>
              <li><strong>(c) Government Actions:</strong> Acts or omissions of courts, legislative bodies, condemnation, confiscation of facilities, compliance with government orders, or statutory changes in law.</li>
            </ul>
            <p className="text-justify pt-1">
              Notice of Force Majeure shall be given in writing no later than 15 (fifteen) days following occurrence. Performance time shall be extended for the duration of the event. If Force Majeure continues for 3 (three) months, either Party may suspend the Contract with equitable time extension granted.
            </p>
            <p className="text-justify pt-0.5">
              If Parties decide to terminate due to continuing Force Majeure, accounts shall be settled without claiming damages, and the Seller shall be entitled to payment for the entire cost of Work completed up to termination date.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 25: Applicable Law and Dispute Resolution</h3>
            <p className="text-justify">
              The Contract shall be governed by and interpreted in accordance with the laws of India for all purposes. Any and all disputes, claims, or controversies (&quot;Disputes&quot;) that cannot be resolved through mutual negotiations shall be finally settled by arbitration under the Arbitration and Conciliation Act, 1996 (&quot;Act&quot;), as amended.
            </p>
            <p className="text-justify pt-0.5">
              <strong>Arbitral Tribunal:</strong> Each Party shall appoint one arbitrator, and the third arbitrator (Presiding Arbitrator) shall be appointed by the two designated arbitrators.
            </p>
            <p className="text-justify pt-0.5">
              <strong>Venue &amp; Jurisdiction:</strong> Arbitration proceedings shall be conducted in <strong>New Delhi</strong> in the <strong>English</strong> language. Arbitral awards shall be final and binding. The Contract shall be subject to the exclusive jurisdiction of the competent courts at New Delhi solely for enforcement of arbitration provisions and awards.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 15: GCC ARTICLES 26 TO 29 ── */}
      <PageShell pageNum={15}>
        <PageHeader annexure="Annexure – III" />
        <div className="space-y-3 flex-1 text-[9.8px] text-black leading-relaxed">
          <h2 className="text-[14px] font-bold text-black underline underline-offset-4 decoration-1 mb-1">
            General Conditions of Contract (Articles 26 – 29):
          </h2>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 26: Provisional Acceptance</h3>
            <p className="text-justify">
              Supplies and services shall be certified by the Buyer within 5 days of document submission. Upon complete installation, testing, and commissioning, Buyer shall issue a Provisional Acceptance Certificate (PAC). Punch-list items shall not withhold PAC issuance, and Seller is authorized to rectify punch-list items post-PAC. Partial commissioning shall warrant Partial PAC. Upon equipment commissioning or energization, the EAR insurance policy lapses, and Buyer must arrange operational insurance at own cost.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 27: Final Acceptance</h3>
            <p className="text-justify">
              Final Acceptance Certificate (FAC) is issued when: material reconciliation is submitted, testing defects are rectified, as-built drawings and manuals handed over, and scrap/debris removed. If the Buyer fails to issue FAC in reasonable time, or puts equipment into commercial service, or fails to participate in tests despite advance notice, such action constitutes <strong>deemed acceptance</strong>, and risk of the System transfers to Buyer.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 28: General Indemnification</h3>
            <p className="text-justify">
              Each Party shall indemnify and hold harmless the other Party, its officers, and employees against third-party claims for personal injury, death, or property damage directly caused by negligence or willful misconduct, provided prompt written notice is given and cooperation afforded. No settlement shall be entered into without indemnifying Party&apos;s prior written consent.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 29: Insurance</h3>
            <p className="text-justify">
              The Seller shall maintain Transit and Erection All Risk (EAR) Insurance covering its scope of work, manpower, vehicles, and tools. The Buyer shall maintain insurance for land, buildings, Project Site, and third-party liabilities. For Buyer free-issue materials, Buyer provides comprehensive insurance including a 60-day concealed damage period and 50/50 clause. Buyer shall issue NOC enabling Seller to receive insurance proceeds when applicable.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 16: GCC ARTICLES 30 & 31 ── */}
      <PageShell pageNum={16}>
        <PageHeader annexure="Annexure – III" />
        <div className="space-y-2.5 flex-1 text-[9.5px] text-black leading-relaxed">
          <h2 className="text-[14px] font-bold text-black underline underline-offset-4 decoration-1 mb-1">
            General Conditions of Contract (Articles 30 – 31):
          </h2>

          <div>
            <h3 className="font-bold text-[11px] text-black">Article 30: Confidentiality / Do Not Disclose (DND)</h3>
            <p className="text-justify">
              <strong>A) Description:</strong> All information marked confidential or reasonably understood as proprietary disclosed during contract execution constitutes Confidential Information, including all contract terms and pricing.
            </p>
            <p className="text-justify pt-0.5">
              <strong>B) Exceptions:</strong> Does not apply to information publicly known without breach, already possessed prior to disclosure, rightfully acquired from authorized third parties, or independently developed without access.
            </p>
            <p className="text-justify pt-0.5">
              <strong>C) Standard of Care:</strong> Receiving Party shall use no less than reasonable standard of care to safeguard confidential materials and restrict access solely to authorized personnel.
            </p>
            <p className="text-justify pt-0.5">
              <strong>D) Limited Disclosure:</strong> Disclosure permitted only on need-to-know basis or under court order with prompt notice to Disclosing Party.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-2 space-y-1.5">
            <h3 className="font-bold text-[11px] text-black">Article 31: Miscellaneous</h3>
            <p className="text-justify">
              <strong>A. Set off:</strong> The Buyer shall not have the right to exercise any set-off under this Contract.
            </p>
            <p className="text-justify">
              <strong>B. Overrun Charges:</strong> If commissioning is extended due to reasons not attributable to us (civil delays, front release delays, idle work crew), additional charges shall be paid at the rate of <strong>INR 10,000 per man-day/month</strong>.
            </p>
            <p className="text-justify">
              <strong>C. Water &amp; Electricity:</strong> The Purchaser shall provide water and electricity free of cost for construction, installation, testing, and commissioning, as well as good-quality potable drinking water for the workforce.
            </p>
            <p className="text-justify">
              <strong>D. Storage of Materials &amp; Equipment at Site:</strong> Purchaser shall provide access to watertight, weatherproof, and secured storage sheds near the site to protect materials from deterioration, damage, or theft.
            </p>
            <p className="text-justify">
              <strong>E. Disclaimer:</strong> No order shall be valid or binding unless in accordance with these Terms and Conditions or mutually agreed in writing. Any buyer terms contrary to these conditions shall not be enforceable against the Contractor.
            </p>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 17: TEAM EXPERTISE, SUBMITTED BY & BANK DETAILS ── */}
      <PageShell pageNum={17}>
        <PageHeader annexure="Annexure – III" />
        <div className="space-y-3.5 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-black underline underline-offset-4 decoration-1 mb-2">
              Team Expertise:
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9.5px] text-black">
              {keyProjects.map((item, idx) => (
                <div key={idx} className="flex items-start gap-1">
                  <span className="font-bold text-slate-700 shrink-0 w-4">{idx + 1}.</span>
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>

            <h3 className="text-[12px] font-bold text-black underline underline-offset-4 decoration-1 mt-3 mb-1.5">
              Other Customers:
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9.5px] text-black">
              {otherCustomers.map((item, idx) => (
                <div key={idx} className="flex items-start gap-1">
                  <span className="font-bold text-slate-700 shrink-0 w-4">{idx + 19}.</span>
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t-2 border-slate-900 mt-2">
            <div className="space-y-1 text-[11px] text-black">
              <p className="font-bold text-slate-900 text-[12px]">Submitted By,</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Pvt Ltd" className="h-9 w-auto object-contain py-1" />
              <p className="font-bold text-[12px] text-slate-900">Thanakarthik</p>
              <p className="text-slate-700 font-medium">Founder &amp; CEO</p>
              <p className="text-slate-900 font-semibold">+91-8377007638</p>
            </div>

            <div className="space-y-1 text-[11px] text-black bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <p className="font-bold text-[11.5px] text-slate-900 border-b border-slate-300 pb-0.5">Bank Account details:</p>
              <p><span className="text-slate-600">Bank –</span> <strong>Bank of Baroda</strong></p>
              <p><span className="text-slate-600">Account Number –</span> <strong>35860200000750</strong></p>
              <p><span className="text-slate-600">IFSC –</span> <strong>BARB0VELACH</strong> <span className="text-[10px] text-slate-500">(fifth letter is ZERO)</span></p>
              <p><span className="text-slate-600">Branch –</span> <strong>VELACHERY BRANCH</strong></p>
              <p><span className="text-slate-600">GSTIN NO –</span> <strong>33ABNCS4869A1Z7</strong></p>
              <p><span className="text-slate-600">PAN Number –</span> <strong>ABNCS4869A</strong></p>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-200">
            <p className="text-[11px] font-bold text-slate-600 italic">
              Thanking you and assuring you of our sincere services at all times.
            </p>
            <p className="text-[15px] font-black uppercase tracking-widest text-slate-900 pt-1">
              THANK YOU
            </p>
          </div>
        </div>
      </PageShell>
    </>
  );
}

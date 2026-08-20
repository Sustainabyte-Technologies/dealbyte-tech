'use client';

import React from 'react';
import { Proposal } from '@/lib/api/proposals';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ASSESSMENT_ASSETS } from '@/lib/constants/assessment-assets';
import { Send, Printer, Download, Loader2 } from 'lucide-react';
import FullPageWatermark from '@/components/common/FullPageWatermark';
import { toast } from 'sonner';

interface ProposalPreviewProps {
  proposal: Proposal;
  onUpdateStatus: (status: 'DRAFT' | 'REVIEWED' | 'SENT') => void;
  isUpdating?: boolean;
}

interface IotCategoryItem {
  stepNo: string;
  description: string;
  qty: string;
  uom: string;
  customerPrice: number;
  isRecurring?: boolean;
}

interface IotCategory {
  category: string;
  items: IotCategoryItem[];
}

const DEFAULT_IOT_CATEGORIES: IotCategory[] = [
  {
    category: '1. GATEWAY & HARDWARE ENGINEERING SCOPE',
    items: [
      {
        stepNo: '1a',
        description: 'Supply of 4G IoT Gateway for Communication with SIM card, SMPS & Antenna - Edge Pro',
        qty: '1',
        uom: 'Nos',
        customerPrice: 20200,
      },
      {
        stepNo: '1b',
        description: 'Supply of RS485 energy meter with communication and wiring accessories',
        qty: '1',
        uom: 'Nos',
        customerPrice: 15600,
      },
    ],
  },
  {
    category: '2. ELECTRICAL SENSORS & METERING SCOPE',
    items: [
      {
        stepNo: '2a',
        description: 'Supply of 2 core RS 485 Shielded cable for IoT Gateway communication',
        qty: '1',
        uom: 'Coil',
        customerPrice: 7300,
      },
      {
        stepNo: '2b',
        description: 'Supply of 1" conduit pipes',
        qty: '1',
        uom: 'Nos',
        customerPrice: 100,
      },
      {
        stepNo: '2c',
        description: 'Supply of electrical consumables such as flexible hose, cable ties and all other accessories',
        qty: '1',
        uom: 'Job',
        customerPrice: 5500,
      },
    ],
  },
  {
    category: '3. INSTALLATION, CABLING & COMMISSIONING SCOPE',
    items: [
      {
        stepNo: '2',
        description:
          'Installation and commissioning of IoT devices, gateways, modems, and associated electrical/control components including startup, testing, and functional verification. Communication cable laying and routing through conduits, cable trays, and raceways with proper dressing, tagging, and termination. Conduit pipe laying for electrical and communication cabling as per site layout. Modem configuration, network setup, data mapping, testing, troubleshooting, and data validation.',
        qty: '1',
        uom: 'Nodes',
        customerPrice: 40300,
      },
    ],
  },
  {
    category: '4. PLATFORM CONFIGURATION & SYSTEM INTEGRATION SCOPE',
    items: [
      {
        stepNo: '3',
        description:
          'IoT device configuration, protocol setup (Modbus, BACnet, MQTT), and integration with BMS/EMS platforms. Network connectivity, dashboard mapping, alarm configuration, and cloud/server integration support. System commissioning including startup, functional testing, calibration, and performance verification. Troubleshooting, integration testing, client demonstration, and final handover support.',
        qty: '1',
        uom: 'Nodes',
        customerPrice: 1400,
      },
    ],
  },
  {
    category: '5. CLOUD, SLA & RECURRING ANNUAL SUBSCRIPTIONS SCOPE',
    items: [
      {
        stepNo: '1a',
        description: 'Recurring Charges for GSM-GPRS communication enabled IoT SIM Card and valid for one year period.',
        qty: '1',
        uom: 'Nos',
        customerPrice: 2700,
        isRecurring: true,
      },
      {
        stepNo: '1b',
        description:
          'OptiByte Dashboard, Intelligent reporting, Group and machine level reporting, Email on any threshold value breach, Alert on Mobile (via SMS), Auto detection of anomalies, water flow rate, water capacity.',
        qty: '1',
        uom: 'Nodes',
        customerPrice: 1800,
        isRecurring: true,
      },
    ],
  },
];

export default function ProposalPreview({
  proposal,
  onUpdateStatus,
  isUpdating = false,
}: ProposalPreviewProps) {
  const quote = proposal.quote;
  const deal = proposal.deal;
  const proposalRef = proposal.proposalNumber || `STPL-${proposal.id.substring(0, 6).toUpperCase()}`;
  const proposalDate = proposal.proposalDate ? formatDate(proposal.proposalDate) : formatDate(new Date().toISOString());

  const serviceTitle = (deal?.service?.name || (proposal as any)?.serviceCategory || (proposal as any)?.serviceName || '').toLowerCase();
  const isBms =
    serviceTitle.includes('bms') ||
    serviceTitle.includes('building management') ||
    Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('bms')) ||
    Boolean((proposal as any)?.category?.toLowerCase()?.includes('bms'));

  const isIotOrControls =
    serviceTitle.includes('iot') ||
    serviceTitle.includes('control') ||
    serviceTitle.includes('ems') ||
    serviceTitle.includes('welding') ||
    serviceTitle.includes('hardware') ||
    (quote?.lineItems && quote.lineItems.length > 2);

  const flatIotItems = DEFAULT_IOT_CATEGORIES.flatMap((c) => c.items);
  const hasSavedLineItems = Boolean(quote?.lineItems && quote.lineItems.length > 0);

  const mappedSavedItems = hasSavedLineItems && quote?.lineItems
    ? quote.lineItems.map((item, idx) => {
        const stepMatch = item.description?.match(/^([0-9a-zA-Z]+)\./);
        const stepNo = stepMatch ? stepMatch[1] : `${idx + 1}`;
        const cleanDesc = item.description?.replace(/^([0-9a-zA-Z]+)\.\s*/, '') || item.description;
        const isRecurring =
          cleanDesc?.toLowerCase().includes('recurring') ||
          cleanDesc?.toLowerCase().includes('optibyte') ||
          cleanDesc?.toLowerCase().includes('annual') ||
          cleanDesc?.toLowerCase().includes('sim card');

        return {
          stepNo,
          description: cleanDesc,
          qty: String(item.qty || '1'),
          uom: cleanDesc?.toLowerCase().includes('cable') ? 'Coil' : cleanDesc?.toLowerCase().includes('engineer') || cleanDesc?.toLowerCase().includes('technician') || cleanDesc?.toLowerCase().includes('specialist') ? 'Mandays' : cleanDesc?.toLowerCase().includes('consumables') ? 'Job' : 'Nos',
          customerPrice: Number(item.total || item.unitRate || 0),
          isRecurring,
        };
      })
    : [];

  const iotTotalSum = hasSavedLineItems
    ? mappedSavedItems.reduce((sum, r) => sum + Number(r.customerPrice || 0), 0)
    : flatIotItems.reduce((sum, r) => sum + Number(r.customerPrice || 0), 0);

  const finalProposedValue = quote?.finalQuote ? Number(quote.finalQuote) : iotTotalSum;

  const totalPages = isIotOrControls || isBms ? 4 : 3;
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  const downloadFullPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      toast.info('Generating complete PDF file...');
      const { jsPDF } = await import('jspdf');
      const { toPng } = await import('html-to-image');

      const pageElements = document.querySelectorAll<HTMLElement>('.proposal-page');
      if (!pageElements || pageElements.length === 0) {
        toast.error('No proposal pages found to generate PDF.');
        return;
      }

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];

        // Save original styles
        const origMargin = pageEl.style.margin;
        const origBorderRadius = pageEl.style.borderRadius;
        const origBoxShadow = pageEl.style.boxShadow;
        const origBorder = pageEl.style.border;

        // Temporarily override styles for clean capture (keep maxWidth for same layout)
        pageEl.style.margin = '0';
        pageEl.style.borderRadius = '0';
        pageEl.style.boxShadow = 'none';
        pageEl.style.border = 'none';

        const elWidth = pageEl.scrollWidth;
        // Force minimum A4 proportional height so border fills the page
        const minA4Height = Math.round(elWidth * (297 / 210));
        const elHeight = Math.max(pageEl.scrollHeight, minA4Height);

        // Temporarily force the element height to match A4 proportions
        const origHeight = pageEl.style.height;
        const origMinHeight = pageEl.style.minHeight;
        pageEl.style.height = `${elHeight}px`;
        pageEl.style.minHeight = `${elHeight}px`;

        try {
          const imgData = await toPng(pageEl, {
            quality: 1,
            pixelRatio: 2,
            backgroundColor: '#ffffff',
            width: elWidth,
            height: elHeight,
            skipAutoScale: true,
            fontEmbedCSS: '',
            includeQueryParams: true,
            filter: (node) => {
              if (node instanceof HTMLElement) {
                return (
                  !node.hasAttribute('data-sonner-toaster') &&
                  !node.hasAttribute('data-sonner-toast')
                );
              }
              return true;
            },
          });

          if (i > 0) {
            pdf.addPage('a4', 'p');
          }

          // Fill the entire A4 page edge-to-edge
          pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
        } finally {
          // Restore original styles
          pageEl.style.margin = origMargin;
          pageEl.style.borderRadius = origBorderRadius;
          pageEl.style.boxShadow = origBoxShadow;
          pageEl.style.border = origBorder;
          pageEl.style.height = origHeight;
          pageEl.style.minHeight = origMinHeight;
        }
      }

      const sanitizedClient = (deal?.clientName || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Proposal_${proposalRef}_${sanitizedClient}.pdf`;
      pdf.save(filename);
      toast.success('Proposal PDF downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate full PDF:', error);
      toast.error('PDF generation encountered an error. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative space-y-8 min-h-screen pb-16">
      {/* Full Page Branded Background Watermark */}
      <FullPageWatermark opacity={0.15} size="950px" />

      {/* Document Action Controls Bar */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 max-w-5xl lg:max-w-6xl mx-auto print:hidden">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Document Status:</span>
          <span className="text-xs font-black px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 uppercase tracking-wider">
            {proposal.status}
          </span>
          <span className="text-xs font-medium text-slate-400">|</span>
          <span className="text-xs font-bold text-slate-600 font-mono">{proposalRef}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={downloadFullPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating Full PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download Entire PDF
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-slate-200"
          >
            <Printer className="h-3.5 w-3.5 text-slate-600" /> Print
          </button>

          {proposal.status === 'DRAFT' && (
            <button
              onClick={() => onUpdateStatus('REVIEWED')}
              disabled={isUpdating}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Mark as Reviewed
            </button>
          )}

          {proposal.status !== 'SENT' && (
            <button
              onClick={() => onUpdateStatus('SENT')}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" /> Send to Client
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DOCUMENT PAGE 1: EXECUTIVE SUMMARY, ABOUT & CLIENT INFORMATION    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div
        className="proposal-page relative z-10 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-[800px] mx-auto text-slate-800 min-h-[1130px] flex flex-col justify-between"
        style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
      >
        <div className="border-2 border-slate-900 p-6 sm:p-10 flex-1 flex flex-col justify-between relative">
          <div
            className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.14] bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/watermark-transparent.png')", backgroundSize: 'contain' }}
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-6">
            {/* Top Side Logo & Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-4 gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Official Commercial Proposal
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 uppercase">
                  {isIotOrControls
                    ? 'IoT & Controls / Energy Management Solution (EMS)'
                    : deal?.service?.name?.toUpperCase() || 'Energy Audit & Engineering Scope'}
                </h1>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono font-medium">
                  <span>Ref: <strong className="text-slate-800">{proposalRef}</strong></span>
                  <span>•</span>
                  <span>Date: <strong className="text-slate-800">{proposalDate}</strong></span>
                </div>
              </div>
              <div className="flex items-center justify-end shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Company-Logo-Light.png"
                  alt="Sustainabyte Technologies Logo"
                  className="h-16 sm:h-20 w-auto object-contain"
                />
              </div>
            </div>

            {/* Step 1: Proposal Prepared For */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Proposal Prepared For:</p>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{deal?.clientName || 'Valued Client'}</h2>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Service Scope: <span className="font-bold text-slate-800">{deal?.service?.name || 'Energy Management & Optimization'}</span>
                </p>
              </div>
              {(proposal as any).clientLogo && (
                <div className="h-14 w-32 bg-white p-1 flex items-center justify-center shrink-0 border border-slate-100 rounded-lg shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={(proposal as any).clientLogo}
                    alt="Client Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Step 2: About Sustainabyte */}
            <div className="space-y-3.5 pt-1">
              <h3
                className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                style={{ fontSize: '20px' }}
              >
                About Sustainabyte:
              </h3>
              
              <div
                className="space-y-3.5 text-slate-800 font-normal text-left"
                style={{ fontSize: '12px', lineHeight: '1.65' }}
              >
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

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DOCUMENT PAGE 2: IOT ARCHITECTURE & 4-PHASE SCOPE ROADMAP        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div
        className="proposal-page relative z-10 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-[800px] mx-auto text-slate-800 min-h-[1130px] flex flex-col justify-between"
        style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
      >
        <div className="border-2 border-slate-900 p-6 sm:p-10 flex-1 flex flex-col justify-between relative">
          <div
            className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.14] bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/watermark-transparent.png')", backgroundSize: 'contain' }}
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-4 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Solution Architecture &amp; Implementation Scope</p>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{deal?.clientName} — {deal?.service?.name}</h2>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  <span>Ref: <strong>{proposalRef}</strong></span>
                </div>
              </div>
              <div className="flex items-center justify-end shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Company-Logo-Light.png"
                  alt="Sustainabyte Technologies Logo"
                  className="h-16 sm:h-20 w-auto object-contain"
                />
              </div>
            </div>

            {isBms ? (
              <div className="space-y-4">
                <h3
                  className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                  style={{ fontSize: '18px' }}
                >
                  1. Assessment Scope &amp; Identified Issues Analysis — Building Management System (BMS):
                </h3>

                <div className="space-y-3 pt-1 text-xs text-slate-900 leading-relaxed font-normal">
                  <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider text-indigo-900 bg-indigo-50/70 p-1.5 px-2.5 rounded-md border border-indigo-100/80 inline-block">
                    KEY ISSUES IDENTIFIED
                  </h4>

                  {/* Issue 1 */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">1. Data Communication Issues</p>
                    <ul className="space-y-0.5 pl-4 text-slate-900 font-normal">
                      <li>• Certain field devices are not transmitting data reliably to the BMS/SCADA system.</li>
                      <li>• Communication status of some devices is unknown and requires verification.</li>
                      <li>• Potential communication interruptions between field devices, controllers, gateways, and SCADA.</li>
                    </ul>
                  </div>

                  {/* Issue 2 */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">2. Data Mismatch &amp; Abnormal Values</p>
                    <ul className="space-y-0.5 pl-4 text-slate-900 font-normal">
                      <li>• Some values displayed in SCADA appear unrealistic and inconsistent with expected operating conditions.</li>
                      <li>• Actual field values need to be validated against SCADA-displayed values.</li>
                      <li>• Possible scaling, mapping, register addressing, or communication-related issues affecting data accuracy.</li>
                    </ul>
                  </div>

                  {/* Issue 3 */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">3. Graphics &amp; Visualization Issues</p>
                    <ul className="space-y-0.5 pl-4 text-slate-900 font-normal">
                      <li>• Existing graphics screens contain alignment and display inconsistencies.</li>
                      <li>• Equipment representations and parameter displays require verification.</li>
                      <li>• Graphics navigation and usability need assessment.</li>
                    </ul>
                  </div>

                  {/* Issue 4 */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">4. IO Mapping Verification Required</p>
                    <ul className="space-y-0.5 pl-4 text-slate-900 font-normal">
                      <li>• Existing field-to-controller and controller-to-SCADA point mapping accuracy is unknown.</li>
                      <li>• Point names, engineering units, scaling factors, and register assignments require validation.</li>
                      <li>• Incorrect mapping may be contributing to inaccurate monitoring and reporting.</li>
                    </ul>
                  </div>

                  {/* Issue 5 */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">5. Monitoring &amp; System Visibility Gaps</p>
                    <ul className="space-y-0.5 pl-4 text-slate-900 font-normal">
                      <li>• Certain process areas may not be accurately represented in the monitoring platform.</li>
                      <li>• Missing, inactive, or incorrectly configured points may affect operational visibility.</li>
                    </ul>
                  </div>
                </div>

                {/* Proposed Assessment Activities */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider text-indigo-900 bg-indigo-50/70 p-1.5 px-2.5 rounded-md border border-indigo-100/80 inline-block">
                    PROPOSED ASSESSMENT ACTIVITIES
                  </h4>
                  <ul className="space-y-0.5 pl-4 text-xs text-slate-900 font-normal leading-relaxed">
                    <li>• Verification of field devices and process instrumentation.</li>
                    <li>• Communication network assessment.</li>
                    <li>• Energy meter and utility monitoring verification.</li>
                    <li>• IO mapping validation.</li>
                    <li>• Graphics and visualization review.</li>
                    <li>• Data accuracy validation.</li>
                    <li>• Identification of system gaps and operational issues.</li>
                    <li>• Preparation of a detailed assessment and recommendation report.</li>
                  </ul>
                </div>

                {/* Expected Outcome */}
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider text-emerald-900 bg-emerald-50/70 p-1.5 px-2.5 rounded-md border border-emerald-100/80 inline-block">
                    EXPECTED OUTCOME
                  </h4>
                  <p className="text-xs text-slate-900 leading-relaxed pl-1">
                    The assessment will provide a clear understanding of the current system condition, identify the root causes of communication and monitoring issues, highlight graphics and mapping discrepancies, and deliver a prioritized roadmap for corrective actions and future system improvements.
                  </p>
                </div>
              </div>
            ) : isIotOrControls ? (
              <div className="space-y-5">
                {/* Step 3: Solution Architecture */}
                <div className="space-y-2.5">
                  <h3
                    className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                    style={{ fontSize: '18px' }}
                  >
                    1. Solution Architecture — IoT &amp; Controls Platform:
                  </h3>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/iot-solution-architecture.png"
                      alt="IoT & Controls Solution Architecture Blueprint"
                      className="w-full max-h-[360px] object-contain rounded-lg"
                    />
                  </div>
                </div>

                {/* Step 5: Scope of Work & Platform Benefits — Energy Management Solution */}
                <div className="space-y-4 pt-2">
                  <h3
                    className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                    style={{ fontSize: '18px' }}
                  >
                    Step 5: Scope of Work &amp; Platform Benefits — Energy Management Solution
                  </h3>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider">
                      Scope of Work:
                    </h4>
                    <p className="text-xs text-slate-900 leading-relaxed">
                      Our overall Platform solution can be divided into 4 phases. In the <strong>current proposal we are discussing the implementation of phase 1 only</strong>:
                    </p>

                    <div className="space-y-2.5 text-xs text-slate-950 pt-1">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-950">Phase 1 - Energy Monitoring System Implementation (Active Scope)</p>
                        <ul className="space-y-0.5 pl-4 text-slate-950 font-normal">
                          <li>• Creating Basic Energy Monitoring infrastructure</li>
                          <li>• Implementing equipment level energy monitoring system using meters with critical alerts and alarms</li>
                          <li>• Providing Custom dashboards and enabling alerts &amp; reports</li>
                        </ul>
                      </div>

                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-950">Phase 2 - Equipment level Condition Monitoring system Implementation</p>
                        <ul className="space-y-0.5 pl-4 text-slate-950 font-normal">
                          <li>• Integrating with equipment controllers or installing additional sensors &amp; meters for monitoring critical equipment parameters</li>
                          <li>• Developing rules for monitoring critical parameters and generating alerts / alarms</li>
                          <li>• Providing Custom dashboards and enabling alerts &amp; reports</li>
                        </ul>
                      </div>

                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-950">Phase 3 - Energy Optimization system implementation</p>
                        <ul className="space-y-0.5 pl-4 text-slate-950 font-normal">
                          <li>• Developing custom logics for Utility equipment such as Chillers, Chiller system, Pumps cooling towers, air compressors etc.</li>
                          <li>• Implementing logics in System for identifying energy leakages and practicing potential failures</li>
                          <li>• Enabling reports via email on agreed frequency</li>
                        </ul>
                      </div>

                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-950">Phase 4 - AI and ML based advanced system for predictive maintenance &amp; Energy management</p>
                        <ul className="space-y-0.5 pl-4 text-slate-950 font-normal">
                          <li>• Developing advanced AI and ML models for identifying energy leakages and practicing potential failures based on long range data (min. 12 months data)</li>
                          <li>• Implementing logics in System for identifying energy leakages and practicing potential failures</li>
                          <li>• Enabling reports via email on agreed frequency</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider">
                      Potential benefits of our platform – All 4 phases:
                    </h4>
                    <ul className="space-y-0.5 pl-4 text-xs text-slate-950 font-normal leading-relaxed">
                      <li>1. <strong>Up Time:</strong> Equipment Downtime reduction</li>
                      <li>2. <strong>Energy Savings:</strong> Energy consumption and Utility Cost Reduction (1–10 %)</li>
                      <li>3. <strong>Zero Carbon:</strong> Contribute towards Net Carbon Zero (Scope 1 &amp; Scope 2)</li>
                      <li>4. <strong>HC Optimization:</strong> Maintenance Head count optimization (approx. 1.5 HC worth Manual effort saved every day)</li>
                      <li>5. <strong>Capital Cost Saving:</strong> Up to 50% Capital Cost and 30–50% of commissioning cost savings compare with traditional BMS / SCADA system</li>
                    </ul>
                  </div>

                  <div className="space-y-2 pt-1">
                    <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider">
                      Benefits of Energy Management system:
                    </h4>
                    <ul className="space-y-0.5 pl-4 text-xs text-slate-950 font-normal leading-relaxed">
                      <li>1. <strong>Real-time alerting:</strong> When an asset malfunctions, you can automatically alert the right engineer, and have it repaired before it gets worse.</li>
                      <li>2. <strong>Peak load reporting:</strong> Identify peak load hours to mitigate demand spikes and optimize operational efficiency.</li>
                      <li>3. <strong>Customization:</strong> Customized KPIs, energy intensity thresholds, and executive role-based dashboards.</li>
                      <li>4. <strong>AI led anomaly detection:</strong> Immediately act when anomalies occur (in performance or consumption) to massively reduce time and keep assets performing at their peak.</li>
                      <li>5. <strong>Data driven decision making:</strong> Daily report, Data available to download from minute, hourly, daily, monthly to yearly levels right from the tool level.</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              /* Energy Audit Scope of Assessment */
              <div className="space-y-4">
                <h3
                  className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                  style={{ fontSize: '20px' }}
                >
                  1. Scope of Work &amp; Oriented Assessment Scopes:
                </h3>

                <div className="space-y-4 pt-1">
                  {ASSESSMENT_ASSETS.slice(0, 6).map((asset, index) => (
                    <div key={asset.id} className="space-y-1">
                      <h4
                        className="font-bold text-slate-900 flex items-center gap-1.5"
                        style={{ fontSize: '13px' }}
                      >
                        <span>•</span>
                        <span>{index + 1}. {asset.name}</span>
                      </h4>
                      <ul
                        className="space-y-1 pl-4 text-slate-700 font-normal"
                        style={{ fontSize: '12px', lineHeight: '1.6' }}
                      >
                        {asset.scopes.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-slate-500 shrink-0">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 border-t border-slate-200 pt-3 mt-6 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Ref: {proposalRef}</span>
            <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page 2 of {totalPages}</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DOCUMENT PAGE 3: COMMERCIAL INVESTMENT BREAKDOWN (STEP 4)          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div
        className="proposal-page relative z-10 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-[800px] mx-auto text-slate-800 min-h-[1130px] flex flex-col justify-between"
        style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
      >
        <div className="border-2 border-slate-900 p-6 sm:p-10 flex-1 flex flex-col justify-between relative">
          <div
            className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.14] bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/watermark-transparent.png')", backgroundSize: 'contain' }}
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-4 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Commercial Investment &amp; Pricing Breakdown</p>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{deal?.clientName} — {deal?.service?.name}</h2>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  <span>Ref: <strong>{proposalRef}</strong></span>
                </div>
              </div>
              <div className="flex items-center justify-end shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Company-Logo-Light.png"
                  alt="Sustainabyte Technologies Logo"
                  className="h-16 sm:h-20 w-auto object-contain"
                />
              </div>
            </div>

            {/* Step 4: Commercial Investment Breakdown */}
            <div className="space-y-4">
              <h3
                className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                style={{ fontSize: '20px' }}
              >
                {isIotOrControls ? 'Step 4: Commercial Breakdown — IoT & Controls / Energy Management Solution' : '2. Commercial Investment Breakdown:'}
              </h3>

              {isIotOrControls ? (
                /* Itemized Table Grouped by 5 Scopes Matching Step 4 */
                <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-16">Step No</th>
                        <th className="py-2.5 px-4 w-3/5">Item Description</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-center">UoM</th>
                        <th className="py-2.5 px-4 text-right">Customer Price (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {hasSavedLineItems ? (
                        mappedSavedItems.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 px-3 text-center font-bold text-slate-600">{row.stepNo}</td>
                            <td className="py-2.5 px-4 font-semibold text-slate-900 leading-relaxed text-[11px]">
                              {row.description}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-700">{row.qty}</td>
                            <td className="py-2.5 px-3 text-center font-medium text-slate-600">{row.uom}</td>
                            <td className="py-2.5 px-4 text-right font-black text-slate-900">
                              {formatCurrency(row.customerPrice)}
                              {row.isRecurring && <span className="text-[10px] text-slate-500 font-medium ml-1">/ yr</span>}
                            </td>
                          </tr>
                        ))
                      ) : (
                        DEFAULT_IOT_CATEGORIES.map((cat, cIdx) => (
                          <React.Fragment key={cIdx}>
                            <tr className="bg-slate-50/80">
                              <td colSpan={5} className="py-1.5 px-4 font-black text-slate-900 uppercase text-[10px] tracking-wider border-y border-slate-200">
                                {cat.category}
                              </td>
                            </tr>
                            {cat.items.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-3 text-center font-bold text-slate-600">{row.stepNo}</td>
                                <td className="py-2.5 px-4 font-semibold text-slate-900 leading-relaxed text-[11px]">
                                  {row.description}
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold text-slate-700">{row.qty}</td>
                                <td className="py-2.5 px-3 text-center font-medium text-slate-600">{row.uom}</td>
                                <td className="py-2.5 px-4 text-right font-black text-slate-900">
                                  {formatCurrency(row.customerPrice)}
                                  {row.isRecurring && <span className="text-[10px] text-slate-500 font-medium ml-1">/ yr</span>}
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </table>

                  <div className="bg-slate-900 text-white p-3.5 px-5 flex justify-between items-center font-extrabold text-xs sm:text-sm">
                    <span className="tracking-wide uppercase">TOTAL PROPOSED COMMERCIAL VALUE (INCL. TAXES)</span>
                    <span className="text-emerald-400 text-base sm:text-lg font-black tracking-tight">
                      {formatCurrency(finalProposedValue)}
                    </span>
                  </div>
                </div>
              ) : (
                /* Energy Audit Table */
                <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-4 w-3/5">Service / Engineering Scope Description</th>
                        <th className="py-2.5 px-3 text-center">Qty / Days</th>
                        <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                        <th className="py-2.5 px-4 text-right">Total Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-900">
                          Complete Detailed Energy Audit &amp; System Optimization Scope
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-700">1 Site</td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-600">{formatCurrency(quote?.finalQuote || 0)}</td>
                        <td className="py-2.5 px-4 text-right font-black text-slate-900">{formatCurrency(quote?.finalQuote || 0)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="bg-slate-900 text-white p-3.5 px-5 flex justify-between items-center font-extrabold text-xs sm:text-sm">
                    <span className="tracking-wide uppercase">TOTAL PROPOSED COMMERCIAL VALUE (INCL. TAXES)</span>
                    <span className="text-emerald-400 text-base sm:text-lg font-black tracking-tight">
                      {formatCurrency(quote?.finalQuote || 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Platform & EMS Benefits (for IoT & Controls) */}
            {isIotOrControls && (
              <div className="space-y-3 pt-2 text-xs">
                <h4 className="font-bold text-slate-950 uppercase tracking-wider text-xs">
                  Potential Benefits of Our Platform (All 4 Phases):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-900">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong>1. Up Time:</strong> Equipment Downtime reduction
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong>2. Energy Savings:</strong> 1–10% consumption and utility cost reduction
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong>3. Zero Carbon:</strong> Contribute towards Net Carbon Zero (Scope 1 &amp; 2)
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong>4. HC Optimization:</strong> ~1.5 HC worth manual effort saved every day
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 border-t border-slate-200 pt-3 mt-6 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Ref: {proposalRef}</span>
            <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page 3 of {totalPages}</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DOCUMENT FINAL PAGE: NOTES, TERMS, SUBMITTED BY & BANK DETAILS     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div
        className="proposal-page relative z-10 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-[800px] mx-auto text-slate-800 min-h-[1130px] flex flex-col justify-between"
        style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
      >
        <div className="border-2 border-slate-900 p-6 sm:p-10 flex-1 flex flex-col justify-between relative">
          <div
            className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.14] bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/watermark-transparent.png')", backgroundSize: 'contain' }}
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-4 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Commercial Proposal (Final Terms &amp; Authorization)</p>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{deal?.clientName} — Terms &amp; Commercial Sign-off</h2>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  <span>Ref: <strong>{proposalRef}</strong></span>
                </div>
              </div>
              <div className="flex items-center justify-end shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Company-Logo-Light.png"
                  alt="Sustainabyte Technologies Logo"
                  className="h-16 sm:h-20 w-auto object-contain"
                />
              </div>
            </div>

            {/* Step 6: NOTE */}
            <div className="space-y-2">
              <h3
                className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                style={{ fontSize: '18px' }}
              >
                NOTE:
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2 px-3 text-center w-12">S No</th>
                      <th className="py-2 px-4">Description</th>
                      <th className="py-2 px-4 text-right w-32">Scope</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2.5 px-3 text-center font-bold">1</td>
                      <td className="py-2.5 px-4 font-medium">
                        From Chennai to Site up and down, local transport, food and accommodation charges will be under client scope.
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-slate-900">At Actual</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step 6: Support Required from the Client */}
            <div className="space-y-2 pt-1">
              <h3
                className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                style={{ fontSize: '18px' }}
              >
                Support required from the client:
              </h3>
              <ul className="space-y-1.5 pl-4 text-xs text-slate-800 leading-relaxed font-normal">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-slate-900">•</span>
                  <span>SPOC (Single point of Contact) for support and coordination during installation and Commissioning phase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-slate-900">•</span>
                  <span>SPOC to review alerts and reports as per requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-slate-900">•</span>
                  <span>Accessibility to each area across the facility.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-slate-900">•</span>
                  <span>1 person required from client side with knowledge on electrical routing and provide manual support to lay the cable, if any</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-slate-900">•</span>
                  <span>Boarding, Food and Travel expenses will be under client scope.</span>
                </li>
              </ul>
            </div>

            {/* Step 6: Terms and Conditions */}
            <div className="space-y-2 pt-1">
              <h3
                className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                style={{ fontSize: '18px' }}
              >
                Terms and Conditions:
              </h3>
              {isBms ? (
                <div className="space-y-2.5 text-xs text-slate-800 leading-relaxed font-normal">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-950">Payment Terms:</p>
                    <ul className="space-y-0.5 pl-4">
                      <li>· <strong>60% Advance Payment</strong> – Upon confirmation of the order.</li>
                      <li>· <strong>15% Payment</strong> – Upon completion of the site activities.</li>
                      <li>· <strong>15% Payment</strong> – Against submission of the draft report.</li>
                      <li>· <strong>10% Payment</strong> – Against submission of the final report.</li>
                    </ul>
                    <p className="pt-0.5 text-slate-700">
                      30 days from the date of invoice and invoice will be raised after the work completion at site.
                    </p>
                    <p className="text-slate-700">
                      Applicable taxes and duties shall be charged extra, as applicable.
                    </p>
                    <p className="text-slate-700">
                      All lodging, boarding and accommodation are inclusive.
                    </p>
                  </div>

                  <div className="space-y-1 pt-1.5 border-t border-slate-100">
                    <p className="font-bold text-slate-950">Other Terms and Conditions:</p>
                    <p className="text-slate-700 pl-1">
                      Customer shall arrange a skilled individual (Authorized technicians) for the entire duration of the audit period for local co-ordination with site team for seeking approval or work permits and installation of energy auditing equipment with proper safety measures.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="space-y-1.5 pl-4 text-xs text-slate-800 leading-relaxed font-normal">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">•</span>
                    <span><strong>Payment schedule:</strong> Installation and commissioning – 1 week from the payment advance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">•</span>
                    <span>Applicable taxes and duties will be extra</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">•</span>
                    <span>Boarding, Food and Travel Expenses are exclusive of the cost mentioned above.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">•</span>
                    <span>Project timelines depend on Shutdowns provided for fixing sensors. The timelines for execution will be mutually discussed and agreed during the project kick-off discussion.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">•</span>
                    <span>All kinds of approvals, work permission and site pass if required.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">•</span>
                    <span>Clients should do any third-party contractor’s co-ordination at site.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">•</span>
                    <span>Secure onsite storage area and all soft integration support.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">•</span>
                    <span>Post installation and commissioning any site visit for EMS maintenance and troubleshooting will be charged as actual (i.e., after first year).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-slate-900">•</span>
                    <span>Any material beyond current scope will be charged as actual.</span>
                  </li>
                </ul>
              )}
            </div>

            {/* Step 7: Submitted By & Bank Account Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-slate-200 text-xs">
              {/* Submitted By */}
              <div className="space-y-2">
                <p className="font-bold text-slate-950 text-xs">Submitted by,</p>
                <div className="py-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Company-Logo-Light.png"
                    alt="Sustainabyte Technologies Pvt. Ltd."
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <div className="space-y-0.5 text-slate-900">
                  <p className="font-black text-sm text-slate-950">Thanakarthik Kumar</p>
                  <p className="font-bold text-slate-800">Founder &amp; Managing Director</p>
                  <p className="text-slate-700">8377007638</p>
                  <p className="text-slate-700">thanakarthik@sustainabyte.ai</p>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 text-[11px]">
                <p className="font-black text-slate-950 text-xs pb-1 border-b border-slate-200">
                  Bank Account details:
                </p>
                <p><strong className="text-slate-900">Bank:</strong> Bank of Baroda</p>
                <p><strong className="text-slate-900">Account Number:</strong> 35860200000750</p>
                <p><strong className="text-slate-900">IFSC:</strong> BARB0VELACH (fifth letter is ZERO)</p>
                <p><strong className="text-slate-900">Branch:</strong> VELACHERY BRANCH</p>
                <p><strong className="text-slate-900">GSTIN NO:</strong> 33ABNCS4869A1Z7</p>
                <p><strong className="text-slate-900">PAN Number:</strong> ABNCS4869A</p>
              </div>
            </div>

            {/* Client Acceptance Box */}
            
          </div>

          <div className="relative z-10 border-t border-slate-200 pt-3 mt-6 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Ref: {proposalRef}</span>
            <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page {totalPages} of {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

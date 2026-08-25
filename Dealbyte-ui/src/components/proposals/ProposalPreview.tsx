'use client';

import React from 'react';
import { Proposal } from '@/lib/api/proposals';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ASSESSMENT_ASSETS } from '@/lib/constants/assessment-assets';
import {
  ENERGY_AUDIT_TRACK_RECORD_CLIENTS,
  INITIAL_WELDING_HARDWARE_ROWS,
  INITIAL_WELDING_SOFTWARE_ROWS,
  INITIAL_WELDING_CLOUD_ROWS,
} from '@/components/costing/constants';
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
    category: '1. GATEWAY & HARDWARE SCOPE',
    items: [
      {
        stepNo: '1',
        description: 'Supply of 4G IoT Gateway for Communication with SIM card, SMPS & Antenna - Edge Lite',
        qty: '1',
        uom: 'Nos',
        customerPrice: 26000,
      },
    ],
  },
  {
    category: '2. METERS & MONITORING ACCESSORIES SCOPE',
    items: [
      {
        stepNo: '2',
        description: 'Supply of RS485 energy meter with communication and wiring accessories',
        qty: '1',
        uom: 'Nos',
        customerPrice: 63000,
      },
    ],
  },
  {
    category: '3. ELECTRICAL ACCESSORIES & CONDUIT CABLING SCOPE',
    items: [
      {
        stepNo: '3',
        description: 'Supply of electrical consumables such as flexible hose, cable ties and all other accessories',
        qty: '1',
        uom: 'Job',
        customerPrice: 19000,
      },
    ],
  },
  {
    category: '4. INSTALLATION, CABLING & COMMISSIONING SCOPE',
    items: [
      {
        stepNo: '4',
        description:
          'Installation and commissioning of IoT devices, gateways, modems, and associated electrical/control components including startup, testing, and functional verification. Communication cable laying and routing through conduits, cable trays, and raceways with proper dressing, tagging, and termination. Conduit pipe laying for electrical and communication cabling as per site layout. Modem configuration, network setup, data mapping, testing, troubleshooting, and data validation.',
        qty: '1',
        uom: 'Nodes',
        customerPrice: 34000,
      },
    ],
  },
  {
    category: '5. PLATFORM CONFIGURATION & SYSTEM INTEGRATION SCOPE',
    items: [
      {
        stepNo: '5',
        description:
          'IoT device configuration, protocol setup (Modbus, BACnet, MQTT), and integration with BMS/EMS platforms. Network connectivity, dashboard mapping, alarm configuration, and cloud/server integration support. System commissioning including startup, functional testing, calibration, and performance verification. Troubleshooting, integration testing, client demonstration, and final handover support.',
        qty: '1',
        uom: 'Nodes',
        customerPrice: 9500,
      },
    ],
  },
  {
    category: '6. CLOUD, SLA & RECURRING ANNUAL SUBSCRIPTIONS SCOPE',
    items: [
      {
        stepNo: '6',
        description:
          'OptiByte Dashboard, Intelligent reporting, Group and machine level reporting, Email on any threshold value breach, Alert on Mobile (via SMS), Auto detection of anomalies, water flow rate, water capacity. We will check with the pH and TDS meter, if we can integrate it with our dashboard',
        qty: '1',
        uom: 'Nodes',
        customerPrice: 17000,
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

  const isWaterManagement =
    serviceTitle.includes('water management') ||
    serviceTitle.includes('water monitoring') ||
    serviceTitle.includes('wms') ||
    Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('water')) ||
    Boolean((proposal as any)?.category?.toLowerCase()?.includes('water'));

  const isWeldingIot =
    serviceTitle.includes('welding') ||
    Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('welding')) ||
    Boolean((proposal as any)?.category?.toLowerCase()?.includes('welding'));

  const isIotOrControls =
    serviceTitle.includes('iot') ||
    serviceTitle.includes('control') ||
    serviceTitle.includes('ems') ||
    serviceTitle.includes('welding') ||
    serviceTitle.includes('hardware') ||
    serviceTitle.includes('water') ||
    (quote?.lineItems && quote.lineItems.length > 2);

  const isEnergyAudit = !isIotOrControls && !isBms;

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

  const totalPages = 5;
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
        const origWidth = pageEl.style.width;
        const origMaxWidth = pageEl.style.maxWidth;
        const origHeight = pageEl.style.height;
        const origMinHeight = pageEl.style.minHeight;
        const origMaxHeight = pageEl.style.maxHeight;

        // Force exact A4 pixel dimensions (800 x 1131) during capture
        const elWidth = 800;
        const elHeight = Math.round(800 * (297 / 210)); // 1131px

        pageEl.style.margin = '0';
        pageEl.style.borderRadius = '0';
        pageEl.style.boxShadow = 'none';
        pageEl.style.border = 'none';
        pageEl.style.width = `${elWidth}px`;
        pageEl.style.maxWidth = `${elWidth}px`;
        pageEl.style.height = `${elHeight}px`;
        pageEl.style.minHeight = `${elHeight}px`;
        pageEl.style.maxHeight = `${elHeight}px`;

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
          pageEl.style.width = origWidth;
          pageEl.style.maxWidth = origMaxWidth;
          pageEl.style.height = origHeight;
          pageEl.style.minHeight = origMinHeight;
          pageEl.style.maxHeight = origMaxHeight;
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
            {/* Top Side Logo & Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-4 gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Official Commercial Proposal
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 uppercase">
                  {isWaterManagement
                    ? 'IoT & Controls / Water Management Solution (WMS)'
                    : isWeldingIot
                    ? 'IoT & Controls / Welding IoT & Kit'
                    : isBms
                    ? 'Building Management System (BMS) Assessment'
                    : isIotOrControls
                    ? deal?.service?.name
                      ? `IoT & Controls / ${deal.service.name}`
                      : 'IoT & Controls / Energy Management Solution (EMS)'
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
      {/* DOCUMENT PAGE 2: IOT ARCHITECTURE BLUEPRINT OR ENERGY AUDIT SCOPE  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DOCUMENT PAGE 2: WELDING IOT / IOT ARCHITECTURE / ENERGY AUDIT    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {isWeldingIot ? (
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

            <div className="relative z-10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2.5 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scope of Work, Supply &amp; Solution Topology</p>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{deal?.clientName} — Welding IoT &amp; Kit</h2>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    <span>Ref: <strong>{proposalRef}</strong></span>
                  </div>
                </div>
                <div className="flex items-center justify-end shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Company-Logo-Light.png"
                    alt="Sustainabyte Technologies Logo"
                    className="h-14 sm:h-16 w-auto object-contain"
                  />
                </div>
              </div>

              {/* 1. Scope of Work & Scope of Supply */}
              <div className="space-y-1.5">
                <h3
                  className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                  style={{ fontSize: '17px' }}
                >
                  1. Scope of Work &amp; Scope of Supply:
                </h3>
                <div className="text-slate-800 text-[11px] leading-snug space-y-1">
                  <p className="font-bold text-slate-950">1. IoT based weld data acquisition &amp; control system including:</p>
                  <ul className="pl-4 space-y-0.5 text-slate-800">
                    <li>• <strong>Hardware:</strong> Current Sensor, Direct Voltage Sensor; Gas flow Sensor (Electronic) and separate digital display to indicate actual value of sensors.</li>
                    <li className="pl-3 text-[10.5px] text-slate-700">a. RFID for Welder tracking &nbsp;|&nbsp; b. I/O Module for Feedback control system &nbsp;|&nbsp; c. Suitable power supply for IoT Kit</li>
                  </ul>
                  <p className="font-semibold text-slate-900 pt-0.5">2. <strong>IoT Kit:</strong> For tapping analog signals &amp; data transfer to IoT server (wireless) via MQTT protocol.</p>
                  <p className="font-semibold text-slate-900">3. <strong>IoT Server:</strong> Data communication from MIG/MAG welding power source to Cloud platform.</p>
                  <p className="font-semibold text-slate-900">4. <strong>Software:</strong> Cloud based Web Software (IoT server &amp; OptiByte Platform).</p>
                </div>
              </div>

              {/* Visual Presentation of Hardware Kit & Flowchart */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-between shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">Welding IoT Acquisition Kit</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/weldingiotkit.png"
                    alt="Welding IoT Kit Hardware"
                    className="w-full max-h-[195px] object-contain rounded-lg"
                  />
                  <p className="text-[9px] text-slate-500 mt-1 font-medium text-center">Embedded Controller, Sensors &amp; Enclosure</p>
                </div>

                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-between shadow-2xs">
                  <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">IoT Cloud Connectivity Flowchart</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/weldingiotflowchart.png"
                    alt="Welding IoT Architecture Flowchart"
                    className="w-full max-h-[195px] object-contain rounded-lg"
                  />
                  <p className="text-[9px] text-slate-500 mt-1 font-medium text-center">MIG/MAG to Cloud MQTT Architecture</p>
                </div>
              </div>

              {/* Customer dependencies and Exclusion in POC (Phase 1) */}
              <div className="space-y-1 pt-1">
                <h4 className="font-extrabold text-slate-950 text-[11px] uppercase tracking-wider text-amber-900 bg-amber-50/80 p-1 px-2.5 rounded-md border border-amber-200/80 inline-block">
                  Customer Dependencies &amp; Exclusion in POC (Phase 1)
                </h4>
                <ul className="pl-4 space-y-0.5 text-slate-800 text-[10.5px] leading-snug">
                  <li>• Customer shall provide necessary access and approval to facility and equipment to perform installation and commissioning activities.</li>
                  <li>• Customer shall provide internet via WIFI router near to the welding machine for wireless communication between IoT 4.0 hardware kit and Cloud software.</li>
                  <li>• Customer shall provide required limits and logics to enable the alarms. Upon successful completion of POC, customer to provide approval for Phase 2 with multiple welding machines.</li>
                </ul>
              </div>

              {/* POC Success Criteria & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-2 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <p className="font-bold text-emerald-950 text-[11px] uppercase tracking-wider">POC / Phase 1 Success Criteria</p>
                  <ul className="pl-3 space-y-0.5 text-emerald-900 text-[10px] leading-snug">
                    <li>1. Hardware installation &amp; commissioning as per requirement.</li>
                    <li>2. Deviation demonstration through online parameter indicator.</li>
                    <li>3. Live and historic trends in cloud with alerts &amp; alarms.</li>
                  </ul>
                </div>

                <div className="p-2 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1">
                  <p className="font-bold text-indigo-950 text-[11px] uppercase tracking-wider">Implementation Timeline</p>
                  <ul className="pl-3 space-y-0.5 text-indigo-900 text-[10px] leading-snug">
                    <li>• <strong>4 Weeks:</strong> Kit production, assembly and factory testing.</li>
                    <li>• <strong>1 Week:</strong> Installation &amp; commissioning on welding machines.</li>
                    <li>• <strong>1 Week:</strong> Configuration of welding machines to Cloud platform.</li>
                    <li>• <strong>2 Weeks:</strong> Validation of POC success criteria.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative z-10 border-t border-slate-200 pt-3 mt-3 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Ref: {proposalRef}</span>
              <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
              <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page 2 of {totalPages}</span>
            </div>
          </div>
        </div>
      ) : isIotOrControls ? (
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

            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-3 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Solution Architecture Blueprint &amp; Edge Topology</p>
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
                    className="h-14 sm:h-16 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Step 3: Large High-Resolution Architecture Blueprint */}
              <div className="space-y-4 pt-2">
                <h3
                  className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                  style={{ fontSize: '20px' }}
                >
                  {isWaterManagement
                    ? '1. Solution Architecture — Water Management System (IoT & Controls Platform):'
                    : '1. Solution Architecture — IoT & Controls Platform Blueprint:'}
                </h3>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex justify-center items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/iot-solution-architecture.png"
                    alt="IoT & Controls Solution Architecture Blueprint"
                    className="w-full max-h-[650px] object-contain rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10 border-t border-slate-200 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Ref: {proposalRef}</span>
              <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
              <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page 2 of {totalPages}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Energy Audit & Engineering Scope Page 2: Detailed Scope of Work */
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

            <div className="relative z-10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2.5 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detailed Scope of Work &amp; Assessment Methodology</p>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{deal?.clientName} — Energy Audit</h2>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    <span>Ref: <strong>{proposalRef}</strong></span>
                  </div>
                </div>
                <div className="flex items-center justify-end shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Company-Logo-Light.png"
                    alt="Sustainabyte Technologies Logo"
                    className="h-14 sm:h-16 w-auto object-contain"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3
                  className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                  style={{ fontSize: '18px' }}
                >
                  1. Scope of Work &amp; Engineering Assessment:
                </h3>
                <p className="text-[11px] text-slate-800 leading-snug font-medium">
                  The objective of this study is to perform a detailed energy audit to identify energy saving and cost optimization opportunities across the facility.
                </p>

                <div className="space-y-2 pt-0.5 text-slate-800 text-[11px] leading-snug">
                  {/* 1. Data Collection & Bill Analysis */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">1. Data Collection, Document Review &amp; Electricity Bill Analysis</p>
                    <ul className="space-y-0.5 pl-4 text-slate-800 font-normal">
                      <li>• Last 12 months electricity &amp; district cooling bills analysis for monthly trends, maximum demand, power factor, and tariff optimization.</li>
                      <li>• Building technical review: built-up area, occupancy pattern, operating hours, SLDs, HVAC schematics, and equipment inventories.</li>
                    </ul>
                  </div>

                  {/* 2. HVAC & Chiller Performance */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">2. Chiller Plant &amp; VRV Performance Assessment</p>
                    <ul className="space-y-0.5 pl-4 text-slate-800 font-normal">
                      <li>• Performance evaluation of chillers (e.g. 350 TR × 6 Nos) under actual operating conditions (chilled/condenser water temp, flow, power, kW/TR).</li>
                      <li>• VRV/VRF performance assessment, compressor side temperature, condenser flow, and indoor temperature profiling.</li>
                      <li>• CDD-Based Analysis: Cooling Degree Days correlation to normalize weather variations and eliminate anomaly trends.</li>
                    </ul>
                  </div>

                  {/* 3. AHU & Pumps */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">3. AHU &amp; Pump Performance Study (Sampling 20% to 30%)</p>
                    <ul className="space-y-0.5 pl-4 text-slate-800 font-normal">
                      <li>• AHU airflow, temperature, humidity, static pressure, cooling coil performance, and fan efficiency.</li>
                      <li>• Pump flow rate, head, power, efficiency calculation, throttling loss identification, and VFD potential.</li>
                    </ul>
                  </div>

                  {/* 4. Compressor & Leakage Tagging */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">4. Compressor Study &amp; Ultrasonic Leakage Tagging</p>
                    <ul className="space-y-0.5 pl-4 text-slate-800 font-normal">
                      <li>• Generation &amp; demand side flow study, FAD efficiency, demand measurement, and distribution loss quantification.</li>
                      <li>• Ultrasonic leak detection with physical unique ID tagging labels for structured maintenance tracking and recurring loss control.</li>
                    </ul>
                  </div>

                  {/* 5. Electrical, Thermography & Deliverables */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">5. Electrical Power Quality, Thermography &amp; Deliverables</p>
                    <ul className="space-y-0.5 pl-4 text-slate-800 font-normal">
                      <li>• Transformer loading, harmonics, phase imbalance, and lux level measurements across retail, corridor, and parking areas.</li>
                      <li>• Electrical thermography for major panels, switchboards, and transformers (hotspots, loose connections, abnormal heating).</li>
                      <li>• Comprehensive Energy Audit Report with categorized ECMs (low/medium/high cost), financial payback analysis, and executive summary.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 border-t border-slate-200 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Ref: {proposalRef}</span>
              <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
              <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page 2 of {totalPages}</span>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DOCUMENT PAGE 3: IOT SCOPE ROADMAP OR ENERGY AUDIT TEAM EXPERTISE  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
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

          <div className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-3 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isEnergyAudit ? 'Team Expertise & Client Credentials' : 'Detailed Scope of Work & Solution Deliverables'}
                </p>
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
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </div>
            </div>

            {isWeldingIot ? (
              /* Welding IoT Page 3: IoT 4.0 Welding Benefits & Industrial Use Case */
              <div className="space-y-3">
                <div>
                  <h3
                    className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                    style={{ fontSize: '18px' }}
                  >
                    2. IoT 4.0 Welding Benefits &amp; Phase Roadmap:
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10.5px]">
                  {/* Phase 1 Benefits */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-950 bg-amber-100/70 p-1 px-2 rounded border border-amber-300/60 inline-block">
                      Phase 1: Hardware Integration &amp; Control
                    </h4>
                    <div className="space-y-1 text-slate-800">
                      <p className="font-bold text-slate-950">1. Increased Productivity:</p>
                      <ul className="pl-3 space-y-0.5 text-slate-700">
                        <li>• <strong>Minimized Downtime:</strong> Auto restart reduces manual intervention.</li>
                        <li>• <strong>Idle Detection:</strong> Orange status highlights non-productive periods.</li>
                      </ul>

                      <p className="font-bold text-slate-950 pt-0.5">2. Improved Process Control:</p>
                      <ul className="pl-3 space-y-0.5 text-slate-700">
                        <li>• <strong>Consistent Quality:</strong> Stable V, I, and gas flow reduce weld defects.</li>
                        <li>• <strong>Extended Life:</strong> Over-voltage, current &amp; improper gas flow protection.</li>
                      </ul>

                      <p className="font-bold text-slate-950 pt-0.5">3. Cost Savings:</p>
                      <ul className="pl-3 space-y-0.5 text-slate-700">
                        <li>• <strong>Reduced Wastage:</strong> Optimizes gas and energy usage.</li>
                        <li>• <strong>Preventive Maintenance:</strong> Early alerts avoid unexpected failures.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Phase 2 Benefits */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-indigo-950 bg-indigo-100/70 p-1 px-2 rounded border border-indigo-300/60 inline-block">
                      Phase 2: Analytics &amp; Cloud Integration
                    </h4>
                    <div className="space-y-1 text-slate-800">
                      <p className="font-bold text-slate-950">1. Data-Driven Decision Making:</p>
                      <ul className="pl-3 space-y-0.5 text-slate-700">
                        <li>• Daily, shift-wise &amp; monthly exportable Excel reports.</li>
                        <li>• OptiByte dashboards with real-time &amp; historical trend graphs.</li>
                      </ul>

                      <p className="font-bold text-slate-950 pt-0.5">2. Resource &amp; Energy Management:</p>
                      <ul className="pl-3 space-y-0.5 text-slate-700">
                        <li>• Energy &amp; Gas consumption tracking with benchmark setting.</li>
                        <li>• Arc On-Time analysis for machine utilization &amp; shift planning.</li>
                      </ul>

                      <p className="font-bold text-slate-950 pt-0.5">3. Financial &amp; Operational Efficiency:</p>
                      <ul className="pl-3 space-y-0.5 text-slate-700">
                        <li>• True Arc Energy (kW/hr) &amp; Shielding Gas consumption tracking.</li>
                        <li>• Automated compliance data logging for audits &amp; quality standards.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Use Case Benefits */}
                <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-xl space-y-2 mt-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-700 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                      Industrial Proven Case Study
                    </span>
                    <p className="text-[11px] font-bold text-emerald-950">
                      Fabrication Industry Deployment — 100% Success Rate in Real-Time Data Acquisition
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5 text-[10px]">
                    <div className="bg-white p-2 rounded-lg border border-emerald-200">
                      <p className="font-bold text-emerald-900">Comprehensive Tracking</p>
                      <p className="text-slate-600 text-[9.5px] mt-0.5">Monitored gas, arc-on time &amp; energy usage for precision analysis.</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-emerald-200">
                      <p className="font-bold text-emerald-900">Data-Driven Insights</p>
                      <p className="text-slate-600 text-[9.5px] mt-0.5">Monthly reports improving operational efficiency &amp; reducing waste.</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-emerald-200">
                      <p className="font-bold text-emerald-900">Real-Time Visibility</p>
                      <p className="text-slate-600 text-[9.5px] mt-0.5">Custom dashboard with live graphs for proactive maintenance.</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-emerald-200">
                      <p className="font-bold text-emerald-900">Enhanced Productivity</p>
                      <p className="text-slate-600 text-[9.5px] mt-0.5">Continuous monitoring and data-based process optimization.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : isEnergyAudit ? (
              /* Energy Audit Page 3: Team Expertise & Proven Track Record (42 Reference Clients) */
              <div className="space-y-3">
                <div>
                  <h3
                    className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                    style={{ fontSize: '18px' }}
                  >
                    2. Team Expertise &amp; Client Track Record:
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">
                    Our certified energy audit team brings extensive domain expertise with proven execution across 40+ leading multinational corporations, commercial complexes, and industrial plants:
                  </p>
                </div>

                {/* 42 Client Credentials Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[10px]">
                  {ENERGY_AUDIT_TRACK_RECORD_CLIENTS.map((client, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 px-2 bg-slate-50 border border-slate-200/80 rounded-md flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="h-4 w-4 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[8.5px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 truncate" title={client}>
                        {client}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1 mt-2">
                  <p className="text-[10.5px] font-bold text-emerald-950 uppercase tracking-wider">
                    Key Audit Competencies &amp; Instrumentation
                  </p>
                  <p className="text-[10.5px] text-emerald-900 leading-snug">
                    Equipped with calibrated Class-A Power Quality Analyzers, Ultrasonic Flowmeters, Ultrasonic Acoustic Leak Detectors, Thermal Imaging Cameras, Anemometers, and Flue Gas Analyzers to deliver audit reports meeting ASHRAE and BEE standards.
                  </p>
                </div>
              </div>
            ) : isBms ? (
              <div className="space-y-3.5">
                <h3
                  className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                  style={{ fontSize: '20px' }}
                >
                  1. Assessment Scope &amp; Identified Issues Analysis — Building Management System (BMS):
                </h3>

                <div className="space-y-2.5 pt-1 text-slate-800 leading-relaxed font-normal" style={{ fontSize: '12px', lineHeight: '1.65' }}>
                  <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider text-indigo-900 bg-indigo-50/70 p-1 px-2.5 rounded-md border border-indigo-100/80 inline-block">
                    KEY ISSUES IDENTIFIED
                  </h4>

                  {/* Issue 1 */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">1. Data Communication Issues</p>
                    <ul className="space-y-0.5 pl-4 text-slate-800 font-normal">
                      <li>• Certain field devices are not transmitting data reliably to the BMS/SCADA system.</li>
                      <li>• Communication status of some devices is unknown and requires verification.</li>
                      <li>• Potential communication interruptions between field devices, controllers, gateways, and SCADA.</li>
                    </ul>
                  </div>

                  {/* Issue 2 */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">2. Data Mismatch &amp; Abnormal Values</p>
                    <ul className="space-y-0.5 pl-4 text-slate-800 font-normal">
                      <li>• Some values displayed in SCADA appear unrealistic and inconsistent with expected operating conditions.</li>
                      <li>• Actual field values need to be validated against SCADA-displayed values.</li>
                      <li>• Possible scaling, mapping, register addressing, or communication-related issues affecting data accuracy.</li>
                    </ul>
                  </div>

                  {/* Issue 3 */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">3. Graphics &amp; Visualization Issues</p>
                    <ul className="space-y-0.5 pl-4 text-slate-800 font-normal">
                      <li>• Existing graphics screens contain alignment and display inconsistencies.</li>
                      <li>• Equipment representations and parameter displays require verification.</li>
                      <li>• Graphics navigation and usability need assessment.</li>
                    </ul>
                  </div>

                  {/* Issue 4 */}
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950">4. IO Mapping Verification Required</p>
                    <ul className="space-y-0.5 pl-4 text-slate-800 font-normal">
                      <li>• Existing field-to-controller and controller-to-SCADA point mapping accuracy is unknown.</li>
                      <li>• Point names, engineering units, scaling factors, and register assignments require validation.</li>
                      <li>• Incorrect mapping may be contributing to inaccurate monitoring and reporting.</li>
                    </ul>
                  </div>
                </div>

                {/* Proposed Assessment Activities */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider text-indigo-900 bg-indigo-50/70 p-1 px-2.5 rounded-md border border-indigo-100/80 inline-block">
                    PROPOSED ASSESSMENT ACTIVITIES
                  </h4>
                  <ul className="space-y-1 pl-4 text-slate-800 font-normal leading-relaxed" style={{ fontSize: '12px', lineHeight: '1.65' }}>
                    <li>• Verification of field devices and process instrumentation.</li>
                    <li>• Communication network assessment &amp; IO mapping validation.</li>
                    <li>• Energy meter and utility monitoring verification.</li>
                    <li>• Identification of system gaps, data accuracy validation and recommendation report.</li>
                  </ul>
                </div>
              </div>
            ) : isWaterManagement ? (
              <div className="space-y-4">
                <h3
                  className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                  style={{ fontSize: '20px' }}
                >
                  2. Scope of Work &amp; Solution Overview — Water Management Solution
                </h3>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider text-indigo-900 bg-indigo-50/70 p-1 px-2.5 rounded-md border border-indigo-100/80 inline-block">
                    Scope of Work:
                  </h4>
                  <div
                    className="space-y-2.5 text-slate-800 font-normal text-left"
                    style={{ fontSize: '12px', lineHeight: '1.65' }}
                  >
                    <p>
                      The scope of work for the Water Management System (WMS) includes the design, supply, installation, and commissioning of a comprehensive solution to monitor and manage water consumption across the facility. The system will enable real-time tracking of water usage through flow meters and sensors installed at key points such as inlet sources, storage tanks, and distribution lines. It will provide automated data collection, analysis, and reporting to identify consumption patterns, leakages, and inefficiencies.
                    </p>
                    <p>
                      The solution will include a centralized dashboard for monitoring, alert generation for abnormal usage, and integration with existing systems if required. Additionally, the scope covers calibration of instruments, user training, and technical support during the implementation and maintenance phases to ensure optimal system performance and sustainability.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider text-emerald-900 bg-emerald-50/70 p-1 px-2.5 rounded-md border border-emerald-100/80 inline-block">
                    Water Management System Digitalization:
                  </h4>
                  <div
                    className="text-slate-800 font-normal text-left"
                    style={{ fontSize: '12px', lineHeight: '1.65' }}
                  >
                    <p>
                      Digitalization is poised to revolutionize water management, making it more efficient, sustainable, and resilient in the face of growing demands and climate change impacts. While challenges exist, the benefits of adopting these technologies are significant for ensuring a water-secure future. Water management digitalization refers to the application of digital technologies to monitor, analyse, and manage water resources across various sectors, including municipal, industrial, and agricultural. It is about using technology to make water management smarter, more efficient, and more sustainable.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider">
                    Key Digitalization Pillars:
                  </h4>
                  <ul
                    className="space-y-1.5 pl-4 text-slate-800 font-normal"
                    style={{ fontSize: '12px', lineHeight: '1.65' }}
                  >
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                      <span><strong>Real-time Data Collection:</strong> Continuous telemetry from inlet flowmeters, storage level transmitters, and sub-meters.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0"></span>
                      <span><strong>Data Analytics and AI insights:</strong> Automated leak detection, trend forecasting, water balance calculations, and anomaly alerts.</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              /* IoT & Controls Scope of Work */
              <div className="space-y-4">
                <h3
                  className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                  style={{ fontSize: '20px' }}
                >
                  2. Scope of Work &amp; Platform Benefits — Energy Management Solution
                </h3>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider">
                    Scope of Work (4-Phase Roadmap):
                  </h4>
                  <p className="text-slate-800" style={{ fontSize: '12px', lineHeight: '1.65' }}>
                    Our overall Platform solution is divided into 4 phases. In the <strong>current proposal we are implementing Phase 1</strong>:
                  </p>

                  <div className="space-y-2 text-slate-800 pt-1" style={{ fontSize: '12px', lineHeight: '1.65' }}>
                    <div>
                      <p className="font-bold text-slate-950">Phase 1 - Energy Monitoring System Implementation (Active Scope)</p>
                      <ul className="space-y-0.5 pl-4 text-slate-800 font-normal">
                        <li>• Creating Basic Energy Monitoring infrastructure</li>
                        <li>• Implementing equipment level energy monitoring using smart meters with critical alerts</li>
                        <li>• Providing custom dashboards and enabling automated alerts &amp; reports</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-slate-950">Phase 2 - Equipment Condition Monitoring</p>
                      <ul className="space-y-0.5 pl-4 text-slate-800 font-normal">
                        <li>• Controller integration &amp; rule engines for critical asset parameter monitoring</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-slate-950">Phase 3 &amp; 4 - Energy Optimization &amp; AI/ML Predictive Analytics</p>
                      <ul className="space-y-0.5 pl-4 text-slate-800 font-normal">
                        <li>• Custom optimization algorithms for chillers, pumps, compressors and predictive anomaly detection</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider">
                    Potential Benefits of Our Platform:
                  </h4>
                  <ul className="space-y-1 pl-4 text-slate-800 font-normal" style={{ fontSize: '12px', lineHeight: '1.65' }}>
                    <li>1. <strong>Up Time:</strong> Equipment downtime reduction via real-time alerts.</li>
                    <li>2. <strong>Energy Savings:</strong> 1–10% energy consumption and utility cost reduction.</li>
                    <li>3. <strong>Zero Carbon:</strong> Measurable contribution towards Scope 1 &amp; Scope 2 Net Zero Carbon.</li>
                    <li>4. <strong>HC Optimization:</strong> ~1.5 HC worth manual effort saved every day.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10 border-t border-slate-200 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Ref: {proposalRef}</span>
            <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Page 3 of {totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DOCUMENT PAGE 4: COMMERCIAL INVESTMENT BREAKDOWN (STEP 4)          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
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

          <div className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-3 gap-4">
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
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </div>
            </div>

            {/* Step 4: Commercial Investment Breakdown */}
            <div className="space-y-4">
              <h3
                className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                style={{ fontSize: '18px' }}
              >
                {isWaterManagement
                  ? 'Step 4: Commercial Breakdown — IoT & Controls / Water Management Solution'
                  : isWeldingIot
                  ? 'Step 4: Commercial Breakdown — IoT & Controls / Welding IoT'
                  : isBms
                  ? 'Step 4: Commercial Breakdown — Building Management System (BMS)'
                  : isIotOrControls
                  ? `Step 4: Commercial Breakdown — IoT & Controls / ${deal?.service?.name || 'Energy Management Solution'}`
                  : '3. Cost Estimate & Commercial Investment Breakdown:'}
              </h3>

              {isWeldingIot ? (
                /* Welding IoT Commercials Table & Annexures Matching Active Costing Sheet */
                (() => {
                  const weldingSavedHwItems = hasSavedLineItems
                    ? mappedSavedItems.filter((item) => {
                        const desc = item.description.toLowerCase();
                        return (
                          !desc.includes('software development') &&
                          !desc.includes('analytics & logic') &&
                          !desc.includes('installation') &&
                          !desc.includes('commissioning') &&
                          !desc.includes('cloud vm') &&
                          !desc.includes('mqtt broker') &&
                          !desc.includes('database (postgresql') &&
                          !desc.includes('cloud storage') &&
                          !desc.includes('subdomain / ssl') &&
                          !desc.includes('iot sim card')
                        );
                      })
                    : [];

                  const weldingSavedSwItems = hasSavedLineItems
                    ? mappedSavedItems.filter((item) => {
                        const desc = item.description.toLowerCase();
                        return desc.includes('software development') || desc.includes('analytics & logic') || desc.includes('ui/ux design');
                      })
                    : [];

                  const weldingSavedInstItems = hasSavedLineItems
                    ? mappedSavedItems.filter((item) => {
                        const desc = item.description.toLowerCase();
                        return desc.includes('installation') || desc.includes('commissioning');
                      })
                    : [];

                  const weldingSavedCloudItems = hasSavedLineItems
                    ? mappedSavedItems.filter((item) => {
                        const desc = item.description.toLowerCase();
                        return (
                          desc.includes('cloud vm') ||
                          desc.includes('mqtt broker') ||
                          desc.includes('database (postgresql') ||
                          desc.includes('cloud storage') ||
                          desc.includes('subdomain') ||
                          desc.includes('sim card')
                        );
                      })
                    : [];

                  const hwSum = weldingSavedHwItems.reduce((sum, r) => sum + Number(r.customerPrice || 0), 0);
                  const swSum = weldingSavedSwItems.reduce((sum, r) => sum + Number(r.customerPrice || 0), 0);
                  const instSum = weldingSavedInstItems.reduce((sum, r) => sum + Number(r.customerPrice || 0), 0);
                  const cloudSum = weldingSavedCloudItems.reduce((sum, r) => sum + Number(r.customerPrice || 0), 0);

                  const calculatedDeviceWithSw = (hwSum > 0 || swSum > 0) ? (hwSum + swSum) : Math.round(finalProposedValue * 0.7);
                  const calculatedInstPrice = instSum > 0 ? instSum : Math.round(finalProposedValue * 0.3);
                  const calculatedCloudPrice = cloudSum;

                  return (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider mb-1.5">
                          Commercials:
                        </h4>
                        <div className="border border-slate-300 rounded-lg overflow-hidden text-[11px]">
                          <table className="w-full text-left">
                            <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200">
                              <tr>
                                <th className="py-2 px-3 text-center w-12">S.No</th>
                                <th className="py-2 px-4">Scope Description</th>
                                <th className="py-2 px-3 text-center">Payment Type</th>
                                <th className="py-2 px-3 text-center">Qty</th>
                                <th className="py-2 px-4 text-right">Total Price in INR</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              <tr>
                                <td className="py-2 px-3 text-center font-bold text-slate-600">1</td>
                                <td className="py-2 px-4 font-semibold text-slate-900 leading-snug">
                                  Supply of IoT device for welding machine (Industry 4.0 ) with Software
                                </td>
                                <td className="py-2 px-3 text-center font-medium text-slate-700">One Time</td>
                                <td className="py-2 px-3 text-center font-bold text-slate-800">1</td>
                                <td className="py-2 px-4 text-right font-black text-slate-900">
                                  {formatCurrency(calculatedDeviceWithSw)}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-center font-bold text-slate-600">2</td>
                                <td className="py-2 px-4 font-semibold text-slate-900 leading-snug">
                                  Installation &amp; Commissioning Charges per kit
                                </td>
                                <td className="py-2 px-3 text-center font-medium text-slate-700">One Time</td>
                                <td className="py-2 px-3 text-center font-bold text-slate-800">1</td>
                                <td className="py-2 px-4 text-right font-black text-slate-900">
                                  {formatCurrency(calculatedInstPrice)}
                                </td>
                              </tr>
                              {calculatedCloudPrice > 0 && (
                                <tr>
                                  <td className="py-2 px-3 text-center font-bold text-slate-600">3</td>
                                  <td className="py-2 px-4 font-semibold text-slate-900 leading-snug">
                                    Cloud Platform Infrastructure &amp; Recurring Subscriptions
                                  </td>
                                  <td className="py-2 px-3 text-center font-medium text-slate-700">Recurring (Yearly)</td>
                                  <td className="py-2 px-3 text-center font-bold text-slate-800">1 Year</td>
                                  <td className="py-2 px-4 text-right font-black text-slate-900">
                                    {formatCurrency(calculatedCloudPrice)}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>

                          <div className="bg-slate-900 text-white p-2.5 px-4 flex justify-between items-center font-extrabold text-xs">
                            <span className="tracking-wide uppercase text-[11px]">TOTAL PROPOSED COMMERCIAL VALUE (INCL. TAXES)</span>
                            <span className="text-emerald-400 text-sm sm:text-base font-black tracking-tight">
                              {formatCurrency(finalProposedValue)}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 font-semibold italic mt-1">
                          * FYI, BOM Annexure is attached below.
                        </p>
                      </div>

                      {/* Annexure Section */}
                      <div className="space-y-2 pt-1 border-t border-slate-200">
                        <h4 className="font-extrabold text-slate-950 text-xs uppercase tracking-wider">
                          Annexure:
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px]">
                          {/* Annexure Table 1: Hardware and development Charges */}
                          <div className="border border-slate-300 rounded-lg overflow-hidden">
                            <div className="bg-slate-100 p-1.5 px-3 border-b border-slate-200 font-bold text-slate-900 text-center uppercase tracking-wide text-[10.5px]">
                              Hardware and development Charges
                            </div>
                            <table className="w-full text-left">
                              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[9.5px]">
                                <tr>
                                  <th className="py-1 px-2 text-center w-10">S.No</th>
                                  <th className="py-1 px-3">Component Name</th>
                                  <th className="py-1 px-2 text-center w-16">Qty</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-700 text-[9.5px]">
                                {weldingSavedHwItems.length > 0 ? (
                                  weldingSavedHwItems.map((row: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50/50">
                                      <td className="py-0.5 px-2 text-center font-semibold text-slate-500">{row.stepNo || idx + 1}</td>
                                      <td className="py-0.5 px-3 font-medium text-slate-900 leading-tight">{row.description}</td>
                                      <td className="py-0.5 px-2 text-center font-bold text-slate-800">
                                        {row.qty}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  ((proposal as any)?.costingSheet?.weldingHardwareRows || INITIAL_WELDING_HARDWARE_ROWS).map((row: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50/50">
                                      <td className="py-0.5 px-2 text-center font-semibold text-slate-500">{row.slNo || idx + 1}</td>
                                      <td className="py-0.5 px-3 font-medium text-slate-900 leading-tight">{row.componentName}</td>
                                      <td className="py-0.5 px-2 text-center font-bold text-slate-800">
                                        {row.qty !== undefined && row.qty !== null ? String(row.qty) : '0'}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>

                          {/* Right Column: Software Development & Cloud Recurring Cost */}
                          <div className="space-y-2.5">
                            {/* Annexure Table 2: Software Development */}
                            <div className="border border-slate-300 rounded-lg overflow-hidden">
                              <div className="bg-slate-100 p-1.5 px-3 border-b border-slate-200 font-bold text-slate-900 text-center uppercase tracking-wide text-[10.5px]">
                                Software Development Scope
                              </div>
                              <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[9.5px]">
                                  <tr>
                                    <th className="py-1 px-2 text-center w-20">Item</th>
                                    <th className="py-1 px-2">Description</th>
                                    <th className="py-1 px-2 text-center w-14">Qty</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700 text-[9.5px]">
                                  {weldingSavedSwItems.length > 0 ? (
                                    weldingSavedSwItems.map((row: any, idx: number) => (
                                      <tr key={idx}>
                                        <td className="py-1 px-2 font-bold text-slate-900 text-center">Software Development</td>
                                        <td className="py-1 px-2 leading-snug text-slate-800">{row.description.replace(/^Software Development:\s*/i, '')}</td>
                                        <td className="py-1 px-2 text-center font-bold text-slate-800">{row.qty || '1'} {row.uom || 'per kit'}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    ((proposal as any)?.costingSheet?.weldingSoftwareRows || INITIAL_WELDING_SOFTWARE_ROWS).map((row: any, idx: number) => (
                                      <tr key={idx}>
                                        <td className="py-1 px-2 font-bold text-slate-900 text-center">{row.item || 'Software Development'}</td>
                                        <td className="py-1 px-2 leading-snug text-slate-800">{row.description}</td>
                                        <td className="py-1 px-2 text-center font-bold text-slate-800">{row.uom || 'per kit'}</td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* Annexure Table 3: Cloud Recurring Cost */}
                            <div className="border border-slate-300 rounded-lg overflow-hidden">
                              <div className="bg-slate-100 p-1.5 px-3 border-b border-slate-200 font-bold text-slate-900 text-center uppercase tracking-wide text-[10.5px]">
                                Cloud Recurring Cost
                              </div>
                              <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[9.5px]">
                                  <tr>
                                    <th className="py-1 px-2">Component</th>
                                    <th className="py-1 px-2">Description</th>
                                    <th className="py-1 px-2 text-center w-16">Type</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700 text-[9.5px]">
                                  {weldingSavedCloudItems.length > 0 ? (
                                    weldingSavedCloudItems.map((row: any, idx: number) => {
                                      const full = row.description || '';
                                      const matchType = full.match(/\(([^)]+)\)/);
                                      const typeStr = matchType ? matchType[1] : 'Cloud';
                                      const compName = full.split('(')[0]?.trim() || full.split(':')[0]?.trim() || 'Cloud Service';
                                      const descStr = full.includes(':') ? full.split(':')[1]?.trim() : full;
                                      return (
                                        <tr key={idx}>
                                          <td className="py-0.5 px-2 font-semibold text-slate-900 leading-tight">{compName}</td>
                                          <td className="py-0.5 px-2 text-slate-700 leading-tight">{descStr}</td>
                                          <td className="py-0.5 px-2 text-center font-bold text-indigo-700">{typeStr}</td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    ((proposal as any)?.costingSheet?.weldingCloudRows || INITIAL_WELDING_CLOUD_ROWS).map((row: any, idx: number) => (
                                      <tr key={idx}>
                                        <td className="py-0.5 px-2 font-semibold text-slate-900 leading-tight">{row.component}</td>
                                        <td className="py-0.5 px-2 text-slate-700 leading-tight">{row.description}</td>
                                        <td className="py-0.5 px-2 text-center font-bold text-indigo-700">{row.type}</td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : isIotOrControls ? (
                /* Itemized Table Grouped by 5 Scopes Matching Step 4 */
                <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-3 text-center w-16">Step No</th>
                        <th className="py-2 px-4 w-3/5">Item Description</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3 text-center">UoM</th>
                        <th className="py-2 px-4 text-right">Customer Price (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {hasSavedLineItems ? (
                        mappedSavedItems.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2 px-3 text-center font-bold text-slate-600">{row.stepNo}</td>
                            <td className="py-2 px-4 font-semibold text-slate-900 leading-relaxed text-[11px]">
                              {row.description}
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-slate-700">{row.qty}</td>
                            <td className="py-2 px-3 text-center font-medium text-slate-600">{row.uom}</td>
                            <td className="py-2 px-4 text-right font-black text-slate-900">
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
                                <td className="py-2 px-3 text-center font-bold text-slate-600">{row.stepNo}</td>
                                <td className="py-2 px-4 font-semibold text-slate-900 leading-relaxed text-[11px]">
                                  {row.description}
                                </td>
                                <td className="py-2 px-3 text-center font-bold text-slate-700">{row.qty}</td>
                                <td className="py-2 px-3 text-center font-medium text-slate-600">{row.uom}</td>
                                <td className="py-2 px-4 text-right font-black text-slate-900">
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

                  <div className="bg-slate-900 text-white p-3 px-5 flex justify-between items-center font-extrabold text-xs sm:text-sm">
                    <span className="tracking-wide uppercase text-xs">TOTAL PROPOSED COMMERCIAL VALUE (INCL. TAXES)</span>
                    <span className="text-emerald-400 text-base sm:text-lg font-black tracking-tight">
                      {formatCurrency(finalProposedValue)}
                    </span>
                  </div>
                </div>
              ) : (
                /* Energy Audit Cost Estimate Table */
                <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-4 w-3/5">Description</th>
                        <th className="py-2.5 px-3 text-center">Project Timeline</th>
                        <th className="py-2.5 px-4 text-right">Project Cost (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-slate-900 leading-relaxed text-[12px]">
                          Energy Audit for the scope mentioned above
                        </td>
                        <td className="py-3 px-3 text-center font-medium text-slate-700 text-[11px]">
                          1–2 Weeks
                        </td>
                        <td className="py-3 px-4 text-right font-black text-slate-950 text-sm">
                          {formatCurrency(quote?.finalQuote || 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="bg-slate-900 text-white p-3.5 px-5 flex justify-between items-center font-extrabold text-xs sm:text-sm">
                    <span className="tracking-wide uppercase text-xs">TOTAL COMMERCIAL INVESTMENT (INCL. ALL EXPENSES)</span>
                    <span className="text-emerald-400 text-base sm:text-lg font-black tracking-tight">
                      {formatCurrency(quote?.finalQuote || 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative z-10 border-t border-slate-200 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Ref: {proposalRef}</span>
            <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              Page 4 of {totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DOCUMENT FINAL PAGE: NOTES, TERMS, SUBMITTED BY & BANK DETAILS     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
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

          <div className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-3 gap-4">
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
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </div>
            </div>

            {/* Step 6: NOTE & Support Required (For IoT / Controls / WMS) */}
            {!isEnergyAudit && (
              <>
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

                <div className="space-y-2 pt-1">
                  <h3
                    className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                    style={{ fontSize: '20px' }}
                  >
                    Support required from the client:
                  </h3>
                  {isWeldingIot ? (
                    <ul
                      className="space-y-1.5 pl-4 text-slate-800 font-normal text-left"
                      style={{ fontSize: '12px', lineHeight: '1.65' }}
                    >
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-slate-900">•</span>
                        <span>SPOC (Single point of Contact) for support and coordination.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-slate-900">•</span>
                        <span>Maintenance team support for installation. From the electrical team power supply connection, cabling etc.</span>
                      </li>
                    </ul>
                  ) : isWaterManagement ? (
                    <ul
                      className="space-y-1.5 pl-4 text-slate-800 font-normal text-left"
                      style={{ fontSize: '12px', lineHeight: '1.65' }}
                    >
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-slate-900">•</span>
                        <span>Consumables and related activities need to be handled by the customer as per actual requirements.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-slate-900">•</span>
                        <span>Data confirmation and report acceptance sign off will be customer SPOC scope.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-slate-900">•</span>
                        <span>Water shutdown and fixing of meter line to be arranged by the customer.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-slate-900">•</span>
                        <span>All meter changes and cable looping work to be carried out by customer’s qualified technicians.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-slate-900">•</span>
                        <span>A dedicated SPOC (Single Point of Contact) to be assigned for support and coordination during installation and commissioning.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-slate-900">•</span>
                        <span>SPOC is responsible for reviewing alerts and reports as per requirements.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-slate-900">•</span>
                        <span>Customer to ensure accessibility to all required areas.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-slate-900">•</span>
                        <span>Shutdown to be arranged by the customer for new energy meter integration, if required.</span>
                      </li>
                    </ul>
                  ) : (
                    <ul
                      className="space-y-1.5 pl-4 text-slate-800 font-normal text-left"
                      style={{ fontSize: '12px', lineHeight: '1.65' }}
                    >
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
                  )}
                </div>
              </>
            )}

            {/* Step 6: Terms and Conditions */}
            <div className="space-y-2 pt-1">
              <h3
                className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                style={{ fontSize: '20px' }}
              >
                {isEnergyAudit ? '4. Terms and Conditions & Commercial Authorization:' : 'Terms and Conditions:'}
              </h3>
              {isWeldingIot ? (
                <div
                  className="space-y-2 text-slate-800 font-normal text-left"
                  style={{ fontSize: '11px', lineHeight: '1.55' }}
                >
                  <ol className="space-y-1 pl-4 list-decimal text-slate-800">
                    <li>Customer Shall purchase IOT4.0 Package of Qty: 1 kit for POC / Phase 1.</li>
                    <li>Customer shall monitor &amp; validate the weld productivity &amp; performance for an intended period of 1 month from the date of commissioning of these Qty: 1 kit as per the success criteria. Sustainabyte shall support all installations &amp; service-based queries for IoT 4.0 system purchased under this agreement.</li>
                    <li><strong>Payment Schedule:</strong> 70% advance against PO for Hardware supply and installation charges; 30% after validating data and logics in Cloud platform.</li>
                    <li>IOT 4.0 Online weld data monitoring &amp; control system with Hooter with Tower lamp should be arranged by IOT4.0 System Supplier individually for each machine.</li>
                    <li>The Lead time to dispatch the IOT systems to your factory site is 30 days.</li>
                    <li>Warranty doesn't cover any physical damage, however shall cover the following clauses:</li>
                    <li>Sustainabyte will be liable to replace any hardware parts (excl: under warranty claims) before completion of 1 Year from the date of purchase.</li>
                    <li>Sustainabyte shall not be responsible for any damage, loss or theft regardless of cause for the IOT kits during &amp; after commissioning.</li>
                    <li>Sustainabyte should support &amp; rectify any technical fault in sensor or software without causing any physical damage during entire warranty period.</li>
                    <li>BREAKDOWN SERVICE for IOT Kit Hardware spares &amp; accessories not covered under warranty shall be done by Sustainabyte under additional service charges.</li>
                    <li>Documented Cost Reduction Study (DCRS) support period from Sustainabyte shall be availed after each month on initial 3-month period.</li>
                  </ol>
                </div>
              ) : isEnergyAudit ? (
                <div className="space-y-3.5 text-slate-800 font-normal text-left" style={{ fontSize: '12px', lineHeight: '1.65' }}>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-950 text-sm">Payment Terms:</p>
                    <ul className="space-y-1 pl-4">
                      <li>• 30 days from the date of invoice and invoice will be raised after the work completion at site.</li>
                      <li>• Applicable taxes and duties shall be charged extra, as applicable.</li>
                      <li>• All lodging, boarding, and travel expenses are as actual or Customer scope.</li>
                      <li>• The quote is valid for 45 days from the date of submission.</li>
                    </ul>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <p className="font-bold text-slate-950 text-sm">Other Terms and Conditions:</p>
                    <p className="text-slate-800 pl-1">
                      Customer shall arrange a skilled individual (Authorized technicians) for the entire duration of the audit period for local co-ordination with site team for seeking approval or work permits and installation of energy auditing equipment with proper safety measures.
                    </p>
                  </div>
                </div>
              ) : isWaterManagement ? (
                <div
                  className="space-y-2 text-slate-800 font-normal text-left"
                  style={{ fontSize: '12px', lineHeight: '1.65' }}
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-950">Payment schedule</p>
                    <ul className="space-y-0.5 pl-4">
                      <li>• <strong>Supply of hardware</strong> – 100% upfront</li>
                      <li>• <strong>Software payment</strong> – 70% advance payment &amp; remaining 30% after dashboard finalization</li>
                      <li>• <strong>Installation and commissioning</strong> – 70% advance payment &amp; remaining 30% after work completion</li>
                    </ul>
                  </div>
                  <ul className="space-y-1 pl-4 pt-0.5">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">•</span>
                      <span>Applicable taxes and duties will be extra</span>
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
                      <span>Any material beyond current scope will be charged as actual.</span>
                    </li>
                  </ul>
                </div>
              ) : isBms ? (
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
                <ul
                  className="space-y-1.5 pl-4 text-slate-800 font-normal text-left"
                  style={{ fontSize: '12px', lineHeight: '1.65' }}
                >
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

          <div className="relative z-10 border-t border-slate-200 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Ref: {proposalRef}</span>
            <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page {totalPages} of {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

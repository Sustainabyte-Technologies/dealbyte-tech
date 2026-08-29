'use client';

import React from 'react';
import { Proposal } from '@/lib/api/proposals';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ASSESSMENT_ASSETS } from '@/lib/constants/assessment-assets';
import {
  ENERGY_AUDIT_TRACK_RECORD_CLIENTS,
  ASHRAE_LEVEL_2_CLIENTS,
  INITIAL_WELDING_HARDWARE_ROWS,
  INITIAL_WELDING_SOFTWARE_ROWS,
  INITIAL_WELDING_CLOUD_ROWS,
  INITIAL_DIGIWELD_SOFTWARE_ROWS,
  INITIAL_DIGIWELD_CLOUD_ROWS,
  DEFAULT_COMPRESSOR_ROI_DATA,
  CompressorRoiData,
} from '@/components/costing/constants';
import { Send, Printer, Download, Loader2, FileText } from 'lucide-react';
import { generateWordDocument } from './wordExport';
import FullPageWatermark from '@/components/common/FullPageWatermark';
import { toast } from 'sonner';
import { CompressorAirAuditPages } from './CompressorAirAuditPages';
import { Iso50001Pages } from './Iso50001Pages';
import { MixtureGasLeakageAuditPages } from './MixtureGasLeakageAuditPages';
import { NitrogenGasLeakageAuditPages } from './NitrogenGasLeakageAuditPages';
import { DewPointHardwarePages } from './DewPointHardwarePages';
import { FlangesHardwarePages } from './FlangesHardwarePages';
import { CpmProposalPages } from './CpmProposalPages';
import { IrBlasterPages } from './IrBlasterPages';
import { IaqSensorPages } from './IaqSensorPages';
import { CompressedAirAutomationPages } from './CompressedAirAutomationPages';
import { WaterAutomationProposalPages } from './WaterAutomationProposalPages';

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

  const serviceTitle = (
    deal?.service?.name ||
    (deal?.service as any)?.category ||
    (deal as any)?.serviceCategory ||
    (deal as any)?.serviceName ||
    (quote as any)?.service?.name ||
    (quote as any)?.service?.category ||
    (quote as any)?.serviceName ||
    (quote as any)?.category ||
    (proposal as any)?.serviceCategory ||
    (proposal as any)?.serviceName ||
    (proposal as any)?.category ||
    ''
  ).toLowerCase();

  const subServiceTitle = (
    (proposal as any)?.subService ||
    (proposal as any)?.serviceName ||
    (quote as any)?.serviceName ||
    (quote as any)?.subService ||
    (deal as any)?.serviceName ||
    (deal as any)?.subService ||
    deal?.service?.name ||
    (deal as any)?.title ||
    ''
  ).toLowerCase();

  const lineItemsText = (quote?.lineItems || (proposal as any)?.lineItems || [])
    .map((li: any) => li.description || '')
    .join(' ')
    .toLowerCase();

  const isWeldDataDigitalized =
    serviceTitle.includes('weld data digitalized') ||
    serviceTitle.includes('weld data') ||
    serviceTitle.includes('weldwise') ||
    serviceTitle.includes('fusionbyte') ||
    serviceTitle.includes('digiweld') ||
    subServiceTitle.includes('weld data digitalized') ||
    subServiceTitle.includes('weld data') ||
    subServiceTitle.includes('weldwise') ||
    subServiceTitle.includes('fusionbyte') ||
    subServiceTitle.includes('digiweld') ||
    lineItemsText.includes('weld') ||
    Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('weld data digitalized')) ||
    Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('digiweld')) ||
    Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('weld data digitalized')) ||
    Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('digiweld')) ||
    Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('weld data digitalized')) ||
    Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('digiweld')) ||
    Boolean((proposal as any)?.subService?.toLowerCase()?.includes('weld data digitalized')) ||
    Boolean((proposal as any)?.subService?.toLowerCase()?.includes('digiweld'));

  const isMixtureGasLeakageAudit =
    serviceTitle.includes('mixture') ||
    serviceTitle.includes('mixed gas') ||
    serviceTitle.includes('gas system leakage') ||
    subServiceTitle.includes('mixture') ||
    subServiceTitle.includes('mixed gas') ||
    subServiceTitle.includes('gas system leakage') ||
    lineItemsText.includes('mixture') ||
    lineItemsText.includes('mixed gas') ||
    Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('mixture')) ||
    Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('mixed gas')) ||
    Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('gas system')) ||
    Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('mixture')) ||
    Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('mixture')) ||
    Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('mixed gas')) ||
    Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('gas system')) ||
    Boolean((proposal as any)?.subService?.toLowerCase()?.includes('mixture')) ||
    Boolean((proposal as any)?.subService?.toLowerCase()?.includes('mixed gas')) ||
    Boolean((proposal as any)?.subService?.toLowerCase()?.includes('gas system'));

  const isIrBlaster =
    serviceTitle.includes('ir blaster') ||
    serviceTitle.includes('irblaster') ||
    serviceTitle.includes('ir_blaster') ||
    subServiceTitle.includes('ir blaster') ||
    subServiceTitle.includes('irblaster') ||
    subServiceTitle.includes('new ir blaster') ||
    subServiceTitle.includes('old ir blaster') ||
    lineItemsText.includes('ir blaster') ||
    lineItemsText.includes('irblaster') ||
    Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('ir blaster')) ||
    Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('ir blaster')) ||
    Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('ir blaster')) ||
    Boolean((proposal as any)?.subService?.toLowerCase()?.includes('ir blaster'));

  const isCpmChillerManagement =
    !isIrBlaster &&
    (serviceTitle.includes('cpm') ||
      subServiceTitle.includes('cpm') ||
      serviceTitle.includes('chiller') ||
      subServiceTitle.includes('chiller') ||
      serviceTitle.includes('central plant') ||
      subServiceTitle.includes('central plant') ||
      lineItemsText.includes('cpm') ||
      lineItemsText.includes('chiller') ||
      lineItemsText.includes('ddc panel') ||
      lineItemsText.includes('central plant') ||
      Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('cpm')) ||
      Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('cpm')) ||
      Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('chiller management')) ||
      Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('cpm')) ||
      Boolean((proposal as any)?.subService?.toLowerCase()?.includes('cpm')));

  const isWaterAutomation =
    subServiceTitle.includes('water automation') ||
    (serviceTitle.includes('automation') && subServiceTitle.includes('water')) ||
    Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('water automation')) ||
    Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('automation') && (deal?.service as any)?.name?.toLowerCase()?.includes('water')) ||
    Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('water automation')) ||
    Boolean((proposal as any)?.subService?.toLowerCase()?.includes('water automation'));

  const isCompressedAirAutomation =
    !isWaterAutomation && (
      subServiceTitle.includes('compressed air automation') ||
      subServiceTitle.includes('air automation') ||
      (serviceTitle.includes('automation') && subServiceTitle.includes('compressed air')) ||
      Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('compressed air automation')) ||
      Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('automation') && (deal?.service as any)?.name?.toLowerCase()?.includes('compressed air')) ||
      Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('compressed air automation')) ||
      Boolean((proposal as any)?.subService?.toLowerCase()?.includes('compressed air automation'))
    );

  const isIaqSensor =
    !isWaterAutomation &&
    !isCompressedAirAutomation &&
    (serviceTitle.includes('iaq') ||
      subServiceTitle.includes('iaq') ||
      subServiceTitle.includes('indoor air') ||
      Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('iaq')) ||
      Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('iaq')) ||
      Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('iaq')) ||
      Boolean((proposal as any)?.subService?.toLowerCase()?.includes('iaq')));

  const isFlangesHardware =
    !isCpmChillerManagement &&
    !isIaqSensor &&
    (serviceTitle.includes('flange') ||
      subServiceTitle.includes('flange') ||
      Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('flange')) ||
      Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('flange')) ||
      Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('flange')) ||
      Boolean((proposal as any)?.subService?.toLowerCase()?.includes('flange')));

  const isDewPointHardware =
    !isFlangesHardware &&
    !isIaqSensor &&
    (serviceTitle.includes('dew point') ||
      subServiceTitle.includes('dew point') ||
      Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('dew point')) ||
      Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('dew point')) ||
      Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('dew point')) ||
      Boolean((proposal as any)?.subService?.toLowerCase()?.includes('dew point')));

  const isNitrogenGasLeakageAudit =
    !isDewPointHardware &&
    (serviceTitle.includes('nitrogen') ||
      subServiceTitle.includes('nitrogen') ||
      Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('nitrogen')) ||
      Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('nitrogen')) ||
      Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('nitrogen')) ||
      Boolean((proposal as any)?.subService?.toLowerCase()?.includes('nitrogen')));

  const isCompressorAirLeakageRectification =
    !isMixtureGasLeakageAudit &&
    !isNitrogenGasLeakageAudit &&
    (serviceTitle.includes('rectification') || subServiceTitle.includes('rectification')) &&
    (serviceTitle.includes('compress') || subServiceTitle.includes('compress') || serviceTitle.includes('leakage') || subServiceTitle.includes('leakage'));

  const isCompressorAirLeakageAudit =
    !isMixtureGasLeakageAudit &&
    !isNitrogenGasLeakageAudit &&
    !isCompressorAirLeakageRectification &&
    (
      serviceTitle.includes('compressor air leakage') ||
      serviceTitle.includes('air leakage audit') ||
      serviceTitle.includes('compressor air audit') ||
      serviceTitle.includes('compressed air audit') ||
      (serviceTitle.includes('leakage audit') && !serviceTitle.includes('mixture') && !serviceTitle.includes('gas') && !serviceTitle.includes('nitrogen')) ||
      subServiceTitle.includes('compressor air leakage') ||
      subServiceTitle.includes('air leakage audit') ||
      subServiceTitle.includes('compressor air audit') ||
      subServiceTitle.includes('compressed air audit') ||
      (subServiceTitle.includes('leakage audit') && !subServiceTitle.includes('mixture') && !subServiceTitle.includes('gas') && !subServiceTitle.includes('nitrogen')) ||
      Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('compressor air leakage')) ||
      Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('air leakage')) ||
      Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('compressor air leakage')) ||
      Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('compressor air leakage')) ||
      Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('air leakage')) ||
      Boolean((proposal as any)?.subService?.toLowerCase()?.includes('compressor air leakage')) ||
      Boolean((proposal as any)?.subService?.toLowerCase()?.includes('air leakage'))
    );

  const isCompressorAirLeakage = isCompressorAirLeakageRectification || isCompressorAirLeakageAudit;

  const isIso50001 =
    serviceTitle.includes('iso 50001') ||
    serviceTitle.includes('iso50001') ||
    serviceTitle.includes('enms') ||
    serviceTitle.includes('energy management system') ||
    subServiceTitle.includes('iso 50001') ||
    subServiceTitle.includes('iso50001') ||
    subServiceTitle.includes('enms') ||
    subServiceTitle.includes('energy management system') ||
    Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('iso 50001')) ||
    Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('enms')) ||
    Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('energy management system')) ||
    Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('iso 50001')) ||
    Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('enms')) ||
    Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('iso 50001')) ||
    Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('enms')) ||
    Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('energy management system')) ||
    Boolean((proposal as any)?.subService?.toLowerCase()?.includes('iso 50001')) ||
    Boolean((proposal as any)?.subService?.toLowerCase()?.includes('enms')) ||
    Boolean((proposal as any)?.subService?.toLowerCase()?.includes('energy management system'));

  const isAshraeLevel2 =
    !isIso50001 && (
      serviceTitle.includes('ashrae') ||
      subServiceTitle.includes('ashrae') ||
      Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('ashrae')) ||
      Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('ashrae')) ||
      Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('ashrae')) ||
      Boolean((proposal as any)?.subService?.toLowerCase()?.includes('ashrae'))
    );

  const isHvacDesign =
    serviceTitle.includes('hvac design') ||
    serviceTitle.includes('hvac') ||
    subServiceTitle.includes('hvac design') ||
    subServiceTitle.includes('hvac') ||
    Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('hvac')) ||
    Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('hvac')) ||
    Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('hvac')) ||
    Boolean((proposal as any)?.subService?.toLowerCase()?.includes('hvac'));

  const isEcFan =
    serviceTitle.includes('ec fan') ||
    serviceTitle.includes('ec-fan') ||
    serviceTitle.includes('ecfan') ||
    subServiceTitle.includes('ec fan') ||
    subServiceTitle.includes('ec-fan') ||
    subServiceTitle.includes('ecfan') ||
    Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('ec fan')) ||
    Boolean((deal?.service as any)?.name?.toLowerCase()?.includes('ec-fan')) ||
    Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('ec fan')) ||
    Boolean((proposal as any)?.serviceName?.toLowerCase()?.includes('ec fan')) ||
    Boolean((proposal as any)?.subService?.toLowerCase()?.includes('ec fan'));

  const isBms =
    !isWeldDataDigitalized && (
      serviceTitle.includes('bms') ||
      serviceTitle.includes('building management') ||
      Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('bms')) ||
      Boolean((proposal as any)?.category?.toLowerCase()?.includes('bms'))
    );

  const isWaterManagement =
    !isWeldDataDigitalized && (
      serviceTitle.includes('water management') ||
      serviceTitle.includes('water monitoring') ||
      serviceTitle.includes('wms') ||
      Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('water')) ||
      Boolean((proposal as any)?.category?.toLowerCase()?.includes('water'))
    );

  const isWeldingIot =
    !isWeldDataDigitalized && (
      serviceTitle.includes('welding') ||
      Boolean((deal?.service as any)?.category?.toLowerCase()?.includes('welding')) ||
      Boolean((proposal as any)?.category?.toLowerCase()?.includes('welding'))
    );

  const isIotOrControls =
    isWeldDataDigitalized ||
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

  const finalPrice = Number(
    quote?.finalQuote ||
    (proposal as any)?.finalQuote ||
    (proposal as any)?.quote?.finalQuote ||
    (proposal as any)?.costingSheet?.finalQuote ||
    (quote as any)?.costingSheet?.finalQuote ||
    (deal as any)?.quote?.finalQuote ||
    (proposal as any)?.amount ||
    (hasSavedLineItems ? iotTotalSum : 0)
  );

  const finalProposedValue = finalPrice || iotTotalSum;

  const totalPages = isCompressorAirLeakageAudit ? 6 : isCompressorAirLeakageRectification ? 3 : isEcFan ? 4 : 5;
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

  const [isGeneratingWord, setIsGeneratingWord] = React.useState(false);

  const downloadWordDoc = async () => {
    try {
      setIsGeneratingWord(true);
      toast.info('Generating Word document (.doc)...');

      const wordHtml = generateWordDocument({
        proposalRef,
        proposalDate,
        clientName: deal?.clientName || 'Valued Client',
        clientLogo: (proposal as any)?.clientLogo || '',
        finalPrice,
        formatCurrency,
        isCpmChillerManagement,
        origin: window.location.origin,
        costingSheet: (proposal as any)?.costingSheet || (proposal as any)?.costing_sheet || (proposal as any)?.costingData || (proposal as any)?.quote?.costingSheet || (deal as any)?.costingSheet || (deal as any)?.quote?.costingSheet || {},
        projectName: (deal as any)?.projectName,
      });

      const sanitizedClient = (deal?.clientName || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Proposal_${proposalRef}_${sanitizedClient}.doc`;

      const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword;charset=utf-8' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast.success(`Word document ${filename} downloaded successfully!`);
    } catch (err: any) {
      console.error('Word export error:', err);
      toast.error('Failed to generate Word document.');
    } finally {
      setIsGeneratingWord(false);
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
            disabled={isGeneratingPdf || isGeneratingWord}
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
            onClick={downloadWordDoc}
            disabled={isGeneratingPdf || isGeneratingWord}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
          >
            {isGeneratingWord ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating Word...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" /> Download Word (.doc)
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

      {isWaterAutomation ? (
        <WaterAutomationProposalPages
          deal={deal}
          proposal={proposal}
          proposalRef={proposalRef}
          proposalDate={proposalDate}
          finalPrice={finalPrice}
          formatCurrency={formatCurrency}
          costingSheet={(proposal as any)?.costingSheet || (proposal as any)?.costing_sheet || (proposal as any)?.costingData || (proposal as any)?.quote?.costingSheet || (deal as any)?.costingSheet || (deal as any)?.quote?.costingSheet}
        />
      ) : isCompressedAirAutomation ? (
        <CompressedAirAutomationPages
          deal={deal}
          proposal={proposal}
          proposalRef={proposalRef}
          proposalDate={proposalDate}
          finalPrice={finalPrice}
          formatCurrency={formatCurrency}
          costingSheet={(proposal as any)?.costingSheet || (proposal as any)?.costing_sheet || (proposal as any)?.costingData || (proposal as any)?.quote?.costingSheet || (deal as any)?.costingSheet || (deal as any)?.quote?.costingSheet}
        />
      ) : isIrBlaster ? (
        <IrBlasterPages
          deal={deal}
          proposal={proposal}
          proposalRef={proposalRef}
          proposalDate={proposalDate}
          finalPrice={finalPrice}
          formatCurrency={formatCurrency}
          costingSheet={(proposal as any)?.costingSheet || (proposal as any)?.costing_sheet || (proposal as any)?.costingData || (proposal as any)?.quote?.costingSheet || (deal as any)?.costingSheet || (deal as any)?.quote?.costingSheet}
        />
      ) : isCpmChillerManagement ? (
        <CpmProposalPages
          deal={deal}
          proposal={proposal}
          proposalRef={proposalRef}
          proposalDate={proposalDate}
          finalPrice={finalPrice}
          formatCurrency={formatCurrency}
          costingSheet={(proposal as any)?.costingSheet || (proposal as any)?.costing_sheet || (proposal as any)?.costingData || (proposal as any)?.quote?.costingSheet || (deal as any)?.costingSheet || (deal as any)?.quote?.costingSheet}
        />
      ) : isIaqSensor ? (
        <IaqSensorPages
          deal={deal}
          proposal={proposal}
          proposalRef={proposalRef}
          proposalDate={proposalDate}
          finalPrice={finalPrice}
          formatCurrency={formatCurrency}
          costingSheet={(proposal as any)?.costingSheet || (proposal as any)?.costing_sheet || (proposal as any)?.costingData || (proposal as any)?.quote?.costingSheet || (deal as any)?.costingSheet || (deal as any)?.quote?.costingSheet}
        />
      ) : isFlangesHardware ? (
        <FlangesHardwarePages
          deal={deal}
          proposal={proposal}
          proposalRef={proposalRef}
          proposalDate={proposalDate}
          finalPrice={finalPrice}
          formatCurrency={formatCurrency}
        />
      ) : isDewPointHardware ? (
        <DewPointHardwarePages
          deal={deal}
          proposal={proposal}
          proposalRef={proposalRef}
          proposalDate={proposalDate}
          finalPrice={finalPrice}
          formatCurrency={formatCurrency}
        />
      ) : isNitrogenGasLeakageAudit ? (
        <NitrogenGasLeakageAuditPages
          deal={deal}
          proposal={proposal}
          proposalRef={proposalRef}
          proposalDate={proposalDate}
          finalPrice={finalPrice}
          formatCurrency={formatCurrency}
        />
      ) : isMixtureGasLeakageAudit ? (
        <MixtureGasLeakageAuditPages
          deal={deal}
          proposal={proposal}
          proposalRef={proposalRef}
          proposalDate={proposalDate}
          finalPrice={finalPrice}
          formatCurrency={formatCurrency}
        />
      ) : isCompressorAirLeakageAudit ? (
        <CompressorAirAuditPages
          deal={deal}
          proposal={proposal}
          proposalRef={proposalRef}
          proposalDate={proposalDate}
          finalPrice={finalPrice}
          formatCurrency={formatCurrency}
        />
      ) : isIso50001 ? (
        <Iso50001Pages
          deal={deal}
          proposal={proposal}
          proposalRef={proposalRef}
          proposalDate={proposalDate}
          finalPrice={finalPrice}
          formatCurrency={formatCurrency}
        />
      ) : (
        <>
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
                      {isWeldDataDigitalized
                        ? 'IoT & Controls / Weld Data Digitalized'
                        : isWaterManagement
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
                      Service Scope: <span className="font-bold text-slate-800">{isWeldDataDigitalized ? 'Weld Data Digitalized (Fusionbyte – WeldWise Suite)' : (deal?.service?.name || 'Energy Management & Optimization')}</span>
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
          {/* DOCUMENT PAGE 2: WELD DATA DIGITALIZED / WELDING IOT / IOT / AUDIT */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {isWeldDataDigitalized ? (
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
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scope of Work &amp; Project Overview</p>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{deal?.clientName} — Digiweld (Weld Data Digitalization)</h2>
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

                  {/* 1. Scope of Work */}
                  <div className="space-y-1">
                    <h3
                      className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                      style={{ fontSize: '15px' }}
                    >
                      Scope of Work:
                    </h3>
                    <p className="text-slate-800 text-[11px] leading-snug font-medium">
                      Development of a centralized digital platform for BIQ data digitalization, Weld Engineering Documents &amp; NDT Reports management, Paint Defect Mapping, and Weld Audit monitoring. The solution includes real-time dashboards, defect trend analysis, process traceability, audit tracking, and AI-powered reporting to improve manufacturing quality, compliance, and operational efficiency.
                    </p>
                  </div>

                  {/* 4 Pillars of Solution */}
                  <div className="space-y-2 text-[11px] leading-snug text-slate-800">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-950">BIQ Data Digitalization</p>
                      <p className="text-slate-700">Digitalization of BIQ inspection and quality records through a centralized platform for real-time monitoring and traceability. The system enables defect tracking, inspection logging, and dashboard-based analytics for improved quality control and reporting.</p>
                    </div>

                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-950">Weld Engineering Data Digitalization</p>
                      <p className="text-slate-700">Development of a digital weld engineering management system to capture weld process data, WPS records, welding parameters, and joint-wise traceability. The platform provides process monitoring, parameter analysis, and centralized documentation management.</p>
                    </div>

                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-950">Paint Defect Mapping</p>
                      <p className="text-slate-700">Implementation of a paint defect mapping and analysis system for recording, categorizing, and monitoring paint-related defects across production stages. The solution includes trend analysis, Pareto charts, and dashboard visualization for continuous quality improvement.</p>
                    </div>

                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-950">Weld Audit Documents Digitalization</p>
                      <p className="text-slate-700">Digitalization of weld audit documents, inspection checklists, and compliance records through a structured audit management system. The platform supports audit tracking, corrective action monitoring, document archival, and real-time audit dashboards.</p>
                    </div>
                  </div>

                  {/* Technologies Used, Timeline Estimate & Deliverables (Row-Wise) */}
                  <div className="space-y-2 pt-1 border-t border-slate-200 text-[10.5px]">
                    {/* 1. Technologies Used */}
                    <div className="space-y-0.5">
                      <h4
                        className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                        style={{ fontSize: '13.5px' }}
                      >
                        Technologies Used:
                      </h4>
                      <ul className="pl-4 space-y-0.5 text-slate-800 leading-snug">
                        <li>● <strong>Frontend:</strong> Flutter (Android Only)</li>
                        <li>● <strong>Backend:</strong> Firebase (Firestore, Auth, Cloud Functions)</li>
                        <li>● <strong>Web App:</strong> Next.js, Tailwind css</li>
                        <li>● <strong>Email Notifications:</strong> Firebase Email Service or 3rd Party API (e.g., Send Grid)</li>
                        <li>● <strong>State Management:</strong> Provider / Riverpod / Bloc</li>
                      </ul>
                    </div>

                    {/* 2. Timeline Estimate */}
                    <div className="space-y-0.5 pt-0.5">
                      <h4
                        className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                        style={{ fontSize: '13.5px' }}
                      >
                        Timeline Estimate:
                      </h4>
                      <ul className="pl-4 space-y-0.5 text-slate-800 leading-snug">
                        <li>● <strong>UI/UX Design:</strong> 2 weeks</li>
                        <li>● <strong>Development (All Features):</strong> 4 weeks</li>
                        <li>● <strong>Testing &amp; QA:</strong> 2 weeks</li>
                        <li>● <strong>Deployment &amp; Training:</strong> 1 week</li>
                        <li>● <strong>Total:</strong> 9 weeks</li>
                      </ul>
                    </div>

                    {/* 3. Deliverables */}
                    <div className="space-y-0.5 pt-0.5">
                      <h4
                        className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                        style={{ fontSize: '13.5px' }}
                      >
                        Deliverables:
                      </h4>
                      <ul className="pl-4 space-y-0.5 text-slate-800 leading-snug">
                        <li>● Complete mobile app (Android and Web)</li>
                        <li>● Source code and Firebase configuration</li>
                        <li>● User manual and technical documentation</li>
                        <li>● One year of basic support and updates</li>
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
          ) : isWeldingIot ? (
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

                  {isEcFan ? (
                    <div
                      className="space-y-4 text-slate-900 text-left font-normal"
                      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", fontSize: '12px', lineHeight: '1.6' }}
                    >
                      <div>
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
                          Scope of Work:
                        </h3>
                        <p className="text-slate-800">
                          The scope of this proposal includes the supply of EC Fans as per the agreed specifications and quantity requirements.
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
                          Key Features:
                        </h3>
                        <ul className="pl-4 py-0.5 text-slate-800 space-y-1 list-disc text-[12px]">
                          <li>High-efficiency EC motor technology.</li>
                          <li>Lower power consumption compared to conventional AC motor-driven fans.</li>
                          <li>Integrated speed control for precise airflow regulation.</li>
                          <li>Reduced maintenance requirements.</li>
                          <li>Improved reliability and operational performance.</li>
                          <li>Lower noise levels and heat generation.</li>
                        </ul>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
                          Benefits:
                        </h3>
                        <ul className="pl-4 py-0.5 text-slate-800 space-y-1 list-disc text-[12px]">
                          <li>Energy savings through high motor efficiency and optimized speed control.</li>
                          <li>Improved system performance and airflow management.</li>
                          <li>Reduced carbon footprint and operating expenses.</li>
                          <li>Enhanced equipment life due to reduced mechanical stress.</li>
                        </ul>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
                          Cost Estimate:
                        </h3>
                        <div className="border border-slate-900 rounded-lg overflow-hidden text-xs">
                          <table className="w-full text-left">
                            <thead className="bg-slate-900 text-white font-bold text-xs">
                              <tr>
                                <th className="py-2 px-4 w-3/5">Description</th>
                                <th className="py-2 px-3 text-center">Project Timeline</th>
                                <th className="py-2 px-4 text-right">Project Cost (INR)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-slate-800 text-[12px]">
                              <tr>
                                <td className="py-2.5 px-4 font-semibold text-slate-900">
                                  Total Cost for the Mentioned location Fans
                                </td>
                                <td className="py-2.5 px-3 text-center font-medium text-slate-700">
                                  As per agreed schedule
                                </td>
                                <td className="py-2.5 px-4 text-right font-black text-slate-950 text-sm">
                                  {formatCurrency(quote?.finalQuote || 0)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="bg-slate-900 text-white p-2.5 px-4 flex justify-between items-center font-extrabold text-xs">
                            <span className="tracking-wide uppercase text-[11px]">Total Cost for the Mentioned location Fans :</span>
                            <span className="text-emerald-400 text-sm font-black tracking-tight">
                              {formatCurrency(quote?.finalQuote || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : isHvacDesign ? (
                    <div
                      className="space-y-3 text-slate-900 text-left font-normal"
                      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", fontSize: '12px', lineHeight: '1.55' }}
                    >
                      <div>
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
                          Objective:
                        </h3>
                        <p className="text-slate-800">
                          The objective of this study is to evaluate and design a system to replace the existing chilled water supply (18°C) to the Temperature Control Units (TCUs) serving Zones 1–3 of Mixers 11, 12, 13, 14, and 16, with cooling tower water at 30–31°C.
                        </p>
                        <p className="text-slate-800 mt-1">
                          The goal is to ensure that all TCUs continue to meet the required outlet temperature and process performance when supplied from the new cooling tower water system.
                        </p>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-slate-100">
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
                          Scope of Work:
                        </h3>
                        <p className="text-slate-800">
                          The study will determine the design, equipment specification, piping layout and operational implications to ensure the TCUs reliably achieve required outlet temperatures under the proposed cooling tower water system.
                        </p>
                        <p className="font-semibold text-slate-900 mt-1">The scope includes:</p>
                        <ul className="pl-4 py-0.5 text-slate-800 space-y-0.5 list-disc text-[12px]">
                          <li>Technical assessment and design development for replacing existing chilled water with new cooling tower water.</li>
                          <li>Mixer Phase 2 (3nos of cooling tower each 300TR Capacity) and Phase 3 (3nos of cooling tower each 400 TR capacity) actual heat load Design Vs Actual.</li>
                          <li>Identification of all related mechanical</li>
                          <li>Preparation of cost for execution.</li>
                        </ul>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-slate-100">
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
                          Site Visit and Data Collection:
                        </h3>
                        <ol className="pl-4 py-0.5 text-slate-800 space-y-0.5 list-decimal font-medium text-[12px]">
                          <li><strong>Data Collection &amp; Site Survey –</strong> Review existing system parameters, layouts, and space availability.</li>
                          <li><strong>Thermal &amp; Hydraulic Sizing –</strong> For cooling tower, circulation pumps, and headers.</li>
                          <li><strong>Distribution System Design –</strong> Piping layout, balancing valves, and routing optimization.</li>
                        </ol>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-slate-100">
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
                          Assumptions:
                        </h3>
                        <ul className="pl-4 py-0.5 text-slate-800 space-y-0.5 list-disc text-[12px]">
                          <li>Cooling tower inlet water temperature available at 30–31°C.</li>
                          <li>Adequate space available for installation of cooling tower, basin, and ancillary equipment.</li>
                          <li>Existing TCUs are compatible for operation with 30–31°C inlet water after required modifications.</li>
                        </ul>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-slate-100">
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
                          Exclusions:
                        </h3>
                        <ul className="pl-4 py-0.5 text-slate-800 space-y-0.5 list-disc text-[12px]">
                          <li>Detailed procurement, fabrication, and installation works (to be covered under a separate contract).</li>
                          <li>Civil and structural design are not included in this scope</li>
                          <li>Electrical and controls are not included in this scope</li>
                          <li>Water parameters requirement are not in scope</li>
                          <li>Any unrelated process modifications outside the defined TCU scope</li>
                        </ul>
                      </div>
                    </div>
                  ) : isCompressorAirLeakageAudit ? (
                    <div
                      className="space-y-3 text-slate-900 text-left font-normal"
                      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", fontSize: '11px', lineHeight: '1.5' }}
                    >
                      <div>
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-2">
                          Basic Compressed Air Network:
                        </h3>
                        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white p-2 shadow-2xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/compresed sir leakage audit.png"
                            alt="Basic Compressed Air Network"
                            className="w-full h-auto max-h-[220px] object-contain mx-auto"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <h3 className="font-bold text-slate-950 text-sm mb-1.5">
                          What is Compressed Air Audit?
                        </h3>
                        <div className="space-y-1.5 text-slate-800 text-[11px]">
                          <div>
                            <p className="flex items-start gap-2">
                              <span className="text-slate-900 font-bold">▪</span>
                              <span>A Compressed Air Audit is a systematic study of the compressed air system to identify</span>
                            </p>
                            <div className="pl-6 space-y-0.5 mt-0.5 text-slate-700">
                              <p className="flex items-center gap-1.5"><span className="text-slate-900 font-semibold">➢</span> energy losses</p>
                              <p className="flex items-center gap-1.5"><span className="text-slate-900 font-semibold">➢</span> Inefficiencies</p>
                              <p className="flex items-center gap-1.5"><span className="text-slate-900 font-semibold">➢</span> opportunities for cost savings</p>
                            </div>
                          </div>
                          <p className="flex items-start gap-2">
                            <span className="text-slate-900 font-bold">▪</span>
                            <span>It involves analysing compressors, air distribution lines, storage tanks, valves, dryers, and end-use equipment.</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-slate-900 font-bold">▪</span>
                            <span>The main purpose is to measure air demand, detect leakages, check pressure drops, and evaluate operating patterns.</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-slate-900 font-bold">▪</span>
                            <span>By doing this, we can highlight unnecessary energy consumption, calculate the financial loss, and suggest corrective measures for improving system reliability and reducing operating costs.</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-slate-900 font-bold">▪</span>
                            <span>In short, a compressed air audit helps customers save energy, lower production costs, and ensure a more reliable and sustainable operation.</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-slate-900 font-bold">▪</span>
                            <span>A Compressed Air Audit is like a health check-up for your compressed air system. It helps identify hidden leaks, pressure losses, and inefficient operations that quietly increase your power bills.</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-slate-900 font-bold">▪</span>
                            <span>With our audit, we can show you exactly where your system is wasting energy and how much money you can save by fixing it.</span>
                          </p>
                          <p className="flex items-start gap-2 font-medium">
                            <span className="text-slate-900 font-bold">▪</span>
                            <span>Many industries reduce their compressor power cost by 20–30% after an audit, while also improving reliability and productivity. This is a fast-return investment that directly lowers your operating cost.</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : isCompressorAirLeakageRectification ? (
                    <div className="space-y-2.5 text-slate-900 text-left font-normal" style={{ fontSize: '10px', lineHeight: '1.5' }}>
                      <div>
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
                          What is Compressed Air Audit?
                        </h3>
                        <p className="text-slate-800">
                          A Compressed Air Audit is a systematic study of the compressed air system to identify:
                        </p>
                        <ul className="pl-4 py-0.5 text-slate-800 space-y-0.5 list-disc">
                          <li>energy losses</li>
                          <li>Inefficiencies</li>
                          <li>opportunities for cost savings</li>
                        </ul>
                        <p className="text-slate-800 mt-1">
                          It involves analysing compressors, air distribution lines, storage tanks, valves, dryers, and end-use equipment. The main purpose is to measure air demand, detect leakages, check pressure drops, and evaluate operating patterns.
                        </p>
                        <p className="text-slate-800 mt-1">
                          By doing this, we can highlight unnecessary energy consumption, calculate the financial loss, and suggest corrective measures for improving system reliability and reducing operating costs.
                        </p>
                        <p className="text-slate-800 mt-1">
                          In short, a compressed air audit helps customers save energy, lower production costs, and ensure a more reliable and sustainable operation.
                        </p>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-slate-100">
                        <p className="text-slate-800">
                          A Compressed Air Audit is like a health check-up for your compressed air system. It helps identify hidden leaks, pressure losses, and inefficient operations that quietly increase your power bills.
                        </p>
                        <p className="text-slate-800">
                          With our audit, we can show you exactly where your system is wasting energy and how much money you can save by fixing it.
                        </p>
                        <p className="text-slate-800">
                          Many industries reduce their compressor power cost by 20–30% after an audit, while also improving reliability and productivity. This is a fast-return investment that directly lowers your operating cost.
                        </p>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-slate-100">
                        <h4 className="font-bold text-slate-950 text-xs">
                          Compressed Air Audit Includes:
                        </h4>
                        <p className="text-slate-800"><strong>Phase-1:</strong> Collecting data, Savings Calculation &amp; Documentation (Completed)</p>
                        <p className="text-slate-800"><strong>Phase-2:</strong> Implementing the scopes of identified in the Phase-1</p>
                      </div>
                    </div>
                  ) : isAshraeLevel2 ? (
                    <div className="space-y-1.5 text-slate-900 text-left font-normal" style={{ fontSize: '8.5px', lineHeight: '1.35' }}>
                      <div>
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-xs mb-1">
                          Scope of Work:
                        </h3>
                        <p className="font-semibold text-slate-900 mb-1">
                          The objective of this study is to perform a detailed energy audit in accordance with ASHRAE Level 2 guidelines along with district cooling bill analysis to identify energy saving and cost optimization opportunities.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div>
                          <p className="font-bold text-slate-950">Data Collection and Review</p>
                          <p className="text-slate-800">The audit team will collect the last 12 months of electricity bills and district cooling bills for detailed analysis.</p>
                          <p className="text-slate-800">The team will gather building-related information such as total built-up area, occupancy pattern, and operating hours.</p>
                          <p className="text-slate-800">The inventory of major equipment including AHUs, FCUs, pumps, heat exchangers, lighting systems, and transformers will be compiled.</p>
                          <p className="text-slate-800">All available technical documents such as single line diagrams, HVAC schematics, and operation manuals will be reviewed to understand system configuration.</p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-950">Electricity Bill Analysis</p>
                          <p className="text-slate-800">The electricity bills will be analyzed to study monthly energy consumption, maximum demand, and power factor trends.</p>
                          <p className="text-slate-800">The analysis will identify demand peaks, penalties, and opportunities for tariff optimization.</p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-950">District Cooling Bill Analysis</p>
                          <p className="text-slate-800">The district cooling billing structure will be reviewed to understand fixed and variable components of the bill.</p>
                          <p className="text-slate-800">The study will analyze monthly TRh consumption trends and compare them with contracted TR capacity.</p>
                          <p className="text-slate-800">The assessment will identify any over-contracting or underutilization of cooling capacity.</p>
                          <p className="text-slate-800">The billed consumption will be validated against actual usage to identify discrepancies or overbilling issues.</p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-950">CDD-Based Consumption Analysis</p>
                          <p className="text-slate-800">Cooling Degree Days will be used to normalize cooling consumption and eliminate the impact of weather variations.</p>
                          <p className="text-slate-800">The study will establish correlation between CDD and cooling energy consumption to identify abnormal performance trends.</p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-950">AHU Performance Assessment</p>
                          <p className="text-slate-800">Air Handling Units will be evaluated on a sampling basis covering approximately 20% to 30% of total units. The selection of AHUs will be based on capacity, location, and operational diversity.</p>
                          <p className="text-slate-800">Where measurement provision is available, airflow, temperature, humidity, and static pressure will be measured. The analysis will assess cooling coil performance, fan efficiency, and filter pressure drop.</p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-950">FCU and Terminal Equipment Assessment</p>
                          <p className="text-slate-800">Fan Coil Units and other terminal equipment will be assessed to evaluate temperature control and valve operation. The study will identify issues such as overcooling, improper control, and inefficient operation.</p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-950">Pump Performance Study</p>
                          <p className="text-slate-800">Pump systems will be analyzed on a sampling basis covering approximately 20% to 30% of total pumps. Flow rate, head, and power consumption will be measured to calculate pump efficiency. The analysis will identify inefficiencies such as oversizing, throttling losses, and potential for VFD implementation.</p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-950">Heat Exchanger Efficiency Evaluation &amp; Heat Pump / Boiler Assessment</p>
                          <p className="text-slate-800">Heat exchangers will be assessed by measuring inlet and outlet temperatures and flow rates to identify degradation due to fouling or scaling. Heat pump / boiler systems will be evaluated under operating conditions to identify optimization and waste heat recovery.</p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-950">Lighting, Electrical System &amp; Power Quality Study</p>
                          <p className="text-slate-800">Lux level measurements across retail spaces, corridors, and parking areas compared with standards for LED retrofits. Transformer performance and power quality harmonics, phase imbalance, and system losses.</p>
                        </div>

                        <div>
                          <p className="font-bold text-slate-950">Measurement, Instrumentation, ECMs &amp; Deliverables</p>
                          <p className="text-slate-800">Measurements via calibrated power analyzers, flow meters, anemometers, temperature sensors, and lux meters. Categorized low/medium/high cost ECMs with payback periods and benchmarking (kW/TR, TRh/m²). Detailed audit report along with district cooling analysis, graphical trends, CDD correlation, and executive summary.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3
                        className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                        style={{ fontSize: '16px' }}
                      >
                        1. Scope of Work &amp; Engineering Assessment:
                      </h3>
                      <p className="text-[10px] text-slate-800 leading-tight font-medium">
                        The Energy Audit evaluates the overall energy performance of the plant across electrical, thermal, process, and utility systems to identify actionable cost reduction, performance improvement, and sustainability opportunities.
                      </p>

                      <div className="space-y-1.5 pt-0.5 text-slate-800 text-[10px] leading-tight">
                        {/* 1. Production and Process Systems */}
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-950 text-[10.5px]">1. Production &amp; Process Systems</p>
                          <ul className="space-y-0.5 pl-3 text-slate-800 font-normal">
                            <li>• Specific energy consumption (kWh/unit of production), shift operations, and loading profiles.</li>
                            <li>• Performance assessment of Induction Electrical Heaters, Heating Systems, and EOT Cranes to eliminate wastage.</li>
                            <li>• Observation of idle run hours, no-load losses, and equipment scheduling optimization.</li>
                          </ul>
                        </div>

                        {/* 2. Electrical Energy Distribution System */}
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-950 text-[10.5px]">2. Electrical Energy Distribution &amp; Power Quality</p>
                          <ul className="space-y-0.5 pl-3 text-slate-800 font-normal">
                            <li>• Transformer Performance: Loading patterns, power factor, voltage unbalance, and temperature rise.</li>
                            <li>• Power Quality: Harmonics analysis, voltage imbalance, reactive power flow, and APFC capacitor bank adequacy.</li>
                          </ul>
                        </div>

                        {/* 3. Compressed Air System */}
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-950 text-[10.5px]">3. Compressed Air System &amp; Ultrasonic Leakage Survey</p>
                          <ul className="space-y-0.5 pl-3 text-slate-800 font-normal">
                            <li>• Free Air Delivery (FAD), discharge pressure, power consumption, operating efficiency, and header pressure drops.</li>
                            <li>• Ultrasonic leak detection and quantification with physical unique ID tagging labels for structured rectification.</li>
                          </ul>
                        </div>

                        {/* 4. Lighting, DG & HVAC Systems */}
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-950 text-[10.5px]">4. Lighting, DG &amp; HVAC Split Units</p>
                          <ul className="space-y-0.5 pl-3 text-slate-800 font-normal">
                            <li>• Lux survey vs IS standards, LED retrofits, DG specific fuel consumption (L/kWh) and exhaust heat recovery.</li>
                            <li>• Split units cooling capacity, COP calculation, temperature setpoint optimization, and load balancing.</li>
                          </ul>
                        </div>

                        {/* 5. Pumps, Water Systems & Waste Heat Recovery */}
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-950 text-[10.5px]">5. Pumps, Water Systems &amp; Waste Heat Recovery</p>
                          <ul className="space-y-0.5 pl-3 text-slate-800 font-normal">
                            <li>• Borewell, WTP, RO, and STP pump efficiency, throttling loss identification, and VFD integration potential.</li>
                            <li>• Quantification of recoverable heat from DG exhaust, compressor after-coolers, and condensate return units.</li>
                          </ul>
                        </div>

                        {/* 6. Comprehensive Water Audit Scope */}
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-950 text-[10.5px]">6. Comprehensive Water Audit Scope</p>
                          <ul className="space-y-0.5 pl-3 text-slate-800 font-normal">
                            <li>• Ultrasonic mass balance, baseline water mapping for process &amp; domestic usage, pressure/quality measurements.</li>
                            <li>• Water balance charts, wastewater treatment &amp; recycling strategies for high reuse and water neutrality.</li>
                          </ul>
                        </div>

                        {/* 7. EnPIs, ENCON & Reporting */}
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-950 text-[10.5px]">7. EnPIs, Benchmarking, Prioritized ENCON Measures &amp; Reporting</p>
                          <ul className="space-y-0.5 pl-3 text-slate-800 font-normal">
                            <li>• System-wise Energy Performance Indicators, industry benchmarking, and prioritized ECMs with ROI and payback period.</li>
                            <li>• Comprehensive audit report, backup calculation sheets, measurement trends, and final executive presentation.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
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
          {!isCompressorAirLeakageRectification && (
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
                        {isEnergyAudit ? 'Assessment Methodology & Technical Overview' : 'Detailed Scope of Work & Solution Deliverables'}
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

                  {isCompressorAirLeakageAudit ? (
                    /* Compressor Air Leakage Audit Page 3: Side-by-side leaking money graphic + hissing quote, Benefits, 3 Phases & Phase 2/3 details */
                    <div
                      className="space-y-2 text-slate-900 text-left font-normal"
                      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", fontSize: '10.5px', lineHeight: '1.4' }}
                    >
                      {/* Top Section: Leaking Pipe Image on Left + Hissing Sound Text on Right */}
                      <div className="grid grid-cols-12 gap-3 items-center bg-slate-50/50 p-2 rounded-xl border border-slate-200/80">
                        <div className="col-span-6 flex justify-center items-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/compress ai1.png"
                            alt="Compressed Air Wasting Money"
                            className="w-full h-auto max-h-[110px] object-contain rounded-lg"
                          />
                        </div>
                        <div className="col-span-6 space-y-1">
                          <p className="text-slate-900 font-medium leading-relaxed text-[11px]">
                            Every hissing sound you hear in your plant is not just air — it’s your money leaking out. A small investment in leak detection and repair will save you <span className="underline font-semibold decoration-amber-500">lakhs of rupees</span> every year.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-0.5 pt-1 border-t border-slate-100">
                        <h3 className="font-bold text-slate-950 text-xs mb-0.5">
                          Benefits of Compressed Air Audit:
                        </h3>
                        <ul className="pl-4 text-slate-800 space-y-0.5 list-disc text-[10px]">
                          <li>Reduce artificial air demand</li>
                          <li>Operate compressors at high efficiency</li>
                          <li>Reduce the losses in filters, dryers</li>
                          <li>Know the actual air delivered by the compressor against design value</li>
                          <li>Find out the volume of air leakage in the plant</li>
                          <li>Identification of air leakage spots in the plant</li>
                          <li>Compressed air cost is recovered through reduced system costs over a short period.</li>
                        </ul>
                      </div>

                      <div className="space-y-0.5 pt-1 border-t border-slate-100">
                        <h3 className="font-bold text-slate-950 text-xs mb-0.5">
                          Compressed Air Audit Includes:
                        </h3>
                        <div className="pl-1 space-y-0.5 text-[10px] text-slate-800">
                          <p className="flex items-start gap-1"><span className="text-slate-900 font-bold">•</span> <span><strong>Phase-1:</strong> Collecting data, Savings Calculation &amp; Documentation</span></p>
                          <p className="flex items-start gap-1"><span className="text-slate-900 font-bold">•</span> <span><strong>Phase-2:</strong> Implementing the scopes of identified in the Phase-1 (By Customer Preference)</span></p>
                          <p className="flex items-start gap-1"><span className="text-slate-900 font-bold">•</span> <span><strong>Phase-3:</strong> Implementation Validation</span></p>
                        </div>
                      </div>

                      <div className="space-y-0.5 pt-1 border-t border-slate-100">
                        <h4 className="font-bold text-slate-950 text-xs">
                          Phase-2 Implementing the scopes of identified in the Phase-1 (By Customer Preference):
                        </h4>
                        <p className="text-slate-800 text-[10px] leading-relaxed">
                          Correcting air leakages and addressing other compressed air optimization opportunities are among the most effective ways to prove tangible savings to customers. Once leaks are repaired, and improvements such as pressure optimization, proper compressor sequencing, or storage enhancement are implemented, the results can be validated through energy meters or flow data. By comparing the baseline measurements with post-implementation readings, the reduction in power consumption or compressed air demand becomes evident. Supplying required materials and spares during implementation ensures timely execution, smooth operation, and sustainability.
                        </p>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-slate-100">
                        <h4 className="font-bold text-slate-950 text-xs">
                          Phase-3 Implementation Validation:
                        </h4>
                        <p className="text-slate-800 text-[10px] leading-relaxed">
                          Implementation Validation ensures that recommended energy conservation measures and rectification works in the compressed air system are executed as planned and deliver expected results by re-measuring system parameters and comparing with baseline data.
                        </p>
                        <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-950 p-1 shadow-2xs mt-0.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/compresd6.png"
                            alt="Ultrasonic Leakage Arresting Validation"
                            className="w-full h-auto max-h-[135px] object-contain mx-auto"
                          />
                        </div>
                      </div>
                    </div>
                  ) : isWeldDataDigitalized ? (
                    /* Weld Data Digitalized Page 3: Key Features, Timeline & Deliverables (Clean Document Format - Row Wise) */
                    <div className="space-y-3 text-slate-800">
                      {/* Key Features Heading */}
                      <div className="space-y-1">
                        <h3
                          className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                          style={{ fontSize: '16px' }}
                        >
                          Key Features:
                        </h3>
                        <div className="space-y-1 text-[11px] leading-snug pl-1">
                          <p>• <strong>Joint-Wise and Part-Wise Weld Tracking:</strong> Accurately capture, monitor, and trace welding data based on specific joints and parts across all stages for full traceability.</p>
                          <p>• <strong>Multi-Stage Input System (Up to 5 Process Stages):</strong> Allows structured data entry for up to five welding process stages, improving traceability, accountability, and process control.</p>
                          <p>• <strong>Equipment Tracking by ID and Process Stage:</strong> Monitor welding equipment usage, condition, and association with specific process stages using unique identifiers.</p>
                          <p>• <strong>Integrated Preheating, NDT, Parameter Logging, and Defect Mapping:</strong> Seamlessly log critical welding parameters such as preheating status, voltage, current, NDT results, inspection date/time, along with capturing defect locations through defect mapping.</p>
                          <p>• <strong>Defect Heat Mapping Visualization:</strong> Visual heat maps highlight areas with high defect concentrations, enabling faster root cause analysis and prioritization of corrective actions.</p>
                          <p>• <strong>Smart Alerts and Notifications:</strong> Receive customizable real-time alerts for process delays (e.g., blasting time exceeded) and quality deviations, including optional email notifications.</p>
                          <p>• <strong>Advanced Filters for Data Querying:</strong> Apply powerful dynamic filters to quickly review weld history, current status, defect trends, equipment usage, and inspection outcomes.</p>
                          <p>• <strong>AI-Powered Dashboards &amp; Reporting:</strong> Generate intuitive visual reports using AI-driven tools—trendlines, Pareto charts, pie charts, and more—to drive clear insights and continuous process improvement.</p>
                        </div>
                      </div>

                      {/* Timeline Estimate */}
                      <div className="space-y-1 pt-1 border-t border-slate-100">
                        <h3
                          className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                          style={{ fontSize: '15px' }}
                        >
                          Timeline Estimate:
                        </h3>
                        <ul className="pl-4 space-y-0.5 text-[11px] text-slate-800 leading-snug">
                          <li>● <strong>UI/UX Design :</strong> 6 weeks</li>
                          <li>● <strong>Development (All Features):</strong> 4 weeks</li>
                          <li>● <strong>Testing &amp; QA :</strong> 2 weeks</li>
                          <li>● <strong>Deployment &amp; Training :</strong> 2 week</li>
                          <li>● <strong>Total :</strong> 14 weeks</li>
                        </ul>
                      </div>

                      {/* Deliverables */}
                      <div className="space-y-1 pt-1 border-t border-slate-100">
                        <h3
                          className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                          style={{ fontSize: '15px' }}
                        >
                          Deliverables:
                        </h3>
                        <ul className="pl-4 space-y-0.5 text-[11px] text-slate-800 leading-snug">
                          <li>● Complete mobile app (Android and Web)</li>
                          <li>● Source code and Firebase configuration</li>
                          <li>● Deployment to Play Store (if required)</li>
                          <li>● User manual and technical documentation</li>
                          <li>● One year of basic support and updates</li>
                        </ul>
                      </div>
                    </div>
                  ) : isWeldingIot ? (
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
                  ) : isHvacDesign ? (
                    /* HVAC Design Page 3: Key Deliverables & List of Customers (Row-wise, no boxes) */
                    <div
                      className="space-y-4 text-left font-normal"
                      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", fontSize: '12px', lineHeight: '1.6' }}
                    >
                      <div>
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight text-sm mb-2">
                          Key Deliverables:
                        </h3>
                        <div className="space-y-2 text-[12px] text-slate-800">
                          <p>• <strong>Cooling Tower and Distribution System Sizing Report:</strong> Heat duty calculations, approach temperature, and LMTD analysis.</p>
                          <p>• <strong>Process Flow Diagram (PFD) / P&amp;ID:</strong> Representation of cooling tower, basin, pumps, piping, valves, and water treatment system.</p>
                          <p>• <strong>Pump &amp; Piping Hydraulic Calculations:</strong> Including head loss, flow balance, and duty curves.</p>
                          <p>• <strong>CAPEX / OPEX Estimates:</strong> Comparative cost evaluation for proposed systems.</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200">
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight text-sm mb-2">
                          List of Customers:
                        </h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11.5px] text-slate-800">
                          <p>1. Aatral Engineering</p>
                          <p>2. Velmurugan Heavy Engineering Industries Private Limited</p>
                          <p>3. 20cube Logistics Solutions Private Limited</p>
                          <p>4. Danfoss Industries Private Limited</p>
                          <p>5. Knowledge Bridge</p>
                          <p>6. S G Snacks India Pvt. Ltd.</p>
                          <p>7. 20cube Logistics Solutions Private Limited</p>
                          <p>8. Parekhplast India Limited</p>
                          <p>9. PMEL Oragadam Private Limited -Unit 3</p>
                          <p>10. PMEL Oragadam Private Limited -Unit 4</p>
                          <p>11. Lucas Tvs Limited-Padi</p>
                          <p>12. Visalam Technologies LLP</p>
                          <p>13. Adspaas Polymer Solutions Limited</p>
                          <p>14. Wheels India Limited</p>
                          <p>15. India Metal One Steel Plate Processing Pvt. Ltd</p>
                          <p>16. India Metal One Steel Plate Processing Pvt. Ltd</p>
                          <p>17. Glow guard (A Unit Of Green Pearl Engineering Construction Corporation Pvt Ltd)</p>
                          <p>18. Aisan Auto Parts India Private Limited</p>
                          <p>19. India Metal One Steel Plate Processing Pvt. Ltd</p>
                          <p>20. Whirlpool of India Limited</p>
                          <p>21. ITC -Medak Ltd</p>
                          <p>22. Kone Elevator India Private Limited</p>
                          <p>23. KPR Mill Limited</p>
                          <p>24. Arni Engineerig Tech Private Ltd</p>
                          <p>25. Growserve Enterprises-Ashirwad</p>
                          <p>26. Vashi Integrated Solution Limited</p>
                          <p>27. Development Environergy Services Limited -IIT Hyderabad</p>
                        </div>
                      </div>
                    </div>
                  ) : (isAshraeLevel2 || isEcFan) ? (
                    /* ASHRAE Level 2 & EC Fan Page 3: Team Expertise's & Other Costumers (Row-wise, no boxes) */
                    <div
                      className="space-y-4 text-left font-normal"
                      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", fontSize: '12px', lineHeight: '1.6' }}
                    >
                      <div>
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight text-sm mb-2">
                          Team Expertise’s
                        </h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[10.5px] text-slate-800">
                          <p>1. Mazaya Business Avenue ,Dubai</p>
                          <p>2. ASHRAE Level 2 audit at 6 Commercial Building ,Dubai</p>
                          <p>3. Danat Al Emarat Hospital , Dubai by Aatral</p>
                          <p>4. Capital Land by orien Energy</p>
                          <p>5. Casagrand Eco tech ,Sollinganallur</p>
                          <p>6. Tidal Park ,Pattabiram</p>
                          <p>7. TNQ software Tharamani,</p>
                          <p>8. Embassy Tech village Kadu bisenahalli Bengaluru</p>
                          <p>9. Embassy ETZ pune</p>
                          <p>10. First source Limited Vijayawada</p>
                          <p>11. First source Limited ,Hyderabad</p>
                          <p>12. First source Limited Chennai</p>
                          <p>13. Valeo software Sholinganallur</p>
                          <p>14. Soildpro ,Chennai</p>
                          <p>15. SRM University Chennai</p>
                          <p>16. Development Environergy Services Limited -IIT Hyderabad</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200">
                        <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight text-sm mb-2">
                          Other Costumers:
                        </h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[10px] text-slate-800">
                          <p>17. Aatral Engineering</p>
                          <p>18. Velmurugan Heavy Engineering Industries Private Limited</p>
                          <p>19. 20cube Logistics Solutions Private Limited</p>
                          <p>20. Danfoss Industries Private Limited</p>
                          <p>21. Knowledge Bridge</p>
                          <p>22. S G Snacks India Pvt. Ltd.</p>
                          <p>23. 20cube Logistics Solutions Private Limited</p>
                          <p>24. Parekhplast India Limited</p>
                          <p>25. PMEL Oragadam Private Limited -Unit 3 &amp; 4</p>
                          <p>26. Lucas Tvs Limited-Padi</p>
                          <p>27. Visalam Technologies LLP</p>
                          <p>28. Adspaas Polymer Solutions Limited</p>
                          <p>29. Wheels India Limited</p>
                          <p>30. India Metal One Steel Plate Processing Pvt. Ltd</p>
                          <p>31. Aisan Auto Parts India Private Limited</p>
                          <p>32. Whirlpool of India Limited</p>
                          <p>33. ITC -Medak Ltd</p>
                          <p>34. Kone Elevator India Private Limited</p>
                          <p>35. KPR Mill Limited</p>
                          <p>36. Concorde Textiles ltd</p>
                          <p>37. Arni Engineerig Tech Private Ltd</p>
                          <p>38. Growserve Enterprises-Ashirwad</p>
                          <p>39. Vashi Integrated Solution Limited</p>
                          <p>40. Ahlstrom Fiber composite Pvt Ltd</p>
                        </div>
                      </div>
                    </div>
                  ) : isEnergyAudit ? (
                    /* Energy Audit Page 3: Deliverables & Client Track Record (27 Reference Clients) */
                    <div className="space-y-3">
                      {/* Deliverables */}
                      <div className="space-y-1">
                        <h3
                          className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                          style={{ fontSize: '15px' }}
                        >
                          2. Key Deliverables:
                        </h3>
                        <p className="text-[9.5px] text-slate-600 font-medium">
                          The following structured engineering deliverables will be provided for both Energy and Water Audits:
                        </p>
                        <ol className="space-y-0.5 pl-4 list-decimal text-[9.5px] text-slate-800 font-medium">
                          <li><strong className="text-slate-950">Data Collection Format:</strong> Structured data sheets for system-wise field measurement.</li>
                          <li><strong className="text-slate-950">Opening Meeting Presentation:</strong> Kick-off presentation outlining objectives, scope, and methodology.</li>
                          <li><strong className="text-slate-950">Preliminary Findings / Closing Presentation:</strong> Summary of key observations and immediate opportunities.</li>
                          <li><strong className="text-slate-950">Detailed Audit Report:</strong> Comprehensive report covering observations, engineering analysis, and ECMs.</li>
                          <li><strong className="text-slate-950">Backup Calculation Files:</strong> Excel files with system-wise energy &amp; water balance, efficiency, and savings.</li>
                          <li><strong className="text-slate-950">Comprehensive Water Assessment Report:</strong> Baseline water mapping, flow/pressure/quality, leakage loss, water balance charts, and high-recycling tech recommendations.</li>
                          <li><strong className="text-slate-950">Implementation &amp; Best Practices Guide:</strong> Actionable roadmap for water neutrality, case studies, and conservation.</li>
                        </ol>
                      </div>

                      {/* 27 Client Credentials Grid */}
                      <div className="space-y-1 pt-1 border-t border-slate-200">
                        <h3
                          className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                          style={{ fontSize: '15px' }}
                        >
                          3. Proven Track Record &amp; Reference Clients:
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pt-0.5 text-[9px]">
                          {ENERGY_AUDIT_TRACK_RECORD_CLIENTS.map((client, idx) => (
                            <div
                              key={idx}
                              className="p-1 px-1.5 bg-slate-50 border border-slate-200/80 rounded-md flex items-center gap-1 shadow-2xs"
                            >
                              <span className="h-3.5 w-3.5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[7.5px] shrink-0">
                                {idx + 1}
                              </span>
                              <span className="font-semibold text-slate-800 truncate" title={client}>
                                {client}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-2 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-0.5 mt-1">
                        <p className="text-[9.5px] font-bold text-emerald-950 uppercase tracking-wider">
                          Key Audit Competencies &amp; Instrumentation
                        </p>
                        <p className="text-[9px] text-emerald-900 leading-tight">
                          Equipped with calibrated Class-A Power Quality Analyzers, Ultrasonic Flowmeters, Ultrasonic Acoustic Leak Detectors, Thermal Imaging Cameras, Anemometers, and Flue Gas Analyzers meeting ASHRAE, ISO 50001, and BEE standards.
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
          )}

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* COMPRESSOR AIR LEAKAGE AUDIT PAGE 4: OTHER AUDIT SERVICES (FAD & DEMAND FLOW) */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {isCompressorAirLeakageAudit && (
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
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Other Audit Services &amp; Measurement Methodologies
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

                  <div
                    className="space-y-2.5 text-slate-900 text-left font-normal"
                    style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", fontSize: '10.5px', lineHeight: '1.4' }}
                  >
                    <h3 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-sm mb-1">
                      Other Audit Services:
                    </h3>

                    {/* 1. Compressor Efficiency (FAD) */}
                    <div className="space-y-1 p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl">
                      <h4 className="font-bold text-slate-950 text-xs">
                        Compressor Efficiency (FAD):
                      </h4>
                      <p className="text-slate-800 text-[10px] leading-relaxed">
                        A Compressor Efficiency Study is as if an energy audit focused only on your air compressors. It helps you understand how efficiently your compressors are converting electricity into usable compressed air. In many plants, compressors consume up to 20–30% of total electricity, but often operate below optimal efficiency due to:
                      </p>
                      <ul className="pl-5 py-0.5 text-slate-800 space-y-0.5 list-disc text-[10px]">
                        <li>wrong sizing</li>
                        <li>poor controls</li>
                        <li>pressure drops</li>
                        <li>Leakages.</li>
                      </ul>
                      <p className="text-slate-800 text-[10px] leading-relaxed">
                        During the study, we measure actual power consumption, flow (CFM), pressure levels, and operating patterns. From this data, we calculate the specific power (kW per CFM), which is the true indicator of compressor efficiency. By comparing this with industry benchmarks, we can show you how much extra energy (and money) your system is consuming.
                      </p>
                      <p className="text-slate-800 text-[10px] leading-relaxed">
                        The outcome is a clear set of recommendations such as <strong>right-sizing compressors, optimizing load/unload cycles, reducing pressure band, and fixing leaks</strong>, which lead to lower energy bills, reduced maintenance, and more reliable compressed air supply.
                      </p>

                      <div className="rounded-lg border border-slate-200 overflow-hidden bg-white p-1 shadow-2xs mt-0.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/compred5.png"
                          alt="Compressor Efficiency FAD Flow Meter Position"
                          className="w-full h-auto max-h-[85px] object-contain mx-auto"
                        />
                      </div>
                    </div>

                    {/* 2. Demand Flow Measurement */}
                    <div className="space-y-1 p-2.5 bg-slate-50/70 border border-slate-200 rounded-xl">
                      <h4 className="font-bold text-slate-950 text-xs">
                        Demand Flow Measurement:
                      </h4>
                      <p className="text-slate-800 text-[10px] leading-relaxed">
                        Demand Flow Measurement is the process of accurately measuring how much compressed air is actually being consumed by the plant at different times of the day. It is done using a flow meter installed in the pipeline. This data helps identify the true air requirement of the plant, instead of relying only on compressor capacity.
                      </p>
                      <div className="space-y-0.5 pl-1 text-[10px] text-slate-800">
                        <p>• <strong>Right-sizing compressors:</strong> Often, plants run oversized compressors, wasting electricity. Flow data shows the actual demand so you can optimize.</p>
                        <p>• <strong>Leak detection:</strong> By measuring flow during non-production hours, leaks can be quantified in terms of CFM and cost.</p>
                        <p>• <strong>Energy savings:</strong> With clear demand patterns, compressors can be operated efficiently, saving up to 20–30% of power cost.</p>
                      </div>

                      <div className="rounded-lg border border-slate-200 overflow-hidden bg-white p-1 shadow-2xs mt-0.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/compresed4.png"
                          alt="Demand Flow Measurement Meter Position"
                          className="w-full h-auto max-h-[85px] object-contain mx-auto"
                        />
                      </div>
                    </div>
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
          )}

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* DOCUMENT PAGE: SCOPE OF WORK (FOR COMPRESSOR AUDIT IT IS PAGE 5,   */}
          {/* FOR STANDARD ENERGY AUDIT / IOT IT IS PAGE 4)                     */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          {!isCompressorAirLeakageRectification && !isEcFan && (
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
                        {isCompressorAirLeakageAudit ? 'Detailed Scope of Work & Detection Methodology' : 'Commercial Investment & Pricing Breakdown'}
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

                  {/* Step 4 / Scope Header */}
                  <div className="space-y-4">
                    <h3
                      className="font-bold text-slate-900 underline underline-offset-4 decoration-2 decoration-slate-900 tracking-tight"
                      style={{ fontSize: '18px' }}
                    >
                      {isCompressorAirLeakageAudit
                        ? 'Scope of Work:'
                        : isCompressorAirLeakageRectification
                          ? 'Cost Estimate:'
                          : isWeldDataDigitalized
                            ? 'Step 4: Commercial Breakdown — Fusionbyte – WeldWise Suite'
                            : isWaterManagement
                              ? 'Step 4: Commercial Breakdown — IoT & Controls / Water Management Solution'
                              : isWeldingIot
                                ? 'Step 4: Commercial Breakdown — IoT & Controls / Welding IoT'
                                : isBms
                                  ? 'Step 4: Commercial Breakdown — Building Management System (BMS)'
                                  : isIotOrControls
                                    ? `Step 4: Commercial Breakdown — IoT & Controls / ${deal?.service?.name || 'Energy Management Solution'}`
                                    : '3. Cost Estimate & Commercial Investment Breakdown:'}
                    </h3>

                    {isCompressorAirLeakageAudit ? (
                      <div
                        className="space-y-2.5 text-slate-900 text-left font-normal"
                        style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", fontSize: '10.5px', lineHeight: '1.4' }}
                      >
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-950 text-xs mb-1">
                            Leakage Identification:
                          </h4>
                          <div className="space-y-1 text-slate-800 text-[10.5px]">
                            <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span> <span>Leakage identification and tagging is a systematic approach to controlling compressed air losses.</span></p>
                            <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span> <span>During an audit, each leakage point is detected using ultrasonic detectors and then physically tagged with a unique identification label.</span></p>
                            <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span> <span>This tagging ensures that every leak location is documented, prioritized, and can be easily tracked for repair.</span></p>
                            <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span> <span>By tagging each leak point, plants gain a clear action plan for maintenance teams, enabling them to fix the leaks in a structured way instead of random patchwork.</span></p>
                            <p className="flex items-start gap-1.5"><span className="text-slate-900 font-bold">•</span> <span>This process not only quantifies the cost of each leakage but also helps in monitoring recurring problem areas, ensuring long-term energy savings and reliable system performance.</span></p>
                          </div>
                        </div>

                        {/* 2 Middle Images Side-by-Side: Screen readout & Physical Tag */}
                        <div className="pt-1">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white p-1 shadow-2xs">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="/compressed air leakage .png"
                                alt="Ultrasonic Leak Detection Readout Screen"
                                className="w-full h-[120px] object-contain rounded"
                              />
                            </div>
                            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white p-1 shadow-2xs">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="/compressed 3.png"
                                alt="Physical Leak Tagging Label"
                                className="w-full h-[120px] object-contain rounded"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Detector Overview */}
                        <div className="space-y-1 pt-1.5 border-t border-slate-100">
                          <h4 className="font-bold text-slate-950 text-xs mb-1">
                            Our Leakage Detector Overview:
                          </h4>
                          <div className="space-y-0.5 text-[10px] text-slate-800">
                            <p className="flex items-start gap-1.5">
                              <span className="text-slate-900 font-bold">▪</span>
                              <span><strong>Leak Detection Principle –</strong> Identifies high-frequency ultrasonic sound waves generated when compressed air, gas, or vacuum escapes through small openings.</span>
                            </p>
                            <p className="flex items-start gap-1.5">
                              <span className="text-slate-900 font-bold">▪</span>
                              <span><strong>Frequency Range –</strong> Typically operates between 20 kHz to 100 kHz, beyond the range of human hearing.</span>
                            </p>
                            <p className="flex items-start gap-1.5">
                              <span className="text-slate-900 font-bold">▪</span>
                              <span><strong>Detection Capability –</strong> Can locate very small leaks (as small as 0.05 mm at ~7 bar) from several meters away.</span>
                            </p>
                            <p className="flex items-start gap-1.5">
                              <span className="text-slate-900 font-bold">▪</span>
                              <span><strong>Feedback System –</strong> Provides both audio (headphones) and visual (display or LED bar graph) indications to pinpoint leaks.</span>
                            </p>
                            <p className="flex items-start gap-1.5">
                              <span className="text-slate-900 font-bold">▪</span>
                              <span><strong>Sensitivity &amp; Adjustability –</strong> Equipped with adjustable sensitivity to distinguish between background noise and actual leak sounds.</span>
                            </p>
                            <p className="flex items-start gap-1.5">
                              <span className="text-slate-900 font-bold">▪</span>
                              <span><strong>Portability &amp; Power –</strong> Lightweight, handheld device powered by rechargeable or replaceable batteries with 6–10 hours’ runtime.</span>
                            </p>
                            <p className="flex items-start gap-1.5">
                              <span className="text-slate-900 font-bold">▪</span>
                              <span><strong>Applications –</strong> Used for compressed air systems, gas pipelines, vacuum systems, steam traps, and refrigerant leak detection without interrupting operations.</span>
                            </p>
                          </div>
                        </div>

                        {/* Centered Bottom Image: Technician with Headphones & Detector Gun */}
                        <div className="pt-1.5 flex justify-center">
                          <div className="rounded-lg border border-slate-200 overflow-hidden bg-white p-1 shadow-2xs max-w-[340px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/compressrd air 2.png"
                              alt="Ultrasonic Leak Detection in Operation"
                              className="w-full h-auto max-h-[145px] object-cover rounded"
                            />
                          </div>
                        </div>
                      </div>
                    ) : isCompressorAirLeakageRectification ? (
                      (() => {
                        const compressorRoi: CompressorRoiData =
                          (proposal as any)?.compressorRoiData ||
                          (quote as any)?.compressorRoiData ||
                          (quote as any)?.costingSheet?.compressorRoiData ||
                          DEFAULT_COMPRESSOR_ROI_DATA;

                        const finalInvestment = quote?.finalQuote ? Number(quote.finalQuote) : compressorRoi.investmentRs;
                        const finalMonthlyLoss = compressorRoi.monthlyLossRs || Math.round(compressorRoi.monthlyKwhLoss * compressorRoi.electricityCostPerKwh);
                        const finalAnnualLoss = compressorRoi.annualLossRs || Math.round(finalMonthlyLoss * 12);
                        const paybackY = finalAnnualLoss > 0 ? (finalInvestment / finalAnnualLoss).toFixed(2) : '0.27';
                        const paybackM = finalMonthlyLoss > 0 ? Math.round(finalInvestment / finalMonthlyLoss) : 3;

                        return (
                          <div className="space-y-5 text-left">
                            {/* Scope Description Table */}
                            <div className="border border-slate-900 rounded-lg overflow-hidden text-xs">
                              <table className="w-full text-left">
                                <thead className="bg-slate-900 text-white font-bold text-xs">
                                  <tr>
                                    <th className="py-2.5 px-3 text-center w-12 border-r border-slate-700">S.No</th>
                                    <th className="py-2.5 px-4 border-r border-slate-700">Scope Description</th>
                                    <th className="py-2.5 px-4 text-center w-28 border-r border-slate-700">Quantity</th>
                                    <th className="py-2.5 px-4 text-right w-36">Total Price in INR</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-slate-800 text-[11px]">
                                  <tr>
                                    <td className="py-3 px-3 text-center font-bold border-r border-slate-200 align-top">1.</td>
                                    <td className="py-3 px-4 border-r border-slate-200">
                                      <p className="font-bold text-slate-950 text-xs">{compressorRoi.phaseTitle || 'PHASE-2'}</p>
                                      <p className="text-slate-800 mt-0.5">{compressorRoi.phaseDesc || 'Air Leakage Rectification at Scopes Identified in the Phase-1 with Materials.'}</p>
                                    </td>
                                    <td className="py-3 px-4 text-center font-medium border-r border-slate-200 align-middle">
                                      {compressorRoi.quantity || '5 Days'}
                                    </td>
                                    <td className="py-3 px-4 text-right font-black text-slate-950 text-sm align-middle">
                                      {formatCurrency(finalInvestment)}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* ROI for Savings Section */}
                            <div className="space-y-3 pt-2">
                              <h4 className="font-bold text-slate-950 underline underline-offset-4 decoration-2 decoration-slate-900 text-base">
                                ROI for Savings:
                              </h4>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Description & Values Table */}
                                <div className="border border-slate-900 rounded-lg overflow-hidden text-xs">
                                  <table className="w-full text-left">
                                    <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900 text-xs">
                                      <tr>
                                        <th className="py-2 px-3 border-r border-slate-300">Description</th>
                                        <th className="py-2 px-3 text-right w-28">Values</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-slate-800 text-[11px]">
                                      <tr>
                                        <td className="py-1.5 px-3 border-r border-slate-200 font-medium">Compressed Air Leak CFM</td>
                                        <td className="py-1.5 px-3 text-right font-bold">{compressorRoi.leakCfm}</td>
                                      </tr>
                                      <tr>
                                        <td className="py-1.5 px-3 border-r border-slate-200 font-medium">Energy Loss due to Leakage (kWh/Month)</td>
                                        <td className="py-1.5 px-3 text-right font-bold">{Number(compressorRoi.monthlyKwhLoss).toLocaleString('en-IN')}</td>
                                      </tr>
                                      <tr>
                                        <td className="py-1.5 px-3 border-r border-slate-200 font-medium">Energy Loss due to Leakage (kWh/Annum)</td>
                                        <td className="py-1.5 px-3 text-right font-bold">{Number(compressorRoi.annualKwhLoss || compressorRoi.monthlyKwhLoss * 12).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                      </tr>
                                      <tr>
                                        <td className="py-1.5 px-3 border-r border-slate-200 font-medium">Electricity Cost (Rs/kWh)</td>
                                        <td className="py-1.5 px-3 text-right font-bold">{Number(compressorRoi.electricityCostPerKwh).toFixed(2)}</td>
                                      </tr>
                                      <tr>
                                        <td className="py-1.5 px-3 border-r border-slate-200 font-medium">Monthly Loss (Rs)</td>
                                        <td className="py-1.5 px-3 text-right font-bold">{Number(finalMonthlyLoss).toLocaleString('en-IN')}</td>
                                      </tr>
                                      <tr>
                                        <td className="py-1.5 px-3 border-r border-slate-200 font-medium">Annual Loss (Rs)</td>
                                        <td className="py-1.5 px-3 text-right font-bold">{Number(finalAnnualLoss).toLocaleString('en-IN')}</td>
                                      </tr>
                                      <tr className="bg-slate-50 font-black text-slate-950">
                                        <td className="py-2 px-3 border-r border-slate-200">Total Annual Recoverable Saving (Rs)</td>
                                        <td className="py-2 px-3 text-right text-emerald-700">{Number(finalAnnualLoss).toLocaleString('en-IN')}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                {/* ROI Calculation Table */}
                                <div className="space-y-3">
                                  <div className="border border-slate-900 rounded-lg overflow-hidden text-xs">
                                    <table className="w-full text-left">
                                      <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900 text-xs">
                                        <tr>
                                          <th className="py-2 px-3 border-r border-slate-300">ROI Calculation</th>
                                          <th className="py-2 px-3 text-right w-28">Values</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-200 text-slate-800 text-[11px]">
                                        <tr>
                                          <td className="py-1.5 px-3 border-r border-slate-200 font-medium">Investment (Rs)</td>
                                          <td className="py-1.5 px-3 text-right font-bold">{Number(finalInvestment).toLocaleString('en-IN')}</td>
                                        </tr>
                                        <tr>
                                          <td className="py-1.5 px-3 border-r border-slate-200 font-medium">Payback Period (Years)</td>
                                          <td className="py-1.5 px-3 text-right font-bold">{paybackY}</td>
                                        </tr>
                                        <tr className="bg-slate-50 font-black text-slate-950">
                                          <td className="py-2 px-3 border-r border-slate-200">Payback Period (Months)</td>
                                          <td className="py-2 px-3 text-right text-emerald-700">{paybackM}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : isWeldDataDigitalized ? (
                      /* Digiweld (Weld Data Digitalized / Phase 3) Commercials Table */
                      (() => {
                        const swCostingRows = (proposal as any)?.costingSheet?.weldingSoftwareRows || INITIAL_DIGIWELD_SOFTWARE_ROWS;
                        const cloudCostingRows = (proposal as any)?.costingSheet?.weldingCloudRows || INITIAL_DIGIWELD_CLOUD_ROWS;

                        const digiweldOneTimeItems = swCostingRows.map((r: any, idx: number) => {
                          const matchedLine = mappedSavedItems.find((m) => m.description?.toLowerCase().includes(r.item?.toLowerCase()));
                          const price = matchedLine ? matchedLine.customerPrice : (Number(r.price) || Number(r.unitPrice * (r.qty || 1)) || 0);
                          const remarks = r.remarks || (r.item?.toLowerCase().includes('conversion') || r.item?.toLowerCase().includes('integration') || r.item?.toLowerCase().includes('checksheet') || r.item?.toLowerCase().includes('files') ? 'Excel to JSON Conversion for Phase 3' : r.item?.toLowerCase().includes('buffer') ? 'Additional Support Activities' : 'New Activity for Phase 3');
                          return {
                            sNo: idx + 1,
                            category: r.item || r.description,
                            remarks,
                            price,
                          };
                        });

                        const digiweldRecurringItems = cloudCostingRows.map((r: any, idx: number) => {
                          const matchedLine = mappedSavedItems.find((m) => m.description?.toLowerCase().includes(r.component?.toLowerCase()));
                          const price = matchedLine ? matchedLine.customerPrice : (Number(r.monthlyPrice) || Number(r.unitMonthlyPrice) || 0);
                          return {
                            sNo: idx + 1,
                            service: r.component || r.description,
                            remarks: r.remarks || 'Existing Infrastructure Enhancement',
                            price,
                          };
                        });

                        const totalOneTime = digiweldOneTimeItems.reduce((acc: number, item: any) => acc + Number(item.price || 0), 0);
                        const totalRecurringMonthly = digiweldRecurringItems.reduce((acc: number, item: any) => acc + Number(item.price || 0), 0);
                        const calculatedTotal = finalProposedValue > 0 ? finalProposedValue : (totalOneTime + (totalRecurringMonthly * 12));

                        return (
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-bold text-slate-950 text-xs uppercase tracking-wider mb-1.5">
                                Commercials:
                              </h4>

                              {/* ONE TIME COST - PHASE 3 */}
                              <div className="space-y-1 mb-2.5">
                                <div className="bg-slate-800 text-white px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-wide rounded-t-lg">
                                  ONE TIME COST - PHASE 3
                                </div>
                                <div className="border border-slate-300 rounded-b-lg overflow-hidden text-[10.5px]">
                                  <table className="w-full text-left">
                                    <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200">
                                      <tr>
                                        <th className="py-1 px-3">Category</th>
                                        <th className="py-1 px-3">Remarks</th>
                                        <th className="py-1 px-3 text-right w-28">Price</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                      {digiweldOneTimeItems.map((row: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-slate-50/50">
                                          <td className="py-0.5 px-3 font-semibold text-slate-900 leading-tight">{row.category}</td>
                                          <td className="py-0.5 px-3 text-slate-600 font-medium">{row.remarks}</td>
                                          <td className="py-0.5 px-3 text-right font-bold text-slate-900">{formatCurrency(row.price)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                    <tfoot className="bg-slate-100 font-black text-slate-900 border-t border-slate-300">
                                      <tr>
                                        <td colSpan={2} className="py-1 px-3 uppercase text-[10px] tracking-wider font-extrabold text-right">
                                          Total One-Time (Phase 3)
                                        </td>
                                        <td className="py-1 px-3 text-right text-emerald-700 font-black">
                                          {formatCurrency(totalOneTime)}
                                        </td>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>
                              </div>

                              {/* RECURRING COST */}
                              <div className="space-y-1">
                                <div className="bg-slate-800 text-white px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-wide rounded-t-lg">
                                  RECURRING COST (MONTHLY INFRASTRUCTURE &amp; SUPPORT)
                                </div>
                                <div className="border border-slate-300 rounded-b-lg overflow-hidden text-[10.5px]">
                                  <table className="w-full text-left">
                                    <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200">
                                      <tr>
                                        <th className="py-1 px-3">Service</th>
                                        <th className="py-1 px-3">Remarks</th>
                                        <th className="py-1 px-3 text-right w-28">Price / Mo</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                      {digiweldRecurringItems.map((row: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-slate-50/50">
                                          <td className="py-0.5 px-3 font-semibold text-slate-900 leading-tight">{row.service}</td>
                                          <td className="py-0.5 px-3 text-slate-600 font-medium">{row.remarks}</td>
                                          <td className="py-0.5 px-3 text-right font-bold text-slate-900">{formatCurrency(row.price)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                    <tfoot className="bg-slate-100 font-black text-slate-900 border-t border-slate-300">
                                      <tr>
                                        <td colSpan={2} className="py-1 px-3 uppercase text-[10px] tracking-wider font-extrabold text-right">
                                          Total Recurring (Monthly)
                                        </td>
                                        <td className="py-1 px-3 text-right text-emerald-700 font-black">
                                          {formatCurrency(totalRecurringMonthly)} / mo
                                        </td>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>
                              </div>

                              {/* TOTAL PROPOSED COMMERCIAL VALUE */}
                              <div className="bg-slate-900 text-white p-2 px-4 flex justify-between items-center font-extrabold text-xs rounded-lg mt-2.5">
                                <span className="tracking-wide uppercase text-[10.5px]">TOTAL PROPOSED COMMERCIAL VALUE (INCL. TAXES)</span>
                                <span className="text-emerald-400 text-sm sm:text-base font-black tracking-tight">
                                  {formatCurrency(calculatedTotal)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : isWeldingIot ? (
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
                                {formatCurrency(finalPrice)}
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <div className="bg-slate-900 text-white p-3.5 px-5 flex justify-between items-center font-extrabold text-xs sm:text-sm">
                          <span className="tracking-wide uppercase text-xs">TOTAL COMMERCIAL INVESTMENT (INCL. ALL EXPENSES)</span>
                          <span className="text-emerald-400 text-base sm:text-lg font-black tracking-tight">
                            {formatCurrency(finalPrice)}
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
                    Page {isCompressorAirLeakageAudit ? '5' : '4'} of {totalPages}
                  </span>
                </div>
              </div>
            </div>
          )}



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
                      {isWeldDataDigitalized ? (
                        <ul
                          className="space-y-1.5 pl-4 text-slate-800 font-normal text-left"
                          style={{ fontSize: '12px', lineHeight: '1.65' }}
                        >
                          <li className="flex items-start gap-2">
                            <span className="font-bold text-slate-900">•</span>
                            <span>SPOC (Single point of Contact) from the client’s team is required to coordinate and facilitate smooth implementation, testing, and ongoing support for the system.</span>
                          </li>
                        </ul>
                      ) : isWeldingIot ? (
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
                  {isWeldDataDigitalized ? (
                    <div
                      className="space-y-2 text-slate-800 font-normal text-left"
                      style={{ fontSize: '11.5px', lineHeight: '1.6' }}
                    >
                      <ol className="space-y-1.5 pl-4 list-decimal text-slate-800">
                        <li>
                          <strong>Payment schedule:</strong>
                          <ul className="pl-4 mt-0.5 space-y-0.5 list-disc text-slate-700">
                            <li>40% advance against the Purchase Order (PO)</li>
                            <li>40% upon completion of the Proof of Concept (PoC) period</li>
                            <li>20% one month after full implementation and successful handover</li>
                          </ul>
                        </li>
                        <li>Applicable taxes and duties will be extra</li>
                        <li>Boarding and Travel Expenses are inclusive of the cost mentioned above</li>
                        <li>Sustainabyte Technologies Pvt. Ltd. is committed to maintaining the confidentiality and security of all customer data. Appropriate measures will be taken to prevent unauthorized access or data loss.</li>
                        <li>In case of any data breach due to negligence, the company shall be legally accountable.</li>
                      </ol>
                    </div>
                  ) : isWeldingIot ? (
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
                  ) : isCompressorAirLeakageAudit ? (
                    <div
                      className="space-y-3 text-slate-800 font-normal text-left"
                      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", fontSize: '12px', lineHeight: '1.55' }}
                    >
                      {/* Cost Estimate Summary Table */}
                      <div className="border border-slate-900 rounded-lg overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-900 text-white font-bold text-xs">
                            <tr>
                              <th className="py-2.5 px-4 w-3/5">Description</th>
                              <th className="py-2.5 px-3 text-center">Project Timeline</th>
                              <th className="py-2.5 px-4 text-right">Project Cost (INR)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-slate-800 text-[12px]">
                            <tr>
                              <td className="py-2.5 px-4 font-semibold text-slate-900">
                                Compressor Air Leakage Audit for the scope mentioned above
                              </td>
                              <td className="py-2.5 px-3 text-center font-medium text-slate-700">
                                1–2 Weeks
                              </td>
                              <td className="py-2.5 px-4 text-right font-black text-slate-950 text-sm">
                                {formatCurrency(finalPrice)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="bg-slate-900 text-white p-2.5 px-4 flex justify-between items-center font-extrabold text-xs">
                          <span className="tracking-wide uppercase text-[11px]">TOTAL COMMERCIAL INVESTMENT (INCL. ALL EXPENSES)</span>
                          <span className="text-emerald-400 text-sm font-black tracking-tight">
                            {formatCurrency(finalPrice)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-slate-100">
                        <p className="font-bold text-slate-950 text-sm">Compressor Leakage Audit Commercials: Support required from the client:</p>
                        <ul className="space-y-1 pl-4 text-slate-800 text-[12px]">
                          <li>• SPOC (Single point of Contact) for support and coordination during the audit phase</li>
                          <li>• Accessibility to each area.</li>
                          <li>• 1 person required from client side with knowledge on Compressed air line to reach out from the generation to end use for leakage identifications.</li>
                        </ul>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-slate-100">
                        <p className="font-bold text-slate-950 text-sm">Terms and Conditions:</p>
                        <ul className="space-y-1 pl-4 text-slate-800 text-[12px]">
                          <li>• <strong>Payment schedule:</strong> 50% advance against the PO and remaining 50% against the report submission.</li>
                          <li>• Applicable taxes and duties will be extra.</li>
                          <li>• Boarding and Travel Expenses are inclusive of the cost mentioned above.</li>
                        </ul>
                      </div>
                    </div>
                  ) : isCompressorAirLeakageRectification ? (
                    <div className="space-y-2.5 text-slate-800 font-normal text-left" style={{ fontSize: '11px', lineHeight: '1.55' }}>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-950 text-xs">Commercials: Support required from the client:</p>
                        <ul className="space-y-0.5 pl-4 text-slate-800">
                          <li>• SPOC (Single point of Contact) for support and coordination during the audit phase.</li>
                          <li>• Accessibility to each area.</li>
                          <li>• 1 person required from client side with knowledge on Compressed air line to reach out from the generation to end use for leakage identifications.</li>
                        </ul>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-slate-100">
                        <p className="font-bold text-slate-950 text-xs">Terms and Conditions:</p>
                        <ul className="space-y-0.5 pl-4 text-slate-800">
                          <li>• <strong>Payment schedule:</strong> 70% advance along with the Purchase Order (PO) towards material procurement, and the remaining 30% upon completion of the work.</li>
                          <li>• Applicable taxes and duties will be extra.</li>
                          <li>• Boarding and Travel Expenses are inclusive of the cost mentioned above.</li>
                        </ul>
                      </div>

                      <div className="space-y-1 pt-1.5 border-t border-slate-100">
                        <p className="font-bold text-slate-950 text-xs">Note:</p>
                        <ul className="space-y-0.5 pl-4 text-slate-800">
                          <li>• PU hoses are under the client’s scope of supply.</li>
                          <li>• Need Machines Downtime for Leak Corrections.</li>
                        </ul>
                      </div>
                    </div>
                  ) : isHvacDesign ? (
                    <div
                      className="space-y-2.5 text-slate-800 font-normal text-left"
                      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", fontSize: '12px', lineHeight: '1.6' }}
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-slate-950 text-sm">Terms and Conditions:</p>
                        <ul className="space-y-1 pl-4 text-slate-800 text-[12px]">
                          <li>• <strong>Payment schedule:</strong> 40% advance against PO , 20% after Site Completion and 40% against Report Submission.</li>
                          <li>• Applicable taxes and duties will be extra.</li>
                          <li>• Boarding and Travel Expenses are inclusive .</li>
                        </ul>
                      </div>
                    </div>
                  ) : isEcFan ? (
                    <div
                      className="space-y-2.5 text-slate-800 font-normal text-left"
                      style={{ fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", fontSize: '12px', lineHeight: '1.6' }}
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-slate-950 text-sm">Payment Terms:</p>
                        <ul className="space-y-0.5 pl-4 text-[12px]">
                          <li>• <strong>50% advance</strong> against receipt of Purchase Order (PO)</li>
                          <li>• <strong>50%</strong> before dispatch of EC Fans</li>
                          <li>• Installation and commissioning charges are exclusive.</li>
                          <li>• Transportation/Freight charges as actual.</li>
                          <li>• Electrical cabling and accessories beyond the scope of supply.</li>
                          <li>• Civil or structural modifications, if any.</li>
                          <li>• Applicable GST.</li>
                          <li>• The quote is valid for 45 days from the date of submission</li>
                          <li>• Payment within 7 days from the date of invoice</li>
                        </ul>
                      </div>
                    </div>
                  ) : isAshraeLevel2 ? (
                    <div className="space-y-2.5 text-slate-800 font-normal text-left" style={{ fontSize: '11px', lineHeight: '1.55' }}>
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-950 text-xs">Payment Terms:</p>
                        <ul className="space-y-0.5 pl-4">
                          <li>• <strong>40% advance</strong> against receipt of Purchase Order (PO)</li>
                          <li>• <strong>30% payment</strong> upon completion of site assessment</li>
                          <li>• <strong>15% payment</strong> upon Submission of Draft Report</li>
                          <li>• <strong>15% payment</strong> upon submission of the final report</li>
                          <li>• Applicable taxes and duties shall be charged extra, as applicable</li>
                          <li>• All lodging, boarding, and travel expenses are included</li>
                          <li>• The quote is valid for 45 days from the date of submission</li>
                          <li>• Payment within 15 days from the date of invoice</li>
                        </ul>
                      </div>

                      <div className="space-y-0.5 pt-1.5 border-t border-slate-100">
                        <p className="font-bold text-slate-950 text-xs">Other Terms and Conditions:</p>
                        <ul className="space-y-0.5 pl-4 text-slate-800">
                          <li>• The customer shall be responsible for facilitating work visa applications and issuance, including managing all required documentation and bearing the associated application fees, as well as handling customs clearance of instruments.</li>
                          <li>• Customer shall arrange a skilled individual (Authorized technicians) for the entire duration of the audit period for local co-ordination with site team for seeking approval or work permits and installation of energy auditing equipment with proper safety measures.</li>
                        </ul>
                      </div>
                    </div>
                  ) : isEnergyAudit ? (
                    <div className="space-y-3 text-slate-800 font-normal text-left" style={{ fontSize: '12px', lineHeight: '1.65' }}>
                      <div className="space-y-1">
                        <p className="font-bold text-slate-950 text-sm">Payment Terms:</p>
                        <ul className="space-y-1 pl-4">
                          <li>• <strong>50% Payment:</strong> Completion of on-site assessment.</li>
                          <li>• <strong>50% Payment:</strong> Submission of final report.</li>
                          <li>• Applicable taxes and duties will be extra.</li>
                          <li>• Boarding and Travel Expenses are exclusive.</li>
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
                    <p className="font-bold text-slate-950 text-xs">Submitted By,</p>
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
                      <p className="text-slate-700">+91-8377007638</p>
                      <p className="text-slate-700">thanakarthik@sustainabyte.ai</p>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 text-[11px]">
                    <p className="font-black text-slate-950 text-xs pb-1 border-b border-slate-200">
                      Bank Account details:
                    </p>
                    {isWeldDataDigitalized ? (
                      <>
                        <p><strong className="text-slate-900">Bank:</strong> IDFC FIRST Bank</p>
                        <p><strong className="text-slate-900">Account Number:</strong> 10184753095</p>
                        <p><strong className="text-slate-900">IFSC:</strong> IDFB0080125</p>
                        <p><strong className="text-slate-900">Branch:</strong> BESANT NAGAR BRANCH</p>
                        <p><strong className="text-slate-900">GSTIN NO:</strong> 33ABNCS4869A1Z7</p>
                        <p><strong className="text-slate-900">PAN Number:</strong> ABNCS4869A</p>
                        <p><strong className="text-slate-900">SWIFT Code:</strong> IDFBINBBMUM</p>
                      </>
                    ) : (
                      <>
                        <p><strong className="text-slate-900">Bank:</strong> Bank of Baroda</p>
                        <p><strong className="text-slate-900">Account Number:</strong> 35860200000750</p>
                        <p><strong className="text-slate-900">IFSC:</strong> BARB0VELACH (fifth letter is ZERO)</p>
                        <p><strong className="text-slate-900">Branch:</strong> VELACHERY BRANCH</p>
                        <p><strong className="text-slate-900">GSTIN NO:</strong> 33ABNCS4869A1Z7</p>
                        <p><strong className="text-slate-900">PAN Number:</strong> ABNCS4869A</p>
                      </>
                    )}
                  </div>
                </div>

                {/* THANK YOU */}
                {(isWeldDataDigitalized || isAshraeLevel2 || isCompressorAirLeakage || isHvacDesign || isEcFan) && (
                  <div className="pt-2 text-center">
                    <p className="text-sm font-black uppercase tracking-widest text-slate-900">THANK YOU</p>
                  </div>
                )}

                {/* Client Acceptance Box */}

              </div>

              <div className="relative z-10 border-t border-slate-200 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Ref: {proposalRef}</span>
                <span className="font-semibold text-slate-500">Confidential — Sustainabyte Technologies Pvt Ltd</span>
                <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Page {totalPages} of {totalPages}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

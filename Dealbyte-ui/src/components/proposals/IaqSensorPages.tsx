'use client';

import React from 'react';
import {
  Wind,
  Layers,
  Activity,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Gauge,
  Thermometer,
  Droplets,
  CloudRain,
  Radio,
  AlertTriangle,
} from 'lucide-react';

interface IaqSensorPagesProps {
  deal: any;
  proposal: any;
  proposalRef: string;
  proposalDate: string;
  finalPrice: number;
  formatCurrency: (amount: number) => string;
  costingSheet?: any;
}

export function IaqSensorPages({
  deal,
  proposal,
  proposalRef,
  proposalDate,
  finalPrice,
  formatCurrency,
  costingSheet: propCostingSheet,
}: IaqSensorPagesProps) {
  const totalPages = 4;

  const clientName = deal?.clientName || (proposal as any)?.clientName || proposal?.quote?.deal?.clientName || 'Valued Client';
  const projectName = deal?.projectName || (deal as any)?.projectName || 'Facility IAQ Monitoring';

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
    costingSheet.instrumentRows?.hardwareRows ||
    [];
  const activeHwRows = rawHwRows.filter((r) => Number(r.quantity || r.qty || 0) > 0);

  const PageHeader = ({ subtitle = 'Hardware Supply & Cloud Analytics Scope' }: { subtitle?: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-2.5 gap-4">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtitle}</p>
        <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
          {clientName} — IAQ Sensor &amp; Air Quality Intelligence
        </h2>
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
        <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-between">
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
      {/* ── PAGE 1: COVER PAGE & EXECUTIVE SUMMARY ── */}
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
            <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-3.5 gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Official Commercial Proposal
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 uppercase">
                  Hardware Supply — IAQ Sensor &amp; Cloud Platform
                </h1>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono font-medium">
                  <span>Ref: <strong className="text-slate-800">{proposalRef}</strong></span>
                  <span>•</span>
                  <span>Date: <strong className="text-slate-800">{proposalDate}</strong></span>
                </div>
              </div>
              <div className="flex items-center justify-end shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/Company-Logo-Light.png" alt="Sustainabyte Technologies Logo" className="h-12 sm:h-14 w-auto object-contain" />
              </div>
            </div>

            {/* Target Client Banner */}
            <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Prepared Exclusively For:</span>
                <h3 className="text-lg font-black">{clientName}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{projectName} • Indoor Air Quality &amp; Ventilation Optimization</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Commercial Value</span>
                <span className="text-xl font-black text-emerald-400">{formatCurrency(finalPrice)}</span>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wide flex items-center gap-1.5">
                <Wind className="h-4 w-4 text-emerald-600" /> Executive Summary: Indoor Air Quality Intelligence
              </h3>
              <p className="text-[11.5px] text-slate-700 leading-relaxed text-justify">
                <strong>Sustainabyte Technologies</strong> is pleased to submit this comprehensive technical and commercial proposal for the supply, deployment, and cloud integration of industrial-grade <strong>Indoor Air Quality (IAQ) Multi-Parameter Sensors</strong> for <strong>{clientName}</strong>.
              </p>
              <p className="text-[11.5px] text-slate-700 leading-relaxed text-justify">
                Indoor Air Quality directly influences occupant health, cognitive performance, and HVAC energy utilization. Our Optibyte IAQ sensing solution captures 6 continuous atmospheric metrics ($CO_2$, PM2.5, PM10, Temperature, Relative Humidity, and TVOC) transmitting high-frequency telemetry to the Optibyte Air Intelligence Platform for real-time compliance alerting and automated demand-controlled ventilation (DCV).
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-black text-xs">
                  <Gauge className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Comprehensive 6-in-1 Sensing</span>
                </div>
                <p className="text-[10.5px] text-slate-600 leading-snug">
                  Combines NDIR $CO_2$, laser particle scattering (PM2.5/PM10), MOX TVOC, and precision temperature/humidity sensors.
                </p>
              </div>

              <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-teal-800 font-black text-xs">
                  <Activity className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>Real-Time Cloud Telemetry</span>
                </div>
                <p className="text-[10.5px] text-slate-600 leading-snug">
                  Continuous data transmission via Modbus RS-485 and 4G IoT Gateway with sub-minute sampling and cloud retention.
                </p>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-blue-800 font-black text-xs">
                  <TrendingDown className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Energy &amp; Ventilation Optimization</span>
                </div>
                <p className="text-[10.5px] text-slate-600 leading-snug">
                  Enables Demand-Controlled Ventilation (DCV), cutting AHU over-ventilation costs by 15–25% while maintaining fresh air standards.
                </p>
              </div>

              <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-800 font-black text-xs">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>Standards &amp; Compliance Ready</span>
                </div>
                <p className="text-[10.5px] text-slate-600 leading-snug">
                  Compliant with ASHRAE 62.1, RESET Air, WELL Building Standard, LEED v4.1, and OSHA indoor atmospheric thresholds.
                </p>
              </div>
            </div>
          </div>

          <PageFooter pageNum={1} />
        </div>
      </div>

      {/* ── PAGE 2: SENSOR SPECIFICATIONS & PARAMETERS MONITORED ── */}
      <PageShell pageNum={2} subtitle="Technical Specifications & Monitored Parameters">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-600" /> Multi-Parameter Environmental Sensing Specifications
            </h3>
            <p className="text-[11px] text-slate-600">
              High-accuracy sensing matrix designed for commercial buildings, manufacturing zones, clean rooms, and server environments.
            </p>
          </div>

          {/* Key Parameters Monitored Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold text-[10px] uppercase">
                  <th className="p-2.5 pl-3">Parameter</th>
                  <th className="p-2.5">Sensing Technology</th>
                  <th className="p-2.5">Measurement Range</th>
                  <th className="p-2.5">Accuracy &amp; Resolution</th>
                  <th className="p-2.5 pr-3">Target Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                <tr className="hover:bg-slate-50/80">
                  <td className="p-2.5 pl-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <Radio className="h-3.5 w-3.5 text-emerald-600" /> Carbon Dioxide ($CO_2$)
                  </td>
                  <td className="p-2.5">Dual-Beam NDIR Optical Sensor</td>
                  <td className="p-2.5 font-mono">400 – 5,000 ppm</td>
                  <td className="p-2.5">±(30 ppm + 3% of reading)</td>
                  <td className="p-2.5 pr-3 font-bold text-emerald-700">&lt; 800 ppm</td>
                </tr>
                <tr className="bg-slate-50/40 hover:bg-slate-50">
                  <td className="p-2.5 pl-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <CloudRain className="h-3.5 w-3.5 text-teal-600" /> Particulate Matter (PM2.5)
                  </td>
                  <td className="p-2.5">Laser Optical Particle Counter</td>
                  <td className="p-2.5 font-mono">0 – 1,000 µg/m³</td>
                  <td className="p-2.5">±10 µg/m³ (0-100), ±10%</td>
                  <td className="p-2.5 pr-3 font-bold text-emerald-700">&lt; 15 µg/m³</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-2.5 pl-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <Wind className="h-3.5 w-3.5 text-blue-600" /> Particulate Matter (PM10)
                  </td>
                  <td className="p-2.5">Laser Optical Particle Counter</td>
                  <td className="p-2.5 font-mono">0 – 1,000 µg/m³</td>
                  <td className="p-2.5">±15 µg/m³ (0-100), ±10%</td>
                  <td className="p-2.5 pr-3 font-bold text-emerald-700">&lt; 45 µg/m³</td>
                </tr>
                <tr className="bg-slate-50/40 hover:bg-slate-50">
                  <td className="p-2.5 pl-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> TVOC (Volatile Organics)
                  </td>
                  <td className="p-2.5">Multi-Pixel Metal Oxide (MOX)</td>
                  <td className="p-2.5 font-mono">0 – 60,000 ppb</td>
                  <td className="p-2.5">15% typ. VOC Index 1-500</td>
                  <td className="p-2.5 pr-3 font-bold text-emerald-700">&lt; 220 ppb</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-2.5 pl-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <Thermometer className="h-3.5 w-3.5 text-rose-600" /> Ambient Temperature
                  </td>
                  <td className="p-2.5">Bandgap CMOS Thermal Diode</td>
                  <td className="p-2.5 font-mono">-10°C to +60°C</td>
                  <td className="p-2.5">±0.2°C (0.01°C res)</td>
                  <td className="p-2.5 pr-3 font-bold text-emerald-700">22°C – 25°C</td>
                </tr>
                <tr className="bg-slate-50/40 hover:bg-slate-50">
                  <td className="p-2.5 pl-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <Droplets className="h-3.5 w-3.5 text-cyan-600" /> Relative Humidity (%RH)
                  </td>
                  <td className="p-2.5">Capacitive Polymer Sensor</td>
                  <td className="p-2.5 font-mono">0 – 100% RH</td>
                  <td className="p-2.5">±2% RH (0.1% res)</td>
                  <td className="p-2.5 pr-3 font-bold text-emerald-700">40% – 60%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Hardware Construction & Deployment Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <h4 className="text-xs font-black text-slate-900 uppercase">Hardware &amp; Enclosure Features</h4>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                <li>Industrial flame-retardant ABS enclosure (Wall/Duct/Ceiling mount).</li>
                <li>RS-485 Modbus RTU interface with daisy-chain capability up to 32 nodes.</li>
                <li>Wide operating input voltage: 12V – 24V DC / AC with transient surge protection.</li>
                <li>Factory-calibrated with Automatic Baseline Calibration (ABC) for $CO_2$.</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <h4 className="text-xs font-black text-slate-900 uppercase">Ventilation &amp; BMS Integration</h4>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                <li>Direct integration with AHUs, VAVs, and TFA systems for demand control.</li>
                <li>Optibyte 4G IoT Gateway integration for instant cloud uplink without LAN dependencies.</li>
                <li>MQTT / REST API output to third-party BMS, SCADA, or EMS platforms.</li>
                <li>Local audible and visual LED status ring for instant occupant feedback.</li>
              </ul>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 3: DASHBOARD VIEW & OPTIBYTE AIR INTELLIGENCE ── */}
      <PageShell pageNum={3} subtitle="3 Dashboard View: Optibyte Air Quality Analytics">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" /> 3 Dashboard View: Optibyte Air Quality Analytics &amp; Intelligence
            </h3>
            <p className="text-[11px] text-slate-600">
              Real-time multi-parameter visualization, live IAQ scoring gauge, continuous timestamped logs, and CSV export.
            </p>
          </div>

          {/* Actual Dashboard Screenshot Showcase */}
          <div className="p-2.5 bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-200 tracking-wide">Optibyte Air Intelligence • Live IAQ Telemetry Stream</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                Live Data Stream • 04:25 PM
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/iaq-dashboard.png"
              alt="Optibyte Air Quality Dashboard View"
              className="w-full rounded-xl border border-slate-800 object-contain shadow-inner max-h-[360px]"
            />
          </div>

          {/* Dashboard Key Capabilities Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-[10.5px] font-black text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Overall IAQ Score Gauge
              </span>
              <p className="text-[10px] text-slate-600 leading-snug">
                Aggregates all 6 sensors into a composite 0-100 rating (Excellent, Good, Moderate, Poor) for instant executive visibility.
              </p>
            </div>

            <div className="p-2.5 bg-teal-50/50 border border-teal-200 rounded-xl space-y-1">
              <span className="text-[10.5px] font-black text-teal-800 flex items-center gap-1">
                <FileSpreadsheet className="h-3.5 w-3.5 text-teal-600" /> CSV &amp; Compliance Export
              </span>
              <p className="text-[10px] text-slate-600 leading-snug">
                One-click historical data export with custom date ranges for ESG, WELL, and factory compliance audits.
              </p>
            </div>

            <div className="p-2.5 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-1">
              <span className="text-[10.5px] font-black text-indigo-800 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-indigo-600" /> Multi-Channel Alarms
              </span>
              <p className="text-[10px] text-slate-600 leading-snug">
                Automated SMS &amp; Email breach notifications when $CO_2$ &gt; 1,000 ppm or PM2.5 exceeds permissible limits.
              </p>
            </div>
          </div>
        </div>
      </PageShell>

      {/* ── PAGE 4: COMMERCIALS & TERMS AND CONDITIONS ── */}
      <PageShell pageNum={4} subtitle="7 Commercials & Terms and Conditions">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> 7 Commercials: Bill of Quantities &amp; Investment
            </h3>
            <p className="text-[11px] text-slate-600">
              Itemized commercial breakdown for hardware supply, telemetry gateways, and cloud software subscriptions.
            </p>
          </div>

          {/* Commercial Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold text-[10px] uppercase">
                  <th className="p-2.5 pl-3 w-12">Item</th>
                  <th className="p-2.5">Scope &amp; Description</th>
                  <th className="p-2.5 w-16 text-center">Qty</th>
                  <th className="p-2.5 w-16 text-center">UoM</th>
                  <th className="p-2.5 pr-3 text-right">Customer Price (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                {activeHwRows.length > 0 ? (
                  activeHwRows.map((r, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/40' : ''}>
                      <td className="p-2.5 pl-3 font-bold text-slate-900">{idx + 1}</td>
                      <td className="p-2.5 font-medium">{r.productDescription || r.description || 'IAQ Multi-Parameter Sensor Unit'}</td>
                      <td className="p-2.5 text-center font-mono">{r.quantity || r.qty || 1}</td>
                      <td className="p-2.5 text-center">{r.uom || 'Nos'}</td>
                      <td className="p-2.5 pr-3 text-right font-mono font-bold text-slate-900">
                        ₹{(Number(r.customerPrice) || (Number(r.unitPrice || 0) * Number(r.quantity || 1)) || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td className="p-2.5 pl-3 font-bold text-slate-900">1</td>
                      <td className="p-2.5 font-medium">
                        Supply of Multi-Parameter Indoor Air Quality (IAQ) Sensor Unit ($CO_2$, PM2.5, PM10, TVOC, Temp &amp; RH) with RS485 Modbus RTU
                      </td>
                      <td className="p-2.5 text-center font-mono">1</td>
                      <td className="p-2.5 text-center">Nos</td>
                      <td className="p-2.5 pr-3 text-right font-mono font-bold text-slate-900">
                        ₹{finalPrice > 0 ? finalPrice.toLocaleString('en-IN') : '28,000'}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white font-extrabold text-xs">
                  <td colSpan={4} className="p-2.5 pl-3 uppercase tracking-wider">
                    Total Quoted Value (Excl. Taxes)
                  </td>
                  <td className="p-2.5 pr-3 text-right text-emerald-400 font-mono text-sm font-black">
                    {formatCurrency(finalPrice)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Exact Terms and Conditions Requested by User */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-wide border-b border-slate-200 pb-1">
              Terms and Conditions:
            </h4>
            <div className="grid grid-cols-1 gap-1.5 text-[11px] text-slate-700">
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-900 min-w-[130px]">• Payment schedule:</span>
                <span>100% payment for hardware advance against the PO.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-900 min-w-[130px]">• Taxes &amp; Duties:</span>
                <span>Applicable taxes and duties will be extra (GST @ 18%).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-900 min-w-[130px]">• Delivery Period:</span>
                <span>Within 5-6 weeks from date of receipt of advance along with P.O.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-900 min-w-[130px]">• Warranty:</span>
                <span>12 months from the date of installation or 18 months from the date of dispatch whichever is earlier.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-900 min-w-[130px]">• Offer Validity:</span>
                <span>30 Days from the date of proposal generation.</span>
              </div>
            </div>
          </div>

          {/* Bank Details & Signature Block */}
          <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1 text-[10.5px]">
              <span className="font-black text-emerald-950 block uppercase text-[10px]">Bank Account Details:</span>
              <p className="text-slate-700"><strong>Name:</strong> SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED</p>
              <p className="text-slate-700 font-mono"><strong>A/C No:</strong> 35860200000750</p>
              <p className="text-slate-700 font-mono"><strong>IFSC:</strong> BARB0VELACH (5th char is ZERO)</p>
              <p className="text-slate-700"><strong>Bank:</strong> Bank of Baroda, Velachery Branch</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between text-[10.5px]">
              <div>
                <span className="font-black text-slate-900 block uppercase text-[10px]">Submitted By:</span>
                <p className="text-slate-800 font-bold mt-0.5">Sustainabyte Technologies Pvt Ltd</p>
                <p className="text-slate-500 text-[10px]">Authorized Technical &amp; Commercial Signatory</p>
              </div>
              <div className="border-t border-slate-300 pt-1 text-[10px] text-slate-400 italic">
                Digitally generated proposal document
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
}

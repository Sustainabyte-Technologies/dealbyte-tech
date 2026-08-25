import React from 'react';
import {
  Cpu,
  RotateCcw,
  Plus,
  Trash2,
  Receipt,
} from 'lucide-react';
import {
  WeldingHardwareRow,
  WeldingSoftwareRow,
  WeldingCloudRow,
  WeldingInstallationRow,
} from '../types';
import { formatMoney } from '../utils';

export interface WeldingIotTemplateProps {
  activeSubServiceName: string;
  weldingHardwareRows: WeldingHardwareRow[];
  updateWeldingHardwareRow: (id: string, field: keyof WeldingHardwareRow, val: any) => void;
  addWeldingHardwareRow: () => void;
  removeWeldingHardwareRow: (id: string) => void;
  weldingHardwareTotalCost: number;
  weldingHardwareTotalPrice: number;
  weldingSoftwareRows: WeldingSoftwareRow[];
  updateWeldingSoftwareRow: (id: string, field: keyof WeldingSoftwareRow, val: any) => void;
  addWeldingSoftwareRow: () => void;
  removeWeldingSoftwareRow: (id: string) => void;
  weldingSoftwareTotalPrice: number;
  weldingCloudRows: WeldingCloudRow[];
  updateWeldingCloudRow: (id: string, field: keyof WeldingCloudRow, val: any) => void;
  addWeldingCloudRow: () => void;
  removeWeldingCloudRow: (id: string) => void;
  weldingCloudTotalMonthly: number;
  weldingCloudTotalYearly: number;
  weldingInstallationRows: WeldingInstallationRow[];
  updateWeldingInstallationRow: (id: string, field: keyof WeldingInstallationRow, val: any) => void;
  addWeldingInstallationRow: () => void;
  removeWeldingInstallationRow: (id: string) => void;
  weldingInstallationTotalCost?: number;
  weldingInstallationTotalPrice: number;
  weldingSteps1To4TotalPrice: number;
  weldingBufferAmount: number;
  weldingPriceWithBuffer: number;
  weldingGrandTotal: number;
  profitPct?: number;
  setProfitPct?: (pct: number) => void;
  applyWeldingGlobalMargin?: (margin: number) => void;
  bufferPct: number;
  setBufferPct: (pct: number) => void;
  resetWeldingIotDefaults: () => void;
}

export const WeldingIotTemplate: React.FC<WeldingIotTemplateProps> = ({
  activeSubServiceName,
  weldingHardwareRows,
  updateWeldingHardwareRow,
  addWeldingHardwareRow,
  removeWeldingHardwareRow,
  weldingHardwareTotalCost,
  weldingHardwareTotalPrice,
  weldingSoftwareRows,
  updateWeldingSoftwareRow,
  addWeldingSoftwareRow,
  removeWeldingSoftwareRow,
  weldingSoftwareTotalPrice,
  weldingCloudRows,
  updateWeldingCloudRow,
  addWeldingCloudRow,
  removeWeldingCloudRow,
  weldingCloudTotalMonthly,
  weldingCloudTotalYearly,
  weldingInstallationRows,
  updateWeldingInstallationRow,
  addWeldingInstallationRow,
  removeWeldingInstallationRow,
  weldingInstallationTotalCost = 0,
  weldingInstallationTotalPrice,
  weldingSteps1To4TotalPrice,
  weldingBufferAmount,
  weldingPriceWithBuffer,
  weldingGrandTotal,
  profitPct = 40,
  setProfitPct,
  applyWeldingGlobalMargin,
  bufferPct,
  setBufferPct,
  resetWeldingIotDefaults,
}) => {
  return (
    <div className="space-y-8">
      {/* Top Banner for Welding IoT Template */}
      <div className="bg-slate-900 text-white p-5 px-6 rounded-3xl border-2 border-slate-900 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Cpu className="h-6 w-6 text-amber-400 animate-pulse" />
              <h2 className="font-extrabold text-base tracking-wide uppercase text-white">
                {activeSubServiceName} Costing Template
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Hardware Development, Software Development, Cloud Recurring & Installation Charges
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-400/40 px-3.5 py-1 rounded-full font-bold">
              5-Step Architecture
            </span>

            {/* Editable Base Margin Badge */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-emerald-400/40 px-3 py-1 rounded-full shadow-inner">
              <span className="text-xs font-bold text-emerald-300">Margin:</span>
              <div className="flex items-center">
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={profitPct}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (setProfitPct) setProfitPct(val);
                  }}
                  className="w-10 text-center text-xs font-black text-emerald-300 bg-slate-900 rounded px-1 py-0.5 border border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
                <span className="text-xs font-bold text-emerald-400 ml-0.5">%</span>
              </div>
              {applyWeldingGlobalMargin && (
                <button
                  type="button"
                  onClick={() => applyWeldingGlobalMargin(profitPct)}
                  className="ml-1 text-[10px] uppercase tracking-wider font-extrabold bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-200 px-2 py-0.5 rounded transition cursor-pointer border border-emerald-400/40"
                  title="Apply this margin % to all hardware & installation items"
                >
                  Apply All
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={resetWeldingIotDefaults}
              className="px-3.5 py-1 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              Reset Defaults
            </button>
          </div>
        </div>
      </div>

      {/* STEP 1: HARDWARE AND DEVELOPMENT CHARGES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 px-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-600 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-lg">
                Step 1
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Hardware and development Charges
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Embedded Microcontrollers, Sensors, Enclosure, Industrial SMPS & Kit Development
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Subtotal Selling Price
            </span>
            <span className="text-sm font-extrabold text-amber-700">
              ₹{formatMoney(weldingHardwareTotalPrice)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Sl No</th>
                <th className="py-3 px-4 min-w-[280px]">Component Name</th>
                <th className="py-3 px-4 w-36 text-center">Qty</th>
                <th className="py-3 px-4 w-40 text-right">Unit Cost (₹)</th>
                <th className="py-3 px-4 w-40 text-right">Unit Price (₹)</th>
                <th className="py-3 px-4 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {weldingHardwareRows.map((r, idx) => (
                <tr key={r.id} className="hover:bg-amber-50/20 transition-colors">
                  <td className="py-2.5 px-4 text-center font-bold text-slate-500">
                    {r.slNo || idx + 1}
                  </td>
                  <td className="py-2.5 px-4">
                    <textarea
                      rows={Math.max(1, Math.ceil((r.componentName?.length || 1) / 38))}
                      value={r.componentName}
                      onChange={(e) => updateWeldingHardwareRow(r.id, 'componentName', e.target.value)}
                      className="w-full px-2.5 py-1 text-xs font-semibold text-slate-900 bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-lg focus:outline-none transition resize-none leading-snug whitespace-pre-wrap"
                    />
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <input
                      type="text"
                      value={r.qty}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateWeldingHardwareRow(r.id, 'qty', isNaN(Number(val)) || val === '' ? val : Number(val));
                      }}
                      className="w-28 px-2 py-1 text-xs font-bold text-center text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                      <input
                        type="number"
                        value={r.unitCost}
                        onChange={(e) => updateWeldingHardwareRow(r.id, 'unitCost', Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1 text-xs font-bold text-right text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600 text-xs">₹</span>
                      <input
                        type="number"
                        value={r.unitPrice}
                        onChange={(e) => updateWeldingHardwareRow(r.id, 'unitPrice', Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1 text-xs font-extrabold text-right text-emerald-700 bg-emerald-50/50 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => removeWeldingHardwareRow(r.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td colSpan={3} className="py-3 px-4 text-right uppercase text-xs tracking-wider">
                  Hardware Total
                </td>
                <td className="py-3 px-4 text-right text-slate-700 font-bold">
                  ₹{formatMoney(weldingHardwareTotalCost)}
                </td>
                <td className="py-3 px-4 text-right text-amber-800 text-sm font-black">
                  ₹{formatMoney(weldingHardwareTotalPrice)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bottom Add Row Bar */}
        <div className="p-3.5 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Add more components or custom embedded hardware items
          </span>
          <button
            type="button"
            onClick={addWeldingHardwareRow}
            className="px-4 py-2 text-xs font-bold text-amber-800 bg-amber-100/70 hover:bg-amber-200/80 border border-amber-300 rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-amber-700" /> + Add Hardware Component Row
          </button>
        </div>
      </div>

      {/* STEP 2: SOFTWARE DEVELOPMENT */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 px-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-lg">
                Step 2
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Software Development
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              UI/UX Design, Logic configuration, Joint-wise analytics, Calibration scheduling & Automated testing
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Software Price
            </span>
            <span className="text-sm font-extrabold text-indigo-700">
              ₹{formatMoney(weldingSoftwareTotalPrice)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-48">Component</th>
                <th className="py-3 px-4 min-w-[300px]">Description &amp; Logic Addition</th>
                <th className="py-3 px-4 w-36 text-center">Units / Qty</th>
                <th className="py-3 px-4 w-36 text-right">Unit Price (₹)</th>
                <th className="py-3 px-4 w-40 text-right bg-indigo-50/50 text-indigo-950">Total Price (₹)</th>
                <th className="py-3 px-4 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {weldingSoftwareRows.map((r) => (
                <tr key={r.id} className="hover:bg-indigo-50/20 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    <input
                      type="text"
                      value={r.item}
                      onChange={(e) => updateWeldingSoftwareRow(r.id, 'item', e.target.value)}
                      className="w-full px-2.5 py-1 text-xs font-bold text-slate-900 bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-lg focus:outline-none transition"
                    />
                  </td>
                  <td className="py-2.5 px-4">
                    <textarea
                      rows={2}
                      value={r.description}
                      onChange={(e) => updateWeldingSoftwareRow(r.id, 'description', e.target.value)}
                      className="w-full px-2.5 py-1 text-xs text-slate-700 bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded-lg focus:outline-none transition resize-none"
                    />
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const cur = Number(r.qty || 0);
                          updateWeldingSoftwareRow(r.id, 'qty', Math.max(0, cur - 1));
                        }}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 font-black text-slate-700 cursor-pointer transition text-xs select-none"
                        title="Decrement Units"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={r.qty === undefined || r.qty === null ? 0 : r.qty}
                        onChange={(e) => updateWeldingSoftwareRow(r.id, 'qty', e.target.value === '' ? 0 : Number(e.target.value))}
                        onFocus={(e) => e.target.select()}
                        className="w-14 text-center font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-1 py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const cur = Number(r.qty || 0);
                          updateWeldingSoftwareRow(r.id, 'qty', cur + 1);
                        }}
                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-indigo-100 hover:bg-indigo-200 border border-indigo-300 font-black text-indigo-800 cursor-pointer transition text-xs select-none"
                        title="Increment Units"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                      <input
                        type="number"
                        min={0}
                        value={r.unitPrice !== undefined ? r.unitPrice : 20000}
                        onChange={(e) => updateWeldingSoftwareRow(r.id, 'unitPrice', Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1 text-xs font-bold text-right text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-right font-black text-indigo-900 bg-indigo-50/40">
                    ₹{formatMoney(r.price || 0)}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => removeWeldingSoftwareRow(r.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td colSpan={4} className="py-3 px-4 text-right uppercase text-xs tracking-wider">
                  Software Total
                </td>
                <td className="py-3 px-4 text-right text-indigo-900 text-sm font-black bg-indigo-100/50">
                  ₹{formatMoney(weldingSoftwareTotalPrice)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bottom Add Row Bar */}
        <div className="p-3.5 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Add custom software logic modules or API gateway integration
          </span>
          <button
            type="button"
            onClick={addWeldingSoftwareRow}
            className="px-4 py-2 text-xs font-bold text-indigo-800 bg-indigo-100/70 hover:bg-indigo-200/80 border border-indigo-300 rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-indigo-700" /> + Add Software Scope Row
          </button>
        </div>
      </div>

      {/* STEP 3: CLOUD CHARGES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 px-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-600 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-lg">
                Step 3
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Cloud Charges
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cloud VM Broker, InfluxDB Database, Daily Log Backups, SSL Certificates & IoT SIM
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Yearly Recurring
            </span>
            <span className="text-sm font-extrabold text-purple-700">
              ₹{formatMoney(weldingCloudTotalYearly)}/year
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 min-w-[180px]">Component</th>
                <th className="py-3 px-4 min-w-[200px]">Description</th>
                <th className="py-3 px-4 w-24 text-center">Type / Tier</th>
                <th className="py-3 px-4 w-32 text-center">Units / Qty</th>
                <th className="py-3 px-4 w-32 text-right">Unit / Mo Cost (₹)</th>
                <th className="py-3 px-4 w-24 text-center">Margin %</th>
                <th className="py-3 px-4 w-32 text-right">Monthly (₹)</th>
                <th className="py-3 px-4 w-36 text-right">Yearly (₹)</th>
                <th className="py-3 px-4 w-14 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {weldingCloudRows.map((r) => {
                const monthlyPrice = Number(r.monthlyPrice || 0);
                const monthlyCost = r.monthlyCost !== undefined ? r.monthlyCost : Math.round(monthlyPrice * 0.6);
                const yearlyPrice = r.yearlyPrice !== undefined ? r.yearlyPrice : monthlyPrice * 12;
                const unitCost = r.unitMonthlyCost !== undefined ? r.unitMonthlyCost : (r.monthlyCost && r.qty ? Math.round(r.monthlyCost / r.qty) : 600);

                return (
                  <tr key={r.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-slate-900">
                      <input
                        type="text"
                        value={r.component}
                        onChange={(e) => updateWeldingCloudRow(r.id, 'component', e.target.value)}
                        className="w-full px-2.5 py-1 text-xs font-bold text-slate-900 bg-transparent border border-transparent hover:border-slate-300 focus:border-purple-500 focus:bg-white rounded-lg focus:outline-none transition"
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <textarea
                        rows={Math.max(1, Math.ceil((r.description?.length || 1) / 35))}
                        value={r.description}
                        onChange={(e) => updateWeldingCloudRow(r.id, 'description', e.target.value)}
                        className="w-full px-2.5 py-1 text-xs text-slate-700 bg-transparent border border-transparent hover:border-slate-300 focus:border-purple-500 focus:bg-white rounded-lg focus:outline-none transition resize-none leading-snug whitespace-pre-wrap"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <input
                        type="text"
                        value={r.type}
                        onChange={(e) => updateWeldingCloudRow(r.id, 'type', e.target.value)}
                        className="w-20 px-2 py-1 text-xs font-bold text-center text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const cur = Number(r.qty || 0);
                            updateWeldingCloudRow(r.id, 'qty', Math.max(0, cur - 1));
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 font-black text-slate-700 cursor-pointer transition text-xs select-none"
                          title="Decrement Units"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={r.qty === undefined || r.qty === null ? 0 : r.qty}
                          onChange={(e) => updateWeldingCloudRow(r.id, 'qty', e.target.value === '' ? 0 : Number(e.target.value))}
                          onFocus={(e) => e.target.select()}
                          className="w-12 text-center font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-1 py-1 focus:ring-2 focus:ring-purple-500 focus:outline-none text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const cur = Number(r.qty || 0);
                            updateWeldingCloudRow(r.id, 'qty', cur + 1);
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded-lg bg-purple-100 hover:bg-purple-200 border border-purple-300 font-black text-purple-800 cursor-pointer transition text-xs select-none"
                          title="Increment Units"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                        <input
                          type="number"
                          value={unitCost}
                          onChange={(e) => updateWeldingCloudRow(r.id, 'unitMonthlyCost', Number(e.target.value))}
                          className="w-full pl-6 pr-2 py-1 text-xs font-bold text-right text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={99}
                          value={r.marginPct !== undefined ? r.marginPct : profitPct}
                          onChange={(e) => updateWeldingCloudRow(r.id, 'marginPct', Number(e.target.value))}
                          className="w-14 px-1.5 py-1 text-xs font-black text-center text-purple-700 bg-purple-50 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                        <span className="text-[11px] font-bold text-slate-500">%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-purple-950">
                      ₹{formatMoney(monthlyPrice)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-purple-900 text-sm bg-purple-50/40">
                      ₹{formatMoney(yearlyPrice)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => removeWeldingCloudRow(r.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td colSpan={4} className="py-3 px-4 text-right uppercase text-xs tracking-wider">
                  Cloud Total
                </td>
                <td className="py-3 px-4 text-right text-slate-700 font-bold">
                  ₹{formatMoney(weldingCloudRows.reduce((sum, r) => sum + (r.monthlyCost !== undefined ? Number(r.monthlyCost) : Math.round(Number(r.monthlyPrice || 0) * 0.6)), 0))}
                </td>
                <td className="py-3 px-4 text-center text-purple-700 font-bold">
                  {profitPct}%
                </td>
                <td className="py-3 px-4 text-right text-purple-900 font-extrabold">
                  ₹{formatMoney(weldingCloudTotalMonthly)}/mo
                </td>
                <td className="py-3 px-4 text-right text-purple-900 text-sm font-black bg-purple-100/50">
                  ₹{formatMoney(weldingCloudTotalYearly)}/yr
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bottom Add Row Bar */}
        <div className="p-3.5 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Add custom cloud storage, MQTT clusters or private VPN gateways
          </span>
          <button
            type="button"
            onClick={addWeldingCloudRow}
            className="px-4 py-2 text-xs font-bold text-purple-800 bg-purple-100/70 hover:bg-purple-200/80 border border-purple-300 rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-purple-700" /> + Add Cloud Component Row
          </button>
        </div>
      </div>

      {/* STEP 4: INSTALLATION CHARGES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 px-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-lg">
                Step 4
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Installation Charges
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Site setup, sensor mounting, machine wiring, CT & shunt calibration and functional commissioning
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Installation Total
            </span>
            <span className="text-sm font-extrabold text-emerald-700">
              ₹{formatMoney(weldingInstallationTotalPrice)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 min-w-[240px]">Deliverable / Activity</th>
                <th className="py-3 px-4 w-24 text-center">Qty</th>
                <th className="py-3 px-4 w-32 text-right">Unit Cost (₹)</th>
                <th className="py-3 px-4 w-24 text-center">Margin %</th>
                <th className="py-3 px-4 w-32 text-right">Unit Price (₹)</th>
                <th className="py-3 px-4 w-36 text-right">Total Price (₹)</th>
                <th className="py-3 px-4 w-14 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {weldingInstallationRows.map((r) => {
                const qty = r.qty !== undefined && r.qty !== null ? Number(r.qty) : 0;
                const unitPrice = r.unitPrice !== undefined ? r.unitPrice : (r.price || 0);
                const unitCost = r.unitCost !== undefined ? r.unitCost : Math.round(unitPrice * 0.6);
                const rowTotalPrice = qty * unitPrice;

                return (
                  <tr key={r.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-slate-900">
                      <textarea
                        rows={Math.max(1, Math.ceil((r.item?.length || 1) / 35))}
                        value={r.item}
                        onChange={(e) => updateWeldingInstallationRow(r.id, 'item', e.target.value)}
                        className="w-full px-2.5 py-1 text-xs font-bold text-slate-900 bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white rounded-lg focus:outline-none transition resize-none leading-snug whitespace-pre-wrap"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const cur = Number(r.qty || 0);
                            updateWeldingInstallationRow(r.id, 'qty', Math.max(0, cur - 1));
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 font-black text-slate-700 cursor-pointer transition text-xs select-none"
                          title="Decrement Qty"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={r.qty === undefined || r.qty === null ? 0 : r.qty}
                          onChange={(e) => updateWeldingInstallationRow(r.id, 'qty', e.target.value === '' ? 0 : Number(e.target.value))}
                          onFocus={(e) => e.target.select()}
                          className="w-12 text-center font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-1 py-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const cur = Number(r.qty || 0);
                            updateWeldingInstallationRow(r.id, 'qty', cur + 1);
                          }}
                          className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 font-black text-emerald-800 cursor-pointer transition text-xs select-none"
                          title="Increment Qty"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                        <input
                          type="number"
                          value={unitCost}
                          onChange={(e) => updateWeldingInstallationRow(r.id, 'unitCost', Number(e.target.value))}
                          className="w-full pl-6 pr-2 py-1 text-xs font-bold text-right text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={99}
                          value={r.marginPct !== undefined ? r.marginPct : profitPct}
                          onChange={(e) => updateWeldingInstallationRow(r.id, 'marginPct', Number(e.target.value))}
                          className="w-14 px-1.5 py-1 text-xs font-black text-center text-emerald-700 bg-emerald-50 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                        <span className="text-[11px] font-bold text-slate-500">%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600 text-xs">₹</span>
                        <input
                          type="number"
                          value={unitPrice}
                          onChange={(e) => updateWeldingInstallationRow(r.id, 'unitPrice', Number(e.target.value))}
                          className="w-full pl-6 pr-2 py-1 text-xs font-extrabold text-right text-emerald-700 bg-emerald-50/50 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-emerald-900 text-sm">
                      ₹{formatMoney(rowTotalPrice)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => removeWeldingInstallationRow(r.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td colSpan={2} className="py-3 px-4 text-right uppercase text-xs tracking-wider">
                  Installation Total
                </td>
                <td className="py-3 px-4 text-right text-slate-700 font-bold">
                  ₹{formatMoney(weldingInstallationTotalCost)}
                </td>
                <td className="py-3 px-4 text-center text-emerald-700 font-bold">
                  {profitPct}%
                </td>
                <td className="py-3 px-4 text-right text-slate-500 text-[11px] font-semibold">
                  Subtotal
                </td>
                <td className="py-3 px-4 text-right text-emerald-900 text-sm font-black">
                  ₹{formatMoney(weldingInstallationTotalPrice)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bottom Add Row Bar */}
        <div className="p-3.5 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Add custom calibration runs, test bench commissioning or technician mandays
          </span>
          <button
            type="button"
            onClick={addWeldingInstallationRow}
            className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-300 rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-emerald-700" /> + Add Installation Deliverable Row
          </button>
        </div>
      </div>

      {/* STEP 5: SUMMARY SHEET */}
      <div className="bg-slate-900 text-white rounded-3xl border-2 border-slate-900 shadow-2xl overflow-hidden">
        <div className="p-5 px-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Receipt className="h-6 w-6 text-emerald-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-lg">
                  Step 5
                </span>
                <h3 className="font-extrabold text-white text-base">
                  Summary Sheet
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Consolidated Quotation Breakdown &amp; Customer Package Cost
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Grand Total Quotation
            </span>
            <span className="text-2xl font-black text-emerald-400">
              ₹{formatMoney(weldingGrandTotal)}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-800 pb-2">
                Deliverables Breakdown
              </h4>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">1. Hardware and Development Charges</span>
                <span className="font-bold text-amber-300">₹{formatMoney(weldingHardwareTotalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">2. Software Development</span>
                <span className="font-bold text-indigo-300">₹{formatMoney(weldingSoftwareTotalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">3. Cloud Charges (Yearly)</span>
                <span className="font-bold text-purple-300">₹{formatMoney(weldingCloudTotalYearly)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">4. Installation Charges</span>
                <span className="font-bold text-emerald-300">₹{formatMoney(weldingInstallationTotalPrice)}</span>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-xs font-extrabold">
                <span className="text-white">Subtotal Price (Steps 1-4)</span>
                <span className="text-emerald-400 text-sm">₹{formatMoney(weldingSteps1To4TotalPrice)}</span>
              </div>
            </div>

            <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 border-b border-slate-800 pb-2">
                  Pricing Buffer & Final Package
                </h4>
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">Quote Buffer Percentage</label>
                    <p className="text-[11px] text-slate-500">Contingency buffer applied on top of subtotal</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={bufferPct}
                      onChange={(e) => setBufferPct(Number(e.target.value))}
                      className="w-12 text-center font-black text-amber-400 bg-transparent focus:outline-none text-sm"
                    />
                    <span className="text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs mt-3">
                  <span className="text-slate-400">Buffer Amount ({bufferPct}%)</span>
                  <span className="font-bold text-amber-400">+ ₹{formatMoney(weldingBufferAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-slate-400">Price with Buffer</span>
                  <span className="font-bold text-slate-200">₹{formatMoney(weldingPriceWithBuffer)}</span>
                </div>
              </div>

              <div className="bg-emerald-950/80 border border-emerald-500/40 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 block">
                    Final Customer Quotation (Kit Cost)
                  </span>
                  <span className="text-xs text-slate-300">Rounded to nearest ₹100</span>
                </div>
                <span className="text-2xl font-black text-emerald-300">
                  ₹{formatMoney(weldingGrandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

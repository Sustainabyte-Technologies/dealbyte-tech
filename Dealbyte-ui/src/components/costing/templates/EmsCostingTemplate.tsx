import React from 'react';
import {
  Layers,
  RotateCcw,
  Plus,
  Trash2,
  Receipt,
  Cpu,
} from 'lucide-react';
import {
  EmsHardwareRow,
  EmsPlatformRow,
  EmsRecurringRow,
} from '../types';
import { formatMoney, calcPriceFromCost, roundToHundred } from '../utils';
import { AirAuditManpowerEngine, AirAuditManpowerEngineProps } from '../shared/AirAuditManpowerEngine';

export interface EmsCostingTemplateProps extends AirAuditManpowerEngineProps {
  activeSubServiceName: string;
  emsGatewayHardwareRows: EmsHardwareRow[];
  updateEmsGatewayHardwareRow: (id: string, field: keyof EmsHardwareRow, val: any) => void;
  addEmsGatewayHardwareRow: () => void;
  removeEmsGatewayHardwareRow: (id: string) => void;
  emsGatewayHardwareTotalCost: number;
  emsGatewayHardwareTotalPrice: number;
  emsElectricalHardwareRows: EmsHardwareRow[];
  updateEmsElectricalHardwareRow: (id: string, field: keyof EmsHardwareRow, val: any) => void;
  addEmsElectricalHardwareRow: () => void;
  removeEmsElectricalHardwareRow: (id: string) => void;
  emsElectricalHardwareTotalCost: number;
  emsElectricalHardwareTotalPrice: number;
  emsHardwareTotalCost: number;
  emsHardwareTotalPrice: number;
  emsPlatformRows: EmsPlatformRow[];
  updateEmsPlatformRow: (id: string, field: keyof EmsPlatformRow, val: any) => void;
  addEmsPlatformRow: () => void;
  removeEmsPlatformRow: (id: string) => void;
  emsPlatformTotalCost: number;
  emsPlatformTotalPrice: number;
  emsRecurringRows: EmsRecurringRow[];
  updateEmsRecurringRow: (id: string, field: keyof EmsRecurringRow, val: any) => void;
  addEmsRecurringRow: () => void;
  removeEmsRecurringRow: (id: string) => void;
  emsRecurringMonthlyTotalCost: number;
  emsRecurringMonthlyTotalPrice: number;
  emsRecurringYearlyTotalCost: number;
  emsRecurringYearlyTotalPrice: number;
  emsSteps1To4TotalPrice: number;
  emsBufferAmount: number;
  emsPriceWithBuffer: number;
  emsRoundedCustomerCost: number;
  bufferPct: number;
  setBufferPct: (pct: number) => void;
  resetEmsDefaults: () => void;
}

export const EmsCostingTemplate: React.FC<EmsCostingTemplateProps> = (props) => {
  const {
    activeSubServiceName,
    emsGatewayHardwareRows,
    updateEmsGatewayHardwareRow,
    addEmsGatewayHardwareRow,
    removeEmsGatewayHardwareRow,
    emsGatewayHardwareTotalCost,
    emsGatewayHardwareTotalPrice,
    emsElectricalHardwareRows,
    updateEmsElectricalHardwareRow,
    addEmsElectricalHardwareRow,
    removeEmsElectricalHardwareRow,
    emsElectricalHardwareTotalCost,
    emsElectricalHardwareTotalPrice,
    emsHardwareTotalCost,
    emsHardwareTotalPrice,
    emsPlatformRows,
    updateEmsPlatformRow,
    addEmsPlatformRow,
    removeEmsPlatformRow,
    emsPlatformTotalCost,
    emsPlatformTotalPrice,
    emsRecurringRows,
    updateEmsRecurringRow,
    addEmsRecurringRow,
    removeEmsRecurringRow,
    emsRecurringMonthlyTotalCost,
    emsRecurringMonthlyTotalPrice,
    emsRecurringYearlyTotalCost,
    emsRecurringYearlyTotalPrice,
    emsSteps1To4TotalPrice,
    emsBufferAmount,
    emsPriceWithBuffer,
    emsRoundedCustomerCost,
    bufferPct,
    setBufferPct,
    resetEmsDefaults,
    profitPct,
  } = props;

  // Calculate itemized rows for Step 5 Table
  const step5Items = [
    // Gateway Hardware
    ...emsGatewayHardwareRows.map((r, i) => {
      const cost = r.qty * r.unitCost;
      const price = r.qty * calcPriceFromCost(r.unitCost, r.marginPct);
      const contingency = price * (1 + bufferPct / 100);
      const rounded = roundToHundred(contingency);
      return {
        stepNo: r.code || `1${String.fromCharCode(97 + i)}`,
        description: r.description,
        qty: r.qty,
        uom: r.uom || 'Nos',
        cost,
        price,
        contingency,
        rounded,
        isRecurring: false,
      };
    }),
    // Electrical Hardware
    ...emsElectricalHardwareRows.map((r, i) => {
      const cost = r.qty * r.unitCost;
      const price = r.qty * calcPriceFromCost(r.unitCost, r.marginPct);
      const contingency = price * (1 + bufferPct / 100);
      const rounded = roundToHundred(contingency);
      return {
        stepNo: r.code || `2${String.fromCharCode(97 + i)}`,
        description: r.description,
        qty: r.qty,
        uom: r.uom || 'Nos',
        cost,
        price,
        contingency,
        rounded,
        isRecurring: false,
      };
    }),
    // Step 2 Manpower / Installation & Commissioning
    {
      stepNo: '2',
      description:
        'Installation and commissioning of IoT devices, gateways, modems, and associated electrical/control components including startup, testing, and functional verification. Communication cable laying and routing through conduits, cable trays, and raceways with proper dressing, tagging, and termination. Conduit pipe laying for electrical and communication cabling as per site layout. Modem configuration, network setup, data mapping, testing, troubleshooting, and data validation',
      qty: 1,
      uom: 'Nodes',
      cost: props.emsManpowerTotalCost,
      price: props.emsManpowerTotalPrice,
      contingency: props.emsManpowerTotalPrice * (1 + bufferPct / 100),
      rounded: roundToHundred(props.emsManpowerTotalPrice * (1 + bufferPct / 100)),
      isRecurring: false,
    },
    // Step 3 Platform Setup
    ...emsPlatformRows.map((r) => {
      const cost = r.qty * r.unitCost;
      const price = r.qty * calcPriceFromCost(r.unitCost, r.marginPct);
      const contingency = price * (1 + bufferPct / 100);
      const rounded = roundToHundred(contingency);
      return {
        stepNo: '3',
        description: r.description,
        qty: r.qty,
        uom: r.uom || 'Nodes',
        cost,
        price,
        contingency,
        rounded,
        isRecurring: false,
      };
    }),
    // Step 4 Recurring Cloud
    ...emsRecurringRows.map((r, i) => {
      const cost = r.qty * Number(r.unitCostPerMonth || 0) * 12;
      const price = r.qty * calcPriceFromCost(Number(r.unitCostPerMonth || 0), r.marginPct) * 12;
      const contingency = price * (1 + bufferPct / 100);
      const rounded = roundToHundred(contingency);
      return {
        stepNo: r.code || `1${String.fromCharCode(97 + i)}`,
        description: r.description,
        qty: r.qty,
        uom: r.uom || 'Nodes',
        cost,
        price,
        contingency,
        rounded,
        isRecurring: true,
      };
    }),
  ];

  const totalStep5CustomerPrice = step5Items.reduce((sum, item) => sum + item.rounded, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner for EMS Template */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-purple-800/50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-400/30 text-purple-300">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase">
                IoT &amp; Controls Engine
              </span>
              <h2 className="text-xl font-black tracking-tight">{activeSubServiceName}</h2>
            </div>
            <p className="text-xs text-purple-200 mt-1">
              5-Step Industrial IoT &amp; Energy Management System Interactive Costing Engine
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetEmsDefaults}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-sm transition-all border border-white/20 cursor-pointer self-start md:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5 text-purple-300" /> Reset IoT &amp; Controls Defaults
        </button>
      </div>

      {/* STEP 1: GATEWAY & ELECTRICAL HARDWARE MATRIX */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 px-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="h-5 w-5 text-purple-600" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md">
                  Step 1
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Gateway &amp; Electrical Hardware Costing Matrix
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Sustainabyte Edge Gateway, Modbus/RS485 meters, cable routing &amp; electrical accessories
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Hardware Total Price
            </span>
            <span className="text-sm font-black text-purple-900">
              ₹{formatMoney(emsHardwareTotalPrice)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 font-extrabold text-[11px]">
                <th className="p-2.5 px-3 w-12 text-center">Code</th>
                <th className="p-2.5 px-4 w-1/4">Category</th>
                <th className="p-2.5 px-4 w-1/3">Hardware Description</th>
                <th className="p-2.5 px-3 text-center">Qty</th>
                <th className="p-2.5 px-3 text-center">UoM</th>
                <th className="p-2.5 px-3 text-right">Unit Cost (₹)</th>
                <th className="p-2.5 px-3 text-right font-bold text-slate-900 bg-slate-200/60">Total Cost (₹)</th>
                <th className="p-2.5 px-3 text-center">Margin %</th>
                <th className="p-2.5 px-4 text-right font-black bg-purple-100/70 text-purple-950">Selling Price (₹)</th>
                <th className="p-2.5 px-2 text-center w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {/* Section 1A: Gateway Hardware */}
              <tr className="bg-purple-50/40 text-purple-950 font-bold border-b border-purple-100">
                <td colSpan={10} className="p-2 px-4 text-[11px] uppercase tracking-wider">
                  1. Sustainabyte Edge IoT Gateway Hardware
                </td>
              </tr>
              {emsGatewayHardwareRows.map((row) => {
                const totalCost = row.qty * row.unitCost;
                const sellingPrice = Math.round(row.qty * calcPriceFromCost(row.unitCost, row.marginPct));

                return (
                  <tr key={row.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="p-2 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                      {row.code}
                    </td>
                    <td className="p-2 px-4 border-r border-slate-200 font-semibold text-slate-700">
                      {row.category}
                    </td>
                    <td className="p-2 px-4 border-r border-slate-200 font-bold text-slate-900">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => updateEmsGatewayHardwareRow(row.id, 'description', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={1}
                        value={row.qty}
                        onChange={(e) => updateEmsGatewayHardwareRow(row.id, 'qty', Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center text-slate-600 font-semibold">
                      {row.uom}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        min={0}
                        value={row.unitCost}
                        onChange={(e) => updateEmsGatewayHardwareRow(row.id, 'unitCost', Number(e.target.value))}
                        className="w-20 text-right bg-slate-50 border border-slate-200 rounded px-1.5 py-1 font-semibold text-slate-900"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-bold text-slate-900 bg-slate-50">
                      {formatMoney(totalCost)}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={row.marginPct}
                        onChange={(e) => updateEmsGatewayHardwareRow(row.id, 'marginPct', Number(e.target.value))}
                        className="w-12 text-center bg-purple-50 border border-purple-200 rounded px-1 py-1 font-bold text-purple-900 text-xs"
                      />
                    </td>
                    <td className="p-2 px-4 text-right font-black text-purple-950 bg-purple-50/60">
                      ₹{formatMoney(sellingPrice)}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeEmsGatewayHardwareRow(row.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              <tr className="bg-slate-50">
                <td colSpan={10} className="p-2 px-4 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={addEmsGatewayHardwareRow}
                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 shadow-2xs cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Gateway Hardware
                  </button>
                </td>
              </tr>

              {/* Section 1B: Electrical Hardware */}
              <tr className="bg-indigo-50/40 text-indigo-950 font-bold border-b border-indigo-100">
                <td colSpan={10} className="p-2 px-4 text-[11px] uppercase tracking-wider">
                  2. Electrical Hardware &amp; Accessories
                </td>
              </tr>
              {emsElectricalHardwareRows.map((row) => {
                const totalCost = row.qty * row.unitCost;
                const sellingPrice = Math.round(row.qty * calcPriceFromCost(row.unitCost, row.marginPct));

                return (
                  <tr key={row.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="p-2 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                      {row.code}
                    </td>
                    <td className="p-2 px-4 border-r border-slate-200 font-semibold text-slate-700">
                      {row.category}
                    </td>
                    <td className="p-2 px-4 border-r border-slate-200 font-bold text-slate-900">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => updateEmsElectricalHardwareRow(row.id, 'description', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={1}
                        value={row.qty}
                        onChange={(e) => updateEmsElectricalHardwareRow(row.id, 'qty', Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center text-slate-600 font-semibold">
                      {row.uom}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        min={0}
                        value={row.unitCost}
                        onChange={(e) => updateEmsElectricalHardwareRow(row.id, 'unitCost', Number(e.target.value))}
                        className="w-20 text-right bg-slate-50 border border-slate-200 rounded px-1.5 py-1 font-semibold text-slate-900"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-bold text-slate-900 bg-slate-50">
                      {formatMoney(totalCost)}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={row.marginPct}
                        onChange={(e) => updateEmsElectricalHardwareRow(row.id, 'marginPct', Number(e.target.value))}
                        className="w-12 text-center bg-indigo-50 border border-indigo-200 rounded px-1 py-1 font-bold text-indigo-900 text-xs"
                      />
                    </td>
                    <td className="p-2 px-4 text-right font-black text-indigo-950 bg-indigo-50/60">
                      ₹{formatMoney(sellingPrice)}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeEmsElectricalHardwareRow(row.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              <tr className="bg-slate-50">
                <td colSpan={10} className="p-2 px-4 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={addEmsElectricalHardwareRow}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 shadow-2xs cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Electrical Hardware
                  </button>
                </td>
              </tr>

              {/* Step 1 Subtotal Row */}
              <tr className="bg-purple-900 text-white font-extrabold text-xs">
                <td colSpan={6} className="p-3 px-6 text-right uppercase tracking-wider">
                  Step 1 Total Hardware Cost &amp; Selling Price
                </td>
                <td className="p-3 px-3 text-right font-black text-amber-400 bg-purple-950 text-sm border-r border-purple-800">
                  Cost: ₹{formatMoney(emsHardwareTotalCost)}
                </td>
                <td></td>
                <td className="p-3 px-4 text-right font-black text-emerald-400 bg-slate-950 text-sm">
                  Price: ₹{formatMoney(emsHardwareTotalPrice)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* STEP 2: INSTALLATION & COMMISSIONING (AIR AUDIT MANPOWER ENGINE) */}
      <AirAuditManpowerEngine
        {...props}
        stepNumber="Step 2"
        stepTitle="Installation, Commissioning &amp; Site Engineering Scope"
        stepSubtitle="On-site IoT gateway deployment, CT/Meter termination, cable laying &amp; cloud telemetry testing"
      />

      {/* STEP 3: PLATFORM SETUP COSTING */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 px-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-emerald-600" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md">
                  Step 3
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Platform Setup Costing (One-Time)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Dashboard tenant mapping, Modbus register configuration, alarms &amp; reports setup
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Platform Total Price
            </span>
            <span className="text-sm font-black text-emerald-900">
              ₹{formatMoney(emsPlatformTotalPrice)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 font-extrabold text-[11px]">
                <th className="p-2.5 px-4 w-1/2">Deliverables Description</th>
                <th className="p-2.5 px-3 text-center">Qty</th>
                <th className="p-2.5 px-3 text-center">UoM</th>
                <th className="p-2.5 px-3 text-right">Unit Cost (₹)</th>
                <th className="p-2.5 px-3 text-right font-bold text-slate-900 bg-slate-200/60">Total Cost (₹)</th>
                <th className="p-2.5 px-3 text-center">Margin %</th>
                <th className="p-2.5 px-4 text-right font-black bg-emerald-100/70 text-emerald-950">Selling Price (₹)</th>
                <th className="p-2.5 px-2 text-center w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {emsPlatformRows.map((row) => {
                const totalCost = row.qty * row.unitCost;
                const sellingPrice = Math.round(row.qty * calcPriceFromCost(row.unitCost, row.marginPct));

                return (
                  <tr key={row.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="p-2 px-4 border-r border-slate-200 font-bold text-slate-900">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => updateEmsPlatformRow(row.id, 'description', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={1}
                        value={row.qty}
                        onChange={(e) => updateEmsPlatformRow(row.id, 'qty', Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center text-slate-600 font-semibold">
                      {row.uom}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        min={0}
                        value={row.unitCost}
                        onChange={(e) => updateEmsPlatformRow(row.id, 'unitCost', Number(e.target.value))}
                        className="w-20 text-right bg-slate-50 border border-slate-200 rounded px-1.5 py-1 font-semibold text-slate-900"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-bold text-slate-900 bg-slate-50">
                      {formatMoney(totalCost)}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={row.marginPct}
                        onChange={(e) => updateEmsPlatformRow(row.id, 'marginPct', Number(e.target.value))}
                        className="w-12 text-center bg-emerald-50 border border-emerald-200 rounded px-1 py-1 font-bold text-emerald-900 text-xs"
                      />
                    </td>
                    <td className="p-2 px-4 text-right font-black text-emerald-950 bg-emerald-50/60">
                      ₹{formatMoney(sellingPrice)}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeEmsPlatformRow(row.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              <tr className="bg-slate-50">
                <td colSpan={8} className="p-2 px-4 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={addEmsPlatformRow}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-all border border-emerald-200 shadow-2xs cursor-pointer"
                  >
                    <Plus className="h-4 w-4 text-emerald-600" /> + Add Platform Setup Item
                  </button>
                </td>
              </tr>

              <tr className="bg-emerald-900 text-white font-extrabold text-xs">
                <td colSpan={4} className="p-3 px-6 text-right uppercase tracking-wider">
                  Step 3 Total Platform Setup Cost &amp; Price
                </td>
                <td className="p-3 px-3 text-right font-black text-amber-400 bg-emerald-950 text-sm border-r border-emerald-800">
                  Cost: ₹{formatMoney(emsPlatformTotalCost)}
                </td>
                <td></td>
                <td className="p-3 px-4 text-right font-black text-emerald-300 bg-slate-950 text-sm">
                  Price: ₹{formatMoney(emsPlatformTotalPrice)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* STEP 4: RECURRING CLOUD CHARGES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 px-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-purple-600" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md">
                  Step 4
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Recurring Cloud Charges (Annualized Billing)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                GSM SIM data packs, cloud server hosting, automated reporting &amp; SMS alerts
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Recurring Yearly Price
            </span>
            <span className="text-sm font-black text-purple-900">
              ₹{formatMoney(emsRecurringYearlyTotalPrice)} /yr
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 font-extrabold text-[11px]">
                <th className="p-2.5 px-3 w-12 text-center">Code</th>
                <th className="p-2.5 px-4 w-1/3">Recurring Feature Description</th>
                <th className="p-2.5 px-3 text-center">Qty</th>
                <th className="p-2.5 px-3 text-center">UoM</th>
                <th className="p-2.5 px-3 text-right">Cost/Mo (₹)</th>
                <th className="p-2.5 px-3 text-center">Margin %</th>
                <th className="p-2.5 px-3 text-right">Price/Mo (₹)</th>
                <th className="p-2.5 px-3 text-right font-bold text-slate-900 bg-slate-200/60">Yearly Cost (₹)</th>
                <th className="p-2.5 px-4 text-right font-black bg-purple-100/70 text-purple-950">Yearly Price (₹)</th>
                <th className="p-2.5 px-2 text-center w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {emsRecurringRows.map((row) => {
                const costPerMonth = Number(row.unitCostPerMonth || 0);
                const pricePerMonth = Math.round(calcPriceFromCost(costPerMonth, row.marginPct));
                const yearlyCost = costPerMonth * row.qty * 12;
                const yearlyPrice = pricePerMonth * row.qty * 12;

                return (
                  <tr key={row.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="p-2 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                      {row.code}
                    </td>
                    <td className="p-2 px-4 border-r border-slate-200 font-bold text-slate-900">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) => updateEmsRecurringRow(row.id, 'description', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={1}
                        value={row.qty}
                        onChange={(e) => updateEmsRecurringRow(row.id, 'qty', Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center text-slate-600 font-semibold">
                      {row.uom}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        min={0}
                        value={row.unitCostPerMonth}
                        onChange={(e) => updateEmsRecurringRow(row.id, 'unitCostPerMonth', Number(e.target.value))}
                        className="w-20 text-right bg-slate-50 border border-slate-200 rounded px-1.5 py-1 font-semibold text-slate-900"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={row.marginPct}
                        onChange={(e) => updateEmsRecurringRow(row.id, 'marginPct', Number(e.target.value))}
                        className="w-12 text-center bg-purple-50 border border-purple-200 rounded px-1 py-1 font-bold text-purple-900 text-xs"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-bold text-purple-900">
                      ₹{formatMoney(pricePerMonth * row.qty)}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-bold text-slate-900 bg-slate-50">
                      {formatMoney(yearlyCost)}
                    </td>
                    <td className="p-2 px-4 text-right font-black text-purple-950 bg-purple-50/60">
                      ₹{formatMoney(yearlyPrice)}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeEmsRecurringRow(row.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              <tr className="bg-slate-50">
                <td colSpan={10} className="p-2 px-4 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={addEmsRecurringRow}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl transition-all border border-purple-200 shadow-2xs cursor-pointer"
                  >
                    <Plus className="h-4 w-4 text-purple-600" /> + Add Recurring Item
                  </button>
                </td>
              </tr>

              <tr className="bg-slate-900 text-white border-t-2 border-slate-950 font-extrabold text-xs">
                <td colSpan={7} className="p-3.5 px-6 text-right uppercase tracking-wider">
                  Step 4 Total Recurring Cost/Year &amp; Selling Price/Year (+{profitPct}% Margin)
                </td>
                <td className="p-3.5 px-3 text-right font-black text-amber-400 bg-slate-950 text-sm border-r border-slate-800">
                  Cost/Yr: ₹{formatMoney(emsRecurringYearlyTotalCost)}
                </td>
                <td className="p-3.5 px-4 text-right font-black text-emerald-400 bg-purple-950 text-sm">
                  Price/Yr: ₹{formatMoney(emsRecurringYearlyTotalPrice)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* STEP 5: TOTAL PRICE SUMMARY (STEPS 1-4 ITEMIZED BREAKDOWN TABLE) */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header banner matching reference */}
        <div className="p-4 px-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-md">
              Step 5
            </span>
            <h3 className="font-extrabold text-white text-sm md:text-base tracking-wide uppercase">
              TOTAL PRICE SUMMARY (STEPS 1–4 ITEMIZED BREAKDOWN)
            </h3>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1">
              <span className="text-xs font-bold text-slate-300">Contingency:</span>
              <input
                type="number"
                min={0}
                max={100}
                value={bufferPct}
                onChange={(e) => setBufferPct(Number(e.target.value))}
                className="w-10 text-center font-black text-emerald-400 bg-transparent focus:outline-none text-xs"
              />
              <span className="text-xs font-bold text-slate-400">%</span>
            </div>
            <div className="bg-emerald-950/80 border border-emerald-500/50 px-4 py-1 rounded-full flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400">Total Price:</span>
              <span className="text-sm font-black text-emerald-300">
                ₹{formatMoney(totalStep5CustomerPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Table Breakdown in Clean White Background */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse bg-white">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b-2 border-slate-900 font-extrabold text-[11px]">
                <th className="p-3 px-3 text-center w-16 border-r border-slate-200">Step No</th>
                <th className="p-3 px-4 w-2/5 border-r border-slate-200">Item Description</th>
                <th className="p-3 px-3 text-center border-r border-slate-200">Qty</th>
                <th className="p-3 px-3 text-center border-r border-slate-200">UoM</th>
                <th className="p-3 px-3 text-right border-r border-slate-200">Total Cost in INR</th>
                <th className="p-3 px-3 text-right border-r border-slate-200">Total Price in INR</th>
                <th className="p-3 px-3 text-right bg-amber-50/70 text-amber-900 border-r border-slate-200">
                  Contingency ({bufferPct}%)
                </th>
                <th className="p-3 px-3 text-right bg-slate-50 text-slate-900 border-r border-slate-200">
                  Rounded Price
                </th>
                <th className="p-3 px-4 text-right font-black bg-emerald-50 text-emerald-800">
                  Customer Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium bg-white">
              {step5Items.map((item, idx) => (
                <tr key={`s5_${idx}`} className="hover:bg-slate-50/80 transition-colors bg-white">
                  <td className="p-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">
                    {item.stepNo}
                  </td>
                  <td className="p-2.5 px-4 font-semibold text-slate-900 border-r border-slate-200 leading-relaxed text-[11px]">
                    {item.description}
                  </td>
                  <td className="p-2.5 px-3 text-center font-bold text-slate-900 border-r border-slate-200">
                    {item.qty}
                  </td>
                  <td className="p-2.5 px-3 text-center text-slate-600 font-medium border-r border-slate-200">
                    {item.uom}
                  </td>
                  <td className="p-2.5 px-3 text-right font-semibold text-slate-700 border-r border-slate-200">
                    ₹{formatMoney(item.cost)}
                  </td>
                  <td className="p-2.5 px-3 text-right font-bold text-slate-900 border-r border-slate-200">
                    ₹{formatMoney(item.price)}
                  </td>
                  <td className="p-2.5 px-3 text-right font-bold text-amber-900 bg-amber-50/50 border-r border-slate-200">
                    ₹{formatMoney(item.contingency)}
                  </td>
                  <td className="p-2.5 px-3 text-right font-bold text-slate-900 bg-slate-50/50 border-r border-slate-200">
                    ₹{formatMoney(item.rounded)}
                  </td>
                  <td className="p-2.5 px-4 text-right font-black text-emerald-700 bg-emerald-50/60">
                    ₹{formatMoney(item.rounded)}{item.isRecurring ? ' /yr' : ''}
                  </td>
                </tr>
              ))}

              {/* Bottom Summary Bar */}
              <tr className="bg-slate-50 text-slate-900 border-t-2 border-slate-900 font-black text-sm">
                <td colSpan={8} className="p-4 px-6 text-right uppercase tracking-wider text-slate-900 font-black">
                  TOTAL PRICE
                </td>
                <td className="p-4 px-5 text-right font-black text-emerald-800 text-base bg-emerald-100/80 border-l border-emerald-300">
                  ₹{formatMoney(totalStep5CustomerPrice)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

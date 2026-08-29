'use client';

import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Plus,
  Trash2,
  Receipt,
  Cpu,
  Zap,
  Percent,
  HardHat,
  Cloud,
  Layers,
} from 'lucide-react';
import { CpmHardwareRow, CpmOnPremiseRow, CpmCloudChargeRow } from '../types';
import { formatMoney, calcPriceFromCost } from '../utils';
import { AirAuditManpowerEngine, AirAuditManpowerEngineProps } from '../shared/AirAuditManpowerEngine';
import { SearchableSelect, SearchableOption } from '../shared/SearchableSelect';
import {
  INITIAL_CPM_HARDWARE_ROWS,
  INITIAL_CPM_ELECTRICAL_ROWS,
  INITIAL_CPM_ON_PREMISE_ROWS,
  INITIAL_CPM_CLOUD_CHARGE_ROWS,
  getActiveGatewayHardwareCatalog,
  getActiveElectricalHardwareCatalog,
} from '../constants';

export interface CpmCostingTemplateProps {
  activeSubServiceName: string;

  // Step 1: Hardware Capex
  cpmHardwareRows: CpmHardwareRow[];
  updateCpmHardwareRow: (id: string, field: keyof CpmHardwareRow, val: any) => void;
  addCpmHardwareRow: (preset?: Partial<CpmHardwareRow>) => void;
  removeCpmHardwareRow: (id: string) => void;
  cpmHardwareTotalCost: number;
  cpmHardwareTotalPrice: number;

  // Step 2: Electrical Consumables
  cpmElectricalRows: CpmHardwareRow[];
  updateCpmElectricalRow: (id: string, field: keyof CpmHardwareRow, val: any) => void;
  addCpmElectricalRow: (preset?: Partial<CpmHardwareRow>) => void;
  removeCpmElectricalRow: (id: string) => void;
  cpmElectricalTotalCost: number;
  cpmElectricalTotalPrice: number;

  // Step 3: Commissioning & Site Engineering Engine Props
  cpmCommissioningProps: AirAuditManpowerEngineProps;
  cpmCommissioningTotalCost: number;
  cpmCommissioningTotalPrice: number;

  // Step 4: Installation Charges Engine Props
  cpmInstallationProps: AirAuditManpowerEngineProps;
  cpmInstManpowerTotalCost: number;
  cpmInstManpowerTotalPrice: number;

  // Step 5: On-Premise Application Charges
  cpmOnPremiseRows: CpmOnPremiseRow[];
  updateCpmOnPremiseRow: (id: string, field: keyof CpmOnPremiseRow, val: any) => void;
  addCpmOnPremiseRow: (preset?: Partial<CpmOnPremiseRow>) => void;
  removeCpmOnPremiseRow: (id: string) => void;
  cpmOnPremiseTotalCost: number;
  cpmOnPremiseTotalPrice: number;

  // Step 6: Cloud Charges
  cpmCloudChargeRows: CpmCloudChargeRow[];
  updateCpmCloudChargeRow: (id: string, field: keyof CpmCloudChargeRow, val: any) => void;
  addCpmCloudChargeRow: (preset?: Partial<CpmCloudChargeRow>) => void;
  removeCpmCloudChargeRow: (id: string) => void;
  cpmCloudChargeTotalCost: number;
  cpmCloudChargeTotalPrice: number;

  // Consolidated Math
  cpmSteps1To6TotalPrice?: number;
  cpmSteps1To5TotalPrice?: number;
  cpmBufferAmount: number;
  cpmPriceWithBuffer: number;
  cpmRoundedCustomerCost: number;
  bufferPct: number;
  setBufferPct: (pct: number) => void;
  profitPct: number;
  setProfitPct?: (pct: number) => void;
  resetCpmDefaults: () => void;
  applyCpmGlobalMargin?: (marginPct: number) => void;
  roundingNearest?: number;
  setRoundingNearest?: (val: number) => void;
}

export const CpmCostingTemplate: React.FC<CpmCostingTemplateProps> = (props) => {
  const {
    activeSubServiceName,
    cpmHardwareRows,
    updateCpmHardwareRow,
    addCpmHardwareRow,
    removeCpmHardwareRow,
    cpmHardwareTotalCost,
    cpmHardwareTotalPrice,
    cpmElectricalRows,
    updateCpmElectricalRow,
    addCpmElectricalRow,
    removeCpmElectricalRow,
    cpmElectricalTotalCost,
    cpmElectricalTotalPrice,
    cpmCommissioningProps,
    cpmCommissioningTotalCost,
    cpmCommissioningTotalPrice,
    cpmInstallationProps,
    cpmInstManpowerTotalCost,
    cpmInstManpowerTotalPrice,
    cpmOnPremiseRows = INITIAL_CPM_ON_PREMISE_ROWS,
    updateCpmOnPremiseRow,
    addCpmOnPremiseRow,
    removeCpmOnPremiseRow,
    cpmOnPremiseTotalCost = 0,
    cpmOnPremiseTotalPrice = 0,
    cpmCloudChargeRows = INITIAL_CPM_CLOUD_CHARGE_ROWS,
    updateCpmCloudChargeRow,
    addCpmCloudChargeRow,
    removeCpmCloudChargeRow,
    cpmCloudChargeTotalCost = 0,
    cpmCloudChargeTotalPrice = 0,
    cpmSteps1To6TotalPrice,
    cpmSteps1To5TotalPrice,
    cpmBufferAmount,
    cpmPriceWithBuffer,
    cpmRoundedCustomerCost,
    bufferPct,
    setBufferPct,
    resetCpmDefaults,
    applyCpmGlobalMargin,
    profitPct,
  } = props;

  const [localRoundingNearest, setLocalRoundingNearest] = useState<number>(100);
  const roundingNearest = props.roundingNearest !== undefined ? props.roundingNearest : localRoundingNearest;
  const setRoundingNearest = props.setRoundingNearest || setLocalRoundingNearest;

  const [quickMargin, setQuickMargin] = useState<number>(profitPct || 40);

  // Hardware search catalog options
  const hardwareOptions: SearchableOption[] = useMemo(() => {
    const defaultCatalog = INITIAL_CPM_HARDWARE_ROWS.map((item) => ({
      label: item.itemDescription,
      subtitle: item.modelNo ? `${item.brand} | Model: ${item.modelNo}` : item.brand,
      value: item.itemDescription,
      price: item.unitCost,
      uom: item.uom || 'Nos',
      category: 'Chiller Management',
    }));

    const gatewayCatalog = getActiveGatewayHardwareCatalog().map((item) => ({
      label: item.name,
      subtitle: item.description,
      value: item.description,
      price: item.unitCost,
      uom: item.uom,
      category: item.category,
    }));

    return [...defaultCatalog, ...gatewayCatalog];
  }, []);

  // Electrical consumables search options
  const electricalOptions: SearchableOption[] = useMemo(() => {
    const defaultElectrical = INITIAL_CPM_ELECTRICAL_ROWS.map((item) => ({
      label: item.itemDescription,
      subtitle: item.modelNo ? `${item.brand} | Model: ${item.modelNo}` : item.brand || 'Electrical Consumable',
      value: item.itemDescription,
      price: item.unitCost,
      uom: item.uom || 'Mtr',
      category: 'Electrical Hardware',
    }));

    const electricalCatalog = getActiveElectricalHardwareCatalog().map((item) => ({
      label: item.name,
      subtitle: item.description,
      value: item.description,
      price: item.unitCost,
      uom: item.uom,
      category: item.category,
    }));

    return [...defaultElectrical, ...electricalCatalog];
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-cyan-700/30">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/20 text-cyan-300 rounded-xl border border-cyan-400/30">
              <Cpu className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Chiller Plant Management (CPM) Costing Engine
            </h2>
            <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
              {activeSubServiceName || 'CPM'}
            </span>
          </div>
          <p className="text-xs text-cyan-100/80 font-medium">
            Complete 6-Step Integrated Costing Engine: Hardware Capex + Electrical Consumables + Site Commissioning + Installation Charges + On-Premise Application + Cloud Charges.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick Apply Global Margin */}
          <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 px-2 border border-white/20">
            <Percent className="h-3.5 w-3.5 text-cyan-300 mr-1.5" />
            <span className="text-xs font-bold text-cyan-100 mr-2">Margin:</span>
            <input
              type="number"
              min={0}
              max={100}
              value={quickMargin}
              onChange={(e) => setQuickMargin(Number(e.target.value))}
              className="w-12 text-center bg-white/20 border border-white/30 rounded-lg text-white font-black text-xs py-1 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            <span className="text-xs font-bold text-cyan-200 ml-1 mr-2">%</span>
            <button
              type="button"
              onClick={() => {
                if (applyCpmGlobalMargin) {
                  applyCpmGlobalMargin(quickMargin);
                }
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-black text-xs px-2.5 py-1 rounded-lg transition-all shadow-sm cursor-pointer"
            >
              Apply
            </button>
          </div>

          {/* Reset to Model Defaults */}
          <button
            type="button"
            onClick={resetCpmDefaults}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-white/20 transition-all cursor-pointer shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* STEP 1: Hardware Capex (Chiller Plant Monitoring Hardware) */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 p-4 px-6 text-white flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-cyan-600 font-black text-sm flex items-center justify-center shadow-md">
              1
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" /> Step 1: Hardware Capex (Sensors, Server, DDC Panels &amp; Gateway)
              </h3>
              <p className="text-[11px] text-cyan-200 font-normal">
                Field Sensors, Temperature Sensors, Pressure Transmitters, Flow Switches, Server PC &amp; DDC IO Panels
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-slate-300">
              Total Hardware Cost:{' '}
              <span className="text-white font-black">₹{formatMoney(cpmHardwareTotalCost)}</span>
            </span>
            <span className="text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-lg shadow-sm">
              Selling Price: <span className="text-white font-black">₹{formatMoney(cpmHardwareTotalPrice)}</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="p-3 px-3 text-center border-r border-slate-200 w-12">S.No</th>
                <th className="p-3 px-3 border-r border-slate-200 w-32">Brand / Make</th>
                <th className="p-3 px-4 border-r border-slate-200 min-w-[260px]">Product / Item Description</th>
                <th className="p-3 px-3 border-r border-slate-200 w-32">Model No</th>
                <th className="p-3 px-2 text-center border-r border-slate-200 w-16">Qty</th>
                <th className="p-3 px-2 text-center border-r border-slate-200 w-16">UoM</th>
                <th className="p-3 px-3 text-right border-r border-slate-200 w-28">Unit Cost (₹)</th>
                <th className="p-3 px-3 text-right border-r border-slate-200 w-28">Total Cost (₹)</th>
                <th className="p-3 px-2 text-center border-r border-slate-200 w-16">Margin %</th>
                <th className="p-3 px-3 text-right border-r border-slate-200 w-32 bg-cyan-50/50 text-cyan-950">
                  Sustainabyte Price (₹)
                </th>
                <th className="p-3 px-2 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {cpmHardwareRows.map((row, index) => {
                const totalCost = row.qty * row.unitCost;
                const sustainabytePrice = Math.round(row.qty * calcPriceFromCost(row.unitCost, row.marginPct));

                return (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-2 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                      {index + 1}
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.brand}
                        onChange={(e) => updateCpmHardwareRow(row.id, 'brand', e.target.value)}
                        placeholder="Make/Brand..."
                        className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 font-semibold text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200">
                      <textarea
                        rows={Math.max(1, Math.ceil((row.itemDescription?.length || 1) / 38))}
                        value={row.itemDescription}
                        onChange={(e) => updateCpmHardwareRow(row.id, 'itemDescription', e.target.value)}
                        placeholder="Hardware description..."
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-cyan-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none resize-none leading-snug whitespace-pre-wrap text-xs"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.modelNo}
                        onChange={(e) => updateCpmHardwareRow(row.id, 'modelNo', e.target.value)}
                        placeholder="Model / Part No"
                        className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 font-mono text-slate-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.qty === 0 ? '' : row.qty}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmHardwareRow(row.id, 'qty', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-16 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-center">
                      <input
                        type="text"
                        value={row.uom || 'Nos'}
                        onChange={(e) => updateCpmHardwareRow(row.id, 'uom', e.target.value)}
                        className="w-14 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-semibold text-slate-700 text-xs focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.unitCost === 0 ? '' : row.unitCost}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmHardwareRow(row.id, 'unitCost', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-24 text-right bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-bold text-slate-800">
                      ₹{formatMoney(totalCost)}
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={row.marginPct ?? 40}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmHardwareRow(row.id, 'marginPct', Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-cyan-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-extrabold text-cyan-900 bg-cyan-50/40">
                      ₹{formatMoney(sustainabytePrice)}
                    </td>
                    <td className="p-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeCpmHardwareRow(row.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        title="Delete hardware row"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Add Buttons Bar */}
              <tr className="bg-slate-50">
                <td colSpan={11} className="p-3 px-4 border-b border-slate-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => addCpmHardwareRow()}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-3.5 py-2 rounded-xl border border-cyan-200 shadow-2xs cursor-pointer transition-all"
                    >
                      <Plus className="h-4 w-4" /> Add Hardware Row
                    </button>

                    <div className="w-80 max-w-full">
                      <SearchableSelect
                        options={hardwareOptions}
                        value=""
                        placeholder="+ Quick Search & Add Hardware..."
                        theme="blue"
                        onChange={(val, opt) => {
                          if (opt && val !== '__CUSTOM__') {
                            addCpmHardwareRow({
                              brand: opt.subtitle?.split(' | ')[0] || 'Standard',
                              itemDescription: opt.label,
                              modelNo: opt.subtitle?.includes('Model: ') ? opt.subtitle.split('Model: ')[1] : '',
                              unitCost: opt.price ?? 0,
                              uom: opt.uom || 'Nos',
                              qty: 0,
                              marginPct: 40,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>

              {/* Step 1 Subtotal Row */}
              <tr className="bg-slate-900 text-white font-extrabold text-xs">
                <td colSpan={7} className="p-3 px-6 text-right uppercase tracking-wider">
                  Step 1 Total Hardware Capex Cost &amp; Selling Price
                </td>
                <td className="p-3 px-3 text-right font-black text-slate-300 border-r border-slate-700">
                  ₹{formatMoney(cpmHardwareRows.reduce((sum, r) => sum + r.qty * r.unitCost, 0))}
                </td>
                <td></td>
                <td className="p-3 px-3 text-right font-black text-cyan-300 bg-slate-800 text-sm border-r border-slate-700">
                  ₹{formatMoney(cpmHardwareRows.reduce((sum, r) => sum + Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct ?? 40)), 0))}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* STEP 2: Electrical Consumables & Field Materials */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-4 px-6 text-white flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-600 font-black text-sm flex items-center justify-center shadow-md">
              2
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" /> Step 2: Electrical Consumables &amp; Field Installation Materials
              </h3>
              <p className="text-[11px] text-emerald-200 font-normal">
                RS485 Communication Cable, GI Perforated Trays, PVC Conduits, Brass Glands, Flexible Hoses &amp; Accessories
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-slate-300">
              Total Consumables Cost:{' '}
              <span className="text-white font-black">₹{formatMoney(cpmElectricalTotalCost)}</span>
            </span>
            <span className="text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-lg shadow-sm">
              Selling Price: <span className="text-white font-black">₹{formatMoney(cpmElectricalTotalPrice)}</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-50/70 text-emerald-950 font-extrabold border-b border-emerald-200 uppercase tracking-wider text-[10px]">
                <th className="p-3 px-3 text-center border-r border-emerald-200 w-12">S.No</th>
                <th className="p-3 px-3 border-r border-emerald-200 w-32">Brand / Make</th>
                <th className="p-3 px-4 border-r border-emerald-200 min-w-[260px]">Material Description</th>
                <th className="p-3 px-3 border-r border-emerald-200 w-32">Specification / Size</th>
                <th className="p-3 px-2 text-center border-r border-emerald-200 w-16">Qty</th>
                <th className="p-3 px-2 text-center border-r border-emerald-200 w-16">UoM</th>
                <th className="p-3 px-3 text-right border-r border-emerald-200 w-28">Unit Cost (₹)</th>
                <th className="p-3 px-3 text-right border-r border-emerald-200 w-28">Total Cost (₹)</th>
                <th className="p-3 px-2 text-center border-r border-emerald-200 w-16">Margin %</th>
                <th className="p-3 px-3 text-right border-r border-emerald-200 w-32 bg-emerald-100/50 text-emerald-950">
                  Sustainabyte Price (₹)
                </th>
                <th className="p-3 px-2 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {cpmElectricalRows.map((row, index) => {
                const totalCost = row.qty * row.unitCost;
                const sustainabytePrice = Math.round(row.qty * calcPriceFromCost(row.unitCost, row.marginPct));

                return (
                  <tr key={row.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="p-2 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                      {index + 1}
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.brand}
                        onChange={(e) => updateCpmElectricalRow(row.id, 'brand', e.target.value)}
                        placeholder="Make/Brand..."
                        className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 font-semibold text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200">
                      <textarea
                        rows={Math.max(1, Math.ceil((row.itemDescription?.length || 1) / 38))}
                        value={row.itemDescription}
                        onChange={(e) => updateCpmElectricalRow(row.id, 'itemDescription', e.target.value)}
                        placeholder="Consumables description..."
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none resize-none leading-snug whitespace-pre-wrap text-xs"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.modelNo}
                        onChange={(e) => updateCpmElectricalRow(row.id, 'modelNo', e.target.value)}
                        placeholder="Specification / Size"
                        className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 font-mono text-slate-700 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.qty === 0 ? '' : row.qty}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmElectricalRow(row.id, 'qty', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-16 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-center">
                      <input
                        type="text"
                        value={row.uom || 'Mtr'}
                        onChange={(e) => updateCpmElectricalRow(row.id, 'uom', e.target.value)}
                        className="w-14 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-semibold text-slate-700 text-xs focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.unitCost === 0 ? '' : row.unitCost}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmElectricalRow(row.id, 'unitCost', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-24 text-right bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-bold text-slate-800">
                      ₹{formatMoney(totalCost)}
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={row.marginPct ?? 40}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmElectricalRow(row.id, 'marginPct', Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-emerald-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-extrabold text-emerald-900 bg-emerald-50/40">
                      ₹{formatMoney(sustainabytePrice)}
                    </td>
                    <td className="p-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeCpmElectricalRow(row.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        title="Delete electrical consumable row"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Add Buttons Bar */}
              <tr className="bg-slate-50">
                <td colSpan={11} className="p-3 px-4 border-b border-slate-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => addCpmElectricalRow()}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 shadow-2xs cursor-pointer transition-all"
                    >
                      <Plus className="h-4 w-4" /> Add Consumable Row
                    </button>

                    <div className="w-80 max-w-full">
                      <SearchableSelect
                        options={electricalOptions}
                        value=""
                        placeholder="+ Quick Search & Add Consumables..."
                        theme="green"
                        onChange={(val, opt) => {
                          if (opt && val !== '__CUSTOM__') {
                            addCpmElectricalRow({
                              brand: opt.subtitle?.split(' | ')[0] || 'Standard',
                              itemDescription: opt.label,
                              modelNo: opt.subtitle?.includes('Model: ') ? opt.subtitle.split('Model: ')[1] : '',
                              unitCost: opt.price ?? 0,
                              uom: opt.uom || 'Mtr',
                              qty: 0,
                              marginPct: 40,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>

              {/* Step 2 Subtotal Row */}
              <tr className="bg-emerald-950 text-white font-extrabold text-xs">
                <td colSpan={7} className="p-3 px-6 text-right uppercase tracking-wider">
                  Step 2 Total Electrical Consumables Cost &amp; Selling Price
                </td>
                <td className="p-3 px-3 text-right font-black text-slate-300 border-r border-emerald-800">
                  ₹{formatMoney(cpmElectricalTotalCost)}
                </td>
                <td></td>
                <td className="p-3 px-3 text-right font-black text-emerald-300 bg-emerald-900 text-sm border-r border-emerald-800">
                  ₹{formatMoney(cpmElectricalTotalPrice)}
                </td>
                <td></td>
              </tr>

              {/* TOTAL 1: Overall Base Hardware Supply Total (Step 1 + Step 2) */}
              {(cpmHardwareRows.reduce((sum, r) => sum + r.qty * r.unitCost, 0) + cpmElectricalTotalCost) > 0 && (
                <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300 text-xs">
                  <td colSpan={7} className="p-2.5 px-6 text-right font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                    Step 1 + Step 2 Overall Hardware &amp; Electrical Supply Base Total
                  </td>
                  <td className="p-2.5 px-3 text-right font-black text-slate-900 bg-slate-200/80 border-r border-slate-300">
                    ₹{formatMoney(cpmHardwareRows.reduce((sum, r) => sum + r.qty * r.unitCost, 0) + cpmElectricalTotalCost)}
                  </td>
                  <td className="p-2 px-2 border-r border-slate-300 text-center font-bold text-slate-400">
                    -
                  </td>
                  <td className="p-2.5 px-3 text-right font-black text-slate-950 bg-slate-200/90 border-r border-slate-300">
                    ₹{formatMoney(cpmHardwareRows.reduce((sum, r) => sum + Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct ?? 40)), 0) + cpmElectricalTotalPrice)}
                  </td>
                  <td></td>
                </tr>
              )}

              {/* TOTAL 2: 3% Packaging Charges Row */}
              {(cpmHardwareRows.reduce((sum, r) => sum + Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct ?? 40)), 0) + cpmElectricalTotalPrice) > 0 && (
                <tr className="bg-cyan-50/70 text-slate-800 font-bold border-b border-cyan-200/80 text-xs">
                  <td className="p-2.5 px-3 text-center text-cyan-900 border-r border-slate-200">★</td>
                  <td className="p-2.5 px-3 border-r border-slate-200 text-cyan-950 font-extrabold" colSpan={3}>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-cyan-200 text-cyan-900 text-[10px] font-black px-1.5 py-0.5 rounded">3% Capex</span>
                      <span>Packaging Charges (Step 1 + Step 2 Overall Selling Total × 3%)</span>
                    </div>
                  </td>
                  <td className="p-2.5 px-2 border-r border-slate-200 text-center text-slate-600 font-semibold">1</td>
                  <td className="p-2.5 px-2 border-r border-slate-200 text-center text-slate-600 font-semibold">Job</td>
                  <td className="p-2.5 px-3 border-r border-slate-200 text-right font-mono text-slate-700">
                    ₹{formatMoney(Math.round((cpmHardwareRows.reduce((sum, r) => sum + Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct ?? 40)), 0) + cpmElectricalTotalPrice) * 0.03))}
                  </td>
                  <td className="p-2.5 px-3 border-r border-slate-200 text-right font-mono font-bold text-slate-800">
                    ₹{formatMoney(Math.round((cpmHardwareRows.reduce((sum, r) => sum + Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct ?? 40)), 0) + cpmElectricalTotalPrice) * 0.03))}
                  </td>
                  <td className="p-2.5 px-2 border-r border-slate-200 text-center text-slate-500 font-bold">
                    0%
                  </td>
                  <td className="p-2.5 px-3 border-r border-slate-200 text-right font-extrabold text-cyan-900 bg-cyan-50/50">
                    ₹{formatMoney(Math.round((cpmHardwareRows.reduce((sum, r) => sum + Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct ?? 40)), 0) + cpmElectricalTotalPrice) * 0.03))}
                  </td>
                  <td className="p-2.5 px-2 text-center text-cyan-600 font-bold">✓</td>
                </tr>
              )}

              {/* TOTAL 3: Step 1 + Step 2 Grand Total Row */}
              <tr className="bg-slate-900 text-white font-extrabold text-xs">
                <td colSpan={7} className="p-3 px-6 text-right uppercase tracking-wider">
                  Step 1 + Step 2 Total Hardware &amp; Electrical Investment (Overall Total + 3% Packaging Charges)
                </td>
                <td className="p-3 px-3 text-right font-black text-slate-300 border-r border-slate-700">
                  ₹{formatMoney((cpmHardwareRows.reduce((sum, r) => sum + r.qty * r.unitCost, 0) + cpmElectricalTotalCost) + Math.round((cpmHardwareRows.reduce((sum, r) => sum + Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct ?? 40)), 0) + cpmElectricalTotalPrice) * 0.03))}
                </td>
                <td></td>
                <td className="p-3 px-3 text-right font-black text-cyan-300 bg-slate-800 text-sm border-r border-slate-700">
                  ₹{formatMoney((cpmHardwareRows.reduce((sum, r) => sum + Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct ?? 40)), 0) + cpmElectricalTotalPrice) + Math.round((cpmHardwareRows.reduce((sum, r) => sum + Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct ?? 40)), 0) + cpmElectricalTotalPrice) * 0.03))}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* STEP 3: Commissioning & Site Engineering Manpower Engine */}
      <AirAuditManpowerEngine
        {...cpmCommissioningProps}
        stepNumber={3}
        stepTitle="Testing & Commissioning Charges (Site Engineers & Specialists)"
        hideScopeDetails={true}
      />

      {/* STEP 4: Installation Charges Manpower Engine */}
      <AirAuditManpowerEngine
        {...cpmInstallationProps}
        stepNumber={4}
        stepTitle="Installation Charges"
        hideScopeDetails={true}
      />

      {/* STEP 5: On-Premise Application Charges (OptiByte Platform & Configuration) */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-violet-950 via-purple-900 to-slate-900 p-4 px-6 text-white flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-violet-600 font-black text-sm flex items-center justify-center shadow-md">
              5
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-violet-300" /> Step 5: On-Premise Application &amp; OptiByte Platform Charges
              </h3>
              <p className="text-[11px] text-violet-200 font-normal">
                Controller-Gateway to OptiByte Platform integration, Server Application &amp; System Configuration Charges
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-slate-300">
              Total Application Cost:{' '}
              <span className="text-white font-black">₹{formatMoney(cpmOnPremiseTotalCost)}</span>
            </span>
            <span className="text-violet-300 bg-violet-950/80 border border-violet-500/40 px-3 py-1 rounded-lg shadow-sm">
              Selling Price: <span className="text-white font-black">₹{formatMoney(cpmOnPremiseTotalPrice)}</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-violet-50/70 text-violet-950 font-extrabold border-b border-violet-200 uppercase tracking-wider text-[10px]">
                <th className="p-3 px-3 text-center border-r border-violet-200 w-12">S.No</th>
                <th className="p-3 px-4 border-r border-violet-200 min-w-[320px]">Commercial Layer / Scope Description</th>
                <th className="p-3 px-2 text-center border-r border-violet-200 w-16">Quantity</th>
                <th className="p-3 px-3 text-right border-r border-violet-200 w-28">Unit Cost (₹)</th>
                <th className="p-3 px-2 text-center border-r border-violet-200 w-16">Margin %</th>
                <th className="p-3 px-3 text-right border-r border-violet-200 w-28">Unit Price (₹)</th>
                <th className="p-3 px-3 text-right border-r border-violet-200 w-28">Total Cost (₹)</th>
                <th className="p-3 px-3 text-right border-r border-violet-200 w-32 bg-violet-100/50 text-violet-950">
                  Total Price (₹)
                </th>
                <th className="p-3 px-2 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {cpmOnPremiseRows.map((row, index) => {
                const totalCost = (Number(row.qty) || 0) * (Number(row.unitCost) || 0);
                const unitPrice = calcPriceFromCost(Number(row.unitCost) || 0, row.marginPct ?? 40);
                const totalPrice = (Number(row.qty) || 0) * unitPrice;

                return (
                  <tr key={row.id} className="hover:bg-violet-50/20 transition-colors">
                    <td className="p-2 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                      {index + 1}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.commercialLayer}
                        onChange={(e) => updateCpmOnPremiseRow(row.id, 'commercialLayer', e.target.value)}
                        placeholder="Commercial layer name / description..."
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.qty === 0 ? '' : row.qty}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmOnPremiseRow(row.id, 'qty', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-16 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.unitCost === 0 ? '' : row.unitCost}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmOnPremiseRow(row.id, 'unitCost', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-24 text-right bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={row.marginPct ?? 40}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmOnPremiseRow(row.id, 'marginPct', Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-violet-900 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-semibold text-slate-700">
                      ₹{formatMoney(unitPrice)}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-bold text-slate-800">
                      ₹{formatMoney(totalCost)}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-extrabold text-violet-900 bg-violet-50/40">
                      ₹{formatMoney(totalPrice)}
                    </td>
                    <td className="p-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeCpmOnPremiseRow(row.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        title="Delete on-premise row"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Add Row Bar */}
              <tr className="bg-slate-50">
                <td colSpan={9} className="p-3 px-4 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => addCpmOnPremiseRow()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 bg-violet-50 hover:bg-violet-100 px-3.5 py-2 rounded-xl border border-violet-200 shadow-2xs cursor-pointer transition-all"
                  >
                    <Plus className="h-4 w-4" /> Add Application / Commercial Layer Row
                  </button>
                </td>
              </tr>

              {/* Step 5 Subtotal Row */}
              <tr className="bg-violet-950 text-white font-extrabold text-xs">
                <td colSpan={6} className="p-3 px-6 text-right uppercase tracking-wider">
                  Step 5 Total On-Premise Application Charges Cost &amp; Selling Price
                </td>
                <td className="p-3 px-3 text-right font-black text-slate-300 border-r border-violet-800">
                  ₹{formatMoney(cpmOnPremiseTotalCost)}
                </td>
                <td className="p-3 px-3 text-right font-black text-violet-300 bg-violet-900 text-sm border-r border-violet-800">
                  ₹{formatMoney(cpmOnPremiseTotalPrice)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* STEP 6: Cloud Charges (Recurring Telemetry & SaaS) */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900 p-4 px-6 text-white flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-blue-600 font-black text-sm flex items-center justify-center shadow-md">
              6
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Cloud className="h-4 w-4 text-blue-300" /> Step 6: Cloud Charges (Monthly &amp; Annual Telemetry Subscriptions)
              </h3>
              <p className="text-[11px] text-blue-200 font-normal">
                Monthly base cost &amp; Annual recurring cloud charges for OptiByte live telemetry, AI analytics &amp; automated reporting
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-slate-300">
              Total Cloud Cost:{' '}
              <span className="text-white font-black">₹{formatMoney(cpmCloudChargeTotalCost)}</span>
            </span>
            <span className="text-blue-300 bg-blue-950/80 border border-blue-500/40 px-3 py-1 rounded-lg shadow-sm">
              Selling Price: <span className="text-white font-black">₹{formatMoney(cpmCloudChargeTotalPrice)}</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-blue-50/70 text-blue-950 font-extrabold border-b border-blue-200 uppercase tracking-wider text-[10px]">
                <th className="p-3 px-3 text-center border-r border-blue-200 w-12">S.No</th>
                <th className="p-3 px-3 border-r border-blue-200 w-32">Basis</th>
                <th className="p-3 px-4 border-r border-blue-200 min-w-[260px]">Calculation / Scope Details</th>
                <th className="p-3 px-2 text-center border-r border-blue-200 w-16">Quantity</th>
                <th className="p-3 px-3 text-right border-r border-blue-200 w-28">Unit Cost (₹)</th>
                <th className="p-3 px-2 text-center border-r border-blue-200 w-16">Margin %</th>
                <th className="p-3 px-3 text-right border-r border-blue-200 w-28">Unit Price (₹)</th>
                <th className="p-3 px-3 text-right border-r border-blue-200 w-28">Total Cost (₹)</th>
                <th className="p-3 px-3 text-right border-r border-blue-200 w-32 bg-blue-100/50 text-blue-950">
                  Total Price (₹)
                </th>
                <th className="p-3 px-2 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {cpmCloudChargeRows.map((row, index) => {
                const totalCost = (Number(row.qty) || 0) * (Number(row.unitCost) || 0);
                const unitPrice = calcPriceFromCost(Number(row.unitCost) || 0, row.marginPct ?? 40);
                const totalPrice = (Number(row.qty) || 0) * unitPrice;

                return (
                  <tr key={row.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="p-2 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                      {index + 1}
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.basis}
                        onChange={(e) => updateCpmCloudChargeRow(row.id, 'basis', e.target.value)}
                        placeholder="Basis (e.g. Monthly / Annual)..."
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.calculation}
                        onChange={(e) => updateCpmCloudChargeRow(row.id, 'calculation', e.target.value)}
                        placeholder="Calculation remarks..."
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 font-semibold text-slate-800 text-xs px-1 py-0.5 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.qty === 0 ? '' : row.qty}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmCloudChargeRow(row.id, 'qty', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-16 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.unitCost === 0 ? '' : row.unitCost}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmCloudChargeRow(row.id, 'unitCost', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-24 text-right bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={row.marginPct ?? 40}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmCloudChargeRow(row.id, 'marginPct', Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-semibold text-slate-700">
                      ₹{formatMoney(unitPrice)}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-bold text-slate-800">
                      ₹{formatMoney(totalCost)}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-extrabold text-blue-900 bg-blue-50/40">
                      ₹{formatMoney(totalPrice)}
                    </td>
                    <td className="p-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeCpmCloudChargeRow(row.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        title="Delete cloud charge row"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Add Row Bar */}
              <tr className="bg-slate-50">
                <td colSpan={10} className="p-3 px-4 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => addCpmCloudChargeRow()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 shadow-2xs cursor-pointer transition-all"
                  >
                    <Plus className="h-4 w-4" /> Add Cloud Charge Row
                  </button>
                </td>
              </tr>

              {/* Step 6 Subtotal Row */}
              <tr className="bg-blue-950 text-white font-extrabold text-xs">
                <td colSpan={7} className="p-3 px-6 text-right uppercase tracking-wider">
                  Step 6 Total Cloud Charges Cost &amp; Selling Price
                </td>
                <td className="p-3 px-3 text-right font-black text-slate-300 border-r border-blue-800">
                  ₹{formatMoney(cpmCloudChargeTotalCost)}
                </td>
                <td className="p-3 px-3 text-right font-black text-blue-300 bg-blue-900 text-sm border-r border-blue-800">
                  ₹{formatMoney(cpmCloudChargeTotalPrice)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* STEP 7: Commercial Proposal Summary & Contingency Matrix */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-cyan-600" />
              Step 7: Commercial Summary &amp; Negotiation Matrix
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Consolidated Hardware Capex, Electrical Consumables, Testing &amp; Commissioning, Installation Charges, On-Premise Application &amp; Cloud Charges
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Negotiation Buffer % Quick Input */}
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                Negotiation Buffer:
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={bufferPct}
                  onChange={(e) => setBufferPct(Number(e.target.value))}
                  className="w-14 text-center font-black text-amber-950 bg-white border border-amber-300 rounded-lg px-1.5 py-1 text-xs shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-xs font-black text-amber-800">%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Rounding Nearest:</span>
              <select
                value={roundingNearest}
                onChange={(e) => setRoundingNearest?.(Number(e.target.value))}
                className="text-xs font-black text-cyan-900 bg-white border border-slate-300 rounded-lg px-2 py-1 shadow-2xs focus:outline-none cursor-pointer"
              >
                <option value={10}>₹10</option>
                <option value={50}>₹50</option>
                <option value={100}>₹100</option>
                <option value={500}>₹500</option>
                <option value={1000}>₹1,000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Commercial Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          <div className="p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200">
            <div className="text-[10px] font-bold text-cyan-800 uppercase tracking-wide">
              1. Hardware (Step 1)
            </div>
            <div className="text-lg font-black text-cyan-950 mt-1">
              ₹{formatMoney(cpmHardwareTotalPrice)}
            </div>
            <div className="text-[10px] text-cyan-700 mt-0.5 font-semibold">
              Cost: ₹{formatMoney(cpmHardwareTotalCost)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
              2. Consumables (Step 2)
            </div>
            <div className="text-lg font-black text-emerald-950 mt-1">
              ₹{formatMoney(cpmElectricalTotalPrice)}
            </div>
            <div className="text-[10px] text-emerald-700 mt-0.5 font-semibold">
              Cost: ₹{formatMoney(cpmElectricalTotalCost)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200">
            <div className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">
              3. Testing &amp; Comm. (Step 3)
            </div>
            <div className="text-lg font-black text-indigo-950 mt-1">
              ₹{formatMoney(cpmCommissioningTotalPrice)}
            </div>
            <div className="text-[10px] text-indigo-700 mt-0.5 font-semibold">
              Cost: ₹{formatMoney(cpmCommissioningTotalCost)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/80 border border-teal-300">
            <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wide flex items-center gap-1">
              <HardHat className="h-3 w-3 text-teal-600" /> 4. Installation (Step 4)
            </div>
            <div className="text-lg font-black text-teal-950 mt-1">
              ₹{formatMoney(cpmInstManpowerTotalPrice)}
            </div>
            <div className="text-[10px] text-teal-700 mt-0.5 font-semibold">
              Cost: ₹{formatMoney(cpmInstManpowerTotalCost)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-violet-50/70 border border-violet-300">
            <div className="text-[10px] font-bold text-violet-900 uppercase tracking-wide flex items-center gap-1">
              <Layers className="h-3 w-3 text-violet-600" /> 5. On-Premise App (Step 5)
            </div>
            <div className="text-lg font-black text-violet-950 mt-1">
              ₹{formatMoney(cpmOnPremiseTotalPrice)}
            </div>
            <div className="text-[10px] text-violet-700 mt-0.5 font-semibold">
              Cost: ₹{formatMoney(cpmOnPremiseTotalCost)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-300">
            <div className="text-[10px] font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1">
              <Cloud className="h-3 w-3 text-blue-600" /> 6. Cloud Charges (Step 6)
            </div>
            <div className="text-lg font-black text-blue-950 mt-1">
              ₹{formatMoney(cpmCloudChargeTotalPrice)}
            </div>
            <div className="text-[10px] text-blue-700 mt-0.5 font-semibold">
              Cost: ₹{formatMoney(cpmCloudChargeTotalCost)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/80 border-2 border-amber-300 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-bold text-amber-800 uppercase tracking-wide">
              <span>Negotiation Buffer</span>
              <div className="flex items-center gap-1 bg-amber-200/90 rounded-md px-1.5 py-0.5 border border-amber-300">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={bufferPct}
                  onChange={(e) => setBufferPct(Number(e.target.value))}
                  className="w-8 text-center bg-white font-black text-amber-950 rounded text-[11px] py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <span className="font-black text-[10px] text-amber-900">%</span>
              </div>
            </div>
            <div className="text-lg font-black text-amber-950 mt-1">
              + ₹{formatMoney(cpmBufferAmount)}
            </div>
            <div className="text-[10px] text-amber-700 mt-0.5 font-semibold">
              {bufferPct}% on Steps 1–6 Base
            </div>
          </div>
        </div>

        {/* Grand Total Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 p-5 rounded-xl text-white flex flex-wrap items-center justify-between gap-4 border border-cyan-800/40 shadow-lg">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-cyan-300">
              Final Customer Investment Quotation (Chiller Plant Management)
            </div>
            <div className="text-xs text-cyan-200/80 font-medium mt-1 flex items-center gap-2 flex-wrap">
              <span>Steps 1–6 Base Total: <strong className="text-white font-black">₹{formatMoney(cpmSteps1To6TotalPrice || (cpmHardwareTotalPrice + cpmElectricalTotalPrice + cpmCommissioningTotalPrice + cpmInstManpowerTotalPrice + cpmOnPremiseTotalPrice + cpmCloudChargeTotalPrice))}</strong></span>
              <span>•</span>
              <span>+ {bufferPct}% Negotiation Buffer: <strong className="text-amber-300 font-black">+ ₹{formatMoney(cpmBufferAmount)}</strong></span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-amber-300 tracking-tight">
              ₹{formatMoney(cpmRoundedCustomerCost)}
            </div>
            <div className="text-[11px] text-slate-300 font-semibold mt-0.5">
              Exact Calculated: ₹{formatMoney(cpmPriceWithBuffer)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

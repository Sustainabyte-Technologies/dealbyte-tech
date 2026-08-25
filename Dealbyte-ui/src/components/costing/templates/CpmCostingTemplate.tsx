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
import { CpmHardwareRow, CpmCloudRow } from '../types';
import { formatMoney, calcPriceFromCost } from '../utils';
import { AirAuditManpowerEngine, AirAuditManpowerEngineProps } from '../shared/AirAuditManpowerEngine';
import { SearchableSelect, SearchableOption } from '../shared/SearchableSelect';
import {
  INITIAL_CPM_HARDWARE_ROWS,
  INITIAL_CPM_ELECTRICAL_ROWS,
  INITIAL_CPM_CLOUD_ROWS,
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

  // Step 5: Software cost (Cloud Basis)
  cpmCloudRows: CpmCloudRow[];
  updateCpmCloudRow: (id: string, field: keyof CpmCloudRow, val: any) => void;
  addCpmCloudRow: (preset?: Partial<CpmCloudRow>) => void;
  removeCpmCloudRow: (id: string) => void;
  cpmCloudTotalCost: number;
  cpmCloudTotalPrice: number;

  // Consolidated Math
  cpmSteps1To5TotalPrice: number;
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
    cpmCloudRows,
    updateCpmCloudRow,
    addCpmCloudRow,
    removeCpmCloudRow,
    cpmCloudTotalCost,
    cpmCloudTotalPrice,
    cpmSteps1To5TotalPrice,
    cpmBufferAmount,
    cpmPriceWithBuffer,
    cpmRoundedCustomerCost,
    bufferPct,
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

  // Cloud options search
  const cloudOptions: SearchableOption[] = useMemo(() => {
    return INITIAL_CPM_CLOUD_ROWS.map((item) => ({
      label: item.itemDescription,
      subtitle: `${item.billingCycle || 'Annual'} Subscription`,
      value: item.itemDescription,
      price: item.unitCost,
      uom: item.uom || 'Year',
      category: 'Cloud Software',
    }));
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
            Complete 5-Step Integrated Costing Engine: Hardware Capex + Electrical Consumables + Site Commissioning + Installation Charges + Software Cost (Cloud Basis).
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
              onChange={(e) => {
                const val = Number(e.target.value);
                setQuickMargin(val);
                if (applyCpmGlobalMargin) applyCpmGlobalMargin(val);
              }}
              className="w-12 bg-black/30 text-white font-black text-xs text-center rounded px-1 py-0.5 border border-cyan-400/30 focus:outline-none"
            />
            <span className="text-xs font-bold text-cyan-200 ml-1">%</span>
          </div>

          <button
            type="button"
            onClick={resetCpmDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition shadow-sm cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-cyan-300" /> Reset to CPM Reference Model
          </button>
        </div>
      </div>

      {/* STEP 1: Hardware & Equipment Costing Matrix */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-4 px-6 text-white flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-cyan-600 font-black text-sm flex items-center justify-center shadow-md">
              1
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                Step 1: Product Description &amp; Hardware Capex Matrix
              </h3>
              <p className="text-[11px] text-cyan-200/80 font-medium">
                Sensors, Main Controllers, Expander modules, Gateway &amp; Workstations
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
              <tr className="bg-slate-100/90 text-slate-700 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="p-3 px-3 text-center border-r border-slate-200 w-12">S.No</th>
                <th className="p-3 px-3 border-r border-slate-200 w-24">Brand</th>
                <th className="p-3 px-4 border-r border-slate-200 min-w-[280px]">Item / Description</th>
                <th className="p-3 px-3 border-r border-slate-200 w-28">Model No.</th>
                <th className="p-3 px-2 text-center border-r border-slate-200 w-16">Qty</th>
                <th className="p-3 px-2 text-center border-r border-slate-200 w-14">UoM</th>
                <th className="p-3 px-3 text-right border-r border-slate-200 w-24">Unit Cost (₹)</th>
                <th className="p-3 px-3 text-right border-r border-slate-200 w-28">Total Cost (₹)</th>
                <th className="p-3 px-2 text-center border-r border-slate-200 w-16">Margin %</th>
                <th className="p-3 px-3 text-right border-r border-slate-200 w-32 bg-cyan-50/50 text-cyan-950">
                  Sustainabyte Price (₹)
                </th>
                <th className="p-3 px-3 text-right border-r border-slate-200 w-32 bg-blue-50/50 text-blue-950">
                  Customer Price (₹)
                </th>
                <th className="p-3 px-2 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {cpmHardwareRows.map((row, index) => {
                const totalCost = row.qty * row.unitCost;
                const sustainabytePrice = Math.round(row.qty * calcPriceFromCost(row.unitCost, row.marginPct));
                const customerPrice = Math.round(sustainabytePrice / Math.max(0.01, (100 - (bufferPct || 10)) / 100));

                return (
                  <tr key={row.id} className="hover:bg-cyan-50/20 transition-colors">
                    <td className="p-2 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                      {index + 1}
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.brand}
                        onChange={(e) => updateCpmHardwareRow(row.id, 'brand', e.target.value)}
                        placeholder="Brand..."
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-cyan-500 rounded px-2 py-1 font-bold text-slate-800 text-xs focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200">
                      <div className="space-y-1">
                        <textarea
                          rows={Math.max(1, Math.ceil((row.itemDescription?.length || 1) / 38))}
                          value={row.itemDescription}
                          onChange={(e) => updateCpmHardwareRow(row.id, 'itemDescription', e.target.value)}
                          placeholder="Item description..."
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-cyan-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none resize-none leading-snug whitespace-pre-wrap text-xs"
                        />
                      </div>
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.modelNo}
                        onChange={(e) => updateCpmHardwareRow(row.id, 'modelNo', e.target.value)}
                        placeholder="Model No..."
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-cyan-500 rounded px-2 py-1 font-semibold text-slate-700 text-xs focus:outline-none"
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
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-center">
                      <input
                        type="text"
                        value={row.uom || 'Nos'}
                        onChange={(e) => updateCpmHardwareRow(row.id, 'uom', e.target.value)}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-semibold text-slate-700 text-xs focus:outline-none"
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
                        className="w-20 text-right bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
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
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-extrabold text-cyan-900 bg-cyan-50/30">
                      ₹{formatMoney(sustainabytePrice)}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-extrabold text-blue-900 bg-blue-50/30">
                      ₹{formatMoney(customerPrice)}
                    </td>
                    <td className="p-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeCpmHardwareRow(row.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        title="Delete component row"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Add Buttons Bar */}
              <tr className="bg-slate-50">
                <td colSpan={12} className="p-3 px-4 border-b border-slate-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => addCpmHardwareRow()}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 px-3.5 py-2 rounded-xl border border-cyan-200 shadow-2xs cursor-pointer transition-all"
                    >
                      <Plus className="h-4 w-4" /> Add Hardware Component
                    </button>

                    <div className="w-80 max-w-full">
                      <SearchableSelect
                        options={hardwareOptions}
                        value=""
                        placeholder="+ Quick Search & Add Catalog Item..."
                        theme="purple"
                        onChange={(val, opt) => {
                          if (opt && val !== '__CUSTOM__') {
                            addCpmHardwareRow({
                              brand: opt.subtitle?.includes('|') ? opt.subtitle.split('|')[0].trim() : opt.category || '',
                              itemDescription: opt.label,
                              modelNo: opt.subtitle?.includes('Model:') ? opt.subtitle.split('Model:')[1].trim() : '',
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
                  Step 1 Total Hardware Capex Cost &amp; Price
                </td>
                <td className="p-3 px-3 text-right font-black text-slate-300 border-r border-slate-700">
                  ₹{formatMoney(cpmHardwareTotalCost)}
                </td>
                <td></td>
                <td className="p-3 px-3 text-right font-black text-cyan-300 bg-slate-950 text-sm border-r border-slate-800">
                  ₹{formatMoney(cpmHardwareTotalPrice)}
                </td>
                <td className="p-3 px-3 text-right font-black text-blue-300 bg-slate-950 text-sm border-r border-slate-800" colSpan={2}>
                  ₹{formatMoney(Math.round(cpmHardwareTotalPrice / Math.max(0.01, (100 - (bufferPct || 10)) / 100)))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* STEP 2: Electrical Hardware & Consumables Matrix */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-4 px-6 text-white flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-600 font-black text-sm flex items-center justify-center shadow-md">
              2
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-400" /> Step 2: Electrical Hardware &amp; Consumables Matrix
              </h3>
              <p className="text-[11px] text-emerald-200/80 font-medium">
                Shielded RS-485 Cables, 2 Core Power Cables, GI Cable Trays, PVC Conduit Pipes &amp; Accessories
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
                <th className="p-3 px-3 border-r border-emerald-200 w-24">Brand</th>
                <th className="p-3 px-4 border-r border-emerald-200 min-w-[280px]">Item / Description</th>
                <th className="p-3 px-3 border-r border-emerald-200 w-28">Model No.</th>
                <th className="p-3 px-2 text-center border-r border-emerald-200 w-16">Qty</th>
                <th className="p-3 px-2 text-center border-r border-emerald-200 w-14">UoM</th>
                <th className="p-3 px-3 text-right border-r border-emerald-200 w-24">Unit Cost (₹)</th>
                <th className="p-3 px-3 text-right border-r border-emerald-200 w-28">Total Cost (₹)</th>
                <th className="p-3 px-2 text-center border-r border-emerald-200 w-16">Margin %</th>
                <th className="p-3 px-3 text-right border-r border-emerald-200 w-32 bg-emerald-100/50 text-emerald-950">
                  Sustainabyte Price (₹)
                </th>
                <th className="p-3 px-3 text-right border-r border-emerald-200 w-32 bg-teal-100/50 text-teal-950">
                  Customer Price (₹)
                </th>
                <th className="p-3 px-2 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {cpmElectricalRows.map((row, index) => {
                const totalCost = row.qty * row.unitCost;
                const sustainabytePrice = Math.round(row.qty * calcPriceFromCost(row.unitCost, row.marginPct));
                const customerPrice = Math.round(sustainabytePrice / Math.max(0.01, (100 - (bufferPct || 10)) / 100));

                return (
                  <tr key={row.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="p-2 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                      {11 + index}
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.brand}
                        onChange={(e) => updateCpmElectricalRow(row.id, 'brand', e.target.value)}
                        placeholder="Brand..."
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded px-2 py-1 font-bold text-slate-800 text-xs focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200">
                      <div className="space-y-1">
                        <textarea
                          rows={Math.max(1, Math.ceil((row.itemDescription?.length || 1) / 38))}
                          value={row.itemDescription}
                          onChange={(e) => updateCpmElectricalRow(row.id, 'itemDescription', e.target.value)}
                          placeholder="Electrical consumable description..."
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none resize-none leading-snug whitespace-pre-wrap text-xs"
                        />
                      </div>
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200">
                      <input
                        type="text"
                        value={row.modelNo}
                        onChange={(e) => updateCpmElectricalRow(row.id, 'modelNo', e.target.value)}
                        placeholder="Model No..."
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-emerald-500 rounded px-2 py-1 font-semibold text-slate-700 text-xs focus:outline-none"
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
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-semibold text-slate-700 text-xs focus:outline-none"
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
                        className="w-20 text-right bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-extrabold text-teal-900 bg-teal-50/40">
                      ₹{formatMoney(customerPrice)}
                    </td>
                    <td className="p-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeCpmElectricalRow(row.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        title="Delete consumable row"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Add Buttons Bar */}
              <tr className="bg-slate-50">
                <td colSpan={12} className="p-3 px-4 border-b border-slate-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => addCpmElectricalRow()}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 shadow-2xs cursor-pointer transition-all"
                    >
                      <Plus className="h-4 w-4" /> Add Electrical Consumable
                    </button>

                    <div className="w-80 max-w-full">
                      <SearchableSelect
                        options={electricalOptions}
                        value=""
                        placeholder="+ Quick Search & Add Consumable..."
                        theme="emerald"
                        onChange={(val, opt) => {
                          if (opt && val !== '__CUSTOM__') {
                            addCpmElectricalRow({
                              brand: opt.subtitle?.includes('|') ? opt.subtitle.split('|')[0].trim() : opt.category || '',
                              itemDescription: opt.label,
                              modelNo: opt.subtitle?.includes('Model:') ? opt.subtitle.split('Model:')[1].trim() : '',
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
                  Step 2 Total Electrical Consumables Cost &amp; Price
                </td>
                <td className="p-3 px-3 text-right font-black text-slate-300 border-r border-emerald-800">
                  ₹{formatMoney(cpmElectricalTotalCost)}
                </td>
                <td></td>
                <td className="p-3 px-3 text-right font-black text-emerald-300 bg-emerald-900 text-sm border-r border-emerald-800">
                  ₹{formatMoney(cpmElectricalTotalPrice)}
                </td>
                <td className="p-3 px-3 text-right font-black text-teal-300 bg-emerald-900 text-sm border-r border-emerald-800" colSpan={2}>
                  ₹{formatMoney(Math.round(cpmElectricalTotalPrice / Math.max(0.01, (100 - (bufferPct || 10)) / 100)))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* STEP 3: Testing and Commissioning */}
      <AirAuditManpowerEngine
        {...cpmCommissioningProps}
        stepNumber={3}
        stepTitle="Testing and Commissioning"
        hideScopeDetails={true}
      />

      {/* STEP 4: Installation Charges */}
      <AirAuditManpowerEngine
        {...cpmInstallationProps}
        stepNumber={4}
        stepTitle="Installation Charges"
        hideScopeDetails={true}
      />

      {/* STEP 5: Software cost (Cloud Basis) */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-slate-900 p-4 px-6 text-white flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-purple-600 font-black text-sm flex items-center justify-center shadow-md">
              5
            </span>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Cloud className="h-4 w-4 text-purple-300" /> Step 5: Software cost (Cloud Basis)
              </h3>
              <p className="text-[11px] text-purple-200/80 font-medium">
                Chiller Management SaaS Platform, Telemetry Ingestion, Time-Series DB, IoT SIM &amp; FDD Alerts
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-slate-300">
              Total Cloud Cost:{' '}
              <span className="text-white font-black">₹{formatMoney(cpmCloudTotalCost)}</span>
            </span>
            <span className="text-purple-300 bg-purple-950/80 border border-purple-500/40 px-3 py-1 rounded-lg shadow-sm">
              Selling Price: <span className="text-white font-black">₹{formatMoney(cpmCloudTotalPrice)}</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-purple-50/70 text-purple-950 font-extrabold border-b border-purple-200 uppercase tracking-wider text-[10px]">
                <th className="p-3 px-3 text-center border-r border-purple-200 w-12">S.No</th>
                <th className="p-3 px-4 border-r border-purple-200 min-w-[320px]">Software Module / Description</th>
                <th className="p-3 px-2 text-center border-r border-purple-200 w-16">Qty</th>
                <th className="p-3 px-2 text-center border-r border-purple-200 w-20">UoM</th>
                <th className="p-3 px-3 text-right border-r border-purple-200 w-28">Unit Cost (₹)</th>
                <th className="p-3 px-3 text-right border-r border-purple-200 w-28">Total Cost (₹)</th>
                <th className="p-3 px-2 text-center border-r border-purple-200 w-16">Margin %</th>
                <th className="p-3 px-3 text-right border-r border-purple-200 w-32 bg-purple-100/50 text-purple-950">
                  Sustainabyte Price (₹)
                </th>
                <th className="p-3 px-3 text-right border-r border-purple-200 w-32 bg-indigo-100/50 text-indigo-950">
                  Customer Price (₹)
                </th>
                <th className="p-3 px-2 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {cpmCloudRows.map((row, index) => {
                const totalCost = row.qty * row.unitCost;
                const sustainabytePrice = Math.round(row.qty * calcPriceFromCost(row.unitCost, row.marginPct));
                const customerPrice = Math.round(sustainabytePrice / Math.max(0.01, (100 - (bufferPct || 10)) / 100));

                return (
                  <tr key={row.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="p-2 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                      {index + 1}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200">
                      <textarea
                        rows={Math.max(1, Math.ceil((row.itemDescription?.length || 1) / 45))}
                        value={row.itemDescription}
                        onChange={(e) => updateCpmCloudRow(row.id, 'itemDescription', e.target.value)}
                        placeholder="Cloud software description..."
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none resize-none leading-snug whitespace-pre-wrap text-xs"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.qty === 0 ? '' : row.qty}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmCloudRow(row.id, 'qty', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-16 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-center">
                      <input
                        type="text"
                        value={row.uom || 'Year'}
                        onChange={(e) => updateCpmCloudRow(row.id, 'uom', e.target.value)}
                        className="w-16 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-semibold text-slate-700 text-xs focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-2 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.unitCost === 0 ? '' : row.unitCost}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateCpmCloudRow(row.id, 'unitCost', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-24 text-right bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
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
                        onChange={(e) => updateCpmCloudRow(row.id, 'marginPct', Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-extrabold text-purple-900 bg-purple-50/40">
                      ₹{formatMoney(sustainabytePrice)}
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-extrabold text-indigo-900 bg-indigo-50/40">
                      ₹{formatMoney(customerPrice)}
                    </td>
                    <td className="p-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeCpmCloudRow(row.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        title="Delete cloud software row"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Add Buttons Bar */}
              <tr className="bg-slate-50">
                <td colSpan={10} className="p-3 px-4 border-b border-slate-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => addCpmCloudRow()}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl border border-purple-200 shadow-2xs cursor-pointer transition-all"
                    >
                      <Plus className="h-4 w-4" /> Add Software (Cloud) Row
                    </button>

                    <div className="w-80 max-w-full">
                      <SearchableSelect
                        options={cloudOptions}
                        value=""
                        placeholder="+ Quick Search & Add Cloud Module..."
                        theme="purple"
                        onChange={(val, opt) => {
                          if (opt && val !== '__CUSTOM__') {
                            addCpmCloudRow({
                              itemDescription: opt.label,
                              billingCycle: 'Annual',
                              unitCost: opt.price ?? 0,
                              uom: opt.uom || 'Year',
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

              {/* Step 5 Subtotal Row */}
              <tr className="bg-purple-950 text-white font-extrabold text-xs">
                <td colSpan={5} className="p-3 px-6 text-right uppercase tracking-wider">
                  Step 5 Total Software Cost (Cloud Basis) Cost &amp; Price
                </td>
                <td className="p-3 px-3 text-right font-black text-slate-300 border-r border-purple-800">
                  ₹{formatMoney(cpmCloudTotalCost)}
                </td>
                <td></td>
                <td className="p-3 px-3 text-right font-black text-purple-300 bg-purple-900 text-sm border-r border-purple-800">
                  ₹{formatMoney(cpmCloudTotalPrice)}
                </td>
                <td className="p-3 px-3 text-right font-black text-indigo-300 bg-purple-900 text-sm border-r border-purple-800" colSpan={2}>
                  ₹{formatMoney(Math.round(cpmCloudTotalPrice / Math.max(0.01, (100 - (bufferPct || 10)) / 100)))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* STEP 6: Commercial Proposal Summary & Contingency Matrix */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-cyan-600" />
              Step 6: Commercial Summary &amp; Negotiation Matrix
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Consolidated Hardware Capex, Electrical Consumables, Testing &amp; Commissioning, Installation Charges &amp; Software Cost (Cloud Basis)
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700">Rounding Nearest:</span>
            <select
              value={roundingNearest}
              onChange={(e) => setRoundingNearest(Number(e.target.value))}
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

        {/* Commercial Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
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

          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-300">
            <div className="text-[10px] font-bold text-purple-900 uppercase tracking-wide flex items-center gap-1">
              <Cloud className="h-3 w-3 text-purple-600" /> 5. Software Cloud (Step 5)
            </div>
            <div className="text-lg font-black text-purple-950 mt-1">
              ₹{formatMoney(cpmCloudTotalPrice)}
            </div>
            <div className="text-[10px] text-purple-700 mt-0.5 font-semibold">
              Cost: ₹{formatMoney(cpmCloudTotalCost)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-center justify-between text-[10px] font-bold text-amber-800 uppercase tracking-wide">
              <span>Negotiation Buffer</span>
              <span className="bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-black text-[10px]">{bufferPct}%</span>
            </div>
            <div className="text-lg font-black text-amber-950 mt-1">
              + ₹{formatMoney(cpmBufferAmount)}
            </div>
            <div className="text-[10px] text-amber-700 mt-0.5 font-semibold">
              Contingency reserve
            </div>
          </div>
        </div>

        {/* Grand Total Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 p-5 rounded-xl text-white flex flex-wrap items-center justify-between gap-4 border border-cyan-800/40 shadow-lg">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-cyan-300">
              Final Customer Investment Quotation (Chiller Plant Management)
            </div>
            <div className="text-xs text-cyan-200/80 font-medium mt-0.5">
              Includes Capex Hardware + Consumables + Commissioning + Installation + Cloud Software + {bufferPct}% Buffer
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

import React from 'react';
import {
  Layers,
  RotateCcw,
  Plus,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import {
  IotControlsHardwareRow,
  IotControlsOpexRow,
  IotControlsRoiState,
} from '../types';
import { formatMoney } from '../utils';
import { AirAuditManpowerEngine, AirAuditManpowerEngineProps } from '../shared/AirAuditManpowerEngine';

export interface IotControlsTemplateProps extends AirAuditManpowerEngineProps {
  activeSubServiceName: string;
  iotHardwareTotalPrice: number;
  iotControlsHardwareRows: IotControlsHardwareRow[];
  updateIotControlsHardwareRow: (id: string, field: keyof IotControlsHardwareRow, val: any) => void;
  addIotControlsHardwareRow: () => void;
  removeIotControlsHardwareRow: (id: string) => void;
  iotOpexTotalYearly: number;
  iotControlsOpexRows: IotControlsOpexRow[];
  updateIotControlsOpexRow: (id: string, field: keyof IotControlsOpexRow, val: any) => void;
  addIotControlsOpexRow: () => void;
  removeIotControlsOpexRow: (id: string) => void;
  iotControlsRoiState: IotControlsRoiState;
  updateIotControlsRoiState: (field: keyof IotControlsRoiState, val: any) => void;
  roiPaybackMonths: number;
  roiCustomerSharePct: number;
  roiExpectedSavingsAvgPct: number;
  roiEnergyCostY1: number;
  roiEnergyCostY2: number;
  roiEnergyCostY3: number;
  roiEnergyCostY4: number;
  roiEnergyCostY5: number;
  roiEnergyCostTotal: number;
  roiCapexY1: number;
  roiCapexY2: number;
  roiCapexY3: number;
  roiCapexY4: number;
  roiCapexY5: number;
  roiCapexTotal: number;
  roiOpexY1: number;
  roiOpexY2: number;
  roiOpexY3: number;
  roiOpexY4: number;
  roiOpexY5: number;
  roiOpexTotal: number;
  roiTotalExpenseY1: number;
  roiTotalExpenseY2: number;
  roiTotalExpenseY3: number;
  roiTotalExpenseY4: number;
  roiTotalExpenseY5: number;
  roiTotalExpenseTotal: number;
  roiSavingsPctY1: number;
  roiSavingsPctY2: number;
  roiSavingsPctY3: number;
  roiSavingsPctY4: number;
  roiSavingsPctY5: number;
  roiSavingsAmountY1: number;
  roiSavingsAmountY2: number;
  roiSavingsAmountY3: number;
  roiSavingsAmountY4: number;
  roiSavingsAmountY5: number;
  roiSavingsAmountTotal: number;
  roiGrossBenefitY1: number;
  roiGrossBenefitY2: number;
  roiGrossBenefitY3: number;
  roiGrossBenefitY4: number;
  roiGrossBenefitY5: number;
  roiGrossBenefitTotal: number;
  roiNetBenefitY1: number;
  roiNetBenefitY2: number;
  roiNetBenefitY3: number;
  roiNetBenefitY4: number;
  roiNetBenefitY5: number;
  resetIotControlsDefaults: () => void;
}

export const IotControlsTemplate: React.FC<IotControlsTemplateProps> = (props) => {
  const {
    activeSubServiceName,
    iotHardwareTotalPrice,
    iotControlsHardwareRows,
    updateIotControlsHardwareRow,
    addIotControlsHardwareRow,
    removeIotControlsHardwareRow,
    iotOpexTotalYearly,
    iotControlsOpexRows,
    updateIotControlsOpexRow,
    addIotControlsOpexRow,
    removeIotControlsOpexRow,
    iotControlsRoiState,
    updateIotControlsRoiState,
    roiPaybackMonths,
    roiCustomerSharePct,
    roiExpectedSavingsAvgPct,
    roiEnergyCostY1,
    roiEnergyCostY2,
    roiEnergyCostY3,
    roiEnergyCostY4,
    roiEnergyCostY5,
    roiEnergyCostTotal,
    roiCapexY1,
    roiCapexY2,
    roiCapexY3,
    roiCapexY4,
    roiCapexY5,
    roiCapexTotal,
    roiOpexY1,
    roiOpexY2,
    roiOpexY3,
    roiOpexY4,
    roiOpexY5,
    roiOpexTotal,
    roiTotalExpenseY1,
    roiTotalExpenseY2,
    roiTotalExpenseY3,
    roiTotalExpenseY4,
    roiTotalExpenseY5,
    roiTotalExpenseTotal,
    roiSavingsPctY1,
    roiSavingsPctY2,
    roiSavingsPctY3,
    roiSavingsPctY4,
    roiSavingsPctY5,
    roiSavingsAmountY1,
    roiSavingsAmountY2,
    roiSavingsAmountY3,
    roiSavingsAmountY4,
    roiSavingsAmountY5,
    roiSavingsAmountTotal,
    roiGrossBenefitY1,
    roiGrossBenefitY2,
    roiGrossBenefitY3,
    roiGrossBenefitY4,
    roiGrossBenefitY5,
    roiGrossBenefitTotal,
    roiNetBenefitY1,
    roiNetBenefitY2,
    roiNetBenefitY3,
    roiNetBenefitY4,
    roiNetBenefitY5,
    resetIotControlsDefaults,
  } = props;

  return (
    <div className="space-y-8">
      {/* Top Banner for IoT Controls & Hardware Template */}
      <div className="bg-slate-900 text-white p-5 px-6 rounded-3xl border-2 border-slate-900 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Layers className="h-6 w-6 text-emerald-400 animate-pulse" />
              <h2 className="font-extrabold text-base tracking-wide uppercase text-white">
                {activeSubServiceName} Costing Template
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Capex Hardware Matrix, Mandays Costing, Travel Logistics, Cloud OPEX & 5-Year Energy ROI Engine
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3.5 py-1 rounded-full font-bold">
              4-Step Interactive Engine
            </span>
            <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-400/40 px-3.5 py-1 rounded-full font-bold">
              Capex: ₹{formatMoney(iotHardwareTotalPrice)}
            </span>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-400/40 px-3.5 py-1 rounded-full font-bold">
              Payback: {roiPaybackMonths} Months
            </span>
            <button
              type="button"
              onClick={resetIotControlsDefaults}
              className="px-3.5 py-1 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
              Reset Defaults
            </button>
          </div>
        </div>
      </div>

      {/* STEP 1: HARDWARE & COMMISSIONING MATRIX (CAPEX) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 px-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-lg">
                Step 1
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Product Description & Hardware Capex Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              IR Blasters, CTs, Energy Meters, Gateways, HVAC & Lighting Controllers, Panels and Commissioning
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Capex Investment Total
            </span>
            <span className="text-base font-extrabold text-emerald-700">
              ₹{formatMoney(iotHardwareTotalPrice)}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-[#4d9338] text-white font-extrabold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4 w-20 text-center">Sl .No</th>
                <th className="py-3 px-4 min-w-[320px]">Product Description</th>
                <th className="py-3 px-4 w-32 text-center">Quantity</th>
                <th className="py-3 px-4 w-44 text-right">Unit Price (₹)</th>
                <th className="py-3 px-4 w-44 text-right">Total Price (₹)</th>
                <th className="py-3 px-4 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {iotControlsHardwareRows.map((r) => {
                const rowTotal = Math.round(Number(r.quantity || 0) * Number(r.unitPrice || 0));
                return (
                  <tr key={r.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="py-2.5 px-4 text-center font-bold text-slate-700">
                      <input
                        type="text"
                        value={r.slNo}
                        onChange={(e) => updateIotControlsHardwareRow(r.id, 'slNo', e.target.value)}
                        className="w-12 text-center font-bold text-slate-800 bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white rounded px-1 py-0.5 focus:outline-none transition"
                      />
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      <input
                        type="text"
                        value={r.productDescription}
                        onChange={(e) => updateIotControlsHardwareRow(r.id, 'productDescription', e.target.value)}
                        className="w-full px-2 py-1 text-xs font-semibold text-slate-900 bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white rounded-lg focus:outline-none transition"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <input
                        type="number"
                        min={1}
                        value={r.quantity}
                        onChange={(e) => updateIotControlsHardwareRow(r.id, 'quantity', Number(e.target.value))}
                        className="w-20 px-2 py-1 text-xs font-bold text-center text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                        <input
                          type="number"
                          value={r.unitPrice}
                          onChange={(e) => updateIotControlsHardwareRow(r.id, 'unitPrice', Number(e.target.value))}
                          className="w-full pl-6 pr-2 py-1 text-xs font-bold text-right text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-emerald-900 text-xs">
                      ₹{formatMoney(rowTotal)}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => removeIotControlsHardwareRow(r.id)}
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
            <tfoot className="bg-[#4d9338] text-white font-extrabold border-t-2 border-emerald-700">
              <tr>
                <td colSpan={4} className="py-3 px-5 text-right uppercase text-xs tracking-wider">
                  Total Capex Investment
                </td>
                <td className="py-3 px-4 text-right text-white text-sm font-black">
                  ₹{formatMoney(iotHardwareTotalPrice)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bottom Add Row Bar */}
        <div className="p-3.5 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Add more sensors, gateways, controllers, or commissioning deliverables
          </span>
          <button
            type="button"
            onClick={addIotControlsHardwareRow}
            className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-300 rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-emerald-700" /> + Add Hardware Component Row
          </button>
        </div>
      </div>

      {/* STEP 2: MAN DAYS COSTING (AIR AUDIT COSTING ENGINE) */}
      <AirAuditManpowerEngine {...props} stepNumber={2} />

      {/* STEP 3: CLOUD PLATFORM & OPEX SERVICES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 px-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-600 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-lg">
                Step 3
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Cloud Platform & Analytical Services (Annual OPEX)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cloud hosting, continuous energy analytics algorithms, dashboard access & ongoing maintenance
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Annual OPEX
            </span>
            <span className="text-sm font-extrabold text-purple-700">
              ₹{formatMoney(iotOpexTotalYearly)}/year
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-72">Service Component</th>
                <th className="py-3 px-4 min-w-[340px]">Platform Deliverables & Analytics Scope</th>
                <th className="py-3 px-4 w-48 text-right">Yearly Price (₹)</th>
                <th className="py-3 px-4 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {iotControlsOpexRows.map((r) => (
                <tr key={r.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    <input
                      type="text"
                      value={r.item}
                      onChange={(e) => updateIotControlsOpexRow(r.id, 'item', e.target.value)}
                      className="w-full px-2.5 py-1 text-xs font-bold text-slate-900 bg-transparent border border-transparent hover:border-slate-300 focus:border-purple-500 focus:bg-white rounded-lg focus:outline-none transition"
                    />
                  </td>
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      value={r.description}
                      onChange={(e) => updateIotControlsOpexRow(r.id, 'description', e.target.value)}
                      className="w-full px-2.5 py-1 text-xs text-slate-700 bg-transparent border border-transparent hover:border-slate-300 focus:border-purple-500 focus:bg-white rounded-lg focus:outline-none transition"
                    />
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-600 text-xs">₹</span>
                      <input
                        type="number"
                        value={r.yearlyPrice}
                        onChange={(e) => updateIotControlsOpexRow(r.id, 'yearlyPrice', Number(e.target.value))}
                        className="w-full pl-6 pr-2 py-1 text-xs font-extrabold text-right text-purple-900 bg-purple-50/50 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => removeIotControlsOpexRow(r.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Add Row Bar */}
        <div className="p-3.5 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Add custom cloud add-ons, AI insight engines or analytics tiers
          </span>
          <button
            type="button"
            onClick={addIotControlsOpexRow}
            className="px-4 py-2 text-xs font-bold text-purple-800 bg-purple-100/70 hover:bg-purple-200/80 border border-purple-300 rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-purple-700" /> + Add Cloud OPEX Row
          </button>
        </div>
      </div>

      {/* STEP 4: 5-YEAR FINANCIAL ROI & PAYBACK ENGINE */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-xl overflow-hidden">
        <div className="p-5 px-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-lg">
                Step 4
              </span>
              <h3 className="font-extrabold text-white text-base">
                ROI Analysis (5-Year Financial Projection)
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Interactive 5-Year Energy ROI, Baseline Cost, Capex Payback &amp; Net Customer Benefit Model
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-950/80 border border-emerald-500/40 px-4 py-2 rounded-2xl text-right">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold block">
                Calculated Payback
              </span>
              <span className="text-lg font-black text-emerald-300">
                {roiPaybackMonths} Months
              </span>
            </div>
            <div className="bg-purple-950/80 border border-purple-500/40 px-4 py-2 rounded-2xl text-right">
              <span className="text-[10px] uppercase tracking-wider text-purple-400 font-extrabold block">
                Customer Share
              </span>
              <span className="text-lg font-black text-purple-300">
                {roiCustomerSharePct.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* ROI Key Input Parameters Strip */}
        <div className="p-4 px-6 bg-slate-100/90 border-b border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Annual Energy Cost Baseline (₹)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
              <input
                type="number"
                value={iotControlsRoiState.annualEnergyCostBaseline}
                onChange={(e) => updateIotControlsRoiState('annualEnergyCostBaseline', Number(e.target.value))}
                className="w-full pl-6 pr-2 py-1 text-xs font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Annual Energy Inflation Rate (% per Year)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                value={iotControlsRoiState.energyInflationPct}
                onChange={(e) => updateIotControlsRoiState('energyInflationPct', Number(e.target.value))}
                className="w-full pr-7 pl-3 py-1 text-xs font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-600 block">5-Year Gross Savings</span>
              <span className="text-base font-black text-emerald-700">₹{formatMoney(roiSavingsAmountTotal)}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-600 block">Net Customer Benefit</span>
              <span className="text-base font-black text-indigo-700">₹{formatMoney(roiNetBenefitY5)}</span>
            </div>
          </div>
        </div>

        {/* 5-Year Financial Projection Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700 border-collapse">
            <thead className="bg-[#4d9338] text-white font-extrabold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5 min-w-[260px]">Investment by Client</th>
                <th className="py-3 px-4 text-right w-36">Year 1</th>
                <th className="py-3 px-4 text-right w-36">Year 2</th>
                <th className="py-3 px-4 text-right w-36">Year 3</th>
                <th className="py-3 px-4 text-right w-36">Year 4</th>
                <th className="py-3 px-4 text-right w-36">Year 5</th>
                <th className="py-3 px-5 text-right w-44 bg-[#3f792e] text-white font-black">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-semibold bg-white">
              {/* Row 1: Annual Energy Cost */}
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-5 font-bold text-slate-900 border-r border-slate-200">
                  Annual Energy Cost
                </td>
                <td className="py-2.5 px-4 text-right text-slate-800">₹{formatMoney(roiEnergyCostY1)}</td>
                <td className="py-2.5 px-4 text-right text-slate-800">₹{formatMoney(roiEnergyCostY2)}</td>
                <td className="py-2.5 px-4 text-right text-slate-800">₹{formatMoney(roiEnergyCostY3)}</td>
                <td className="py-2.5 px-4 text-right text-slate-800">₹{formatMoney(roiEnergyCostY4)}</td>
                <td className="py-2.5 px-4 text-right text-slate-800">₹{formatMoney(roiEnergyCostY5)}</td>
                <td className="py-2.5 px-5 text-right font-black text-slate-950 bg-slate-100/70 border-l border-slate-200">
                  ₹{formatMoney(roiEnergyCostTotal)}
                </td>
              </tr>

              {/* Row 2: Capex Investment */}
              <tr className="hover:bg-slate-50 bg-slate-50/30">
                <td className="py-2.5 px-5 font-bold text-slate-900 border-r border-slate-200">
                  Capex Investment
                </td>
                <td className="py-2.5 px-4 text-right font-bold text-emerald-800">₹{formatMoney(roiCapexY1)}</td>
                <td className="py-2.5 px-4 text-right text-slate-400">₹0.00</td>
                <td className="py-2.5 px-4 text-right text-slate-400">₹0.00</td>
                <td className="py-2.5 px-4 text-right text-slate-400">₹0.00</td>
                <td className="py-2.5 px-4 text-right text-slate-400">₹0.00</td>
                <td className="py-2.5 px-5 text-right font-black text-emerald-900 bg-emerald-50/50 border-l border-slate-200">
                  ₹{formatMoney(roiCapexTotal)}
                </td>
              </tr>

              {/* Row 3: Opex Cost (Cloud & Analytics) */}
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-5 font-bold text-slate-900 border-r border-slate-200">
                  Opex Cost (Cloud &amp; Analytics)
                </td>
                <td className="py-2.5 px-4 text-right text-purple-900 font-semibold">₹{formatMoney(roiOpexY1)}</td>
                <td className="py-2.5 px-4 text-right text-purple-900 font-semibold">₹{formatMoney(roiOpexY2)}</td>
                <td className="py-2.5 px-4 text-right text-purple-900 font-semibold">₹{formatMoney(roiOpexY3)}</td>
                <td className="py-2.5 px-4 text-right text-purple-900 font-semibold">₹{formatMoney(roiOpexY4)}</td>
                <td className="py-2.5 px-4 text-right text-purple-900 font-semibold">₹{formatMoney(roiOpexY5)}</td>
                <td className="py-2.5 px-5 text-right font-black text-purple-950 bg-purple-50/50 border-l border-slate-200">
                  ₹{formatMoney(roiOpexTotal)}
                </td>
              </tr>

              {/* Row 4: Total Expense */}
              <tr className="bg-amber-50/60 font-black border-y-2 border-slate-300">
                <td className="py-2.5 px-5 text-slate-950 uppercase text-[11px] border-r border-slate-200">
                  Total Expense
                </td>
                <td className="py-2.5 px-4 text-right text-amber-950">₹{formatMoney(roiTotalExpenseY1)}</td>
                <td className="py-2.5 px-4 text-right text-amber-950">₹{formatMoney(roiTotalExpenseY2)}</td>
                <td className="py-2.5 px-4 text-right text-amber-950">₹{formatMoney(roiTotalExpenseY3)}</td>
                <td className="py-2.5 px-4 text-right text-amber-950">₹{formatMoney(roiTotalExpenseY4)}</td>
                <td className="py-2.5 px-4 text-right text-amber-950">₹{formatMoney(roiTotalExpenseY5)}</td>
                <td className="py-2.5 px-5 text-right text-amber-950 bg-amber-100 border-l border-slate-300">
                  ₹{formatMoney(roiTotalExpenseTotal)}
                </td>
              </tr>

              {/* Row 5: Expected Savings % */}
              <tr className="bg-emerald-50/30">
                <td className="py-2 px-5 font-bold text-emerald-950 border-r border-slate-200">
                  Expected Savings %
                </td>
                <td className="py-2 px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={roiSavingsPctY1}
                      onChange={(e) => updateIotControlsRoiState('savingsPctY1', Number(e.target.value))}
                      className="w-14 text-right font-black text-emerald-800 bg-white border border-emerald-300 rounded px-1 py-0.5 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-emerald-700 font-bold text-xs">%</span>
                  </div>
                </td>
                <td className="py-2 px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={roiSavingsPctY2}
                      onChange={(e) => updateIotControlsRoiState('savingsPctY2', Number(e.target.value))}
                      className="w-14 text-right font-black text-emerald-800 bg-white border border-emerald-300 rounded px-1 py-0.5 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-emerald-700 font-bold text-xs">%</span>
                  </div>
                </td>
                <td className="py-2 px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={roiSavingsPctY3}
                      onChange={(e) => updateIotControlsRoiState('savingsPctY3', Number(e.target.value))}
                      className="w-14 text-right font-black text-emerald-800 bg-white border border-emerald-300 rounded px-1 py-0.5 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-emerald-700 font-bold text-xs">%</span>
                  </div>
                </td>
                <td className="py-2 px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={roiSavingsPctY4}
                      onChange={(e) => updateIotControlsRoiState('savingsPctY4', Number(e.target.value))}
                      className="w-14 text-right font-black text-emerald-800 bg-white border border-emerald-300 rounded px-1 py-0.5 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-emerald-700 font-bold text-xs">%</span>
                  </div>
                </td>
                <td className="py-2 px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={roiSavingsPctY5}
                      onChange={(e) => updateIotControlsRoiState('savingsPctY5', Number(e.target.value))}
                      className="w-14 text-right font-black text-emerald-800 bg-white border border-emerald-300 rounded px-1 py-0.5 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-emerald-700 font-bold text-xs">%</span>
                  </div>
                </td>
                <td className="py-2 px-5 text-right font-black text-emerald-950 bg-emerald-100/70 border-l border-slate-200">
                  {roiExpectedSavingsAvgPct.toFixed(1)}% (Avg)
                </td>
              </tr>

              {/* Row 6: Savings Amount */}
              <tr className="hover:bg-slate-50">
                <td className="py-2.5 px-5 font-bold text-emerald-950 border-r border-slate-200">
                  Savings Amount
                </td>
                <td className="py-2.5 px-4 text-right text-emerald-700 font-bold">₹{formatMoney(roiSavingsAmountY1)}</td>
                <td className="py-2.5 px-4 text-right text-emerald-700 font-bold">₹{formatMoney(roiSavingsAmountY2)}</td>
                <td className="py-2.5 px-4 text-right text-emerald-700 font-bold">₹{formatMoney(roiSavingsAmountY3)}</td>
                <td className="py-2.5 px-4 text-right text-emerald-700 font-bold">₹{formatMoney(roiSavingsAmountY4)}</td>
                <td className="py-2.5 px-4 text-right text-emerald-700 font-bold">₹{formatMoney(roiSavingsAmountY5)}</td>
                <td className="py-2.5 px-5 text-right font-black text-emerald-950 bg-emerald-100/50 border-l border-slate-200">
                  ₹{formatMoney(roiSavingsAmountTotal)}
                </td>
              </tr>

              {/* Row 7: Gross Customer Benefit */}
              <tr className="hover:bg-slate-50 bg-slate-50/40">
                <td className="py-2.5 px-5 font-bold text-slate-900 border-r border-slate-200">
                  Gross Customer Benefit
                </td>
                <td className={`py-2.5 px-4 text-right font-bold ${roiGrossBenefitY1 < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                  ₹{formatMoney(roiGrossBenefitY1)}
                </td>
                <td className="py-2.5 px-4 text-right text-slate-800 font-bold">₹{formatMoney(roiGrossBenefitY2)}</td>
                <td className="py-2.5 px-4 text-right text-slate-800 font-bold">₹{formatMoney(roiGrossBenefitY3)}</td>
                <td className="py-2.5 px-4 text-right text-slate-800 font-bold">₹{formatMoney(roiGrossBenefitY4)}</td>
                <td className="py-2.5 px-4 text-right text-slate-800 font-bold">₹{formatMoney(roiGrossBenefitY5)}</td>
                <td className="py-2.5 px-5 text-right font-black text-slate-950 bg-slate-100 border-l border-slate-200">
                  ₹{formatMoney(roiGrossBenefitTotal)}
                </td>
              </tr>

              {/* Row 8: Net Customer Benefit (Cumulative) */}
              <tr className="bg-indigo-50/70 font-black border-t-2 border-indigo-200">
                <td className="py-3 px-5 text-indigo-950 uppercase text-[11px] border-r border-indigo-200">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                    <span>Net Customer Benefit (Cumulative)</span>
                  </div>
                </td>
                <td className={`py-3 px-4 text-right ${roiNetBenefitY1 < 0 ? 'text-rose-600' : 'text-indigo-950'}`}>
                  ₹{formatMoney(roiNetBenefitY1)}
                </td>
                <td className={`py-3 px-4 text-right ${roiNetBenefitY2 < 0 ? 'text-rose-600' : 'text-indigo-950'}`}>
                  ₹{formatMoney(roiNetBenefitY2)}
                </td>
                <td className="py-3 px-4 text-right text-indigo-950">₹{formatMoney(roiNetBenefitY3)}</td>
                <td className="py-3 px-4 text-right text-indigo-950">₹{formatMoney(roiNetBenefitY4)}</td>
                <td className="py-3 px-4 text-right text-indigo-950">₹{formatMoney(roiNetBenefitY5)}</td>
                <td className="py-3 px-5 text-right text-indigo-950 bg-indigo-200/80 text-sm border-l border-indigo-300 font-black">
                  ₹{formatMoney(roiNetBenefitY5)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ROI Key Footnotes & Assumptions */}
        <div className="p-5 px-6 bg-slate-50 border-t border-slate-200 space-y-2 text-xs text-slate-600">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Assumptions &amp; Explanations:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                AC Loading Assumption
              </span>
              <textarea
                rows={3}
                value={iotControlsRoiState.acLoadingAssumption}
                onChange={(e) => updateIotControlsRoiState('acLoadingAssumption', e.target.value)}
                className="w-full text-xs text-slate-700 bg-transparent border-0 focus:outline-none resize-none"
              />
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                AC Scheduling Assumption
              </span>
              <textarea
                rows={3}
                value={iotControlsRoiState.acSchedulingAssumption}
                onChange={(e) => updateIotControlsRoiState('acSchedulingAssumption', e.target.value)}
                className="w-full text-xs text-slate-700 bg-transparent border-0 focus:outline-none resize-none"
              />
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                OPEX Assumption
              </span>
              <textarea
                rows={3}
                value={iotControlsRoiState.opexAssumption}
                onChange={(e) => updateIotControlsRoiState('opexAssumption', e.target.value)}
                className="w-full text-xs text-slate-700 bg-transparent border-0 focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

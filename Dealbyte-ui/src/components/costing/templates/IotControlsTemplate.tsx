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
  bufferPct?: number;
  setBufferPct?: (val: number) => void;
  roundingNearest?: number;
  setRoundingNearest?: (val: number) => void;
  resetIotControlsDefaults: () => void;

  // Packaging Charges (Editable)
  iotPackagingPct?: number;
  setIotPackagingPct?: (pct: number) => void;
  iotPackagingManualCost?: number | null;
  setIotPackagingManualCost?: (val: number | null) => void;
  iotPackagingManualPrice?: number | null;
  setIotPackagingManualPrice?: (val: number | null) => void;
  iotPackagingMarginPct?: number;
  setIotPackagingMarginPct?: (val: number) => void;
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
    bufferPct = 10,
    setBufferPct,
    resetIotControlsDefaults,
    iotPackagingPct = 3,
    setIotPackagingPct,
    iotPackagingManualCost = null,
    setIotPackagingManualCost,
    iotPackagingManualPrice = null,
    setIotPackagingManualPrice,
    iotPackagingMarginPct = 0,
    setIotPackagingMarginPct,
  } = props;

  const calcPriceFromCost = (cost: number, margin: number) => cost / (1 - margin / 100);

  const iotHardwareBasePrice = React.useMemo(() => {
    return iotControlsHardwareRows.reduce((sum, r) => sum + Math.round(Number(r.quantity || 0) * Number(r.unitPrice || 0)), 0);
  }, [iotControlsHardwareRows]);
  const iotAutoPackagingPrice = Math.round(iotHardwareBasePrice * (iotPackagingPct / 100));
  const iotEffectivePackagingPrice = iotPackagingManualPrice !== null
    ? iotPackagingManualPrice
    : (iotPackagingMarginPct > 0 && iotPackagingManualCost !== null ? Math.round(calcPriceFromCost(iotPackagingManualCost, iotPackagingMarginPct)) : iotAutoPackagingPrice);

  const isIrBlaster = (activeSubServiceName || '').toLowerCase().includes('ir blaster');
  const bufferPctVal = props.bufferPct !== undefined ? props.bufferPct : 10;
  const setBufferPctVal = props.setBufferPct || (() => {});
  const roundingNearest = props.roundingNearest !== undefined ? props.roundingNearest : 100;
  const setRoundingNearest = props.setRoundingNearest || (() => {});

  const roundToNearest = (val: number, nearest: number = 100) => {
    const step = Number(nearest) || 1;
    return Math.ceil(val / step) * step;
  };

  // Base Totals
  const rawHardwareBase = iotHardwareBasePrice + iotEffectivePackagingPrice;
  const rawOpexBase = iotOpexTotalYearly;
  const rawTotalBase = rawHardwareBase + (isIrBlaster ? rawOpexBase : 0);

  // Buffer / Contingency calculations (Contingency is NOT applied to Packaging Charges)
  const hardwareBaseWithoutPkg = iotHardwareBasePrice;
  const hardwareContingency = bufferPct > 0 ? Math.round(hardwareBaseWithoutPkg / Math.max(0.01, (100 - bufferPct) / 100)) : hardwareBaseWithoutPkg;
  const hardwareRounded = roundToNearest(hardwareContingency + iotEffectivePackagingPrice, roundingNearest);

  const opexContingency = bufferPct > 0 ? Math.round(rawOpexBase / Math.max(0.01, (100 - bufferPct) / 100)) : rawOpexBase;
  const opexRounded = roundToNearest(opexContingency, roundingNearest);

  const totalWithBuffer = hardwareContingency + iotEffectivePackagingPrice + (isIrBlaster ? opexContingency : 0);
  const finalCustomerTotal = hardwareRounded + (isIrBlaster ? opexRounded : 0);
  const totalBufferAmount = finalCustomerTotal - rawTotalBase;

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
              {isIrBlaster
                ? 'Capex Hardware Matrix, Recurring Cost & Commercial Investment Summary'
                : 'Capex Hardware Matrix, Mandays Costing, Travel Logistics, Cloud OPEX & 5-Year Energy ROI Engine'}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3.5 py-1 rounded-full font-bold">
              {isIrBlaster ? '3-Step Interactive Engine' : '4-Step Interactive Engine'}
            </span>
            <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-400/40 px-3.5 py-1 rounded-full font-bold">
              Capex: ₹{formatMoney(iotHardwareTotalPrice)}
            </span>
            {!isIrBlaster && (
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-400/40 px-3.5 py-1 rounded-full font-bold">
                Payback: {roiPaybackMonths} Months
              </span>
            )}
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
                <th className="py-3 px-3 w-16 text-center">Sl .No</th>
                <th className="py-3 px-4 min-w-[260px]">Product Description</th>
                <th className="py-3 px-2 w-20 text-center">Quantity</th>
                <th className="py-3 px-3 w-32 text-right">Unit Cost (₹)</th>
                <th className="py-3 px-2 w-20 text-center">Margin %</th>
                <th className="py-3 px-3 w-32 text-right">Unit Price (₹)</th>
                <th className="py-3 px-3 w-36 text-right">Total Price (₹)</th>
                <th className="py-3 px-2 w-14 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {iotControlsHardwareRows.map((r) => {
                const rowTotal = Math.round(Number(r.quantity || 0) * Number(r.unitPrice || 0));
                return (
                  <tr key={r.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                      <input
                        type="text"
                        value={r.slNo}
                        onChange={(e) => updateIotControlsHardwareRow(r.id, 'slNo', e.target.value)}
                        className="w-12 text-center font-bold text-slate-800 bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white rounded px-1 py-0.5 focus:outline-none transition"
                      />
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      <textarea
                        rows={Math.max(1, Math.ceil((r.productDescription?.length || 1) / 36))}
                        value={r.productDescription}
                        onChange={(e) => updateIotControlsHardwareRow(r.id, 'productDescription', e.target.value)}
                        className="w-full px-2 py-1 text-xs font-semibold text-slate-900 bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white rounded-lg focus:outline-none transition resize-none leading-snug whitespace-pre-wrap"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        value={r.quantity === 0 || r.quantity === undefined ? '' : r.quantity}
                        placeholder="0"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateIotControlsHardwareRow(r.id, 'quantity', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-bold text-center text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                        <input
                          type="number"
                          value={r.unitCost === 0 || r.unitCost === undefined ? '' : r.unitCost}
                          placeholder="0"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => updateIotControlsHardwareRow(r.id, 'unitCost', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-full pl-6 pr-2 py-1 text-xs font-bold text-right text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <div className="inline-flex items-center justify-center gap-0.5 bg-emerald-50 border border-emerald-300 rounded-lg px-1.5 py-0.5">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={r.marginPct === 0 ? '' : (r.marginPct !== undefined ? r.marginPct : 40)}
                          placeholder="0"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => updateIotControlsHardwareRow(r.id, 'marginPct', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-10 text-center font-bold text-emerald-800 bg-transparent text-xs focus:outline-none"
                        />
                        <span className="text-[10px] font-extrabold text-emerald-700">%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600 text-xs">₹</span>
                        <input
                          type="number"
                          value={r.unitPrice === 0 || r.unitPrice === undefined ? '' : r.unitPrice}
                          placeholder="0"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => updateIotControlsHardwareRow(r.id, 'unitPrice', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-full pl-6 pr-2 py-1 text-xs font-extrabold text-right text-emerald-700 bg-emerald-50/50 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900 text-xs">
                      ₹{formatMoney(rowTotal)}
                    </td>
                    <td className="py-2.5 px-2 text-center">
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
              {/* TOTAL 1: Overall Base Hardware Supply Total */}
              {iotControlsHardwareRows.reduce((sum, r) => sum + Math.round(Number(r.quantity || 0) * Number(r.unitCost || 0)), 0) > 0 && (
                <tr className="bg-slate-100/90 font-bold border-t-2 border-slate-300 text-xs text-slate-800">
                  <td colSpan={5} className="py-2.5 px-4 text-right uppercase text-[11px] font-extrabold tracking-wider">
                    Overall Hardware Supply Base Total
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-400">-</td>
                  <td className="py-2.5 px-3 text-right font-black text-slate-900">
                    ₹{formatMoney(iotControlsHardwareRows.reduce((sum, r) => sum + Math.round(Number(r.quantity || 0) * Number(r.unitPrice || 0)), 0))}
                  </td>
                  <td></td>
                </tr>
              )}

              {/* TOTAL 2: Packaging Charges Row (Fully Editable) */}
              <tr className="bg-emerald-50/60 font-bold border-t border-emerald-200 text-xs text-slate-800">
                <td className="py-2.5 px-3 text-center text-emerald-800">★</td>
                <td className="py-2.5 px-4 font-extrabold text-emerald-950" colSpan={4}>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1 bg-emerald-200/90 text-emerald-950 rounded px-1.5 py-0.5 border border-emerald-300">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={iotPackagingPct}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setIotPackagingPct?.(val);
                          setIotPackagingManualCost?.(null);
                          setIotPackagingManualPrice?.(null);
                        }}
                        className="w-10 text-center bg-white font-black text-emerald-950 rounded text-xs py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <span className="font-black text-[10px] text-emerald-900">% Capex</span>
                    </div>
                    <span>Packaging Charges (Overall Hardware Selling Total × {iotPackagingPct}%)</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                  <div className="flex items-center justify-center gap-0.5 bg-white border border-slate-200 rounded px-1 py-0.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={iotPackagingMarginPct}
                      onChange={(e) => setIotPackagingMarginPct?.(Number(e.target.value) || 0)}
                      className="w-7 text-center text-xs font-bold text-slate-700 focus:outline-none"
                    />
                    <span className="text-slate-400 text-[10px]">%</span>
                  </div>
                </td>
                <td className="py-1 px-2 text-right font-extrabold text-emerald-800">
                  <div className="flex items-center gap-0.5 bg-white border border-emerald-300 rounded px-1 py-0.5 shadow-2xs">
                    <span className="text-emerald-700 text-[10px]">₹</span>
                    <input
                      type="number"
                      value={iotPackagingManualPrice !== null ? iotPackagingManualPrice : iotEffectivePackagingPrice}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : Number(e.target.value);
                        setIotPackagingManualPrice?.(val);
                      }}
                      className="w-full text-right text-xs font-black text-emerald-950 focus:outline-none"
                    />
                  </div>
                </td>
                <td className="py-2.5 px-2 text-center text-emerald-600 font-bold">✓</td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td colSpan={6} className="py-3 px-4 text-right uppercase text-xs tracking-wider">
                  Step 1 Total Hardware Capex (Overall Total + {iotPackagingPct}% Packaging Charges)
                </td>
                <td className="py-3 px-4 text-right text-emerald-800 text-sm font-black">
                  ₹{formatMoney(iotHardwareBasePrice + iotEffectivePackagingPrice)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bottom Add Row Bar */}
        <div className="p-3.5 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Add custom gateways, sensors, CTs, controllers or auxiliary hardware
          </span>
          <button
            type="button"
            onClick={addIotControlsHardwareRow}
            className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-300 rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-emerald-700" /> + Add Hardware Item Row
          </button>
        </div>
      </div>

      {/* STEP 2: INSTALLATION & COMMISSIONING (AIR AUDIT MANPOWER ENGINE) */}
      {!isIrBlaster && (
        <AirAuditManpowerEngine
          {...props}
          stepNumber="Step 2"
          stepTitle="IoT Field Implementation & Commissioning Scope"
          stepSubtitle="On-site IoT controller deployment, sensor calibration, wiring, gateway mapping & telemetry testing"
        />
      )}

      {/* STEP 2: RECURRING COST (ANNUAL OPEX) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 px-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-600 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-lg">
                {isIrBlaster ? 'Step 2' : 'Step 3'}
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Recurring Cost
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cloud hosting, SIM charges, data telemetry &amp; recurring annual subscription fees
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Recurring Cost
            </span>
            <span className="text-sm font-extrabold text-purple-700">
              ₹{formatMoney(iotOpexTotalYearly)}/year
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-[#4d9338] text-white font-extrabold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-3 w-16 text-center">Sl .No</th>
                <th className="py-3 px-4 min-w-[260px]">Description</th>
                <th className="py-3 px-2 w-20 text-center">Quantity</th>
                <th className="py-3 px-3 w-32 text-right">Unit Cost (₹)</th>
                <th className="py-3 px-2 w-20 text-center">Margin %</th>
                <th className="py-3 px-3 w-32 text-right">Unit Price (₹)</th>
                <th className="py-3 px-3 w-36 text-right">Total Price (₹)</th>
                <th className="py-3 px-2 w-14 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {iotControlsOpexRows.map((r, idx) => {
                const qty = Number(r.quantity || 0);
                const unitP = Number(r.unitPrice || 0);
                const rowTotal = r.quantity !== undefined && r.unitPrice !== undefined
                  ? Math.round(qty * unitP)
                  : Number(r.yearlyPrice || 0);
                return (
                  <tr key={r.id} className="hover:bg-emerald-50/20 transition-colors">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                      <input
                        type="text"
                        value={r.slNo || `${idx + 1}`}
                        onChange={(e) => updateIotControlsOpexRow(r.id, 'slNo', e.target.value)}
                        className="w-12 text-center font-bold text-slate-800 bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white rounded px-1 py-0.5 focus:outline-none transition"
                      />
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      <textarea
                        rows={Math.max(1, Math.ceil((r.item?.length || 1) / 36))}
                        value={r.item}
                        onChange={(e) => updateIotControlsOpexRow(r.id, 'item', e.target.value)}
                        className="w-full px-2 py-1 text-xs font-semibold text-slate-900 bg-transparent border border-transparent hover:border-slate-300 focus:border-emerald-500 focus:bg-white rounded-lg focus:outline-none transition resize-none leading-snug whitespace-pre-wrap"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min={0}
                        value={r.quantity === 0 || r.quantity === undefined ? '' : r.quantity}
                        placeholder="0"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateIotControlsOpexRow(r.id, 'quantity', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-bold text-center text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                        <input
                          type="number"
                          value={r.unitCost === 0 || r.unitCost === undefined ? '' : r.unitCost}
                          placeholder="0"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => updateIotControlsOpexRow(r.id, 'unitCost', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-full pl-6 pr-2 py-1 text-xs font-bold text-right text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <div className="inline-flex items-center justify-center gap-0.5 bg-emerald-50 border border-emerald-300 rounded-lg px-1.5 py-0.5">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={r.marginPct === 0 ? '' : (r.marginPct !== undefined ? r.marginPct : 40)}
                          placeholder="0"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => updateIotControlsOpexRow(r.id, 'marginPct', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-10 text-center font-bold text-emerald-800 bg-transparent text-xs focus:outline-none"
                        />
                        <span className="text-[10px] font-extrabold text-emerald-700">%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600 text-xs">₹</span>
                        <input
                          type="number"
                          value={r.unitPrice === 0 || r.unitPrice === undefined ? '' : r.unitPrice}
                          placeholder="0"
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => updateIotControlsOpexRow(r.id, 'unitPrice', e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-full pl-6 pr-2 py-1 text-xs font-extrabold text-right text-emerald-700 bg-emerald-50/50 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900 text-xs">
                      ₹{formatMoney(rowTotal)}
                    </td>
                    <td className="py-2.5 px-2 text-center">
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
                );
              })}
            </tbody>
            <tfoot className="bg-emerald-50/60 font-extrabold text-slate-900 border-t-2 border-emerald-200">
              <tr>
                <td colSpan={6} className="py-3 px-4 text-right uppercase text-[11px] tracking-wider text-emerald-900 font-black">
                  Total Recurring Cost
                </td>
                <td className="py-3 px-3 text-right text-emerald-900 text-sm font-black">
                  ₹{formatMoney(iotOpexTotalYearly)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bottom Add Row Bar */}
        <div className="p-3.5 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Add recurring cloud charges, SIM connectivity or annual service tiers
          </span>
          <button
            type="button"
            onClick={addIotControlsOpexRow}
            className="px-4 py-2 text-xs font-bold text-purple-800 bg-purple-100/70 hover:bg-purple-200/80 border border-purple-300 rounded-xl transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-purple-700" /> + Add Recurring Cost Row
          </button>
        </div>
      </div>

      {/* STEP 3: COMMERCIAL SUMMARY & TOTALS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 px-6 bg-slate-50 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-lg">
                Step 3
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Commercial Summary
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Consolidated commercial deliverables, itemized pricing &amp; final quotation totals
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Quote Buffer Controller */}
            <div className="flex items-center gap-1.5 bg-white border border-emerald-300 rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-xs font-extrabold text-slate-700">Quote Buffer:</span>
              <input
                type="number"
                min={0}
                max={100}
                value={bufferPct}
                onChange={(e) => setBufferPct?.(Math.max(0, Number(e.target.value)))}
                className="w-12 text-center font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1 py-0.5 text-xs focus:outline-none"
              />
              <span className="text-xs font-extrabold text-emerald-800">%</span>
              <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5">
                {[0, 5, 10, 15, 20].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBufferPct?.(b)}
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition ${
                      bufferPct === b ? 'bg-emerald-600 text-white font-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {b}%
                  </button>
                ))}
              </div>
            </div>

            {/* Round Nearest Controller */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-xs font-extrabold text-slate-700">Round Nearest:</span>
              <span className="text-xs font-bold text-slate-400">₹</span>
              <input
                type="number"
                min={1}
                step={50}
                value={roundingNearest}
                onChange={(e) => setRoundingNearest(Math.max(1, Number(e.target.value)))}
                className="w-14 text-center font-black text-amber-600 bg-amber-50 border border-amber-200 rounded px-1 py-0.5 text-xs focus:outline-none"
              />
              <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5">
                {[10, 50, 100, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRoundingNearest(val)}
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                      roundingNearest === val
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Commercial Total Badge */}
            <div className="bg-[#4d9338] text-white px-4 py-1.5 rounded-xl text-right shadow-xs">
              <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider block">
                Final Customer Quote
              </span>
              <span className="text-base font-black text-white">
                ₹{formatMoney(finalCustomerTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-xs text-left text-slate-700 border-collapse">
              <thead className="bg-[#4d9338] text-white font-extrabold text-[11px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 w-16 text-center border-r border-[#3d7a2c]">Sl .No</th>
                  <th className="py-2.5 px-4 min-w-[280px] border-r border-[#3d7a2c]">Product Description</th>
                  <th className="py-2.5 px-3 w-24 text-center border-r border-[#3d7a2c]">Quantity</th>
                  <th className="py-2.5 px-4 w-36 text-right border-r border-[#3d7a2c]">Unit Price</th>
                  <th className="py-2.5 px-4 w-40 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {iotControlsHardwareRows.map((r, idx) => {
                  const rowTotal = Math.round(Number(r.quantity || 0) * Number(r.unitPrice || 0));
                  return (
                    <tr key={r.id} className="hover:bg-emerald-50/20 transition-colors">
                      <td className="py-2 px-3 text-center font-bold text-slate-700 border-r border-slate-200">
                        {r.slNo || `${idx + 1}`}
                      </td>
                      <td className="py-2 px-4 font-semibold text-slate-900 border-r border-slate-200">
                        {r.productDescription}
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-slate-800 border-r border-slate-200">
                        {r.quantity}
                      </td>
                      <td className="py-2 px-4 text-right font-semibold text-slate-800 border-r border-slate-200">
                        ₹ {formatMoney(r.unitPrice || 0)}
                      </td>
                      <td className="py-2 px-4 text-right font-black text-slate-900">
                        ₹ {formatMoney(rowTotal)}
                      </td>
                    </tr>
                  );
                })}
                {(iotPackagingPct > 0 || iotEffectivePackagingPrice > 0) && (
                  <tr className="bg-emerald-50/40 font-bold">
                    <td className="py-2 px-3 text-center font-bold text-emerald-800 border-r border-slate-200">★</td>
                    <td className="py-2 px-4 font-bold text-emerald-950 border-r border-slate-200">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1 bg-emerald-100 text-emerald-950 rounded px-1.5 py-0.5 border border-emerald-300">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={0.5}
                            value={iotPackagingPct}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setIotPackagingPct?.(val);
                              setIotPackagingManualCost?.(null);
                              setIotPackagingManualPrice?.(null);
                            }}
                            className="w-10 text-center bg-white font-black text-emerald-950 rounded text-xs py-0.5 border border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <span className="font-black text-[10px] text-emerald-900">% Capex</span>
                        </div>
                        <span>Packaging &amp; Forwarding Charges ({iotPackagingPct}% of Overall Hardware Capex)</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-slate-800 border-r border-slate-200">1</td>
                    <td className="py-2 px-4 text-right font-semibold text-slate-800 border-r border-slate-200">
                      ₹ {formatMoney(iotEffectivePackagingPrice)}
                    </td>
                    <td className="py-2 px-4 text-right font-black text-emerald-900">
                      ₹ {formatMoney(iotEffectivePackagingPrice)}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-[#4d9338] text-white font-black text-xs border-t border-[#3d7a2c]">
                <tr>
                  <td colSpan={4} className="py-2.5 px-4 text-center uppercase tracking-wider font-extrabold text-white text-xs">
                    Step 1 Total Hardware Capex (Overall Total + {iotPackagingPct}% Packaging Charges)
                  </td>
                  <td className="py-2.5 px-4 text-right font-black text-sm text-white">
                    ₹ {formatMoney(rawHardwareBase)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* If Recurring OPEX Rows present */}
          {iotControlsOpexRows.some((r) => Number(r.quantity || 0) > 0 || Number(r.yearlyPrice || 0) > 0) && (
            <div className="mt-6">
              <h4 className="text-xs font-extrabold text-purple-900 uppercase tracking-wider mb-2">
                Recurring / Annual OPEX Commercial Breakdown
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
                <table className="w-full text-xs text-left text-slate-700 border-collapse">
                  <thead className="bg-[#4d9338] text-white font-extrabold text-[11px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3 w-16 text-center border-r border-[#3d7a2c]">Sl .No</th>
                      <th className="py-2.5 px-4 min-w-[280px] border-r border-[#3d7a2c]">Description</th>
                      <th className="py-2.5 px-3 w-24 text-center border-r border-[#3d7a2c]">Quantity</th>
                      <th className="py-2.5 px-4 w-36 text-right border-r border-[#3d7a2c]">Unit Price</th>
                      <th className="py-2.5 px-4 w-40 text-right">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {iotControlsOpexRows.map((r, idx) => {
                      const qty = Number(r.quantity || 0);
                      const unitP = Number(r.unitPrice || 0);
                      const rowTotal = r.quantity !== undefined && r.unitPrice !== undefined
                        ? Math.round(qty * unitP)
                        : Number(r.yearlyPrice || 0);
                      return (
                        <tr key={r.id} className="hover:bg-purple-50/20 transition-colors">
                          <td className="py-2 px-3 text-center font-bold text-slate-700 border-r border-slate-200">
                            {r.slNo || `${idx + 1}`}
                          </td>
                          <td className="py-2 px-4 font-semibold text-slate-900 border-r border-slate-200">
                            {r.item}
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-slate-800 border-r border-slate-200">
                            {r.quantity !== undefined ? r.quantity : 0}
                          </td>
                          <td className="py-2 px-4 text-right font-semibold text-slate-800 border-r border-slate-200">
                            ₹ {formatMoney(r.unitPrice !== undefined ? r.unitPrice : 0)}
                          </td>
                          <td className="py-2 px-4 text-right font-black text-purple-900">
                            ₹ {formatMoney(rowTotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-[#4d9338] text-white font-black text-xs border-t border-[#3d7a2c]">
                    <tr>
                      <td colSpan={4} className="py-2.5 px-4 text-center uppercase tracking-wider font-extrabold text-white text-xs">
                        Total Recurring Base
                      </td>
                      <td className="py-2.5 px-4 text-right font-black text-sm text-white">
                        ₹ {formatMoney(iotOpexTotalYearly)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Overall Commercial Total Summary */}
          <div className="mt-6 p-5 bg-gradient-to-br from-emerald-50/80 via-white to-slate-50 border-2 border-[#4d9338] rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-emerald-200/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    Commercial Quotation Summary
                  </span>
                  <span className="text-xs font-extrabold text-slate-500">
                    (Base + {bufferPct}% Buffer + Rounding)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Consolidated One-Time Hardware Capex &amp; Annual Recurring Cloud OPEX with client negotiation contingency
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-[#4d9338] text-white px-5 py-2 rounded-xl text-right shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 block">
                    Overall Customer Investment
                  </span>
                  <span className="text-xl font-black text-white">
                    ₹{formatMoney(finalCustomerTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Detail Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">1. Hardware Capex (Base / Rounded)</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 font-semibold line-through">₹{formatMoney(rawHardwareBase)}</span>
                  <span className="text-sm font-black text-slate-900">₹{formatMoney(hardwareRounded)}</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold block">+ ₹{formatMoney(hardwareRounded - rawHardwareBase)} ({bufferPct}% Buffer)</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-purple-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">2. Recurring OPEX (Base / Rounded)</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 font-semibold line-through">₹{formatMoney(rawOpexBase)}/yr</span>
                  <span className="text-sm font-black text-purple-900">₹{formatMoney(opexRounded)}/yr</span>
                </div>
                <span className="text-[10px] text-purple-700 font-bold block">+ ₹{formatMoney(opexRounded - rawOpexBase)}/yr ({bufferPct}% Buffer)</span>
              </div>

              <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">3. Total Quote Buffer ({bufferPct}%)</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-amber-700 font-medium">Contingency:</span>
                  <span className="text-sm font-black text-amber-900">+ ₹{formatMoney(totalBufferAmount)}</span>
                </div>
                <span className="text-[10px] text-amber-700 font-semibold block">Nearest ₹{roundingNearest} Rounding</span>
              </div>

              <div className="bg-emerald-900 text-white p-3 rounded-xl shadow-xs space-y-1">
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">4. Final Quotation (Net)</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-emerald-200 font-medium">Total Payable:</span>
                  <span className="text-base font-black text-white">₹{formatMoney(finalCustomerTotal)}</span>
                </div>
                <span className="text-[10px] text-emerald-300 font-medium block">All Deliverables Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 4: 5-YEAR FINANCIAL ROI & PAYBACK ENGINE */}
      {!isIrBlaster && (
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
      )}
    </div>
  );
};

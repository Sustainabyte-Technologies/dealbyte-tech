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
import { SearchableSelect, SearchableOption } from '../shared/SearchableSelect';
import {
  STANDARD_EMS_GATEWAY_HARDWARE_CATALOG,
  STANDARD_EMS_ELECTRICAL_HARDWARE_CATALOG,
  getActiveGatewayHardwareCatalog,
  getActiveElectricalHardwareCatalog,
} from '../constants';

export interface EmsCostingTemplateProps extends AirAuditManpowerEngineProps {
  activeSubServiceName: string;
  emsGatewayHardwareRows: EmsHardwareRow[];
  updateEmsGatewayHardwareRow: (id: string, field: keyof EmsHardwareRow, val: any) => void;
  addEmsGatewayHardwareRow: (preset?: Partial<EmsHardwareRow>) => void;
  removeEmsGatewayHardwareRow: (id: string) => void;
  emsGatewayHardwareTotalCost: number;
  emsGatewayHardwareTotalPrice: number;
  emsElectricalHardwareRows: EmsHardwareRow[];
  updateEmsElectricalHardwareRow: (id: string, field: keyof EmsHardwareRow, val: any) => void;
  addEmsElectricalHardwareRow: (preset?: Partial<EmsHardwareRow>) => void;
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
  roundingNearest?: number;
  setRoundingNearest?: (val: number) => void;
  airAutoManpowerProps?: AirAuditManpowerEngineProps;
  airAutoManpowerTotalCost?: number;
  airAutoManpowerTotalPrice?: number;
  airInstManpowerProps?: AirAuditManpowerEngineProps;
  airInstManpowerTotalCost?: number;
  airInstManpowerTotalPrice?: number;

  // Packaging Charges (Editable)
  emsPackagingPct?: number;
  setEmsPackagingPct?: (pct: number) => void;
  emsPackagingManualCost?: number | null;
  setEmsPackagingManualCost?: (val: number | null) => void;
  emsPackagingManualPrice?: number | null;
  setEmsPackagingManualPrice?: (val: number | null) => void;
  emsPackagingMarginPct?: number;
  setEmsPackagingMarginPct?: (val: number) => void;
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
    emsPackagingPct = 3,
    setEmsPackagingPct,
    emsPackagingManualCost = null,
    setEmsPackagingManualCost,
    emsPackagingManualPrice = null,
    setEmsPackagingManualPrice,
    emsPackagingMarginPct = 0,
    setEmsPackagingMarginPct,
  } = props;

  const emsHardwareBasePrice = emsGatewayHardwareTotalPrice + emsElectricalHardwareTotalPrice;
  const emsHardwareBaseCost = emsGatewayHardwareTotalCost + emsElectricalHardwareTotalCost;
  const emsAutoPackagingPrice = Math.round(emsHardwareBasePrice * (emsPackagingPct / 100));
  const emsAutoPackagingCost = emsAutoPackagingPrice;
  const emsEffectivePackagingCost = emsPackagingManualCost !== null ? emsPackagingManualCost : emsAutoPackagingCost;
  const emsEffectivePackagingPrice = emsPackagingManualPrice !== null
    ? emsPackagingManualPrice
    : (emsPackagingMarginPct > 0 ? Math.round(calcPriceFromCost(emsEffectivePackagingCost, emsPackagingMarginPct)) : emsEffectivePackagingCost);

  const [localRoundingNearest, setLocalRoundingNearest] = React.useState<number>(100);
  const roundingNearest = props.roundingNearest !== undefined ? props.roundingNearest : localRoundingNearest;
  const setRoundingNearest = props.setRoundingNearest || setLocalRoundingNearest;

  const roundToNearest = (val: number, nearest: number = 100): number => {
    const step = Number(nearest) || 1;
    return Math.ceil(val / step) * step;
  };

  const gatewayHardwareOptions: SearchableOption[] = React.useMemo(() => {
    return getActiveGatewayHardwareCatalog().map((item) => ({
      label: item.name,
      subtitle: item.description,
      value: item.description,
      price: item.unitCost,
      uom: item.uom,
      category: item.category,
    }));
  }, []);

  const electricalHardwareOptions: SearchableOption[] = React.useMemo(() => {
    return getActiveElectricalHardwareCatalog().map((item) => ({
      label: item.name,
      subtitle: item.description,
      value: item.description,
      price: item.unitCost,
      uom: item.uom,
      category: item.category,
    }));
  }, []);

  const isCompressedAirAutomation =
    (activeSubServiceName || '').toLowerCase().includes('compressed air automation') ||
    (activeSubServiceName || '').toLowerCase().includes('air automation');

  const isCompressedAirMonitoring =
    !isCompressedAirAutomation && (
      (activeSubServiceName || '').toLowerCase().includes('compressed air monitoring') ||
      (activeSubServiceName || '').toLowerCase().includes('air monitoring')
    );

  const effectiveBufferPct = bufferPct !== undefined && bufferPct !== null ? Number(bufferPct) : 10;

  // 1. Gateway Hardware (1a)
  const item1a = emsGatewayHardwareRows[0];
  const item1Cost = item1a ? item1a.qty * item1a.unitCost : 0;
  const item1Price = item1a ? item1a.qty * calcPriceFromCost(item1a.unitCost, item1a.marginPct) : 0;
  const item1Contingency = effectiveBufferPct === 0 ? item1Price : Math.round(item1Price / Math.max(0.01, (100 - effectiveBufferPct) / 100));
  const item1Rounded = roundToNearest(item1Contingency, roundingNearest);

  // 2. Meters & Additional Hardware (1b, 1c...)
  const item1bRows = emsGatewayHardwareRows.slice(1);
  const item2Cost = item1bRows.reduce((sum, r) => sum + r.qty * r.unitCost, 0);
  const item2Price = item1bRows.reduce((sum, r) => sum + r.qty * calcPriceFromCost(r.unitCost, r.marginPct), 0);
  const item2Contingency = effectiveBufferPct === 0 ? item2Price : Math.round(item2Price / Math.max(0.01, (100 - effectiveBufferPct) / 100));
  const item2Rounded = roundToNearest(item2Contingency, roundingNearest);
  const item2Description = item1bRows.length > 0
    ? item1bRows.map((r) => r.description).join('; ')
    : 'Supply of RS485 energy meter with communication and wiring accessories';
  const item2Qty = item1bRows.reduce((sum, r) => sum + (r.qty || 0), 0);
  const item2Uom = item1bRows[0]?.uom || 'Nos';

  // 3. Electrical Accessories Total (2a, 2b, 2c...)
  const item3Cost = emsElectricalHardwareTotalCost;
  const item3Price = emsElectricalHardwareTotalPrice;
  const item3Contingency = effectiveBufferPct === 0 ? item3Price : Math.round(item3Price / Math.max(0.01, (100 - effectiveBufferPct) / 100));
  const item3Rounded = roundToNearest(item3Contingency, roundingNearest);
  const item3Description = 'Supply of electrical consumables such as flexible hose, cable ties and all other accessories';
  const item3Qty = emsElectricalHardwareRows.reduce((sum, r) => sum + (r.qty || 0), 0) || 1;
  const item3Uom = 'Job';

  // 4. Man Days / Installation & Commissioning
  const item4Cost = props.emsManpowerTotalCost;
  const item4Price = props.emsManpowerTotalPrice;
  const item4Contingency = effectiveBufferPct === 0 ? item4Price : Math.round(item4Price / Math.max(0.01, (100 - effectiveBufferPct) / 100));
  const item4Rounded = roundToNearest(item4Contingency, roundingNearest);
  const item4Description =
    'Installation and commissioning of IoT devices, gateways, modems, and associated electrical/control components including startup, testing, and functional verification. Communication cable laying and routing through conduits, cable trays, and raceways with proper dressing, tagging, and termination. Conduit pipe laying for electrical and communication cabling as per site layout. Modem configuration, network setup, data mapping, testing, troubleshooting, and data validation';
  const item4Qty = 1;
  const item4Uom = 'Nodes';

  // Compressed Air Automation specific Automation vs Installation Mandays
  const autoCost = props.airAutoManpowerTotalCost !== undefined ? props.airAutoManpowerTotalCost : props.emsManpowerTotalCost;
  const autoPrice = props.airAutoManpowerTotalPrice !== undefined ? props.airAutoManpowerTotalPrice : props.emsManpowerTotalPrice;
  const autoContingency = effectiveBufferPct === 0 ? autoPrice : Math.round(autoPrice / Math.max(0.01, (100 - effectiveBufferPct) / 100));
  const autoRounded = roundToNearest(autoContingency, roundingNearest);

  const instCost = props.airInstManpowerTotalCost !== undefined ? props.airInstManpowerTotalCost : props.emsManpowerTotalCost;
  const instPrice = props.airInstManpowerTotalPrice !== undefined ? props.airInstManpowerTotalPrice : props.emsManpowerTotalPrice;
  const instContingency = effectiveBufferPct === 0 ? instPrice : Math.round(instPrice / Math.max(0.01, (100 - effectiveBufferPct) / 100));
  const instRounded = roundToNearest(instContingency, roundingNearest);

  // 5. Platform Setup Costing
  const item5Cost = emsPlatformTotalCost;
  const item5Price = emsPlatformTotalPrice;
  const item5Contingency = effectiveBufferPct === 0 ? item5Price : Math.round(item5Price / Math.max(0.01, (100 - effectiveBufferPct) / 100));
  const item5Rounded = roundToNearest(item5Contingency, roundingNearest);
  const item5Description = emsPlatformRows.length > 0
    ? emsPlatformRows.map((r) => r.description).join('. ')
    : 'IoT device configuration, protocol setup (Modbus, BACnet, MQTT), and integration with BMS/EMS platforms. Network connectivity, dashboard mapping, alarm configuration, and cloud/server integration support System commissioning including startup, functional testing, calibration, and performance verification Troubleshooting, integration testing, client demonstration, and final handover support Electrical power/control cable laying, routing, termination, tagging, and insulation testing as per standard';
  const item5Qty = emsPlatformRows[0]?.qty || 1;
  const item5Uom = emsPlatformRows[0]?.uom || 'Nodes';

  // 6. Recurring Cloud Charges
  const item6Cost = emsRecurringYearlyTotalCost;
  const item6Price = emsRecurringYearlyTotalPrice;
  const item6Contingency = effectiveBufferPct === 0 ? item6Price : Math.round(item6Price / Math.max(0.01, (100 - effectiveBufferPct) / 100));
  const item6Rounded = roundToNearest(item6Contingency, roundingNearest);
  const item6Description =
    'OptiByte Dashboard, Intelligent reporting, Group and machine level reporting, Email on any threshold value breach, Alert on Mobile(via SMS), Auto detection of anomalies, water flow rate, water capacity. We will check with the pH and TDS meter, if we can integrate it with our dashboard';
  const item6Qty = emsRecurringRows[1]?.qty || emsRecurringRows[0]?.qty || 1;
  const item6Uom = emsRecurringRows[1]?.uom || emsRecurringRows[0]?.uom || 'Nodes';

  // 3b. Packaging & Forwarding Charges (Overall Hardware & Electrical × X%)
  // NOTE: Contingency buffer is NOT added to packaging charges
  const pkgCost = emsEffectivePackagingCost;
  const pkgPrice = emsEffectivePackagingPrice;
  const pkgContingency = pkgPrice;
  const pkgRounded = roundToNearest(pkgPrice, roundingNearest);
  const pkgDescription = `Packaging & Forwarding Charges (${emsPackagingPct}% of Total Hardware & Electrical Supplies)`;
  const pkgQty = 1;
  const pkgUom = 'Job';

  // Consolidated Items for Step Summary Table
  const rawStep5Items = isCompressedAirAutomation
    ? [
        {
          description: item1a?.description || 'Supply of 4G IoT Gateway for Communication with SIM card, SMPS & Antenna - Edge Pro',
          qty: item1a?.qty || 0,
          uom: item1a?.uom || 'Nos',
          cost: item1Cost,
          price: item1Price,
          contingency: item1Contingency,
          rounded: item1Rounded,
          isRecurring: false,
        },
        {
          description: item2Description,
          qty: item2Qty,
          uom: item2Uom,
          cost: item2Cost,
          price: item2Price,
          contingency: item2Contingency,
          rounded: item2Rounded,
          isRecurring: false,
        },
        {
          description: item3Description,
          qty: item3Qty,
          uom: item3Uom,
          cost: item3Cost,
          price: item3Price,
          contingency: item3Contingency,
          rounded: item3Rounded,
          isRecurring: false,
        },
        ...(pkgPrice > 0
          ? [
              {
                description: pkgDescription,
                qty: pkgQty,
                uom: pkgUom,
                cost: pkgCost,
                price: pkgPrice,
                contingency: pkgContingency,
                rounded: pkgRounded,
                isRecurring: false,
              },
            ]
          : []),
        {
          description: 'Automation, Programming & Commissioning Scope: PLC/Controller logic programming, compressor sequencing, instrument loops & engineering commissioning',
          qty: 1,
          uom: 'Job',
          cost: autoCost,
          price: autoPrice,
          contingency: autoContingency,
          rounded: autoRounded,
          isRecurring: false,
        },
        {
          description: 'Installation, Cabling & Electrical Mounting Scope: On-site IoT gateway deployment, CT/Meter termination, cable laying, conduit routing & electrical mounting',
          qty: 1,
          uom: 'Job',
          cost: instCost,
          price: instPrice,
          contingency: instContingency,
          rounded: instRounded,
          isRecurring: false,
        },
        {
          description: item5Description,
          qty: item5Qty,
          uom: item5Uom,
          cost: item5Cost,
          price: item5Price,
          contingency: item5Contingency,
          rounded: item5Rounded,
          isRecurring: false,
        },
        {
          description: item6Description,
          qty: item6Qty,
          uom: item6Uom,
          cost: item6Cost,
          price: item6Price,
          contingency: item6Contingency,
          rounded: item6Rounded,
          isRecurring: true,
        },
      ]
    : [
        {
          description: item1a?.description || 'Supply of 4G IoT Gateway for Communication with SIM card, SMPS & Antenna - Edge Pro',
          qty: item1a?.qty || 0,
          uom: item1a?.uom || 'Nos',
          cost: item1Cost,
          price: item1Price,
          contingency: item1Contingency,
          rounded: item1Rounded,
          isRecurring: false,
        },
        {
          description: item2Description,
          qty: item2Qty,
          uom: item2Uom,
          cost: item2Cost,
          price: item2Price,
          contingency: item2Contingency,
          rounded: item2Rounded,
          isRecurring: false,
        },
        {
          description: item3Description,
          qty: item3Qty,
          uom: item3Uom,
          cost: item3Cost,
          price: item3Price,
          contingency: item3Contingency,
          rounded: item3Rounded,
          isRecurring: false,
        },
        ...(pkgPrice > 0
          ? [
              {
                description: pkgDescription,
                qty: pkgQty,
                uom: pkgUom,
                cost: pkgCost,
                price: pkgPrice,
                contingency: pkgContingency,
                rounded: pkgRounded,
                isRecurring: false,
              },
            ]
          : []),
        {
          description: item4Description,
          qty: item4Qty,
          uom: item4Uom,
          cost: item4Cost,
          price: item4Price,
          contingency: item4Contingency,
          rounded: item4Rounded,
          isRecurring: false,
        },
        {
          description: item5Description,
          qty: item5Qty,
          uom: item5Uom,
          cost: item5Cost,
          price: item5Price,
          contingency: item5Contingency,
          rounded: item5Rounded,
          isRecurring: false,
        },
        {
          description: item6Description,
          qty: item6Qty,
          uom: item6Uom,
          cost: item6Cost,
          price: item6Price,
          contingency: item6Contingency,
          rounded: item6Rounded,
          isRecurring: true,
        },
      ];

  const step5Items = rawStep5Items.map((item, idx) => ({
    ...item,
    sNo: idx + 1,
  }));

  const totalStep5Cost = step5Items.reduce((sum, item) => sum + item.cost, 0);
  const totalStep5Price = step5Items.reduce((sum, item) => sum + item.price, 0);
  const totalStep5Contingency = step5Items.reduce((sum, item) => sum + item.contingency, 0);
  const totalStep5Rounded = step5Items.reduce((sum, item) => sum + item.rounded, 0);
  const totalStep5CustomerPrice = totalStep5Rounded;

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
                <th className="p-2.5 px-4">Hardware Description</th>
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
              <tr className="bg-purple-50/60 text-purple-950 font-bold border-b border-purple-200">
                <td colSpan={9} className="p-2 px-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-purple-900">
                      {isCompressedAirAutomation
                        ? '1. Compressed Air Automation'
                        : isCompressedAirMonitoring
                        ? '1. Compressed Air Monitoring'
                        : '1. Sustainabyte Edge IoT Gateway Hardware'}
                    </span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="font-semibold text-slate-600">
                        Total Cost: <span className="font-black text-slate-900">₹{formatMoney(emsGatewayHardwareTotalCost)}</span>
                      </span>
                      <span className="font-semibold text-purple-800 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                        Selling Price: <span className="font-black text-purple-950">₹{formatMoney(emsGatewayHardwareTotalPrice)}</span>
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
              {emsGatewayHardwareRows.map((row) => {
                const totalCost = row.qty * row.unitCost;
                const sellingPrice = Math.round(row.qty * calcPriceFromCost(row.unitCost, row.marginPct));
                const isCatalogItem = getActiveGatewayHardwareCatalog().some(
                  (c) => c.description === row.description || c.name === row.description
                );

                return (
                  <tr key={row.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="p-2 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                      {row.code}
                    </td>
                    <td className="p-2 px-4 border-r border-slate-200 font-bold text-slate-900">
                      <div className="space-y-1.5">
                        <SearchableSelect
                          options={gatewayHardwareOptions}
                          value={isCatalogItem ? row.description : '__CUSTOM__'}
                          placeholder="-- Search & Select Gateway Hardware --"
                          customOptionLabel="✨ Custom Hardware Component"
                          theme="purple"
                          onChange={(val, opt) => {
                            if (val === '__CUSTOM__') {
                              // allow custom typing
                            } else if (opt) {
                              updateEmsGatewayHardwareRow(row.id, 'description', opt.value);
                              updateEmsGatewayHardwareRow(row.id, 'uom', opt.uom || 'Nos');
                              updateEmsGatewayHardwareRow(row.id, 'unitCost', opt.price ?? 0);
                            }
                          }}
                        />
                        <textarea
                          rows={Math.max(1, Math.ceil((row.description?.length || 1) / 38))}
                          value={row.description}
                          onChange={(e) => updateEmsGatewayHardwareRow(row.id, 'description', e.target.value)}
                          placeholder="Hardware description..."
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none resize-none leading-snug whitespace-pre-wrap text-xs"
                        />
                      </div>
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.qty === 0 ? '' : row.qty}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsGatewayHardwareRow(row.id, 'qty', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="text"
                        value={row.uom}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsGatewayHardwareRow(row.id, 'uom', e.target.value)}
                        className="w-14 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-semibold text-slate-800 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.unitCost === 0 ? '' : row.unitCost}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsGatewayHardwareRow(row.id, 'unitCost', e.target.value === '' ? 0 : Number(e.target.value))}
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
                        placeholder="0"
                        value={row.marginPct === 0 ? '' : row.marginPct}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsGatewayHardwareRow(row.id, 'marginPct', e.target.value === '' ? 0 : Number(e.target.value))}
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

              {/* Section 1A Subtotal Row */}
              <tr className="bg-purple-50/75 font-bold border-t-2 border-purple-200 text-xs">
                <td colSpan={5} className="p-2.5 px-4 text-right font-extrabold text-purple-950 uppercase tracking-wider text-[11px]">
                  {isCompressedAirAutomation
                    ? '1. Compressed Air Automation Subtotal'
                    : isCompressedAirMonitoring
                    ? '1. Compressed Air Monitoring Subtotal'
                    : '1. IoT Gateway Hardware Subtotal'}
                </td>
                <td className="p-2.5 px-3 text-right font-black text-slate-900 bg-purple-100/60 border-r border-purple-200">
                  ₹{formatMoney(emsGatewayHardwareTotalCost)}
                </td>
                <td className="border-r border-purple-200"></td>
                <td className="p-2.5 px-4 text-right font-black text-purple-950 bg-purple-200/70 border-r border-purple-200">
                  ₹{formatMoney(emsGatewayHardwareTotalPrice)}
                </td>
                <td></td>
              </tr>

              <tr className="bg-slate-50">
                <td colSpan={9} className="p-2.5 px-4 border-b border-slate-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => addEmsGatewayHardwareRow()}
                      className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 shadow-2xs cursor-pointer transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Gateway Hardware
                    </button>
                    <div className="w-80 max-w-full">
                      <SearchableSelect
                        options={gatewayHardwareOptions}
                        value=""
                        placeholder="+ Quick Search & Add Gateway..."
                        theme="purple"
                        onChange={(val, opt) => {
                          if (opt && val !== '__CUSTOM__') {
                            addEmsGatewayHardwareRow({
                              category: opt.category || 'Sustainabyte Edge IoT Gateway Hardware',
                              description: opt.value,
                              uom: opt.uom || 'Nos',
                              unitCost: opt.price ?? 0,
                              qty: 1,
                              marginPct: 40,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>

              {/* Section 1B: Electrical Hardware */}
              <tr className="bg-indigo-50/60 text-indigo-950 font-bold border-b border-indigo-200">
                <td colSpan={9} className="p-2 px-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-indigo-900">
                      {isCompressedAirAutomation
                        ? '2. Compressed Air Monitoring'
                        : '2. Electrical Hardware & Accessories'}
                    </span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="font-semibold text-slate-600">
                        Total Cost: <span className="font-black text-slate-900">₹{formatMoney(emsElectricalHardwareTotalCost)}</span>
                      </span>
                      <span className="font-semibold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200">
                        Selling Price: <span className="font-black text-indigo-950">₹{formatMoney(emsElectricalHardwareTotalPrice)}</span>
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
              {emsElectricalHardwareRows.map((row) => {
                const totalCost = row.qty * row.unitCost;
                const sellingPrice = Math.round(row.qty * calcPriceFromCost(row.unitCost, row.marginPct));
                const isCatalogItem = getActiveElectricalHardwareCatalog().some(
                  (c) => c.description === row.description || c.name === row.description
                );

                return (
                  <tr key={row.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="p-2 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                      {row.code}
                    </td>
                    <td className="p-2 px-4 border-r border-slate-200 font-bold text-slate-900">
                      <div className="space-y-1.5">
                        <SearchableSelect
                          options={electricalHardwareOptions}
                          value={isCatalogItem ? row.description : '__CUSTOM__'}
                          placeholder="-- Search & Select Electrical Hardware --"
                          customOptionLabel="✨ Custom Electrical Accessory"
                          theme="indigo"
                          onChange={(val, opt) => {
                            if (val === '__CUSTOM__') {
                              // allow custom typing
                            } else if (opt) {
                              updateEmsElectricalHardwareRow(row.id, 'description', opt.value);
                              updateEmsElectricalHardwareRow(row.id, 'uom', opt.uom || 'Nos');
                              updateEmsElectricalHardwareRow(row.id, 'unitCost', opt.price ?? 0);
                            }
                          }}
                        />
                        <textarea
                          rows={Math.max(1, Math.ceil((row.description?.length || 1) / 38))}
                          value={row.description}
                          onChange={(e) => updateEmsElectricalHardwareRow(row.id, 'description', e.target.value)}
                          placeholder="Electrical accessory description..."
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none resize-none leading-snug whitespace-pre-wrap text-xs"
                        />
                      </div>
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.qty === 0 ? '' : row.qty}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsElectricalHardwareRow(row.id, 'qty', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="text"
                        value={row.uom}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsElectricalHardwareRow(row.id, 'uom', e.target.value)}
                        className="w-14 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-semibold text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.unitCost === 0 ? '' : row.unitCost}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsElectricalHardwareRow(row.id, 'unitCost', e.target.value === '' ? 0 : Number(e.target.value))}
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
                        placeholder="0"
                        value={row.marginPct === 0 ? '' : row.marginPct}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsElectricalHardwareRow(row.id, 'marginPct', e.target.value === '' ? 0 : Number(e.target.value))}
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

              {/* Section 1B Subtotal Row */}
              <tr className="bg-indigo-50/75 font-bold border-t-2 border-indigo-200 text-xs">
                <td colSpan={5} className="p-2.5 px-4 text-right font-extrabold text-indigo-950 uppercase tracking-wider text-[11px]">
                  {isCompressedAirAutomation
                    ? '2. Compressed Air Monitoring Subtotal'
                    : '2. Electrical Hardware Subtotal'}
                </td>
                <td className="p-2.5 px-3 text-right font-black text-slate-900 bg-indigo-100/60 border-r border-indigo-200">
                  ₹{formatMoney(emsElectricalHardwareTotalCost)}
                </td>
                <td className="border-r border-indigo-200"></td>
                <td className="p-2.5 px-4 text-right font-black text-indigo-950 bg-indigo-200/70 border-r border-indigo-200">
                  ₹{formatMoney(emsElectricalHardwareTotalPrice)}
                </td>
                <td></td>
              </tr>

              <tr className="bg-slate-50">
                <td colSpan={9} className="p-2.5 px-4 border-b border-slate-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => addEmsElectricalHardwareRow()}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 shadow-2xs cursor-pointer transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Electrical Hardware
                    </button>
                    <div className="w-80 max-w-full">
                      <SearchableSelect
                        options={electricalHardwareOptions}
                        value=""
                        placeholder="+ Quick Search & Add Electrical Hardware..."
                        theme="indigo"
                        onChange={(val, opt) => {
                          if (opt && val !== '__CUSTOM__') {
                            addEmsElectricalHardwareRow({
                              category: opt.category || 'Electrical Hardware',
                              description: opt.value,
                              uom: opt.uom || 'Nos',
                              unitCost: opt.price ?? 0,
                              qty: 1,
                              marginPct: 40,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>

              {/* TOTAL 1: Overall Base Hardware Supply Total (1 + 2) */}
              {(emsGatewayHardwareTotalCost + emsElectricalHardwareTotalCost) > 0 && (
                <tr className="bg-slate-100/90 text-slate-900 font-bold border-t-2 border-slate-300 text-xs">
                  <td colSpan={5} className="p-2.5 px-4 text-right font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                    1 + 2. Overall Hardware Supply Base Total
                  </td>
                  <td className="p-2.5 px-3 text-right font-black text-slate-900 bg-slate-200/80 border-r border-slate-300">
                    ₹{formatMoney(emsGatewayHardwareTotalCost + emsElectricalHardwareTotalCost)}
                  </td>
                  <td className="p-2 px-3 border-r border-slate-300 text-center font-bold text-slate-400">
                    -
                  </td>
                  <td className="p-2.5 px-4 text-right font-black text-slate-950 bg-slate-200/90">
                    ₹{formatMoney(emsGatewayHardwareTotalPrice + emsElectricalHardwareTotalPrice)}
                  </td>
                  <td></td>
                </tr>
              )}

              {/* TOTAL 2: Packaging Charges Row (Fully Editable) */}
              {(emsHardwareBasePrice > 0 || emsEffectivePackagingPrice > 0) && (
                <tr className="bg-amber-50/70 text-slate-800 font-bold border-t border-amber-200 text-xs">
                  <td className="p-2.5 px-3 text-center text-amber-900 border-r border-slate-200">★</td>
                  <td className="p-2.5 px-4 font-extrabold text-amber-950 border-r border-slate-200" colSpan={4}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 bg-amber-200/90 text-amber-950 rounded px-1.5 py-0.5 border border-amber-300">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={0.5}
                          value={emsPackagingPct}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setEmsPackagingPct?.(val);
                            setEmsPackagingManualCost?.(null);
                            setEmsPackagingManualPrice?.(null);
                          }}
                          className="w-9 text-center bg-white font-black text-amber-950 rounded text-xs py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <span className="font-black text-[10px] text-amber-900">% Capex</span>
                      </div>
                      <span>Packaging Charges (Overall Hardware Selling Total × {emsPackagingPct}%)</span>
                    </div>
                  </td>
                  <td className="p-1 px-1 text-right bg-amber-100/80 border-r border-slate-200">
                    <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded px-1 py-0.5">
                      <span className="text-slate-400 text-[10px]">₹</span>
                      <input
                        type="number"
                        value={emsPackagingManualCost !== null ? emsPackagingManualCost : emsAutoPackagingCost}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : Number(e.target.value);
                          setEmsPackagingManualCost?.(val);
                        }}
                        className="w-full text-right text-xs font-mono font-bold text-slate-800 focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="p-1 px-1 border-r border-slate-200 text-center">
                    <div className="flex items-center justify-center gap-0.5 bg-white border border-slate-200 rounded px-1 py-0.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={emsPackagingMarginPct}
                        onChange={(e) => setEmsPackagingMarginPct?.(Number(e.target.value) || 0)}
                        className="w-7 text-center text-xs font-bold text-slate-700 focus:outline-none"
                      />
                      <span className="text-slate-400 text-[10px]">%</span>
                    </div>
                  </td>
                  <td className="p-1 px-1 text-right bg-amber-200/80">
                    <div className="flex items-center gap-0.5 bg-white border border-amber-400 rounded px-1 py-0.5 shadow-2xs">
                      <span className="text-amber-800 text-[10px]">₹</span>
                      <input
                        type="number"
                        value={emsPackagingManualPrice !== null ? emsPackagingManualPrice : emsEffectivePackagingPrice}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : Number(e.target.value);
                          setEmsPackagingManualPrice?.(val);
                        }}
                        className="w-full text-right text-xs font-black text-amber-950 focus:outline-none"
                      />
                    </div>
                  </td>
                  <td className="p-2 text-center text-amber-600 font-bold">✓</td>
                </tr>
              )}

              {/* TOTAL 3: Step 1 Grand Total (Overall Total + Packaging Charges) */}
              <tr className="bg-purple-900 text-white font-extrabold text-xs">
                <td colSpan={5} className="p-3 px-6 text-right uppercase tracking-wider">
                  Step 1 Total Hardware Cost &amp; Selling Price (Overall Total + {emsPackagingPct}% Packaging Charges)
                </td>
                <td className="p-3 px-3 text-right font-black text-amber-400 bg-purple-950 text-sm border-r border-purple-800">
                  Cost: ₹{formatMoney(emsHardwareBaseCost + emsEffectivePackagingCost)}
                </td>
                <td></td>
                <td className="p-3 px-4 text-right font-black text-emerald-400 bg-slate-950 text-sm">
                  Price: ₹{formatMoney(emsHardwareBasePrice + emsEffectivePackagingPrice)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isCompressedAirAutomation ? (
        <>
          <AirAuditManpowerEngine
            {...(props.airAutoManpowerProps || props)}
            stepNumber="Step 2"
            stepTitle="Automation & Commissioning Engineering Scope"
            stepSubtitle="PLC logic development, compressor automation sequencing, instrument loops & engineering commissioning"
          />
          <AirAuditManpowerEngine
            {...(props.airInstManpowerProps || props)}
            stepNumber="Step 3"
            stepTitle="Installation, Commissioning & Site Engineering Scope"
            stepSubtitle="On-site IoT gateway deployment, CT/Meter termination, cable laying, conduit routing & electrical mounting"
          />
        </>
      ) : (
        <AirAuditManpowerEngine
          {...props}
          stepNumber="Step 2"
          stepTitle="Installation, Commissioning &amp; Site Engineering Scope"
          stepSubtitle="On-site IoT gateway deployment, CT/Meter termination, cable laying &amp; cloud telemetry testing"
        />
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 px-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-emerald-600" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md">
                  {isCompressedAirAutomation ? 'Step 4' : 'Step 3'}
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
                      <textarea
                        rows={Math.max(1, Math.ceil((row.description?.length || 1) / 45))}
                        value={row.description}
                        onChange={(e) => updateEmsPlatformRow(row.id, 'description', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none resize-none leading-snug whitespace-pre-wrap text-xs"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.qty === 0 ? '' : row.qty}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsPlatformRow(row.id, 'qty', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="text"
                        value={row.uom}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsPlatformRow(row.id, 'uom', e.target.value)}
                        className="w-14 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-semibold text-slate-800 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.unitCost === 0 ? '' : row.unitCost}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsPlatformRow(row.id, 'unitCost', e.target.value === '' ? 0 : Number(e.target.value))}
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
                        placeholder="0"
                        value={row.marginPct === 0 ? '' : row.marginPct}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsPlatformRow(row.id, 'marginPct', e.target.value === '' ? 0 : Number(e.target.value))}
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
                  {isCompressedAirAutomation ? 'Step 4' : 'Step 3'} Total Platform Setup Cost &amp; Price
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

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 px-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-purple-600" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-600 text-white text-[11px] font-black px-2 py-0.5 rounded-md">
                  {isCompressedAirAutomation ? 'Step 5' : 'Step 4'}
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
                      <textarea
                        rows={Math.max(1, Math.ceil((row.description?.length || 1) / 40))}
                        value={row.description}
                        onChange={(e) => updateEmsRecurringRow(row.id, 'description', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none resize-none leading-snug whitespace-pre-wrap text-xs"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.qty === 0 ? '' : row.qty}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsRecurringRow(row.id, 'qty', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-900"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="text"
                        value={row.uom}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsRecurringRow(row.id, 'uom', e.target.value)}
                        className="w-14 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-semibold text-slate-800 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right">
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={row.unitCostPerMonth === 0 ? '' : row.unitCostPerMonth}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsRecurringRow(row.id, 'unitCostPerMonth', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-20 text-right bg-slate-50 border border-slate-200 rounded px-1.5 py-1 font-semibold text-slate-900"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-center">
                      <input
                        type="number"
                        min={0}
                        max={99}
                        placeholder="0"
                        value={row.marginPct === 0 ? '' : row.marginPct}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => updateEmsRecurringRow(row.id, 'marginPct', e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-12 text-center bg-purple-50 border border-purple-200 rounded px-1 py-1 font-bold text-purple-900 text-xs"
                      />
                    </td>
                    <td className="p-2 px-3 border-r border-slate-200 text-right font-medium text-slate-900">
                      ₹{formatMoney(pricePerMonth)}
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
                  {isCompressedAirAutomation ? 'Step 5' : 'Step 4'} Total Recurring Cost/Year &amp; Selling Price/Year (+{profitPct}% Margin)
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

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 px-6 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-md">
              {isCompressedAirAutomation ? 'Step 6' : 'Step 5'}
            </span>
            <h3 className="font-extrabold text-white text-sm md:text-base tracking-wide uppercase">
              {isCompressedAirAutomation ? 'TOTAL PRICE SUMMARY (STEPS 1–5 ITEMIZED BREAKDOWN)' : 'TOTAL PRICE SUMMARY (STEPS 1–4 ITEMIZED BREAKDOWN)'}
            </h3>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
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

            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1">
              <span className="text-xs font-bold text-slate-300">Round Nearest:</span>
              <span className="text-xs font-bold text-slate-400">₹</span>
              <input
                type="number"
                min={1}
                step={50}
                value={roundingNearest}
                onChange={(e) => setRoundingNearest(Math.max(1, Number(e.target.value)))}
                className="w-14 text-center font-black text-amber-400 bg-transparent focus:outline-none text-xs"
              />
              <div className="flex items-center gap-1 border-l border-slate-700 pl-1.5 ml-0.5">
                {[10, 50, 100, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRoundingNearest(val)}
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                      roundingNearest === val
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
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
                <th className="p-3 px-3 text-center w-14 border-r border-slate-200">S.No</th>
                <th className="p-3 px-4 w-2/5 border-r border-slate-200">Item Description</th>
                <th className="p-3 px-3 text-center border-r border-slate-200">Qty</th>
                <th className="p-3 px-3 text-center border-r border-slate-200">UoM</th>
                <th className="p-3 px-3 text-right border-r border-slate-200">Total Price in INR</th>
                <th className="p-3 px-3 text-right bg-amber-50/70 text-amber-900 border-r border-slate-200">
                  Contingency ({bufferPct}%)
                </th>
                <th className="p-3 px-3 text-right bg-slate-50 text-slate-900 border-r border-slate-200">
                  Rounded Price (₹{roundingNearest})
                </th>
                <th className="p-3 px-4 text-right font-black bg-emerald-50 text-emerald-800">
                  Customer Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium bg-white">
              {step5Items.map((item, idx) => (
                <tr key={`s5_${idx}`} className="hover:bg-slate-50/80 transition-colors bg-white">
                  <td className="p-2.5 px-3 text-center font-bold text-slate-700 border-r border-slate-200">
                    {idx + 1}
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

              {/* Bottom Summary Bar with Over All Totals */}
              <tr className="bg-slate-100 text-slate-900 border-t-2 border-slate-900 font-black text-xs">
                <td colSpan={4} className="p-3.5 px-4 text-right uppercase tracking-wider text-slate-900 font-black">
                  TOTAL PRICE
                </td>
                <td className="p-3.5 px-3 text-right font-black text-slate-900 border-r border-slate-200 bg-slate-50">
                  ₹{formatMoney(totalStep5Price)}
                </td>
                <td className="p-3.5 px-3 text-right font-black text-amber-900 bg-amber-100/70 border-r border-slate-200">
                  ₹{formatMoney(totalStep5Contingency)}
                </td>
                <td className="p-3.5 px-3 text-right font-black text-slate-900 bg-slate-200/70 border-r border-slate-200">
                  ₹{formatMoney(totalStep5Rounded)}
                </td>
                <td className="p-3.5 px-4 text-right font-black text-emerald-800 text-sm bg-emerald-100/80">
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

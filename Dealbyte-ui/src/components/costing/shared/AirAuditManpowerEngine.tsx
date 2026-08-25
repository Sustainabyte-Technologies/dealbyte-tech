import React from 'react';
import {
  Users,
  Wrench,
  UserPlus,
  Plus,
  Trash2,
  MapPin,
  Car,
  Bus,
  Train,
  Plane,
  ChevronDown,
} from 'lucide-react';
import { ManpowerRow, ExtraExpenseRow } from '../types';
import { PRESET_TEAM_MEMBERS, getActiveTeamMembers, getSiteDistanceKm } from '../constants';
import { formatMoney, calcPriceFromCost } from '../utils';
import { SearchableSelect, SearchableOption } from './SearchableSelect';

export interface AirAuditManpowerEngineProps {
  emsManpowerRows: ManpowerRow[];
  setEmsManpowerRows: React.Dispatch<React.SetStateAction<ManpowerRow[]>>;
  updateEmsManpowerRow: (id: string, field: keyof ManpowerRow, val: any) => void;
  addEmsManpowerRow: (roleLevel?: ManpowerRow['roleLevel'], presetName?: string) => void;
  removeEmsManpowerRow: (id: string) => void;
  profitPct: number;
  setProfitPct?: (val: number) => void;
  manualManpowerOverride?: number | null;
  setManualManpowerOverride?: (val: number | null) => void;
  emsManpowerBaseCost: number;
  emsManpowerTotalCost: number;
  emsManpowerTotalPrice: number;
  emsSiteExpensesTotalCost: number;
  juniorFoodRate: number;
  setJuniorFoodRate: (val: number) => void;
  manualJuniorFoodOverride: number | null;
  setManualJuniorFoodOverride: (val: number | null) => void;
  seniorFoodRate: number;
  setSeniorFoodRate: (val: number) => void;
  manualSeniorFoodOverride: number | null;
  setManualSeniorFoodOverride: (val: number | null) => void;
  iotFoodRate: number;
  setIotFoodRate: (val: number) => void;
  manualIotFoodOverride: number | null;
  setManualIotFoodOverride: (val: number | null) => void;
  activeJuniorDays: number;
  activeSeniorDays: number;
  activeIotDays: number;
  manualJuniorDays: number | null;
  setManualJuniorDays: (val: number | null) => void;
  manualSeniorDays: number | null;
  setManualSeniorDays: (val: number | null) => void;
  manualIotDays: number | null;
  setManualIotDays: (val: number | null) => void;
  activeTraineeDays?: number;
  activeCustomDays?: number;
  traineeFoodRate?: number;
  setTraineeFoodRate?: (val: number) => void;
  manualTraineeDays?: number | null;
  setManualTraineeDays?: (val: number | null) => void;
  manualTraineeFoodOverride?: number | null;
  setManualTraineeFoodOverride?: (val: number | null) => void;
  customFoodRate?: number;
  setCustomFoodRate?: (val: number) => void;
  manualCustomDays?: number | null;
  setManualCustomDays?: (val: number | null) => void;
  manualCustomFoodOverride?: number | null;
  setManualCustomFoodOverride?: (val: number | null) => void;
  juniorSiteDaysComputed: number;
  seniorSiteDaysComputed: number;
  iotSiteDaysComputed: number;
  traineeSiteDaysComputed?: number;
  customRoleSiteDaysComputed?: number;
  customSiteDaysComputed?: number;
  finalJuniorFoodCost: number;
  finalSeniorFoodCost: number;
  finalIotFoodCost: number;
  finalTraineeFoodCost?: number;
  finalCustomFoodCost?: number;
  totalFoodCost: number;
  stationType: string;
  setStationType?: (val: string) => void;
  isLocalStationActive: boolean;
  isOutstationActive: boolean;
  activeStationType?: string;
  availableSiteLocations?: string[];
  outstationStartLocation: string;
  setOutstationStartLocation: (val: string) => void;
  outstationEndLocation: string;
  setOutstationEndLocation: (val: string) => void;
  outstationDistanceKms: number;
  setOutstationDistanceKms: (val: number) => void;
  selectedSites: string[];
  removeSelectedSite: (site: string) => void;
  showSiteDropdown: boolean;
  setShowSiteDropdown: (show: boolean) => void;
  siteDropdownRef: React.RefObject<HTMLDivElement | null>;
  renderSiteDropdownContent: () => React.ReactNode;
  insideChennaiDistanceKms: number;
  setInsideChennaiDistanceKms: (val: number) => void;
  insideChennaiRatePerKm: number;
  setInsideChennaiRatePerKm: (val: number) => void;
  manualInsideChennaiDays?: number | null;
  setManualInsideChennaiDays?: (val: number | null) => void;
  activeInsideChennaiDays?: number;
  manualInsideChennaiOverride: number | null;
  setManualInsideChennaiOverride: (val: number | null) => void;
  finalInsideChennaiTravel: number;
  outsideChennaiBusCost: number;
  setOutsideChennaiBusCost: (val: number) => void;
  outsideChennaiCabCost: number;
  setOutsideChennaiCabCost: (val: number) => void;
  outsideChennaiTrainCost: number;
  setOutsideChennaiTrainCost: (val: number) => void;
  outsideChennaiFlightCost: number;
  setOutsideChennaiFlightCost: (val: number) => void;
  manualOutsideChennaiOverride: number | null;
  setManualOutsideChennaiOverride: (val: number | null) => void;
  finalOutsideChennaiTravel: number;
  totalTravelCost: number;
  selectedAccommodationTier: number;
  setSelectedAccommodationTier: (val: number) => void;
  isCustomAccommodationRate: boolean;
  setIsCustomAccommodationRate: (val: boolean) => void;
  customAccommodationRate: number;
  setCustomAccommodationRate: (val: number) => void;
  manualAccommodationDays: number | null;
  setManualAccommodationDays: (val: number | null) => void;
  activeAccommodationDays: number;
  maxSiteWorkingDays: number;
  finalAccommodationCost: number;
  manualAccommodationOverride: number | null;
  setManualAccommodationOverride: (val: number | null) => void;
  extraExpenses: ExtraExpenseRow[];
  addExtraExpense: (category?: ExtraExpenseRow['category']) => void;
  updateExtraExpense: (id: string, field: keyof ExtraExpenseRow, val: any) => void;
  removeExtraExpense: (id: string) => void;
  customExpensesTotal: number;
  stepNumber?: number | string;
  stepTitle?: string;
  stepSubtitle?: string;
  hideScopeDetails?: boolean;
}

export const AirAuditManpowerEngine: React.FC<AirAuditManpowerEngineProps> = ({
  emsManpowerRows,
  setEmsManpowerRows,
  updateEmsManpowerRow,
  addEmsManpowerRow,
  removeEmsManpowerRow,
  profitPct,
  setProfitPct,
  manualManpowerOverride,
  setManualManpowerOverride,
  emsManpowerBaseCost,
  emsManpowerTotalCost,
  emsManpowerTotalPrice,
  emsSiteExpensesTotalCost,
  juniorFoodRate,
  setJuniorFoodRate,
  manualJuniorFoodOverride,
  setManualJuniorFoodOverride,
  seniorFoodRate,
  setSeniorFoodRate,
  manualSeniorFoodOverride,
  setManualSeniorFoodOverride,
  iotFoodRate,
  setIotFoodRate,
  manualIotFoodOverride,
  setManualIotFoodOverride,
  activeJuniorDays,
  activeSeniorDays,
  activeIotDays,
  activeTraineeDays = 0,
  activeCustomDays = 0,
  manualJuniorDays,
  setManualJuniorDays,
  manualSeniorDays,
  setManualSeniorDays,
  manualIotDays,
  setManualIotDays,
  traineeFoodRate = 300,
  setTraineeFoodRate,
  manualTraineeDays = null,
  setManualTraineeDays,
  manualTraineeFoodOverride = null,
  setManualTraineeFoodOverride,
  customFoodRate = 400,
  setCustomFoodRate,
  manualCustomDays = null,
  setManualCustomDays,
  manualCustomFoodOverride = null,
  setManualCustomFoodOverride,
  juniorSiteDaysComputed,
  seniorSiteDaysComputed,
  iotSiteDaysComputed,
  traineeSiteDaysComputed = 0,
  customRoleSiteDaysComputed,
  customSiteDaysComputed,
  finalJuniorFoodCost,
  finalSeniorFoodCost,
  finalIotFoodCost,
  finalTraineeFoodCost = 0,
  finalCustomFoodCost = 0,
  totalFoodCost,
  stationType,
  setStationType,
  isLocalStationActive,
  isOutstationActive,
  activeStationType,
  availableSiteLocations,
  outstationStartLocation,
  setOutstationStartLocation,
  outstationEndLocation,
  setOutstationEndLocation,
  outstationDistanceKms,
  setOutstationDistanceKms,
  selectedSites,
  removeSelectedSite,
  showSiteDropdown,
  setShowSiteDropdown,
  siteDropdownRef,
  renderSiteDropdownContent,
  insideChennaiDistanceKms,
  setInsideChennaiDistanceKms,
  insideChennaiRatePerKm,
  setInsideChennaiRatePerKm,
  manualInsideChennaiDays = null,
  setManualInsideChennaiDays,
  activeInsideChennaiDays = 1,
  manualInsideChennaiOverride,
  setManualInsideChennaiOverride,
  finalInsideChennaiTravel,
  outsideChennaiBusCost,
  setOutsideChennaiBusCost,
  outsideChennaiCabCost,
  setOutsideChennaiCabCost,
  outsideChennaiTrainCost,
  setOutsideChennaiTrainCost,
  outsideChennaiFlightCost,
  setOutsideChennaiFlightCost,
  manualOutsideChennaiOverride,
  setManualOutsideChennaiOverride,
  finalOutsideChennaiTravel,
  totalTravelCost,
  selectedAccommodationTier,
  setSelectedAccommodationTier,
  isCustomAccommodationRate,
  setIsCustomAccommodationRate,
  customAccommodationRate,
  setCustomAccommodationRate,
  manualAccommodationDays,
  setManualAccommodationDays,
  activeAccommodationDays,
  maxSiteWorkingDays,
  finalAccommodationCost,
  manualAccommodationOverride,
  setManualAccommodationOverride,
  extraExpenses,
  addExtraExpense,
  updateExtraExpense,
  removeExtraExpense,
  customExpensesTotal,
  stepNumber = 4,
  stepTitle = 'Installation Charges',
  stepSubtitle,
  hideScopeDetails = false,
}) => {
  const handleSelectPresetMember = (presetName: string) => {
    if (presetName === '__CUSTOM__') {
      addEmsManpowerRow('CUSTOM');
      return;
    }
    const member = getActiveTeamMembers().find((m) => m.name === presetName);
    if (!member) return;

    setEmsManpowerRows((prev) => {
      return [
        ...prev,
        {
          id: `ems_m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: member.name,
          roleLevel: member.roleLevel,
          siteWorkCost: member.siteWorkCost,
          reportWorkCost: member.reportWorkCost,
          foodRatePerDay: member.foodRatePerDay,
          siteWorkingDays: 0,
          reportWorkingDays: 0,
        },
      ];
    });
  };

  const formattedStepBadge = typeof stepNumber === 'string' && stepNumber.toLowerCase().startsWith('step')
    ? stepNumber
    : `Step ${stepNumber}`;

  const juniorCount = emsManpowerRows.filter((r) => r.roleLevel === 'JUNIOR_ENERGY' && Number(r.siteWorkingDays || 0) > 0).length;
  const seniorCount = emsManpowerRows.filter((r) => r.roleLevel === 'SENIOR_ENERGY' && Number(r.siteWorkingDays || 0) > 0).length;
  const iotCount = emsManpowerRows.filter((r) => r.roleLevel === 'IOT_ENGINEER' && Number(r.siteWorkingDays || 0) > 0).length;
  const traineeCount = emsManpowerRows.filter((r) => r.roleLevel === 'TRAINEE_ENERGY' && Number(r.siteWorkingDays || 0) > 0).length;
  const customCount = emsManpowerRows.filter((r) => r.roleLevel === 'CUSTOM' && Number(r.siteWorkingDays || 0) > 0).length;
  const totalSitePersons = emsManpowerRows.filter((r) => Number(r.siteWorkingDays || 0) > 0).length;

  const juniorDaysPerPerson = juniorCount > 0 ? activeJuniorDays / juniorCount : 0;
  const seniorDaysPerPerson = seniorCount > 0 ? activeSeniorDays / seniorCount : 0;
  const iotDaysPerPerson = iotCount > 0 ? activeIotDays / iotCount : 0;
  const traineeDaysPerPerson = traineeCount > 0 ? activeTraineeDays / traineeCount : 0;
  const customDaysPerPerson = customCount > 0 ? activeCustomDays / customCount : 0;

  const [selectedTravelModes, setSelectedTravelModes] = React.useState<string[]>(() => {
    const modes: string[] = [];
    if (outsideChennaiBusCost > 0) modes.push('BUS');
    if (outsideChennaiCabCost > 0) modes.push('CAB');
    if (outsideChennaiTrainCost > 0) modes.push('TRAIN');
    if (outsideChennaiFlightCost > 0) modes.push('FLIGHT');
    return modes.length > 0 ? modes : ['BUS'];
  });

  const [showTravelModeDropdown, setShowTravelModeDropdown] = React.useState<boolean>(false);
  const teamMemberOptions: SearchableOption[] = React.useMemo(() => {
    return getActiveTeamMembers().map((m) => ({
      label: m.name,
      subtitle: m.roleTitle,
      value: m.name,
      price: m.siteWorkCost,
      uom: 'Day',
    }));
  }, []);

  const travelModeDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (travelModeDropdownRef.current && !travelModeDropdownRef.current.contains(event.target as Node)) {
        setShowTravelModeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTravelMode = (mode: string) => {
    setSelectedTravelModes((prev) => {
      if (prev.includes(mode)) {
        if (mode === 'BUS') setOutsideChennaiBusCost(0);
        if (mode === 'CAB') setOutsideChennaiCabCost(0);
        if (mode === 'TRAIN') setOutsideChennaiTrainCost(0);
        if (mode === 'FLIGHT') setOutsideChennaiFlightCost(0);
        setManualOutsideChennaiOverride(null);
        return prev.filter((m) => m !== mode);
      } else {
        setManualOutsideChennaiOverride(null);
        return [...prev, mode];
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-purple-500 text-white text-xs font-black px-2.5 py-1 rounded-lg">
            {formattedStepBadge}
          </span>
          <h3 className="font-extrabold text-sm uppercase tracking-wider">
            {stepTitle || 'Installation Charges'}
          </h3>
        </div>
        <div className="text-xs font-bold text-purple-200 bg-purple-900/60 px-3 py-1 rounded-full border border-purple-700/50">
          Man Working Cost: ₹{formatMoney(emsManpowerTotalCost)} | Selling Price: <strong className="text-emerald-400">₹{formatMoney(emsManpowerTotalPrice)}</strong>
        </div>
      </div>

      {/* Scope Details Banner (Optional / Configurable) */}
      {!hideScopeDetails && stepSubtitle && (
        <div className="bg-purple-50/60 border-b border-purple-200 p-4 px-6 text-xs text-purple-950 font-medium">
          <p className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
            <Wrench className="h-4 w-4 text-purple-600" /> Engineering Scope of Work:
          </p>
          <p className="leading-relaxed text-[11px] text-purple-900/80">
            {stepSubtitle}
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-900 border-b-2 border-slate-900 font-extrabold text-[12px]">
              <th className="p-3 px-4 w-1/3">Members / Role Title</th>
              <th className="p-3 px-4 text-center bg-amber-100/50">Role Config</th>
              <th className="p-3 px-4 text-right">Site Work Cost (₹)</th>
              <th className="p-3 px-4 text-center">Site Days</th>
              <th className="p-3 px-5 text-right font-black bg-slate-200/80">Cost for Site (₹)</th>
              <th className="p-3 px-3 text-center w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
            {emsManpowerRows.map((row) => {
              const rowCost = Number(row.siteWorkCost || 0) * Number(row.siteWorkingDays || 0);

              return (
                <tr key={row.id} className="hover:bg-purple-50/20 transition-colors">
                  <td className="p-2 px-4 border-r border-slate-200 font-bold text-slate-900">
                    <input
                      type="text"
                      list="team-members-list"
                      value={row.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        const foundPreset = getActiveTeamMembers().find(
                          (p) => p.name.toLowerCase() === newName.trim().toLowerCase()
                        );
                        if (foundPreset) {
                          setEmsManpowerRows((prev) =>
                            prev.map((r) =>
                              r.id === row.id
                                ? {
                                  ...r,
                                  name: foundPreset.name,
                                  roleLevel: foundPreset.roleLevel,
                                  siteWorkCost: foundPreset.siteWorkCost,
                                  reportWorkCost: foundPreset.reportWorkCost,
                                  foodRatePerDay: foundPreset.foodRatePerDay,
                                }
                                : r
                            )
                          );
                        } else {
                          updateEmsManpowerRow(row.id, 'name', newName);
                        }
                      }}
                      placeholder="Select or type member..."
                      className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-500 font-bold text-slate-900 px-1 py-0.5 focus:outline-none"
                    />
                  </td>
                  <td className="p-2 px-3 border-r border-slate-200 text-center bg-amber-50/20">
                    <select
                      value={row.roleLevel}
                      onChange={(e) => updateEmsManpowerRow(row.id, 'roleLevel', e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-extrabold text-xs text-slate-900 shadow-2xs focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                    >
                      <option value="JUNIOR_ENERGY">Junior Energy Engineer</option>
                      <option value="SENIOR_ENERGY">Senior Energy Engineer</option>
                      <option value="IOT_ENGINEER">IoT Engineer</option>
                      <option value="TRAINEE_ENERGY">Trainee Energy Engineer</option>
                      <option value="CUSTOM">Custom Role</option>
                    </select>

                    {row.roleLevel === 'CUSTOM' && (
                      <input
                        type="text"
                        value={row.customRoleName || ''}
                        onChange={(e) => updateEmsManpowerRow(row.id, 'customRoleName', e.target.value)}
                        placeholder="Type custom role title..."
                        className="mt-1.5 w-full bg-white border border-purple-300 rounded px-2 py-1 font-bold text-xs text-purple-950 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs placeholder:text-slate-400"
                      />
                    )}
                  </td>
                  <td className="p-2 px-4 border-r border-slate-200 text-right">
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={row.siteWorkCost === 0 ? '' : row.siteWorkCost}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => updateEmsManpowerRow(row.id, 'siteWorkCost', e.target.value === '' ? 0 : Number(e.target.value))}
                      className="w-24 text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold text-slate-900"
                    />
                  </td>
                  <td className="p-2 px-4 border-r border-slate-200 text-center bg-purple-50/40">
                    <input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={row.siteWorkingDays === 0 ? '' : row.siteWorkingDays}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => updateEmsManpowerRow(row.id, 'siteWorkingDays', e.target.value === '' ? 0 : Number(e.target.value))}
                      className="w-14 text-center font-bold text-purple-700 bg-white border border-purple-300 rounded px-2 py-1 shadow-2xs"
                    />
                  </td>
                  <td className="p-2.5 px-4 text-right border-r border-slate-200 bg-slate-50/70">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-[11px] text-slate-400 font-semibold">₹</span>
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={
                          row.overrideCost !== undefined && row.overrideCost !== null
                            ? (row.overrideCost === 0 ? '' : row.overrideCost)
                            : (rowCost === 0 ? '' : rowCost)
                        }
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : Number(e.target.value);
                          updateEmsManpowerRow(row.id, 'overrideCost' as any, val);
                        }}
                        className="w-28 text-right bg-white border border-slate-300 rounded px-2 py-1 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-2xs"
                      />
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeEmsManpowerRow(row.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove Member"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}


            <tr className="bg-slate-50">
              <td colSpan={6} className="p-3 px-5 border-t border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="w-72 max-w-full">
                    <SearchableSelect
                      options={teamMemberOptions}
                      value=""
                      placeholder="+ Quick Search & Add Member..."
                      theme="purple"
                      onChange={(val, opt) => {
                        if (opt && val !== '__CUSTOM__') {
                          addEmsManpowerRow('IOT_ENGINEER', opt.value);
                        }
                      }}
                    />
                  </div>

                  <button
                    onClick={() => addEmsManpowerRow('IOT_ENGINEER')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl transition-all border border-purple-200 shadow-2xs cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4 text-purple-600" /> Add Member
                  </button>

                  <button
                    onClick={() => addEmsManpowerRow('CUSTOM')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition-all border border-indigo-200 shadow-2xs cursor-pointer"
                  >
                    <Plus className="h-4 w-4 text-indigo-600" /> Add Custom Role Member
                  </button>
                </div>
              </td>
            </tr>

            {/* 1. Manpower Base Cost Sub-Total Row */}
            <tr className="border-t-2 border-slate-900 font-extrabold text-xs bg-purple-100/70">
              <td colSpan={4} className="p-3 px-6 text-right uppercase tracking-wider text-purple-950">
                <div className="flex items-center justify-end gap-2">
                  <Users className="h-4 w-4 text-purple-700" />
                  <span className="font-black">Manpower Engineering Base Working Cost</span>
                </div>
              </td>
              <td colSpan={2} className="p-3 px-5 text-right font-black text-slate-900 bg-purple-200/80">
                ₹{formatMoney(emsManpowerBaseCost)}
              </td>
            </tr>

            {/* FOOD EXPENSES: JUNIOR, SENIOR & IOT */}
            {(emsManpowerRows.some((r) => r.roleLevel === 'JUNIOR_ENERGY') || manualJuniorFoodOverride !== null) && (
              <tr className="border-t border-slate-200 font-bold bg-white">
                <td colSpan={4} className="p-3 px-6 border-r border-slate-300 text-right text-slate-800">
                  <div className="flex items-center justify-end gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">Junior Energy Engineer Food Cost</span>
                      {juniorCount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                          {juniorCount} {juniorCount === 1 ? 'Person' : 'Persons'} ({juniorDaysPerPerson.toFixed(Number.isInteger(juniorDaysPerPerson) ? 0 : 1)} {juniorDaysPerPerson === 1 ? 'day' : 'days'}/person)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Rate: ₹</span>
                      <input
                        type="number"
                        min={0}
                        value={juniorFoodRate}
                        onChange={(e) => {
                          setJuniorFoodRate(Number(e.target.value));
                          setManualJuniorFoodOverride(null);
                        }}
                        className="w-16 text-right font-bold text-slate-900 bg-white border border-slate-200 rounded px-1 text-xs"
                      />
                      <span className="text-[11px] text-slate-500 font-semibold">/day</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Total Mandays:</span>
                      <input
                        type="number"
                        min={0}
                        value={activeJuniorDays}
                        onChange={(e) => {
                          setManualJuniorDays(Number(e.target.value));
                          setManualJuniorFoodOverride(null);
                        }}
                        className="w-14 text-center font-bold text-purple-700 bg-purple-50/50 border border-slate-200 rounded px-1 text-xs"
                      />
                    </div>
                    {manualJuniorDays !== null && (
                      <button
                        onClick={() => {
                          setManualJuniorDays(null);
                          setManualJuniorFoodOverride(null);
                        }}
                        className="text-[10px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded border border-purple-200"
                        title="Re-sync to manpower site days"
                      >
                        Auto Mapped ({juniorSiteDaysComputed} site days)
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-2.5 px-5 text-right font-extrabold text-slate-900 border-r border-slate-200 bg-white">
                  <input
                    type="number"
                    min={0}
                    value={finalJuniorFoodCost}
                    onChange={(e) => setManualJuniorFoodOverride(Number(e.target.value))}
                    className="w-32 text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 text-sm"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => addExtraExpense('FOOD')}
                    className="text-amber-600 hover:text-amber-800 p-1"
                    title="Add Extra Food Item"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            )}

            {(emsManpowerRows.some((r) => r.roleLevel === 'SENIOR_ENERGY') || manualSeniorFoodOverride !== null) && (
              <tr className="border-t border-slate-200 font-bold bg-white">
                <td colSpan={4} className="p-3 px-6 border-r border-slate-300 text-right text-slate-800">
                  <div className="flex items-center justify-end gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">Senior Energy Engineer Food Cost</span>
                      {seniorCount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                          {seniorCount} {seniorCount === 1 ? 'Person' : 'Persons'} ({seniorDaysPerPerson.toFixed(Number.isInteger(seniorDaysPerPerson) ? 0 : 1)} {seniorDaysPerPerson === 1 ? 'day' : 'days'}/person)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Rate: ₹</span>
                      <input
                        type="number"
                        min={0}
                        value={seniorFoodRate}
                        onChange={(e) => {
                          setSeniorFoodRate(Number(e.target.value));
                          setManualSeniorFoodOverride(null);
                        }}
                        className="w-16 text-right font-bold text-slate-900 bg-white border border-slate-200 rounded px-1 text-xs"
                      />
                      <span className="text-[11px] text-slate-500 font-semibold">/day</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Total Mandays:</span>
                      <input
                        type="number"
                        min={0}
                        value={activeSeniorDays}
                        onChange={(e) => {
                          setManualSeniorDays(Number(e.target.value));
                          setManualSeniorFoodOverride(null);
                        }}
                        className="w-14 text-center font-bold text-purple-700 bg-purple-50/50 border border-slate-200 rounded px-1 text-xs"
                      />
                    </div>
                    {manualSeniorDays !== null && (
                      <button
                        onClick={() => {
                          setManualSeniorDays(null);
                          setManualSeniorFoodOverride(null);
                        }}
                        className="text-[10px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded border border-purple-200"
                        title="Re-sync to manpower site days"
                      >
                        Auto Mapped ({seniorSiteDaysComputed} site days)
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-2.5 px-5 text-right font-extrabold text-slate-900 border-r border-slate-200 bg-white">
                  <input
                    type="number"
                    min={0}
                    value={finalSeniorFoodCost}
                    onChange={(e) => setManualSeniorFoodOverride(Number(e.target.value))}
                    className="w-32 text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 text-sm"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => addExtraExpense('FOOD')}
                    className="text-purple-600 hover:text-purple-800 p-1"
                    title="Add Extra Food Item"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            )}

            {/* ROW: IoT Engineer Food Cost */}
            {(emsManpowerRows.some((r) => r.roleLevel === 'IOT_ENGINEER') || manualIotFoodOverride !== null) && (
              <tr className="border-t border-slate-200 font-bold bg-white">
                <td colSpan={4} className="p-3 px-6 border-r border-slate-300 text-right text-slate-800">
                  <div className="flex items-center justify-end gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">IoT Engineer Food Cost</span>
                      {iotCount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                          {iotCount} {iotCount === 1 ? 'Person' : 'Persons'} ({iotDaysPerPerson.toFixed(Number.isInteger(iotDaysPerPerson) ? 0 : 1)} {iotDaysPerPerson === 1 ? 'day' : 'days'}/person)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Rate: ₹</span>
                      <input
                        type="number"
                        min={0}
                        value={iotFoodRate}
                        onChange={(e) => {
                          setIotFoodRate(Number(e.target.value));
                          setManualIotFoodOverride(null);
                        }}
                        className="w-16 text-right font-bold text-slate-900 bg-white border border-slate-200 rounded px-1 text-xs"
                      />
                      <span className="text-[11px] text-slate-500 font-semibold">/day</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Total Mandays:</span>
                      <input
                        type="number"
                        min={0}
                        value={activeIotDays}
                        onChange={(e) => {
                          setManualIotDays(Number(e.target.value));
                          setManualIotFoodOverride(null);
                        }}
                        className="w-14 text-center font-bold text-purple-700 bg-purple-50/50 border border-slate-200 rounded px-1 text-xs"
                      />
                    </div>
                    {manualIotDays !== null && (
                      <button
                        onClick={() => {
                          setManualIotDays(null);
                          setManualIotFoodOverride(null);
                        }}
                        className="text-[10px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded border border-purple-200"
                        title="Re-sync to manpower site days"
                      >
                        Auto Mapped ({iotSiteDaysComputed} site days)
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-2.5 px-5 text-right font-extrabold text-slate-900 border-r border-slate-200 bg-white">
                  <input
                    type="number"
                    min={0}
                    value={finalIotFoodCost}
                    onChange={(e) => setManualIotFoodOverride(Number(e.target.value))}
                    className="w-32 text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 text-sm"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => addExtraExpense('FOOD')}
                    className="text-purple-600 hover:text-purple-800 p-1 cursor-pointer"
                    title="Add Extra Food Item"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            )}

            {/* ROW: Trainee Energy Engineer Food Cost */}
            {(emsManpowerRows.some((r) => r.roleLevel === 'TRAINEE_ENERGY') || manualTraineeFoodOverride !== null) && (
              <tr className="border-t border-slate-200 font-bold bg-white">
                <td colSpan={4} className="p-3 px-6 border-r border-slate-300 text-right text-slate-800">
                  <div className="flex items-center justify-end gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">Trainee Energy Engineer Food Cost</span>
                      {traineeCount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                          {traineeCount} {traineeCount === 1 ? 'Person' : 'Persons'} ({traineeDaysPerPerson.toFixed(Number.isInteger(traineeDaysPerPerson) ? 0 : 1)} {traineeDaysPerPerson === 1 ? 'day' : 'days'}/person)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Rate: ₹</span>
                      <input
                        type="number"
                        min={0}
                        value={traineeFoodRate}
                        onChange={(e) => {
                          if (setTraineeFoodRate) setTraineeFoodRate(Number(e.target.value));
                          if (setManualTraineeFoodOverride) setManualTraineeFoodOverride(null);
                        }}
                        className="w-16 text-right font-bold text-slate-900 bg-white border border-slate-200 rounded px-1 text-xs"
                      />
                      <span className="text-[11px] text-slate-500 font-semibold">/day</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Total Mandays:</span>
                      <input
                        type="number"
                        min={0}
                        value={activeTraineeDays}
                        onChange={(e) => {
                          if (setManualTraineeDays) setManualTraineeDays(Number(e.target.value));
                          if (setManualTraineeFoodOverride) setManualTraineeFoodOverride(null);
                        }}
                        className="w-14 text-center font-bold text-purple-700 bg-purple-50/50 border border-slate-200 rounded px-1 text-xs"
                      />
                    </div>
                    {manualTraineeDays !== null && (
                      <button
                        onClick={() => {
                          if (setManualTraineeDays) setManualTraineeDays(null);
                          if (setManualTraineeFoodOverride) setManualTraineeFoodOverride(null);
                        }}
                        className="text-[10px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded border border-purple-200 cursor-pointer"
                        title="Re-sync to manpower site days"
                      >
                        Auto Mapped ({traineeSiteDaysComputed} site days)
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-2.5 px-5 text-right font-extrabold text-slate-900 border-r border-slate-200 bg-white">
                  <input
                    type="number"
                    min={0}
                    value={finalTraineeFoodCost}
                    onChange={(e) => {
                      if (setManualTraineeFoodOverride) setManualTraineeFoodOverride(Number(e.target.value));
                    }}
                    className="w-32 text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 text-sm"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => addExtraExpense('FOOD')}
                    className="text-purple-600 hover:text-purple-800 p-1 cursor-pointer"
                    title="Add Extra Food Item"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            )}

            {/* ROW: Custom Role Food Cost */}
            {(emsManpowerRows.some((r) => r.roleLevel === 'CUSTOM') || manualCustomFoodOverride !== null) && (
              <tr className="border-t border-slate-200 font-bold bg-white">
                <td colSpan={4} className="p-3 px-6 border-r border-slate-300 text-right text-slate-800">
                  <div className="flex items-center justify-end gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">Custom Role Food Cost</span>
                      {customCount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                          {customCount} {customCount === 1 ? 'Person' : 'Persons'} ({customDaysPerPerson.toFixed(Number.isInteger(customDaysPerPerson) ? 0 : 1)} {customDaysPerPerson === 1 ? 'day' : 'days'}/person)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Rate: ₹</span>
                      <input
                        type="number"
                        min={0}
                        value={customFoodRate}
                        onChange={(e) => {
                          if (setCustomFoodRate) setCustomFoodRate(Number(e.target.value));
                          if (setManualCustomFoodOverride) setManualCustomFoodOverride(null);
                        }}
                        className="w-16 text-right font-bold text-slate-900 bg-white border border-slate-200 rounded px-1 text-xs"
                      />
                      <span className="text-[11px] text-slate-500 font-semibold">/day</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Total Mandays:</span>
                      <input
                        type="number"
                        min={0}
                        value={activeCustomDays}
                        onChange={(e) => {
                          if (setManualCustomDays) setManualCustomDays(Number(e.target.value));
                          if (setManualCustomFoodOverride) setManualCustomFoodOverride(null);
                        }}
                        className="w-14 text-center font-bold text-purple-700 bg-purple-50/50 border border-slate-200 rounded px-1 text-xs"
                      />
                    </div>
                    {manualCustomDays !== null && (
                      <button
                        onClick={() => {
                          if (setManualCustomDays) setManualCustomDays(null);
                          if (setManualCustomFoodOverride) setManualCustomFoodOverride(null);
                        }}
                        className="text-[10px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded border border-purple-200 cursor-pointer"
                        title="Re-sync to manpower site days"
                      >
                        Auto Mapped ({customRoleSiteDaysComputed ?? customSiteDaysComputed ?? 0} site days)
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-2.5 px-5 text-right font-extrabold text-slate-900 border-r border-slate-200 bg-white">
                  <input
                    type="number"
                    min={0}
                    value={finalCustomFoodCost}
                    onChange={(e) => {
                      if (setManualCustomFoodOverride) setManualCustomFoodOverride(Number(e.target.value));
                    }}
                    className="w-32 text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 text-sm"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => addExtraExpense('FOOD')}
                    className="text-purple-600 hover:text-purple-800 p-1 cursor-pointer"
                    title="Add Extra Food Item"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            )}

            {/* TRAVEL EXPENSES: INSIDE CHENNAI & OUTSIDE CHENNAI */}
            {isLocalStationActive && (
              <tr className="border-t border-slate-200 font-bold bg-white">
                <td colSpan={4} className="p-3 px-6 border-r border-slate-300 text-right text-slate-800">
                  <div className="flex items-center justify-end gap-3 flex-wrap">
                    {/* Site Locations */}
                    <div className="flex items-center gap-1.5 text-sky-700 font-extrabold">
                      <MapPin className="h-4 w-4 text-sky-600" />
                      <span>Site Locations</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedSites.map((site) => {
                        const dist = getSiteDistanceKm(site);
                        return (
                          <span
                            key={site}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-sky-50 border border-sky-200 rounded-lg text-[11px] font-bold text-sky-900"
                          >
                            <MapPin className="h-2.5 w-2.5 text-sky-500" />
                            <span>{site}</span>
                            {dist > 0 && (
                              <span className="text-[10px] bg-sky-200/70 text-sky-900 px-1 py-0.2 rounded font-mono font-bold">
                                {dist} km
                              </span>
                            )}
                            <button
                              onClick={() => removeSelectedSite(site)}
                              className="text-sky-400 hover:text-rose-500 ml-0.5 transition-colors"
                              title={`Remove ${site}`}
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                    <div className="relative" ref={siteDropdownRef} data-site-dropdown="true">
                      <button
                        onClick={() => setShowSiteDropdown(!showSiteDropdown)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Plus className="h-3 w-3 text-sky-600" /> Add Site <span className={`text-slate-400 text-[9px] transition-transform ${showSiteDropdown ? 'rotate-180' : ''}`}>▼</span>
                      </button>
                      {showSiteDropdown && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20">
                          {renderSiteDropdownContent()}
                        </div>
                      )}
                    </div>

                    <div className="h-5 w-px bg-slate-300"></div>

                    {/* Travel Local */}
                    <div className="flex items-center gap-1.5 text-sky-700 font-extrabold">
                      <MapPin className="h-4 w-4 text-sky-600" />
                      <span>Travel (Local Kms)</span>
                      {juniorCount + seniorCount + iotCount + traineeCount + customCount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-sky-100 text-sky-900 border border-sky-300">
                          {juniorCount + seniorCount + iotCount + traineeCount + customCount} {juniorCount + seniorCount + iotCount + traineeCount + customCount === 1 ? 'Person' : 'Persons'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Distance:</span>
                      <input
                        type="number"
                        min={0}
                        value={insideChennaiDistanceKms}
                        onChange={(e) => {
                          setInsideChennaiDistanceKms(Number(e.target.value));
                          setManualInsideChennaiOverride(null);
                        }}
                        className="w-16 text-center font-bold text-slate-900 bg-white border border-slate-200 rounded px-1 text-xs"
                      />
                      <span className="text-[11px] text-slate-500 font-semibold">Kms</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Rate: ₹</span>
                      <input
                        type="number"
                        min={0}
                        value={insideChennaiRatePerKm}
                        onChange={(e) => {
                          setInsideChennaiRatePerKm(Number(e.target.value));
                          setManualInsideChennaiOverride(null);
                        }}
                        className="w-14 text-right font-bold text-slate-900 bg-white border border-slate-200 rounded px-1 text-xs"
                      />
                      <span className="text-[11px] text-slate-500 font-semibold">/km</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Days:</span>
                      <input
                        type="number"
                        min={0}
                        value={activeInsideChennaiDays}
                        onChange={(e) => {
                          if (setManualInsideChennaiDays) setManualInsideChennaiDays(Number(e.target.value));
                          setManualInsideChennaiOverride(null);
                        }}
                        className="w-12 text-center font-bold text-sky-700 bg-sky-50/50 border border-slate-200 rounded px-1 text-xs"
                      />
                    </div>
                    {manualInsideChennaiDays !== null && (
                      <button
                        onClick={() => {
                          if (setManualInsideChennaiDays) setManualInsideChennaiDays(null);
                          setManualInsideChennaiOverride(null);
                        }}
                        className="text-[10px] font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded border border-sky-200 cursor-pointer"
                        title="Re-sync to highest site working days"
                      >
                        Auto Mapped ({maxSiteWorkingDays} max days)
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-2.5 px-5 text-right font-extrabold text-slate-900 border-r border-slate-200 bg-white">
                  <input
                    type="number"
                    min={0}
                    value={finalInsideChennaiTravel}
                    onChange={(e) => setManualInsideChennaiOverride(Number(e.target.value))}
                    className="w-32 text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 text-sm"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => addExtraExpense('TRAVEL')}
                    className="text-sky-600 hover:text-sky-800 p-1"
                    title="Add Travel Line Item"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            )}

            {/* Travel Outstation Mode Segregated */}
            {isOutstationActive && (
              <tr className="border-t border-slate-200 font-bold bg-white">
                <td colSpan={4} className="p-3 px-6 border-r border-slate-300 text-right text-slate-800">
                  <div className="flex items-center justify-end gap-3 flex-wrap">
                    {/* Outstation Start -> End Route & Distance */}
                    <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-xl px-2.5 py-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-indigo-700 font-bold">From:</span>
                        <input
                          type="text"
                          value={outstationStartLocation}
                          onChange={(e) => setOutstationStartLocation(e.target.value)}
                          placeholder="Origin (e.g. Chennai)"
                          className="w-24 bg-white border border-indigo-300 rounded px-1.5 py-0.5 text-xs font-bold text-indigo-950 placeholder:text-indigo-300"
                        />
                      </div>
                      <span className="text-indigo-400 font-bold text-xs">➔</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-indigo-700 font-bold">To:</span>
                        <input
                          type="text"
                          value={outstationEndLocation}
                          onChange={(e) => setOutstationEndLocation(e.target.value)}
                          placeholder="Destination (e.g. Site Location)"
                          className="w-28 bg-white border border-indigo-300 rounded px-1.5 py-0.5 text-xs font-bold text-indigo-950 placeholder:text-indigo-300"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Distance:</span>
                      <input
                        type="number"
                        min={0}
                        value={outstationDistanceKms}
                        onChange={(e) => setOutstationDistanceKms(Number(e.target.value))}
                        className="w-16 text-center font-bold text-slate-900 bg-white border border-slate-200 rounded px-1 text-xs"
                      />
                      <span className="text-[11px] text-slate-500 font-semibold">Kms</span>
                    </div>

                    <div className="h-5 w-px bg-slate-300"></div>
                    <div className="flex items-center gap-1.5 text-indigo-700 font-extrabold">
                      <Car className="h-4 w-4 text-indigo-600" />
                      <span>Travel (Outstation)</span>
                      {juniorCount + seniorCount + iotCount + traineeCount + customCount > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                          {juniorCount + seniorCount + iotCount + traineeCount + customCount} {juniorCount + seniorCount + iotCount + traineeCount + customCount === 1 ? 'Person' : 'Persons'}
                        </span>
                      )}
                      <span className="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded">
                        Up & Down (×2)
                      </span>
                    </div>

                    {/* Multi-Select Travel Mode Dropdown */}
                    <div className="relative" ref={travelModeDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowTravelModeDropdown(!showTravelModeDropdown)}
                        className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:border-indigo-500 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 shadow-2xs transition cursor-pointer"
                      >
                        <span className="text-[11px] text-slate-500 font-semibold">Mode:</span>
                        <span className="text-indigo-900 font-black">
                          {selectedTravelModes.length === 0
                            ? 'Select Mode'
                            : selectedTravelModes.length === 4
                              ? 'All Modes (4)'
                              : selectedTravelModes
                                .map((m) => (m === 'BUS' ? 'Bus' : m === 'CAB' ? 'Cab' : m === 'TRAIN' ? 'Train' : 'Flight'))
                                .join(', ')}
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      </button>

                      {showTravelModeDropdown && (
                        <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                          <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                            <span>Select Modes</span>
                            <span className="text-indigo-600 font-bold">({selectedTravelModes.length})</span>
                          </div>

                          <label
                            onClick={() => toggleTravelMode('BUS')}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-amber-50 cursor-pointer text-xs font-bold text-slate-800 transition"
                          >
                            <span className="flex items-center gap-2">
                              <Bus className="h-3.5 w-3.5 text-amber-600" /> Bus
                            </span>
                            <input
                              type="checkbox"
                              checked={selectedTravelModes.includes('BUS')}
                              onChange={() => { }}
                              className="h-3.5 w-3.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                            />
                          </label>

                          <label
                            onClick={() => toggleTravelMode('CAB')}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-blue-50 cursor-pointer text-xs font-bold text-slate-800 transition"
                          >
                            <span className="flex items-center gap-2">
                              <Car className="h-3.5 w-3.5 text-blue-600" /> Cab
                            </span>
                            <input
                              type="checkbox"
                              checked={selectedTravelModes.includes('CAB')}
                              onChange={() => { }}
                              className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                          </label>

                          <label
                            onClick={() => toggleTravelMode('TRAIN')}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 cursor-pointer text-xs font-bold text-slate-800 transition"
                          >
                            <span className="flex items-center gap-2">
                              <Train className="h-3.5 w-3.5 text-emerald-600" /> Train
                            </span>
                            <input
                              type="checkbox"
                              checked={selectedTravelModes.includes('TRAIN')}
                              onChange={() => { }}
                              className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                          </label>

                          <label
                            onClick={() => toggleTravelMode('FLIGHT')}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-purple-50 cursor-pointer text-xs font-bold text-slate-800 transition"
                          >
                            <span className="flex items-center gap-2">
                              <Plane className="h-3.5 w-3.5 text-purple-600" /> Flight
                            </span>
                            <input
                              type="checkbox"
                              checked={selectedTravelModes.includes('FLIGHT')}
                              onChange={() => { }}
                              className="h-3.5 w-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Dynamic Inputs for Checked Modes */}
                    {selectedTravelModes.includes('BUS') && (
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                        <Bus className="h-3.5 w-3.5 text-amber-600" />
                        <span className="text-[11px] text-slate-700 font-semibold">Bus: ₹</span>
                        <input
                          type="number"
                          min={0}
                          value={outsideChennaiBusCost}
                          onChange={(e) => {
                            setOutsideChennaiBusCost(Number(e.target.value));
                            setManualOutsideChennaiOverride(null);
                          }}
                          className="w-16 text-right font-bold text-slate-900 bg-white border border-amber-300 rounded px-1 text-xs"
                        />
                      </div>
                    )}

                    {selectedTravelModes.includes('CAB') && (
                      <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded px-2 py-1">
                        <Car className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-[11px] text-slate-700 font-semibold">Cab: ₹</span>
                        <input
                          type="number"
                          min={0}
                          value={outsideChennaiCabCost}
                          onChange={(e) => {
                            setOutsideChennaiCabCost(Number(e.target.value));
                            setManualOutsideChennaiOverride(null);
                          }}
                          className="w-16 text-right font-bold text-slate-900 bg-white border border-blue-300 rounded px-1 text-xs"
                        />
                      </div>
                    )}

                    {selectedTravelModes.includes('TRAIN') && (
                      <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded px-2 py-1">
                        <Train className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-[11px] text-slate-700 font-semibold">Train: ₹</span>
                        <input
                          type="number"
                          min={0}
                          value={outsideChennaiTrainCost}
                          onChange={(e) => {
                            setOutsideChennaiTrainCost(Number(e.target.value));
                            setManualOutsideChennaiOverride(null);
                          }}
                          className="w-16 text-right font-bold text-slate-900 bg-white border border-emerald-300 rounded px-1 text-xs"
                        />
                      </div>
                    )}

                    {selectedTravelModes.includes('FLIGHT') && (
                      <div className="flex items-center gap-1 bg-purple-50 border border-purple-200 rounded px-2 py-1">
                        <Plane className="h-3.5 w-3.5 text-purple-600" />
                        <span className="text-[11px] text-slate-700 font-semibold">Flight: ₹</span>
                        <input
                          type="number"
                          min={0}
                          value={outsideChennaiFlightCost}
                          onChange={(e) => {
                            setOutsideChennaiFlightCost(Number(e.target.value));
                            setManualOutsideChennaiOverride(null);
                          }}
                          className="w-16 text-right font-bold text-slate-900 bg-white border border-purple-300 rounded px-1 text-xs"
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-2.5 px-5 text-right font-extrabold text-slate-900 border-r border-slate-200 bg-white">
                  <input
                    type="number"
                    min={0}
                    value={finalOutsideChennaiTravel}
                    onChange={(e) => setManualOutsideChennaiOverride(Number(e.target.value))}
                    className="w-32 text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 text-sm"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => addExtraExpense('TRAVEL')}
                    className="text-indigo-600 hover:text-indigo-800 p-1"
                    title="Add Outstation Travel Line Item"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            )}

            {/* ACCOMMODATION EXPENSES */}
            {isOutstationActive && (
              <tr className="border-t border-slate-200 font-bold bg-white">
                <td colSpan={4} className="p-3 px-6 border-r border-slate-300 text-right text-slate-800">
                  <div className="flex items-center justify-end gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">Accomodation</span>
                      {(juniorCount + seniorCount + iotCount + traineeCount + customCount > 0) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                          {juniorCount + seniorCount + iotCount + traineeCount + customCount} {(juniorCount + seniorCount + iotCount + traineeCount + customCount) === 1 ? 'Person' : 'Persons'} ({activeAccommodationDays} {activeAccommodationDays === 1 ? 'Day' : 'Days'})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500 text-xs font-medium">Tier:</span>
                      {[1000, 1500, 2000, 2500].map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setSelectedAccommodationTier(t);
                            setIsCustomAccommodationRate(false);
                            setManualAccommodationOverride(null);
                          }}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors cursor-pointer ${selectedAccommodationTier === t && !isCustomAccommodationRate && manualAccommodationOverride === null
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                          ₹{t}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setIsCustomAccommodationRate(true);
                          setManualAccommodationOverride(null);
                        }}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors cursor-pointer ${isCustomAccommodationRate
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        Custom
                      </button>
                    </div>

                    {isCustomAccommodationRate && (
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 rounded px-2 py-1">
                        <span className="text-[11px] text-amber-800 font-semibold">Custom Rate: ₹</span>
                        <input
                          type="number"
                          min={0}
                          value={customAccommodationRate}
                          onChange={(e) => {
                            setCustomAccommodationRate(Number(e.target.value));
                            setManualAccommodationOverride(null);
                          }}
                          className="w-16 text-right font-bold text-amber-900 bg-white border border-amber-300 rounded px-1 text-xs"
                        />
                        <span className="text-[11px] text-amber-800 font-semibold">/day</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Days:</span>
                      <input
                        type="number"
                        min={0}
                        value={activeAccommodationDays}
                        onChange={(e) => {
                          setManualAccommodationDays(Number(e.target.value));
                          setManualAccommodationOverride(null);
                        }}
                        className="w-12 text-center font-bold text-purple-700 bg-purple-50/50 border border-slate-200 rounded px-1 text-xs"
                      />
                    </div>
                    {manualAccommodationDays !== null && (
                      <button
                        onClick={() => {
                          setManualAccommodationDays(null);
                          setManualAccommodationOverride(null);
                        }}
                        className="text-[10px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded border border-purple-200 cursor-pointer"
                        title="Re-sync to highest site working days"
                      >
                        Auto Mapped ({maxSiteWorkingDays} max days)
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-2.5 px-5 text-right font-extrabold text-slate-900 border-r border-slate-200 bg-white">
                  <input
                    type="number"
                    min={0}
                    value={finalAccommodationCost}
                    onChange={(e) => setManualAccommodationOverride(Number(e.target.value))}
                    className="w-32 text-right bg-slate-50 border border-slate-200 rounded px-2 py-1 font-bold text-slate-900 text-sm"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => addExtraExpense('ACCOMMODATION')}
                    className="text-purple-600 hover:text-purple-800 p-1 cursor-pointer"
                    title="Add Accommodation Line Item"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            )}

            {/* CUSTOM EXTRA EXPENSES LINES */}
            {extraExpenses.map((exp) => (
              <tr key={exp.id} className="border-t border-slate-200 bg-amber-50/30 font-semibold">
                <td className="p-2 px-4 border-r border-slate-200">
                  <textarea
                    rows={Math.max(1, Math.ceil((exp.description?.length || 1) / 40))}
                    value={exp.description}
                    onChange={(e) => updateExtraExpense(exp.id, 'description', e.target.value)}
                    placeholder="Extra expense description..."
                    className="w-full bg-white border border-amber-200 rounded px-2 py-1 text-xs font-bold text-amber-950 resize-none leading-snug whitespace-pre-wrap"
                  />
                </td>
                <td className="p-2 px-3 border-r border-slate-200 text-center">
                  <select
                    value={exp.category}
                    onChange={(e) => updateExtraExpense(exp.id, 'category', e.target.value as any)}
                    className="bg-white border border-amber-300 rounded px-1.5 py-1 text-xs font-bold text-amber-900"
                  >
                    <option value="FOOD">Food</option>
                    <option value="TRAVEL">Travel</option>
                    <option value="ACCOMMODATION">Accomodation</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </td>
                <td className="p-2 px-3 border-r border-slate-200 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[11px] text-slate-400">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={exp.rate}
                      onChange={(e) => updateExtraExpense(exp.id, 'rate', Number(e.target.value))}
                      className="w-20 text-right bg-white border border-amber-200 rounded px-1 py-1 text-xs font-bold"
                    />
                  </div>
                </td>
                <td className="p-2 px-3 border-r border-slate-200 text-center">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-600">
                    <input
                      type="number"
                      min={1}
                      value={exp.qty}
                      onChange={(e) => updateExtraExpense(exp.id, 'qty', Number(e.target.value))}
                      className="w-10 text-center bg-white border border-amber-200 rounded px-1 py-1 text-xs font-bold"
                      title="Qty"
                    />
                    <span>×</span>
                    <input
                      type="number"
                      min={1}
                      value={exp.days}
                      onChange={(e) => updateExtraExpense(exp.id, 'days', Number(e.target.value))}
                      className="w-10 text-center bg-white border border-amber-200 rounded px-1 py-1 text-xs font-bold"
                      title="Days"
                    />
                  </div>
                </td>
                <td className="p-2.5 px-5 text-right font-black text-amber-950 border-r border-slate-200 bg-amber-100/50">
                  ₹{formatMoney((exp.rate || 0) * (exp.qty !== undefined && exp.qty !== null ? exp.qty : 0) * (exp.days !== undefined && exp.days !== null ? exp.days : 0))}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => removeExtraExpense(exp.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {/* 2. Site Travel, Food & Accommodation Expenses Sub-Total Row */}
            <tr className="border-t-2 border-slate-300 font-extrabold text-xs bg-amber-50/80">
              <td colSpan={4} className="p-3 px-6 text-right uppercase tracking-wider text-amber-950">
                <div className="flex items-center justify-end gap-2 flex-wrap">
                  <Car className="h-4 w-4 text-amber-700" />
                  <span className="font-black">{isOutstationActive ? 'Travel, Food & Accommodation Cost' : 'Travel & Food Cost'}</span>
                  <span className="text-[11px] font-semibold text-amber-800 lowercase bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300">
                    (food ₹{formatMoney(totalFoodCost)} + travel ₹{formatMoney(totalTravelCost)}{isOutstationActive ? ` + acc ₹${formatMoney(finalAccommodationCost)}` : ''}{customExpensesTotal > 0 ? ` + extra ₹${formatMoney(customExpensesTotal)}` : ''})
                  </span>
                </div>
              </td>
              <td colSpan={2} className="p-3 px-5 text-right font-black text-amber-950 bg-amber-200/80 text-sm">
                ₹{formatMoney(emsSiteExpensesTotalCost)}
              </td>
            </tr>

            {/* 3. Combined Step Grand Total Row */}
            <tr className="bg-slate-900 text-white border-t-2 border-slate-950 font-extrabold text-xs">
              <td colSpan={4} className="p-3.5 px-6 text-right uppercase tracking-wider font-extrabold">
                <div className="flex items-center justify-end gap-3 flex-wrap">
                  <span className="text-white font-black text-xs">
                    {String(stepNumber || '').toLowerCase().startsWith('step') ? stepNumber : `Step ${stepNumber}`} Total: Manpower + {isOutstationActive ? 'Travel, Food & Accommodation Cost' : 'Travel & Food Cost'}
                  </span>
                  <span className="text-[11px] font-bold text-amber-300 bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                    [Manpower Base: ₹{formatMoney(emsManpowerBaseCost)}] + [{isOutstationActive ? 'Travel, Food & Acc' : 'Travel & Food'}: ₹{formatMoney(emsSiteExpensesTotalCost)}]
                  </span>

                  {/* Interactive Editable Margin Input */}
                  <div className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-300">Margin:</span>
                    <div className="inline-flex items-center gap-0.5 bg-slate-950 border border-slate-600 rounded px-1.5 py-0.5">
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={profitPct === 0 ? '' : profitPct}
                        placeholder="0"
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setProfitPct && setProfitPct(e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-10 text-center font-black text-emerald-400 bg-transparent text-xs focus:outline-none"
                      />
                      <span className="text-[11px] font-bold text-emerald-400">%</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-3.5 px-5 text-right font-black text-amber-400 bg-slate-950 text-sm border-r border-slate-800">
                <span className="text-[10px] text-slate-400 block font-normal uppercase tracking-wider">Total Cost</span>
                ₹{formatMoney(emsManpowerTotalCost)}
              </td>
              <td className="p-3.5 px-4 text-right font-black text-emerald-400 bg-slate-950 text-sm">
                <span className="text-[10px] text-emerald-300 block font-normal uppercase tracking-wider">Price (Cost / {(((100 - (profitPct || 40)) / 100)).toFixed(2)})</span>
                ₹{formatMoney(Math.round(emsManpowerTotalCost / Math.max(0.01, (100 - (profitPct || 40)) / 100)))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

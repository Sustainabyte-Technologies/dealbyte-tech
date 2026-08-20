import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  FileSpreadsheet,
  Building,
  FolderKanban,
  RefreshCw,
  RotateCcw,
  Download,
  CheckCircle2,
  MapPin,
  ChevronDown,
  Check,
  Search,
} from 'lucide-react';
import { SERVICE_CATEGORY_OPTIONS } from '../constants';

export interface CostingHeaderProps {
  clientName: string;
  setClientName: (name: string) => void;
  clientOptions: string[];
  activeProjectName: string;
  activeServiceScope: string;
  mainCategoryService: string;
  setMainCategoryService: (cat: string) => void;
  customCategoryText: string;
  setCustomCategoryText: (txt: string) => void;
  subServiceOption: string;
  setSubServiceOption: (s: string) => void;
  customSubServiceText: string;
  setCustomSubServiceText: (txt: string) => void;
  selectedProject: string;
  setSelectedProject: (p: string) => void;
  customProjectText: string;
  setCustomProjectText: (txt: string) => void;
  stationType: string;
  handleStationTypeChange: (type: 'Local Station' | 'Outstation' | 'Both (Local & Outstation)') => void;
  syncAllSiteDays: (days: number) => void;
  resetToModelDefaults: () => void;
  exportCSV: () => void;
  dynamicEnergyAuditSubServices: string[];
  dynamicIotServicesSubServices: string[];
  dynamicWeldingIotSubServices: string[];
  dynamicHardwareSubServices: string[];
  dynamicProjectsSubServices: string[];
}

export const CostingHeader: React.FC<CostingHeaderProps> = ({
  clientName,
  setClientName,
  clientOptions,
  activeProjectName,
  activeServiceScope,
  mainCategoryService,
  setMainCategoryService,
  customCategoryText,
  setCustomCategoryText,
  subServiceOption,
  setSubServiceOption,
  customSubServiceText,
  setCustomSubServiceText,
  selectedProject,
  setSelectedProject,
  customProjectText,
  setCustomProjectText,
  stationType,
  handleStationTypeChange,
  syncAllSiteDays,
  resetToModelDefaults,
  exportCSV,
  dynamicEnergyAuditSubServices,
  dynamicIotServicesSubServices,
  dynamicWeldingIotSubServices,
  dynamicHardwareSubServices,
  dynamicProjectsSubServices,
}) => {
  const [isSubServiceOpen, setIsSubServiceOpen] = useState(false);
  const [subServiceSearch, setSubServiceSearch] = useState('');
  const subServiceDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        subServiceDropdownRef.current &&
        !subServiceDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSubServiceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSubServices = useMemo(() => {
    if (mainCategoryService === 'Energy Audit Services') return dynamicEnergyAuditSubServices;
    if (mainCategoryService === 'IoT & Controls') return dynamicIotServicesSubServices;
    if (mainCategoryService === 'Welding IoT') return dynamicWeldingIotSubServices;
    if (mainCategoryService === 'Hardware') return dynamicHardwareSubServices;
    return ['Custom'];
  }, [
    mainCategoryService,
    dynamicEnergyAuditSubServices,
    dynamicIotServicesSubServices,
    dynamicWeldingIotSubServices,
    dynamicHardwareSubServices,
  ]);

  const filteredSubServices = useMemo(() => {
    if (!subServiceSearch.trim()) return currentSubServices;
    return currentSubServices.filter((s) =>
      s.toLowerCase().includes(subServiceSearch.toLowerCase().trim())
    );
  }, [currentSubServices, subServiceSearch]);

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-600/20">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Master Costing Sheet
                </h1>
                {clientName && (
                  <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Building className="h-3 w-3 text-emerald-600" /> {clientName}
                  </span>
                )}
                {activeProjectName && (
                  <span className="text-xs bg-purple-50 text-purple-800 border border-purple-300 font-extrabold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                    <FolderKanban className="h-3.5 w-3.5 text-purple-600" /> Project: {activeProjectName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Service Scope: <strong className="text-indigo-700 font-bold">{activeServiceScope}</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Day Sync Button */}
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-1.5 shadow-2xs">
            <RefreshCw className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-900">Map All Site Days:</span>
            <input
              type="number"
              min={0}
              placeholder="e.g. 2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = Number((e.target as HTMLInputElement).value);
                  if (!isNaN(val)) syncAllSiteDays(val);
                }
              }}
              className="w-16 text-center font-bold text-indigo-900 bg-white border border-indigo-300 rounded px-1 text-xs py-0.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="text-xs font-medium text-indigo-700">Days</span>
          </div>

          <button
            type="button"
            onClick={resetToModelDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Model Defaults
          </button>
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Export Excel / CSV
          </button>
        </div>
      </div>

      {/* Project Meta Info Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Field 1: Client Name */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">Client Name</label>
            {clientName && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Client Mapped
              </span>
            )}
          </div>
          <select
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs cursor-pointer"
          >
            <option value="" disabled>Select Client...</option>
            {clientOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Field 2: Our Services (Category) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Our Services</label>
          <select
            value={mainCategoryService}
            onChange={(e) => {
              const category = e.target.value;
              setMainCategoryService(category);
              if (category === 'Energy Audit Services') {
                setSubServiceOption('Air Audit');
              } else if (category === 'IoT & Controls') {
                setSubServiceOption('Energy Management Solution');
              } else if (category === 'Welding IoT') {
                setSubServiceOption('Welding IoT & Kit');
              } else if (category === 'Hardware') {
                setSubServiceOption('Hardware Installation');
              } else if (category === 'Custom') {
                setSubServiceOption('Custom');
              }
            }}
            className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs cursor-pointer"
          >
            {SERVICE_CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {mainCategoryService === 'Custom' && (
            <input
              type="text"
              value={customCategoryText}
              onChange={(e) => setCustomCategoryText(e.target.value)}
              placeholder="Type custom service category..."
              className="mt-2 w-full px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs"
            />
          )}
        </div>

        {/* Field 3: List of Services Selection (Scrollable Custom Dropdown) */}
        <div className="relative" ref={subServiceDropdownRef}>
          <label className="block text-xs font-bold text-slate-700 mb-1">List of Services</label>

          <button
            type="button"
            onClick={() => setIsSubServiceOpen((prev) => !prev)}
            className={`w-full px-3.5 py-2 text-xs font-extrabold rounded-xl border flex items-center justify-between shadow-2xs cursor-pointer transition-all text-left ${
              mainCategoryService === 'Energy Audit Services'
                ? 'text-indigo-900 bg-indigo-50/50 border-indigo-300 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500'
                : mainCategoryService === 'IoT & Controls' || mainCategoryService === 'Welding IoT'
                ? 'text-purple-900 bg-purple-50/50 border-purple-300 hover:border-purple-400 focus:ring-2 focus:ring-purple-500'
                : mainCategoryService === 'Hardware'
                ? 'text-amber-900 bg-amber-50/50 border-amber-300 hover:border-amber-400 focus:ring-2 focus:ring-amber-500'
                : 'text-slate-900 bg-slate-50 border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-indigo-500'
            }`}
          >
            <span className="truncate">{subServiceOption || 'Select Service...'}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 ml-1.5 opacity-70 transition-transform duration-200 ${
                isSubServiceOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isSubServiceOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 min-w-[220px]">
              {currentSubServices.length > 5 && (
                <div className="relative mb-1.5 px-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={subServiceSearch}
                    onChange={(e) => setSubServiceSearch(e.target.value)}
                    placeholder="Search services..."
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                </div>
              )}

              <div className="max-h-56 overflow-y-auto space-y-0.5 pr-0.5">
                {filteredSubServices.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-slate-400 text-center font-medium">
                    No services found
                  </div>
                ) : (
                  filteredSubServices.map((s) => {
                    const isSelected = subServiceOption === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSubServiceOption(s);
                          setIsSubServiceOpen(false);
                          setSubServiceSearch('');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{s}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0 ml-1.5" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {(subServiceOption === 'Custom' || mainCategoryService === 'Custom') && (
            <input
              type="text"
              value={customSubServiceText}
              onChange={(e) => setCustomSubServiceText(e.target.value)}
              placeholder="Type custom service scope..."
              className="mt-2 w-full px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs"
            />
          )}
        </div>

        {/* Field 4: Our Projects */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">Our Projects</label>
            {selectedProject && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Project Mapped
              </span>
            )}
          </div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full px-3.5 py-2 text-xs font-extrabold text-emerald-900 bg-emerald-50/50 border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-2xs cursor-pointer"
          >
            <option value="">None (Select Project...)</option>
            {dynamicProjectsSubServices.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {selectedProject === 'Custom Project' && (
            <input
              type="text"
              value={customProjectText}
              onChange={(e) => setCustomProjectText(e.target.value)}
              placeholder="Type custom project name..."
              className="mt-2 w-full px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-2xs"
            />
          )}
        </div>

        {/* Field 5: Station Type */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">Station Type</label>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
              stationType === 'Local Station'
                ? 'text-sky-700 bg-sky-50 border border-sky-200'
                : stationType === 'Outstation'
                ? 'text-purple-700 bg-purple-50 border border-purple-200'
                : 'text-indigo-700 bg-indigo-50 border border-indigo-200'
            }`}>
              <MapPin className="h-3 w-3" /> {stationType === 'Both (Local & Outstation)' ? 'Local & Outstation' : stationType}
            </span>
          </div>
          <select
            value={stationType}
            onChange={(e) => handleStationTypeChange(e.target.value as any)}
            className="w-full px-3.5 py-2 text-xs font-extrabold text-sky-900 bg-sky-50/50 border border-sky-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-2xs cursor-pointer"
          >
            <option value="Local Station">Local Station</option>
            <option value="Outstation">Outstation</option>
            <option value="Both (Local & Outstation)">Both (Local & Outstation)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

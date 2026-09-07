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
  Plus,
  Upload,
  X,
  Camera,
  Loader2,
  Trash2,
  Building2,
  Image as ImageIcon,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ClientItem, clientsApi } from '@/lib/api/clients';
import { SERVICE_CATEGORY_OPTIONS, IR_BLASTER_SUB_SERVICES, HARDWARE_SUB_SERVICES, getClientPresetLogo, getCategoryForSubService } from '../constants';

export interface CostingHeaderProps {
  clientName: string;
  setClientName: (name: string) => void;
  clientOptions: string[];
  dbClients?: ClientItem[];
  onClientAdded?: (client: ClientItem) => void;
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
  selectedProject?: string;
  setSelectedProject?: (p: string) => void;
  customProjectText?: string;
  setCustomProjectText?: (txt: string) => void;
  stationType: string;
  handleStationTypeChange: (type: 'Local Station' | 'Outstation' | 'Both (Local & Outstation)') => void;
  syncAllSiteDays: (days: number) => void;
  resetToModelDefaults: () => void;
  exportCSV: () => void;
  dynamicEnergyAuditSubServices: string[];
  dynamicIotServicesSubServices: string[];
  dynamicChillerManagementSubServices?: string[];
  dynamicWeldingIotSubServices: string[];
  dynamicAutomationSubServices?: string[];
  dynamicIrBlasterSubServices?: string[];
  dynamicBmsCategorySubServices?: string[];
  dynamicHardwareSubServices: string[];
  dynamicProjectsSubServices?: string[];
}

export const CostingHeader: React.FC<CostingHeaderProps> = ({
  clientName,
  setClientName,
  clientOptions,
  dbClients = [],
  onClientAdded,
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
  stationType,
  handleStationTypeChange,
  syncAllSiteDays,
  resetToModelDefaults,
  exportCSV,
  dynamicEnergyAuditSubServices,
  dynamicIotServicesSubServices = [
    'Energy Management Solution',
    'Compressed Air Monitoring',
    'IoT Platform',
    'Water Management Solution',
  ],
  dynamicChillerManagementSubServices = ['CPM (Chiller Plant Management)'],
  dynamicWeldingIotSubServices = [
    'Welding IoT Kit',
    'Digiweld',
  ],
  dynamicAutomationSubServices = [
    'Compressed Air Automation',
    'Water Automation',
  ],
  dynamicIrBlasterSubServices = IR_BLASTER_SUB_SERVICES,
  dynamicBmsCategorySubServices = [
    'BMS',
  ],
  dynamicHardwareSubServices = HARDWARE_SUB_SERVICES,
}) => {
  const [isClientOpen, setIsClientOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const clientDropdownRef = useRef<HTMLDivElement>(null);

  // Client Modal States (Add New Client or Upload Logo)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientModalMode, setClientModalMode] = useState<'add' | 'upload-logo'>('add');
  const [modalClientName, setModalClientName] = useState('');
  const [modalLogo, setModalLogo] = useState<string | null>(null);
  const [logoInputType, setLogoInputType] = useState<'upload' | 'url'>('upload');
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [isSubmittingClient, setIsSubmittingClient] = useState(false);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const resolveClientLogo = (name?: string | null): string | null => {
    if (!name || typeof name !== 'string' || !name.trim()) return null;
    const clean = name.trim().toLowerCase();
    const dbMatch = dbClients?.find(
      (c) => c.name.trim().toLowerCase() === clean
    );
    if (dbMatch?.logo) return dbMatch.logo;

    const dbLooseMatch = dbClients?.find(
      (c) =>
        c.name.trim().toLowerCase().includes(clean) ||
        clean.includes(c.name.trim().toLowerCase())
    );
    if (dbLooseMatch?.logo) return dbLooseMatch.logo;

    return getClientPresetLogo(name);
  };

  const openAddClientModal = (initialName: string = '') => {
    setClientModalMode('add');
    setModalClientName(initialName);
    setModalLogo(null);
    setLogoUrlInput('');
    setLogoInputType('upload');
    setIsClientModalOpen(true);
    setIsClientOpen(false);
  };

  const openUploadLogoModal = (clientToEdit: string) => {
    setClientModalMode('upload-logo');
    setModalClientName(clientToEdit);
    const existingLogo = resolveClientLogo(clientToEdit);
    setModalLogo(existingLogo);
    setLogoUrlInput(existingLogo?.startsWith('http') ? existingLogo : '');
    setLogoInputType('upload');
    setIsClientModalOpen(true);
    setIsClientOpen(false);
  };

  const processImageFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo file size must be less than 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, SVG, WEBP)');
      return;
    }

    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        setModalLogo(reader.result as string);
        toast.success('SVG Logo loaded');
      };
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL(file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png', 0.9);
          setModalLogo(dataUrl);
          toast.success('Logo ready for DB storage');
        } else {
          setModalLogo(reader.result as string);
          toast.success('Logo ready for DB storage');
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveClientToDB = async () => {
    const trimmedName = modalClientName.trim();
    if (!trimmedName) {
      toast.error('Please enter a client name');
      return;
    }

    const finalLogo = modalLogo || (logoUrlInput.trim() ? logoUrlInput.trim() : undefined);

    setIsSubmittingClient(true);
    try {
      const savedClient = await clientsApi.create(trimmedName, finalLogo || undefined);
      await queryClient.invalidateQueries({ queryKey: ['clients'] });
      setClientName(savedClient.name);
      if (onClientAdded) {
        onClientAdded(savedClient);
      }
      setIsClientModalOpen(false);
      setIsClientOpen(false);
      setClientSearch('');
      toast.success(
        clientModalMode === 'add'
          ? `Client "${savedClient.name}" with logo saved to Database!`
          : `Logo for "${savedClient.name}" updated in Database!`
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save client to Database');
    } finally {
      setIsSubmittingClient(false);
    }
  };

  const [isSubServiceOpen, setIsSubServiceOpen] = useState(false);
  const [subServiceSearch, setSubServiceSearch] = useState('');
  const subServiceDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clientDropdownRef.current &&
        !clientDropdownRef.current.contains(event.target as Node)
      ) {
        setIsClientOpen(false);
      }
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

  const filteredClients = useMemo(() => {
    if (!clientSearch.trim()) return clientOptions;
    return clientOptions.filter((c) =>
      c.toLowerCase().includes(clientSearch.toLowerCase().trim())
    );
  }, [clientOptions, clientSearch]);

  const currentSubServices = useMemo(() => {
    if (mainCategoryService === 'Energy Audit Services') return dynamicEnergyAuditSubServices;
    if (mainCategoryService === 'IoT & Controls') return dynamicIotServicesSubServices;
    if (mainCategoryService === 'Chiller Management') return dynamicChillerManagementSubServices;
    if (mainCategoryService === 'Welding' || mainCategoryService === 'Welding IoT') return dynamicWeldingIotSubServices;
    if (mainCategoryService === 'Automation') return dynamicAutomationSubServices;
    if (mainCategoryService === 'IR Blaster') return dynamicIrBlasterSubServices;
    if (mainCategoryService === 'BMS') return dynamicBmsCategorySubServices;
    if (mainCategoryService === 'Hardware') return dynamicHardwareSubServices;
    return [];
  }, [
    mainCategoryService,
    dynamicEnergyAuditSubServices,
    dynamicIotServicesSubServices,
    dynamicChillerManagementSubServices,
    dynamicWeldingIotSubServices,
    dynamicAutomationSubServices,
    dynamicIrBlasterSubServices,
    dynamicBmsCategorySubServices,
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
                  <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                    {resolveClientLogo(clientName) ? (
                      <div className="h-4 w-5 bg-white border border-emerald-200 rounded p-0.5 flex items-center justify-center shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveClientLogo(clientName)!}
                          alt={clientName}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <Building className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span>{clientName}</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Field 1: Client Name Searchable Dropdown with Add Option and Logo Upload */}
        <div className="relative" ref={clientDropdownRef}>
          <div className="flex items-center justify-between mb-1 gap-1">
            <label className="block text-xs font-bold text-slate-700">Client Name</label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => openAddClientModal()}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-lg transition-all cursor-pointer shadow-2xs"
                title="Add New Client to Database with Logo"
              >
                <Plus className="h-3 w-3 text-indigo-600" /> Add Client
              </button>
              {clientName && (
                <button
                  type="button"
                  onClick={() => openUploadLogoModal(clientName)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 py-0.5 rounded-lg transition-all cursor-pointer shadow-2xs"
                  title="Upload or Change Logo for this Client"
                >
                  <Camera className="h-3 w-3 text-slate-500" /> Logo
                </button>
              )}
              {clientName && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Client Mapped
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsClientOpen((prev) => !prev)}
            className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs cursor-pointer flex items-center justify-between transition-all text-left group"
          >
            <div className="flex items-center gap-2 truncate">
              {clientName && resolveClientLogo(clientName) ? (
                <div
                  className="h-5 w-6 bg-white border border-slate-200 rounded p-0.5 flex items-center justify-center shrink-0 shadow-2xs cursor-pointer hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    openUploadLogoModal(clientName);
                  }}
                  title="Click to view or change logo"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveClientLogo(clientName)!}
                    alt={clientName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              )}
              <span className="truncate">{clientName || 'Select Client...'}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-1.5">
              <ChevronDown
                className={`h-4 w-4 opacity-70 transition-transform duration-200 ${
                  isClientOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {isClientOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 min-w-[280px]">
              {/* Add New Client Quick Action at Top */}
              <button
                type="button"
                onClick={() => openAddClientModal(clientSearch)}
                className="w-full mb-2 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50/90 hover:bg-indigo-100/90 border border-dashed border-indigo-300 rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer group"
              >
                <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <Plus className="h-3.5 w-3.5" />
                </div>
                <span>+ Add New Client with Logo</span>
              </button>

              <div className="relative mb-1.5 px-0.5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  placeholder="Search client name..."
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>

              {clientSearch.trim() && !filteredClients.some(c => c.toLowerCase().trim() === clientSearch.toLowerCase().trim()) && (
                <button
                  type="button"
                  onClick={() => openAddClientModal(clientSearch.trim())}
                  className="w-full my-1 px-2.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center justify-between gap-2 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Plus className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Add &quot;<strong>{clientSearch}</strong>&quot;</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200/60 text-emerald-800 px-1.5 py-0.5 rounded font-bold shrink-0">
                    + Logo
                  </span>
                </button>
              )}

              <div className="max-h-60 overflow-y-auto space-y-0.5 pr-0.5">
                {filteredClients.length === 0 && !clientSearch.trim() ? (
                  <div className="px-3 py-3 text-xs text-slate-400 text-center font-medium">
                    No clients found
                  </div>
                ) : (
                  filteredClients.map((c) => {
                    const isSelected = clientName === c;
                    const cLogo = resolveClientLogo(c);
                    return (
                      <div
                        key={c}
                        className={`w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-between gap-2 text-left transition-colors group/item ${
                          isSelected
                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setClientName(c);
                            setIsClientOpen(false);
                            setClientSearch('');
                          }}
                          className="flex items-center gap-2 truncate flex-1 cursor-pointer text-left"
                        >
                          {cLogo ? (
                            <div className="h-5 w-6 bg-white border border-slate-200 rounded p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={cLogo} alt={c} className="max-h-full max-w-full object-contain" />
                            </div>
                          ) : (
                            <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className="truncate">{c}</span>
                        </button>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openUploadLogoModal(c);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-colors opacity-0 group-hover/item:opacity-100 cursor-pointer"
                            title={`Upload / Update logo for ${c}`}
                          >
                            <Camera className="h-3 w-3" />
                          </button>
                          {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
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
                setSubServiceOption('Compressor air leakage audit');
              } else if (category === 'IoT & Controls') {
                setSubServiceOption('Energy Management Solution');
              } else if (category === 'Chiller Management') {
                setSubServiceOption('CPM (Chiller Plant Management)');
              } else if (category === 'Welding' || category === 'Welding IoT') {
                setSubServiceOption('Digiweld');
              } else if (category === 'Automation') {
                setSubServiceOption('Compressed Air Automation');
              } else if (category === 'IR Blaster') {
                setSubServiceOption('Old IR Blaster');
              } else if (category === 'BMS') {
                setSubServiceOption('BMS');
              } else if (category === 'Hardware') {
                setSubServiceOption('Dew Point');
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
                : mainCategoryService === 'IoT & Controls' || mainCategoryService === 'Welding' || mainCategoryService === 'Welding IoT'
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
                          const matchedCategory = getCategoryForSubService(s);
                          if (matchedCategory && matchedCategory !== mainCategoryService) {
                            setMainCategoryService(matchedCategory);
                          }
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
        </div>

        {/* Field 4: Station Type */}
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

      {/* Add New Client & Logo Upload Modal */}
      {isClientModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => !isSubmittingClient && setIsClientModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/15 rounded-xl backdrop-blur-xs">
                  {clientModalMode === 'add' ? (
                    <Building2 className="h-5 w-5 text-white" />
                  ) : (
                    <Camera className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">
                    {clientModalMode === 'add' ? 'Add New Client' : 'Upload Client Logo'}
                  </h3>
                  <p className="text-xs text-indigo-100/90 mt-0.5">
                    {clientModalMode === 'add'
                      ? 'Save client & company logo into PostgreSQL Database'
                      : `Update company logo stored in Database for ${modalClientName}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isSubmittingClient && setIsClientModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Client Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={modalClientName}
                    onChange={(e) => setModalClientName(e.target.value)}
                    placeholder="e.g. Apollo Tyres, Bosch India, Tata Motors..."
                    disabled={isSubmittingClient || clientModalMode === 'upload-logo'}
                    className="w-full pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-75 disabled:bg-slate-100"
                    autoFocus={clientModalMode === 'add'}
                  />
                </div>
              </div>

              {/* Logo Upload Section */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Company Logo <span className="text-[10px] font-normal text-slate-400">(Saved in DB)</span>
                  </label>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setLogoInputType('upload')}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                        logoInputType === 'upload'
                          ? 'bg-white text-indigo-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoInputType('url')}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                        logoInputType === 'url'
                          ? 'bg-white text-indigo-700 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Logo URL
                    </button>
                  </div>
                </div>

                {/* Logo Preview if available */}
                {modalLogo ? (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-14 bg-white border border-slate-200 rounded-xl p-1 flex items-center justify-center shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={modalLogo}
                          alt="Client Logo Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Logo Ready
                        </span>
                        <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="h-3 w-3" /> Stored directly in Database
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setModalLogo(null);
                          setLogoUrlInput('');
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Logo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : logoInputType === 'upload' ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingLogo(true);
                    }}
                    onDragLeave={() => setIsDraggingLogo(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingLogo(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) processImageFile(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 group ${
                      isDraggingLogo
                        ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                        : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20'
                    }`}
                  >
                    <div className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 shadow-2xs transition-colors">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">
                        Click or drag & drop logo image
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG, SVG or WEBP (Max 5MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={logoUrlInput}
                      onChange={(e) => setLogoUrlInput(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (logoUrlInput.trim()) {
                          setModalLogo(logoUrlInput.trim());
                          toast.success('Logo URL loaded');
                        }
                      }}
                      className="w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-colors cursor-pointer"
                    >
                      Load Logo Preview
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processImageFile(file);
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => !isSubmittingClient && setIsClientModalOpen(false)}
                disabled={isSubmittingClient}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveClientToDB}
                disabled={isSubmittingClient || !modalClientName.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingClient ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving to Database...
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    {clientModalMode === 'add' ? 'Save Client & Logo to DB' : 'Save Logo to DB'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

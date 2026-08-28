'use client';

import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { clientsApi } from '@/lib/api/clients';
import { costingApi } from '@/lib/api/costing';
import { servicesApi } from '@/lib/api/services';

import {
  CostingHeader,
  CostingSummaryCard,
  StandardAuditTemplate,
  EmsCostingTemplate,
  WeldingIotTemplate,
  IotControlsTemplate,
  CpmCostingTemplate,
  DEFAULT_CLIENT_OPTIONS,
  PRESET_TEAM_MEMBERS,
  getActiveTeamMembers,
  STANDARD_INSTRUMENT_CATALOG,
  INITIAL_EMS_GATEWAY_HARDWARE_ROWS,
  INITIAL_EMS_ELECTRICAL_HARDWARE_ROWS,
  INITIAL_EMS_MANPOWER_ROWS,
  INITIAL_EMS_PLATFORM_ROWS,
  INITIAL_EMS_RECURRING_ROWS,
  INITIAL_WATER_MANAGEMENT_GATEWAY_HARDWARE_ROWS,
  INITIAL_WATER_MANAGEMENT_ELECTRICAL_HARDWARE_ROWS,
  INITIAL_WATER_MANAGEMENT_PLATFORM_ROWS,
  INITIAL_WATER_MANAGEMENT_RECURRING_ROWS,
  INITIAL_WELDING_HARDWARE_ROWS,
  INITIAL_WELDING_SOFTWARE_ROWS,
  INITIAL_WELDING_CLOUD_ROWS,
  INITIAL_WELDING_INSTALLATION_ROWS,
  INITIAL_DIGIWELD_SOFTWARE_ROWS,
  INITIAL_DIGIWELD_CLOUD_ROWS,
  INITIAL_IOT_CONTROLS_HARDWARE_ROWS,
  INITIAL_IOT_CONTROLS_MANDAYS_ROWS,
  INITIAL_IOT_CONTROLS_TRAVEL_ROWS,
  INITIAL_IOT_CONTROLS_OPEX_ROWS,
  INITIAL_IOT_CONTROLS_ROI_STATE,
  INITIAL_CPM_HARDWARE_ROWS,
  INITIAL_CPM_ELECTRICAL_ROWS,
  INITIAL_CPM_COMMISSIONING_MANPOWER_ROWS,
  INITIAL_CPM_INSTALLATION_ROWS,
  INITIAL_CPM_INSTALLATION_MANPOWER_ROWS,
  INITIAL_CPM_CLOUD_ROWS,
  DEFAULT_SITE_OPTIONS,
  DEFAULT_SITE_LOCATIONS,
  SiteLocation,
  getSiteDistanceKm,
  addCustomSiteDistance,
  ENERGY_AUDIT_SUB_SERVICES,
  AUTOMATION_SUB_SERVICES,
  PROJECTS_SUB_SERVICES,
  IOT_SERVICES_SUB_SERVICES,
  CHILLER_MANAGEMENT_SUB_SERVICES,
  WELDING_IOT_SUB_SERVICES,
  HARDWARE_SUB_SERVICES,
  calcPriceFromCost,
  roundToHundred,
  ManpowerRow,
  InstrumentRow,
  ExtraExpenseRow,
  EmsHardwareRow,
  EmsPlatformRow,
  EmsRecurringRow,
  WeldingHardwareRow,
  WeldingSoftwareRow,
  WeldingCloudRow,
  WeldingInstallationRow,
  IotControlsHardwareRow,
  IotControlsMandaysRow,
  IotControlsTravelRow,
  IotControlsOpexRow,
  IotControlsRoiState,
  CpmHardwareRow,
  CpmCloudRow,
} from '@/components/costing';

function CostingSheetContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const subServiceParam = searchParams.get('subService');

  // Query to fetch edit data
  const { data: editSheet } = useQuery({
    queryKey: ['edit-sheet-data', editId, subServiceParam],
    queryFn: async () => {
      if (!editId) return null;
      if (subServiceParam === 'Air Audit') return costingApi.airAudit.getSheets().then((list: any[]) => list.find((s: any) => s.id === editId));
      if (subServiceParam === 'Energy Audit') return costingApi.energyAudit.getSheets().then((list: any[]) => list.find((s: any) => s.id === editId));
      if (subServiceParam === 'Air Audit Rectification') return costingApi.airAuditRectification.getSheets().then((list: any[]) => list.find((s: any) => s.id === editId));
      return costingApi.getSheetById(editId);
    },
    enabled: !!editId,
  });

  // Fetch Registered Clients
  const { data: dbClients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const clientOptions = Array.from(
    new Set([
      ...dbClients.map((c) => c.name),
      ...DEFAULT_CLIENT_OPTIONS,
    ])
  );

  // Fetch Services & Projects
  const { data: dbServices = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.getAll(),
  });

  // Dynamic Subservice Mapping
  const dynamicProjectsSubServices = useMemo(() => {
    const apiProjects = dbServices
      .filter((s) => {
        const cat = (s.category || '').toLowerCase();
        const nm = (s.name || '').toLowerCase();
        return cat.includes('project') || ['optibyte', 'digiweld', 'tec byte', 'fix byte', 'compass'].includes(nm);
      })
      .map((s) => s.name);
    return Array.from(new Set([...apiProjects, ...PROJECTS_SUB_SERVICES])).filter(
      (nm) => !['custom', 'custom project'].includes(nm.toLowerCase())
    );
  }, [dbServices]);

  const dynamicEnergyAuditSubServices = useMemo(() => {
    const excludedAudits = ['air audit', 'air audit rectification', 'flowmeter', 'flow meter', 'custom'];
    const apiAudits = dbServices
      .filter((s) => (s.category || '').toLowerCase().includes('audit'))
      .map((s) => s.name);
    return Array.from(new Set([...apiAudits, ...ENERGY_AUDIT_SUB_SERVICES])).filter(
      (nm) => !excludedAudits.includes(nm.toLowerCase())
    );
  }, [dbServices]);

  const dynamicIotServicesSubServices = useMemo(() => {
    return IOT_SERVICES_SUB_SERVICES;
  }, []);

  const dynamicHardwareSubServices = useMemo(() => {
    return HARDWARE_SUB_SERVICES;
  }, []);

  const dynamicWeldingIotSubServices = useMemo(() => {
    return WELDING_IOT_SUB_SERVICES;
  }, []);

  // Service Scope State
  const [mainCategoryService, setMainCategoryService] = useState<string>('Energy Audit Services');
  const [customCategoryText, setCustomCategoryText] = useState<string>('');
  const [subServiceOption, setSubServiceOption] = useState<string>('Compressor air leakage audit');
  const [customSubServiceText, setCustomSubServiceText] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [customProjectText, setCustomProjectText] = useState<string>('');

  const activeCategoryName =
    mainCategoryService === 'Custom' ? customCategoryText || 'Custom Service' : mainCategoryService;
  const activeSubServiceName =
    subServiceOption === 'Custom' ? customSubServiceText || 'Custom Scope' : subServiceOption;
  const activeProjectName =
    selectedProject === 'Custom Project' ? customProjectText || 'Custom Project' : selectedProject;

  const activeServiceScope = useMemo(() => {
    return mainCategoryService === 'Custom' && subServiceOption === 'Custom'
      ? `${activeCategoryName} - ${activeSubServiceName}`
      : mainCategoryService === 'Custom'
        ? activeCategoryName
        : subServiceOption === 'Custom'
          ? `${activeCategoryName} - ${activeSubServiceName}`
          : `${mainCategoryService} - ${activeSubServiceName}`;
  }, [mainCategoryService, subServiceOption, activeCategoryName, activeSubServiceName]);

  const activeFullServiceName = useMemo(() => {
    if (activeProjectName) return `${activeServiceScope} | Project: ${activeProjectName}`;
    return activeServiceScope;
  }, [activeServiceScope, activeProjectName]);

  // Model Selector Booleans
  const isWeldingIotActive = useMemo(() => {
    const subLower = (activeSubServiceName || '').toLowerCase();
    const catLower = (activeCategoryName || '').toLowerCase();
    if (subLower.includes('weld data digitalized') || subLower.includes('weld data')) {
      return false;
    }
    return subLower.includes('welding') || catLower.includes('welding');
  }, [activeSubServiceName, activeCategoryName]);

  const isIotControlsActive = useMemo(() => {
    const subLower = (activeSubServiceName || '').toLowerCase();
    const catLower = (activeCategoryName || '').toLowerCase();
    return (
      (catLower === 'hardware' || subLower === 'hardware costing' || subLower === 'hardware') &&
      !isWeldingIotActive
    );
  }, [activeSubServiceName, activeCategoryName, isWeldingIotActive]);

  const isWaterManagementActive = useMemo(() => {
    const subLower = (activeSubServiceName || '').toLowerCase();
    const catLower = (activeCategoryName || '').toLowerCase();
    return subLower.includes('water') || catLower.includes('water');
  }, [activeSubServiceName, activeCategoryName]);

  const isCpmActive = useMemo(() => {
    const subLower = (activeSubServiceName || '').toLowerCase();
    const catLower = (activeCategoryName || '').toLowerCase();
    if (catLower === 'automation' || subLower === 'compressed air automation' || subLower === 'water automation') {
      return false;
    }
    return (
      catLower.includes('chiller') ||
      subLower.includes('cpm') ||
      subLower.includes('chiller plant') ||
      subLower.includes('chiller management') ||
      subLower.includes('chiller automation')
    );
  }, [activeSubServiceName, activeCategoryName]);

  const isEmsActive = useMemo(() => {
    const subLower = (activeSubServiceName || '').toLowerCase();
    const catLower = (activeCategoryName || '').toLowerCase();
    if (subLower.includes('weld data digitalized') || subLower.includes('weld data')) {
      return true;
    }
    return (
      (catLower.includes('iot') ||
        catLower.includes('control') ||
        catLower.includes('energy management') ||
        catLower.includes('automation') ||
        catLower.includes('water') ||
        subLower.includes('ems') ||
        subLower.includes('water') ||
        subLower.includes('optibyte') ||
        subLower.includes('compressed air automation') ||
        subLower.includes('compressed air monitoring') ||
        subLower.includes('water automation') ||
        subLower.includes('energy management') ||
        subLower.includes('iot & control') ||
        subLower.includes('iot controls')) &&
      !isWeldingIotActive &&
      !isIotControlsActive &&
      !isCpmActive
    );
  }, [activeSubServiceName, activeCategoryName, isWeldingIotActive, isIotControlsActive, isCpmActive]);

  // Standard Audit State
  const [clientName, setClientName] = useState<string>('Apollo Tyres Ltd');
  const selectedClientId = useMemo(() => {
    return dbClients.find((c) => c.name === clientName)?.id;
  }, [dbClients, clientName]);
  const [stationType, setStationType] = useState<'Local Station' | 'Outstation' | 'Both (Local & Outstation)'>('Local Station');
  const [outstationStartLocation, setOutstationStartLocation] = useState<string>('Chennai');
  const [outstationEndLocation, setOutstationEndLocation] = useState<string>('Site Location');
  const [outstationDistanceKms, setOutstationDistanceKms] = useState<number>(0);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [customSiteLocations, setCustomSiteLocations] = useState<SiteLocation[]>([]);
  const [showAddCustomSite, setShowAddCustomSite] = useState<boolean>(false);
  const [customSiteNameInput, setCustomSiteNameInput] = useState<string>('');
  const [customSiteKmInput, setCustomSiteKmInput] = useState<string>('');
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);
  const siteDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close site dropdown when clicking outside
  useEffect(() => {
    if (!showSiteDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (siteDropdownRef.current && siteDropdownRef.current.contains(target)) {
        return;
      }
      if (target.closest && target.closest('[data-site-dropdown="true"]')) {
        return;
      }
      setShowSiteDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSiteDropdown]);

  const [manpowerRows, setManpowerRows] = useState<ManpowerRow[]>([
    { id: 'm1', name: 'Gowtham', roleLevel: 'SENIOR_ENERGY', foodRatePerDay: 600, siteWorkCost: 6000, reportWorkCost: 4200, siteWorkingDays: 0, reportWorkingDays: 0 },
  ]);

  const [instrumentRows, setInstrumentRows] = useState<InstrumentRow[]>([
    { id: 'i1', name: 'Power Logger', rentalCost: 3500, sets: 0, siteWorkingDays: 0 },
    { id: 'i2', name: 'Ultrasonic flow meter', rentalCost: 7000, sets: 0, siteWorkingDays: 0 },
    { id: 'i3', name: 'Aquastic Ultrasonic leakage detector', rentalCost: 4000, sets: 0, siteWorkingDays: 0 },
    { id: 'i4', name: 'Air Flow Meter', rentalCost: 4500, sets: 0, siteWorkingDays: 0 },
    { id: 'i5', name: 'Thermal Camera', rentalCost: 1000, sets: 0, siteWorkingDays: 0 },
    { id: 'i6', name: 'Digital Clamp Meter', rentalCost: 1000, sets: 0, siteWorkingDays: 0 },
    { id: 'i7', name: 'Earth Meggar', rentalCost: 1000, sets: 0, siteWorkingDays: 0 },
    { id: 'i8', name: 'Lux Meter', rentalCost: 500, sets: 0, siteWorkingDays: 0 },
    { id: 'i9', name: 'Thermometer', rentalCost: 500, sets: 0, siteWorkingDays: 0 },
    { id: 'i10', name: 'Temperature data logger', rentalCost: 500, sets: 0, siteWorkingDays: 0 },
    { id: 'i11', name: 'Anemometer', rentalCost: 500, sets: 0, siteWorkingDays: 0 },
    { id: 'i12', name: 'Differential Manometer', rentalCost: 1000, sets: 0, siteWorkingDays: 0 },
    { id: 'i13', name: 'Flue Gas analyser', rentalCost: 5000, sets: 0, siteWorkingDays: 0 },
    { id: 'i14', name: 'Others / Custom Instrument', rentalCost: 1000, sets: 0, siteWorkingDays: 0 },
  ]);

  const [insideChennaiDistanceKms, setInsideChennaiDistanceKms] = useState<number>(0);
  const [insideChennaiRatePerKm, setInsideChennaiRatePerKm] = useState<number>(5);
  const [manualInsideChennaiDays, setManualInsideChennaiDays] = useState<number | null>(null);
  const [manualInsideChennaiOverride, setManualInsideChennaiOverride] = useState<number | null>(null);

  const [outsideChennaiBusCost, setOutsideChennaiBusCost] = useState<number>(0);
  const [outsideChennaiCabCost, setOutsideChennaiCabCost] = useState<number>(0);
  const [outsideChennaiTrainCost, setOutsideChennaiTrainCost] = useState<number>(0);
  const [outsideChennaiFlightCost, setOutsideChennaiFlightCost] = useState<number>(0);
  const [manualOutsideChennaiOverride, setManualOutsideChennaiOverride] = useState<number | null>(null);

  const [selectedAccommodationTier, setSelectedAccommodationTier] = useState<number>(1500);
  const [isCustomAccommodationRate, setIsCustomAccommodationRate] = useState<boolean>(false);
  const [customAccommodationRate, setCustomAccommodationRate] = useState<number>(1500);
  const [manualAccommodationDays, setManualAccommodationDays] = useState<number | null>(null);
  const [accommodationRooms, setAccommodationRooms] = useState<number>(0);
  const [manualAccommodationOverride, setManualAccommodationOverride] = useState<number | null>(null);

  const [juniorFoodRate, setJuniorFoodRate] = useState<number>(400);
  const [manualJuniorDays, setManualJuniorDays] = useState<number | null>(null);
  const [manualJuniorFoodOverride, setManualJuniorFoodOverride] = useState<number | null>(null);

  const [seniorFoodRate, setSeniorFoodRate] = useState<number>(600);
  const [manualSeniorDays, setManualSeniorDays] = useState<number | null>(null);
  const [manualSeniorFoodOverride, setManualSeniorFoodOverride] = useState<number | null>(null);

  const [iotFoodRate, setIotFoodRate] = useState<number>(400);
  const [manualIotDays, setManualIotDays] = useState<number | null>(null);
  const [manualIotFoodOverride, setManualIotFoodOverride] = useState<number | null>(null);

  const [traineeFoodRate, setTraineeFoodRate] = useState<number>(300);
  const [manualTraineeDays, setManualTraineeDays] = useState<number | null>(null);
  const [manualTraineeFoodOverride, setManualTraineeFoodOverride] = useState<number | null>(null);

  const [customFoodRate, setCustomFoodRate] = useState<number>(400);
  const [manualCustomDays, setManualCustomDays] = useState<number | null>(null);
  const [manualCustomFoodOverride, setManualCustomFoodOverride] = useState<number | null>(null);

  const [manualManpowerOverride, setManualManpowerOverride] = useState<number | null>(null);

  const [extraExpenses, setExtraExpenses] = useState<ExtraExpenseRow[]>([]);
  const [profitPct, setProfitPct] = useState<number>(40);
  const [bufferPct, setBufferPct] = useState<number>(10);
  const [negotiationMarginPct, setNegotiationMarginPct] = useState<number>(20);
  const [roundingNearest, setRoundingNearest] = useState<number>(100);

  // EMS Specific State
  const [emsGatewayHardwareRows, setEmsGatewayHardwareRows] = useState<EmsHardwareRow[]>(INITIAL_EMS_GATEWAY_HARDWARE_ROWS);
  const [emsElectricalHardwareRows, setEmsElectricalHardwareRows] = useState<EmsHardwareRow[]>(INITIAL_EMS_ELECTRICAL_HARDWARE_ROWS);
  const [emsManpowerRows, setEmsManpowerRows] = useState<ManpowerRow[]>(INITIAL_EMS_MANPOWER_ROWS);
  const [emsPlatformRows, setEmsPlatformRows] = useState<EmsPlatformRow[]>(INITIAL_EMS_PLATFORM_ROWS);
  const [emsRecurringRows, setEmsRecurringRows] = useState<EmsRecurringRow[]>(INITIAL_EMS_RECURRING_ROWS);

  // Welding IoT Specific State
  const [weldingHardwareRows, setWeldingHardwareRows] = useState<WeldingHardwareRow[]>(INITIAL_WELDING_HARDWARE_ROWS);
  const [weldingSoftwareRows, setWeldingSoftwareRows] = useState<WeldingSoftwareRow[]>(INITIAL_WELDING_SOFTWARE_ROWS);
  const [weldingCloudRows, setWeldingCloudRows] = useState<WeldingCloudRow[]>(INITIAL_WELDING_CLOUD_ROWS);
  const [weldingInstallationRows, setWeldingInstallationRows] = useState<WeldingInstallationRow[]>(INITIAL_WELDING_INSTALLATION_ROWS);

  // IoT Controls Specific State
  const [iotControlsHardwareRows, setIotControlsHardwareRows] = useState<IotControlsHardwareRow[]>(INITIAL_IOT_CONTROLS_HARDWARE_ROWS);
  const [iotControlsMandaysRows, setIotControlsMandaysRows] = useState<IotControlsMandaysRow[]>(INITIAL_IOT_CONTROLS_MANDAYS_ROWS);
  const [iotControlsTravelRows, setIotControlsTravelRows] = useState<IotControlsTravelRow[]>(INITIAL_IOT_CONTROLS_TRAVEL_ROWS);
  const [iotControlsOpexRows, setIotControlsOpexRows] = useState<IotControlsOpexRow[]>(INITIAL_IOT_CONTROLS_OPEX_ROWS);
  const [iotControlsRoiState, setIotControlsRoiState] = useState<IotControlsRoiState>(INITIAL_IOT_CONTROLS_ROI_STATE);

  // Chiller Plant Management (CPM) Specific State
  const [cpmHardwareRows, setCpmHardwareRows] = useState<CpmHardwareRow[]>(INITIAL_CPM_HARDWARE_ROWS);
  const [cpmElectricalRows, setCpmElectricalRows] = useState<CpmHardwareRow[]>(INITIAL_CPM_ELECTRICAL_ROWS);
  const [cpmCommissioningManpowerRows, setCpmCommissioningManpowerRows] = useState<ManpowerRow[]>(INITIAL_CPM_COMMISSIONING_MANPOWER_ROWS);
  const [cpmInstallationRows, setCpmInstallationRows] = useState<CpmHardwareRow[]>(INITIAL_CPM_INSTALLATION_ROWS);
  const [cpmInstallationManpowerRows, setCpmInstallationManpowerRows] = useState<ManpowerRow[]>(INITIAL_CPM_INSTALLATION_MANPOWER_ROWS);
  const [cpmCloudRows, setCpmCloudRows] = useState<CpmCloudRow[]>(INITIAL_CPM_CLOUD_ROWS);

  // Helper row handlers
  const updateManpowerRow = (id: string, field: keyof ManpowerRow, val: any) => {
    setManpowerRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === 'roleLevel') {
          const newRole = val as ManpowerRow['roleLevel'];
          if (newRole === 'SENIOR_ENERGY') {
            return { ...r, roleLevel: newRole, siteWorkCost: 6000, reportWorkCost: 4200, foodRatePerDay: 600 };
          } else if (newRole === 'JUNIOR_ENERGY') {
            return { ...r, roleLevel: newRole, siteWorkCost: 3000, reportWorkCost: 2300, foodRatePerDay: 400 };
          } else if (newRole === 'IOT_ENGINEER') {
            return { ...r, roleLevel: newRole, siteWorkCost: 3500, reportWorkCost: 0, foodRatePerDay: 500 };
          } else if (newRole === 'TRAINEE_ENERGY') {
            return { ...r, roleLevel: newRole, siteWorkCost: 1500, reportWorkCost: 0, foodRatePerDay: 300 };
          }
          return { ...r, roleLevel: newRole };
        }
        return { ...r, [field]: val };
      })
    );
  };
  const addManpowerRow = (roleLevel: ManpowerRow['roleLevel'] = 'JUNIOR_ENERGY', presetName?: string) => {
    const preset = presetName ? getActiveTeamMembers().find((p) => p.name === presetName) : null;
    const newRow: ManpowerRow = {
      id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: preset ? preset.name : roleLevel === 'SENIOR_ENERGY' ? 'Senior Engineer' : 'Junior Engineer',
      roleLevel: preset ? preset.roleLevel : roleLevel,
      foodRatePerDay: preset ? preset.foodRatePerDay : roleLevel === 'SENIOR_ENERGY' ? 600 : 400,
      siteWorkCost: preset ? preset.siteWorkCost : roleLevel === 'SENIOR_ENERGY' ? 6000 : 3000,
      reportWorkCost: preset ? preset.reportWorkCost : roleLevel === 'SENIOR_ENERGY' ? 4200 : 2300,
      siteWorkingDays: 0,
      reportWorkingDays: 0,
    };
    setManpowerRows((prev) => [...prev, newRow]);
  };
  const removeManpowerRow = (id: string) => {
    setManpowerRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateInstrumentRow = (id: string, field: keyof InstrumentRow, val: any) => {
    setInstrumentRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };
  const addInstrumentRow = (instrumentName?: string) => {
    const catalogItem = instrumentName ? STANDARD_INSTRUMENT_CATALOG.find((c) => c.name === instrumentName) : null;
    const newRow: InstrumentRow = {
      id: `i_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: catalogItem ? catalogItem.name : 'Custom Instrument',
      rentalCost: catalogItem ? catalogItem.rentalCost : 1000,
      sets: 0,
      siteWorkingDays: 0,
    };
    setInstrumentRows((prev) => [...prev, newRow]);
  };
  const removeInstrumentRow = (id: string) => {
    setInstrumentRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateExtraExpense = (id: string, field: keyof ExtraExpenseRow, val: any) => {
    setExtraExpenses((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };
  const addExtraExpense = (category: ExtraExpenseRow['category'] = 'CUSTOM') => {
    const newRow: ExtraExpenseRow = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      category,
      description: category === 'FOOD' ? 'Extra Meal Allowance' : category === 'TRAVEL' ? 'Extra Conveyance / Cab' : category === 'ACCOMMODATION' ? 'Extra Night Stay' : 'Site Consumables',
      rate: category === 'FOOD' ? 500 : category === 'TRAVEL' ? 2000 : 1500,
      qty: 0,
      days: 0,
    };
    setExtraExpenses((prev) => [...prev, newRow]);
  };
  const removeExtraExpense = (id: string) => {
    setExtraExpenses((prev) => prev.filter((r) => r.id !== id));
  };

  // EMS Row Handlers
  const updateEmsGatewayHardwareRow = (id: string, field: keyof EmsHardwareRow, val: any) => {
    setEmsGatewayHardwareRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };
  const addEmsGatewayHardwareRow = (preset?: Partial<EmsHardwareRow>) => {
    const nextCode = `1${String.fromCharCode(97 + emsGatewayHardwareRows.length)}`;
    setEmsGatewayHardwareRows((prev) => [
      ...prev,
      {
        id: `ems_h1_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        code: nextCode,
        category: preset?.category || 'Sustainabyte Edge IoT Gateway Hardware',
        description: preset?.description || 'New Gateway Component',
        qty: preset?.qty ?? 0,
        uom: preset?.uom || 'Nos',
        unitCost: preset?.unitCost ?? 0,
        marginPct: preset?.marginPct ?? 40,
      },
    ]);
  };
  const removeEmsGatewayHardwareRow = (id: string) => {
    setEmsGatewayHardwareRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateEmsElectricalHardwareRow = (id: string, field: keyof EmsHardwareRow, val: any) => {
    setEmsElectricalHardwareRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };
  const addEmsElectricalHardwareRow = (preset?: Partial<EmsHardwareRow>) => {
    const nextCode = `2${String.fromCharCode(97 + emsElectricalHardwareRows.length)}`;
    setEmsElectricalHardwareRows((prev) => [
      ...prev,
      {
        id: `ems_h2_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        code: nextCode,
        category: preset?.category || 'Electrical Hardware',
        description: preset?.description || 'New Electrical Accessory',
        qty: preset?.qty ?? 0,
        uom: preset?.uom || 'Nos',
        unitCost: preset?.unitCost ?? 0,
        marginPct: preset?.marginPct ?? 40,
      },
    ]);
  };
  const removeEmsElectricalHardwareRow = (id: string) => {
    setEmsElectricalHardwareRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateEmsManpowerRow = (id: string, field: keyof ManpowerRow, val: any) => {
    setEmsManpowerRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === 'roleLevel') {
          const newRole = val as ManpowerRow['roleLevel'];
          if (newRole === 'SENIOR_ENERGY') {
            return { ...r, roleLevel: newRole, siteWorkCost: 6000, reportWorkCost: 0, foodRatePerDay: 600 };
          } else if (newRole === 'JUNIOR_ENERGY') {
            return { ...r, roleLevel: newRole, siteWorkCost: 3000, reportWorkCost: 0, foodRatePerDay: 400 };
          } else if (newRole === 'IOT_ENGINEER') {
            return { ...r, roleLevel: newRole, siteWorkCost: 3500, reportWorkCost: 0, foodRatePerDay: 500 };
          } else if (newRole === 'TRAINEE_ENERGY') {
            return { ...r, roleLevel: newRole, siteWorkCost: 1500, reportWorkCost: 0, foodRatePerDay: 300 };
          }
          return { ...r, roleLevel: newRole };
        }
        return { ...r, [field]: val };
      })
    );
  };
  const addEmsManpowerRow = (roleLevel: ManpowerRow['roleLevel'] = 'IOT_ENGINEER', presetName?: string) => {
    const preset = presetName ? getActiveTeamMembers().find((p) => p.name === presetName) : null;
    const newRow: ManpowerRow = {
      id: `ems_m_${Date.now()}`,
      name: preset ? preset.name : roleLevel === 'SENIOR_ENERGY' ? 'Senior Engineer' : roleLevel === 'JUNIOR_ENERGY' ? 'Junior Engineer' : 'Engineering Specialist',
      roleLevel: preset ? preset.roleLevel : roleLevel,
      foodRatePerDay: preset ? preset.foodRatePerDay : roleLevel === 'SENIOR_ENERGY' ? 600 : roleLevel === 'JUNIOR_ENERGY' ? 400 : 500,
      siteWorkCost: preset ? preset.siteWorkCost : roleLevel === 'SENIOR_ENERGY' ? 6000 : roleLevel === 'JUNIOR_ENERGY' ? 3000 : 3500,
      reportWorkCost: preset ? preset.reportWorkCost : 0,
      siteWorkingDays: 0,
      reportWorkingDays: 0,
    };
    setEmsManpowerRows((prev) => [...prev, newRow]);
  };
  const removeEmsManpowerRow = (id: string) => {
    setEmsManpowerRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateEmsPlatformRow = (id: string, field: keyof EmsPlatformRow, val: any) => {
    setEmsPlatformRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };
  const addEmsPlatformRow = () => {
    setEmsPlatformRows((prev) => [
      ...prev,
      { id: `ems_p_${Date.now()}`, description: 'New Platform Setup Deliverable', qty: 0, uom: 'Nodes', unitCost: 1000, marginPct: 40 },
    ]);
  };
  const removeEmsPlatformRow = (id: string) => {
    setEmsPlatformRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateEmsRecurringRow = (id: string, field: keyof EmsRecurringRow, val: any) => {
    setEmsRecurringRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };
  const addEmsRecurringRow = () => {
    setEmsRecurringRows((prev) => [
      ...prev,
      { id: `ems_r_${Date.now()}`, code: `1${String.fromCharCode(97 + emsRecurringRows.length)}`, description: 'New Recurring Cloud Feature', qty: 0, uom: 'Nodes', unitCostPerMonth: 0, marginPct: 40 },
    ]);
  };
  const removeEmsRecurringRow = (id: string) => {
    setEmsRecurringRows((prev) => prev.filter((r) => r.id !== id));
  };

  // Welding IoT Row Handlers
  const updateWeldingHardwareRow = (id: string, field: keyof WeldingHardwareRow, val: any) => {
    setWeldingHardwareRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === 'unitCost') {
          const cost = Number(val || 0);
          const margin = r.marginPct !== undefined ? r.marginPct : profitPct || 40;
          const unitPrice = Math.round(calcPriceFromCost(cost, margin));
          return { ...r, unitCost: cost, unitPrice };
        }
        if (field === 'marginPct') {
          const margin = Number(val || 0);
          const cost = Number(r.unitCost || 0);
          const unitPrice = Math.round(calcPriceFromCost(cost, margin));
          return { ...r, marginPct: margin, unitPrice };
        }
        if (field === 'unitPrice') {
          return { ...r, unitPrice: Number(val || 0) };
        }
        return { ...r, [field]: val };
      })
    );
  };
  const addWeldingHardwareRow = () => {
    setWeldingHardwareRows((prev) => [
      ...prev,
      { id: `wh_${Date.now()}`, slNo: weldingHardwareRows.length + 1, componentName: 'New Hardware Component', qty: 0, unitCost: 0, unitPrice: 0 },
    ]);
  };
  const removeWeldingHardwareRow = (id: string) => {
    setWeldingHardwareRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateWeldingSoftwareRow = (id: string, field: keyof WeldingSoftwareRow, val: any) => {
    setWeldingSoftwareRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === 'unitCost') {
          const unitCost = Number(val || 0);
          const margin = r.marginPct !== undefined ? r.marginPct : profitPct || 40;
          const unitPrice = Math.round(calcPriceFromCost(unitCost, margin));
          const qty = r.qty !== undefined ? Number(r.qty) : 1;
          return { ...r, unitCost, unitPrice, price: Math.round(qty * unitPrice) };
        }
        if (field === 'marginPct') {
          const margin = Number(val || 0);
          const unitCost = r.unitCost !== undefined ? Number(r.unitCost) : Math.round(Number(r.unitPrice || 0) * 0.6);
          const unitPrice = Math.round(calcPriceFromCost(unitCost, margin));
          const qty = r.qty !== undefined ? Number(r.qty) : 1;
          return { ...r, marginPct: margin, unitCost, unitPrice, price: Math.round(qty * unitPrice) };
        }
        if (field === 'qty') {
          const qty = isNaN(Number(val)) || val === '' ? 0 : Number(val);
          const unitPrice = r.unitPrice !== undefined ? Number(r.unitPrice) : (r.unitCost ? Math.round(calcPriceFromCost(r.unitCost, r.marginPct || 40)) : 20000);
          return { ...r, qty, unitPrice, price: Math.round(qty * unitPrice) };
        }
        if (field === 'unitPrice') {
          const unitPrice = Number(val || 0);
          const qty = r.qty !== undefined ? Number(r.qty) : 0;
          return { ...r, unitPrice, price: Math.round(qty * unitPrice) };
        }
        if (field === 'price') {
          return { ...r, price: Number(val || 0) };
        }
        return { ...r, [field]: val };
      })
    );
  };
  const addWeldingSoftwareRow = () => {
    setWeldingSoftwareRows((prev) => [
      ...prev,
      { id: `ws_${Date.now()}`, item: 'Custom Software Module', description: 'Custom logic & algorithm development', qty: 0, uom: 'Units', unitPrice: 20000, price: 0 },
    ]);
  };
  const removeWeldingSoftwareRow = (id: string) => {
    setWeldingSoftwareRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateWeldingCloudRow = (id: string, field: keyof WeldingCloudRow, val: any) => {
    setWeldingCloudRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === 'qty') {
          const qty = isNaN(Number(val)) || val === '' ? 0 : Number(val);
          const unitMonthlyPrice = r.unitMonthlyPrice !== undefined ? Number(r.unitMonthlyPrice) : (r.monthlyPrice && r.qty ? Math.round(r.monthlyPrice / r.qty) : (r.monthlyPrice || 1000));
          const unitMonthlyCost = r.unitMonthlyCost !== undefined ? Number(r.unitMonthlyCost) : Math.round(unitMonthlyPrice * 0.6);
          const monthlyCost = Math.round(qty * unitMonthlyCost);
          const monthlyPrice = Math.round(qty * unitMonthlyPrice);
          const yearlyPrice = monthlyPrice * 12;
          return { ...r, qty, unitMonthlyPrice, unitMonthlyCost, monthlyCost, monthlyPrice, yearlyPrice };
        }
        if (field === 'unitMonthlyPrice') {
          const unitMonthlyPrice = Number(val || 0);
          const unitMonthlyCost = r.unitMonthlyCost !== undefined ? Number(r.unitMonthlyCost) : Math.round(unitMonthlyPrice * 0.6);
          const qty = r.qty !== undefined ? Number(r.qty) : 0;
          const monthlyCost = Math.round(qty * unitMonthlyCost);
          const monthlyPrice = Math.round(qty * unitMonthlyPrice);
          const yearlyPrice = monthlyPrice * 12;
          return { ...r, unitMonthlyPrice, unitMonthlyCost, monthlyCost, monthlyPrice, yearlyPrice };
        }
        if (field === 'unitMonthlyCost') {
          const unitMonthlyCost = Number(val || 0);
          const margin = r.marginPct !== undefined ? r.marginPct : profitPct || 40;
          const unitMonthlyPrice = Math.round(calcPriceFromCost(unitMonthlyCost, margin));
          const qty = r.qty !== undefined ? Number(r.qty) : 0;
          const monthlyCost = Math.round(qty * unitMonthlyCost);
          const monthlyPrice = Math.round(qty * unitMonthlyPrice);
          const yearlyPrice = monthlyPrice * 12;
          return { ...r, unitMonthlyCost, unitMonthlyPrice, monthlyCost, monthlyPrice, yearlyPrice };
        }
        if (field === 'monthlyCost') {
          const cost = Number(val || 0);
          const margin = r.marginPct !== undefined ? r.marginPct : profitPct || 40;
          const monthlyPrice = Math.round(calcPriceFromCost(cost, margin));
          return { ...r, monthlyCost: cost, monthlyPrice, yearlyPrice: monthlyPrice * 12 };
        }
        if (field === 'marginPct') {
          const margin = Number(val || 0);
          const unitCost = r.unitMonthlyCost !== undefined ? r.unitMonthlyCost : Math.round(Number(r.unitMonthlyPrice || 0) * 0.6);
          const unitMonthlyPrice = Math.round(calcPriceFromCost(unitCost, margin));
          const qty = r.qty !== undefined ? Number(r.qty) : 0;
          const monthlyCost = Math.round(qty * unitCost);
          const monthlyPrice = Math.round(qty * unitMonthlyPrice);
          return { ...r, marginPct: margin, unitMonthlyCost: unitCost, unitMonthlyPrice, monthlyCost, monthlyPrice, yearlyPrice: monthlyPrice * 12 };
        }
        if (field === 'monthlyPrice') {
          const monthlyPrice = Number(val || 0);
          const cost = r.monthlyCost !== undefined ? r.monthlyCost : Math.round(monthlyPrice * 0.6);
          const marginPct = monthlyPrice > 0 && cost > 0 && monthlyPrice >= cost ? Math.round((1 - cost / monthlyPrice) * 100) : (r.marginPct ?? 40);
          return { ...r, monthlyPrice, monthlyCost: cost, marginPct, yearlyPrice: monthlyPrice * 12 };
        }
        if (field === 'yearlyPrice') {
          const yearlyPrice = Number(val || 0);
          const monthlyPrice = Math.round(yearlyPrice / 12);
          const cost = r.monthlyCost !== undefined ? r.monthlyCost : Math.round(monthlyPrice * 0.6);
          const marginPct = monthlyPrice > 0 && cost > 0 && monthlyPrice >= cost ? Math.round((1 - cost / monthlyPrice) * 100) : (r.marginPct ?? 40);
          return { ...r, yearlyPrice, monthlyPrice, monthlyCost: cost, marginPct };
        }
        return { ...r, [field]: val };
      })
    );
  };
  const addWeldingCloudRow = () => {
    const unitCost = 0;
    const margin = profitPct || 40;
    const unitPrice = Math.round(calcPriceFromCost(unitCost, margin));
    setWeldingCloudRows((prev) => [
      ...prev,
      { id: `wc_${Date.now()}`, component: 'Cloud Storage / MQTT', description: 'Additional cloud analytics storage', type: 'Cloud', qty: 0, uom: 'Nos', unitMonthlyCost: unitCost, marginPct: margin, unitMonthlyPrice: unitPrice, monthlyCost: 0, monthlyPrice: 0, yearlyPrice: 0 },
    ]);
  };
  const removeWeldingCloudRow = (id: string) => {
    setWeldingCloudRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateWeldingInstallationRow = (id: string, field: keyof WeldingInstallationRow, val: any) => {
    setWeldingInstallationRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === 'qty') {
          const qty = Number(val || 0);
          const unitPrice = r.unitPrice !== undefined ? r.unitPrice : (r.price || 0);
          return { ...r, qty: val, price: Math.round(qty * unitPrice) };
        }
        if (field === 'unitCost') {
          const cost = Number(val || 0);
          const margin = r.marginPct !== undefined ? r.marginPct : profitPct || 40;
          const unitPrice = Math.round(calcPriceFromCost(cost, margin));
          const qty = r.qty !== undefined && r.qty !== null ? Number(r.qty) : 0;
          return { ...r, unitCost: cost, unitPrice, price: Math.round(qty * unitPrice) };
        }
        if (field === 'marginPct') {
          const margin = Number(val || 0);
          const cost = r.unitCost !== undefined ? r.unitCost : Math.round((r.unitPrice ?? r.price ?? 0) * 0.6);
          const unitPrice = Math.round(calcPriceFromCost(cost, margin));
          const qty = r.qty !== undefined && r.qty !== null ? Number(r.qty) : 0;
          return { ...r, marginPct: margin, unitCost: cost, unitPrice, price: Math.round(qty * unitPrice) };
        }
        if (field === 'unitPrice') {
          const unitPrice = Number(val || 0);
          const cost = r.unitCost !== undefined ? r.unitCost : Math.round(unitPrice * 0.6);
          const marginPct = unitPrice > 0 && cost > 0 && unitPrice >= cost ? Math.round((1 - cost / unitPrice) * 100) : (r.marginPct ?? 40);
          const qty = r.qty !== undefined && r.qty !== null ? Number(r.qty) : 0;
          return { ...r, unitPrice, unitCost: cost, marginPct, price: Math.round(qty * unitPrice) };
        }
        if (field === 'price') {
          const price = Number(val || 0);
          const qty = r.qty !== undefined && r.qty !== null ? Number(r.qty) : 0;
          const unitPrice = qty > 0 ? Math.round(price / qty) : price;
          return { ...r, price, unitPrice };
        }
        return { ...r, [field]: val };
      })
    );
  };
  const addWeldingInstallationRow = () => {
    const unitCost = 15000;
    const margin = profitPct || 40;
    const unitPrice = Math.round(calcPriceFromCost(unitCost, margin));
    setWeldingInstallationRows((prev) => [
      ...prev,
      { id: `wi_${Date.now()}`, item: 'Additional Site Calibration', qty: 0, uom: 'Nos', unitCost, marginPct: margin, unitPrice, price: 0 },
    ]);
  };
  const removeWeldingInstallationRow = (id: string) => {
    setWeldingInstallationRows((prev) => prev.filter((r) => r.id !== id));
  };

  const applyWeldingGlobalMargin = (margin: number) => {
    setProfitPct(margin);
    setWeldingCloudRows((prev) =>
      prev.map((r) => {
        const cost = r.monthlyCost !== undefined ? r.monthlyCost : Math.round(Number(r.monthlyPrice || 0) * 0.6);
        const monthlyPrice = Math.round(calcPriceFromCost(cost, margin));
        return { ...r, monthlyCost: cost, marginPct: margin, monthlyPrice, yearlyPrice: monthlyPrice * 12 };
      })
    );
    setWeldingInstallationRows((prev) =>
      prev.map((r) => {
        const unitCost = r.unitCost !== undefined ? r.unitCost : Math.round(Number(r.unitPrice ?? r.price ?? 0) * 0.6);
        const unitPrice = Math.round(calcPriceFromCost(unitCost, margin));
        const qty = r.qty !== undefined && r.qty !== null ? Number(r.qty) : 0;
        return { ...r, unitCost, marginPct: margin, unitPrice, price: Math.round(qty * unitPrice) };
      })
    );
    toast.success(`Applied ${margin}% margin across Cloud and Installation deliverables!`);
  };

  // IoT Controls Row Handlers
  const updateIotControlsHardwareRow = (id: string, field: keyof IotControlsHardwareRow, val: any) => {
    setIotControlsHardwareRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, [field]: val };
        if (field === 'unitCost') {
          const margin = updated.marginPct !== undefined ? updated.marginPct : 40;
          const cost = Number(val) || 0;
          updated.unitPrice = cost > 0 ? Math.round(calcPriceFromCost(cost, margin)) : 0;
        } else if (field === 'marginPct') {
          const margin = Number(val) || 0;
          const cost = Number(updated.unitCost) || 0;
          updated.unitPrice = cost > 0 ? Math.round(calcPriceFromCost(cost, margin)) : Number(updated.unitPrice || 0);
        } else if (field === 'unitPrice') {
          const price = Number(val) || 0;
          const margin = updated.marginPct !== undefined ? updated.marginPct : 40;
          if (updated.unitCost === undefined || updated.unitCost === 0) {
            updated.unitCost = Math.round(price * ((100 - margin) / 100));
          }
        }
        return updated;
      })
    );
  };
  const addIotControlsHardwareRow = () => {
    setIotControlsHardwareRows((prev) => [
      ...prev,
      {
        id: `ich_${Date.now()}`,
        slNo: `${iotControlsHardwareRows.length + 1}`,
        productDescription: 'New Controller / Sensor Component',
        quantity: 0,
        unitCost: 0,
        marginPct: 40,
        unitPrice: 0,
      },
    ]);
  };
  const removeIotControlsHardwareRow = (id: string) => {
    setIotControlsHardwareRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateIotControlsOpexRow = (id: string, field: keyof IotControlsOpexRow, val: any) => {
    setIotControlsOpexRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  };
  const addIotControlsOpexRow = () => {
    setIotControlsOpexRows((prev) => [
      ...prev,
      { id: `ico_${Date.now()}`, item: 'Additional Cloud Analytics & Support', yearlyPrice: 0, description: 'Annual server hosting, remote diagnostics & SLA monitoring' },
    ]);
  };
  const removeIotControlsOpexRow = (id: string) => {
    setIotControlsOpexRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateIotControlsRoiState = (field: keyof IotControlsRoiState, val: any) => {
    setIotControlsRoiState((prev) => ({ ...prev, [field]: val }));
  };

  // CPM Row Handlers
  const updateCpmHardwareRow = (id: string, field: keyof CpmHardwareRow, val: any) => {
    setCpmHardwareRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, [field]: val };
        }
        return r;
      })
    );
  };

  const addCpmHardwareRow = (preset?: Partial<CpmHardwareRow>) => {
    const newRow: CpmHardwareRow = {
      id: `cpm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      slNo: cpmHardwareRows.length + 1,
      brand: preset?.brand || '',
      itemDescription: preset?.itemDescription || 'New CPM Hardware Component',
      modelNo: preset?.modelNo || '',
      qty: preset?.qty ?? 0,
      uom: preset?.uom || 'Nos',
      unitCost: preset?.unitCost ?? 0,
      marginPct: preset?.marginPct ?? profitPct ?? 40,
    };
    setCpmHardwareRows((prev) => [...prev, newRow]);
  };

  const removeCpmHardwareRow = (id: string) => {
    setCpmHardwareRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateCpmElectricalRow = (id: string, field: keyof CpmHardwareRow, val: any) => {
    setCpmElectricalRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, [field]: val };
        }
        return r;
      })
    );
  };

  const addCpmElectricalRow = (preset?: Partial<CpmHardwareRow>) => {
    const newRow: CpmHardwareRow = {
      id: `cpm_e_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      slNo: 11 + cpmElectricalRows.length,
      brand: preset?.brand || 'Generic/OEM',
      itemDescription: preset?.itemDescription || 'New Electrical Consumable',
      modelNo: preset?.modelNo || '',
      qty: preset?.qty ?? 0,
      uom: preset?.uom || 'Mtr',
      unitCost: preset?.unitCost ?? 50,
      marginPct: preset?.marginPct ?? profitPct ?? 40,
    };
    setCpmElectricalRows((prev) => [...prev, newRow]);
  };

  const removeCpmElectricalRow = (id: string) => {
    setCpmElectricalRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateCpmInstallationRow = (id: string, field: keyof CpmHardwareRow, val: any) => {
    setCpmInstallationRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, [field]: val };
        }
        return r;
      })
    );
  };

  const addCpmInstallationRow = (preset?: Partial<CpmHardwareRow>) => {
    const newRow: CpmHardwareRow = {
      id: `cpm_inst_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      slNo: cpmInstallationRows.length + 1,
      brand: preset?.brand || '',
      itemDescription: preset?.itemDescription || 'New Installation Deliverable',
      modelNo: preset?.modelNo || '',
      qty: preset?.qty ?? 0,
      uom: preset?.uom || 'Job',
      unitCost: preset?.unitCost ?? 115000,
      marginPct: preset?.marginPct ?? profitPct ?? 40,
    };
    setCpmInstallationRows((prev) => [...prev, newRow]);
  };

  const removeCpmInstallationRow = (id: string) => {
    setCpmInstallationRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateCpmCommissioningManpowerRow = (id: string, field: keyof ManpowerRow, val: any) => {
    setCpmCommissioningManpowerRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === 'roleLevel') {
          const newRole = val as ManpowerRow['roleLevel'];
          if (newRole === 'SENIOR_ENERGY') {
            return { ...r, roleLevel: newRole, siteWorkCost: 80000, reportWorkCost: 0, foodRatePerDay: 600 };
          } else if (newRole === 'JUNIOR_ENERGY') {
            return { ...r, roleLevel: newRole, siteWorkCost: 3000, reportWorkCost: 0, foodRatePerDay: 400 };
          } else if (newRole === 'IOT_ENGINEER') {
            return { ...r, roleLevel: newRole, siteWorkCost: 3500, reportWorkCost: 0, foodRatePerDay: 500 };
          } else if (newRole === 'TRAINEE_ENERGY') {
            return { ...r, roleLevel: newRole, siteWorkCost: 1500, reportWorkCost: 0, foodRatePerDay: 300 };
          }
          return { ...r, roleLevel: newRole };
        }
        return { ...r, [field]: val };
      })
    );
  };

  const addCpmCommissioningManpowerRow = (roleLevel: ManpowerRow['roleLevel'] = 'SENIOR_ENERGY', presetName?: string) => {
    const preset = presetName ? getActiveTeamMembers().find((p) => p.name === presetName) : null;
    const newRow: ManpowerRow = {
      id: `cpm_comm_m_${Date.now()}`,
      name: preset ? preset.name : roleLevel === 'SENIOR_ENERGY' ? 'Vijayan' : roleLevel === 'IOT_ENGINEER' ? 'IoT Engineer' : 'Energy Engineer',
      roleLevel: preset ? preset.roleLevel : roleLevel,
      foodRatePerDay: preset ? preset.foodRatePerDay : roleLevel === 'SENIOR_ENERGY' ? 600 : 400,
      siteWorkCost: preset && preset.name === 'Vijayan' ? 80000 : preset ? preset.siteWorkCost : roleLevel === 'SENIOR_ENERGY' ? 80000 : 3000,
      reportWorkCost: 0,
      siteWorkingDays: 0,
      reportWorkingDays: 0,
    };
    setCpmCommissioningManpowerRows((prev) => [...prev, newRow]);
  };

  const removeCpmCommissioningManpowerRow = (id: string) => {
    setCpmCommissioningManpowerRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateCpmInstallationManpowerRow = (id: string, field: keyof ManpowerRow, val: any) => {
    setCpmInstallationManpowerRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === 'roleLevel') {
          const newRole = val as ManpowerRow['roleLevel'];
          if (newRole === 'SENIOR_ENERGY') {
            return { ...r, roleLevel: newRole, siteWorkCost: 6000, reportWorkCost: 0, foodRatePerDay: 600 };
          } else if (newRole === 'JUNIOR_ENERGY') {
            return { ...r, roleLevel: newRole, siteWorkCost: 2500, reportWorkCost: 0, foodRatePerDay: 400 };
          } else if (newRole === 'IOT_ENGINEER') {
            return { ...r, roleLevel: newRole, siteWorkCost: 3500, reportWorkCost: 0, foodRatePerDay: 500 };
          } else if (newRole === 'TRAINEE_ENERGY') {
            return { ...r, roleLevel: newRole, siteWorkCost: 1500, reportWorkCost: 0, foodRatePerDay: 300 };
          }
          return { ...r, roleLevel: newRole };
        }
        return { ...r, [field]: val };
      })
    );
  };

  const addCpmInstallationManpowerRow = (roleLevel: ManpowerRow['roleLevel'] = 'IOT_ENGINEER', presetName?: string) => {
    const preset = presetName ? getActiveTeamMembers().find((p) => p.name === presetName) : null;
    const newRow: ManpowerRow = {
      id: `cpm_inst_m_${Date.now()}`,
      name: preset ? preset.name : roleLevel === 'IOT_ENGINEER' ? 'Lead Installation Engineer' : roleLevel === 'JUNIOR_ENERGY' ? 'Electrical & Cabling Technician' : 'Site Technician',
      roleLevel: preset ? preset.roleLevel : roleLevel,
      foodRatePerDay: preset ? preset.foodRatePerDay : roleLevel === 'IOT_ENGINEER' ? 500 : 400,
      siteWorkCost: preset ? preset.siteWorkCost : roleLevel === 'IOT_ENGINEER' ? 3500 : 2500,
      reportWorkCost: 0,
      siteWorkingDays: 0,
      reportWorkingDays: 0,
    };
    setCpmInstallationManpowerRows((prev) => [...prev, newRow]);
  };

  const removeCpmInstallationManpowerRow = (id: string) => {
    setCpmInstallationManpowerRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateCpmCloudRow = (id: string, field: keyof CpmCloudRow, val: any) => {
    setCpmCloudRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, [field]: val };
        }
        return r;
      })
    );
  };

  const addCpmCloudRow = (preset?: Partial<CpmCloudRow>) => {
    const newRow: CpmCloudRow = {
      id: `cpm_cloud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      itemDescription: preset?.itemDescription || 'New Cloud SaaS Deliverable',
      billingCycle: preset?.billingCycle || 'Annual',
      qty: preset?.qty ?? 0,
      uom: preset?.uom || 'Year',
      unitCost: preset?.unitCost ?? 0,
      marginPct: preset?.marginPct ?? profitPct ?? 40,
    };
    setCpmCloudRows((prev) => [...prev, newRow]);
  };

  const removeCpmCloudRow = (id: string) => {
    setCpmCloudRows((prev) => prev.filter((r) => r.id !== id));
  };

  const applyCpmGlobalMargin = (marginPct: number) => {
    setCpmHardwareRows((prev) => prev.map((r) => ({ ...r, marginPct })));
    setCpmElectricalRows((prev) => prev.map((r) => ({ ...r, marginPct })));
    setCpmInstallationRows((prev) => prev.map((r) => ({ ...r, marginPct })));
    setCpmCloudRows((prev) => prev.map((r) => ({ ...r, marginPct })));
    setProfitPct(marginPct);
    toast.success(`Applied ${marginPct}% margin across CPM components & Services`);
  };

  // Calculations & Math Engines
  const activeManpowerRows = isEmsActive || isIotControlsActive || isCpmActive ? emsManpowerRows : manpowerRows;
  const maxSiteWorkingDays = useMemo(() => {
    return Math.max(...activeManpowerRows.map((r) => Number(r.siteWorkingDays || 0)), 0);
  }, [activeManpowerRows]);

  const isLocalStationActive = stationType === 'Local Station' || stationType === 'Both (Local & Outstation)';
  const isOutstationActive = stationType === 'Outstation' || stationType === 'Both (Local & Outstation)';

  const activeAccommodationRate = isCustomAccommodationRate ? customAccommodationRate : selectedAccommodationTier;
  const totalSiteMandaysComputed = useMemo(() => {
    return activeManpowerRows.reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [activeManpowerRows]);

  const activeAccommodationDays = manualAccommodationDays !== null ? manualAccommodationDays : maxSiteWorkingDays;
  const calculatedAccommodationCost = !isOutstationActive ? 0 : activeAccommodationDays * activeAccommodationRate;
  const finalAccommodationCost = !isOutstationActive ? 0 : (manualAccommodationOverride !== null ? manualAccommodationOverride : calculatedAccommodationCost);

  const juniorSiteDaysComputed = useMemo(() => {
    return activeManpowerRows
      .filter((r) => r.roleLevel === 'JUNIOR_ENERGY')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [activeManpowerRows]);

  const seniorSiteDaysComputed = useMemo(() => {
    return activeManpowerRows
      .filter((r) => r.roleLevel === 'SENIOR_ENERGY')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [activeManpowerRows]);

  const iotSiteDaysComputed = useMemo(() => {
    return activeManpowerRows
      .filter((r) => r.roleLevel === 'IOT_ENGINEER')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [activeManpowerRows]);

  const traineeSiteDaysComputed = useMemo(() => {
    return activeManpowerRows
      .filter((r) => r.roleLevel === 'TRAINEE_ENERGY')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [activeManpowerRows]);

  const customRoleSiteDaysComputed = useMemo(() => {
    return activeManpowerRows
      .filter((r) => r.roleLevel === 'CUSTOM')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [activeManpowerRows]);

  const activeJuniorDays = manualJuniorDays !== null ? manualJuniorDays : juniorSiteDaysComputed;
  const activeSeniorDays = manualSeniorDays !== null ? manualSeniorDays : seniorSiteDaysComputed;
  const activeIotDays = manualIotDays !== null ? manualIotDays : iotSiteDaysComputed;
  const activeTraineeDays = manualTraineeDays !== null ? manualTraineeDays : traineeSiteDaysComputed;
  const activeCustomDays = manualCustomDays !== null ? manualCustomDays : customRoleSiteDaysComputed;

  const finalJuniorFoodCost = manualJuniorFoodOverride !== null ? manualJuniorFoodOverride : activeJuniorDays * juniorFoodRate;
  const finalSeniorFoodCost = manualSeniorFoodOverride !== null ? manualSeniorFoodOverride : activeSeniorDays * seniorFoodRate;
  const finalIotFoodCost = manualIotFoodOverride !== null ? manualIotFoodOverride : activeIotDays * iotFoodRate;
  const finalTraineeFoodCost = manualTraineeFoodOverride !== null ? manualTraineeFoodOverride : activeTraineeDays * traineeFoodRate;
  const finalCustomFoodCost = manualCustomFoodOverride !== null ? manualCustomFoodOverride : activeCustomDays * customFoodRate;
  const totalFoodCost = finalJuniorFoodCost + finalSeniorFoodCost + finalIotFoodCost + finalTraineeFoodCost + finalCustomFoodCost;

  const activeInsideChennaiDays = manualInsideChennaiDays !== null ? manualInsideChennaiDays : (maxSiteWorkingDays || 1);
  const calculatedInsideChennaiTravel = insideChennaiDistanceKms * insideChennaiRatePerKm * activeInsideChennaiDays;
  const finalInsideChennaiTravel = !isLocalStationActive ? 0 : manualInsideChennaiOverride !== null ? manualInsideChennaiOverride : calculatedInsideChennaiTravel;

  const calculatedOutsideChennaiTravel = (outsideChennaiBusCost + outsideChennaiCabCost + outsideChennaiTrainCost + outsideChennaiFlightCost) * 2;
  const finalOutsideChennaiTravel = !isOutstationActive ? 0 : manualOutsideChennaiOverride !== null ? manualOutsideChennaiOverride : calculatedOutsideChennaiTravel;
  const totalTravelCost = finalInsideChennaiTravel + finalOutsideChennaiTravel;

  const customExpensesTotal = useMemo(() => {
    return extraExpenses.reduce((sum, e) => sum + Number(e.rate || 0) * Number(e.qty || 0) * Number(e.days || 0), 0);
  }, [extraExpenses]);

  // Standard Audit Totals
  const calculatedManWorkingCost = useMemo(() => {
    return manpowerRows.reduce(
      (sum, r) => {
        const autoCost = Number(r.siteWorkCost || 0) * Number(r.siteWorkingDays || 0) + Number(r.reportWorkCost || 0) * Number(r.reportWorkingDays || 0);
        return sum + (r.overrideCost !== undefined && r.overrideCost !== null ? Number(r.overrideCost) : autoCost);
      },
      0
    );
  }, [manpowerRows]);
  const manWorkingCost = manualManpowerOverride !== null ? manualManpowerOverride : calculatedManWorkingCost;

  const instrumentRentalCost = useMemo(() => {
    return instrumentRows.reduce((sum, r) => {
      const sets = Number(r.sets || 0);
      const days = sets > 0 ? (Number(r.siteWorkingDays || 0) > 0 ? Number(r.siteWorkingDays) : (maxSiteWorkingDays || 0)) : 0;
      return sum + Number(r.rentalCost || 0) * sets * days;
    }, 0);
  }, [instrumentRows, maxSiteWorkingDays]);

  const totalAmountForSite = manWorkingCost + instrumentRentalCost;
  const costTotal = manWorkingCost + instrumentRentalCost + totalFoodCost + totalTravelCost + finalAccommodationCost + customExpensesTotal;

  // Energy Audit Services Margin & Buffer Formulas:
  // Step 5 Itemized Deliverables & Customer Price (using roundToNearest with Math.ceil)
  const roundToNearest = (val: number, nearest: number = 100): number => {
    const step = Number(nearest) || 1;
    return Math.ceil(val / step) * step;
  };

  // Profit Margin = (Total Cost / 0.6) - Total Cost
  // Price = Total Cost + Profit Margin
  // Quote Buffer = (Total Price / 0.9) - Total Price
  // Final Quote Amount = Total Price / 0.9 (with round off)
  const isEnergyAuditCosting = activeCategoryName === 'Energy Audit Services' || (!isEmsActive && !isIotControlsActive && !isWeldingIotActive && !isCpmActive);
  const profitAmount = (profitPct === 40 || !profitPct)
    ? Math.round((costTotal / 0.6) - costTotal)
    : Math.round((costTotal / (Math.max(10, 100 - profitPct) / 100)) - costTotal);
  const basePrice = costTotal + profitAmount;
  const rawQuoteAmount = bufferPct === 10 || !bufferPct
    ? Math.round(basePrice / 0.9)
    : Math.round(basePrice / (Math.max(10, 100 - bufferPct) / 100));
  const ourQuoteAmount = isEnergyAuditCosting
    ? roundToNearest(rawQuoteAmount, roundingNearest)
    : rawQuoteAmount;

  // EMS Totals
  const emsGatewayHardwareTotalCost = useMemo(() => {
    return emsGatewayHardwareRows.reduce((sum, r) => sum + r.qty * r.unitCost, 0);
  }, [emsGatewayHardwareRows]);
  const emsGatewayHardwareTotalPrice = useMemo(() => {
    return emsGatewayHardwareRows.reduce((sum, r) => sum + Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct)), 0);
  }, [emsGatewayHardwareRows]);

  const emsElectricalHardwareTotalCost = useMemo(() => {
    return emsElectricalHardwareRows.reduce((sum, r) => sum + r.qty * r.unitCost, 0);
  }, [emsElectricalHardwareRows]);
  const emsElectricalHardwareTotalPrice = useMemo(() => {
    return emsElectricalHardwareRows.reduce((sum, r) => sum + Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct)), 0);
  }, [emsElectricalHardwareRows]);

  const emsHardwareTotalCost = emsGatewayHardwareTotalCost + emsElectricalHardwareTotalCost;
  const emsHardwareTotalPrice = emsGatewayHardwareTotalPrice + emsElectricalHardwareTotalPrice;

  const emsManpowerBaseCost = useMemo(() => {
    return emsManpowerRows.reduce((sum, r) => sum + Number(r.siteWorkCost || 0) * Number(r.siteWorkingDays || 0) + Number(r.reportWorkCost || 0) * Number(r.reportWorkingDays || 0), 0);
  }, [emsManpowerRows]);
  const emsSiteExpensesTotalCost = totalFoodCost + totalTravelCost + finalAccommodationCost + customExpensesTotal;
  const emsManpowerTotalCost = emsManpowerBaseCost + emsSiteExpensesTotalCost;
  const emsManpowerTotalPrice = Math.round(calcPriceFromCost(emsManpowerTotalCost, profitPct));

  const emsPlatformTotalCost = useMemo(() => {
    return emsPlatformRows.reduce((sum, r) => sum + r.qty * r.unitCost, 0);
  }, [emsPlatformRows]);
  const emsPlatformTotalPrice = useMemo(() => {
    return emsPlatformRows.reduce((sum, r) => sum + Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct)), 0);
  }, [emsPlatformRows]);

  const emsRecurringMonthlyTotalCost = useMemo(() => {
    return emsRecurringRows.reduce((sum, r) => sum + Number(r.unitCostPerMonth || 0) * r.qty, 0);
  }, [emsRecurringRows]);
  const emsRecurringMonthlyTotalPrice = useMemo(() => {
    return emsRecurringRows.reduce((sum, r) => sum + Math.round(calcPriceFromCost(Number(r.unitCostPerMonth || 0), r.marginPct) * r.qty), 0);
  }, [emsRecurringRows]);
  const emsRecurringYearlyTotalCost = emsRecurringMonthlyTotalCost * 12;
  const emsRecurringYearlyTotalPrice = emsRecurringMonthlyTotalPrice * 12;

  const emsSteps1To4TotalCost = emsHardwareTotalCost + emsManpowerTotalCost + emsPlatformTotalCost + emsRecurringYearlyTotalCost;
  const emsSteps1To4TotalPrice = emsHardwareTotalPrice + emsManpowerTotalPrice + emsPlatformTotalPrice + emsRecurringYearlyTotalPrice;

  const emsItem1a = emsGatewayHardwareRows[0];
  const emsItem1Price = emsItem1a ? emsItem1a.qty * calcPriceFromCost(emsItem1a.unitCost, emsItem1a.marginPct) : 0;
  const emsItem1Cust = roundToNearest(emsItem1Price / Math.max(0.01, (100 - (bufferPct || 10)) / 100), roundingNearest);

  const emsItem1bRows = emsGatewayHardwareRows.slice(1);
  const emsItem2Price = emsItem1bRows.reduce((sum, r) => sum + r.qty * calcPriceFromCost(r.unitCost, r.marginPct), 0);
  const emsItem2Cust = roundToNearest(emsItem2Price / Math.max(0.01, (100 - (bufferPct || 10)) / 100), roundingNearest);

  const emsItem3Price = emsElectricalHardwareTotalPrice;
  const emsItem3Cust = roundToNearest(emsItem3Price / Math.max(0.01, (100 - (bufferPct || 10)) / 100), roundingNearest);

  const emsItem4Price = emsManpowerTotalPrice;
  const emsItem4Cust = roundToNearest(emsItem4Price / Math.max(0.01, (100 - (bufferPct || 10)) / 100), roundingNearest);

  const emsItem5Price = emsPlatformTotalPrice;
  const emsItem5Cust = roundToNearest(emsItem5Price / Math.max(0.01, (100 - (bufferPct || 10)) / 100), roundingNearest);

  const emsItem6Price = emsRecurringYearlyTotalPrice;
  const emsItem6Cust = roundToNearest(emsItem6Price / Math.max(0.01, (100 - (bufferPct || 10)) / 100), roundingNearest);

  const emsTotalStep5CustomerPrice = emsItem1Cust + emsItem2Cust + emsItem3Cust + emsItem4Cust + emsItem5Cust + emsItem6Cust;
  const emsBufferAmount = emsTotalStep5CustomerPrice - emsSteps1To4TotalPrice;
  const emsPriceWithBuffer = emsTotalStep5CustomerPrice;
  const emsRoundedCustomerCost = emsTotalStep5CustomerPrice;

  // Welding IoT Totals
  const weldingHardwareTotalCost = useMemo(() => {
    return weldingHardwareRows.reduce((sum, r) => {
      const qty = typeof r.qty === 'number' ? r.qty : isNaN(Number(r.qty)) ? 0 : Number(r.qty);
      return sum + qty * Number(r.unitCost || 0);
    }, 0);
  }, [weldingHardwareRows]);
  const weldingHardwareTotalPrice = useMemo(() => {
    return weldingHardwareRows.reduce((sum, r) => {
      const qty = typeof r.qty === 'number' ? r.qty : isNaN(Number(r.qty)) ? 0 : Number(r.qty);
      return sum + qty * Number(r.unitPrice || 0);
    }, 0);
  }, [weldingHardwareRows]);

  const weldingSoftwareTotalPrice = useMemo(() => {
    return weldingSoftwareRows.reduce((sum, r) => sum + Number(r.price || 0), 0);
  }, [weldingSoftwareRows]);

  const weldingCloudTotalMonthlyCost = useMemo(() => {
    return weldingCloudRows.reduce((sum, r) => {
      const cost = r.monthlyCost !== undefined ? Number(r.monthlyCost) : Math.round(Number(r.monthlyPrice || 0) * 0.6);
      return sum + cost;
    }, 0);
  }, [weldingCloudRows]);
  const weldingCloudTotalYearlyCost = weldingCloudTotalMonthlyCost * 12;

  const weldingCloudTotalMonthly = useMemo(() => {
    return weldingCloudRows.reduce((sum, r) => sum + Number(r.monthlyPrice || 0), 0);
  }, [weldingCloudRows]);
  const weldingCloudTotalYearly = useMemo(() => {
    return weldingCloudRows.reduce((sum, r) => sum + Number(r.yearlyPrice || 0), 0);
  }, [weldingCloudRows]);

  const weldingInstallationTotalCost = useMemo(() => {
    return weldingInstallationRows.reduce((sum, r) => {
      const qty = r.qty !== undefined && r.qty !== null ? Number(r.qty) : 0;
      const unitCost = r.unitCost !== undefined ? Number(r.unitCost) : Math.round(Number(r.unitPrice ?? r.price ?? 0) * 0.6);
      return sum + qty * unitCost;
    }, 0);
  }, [weldingInstallationRows]);

  const weldingInstallationTotalPrice = useMemo(() => {
    return weldingInstallationRows.reduce((sum, r) => {
      const qty = r.qty !== undefined && r.qty !== null ? Number(r.qty) : 0;
      const unitPrice = r.unitPrice !== undefined ? Number(r.unitPrice) : Number(r.price || 0);
      return sum + qty * unitPrice;
    }, 0);
  }, [weldingInstallationRows]);

  const weldingSteps1To4TotalPrice = weldingHardwareTotalPrice + weldingSoftwareTotalPrice + weldingCloudTotalYearly + weldingInstallationTotalPrice;
  const weldingBufferAmount = Math.round(weldingSteps1To4TotalPrice * (bufferPct / 100));
  const weldingPriceWithBuffer = weldingSteps1To4TotalPrice + weldingBufferAmount;
  const weldingGrandTotal = roundToHundred(weldingPriceWithBuffer);
  const weldingTotalInternalCost = weldingHardwareTotalCost + Math.round(weldingSoftwareTotalPrice * 0.6) + weldingCloudTotalYearlyCost + weldingInstallationTotalCost;

  // Chiller Plant Management (CPM) Totals
  const cpmHardwareTotalCost = useMemo(() => {
    return cpmHardwareRows.reduce((sum, r) => sum + Number(r.qty || 0) * Number(r.unitCost || 0), 0);
  }, [cpmHardwareRows]);

  const cpmHardwareTotalPrice = useMemo(() => {
    return cpmHardwareRows.reduce(
      (sum, r) => sum + Math.round(Number(r.qty || 0) * calcPriceFromCost(Number(r.unitCost || 0), Number(r.marginPct !== undefined ? r.marginPct : 40))),
      0
    );
  }, [cpmHardwareRows]);

  const cpmElectricalTotalCost = useMemo(() => {
    return cpmElectricalRows.reduce((sum, r) => sum + Number(r.qty || 0) * Number(r.unitCost || 0), 0);
  }, [cpmElectricalRows]);

  const cpmElectricalTotalPrice = useMemo(() => {
    return cpmElectricalRows.reduce(
      (sum, r) => sum + Math.round(Number(r.qty || 0) * calcPriceFromCost(Number(r.unitCost || 0), Number(r.marginPct !== undefined ? r.marginPct : 40))),
      0
    );
  }, [cpmElectricalRows]);

  const cpmInstallationTotalCost = useMemo(() => {
    return cpmInstallationRows.reduce((sum, r) => sum + Number(r.qty || 0) * Number(r.unitCost || 0), 0);
  }, [cpmInstallationRows]);

  const cpmInstallationTotalPrice = useMemo(() => {
    return cpmInstallationRows.reduce(
      (sum, r) => sum + Math.round(Number(r.qty || 0) * calcPriceFromCost(Number(r.unitCost || 0), Number(r.marginPct !== undefined ? r.marginPct : profitPct || 40))),
      0
    );
  }, [cpmInstallationRows, profitPct]);

  const cpmInstJuniorDaysComputed = useMemo(() => {
    return cpmInstallationManpowerRows
      .filter((r) => r.roleLevel === 'JUNIOR_ENERGY')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [cpmInstallationManpowerRows]);

  const cpmInstSeniorDaysComputed = useMemo(() => {
    return cpmInstallationManpowerRows
      .filter((r) => r.roleLevel === 'SENIOR_ENERGY')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [cpmInstallationManpowerRows]);

  const cpmInstIotDaysComputed = useMemo(() => {
    return cpmInstallationManpowerRows
      .filter((r) => r.roleLevel === 'IOT_ENGINEER')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [cpmInstallationManpowerRows]);

  const cpmInstTraineeDaysComputed = useMemo(() => {
    return cpmInstallationManpowerRows
      .filter((r) => r.roleLevel === 'TRAINEE_ENERGY')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [cpmInstallationManpowerRows]);

  const cpmInstCustomDaysComputed = useMemo(() => {
    return cpmInstallationManpowerRows
      .filter((r) => r.roleLevel === 'CUSTOM')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [cpmInstallationManpowerRows]);

  const cpmCommJuniorDaysComputed = useMemo(() => {
    return cpmCommissioningManpowerRows
      .filter((r) => r.roleLevel === 'JUNIOR_ENERGY')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [cpmCommissioningManpowerRows]);

  const cpmCommSeniorDaysComputed = useMemo(() => {
    return cpmCommissioningManpowerRows
      .filter((r) => r.roleLevel === 'SENIOR_ENERGY')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [cpmCommissioningManpowerRows]);

  const cpmCommIotDaysComputed = useMemo(() => {
    return cpmCommissioningManpowerRows
      .filter((r) => r.roleLevel === 'IOT_ENGINEER')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [cpmCommissioningManpowerRows]);

  const cpmCommTraineeDaysComputed = useMemo(() => {
    return cpmCommissioningManpowerRows
      .filter((r) => r.roleLevel === 'TRAINEE_ENERGY')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [cpmCommissioningManpowerRows]);

  const cpmCommCustomDaysComputed = useMemo(() => {
    return cpmCommissioningManpowerRows
      .filter((r) => r.roleLevel === 'CUSTOM')
      .reduce((sum, r) => sum + Number(r.siteWorkingDays || 0), 0);
  }, [cpmCommissioningManpowerRows]);

  const cpmCommMaxSiteDays = useMemo(() => {
    return Math.max(...cpmCommissioningManpowerRows.map((r) => Number(r.siteWorkingDays || 0)), 0);
  }, [cpmCommissioningManpowerRows]);

  const cpmCommManpowerBaseCost = useMemo(() => {
    return cpmCommissioningManpowerRows.reduce((sum, r) => {
      const siteCost = Number(r.siteWorkCost || 0) * Number(r.siteWorkingDays || 0);
      const reportCost = Number(r.reportWorkCost || 0) * Number(r.reportWorkingDays || 0);
      return sum + siteCost + reportCost;
    }, 0);
  }, [cpmCommissioningManpowerRows]);

  // CPM Step 3: Commissioning Food, Travel & Accommodation Costs
  const cpmCommJuniorFoodCost = manualJuniorFoodOverride !== null ? manualJuniorFoodOverride : cpmCommJuniorDaysComputed * juniorFoodRate;
  const cpmCommSeniorFoodCost = manualSeniorFoodOverride !== null ? manualSeniorFoodOverride : cpmCommSeniorDaysComputed * seniorFoodRate;
  const cpmCommIotFoodCost = manualIotFoodOverride !== null ? manualIotFoodOverride : cpmCommIotDaysComputed * iotFoodRate;
  const cpmCommTraineeFoodCost = manualTraineeFoodOverride !== null ? manualTraineeFoodOverride : cpmCommTraineeDaysComputed * (traineeFoodRate || 400);
  const cpmCommCustomFoodCost = manualCustomFoodOverride !== null ? manualCustomFoodOverride : cpmCommCustomDaysComputed * (customFoodRate || 500);
  const cpmCommTotalFoodCost = cpmCommJuniorFoodCost + cpmCommSeniorFoodCost + cpmCommIotFoodCost + cpmCommTraineeFoodCost + cpmCommCustomFoodCost;

  const cpmCommInsideChennaiTravelCalc = insideChennaiDistanceKms * insideChennaiRatePerKm * (manualInsideChennaiDays !== null ? manualInsideChennaiDays : (cpmCommMaxSiteDays || 1));
  const cpmCommInsideChennaiTravel = !isLocalStationActive ? 0 : manualInsideChennaiOverride !== null ? manualInsideChennaiOverride : cpmCommInsideChennaiTravelCalc;

  const cpmCommOutsideChennaiTravelCalc = (outsideChennaiBusCost + outsideChennaiCabCost + outsideChennaiTrainCost + outsideChennaiFlightCost) * 2;
  const cpmCommOutsideChennaiTravel = !isOutstationActive ? 0 : manualOutsideChennaiOverride !== null ? manualOutsideChennaiOverride : cpmCommOutsideChennaiTravelCalc;
  const cpmCommTotalTravelCost = cpmCommInsideChennaiTravel + cpmCommOutsideChennaiTravel;

  const cpmCommAccommodationDays = manualAccommodationDays !== null ? manualAccommodationDays : cpmCommMaxSiteDays;
  const cpmCommAccommodationCostCalc = !isOutstationActive ? 0 : cpmCommAccommodationDays * activeAccommodationRate;
  const cpmCommAccommodationCost = !isOutstationActive ? 0 : manualAccommodationOverride !== null ? manualAccommodationOverride : cpmCommAccommodationCostCalc;

  const cpmCommSiteExpensesTotalCost = cpmCommTotalFoodCost + cpmCommTotalTravelCost + cpmCommAccommodationCost + customExpensesTotal;
  const cpmCommissioningTotalCost = cpmCommManpowerBaseCost + cpmCommSiteExpensesTotalCost;
  const cpmCommissioningTotalPrice = Math.round(calcPriceFromCost(cpmCommissioningTotalCost, profitPct || 40));

  const cpmInstMaxSiteDays = useMemo(() => {
    return Math.max(...cpmInstallationManpowerRows.map((r) => Number(r.siteWorkingDays || 0)), 0);
  }, [cpmInstallationManpowerRows]);

  const cpmInstManpowerBaseCost = useMemo(() => {
    return cpmInstallationManpowerRows.reduce((sum, r) => {
      const siteCost = Number(r.siteWorkCost || 0) * Number(r.siteWorkingDays || 0);
      const reportCost = Number(r.reportWorkCost || 0) * Number(r.reportWorkingDays || 0);
      return sum + siteCost + reportCost;
    }, 0);
  }, [cpmInstallationManpowerRows]);

  // CPM Step 4: Installation Food, Travel & Accommodation Costs
  const cpmInstJuniorFoodCost = manualJuniorFoodOverride !== null ? manualJuniorFoodOverride : cpmInstJuniorDaysComputed * juniorFoodRate;
  const cpmInstSeniorFoodCost = manualSeniorFoodOverride !== null ? manualSeniorFoodOverride : cpmInstSeniorDaysComputed * seniorFoodRate;
  const cpmInstIotFoodCost = manualIotFoodOverride !== null ? manualIotFoodOverride : cpmInstIotDaysComputed * iotFoodRate;
  const cpmInstTraineeFoodCost = manualTraineeFoodOverride !== null ? manualTraineeFoodOverride : cpmInstTraineeDaysComputed * (traineeFoodRate || 400);
  const cpmInstCustomFoodCost = manualCustomFoodOverride !== null ? manualCustomFoodOverride : cpmInstCustomDaysComputed * (customFoodRate || 500);
  const cpmInstTotalFoodCost = cpmInstJuniorFoodCost + cpmInstSeniorFoodCost + cpmInstIotFoodCost + cpmInstTraineeFoodCost + cpmInstCustomFoodCost;

  const cpmInstInsideChennaiTravelCalc = insideChennaiDistanceKms * insideChennaiRatePerKm * (manualInsideChennaiDays !== null ? manualInsideChennaiDays : (cpmInstMaxSiteDays || 1));
  const cpmInstInsideChennaiTravel = !isLocalStationActive ? 0 : manualInsideChennaiOverride !== null ? manualInsideChennaiOverride : cpmInstInsideChennaiTravelCalc;

  const cpmInstOutsideChennaiTravelCalc = (outsideChennaiBusCost + outsideChennaiCabCost + outsideChennaiTrainCost + outsideChennaiFlightCost) * 2;
  const cpmInstOutsideChennaiTravel = !isOutstationActive ? 0 : manualOutsideChennaiOverride !== null ? manualOutsideChennaiOverride : cpmInstOutsideChennaiTravelCalc;
  const cpmInstTotalTravelCost = cpmInstInsideChennaiTravel + cpmInstOutsideChennaiTravel;

  const cpmInstAccommodationDays = manualAccommodationDays !== null ? manualAccommodationDays : cpmInstMaxSiteDays;
  const cpmInstAccommodationCostCalc = !isOutstationActive ? 0 : cpmInstAccommodationDays * activeAccommodationRate;
  const cpmInstAccommodationCost = !isOutstationActive ? 0 : manualAccommodationOverride !== null ? manualAccommodationOverride : cpmInstAccommodationCostCalc;

  const cpmInstSiteExpensesTotalCost = cpmInstTotalFoodCost + cpmInstTotalTravelCost + cpmInstAccommodationCost + customExpensesTotal;
  const cpmInstManpowerTotalCost = cpmInstManpowerBaseCost + cpmInstSiteExpensesTotalCost;
  const cpmInstManpowerTotalPrice = Math.round(calcPriceFromCost(cpmInstManpowerTotalCost, profitPct || 40));

  const cpmCloudTotalCost = useMemo(() => {
    return cpmCloudRows.reduce((sum, r) => sum + Number(r.qty || 0) * Number(r.unitCost || 0), 0);
  }, [cpmCloudRows]);

  const cpmCloudTotalPrice = useMemo(() => {
    return cpmCloudRows.reduce(
      (sum, r) => sum + Math.round(Number(r.qty || 0) * calcPriceFromCost(Number(r.unitCost || 0), Number(r.marginPct !== undefined ? r.marginPct : 40))),
      0
    );
  }, [cpmCloudRows]);

  const cpmSteps1To5TotalPrice = cpmHardwareTotalPrice + cpmElectricalTotalPrice + cpmCommissioningTotalPrice + cpmInstManpowerTotalPrice + cpmCloudTotalPrice;
  const cpmBufferAmount = Math.round(cpmSteps1To5TotalPrice / Math.max(0.01, (100 - (bufferPct || 10)) / 100)) - cpmSteps1To5TotalPrice;
  const cpmPriceWithBuffer = cpmSteps1To5TotalPrice + cpmBufferAmount;
  const cpmRoundedCustomerCost = roundToNearest(cpmPriceWithBuffer, roundingNearest);

  // IoT Controls Totals & ROI
  const iotHardwareTotalPrice = useMemo(() => {
    return iotControlsHardwareRows.reduce((sum, r) => sum + Math.round(Number(r.quantity || 0) * Number(r.unitPrice || 0)), 0);
  }, [iotControlsHardwareRows]);

  const iotOpexTotalYearly = useMemo(() => {
    return iotControlsOpexRows.reduce((sum, r) => sum + Number(r.yearlyPrice || 0), 0);
  }, [iotControlsOpexRows]);

  const iotTotalProjectCost = iotHardwareTotalPrice + emsManpowerTotalCost + iotOpexTotalYearly;

  // ROI Projections
  const roiInflation = 1 + (Number(iotControlsRoiState.energyInflationPct) || 0) / 100;
  const roiEnergyCostY1 = Number(iotControlsRoiState.annualEnergyCostBaseline) || 0;
  const roiEnergyCostY2 = roiEnergyCostY1 * roiInflation;
  const roiEnergyCostY3 = roiEnergyCostY2 * roiInflation;
  const roiEnergyCostY4 = roiEnergyCostY3 * roiInflation;
  const roiEnergyCostY5 = roiEnergyCostY4 * roiInflation;
  const roiEnergyCostTotal = roiEnergyCostY1 + roiEnergyCostY2 + roiEnergyCostY3 + roiEnergyCostY4 + roiEnergyCostY5;

  const roiCapexY1 = iotHardwareTotalPrice;
  const roiCapexY2 = 0, roiCapexY3 = 0, roiCapexY4 = 0, roiCapexY5 = 0;
  const roiCapexTotal = roiCapexY1;

  const roiOpexY1 = iotOpexTotalYearly;
  const roiOpexY2 = iotOpexTotalYearly, roiOpexY3 = iotOpexTotalYearly, roiOpexY4 = iotOpexTotalYearly, roiOpexY5 = iotOpexTotalYearly;
  const roiOpexTotal = roiOpexY1 * 5;

  const roiTotalExpenseY1 = roiCapexY1 + roiOpexY1;
  const roiTotalExpenseY2 = roiOpexY2, roiTotalExpenseY3 = roiOpexY3, roiTotalExpenseY4 = roiOpexY4, roiTotalExpenseY5 = roiOpexY5;
  const roiTotalExpenseTotal = roiTotalExpenseY1 + roiTotalExpenseY2 + roiTotalExpenseY3 + roiTotalExpenseY4 + roiTotalExpenseY5;

  const roiSavingsPctY1 = Number(iotControlsRoiState.savingsPctY1) || 0;
  const roiSavingsPctY2 = Number(iotControlsRoiState.savingsPctY2) || 0;
  const roiSavingsPctY3 = Number(iotControlsRoiState.savingsPctY3) || 0;
  const roiSavingsPctY4 = Number(iotControlsRoiState.savingsPctY4) || 0;
  const roiSavingsPctY5 = Number(iotControlsRoiState.savingsPctY5) || 0;
  const roiExpectedSavingsAvgPct = (roiSavingsPctY1 + roiSavingsPctY2 + roiSavingsPctY3 + roiSavingsPctY4 + roiSavingsPctY5) / 5;

  const roiSavingsAmountY1 = roiEnergyCostY1 * (roiSavingsPctY1 / 100);
  const roiSavingsAmountY2 = roiEnergyCostY2 * (roiSavingsPctY2 / 100);
  const roiSavingsAmountY3 = roiEnergyCostY3 * (roiSavingsPctY3 / 100);
  const roiSavingsAmountY4 = roiEnergyCostY4 * (roiSavingsPctY4 / 100);
  const roiSavingsAmountY5 = roiEnergyCostY5 * (roiSavingsPctY5 / 100);
  const roiSavingsAmountTotal = roiSavingsAmountY1 + roiSavingsAmountY2 + roiSavingsAmountY3 + roiSavingsAmountY4 + roiSavingsAmountY5;

  const roiGrossBenefitY1 = roiSavingsAmountY1 - roiTotalExpenseY1;
  const roiGrossBenefitY2 = roiSavingsAmountY2 - roiTotalExpenseY2;
  const roiGrossBenefitY3 = roiSavingsAmountY3 - roiTotalExpenseY3;
  const roiGrossBenefitY4 = roiSavingsAmountY4 - roiTotalExpenseY4;
  const roiGrossBenefitY5 = roiSavingsAmountY5 - roiTotalExpenseY5;
  const roiGrossBenefitTotal = roiGrossBenefitY1 + roiGrossBenefitY2 + roiGrossBenefitY3 + roiGrossBenefitY4 + roiGrossBenefitY5;

  const roiNetBenefitY1 = roiGrossBenefitY1;
  const roiNetBenefitY2 = roiNetBenefitY1 + roiGrossBenefitY2;
  const roiNetBenefitY3 = roiNetBenefitY2 + roiGrossBenefitY3;
  const roiNetBenefitY4 = roiNetBenefitY3 + roiGrossBenefitY4;
  const roiNetBenefitY5 = roiNetBenefitY4 + roiGrossBenefitY5;

  const roiPaybackMonths = useMemo(() => {
    if (roiSavingsAmountY1 <= 0) return 0;
    const months = (roiCapexY1 / (roiSavingsAmountY1 - roiOpexY1)) * 12;
    return Math.max(1, Math.round(months * 10) / 10);
  }, [roiCapexY1, roiSavingsAmountY1, roiOpexY1]);

  const roiCustomerSharePct = useMemo(() => {
    if (roiSavingsAmountTotal <= 0) return 0;
    return Math.min(100, Math.max(0, (roiNetBenefitY5 / roiSavingsAmountTotal) * 100));
  }, [roiNetBenefitY5, roiSavingsAmountTotal]);

  const allSiteLocations = useMemo(() => {
    return [...DEFAULT_SITE_LOCATIONS, ...customSiteLocations];
  }, [customSiteLocations]);

  const calculateTotalSiteDistance = (sites: string[]) => {
    return sites.reduce((sum, s) => {
      const custom = customSiteLocations.find((c) => c.name.toLowerCase() === s.toLowerCase());
      if (custom) return sum + custom.distanceKm;
      return sum + (getSiteDistanceKm(s) || 0);
    }, 0);
  };

  const handleAddCustomSite = () => {
    const trimmed = customSiteNameInput.trim();
    if (!trimmed) return;
    const km = Number(customSiteKmInput) || 0;

    // Register in global in-memory distance map
    addCustomSiteDistance(trimmed, km);

    // Add to custom sites list
    setCustomSiteLocations((prev) => {
      const existing = prev.find((s) => s.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) {
        return prev.map((s) => (s.name.toLowerCase() === trimmed.toLowerCase() ? { name: trimmed, distanceKm: km } : s));
      }
      return [...prev, { name: trimmed, distanceKm: km }];
    });

    // Select the newly added site and recompute distance
    setSelectedSites((prev) => {
      const next = prev.includes(trimmed) ? prev : [...prev, trimmed];
      const totalKm = next.reduce((sum, s) => {
        if (s.toLowerCase() === trimmed.toLowerCase()) return sum + km;
        const custom = customSiteLocations.find((c) => c.name.toLowerCase() === s.toLowerCase());
        if (custom) return sum + custom.distanceKm;
        return sum + (getSiteDistanceKm(s) || 0);
      }, 0);
      setInsideChennaiDistanceKms(totalKm);
      setManualInsideChennaiOverride(null);
      return next;
    });

    setCustomSiteNameInput('');
    setCustomSiteKmInput('');
    setShowAddCustomSite(false);
    toast.success(`Added custom site "${trimmed}" (${km} km)`);
  };

  // Site Dropdown Rendering
  const removeSelectedSite = (site: string) => {
    setSelectedSites((prev) => {
      const next = prev.filter((s) => s !== site);
      setInsideChennaiDistanceKms(calculateTotalSiteDistance(next));
      setManualInsideChennaiOverride(null);
      return next;
    });
  };
  const toggleSiteSelection = (site: string) => {
    setSelectedSites((prev) => {
      const next = prev.includes(site) ? prev.filter((s) => s !== site) : [...prev, site];
      setInsideChennaiDistanceKms(calculateTotalSiteDistance(next));
      setManualInsideChennaiOverride(null);
      return next;
    });
  };
  const renderSiteDropdownContent = () => (
    <div className="p-3 space-y-2 min-w-[290px]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Select Site Locations
        </span>
        <span className="text-[10px] text-slate-400 font-semibold">Round Trip KM</span>
      </div>
      <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5">
        {allSiteLocations.map((siteObj) => {
          const isSelected = selectedSites.includes(siteObj.name);
          return (
            <button
              key={siteObj.name}
              type="button"
              onClick={() => toggleSiteSelection(siteObj.name)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${isSelected ? 'bg-sky-50 text-sky-900 font-bold border border-sky-200' : 'text-slate-700 hover:bg-slate-50'
                }`}
            >
              <div className="flex items-center gap-1.5">
                {isSelected ? (
                  <span className="text-sky-600 font-bold text-xs">✓</span>
                ) : (
                  <span className="text-slate-300 text-xs">○</span>
                )}
                <span>{siteObj.name}</span>
              </div>
              <span className={`text-[11px] px-1.5 py-0.5 rounded font-mono font-bold ${isSelected ? 'bg-sky-200/70 text-sky-900' : 'bg-slate-100 text-slate-600'}`}>
                {siteObj.distanceKm} km
              </span>
            </button>
          );
        })}
      </div>

      {/* Add Custom Site Section */}
      <div className="pt-2 border-t border-slate-100">
        {!showAddCustomSite ? (
          <button
            type="button"
            onClick={() => setShowAddCustomSite(true)}
            className="w-full py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-indigo-200"
          >
            <Plus className="h-3.5 w-3.5" /> + Custom Site Location
          </button>
        ) : (
          <div className="bg-slate-50 border border-indigo-200 rounded-xl p-2.5 space-y-2">
            <span className="text-[11px] font-bold text-indigo-900 block">Add Custom Site Location</span>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Site name (e.g. Plant X)"
                value={customSiteNameInput}
                onChange={(e) => setCustomSiteNameInput(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-0.5 bg-white border border-slate-300 rounded-lg px-1.5 py-1">
                <input
                  type="number"
                  placeholder="KM"
                  min={0}
                  value={customSiteKmInput}
                  onChange={(e) => setCustomSiteKmInput(e.target.value)}
                  className="w-12 text-right text-xs font-bold text-slate-800 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 font-semibold">km</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => {
                  setShowAddCustomSite(false);
                  setCustomSiteNameInput('');
                  setCustomSiteKmInput('');
                }}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomSite}
                disabled={!customSiteNameInput.trim()}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
              >
                Add & Select
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Sync All Site Days Helper
  const syncAllSiteDays = (days: number) => {
    if (isCpmActive) {
      setCpmCommissioningManpowerRows((prev) => prev.map((r) => ({ ...r, siteWorkingDays: days })));
    } else if (isEmsActive || isIotControlsActive) {
      setEmsManpowerRows((prev) => prev.map((r) => ({ ...r, siteWorkingDays: days })));
    } else {
      setManpowerRows((prev) => prev.map((r) => ({ ...r, siteWorkingDays: days })));
      setInstrumentRows((prev) => prev.map((r) => (r.sets > 0 ? { ...r, siteWorkingDays: days } : r)));
    }
    toast.success(`Updated all site working days to ${days} days`);
  };

  // Reset defaults
  const resetToModelDefaults = () => {
    setManpowerRows([
      { id: 'm1', name: 'Gowtham', roleLevel: 'SENIOR_ENERGY', foodRatePerDay: 600, siteWorkCost: 6000, reportWorkCost: 4200, siteWorkingDays: 0, reportWorkingDays: 0 },
    ]);
    setInsideChennaiDistanceKms(0);
    setInsideChennaiRatePerKm(5);
    setManualInsideChennaiOverride(null);
    setProfitPct(40);
    setBufferPct(10);
    toast.success('Reset standard costing to model defaults!');
  };

  const resetEmsDefaults = () => {
    if (isWaterManagementActive) {
      setEmsGatewayHardwareRows(INITIAL_WATER_MANAGEMENT_GATEWAY_HARDWARE_ROWS);
      setEmsElectricalHardwareRows(INITIAL_WATER_MANAGEMENT_ELECTRICAL_HARDWARE_ROWS);
      setEmsManpowerRows(INITIAL_EMS_MANPOWER_ROWS);
      setEmsPlatformRows(INITIAL_WATER_MANAGEMENT_PLATFORM_ROWS);
      setEmsRecurringRows(INITIAL_WATER_MANAGEMENT_RECURRING_ROWS);
      setProfitPct(40);
      setBufferPct(10);
      toast.success('Reset Water Management costing to model defaults!');
      return;
    }
    setEmsGatewayHardwareRows(INITIAL_EMS_GATEWAY_HARDWARE_ROWS);
    setEmsElectricalHardwareRows(INITIAL_EMS_ELECTRICAL_HARDWARE_ROWS);
    setEmsManpowerRows(INITIAL_EMS_MANPOWER_ROWS);
    setEmsPlatformRows(INITIAL_EMS_PLATFORM_ROWS);
    setEmsRecurringRows(INITIAL_EMS_RECURRING_ROWS);
    setProfitPct(40);
    setBufferPct(10);
    toast.success('Reset EMS costing to reference model defaults!');
  };

  const resetWeldingIotDefaults = () => {
    if (activeSubServiceName.toLowerCase().includes('digiweld')) {
      setWeldingHardwareRows([]);
      setWeldingSoftwareRows(INITIAL_DIGIWELD_SOFTWARE_ROWS);
      setWeldingCloudRows(INITIAL_DIGIWELD_CLOUD_ROWS);
      setWeldingInstallationRows([]);
      setProfitPct(40);
      setBufferPct(0);
      toast.success('Reset Digiweld costing to model defaults!');
      return;
    }
    setWeldingHardwareRows(INITIAL_WELDING_HARDWARE_ROWS);
    setWeldingSoftwareRows(INITIAL_WELDING_SOFTWARE_ROWS);
    setWeldingCloudRows(INITIAL_WELDING_CLOUD_ROWS);
    setWeldingInstallationRows(INITIAL_WELDING_INSTALLATION_ROWS);
    setProfitPct(40);
    setBufferPct(10);
    toast.success('Reset Welding IoT costing to reference model defaults!');
  };

  const resetIotControlsDefaults = () => {
    setIotControlsHardwareRows(INITIAL_IOT_CONTROLS_HARDWARE_ROWS);
    setIotControlsMandaysRows(INITIAL_IOT_CONTROLS_MANDAYS_ROWS);
    setIotControlsTravelRows(INITIAL_IOT_CONTROLS_TRAVEL_ROWS);
    setIotControlsOpexRows(INITIAL_IOT_CONTROLS_OPEX_ROWS);
    setIotControlsRoiState(INITIAL_IOT_CONTROLS_ROI_STATE);
    setProfitPct(40);
    setBufferPct(10);
    toast.success('Reset IoT Controls & Hardware costing to reference defaults!');
  };

  const resetCpmDefaults = () => {
    setCpmHardwareRows(INITIAL_CPM_HARDWARE_ROWS);
    setCpmElectricalRows(INITIAL_CPM_ELECTRICAL_ROWS);
    setCpmCommissioningManpowerRows(INITIAL_CPM_COMMISSIONING_MANPOWER_ROWS);
    setCpmInstallationRows(INITIAL_CPM_INSTALLATION_ROWS);
    setCpmCloudRows(INITIAL_CPM_CLOUD_ROWS);
    setProfitPct(40);
    setBufferPct(10);
    toast.success('Reset CPM costing to reference model defaults!');
  };

  // CSV Export
  const exportCSV = () => {
    if (isCpmActive) {
      const csvLines = [
        `Chiller Plant Management (CPM) Costing Sheet - ${clientName} (${activeFullServiceName})`,
        `Date: ${new Date().toLocaleDateString('en-IN')}`,
        ``,
        `STEP 1: PRODUCT DESCRIPTION & HARDWARE CAPEX MATRIX`,
        `Sl.No,Brand,Item Description,Model No,Qty,UoM,Unit Cost (₹),Total Cost (₹),Margin %,Selling Price (₹)`,
        ...cpmHardwareRows.map(
          (r, idx) =>
            `${idx + 1},"${r.brand}","${r.itemDescription.replace(/"/g, '""')}","${r.modelNo}",${r.qty},${r.uom},${r.unitCost},${r.qty * r.unitCost},${r.marginPct}%,${Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct))}`
        ),
        ``,
        `STEP 2: ELECTRICAL HARDWARE & CONSUMABLES MATRIX`,
        `Sl.No,Brand,Item Description,Model No,Qty,UoM,Unit Cost (₹),Total Cost (₹),Margin %,Selling Price (₹)`,
        ...cpmElectricalRows.map(
          (r, idx) =>
            `${11 + idx},"${r.brand}","${r.itemDescription.replace(/"/g, '""')}","${r.modelNo}",${r.qty},${r.uom},${r.unitCost},${r.qty * r.unitCost},${r.marginPct}%,${Math.round(r.qty * calcPriceFromCost(r.unitCost, r.marginPct))}`
        ),
        ``,
        `STEP 3: TESTING AND COMMISSIONING SCOPE`,
        `Sl.No,Name,Role Level,Daily Cost (₹),Food Rate (₹),Site Days,Report Days,Total Cost (₹),Selling Price (₹)`,
        ...cpmCommissioningManpowerRows.map((r, idx) => {
          const cost = (Number(r.siteWorkCost || 0) + Number(r.foodRatePerDay || 0)) * Number(r.siteWorkingDays || 0) + Number(r.reportWorkCost || 0) * Number(r.reportWorkingDays || 0);
          return `${idx + 1},"${r.name}","${r.roleLevel}",${r.siteWorkCost},${r.foodRatePerDay},${r.siteWorkingDays},${r.reportWorkingDays},${cost},${Math.round(calcPriceFromCost(cost, profitPct || 40))}`;
        }),
        ``,
        `STEP 4: INSTALLATION CHARGES MANDAYS & LOGISTICS SCOPE`,
        `Sl.No,Name,Role Level,Daily Cost (₹),Food Rate (₹),Site Days,Report Days,Total Cost (₹),Selling Price (₹)`,
        ...cpmInstallationManpowerRows.map((r, idx) => {
          const cost = (Number(r.siteWorkCost || 0) + Number(r.foodRatePerDay || 0)) * Number(r.siteWorkingDays || 0) + Number(r.reportWorkCost || 0) * Number(r.reportWorkingDays || 0);
          return `${idx + 1},"${r.name}","${r.roleLevel}",${r.siteWorkCost},${r.foodRatePerDay},${r.siteWorkingDays},${r.reportWorkingDays},${cost},${Math.round(calcPriceFromCost(cost, profitPct || 40))}`;
        }),
        ``,
        `STEP 5: SOFTWARE COST (CLOUD BASIS) & SAAS SUBSCRIPTIONS`,
        `Sl.No,Module Description,Qty,UoM,Unit Cost (₹),Total Cost (₹),Margin %,Selling Price (₹)`,
        ...cpmCloudRows.map((r, idx) => {
          const cost = Number(r.qty || 0) * Number(r.unitCost || 0);
          const price = Math.round(Number(r.qty || 0) * calcPriceFromCost(Number(r.unitCost || 0), Number(r.marginPct ?? 40)));
          return `${idx + 1},"${r.itemDescription.replace(/"/g, '""')}",${r.qty},${r.uom},${r.unitCost},${cost},${r.marginPct}%,${price}`;
        }),
        ``,
        `Total Hardware Capex Cost (₹),${cpmHardwareTotalCost.toFixed(2)}`,
        `Total Hardware Capex Price (₹),${cpmHardwareTotalPrice.toFixed(2)}`,
        `Total Electrical Consumables Cost (₹),${cpmElectricalTotalCost.toFixed(2)}`,
        `Total Electrical Consumables Price (₹),${cpmElectricalTotalPrice.toFixed(2)}`,
        `Total Testing & Commissioning Cost (₹),${cpmCommissioningTotalCost.toFixed(2)}`,
        `Total Testing & Commissioning Price (₹),${cpmCommissioningTotalPrice.toFixed(2)}`,
        `Total Installation Charges Cost (₹),${cpmInstManpowerTotalCost.toFixed(2)}`,
        `Total Installation Charges Price (₹),${cpmInstManpowerTotalPrice.toFixed(2)}`,
        `Total Software Cost (Cloud Basis) Cost (₹),${cpmCloudTotalCost.toFixed(2)}`,
        `Total Software Cost (Cloud Basis) Price (₹),${cpmCloudTotalPrice.toFixed(2)}`,
        `Final Customer Quotation with ${bufferPct}% Buffer (₹),₹${cpmRoundedCustomerCost}`,
      ];
      const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvLines.join('\n'));
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `CPM_Costing_${clientName.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported CPM sheet for ${clientName}`);
      return;
    }
    if (isIotControlsActive) {
      const csvLines = [
        `IoT Controls & Hardware Costing Sheet - ${clientName} (${activeFullServiceName})`,
        `Date: ${new Date().toLocaleDateString('en-IN')}`,
        `Site: ${selectedSites.join(', ') || 'N/A'}`,
        ``,
        `STEP 1: PRODUCT DESCRIPTION & HARDWARE CAPEX MATRIX`,
        `Sl.No,Product Description,Quantity,Unit Cost (₹),Margin %,Unit Price (₹),Total Price (₹)`,
        ...iotControlsHardwareRows.map((r) => `${r.slNo},"${r.productDescription.replace(/"/g, '""')}",${r.quantity},${r.unitCost || 0},${r.marginPct ?? 40}%,${r.unitPrice},${(r.quantity * r.unitPrice).toFixed(2)}`),
        `,,,,,Total Capex Investment,${iotHardwareTotalPrice.toFixed(2)}`,
        ``,
        `STEP 2: MAN DAYS COSTING`,
        `Sl.No,Designation / Scope,Mandays,Rate/Day (₹),Total Cost (₹)`,
        ...emsManpowerRows.map((r, i) => `${i + 1},"${r.name} (${r.roleLevel})",${r.siteWorkingDays},${r.siteWorkCost},${(r.siteWorkingDays * r.siteWorkCost).toFixed(2)}`),
        `,,,Total Manpower Cost,${emsManpowerTotalCost.toFixed(2)}`,
        ``,
        `STEP 3: CLOUD PLATFORM & ANALYTICAL SERVICES (OPEX)`,
        `Item,Description,Yearly Price (₹)`,
        ...iotControlsOpexRows.map((r) => `"${r.item}","${r.description.replace(/"/g, '""')}",${r.yearlyPrice}`),
        `,Total Annual OPEX,${iotOpexTotalYearly.toFixed(2)}`,
      ];
      const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvLines.join('\n'));
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `IoT_Controls_Costing_${clientName.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported IoT Controls sheet for ${clientName}`);
      return;
    }

    if (isWeldingIotActive) {
      const csvLines = [
        `Welding IoT Costing Sheet - ${clientName} (${activeFullServiceName})`,
        `Date: ${new Date().toLocaleDateString('en-IN')}`,
        ``,
        `STEP 1: HARDWARE AND DEVELOPMENT CHARGES`,
        `Sl No,Component Name,Qty,Unit Cost (₹),Unit Price (₹)`,
        ...weldingHardwareRows.map((r) => `${r.slNo},"${r.componentName}",${r.qty},${r.unitCost},${r.unitPrice}`),
        `,,,Hardware Total Cost,${weldingHardwareTotalCost.toFixed(2)}`,
        `,,,Hardware Total Price,${weldingHardwareTotalPrice.toFixed(2)}`,
        ``,
        `STEP 2: SOFTWARE DEVELOPMENT`,
        `Item,Description,Unit / UoM,Price (₹)`,
        ...weldingSoftwareRows.map((r) => `"${r.item}","${r.description.replace(/"/g, '""')}","${r.uom || 'per kit'}",${r.price}`),
        `,,Software Total,${weldingSoftwareTotalPrice.toFixed(2)}`,
        ``,
        `STEP 3: CLOUD CHARGES`,
        `Component,Description,Type,Monthly Cost (₹),Margin %,Monthly Price (₹),Yearly Price (₹)`,
        ...weldingCloudRows.map((r) => {
          const cost = r.monthlyCost !== undefined ? r.monthlyCost : Math.round(Number(r.monthlyPrice || 0) * 0.6);
          return `"${r.component}","${r.description.replace(/"/g, '""')}",${r.type},${cost},${r.marginPct ?? profitPct ?? 40}%,${r.monthlyPrice},${r.yearlyPrice}`;
        }),
        `,,,,Total Yearly Cloud Cost,${weldingCloudTotalYearlyCost.toFixed(2)}`,
        `,,,,Total Yearly Cloud Price,${weldingCloudTotalYearly.toFixed(2)}`,
        ``,
        `STEP 4: INSTALLATION CHARGES`,
        `Item,Qty,Unit Cost (₹),Margin %,Unit Price (₹),Total Price (₹)`,
        ...weldingInstallationRows.map((r) => {
          const qty = Number(r.qty ?? 1) || 1;
          const unitCost = r.unitCost !== undefined ? r.unitCost : Math.round(Number(r.unitPrice ?? r.price ?? 15000) * 0.6);
          const unitPrice = r.unitPrice !== undefined ? r.unitPrice : Number(r.price || 0);
          return `"${r.item}",${qty},${unitCost},${r.marginPct ?? profitPct ?? 40}%,${unitPrice},${(qty * unitPrice).toFixed(2)}`;
        }),
        `,Total Installation Cost,${weldingInstallationTotalCost.toFixed(2)}`,
        `,Total Installation Price,${weldingInstallationTotalPrice.toFixed(2)}`,
        ``,
        `GRAND TOTAL QUOTATION,₹${weldingGrandTotal}`,
      ];
      const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvLines.join('\n'));
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Welding_IoT_Costing_${clientName.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported Welding IoT sheet for ${clientName}`);
      return;
    }

    if (isEmsActive) {
      const csvLines = [
        `EMS Costing Sheet - ${clientName} (${activeFullServiceName})`,
        `Date: ${new Date().toLocaleDateString('en-IN')}`,
        ``,
        `Total Hardware Costing (₹),${emsHardwareTotalPrice.toFixed(2)}`,
        `Manpower Total Price (₹),${emsManpowerTotalPrice.toFixed(2)}`,
        `Platform Setup Price (₹),${emsPlatformTotalPrice.toFixed(2)}`,
        `Recurring Cloud Price/Yr (₹),${emsRecurringYearlyTotalPrice.toFixed(2)}`,
        `Final Customer Quotation (₹),₹${emsRoundedCustomerCost}`,
      ];
      const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvLines.join('\n'));
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `EMS_Costing_${clientName.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported EMS sheet for ${clientName}`);
      return;
    }

    const csvLines = [
      `Costing Sheet - ${clientName} (${activeFullServiceName})`,
      `Date: ${new Date().toLocaleDateString('en-IN')}`,
      `Total Internal Cost,${costTotal.toFixed(2)}`,
      `Profit Margin (${profitPct}%),${profitAmount.toFixed(2)}`,
      `Base Price,${basePrice.toFixed(2)}`,
      `Our Quote Amount (Final),${ourQuoteAmount.toFixed(2)}`,
    ];
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvLines.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Costing_Sheet_${clientName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported costing sheet for ${clientName}`);
  };

  // DB Sync Queries & Mutations
  const { data: dbTemplate, refetch: refetchTemplate } = useQuery({
    queryKey: ['costing-template', activeSubServiceName],
    queryFn: async () => {
      const sub = (activeSubServiceName || '').toLowerCase();
      if (sub.includes('air audit') && !sub.includes('rectification')) return costingApi.airAudit.getTemplate();
      if (sub.includes('compressor air leakage audit') || sub === 'compressor air leakage audit') return costingApi.airAudit.getTemplate();
      if (sub.includes('rectification')) return costingApi.airAuditRectification.getTemplate();
      if (sub === 'energy audit') return costingApi.energyAudit.getTemplate();
      return costingApi.getTemplateByService(activeSubServiceName);
    },
    enabled: !!activeSubServiceName,
  });

  const { refetch: refetchSavedSheets } = useQuery({
    queryKey: ['costing-sheets', clientName, activeSubServiceName],
    queryFn: async () => {
      const sub = (activeSubServiceName || '').toLowerCase();
      if (sub.includes('air audit') && !sub.includes('rectification')) return costingApi.airAudit.getSheets(clientName || undefined);
      if (sub.includes('compressor air leakage audit') || sub === 'compressor air leakage audit') return costingApi.airAudit.getSheets(clientName || undefined);
      if (sub.includes('rectification')) return costingApi.airAuditRectification.getSheets(clientName || undefined);
      if (sub === 'energy audit') return costingApi.energyAudit.getSheets(clientName || undefined);
      return costingApi.getSheets(clientName || undefined, activeSubServiceName || undefined);
    },
  });

  // Automatically hydrate state when editSheet is loaded by ID
  useEffect(() => {
    if (editSheet) {
      if (editSheet.clientName) setClientName(editSheet.clientName);
      if (editSheet.serviceCategory) setMainCategoryService(editSheet.serviceCategory);
      if (editSheet.subService) setSubServiceOption(editSheet.subService);
      if (editSheet.projectName) setSelectedProject(editSheet.projectName);
      if (editSheet.stationType) setStationType(editSheet.stationType);
      if (editSheet.siteName) {
        const sites = editSheet.siteName.split(',').map((s: string) => s.trim()).filter(Boolean);
        if (sites.length > 0) setSelectedSites(sites);
      }
      handleLoadTemplateDB(editSheet);
      toast.success(`Loaded saved costing sheet #${editSheet.id || editSheet._id} for ${editSheet.clientName}!`);
    }
  }, [editSheet]);

  const [isSavingSheet, setIsSavingSheet] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);

  const handleSaveCostingSheetDB = async () => {
    setIsSavingSheet(true);
    const emsHardwareRowsCombined = [...emsGatewayHardwareRows, ...emsElectricalHardwareRows];
    const cpmTotalCost = cpmHardwareTotalCost + cpmElectricalTotalCost + cpmCommissioningTotalCost + cpmInstManpowerTotalCost + cpmCloudTotalCost;

    const payload = isCpmActive
      ? {
        id: editId || undefined,
        clientId: selectedClientId || undefined,
        clientName: clientName || 'General Client',
        serviceCategory: activeCategoryName,
        subService: activeSubServiceName,
        projectName: activeProjectName || undefined,
        siteName: selectedSites.join(', ') || undefined,
        stationType,
        outstationStartLocation,
        outstationEndLocation,
        isCpm: true,
        cpmHardwareRows,
        cpmElectricalRows,
        cpmCommissioningManpowerRows,
        cpmInstallationRows,
        cpmInstallationManpowerRows,
        cpmCloudRows,
        totalHardwareCost: cpmHardwareTotalCost,
        totalConsumablesCost: cpmElectricalTotalCost,
        totalCommissioningCost: cpmCommissioningTotalCost,
        totalInstallationCost: cpmInstManpowerTotalCost,
        totalSoftwareCost: cpmCloudTotalCost,
        subtotalCost: cpmTotalCost,
        marginPct: profitPct,
        bufferPct: bufferPct,
        bufferAmount: cpmBufferAmount,
        finalQuote: cpmRoundedCustomerCost,
        roundingNearest: roundingNearest,
      }
      : isIotControlsActive
      ? {
        id: editId || undefined,
        clientId: selectedClientId || undefined,
        clientName: clientName || 'General Client',
        serviceCategory: activeCategoryName,
        subService: activeSubServiceName,
        projectName: activeProjectName || undefined,
        siteName: selectedSites.join(', ') || undefined,
        stationType,
        outstationStartLocation,
        outstationEndLocation,
        isIotControls: true,
        iotControlsHardwareRows,
        emsManpowerRows,
        extraExpenses,
        iotControlsMandaysRows,
        iotControlsTravelRows,
        iotControlsOpexRows,
        iotControlsRoiState,
        subtotalCost: iotTotalProjectCost,
        marginPct: profitPct,
        bufferPct: bufferPct,
        finalQuote: iotHardwareTotalPrice,
      }
      : isWeldingIotActive
        ? {
          id: editId || undefined,
          clientId: selectedClientId || undefined,
          clientName: clientName || 'General Client',
          serviceCategory: activeCategoryName,
          subService: activeSubServiceName,
          projectName: activeProjectName || undefined,
          siteName: selectedSites.join(', ') || undefined,
          stationType,
          outstationStartLocation,
          outstationEndLocation,
          isWeldingIot: true,
          weldingHardwareRows,
          weldingSoftwareRows,
          weldingCloudRows,
          weldingInstallationRows,
          subtotalCost: weldingTotalInternalCost,
          marginPct: profitPct,
          bufferPct: bufferPct,
          finalQuote: weldingGrandTotal,
        }
        : isEmsActive
          ? {
            id: editId || undefined,
            clientId: selectedClientId || undefined,
            clientName: clientName || 'General Client',
            serviceCategory: activeCategoryName,
            subService: activeSubServiceName,
            projectName: activeProjectName || undefined,
            siteName: selectedSites.join(', ') || undefined,
            stationType,
            outstationStartLocation,
            outstationEndLocation,
            isEms: true,
            emsHardwareRows: emsHardwareRowsCombined,
            emsGatewayHardwareRows,
            emsElectricalHardwareRows,
            emsManpowerRows,
            emsPlatformRows,
            emsRecurringRows,
            totalManpowerCost: emsManpowerTotalCost,
            totalExtraCost: emsSiteExpensesTotalCost,
            subtotalCost: emsSteps1To4TotalCost,
            marginPct: profitPct,
            bufferPct: bufferPct,
            bufferAmount: emsBufferAmount,
            finalQuote: emsTotalStep5CustomerPrice,
            roundingNearest: roundingNearest,
          }
          : {
            id: editId || undefined,
            clientId: selectedClientId || undefined,
            clientName: clientName || 'General Client',
            serviceCategory: activeCategoryName,
            subService: activeSubServiceName,
            projectName: activeProjectName || undefined,
            siteName: selectedSites.join(', ') || undefined,
            stationType,
            outstationStartLocation,
            outstationEndLocation,
            manpowerRows,
            instrumentRows,
            extraExpenseRows: extraExpenses,
            siteWorkingDays: maxSiteWorkingDays || 1,
            reportWorkingDays: 1,
            totalManpowerCost: manWorkingCost,
            totalInstrumentCost: instrumentRentalCost,
            totalExtraCost: totalFoodCost + totalTravelCost + finalAccommodationCost + customExpensesTotal,
            subtotalCost: costTotal,
            marginPct: profitPct,
            marginAmount: profitAmount,
            bufferPct: bufferPct,
            bufferAmount: ourQuoteAmount - basePrice,
            finalQuote: ourQuoteAmount,
          };

    try {
      if (isIotControlsActive || isWeldingIotActive || isEmsActive || isCpmActive) {
        await costingApi.ems.saveSheet(payload);
      } else {
        await costingApi.saveSheet(payload);
      }
      toast.success(`Costing sheet for "${clientName || 'General Client'}" saved to database!`);
      refetchSavedSheets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save costing sheet');
    } finally {
      setIsSavingSheet(false);
    }
  };

  const handleSaveMasterTemplateDB = async () => {
    setIsSavingTemplate(true);
    const emsHardwareRowsCombined = [...emsGatewayHardwareRows, ...emsElectricalHardwareRows];
    const payload = isCpmActive
      ? {
        serviceName: activeSubServiceName,
        categoryName: activeCategoryName,
        name: `${activeSubServiceName} Master Template`,
        isCpm: true,
        stationType,
        outstationStartLocation,
        outstationEndLocation,
        cpmHardwareRows,
        cpmElectricalRows,
        cpmCommissioningManpowerRows,
        cpmInstallationRows,
        cpmInstallationManpowerRows,
        cpmCloudRows,
        marginPct: profitPct,
        bufferPct: bufferPct,
        roundingNearest: roundingNearest,
      }
      : isIotControlsActive
      ? {
        serviceName: activeSubServiceName,
        categoryName: activeCategoryName,
        name: `${activeSubServiceName} Master Template`,
        isIotControls: true,
        stationType,
        outstationStartLocation,
        outstationEndLocation,
        iotControlsHardwareRows,
        emsManpowerRows,
        extraExpenses,
        iotControlsMandaysRows,
        iotControlsTravelRows,
        iotControlsOpexRows,
        iotControlsRoiState,
        marginPct: profitPct,
        bufferPct: bufferPct,
      }
      : isWeldingIotActive
        ? {
          serviceName: activeSubServiceName,
          categoryName: activeCategoryName,
          name: `${activeSubServiceName} Master Template`,
          isWeldingIot: true,
          stationType,
          outstationStartLocation,
          outstationEndLocation,
          weldingHardwareRows,
          weldingSoftwareRows,
          weldingCloudRows,
          weldingInstallationRows,
          marginPct: profitPct,
          bufferPct: bufferPct,
        }
        : isEmsActive
          ? {
            serviceName: activeSubServiceName,
            categoryName: activeCategoryName,
            name: `${activeSubServiceName} EMS Master Template`,
            isEms: true,
            stationType,
            outstationStartLocation,
            outstationEndLocation,
            emsHardwareRows: emsHardwareRowsCombined,
            emsGatewayHardwareRows,
            emsElectricalHardwareRows,
            emsManpowerRows,
            emsPlatformRows,
            emsRecurringRows,
            marginPct: profitPct,
            bufferPct: bufferPct,
          }
          : {
            serviceName: activeSubServiceName,
            categoryName: activeCategoryName,
            name: `${activeSubServiceName} Master Template`,
            stationType,
            outstationStartLocation,
            outstationEndLocation,
            manpowerRows,
            instrumentRows,
            extraExpenseRows: extraExpenses,
            siteWorkingDays: maxSiteWorkingDays || 1,
            reportWorkingDays: 1,
            marginPct: profitPct,
            bufferPct: bufferPct,
          };

    try {
      if (isIotControlsActive || isWeldingIotActive || isEmsActive || isCpmActive) {
        await costingApi.ems.saveTemplate(payload);
      } else {
        await costingApi.saveTemplate(payload);
      }
      toast.success(`Master template for "${activeSubServiceName}" saved to database!`);
      refetchTemplate();
    } catch (err: any) {
      toast.error('Failed to save master template to database');
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleLoadTemplateDB = (template: any) => {
    if (!template) return;
    if (template.stationType) setStationType(template.stationType);
    if (template.outstationStartLocation) setOutstationStartLocation(template.outstationStartLocation);
    if (template.outstationEndLocation) setOutstationEndLocation(template.outstationEndLocation);

    if (template.isCpm || isCpmActive) {
      if (template.cpmHardwareRows && Array.isArray(template.cpmHardwareRows)) {
        setCpmHardwareRows(template.cpmHardwareRows);
      }
      if (template.cpmElectricalRows && Array.isArray(template.cpmElectricalRows)) {
        setCpmElectricalRows(template.cpmElectricalRows);
      }
      if (template.cpmCommissioningManpowerRows && Array.isArray(template.cpmCommissioningManpowerRows)) {
        setCpmCommissioningManpowerRows(template.cpmCommissioningManpowerRows);
      }
      if (template.cpmInstallationRows && Array.isArray(template.cpmInstallationRows)) {
        setCpmInstallationRows(template.cpmInstallationRows);
      }
      if (template.cpmInstallationManpowerRows && Array.isArray(template.cpmInstallationManpowerRows)) {
        setCpmInstallationManpowerRows(template.cpmInstallationManpowerRows);
      }
      if (template.cpmCloudRows && Array.isArray(template.cpmCloudRows)) {
        setCpmCloudRows(template.cpmCloudRows);
      }
      if (template.roundingNearest !== undefined) {
        setRoundingNearest(Number(template.roundingNearest));
      }
    }

    if (template.isIotControls || isIotControlsActive) {
      if (template.iotControlsHardwareRows && Array.isArray(template.iotControlsHardwareRows)) {
        setIotControlsHardwareRows(template.iotControlsHardwareRows);
      }
      if (template.iotControlsMandaysRows && Array.isArray(template.iotControlsMandaysRows)) {
        setIotControlsMandaysRows(template.iotControlsMandaysRows);
      }
      if (template.iotControlsTravelRows && Array.isArray(template.iotControlsTravelRows)) {
        setIotControlsTravelRows(template.iotControlsTravelRows);
      }
      if (template.iotControlsOpexRows && Array.isArray(template.iotControlsOpexRows)) {
        setIotControlsOpexRows(template.iotControlsOpexRows);
      }
      if (template.iotControlsRoiState && typeof template.iotControlsRoiState === 'object') {
        setIotControlsRoiState(template.iotControlsRoiState);
      }
    }

    if (template.isWeldingIot || isWeldingIotActive) {
      if (template.weldingHardwareRows && Array.isArray(template.weldingHardwareRows)) {
        setWeldingHardwareRows(template.weldingHardwareRows);
      }
      if (template.weldingSoftwareRows && Array.isArray(template.weldingSoftwareRows)) {
        setWeldingSoftwareRows(template.weldingSoftwareRows);
      }
      if (template.weldingCloudRows && Array.isArray(template.weldingCloudRows)) {
        setWeldingCloudRows(template.weldingCloudRows);
      }
      if (template.weldingInstallationRows && Array.isArray(template.weldingInstallationRows)) {
        setWeldingInstallationRows(template.weldingInstallationRows);
      }
    }

    if (template.isEms || isEmsActive) {
      if (template.emsGatewayHardwareRows && Array.isArray(template.emsGatewayHardwareRows)) {
        setEmsGatewayHardwareRows(template.emsGatewayHardwareRows);
      }
      if (template.emsElectricalHardwareRows && Array.isArray(template.emsElectricalHardwareRows)) {
        setEmsElectricalHardwareRows(template.emsElectricalHardwareRows);
      }
      if (template.emsManpowerRows && Array.isArray(template.emsManpowerRows)) setEmsManpowerRows(template.emsManpowerRows);
      if (template.emsPlatformRows && Array.isArray(template.emsPlatformRows)) setEmsPlatformRows(template.emsPlatformRows);
      if (template.emsRecurringRows && Array.isArray(template.emsRecurringRows)) setEmsRecurringRows(template.emsRecurringRows);
    }
    if (template.manpowerRows && Array.isArray(template.manpowerRows)) setManpowerRows(template.manpowerRows);
    if (template.instrumentRows && Array.isArray(template.instrumentRows)) setInstrumentRows(template.instrumentRows);
    if (template.extraExpenseRows && Array.isArray(template.extraExpenseRows)) setExtraExpenses(template.extraExpenseRows);
    if (template.marginPct !== undefined) setProfitPct(Number(template.marginPct));
    if (template.bufferPct !== undefined) setBufferPct(Number(template.bufferPct));
    toast.success(`Loaded "${template.name || activeSubServiceName}" template from database!`);
  };

  // Shared Air Audit Manpower Engine Props
  const airAuditManpowerProps = {
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
    manualJuniorDays,
    setManualJuniorDays,
    manualSeniorDays,
    setManualSeniorDays,
    manualIotDays,
    setManualIotDays,
    traineeFoodRate,
    setTraineeFoodRate,
    manualTraineeDays,
    setManualTraineeDays,
    manualTraineeFoodOverride,
    setManualTraineeFoodOverride,
    activeTraineeDays,
    traineeSiteDaysComputed,
    finalTraineeFoodCost,
    customFoodRate,
    setCustomFoodRate,
    manualCustomDays,
    setManualCustomDays,
    manualCustomFoodOverride,
    setManualCustomFoodOverride,
    activeCustomDays,
    customRoleSiteDaysComputed,
    finalCustomFoodCost,
    juniorSiteDaysComputed,
    seniorSiteDaysComputed,
    iotSiteDaysComputed,
    finalJuniorFoodCost,
    finalSeniorFoodCost,
    finalIotFoodCost,
    totalFoodCost,
    stationType,
    isLocalStationActive,
    isOutstationActive,
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
    manualInsideChennaiDays,
    setManualInsideChennaiDays,
    activeInsideChennaiDays,
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
  };

  // CPM Step 3: Dedicated Testing & Commissioning Manpower Engine Props
  const cpmCommissioningManpowerProps = {
    ...airAuditManpowerProps,
    emsManpowerRows: cpmCommissioningManpowerRows,
    setEmsManpowerRows: setCpmCommissioningManpowerRows,
    updateEmsManpowerRow: updateCpmCommissioningManpowerRow,
    addEmsManpowerRow: addCpmCommissioningManpowerRow,
    removeEmsManpowerRow: removeCpmCommissioningManpowerRow,
    emsManpowerBaseCost: cpmCommManpowerBaseCost,
    emsManpowerTotalCost: cpmCommissioningTotalCost,
    emsManpowerTotalPrice: cpmCommissioningTotalPrice,
    emsSiteExpensesTotalCost: cpmCommSiteExpensesTotalCost,
    juniorSiteDaysComputed: cpmCommJuniorDaysComputed,
    seniorSiteDaysComputed: cpmCommSeniorDaysComputed,
    iotSiteDaysComputed: cpmCommIotDaysComputed,
    traineeSiteDaysComputed: cpmCommTraineeDaysComputed,
    customSiteDaysComputed: cpmCommCustomDaysComputed,
    activeJuniorDays: cpmCommJuniorDaysComputed,
    activeSeniorDays: cpmCommSeniorDaysComputed,
    activeIotDays: cpmCommIotDaysComputed,
    activeTraineeDays: cpmCommTraineeDaysComputed,
    activeCustomDays: cpmCommCustomDaysComputed,
    finalJuniorFoodCost: cpmCommJuniorFoodCost,
    finalSeniorFoodCost: cpmCommSeniorFoodCost,
    finalIotFoodCost: cpmCommIotFoodCost,
    finalTraineeFoodCost: cpmCommTraineeFoodCost,
    finalCustomFoodCost: cpmCommCustomFoodCost,
    totalFoodCost: cpmCommTotalFoodCost,
    totalTravelCost: cpmCommTotalTravelCost,
    finalInsideChennaiTravel: cpmCommInsideChennaiTravel,
    finalOutsideChennaiTravel: cpmCommOutsideChennaiTravel,
    finalAccommodationCost: cpmCommAccommodationCost,
    activeAccommodationDays: cpmCommAccommodationDays,
    maxSiteWorkingDays: cpmCommMaxSiteDays,
  };

  // CPM Step 4: Dedicated Installation Charges Manpower Engine Props
  const cpmInstallationManpowerProps = {
    ...airAuditManpowerProps,
    emsManpowerRows: cpmInstallationManpowerRows,
    setEmsManpowerRows: setCpmInstallationManpowerRows,
    updateEmsManpowerRow: updateCpmInstallationManpowerRow,
    addEmsManpowerRow: addCpmInstallationManpowerRow,
    removeEmsManpowerRow: removeCpmInstallationManpowerRow,
    emsManpowerBaseCost: cpmInstManpowerBaseCost,
    emsManpowerTotalCost: cpmInstManpowerTotalCost,
    emsManpowerTotalPrice: cpmInstManpowerTotalPrice,
    emsSiteExpensesTotalCost: cpmInstSiteExpensesTotalCost,
    juniorSiteDaysComputed: cpmInstJuniorDaysComputed,
    seniorSiteDaysComputed: cpmInstSeniorDaysComputed,
    iotSiteDaysComputed: cpmInstIotDaysComputed,
    traineeSiteDaysComputed: cpmInstTraineeDaysComputed,
    customSiteDaysComputed: cpmInstCustomDaysComputed,
    activeJuniorDays: cpmInstJuniorDaysComputed,
    activeSeniorDays: cpmInstSeniorDaysComputed,
    activeIotDays: cpmInstIotDaysComputed,
    activeTraineeDays: cpmInstTraineeDaysComputed,
    activeCustomDays: cpmInstCustomDaysComputed,
    finalJuniorFoodCost: cpmInstJuniorFoodCost,
    finalSeniorFoodCost: cpmInstSeniorFoodCost,
    finalIotFoodCost: cpmInstIotFoodCost,
    finalTraineeFoodCost: cpmInstTraineeFoodCost,
    finalCustomFoodCost: cpmInstCustomFoodCost,
    totalFoodCost: cpmInstTotalFoodCost,
    totalTravelCost: cpmInstTotalTravelCost,
    finalInsideChennaiTravel: cpmInstInsideChennaiTravel,
    finalOutsideChennaiTravel: cpmInstOutsideChennaiTravel,
    finalAccommodationCost: cpmInstAccommodationCost,
    activeAccommodationDays: cpmInstAccommodationDays,
    maxSiteWorkingDays: cpmInstMaxSiteDays,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <CostingHeader
        clientName={clientName}
        setClientName={setClientName}
        clientOptions={clientOptions}
        activeProjectName={activeProjectName}
        activeServiceScope={activeServiceScope}
        mainCategoryService={mainCategoryService}
        setMainCategoryService={setMainCategoryService}
        customCategoryText={customCategoryText}
        setCustomCategoryText={setCustomCategoryText}
        subServiceOption={subServiceOption}
        setSubServiceOption={(sub) => {
          setSubServiceOption(sub);
          if (sub.toLowerCase().includes('digiweld')) {
            setWeldingHardwareRows([]);
            setWeldingSoftwareRows(INITIAL_DIGIWELD_SOFTWARE_ROWS);
            setWeldingCloudRows(INITIAL_DIGIWELD_CLOUD_ROWS);
            setWeldingInstallationRows([]);
            setProfitPct(0);
            setBufferPct(0);
          } else if (sub.toLowerCase().includes('welding')) {
            setWeldingHardwareRows(INITIAL_WELDING_HARDWARE_ROWS);
            setWeldingSoftwareRows(INITIAL_WELDING_SOFTWARE_ROWS);
            setWeldingCloudRows(INITIAL_WELDING_CLOUD_ROWS);
            setWeldingInstallationRows(INITIAL_WELDING_INSTALLATION_ROWS);
            setProfitPct(40);
            setBufferPct(10);
          }
        }}
        customSubServiceText={customSubServiceText}
        setCustomSubServiceText={setCustomSubServiceText}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        customProjectText={customProjectText}
        setCustomProjectText={setCustomProjectText}
        stationType={stationType}
        handleStationTypeChange={(t) => setStationType(t)}
        syncAllSiteDays={syncAllSiteDays}
        resetToModelDefaults={resetToModelDefaults}
        exportCSV={exportCSV}
        dynamicEnergyAuditSubServices={dynamicEnergyAuditSubServices}
        dynamicIotServicesSubServices={dynamicIotServicesSubServices}
        dynamicChillerManagementSubServices={CHILLER_MANAGEMENT_SUB_SERVICES}
        dynamicWeldingIotSubServices={dynamicWeldingIotSubServices}
        dynamicAutomationSubServices={AUTOMATION_SUB_SERVICES}
        dynamicHardwareSubServices={dynamicHardwareSubServices}
        dynamicProjectsSubServices={dynamicProjectsSubServices}
      />

      {/* Main Tabular Template Engine Switcher */}
      {isCpmActive ? (
        <CpmCostingTemplate
          activeSubServiceName={activeSubServiceName}
          cpmHardwareRows={cpmHardwareRows}
          updateCpmHardwareRow={updateCpmHardwareRow}
          addCpmHardwareRow={addCpmHardwareRow}
          removeCpmHardwareRow={removeCpmHardwareRow}
          cpmHardwareTotalCost={cpmHardwareTotalCost}
          cpmHardwareTotalPrice={cpmHardwareTotalPrice}
          cpmElectricalRows={cpmElectricalRows}
          updateCpmElectricalRow={updateCpmElectricalRow}
          addCpmElectricalRow={addCpmElectricalRow}
          removeCpmElectricalRow={removeCpmElectricalRow}
          cpmElectricalTotalCost={cpmElectricalTotalCost}
          cpmElectricalTotalPrice={cpmElectricalTotalPrice}
          cpmCommissioningProps={cpmCommissioningManpowerProps}
          cpmCommissioningTotalCost={cpmCommissioningTotalCost}
          cpmCommissioningTotalPrice={cpmCommissioningTotalPrice}
          cpmInstallationProps={cpmInstallationManpowerProps}
          cpmInstManpowerTotalCost={cpmInstManpowerTotalCost}
          cpmInstManpowerTotalPrice={cpmInstManpowerTotalPrice}
          cpmCloudRows={cpmCloudRows}
          updateCpmCloudRow={updateCpmCloudRow}
          addCpmCloudRow={addCpmCloudRow}
          removeCpmCloudRow={removeCpmCloudRow}
          cpmCloudTotalCost={cpmCloudTotalCost}
          cpmCloudTotalPrice={cpmCloudTotalPrice}
          cpmSteps1To5TotalPrice={cpmSteps1To5TotalPrice}
          cpmBufferAmount={cpmBufferAmount}
          cpmPriceWithBuffer={cpmPriceWithBuffer}
          cpmRoundedCustomerCost={cpmRoundedCustomerCost}
          bufferPct={bufferPct}
          setBufferPct={setBufferPct}
          profitPct={profitPct}
          setProfitPct={setProfitPct}
          resetCpmDefaults={resetCpmDefaults}
          applyCpmGlobalMargin={applyCpmGlobalMargin}
          roundingNearest={roundingNearest}
          setRoundingNearest={setRoundingNearest}
        />
      ) : isIotControlsActive ? (
        <IotControlsTemplate
          {...airAuditManpowerProps}
          activeSubServiceName={activeSubServiceName}
          iotHardwareTotalPrice={iotHardwareTotalPrice}
          iotControlsHardwareRows={iotControlsHardwareRows}
          updateIotControlsHardwareRow={updateIotControlsHardwareRow}
          addIotControlsHardwareRow={addIotControlsHardwareRow}
          removeIotControlsHardwareRow={removeIotControlsHardwareRow}
          iotOpexTotalYearly={iotOpexTotalYearly}
          iotControlsOpexRows={iotControlsOpexRows}
          updateIotControlsOpexRow={updateIotControlsOpexRow}
          addIotControlsOpexRow={addIotControlsOpexRow}
          removeIotControlsOpexRow={removeIotControlsOpexRow}
          iotControlsRoiState={iotControlsRoiState}
          updateIotControlsRoiState={updateIotControlsRoiState}
          roiPaybackMonths={roiPaybackMonths}
          roiCustomerSharePct={roiCustomerSharePct}
          roiExpectedSavingsAvgPct={roiExpectedSavingsAvgPct}
          roiEnergyCostY1={roiEnergyCostY1}
          roiEnergyCostY2={roiEnergyCostY2}
          roiEnergyCostY3={roiEnergyCostY3}
          roiEnergyCostY4={roiEnergyCostY4}
          roiEnergyCostY5={roiEnergyCostY5}
          roiEnergyCostTotal={roiEnergyCostTotal}
          roiCapexY1={roiCapexY1}
          roiCapexY2={roiCapexY2}
          roiCapexY3={roiCapexY3}
          roiCapexY4={roiCapexY4}
          roiCapexY5={roiCapexY5}
          roiCapexTotal={roiCapexTotal}
          roiOpexY1={roiOpexY1}
          roiOpexY2={roiOpexY2}
          roiOpexY3={roiOpexY3}
          roiOpexY4={roiOpexY4}
          roiOpexY5={roiOpexY5}
          roiOpexTotal={roiOpexTotal}
          roiTotalExpenseY1={roiTotalExpenseY1}
          roiTotalExpenseY2={roiTotalExpenseY2}
          roiTotalExpenseY3={roiTotalExpenseY3}
          roiTotalExpenseY4={roiTotalExpenseY4}
          roiTotalExpenseY5={roiTotalExpenseY5}
          roiTotalExpenseTotal={roiTotalExpenseTotal}
          roiSavingsPctY1={roiSavingsPctY1}
          roiSavingsPctY2={roiSavingsPctY2}
          roiSavingsPctY3={roiSavingsPctY3}
          roiSavingsPctY4={roiSavingsPctY4}
          roiSavingsPctY5={roiSavingsPctY5}
          roiSavingsAmountY1={roiSavingsAmountY1}
          roiSavingsAmountY2={roiSavingsAmountY2}
          roiSavingsAmountY3={roiSavingsAmountY3}
          roiSavingsAmountY4={roiSavingsAmountY4}
          roiSavingsAmountY5={roiSavingsAmountY5}
          roiSavingsAmountTotal={roiSavingsAmountTotal}
          roiGrossBenefitY1={roiGrossBenefitY1}
          roiGrossBenefitY2={roiGrossBenefitY2}
          roiGrossBenefitY3={roiGrossBenefitY3}
          roiGrossBenefitY4={roiGrossBenefitY4}
          roiGrossBenefitY5={roiGrossBenefitY5}
          roiGrossBenefitTotal={roiGrossBenefitTotal}
          roiNetBenefitY1={roiNetBenefitY1}
          roiNetBenefitY2={roiNetBenefitY2}
          roiNetBenefitY3={roiNetBenefitY3}
          roiNetBenefitY4={roiNetBenefitY4}
          roiNetBenefitY5={roiNetBenefitY5}
          resetIotControlsDefaults={resetIotControlsDefaults}
        />
      ) : isWeldingIotActive ? (
        <WeldingIotTemplate
          activeSubServiceName={activeSubServiceName}
          weldingHardwareRows={weldingHardwareRows}
          updateWeldingHardwareRow={updateWeldingHardwareRow}
          addWeldingHardwareRow={addWeldingHardwareRow}
          removeWeldingHardwareRow={removeWeldingHardwareRow}
          weldingHardwareTotalCost={weldingHardwareTotalCost}
          weldingHardwareTotalPrice={weldingHardwareTotalPrice}
          weldingSoftwareRows={weldingSoftwareRows}
          updateWeldingSoftwareRow={updateWeldingSoftwareRow}
          addWeldingSoftwareRow={addWeldingSoftwareRow}
          removeWeldingSoftwareRow={removeWeldingSoftwareRow}
          weldingSoftwareTotalPrice={weldingSoftwareTotalPrice}
          weldingCloudRows={weldingCloudRows}
          updateWeldingCloudRow={updateWeldingCloudRow}
          addWeldingCloudRow={addWeldingCloudRow}
          removeWeldingCloudRow={removeWeldingCloudRow}
          weldingCloudTotalMonthly={weldingCloudTotalMonthly}
          weldingCloudTotalYearly={weldingCloudTotalYearly}
          weldingInstallationRows={weldingInstallationRows}
          updateWeldingInstallationRow={updateWeldingInstallationRow}
          addWeldingInstallationRow={addWeldingInstallationRow}
          removeWeldingInstallationRow={removeWeldingInstallationRow}
          weldingInstallationTotalCost={weldingInstallationTotalCost}
          weldingInstallationTotalPrice={weldingInstallationTotalPrice}
          weldingSteps1To4TotalPrice={weldingSteps1To4TotalPrice}
          weldingBufferAmount={weldingBufferAmount}
          weldingPriceWithBuffer={weldingPriceWithBuffer}
          weldingGrandTotal={weldingGrandTotal}
          profitPct={profitPct}
          setProfitPct={setProfitPct}
          applyWeldingGlobalMargin={applyWeldingGlobalMargin}
          bufferPct={bufferPct}
          setBufferPct={setBufferPct}
          resetWeldingIotDefaults={resetWeldingIotDefaults}
        />
      ) : isEmsActive ? (
        <EmsCostingTemplate
          {...airAuditManpowerProps}
          activeSubServiceName={activeSubServiceName}
          emsGatewayHardwareRows={emsGatewayHardwareRows}
          updateEmsGatewayHardwareRow={updateEmsGatewayHardwareRow}
          addEmsGatewayHardwareRow={addEmsGatewayHardwareRow}
          removeEmsGatewayHardwareRow={removeEmsGatewayHardwareRow}
          emsGatewayHardwareTotalCost={emsGatewayHardwareTotalCost}
          emsGatewayHardwareTotalPrice={emsGatewayHardwareTotalPrice}
          emsElectricalHardwareRows={emsElectricalHardwareRows}
          updateEmsElectricalHardwareRow={updateEmsElectricalHardwareRow}
          addEmsElectricalHardwareRow={addEmsElectricalHardwareRow}
          removeEmsElectricalHardwareRow={removeEmsElectricalHardwareRow}
          emsElectricalHardwareTotalCost={emsElectricalHardwareTotalCost}
          emsElectricalHardwareTotalPrice={emsElectricalHardwareTotalPrice}
          emsHardwareTotalCost={emsHardwareTotalCost}
          emsHardwareTotalPrice={emsHardwareTotalPrice}
          emsPlatformRows={emsPlatformRows}
          updateEmsPlatformRow={updateEmsPlatformRow}
          addEmsPlatformRow={addEmsPlatformRow}
          removeEmsPlatformRow={removeEmsPlatformRow}
          emsPlatformTotalCost={emsPlatformTotalCost}
          emsPlatformTotalPrice={emsPlatformTotalPrice}
          emsRecurringRows={emsRecurringRows}
          updateEmsRecurringRow={updateEmsRecurringRow}
          addEmsRecurringRow={addEmsRecurringRow}
          removeEmsRecurringRow={removeEmsRecurringRow}
          emsRecurringMonthlyTotalCost={emsRecurringMonthlyTotalCost}
          emsRecurringMonthlyTotalPrice={emsRecurringMonthlyTotalPrice}
          emsRecurringYearlyTotalCost={emsRecurringYearlyTotalCost}
          emsRecurringYearlyTotalPrice={emsRecurringYearlyTotalPrice}
          emsSteps1To4TotalPrice={emsSteps1To4TotalPrice}
          emsBufferAmount={emsBufferAmount}
          emsPriceWithBuffer={emsPriceWithBuffer}
          emsRoundedCustomerCost={emsRoundedCustomerCost}
          bufferPct={bufferPct}
          setBufferPct={setBufferPct}
          resetEmsDefaults={resetEmsDefaults}
          roundingNearest={roundingNearest}
          setRoundingNearest={setRoundingNearest}
        />
      ) : (
        <StandardAuditTemplate
          activeSubServiceName={activeSubServiceName}
          manpowerRows={manpowerRows}
          setManpowerRows={setManpowerRows}
          updateManpowerRow={updateManpowerRow}
          addManpowerRow={addManpowerRow}
          removeManpowerRow={removeManpowerRow}
          instrumentRows={instrumentRows}
          updateInstrumentRow={updateInstrumentRow}
          addInstrumentRow={addInstrumentRow}
          removeInstrumentRow={removeInstrumentRow}
          extraExpenses={extraExpenses}
          addExtraExpense={addExtraExpense}
          updateExtraExpense={updateExtraExpense}
          removeExtraExpense={removeExtraExpense}
          manWorkingCost={manWorkingCost}
          manualManpowerOverride={manualManpowerOverride}
          setManualManpowerOverride={setManualManpowerOverride}
          instrumentRentalCost={instrumentRentalCost}
          totalAmountForSite={totalAmountForSite}
          juniorFoodRate={juniorFoodRate}
          setJuniorFoodRate={setJuniorFoodRate}
          manualJuniorFoodOverride={manualJuniorFoodOverride}
          setManualJuniorFoodOverride={setManualJuniorFoodOverride}
          seniorFoodRate={seniorFoodRate}
          setSeniorFoodRate={setSeniorFoodRate}
          manualSeniorFoodOverride={manualSeniorFoodOverride}
          setManualSeniorFoodOverride={setManualSeniorFoodOverride}
          iotFoodRate={iotFoodRate}
          setIotFoodRate={setIotFoodRate}
          manualIotFoodOverride={manualIotFoodOverride}
          setManualIotFoodOverride={setManualIotFoodOverride}
          activeJuniorDays={activeJuniorDays}
          activeSeniorDays={activeSeniorDays}
          activeIotDays={activeIotDays}
          activeTraineeDays={activeTraineeDays}
          activeCustomDays={activeCustomDays}
          manualJuniorDays={manualJuniorDays}
          setManualJuniorDays={setManualJuniorDays}
          manualSeniorDays={manualSeniorDays}
          setManualSeniorDays={setManualSeniorDays}
          manualIotDays={manualIotDays}
          setManualIotDays={setManualIotDays}
          traineeFoodRate={traineeFoodRate}
          setTraineeFoodRate={setTraineeFoodRate}
          manualTraineeDays={manualTraineeDays}
          setManualTraineeDays={setManualTraineeDays}
          manualTraineeFoodOverride={manualTraineeFoodOverride}
          setManualTraineeFoodOverride={setManualTraineeFoodOverride}
          customFoodRate={customFoodRate}
          setCustomFoodRate={setCustomFoodRate}
          manualCustomDays={manualCustomDays}
          setManualCustomDays={setManualCustomDays}
          manualCustomFoodOverride={manualCustomFoodOverride}
          setManualCustomFoodOverride={setManualCustomFoodOverride}
          juniorSiteDaysComputed={juniorSiteDaysComputed}
          seniorSiteDaysComputed={seniorSiteDaysComputed}
          iotSiteDaysComputed={iotSiteDaysComputed}
          traineeSiteDaysComputed={traineeSiteDaysComputed}
          customRoleSiteDaysComputed={customRoleSiteDaysComputed}
          finalJuniorFoodCost={finalJuniorFoodCost}
          finalSeniorFoodCost={finalSeniorFoodCost}
          finalIotFoodCost={finalIotFoodCost}
          finalTraineeFoodCost={finalTraineeFoodCost}
          finalCustomFoodCost={finalCustomFoodCost}
          stationType={stationType}
          isLocalStationActive={isLocalStationActive}
          isOutstationActive={isOutstationActive}
          outstationStartLocation={outstationStartLocation}
          setOutstationStartLocation={setOutstationStartLocation}
          outstationEndLocation={outstationEndLocation}
          setOutstationEndLocation={setOutstationEndLocation}
          outstationDistanceKms={outstationDistanceKms}
          setOutstationDistanceKms={setOutstationDistanceKms}
          selectedSites={selectedSites}
          removeSelectedSite={removeSelectedSite}
          showSiteDropdown={showSiteDropdown}
          setShowSiteDropdown={setShowSiteDropdown}
          siteDropdownRef={siteDropdownRef}
          renderSiteDropdownContent={renderSiteDropdownContent}
          insideChennaiDistanceKms={insideChennaiDistanceKms}
          setInsideChennaiDistanceKms={setInsideChennaiDistanceKms}
          insideChennaiRatePerKm={insideChennaiRatePerKm}
          setInsideChennaiRatePerKm={setInsideChennaiRatePerKm}
          manualInsideChennaiDays={manualInsideChennaiDays}
          setManualInsideChennaiDays={setManualInsideChennaiDays}
          activeInsideChennaiDays={activeInsideChennaiDays}
          manualInsideChennaiOverride={manualInsideChennaiOverride}
          setManualInsideChennaiOverride={setManualInsideChennaiOverride}
          finalInsideChennaiTravel={finalInsideChennaiTravel}
          outsideChennaiBusCost={outsideChennaiBusCost}
          setOutsideChennaiBusCost={setOutsideChennaiBusCost}
          outsideChennaiCabCost={outsideChennaiCabCost}
          setOutsideChennaiCabCost={setOutsideChennaiCabCost}
          outsideChennaiTrainCost={outsideChennaiTrainCost}
          setOutsideChennaiTrainCost={setOutsideChennaiTrainCost}
          outsideChennaiFlightCost={outsideChennaiFlightCost}
          setOutsideChennaiFlightCost={setOutsideChennaiFlightCost}
          manualOutsideChennaiOverride={manualOutsideChennaiOverride}
          setManualOutsideChennaiOverride={setManualOutsideChennaiOverride}
          finalOutsideChennaiTravel={finalOutsideChennaiTravel}
          selectedAccommodationTier={selectedAccommodationTier}
          setSelectedAccommodationTier={setSelectedAccommodationTier}
          isCustomAccommodationRate={isCustomAccommodationRate}
          setIsCustomAccommodationRate={setIsCustomAccommodationRate}
          customAccommodationRate={customAccommodationRate}
          setCustomAccommodationRate={setCustomAccommodationRate}
          manualAccommodationDays={manualAccommodationDays}
          setManualAccommodationDays={setManualAccommodationDays}
          activeAccommodationDays={activeAccommodationDays}
          maxSiteWorkingDays={maxSiteWorkingDays}
          finalAccommodationCost={finalAccommodationCost}
          manualAccommodationOverride={manualAccommodationOverride}
          setManualAccommodationOverride={setManualAccommodationOverride}
          costTotal={costTotal}
          profitPct={profitPct}
          setProfitPct={setProfitPct}
          profitAmount={profitAmount}
          basePrice={basePrice}
          bufferPct={bufferPct}
          setBufferPct={setBufferPct}
          ourQuoteAmount={ourQuoteAmount}
          negotiationMarginPct={negotiationMarginPct}
          setNegotiationMarginPct={setNegotiationMarginPct}
          totalFoodCost={totalFoodCost}
          totalTravelCost={totalTravelCost}
          customExpensesTotal={customExpensesTotal}
          roundingNearest={roundingNearest}
          setRoundingNearest={setRoundingNearest}
        />
      )}

      {/* Summary Footer Card */}
      <CostingSummaryCard
        activeSubServiceName={activeSubServiceName}
        dbTemplate={dbTemplate}
        handleLoadTemplateDB={handleLoadTemplateDB}
        handleSaveMasterTemplateDB={handleSaveMasterTemplateDB}
        isSavingTemplate={isSavingTemplate}
        handleSaveCostingSheetDB={handleSaveCostingSheetDB}
        isSavingSheet={isSavingSheet}
      />
    </div>
  );
}

export default function CostingSheetPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading costing sheet...</div>}>
      <CostingSheetContent />
    </Suspense>
  );
}

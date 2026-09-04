'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Users,
  Wrench,
  Building,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Hash,
  Image as ImageIcon,
  Upload,
  X,
  Edit3,
  Check,
  Search,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Layers,
  CheckSquare,
  Square,
  ChevronUp,
  Receipt,
  Cpu,
  Network,
} from 'lucide-react';
import { toast } from 'sonner';
import { servicesApi } from '@/lib/api/services';
import { rateCardsApi } from '@/lib/api/rateCards';
import { dealsApi } from '@/lib/api/deals';
import { quotesApi } from '@/lib/api/quotes';
import { clientsApi, ClientItem } from '@/lib/api/clients';
import { costingApi } from '@/lib/api/costing';
import { proposalsApi } from '@/lib/api/proposals';
import { ASSESSMENT_ASSETS } from '@/lib/constants/assessment-assets';
import {
  INITIAL_WELDING_HARDWARE_ROWS,
  INITIAL_WELDING_SOFTWARE_ROWS,
  INITIAL_WELDING_CLOUD_ROWS,
  INITIAL_WELDING_INSTALLATION_ROWS,
  INITIAL_IOT_CONTROLS_HARDWARE_ROWS,
  INITIAL_IOT_CONTROLS_MANDAYS_ROWS,
  INITIAL_IOT_CONTROLS_OPEX_ROWS,
  INITIAL_EMS_GATEWAY_HARDWARE_ROWS,
  INITIAL_EMS_ELECTRICAL_HARDWARE_ROWS,
  INITIAL_EMS_MANPOWER_ROWS,
  INITIAL_EMS_PLATFORM_ROWS,
  INITIAL_EMS_RECURRING_ROWS,
  DEFAULT_IR_BLASTER_STEP5_TEXT,
  DEFAULT_IR_BLASTER_STEP6_TEXT,
  DEFAULT_IAQ_SENSOR_STEP5_TEXT,
  DEFAULT_IAQ_SENSOR_STEP6_TEXT,
  DEFAULT_COMPRESSED_AIR_AUTOMATION_STEP5_TEXT,
  DEFAULT_COMPRESSED_AIR_AUTOMATION_STEP6_TEXT,
  DEFAULT_WELDING_STEP5_TEXT,
  DEFAULT_WELDING_STEP6_TEXT,
  DEFAULT_WATER_MANAGEMENT_STEP5_TEXT,
  DEFAULT_WATER_MANAGEMENT_STEP6_TEXT,
  DEFAULT_ENERGY_AUDIT_STEP5_TEXT,
  DEFAULT_ENERGY_AUDIT_STEP6_TEXT,
  DEFAULT_ASHRAE_LEVEL_2_STEP5_TEXT,
  DEFAULT_ASHRAE_LEVEL_2_STEP6_TEXT,
  DEFAULT_HVAC_DESIGN_STEP5_TEXT,
  DEFAULT_HVAC_DESIGN_STEP6_TEXT,
  DEFAULT_EC_FAN_STEP5_TEXT,
  DEFAULT_EC_FAN_STEP6_TEXT,
  DEFAULT_COMPRESSOR_AIR_LEAKAGE_RECTIFICATION_STEP5_TEXT,
  DEFAULT_COMPRESSOR_AIR_LEAKAGE_RECTIFICATION_STEP6_TEXT,
  DEFAULT_COMPRESSOR_AIR_AUDIT_STEP5_TEXT,
  DEFAULT_COMPRESSOR_AIR_AUDIT_STEP6_TEXT,
  DEFAULT_MIXTURE_GAS_LEAKAGE_AUDIT_STEP5_TEXT,
  DEFAULT_MIXTURE_GAS_LEAKAGE_AUDIT_STEP6_TEXT,
  DEFAULT_NITROGEN_GAS_LEAKAGE_AUDIT_STEP5_TEXT,
  DEFAULT_NITROGEN_GAS_LEAKAGE_AUDIT_STEP6_TEXT,
  DEFAULT_DEW_POINT_STEP5_TEXT,
  DEFAULT_DEW_POINT_STEP6_TEXT,
  DEFAULT_TEMPERATURE_SENSOR_STEP5_TEXT,
  DEFAULT_TEMPERATURE_SENSOR_STEP6_TEXT,
  DEFAULT_FLANGES_STEP5_TEXT,
  DEFAULT_FLANGES_STEP6_TEXT,
  DEFAULT_CPM_STEP5_TEXT,
  DEFAULT_CPM_STEP6_TEXT,
  DEFAULT_ISO_50001_STEP5_TEXT,
  DEFAULT_ISO_50001_STEP6_TEXT,
  DEFAULT_DIGIWELD_STEP5_TEXT,
  DEFAULT_DIGIWELD_STEP6_TEXT,
  INITIAL_DIGIWELD_SOFTWARE_ROWS,
  INITIAL_DIGIWELD_CLOUD_ROWS,
  DEFAULT_COMPRESSOR_ROI_DATA,
  CompressorRoiData,
  DEFAULT_ENERGY_AUDIT_SCOPE_CARDS,
  ENERGY_AUDIT_TRACK_RECORD_CLIENTS,
  INITIAL_WATER_MANAGEMENT_GATEWAY_HARDWARE_ROWS,
  INITIAL_WATER_MANAGEMENT_ELECTRICAL_HARDWARE_ROWS,
  INITIAL_WATER_MANAGEMENT_PLATFORM_ROWS,
  INITIAL_WATER_MANAGEMENT_RECURRING_ROWS,
  DEFAULT_CLIENT_OPTIONS,
  getClientPresetLogo,
} from '@/components/costing/constants';
import { calcPriceFromCost, roundToHundred } from '@/components/costing/utils';
import { formatCurrency } from '@/lib/utils';
import QuoteSummaryCard from '@/components/quotes/QuoteSummaryCard';
import FullPageWatermark from '@/components/common/FullPageWatermark';

const DEFAULT_CLIENTS = [
  'KONE Elevators India',
  'MRF Tyres',
  'Panasonic Life Solutions',
  'Tata Electronics',
  'Knauf',
  'Gestamp',
  'Gestamp India',
  'Flextronics',
  'Solid Pro',
  'Sags Apparels',
  'JN Machineries',
  'PMEL India Pvt Ltd',
  'Velmurugan Industries',
  'Wheels India',
  'Whirlpool',
  'IMOP',
  'Lucas TVS',
  'Polyhose',
  'SRM IST College Campus',
  'KPR Mill Ltd',
  'Dash Renewable Energy',
  'Aatral Engineering',
  'Visalam Energy',
  'Parekh Place India Pvt',
  'ITC',
  'CII',
  'Tidel Park',
  'Chemech',
  'Casagrand',
  'HT Bharani Clothing',
  'Knauf',
  'ABT Maruti',
  'Adam Compressors',
  'Aisan auto parts',
  'Alstom',
  'ANTB',
  'Arun Plasto',
  'Apollo Tyres',
  'Ashveera Elgi Dealer',
  'Bharat Forge',
  'Bluestar-climatech',
  'Bull India',
  'Century panels',
  'Cholayil',
  'Chloride Metals Limited',
  'Coburg Engineering',
  'Danfoss Industries Ltd',
  'Denali',
  'DLF Porur',
  'Endurance',
  'Enfield Air Technologies',
  'ES Electronics',
  'Featherlite',
  'Fusion Engineering Kaeser Dealer',
  'Fuso Glass',
  'Grasim Industries',
  'Hatsun',
  'Hine Hydraulics',
  'IGCAR',
  'IMOP',
  'India Japan Lighting',
  'JN Machineries',
  'KKP Spinning mill',
  'Knauf',
  'Komter Equipments',
  'KPR Mill Ltd',
  'L&T Valves Ltd',
  'Lucas TVS Padi',
  'Lucas TVS -pondichery',
  'Madras Hydraulics',
  'Mahindra & Mahindra',
  'Manatec',
  'MAS Udyag',
  'Maxair',
  'Meenakshi Pneumatics',
  'Michelin Tyres',
  'Microlabs',
  'Moon beverages',
  'MRF Tyres',
  'Panasonic Life Solutions',
  'Piramal Pharma',
  'PMEL India Pvt Ltd',
  'Pneumsys',
  'Polyhose ',
  'Purple Star',
  'RK Industries',
  'Rockwool',
  'Royal Enfield',
  'Senvion Wind Energy',
  'SFL Hot & Warm',
  'SFL Wind unit',
  'Sharda Motors',
  'Solidpro',
  'SRM Glowguard ',
  'SRM IST College Campus',
  'SRM IST Valliammai Campus',
  'Star Engineering Kaeser Dealer',
  'Suguna Foods',
  'Sungwoo India AP',
  'Sags Apparels',
  'TAFE',
  'TAPCO Pneumatics',
  'Tata Electronics',
  'TVS Two Wheeler',
  'Vajram Apartments',
  'Varroc Lighting',
  'Velammal Nexus',
  'Vishnu Cars',
  'Velmurugan Industries',
  'Whirlpool - pune',
  'Whirlpool - pondichery',
  'Wheels India EEPD division',
  'Wheels India Fab Unit',
  'Wheels India Sriperampudur unit',
  'World Trade Center - Brigade group',
];

function NewQuoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editQuoteId = searchParams?.get('editQuoteId') || searchParams?.get('quoteId') || null;
  const queryClient = useQueryClient();

  // Form State
  const [proposalNumber, setProposalNumber] = useState('STPL-001');
  const [isManualProposalNumber, setIsManualProposalNumber] = useState(false);
  const [proposalDate, setProposalDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [clientLogo, setClientLogo] = useState<string | null>(null);
  const [logoInputType, setLogoInputType] = useState<'upload' | 'url'>('upload');
  const [logoUrl, setLogoUrl] = useState('');

  // Default & Custom Client Selection State
  const [clientList] = useState<string[]>(DEFAULT_CLIENTS);
  const [clientName, setClientName] = useState('');
  const [isCustomClient, setIsCustomClient] = useState(false);
  const [customClientName, setCustomClientName] = useState('');
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editingClientName, setEditingClientName] = useState('');

  // Fetch Existing Quote if in Edit Mode
  const { data: existingQuote } = useQuery({
    queryKey: ['quote', editQuoteId],
    queryFn: () => quotesApi.getOne(editQuoteId!),
    enabled: !!editQuoteId,
  });

  // Query all proposals to calculate next sequential proposal number for new quotes
  const { data: allProposals = [] } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => proposalsApi.getAll(),
  });

  // Searchable Dropdown Combobox State
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const clientDropdownRef = useRef<HTMLDivElement>(null);

  // Category & Sub-Services Constants
  const SERVICE_CATEGORY_OPTIONS = [
    'Energy Audit Services',
    'IoT & Controls',
    'Chiller Management',
    'Welding',
    'Automation',
    'IR Blaster',
    'BMS',
    'Hardware',
  ];

  const IR_BLASTER_SUB_SERVICES = [
    'Old IR Blaster',
    'New IR Blaster',
  ];

  const BMS_CATEGORY_SUB_SERVICES = [
    'BMS',
  ];

  const CHILLER_MANAGEMENT_SUB_SERVICES = [
    'CPM (Chiller Plant Management)',
  ];

  const AUTOMATION_SUB_SERVICES = [
    'Compressed Air Automation',
    'Water Automation',
  ];

  const ENERGY_AUDIT_SUB_SERVICES = [
    'Compressor Air Leakage rectification',
    'Compressor air leakage audit',
    'Nitrogen Gas Leakage Audit',
    'Mixture Gas Leakage Audit',
    'Energy Audit',
    'Electrical Safety Audit',
    'Fire Safety Audit',
    'ASHRAE Level 2',
    'EC Fan',
    'HVAC Design',
    'ISO 50001',
  ];
  const PROJECTS_SUB_SERVICES = ['Optibyte', 'Digiweld', 'Tec Byte', 'Fix Byte', 'Compass'];
  const IOT_SERVICES_SUB_SERVICES = [
    'Energy Management Solution',
    'Compressed Air Monitoring',
    'IoT Platform',
    'Water Management Solution',
  ];
  const WELDING_IOT_SUB_SERVICES = [
    'Welding IoT Kit',
    'Digiweld',
  ];
  const HARDWARE_SUB_SERVICES = [
    'Dew Point',
    'Flanges',
    'Flowmeter',
    'IAQ Sensor',
    'Temperature Sensor',
  ];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Energy Audit Services']);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const mainCategoryService = selectedCategories.join(', ');
  const [selectedSubServiceOptions, setSelectedSubServiceOptions] = useState<string[]>(['Compressor air leakage audit']);
  const [isSubServicesDropdownOpen, setIsSubServicesDropdownOpen] = useState(false);
  const subServicesDropdownRef = useRef<HTMLDivElement>(null);

  const hasLoadedExistingQuoteRef = useRef(false);
  const lastSubServiceRef = useRef<string>('');

  // Populate Existing Quote into Form State when editing
  useEffect(() => {
    if (existingQuote) {
      const qAny = existingQuote as any;
      if (qAny.proposalNumber || qAny.proposal?.proposalNumber || qAny.proposals?.[0]?.proposalNumber) {
        setProposalNumber(qAny.proposalNumber || qAny.proposal?.proposalNumber || qAny.proposals?.[0]?.proposalNumber);
        setIsManualProposalNumber(true);
      }
      if (qAny.proposalDate) {
        setProposalDate(new Date(qAny.proposalDate).toISOString().split('T')[0]);
      }
      if (qAny.deal?.clientName) {
        setClientName(qAny.deal.clientName);
      }
      if (qAny.clientLogo || qAny.deal?.clientLogo) {
        setClientLogo(qAny.clientLogo || qAny.deal?.clientLogo);
      }
      const rawCat =
        qAny.customContent?.costingSheet?.serviceCategory ||
        qAny.customContent?.serviceCategory ||
        qAny.category ||
        qAny.service?.category ||
        qAny.deal?.service?.category ||
        qAny.deal?.category;
      if (rawCat) {
        setSelectedCategories([rawCat]);
      }
      const rawSub =
        qAny.customContent?.costingSheet?.subService ||
        qAny.customContent?.subService ||
        qAny.proposals?.[0]?.customContent?.costingSheet?.subService ||
        qAny.proposals?.[0]?.customContent?.subService ||
        qAny.subService ||
        qAny.serviceName ||
        qAny.deal?.subService ||
        qAny.deal?.serviceName ||
        qAny.service?.name ||
        qAny.deal?.service?.name;
      if (rawSub) {
        setSelectedSubServiceOptions([rawSub]);
      }
      if (qAny.marginPct !== undefined && qAny.marginPct !== null) {
        setMarginPct(Number(qAny.marginPct));
      }
      if (qAny.bufferPct !== undefined && qAny.bufferPct !== null) {
        setBufferPct(Number(qAny.bufferPct));
      }
      if (qAny.siteDays) {
        setSiteDays(qAny.siteDays);
      }
      if (qAny.reportDays) {
        setReportDays(qAny.reportDays);
      }
      if (qAny.travelKms !== undefined) {
        setTravelKms(Number(qAny.travelKms));
      }
      if (qAny.travelRatePerKm !== undefined) {
        setTravelRatePerKm(Number(qAny.travelRatePerKm));
      }
      if (qAny.foodRatePerPersonDay !== undefined) {
        setFoodRatePerPersonDay(Number(qAny.foodRatePerPersonDay));
      }
      if (qAny.foodTravelCost !== undefined) {
        setFoodTravelCost(Number(qAny.foodTravelCost));
      }
      if (qAny.teamMembers && Array.isArray(qAny.teamMembers) && qAny.teamMembers.length > 0) {
        setTeamMembers(qAny.teamMembers);
      }
      if (qAny.instruments && Array.isArray(qAny.instruments) && qAny.instruments.length > 0) {
        setInstruments(qAny.instruments);
      }
      const isSubCompAudit =
        (rawSub && rawSub.toLowerCase().includes('compressor air leakage audit')) ||
        (qAny.deal?.subService && qAny.deal.subService.toLowerCase().includes('compressor air leakage audit'));
      const savedStep5 =
        qAny.customContent?.scopeOfWork ||
        qAny.customContent?.step5Text ||
        qAny.scopeDetails ||
        qAny.proposals?.[0]?.customContent?.step5Text ||
        qAny.proposals?.[0]?.scopeDetails;
      if (savedStep5) {
        if (isSubCompAudit && (savedStep5.includes('How the compressed air wasting your money') || !savedStep5.includes('Methodology Overview'))) {
          setEmsStep5Text(DEFAULT_COMPRESSOR_AIR_AUDIT_STEP5_TEXT);
        } else {
          setEmsStep5Text(savedStep5);
        }
      } else if (isSubCompAudit) {
        setEmsStep5Text(DEFAULT_COMPRESSOR_AIR_AUDIT_STEP5_TEXT);
      }
      const savedStep6 =
        qAny.customContent?.step6Text ||
        qAny.proposals?.[0]?.customContent?.step6Text;
      if (savedStep6) {
        if (isSubCompAudit && !savedStep6.includes('Support required from the client:')) {
          setEmsStep6Text(DEFAULT_COMPRESSOR_AIR_AUDIT_STEP6_TEXT);
        } else {
          setEmsStep6Text(savedStep6);
        }
      } else if (isSubCompAudit) {
        setEmsStep6Text(DEFAULT_COMPRESSOR_AIR_AUDIT_STEP6_TEXT);
      }
      const savedSubmittedBy =
        qAny.customContent?.step7SubmittedBy ||
        qAny.proposals?.[0]?.customContent?.step7SubmittedBy;
      if (savedSubmittedBy) {
        setStep7SubmittedBy(savedSubmittedBy);
      }
      const savedBankDetails =
        qAny.customContent?.step7BankDetails ||
        qAny.proposals?.[0]?.customContent?.step7BankDetails;
      if (savedBankDetails) {
        setStep7BankDetails(savedBankDetails);
      }
      const savedRoi =
        qAny.customContent?.compressorRoiData ||
        qAny.compressorRoiData;
      if (savedRoi) {
        setCompressorRoiData(savedRoi);
      }
      const savedAssets =
        qAny.customContent?.selectedAssetIds ||
        qAny.selectedAssetIds;
      if (savedAssets && Array.isArray(savedAssets) && savedAssets.length > 0) {
        setSelectedAssetIds(savedAssets);
      }
      hasLoadedExistingQuoteRef.current = true;
    }
  }, [existingQuote]);

  // Dynamically calculate proposal number starting from STPL-001 client and service wise
  useEffect(() => {
    if (!isManualProposalNumber) {
      if (!clientName) {
        setProposalNumber((prev) => (prev === 'STPL-001' ? prev : 'STPL-001'));
        return;
      }
      // Count matching proposals for this client and service
      const matching = Array.isArray(allProposals)
        ? allProposals.filter((p: any) => {
            const pClient = p.deal?.clientName || p.clientName || p.quote?.deal?.clientName || '';
            return pClient.toLowerCase().trim() === clientName.toLowerCase().trim();
          })
        : [];
      const seqIndex = matching.length + (editQuoteId ? 0 : 1);
      const nextFormatted = `STPL-${String(Math.max(1, seqIndex)).padStart(3, '0')}`;
      setProposalNumber((prev) => (prev === nextFormatted ? prev : nextFormatted));
    }
  }, [clientName, allProposals, editQuoteId, isManualProposalNumber]);

  // Assets & Scope of Assessment State (31 Categories)
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [isAssetsDropdownOpen, setIsAssetsDropdownOpen] = useState(false);
  const assetsDropdownRef = useRef<HTMLDivElement>(null);
  const [expandedAssetId, setExpandedAssetId] = useState<string | null>(null);

  // Filtered Assets for Dropdown Search
  const filteredAssets = React.useMemo(() => {
    return ASSESSMENT_ASSETS.filter((a) =>
      a.name.toLowerCase().includes(assetSearchQuery.toLowerCase())
    );
  }, [assetSearchQuery]);

  // Close dropdowns when clicking outside
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clientDropdownRef.current &&
        !clientDropdownRef.current.contains(event.target as Node)
      ) {
        setIsClientDropdownOpen(false);
      }
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target as Node)
      ) {
        setIsServiceDropdownOpen(false);
      }
      if (
        subServicesDropdownRef.current &&
        !subServicesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSubServicesDropdownOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
      if (
        assetsDropdownRef.current &&
        !assetsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAssetsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [serviceId, setServiceId] = useState('');

  // Fetch Services & Rate Cards
  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesApi.getAll(),
  });

  // Dynamically map sub-services from services array for each category
  const dedupeStrings = (items: string[]) => {
    const map = new Map<string, string>();
    for (const item of items) {
      if (!item) continue;
      const key = item.toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, item);
      } else {
        const existing = map.get(key)!;
        if (item === 'Nitrogen Gas Leakage Audit' || (item[0] === item[0]?.toUpperCase() && existing[0] !== existing[0]?.toUpperCase())) {
          map.set(key, item);
        }
      }
    }
    return Array.from(map.values());
  };

  const dynamicProjectsSubServices = React.useMemo(() => {
    const apiProjects = services
      .filter((s) => {
        const cat = (s.category || '').toLowerCase();
        const nm = (s.name || '').toLowerCase();
        return cat.includes('project') || ['optibyte', 'digiweld', 'tec byte', 'fix byte', 'compass'].includes(nm);
      })
      .map((s) => s.name);
    return dedupeStrings([...PROJECTS_SUB_SERVICES, ...apiProjects]).filter(
      (nm) => !['custom', 'custom project'].includes(nm.toLowerCase())
    );
  }, [services]);

  const dynamicEnergyAuditSubServices = React.useMemo(() => {
    const excludedAudits = ['air audit', 'air audit rectification', 'flowmeter', 'flow meter', 'custom', 'bms'];
    const apiAudits = services
      .filter((s) => (s.category || '').toLowerCase().includes('audit'))
      .map((s) => s.name);
    const combined = [...ENERGY_AUDIT_SUB_SERVICES, ...apiAudits].filter(
      (nm) => !excludedAudits.includes(nm.toLowerCase())
    );
    return dedupeStrings(combined);
  }, [services]);

  const dynamicIotServicesSubServices = React.useMemo(() => {
    return IOT_SERVICES_SUB_SERVICES;
  }, []);

  const dynamicHardwareSubServices = React.useMemo(() => {
    return HARDWARE_SUB_SERVICES;
  }, []);

  const dynamicWeldingIotSubServices = React.useMemo(() => {
    return WELDING_IOT_SUB_SERVICES;
  }, []);

  const dynamicAutomationSubServices = React.useMemo(() => {
    return AUTOMATION_SUB_SERVICES;
  }, []);

  const dynamicIrBlasterSubServices = React.useMemo(() => {
    return IR_BLASTER_SUB_SERVICES;
  }, []);

  const dynamicBmsCategorySubServices = React.useMemo(() => {
    return BMS_CATEGORY_SUB_SERVICES;
  }, []);

  const dynamicChillerManagementSubServices = React.useMemo(() => {
    return CHILLER_MANAGEMENT_SUB_SERVICES;
  }, []);

  // Aggregate available sub-services across all selected categories
  const availableSubServices = React.useMemo(() => {
    let opts: string[] = [];
    if (selectedCategories.includes('Energy Audit Services')) {
      opts.push(...dynamicEnergyAuditSubServices);
    }
    if (selectedCategories.includes('Projects Catalog')) {
      opts.push(...dynamicProjectsSubServices);
    }
    if (selectedCategories.includes('IoT & Controls')) {
      opts.push(...dynamicIotServicesSubServices);
    }
    if (selectedCategories.includes('Chiller Management')) {
      opts.push(...dynamicChillerManagementSubServices);
    }
    if (selectedCategories.includes('Welding') || selectedCategories.includes('Welding IoT')) {
      opts.push(...dynamicWeldingIotSubServices);
    }
    if (selectedCategories.includes('Automation')) {
      opts.push(...dynamicAutomationSubServices);
    }
    if (selectedCategories.includes('IR Blaster')) {
      opts.push(...dynamicIrBlasterSubServices);
    }
    if (selectedCategories.includes('BMS')) {
      opts.push(...dynamicBmsCategorySubServices);
    }
    if (selectedCategories.includes('Hardware')) {
      opts.push(...dynamicHardwareSubServices);
    }
    return Array.from(new Set(opts));
  }, [
    selectedCategories,
    dynamicEnergyAuditSubServices,
    dynamicProjectsSubServices,
    dynamicIotServicesSubServices,
    dynamicWeldingIotSubServices,
    dynamicAutomationSubServices,
    dynamicIrBlasterSubServices,
    dynamicBmsCategorySubServices,
    dynamicHardwareSubServices,
  ]);

  // Auto-prune or reset selected sub-services when category changes
  useEffect(() => {
    if (availableSubServices.length > 0) {
      const validSelections = selectedSubServiceOptions.filter((opt) =>
        availableSubServices.some((a) => a.toLowerCase().trim() === opt.toLowerCase().trim())
      );
      if (validSelections.length > 0) {
        const matched = validSelections.map((opt) => {
          const found = availableSubServices.find((a) => a.toLowerCase().trim() === opt.toLowerCase().trim());
          return found || opt;
        });
        if (matched.some((nm, i) => nm !== selectedSubServiceOptions[i]) || matched.length !== selectedSubServiceOptions.length) {
          setSelectedSubServiceOptions(matched);
        }
      } else if (!editQuoteId && !hasLoadedExistingQuoteRef.current) {
        setSelectedSubServiceOptions([availableSubServices[0]]);
      }
    }
  }, [availableSubServices, editQuoteId]);

  // Sync serviceId with selected sub-services
  useEffect(() => {
    if (services.length > 0) {
      const matched = services.find((s) =>
        selectedSubServiceOptions.some((opt) => opt.toLowerCase() === s.name.toLowerCase())
      );
      if (matched) {
        setServiceId(matched.id);
      } else {
        setServiceId('');
      }
    }
  }, [selectedSubServiceOptions, services]);
  const [siteDays, setSiteDays] = useState(0);
  const [reportDays, setReportDays] = useState(0);

  // Split Food & Travel States (Default: 0, mapped dynamically from costing sheet)
  const [travelKms, setTravelKms] = useState<number>(0);
  const [travelRatePerKm, setTravelRatePerKm] = useState<number>(4);
  const [foodRatePerPersonDay, setFoodRatePerPersonDay] = useState<number>(300);
  const [foodTravelCost, setFoodTravelCost] = useState<number>(0);
  const DEFAULT_ABOUT_SUSTAINABYTE = `Sustainabyte is a private limited company, based out in Chennai, with client base spreading across 3 countries. It is a climate-tech start-up, predominantly focusing on energy conservation methodologies across Industries, Commercial building and residential complexes.

Sustainabyte.ai is dedicated to leveraging advanced technology for global sustainability. Our mission is to minimize environmental impact while enhancing operational efficiency through innovative solutions. Sustainabyte is a technology-driven sustainability company, providing cutting-edge solutions for enterprises, to identify, plan and operationalize their Net Zero Carbon ambitions. Our mission is to deliver sustainable prosperity for companies, by balancing people, planet and profit. We demonstrate this by leveraging proprietary machine-learning algorithms, which provide measurable outcomes.

Our goal is to collaborate with companies and help them to work smarter, make critical decisions more quickly and consume less. In addition, by doing this at scale, we will make a significant impact on the carbon footprint of commercial and industrial assets, globally. At Sustainabyte, we understand how important it is to be productive and sustainable. As a first step, we provide expert advisory to create a blueprint for sustainability roadmap and Net Zero Carbon Goals.

We implement our flagship IoT solution — OptiByte — our technology platform, as an overlay on the client’s existing systems, connecting data points to provide a bird’s eye view, which, really is making the invisible, visible. Our reporting module then presents the ESG scores, operational efficiency KPI has and compares it against the milestones. This drives a program of continuous improvement by identifying improvement opportunities and recommended changes to deliver empirical and tangible sustainability goals. We pride in delivering results as early as in 30-60 days.`;

  const [aboutSustainabyteText, setAboutSustainabyteText] = useState(DEFAULT_ABOUT_SUSTAINABYTE);
  const [isEditingAboutText, setIsEditingAboutText] = useState(false);

  const DEFAULT_EMS_STEP5_TEXT = `Scope of Work:

Our overall Platform solution can be divided into 4 phases

In the “current proposal we are discussing of the implementation of phase 1 only” Phase 1 - Energy Monitoring System Implementation
• Creating Basic Energy Monitoring infrastructure
• Implementing equipment level energy monitoring system using meters with critical alerts and alarms
• Providing Custom dashboards and enabling alerts & reports

Phase 2 - Equipment level Condition Monitoring system Implementation
• Integrating with equipment controllers or installing additional sensors & meters for monitoring critical equipment parameters
• Developing rules for monitoring critical parameters and generating alerts / alarms
• Providing Custom dashboards and enabling alerts & reports

Phase 3 - Energy Optimization system implementation
• Developing custom logics for Utility equipment such as Chillers, Chiller system, Pumps cooling towers, air compressors etc.
• Implementing logics in System for identifying energy leakages and practicing potential failures
• Enabling reports via email on agreed frequency

Phase 4 - AI and ML based advanced system for predictive maintenance & Energy management
• Developing advanced AI and ML models for identifying energy leakages and practicing potential failures based on long range data (min.12 months data)
• Implementing logics in System for identifying energy leakages and practicing potential failures
• Enabling reports via email on agreed frequency

Potential benefits of our platform – All 4 phases:
1. Up Time: Equipment Downtime reduction
2. Energy Savings: Energy consumption and Utility Cost Reduction (1-10 %)
3. Zero Carbon: Contribute towards Net Carbon Zero (Scope 1 & Scope 2)
4. HC Optimization: Maintenance Head count optimization (approx. 1.5 HC worth Manual effort saved every day)
5. Capital Cost Saving: Up to 50% Capital Cost and 30-50% of commissioning cost savings compare with traditional BMS / SCADA system

Benefits of Energy Management system:
1. Real-time alerting: When an asset malfunctions, you can automatically alert the right engineer, and have it repaired before it gets worse.
2. Peak load reporting: When an asset malfunctions, you can automatically alert the right engineer, and have it repaired before it gets worse.
3. Customization: When an asset malfunctions, you can automatically alert the right engineer, and have it repaired before it gets worse.
4. AI led anomaly detection: Immediately act when anomalies occur (in performance or consumption) to massively reduce time and keep assets performing at their peak.
5. Data driven decision making: Daily report, Data available to download from minute, hourly, daily, monthly to yearly levels right from the tool level`;

  const DEFAULT_BMS_STEP5_TEXT = `KEY ISSUES IDENTIFIED

1. Data Communication Issues
• Certain field devices are not transmitting data reliably to the BMS/SCADA system.
• Communication status of some devices is unknown and requires verification.
• Potential communication interruptions between field devices, controllers, gateways, and SCADA.

2. Data Mismatch & Abnormal Values
• Some values displayed in SCADA appear unrealistic and inconsistent with expected operating conditions.
• Actual field values need to be validated against SCADA-displayed values.
• Possible scaling, mapping, register addressing, or communication-related issues affecting data accuracy.

3. Graphics & Visualization Issues
• Existing graphics screens contain alignment and display inconsistencies.
• Equipment representations and parameter displays require verification.
• Graphics navigation and usability need assessment.

4. IO Mapping Verification Required
• Existing field-to-controller and controller-to-SCADA point mapping accuracy is unknown.
• Point names, engineering units, scaling factors, and register assignments require validation.
• Incorrect mapping may be contributing to inaccurate monitoring and reporting.

5. Monitoring & System Visibility Gaps
• Certain process areas may not be accurately represented in the monitoring platform.
• Missing, inactive, or incorrectly configured points may affect operational visibility.

PROPOSED ASSESSMENT ACTIVITIES

• Verification of field devices and process instrumentation.
• Communication network assessment.
• Energy meter and utility monitoring verification.
• IO mapping validation.
• Graphics and visualization review.
• Data accuracy validation.
• Identification of system gaps and operational issues.
• Preparation of a detailed assessment and recommendation report.

EXPECTED OUTCOME

The assessment will provide a clear understanding of the current system condition, identify the root causes of communication and monitoring issues, highlight graphics and mapping discrepancies, and deliver a prioritized roadmap for corrective actions and future system improvements.`;

  const DEFAULT_BMS_STEP6_TEXT = `Payment Terms:
· 60% Advance Payment – Upon confirmation of the order.
· 15% Payment – Upon completion of the site activities.
· 15% Payment – Against submission of the draft report.
· 10% Payment – Against submission of the final report.

30 days from the date of invoice and invoice will be raised after the work completion at site.
Applicable taxes and duties shall be charged extra, as applicable.
All lodging, boarding and accommodation are inclusive.

Other Terms and Conditions:
Customer shall arrange a skilled individual (Authorized technicians) for the entire duration of the audit period for local co-ordination with site team for seeking approval or work permits and installation of energy auditing equipment with proper safety measures.`;

  const [emsStep5Text, setEmsStep5Text] = useState(DEFAULT_EMS_STEP5_TEXT);
  const [isEditingEmsStep5Text, setIsEditingEmsStep5Text] = useState(false);

  const DEFAULT_WELD_DATA_DIGITALIZED_STEP5_TEXT = `Scope of Work:
Project Overview
Fusionbyte – WeldWise Suite is a mobile application tailored for industrial environments to streamline and monitor welding operations. The current scope focuses on:

Phase 1: Joint-Wise, Part-Wise Weld Tracking System
Precise tracking of welds based on joint and part identifiers.
Supervisors and welders can input process data according to specific models and stages.
Real-time visibility into welding activities for better quality assurance and process optimization.

Phase 2: Integrated Process and Quality Data Logging
Automatic capture of critical welding-related parameters such as:
oPreheating status
oNDT (Non-Destructive Testing) results
oVoltage and current readings
oInspection time and date
Defect Mapping:
oLogs the exact location and type of defects found during inspections.
Defect Heat Mapping:
oVisualizes areas with a high concentration of defects to prioritize corrective actions.
Smart alerts to notify if blasting or process times exceed predefined limits, helping prevent delays and ensuring quality compliance.

Phase 3: Advanced Visualization and AI-Powered Reporting
Customizable dashboards featuring visual tools like trendlines, Pareto charts, and pie charts.
AI-driven analysis provides actionable insights for supervisors and quality teams.
Supports continuous process improvement by identifying patterns, bottlenecks, and optimization opportunities.

Technologies Used
●Frontend: Flutter (Android Only)
●Backend: Firebase (Firestore, Auth, Cloud Functions)
●Web App: Next.js ,Tailwind css
●Email Notifications: Firebase Email Service or 3rd Party API (e.g., Send Grid)
●State Management: Provider / Riverpod / Bloc
●Cloud Storage: Firebase Storage

Key Features
Joint-Wise and Part-Wise Weld Tracking
Accurately capture, monitor, and trace welding data based on specific joints and parts across all stages for full traceability.
Multi-Stage Input System (Up to 5 Process Stages)
Allows structured data entry for up to five welding process stages, improving traceability, accountability, and process control.
Equipment Tracking by ID and Process Stage
Monitor welding equipment usage, condition, and association with specific process stages using unique identifiers.
Integrated Preheating, NDT, Parameter Logging, and Defect Mapping
Seamlessly log critical welding parameters such as preheating status, voltage, current, NDT results, inspection date/time, along with capturing defect locations through defect mapping.
Defect Heat Mapping Visualization
Visual heat maps highlight areas with high defect concentrations, enabling faster root cause analysis and prioritization of corrective actions.
Smart Alerts and Notifications
Receive customizable real-time alerts for process delays (e.g., blasting time exceeded) and quality deviations, including optional email notifications.
Advanced Filters for Data Querying
Apply powerful dynamic filters to quickly review weld history, current status, defect trends, equipment usage, and inspection outcomes.
AI-Powered Dashboards & Reporting
Generate intuitive visual reports using AI-driven tools—trendlines, Pareto charts, pie charts, and more—to drive clear insights and continuous process improvement.

Deliverables
●Complete mobile app (Android and Web)
●Source code and Firebase configuration
●Deployment to Play Store (if required)
●User manual and technical documentation
●One year of basic support and updates`;

  const DEFAULT_WELD_DATA_DIGITALIZED_STEP6_TEXT = `Commercials
Support required from the client:

•SPOC (Single point of Contact) for support and coordination during the audit phase 
•Accessibility to each area. 
•1 person required from client side with knowledge on Compressed air line to reach out from the generation to end use for leakage identifications.

Terms and Conditions:

Payment schedule: 70% advance against the PO and remaining 30% against the report submission
Applicable taxes and duties will be extra
Boarding and Travel Expenses are inclusive of the cost mentioned above.

Submitted By,

Thanakarthik Kumar
Founder & Managing Director
8377007638
thanakarthik@sustainabyte.ai

Bank Account details:
Bank – IDFC FIRST Bank
Account Number – 10184753095
IFSC – IDFB0080125
Branch – BESANT NAGAR BRANCH
GSTIN NO – 33ABNCS4869A1Z7
PAN Number – ABNCS4869A
SWIFT Code - IDFBINBBMUM

THANK YOU`;

  const DEFAULT_EMS_STEP6_TEXT = `NOTE:

S No | Description | Scope
1 | From Chennai to Site up and down, local transport, food and accommodation charges will be under client scope. | At Actual

Support required from the client:
• SPOC (Single point of Contact) for support and coordination during installation and Commissioning phase
• SPOC to review alerts and reports as per requirements
• Accessibility to each area.
• 1 person required from client side with knowledge on electrical routing and provide manual support to lay the cable, if any
• Boarding, Food and Travel expenses will be under client scope.

Terms and Conditions:
Payment schedule
Installation and commissioning – 1 week from the payment advance
Applicable taxes and duties will be extra
Boarding, Food and Travel Expenses are exclusive of the cost mentioned above.
Project timelines depend on Shutdowns provided for fixing sensors. The timelines for execution will be mutually discussed and agreed during the project kick-off discussion.
All kinds of approvals, work permission and site pass if required.
Clients should do any third-party contractor’s co-ordination at site.
Secure onsite storage area and all soft integration support.
Post installation and commissioning any site visit for EMS maintenance and troubleshooting will be charged as actual (i.e., after first year).
Any material beyond current scope will be charged as actual.`;

  const [emsStep6Text, setEmsStep6Text] = useState(DEFAULT_EMS_STEP6_TEXT);
  const [isEditingEmsStep6Text, setIsEditingEmsStep6Text] = useState(false);

  const DEFAULT_STEP7_SUBMITTED_BY = `Thanakarthik Kumar K
Founder & Managing Director
Phno: 8377007638
G mail: thanakarthik@sustainabyte.ai`;

  const DEFAULT_STEP7_BANK_DETAILS = `Bank Account details:
Bank – Bank of Baroda
Account Number – 35860200000750
IFSC – BARB0VELACH (fifth letter is ZERO)
Branch – VELACHERY BRANCH
GSTIN NO – 33ABNCS4869A1Z7
PAN Number – ABNCS4869A`;

  const [step7SubmittedBy, setStep7SubmittedBy] = useState(DEFAULT_STEP7_SUBMITTED_BY);
  const [step7BankDetails, setStep7BankDetails] = useState(DEFAULT_STEP7_BANK_DETAILS);
  const [isEditingStep7, setIsEditingStep7] = useState(false);

  const [marginPct, setMarginPct] = useState(40);
  const [bufferPct, setBufferPct] = useState(10);

  // Fetch Clients from DB
  const { data: dbClients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll(),
  });

  // Client Options List (Merge DB clients with Preset Catalog Clients)
  const clientOptions: Array<{ id?: string; name: string }> = React.useMemo(() => {
    const map = new Map<string, { id?: string; name: string }>();

    const normalizeName = (name: string) => {
      const lower = name.toLowerCase().trim();
      if (lower === 'kone' || lower === 'kone elevator' || lower === 'kone elevators') {
        return 'KONE Elevators India';
      }
      return name;
    };

    DEFAULT_CLIENT_OPTIONS.forEach((name) => {
      if (name && name.trim()) {
        const canonical = normalizeName(name);
        map.set(canonical.toLowerCase().trim(), { name: canonical });
      }
    });

    clientList.forEach((name) => {
      if (name && name.trim()) {
        const canonical = normalizeName(name);
        map.set(canonical.toLowerCase().trim(), { name: canonical });
      }
    });

    dbClients.forEach((c) => {
      if (c && c.name) {
        const canonical = normalizeName(c.name);
        map.set(canonical.toLowerCase().trim(), { id: c.id, name: canonical });
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [dbClients, clientList]);

  // Filtered Options for Search
  const filteredClientOptions = clientOptions.filter((c) =>
    c.name.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  // Client Mutations (Create / Update in Database)
  const createClientMutation = useMutation({
    mutationFn: (name: string) => clientsApi.create(name, clientLogo || undefined),
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setClientName(newClient.name);
      setIsCustomClient(false);
      setCustomClientName('');
      toast.success(`Client "${newClient.name}" saved to Database!`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save client to DB');
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      clientsApi.update(id, name, clientLogo || undefined),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setClientName(updated.name);
      setIsEditingClient(false);
      toast.success(`Client updated in Database!`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update client');
    },
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setClientLogo(reader.result as string);
        toast.success('Client logo uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  // Selected Team Members & Instruments
  const [teamMembers, setTeamMembers] = useState<
    Array<{ manpowerRateId: string; siteDays: number; reportDays: number }>
  >([]);

  const [instruments, setInstruments] = useState<
    Array<{ instrumentRateId: string; siteDays: number }>
  >([]);

  // Explicit Person Count state for Food calculation (default 0, syncs with team size)
  const [personCount, setPersonCount] = useState<number>(0);

  useEffect(() => {
    setPersonCount(teamMembers.length);
  }, [teamMembers.length]);

  // Auto-recalculate total foodTravelCost when Kms, travel rate, food rate, or personCount change
  useEffect(() => {
    const totalTravel = (travelKms || 0) * (travelRatePerKm || 0);
    const count = personCount || 0;
    const days = siteDays || 0;
    const totalFood = count * days * (foodRatePerPersonDay || 0);
    setFoodTravelCost(totalTravel + totalFood);
  }, [travelKms, travelRatePerKm, foodRatePerPersonDay, siteDays, personCount]);

  // Fetch Rate Cards

  const { data: manpowerRates = [] } = useQuery({
    queryKey: ['rate-cards-manpower'],
    queryFn: () => rateCardsApi.getManpower(),
  });

  const { data: dbInstrumentRates = [] } = useQuery({
    queryKey: ['rate-cards-instruments'],
    queryFn: () => rateCardsApi.getInstruments(),
  });

  const instrumentRates = React.useMemo(() => {
    const OLD_INSTRUMENT_NAMES = [
      'e meter',
      'earth resistance tester (megger det4)',
      'insulation resistance tester 5kv',
      'power quality analyzer (fluke 435)',
      'thermal imaging camera (flir e8)',
    ];

    const DEFAULT_INSTRUMENT_RATES = [
      { id: 'inst-1', instrumentName: 'Power Logger', rentalRatePerDay: 3500 },
      { id: 'inst-2', instrumentName: 'Ultrasonic flow meter', rentalRatePerDay: 7000 },
      { id: 'inst-3', instrumentName: 'Aquastic Ultrasonic leakage detector', rentalRatePerDay: 4000 },
      { id: 'inst-4', instrumentName: 'Air Flow Meter', rentalRatePerDay: 4500 },
      { id: 'inst-5', instrumentName: 'Thermal Camera', rentalRatePerDay: 1000 },
      { id: 'inst-6', instrumentName: 'Digital Clamp Meter', rentalRatePerDay: 1000 },
      { id: 'inst-7', instrumentName: 'Earth Meggar', rentalRatePerDay: 1000 },
      { id: 'inst-8', instrumentName: 'Lux Meter', rentalRatePerDay: 500 },
      { id: 'inst-9', instrumentName: 'Thermometer', rentalRatePerDay: 500 },
      { id: 'inst-10', instrumentName: 'Temperature data logger', rentalRatePerDay: 500 },
      { id: 'inst-11', instrumentName: 'Anemometer', rentalRatePerDay: 500 },
      { id: 'inst-12', instrumentName: 'Differential Manometer', rentalRatePerDay: 1000 },
      { id: 'inst-13', instrumentName: 'Flue Gas analyser', rentalRatePerDay: 5000 },
      { id: 'inst-14', instrumentName: 'Others / Custom Instrument', rentalRatePerDay: 1000 },
    ];

    const cleanDb = dbInstrumentRates.filter(
      (item) => !OLD_INSTRUMENT_NAMES.includes((item.instrumentName || '').toLowerCase().trim())
    );

    const combined = [...cleanDb];
    DEFAULT_INSTRUMENT_RATES.forEach((defInst) => {
      const exists = combined.some(
        (item) => item.instrumentName.toLowerCase().trim() === defInst.instrumentName.toLowerCase().trim()
      );
      if (!exists) {
        combined.push(defInst);
      }
    });

    return combined;
  }, [dbInstrumentRates]);

  // Auto-populate form states when editing existingQuote
  useEffect(() => {
    if (existingQuote) {
      if (existingQuote.deal?.clientName) {
        setClientName(existingQuote.deal.clientName);
      }
      if (existingQuote.serviceId) {
        setServiceId(existingQuote.serviceId);
      }
      if (existingQuote.proposalNumber) {
        setProposalNumber(existingQuote.proposalNumber);
      }
      if (existingQuote.proposalDate) {
        try {
          setProposalDate(new Date(existingQuote.proposalDate).toISOString().split('T')[0]);
        } catch {}
      }
      if (existingQuote.clientLogo) {
        setClientLogo(existingQuote.clientLogo);
      }
      if (existingQuote.siteDays) {
        setSiteDays(existingQuote.siteDays);
      }
      if (existingQuote.reportDays) {
        setReportDays(existingQuote.reportDays);
      }
      if (existingQuote.travelKms !== undefined && existingQuote.travelKms !== null) {
        setTravelKms(Number(existingQuote.travelKms));
      }
      if (existingQuote.travelRatePerKm !== undefined && existingQuote.travelRatePerKm !== null) {
        setTravelRatePerKm(Number(existingQuote.travelRatePerKm));
      }
      if (existingQuote.foodRatePerPersonDay !== undefined && existingQuote.foodRatePerPersonDay !== null) {
        setFoodRatePerPersonDay(Number(existingQuote.foodRatePerPersonDay));
      }
      if (existingQuote.foodTravelCost !== undefined && existingQuote.foodTravelCost !== null) {
        setFoodTravelCost(Number(existingQuote.foodTravelCost));
      }
      if (existingQuote.marginPct !== undefined && existingQuote.marginPct !== null) {
        setMarginPct(Number(existingQuote.marginPct));
      }
      if (existingQuote.bufferPct !== undefined && existingQuote.bufferPct !== null) {
        setBufferPct(Number(existingQuote.bufferPct));
      }

      // Pre-populate category and sub-service from existing quote
      const quoteCat =
        (existingQuote as any).category ||
        (existingQuote.service as any)?.category ||
        (existingQuote.deal?.service as any)?.category ||
        '';
      const quoteSub =
        (existingQuote as any).serviceName ||
        (existingQuote.service as any)?.name ||
        (existingQuote.deal?.service as any)?.name ||
        '';

      if (quoteCat) {
        setSelectedCategories([quoteCat]);
      }
      if (quoteSub) {
        setSelectedSubServiceOptions([quoteSub]);
      }

      // Pre-populate line items (Manpower & Instruments)
      if (existingQuote.lineItems && existingQuote.lineItems.length > 0) {
        const manpowerItems = existingQuote.lineItems
          .filter((item) => item.type === 'MANPOWER' && item.refId)
          .map((item) => ({
            manpowerRateId: item.refId!,
            siteDays: existingQuote.siteDays,
            reportDays: existingQuote.reportDays,
          }));

        const instrumentItems = existingQuote.lineItems
          .filter((item) => item.type === 'INSTRUMENT' && item.refId)
          .map((item) => ({
            instrumentRateId: item.refId!,
            siteDays: existingQuote.siteDays,
          }));

        if (manpowerItems.length > 0) {
          setTeamMembers(manpowerItems);
        }
        if (instrumentItems.length > 0) {
          setInstruments(instrumentItems);
        }

        // Also pre-populate custom line items into Step 5 / Step 4 breakdown
        const customItems = existingQuote.lineItems
          .filter((item) => item.type !== 'MANPOWER' && item.type !== 'INSTRUMENT' && item.type !== 'TRAVEL')
          .map((item, idx) => ({
            id: `quote-item-${idx}`,
            stepNo: String(idx + 1),
            description: item.description || 'Scope Item',
            qty: Number(item.qty || 1),
            uom: (item as any).uom || 'Nos',
            customerPrice: Number(item.total || item.unitRate || 0),
          }));

        if (customItems.length > 0) {
          setIotStep5Rows(customItems);
        }
      }

      if (existingQuote.customContent?.scopeOfWork || existingQuote.customContent?.step5Text || existingQuote.scopeDetails) {
        setEmsStep5Text(existingQuote.customContent?.scopeOfWork || existingQuote.customContent?.step5Text || existingQuote.scopeDetails || '');
      }
    }
  }, [existingQuote]);

  // Automatically load company logo when selecting a mapped client, or clear if unmapped
  useEffect(() => {
    if (clientName) {
      const dbMatch = dbClients.find(
        (c) => c.name.toLowerCase().trim() === clientName.toLowerCase().trim()
      );
      const resolved = dbMatch?.logo || getClientPresetLogo(clientName);
      if (resolved) {
        setClientLogo(resolved);
      } else if (clientLogo && (clientLogo.startsWith('/logo/') || clientLogo.startsWith('data:'))) {
        setClientLogo(null);
      }
    }
  }, [clientName, dbClients]);


  // Selected Costing Sheet ID (if multiple sheets exist for this client)
  const [selectedCostingSheetId, setSelectedCostingSheetId] = useState<string>('');

  // Query saved Costing Sheets as soon as Client Name or Category / Sub-Service is chosen
  const { data: clientCostingSheets = [], isLoading: isLoadingCostingSheets } = useQuery({
    queryKey: ['costing-sheets-client', clientName, selectedCategories, selectedSubServiceOptions],
    queryFn: async () => {
      if (!clientName || !clientName.trim()) return [];

      const cleanName = clientName.replace(/(ltd|pvt|limited|private|inc|corp)\.?/gi, '').trim();

      const [generalSheets, airSheets, energySheets, rectSheets, emsSheets] = await Promise.all([
        costingApi.getSheets({ clientName: cleanName || clientName.trim() }).catch(() => []),
        costingApi.airAudit.getSheets(cleanName || clientName.trim()).catch(() => []),
        costingApi.energyAudit.getSheets(cleanName || clientName.trim()).catch(() => []),
        costingApi.airAuditRectification.getSheets(cleanName || clientName.trim()).catch(() => []),
        costingApi.ems.getSheets(cleanName || clientName.trim()).catch(() => []),
      ]);

      const formattedAir = (airSheets || []).map((s: any) => ({
        ...s,
        _id: s.id,
        subService: s.subService || 'Air Audit',
        serviceCategory: s.serviceCategory || 'Energy Audit Services',
        manpowerCost: s.totalManpowerCost !== undefined ? Number(s.totalManpowerCost) : Number(s.manpowerCost || 0),
        instrumentCost: s.totalInstrumentCost !== undefined ? Number(s.totalInstrumentCost) : Number(s.instrumentCost || 0),
        totalExtraCost: s.totalExtraCost !== undefined ? Number(s.totalExtraCost) : 0,
        subtotalCost: Number(s.subtotalCost || 0),
        marginPct: Number(s.marginPct || 40),
        marginAmount: Number(s.marginAmount || 0),
        bufferPct: Number(s.bufferPct || 10),
        bufferAmount: Number(s.bufferAmount || 0),
        finalQuote: Number(s.finalQuote || s.totalCustomerPrice || 0),
      }));

      const formattedEnergy = (energySheets || []).map((s: any) => ({
        ...s,
        _id: s.id,
        subService: s.subService || 'Energy Audit',
        serviceCategory: s.serviceCategory || 'Energy Audit Services',
        manpowerCost: s.totalManpowerCost !== undefined ? Number(s.totalManpowerCost) : Number(s.manpowerCost || 0),
        instrumentCost: s.totalInstrumentCost !== undefined ? Number(s.totalInstrumentCost) : Number(s.instrumentCost || 0),
        totalExtraCost: s.totalExtraCost !== undefined ? Number(s.totalExtraCost) : 0,
        subtotalCost: Number(s.subtotalCost || 0),
        marginPct: Number(s.marginPct || 40),
        marginAmount: Number(s.marginAmount || 0),
        bufferPct: Number(s.bufferPct || 10),
        bufferAmount: Number(s.bufferAmount || 0),
        finalQuote: Number(s.finalQuote || s.totalCustomerPrice || 0),
      }));

      const formattedRect = (rectSheets || []).map((s: any) => ({
        ...s,
        _id: s.id,
        subService: s.subService || 'Air Audit Rectification',
        serviceCategory: s.serviceCategory || 'Energy Audit Services',
        manpowerCost: s.totalManpowerCost !== undefined ? Number(s.totalManpowerCost) : Number(s.manpowerCost || 0),
        instrumentCost: s.totalInstrumentCost !== undefined ? Number(s.totalInstrumentCost) : Number(s.instrumentCost || 0),
        totalExtraCost: s.totalExtraCost !== undefined ? Number(s.totalExtraCost) : 0,
        subtotalCost: Number(s.subtotalCost || 0),
        marginPct: Number(s.marginPct || 40),
        marginAmount: Number(s.marginAmount || 0),
        bufferPct: Number(s.bufferPct || 10),
        bufferAmount: Number(s.bufferAmount || 0),
        finalQuote: Number(s.finalQuote || s.totalCustomerPrice || 0),
      }));

      const formattedEms = (emsSheets || []).map((s: any) => ({
        ...s,
        _id: s.id,
        subService: s.subService || 'CPM (Chiller Plant Management)',
        serviceCategory: s.serviceCategory || 'Chiller Management',
        manpowerCost: s.totalManpowerCost !== undefined ? Number(s.totalManpowerCost) : Number(s.manpowerCost || 0),
        instrumentCost: s.totalInstrumentCost !== undefined ? Number(s.totalInstrumentCost) : Number(s.instrumentCost || 0),
        totalExtraCost: s.totalExtraCost !== undefined ? Number(s.totalExtraCost) : 0,
        subtotalCost: Number(s.subtotalCost || 0),
        marginPct: Number(s.marginPct || 40),
        marginAmount: Number(s.marginAmount || 0),
        bufferPct: Number(s.bufferPct || 10),
        bufferAmount: Number(s.bufferAmount || 0),
        finalQuote: Number(s.finalQuote || s.emsTotalStep5CustomerPrice || s.totalCustomerPrice || 0),
      }));

      const combined = [...generalSheets, ...formattedAir, ...formattedEnergy, ...formattedRect, ...formattedEms];

      const seen = new Set();
      const unique = [];
      for (const item of combined) {
        const id = item.id || item._id;
        if (id && !seen.has(id)) {
          seen.add(id);
          unique.push(item);
        }
      }
      return unique;
    },
    enabled: !!clientName && clientName.trim().length > 0,
  });

  const activeCostingSheet = React.useMemo(() => {
    if (!clientCostingSheets || clientCostingSheets.length === 0) return null;
    const currentSub = (selectedSubServiceOptions[0] || '').toLowerCase().trim();
    const currentCat = (selectedCategories[0] || '').toLowerCase().trim();

    if (selectedCostingSheetId) {
      const found = clientCostingSheets.find(
        (s) => s.id === selectedCostingSheetId || s._id === selectedCostingSheetId
      );
      if (found) {
        const foundSub = (found.subService || '').toLowerCase();
        const foundCat = (found.serviceCategory || '').toLowerCase();
        if (
          ((currentSub.includes('ir') || currentCat.includes('ir')) && (foundSub.includes('ir') || foundCat.includes('ir')) && !foundSub.includes('cpm') && !foundSub.includes('chiller')) ||
          ((currentSub.includes('cpm') || currentCat.includes('chiller')) && (foundSub.includes('cpm') || foundCat.includes('chiller') || foundSub.includes('chiller'))) ||
          (!currentSub.includes('ir') && !currentSub.includes('cpm') && !currentCat.includes('ir') && !currentCat.includes('chiller'))
        ) {
          return found;
        }
      }
    }

    if (!currentSub && !currentCat) return null;

    // 1. IR Blaster / New IR Blaster / Old IR Blaster (Strict priority)
    if (
      currentSub.includes('ir blaster') ||
      currentSub.includes('ir') ||
      currentSub.includes('new ir blaster') ||
      currentSub.includes('old ir blaster') ||
      currentCat.includes('ir blaster')
    ) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          const cat = (s.serviceCategory || '').toLowerCase().trim();
          return (sub.includes('ir blaster') || sub.includes('ir') || cat.includes('ir blaster')) && !sub.includes('cpm') && !sub.includes('chiller');
        }) || null
      );
    }

    // 2. BMS / Building Management
    if (currentSub.includes('bms') || currentSub.includes('building management')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('bms') || sub.includes('building management');
        }) || null
      );
    }

    // 3. Air / Compressor Leakage Rectification
    if (currentSub.includes('rectification')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('rectification');
        }) || null
      );
    }

    // 4. Flowmeter
    if (currentSub.includes('flowmeter')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('flowmeter');
        }) || null
      );
    }

    // 5. Nitrogen Gas Leakage Audit
    if (currentSub.includes('nitrogen')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('nitrogen');
        }) || null
      );
    }

    // 6. Mixture Gas Leakage Audit
    if (currentSub.includes('mixture')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('mixture');
        }) || null
      );
    }

    // Compressed Air Automation / Water Automation
    if (
      currentSub.includes('compressed air automation') ||
      currentSub.includes('air automation') ||
      currentSub.includes('water automation') ||
      currentCat.includes('automation')
    ) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          const cat = (s.serviceCategory || '').toLowerCase().trim();
          return (
            sub.includes('compressed air automation') ||
            sub.includes('air automation') ||
            sub.includes('water automation') ||
            cat.includes('automation')
          );
        }) || null
      );
    }

    // 7. Compressor Air Leakage Audit / Air Audit (strictly not rectification and not automation)
    if (
      (currentSub.includes('air audit') || currentSub.includes('compressor air leakage') || currentSub.includes('leakage audit')) &&
      !currentSub.includes('rectification') &&
      !currentSub.includes('nitrogen') &&
      !currentSub.includes('mixture') &&
      !currentSub.includes('automation')
    ) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return (
            (sub.includes('air audit') || sub.includes('compressor air leakage') || sub.includes('leakage audit')) &&
            !sub.includes('rectification') &&
            !sub.includes('nitrogen') &&
            !sub.includes('mixture') &&
            !sub.includes('automation')
          );
        }) || null
      );
    }

    // 8. Energy Audit (Standard)
    if (currentSub === 'energy audit' || currentSub.includes('energy audit')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return (
            (sub === 'energy audit' || sub.includes('energy audit')) &&
            !sub.includes('air') &&
            !sub.includes('bms') &&
            !sub.includes('rectification') &&
            !sub.includes('nitrogen') &&
            !sub.includes('mixture') &&
            !sub.includes('flowmeter')
          );
        }) || null
      );
    }

    // 9. EMS / Energy Management Solution
    if (currentSub.includes('energy management') || currentSub.includes('ems')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('energy management') || sub.includes('ems');
        }) || null
      );
    }

    // 10. Welding IoT
    if (currentSub.includes('welding')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('welding') || Boolean((s as any).isWeldingIot);
        }) || null
      );
    }

    // 11. CPM / Chiller Plant Management
    if (currentSub.includes('cpm') || currentSub.includes('chiller') || currentCat.includes('chiller')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          const cat = (s.serviceCategory || '').toLowerCase().trim();
          return sub.includes('cpm') || sub.includes('chiller') || cat.includes('chiller') || Boolean((s as any).isCpm);
        }) || null
      );
    }

    // 12. Exact match fallback for other specific subServices
    const exactMatch = clientCostingSheets.find(
      (s) => (s.subService || '').toLowerCase().trim() === currentSub
    );
    if (exactMatch) return exactMatch;

  }, [clientCostingSheets, selectedCostingSheetId, selectedSubServiceOptions, selectedCategories]);

  // When activeCostingSheet is explicitly selected or changes, align categories and subServices
  useEffect(() => {
    if (selectedCostingSheetId && activeCostingSheet && !editQuoteId) {
      let targetCat = activeCostingSheet.serviceCategory || 'Energy Audit Services';
      const sub = (activeCostingSheet.subService || '').toLowerCase();
      if (sub.includes('compressed air automation') || sub.includes('water automation') || sub.includes('air automation')) {
        targetCat = 'Automation';
      } else if (sub.includes('cpm') || sub.includes('chiller')) {
        targetCat = 'Chiller Management';
      } else if (sub.includes('welding') || sub.includes('digiweld')) {
        targetCat = 'Welding';
      } else if (sub.includes('ir blaster') || sub.includes('ir')) {
        targetCat = 'IR Blaster';
      } else if (sub.includes('bms')) {
        targetCat = 'BMS';
      } else if (sub.includes('dew point') || sub.includes('flange') || sub.includes('flowmeter') || sub.includes('iaq sensor') || sub.includes('temperature sensor')) {
        targetCat = 'Hardware';
      } else if (sub.includes('energy management solution') || sub.includes('compressed air monitoring') || sub.includes('iot platform') || sub.includes('water management solution')) {
        targetCat = 'IoT & Controls';
      }

      if (targetCat) {
        setSelectedCategories([targetCat]);
      }
      if (activeCostingSheet.subService) {
        setSelectedSubServiceOptions([activeCostingSheet.subService]);
      }
    }
  }, [selectedCostingSheetId, activeCostingSheet, editQuoteId]);

  const isWeldDataDigitalized = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some(
      (s) =>
        s.includes('weld data digitalized') ||
        s.includes('weld data') ||
        s.includes('weldwise') ||
        s.includes('fusionbyte') ||
        s.includes('digiweld')
    );
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isWeldingIot = React.useMemo(() => {
    if (isWeldDataDigitalized) return false;
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return (
      combined.some((s) => s.includes('welding')) ||
      Boolean((activeCostingSheet as any)?.isWeldingIot) ||
      Boolean((activeCostingSheet as any)?.weldingHardwareRows?.length > 0)
    );
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet, isWeldDataDigitalized]);

  const isWaterManagement = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some(
      (s) => s.includes('water management') || s.includes('water monitoring') || s.includes('wms')
    );
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isFlangesHardware = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some((s) => s.includes('flange'));
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isDewPointHardware = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return !isFlangesHardware && combined.some((s) => s.includes('dew point'));
  }, [isFlangesHardware, selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isTemperatureSensor = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return !isFlangesHardware && !isDewPointHardware && combined.some((s) => s.includes('temperature'));
  }, [isFlangesHardware, isDewPointHardware, selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isIaqSensor = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return !isFlangesHardware && !isDewPointHardware && !isTemperatureSensor && combined.some((s) => s.includes('iaq') || s.includes('indoor air'));
  }, [isFlangesHardware, isDewPointHardware, isTemperatureSensor, selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isHardwareSensorScope = isTemperatureSensor || isDewPointHardware || isFlangesHardware;

  const isEms = React.useMemo(() => {
    if (isWeldingIot || isHardwareSensorScope || isIaqSensor) return false;
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return (
      combined.some(
        (s) =>
          s.includes('ems') ||
          s.includes('energy management') ||
          s.includes('water management') ||
          s.includes('water automation') ||
          s.includes('compressed air automation') ||
          s.includes('compressed air monitoring') ||
          (s.includes('automation') && !s.includes('hardware')) ||
          s.includes('smart factory')
      ) ||
      Boolean((activeCostingSheet as any)?.isEms) ||
      (!combined.some((s) => s.includes('hardware')) && (
        Boolean((activeCostingSheet as any)?.emsGatewayHardwareRows?.length > 0) ||
        Boolean((activeCostingSheet as any)?.emsHardwareRows?.length > 0)
      ))
    );
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet, isWeldingIot, isHardwareSensorScope, isIaqSensor]);

  const isIrBlaster = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some(
      (s) =>
        s.includes('ir blaster') ||
        s.includes('irblaster') ||
        s.includes('new ir blaster') ||
        s.includes('old ir blaster')
    );
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isIotControls = React.useMemo(() => {
    if (isWeldingIot || isEms || isIrBlaster) return false;
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return (
      combined.some(
        (s) => s.includes('hardware') || s.includes('control') || s.includes('iot')
      ) ||
      Boolean((activeCostingSheet as any)?.isIotControls) ||
      Boolean((activeCostingSheet as any)?.iotControlsHardwareRows?.length > 0)
    );
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet, isWeldingIot, isEms, isIrBlaster]);

  const isWaterAutomation = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some(
      (s) =>
        s.includes('water automation') ||
        (s.includes('water') && s.includes('automation'))
    );
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isCompressedAirAutomation = React.useMemo(() => {
    if (isWaterAutomation) return false;
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some(
      (s) =>
        s.includes('compressed air automation') ||
        s.includes('air automation') ||
        (s.includes('compressed air') && s.includes('automation'))
    );
  }, [isWaterAutomation, selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isIotOrControls = isWeldDataDigitalized || isWeldingIot || isIotControls || isEms || isIrBlaster || isIaqSensor || isCompressedAirAutomation;

  const isBms = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some((s) => s.includes('bms') || s.includes('building management'));
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isMixtureGasLeakageAudit = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some((s) => s.includes('mixture') || s.includes('mixed gas') || s.includes('gas system'));
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isCpmChillerManagement = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some((s) => s.includes('cpm') || s.includes('chiller plant management') || s.includes('chiller management'));
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isNitrogenGasLeakageAudit = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return !isFlangesHardware && !isDewPointHardware && !isTemperatureSensor && combined.some((s) => s.includes('nitrogen'));
  }, [isFlangesHardware, isDewPointHardware, isTemperatureSensor, selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isCompressorAirLeakageRectification = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return !isFlangesHardware && !isDewPointHardware && !isMixtureGasLeakageAudit && !isNitrogenGasLeakageAudit && combined.some((s) => s.includes('rectification'));
  }, [isFlangesHardware, isDewPointHardware, isMixtureGasLeakageAudit, isNitrogenGasLeakageAudit, selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isCompressorAirLeakageAudit = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return (
      !isCompressedAirAutomation &&
      !isFlangesHardware &&
      !isDewPointHardware &&
      !isMixtureGasLeakageAudit &&
      !isNitrogenGasLeakageAudit &&
      !isCompressorAirLeakageRectification &&
      combined.some(
        (s) =>
          !s.includes('automation') &&
          (s.includes('compressor air leakage') ||
            s.includes('air leakage audit') ||
            s.includes('compressor air audit') ||
            s.includes('compressed air audit') ||
            (s.includes('leakage audit') && !s.includes('mixture') && !s.includes('gas') && !s.includes('nitrogen') && !s.includes('dew point') && !s.includes('flange')))
      )
    );
  }, [isCompressedAirAutomation, isFlangesHardware, isDewPointHardware, isMixtureGasLeakageAudit, isNitrogenGasLeakageAudit, isCompressorAirLeakageRectification, selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isCompressorAirLeakage = isCompressorAirLeakageRectification || isCompressorAirLeakageAudit;

  const isAshraeLevel2 = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some((s) => s.includes('ashrae'));
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isHvacDesign = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some((s) => s.includes('hvac'));
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isEcFan = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some((s) => s.includes('ec fan') || s.includes('ec-fan') || s.includes('ecfan'));
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isIso50001 = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some((s) => s.includes('iso 50001') || s.includes('iso50001') || s.includes('enms') || s.includes('energy management system'));
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isEnergyAudit = React.useMemo(() => {
    if (
      isCompressorAirLeakageAudit ||
      isCompressorAirLeakageRectification ||
      isNitrogenGasLeakageAudit ||
      isMixtureGasLeakageAudit ||
      isAshraeLevel2 ||
      isHvacDesign ||
      isEcFan ||
      isIso50001 ||
      isIotOrControls ||
      isBms ||
      isCpmChillerManagement ||
      isHardwareSensorScope ||
      isIaqSensor
    ) {
      return false;
    }
    const sub = (selectedSubServiceOptions[0] || activeCostingSheet?.subService || '').toLowerCase().trim();
    return (
      sub === 'energy audit' ||
      sub === 'comprehensive energy audit' ||
      sub === 'detailed energy audit' ||
      (sub.includes('energy audit') && !sub.includes('air') && !sub.includes('gas') && !sub.includes('leak') && !sub.includes('rectification'))
    );
  }, [
    isCompressorAirLeakageAudit,
    isCompressorAirLeakageRectification,
    isNitrogenGasLeakageAudit,
    isMixtureGasLeakageAudit,
    isAshraeLevel2,
    isHvacDesign,
    isEcFan,
    isIso50001,
    isIotOrControls,
    isBms,
    isCpmChillerManagement,
    isHardwareSensorScope,
    isIaqSensor,
    selectedSubServiceOptions,
    activeCostingSheet,
  ]);

  // Auto-switch default texts when Weld Data Digitalized, Welding IoT, Water Management, BMS, EMS/IoT, Dew Point Hardware, Compressor Air Leakage Rectification / Audit, ASHRAE Level 2, HVAC Design, EC Fan, Mixture Gas Leakage Audit, Nitrogen Gas Leakage Audit, or Energy Audit mode changes
  useEffect(() => {
    const currentSubKey = `${selectedCategories.join(',')}_${selectedSubServiceOptions.join(',')}`;
    // If editing existing quote and this is the initial load with saved text, do not overwrite with default template
    if (editQuoteId && existingQuote && hasLoadedExistingQuoteRef.current && lastSubServiceRef.current === '') {
      lastSubServiceRef.current = currentSubKey;
      const qAny = existingQuote as any;
      const hasSavedText =
        qAny.customContent?.scopeOfWork ||
        qAny.customContent?.step5Text ||
        qAny.scopeDetails ||
        qAny.proposals?.[0]?.customContent?.step5Text ||
        qAny.proposals?.[0]?.scopeDetails;
      if (hasSavedText) {
        return;
      }
    }
    lastSubServiceRef.current = currentSubKey;

    if (isCompressedAirAutomation) {
      setEmsStep5Text(DEFAULT_COMPRESSED_AIR_AUTOMATION_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_COMPRESSED_AIR_AUTOMATION_STEP6_TEXT);
      setStep7SubmittedBy(`Thanakarthik Kumar\nFounder & Managing Director\n+91-8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nName: SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED\nAccount number: 35860200000750\nIFSC: BARB0VELACH (fifth letter is ZERO)\nBank name: Bank of Baroda\nBranch: VELACHERY BRANCH`);
    } else if (isWeldDataDigitalized) {
      setEmsStep5Text(DEFAULT_DIGIWELD_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_DIGIWELD_STEP6_TEXT);
      setStep7SubmittedBy(`Thanakarthik Kumar\nFounder & Managing Director\n8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nBank – IDFC FIRST Bank\nAccount Number – 10184753095\nIFSC – IDFB0080125\nBranch – BESANT NAGAR BRANCH\nGSTIN NO – 33ABNCS4869A1Z7\nPAN Number – ABNCS4869A\nSWIFT Code - IDFBINBBMUM`);
    } else if (isIrBlaster) {
      setEmsStep5Text(DEFAULT_IR_BLASTER_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_IR_BLASTER_STEP6_TEXT);
      setStep7SubmittedBy(`Thanakarthik\nFounder & CEO\n+91-8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nName: SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED\nAccount number: 35860200000750\nIFSC: BARB0VELACH (fifth letter is ZERO)\nBank name: Bank of Baroda\nBranch: VELACHERY BRANCH`);
    } else if (isWeldingIot) {
      setEmsStep5Text(DEFAULT_WELDING_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_WELDING_STEP6_TEXT);
    } else if (isWaterManagement) {
      setEmsStep5Text(DEFAULT_WATER_MANAGEMENT_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_WATER_MANAGEMENT_STEP6_TEXT);
    } else if (isBms) {
      setEmsStep5Text(DEFAULT_BMS_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_BMS_STEP6_TEXT);
    } else if (isTemperatureSensor) {
      setEmsStep5Text(DEFAULT_TEMPERATURE_SENSOR_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_TEMPERATURE_SENSOR_STEP6_TEXT);
      setStep7SubmittedBy(`Mr. Thanakarthik Kumar K\nFounder & Managing Director\n+91-8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nBank – Bank of Baroda\nAccount Number – 35860200000750\nIFSC – BARB0VELACH (fifth letter is ZERO)\nBranch – VELACHERY BRANCH\nGSTIN NO – 33ABNCS4869A1Z7\nPAN Number – ABNCS4869A`);
    } else if (isDewPointHardware) {
      setEmsStep5Text(DEFAULT_DEW_POINT_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_DEW_POINT_STEP6_TEXT);
      setStep7SubmittedBy(`Mr. Thanakarthik Kumar K\nFounder & Managing Director\n+91-8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nBank – Bank of Baroda\nAccount Number – 35860200000750\nIFSC – BARB0VELACH (fifth letter is ZERO)\nBranch – VELACHERY BRANCH\nGSTIN NO – 33ABNCS4869A1Z7\nPAN Number – ABNCS4869A`);
    } else if (isFlangesHardware) {
      setEmsStep5Text(DEFAULT_FLANGES_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_FLANGES_STEP6_TEXT);
      setStep7SubmittedBy(`Satish Kumar N\nManager - Sales & Operations\n+91-7502244664\nsatishkumar@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nName: SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED\nAccount number: 35860200000750\nIFSC: BARB0VELACH (fifth letter is ZERO)\nBank name: Bank of Baroda\nBranch: VELACHERY BRANCH`);
    } else if (isCpmChillerManagement) {
      setEmsStep5Text(DEFAULT_CPM_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_CPM_STEP6_TEXT);
      setStep7SubmittedBy(`Thanakarthik\nFounder & CEO\n+91-8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nName: SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED\nAccount number: 35860200000750\nIFSC: BARB0VELACH (fifth letter is ZERO)\nBank name: Bank of Baroda\nBranch: VELACHERY BRANCH`);
    } else if (isIotOrControls) {
      setEmsStep5Text(DEFAULT_EMS_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_EMS_STEP6_TEXT);
    } else if (isNitrogenGasLeakageAudit) {
      setEmsStep5Text(DEFAULT_NITROGEN_GAS_LEAKAGE_AUDIT_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_NITROGEN_GAS_LEAKAGE_AUDIT_STEP6_TEXT);
      setStep7SubmittedBy(`Thanakarthik Kumar\nFounder & Managing Director\n+91-8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nBank – Bank of Baroda\nAccount Number – 35860200000750\nIFSC – BARB0VELACH (fifth letter is ZERO)\nBranch – VELACHERY BRANCH\nGSTIN NO – 33ABNCS4869A1Z7\nPAN Number – ABNCS4869A`);
    } else if (isMixtureGasLeakageAudit) {
      setEmsStep5Text(DEFAULT_MIXTURE_GAS_LEAKAGE_AUDIT_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_MIXTURE_GAS_LEAKAGE_AUDIT_STEP6_TEXT);
      setStep7SubmittedBy(`Thanakarthik\nFounder & Managing Director\n+91-8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nBank – Bank of Baroda\nAccount Number – 35860200000750\nIFSC – BARB0VELACH (fifth letter is ZERO)\nBranch – VELACHERY BRANCH\nGSTIN NO – 33ABNCS4869A1Z7\nPAN Number – ABNCS4869A`);
    } else if (isCompressorAirLeakageRectification) {
      setEmsStep5Text(DEFAULT_COMPRESSOR_AIR_LEAKAGE_RECTIFICATION_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_COMPRESSOR_AIR_LEAKAGE_RECTIFICATION_STEP6_TEXT);
      setStep7SubmittedBy(`Thanakarthik Kumar\nFounder & Managing Director\n+91-8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nBank – Bank of Baroda\nAccount Number – 35860200000750\nIFSC – BARB0VELACH (fifth letter is ZERO)\nBranch – VELACHERY BRANCH\nGSTIN NO – 33ABNCS4869A1Z7\nPAN Number – ABNCS4869A`);
    } else if (isCompressorAirLeakageAudit) {
      setEmsStep5Text(DEFAULT_COMPRESSOR_AIR_AUDIT_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_COMPRESSOR_AIR_AUDIT_STEP6_TEXT);
      setStep7SubmittedBy(`Thanakarthik Kumar\nFounder & Managing Director\n+91-8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nBank – Bank of Baroda\nAccount Number – 35860200000750\nIFSC – BARB0VELACH (fifth letter is ZERO)\nBranch – VELACHERY BRANCH\nGSTIN NO – 33ABNCS4869A1Z7\nPAN Number – ABNCS4869A`);
    } else if (isHvacDesign) {
      setEmsStep5Text(DEFAULT_HVAC_DESIGN_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_HVAC_DESIGN_STEP6_TEXT);
      setStep7SubmittedBy(`Thanakarthik Kumar\nFounder & Managing Director\n+91-8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nBank – Bank of Baroda\nAccount Number – 35860200000750\nIFSC – BARB0VELACH (fifth letter is ZERO)\nBranch – VELACHERY BRANCH\nGSTIN NO – 33ABNCS4869A1Z7\nPAN Number – ABNCS4869A`);
    } else if (isEcFan) {
      setEmsStep5Text(DEFAULT_EC_FAN_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_EC_FAN_STEP6_TEXT);
      setStep7SubmittedBy(`Thanakarthik Kumar\nFounder & Managing Director\n+91-8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nBank – Bank of Baroda\nAccount Number – 35860200000750\nIFSC – BARB0VELACH (fifth letter is ZERO)\nBranch – VELACHERY BRANCH\nGSTIN NO – 33ABNCS4869A1Z7\nPAN Number – ABNCS4869A`);
    } else if (isAshraeLevel2) {
      setEmsStep5Text(DEFAULT_ASHRAE_LEVEL_2_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_ASHRAE_LEVEL_2_STEP6_TEXT);
      setStep7SubmittedBy(`Thanakarthik\nFounder & Managing Director\n+91-8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nBank – Bank of Baroda\nAccount Number – 35860200000750\nIFSC – BARB0VELACH (fifth letter is ZERO)\nBranch – VELACHERY BRANCH\nGSTIN NO – 33ABNCS4869A1Z7\nPAN Number – ABNCS4869A`);
    } else if (isIso50001) {
      setEmsStep5Text(DEFAULT_ISO_50001_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_ISO_50001_STEP6_TEXT);
      setStep7SubmittedBy(`Thanakarthik\nFounder & Managing Director\n+91-8377007638\nthanakarthik@sustainabyte.ai`);
      setStep7BankDetails(`Bank Account details:\nBank – Bank of Baroda\nAccount Number – 35860200000750\nIFSC – BARB0VELACH (fifth letter is ZERO)\nBranch – VELACHERY BRANCH\nGSTIN NO – 33ABNCS4869A1Z7\nPAN Number – ABNCS4869A`);
    } else if (isEnergyAudit) {
      setEmsStep5Text(DEFAULT_ENERGY_AUDIT_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_ENERGY_AUDIT_STEP6_TEXT);
    }
  }, [isCompressedAirAutomation, isWeldDataDigitalized, isWeldingIot, isWaterManagement, isBms, isIotOrControls, isCpmChillerManagement, isFlangesHardware, isDewPointHardware, isNitrogenGasLeakageAudit, isMixtureGasLeakageAudit, isCompressorAirLeakageRectification, isCompressorAirLeakageAudit, isHvacDesign, isEcFan, isAshraeLevel2, isIso50001, isEnergyAudit, editQuoteId, existingQuote]);

  // Compressor Air Leakage ROI State & Phase Scope Details
  const [compressorRoiData, setCompressorRoiData] = useState<CompressorRoiData>(DEFAULT_COMPRESSOR_ROI_DATA);
  const [isEditingCompressorRoi, setIsEditingCompressorRoi] = useState<boolean>(true);

  const updateCompressorRoiField = (field: keyof CompressorRoiData, value: any) => {
    setCompressorRoiData((prev) => {
      const updated = { ...prev, [field]: value };
      const kwhMonth = field === 'monthlyKwhLoss' ? Number(value) || 0 : prev.monthlyKwhLoss;
      const elecRate = field === 'electricityCostPerKwh' ? Number(value) || 0 : prev.electricityCostPerKwh;
      const invest = field === 'investmentRs' ? Number(value) || 0 : prev.investmentRs;

      const annualKwh = Math.round(kwhMonth * 12);
      const monthlyLoss = Math.round(kwhMonth * elecRate);
      const annualLoss = Math.round(monthlyLoss * 12);
      const paybackY = annualLoss > 0 ? Number((invest / annualLoss).toFixed(2)) : 0;
      const paybackM = monthlyLoss > 0 ? Math.round(invest / monthlyLoss) : 0;

      return {
        ...updated,
        annualKwhLoss: annualKwh,
        monthlyLossRs: monthlyLoss,
        annualLossRs: annualLoss,
        totalAnnualRecoverableSavingRs: annualLoss,
        paybackYears: paybackY,
        paybackMonths: paybackM,
      };
    });
  };

  // IoT & Controls Step 5 Itemized Rows State (Supports Welding IoT, EMS, IoT Controls, and Custom)
  const [iotStep5Rows, setIotStep5Rows] = useState<Array<{
    id: string;
    section?: string;
    stepNo: number | string;
    description: string;
    qty: number;
    uom: string;
    customerPrice: number;
    isRecurring?: boolean;
  }>>([
    {
      id: 'iot-s1',
      stepNo: '1',
      description: 'Supply of 4G IoT Gateway for Communication with SIM card, SMPS & Antenna - Edge Lite',
      qty: 0,
      uom: 'Nos',
      customerPrice: 0,
    },
    {
      id: 'iot-s2',
      stepNo: '2',
      description: 'Supply of RS485 energy meter with communication and wiring accessories',
      qty: 0,
      uom: 'Nos',
      customerPrice: 0,
    },
    {
      id: 'iot-s3',
      stepNo: '3',
      description: 'Supply of electrical consumables such as flexible hose, cable ties and all other accessories',
      qty: 0,
      uom: 'Job',
      customerPrice: 0,
    },
    {
      id: 'iot-s4',
      stepNo: '4',
      description:
        'Installation and commissioning of IoT devices, gateways, modems, and associated electrical/control components including startup, testing, and functional verification. Communication cable laying and routing through conduits, cable trays, and raceways with proper dressing, tagging, and termination. Conduit pipe laying for electrical and communication cabling as per site layout. Modem configuration, network setup, data mapping, testing, troubleshooting, and data validation',
      qty: 0,
      uom: 'Nodes',
      customerPrice: 0,
    },
    {
      id: 'iot-s5',
      stepNo: '5',
      description:
        'IoT device configuration, protocol setup (Modbus, BACnet, MQTT), and integration with BMS/EMS platforms. Network connectivity, dashboard mapping, alarm configuration, and cloud/server integration support System commissioning including startup, functional testing, calibration, and performance verification Troubleshooting, integration testing, client demonstration, and final handover support Electrical power/control cable laying, routing, termination, tagging, and insulation testing as per standard',
      qty: 0,
      uom: 'Nodes',
      customerPrice: 0,
    },
    {
      id: 'iot-s6',
      stepNo: '6',
      description:
        'OptiByte Dashboard, Intelligent reporting, Group and machine level reporting, Email on any threshold value breach, Alert on Mobile(via SMS), Auto detection of anomalies, water flow rate, water capacity. We will check with the pH and TDS meter, if we can integrate it with our dashboard',
      qty: 0,
      uom: 'Nodes',
      customerPrice: 0,
      isRecurring: true,
    },
  ]);

  // Step 3 Energy Audit State (Scope Cards & Track Record Clients)
  const [energyAuditScopeCards, setEnergyAuditScopeCards] = useState<Array<{ id: string; title: string; description: string }>>(
    DEFAULT_ENERGY_AUDIT_SCOPE_CARDS
  );
  const [energyAuditTrackClients, setEnergyAuditTrackClients] = useState<string[]>(
    ENERGY_AUDIT_TRACK_RECORD_CLIENTS
  );
  const [isEditingEnergyAuditStep3, setIsEditingEnergyAuditStep3] = useState<boolean>(false);
  const [newClientInput, setNewClientInput] = useState<string>('');

  // Helper to safely resolve non-zero customer price from any saved costing row
  const resolvePrice = (r: any, defaultPrice = 0) => {
    const p = Number(
      r.customerPrice ??
      r.priceWithBuffer ??
      r.yearlyPrice ??
      r.totalPrice ??
      r.roundedPrice ??
      r.price ??
      r.unitPrice ??
      r.sellingPrice ??
      r.cost ??
      r.totalCost ??
      0
    );
    if (p > 0) return p;
    if (r.unitCost && Number(r.unitCost) > 0) {
      const cost = Number(r.unitCost) * (Number(r.qty) || 1);
      const price = (cost / 0.6) * 1.1;
      return Math.round(price);
    }
    return defaultPrice;
  };

  // Helper to extract exact active commercial items from any costing sheet
  const extractRowsFromCostingSheet = (sheet: any) => {
    if (!sheet) return;
    const sheetAny = sheet as any;
    const sub = (sheetAny.subService || '').toLowerCase();
    const cat = (sheetAny.serviceCategory || '').toLowerCase();

    // 1. IR Blaster / New IR Blaster
    if (sub.includes('ir blaster') || sub.includes('ir') || cat.includes('ir blaster')) {
      const extracted: any[] = [];
      const hwRows = sheetAny.iotControlsHardwareRows || sheetAny.hardwareRows || [];
      const activeHw = hwRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0);

      if (activeHw.length > 0) {
        activeHw.forEach((r: any, idx: number) => {
          const q = Number(r.quantity || r.qty || 1);
          const unitPrice = r.unitPrice
            ? Number(r.unitPrice)
            : Math.round(Number(r.unitCost || 4500) / 0.6);
          extracted.push({
            id: `ir-hw-${idx}`,
            section: '1. IR Blaster Hardware & Installation Scope',
            stepNo: `${idx + 1}`,
            description: r.productDescription || r.itemDescription || 'IR Blaster Unit',
            qty: q,
            uom: r.uom || 'Nos',
            customerPrice: Math.round(q * unitPrice),
          });
        });
      }

      const mdRows = sheetAny.iotControlsMandaysRows || [];
      const activeMd = mdRows.filter((r: any) => Number(r.mandays || 0) > 0 && Number(r.totalCost || r.ratePerDay || 0) > 0);
      activeMd.forEach((r: any, idx: number) => {
        extracted.push({
          id: `ir-md-${idx}`,
          section: '2. Engineering & Commissioning Scope',
          stepNo: `${extracted.length + 1}`,
          description: `${r.designation || 'Specialist'}: ${r.description || ''}`,
          qty: Number(r.mandays || 1),
          uom: 'Mandays',
          customerPrice: resolvePrice(r, Number(r.totalCost || (r.ratePerDay ? r.ratePerDay * r.mandays : 25000))),
        });
      });

      const opRows = sheetAny.iotControlsOpexRows || sheetAny.opexRows || [];
      const activeOp = opRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0 && Number(r.yearlyPrice || r.unitPrice || 0) > 0);
      activeOp.forEach((r: any, idx: number) => {
        const q = Number(r.quantity || r.qty || 1);
        const price = Number(r.yearlyPrice || (r.unitPrice ? r.unitPrice * q : 0));
        extracted.push({
          id: `ir-op-${idx}`,
          section: '3. Cloud & Platform Telemetry Scope',
          stepNo: `${extracted.length + 1}`,
          description: r.scopeDescription || r.item || 'OptiByte Cloud Platform Subscription (Yearly)',
          qty: q,
          uom: 'Year',
          customerPrice: price,
          isRecurring: true,
        });
      });

      // Match exact finalQuote from API
      if (Number(sheetAny.finalQuote) > 0 && extracted.length > 0) {
        const sumExt = extracted.reduce((sum, item) => sum + item.customerPrice, 0);
        if (sumExt !== Number(sheetAny.finalQuote)) {
          const factor = Number(sheetAny.finalQuote) / (sumExt || 1);
          extracted.forEach((item) => {
            item.customerPrice = Math.round(item.customerPrice * factor);
          });
        }
      }

      if (extracted.length > 0) {
        setIotStep5Rows(extracted);
      }
      return;
    }

    // 2. CPM (Chiller Plant Management)
    if (sub.includes('cpm') || sub.includes('chiller') || cat.includes('chiller')) {
      const extracted: any[] = [];
      const hwRows = sheetAny.cpmHardwareRows || [];
      const activeHw = hwRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0 && Number(r.customerPrice || r.unitPrice || r.unitCost || 0) > 0);
      activeHw.forEach((r: any, idx: number) => {
        extracted.push({
          id: `cpm-hw-${idx}`,
          section: '1. Hardware Capex (Sensors, Server, DDC Panels & Gateway)',
          stepNo: `${idx + 1}`,
          description: r.description || r.item || 'Hardware Component',
          qty: Number(r.quantity || r.qty || 1),
          uom: r.unit || r.uom || 'Nos',
          customerPrice: Number(r.customerPrice || (Number(r.unitPrice || r.unitCost || 0) * Number(r.quantity || 1))),
        });
      });

      const elecRows = sheetAny.cpmElectricalRows || [];
      const activeElec = elecRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0 && Number(r.customerPrice || r.unitPrice || r.unitCost || 0) > 0);
      activeElec.forEach((r: any, idx: number) => {
        extracted.push({
          id: `cpm-el-${idx}`,
          section: '2. Electrical Consumables & Field Installation Materials',
          stepNo: `${idx + 1}`,
          description: r.description || r.item || 'Electrical Material',
          qty: Number(r.quantity || r.qty || 1),
          uom: r.unit || r.uom || 'Mtr',
          customerPrice: Number(r.customerPrice || (Number(r.unitPrice || r.unitCost || 0) * Number(r.quantity || 1))),
        });
      });

      const instPrice = Number(sheetAny.cpmInstManpowerTotalPrice || sheetAny.cpmInstallationCharges || 0);
      if (instPrice > 0) {
        extracted.push({
          id: 'cpm-inst',
          section: '3. Installation, Cabling & Sensor Mounting Charges',
          stepNo: '1',
          description: 'Installation charges for hardware and electrical items',
          qty: 1,
          uom: 'Lot',
          customerPrice: instPrice,
        });
      }

      const commPrice = Number(sheetAny.cpmCommissioningTotalPrice || sheetAny.cpmTestingCommissioningCharges || 0);
      if (commPrice > 0) {
        extracted.push({
          id: 'cpm-comm',
          section: '4. Testing & Commissioning Scope',
          stepNo: '1',
          description: 'Testing & Commissioning of CPM Plant Automation & DDC Interface',
          qty: 1,
          uom: 'Lot',
          customerPrice: commPrice,
        });
      }

      const cloudRows = sheetAny.cpmCloudChargeRows || [];
      const activeCloud = cloudRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0 && Number(r.customerPrice || r.unitPrice || 0) > 0);
      activeCloud.forEach((r: any, idx: number) => {
        extracted.push({
          id: `cpm-cl-${idx}`,
          section: '5. Software & Cloud Telemetry Scope',
          stepNo: `${idx + 1}`,
          description: `${r.scope || r.description || 'Cloud Service'}: ${r.softwarePlatform || ''}`,
          qty: Number(r.quantity || 1),
          uom: 'Year',
          customerPrice: Number(r.customerPrice || r.unitPrice || 0),
          isRecurring: true,
        });
      });

      // Match exact finalQuote
      if (Number(sheetAny.finalQuote) > 0 && extracted.length > 0) {
        const sumExt = extracted.reduce((sum, item) => sum + item.customerPrice, 0);
        if (sumExt !== Number(sheetAny.finalQuote)) {
          const factor = Number(sheetAny.finalQuote) / (sumExt || 1);
          extracted.forEach((item) => {
            item.customerPrice = Math.round(item.customerPrice * factor);
          });
        }
      }

      if (extracted.length > 0) {
        setIotStep5Rows(extracted);
      }
      return;
    }
  };

  // Sync parameters from activeCostingSheet when matched
  useEffect(() => {
    if (activeCostingSheet && !editQuoteId) {
      if (activeCostingSheet.marginPct !== undefined && activeCostingSheet.marginPct !== null) {
        setMarginPct(Number(activeCostingSheet.marginPct));
      }
      if (activeCostingSheet.bufferPct !== undefined && activeCostingSheet.bufferPct !== null) {
        setBufferPct(Number(activeCostingSheet.bufferPct));
      }
      if (activeCostingSheet.siteWorkingDays) {
        setSiteDays(activeCostingSheet.siteWorkingDays);
      }
      if (activeCostingSheet.reportWorkingDays) {
        setReportDays(activeCostingSheet.reportWorkingDays);
      }
      if (activeCostingSheet.totalExtraCost !== undefined) {
        setFoodTravelCost(Number(activeCostingSheet.totalExtraCost));
      }

      const sheetAny = activeCostingSheet as any;

      if (isIrBlaster || isCpmChillerManagement) {
        extractRowsFromCostingSheet(sheetAny);
      } else if (isWeldDataDigitalized) {
        const extracted: Array<{
          id: string;
          section?: string;
          stepNo: number | string;
          description: string;
          qty: number;
          uom: string;
          customerPrice: number;
          isRecurring?: boolean;
        }> = [];

        const swRows =
          sheetAny?.weldingSoftwareRows && sheetAny.weldingSoftwareRows.length > 0
            ? sheetAny.weldingSoftwareRows
            : INITIAL_DIGIWELD_SOFTWARE_ROWS;

        swRows.forEach((r: any, idx: number) => {
          extracted.push({
            id: `dw-${idx}`,
            section: '1. ONE TIME COST ',
            stepNo: `${idx + 1}`,
            description: `${r.item || r.description || 'Deliverable'}`,
            qty: typeof r.qty === 'number' ? r.qty : 1,
            uom: r.uom || 'Job',
            customerPrice: resolvePrice(r, Number(r.price || (r.unitPrice * (r.qty || 1)) || 0)),
          });
        });

        const cloudRows =
          sheetAny?.weldingCloudRows && sheetAny.weldingCloudRows.length > 0
            ? sheetAny.weldingCloudRows
            : INITIAL_DIGIWELD_CLOUD_ROWS;

        cloudRows.forEach((r: any, idx: number) => {
          const qty = Number(r.qty || 1);
          const monthlyPrice = Number(r.monthlyPrice || r.unitMonthlyPrice || 0);
          const yearlyPrice = Number(r.yearlyPrice || monthlyPrice * 12);
          extracted.push({
            id: `dwc-${idx}`,
            section: '2. RECURRING COST',
            stepNo: `${idx + 1}`,
            description: `${r.component || 'Cloud Service'}: ${r.description || ''}`,
            qty,
            uom: r.uom || 'Month',
            customerPrice: resolvePrice(r, monthlyPrice),
            isRecurring: true,
          });
        });

        setIotStep5Rows(extracted);
      } else if (isWeldingIot) {
        const extracted: Array<{
          id: string;
          section?: string;
          stepNo: number | string;
          description: string;
          qty: number;
          uom: string;
          customerPrice: number;
          isRecurring?: boolean;
        }> = [];

        const hwRows =
          sheetAny?.weldingHardwareRows && sheetAny.weldingHardwareRows.length > 0
            ? sheetAny.weldingHardwareRows
            : INITIAL_WELDING_HARDWARE_ROWS;

        hwRows.forEach((r: any, idx: number) => {
          extracted.push({
            id: `wh-${idx}`,
            section: '1. Welding Hardware & Development Scope',
            stepNo: r.slNo ? String(r.slNo) : `${idx + 1}`,
            description: r.componentName || r.description || r.itemDescription || 'Welding Hardware Component',
            qty: typeof r.qty === 'number' ? r.qty : 1,
            uom: 'Nos',
            customerPrice: resolvePrice(r, Number(r.unitPrice || r.unitCost || 8300)),
          });
        });

        const swRows =
          sheetAny?.weldingSoftwareRows && sheetAny.weldingSoftwareRows.length > 0
            ? sheetAny.weldingSoftwareRows
            : INITIAL_WELDING_SOFTWARE_ROWS;

        swRows.forEach((r: any, idx: number) => {
          extracted.push({
            id: `ws-${idx}`,
            section: '2. Welding Analytics & Logic Software Scope',
            stepNo: `${idx + 1}`,
            description: `${r.item || 'Software Development'}${r.description && r.description !== r.item ? `: ${r.description}` : ''}`,
            qty: 1,
            uom: r.uom || 'Job',
            customerPrice: resolvePrice(r, Number(r.price || r.unitPrice || 0)),
          });
        });

        const instRows =
          sheetAny?.weldingInstallationRows && sheetAny.weldingInstallationRows.length > 0
            ? sheetAny.weldingInstallationRows
            : INITIAL_WELDING_INSTALLATION_ROWS;

        instRows.forEach((r: any, idx: number) => {
          const qty = Number(r.qty || 1);
          extracted.push({
            id: `wi-${idx}`,
            section: '3. Installation & Commissioning Charges',
            stepNo: `${idx + 1}`,
            description: r.item || 'Installation and Commissioning',
            qty,
            uom: r.uom || 'Nos',
            customerPrice: resolvePrice(r, Number(r.price || 25000)),
          });
        });

        const cloudRows =
          sheetAny?.weldingCloudRows && sheetAny.weldingCloudRows.length > 0
            ? sheetAny.weldingCloudRows
            : INITIAL_WELDING_CLOUD_ROWS;

        cloudRows.forEach((r: any, idx: number) => {
          const qty = Number(r.qty || 1);
          const monthlyPrice = Number(r.monthlyPrice || r.unitMonthlyPrice || 0);
          const yearlyPrice = Number(r.yearlyPrice || monthlyPrice * 12);
          extracted.push({
            id: `wc-${idx}`,
            section: '4. Cloud Platform & Recurring Services',
            stepNo: `${idx + 1}`,
            description: `${r.component || 'Cloud Service'} (${r.type || 'Cloud'}): ${r.description || ''}`,
            qty,
            uom: r.uom || 'Year',
            customerPrice: resolvePrice(r, yearlyPrice),
            isRecurring: true,
          });
        });

        setIotStep5Rows(extracted);
      } else if (isIrBlaster) {
        const extracted: Array<{
          id: string;
          section?: string;
          stepNo: number | string;
          description: string;
          qty: number;
          uom: string;
          customerPrice: number;
          isRecurring?: boolean;
        }> = [];

        const hwRows =
          sheetAny?.iotControlsHardwareRows && sheetAny.iotControlsHardwareRows.length > 0
            ? sheetAny.iotControlsHardwareRows
            : sheetAny?.hardwareRows || [];

        const activeHw = hwRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0);

        if (activeHw.length > 0) {
          activeHw.forEach((r: any, idx: number) => {
            const q = Number(r.quantity || r.qty || 1);
            const unitPrice = r.unitPrice
              ? Number(r.unitPrice)
              : Math.round(Number(r.unitCost || 4500) / 0.6);
            extracted.push({
              id: `ir-hw-${idx}`,
              section: '1. IR Blaster Hardware & Installation Scope',
              stepNo: `${idx + 1}`,
              description: r.productDescription || r.itemDescription || 'IR Blaster Unit',
              qty: q,
              uom: r.uom || 'Nos',
              customerPrice: Math.round(q * unitPrice),
            });
          });
        }

        const mdRows = sheetAny?.iotControlsMandaysRows || [];
        const activeMd = mdRows.filter((r: any) => Number(r.mandays || 0) > 0 && Number(r.totalCost || r.ratePerDay || 0) > 0);
        activeMd.forEach((r: any, idx: number) => {
          extracted.push({
            id: `ir-md-${idx}`,
            section: '2. Engineering & Commissioning Scope',
            stepNo: `${extracted.length + 1}`,
            description: `${r.designation || 'Specialist'}: ${r.description || ''}`,
            qty: Number(r.mandays || 1),
            uom: 'Mandays',
            customerPrice: resolvePrice(r, Number(r.totalCost || (r.ratePerDay ? r.ratePerDay * r.mandays : 25000))),
          });
        });

        const opRows = sheetAny?.iotControlsOpexRows || sheetAny?.opexRows || [];
        const activeOp = opRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0 && Number(r.yearlyPrice || r.unitPrice || 0) > 0);
        activeOp.forEach((r: any, idx: number) => {
          const q = Number(r.quantity || r.qty || 1);
          const price = Number(r.yearlyPrice || (r.unitPrice ? r.unitPrice * q : 0));
          extracted.push({
            id: `ir-op-${idx}`,
            section: '3. Cloud & Platform Telemetry Scope',
            stepNo: `${extracted.length + 1}`,
            description: r.scopeDescription || r.item || 'OptiByte Cloud Platform Subscription (Yearly)',
            qty: q,
            uom: 'Year',
            customerPrice: price,
            isRecurring: true,
          });
        });

        // If sheet has a specific finalQuote, scale items to match exactly
        if (Number(sheetAny?.finalQuote) > 0 && extracted.length > 0) {
          const sumExt = extracted.reduce((sum, item) => sum + item.customerPrice, 0);
          if (sumExt !== Number(sheetAny.finalQuote)) {
            const factor = Number(sheetAny.finalQuote) / (sumExt || 1);
            extracted.forEach((item) => {
              item.customerPrice = Math.round(item.customerPrice * factor);
            });
          }
        }

        if (extracted.length > 0) {
          setIotStep5Rows(extracted);
        }
      } else if (isCpmChillerManagement) {
        const extracted: Array<{
          id: string;
          section?: string;
          stepNo: number | string;
          description: string;
          qty: number;
          uom: string;
          customerPrice: number;
          isRecurring?: boolean;
        }> = [];

        const hwRows = sheetAny?.cpmHardwareRows || [];
        const activeHw = hwRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0 && Number(r.customerPrice || r.unitPrice || r.unitCost || 0) > 0);
        activeHw.forEach((r: any, idx: number) => {
          extracted.push({
            id: `cpm-hw-${idx}`,
            section: '1. Hardware Capex (Sensors, Server, DDC Panels & Gateway)',
            stepNo: `${idx + 1}`,
            description: r.description || r.item || 'Hardware Component',
            qty: Number(r.quantity || r.qty || 1),
            uom: r.unit || r.uom || 'Nos',
            customerPrice: Number(r.customerPrice || (Number(r.unitPrice || r.unitCost || 0) * Number(r.quantity || 1))),
          });
        });

        const elecRows = sheetAny?.cpmElectricalRows || [];
        const activeElec = elecRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0 && Number(r.customerPrice || r.unitPrice || r.unitCost || 0) > 0);
        activeElec.forEach((r: any, idx: number) => {
          extracted.push({
            id: `cpm-el-${idx}`,
            section: '2. Electrical Consumables & Field Installation Materials',
            stepNo: `${idx + 1}`,
            description: r.description || r.item || 'Electrical Material',
            qty: Number(r.quantity || r.qty || 1),
            uom: r.unit || r.uom || 'Mtr',
            customerPrice: Number(r.customerPrice || (Number(r.unitPrice || r.unitCost || 0) * Number(r.quantity || 1))),
          });
        });

        const instPrice = Number(sheetAny?.cpmInstManpowerTotalPrice || sheetAny?.cpmInstallationCharges || 0);
        if (instPrice > 0) {
          extracted.push({
            id: 'cpm-inst',
            section: '3. Installation, Cabling & Sensor Mounting Charges',
            stepNo: '1',
            description: 'Installation charges for hardware and electrical items (cabling, GI tray, conduit pipe & panel mounting)',
            qty: 1,
            uom: 'Lot',
            customerPrice: instPrice,
          });
        }

        const commPrice = Number(sheetAny?.cpmCommissioningTotalPrice || sheetAny?.cpmTestingCommissioningCharges || 0);
        if (commPrice > 0) {
          extracted.push({
            id: 'cpm-comm',
            section: '4. Testing & Commissioning Scope',
            stepNo: '1',
            description: 'Testing & Commissioning of CPM Plant Automation, Sensors, Modbus Controller Logic & DDC Interface',
            qty: 1,
            uom: 'Lot',
            customerPrice: commPrice,
          });
        }

        const cloudRows = sheetAny?.cpmCloudChargeRows || [];
        const activeCloud = cloudRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0 && Number(r.customerPrice || r.unitPrice || 0) > 0);
        activeCloud.forEach((r: any, idx: number) => {
          extracted.push({
            id: `cpm-cl-${idx}`,
            section: '5. Software & Cloud Telemetry Scope',
            stepNo: `${idx + 1}`,
            description: `${r.scope || r.description || 'Cloud Service'}: ${r.softwarePlatform || ''}`,
            qty: Number(r.quantity || 1),
            uom: 'Year',
            customerPrice: Number(r.customerPrice || r.unitPrice || 0),
            isRecurring: true,
          });
        });

        const onPremRows = sheetAny?.cpmOnPremiseRows || [];
        const activeOnPrem = onPremRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0 && Number(r.customerPrice || r.unitPrice || 0) > 0);
        activeOnPrem.forEach((r: any, idx: number) => {
          extracted.push({
            id: `cpm-op-${idx}`,
            section: '6. On-Premise Platform & AMC Scope',
            stepNo: `${idx + 1}`,
            description: `${r.scope || r.description || 'On-Premise'}: ${r.softwarePlatform || ''}`,
            qty: Number(r.quantity || 1),
            uom: 'Year',
            customerPrice: Number(r.customerPrice || r.unitPrice || 0),
            isRecurring: true,
          });
        });

        // Ensure total matches finalQuote exactly
        if (Number(sheetAny?.finalQuote) > 0 && extracted.length > 0) {
          const sumExt = extracted.reduce((sum, item) => sum + item.customerPrice, 0);
          if (sumExt !== Number(sheetAny.finalQuote)) {
            const factor = Number(sheetAny.finalQuote) / (sumExt || 1);
            extracted.forEach((item) => {
              item.customerPrice = Math.round(item.customerPrice * factor);
            });
          }
        }

        if (extracted.length > 0) {
          setIotStep5Rows(extracted);
        }
      } else if (isHardwareSensorScope) {
        const extracted: Array<{
          id: string;
          section?: string;
          stepNo: number | string;
          description: string;
          qty: number;
          uom: string;
          customerPrice: number;
          isRecurring?: boolean;
        }> = [];

        const hwRows =
          (sheetAny?.iotControlsHardwareRows && sheetAny.iotControlsHardwareRows.length > 0 ? sheetAny.iotControlsHardwareRows : null) ||
          (sheetAny?.hardwareRows && sheetAny.hardwareRows.length > 0 ? sheetAny.hardwareRows : null) ||
          (sheetAny?.emsGatewayHardwareRows && sheetAny.emsGatewayHardwareRows.length > 0 ? sheetAny.emsGatewayHardwareRows : null) ||
          [];

        const activeHw = hwRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0);
        if (activeHw.length > 0) {
          activeHw.forEach((r: any, idx: number) => {
            const q = Number(r.quantity || r.qty || 1);
            const price = Number(r.customerPrice || r.unitPrice || 0) * (r.customerPrice ? 1 : q) ||
              resolvePrice(r, Math.round(Number(r.unitPrice || 5000) * q));
            extracted.push({
              id: `hw-${idx}`,
              section: '1. Hardware Scope',
              stepNo: r.slNo || `${idx + 1}`,
              description: r.productDescription || r.description || r.itemDescription || 'Supply of Sensor Hardware',
              qty: q,
              uom: r.uom || 'Nos',
              customerPrice: price,
            });
          });
        } else {
          extracted.push({
            id: 'hw-1',
            section: '1. Hardware Scope',
            stepNo: '1',
            description: isTemperatureSensor
              ? 'Supply of Temperature & Humidity IoT Sensors & Gateway Modules'
              : isDewPointHardware
              ? 'Supply of Dew Point Sensor'
              : 'Supply of Industrial Flanges & Accessories',
            qty: 1,
            uom: 'Lot',
            customerPrice: Number(sheetAny?.finalQuote || 81600),
          });
        }

        if (Number(sheetAny?.finalQuote) > 0 && extracted.length > 0) {
          const sumExt = extracted.reduce((sum, item) => sum + item.customerPrice, 0);
          if (sumExt !== Number(sheetAny.finalQuote) && sumExt > 0) {
            const factor = Number(sheetAny.finalQuote) / sumExt;
            extracted.forEach((item) => {
              item.customerPrice = Math.round(item.customerPrice * factor);
            });
          }
        }

        if (extracted.length > 0) {
          setIotStep5Rows(extracted);
        }
      } else if (isIotControls) {
        const roundToNearest = (val: number, nearest: number = 100): number => {
          const step = Number(nearest) || 1;
          return Math.ceil(val / step) * step;
        };

        const buffer = Number(sheetAny?.bufferPct !== undefined ? sheetAny.bufferPct : 10);
        const margin = Number(sheetAny?.marginPct !== undefined ? sheetAny.marginPct : 40);
        const nearest = Number(sheetAny?.roundingNearest || 100);

        const extracted: Array<{
          id: string;
          section?: string;
          stepNo: number | string;
          description: string;
          qty: number;
          uom: string;
          customerPrice: number;
          isRecurring?: boolean;
        }> = [];

        const hwRows =
          sheetAny?.iotControlsHardwareRows && sheetAny.iotControlsHardwareRows.length > 0
            ? sheetAny.iotControlsHardwareRows
            : INITIAL_IOT_CONTROLS_HARDWARE_ROWS;

        const activeHw = hwRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0);
        activeHw.forEach((r: any, idx: number) => {
          const q = Number(r.quantity || r.qty || 1);
          const rawPrice = Number(r.unitPrice || 0) > 0 ? Number(r.unitPrice) * q : calcPriceFromCost(Number(r.unitCost || 5000), r.marginPct ?? margin) * q;
          const custPrice = buffer > 0 ? roundToNearest(rawPrice / Math.max(0.01, (100 - buffer) / 100), nearest) : roundToNearest(rawPrice, nearest);
          extracted.push({
            id: `ich-${idx}`,
            section: '1. IoT Hardware & Control Panel Scope',
            stepNo: r.slNo || `${idx + 1}`,
            description: r.productDescription || r.itemDescription || 'Hardware Control Component',
            qty: q,
            uom: 'Nos',
            customerPrice: resolvePrice(r, custPrice),
          });
        });

        const mdRows = sheetAny?.iotControlsMandaysRows || [];
        const activeMd = mdRows.filter((r: any) => Number(r.mandays || 0) > 0 && Number(r.totalCost || r.ratePerDay || 0) > 0);
        activeMd.forEach((r: any, idx: number) => {
          const rawCost = Number(r.totalCost || (r.ratePerDay ? r.ratePerDay * r.mandays : 25000));
          const rawPrice = calcPriceFromCost(rawCost, margin);
          const custPrice = buffer > 0 ? roundToNearest(rawPrice / Math.max(0.01, (100 - buffer) / 100), nearest) : roundToNearest(rawPrice, nearest);
          extracted.push({
            id: `icm-${idx}`,
            section: '2. Engineering & Commissioning Mandays Scope',
            stepNo: `${extracted.length + 1}`,
            description: `${r.designation || 'Specialist'}: ${r.description || ''}`,
            qty: Number(r.mandays || 1),
            uom: 'Mandays',
            customerPrice: resolvePrice(r, custPrice),
          });
        });

        const opRows = sheetAny?.iotControlsOpexRows || [];
        const activeOp = opRows.filter((r: any) => Number(r.quantity || r.qty || 0) > 0 && Number(r.yearlyPrice || r.unitPrice || 0) > 0);
        activeOp.forEach((r: any, idx: number) => {
          const q = Number(r.quantity || 1);
          const rawPrice = Number(r.unitPrice || 0) > 0 ? Number(r.unitPrice) * q : Number(r.yearlyPrice || 12000);
          const custPrice = buffer > 0 ? roundToNearest(rawPrice / Math.max(0.01, (100 - buffer) / 100), nearest) : roundToNearest(rawPrice, nearest);
          extracted.push({
            id: `ico-${idx}`,
            section: '3. Annual Maintenance & Cloud OPEX Scope',
            stepNo: `${extracted.length + 1}`,
            description: `${r.item || 'OPEX Support'}: ${r.description || ''}`,
            qty: q,
            uom: 'Year',
            customerPrice: resolvePrice(r, custPrice),
            isRecurring: true,
          });
        });

        // Alignment with sheetAny.finalQuote if available
        if (sheetAny?.finalQuote && Number(sheetAny.finalQuote) > 0 && extracted.length > 0) {
          const currentSum = extracted.reduce((sum, item) => sum + (item.customerPrice || 0), 0);
          if (currentSum !== Number(sheetAny.finalQuote)) {
            extracted[0].customerPrice += (Number(sheetAny.finalQuote) - currentSum);
          }
        }

        if (extracted.length > 0) {
          setIotStep5Rows(extracted);
        }
      } else if (isEms) {
        const roundToNearest = (val: number, nearest: number = 100): number => {
          const step = Number(nearest) || 1;
          return Math.ceil(val / step) * step;
        };

        const buffer = Number(sheetAny.bufferPct || 10);
        const margin = Number(sheetAny.marginPct || 40);
        
        let nearest = Number(sheetAny.roundingNearest || sheetAny.instrumentRows?.roundingNearest || 0);
        if (!nearest || nearest <= 0) {
          if (Number(sheetAny.finalQuote) === 168500 || (Number(sheetAny.finalQuote) > 0 && Number(sheetAny.finalQuote) % 500 === 0)) {
            nearest = 500;
          } else {
            nearest = 100;
          }
        }

        const gwRows = sheetAny.emsGatewayHardwareRows || sheetAny.instrumentRows?.emsGatewayHardwareRows || [];
        const ehwRows = sheetAny.emsElectricalHardwareRows || sheetAny.instrumentRows?.emsElectricalHardwareRows || [];
        const mpRows = sheetAny.emsManpowerRows || sheetAny.manpowerRows || sheetAny.instrumentRows?.emsManpowerRows || [];
        const pfRows = sheetAny.emsPlatformRows || sheetAny.instrumentRows?.emsPlatformRows || [];
        const rcRows = sheetAny.emsRecurringRows || sheetAny.instrumentRows?.emsRecurringRows || [];

        // 1. Gateway Hardware (1a)
        const row1a = gwRows[0];
        const price1 = row1a ? Number(row1a.qty || 1) * calcPriceFromCost(Number(row1a.unitCost || 7000), row1a.marginPct ?? margin) : calcPriceFromCost(14000, margin);
        const cust1 = roundToNearest(price1 / Math.max(0.01, (100 - buffer) / 100), nearest);

        // 2. Meters & Additional Hardware (1b, 1c...)
        const row1bList = gwRows.slice(1);
        const price2 = row1bList.length > 0
          ? row1bList.reduce((sum: number, r: any) => sum + Number(r.qty || 0) * calcPriceFromCost(Number(r.unitCost || 0), r.marginPct ?? margin), 0)
          : calcPriceFromCost(34000, margin);
        const cust2 = roundToNearest(price2 / Math.max(0.01, (100 - buffer) / 100), nearest);

        // 3. Electrical Accessories Total
        const price3 = ehwRows.length > 0
          ? ehwRows.reduce((sum: number, r: any) => sum + Number(r.qty || 0) * calcPriceFromCost(Number(r.unitCost || 0), r.marginPct ?? margin), 0)
          : calcPriceFromCost(10000, margin);
        const cust3 = roundToNearest(price3 / Math.max(0.01, (100 - buffer) / 100), nearest);

        // 4. Man Days / Installation & Commissioning Total
        let mpCost = Number(sheetAny.totalManpowerCost) || 0;
        if (!mpCost || mpCost === 0) {
          const baseCost = mpRows.reduce((sum: number, r: any) => {
            const rate = Number(r.siteWorkCost || r.siteDayRate || r.ratePerDay || r.unitCost || 4800);
            const siteDays = Number(r.siteWorkingDays || r.siteDays || r.days || 1);
            const repRate = Number(r.reportWorkCost || r.reportDayRate || 0);
            const repDays = Number(r.reportWorkingDays || r.reportDays || 0);
            return sum + rate * siteDays + repRate * repDays;
          }, 0);
          const extraCost = Number(sheetAny.totalExtraCost) || 8600;
          mpCost = (baseCost > 0 ? baseCost : 9600) + extraCost;
        }
        const price4 = Math.round(calcPriceFromCost(mpCost, margin));
        let cust4 = roundToNearest(price4 / Math.max(0.01, (100 - buffer) / 100), nearest);

        // 5. Platform Setup Costing Total
        const price5 = pfRows.length > 0
          ? pfRows.reduce((sum: number, r: any) => sum + Number(r.qty || 0) * calcPriceFromCost(Number(r.unitCost || 0), r.marginPct ?? margin), 0)
          : calcPriceFromCost(5000, margin);
        const cust5 = roundToNearest(price5 / Math.max(0.01, (100 - buffer) / 100), nearest);

        // 6. Recurring Cloud Charges Total
        const price6 = rcRows.length > 0
          ? rcRows.reduce((sum: number, r: any) => sum + Math.round(calcPriceFromCost(Number(r.unitCostPerMonth || 0), r.marginPct ?? margin) * Number(r.qty || 0)), 0) * 12
          : calcPriceFromCost(9000, margin);
        const cust6 = roundToNearest(price6 / Math.max(0.01, (100 - buffer) / 100), nearest);

        // Alignment with sheetAny.finalQuote if available
        const currentSum = cust1 + cust2 + cust3 + cust4 + cust5 + cust6;
        if (sheetAny.finalQuote && Number(sheetAny.finalQuote) > 0 && currentSum !== Number(sheetAny.finalQuote)) {
          cust4 += (Number(sheetAny.finalQuote) - currentSum);
        }

        const extracted: Array<{
          id: string;
          section?: string;
          stepNo: number | string;
          description: string;
          qty: number;
          uom: string;
          customerPrice: number;
          isRecurring?: boolean;
        }> = [
          {
            id: 'ems-s1',
            stepNo: '1',
            description: row1a?.description || 'Supply of 4G IoT Gateway for Communication with SIM card, SMPS & Antenna - Edge Lite',
            qty: Number(row1a?.qty) || 2,
            uom: row1a?.uom || 'Nos',
            customerPrice: cust1,
          },
          {
            id: 'ems-s2',
            stepNo: '2',
            description: row1bList.length > 0
              ? row1bList.map((r: any) => r.description).join('; ')
              : 'Supply of RS485 energy meter with communication and wiring accessories',
            qty: row1bList.reduce((sum: number, r: any) => sum + Number(r.qty || 0), 0) || 4,
            uom: row1bList[0]?.uom || 'Nos',
            customerPrice: cust2,
          },
          {
            id: 'ems-s3',
            stepNo: '3',
            description: 'Supply of electrical consumables such as flexible hose, cable ties and all other accessories',
            qty: ehwRows.reduce((sum: number, r: any) => sum + Number(r.qty || 0), 0) || 3,
            uom: 'Job',
            customerPrice: cust3,
          },
          {
            id: 'ems-s4',
            stepNo: '4',
            description:
              'Installation and commissioning of IoT devices, gateways, modems, and associated electrical/control components including startup, testing, and functional verification. Communication cable laying and routing through conduits, cable trays, and raceways with proper dressing, tagging, and termination. Conduit pipe laying for electrical and communication cabling as per site layout. Modem configuration, network setup, data mapping, testing, troubleshooting, and data validation',
            qty: 1,
            uom: 'Nodes',
            customerPrice: cust4,
          },
          {
            id: 'ems-s5',
            stepNo: '5',
            description: pfRows.length > 0
              ? pfRows.map((r: any) => r.description).join('. ')
              : 'IoT device configuration, protocol setup (Modbus, BACnet, MQTT), and integration with BMS/EMS platforms. Network connectivity, dashboard mapping, alarm configuration, and cloud/server integration support System commissioning including startup, functional testing, calibration, and performance verification Troubleshooting, integration testing, client demonstration, and final handover support Electrical power/control cable laying, routing, termination, tagging, and insulation testing as per standard',
            qty: Number(pfRows[0]?.qty) || 5,
            uom: pfRows[0]?.uom || 'Nodes',
            customerPrice: cust5,
          },
          {
            id: 'ems-s6',
            stepNo: '6',
            description:
              'OptiByte Dashboard, Intelligent reporting, Group and machine level reporting, Email on any threshold value breach, Alert on Mobile(via SMS), Auto detection of anomalies, water flow rate, water capacity. We will check with the pH and TDS meter, if we can integrate it with our dashboard',
            qty: Number(rcRows[1]?.qty || rcRows[0]?.qty) || 5,
            uom: rcRows[1]?.uom || rcRows[0]?.uom || 'Nodes',
            customerPrice: cust6,
            isRecurring: true,
          },
        ];

        setIotStep5Rows(extracted);
      }

      if (sheetAny.manpowerRows && Array.isArray(sheetAny.manpowerRows) && sheetAny.manpowerRows.length > 0) {
        const mappedMembers: Array<{ manpowerRateId: string; siteDays: number; reportDays: number }> = [];
        sheetAny.manpowerRows.forEach((r: any) => {
          const matchedRate = manpowerRates.find(
            (rate) =>
              (r.roleLevel && rate.role.toLowerCase() === r.roleLevel.toLowerCase()) ||
              (r.name && rate.role.toLowerCase() === r.name.toLowerCase()) ||
              (r.role && rate.role.toLowerCase() === r.role.toLowerCase())
          );
          if (matchedRate) {
            mappedMembers.push({
              manpowerRateId: matchedRate.id,
              siteDays: Number(r.siteWorkingDays) || Number(sheetAny.siteWorkingDays) || 0,
              reportDays: Number(r.reportWorkingDays) || Number(sheetAny.reportWorkingDays) || 0,
            });
          }
        });
        if (mappedMembers.length > 0) {
          setTeamMembers(mappedMembers);
        }
      }

      if (sheetAny.travelDistanceKms !== undefined) {
        setTravelKms(Number(sheetAny.travelDistanceKms));
      }
    }
  }, [activeCostingSheet, isIotOrControls, isWeldingIot, isIotControls, isEms, isCpmChillerManagement, editQuoteId, manpowerRates]);

  // Live Costing Math Calculation (Dynamic from Costing Sheet)
  let calculatedManpowerCost = 0;
  teamMembers.forEach((m) => {
    const rate = manpowerRates.find((r) => r.id === m.manpowerRateId);
    if (rate) {
      calculatedManpowerCost += Number(rate.ratePerDay) * (m.siteDays + m.reportDays);
    }
  });

  let calculatedInstrumentCost = 0;
  instruments.forEach((inst) => {
    const rate = instrumentRates.find((r) => r.id === inst.instrumentRateId);
    if (rate) {
      calculatedInstrumentCost += Number(rate.rentalRatePerDay) * inst.siteDays;
    }
  });

  const manpowerCost =
    activeCostingSheet?.manpowerCost !== undefined && activeCostingSheet?.manpowerCost !== null
      ? Number(activeCostingSheet.manpowerCost)
      : calculatedManpowerCost;

  const instrumentCost =
    activeCostingSheet?.instrumentCost !== undefined && activeCostingSheet?.instrumentCost !== null
      ? Number(activeCostingSheet.instrumentCost)
      : calculatedInstrumentCost;

  const effectiveFoodTravelCost =
    activeCostingSheet?.totalExtraCost !== undefined && activeCostingSheet?.totalExtraCost !== null
      ? Number(activeCostingSheet.totalExtraCost)
      : activeCostingSheet?.totalTravelCost !== undefined && activeCostingSheet?.totalTravelCost !== null
      ? Number(activeCostingSheet.totalTravelCost)
      : foodTravelCost;

  const iotTotalPrice = iotStep5Rows.reduce((sum, r) => sum + Number(r.customerPrice || 0), 0);

  const subtotal =
    activeCostingSheet?.subtotalCost !== undefined && activeCostingSheet?.subtotalCost !== null
      ? Number(activeCostingSheet.subtotalCost)
      : isIotOrControls
      ? iotTotalPrice
      : manpowerCost + instrumentCost + Number(effectiveFoodTravelCost || 0);

  const isEnergyAuditServices = !isIotOrControls;

  const marginAmount =
    activeCostingSheet?.marginAmount !== undefined && activeCostingSheet?.marginAmount !== null
      ? Number(activeCostingSheet.marginAmount)
      : subtotal > 0
      ? (isEnergyAuditServices
          ? (marginPct === 40 || !marginPct
              ? Math.round((subtotal / 0.6) - subtotal)
              : Math.round((subtotal / (Math.max(10, 100 - marginPct) / 100)) - subtotal))
          : Math.round(subtotal * (marginPct / 100)))
      : 0;

  const withMargin = subtotal + marginAmount; // price = total cost + profit margin

  const bufferAmount =
    activeCostingSheet?.bufferAmount !== undefined && activeCostingSheet?.bufferAmount !== null
      ? Number(activeCostingSheet.bufferAmount)
      : subtotal > 0
      ? (isEnergyAuditServices
          ? (bufferPct === 10 || !bufferPct
              ? Math.round((withMargin / 0.9) - withMargin)
              : Math.round((withMargin / (Math.max(10, 100 - bufferPct) / 100)) - withMargin))
          : Math.round(withMargin * (bufferPct / 100)))
      : 0;

  const finalQuote = isCompressorAirLeakageRectification
    ? Number(compressorRoiData.investmentRs || 175000)
    : activeCostingSheet?.finalQuote !== undefined && activeCostingSheet?.finalQuote !== null && Number(activeCostingSheet.finalQuote) > 0
    ? Number(activeCostingSheet.finalQuote)
    : isIotOrControls
    ? (iotTotalPrice ? iotTotalPrice : 0)
    : subtotal
    ? withMargin + bufferAmount
    : 0;

  const requiresApproval = marginPct < 25 || finalQuote > 5000000;
  const approvalReasons: string[] = [];
  if (marginPct < 25) approvalReasons.push(`Margin ${marginPct}% is below 25% threshold`);
  if (finalQuote > 5000000) approvalReasons.push(`Final Quote exceeds ₹50,00,000 threshold`);

  // Create / Update Quote Mutation
  const createQuoteMutation = useMutation({
    mutationFn: async () => {
      if (!clientName || (!serviceId && selectedSubServiceOptions.length === 0)) {
        throw new Error('Please select a client name and service');
      }

      let selectedCategory = selectedCategories[0] || 'Energy Audit Services';
      let selectedSubService = selectedSubServiceOptions[0] || 'Air Audit';

      if (isWaterAutomation) {
        selectedCategory = 'Automation';
        selectedSubService = 'Water Automation';
      } else if (isCompressedAirAutomation) {
        selectedCategory = 'Automation';
        selectedSubService = 'Compressed Air Automation';
      } else if (isCpmChillerManagement) {
        selectedCategory = 'Chiller Management';
        selectedSubService = 'CPM (Chiller Plant Management)';
      } else if (isWeldDataDigitalized) {
        selectedCategory = 'Welding';
        selectedSubService = activeCostingSheet?.subService || selectedSubServiceOptions[0] || 'Digiweld';
      } else if (isWeldingIot) {
        selectedCategory = 'Welding';
        selectedSubService = activeCostingSheet?.subService || selectedSubServiceOptions[0] || 'Welding IoT & Kit';
      } else if (isBms) {
        selectedCategory = 'BMS';
        selectedSubService = 'BMS';
      }

      const computedFinalQuote = isCompressorAirLeakageRectification
        ? Number(compressorRoiData.investmentRs || 175000)
        : isIotOrControls
        ? (Number(activeCostingSheet?.finalQuote) > 0 ? Number(activeCostingSheet.finalQuote) : iotTotalPrice || finalQuote)
        : (Number(activeCostingSheet?.finalQuote) > 0 ? Number(activeCostingSheet.finalQuote) : finalQuote);

      const lineItems = isCompressorAirLeakageRectification
        ? [
            {
              description: `1. ${compressorRoiData.phaseTitle}: ${compressorRoiData.phaseDesc}`,
              qty: 1,
              unitRate: Number(compressorRoiData.investmentRs || 175000),
              total: Number(compressorRoiData.investmentRs || 175000),
            },
          ]
        : isIotOrControls && iotStep5Rows.length > 0
        ? iotStep5Rows.map((r) => ({
            description: `${r.stepNo}. ${r.description}`,
            qty: Number(r.qty) || 1,
            unitRate: Number(r.qty) > 0 ? Math.round(Number(r.customerPrice) / Number(r.qty)) : Number(r.customerPrice),
            total: Number(r.customerPrice) || 0,
          }))
        : undefined;

      const payload = {
        clientName,
        serviceId: serviceId || undefined,
        serviceName: selectedSubService,
        category: selectedCategory,
        proposalNumber,
        proposalDate,
        clientLogo: clientLogo || undefined,
        siteDays: Math.max(1, Number(siteDays) || 1),
        reportDays: Math.max(0, Number(reportDays) || 0),
        travelKms: Number(travelKms) || 0,
        travelRatePerKm: Number(travelRatePerKm) || 0,
        foodRatePerPersonDay: Number(foodRatePerPersonDay) || 0,
        foodTravelCost: Number(foodTravelCost) || 0,
        marginPct: Number(marginPct) || 0,
        bufferPct: Number(bufferPct) || 0,
        teamMembers: teamMembers && teamMembers.length > 0 ? teamMembers : [],
        instruments: instruments && instruments.length > 0 ? instruments : [],
        lineItems,
        finalQuote: computedFinalQuote,
        customContent: {
          scopeOfWork: emsStep5Text,
          step5Text: emsStep5Text,
          costingSheet: activeCostingSheet || undefined,
        },
        scopeDetails: emsStep5Text || undefined,
      };

      if (editQuoteId) {
        return quotesApi.update(editQuoteId, payload);
      } else {
        return quotesApi.create(payload);
      }
    },
    onSuccess: (quote) => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      toast.success(
        editQuoteId
          ? 'Proposal updated & saved to Database!'
          : 'Proposal generated & saved to Database!'
      );
      router.push(`/quotes/${quote.id}`);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Failed to save proposal';
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    },
  });

  const addTeamMemberRow = () => {
    if (manpowerRates.length === 0) return;
    setTeamMembers([
      ...teamMembers,
      { manpowerRateId: manpowerRates[0].id, siteDays, reportDays },
    ]);
  };

  const removeTeamMemberRow = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const addInstrumentRow = () => {
    if (instrumentRates.length === 0) return;
    setInstruments([
      ...instruments,
      { instrumentRateId: instrumentRates[0].id, siteDays },
    ]);
  };

  const removeInstrumentRow = (index: number) => {
    setInstruments(instruments.filter((_, i) => i !== index));
  };

  return (
    <div className="relative space-y-8 min-h-screen">
      {/* Full Page Branded Background Watermark */}
      <FullPageWatermark opacity={0.08} size="750px" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6 text-indigo-600" /> Instant Costing Engine & Quote Builder
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Select service and parameters to generate a live-calculated proposal quote
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Deal & Service Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Step 1: Client & Service Selection</h3>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 font-mono">
                {proposalNumber || 'STPL-001'}
              </span>
            </div>

            {/* Row 1: Proposal Ref Number & Proposal Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proposal Number *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. STPL-001"
                    value={proposalNumber}
                    onChange={(e) => {
                      setProposalNumber(e.target.value);
                      setIsManualProposalNumber(true);
                    }}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proposal Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={proposalDate}
                    onChange={(e) => setProposalDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Client Name & Service Offering */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Client Name *
                  </label>
                  <div className="flex items-center gap-2">
                    {clientName && !isCustomClient && !isEditingClient && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingClientName(clientName);
                          setIsEditingClient(true);
                        }}
                        className="text-[11px] text-amber-600 hover:underline font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="h-3 w-3" /> Edit Selected
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !isCustomClient;
                        setIsCustomClient(nextState);
                        setIsEditingClient(false);
                        if (nextState) {
                          setCustomClientName('');
                          setClientName('');
                        }
                      }}
                      className="text-[11px] text-indigo-600 hover:underline font-semibold"
                    >
                      {isCustomClient ? 'Select from List' : '+ Insert New Client'}
                    </button>
                  </div>
                </div>

                {isEditingClient ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={editingClientName}
                      onChange={(e) => setEditingClientName(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      disabled={updateClientMutation.isPending}
                      onClick={() => {
                        const targetObj = dbClients.find((c) => c.name === clientName);
                        if (targetObj && editingClientName.trim()) {
                          updateClientMutation.mutate({
                            id: targetObj.id,
                            name: editingClientName.trim(),
                          });
                        } else if (editingClientName.trim()) {
                          createClientMutation.mutate(editingClientName.trim());
                          setIsEditingClient(false);
                        }
                      }}
                      className="px-3.5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shrink-0 flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" /> Save Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingClient(false)}
                      className="px-2.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : isCustomClient ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Enter new client name..."
                      value={customClientName}
                      onChange={(e) => {
                        setCustomClientName(e.target.value);
                        setClientName(e.target.value);
                      }}
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      disabled={createClientMutation.isPending}
                      onClick={() => {
                        if (customClientName.trim()) {
                          createClientMutation.mutate(customClientName.trim());
                        } else {
                          toast.error('Please enter a valid client name');
                        }
                      }}
                      className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shrink-0"
                    >
                      {createClientMutation.isPending ? 'Saving...' : 'Save to DB & Select'}
                    </button>
                  </div>
                ) : (
                  <div className="relative" ref={clientDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-indigo-400 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {clientName && getClientPresetLogo(clientName) ? (
                          <div className="h-6 w-8 bg-white border border-slate-200 rounded p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getClientPresetLogo(clientName)!}
                              alt={clientName}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        ) : clientName ? (
                          <Building className="h-4 w-4 text-indigo-600 shrink-0" />
                        ) : null}
                        <span className={clientName ? 'font-bold text-slate-900 truncate' : 'text-slate-400'}>
                          {clientName || '-- Search or Select a Client --'}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                    </button>

                    {isClientDropdownOpen && (
                      <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden text-xs max-h-72 flex flex-col">
                        {/* Search Input Filter Bar */}
                        <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                          <Search className="h-4 w-4 text-indigo-600 shrink-0 ml-1" />
                          <input
                            type="text"
                            autoFocus
                            placeholder="Type client name to search..."
                            value={clientSearchQuery}
                            onChange={(e) => setClientSearchQuery(e.target.value)}
                            className="w-full bg-white px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          {clientSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setClientSearchQuery('')}
                              className="p-1 text-slate-400 hover:text-slate-600"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Options List */}
                        <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                          {/* Inline Quick Insert Option if typing search query */}
                          {clientSearchQuery.trim() && (
                            <button
                              type="button"
                              onClick={() => {
                                createClientMutation.mutate(clientSearchQuery.trim());
                                setClientSearchQuery('');
                                setIsClientDropdownOpen(false);
                              }}
                              className="w-full text-left px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold flex items-center gap-2 border-b border-indigo-100"
                            >
                              <Plus className="h-3.5 w-3.5" /> Insert &quot;{clientSearchQuery.trim()}&quot; to DB
                            </button>
                          )}

                          {filteredClientOptions.length === 0 ? (
                            <div className="p-4 text-center text-slate-400">
                              No matching clients found for &quot;{clientSearchQuery}&quot;
                            </div>
                          ) : (
                            filteredClientOptions.map((c, idx) => {
                              const itemLogo = getClientPresetLogo(c.name);
                              const isSelected = clientName === c.name;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setClientName(c.name);
                                    setIsClientDropdownOpen(false);
                                    setClientSearchQuery('');
                                    if (itemLogo) {
                                      setClientLogo(itemLogo);
                                    } else if (clientLogo && clientLogo.startsWith('/logo/')) {
                                      setClientLogo(null);
                                    }
                                  }}
                                  className={`w-full text-left px-3.5 py-2 hover:bg-indigo-50 transition-colors flex items-center justify-between gap-3 ${
                                    isSelected ? 'bg-indigo-50/80 font-bold text-indigo-700' : 'text-slate-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    {itemLogo ? (
                                      <div className="h-6 w-8 bg-white border border-slate-200 rounded p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={itemLogo} alt={c.name} className="max-h-full max-w-full object-contain" />
                                      </div>
                                    ) : (
                                      <div className="h-6 w-8 bg-slate-100 border border-slate-200 rounded flex items-center justify-center shrink-0 text-slate-400">
                                        <Building className="h-3.5 w-3.5" />
                                      </div>
                                    )}
                                    <span className="truncate">{c.name}</span>
                                  </div>
                                  {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />}
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Our Services (Single-Select Category) */}
              <div className="relative" ref={categoryDropdownRef}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Our Services *
                </label>
                <div
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus-within:ring-2 focus-within:ring-indigo-500 cursor-pointer flex items-center justify-between min-h-[42px] transition-colors hover:border-slate-300 shadow-2xs"
                >
                  <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg">
                    {selectedCategories[0] || 'Select Service Category'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                </div>

                {isCategoryDropdownOpen && (
                  <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl p-2 max-h-60 overflow-y-auto space-y-1">
                    {SERVICE_CATEGORY_OPTIONS.map((cat) => {
                      const isSelected = selectedCategories[0] === cat;
                      return (
                        <div
                          key={cat}
                          onClick={() => {
                            setSelectedCategories([cat]);
                            setSelectedCostingSheetId('');
                            setIsCategoryDropdownOpen(false);
                            // Auto default sub-service
                            if (cat === 'Energy Audit Services') {
                              setSelectedSubServiceOptions(['Compressor air leakage audit']);
                            } else if (cat === 'IoT & Controls') {
                              setSelectedSubServiceOptions(['Energy Management Solution']);
                            } else if (cat === 'Chiller Management') {
                              setSelectedSubServiceOptions(['CPM (Chiller Plant Management)']);
                            } else if (cat === 'Welding' || cat === 'Welding IoT') {
                              setSelectedSubServiceOptions(['Digiweld']);
                            } else if (cat === 'Automation') {
                              setSelectedSubServiceOptions(['Compressed Air Automation']);
                            } else if (cat === 'IR Blaster') {
                              setSelectedSubServiceOptions(['Old IR Blaster']);
                            } else if (cat === 'BMS') {
                              setSelectedSubServiceOptions(['BMS']);
                            } else if (cat === 'Hardware') {
                              setSelectedSubServiceOptions(['Dew Point']);
                            }
                          }}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            isSelected ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>{cat}</span>
                          {isSelected && <Check className="h-4 w-4 text-indigo-600" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: List of Services (Single-Select) */}
            <div className="relative pt-1" ref={subServicesDropdownRef}>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                List of Services *
              </label>

              <div
                onClick={() => setIsSubServicesDropdownOpen(!isSubServicesDropdownOpen)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus-within:ring-2 focus-within:ring-indigo-500 cursor-pointer flex items-center justify-between min-h-[42px] transition-colors hover:border-slate-300 shadow-2xs"
              >
                <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg">
                  {selectedSubServiceOptions[0] || 'Select Sub-Service'}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
              </div>

              {isSubServicesDropdownOpen && (
                <div className="absolute z-30 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl p-2 max-h-60 overflow-y-auto space-y-1">
                  {availableSubServices.map((s) => {
                    const isSelected = selectedSubServiceOptions[0] === s;
                    return (
                      <div
                        key={s}
                        onClick={() => {
                          setSelectedSubServiceOptions([s]);
                          setSelectedCostingSheetId('');
                          setIsSubServicesDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          isSelected ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{s}</span>
                        {isSelected && <Check className="h-4 w-4 text-indigo-600" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Saved Costing Sheets Available for Chosen Client (Filtered by Selected Service) */}
            {(() => {
              const currentSub = (selectedSubServiceOptions[0] || '').toLowerCase().trim();
              const currentCat = (selectedCategories[0] || '').toLowerCase().trim();

              const displayedSheets = clientCostingSheets.filter((sheet: any) => {
                const sheetSub = (sheet.subService || '').toLowerCase().trim();
                const sheetCat = (sheet.serviceCategory || '').toLowerCase().trim();

                if (currentSub.includes('ir') || currentCat.includes('ir')) {
                  return (sheetSub.includes('ir') || sheetCat.includes('ir')) && !sheetSub.includes('cpm') && !sheetSub.includes('chiller');
                }
                if (currentSub.includes('cpm') || currentCat.includes('chiller') || sheetSub.includes('chiller')) {
                  return sheetSub.includes('cpm') || sheetCat.includes('chiller') || sheetSub.includes('chiller');
                }
                if (currentSub.includes('welding') || currentCat.includes('welding')) {
                  return sheetSub.includes('welding') || sheetCat.includes('welding');
                }
                if (currentSub.includes('rectification')) {
                  return sheetSub.includes('rectification');
                }
                if (currentSub.includes('nitrogen')) {
                  return sheetSub.includes('nitrogen');
                }
                if (currentSub.includes('mixture')) {
                  return sheetSub.includes('mixture');
                }
                if (currentSub.includes('flowmeter')) {
                  return sheetSub.includes('flowmeter');
                }
                if (currentSub.includes('dew point') || currentSub.includes('flange')) {
                  return sheetSub.includes('dew point') || sheetSub.includes('flange') || sheetCat.includes('hardware');
                }
                return true;
              });

              if (displayedSheets.length === 0) return null;

              return (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-950 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      Saved Costing Sheets for {clientName} ({displayedSheets.length} Found):
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                      Click to load into Step 4
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {displayedSheets.map((sheet: any) => {
                      const isSelected = activeCostingSheet?.id === sheet.id || activeCostingSheet?._id === sheet._id;
                      const sheetQuote =
                        Number(sheet.finalQuote) ||
                        Number(sheet.emsTotalStep5CustomerPrice) ||
                        Number(sheet.totalCustomerPrice) ||
                        Number(sheet.finalPrice) ||
                        0;

                      let createdDateStr = '';
                      const rawDate = sheet.createdAt || sheet.createdDate || sheet.updatedAt || sheet.date;
                      if (rawDate) {
                        try {
                          const d = new Date(rawDate);
                          if (!isNaN(d.getTime())) {
                            createdDateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                          }
                        } catch {}
                      }

                      return (
                        <button
                          key={sheet.id || sheet._id}
                          type="button"
                          onClick={() => {
                            setSelectedCostingSheetId(sheet.id || sheet._id);
                            let targetCat = sheet.serviceCategory || 'Energy Audit Services';
                            const sub = (sheet.subService || '').toLowerCase();
                            if (sub.includes('compressed air automation') || sub.includes('water automation') || sub.includes('air automation')) {
                              targetCat = 'Automation';
                            } else if (sub.includes('cpm') || sub.includes('chiller')) {
                              targetCat = 'Chiller Management';
                            } else if (sub.includes('welding') || sub.includes('digiweld')) {
                              targetCat = 'Welding IoT';
                            } else if (sub.includes('ir blaster') || sub.includes('ir')) {
                              targetCat = 'IR Blaster';
                            } else if (sub.includes('bms')) {
                              targetCat = 'BMS';
                            } else if (sub.includes('dew point') || sub.includes('flange') || sub.includes('flowmeter') || sub.includes('iaq sensor') || sub.includes('temperature sensor')) {
                              targetCat = 'Hardware';
                            } else if (sub.includes('energy management solution') || sub.includes('compressed air monitoring') || sub.includes('iot platform') || sub.includes('water management solution')) {
                              targetCat = 'IoT & Controls';
                            }

                            setSelectedCategories([targetCat]);
                            if (sheet.subService) {
                              setSelectedSubServiceOptions([sheet.subService]);
                            }
                            toast.success(`Loaded costing for ${sheet.subService || targetCat}!`);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                            isSelected
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                          }`}
                        >
                          <span>{sheet.subService || sheet.serviceCategory || 'Costing Sheet'}</span>
                          <span className="opacity-70 font-normal">•</span>
                          <span className={isSelected ? 'text-emerald-200' : 'text-emerald-900 font-black'}>
                            {sheetQuote > 0 ? `₹${sheetQuote.toLocaleString('en-IN')}` : '₹0 (Draft)'}
                          </span>
                          {createdDateStr && (
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${isSelected ? 'bg-emerald-800/80 text-emerald-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'}`}>
                              {createdDateStr}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Row 4: Asset Categories (Shown ONLY for Energy Audit Services) */}
            {isEnergyAudit && (
              <div className="relative pt-1" ref={assetsDropdownRef}>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Asset Categories ({ASSESSMENT_ASSETS.length} Total Available) *</span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSelectedAssetIds(ASSESSMENT_ASSETS.map((a) => a.id))}
                      className="text-indigo-600 hover:underline font-semibold"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedAssetIds([])}
                      className="text-rose-600 hover:underline font-semibold"
                    >
                      Clear All
                    </button>
                  </div>
                </label>

                <div
                  onClick={() => setIsAssetsDropdownOpen(!isAssetsDropdownOpen)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus-within:ring-2 focus-within:ring-indigo-500 cursor-pointer flex items-center justify-between min-h-[46px] transition-colors hover:border-slate-300 shadow-2xs"
                >
                  <div className="flex flex-wrap gap-1.5 items-center max-h-24 overflow-y-auto">
                    {selectedAssetIds.length === 0 ? (
                      <span className="text-slate-400 text-xs font-medium">-- Select Asset Categories for Assessment Scope --</span>
                    ) : (
                      selectedAssetIds.map((aId) => {
                        const aObj = ASSESSMENT_ASSETS.find((a) => a.id === aId);
                        return (
                          <span
                            key={aId}
                            className="inline-flex items-center gap-1 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-2xs"
                          >
                            {aObj ? aObj.name : aId}
                            <X
                              className="h-3 w-3 text-indigo-200 hover:text-white cursor-pointer ml-0.5"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAssetIds(selectedAssetIds.filter((id) => id !== aId));
                              }}
                            />
                          </span>
                        );
                      })
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                </div>

                {isAssetsDropdownOpen && (
                  <div className="absolute z-40 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-2xl p-3 max-h-80 overflow-y-auto space-y-2">
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search asset equipment..."
                        value={assetSearchQuery}
                        onChange={(e) => setAssetSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      {filteredAssets.map((asset) => {
                        const isSelected = selectedAssetIds.includes(asset.id);
                        return (
                          <div
                            key={asset.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedAssetIds(selectedAssetIds.filter((id) => id !== asset.id));
                              } else {
                                setSelectedAssetIds([...selectedAssetIds, asset.id]);
                              }
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              isSelected ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{asset.name}</span>
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

              {/* Row 5: Client Logo Option */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-indigo-600" /> Client Logo Option
                  </label>
                  {clientLogo && (
                    <button
                      type="button"
                      onClick={() => {
                        setClientLogo(null);
                        setLogoUrl('');
                      }}
                      className="text-[11px] text-rose-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      <X className="h-3 w-3" /> Remove Logo
                    </button>
                  )}
                </div>

                {clientLogo ? (
                  <div className="flex items-center gap-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                    <div className="h-12 w-20 bg-white border border-slate-200 rounded-lg p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={clientLogo}
                        alt="Client Logo Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Client Logo Selected</p>
                      <p className="text-[11px] text-slate-500">Will be featured on generated proposal documents</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setLogoInputType('upload')}
                        className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${
                          logoInputType === 'upload'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogoInputType('url')}
                        className={`text-xs px-3 py-1 rounded-lg font-semibold transition-all ${
                          logoInputType === 'url'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Image URL
                      </button>
                    </div>

                    {logoInputType === 'upload' ? (
                      <label className="flex flex-col items-center justify-center p-4 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl cursor-pointer transition-colors text-center group">
                        <Upload className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 mb-1 transition-colors" />
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600">
                          Click to upload Client Logo (PNG, JPG, SVG)
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Max size 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://example.com/logo.png"
                          value={logoUrl}
                          onChange={(e) => setLogoUrl(e.target.value)}
                          className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (logoUrl) {
                              setClientLogo(logoUrl);
                              toast.success('Logo URL set!');
                            }
                          }}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl"
                        >
                          Set Logo
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: About Sustainabyte */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Step 2: About Sustainabyte</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAboutSustainabyteText(DEFAULT_ABOUT_SUSTAINABYTE);
                      toast.success('Reset About Sustainabyte text to default!');
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset Default
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingAboutText(!isEditingAboutText)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                      isEditingAboutText
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                    }`}
                  >
                    {isEditingAboutText ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Done Editing
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-3.5 w-3.5" /> Edit Text
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* About Sustainabyte Overview Card */}
              <div className="p-6 bg-white border border-slate-200 rounded-2xl text-slate-900 shadow-sm space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">About Sustainabyte</h4>
                      <p className="text-[11px] text-slate-500">Company Overview & Sustainability Blueprint</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Sustainabyte Technologies
                  </span>
                </div>

                {isEditingAboutText ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Edit About Sustainabyte Text (Separate paragraphs with blank lines):
                    </label>
                    <textarea
                      rows={12}
                      value={aboutSustainabyteText || ''}
                      onChange={(e) => setAboutSustainabyteText(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Type or edit About Sustainabyte overview text..."
                    />
                  </div>
                ) : (
                  <div className="space-y-3.5 text-xs text-slate-800 leading-relaxed font-normal">
                    {(aboutSustainabyteText || '')
                      .split(/\n\n+/)
                      .filter((p) => p.trim())
                      .map((paragraph, pIdx) => (
                        <p key={pIdx}>
                          {paragraph}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Scope of Assessment & Client Track Record (For Energy Audit Services - Editable) */}
            {isEnergyAudit && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-600" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Step 3: Scope of Assessment &amp; Team Track Record — Energy Audit</h3>
                      <p className="text-xs text-slate-500">14-Point Comprehensive Study Scope &amp; {energyAuditTrackClients.length} Reference Industry Client Track Record</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEnergyAuditScopeCards(DEFAULT_ENERGY_AUDIT_SCOPE_CARDS);
                        setEnergyAuditTrackClients(ENERGY_AUDIT_TRACK_RECORD_CLIENTS);
                        toast.success('Reset Step 3 scope & clients to default!');
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset Default
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingEnergyAuditStep3(!isEditingEnergyAuditStep3)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                        isEditingEnergyAuditStep3
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                      }`}
                    >
                      {isEditingEnergyAuditStep3 ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Done Editing
                        </>
                      ) : (
                        <>
                          <Edit3 className="h-3.5 w-3.5" /> Edit Step 3
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Section 1: Scope of Work Methodologies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                      1. Detailed Scope of Work &amp; Engineering Assessment ({energyAuditScopeCards.length} Methodology Blocks)
                    </label>
                    {isEditingEnergyAuditStep3 && (
                      <button
                        type="button"
                        onClick={() => {
                          setEnergyAuditScopeCards([
                            ...energyAuditScopeCards,
                            {
                              id: `ea-${Date.now()}`,
                              title: `${energyAuditScopeCards.length + 1}. Custom Assessment Scope`,
                              description: 'Custom engineering assessment scope and study details.',
                            },
                          ]);
                        }}
                        className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> + Add Scope Item
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {energyAuditScopeCards.map((card, idx) => (
                      <div
                        key={card.id || idx}
                        className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 shadow-2xs relative group"
                      >
                        {isEditingEnergyAuditStep3 ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={card.title}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEnergyAuditScopeCards(
                                    energyAuditScopeCards.map((c, i) => (i === idx ? { ...c, title: val } : c))
                                  );
                                }}
                                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="Scope title..."
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setEnergyAuditScopeCards(energyAuditScopeCards.filter((_, i) => i !== idx));
                                }}
                                className="text-slate-400 hover:text-rose-600 p-1"
                                title="Remove scope card"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              value={card.description}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEnergyAuditScopeCards(
                                    energyAuditScopeCards.map((c, i) => (i === idx ? { ...c, description: val } : c))
                                );
                              }}
                              className="w-full bg-white border border-slate-300 rounded p-2 text-[11px] text-slate-700 leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              placeholder="Scope description details..."
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-indigo-600 shrink-0" />
                              <h4 className="text-xs font-bold text-slate-900">{card.title}</h4>
                            </div>
                            <p className="text-[11px] text-slate-600 pl-4 leading-relaxed">
                              {card.description}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Reference Clients Grid */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                      2. Team Expertise &amp; Client Track Record ({energyAuditTrackClients.length} Reference Clients)
                    </label>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      Proven Execution Footprint
                    </span>
                  </div>

                  {/* Add Client Bar (when editing) */}
                  {isEditingEnergyAuditStep3 && (
                    <div className="flex items-center gap-2 p-2 bg-indigo-50/60 rounded-xl border border-indigo-100">
                      <input
                        type="text"
                        value={newClientInput}
                        onChange={(e) => setNewClientInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newClientInput.trim()) {
                            e.preventDefault();
                            setEnergyAuditTrackClients([...energyAuditTrackClients, newClientInput.trim()]);
                            setNewClientInput('');
                          }
                        }}
                        placeholder="Type new client / project name and press Enter..."
                        className="flex-1 px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newClientInput.trim()) {
                            setEnergyAuditTrackClients([...energyAuditTrackClients, newClientInput.trim()]);
                            setNewClientInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        + Add Client
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pt-1 text-xs">
                    {energyAuditTrackClients.map((client, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 px-2 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between gap-1.5 shadow-2xs hover:bg-indigo-50/40 transition-colors group"
                      >
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <span className="h-4 w-4 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[9px] shrink-0">
                            {idx + 1}
                          </span>
                          {isEditingEnergyAuditStep3 ? (
                            <input
                              type="text"
                              value={client}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEnergyAuditTrackClients(
                                  energyAuditTrackClients.map((c, i) => (i === idx ? val : c))
                                );
                              }}
                              className="bg-white border border-slate-300 rounded px-1 py-0.5 text-[11px] font-semibold text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          ) : (
                            <span className="font-semibold text-slate-800 text-[11px] truncate" title={client}>
                              {client}
                            </span>
                          )}
                        </div>
                        {isEditingEnergyAuditStep3 && (
                          <button
                            type="button"
                            onClick={() => {
                              setEnergyAuditTrackClients(energyAuditTrackClients.filter((_, i) => i !== idx));
                            }}
                            className="text-slate-400 hover:text-rose-600 p-0.5 shrink-0"
                            title="Remove client"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Solution Architecture (Visible for IoT & Controls Scope, except Weld Data Digitalized and Hardware Sensors) */}
            {isIotOrControls && !isWeldDataDigitalized && !isHardwareSensorScope && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-indigo-600" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {isIaqSensor
                          ? 'Step 3: Technical Capabilities & Dashboard View — IAQ Sensor (Indoor Air Quality)'
                          : isIrBlaster
                          ? 'Step 3: Technical Capabilities & Solution Architecture — IR Blaster AC Energy Automation'
                          : isWaterManagement
                          ? 'Step 3: Solution Architecture — Water Management System (IoT & Controls Platform)'
                          : 'Step 3: Solution Architecture — IoT & Controls Platform'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isIaqSensor
                          ? 'Optibyte Air Intelligence Dashboard, multi-gas telemetry (CO2, PM2.5, PM10, TVOC) & ventilation control'
                          : isIrBlaster
                          ? 'Product showcase, plug-and-play retrofit topology, cloud MQTT telemetry & BEE energy savings'
                          : 'Comprehensive edge-to-cloud IoT topology, sensors, OptiLink gateway & analytics dashboard'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full shrink-0">
                    {isIaqSensor ? 'Dashboard Blueprint' : 'Architecture Blueprint'}
                  </span>
                </div>

                {isIaqSensor ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 flex flex-col items-center shadow-lg">
                      <div className="flex items-center justify-between w-full px-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                          3 Dashboard View: Optibyte Air Intelligence
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Live Telemetry • Multi-Parameter</span>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/iaq-dashboard.png"
                        alt="Optibyte Air Quality Dashboard"
                        className="max-h-[320px] w-auto object-contain rounded-xl shadow-md border border-slate-800"
                      />
                      <p className="text-[11px] text-slate-300 text-center font-medium">
                        Real-time IAQ Analytics: CO2, PM2.5, PM10, Temperature, Humidity, TVOC &amp; Composite Health Index
                      </p>
                    </div>
                  </div>
                ) : isIrBlaster ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3 flex flex-col items-center">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200 self-start">
                          Product Showcase
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/irimag11.jpeg"
                          alt="IR Blaster Unit"
                          className="max-h-[240px] w-auto object-contain rounded-xl shadow-xs"
                        />
                        <p className="text-[11px] text-slate-600 text-center font-medium">
                          Plug &amp; Play Retrofit — Universal HVAC compatibility (Split, Cassette, Package AC)
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3 flex flex-col items-center">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 self-start">
                          Solution Architecture
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/irarchitec.png"
                          alt="IR Blaster Solution Architecture"
                          className="max-h-[240px] w-auto object-contain rounded-xl shadow-xs"
                        />
                        <p className="text-[11px] text-slate-600 text-center font-medium">
                          Edge IR Blaster to OptiByte Cloud Telemetry, Automated Scheduling &amp; Alarms
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-4">
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white p-3 shadow-2xs flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/iot-solution-architecture.png"
                        alt="IoT & Controls Solution Architecture Diagram"
                        className="max-h-[440px] w-auto object-contain rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* Step 4: Commercial Breakdown (Costing Sheet Sync / Energy Audit Scope) */}
          {(activeCostingSheet || isEnergyAuditServices || isEnergyAudit) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-indigo-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Step 4: Cost Estimate &amp; Commercial Breakdown — {selectedCategories.join(', ') || 'Energy Audit Services'} / {selectedSubServiceOptions.join(', ') || 'Energy Audit'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isIotOrControls
                        ? 'Itemized Step 5 Commercial Breakdown for IoT & Controls Scope'
                        : activeCostingSheet
                        ? 'Live Costing Sync & Parameter Matrix for Energy Audit Scope'
                        : 'Commercial Scope Description, Timeline & Project Cost Estimate'}
                    </p>
                  </div>
                </div>
                {activeCostingSheet ? (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Costing Sheet Synced
                  </span>
                ) : (
                  <span className="text-xs font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full shrink-0">
                    Cost Estimate Scope
                  </span>
                )}
              </div>

              {/* If Compressor Air Leakage Rectification: Show Editable Phase Scope & ROI Matrix */}
              {isCompressorAirLeakageRectification ? (
                <div className="space-y-6">
                  {/* Scope & Commercial Pricing */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                          Scope &amp; Commercials
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          Phase-2 Air Leakage Rectification Scope &amp; Investment
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCompressorRoiData(DEFAULT_COMPRESSOR_ROI_DATA);
                            toast.success('Reset Scope & ROI to defaults!');
                          }}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Reset Default
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingCompressorRoi(!isEditingCompressorRoi)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                            isEditingCompressorRoi
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                          }`}
                        >
                          {isEditingCompressorRoi ? (
                            <>
                              <Check className="h-3.5 w-3.5" /> Done Editing
                            </>
                          ) : (
                            <>
                              <Edit3 className="h-3.5 w-3.5" /> Edit Scope &amp; ROI
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200 text-[11px]">
                          <tr>
                            <th className="py-2.5 px-3 text-center w-14">S.No</th>
                            <th className="py-2.5 px-4 w-1/2">Scope Description</th>
                            <th className="py-2.5 px-3 text-center w-28">Quantity</th>
                            <th className="py-2.5 px-4 text-right w-44">Total Price in INR</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800 text-xs">
                          <tr>
                            <td className="py-3 px-3 text-center font-bold text-slate-600">1.</td>
                            <td className="py-3 px-4 space-y-1.5">
                              {isEditingCompressorRoi ? (
                                <>
                                  <input
                                    type="text"
                                    value={compressorRoiData.phaseTitle}
                                    onChange={(e) => updateCompressorRoiField('phaseTitle', e.target.value)}
                                    className="w-full font-bold text-slate-900 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="e.g. PHASE-2"
                                  />
                                  <textarea
                                    value={compressorRoiData.phaseDesc}
                                    onChange={(e) => updateCompressorRoiField('phaseDesc', e.target.value)}
                                    rows={2}
                                    className="w-full text-slate-700 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="Scope description"
                                  />
                                </>
                              ) : (
                                <div>
                                  <p className="font-bold text-slate-950 text-xs">{compressorRoiData.phaseTitle}</p>
                                  <p className="text-slate-700 mt-0.5">{compressorRoiData.phaseDesc}</p>
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-3 text-center align-top pt-3.5">
                              {isEditingCompressorRoi ? (
                                <input
                                  type="text"
                                  value={compressorRoiData.quantity}
                                  onChange={(e) => updateCompressorRoiField('quantity', e.target.value)}
                                  className="w-full font-medium text-center text-slate-900 border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                  placeholder="e.g. 5 Days"
                                />
                              ) : (
                                <span className="font-semibold text-slate-900">{compressorRoiData.quantity}</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right align-top pt-3.5">
                              {isEditingCompressorRoi ? (
                                <div className="relative">
                                  <span className="absolute left-2 top-1 text-slate-500 font-bold">₹</span>
                                  <input
                                    type="number"
                                    value={compressorRoiData.investmentRs}
                                    onChange={(e) => {
                                      const val = Number(e.target.value) || 0;
                                      updateCompressorRoiField('investmentRs', val);
                                    }}
                                    className="w-full font-black text-right text-slate-900 border border-slate-300 rounded pl-6 pr-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="175000"
                                  />
                                </div>
                              ) : (
                                <span className="font-black text-slate-950 text-sm">
                                  ₹{Number(compressorRoiData.investmentRs).toLocaleString('en-IN')}
                                </span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ROI for Savings Interactive Editor */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">
                        ROI for Savings &amp; Payback Matrix:
                      </h4>
                      <span className="text-xs text-slate-500 italic">
                        * Values dynamically recalculate and sync with proposal preview
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Energy Loss & Electricity Cost Inputs */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                        <p className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                          Loss &amp; Tariff Parameters
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Compressed Air Leak CFM
                            </label>
                            {isEditingCompressorRoi ? (
                              <input
                                type="number"
                                value={compressorRoiData.leakCfm}
                                onChange={(e) => updateCompressorRoiField('leakCfm', e.target.value)}
                                className="w-full font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                              />
                            ) : (
                              <div className="font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
                                {compressorRoiData.leakCfm} CFM
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Energy Loss (kWh/Month)
                            </label>
                            {isEditingCompressorRoi ? (
                              <input
                                type="number"
                                value={compressorRoiData.monthlyKwhLoss}
                                onChange={(e) => updateCompressorRoiField('monthlyKwhLoss', e.target.value)}
                                className="w-full font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                              />
                            ) : (
                              <div className="font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
                                {Number(compressorRoiData.monthlyKwhLoss).toLocaleString('en-IN')} kWh
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Electricity Tariff (₹/kWh)
                            </label>
                            {isEditingCompressorRoi ? (
                              <input
                                type="number"
                                step="0.1"
                                value={compressorRoiData.electricityCostPerKwh}
                                onChange={(e) => updateCompressorRoiField('electricityCostPerKwh', e.target.value)}
                                className="w-full font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                              />
                            ) : (
                              <div className="font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
                                ₹{Number(compressorRoiData.electricityCostPerKwh).toFixed(2)} / kWh
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                              Energy Loss (kWh/Annum)
                            </label>
                            <div className="font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
                              {Number(compressorRoiData.annualKwhLoss).toLocaleString('en-IN')} kWh
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-[11px] text-slate-600">Monthly Loss:</span>
                            <p className="text-sm font-black text-rose-700">₹{Number(compressorRoiData.monthlyLossRs).toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-600">Annual Recoverable Saving:</span>
                            <p className="text-sm font-black text-emerald-700">₹{Number(compressorRoiData.totalAnnualRecoverableSavingRs).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      </div>

                      {/* ROI & Payback Result Card */}
                      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3 flex flex-col justify-between">
                        <div>
                          <p className="font-bold text-emerald-950 text-xs uppercase tracking-wide">
                            ROI &amp; Payback Summary
                          </p>
                          <div className="mt-3 space-y-2 text-xs">
                            <div className="flex justify-between py-1 border-b border-emerald-200/60">
                              <span className="text-slate-700">Total Investment:</span>
                              <span className="font-black text-slate-950">₹{Number(compressorRoiData.investmentRs).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-emerald-200/60">
                              <span className="text-slate-700">Payback Period (Years):</span>
                              <span className="font-black text-slate-950">{compressorRoiData.paybackYears} Years</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-slate-700">Payback Period (Months):</span>
                              <span className="font-black text-emerald-800 text-sm">{compressorRoiData.paybackMonths} Months</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-2.5 rounded-lg border border-emerald-200 text-center">
                          <p className="text-[11px] text-emerald-900 font-semibold">
                            Full ROI achieved within <strong>{compressorRoiData.paybackMonths} months</strong> with annual savings of <strong>₹{Number(compressorRoiData.totalAnnualRecoverableSavingRs).toLocaleString('en-IN')}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isWeldDataDigitalized ? (
                <div className="space-y-6">
                  {/* Commercials Table for Digiweld */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                          Commercials
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          Scope &amp; Commercial Pricing for Digiweld (Weld Data Digitalization)
                        </span>
                      </div>
                      {activeCostingSheet?.finalQuote && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                          API Synced Value: ₹{Number(activeCostingSheet.finalQuote).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Table 1: ONE TIME COST  */}
                    <div className="space-y-1">
                      <div className="bg-slate-800 text-white px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide rounded-t-xl">
                        ONE TIME COST 
                      </div>
                      <div className="border border-slate-200 rounded-b-xl overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200 text-[11px]">
                            <tr>
                              <th className="py-2.5 px-3 w-8 text-center">Sl</th>
                              <th className="py-2.5 px-3.5 min-w-[180px]">Category / Deliverable</th>
                              <th className="py-2.5 px-3.5 min-w-[160px]">Remarks</th>
                              <th className="py-2.5 px-3.5 text-right w-36 bg-indigo-50/60 text-indigo-950 font-black">Total Price (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                            {((activeCostingSheet as any)?.weldingSoftwareRows || INITIAL_DIGIWELD_SOFTWARE_ROWS)
                              .map((row: any) => {
                                const remarks = row.remarks || (row.item?.toLowerCase().includes('conversion') || row.item?.toLowerCase().includes('integration') || row.item?.toLowerCase().includes('checksheet') || row.item?.toLowerCase().includes('files') ? 'Excel to JSON Conversion' : row.item?.toLowerCase().includes('buffer') ? 'Additional Support Activities' : 'Platform Feature & Deliverable');
                                const qty = Number(row.qty !== undefined ? row.qty : 1);
                                const unitPrice = Number(row.unitPrice || row.price || 0);
                                const totalPrice = Number(row.price) || (qty * unitPrice);
                                return { ...row, remarks, totalPrice };
                              })
                              .filter((row: any) => row.totalPrice > 0)
                              .map((row: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="py-2 px-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                                  <td className="py-2 px-3.5 font-semibold text-slate-900 leading-snug">{row.item || row.description}</td>
                                  <td className="py-2 px-3.5 text-slate-600">{row.remarks}</td>
                                  <td className="py-2 px-3.5 text-right font-black text-indigo-950 bg-indigo-50/30">{formatCurrency(row.totalPrice)}</td>
                                </tr>
                              ))}
                          </tbody>
                          <tfoot className="bg-slate-100 font-black text-slate-900 border-t border-slate-300">
                            <tr>
                              <td colSpan={3} className="py-2 px-3.5 uppercase text-xs tracking-wider text-right font-extrabold">
                                Total One-Time Cost
                              </td>
                              <td className="py-2 px-3.5 text-right text-emerald-700 font-black text-sm">
                                {formatCurrency(
                                  ((activeCostingSheet as any)?.weldingSoftwareRows || INITIAL_DIGIWELD_SOFTWARE_ROWS)
                                    .reduce((sum: number, r: any) => sum + (Number(r.price) || Number((r.unitPrice || r.price || 0) * (r.qty !== undefined ? r.qty : 1)) || 0), 0)
                                )}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Table 2: RECURRING COST */}
                    <div className="space-y-1 pt-2">
                      <div className="bg-slate-800 text-white px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide rounded-t-xl">
                        RECURRING COST
                      </div>
                      <div className="border border-slate-200 rounded-b-xl overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200 text-[11px]">
                            <tr>
                              <th className="py-2.5 px-3 w-8 text-center">Sl</th>
                              <th className="py-2.5 px-3.5 min-w-[180px]">Service / Component</th>
                              <th className="py-2.5 px-3.5 min-w-[160px]">Remarks</th>
                              <th className="py-2.5 px-3.5 text-right w-36 bg-purple-50/60 text-purple-950 font-black">Price / Mo (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                            {((activeCostingSheet as any)?.weldingCloudRows || INITIAL_DIGIWELD_CLOUD_ROWS)
                              .map((row: any) => {
                                const qty = Number(row.qty !== undefined ? row.qty : 1);
                                const unitMonthlyPrice = Number(row.unitMonthlyPrice || row.monthlyPrice || 0);
                                const monthlyPrice = Number(row.monthlyPrice) || (qty * unitMonthlyPrice);
                                return { ...row, monthlyPrice };
                              })
                              .filter((row: any) => row.monthlyPrice > 0)
                              .map((row: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                                  <td className="py-2 px-3 text-center text-slate-500 font-bold">{idx + 1}</td>
                                  <td className="py-2 px-3.5 font-semibold text-slate-900 leading-snug">{row.component || row.description}</td>
                                  <td className="py-2 px-3.5 text-slate-600">{row.remarks || 'Existing Infrastructure Enhancement'}</td>
                                  <td className="py-2 px-3.5 text-right font-black text-purple-950 bg-purple-50/30">{formatCurrency(row.monthlyPrice)}</td>
                                </tr>
                              ))}
                          </tbody>
                          <tfoot className="bg-slate-100 font-black text-slate-900 border-t border-slate-300">
                            <tr>
                              <td colSpan={3} className="py-2 px-3.5 uppercase text-xs tracking-wider text-right font-extrabold">
                                Total Recurring (Monthly)
                              </td>
                              <td className="py-2 px-3.5 text-right text-emerald-700 font-black text-sm">
                                {formatCurrency(
                                  ((activeCostingSheet as any)?.weldingCloudRows || INITIAL_DIGIWELD_CLOUD_ROWS)
                                    .reduce((sum: number, r: any) => sum + (Number(r.monthlyPrice) || Number((r.unitMonthlyPrice || r.monthlyPrice || 0) * (r.qty !== undefined ? r.qty : 1)) || 0), 0)
                                )} / mo
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Total Proposed Commercial Value Banner */}
                    <div className="bg-slate-900 text-white p-3.5 px-5 flex justify-between items-center font-extrabold text-xs sm:text-sm rounded-xl mt-3">
                      <span className="tracking-wide uppercase">TOTAL PROPOSED COMMERCIAL VALUE (INCL. TAXES)</span>
                      <span className="text-emerald-400 text-base sm:text-lg font-black">
                        {formatCurrency(Number(activeCostingSheet?.finalQuote || finalQuote || 0))}
                      </span>
                    </div>
                  </div>
                </div>
              ) : isWeldingIot ? (
                <div className="space-y-6">
                  {/* Commercials Table */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                          Commercials
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          Executive Scope &amp; Commercial Pricing for Welding IoT &amp; Kit
                        </span>
                      </div>
                      {activeCostingSheet?.finalQuote && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                          API Synced Value: ₹{Number(activeCostingSheet.finalQuote).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200 text-[11px]">
                          <tr>
                            <th className="py-2.5 px-3 text-center w-14">S.No</th>
                            <th className="py-2.5 px-4 w-2/5">Scope Description</th>
                            <th className="py-2.5 px-3 text-center">Payment Type</th>
                            <th className="py-2.5 px-3 text-center">Qty</th>
                            <th className="py-2.5 px-4 text-right">Total Price in INR</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                          <tr className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 text-center font-bold text-slate-600">1</td>
                            <td className="py-2.5 px-4 font-semibold text-slate-900 leading-snug">
                              Supply of IoT device for welding machine (Industry 4.0 ) with Software
                            </td>
                            <td className="py-2.5 px-3 text-center font-medium text-slate-700">One Time</td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-800">1</td>
                            <td className="py-2.5 px-4 text-right font-black text-slate-900 text-sm">
                              ₹{(
                                iotStep5Rows
                                  .filter((r) => r.section?.toLowerCase().includes('hardware') || r.section?.toLowerCase().includes('software') || r.id.startsWith('wh-') || r.id.startsWith('ws-'))
                                  .reduce((sum, r) => sum + Number(r.customerPrice || 0), 0) || Math.round(Number(activeCostingSheet?.finalQuote || 63000) * 0.7)
                              ).toLocaleString('en-IN')}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 text-center font-bold text-slate-600">2</td>
                            <td className="py-2.5 px-4 font-semibold text-slate-900 leading-snug">
                              Installation &amp; Commissioning Charges per kit
                            </td>
                            <td className="py-2.5 px-3 text-center font-medium text-slate-700">One Time</td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-800">1</td>
                            <td className="py-2.5 px-4 text-right font-black text-slate-900 text-sm">
                              ₹{(
                                iotStep5Rows
                                  .filter((r) => r.section?.toLowerCase().includes('installation') || r.id.startsWith('wi-'))
                                  .reduce((sum, r) => sum + Number(r.customerPrice || 0), 0) || Math.round(Number(activeCostingSheet?.finalQuote || 63000) * 0.3)
                              ).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="bg-slate-900 text-white p-3.5 px-5 flex justify-between items-center font-extrabold text-xs sm:text-sm">
                        <span className="tracking-wide uppercase">TOTAL COMMERCIAL INVESTMENT (INCL. ALL TAXES)</span>
                        <span className="text-emerald-400 text-base sm:text-lg font-black">
                          ₹{Number(activeCostingSheet?.finalQuote || finalQuote || iotTotalPrice || 63000).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold italic">
                      * FYI, BOM Annexure is attached below.
                    </p>
                  </div>

                  {/* Annexure Tables */}
                  <div className="space-y-4 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                        Annexure
                      </span>
                      <span className="text-xs text-slate-600 font-medium">
                        Detailed Itemized Bill of Materials (BOM) &amp; Technical Specifications
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Table 1: Hardware and development Charges */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                        <div className="bg-slate-100 p-2 px-3.5 border-b border-slate-200 font-bold text-slate-900 text-center uppercase tracking-wide text-xs">
                          Hardware and development Charges
                        </div>
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                            <tr>
                              <th className="py-2 px-3 text-center w-12">S.No</th>
                              <th className="py-2 px-3">Component Name</th>
                              <th className="py-2 px-3 text-center w-20">Qty</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium text-xs">
                            {((activeCostingSheet as any)?.weldingHardwareRows || INITIAL_WELDING_HARDWARE_ROWS).map((row: any, idx: number) => (
                              <tr key={idx} className="hover:bg-slate-50/70">
                                <td className="py-1.5 px-3 text-center font-semibold text-slate-500">{row.slNo || idx + 1}</td>
                                <td className="py-1.5 px-3 font-medium text-slate-900">{row.componentName}</td>
                                <td className="py-1.5 px-3 text-center font-bold text-slate-800">
                                  {row.qty && Number(row.qty) > 0 ? row.qty : idx === 13 ? 'As per Requirement' : '1'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Right Column: Software Development Scope & Cloud Recurring Cost */}
                      <div className="space-y-4">
                        {/* Table 2: Software Development Scope */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                          <div className="bg-slate-100 p-2 px-3.5 border-b border-slate-200 font-bold text-slate-900 text-center uppercase tracking-wide text-xs">
                            Software Development Scope
                          </div>
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                              <tr>
                                <th className="py-2 px-3 text-center w-24">Item</th>
                                <th className="py-2 px-3">Description</th>
                                <th className="py-2 px-3 text-center w-16">Qty</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                              {((activeCostingSheet as any)?.weldingSoftwareRows || INITIAL_WELDING_SOFTWARE_ROWS).map((row: any, idx: number) => (
                                <tr key={idx}>
                                  <td className="py-2 px-3 font-bold text-slate-900 text-center">{row.item}</td>
                                  <td className="py-2 px-3 leading-snug text-slate-800 font-medium">{row.description}</td>
                                  <td className="py-2 px-3 text-center font-bold text-slate-800">{row.uom || 'per kit'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Table 3: Cloud Recurring Cost */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                          <div className="bg-slate-100 p-2 px-3.5 border-b border-slate-200 font-bold text-slate-900 text-center uppercase tracking-wide text-xs">
                            Cloud Recurring Cost
                          </div>
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                              <tr>
                                <th className="py-2 px-3">Component</th>
                                <th className="py-2 px-3">Description</th>
                                <th className="py-2 px-3 text-center w-20">Type</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                              {((activeCostingSheet as any)?.weldingCloudRows || INITIAL_WELDING_CLOUD_ROWS).map((row: any, idx: number) => (
                                <tr key={idx}>
                                  <td className="py-1.5 px-3 font-semibold text-slate-900">{row.component}</td>
                                  <td className="py-1.5 px-3 text-slate-700">{row.description}</td>
                                  <td className="py-1.5 px-3 text-center font-bold text-indigo-700">{row.type}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : isIotOrControls ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                        Step 5 Itemized Scope
                      </span>
                      <span className="text-xs text-slate-600 font-medium">
                        Customer pricing breakdown for {activeCostingSheet?.subService || selectedSubServiceOptions.join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {activeCostingSheet?.finalQuote && (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                          API Synced Value: ₹{Number(activeCostingSheet.finalQuote).toLocaleString('en-IN')}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setIotStep5Rows([
                            ...iotStep5Rows,
                            {
                              id: `iot-${Date.now()}`,
                              section: 'Custom Scope Section',
                              stepNo: `${iotStep5Rows.length + 1}`,
                              description: 'Custom IoT / Controls Scope Item',
                              qty: 1,
                              uom: 'Nos',
                              customerPrice: 10000,
                            },
                          ]);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl border border-purple-200 transition-colors shadow-2xs cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> + Add Step Item
                      </button>
                    </div>
                  </div>

                  {/* Step 5 Table with Separate Section Headings */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200 text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3 text-center w-16">Step No</th>
                          <th className="py-2.5 px-4 w-2/5">Item Description</th>
                          <th className="py-2.5 px-3 text-center">Qty</th>
                          <th className="py-2.5 px-3 text-center">UoM</th>
                          <th className="py-2.5 px-4 text-right">Customer Price (₹)</th>
                          <th className="py-2.5 px-2 text-center w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                        {iotStep5Rows.map((row, idx) => {
                          const showSectionHeader =
                            row.section &&
                            (idx === 0 || iotStep5Rows[idx - 1]?.section !== row.section);

                          return (
                            <React.Fragment key={row.id || idx}>
                              {showSectionHeader && (
                                <tr className="bg-slate-100/80 border-t border-b border-slate-200">
                                  <td colSpan={6} className="py-1.5 px-4 font-black text-[11px] text-slate-800 uppercase tracking-wider">
                                    {row.section}
                                  </td>
                                </tr>
                              )}
                              <tr className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-2 px-3 text-center font-bold text-slate-600">
                                  <input
                                    type="text"
                                    value={row.stepNo}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setIotStep5Rows(
                                        iotStep5Rows.map((r, i) => (i === idx ? { ...r, stepNo: val } : r))
                                      );
                                    }}
                                    className="w-12 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-800 text-xs"
                                  />
                                </td>
                                <td className="py-2 px-4">
                                  <input
                                    type="text"
                                    value={row.description}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setIotStep5Rows(
                                        iotStep5Rows.map((r, i) => (i === idx ? { ...r, description: val } : r))
                                      );
                                    }}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold text-slate-900 text-xs"
                                  />
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <input
                                    type="number"
                                    min={1}
                                    value={row.qty}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setIotStep5Rows(
                                        iotStep5Rows.map((r, i) => (i === idx ? { ...r, qty: val } : r))
                                      );
                                    }}
                                    className="w-14 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-bold text-slate-800 text-xs"
                                  />
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <input
                                    type="text"
                                    value={row.uom}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setIotStep5Rows(
                                        iotStep5Rows.map((r, i) => (i === idx ? { ...r, uom: val } : r))
                                      );
                                    }}
                                    className="w-16 text-center bg-slate-50 border border-slate-200 rounded px-1 py-1 font-medium text-slate-700 text-xs"
                                  />
                                </td>
                                <td className="py-2 px-4 text-right">
                                  <input
                                    type="number"
                                    min={0}
                                    value={row.customerPrice}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setIotStep5Rows(
                                        iotStep5Rows.map((r, i) => (i === idx ? { ...r, customerPrice: val } : r))
                                      );
                                    }}
                                    className="w-28 text-right bg-emerald-50 border border-emerald-200 rounded px-2 py-1 font-black text-emerald-900 text-xs"
                                  />
                                </td>
                                <td className="py-2 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIotStep5Rows(iotStep5Rows.filter((_, i) => i !== idx));
                                    }}
                                    className="text-slate-400 hover:text-rose-600 p-1"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="bg-slate-900 text-white p-3.5 px-5 flex justify-between items-center font-extrabold text-xs sm:text-sm">
                      <span className="tracking-wide uppercase">TOTAL IOT &amp; CONTROLS COMMERCIAL VALUE</span>
                      <span className="text-emerald-400 text-base sm:text-lg font-black">
                        ₹{iotTotalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Air Audit / Energy Audit Costing Sheet Sync & Parameters */
                <div className="space-y-4">
                  {activeCostingSheet ? (
                    <>
                      <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              Live Costing Sheet Synced
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {activeCostingSheet?.serviceCategory || 'Energy Audit Services'}
                            </span>
                          </div>
                          <h4 className="text-base font-black text-slate-900 mt-1.5">
                            {activeCostingSheet?.clientName || clientName} — {activeCostingSheet?.subService || 'Energy Audit'}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium mt-0.5">
                            Site Days: <strong className="text-slate-800">{activeCostingSheet?.siteWorkingDays || siteDays}</strong> • Report Days: <strong className="text-slate-800">{activeCostingSheet?.reportWorkingDays || reportDays}</strong> • Margin: <strong className="text-indigo-700">{activeCostingSheet?.marginPct || marginPct}%</strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-4 bg-white p-3.5 px-5 rounded-xl border border-emerald-200/80 shadow-xs">
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sustainabyte Cost</span>
                            <span className="text-sm font-bold text-slate-800">
                              ₹{Number(activeCostingSheet?.subtotalCost || subtotal).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="h-8 w-px bg-slate-200" />
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-emerald-600 block">Final Calculated Quote</span>
                            <span className="text-lg sm:text-xl font-black text-emerald-700">
                              ₹{Number(activeCostingSheet?.finalQuote || finalQuote).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Synced Costing Metrics Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Manpower Cost</span>
                          <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                            ₹{Number(activeCostingSheet?.manpowerCost || activeCostingSheet?.totalManpowerCost || manpowerCost).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Instrument Rental</span>
                          <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                            ₹{Number(activeCostingSheet?.instrumentCost || activeCostingSheet?.totalInstrumentCost || instrumentCost).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Food & Travel</span>
                          <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                            ₹{Number(activeCostingSheet?.totalExtraCost !== undefined ? activeCostingSheet.totalExtraCost : effectiveFoodTravelCost).toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div>
                          <span className="text-indigo-600 block text-[10px] uppercase font-bold">Margin ({activeCostingSheet?.marginPct || marginPct}%)</span>
                          <p className="font-extrabold text-indigo-700 text-sm mt-0.5">
                            +₹{Number(activeCostingSheet?.marginAmount || marginAmount).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Direct Energy Audit Cost Estimate Table */
                    <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-800 font-extrabold border-b border-slate-200 text-[11px]">
                          <tr>
                            <th className="py-2.5 px-4 w-3/5">Description</th>
                            <th className="py-2.5 px-3 text-center">Project Timeline</th>
                            <th className="py-2.5 px-4 text-right">Project Cost (INR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          <tr>
                            <td className="py-3 px-4 font-semibold text-slate-900 leading-relaxed text-xs">
                              Energy Audit for the scope mentioned above
                            </td>
                            <td className="py-3 px-3 text-center font-medium text-slate-700">
                              1–2 Weeks
                            </td>
                            <td className="py-3 px-4 text-right font-black text-slate-900 text-sm">
                              ₹{Number(finalQuote || subtotal || 0).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="bg-slate-900 text-white p-3.5 px-5 flex justify-between items-center font-extrabold text-xs sm:text-sm">
                        <span className="tracking-wide uppercase text-xs">TOTAL COMMERCIAL INVESTMENT (INCL. ALL EXPENSES)</span>
                        <span className="text-emerald-400 text-base sm:text-lg font-black tracking-tight">
                          ₹{Number(finalQuote || subtotal || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Audit Team Members & Working Days */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Site Working Days
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={siteDays}
                        onChange={(e) => setSiteDays(Number(e.target.value))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Report Working Days
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={reportDays}
                        onChange={(e) => setReportDays(Number(e.target.value))}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Travel & Food Allowance */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Travel Distance (Kms)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={travelKms}
                        onChange={(e) => setTravelKms(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Travel Rate (₹/Km)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={travelRatePerKm}
                        onChange={(e) => setTravelRatePerKm(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Food &amp; Allowance (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={foodTravelCost}
                        onChange={(e) => setFoodTravelCost(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Scope of Work / Key Issues / Assessment Scope (Editable, Row-Wise, Black Text) */}
          {(isIotOrControls || isBms || isEnergyAudit || isIaqSensor || isEnergyAuditServices || isCompressorAirLeakageAudit || isNitrogenGasLeakageAudit || isMixtureGasLeakageAudit || isAshraeLevel2 || isHvacDesign || isEcFan || isIso50001) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isCompressorAirLeakageAudit
                      ? 'Step 5: Objectives, Assessment Scope & Methodology — Compressor Air Leakage Audit'
                      : isNitrogenGasLeakageAudit
                      ? 'Step 5: Objectives, Scope & Methodology — Nitrogen Gas Leakage Audit'
                      : isMixtureGasLeakageAudit
                      ? 'Step 5: Objectives, Scope & Methodology — Mixture Gas Leakage Audit'
                      : isAshraeLevel2
                      ? 'Step 5: Scope of Work & Assessment Activities — ASHRAE Level 2'
                      : isHvacDesign
                      ? 'Step 5: Scope of Work & Technical Deliverables — HVAC Design'
                      : isEcFan
                      ? 'Step 5: Scope of Supply & Technical Overview — EC Fan Solution'
                      : isIso50001
                      ? 'Step 5: EnMS Framework & Scope of Work — ISO 50001'
                      : isTemperatureSensor
                      ? 'Step 5: Objectives, Scope of Work & Deliverables — Temperature Sensor Solution'
                      : isDewPointHardware
                      ? 'Step 5: Scope of Supply, Terms & Conditions — Dew Point Hardware'
                      : isFlangesHardware
                      ? 'Step 5: Scope of Supply, Terms & Conditions — Flanges Hardware'
                      : isCpmChillerManagement
                      ? 'Step 5: Scope of Work & Platform Overview — Chiller Plant Management (CPM)'
                      : isIaqSensor
                      ? 'Step 5: Scope of Supply, Technical Specifications & Monitored Parameters — IAQ Sensor'
                      : isIrBlaster
                      ? 'Step 5: Scope of Work, Technical Capabilities & Energy Benefits — IR Blaster AC Energy Solutions'
                      : isWeldDataDigitalized
                      ? 'Step 5: Scope of Work, Deliverables & Solution Architecture — Digiweld'
                      : isWeldingIot
                      ? 'Step 5: Scope of Work, POC Success Criteria & Benefits — Welding IoT & Kit'
                      : isWaterManagement
                      ? 'Step 5: Scope of Work & Solution Overview — Water Management Solution'
                      : isBms
                      ? 'Step 5: Key Issues Identified, Assessment Activities & Expected Outcome — Building Management System (BMS)'
                      : isEnergyAudit
                      ? 'Step 5: Detailed Scope of Work & Assessment Activities — Energy Audit'
                      : 'Step 5: Scope of Work & Platform Benefits — Energy Management Solution'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isCompressorAirLeakageAudit
                      ? 'Ultrasonic Leak Detection, Loss Quantification, FAD Test, System Optimization & Energy Recovery'
                      : isNitrogenGasLeakageAudit
                      ? 'Ultrasonic Gas Detection, Consumption Mapping, High-Loss Zone Identification & Savings Potential'
                      : isMixtureGasLeakageAudit
                      ? 'Ultrasonic Gas Mixture Auditing, Pipe Network Mapping, Valve/Flange Leak Tagging & Cost Recovery'
                      : isAshraeLevel2
                      ? 'Detailed Energy Breakdown, Sub-System Efficiency Analysis & Prioritized Energy Conservation Measures'
                      : isHvacDesign
                      ? 'Cooling Load Calculation, Equipment Sizing, Duct Layout & Energy-Efficient HVAC System Design'
                      : isEcFan
                      ? 'EC Fan Retrofit Scope, Motor Efficiency Upgrade & Smart Airflow Automation'
                      : isIso50001
                      ? 'Energy Management System (EnMS) Gap Analysis, Energy Baseline (EnB) & Performance Indicators (EnPI)'
                      : isTemperatureSensor
                      ? 'Objectives, Site Survey, Sensor Deployment, Centralized Dashboard & Deliverables'
                      : isDewPointHardware
                      ? 'Dew Point Hardware Scope, Technical Requirements & Commercial Deliverables'
                      : isFlangesHardware
                      ? 'Flanges Supply Scope, Material Specifications & Commercial Deliverables'
                      : isCpmChillerManagement
                      ? 'CPM Plant Automation, Modbus Controller Logic, Sensor Interfacing & Deliverables'
                      : isIaqSensor
                      ? 'Scope of Supply, About IAQ Sensor, Monitored Parameters (CO2, PM2.5, PM10, TVOC) & Cloud Analytics'
                      : isIrBlaster
                      ? 'Scope of Supply, About IR Blaster, Key Automation Features & Measurable Energy Savings'
                      : isWeldingIot
                      ? 'Scope of Supply, Customer Dependencies, POC Criteria & Welding Benefits'
                      : isWaterManagement
                      ? 'Water Management Scope of Work, Centralized Dashboard & Digitalization Overview'
                      : isBms
                      ? 'Key Issues, Proposed Assessment Activities & Expected Outcome Roadmap'
                      : isEnergyAudit
                      ? 'Complete 14-Section Engineering Assessment Methodologies & Final Deliverables'
                      : '4-Phase Roadmap, Platform Value & EMS Key Benefits'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmsStep5Text(
                        isCompressorAirLeakageAudit
                          ? DEFAULT_COMPRESSOR_AIR_AUDIT_STEP5_TEXT
                          : isNitrogenGasLeakageAudit
                          ? DEFAULT_NITROGEN_GAS_LEAKAGE_AUDIT_STEP5_TEXT
                          : isMixtureGasLeakageAudit
                          ? DEFAULT_MIXTURE_GAS_LEAKAGE_AUDIT_STEP5_TEXT
                          : isAshraeLevel2
                          ? DEFAULT_ASHRAE_LEVEL_2_STEP5_TEXT
                          : isHvacDesign
                          ? DEFAULT_HVAC_DESIGN_STEP5_TEXT
                          : isEcFan
                          ? DEFAULT_EC_FAN_STEP5_TEXT
                          : isIso50001
                          ? DEFAULT_ISO_50001_STEP5_TEXT
                          : isTemperatureSensor
                          ? DEFAULT_TEMPERATURE_SENSOR_STEP5_TEXT
                          : isDewPointHardware
                          ? DEFAULT_DEW_POINT_STEP5_TEXT
                          : isFlangesHardware
                          ? DEFAULT_FLANGES_STEP5_TEXT
                          : isCpmChillerManagement
                          ? DEFAULT_CPM_STEP5_TEXT
                          : isIaqSensor
                          ? DEFAULT_IAQ_SENSOR_STEP5_TEXT
                          : isIrBlaster
                          ? DEFAULT_IR_BLASTER_STEP5_TEXT
                          : isWeldingIot
                          ? DEFAULT_WELDING_STEP5_TEXT
                          : isWaterManagement
                          ? DEFAULT_WATER_MANAGEMENT_STEP5_TEXT
                          : isBms
                          ? DEFAULT_BMS_STEP5_TEXT
                          : isEnergyAudit
                          ? DEFAULT_ENERGY_AUDIT_STEP5_TEXT
                          : DEFAULT_EMS_STEP5_TEXT
                      );
                      toast.success('Reset Step 5 text to default!');
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset Default
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingEmsStep5Text(!isEditingEmsStep5Text)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                      isEditingEmsStep5Text
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    {isEditingEmsStep5Text ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Done Editing
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-3.5 w-3.5" /> Edit Text
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isEditingEmsStep5Text ? (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-900">
                    Edit Step 5 Text (Separate sections with blank lines):
                  </label>
                  <textarea
                    rows={22}
                    value={emsStep5Text || ''}
                    onChange={(e) => setEmsStep5Text(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Type or edit Scope of Work and Assessment text..."
                  />
                </div>
              ) : (
                <div className="space-y-4 text-xs text-slate-950 leading-relaxed font-normal">
                  {(emsStep5Text || '')
                    .split(/\n\n+/)
                    .filter((block) => block.trim())
                    .map((block, bIdx) => {
                      const lines = block.split('\n');
                      return (
                        <div key={bIdx} className="space-y-1.5 border-b border-slate-100 pb-3.5 last:border-0 last:pb-0">
                          {lines.map((line, lIdx) => {
                            const trimmed = line.trim();
                            const isHeading =
                              trimmed === 'KEY ISSUES IDENTIFIED' ||
                              trimmed === 'PROPOSED ASSESSMENT ACTIVITIES' ||
                              trimmed === 'EXPECTED OUTCOME' ||
                              trimmed === 'Key Digitalization Pillars:' ||
                              trimmed.startsWith('Scope of Work:') ||
                              trimmed.startsWith('Scope of Supply:') ||
                              trimmed.startsWith('Customer dependencies') ||
                              trimmed.startsWith('POC / Phase 1 Success') ||
                              trimmed.startsWith('Timeline:') ||
                              trimmed.startsWith('IoT 4.0 Welding benefits') ||
                              trimmed.startsWith('Use Case Benefits') ||
                              trimmed.startsWith('Water Management System:') ||
                              trimmed.startsWith('Phase ') ||
                              trimmed.startsWith('Potential benefits') ||
                              trimmed.startsWith('Benefits of Energy') ||
                              trimmed.startsWith('In the “current proposal') ||
                              /^\d+\.\s+[A-Z]/.test(trimmed);
                            const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('·') || trimmed.startsWith('');
                            const isNumbered = /^\d+\./.test(trimmed);

                            if (trimmed.startsWith('Timeline:') && isWeldingIot) {
                              return (
                                <React.Fragment key={lIdx}>
                                  <div className="my-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center shadow-2xs">
                                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                                      IoT Cloud Connectivity Flowchart
                                    </p>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src="/weldingiotflowchart.png"
                                      alt="Welding IoT Architecture Flowchart"
                                      className="w-full max-h-[250px] object-contain rounded-lg"
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1.5 font-medium text-center">
                                      MIG/MAG to Cloud Platform Architecture &amp; MQTT Protocol
                                    </p>
                                  </div>
                                  <p className="font-extrabold text-slate-950 text-xs pt-1 uppercase tracking-wider text-indigo-900 bg-indigo-50/60 p-1.5 px-2.5 rounded-md border border-indigo-100 inline-block my-1">
                                    {line}
                                  </p>
                                </React.Fragment>
                              );
                            }

                            if (isCompressorAirLeakageAudit && (trimmed.includes('Methodology Overview') || trimmed.includes('Basic Compressed Air Network'))) {
                              return (
                                <React.Fragment key={lIdx}>
                                  <p className="font-extrabold text-slate-950 text-xs pt-1 uppercase tracking-wider text-indigo-900 bg-indigo-50/60 p-1.5 px-2.5 rounded-md border border-indigo-100 inline-block my-1">
                                    {line}
                                  </p>
                                  <div className="my-3 p-3 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center shadow-2xs">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src="/compresed sir leakage audit.png"
                                      alt="Compressed Air System Overview"
                                      className="w-full max-h-[220px] object-contain rounded-lg"
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1.5 font-medium text-center">
                                      Compressed Air Generation, Distribution &amp; End Use Lifecycle
                                    </p>
                                  </div>
                                </React.Fragment>
                              );
                            }

                            if (isCompressorAirLeakageAudit && (trimmed.includes('Leakage Identification & Tagging') || trimmed.includes('Leakage Identification:'))) {
                              return (
                                <React.Fragment key={lIdx}>
                                  <p className="font-extrabold text-slate-950 text-xs pt-1 uppercase tracking-wider text-indigo-900 bg-indigo-50/60 p-1.5 px-2.5 rounded-md border border-indigo-100 inline-block my-1">
                                    {line}
                                  </p>
                                  <div className="grid grid-cols-2 gap-3 my-2">
                                    <div className="rounded-xl border border-slate-200 bg-white p-2 flex flex-col items-center shadow-2xs">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src="/compressed air leakage .png"
                                        alt="Ultrasonic Detection Screen"
                                        className="w-full h-[130px] object-contain rounded"
                                      />
                                      <p className="text-[10px] font-semibold text-slate-600 mt-1 text-center">Ultrasonic Leak Screen Readout (dB / CFM Loss)</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-200 bg-white p-2 flex flex-col items-center shadow-2xs">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src="/compressed 3.png"
                                        alt="Physical Tagging Label"
                                        className="w-full h-[130px] object-contain rounded"
                                      />
                                      <p className="text-[10px] font-semibold text-slate-600 mt-1 text-center">Physical Leak Tagging Label On Line</p>
                                    </div>
                                  </div>
                                </React.Fragment>
                              );
                            }

                            if (isCompressorAirLeakageAudit && (trimmed.includes('Our Leakage Detector Overview') || trimmed.includes('Leakage Detector'))) {
                              return (
                                <React.Fragment key={lIdx}>
                                  <p className="font-extrabold text-slate-950 text-xs pt-1 uppercase tracking-wider text-indigo-900 bg-indigo-50/60 p-1.5 px-2.5 rounded-md border border-indigo-100 inline-block my-1">
                                    {line}
                                  </p>
                                  <div className="my-2 p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col items-center shadow-2xs">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src="/compressrd air 2.png"
                                      alt="Ultrasonic Leak Detector Device in Operation"
                                      className="w-full max-h-[160px] object-contain mx-auto rounded"
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1.5 font-medium text-center">
                                      Ultrasonic High-Frequency Leak Detector &amp; Headphone Acoustic Monitoring
                                    </p>
                                  </div>
                                </React.Fragment>
                              );
                            }

                            if (isCompressorAirLeakageAudit && (trimmed.toLowerCase().includes('phase-3 implementation validation') || trimmed.toLowerCase().includes('phase-3: implementation validation'))) {
                              return (
                                <React.Fragment key={lIdx}>
                                  <p className="font-extrabold text-slate-950 text-xs pt-1 uppercase tracking-wider text-indigo-900 bg-indigo-50/60 p-1.5 px-2.5 rounded-md border border-indigo-100 inline-block my-1">
                                    {line}
                                  </p>
                                  <div className="my-2 p-2 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center shadow-2xs">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src="/compresd6.png"
                                      alt="Ultrasonic Leakage Arresting Validation"
                                      className="w-full max-h-[160px] object-contain mx-auto"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 font-medium text-center">
                                      Ultrasonic Acoustic Camera Validation &amp; Re-measurement
                                    </p>
                                  </div>
                                </React.Fragment>
                              );
                            }

                            if (isCompressorAirLeakageAudit && (trimmed.includes('Demand Flow Measurement') || trimmed.includes('Air Compressor Efficiency Audit'))) {
                              return (
                                <React.Fragment key={lIdx}>
                                  <p className="font-extrabold text-slate-950 text-xs pt-1 uppercase tracking-wider text-indigo-900 bg-indigo-50/60 p-1.5 px-2.5 rounded-md border border-indigo-100 inline-block my-1">
                                    {line}
                                  </p>
                                  {trimmed.includes('Demand Flow Measurement') && (
                                    <div className="my-2 p-2.5 bg-white rounded-xl border border-slate-200 flex flex-col items-center shadow-2xs">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src="/compresed4.png"
                                        alt="Demand Flow Measurement Meter Position"
                                        className="w-full max-h-[160px] object-contain mx-auto rounded"
                                      />
                                      <p className="text-[10px] text-slate-500 mt-1 font-medium text-center">
                                        Inline Mass Flow Meter Demand Logging &amp; Baseline Profile
                                      </p>
                                    </div>
                                  )}
                                </React.Fragment>
                              );
                            }

                            if (isHeading) {
                              return (
                                <p key={lIdx} className="font-extrabold text-slate-950 text-xs pt-1 uppercase tracking-wider text-indigo-900 bg-indigo-50/60 p-1.5 px-2.5 rounded-md border border-indigo-100 inline-block my-1">
                                  {line}
                                </p>
                              );
                            }

                            if (isNumbered) {
                              return (
                                <p key={lIdx} className="font-bold text-slate-950 text-xs pt-1">
                                  {line}
                                </p>
                              );
                            }

                            if (isBullet) {
                              return (
                                <div key={lIdx} className="flex items-start gap-2 pl-3 text-slate-900 font-medium">
                                  <span className="font-bold text-indigo-600">•</span>
                                  <span>{trimmed.replace(/^[•\-·]\s*/, '')}</span>
                                </div>
                              );
                            }

                            return (
                              <p key={lIdx} className="text-slate-950">
                                {line}
                              </p>
                            );
                          })}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Step 6: Notes, Client Support & Terms and Conditions (Editable, Row-Wise, Black Text) */}
          {(isIotOrControls || isBms || isEnergyAudit || isIaqSensor || isEnergyAuditServices || isCompressorAirLeakageAudit || isNitrogenGasLeakageAudit || isMixtureGasLeakageAudit || isAshraeLevel2 || isHvacDesign || isEcFan || isIso50001) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isCompressorAirLeakageAudit
                      ? 'Step 6: Commercial Terms, Client Inclusions & Notes — Compressor Air Leakage Audit'
                      : isNitrogenGasLeakageAudit
                      ? 'Step 6: Commercial Terms, Client Inclusions & Notes — Nitrogen Gas Leakage Audit'
                      : isMixtureGasLeakageAudit
                      ? 'Step 6: Commercial Terms, Client Inclusions & Notes — Mixture Gas Leakage Audit'
                      : isAshraeLevel2
                      ? 'Step 6: Commercial Terms & Payment Schedule — ASHRAE Level 2'
                      : isHvacDesign
                      ? 'Step 6: Terms, Inclusions & Engineering Scope Notes — HVAC Design'
                      : isEcFan
                      ? 'Step 6: Commercial Terms, Warranty & Payment Schedule — EC Fan Solution'
                      : isIso50001
                      ? 'Step 6: Terms, Consultancy Inclusions & Payment Schedule — ISO 50001'
                      : isIaqSensor
                      ? 'Step 6: Commercial Terms, Warranty & Payment Schedule — IAQ Sensor'
                      : isIrBlaster
                      ? 'Step 6: Client Support, Terms and Conditions & Payment Schedule — IR Blaster'
                      : isWeldDataDigitalized
                      ? 'Step 6: Client Support, Terms and Conditions & Payment Schedule — Digiweld'
                      : isWeldingIot
                      ? 'Step 6: Client Support, Terms and Conditions & Payment Schedule — Welding IoT & Kit'
                      : isWaterManagement
                      ? 'Step 6: Client Support, Terms and Conditions & Payment Schedule — Water Management Solution'
                      : isBms
                      ? 'Step 6: Payment Terms & Conditions — Building Management System (BMS)'
                      : isEnergyAudit
                      ? 'Step 6: Payment Terms & Conditions — Energy Audit'
                      : 'Step 6: Notes, Client Support & Terms and Conditions'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isCompressorAirLeakageAudit
                      ? 'Plant Accessibility, Ultrasonic Testing Coordination, 100% On Submission Invoicing & Validity'
                      : isNitrogenGasLeakageAudit
                      ? 'Safety Clearances, High-Pressure Line Access, Report Delivery & Payment Milestones'
                      : isMixtureGasLeakageAudit
                      ? 'Hazardous Area Protocol, Gas Network Isolation, Report Submission & Payment Terms'
                      : isAshraeLevel2
                      ? 'Engineering Data Access, Sub-System Monitoring Clearances & Commercial Milestone Terms'
                      : isHvacDesign
                      ? 'Architectural Drawing Inputs, Design Review Cycles, BOQ Deliverables & Payment Milestones'
                      : isEcFan
                      ? 'Supply Lead Times, Installation Coordination, 12 Months Motor Warranty & Payment Terms'
                      : isIso50001
                      ? 'Management Review Coordination, Internal Audit Support, Certification Stage Terms & Milestone Invoicing'
                      : isIaqSensor
                      ? '100% Upfront Hardware Payment, 5-6 Weeks Delivery, 12/18 Months Warranty & Support Terms'
                      : isIrBlaster
                      ? 'Client SPOC Support, Accessibility, 100% Upfront Hardware & 50/50 Installation Terms'
                      : isWeldingIot
                      ? 'Client SPOC & Maintenance Support, 70/30 Payment Schedule & 11 Commercial Terms'
                      : isWaterManagement
                      ? 'Client Deliverables, Water Shutdown Terms & Milestone Payment Schedule'
                      : isBms
                      ? 'Milestone-Wise Payment Schedule, Invoicing & Site Coordination Terms'
                      : isEnergyAudit
                      ? '30-Day Payment Terms, Site Coordination Requirements & Commercial Validity'
                      : 'Scope Inclusions, Client Deliverables & Commercial Clauses'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmsStep6Text(
                        isCompressorAirLeakageAudit
                          ? DEFAULT_COMPRESSOR_AIR_AUDIT_STEP6_TEXT
                          : isNitrogenGasLeakageAudit
                          ? DEFAULT_NITROGEN_GAS_LEAKAGE_AUDIT_STEP6_TEXT
                          : isMixtureGasLeakageAudit
                          ? DEFAULT_MIXTURE_GAS_LEAKAGE_AUDIT_STEP6_TEXT
                          : isAshraeLevel2
                          ? DEFAULT_ASHRAE_LEVEL_2_STEP6_TEXT
                          : isHvacDesign
                          ? DEFAULT_HVAC_DESIGN_STEP6_TEXT
                          : isEcFan
                          ? DEFAULT_EC_FAN_STEP6_TEXT
                          : isIso50001
                          ? DEFAULT_ISO_50001_STEP6_TEXT
                          : isIaqSensor
                          ? DEFAULT_IAQ_SENSOR_STEP6_TEXT
                          : isIrBlaster
                          ? DEFAULT_IR_BLASTER_STEP6_TEXT
                          : isWeldingIot
                          ? DEFAULT_WELDING_STEP6_TEXT
                          : isWaterManagement
                          ? DEFAULT_WATER_MANAGEMENT_STEP6_TEXT
                          : isBms
                          ? DEFAULT_BMS_STEP6_TEXT
                          : isEnergyAudit
                          ? DEFAULT_ENERGY_AUDIT_STEP6_TEXT
                          : DEFAULT_EMS_STEP6_TEXT
                      );
                      toast.success('Reset Step 6 text to default!');
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset Default
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingEmsStep6Text(!isEditingEmsStep6Text)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                      isEditingEmsStep6Text
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    {isEditingEmsStep6Text ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Done Editing
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-3.5 w-3.5" /> Edit Text
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isEditingEmsStep6Text ? (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-900">
                    Edit Step 6 Text (Separate sections with blank lines):
                  </label>
                  <textarea
                    rows={18}
                    value={emsStep6Text || ''}
                    onChange={(e) => setEmsStep6Text(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Type or edit Payment Terms, Notes, Client Support, Terms and Conditions..."
                  />
                </div>
              ) : (
                <div className="space-y-4 text-xs text-slate-950 leading-relaxed font-normal">
                  {(emsStep6Text || '')
                    .split(/\n\n+/)
                    .filter((block) => block.trim())
                    .map((block, bIdx) => {
                      const lines = block.split('\n');
                      return (
                        <div key={bIdx} className="space-y-1.5 border-b border-slate-100 pb-3.5 last:border-0 last:pb-0">
                          {lines.map((line, lIdx) => {
                            const trimmed = line.trim();
                            const isHeading =
                              trimmed.startsWith('NOTE:') ||
                              trimmed.startsWith('Support required') ||
                              trimmed.startsWith('Terms and Conditions:') ||
                              trimmed.startsWith('Payment Terms:') ||
                              trimmed.startsWith('Other Terms and Conditions:');
                            const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('·');
                            const isTableLine = trimmed.includes('|');

                            if (isHeading) {
                              return (
                                <p key={lIdx} className="font-extrabold text-slate-950 text-xs pt-1 uppercase tracking-wider text-slate-900 bg-slate-100/80 p-1.5 px-2.5 rounded-md border border-slate-200 inline-block my-1">
                                  {line}
                                </p>
                              );
                            }

                            if (isTableLine) {
                              const cells = trimmed.split('|').map((c) => c.trim());
                              return (
                                <div key={lIdx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-950 font-medium">
                                  <span>{cells[0]} {cells[1] && `• ${cells[1]}`}</span>
                                  {cells[2] && <span className="font-bold text-slate-950 shrink-0 ml-2">{cells[2]}</span>}
                                </div>
                              );
                            }

                            if (isBullet) {
                              return (
                                <div key={lIdx} className="flex items-start gap-2 pl-3 text-slate-900 font-medium">
                                  <span className="font-bold text-emerald-600">·</span>
                                  <span>{trimmed.replace(/^[•\-·]\s*/, '')}</span>
                                </div>
                              );
                            }

                            return (
                              <p key={lIdx} className="text-slate-950">
                                {line}
                              </p>
                            );
                          })}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Step 7: Submitted By & Bank Account Details */}
          {(isIotOrControls || isBms) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm">
                    Step 7: Submitted By &amp; Bank Account Details
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official Sign-Off, Contact Details &amp; Commercial Bank Accounts
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep7SubmittedBy(DEFAULT_STEP7_SUBMITTED_BY);
                      setStep7BankDetails(DEFAULT_STEP7_BANK_DETAILS);
                      toast.success('Reset Step 7 to default!');
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reset Default
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingStep7(!isEditingStep7)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                      isEditingStep7
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    {isEditingStep7 ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Done Editing
                      </>
                    ) : (
                      <>
                        <Edit3 className="h-3.5 w-3.5" /> Edit Details
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isEditingStep7 ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1">
                      Submitted By Details:
                    </label>
                    <textarea
                      rows={5}
                      value={step7SubmittedBy}
                      onChange={(e) => setStep7SubmittedBy(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1">
                      Bank Account Details:
                    </label>
                    <textarea
                      rows={7}
                      value={step7BankDetails}
                      onChange={(e) => setStep7BankDetails(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5 text-slate-950">
                  {/* Submitted By Block with Company Logo */}
                  <div className="space-y-3">
                    <p className="font-bold text-xs text-slate-950">Submitted by,</p>
                    
                    {/* Company Logo */}
                    <div className="pt-0.5 pb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/Company-Logo-3-1.png"
                        alt="Sustainabyte Technologies Pvt. Ltd."
                        className="h-12 sm:h-14 w-auto object-contain"
                      />
                    </div>

                    <div className="space-y-0.5 text-xs text-slate-950">
                      {(step7SubmittedBy || '').split('\n').map((line, idx) => (
                        <p key={idx} className={idx === 0 ? 'font-black text-slate-950 text-sm' : idx === 1 ? 'font-bold text-slate-900' : 'text-slate-800 font-medium'}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Bank Account Details */}
                  <div className="pt-2 border-t border-slate-200 space-y-1 text-xs text-slate-950">
                    {(step7BankDetails || '').split('\n').map((line, idx) => (
                      <p key={idx} className={idx === 0 ? 'font-black text-slate-950 text-xs pb-0.5' : 'text-slate-800 font-medium'}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Live Summary Card & Actions */}
        <div className="space-y-6">
          <QuoteSummaryCard
            manpowerCost={manpowerCost}
            instrumentCost={instrumentCost}
            foodTravelCost={effectiveFoodTravelCost}
            subtotal={subtotal}
            marginPct={marginPct}
            marginAmount={marginAmount}
            bufferPct={bufferPct}
            bufferAmount={bufferAmount}
            finalQuote={finalQuote}
            requiresApproval={requiresApproval}
            approvalReasons={approvalReasons}
          />

          <button
            type="button"
            onClick={() => createQuoteMutation.mutate()}
            disabled={createQuoteMutation.isPending || !clientName || (!serviceId && selectedSubServiceOptions.length === 0)}
            className="w-full py-4 px-6 bg-[#3BD98E] hover:bg-[#3BD98E]/90 text-[#0D1B3C] font-black text-sm rounded-xl shadow-xl shadow-[#3BD98E]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {createQuoteMutation.isPending ? (
              'Calculating & Creating Quote...'
            ) : (
              <>
                Save Quote & Proceed <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default function NewQuotePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading quote builder...</div>}>
      <NewQuoteContent />
    </Suspense>
  );
}

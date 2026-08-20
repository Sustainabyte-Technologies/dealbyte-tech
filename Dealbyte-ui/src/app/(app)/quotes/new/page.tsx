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
} from '@/components/costing/constants';
import QuoteSummaryCard from '@/components/quotes/QuoteSummaryCard';
import FullPageWatermark from '@/components/common/FullPageWatermark';

const DEFAULT_CLIENTS = [
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
  'Kone elevators',
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

  // Searchable Dropdown Combobox State
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const clientDropdownRef = useRef<HTMLDivElement>(null);

  // Category & Sub-Services Constants
  const SERVICE_CATEGORY_OPTIONS = [
    'Energy Audit Services',
    'IoT & Controls',
    'Welding IoT',
    'Hardware',
    'Custom',
  ];

  const ENERGY_AUDIT_SUB_SERVICES = [
    'Compressor Air Leakage rectification',
    'Flowmeter',
    'Compressor air leakage audit',
    'nitrogen Gas Leakage Audit',
    'Mixture Gas Leakage Audit',
    'Air Audit',
    'Air Audit Rectification',
    'Energy Audit',
    'BMS',
    'Electrical Safety Audit',
    'Fire Safety Audit',
    'Custom',
  ];
  const PROJECTS_SUB_SERVICES = ['Optibyte', 'Digiweld', 'Tec Byte', 'Fix Byte', 'Compass', 'Custom Project'];
  const IOT_SERVICES_SUB_SERVICES = [
    'Energy Management Solution',
    'Water Management Solution',
    'Cloud Charges',
    'Chiller Plant Monitoring',
    'Compressed Air Automation',
    'Compressed Air Monitoring',
    'BMS',
    'IoT Platform',
    'Custom',
  ];
  const WELDING_IOT_SUB_SERVICES = [
    'Welding IoT & Kit',
    'Welding IoT',
    'Chiller Digitization',
    'Cold Storage Temperature',
    'Device Parameter Interlocking',
    'Weld Data Digitalized',
    'Welding IoT Kit',
    'Welding Machine IoT',
    'Weld Data Microsoft Azure',
    'Custom',
  ];
  const HARDWARE_SUB_SERVICES = ['Hardware Installation', 'Hardware Supply', 'Custom'];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Energy Audit Services']);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const mainCategoryService = selectedCategories.join(', ');
  const [selectedSubServiceOptions, setSelectedSubServiceOptions] = useState<string[]>(['Air Audit']);
  const [isSubServicesDropdownOpen, setIsSubServicesDropdownOpen] = useState(false);
  const subServicesDropdownRef = useRef<HTMLDivElement>(null);

  // Assets & Scope of Assessment State (31 Categories)
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([
    'bill_analysis',
    'motors',
    'pumps',
    'compressors',
    'air_chillers',
  ]);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [isAssetsDropdownOpen, setIsAssetsDropdownOpen] = useState(false);
  const assetsDropdownRef = useRef<HTMLDivElement>(null);
  const [expandedAssetId, setExpandedAssetId] = useState<string | null>('bill_analysis');

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
  const dynamicProjectsSubServices = React.useMemo(() => {
    const apiProjects = services
      .filter((s) => {
        const cat = (s.category || '').toLowerCase();
        const nm = (s.name || '').toLowerCase();
        return cat.includes('project') || ['optibyte', 'digiweld', 'tec byte', 'fix byte', 'compass'].includes(nm);
      })
      .map((s) => s.name);
    return Array.from(new Set([...apiProjects, ...PROJECTS_SUB_SERVICES]));
  }, [services]);

  const dynamicEnergyAuditSubServices = React.useMemo(() => {
    const apiAudits = services
      .filter((s) => (s.category || '').toLowerCase().includes('audit'))
      .map((s) => s.name);
    return Array.from(new Set([...apiAudits, ...ENERGY_AUDIT_SUB_SERVICES]));
  }, [services]);

  const dynamicIotServicesSubServices = React.useMemo(() => {
    const excludedNames = ['optibyte', 'digiweld', 'tec byte', 'fix byte', 'compass', 'welding iot', 'welding iot & kit', 'welding iot kit'];
    const apiIot = services
      .filter((s) => {
        const cat = (s.category || '').toLowerCase();
        const nm = (s.name || '').toLowerCase();
        return (cat.includes('iot') || cat.includes('control')) && !excludedNames.includes(nm);
      })
      .map((s) => s.name);
    return Array.from(new Set([...apiIot, ...IOT_SERVICES_SUB_SERVICES])).filter(
      (nm) => !excludedNames.includes(nm.toLowerCase())
    );
  }, [services]);

  const dynamicHardwareSubServices = React.useMemo(() => {
    const apiHardware = services
      .filter((s) => (s.category || '').toLowerCase().includes('hardware'))
      .map((s) => s.name);
    return Array.from(new Set([...apiHardware, ...HARDWARE_SUB_SERVICES]));
  }, [services]);

  const dynamicWeldingIotSubServices = React.useMemo(() => {
    const excludedWelding = [
      'welding data monitoring',
      'welding quality & gas monitoring',
      'welding machine automation',
    ];
    const apiWelding = services
      .filter((s) => {
        const cat = (s.category || '').toLowerCase();
        const nm = (s.name || '').toLowerCase();
        return (cat.includes('welding') || nm.includes('welding')) && !excludedWelding.includes(nm);
      })
      .map((s) => s.name);
    return Array.from(new Set([...apiWelding, ...WELDING_IOT_SUB_SERVICES])).filter(
      (nm) => !excludedWelding.includes(nm.toLowerCase())
    );
  }, [services]);

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
    if (selectedCategories.includes('Welding IoT')) {
      opts.push(...dynamicWeldingIotSubServices);
    }
    if (selectedCategories.includes('Hardware')) {
      opts.push(...dynamicHardwareSubServices);
    }
    if (selectedCategories.includes('Custom') || opts.length === 0) {
      opts.push('Custom');
    }
    return Array.from(new Set(opts));
  }, [
    selectedCategories,
    dynamicEnergyAuditSubServices,
    dynamicProjectsSubServices,
    dynamicIotServicesSubServices,
    dynamicWeldingIotSubServices,
    dynamicHardwareSubServices,
  ]);

  // Auto-prune or reset selected sub-services when category changes
  useEffect(() => {
    if (availableSubServices.length > 0) {
      const validSelections = selectedSubServiceOptions.filter((opt) =>
        availableSubServices.includes(opt)
      );
      if (validSelections.length > 0) {
        if (validSelections.length !== selectedSubServiceOptions.length) {
          setSelectedSubServiceOptions(validSelections);
        }
      } else {
        setSelectedSubServiceOptions([availableSubServices[0]]);
      }
    }
  }, [availableSubServices]);

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

  // Client Options List (from DB if present, or fallback default list)
  const clientOptions: Array<{ id?: string; name: string }> =
    dbClients.length > 0
      ? dbClients.map((c) => ({ id: c.id, name: c.name }))
      : clientList.map((name) => ({ name }));

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
      }
    }
  }, [existingQuote]);


  // Selected Costing Sheet ID (if multiple sheets exist for this client)
  const [selectedCostingSheetId, setSelectedCostingSheetId] = useState<string>('');

  // Query saved Costing Sheets as soon as Client Name or Category / Sub-Service is chosen
  const { data: clientCostingSheets = [], isLoading: isLoadingCostingSheets } = useQuery({
    queryKey: ['costing-sheets-client', clientName, selectedCategories, selectedSubServiceOptions],
    queryFn: async () => {
      if (!clientName || !clientName.trim()) return [];

      const cleanName = clientName.replace(/(ltd|pvt|limited|private|inc|corp)\.?/gi, '').trim();

      const [generalSheets, airSheets, energySheets, rectSheets] = await Promise.all([
        costingApi.getSheets({ clientName: cleanName || clientName.trim() }).catch(() => []),
        costingApi.airAudit.getSheets(cleanName || clientName.trim()).catch(() => []),
        costingApi.energyAudit.getSheets(cleanName || clientName.trim()).catch(() => []),
        costingApi.airAuditRectification.getSheets(cleanName || clientName.trim()).catch(() => []),
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
        finalQuote: Number(s.finalQuote || 0),
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
        finalQuote: Number(s.finalQuote || 0),
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
        finalQuote: Number(s.finalQuote || 0),
      }));

      const combined = [...generalSheets, ...formattedAir, ...formattedEnergy, ...formattedRect];

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
    if (selectedCostingSheetId) {
      const found = clientCostingSheets.find(
        (s) => s.id === selectedCostingSheetId || s._id === selectedCostingSheetId
      );
      if (found) return found;
    }

    const currentSub = (selectedSubServiceOptions[0] || '').toLowerCase().trim();
    if (!currentSub) return null;

    // 1. BMS / Building Management
    if (currentSub.includes('bms') || currentSub.includes('building management')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('bms') || sub.includes('building management');
        }) || null
      );
    }

    // 2. Air / Compressor Leakage Rectification
    if (currentSub.includes('rectification')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('rectification');
        }) || null
      );
    }

    // 3. Flowmeter
    if (currentSub.includes('flowmeter')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('flowmeter');
        }) || null
      );
    }

    // 4. Nitrogen Gas Leakage Audit
    if (currentSub.includes('nitrogen')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('nitrogen');
        }) || null
      );
    }

    // 5. Mixture Gas Leakage Audit
    if (currentSub.includes('mixture')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('mixture');
        }) || null
      );
    }

    // 6. Compressor Air Leakage Audit / Air Audit (strictly not rectification)
    if (
      (currentSub.includes('air audit') || currentSub.includes('compressor air leakage') || currentSub.includes('leakage audit')) &&
      !currentSub.includes('rectification') &&
      !currentSub.includes('nitrogen') &&
      !currentSub.includes('mixture')
    ) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return (
            (sub.includes('air audit') || sub.includes('compressor air leakage') || sub.includes('leakage audit')) &&
            !sub.includes('rectification') &&
            !sub.includes('nitrogen') &&
            !sub.includes('mixture')
          );
        }) || null
      );
    }

    // 7. Energy Audit (Standard)
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

    // 8. EMS / Energy Management Solution
    if (currentSub.includes('energy management') || currentSub.includes('ems')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('energy management') || sub.includes('ems');
        }) || null
      );
    }

    // 9. Welding IoT
    if (currentSub.includes('welding')) {
      return (
        clientCostingSheets.find((s) => {
          const sub = (s.subService || '').toLowerCase().trim();
          return sub.includes('welding') || Boolean((s as any).isWeldingIot);
        }) || null
      );
    }

    // 10. Exact match fallback for other specific subServices
    const exactMatch = clientCostingSheets.find(
      (s) => (s.subService || '').toLowerCase().trim() === currentSub
    );
    if (exactMatch) return exactMatch;

    return null;
  }, [clientCostingSheets, selectedCostingSheetId, selectedSubServiceOptions]);

  // When activeCostingSheet is explicitly selected or changes, align categories and subServices
  useEffect(() => {
    if (selectedCostingSheetId && activeCostingSheet && !editQuoteId) {
      if (activeCostingSheet.serviceCategory && (!selectedCategories || selectedCategories.length === 0)) {
        setSelectedCategories([activeCostingSheet.serviceCategory]);
      }
      if (activeCostingSheet.subService && (!selectedSubServiceOptions || selectedSubServiceOptions.length === 0)) {
        setSelectedSubServiceOptions([activeCostingSheet.subService]);
      }
    }
  }, [selectedCostingSheetId, activeCostingSheet, editQuoteId]);

  const isWeldingIot = React.useMemo(() => {
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
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isEms = React.useMemo(() => {
    if (isWeldingIot) return false;
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
          s.includes('smart factory')
      ) ||
      Boolean((activeCostingSheet as any)?.isEms) ||
      Boolean((activeCostingSheet as any)?.emsGatewayHardwareRows?.length > 0) ||
      Boolean((activeCostingSheet as any)?.emsHardwareRows?.length > 0)
    );
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet, isWeldingIot]);

  const isIotControls = React.useMemo(() => {
    if (isWeldingIot || isEms) return false;
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
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet, isWeldingIot, isEms]);

  const isIotOrControls = isWeldingIot || isIotControls || isEms;

  const isBms = React.useMemo(() => {
    const combined = [
      ...selectedCategories,
      ...selectedSubServiceOptions,
      activeCostingSheet?.serviceCategory || '',
      activeCostingSheet?.subService || '',
    ].map((s) => s.toLowerCase());
    return combined.some((s) => s.includes('bms') || s.includes('building management'));
  }, [selectedCategories, selectedSubServiceOptions, activeCostingSheet]);

  const isEnergyAudit = React.useMemo(() => {
    const cat = (selectedCategories[0] || '').toLowerCase();
    return cat.includes('audit') || cat === 'energy audit services';
  }, [selectedCategories]);

  // Auto-switch default texts when BMS or EMS/IoT mode changes
  useEffect(() => {
    if (isBms) {
      setEmsStep5Text(DEFAULT_BMS_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_BMS_STEP6_TEXT);
    } else if (isIotOrControls) {
      setEmsStep5Text(DEFAULT_EMS_STEP5_TEXT);
      setEmsStep6Text(DEFAULT_EMS_STEP6_TEXT);
    }
  }, [isBms, isIotOrControls]);

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
      id: 'iot-1a',
      section: '1. Gateway & Hardware Engineering Scope',
      stepNo: '1a',
      description: 'Supply of 4G IoT Gateway for Communication with SIM card, SMPS & Antenna - Edge Pro',
      qty: 1,
      uom: 'Nos',
      customerPrice: 20200,
    },
    {
      id: 'iot-1b',
      section: '1. Gateway & Hardware Engineering Scope',
      stepNo: '1b',
      description: 'Supply of RS485 energy meter with communication and wiring accessories',
      qty: 1,
      uom: 'Nos',
      customerPrice: 15600,
    },
    {
      id: 'iot-2a',
      section: '2. Electrical Sensors & Metering Scope',
      stepNo: '2a',
      description: 'Supply of 2 core RS 485 Shielded cable for IoT Gateway communication',
      qty: 1,
      uom: 'Coil',
      customerPrice: 7300,
    },
    {
      id: 'iot-2b',
      section: '2. Electrical Sensors & Metering Scope',
      stepNo: '2b',
      description: 'Supply of 1" conduit pipes',
      qty: 1,
      uom: 'Nos',
      customerPrice: 100,
    },
    {
      id: 'iot-2c',
      section: '2. Electrical Sensors & Metering Scope',
      stepNo: '2c',
      description: 'Supply of electrical consumables such as flexible hose, cable ties and all other accessories',
      qty: 1,
      uom: 'Job',
      customerPrice: 5500,
    },
    {
      id: 'iot-2',
      section: '3. Installation, Cabling & Commissioning Scope',
      stepNo: '2',
      description:
        'Installation and commissioning of IoT devices, gateways, modems, and associated electrical/control components including startup, testing, and functional verification. Communication cable laying and routing through conduits, cable trays, and raceways with proper dressing, tagging, and termination. Conduit pipe laying for electrical and communication cabling as per site layout. Modem configuration, network setup, data mapping, testing, troubleshooting, and data validation',
      qty: 1,
      uom: 'Nodes',
      customerPrice: 40300,
    },
    {
      id: 'iot-3',
      section: '4. Platform Configuration & System Integration Scope',
      stepNo: '3',
      description:
        'IoT device configuration, protocol setup (Modbus, BACnet, MQTT), and integration with BMS/EMS platforms Network connectivity, dashboard mapping, alarm configuration, and cloud/server integration support System commissioning including startup, functional testing, calibration, and performance verification Troubleshooting, integration testing, client demonstration, and final handover support Electrical power/control cable laying, routing, termination, tagging, and insulation testing as per standard',
      qty: 1,
      uom: 'Nodes',
      customerPrice: 1400,
    },
    {
      id: 'iot-rec-1a',
      section: '5. Cloud, SLA & Recurring Annual Subscriptions Scope',
      stepNo: '1a',
      description: 'Recurring Charges for GSM-GPRS communication enabled IoT SIM Card and valid for one year period.',
      qty: 1,
      uom: 'Nos',
      customerPrice: 2700,
      isRecurring: true,
    },
    {
      id: 'iot-rec-1b',
      section: '5. Cloud, SLA & Recurring Annual Subscriptions Scope',
      stepNo: '1b',
      description:
        'OptiByte Dashboard, Intelligent reporting, Group and machine level reporting, Email on any threshold value breach, Alert on Mobile(via SMS), Auto detection of anomalies, water flow rate, water capacity. We will check with the pH and TDS meter, if we can integrate it with our dashboard',
      qty: 1,
      uom: 'Nodes',
      customerPrice: 1800,
      isRecurring: true,
    },
  ]);

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

      if (isWeldingIot) {
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
            description: `${r.item || 'Software Development'}: ${r.description || ''}`,
            qty: 1,
            uom: r.uom || 'per kit',
            customerPrice: resolvePrice(r, Number(r.price || 20000)),
          });
        });

        const instRows =
          sheetAny?.weldingInstallationRows && sheetAny.weldingInstallationRows.length > 0
            ? sheetAny.weldingInstallationRows
            : INITIAL_WELDING_INSTALLATION_ROWS;

        instRows.forEach((r: any, idx: number) => {
          extracted.push({
            id: `wi-${idx}`,
            section: '3. Installation & Commissioning Scope',
            stepNo: `${idx + 1}`,
            description: r.item || 'Installation and Commissioning',
            qty: 1,
            uom: r.uom || 'per kit',
            customerPrice: resolvePrice(r, Number(r.price || 15000)),
          });
        });

        const clRows =
          sheetAny?.weldingCloudRows && sheetAny.weldingCloudRows.length > 0
            ? sheetAny.weldingCloudRows
            : INITIAL_WELDING_CLOUD_ROWS;

        clRows.forEach((r: any, idx: number) => {
          extracted.push({
            id: `wc-${idx}`,
            section: '4. Cloud Infrastructure & Recurring Subscriptions Scope',
            stepNo: `${idx + 1}`,
            description: `${r.component || 'Cloud Service'} (${r.type || ''}): ${r.description || ''}`,
            qty: 1,
            uom: 'Year',
            customerPrice: resolvePrice(r, Number(r.yearlyPrice || (r.monthlyPrice ? r.monthlyPrice * 12 : 12000))),
            isRecurring: true,
          });
        });

        setIotStep5Rows(extracted);
      } else if (isIotControls) {
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

        hwRows.forEach((r: any, idx: number) => {
          extracted.push({
            id: `ich-${idx}`,
            section: '1. IoT Hardware & Control Panel Scope',
            stepNo: r.slNo || `${idx + 1}`,
            description: r.productDescription || r.itemDescription || 'Hardware Control Component',
            qty: Number(r.quantity || r.qty || 1),
            uom: 'Nos',
            customerPrice: resolvePrice(r, Math.round(Number(r.unitPrice || 5000) * Number(r.quantity || 1))),
          });
        });

        const mdRows =
          sheetAny?.iotControlsMandaysRows && sheetAny.iotControlsMandaysRows.length > 0
            ? sheetAny.iotControlsMandaysRows
            : INITIAL_IOT_CONTROLS_MANDAYS_ROWS;

        mdRows.forEach((r: any, idx: number) => {
          extracted.push({
            id: `icm-${idx}`,
            section: '2. Engineering & Commissioning Mandays Scope',
            stepNo: `${idx + 1}`,
            description: `${r.designation || 'Specialist'}: ${r.description || ''}`,
            qty: Number(r.mandays || 1),
            uom: 'Mandays',
            customerPrice: resolvePrice(r, Number(r.totalCost || (r.ratePerDay ? r.ratePerDay * r.mandays : 25000))),
          });
        });

        const opRows =
          sheetAny?.iotControlsOpexRows && sheetAny.iotControlsOpexRows.length > 0
            ? sheetAny.iotControlsOpexRows
            : INITIAL_IOT_CONTROLS_OPEX_ROWS;

        opRows.forEach((r: any, idx: number) => {
          extracted.push({
            id: `ico-${idx}`,
            section: '3. Annual Maintenance & Cloud OPEX Scope',
            stepNo: `${idx + 1}`,
            description: `${r.item || 'OPEX Support'}: ${r.description || ''}`,
            qty: 1,
            uom: 'Year',
            customerPrice: resolvePrice(r, Number(r.yearlyPrice || 12000)),
            isRecurring: true,
          });
        });

        setIotStep5Rows(extracted);
      } else if (isEms) {
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

        let stepNum = 1;
        if (sheetAny.emsGatewayHardwareRows && sheetAny.emsGatewayHardwareRows.length > 0) {
          sheetAny.emsGatewayHardwareRows.forEach((r: any, idx: number) => {
            extracted.push({
              id: `gw-${idx}`,
              section: '1. Gateway & Hardware Engineering Scope',
              stepNo: r.stepNo || `1${String.fromCharCode(97 + idx)}`,
              description: r.itemDescription || r.description || 'Hardware Gateway Unit Scope',
              qty: Number(r.qty) || 1,
              uom: r.uom || 'Nos',
              customerPrice: resolvePrice(r, idx === 0 ? 20200 : 15600),
            });
          });
        }
        if (sheetAny.emsElectricalHardwareRows && sheetAny.emsElectricalHardwareRows.length > 0) {
          sheetAny.emsElectricalHardwareRows.forEach((r: any, idx: number) => {
            extracted.push({
              id: `ehw-${idx}`,
              section: '2. Electrical Sensors & Metering Scope',
              stepNo: r.stepNo || `2${String.fromCharCode(97 + idx)}`,
              description: r.itemDescription || r.description || 'Electrical Metering Scope',
              qty: Number(r.qty) || 1,
              uom: r.uom || 'Nos',
              customerPrice: resolvePrice(r, idx === 0 ? 7300 : idx === 1 ? 100 : 5500),
            });
          });
        }
        if (extracted.length === 0 && sheetAny.emsHardwareRows && sheetAny.emsHardwareRows.length > 0) {
          sheetAny.emsHardwareRows.forEach((r: any, idx: number) => {
            extracted.push({
              id: `hw-${idx}`,
              section: '1. Hardware & Gateway Scope',
              stepNo: r.stepNo || `${stepNum++}`,
              description: r.itemDescription || r.description || 'Hardware Unit Scope',
              qty: Number(r.qty) || 1,
              uom: r.uom || 'Nos',
              customerPrice: resolvePrice(r, idx === 0 ? 20200 : idx === 1 ? 15600 : 7300),
            });
          });
        }
        if (sheetAny.emsManpowerRows && sheetAny.emsManpowerRows.length > 0) {
          sheetAny.emsManpowerRows.forEach((r: any, idx: number) => {
            extracted.push({
              id: `mp-${idx}`,
              section: '3. Installation, Cabling & Commissioning Scope',
              stepNo: '2',
              description: r.description || r.itemDescription || 'Installation, Cabling & Commissioning of IoT Devices',
              qty: Number(r.qty) || 1,
              uom: r.uom || 'Nodes',
              customerPrice: resolvePrice(r, 40300),
            });
          });
        }
        if (sheetAny.emsPlatformRows && sheetAny.emsPlatformRows.length > 0) {
          sheetAny.emsPlatformRows.forEach((r: any, idx: number) => {
            extracted.push({
              id: `pf-${idx}`,
              section: '4. Platform Configuration & System Integration Scope',
              stepNo: r.stepNo || '3',
              description: r.itemDescription || r.description || r.scope || 'Platform Configuration & BMS/EMS Integration Scope',
              qty: Number(r.qty) || 1,
              uom: r.uom || 'Nodes',
              customerPrice: resolvePrice(r, 1400),
            });
          });
        }
        if (sheetAny.emsRecurringRows && sheetAny.emsRecurringRows.length > 0) {
          sheetAny.emsRecurringRows.forEach((r: any, idx: number) => {
            extracted.push({
              id: `rec-${idx}`,
              section: '5. Cloud, SLA & Recurring Annual Subscriptions Scope',
              stepNo: r.stepNo || `1${String.fromCharCode(97 + idx)}`,
              description: r.itemDescription || r.description || 'Recurring Cloud & Support Scope',
              qty: Number(r.qty) || 1,
              uom: r.uom || 'Year',
              customerPrice: resolvePrice(r, idx === 0 ? 2700 : 1800),
              isRecurring: true,
            });
          });
        }

        const sumExtracted = extracted.reduce((s, item) => s + item.customerPrice, 0);
        if (extracted.length > 0 && sumExtracted > 0) {
          setIotStep5Rows(extracted);
        }
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
  }, [activeCostingSheet, isIotOrControls, isWeldingIot, isIotControls, isEms, editQuoteId, manpowerRates]);

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

  const finalQuote =
    activeCostingSheet?.finalQuote !== undefined && activeCostingSheet?.finalQuote !== null
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

      const selectedCategory = selectedCategories[0] || 'Energy Audit Services';
      const selectedSubService = selectedSubServiceOptions[0] || 'Air Audit';

      const computedFinalQuote = isIotOrControls
        ? (activeCostingSheet?.finalQuote ? Number(activeCostingSheet.finalQuote) : iotTotalPrice || finalQuote)
        : (activeCostingSheet?.finalQuote ? Number(activeCostingSheet.finalQuote) : finalQuote);

      const lineItems = isIotOrControls && iotStep5Rows.length > 0
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
                    onChange={(e) => setProposalNumber(e.target.value)}
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-indigo-400 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-between transition-colors"
                    >
                      <span className={clientName ? 'font-bold text-slate-900' : 'text-slate-400'}>
                        {clientName || '-- Search or Select a Client --'}
                      </span>
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
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
                            filteredClientOptions.map((c, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setClientName(c.name);
                                  setIsClientDropdownOpen(false);
                                  setClientSearchQuery('');
                                }}
                                className={`w-full text-left px-3.5 py-2.5 hover:bg-indigo-50 transition-colors flex items-center justify-between ${
                                  clientName === c.name ? 'bg-indigo-50/80 font-bold text-indigo-700' : 'text-slate-800'
                                }`}
                              >
                                <span>{c.name}</span>
                                {clientName === c.name && <Check className="h-3.5 w-3.5 text-indigo-600" />}
                              </button>
                            ))
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
                              setSelectedSubServiceOptions(['Air Audit']);
                            } else if (cat === 'IoT & Controls') {
                              setSelectedSubServiceOptions(['Energy Management Solution']);
                            } else if (cat === 'Welding IoT') {
                              setSelectedSubServiceOptions(['Welding IoT & Kit']);
                            } else if (cat === 'Hardware') {
                              setSelectedSubServiceOptions(['Hardware Installation']);
                            } else if (cat === 'Custom') {
                              setSelectedSubServiceOptions(['Custom']);
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

            {/* Saved Costing Sheets Available for Chosen Client */}
            {clientCostingSheets.length > 0 && (
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    Saved Costing Sheets for {clientName} ({clientCostingSheets.length} Found):
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                    Click to load into Step 4
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {clientCostingSheets.map((sheet: any) => {
                    const isSelected = activeCostingSheet?.id === sheet.id || activeCostingSheet?._id === sheet._id;
                    return (
                      <button
                        key={sheet.id || sheet._id}
                        type="button"
                        onClick={() => {
                          setSelectedCostingSheetId(sheet.id || sheet._id);
                          if (sheet.serviceCategory) setSelectedCategories([sheet.serviceCategory]);
                          if (sheet.subService) setSelectedSubServiceOptions([sheet.subService]);
                          toast.success(`Loaded oriented costing for ${sheet.subService || sheet.serviceCategory}!`);
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
                          ₹{(sheet.finalQuote || 0).toLocaleString('en-IN')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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
                      value={aboutSustainabyteText}
                      onChange={(e) => setAboutSustainabyteText(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Type or edit About Sustainabyte overview text..."
                    />
                  </div>
                ) : (
                  <div className="space-y-3.5 text-xs text-slate-800 leading-relaxed font-normal">
                    {aboutSustainabyteText
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

            {/* Step 3: Scope of Assessment (Assets & Oriented Scopes - Shown ONLY for Energy Audit Services) */}
            {isEnergyAudit && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-600" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Step 3: Scope of Assessment (Assets &amp; Oriented Scopes)</h3>
                      <p className="text-xs text-slate-500">View and customize oriented assessment scopes for selected asset categories</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full shrink-0">
                    {selectedAssetIds.length} Assets Selected
                  </span>
                </div>

                {/* Selected Assets & Oriented Assessment Scopes Accordion */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Oriented Scope of Assessment Details ({selectedAssetIds.length} Active Assets)
                  </label>

                  {selectedAssetIds.length === 0 ? (
                    <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                      No assets selected. Select asset categories from Step 1 above to view and include oriented scope of work.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedAssetIds.map((aId) => {
                        const asset = ASSESSMENT_ASSETS.find((a) => a.id === aId);
                        if (!asset) return null;
                        const isExpanded = expandedAssetId === asset.id;

                        return (
                          <div key={asset.id} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                            <div
                              onClick={() => setExpandedAssetId(isExpanded ? null : asset.id)}
                              className="px-4 py-3 bg-white flex items-center justify-between cursor-pointer hover:bg-indigo-50/50 transition-colors border-b border-slate-100"
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-indigo-600" />
                                <h4 className="text-xs font-bold text-slate-900">{asset.name}</h4>
                                <span className="text-[10px] font-semibold text-slate-400">({asset.scopes.length} scope items)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedAssetIds(selectedAssetIds.filter((id) => id !== asset.id));
                                  }}
                                  className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold px-2 py-0.5 hover:bg-rose-50 rounded"
                                >
                                  Remove Asset
                                </button>
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4 text-slate-400" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-slate-400" />
                                )}
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="p-4 bg-slate-50/70 space-y-2 text-xs">
                                <p className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider mb-2">
                                  Oriented Assessment Scopes:
                                </p>
                                <ul className="space-y-2 pl-2">
                                  {asset.scopes.map((scope, sIdx) => (
                                    <li key={sIdx} className="flex items-start gap-2 text-slate-800 font-medium">
                                      <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                                      <span>{scope}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Solution Architecture (Visible for IoT & Controls Scope) */}
            {isIotOrControls && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-indigo-600" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Step 3: Solution Architecture — IoT &amp; Controls Platform</h3>
                      <p className="text-xs text-slate-500">Comprehensive edge-to-cloud IoT topology, sensors, OptiLink gateway &amp; analytics dashboard</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full shrink-0">
                    Architecture Blueprint
                  </span>
                </div>

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
              </div>
            )}

          {/* Step 4: Commercial Breakdown (IoT Step 5 & Air Audit Costing Sync) - Only shown when costing sheet is merged */}
          {activeCostingSheet && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-indigo-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Step 4: Commercial Breakdown — {selectedCategories.join(', ')} / {selectedSubServiceOptions.join(', ')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isIotOrControls
                        ? 'Itemized Step 5 Commercial Breakdown for IoT & Controls Scope'
                        : 'Live Costing Sync & Parameter Matrix for Energy Audit Scope'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Costing Sheet Synced
                </span>
              </div>

              {/* If IoT and Controls: Show Step 5 Itemized Table with Section Headings */}
              {isIotOrControls ? (
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
                  <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Live Costing Sheet Synced
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {activeCostingSheet.serviceCategory || 'Energy Audit Services'}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 mt-1.5">
                        {activeCostingSheet.clientName} — {activeCostingSheet.subService || 'Air Audit'}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        Site Days: <strong className="text-slate-800">{activeCostingSheet.siteWorkingDays || siteDays}</strong> • Report Days: <strong className="text-slate-800">{activeCostingSheet.reportWorkingDays || reportDays}</strong> • Margin: <strong className="text-indigo-700">{activeCostingSheet.marginPct || marginPct}%</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-3.5 px-5 rounded-xl border border-emerald-200/80 shadow-xs">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Sustainabyte Cost</span>
                        <span className="text-sm font-bold text-slate-800">
                          ₹{Number(activeCostingSheet.subtotalCost || subtotal).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="h-8 w-px bg-slate-200" />
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-emerald-600 block">Final Calculated Quote</span>
                        <span className="text-lg sm:text-xl font-black text-emerald-700">
                          ₹{Number(activeCostingSheet.finalQuote || finalQuote).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Synced Costing Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Manpower Cost</span>
                      <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                        ₹{Number(activeCostingSheet.manpowerCost || activeCostingSheet.totalManpowerCost || manpowerCost).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Instrument Rental</span>
                      <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                        ₹{Number(activeCostingSheet.instrumentCost || activeCostingSheet.totalInstrumentCost || instrumentCost).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Food & Travel</span>
                      <p className="font-extrabold text-slate-800 text-sm mt-0.5">
                        ₹{Number(activeCostingSheet.totalExtraCost !== undefined ? activeCostingSheet.totalExtraCost : effectiveFoodTravelCost).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <span className="text-indigo-600 block text-[10px] uppercase font-bold">Margin ({activeCostingSheet.marginPct || marginPct}%)</span>
                      <p className="font-extrabold text-indigo-700 text-sm mt-0.5">
                        +₹{Number(activeCostingSheet.marginAmount || marginAmount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

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
          {(isIotOrControls || isBms) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm">
                    {isBms
                      ? 'Step 5: Key Issues Identified, Assessment Activities & Expected Outcome — Building Management System (BMS)'
                      : 'Step 5: Scope of Work & Platform Benefits — Energy Management Solution'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBms
                      ? 'Key Issues, Proposed Assessment Activities & Expected Outcome Roadmap'
                      : '4-Phase Roadmap, Platform Value & EMS Key Benefits'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmsStep5Text(isBms ? DEFAULT_BMS_STEP5_TEXT : DEFAULT_EMS_STEP5_TEXT);
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
                    value={emsStep5Text}
                    onChange={(e) => setEmsStep5Text(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Type or edit Scope of Work and Assessment text..."
                  />
                </div>
              ) : (
                <div className="space-y-4 text-xs text-slate-950 leading-relaxed font-normal">
                  {emsStep5Text
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
                              trimmed.startsWith('Scope of Work:') ||
                              trimmed.startsWith('Phase ') ||
                              trimmed.startsWith('Potential benefits') ||
                              trimmed.startsWith('Benefits of Energy') ||
                              trimmed.startsWith('In the “current proposal');
                            const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('·');
                            const isNumbered = /^\d+\./.test(trimmed);

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

          {/* Step 6: Notes, Client Support & Terms and Conditions (Editable, Row-Wise, Black Text) */}
          {(isIotOrControls || isBms) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-950 text-sm">
                    {isBms
                      ? 'Step 6: Payment Terms & Conditions — Building Management System (BMS)'
                      : 'Step 6: Notes, Client Support & Terms and Conditions'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBms
                      ? 'Milestone-Wise Payment Schedule, Invoicing & Site Coordination Terms'
                      : 'Scope Inclusions, Client Deliverables & Commercial Clauses'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmsStep6Text(isBms ? DEFAULT_BMS_STEP6_TEXT : DEFAULT_EMS_STEP6_TEXT);
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
                    value={emsStep6Text}
                    onChange={(e) => setEmsStep6Text(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-slate-500"
                    placeholder="Type or edit Payment Terms, Notes, Client Support, Terms and Conditions..."
                  />
                </div>
              ) : (
                <div className="space-y-4 text-xs text-slate-950 leading-relaxed font-normal">
                  {emsStep6Text
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
                      {step7SubmittedBy.split('\n').map((line, idx) => (
                        <p key={idx} className={idx === 0 ? 'font-black text-slate-950 text-sm' : idx === 1 ? 'font-bold text-slate-900' : 'text-slate-800 font-medium'}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Bank Account Details */}
                  <div className="pt-2 border-t border-slate-200 space-y-1 text-xs text-slate-950">
                    {step7BankDetails.split('\n').map((line, idx) => (
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

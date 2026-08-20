import {
  EmsHardwareRow,
  EmsPlatformRow,
  EmsRecurringRow,
  IotControlsHardwareRow,
  IotControlsMandaysRow,
  IotControlsOpexRow,
  IotControlsRoiState,
  IotControlsTravelRow,
  ManpowerRow,
  PresetTeamMember,
  WeldingCloudRow,
  WeldingHardwareRow,
  WeldingInstallationRow,
  WeldingSoftwareRow,
} from './types';

export const DEFAULT_CLIENT_OPTIONS = [
  'Apollo Tyres Ltd',
  'Vishnu Cars',
  'ABT Maruti',
  'Adam Compressors',
  'Aisan Auto Parts',
  'Alstom Transport',
  'Arun Plasto',
  'Ashveera Elgi Dealer',
  'Bharat Forge',
  'Blue Star Climatech',
  'Bull Machines India',
  'Century Panels',
  'Cholayil Private Ltd',
  'Chloride Metals Limited',
  'Coburg Engineering',
  'Danfoss Industries Ltd',
  'Denali India',
  'Hyundai Motor India',
  'Saint-Gobain Glass',
  'TVS Motor Company',
];

export const PRESET_TEAM_MEMBERS: PresetTeamMember[] = [
  {
    name: 'Gowtham',
    roleLevel: 'SENIOR_ENERGY',
    roleTitle: 'Senior Energy Engineer',
    siteWorkCost: 6000,
    reportWorkCost: 4200,
    foodRatePerDay: 600,
  },
  {
    name: 'Vijayan',
    roleLevel: 'SENIOR_ENERGY',
    roleTitle: 'Senior Energy Engineer',
    siteWorkCost: 6000,
    reportWorkCost: 4200,
    foodRatePerDay: 600,
  },
  {
    name: 'Pradeep',
    roleLevel: 'JUNIOR_ENERGY',
    roleTitle: 'Junior Energy Engineer',
    siteWorkCost: 3000,
    reportWorkCost: 2300,
    foodRatePerDay: 400,
  },
  {
    name: 'Karthikeyan',
    roleLevel: 'JUNIOR_ENERGY',
    roleTitle: 'Junior Energy Engineer',
    siteWorkCost: 3000,
    reportWorkCost: 2300,
    foodRatePerDay: 400,
  },
  {
    name: 'Jowshva',
    roleLevel: 'IOT_ENGINEER',
    roleTitle: 'IoT Engineer',
    siteWorkCost: 3500,
    reportWorkCost: 2500,
    foodRatePerDay: 400,
  },
  {
    name: 'Raja Prabakar',
    roleLevel: 'IOT_ENGINEER',
    roleTitle: 'IoT Engineer',
    siteWorkCost: 3500,
    reportWorkCost: 2500,
    foodRatePerDay: 400,
  },
  {
    name: 'Vignesh Babu',
    roleLevel: 'TRAINEE_ENERGY',
    roleTitle: 'Trainee Energy Engineer',
    siteWorkCost: 2000,
    reportWorkCost: 1500,
    foodRatePerDay: 300,
  },
  {
    name: 'Yedunath',
    roleLevel: 'IOT_ENGINEER',
    roleTitle: 'IoT Configuration Specialist',
    siteWorkCost: 4000,
    reportWorkCost: 2500,
    foodRatePerDay: 500,
  },
  {
    name: 'Sub contract',
    roleLevel: 'IOT_ENGINEER',
    roleTitle: 'Sub contract Cable Specialist',
    siteWorkCost: 3500,
    reportWorkCost: 2500,
    foodRatePerDay: 500,
  },
];

export const STANDARD_INSTRUMENT_CATALOG = [
  { name: 'Power Logger', rentalCost: 3500 },
  { name: 'Ultrasonic flow meter', rentalCost: 7000 },
  { name: 'Aquastic Ultrasonic leakage detector', rentalCost: 4000 },
  { name: 'Air Flow Meter', rentalCost: 4500 },
  { name: 'Thermal Camera', rentalCost: 1000 },
  { name: 'Digital Clamp Meter', rentalCost: 1000 },
  { name: 'Earth Meggar', rentalCost: 1000 },
  { name: 'Lux Meter', rentalCost: 500 },
  { name: 'Thermometer', rentalCost: 500 },
  { name: 'Temperature data logger', rentalCost: 500 },
  { name: 'Anemometer', rentalCost: 500 },
  { name: 'Differential Manometer', rentalCost: 1000 },
  { name: 'Flue Gas analyser', rentalCost: 5000 },
  { name: 'Others / Custom Instrument', rentalCost: 1000 },
];

export const INITIAL_EMS_GATEWAY_HARDWARE_ROWS: EmsHardwareRow[] = [
  {
    id: 'ems_h1a',
    code: '1a',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    description: 'Supply of 4G IoT Gateway for Communication with SIM card, SMPS & Antenna - Edge Pro',
    qty: 1,
    uom: 'Nos',
    unitCost: 11000,
    marginPct: 40,
  },
  {
    id: 'ems_h1b',
    code: '1b',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    description: 'Supply of RS485 energy meter with communication and wiring accessories',
    qty: 1,
    uom: 'Nos',
    unitCost: 8500,
    marginPct: 40,
  },
];

export const INITIAL_EMS_ELECTRICAL_HARDWARE_ROWS: EmsHardwareRow[] = [
  {
    id: 'ems_h2a',
    code: '2a',
    category: 'Electrical Hardware',
    description: 'Supply of 2 core RS 485 Shielded cable for IoT Gateway communication',
    qty: 1,
    uom: 'Coil',
    unitCost: 4000,
    marginPct: 40,
  },
  {
    id: 'ems_h2b',
    code: '2b',
    category: 'Electrical Hardware',
    description: 'Supply of 1" conduit pipes',
    qty: 1,
    uom: 'Nos',
    unitCost: 70,
    marginPct: 40,
  },
  {
    id: 'ems_h2c',
    code: '2c',
    category: 'Electrical Hardware',
    description: 'Supply of electrical consumables such as flexible hose, cable ties and all other accessories',
    qty: 1,
    uom: 'Job',
    unitCost: 3000,
    marginPct: 40,
  },
];

export const INITIAL_EMS_MANPOWER_ROWS: ManpowerRow[] = [
  {
    id: 'ems_m1',
    name: 'Gowtham',
    roleLevel: 'SENIOR_ENERGY',
    foodRatePerDay: 600,
    siteWorkCost: 6000,
    reportWorkCost: 4200,
    siteWorkingDays: 0,
    reportWorkingDays: 1,
  },
  {
    id: 'ems_m2',
    name: 'Pradeep',
    roleLevel: 'JUNIOR_ENERGY',
    foodRatePerDay: 400,
    siteWorkCost: 3000,
    reportWorkCost: 2300,
    siteWorkingDays: 2,
    reportWorkingDays: 0,
  },
  {
    id: 'ems_m3',
    name: 'Karthikeyan',
    roleLevel: 'JUNIOR_ENERGY',
    foodRatePerDay: 400,
    siteWorkCost: 3000,
    reportWorkCost: 2300,
    siteWorkingDays: 2,
    reportWorkingDays: 0,
  },
];

export const INITIAL_EMS_PLATFORM_ROWS: EmsPlatformRow[] = [
  {
    id: 'ems_p1',
    description:
      'IoT device configuration, protocol setup (Modbus, BACnet, MQTT), and integration with BMS/EMS platforms\nNetwork connectivity, dashboard mapping, alarm configuration, and cloud/server integration support\nSystem commissioning including startup, functional testing, calibration, and performance verification\nTroubleshooting, integration testing, client demonstration, and final handover support\nElectrical power/control cable laying, routing, termination, tagging, and insulation testing as per standard',
    qty: 1,
    uom: 'Nodes',
    unitCost: 750,
    marginPct: 40,
  },
];

export const INITIAL_EMS_RECURRING_ROWS: EmsRecurringRow[] = [
  {
    id: 'ems_r1',
    code: '1a',
    description: 'Recurring Charges for GSM-GPRS communication enabled IoT SIM Card and valid for one year period.',
    qty: 1,
    uom: 'Nos',
    unitCostPerMonth: 125,
    marginPct: 40,
  },
  {
    id: 'ems_r2',
    code: '1b',
    description:
      'OptiByte Dashboard, Intelligent reporting, Group and machine level reporting, Email on any threshold value breach, Alert on Mobile(via SMS), Auto detection of anomalies, water flow rate, water capacity. We will check with the pH and TDS meter, if we can integrate it with our dashboard',
    qty: 1,
    uom: 'Nodes',
    unitCostPerMonth: 82,
    marginPct: 40,
  },
];

export const SERVICE_CATEGORY_OPTIONS = [
  'Energy Audit Services',
  'IoT & Controls',
  'Welding IoT',
  'Hardware',
  'Custom',
];

export const ENERGY_AUDIT_SUB_SERVICES = [
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

export const PROJECTS_SUB_SERVICES = [
  'Optibyte',
  'Digiweld',
  'Tec Byte',
  'Fix Byte',
  'Compass',
  'Custom Project',
];

export const IOT_SERVICES_SUB_SERVICES = [
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

export const WELDING_IOT_SUB_SERVICES = [
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

export const INITIAL_WELDING_HARDWARE_ROWS: WeldingHardwareRow[] = [
  { id: 'wh_1', slNo: 1, componentName: 'Microcontroller (Sim based) & components', qty: 1, unitCost: 4980, marginPct: 40, unitPrice: 8300 },
  { id: 'wh_2', slNo: 2, componentName: 'I²C GPIO Expander', qty: 1, unitCost: 600, marginPct: 40, unitPrice: 1000 },
  { id: 'wh_3', slNo: 3, componentName: 'Voltage sensor', qty: 1, unitCost: 4200, marginPct: 40, unitPrice: 7000 },
  { id: 'wh_4', slNo: 4, componentName: 'Current sensor', qty: 1, unitCost: 5400, marginPct: 40, unitPrice: 9000 },
  { id: 'wh_5', slNo: 5, componentName: 'Gas flow sensor', qty: 1, unitCost: 12000, marginPct: 40, unitPrice: 20000 },
  { id: 'wh_6', slNo: 6, componentName: 'RFID', qty: 1, unitCost: 900, marginPct: 40, unitPrice: 1500 },
  { id: 'wh_7', slNo: 7, componentName: 'OLED Display 2.4” I²C', qty: 1, unitCost: 480, marginPct: 40, unitPrice: 800 },
  { id: 'wh_8', slNo: 8, componentName: 'Keyboard Matrix', qty: 1, unitCost: 2400, marginPct: 40, unitPrice: 4000 },
  { id: 'wh_9', slNo: 9, componentName: 'USB Pendrive (8GB industrial grade)', qty: 1, unitCost: 360, marginPct: 40, unitPrice: 600 },
  { id: 'wh_10', slNo: 10, componentName: 'USB Host Shield', qty: 1, unitCost: 1440, marginPct: 40, unitPrice: 2400 },
  { id: 'wh_11', slNo: 11, componentName: 'DS3231 RTC Module', qty: 1, unitCost: 240, marginPct: 40, unitPrice: 400 },
  { id: 'wh_12', slNo: 12, componentName: 'SMPS 24V 3A Power Supply (Industrial)', qty: 1, unitCost: 1440, marginPct: 40, unitPrice: 2400 },
  { id: 'wh_13', slNo: 13, componentName: 'Industrial Grade Enclosure', qty: 1, unitCost: 2400, marginPct: 40, unitPrice: 4000 },
  { id: 'wh_14', slNo: 14, componentName: 'Miscellaneous Components', qty: 'As per Requirement', unitCost: 4800, marginPct: 40, unitPrice: 8000 },
  { id: 'wh_15', slNo: 15, componentName: 'Kit Development', qty: 1, unitCost: 18000, marginPct: 40, unitPrice: 30000 },
];

export const INITIAL_WELDING_SOFTWARE_ROWS: WeldingSoftwareRow[] = [
  {
    id: 'ws_1',
    item: 'Software Development',
    description:
      'UI/UX Design, Email generation, Logic addition (Travel speed, Heat input joint wise, Gas consumption joint wise, Weld deposition joint wise, Arc on time, Energy consumption, Machine calibration due date, Flow meter calibration due date) testing, debugging and further assistance',
    uom: 'per kit',
    price: 20000,
  },
];

export const INITIAL_WELDING_CLOUD_ROWS: WeldingCloudRow[] = [
  { id: 'wc_1', component: 'Cloud VM / MQTT Broker', description: '1 vCPU, 2 GB RAM, 50 GB storage', type: 'Azure B1s', monthlyCost: 600, marginPct: 40, monthlyPrice: 1000, yearlyPrice: 12000 },
  { id: 'wc_2', component: 'Database (PostgreSQL)', description: 'Up to 1GB for PoC, expandable', type: 'InfluxDB', monthlyCost: 180, marginPct: 40, monthlyPrice: 300, yearlyPrice: 3600 },
  { id: 'wc_3', component: 'Cloud Storage (Backups)', description: 'Daily logs, welding session history', type: '10GB', monthlyCost: 180, marginPct: 40, monthlyPrice: 300, yearlyPrice: 3600 },
  { id: 'wc_4', component: 'Subdomain / SSL', description: 'Subdomain naming for IP address', type: 'DNS + SSL', monthlyCost: 60, marginPct: 40, monthlyPrice: 100, yearlyPrice: 1200 },
  { id: 'wc_5', component: 'IoT Sim Card', description: 'To transmit data to cloud', type: 'Airtel', monthlyCost: 240, marginPct: 40, monthlyPrice: 400, yearlyPrice: 4800 },
];

export const INITIAL_WELDING_INSTALLATION_ROWS: WeldingInstallationRow[] = [
  {
    id: 'wi_1',
    item: 'Installation and Commissioning',
    qty: 1,
    uom: 'per kit',
    unitCost: 9000,
    marginPct: 40,
    unitPrice: 15000,
    price: 15000,
  },
];

export const HARDWARE_SUB_SERVICES = [
  'Hardware Costing',
  'IoT Controls Costing',
  'IoT Controls',
  'Hardware Installation',
  'Hardware Supply',
  'Custom',
];

export const INITIAL_IOT_CONTROLS_HARDWARE_ROWS: IotControlsHardwareRow[] = [
  { id: 'ich_1', slNo: '1a', productDescription: 'IR blaster', quantity: 15, unitPrice: 7500 },
  { id: 'ich_2', slNo: '1b', productDescription: 'Installation and commissioning', quantity: 15, unitPrice: 833.3333333333334 },
  { id: 'ich_3', slNo: '2a', productDescription: 'CT', quantity: 9, unitPrice: 2500 },
  { id: 'ich_4', slNo: '2b', productDescription: 'Energy Meter', quantity: 9, unitPrice: 8333.333333333334 },
  { id: 'ich_5', slNo: '2c', productDescription: 'Gateway lite', quantity: 3, unitPrice: 10000 },
  { id: 'ich_6', slNo: '2d', productDescription: 'Gateway pro', quantity: 1, unitPrice: 22000 },
  { id: 'ich_7', slNo: '2e', productDescription: 'Installation and commissioning (Cable Laying, Meter Configuration, Panel Fixing, CT connection, Gateway Configuration)', quantity: 9, unitPrice: 5000 },
  { id: 'ich_8', slNo: '3a', productDescription: 'Temperature sensor', quantity: 4, unitPrice: 4625 },
  { id: 'ich_9', slNo: '3b', productDescription: 'HVAC Controller', quantity: 4, unitPrice: 12500 },
  { id: 'ich_10', slNo: '3c', productDescription: 'Lighting Controller', quantity: 2, unitPrice: 12500 },
  { id: 'ich_11', slNo: '3d', productDescription: 'Control Panel Box(contactor,selecter switch,wiring, I/O Module)', quantity: 3, unitPrice: 15000 },
  { id: 'ich_12', slNo: '3e', productDescription: 'Installation and commisioing(Controll logic,cable laying,wiring)', quantity: 6, unitPrice: 3333.3333333333335 },
];

export const INITIAL_IOT_CONTROLS_MANDAYS_ROWS: IotControlsMandaysRow[] = [
  { id: 'icm_1', designation: 'Senior IoT Automation & Integration Engineer', mandays: 5, ratePerDay: 5000, totalCost: 25000, description: 'Gateway provisioning, cloud MQTT setup, controller logic & system commissioning' },
  { id: 'icm_2', designation: 'Field Commissioning Specialist', mandays: 8, ratePerDay: 3500, totalCost: 28000, description: 'Sensor integration, CT calibration, panel testing, and site validation' },
  { id: 'icm_3', designation: 'Certified Electrical Technician', mandays: 10, ratePerDay: 1800, totalCost: 18000, description: 'Cable routing, panel box mounting, termination & electrical wiring' },
];

export const INITIAL_IOT_CONTROLS_TRAVEL_ROWS: IotControlsTravelRow[] = [
  { id: 'ict_1', item: 'Intercity Travel & Train/Flight Tickets', qty: 2, rate: 6000, totalCost: 12000, remarks: 'Round trip travel for technical commissioning team' },
  { id: 'ict_2', item: 'Hotel Accommodation & Lodging (8 Nights)', qty: 8, rate: 2500, totalCost: 20000, remarks: 'Site stay for 2 engineers during installation & testing' },
  { id: 'ict_3', item: 'Daily Food & Boarding Allowance (DA)', qty: 10, rate: 800, totalCost: 8000, remarks: 'Per diem meal allowance for deployment engineers' },
  { id: 'ict_4', item: 'Local Site Conveyance & Tool Logistics', qty: 1, rate: 7500, totalCost: 7500, remarks: 'Local cabs, materials freight and equipment handling' },
];

export const INITIAL_IOT_CONTROLS_OPEX_ROWS: IotControlsOpexRow[] = [
  { id: 'ico_1', item: 'Cloud Platform & Analytical Services', yearlyPrice: 61500, description: 'Cloud infrastructure, analytics algorithms, alerting engine & automated reporting' },
];

export const INITIAL_IOT_CONTROLS_ROI_STATE: IotControlsRoiState = {
  annualEnergyCostBaseline: 1922084.8,
  energyInflationPct: 5.0,
  savingsPctY1: 11.0,
  savingsPctY2: 12.0,
  savingsPctY3: 12.5,
  savingsPctY4: 13.0,
  savingsPctY5: 13.5,
  acLoadingAssumption: 'The Annual Energy Cost has been calculated based on an assumed 40% AC loading, 12 hours of daily operation, and the Specific Energy Consumption (SEC) of the air conditioning systems',
  acSchedulingAssumption: 'The savings have been calculated based on AC scheduling and set-point optimization',
  opexAssumption: 'The operational expenditure (OPEX) includes cloud maintenance and data analytics costs to support continuous monitoring and ongoing energy savings improvements',
};

export interface SiteLocation {
  name: string;
  distanceKm: number;
}

export const DEFAULT_SITE_LOCATIONS: SiteLocation[] = [
  { name: 'Gestamp', distanceKm: 60 },
  { name: 'Danfoss', distanceKm: 60 },
  { name: 'SRM', distanceKm: 50 },
  { name: 'Wheels India (FAB)', distanceKm: 78 },
  { name: 'Wheels India', distanceKm: 64 },
  { name: 'Wheels India (EEPI)', distanceKm: 52 },
  { name: 'L&T Valves', distanceKm: 114 },
  { name: 'Lucas Tvs (Padi)', distanceKm: 76 },
  { name: 'Komter', distanceKm: 64 },
  { name: 'Kosmo One', distanceKm: 66 },
  { name: 'Featherlite', distanceKm: 25 },
  { name: 'Polyhose', distanceKm: 56 },
  { name: 'Kobelco', distanceKm: 200 },
  { name: 'PMEI (UNIT 3)', distanceKm: 56 },
  { name: 'PMEI (UNIT 4)', distanceKm: 32 },
  { name: 'Apollo Tyres', distanceKm: 56 },
];

export const SITE_DISTANCE_MAP: Record<string, number> = {
  'Gestamp': 60,
  'GE Stamp Oragadam': 60,
  'Danfoss': 60,
  'Danfoss Oragadam': 60,
  'SRM': 50,
  'SRM Kattankulathur': 50,
  'Wheels India (FAB)': 78,
  'Wheels India': 64,
  'Wheels India PVT Ltd': 64,
  'Wheels India (EEPI)': 52,
  'L&T Valves': 114,
  'Lucas Tvs (Padi)': 76,
  'TVS Lucas Padi': 76,
  'Komter': 64,
  'Kosmo One': 66,
  'Featherlite': 25,
  'Polyhose': 56,
  'Poly House Irungattukottai': 56,
  'Kobelco': 200,
  'Sri City-Kobalco': 200,
  'Sri City-blue star': 180,
  'Sri City-IMOP': 180,
  'PMEI (UNIT 3)': 56,
  'PMEL Oragadam': 56,
  'PMEI (UNIT 4)': 32,
  'Apollo Tyres': 56,
  'Apollo Tyres Oragadam': 56,
  'Tidel Park Pattabiram': 50,
  'Kone Oragadam': 60,
};

export const DEFAULT_SITE_OPTIONS = DEFAULT_SITE_LOCATIONS.map((s) => s.name);

export const getSiteDistanceKm = (siteName: string): number => {
  if (!siteName) return 0;
  if (SITE_DISTANCE_MAP[siteName] !== undefined) {
    return SITE_DISTANCE_MAP[siteName];
  }
  const lower = siteName.toLowerCase().trim();
  for (const [key, dist] of Object.entries(SITE_DISTANCE_MAP)) {
    if (lower === key.toLowerCase() || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return dist;
    }
  }
  return 0;
};

export const addCustomSiteDistance = (siteName: string, distanceKm: number) => {
  if (siteName) {
    SITE_DISTANCE_MAP[siteName] = distanceKm;
  }
};



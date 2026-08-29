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
  CpmHardwareRow,
  CpmOnPremiseRow,
  CpmCloudChargeRow,
} from './types';

export const DEFAULT_CLIENT_OPTIONS = [
  'KONE Elevator',
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

export const CLIENT_LOGOS_MAP: Record<string, string> = {
  'apollo tyres': '/logo/Apollo Tyres.png',
  'apollo tyres ltd': '/logo/Apollo Tyres.png',
  'casagrand': '/logo/Casagrand-Logo1.png',
  'chemech': '/logo/Chemech.gif',
  'denali': '/logo/DENALI_Full_Logo.avif',
  'denali india': '/logo/DENALI_Full_Logo.avif',
  'dash renewable energy': '/logo/Dash Green.png',
  'dash green': '/logo/Dash Green.png',
  'dashrenevable energy': '/logo/Dash Green.png',
  'flextronics': '/logo/Flextronics.svg',
  'gestamp': '/logo/gestamlogoss1.svg',
  'gestamp india': '/logo/gestamlogoss1.svg',
  'ge stamp': '/logo/gestamlogoss1.svg',
  'itc': '/logo/ITC.webp',
  'itc limited': '/logo/ITC.webp',
  'jn machineries': '/logo/JN Machineries.jpg',
  'sags apparels': '/logo/Sags Apparels.svg',
  'solid pro': '/logo/Solid Pro.svg',
  'solidpro': '/logo/Solid Pro.svg',
  'aatral engineering': '/logo/aatral engineering.webp',
  'aatral': '/logo/aatral engineering.webp',
  'blue star': '/logo/blue_star.png',
  'blue star climatech': '/logo/blue_star.png',
  'bluestar-climatech': '/logo/blue_star.png',
  'cii': '/logo/cii-logoNew.png',
  'cii-logo': '/logo/cii-logoNew.png',
  'danfoss': '/logo/dnafoss.webp',
  'danfoss industries ltd': '/logo/dnafoss.webp',
  'dnafoss': '/logo/dnafoss.webp',
  'imop': '/logo/imop.webp',
  'kp mills': '/logo/kp Mills.png',
  'kpr mill ltd': '/logo/kp Mills.png',
  'kkp spinning mill': '/logo/kp Mills.png',
  'lucas tvs': '/logo/lucastvs.webp',
  'lucas tvs padi': '/logo/lucastvs.webp',
  'lucas tvs -pondichery': '/logo/lucastvs.webp',
  'lucastvs': '/logo/lucastvs.webp',
  'parekh place india pvt': '/logo/parekhplastindiapvt.webp',
  'parekh plast india pvt': '/logo/parekhplastindiapvt.webp',
  'parekh place': '/logo/parekhplastindiapvt.webp',
  'parekhplastindiapvt': '/logo/parekhplastindiapvt.webp',
  'pmel': '/logo/pmel.webp',
  'pmel india pvt ltd': '/logo/pmel.webp',
  'polyhose': '/logo/polyhose.svg',
  'srm': '/logo/srmmedicalcollege.webp',
  'srm ist college campus': '/logo/srmmedicalcollege.webp',
  'srm ist valliammai campus': '/logo/srmmedicalcollege.webp',
  'srm glowguard': '/logo/srmmedicalcollege.webp',
  'srm medical college': '/logo/srmmedicalcollege.webp',
  'tidel park': '/logo/tidel park.png',
  'tidlepark': '/logo/tidel park.png',
  'knauf': '/logo/KNAUFLogo2024sRGB.png',
  'kanuf': '/logo/KNAUFLogo2024sRGB.png',
  'mrf': '/logo/mrf-logo.png',
  'mrf tyres': '/logo/mrf-logo.png',
  'panasonic': '/logo/panasonic.svg',
  'panasonic life solutions': '/logo/panasonic.svg',
  'tata electronics': '/logo/Tata_Electronics_Logo.jpg',
  'tata': '/logo/Tata_Electronics_Logo.jpg',
  'kone': '/logo/KONE.svg.png',
  'kone elevator': '/logo/KONE.svg.png',
  'kone elevators': '/logo/KONE.svg.png',
  'kone elevators india': '/logo/KONE.svg.png',
  'velmurugan': '/logo/velmurugan.webp',
  'velmurugan industries': '/logo/velmurugan.webp',
  'visalam energy': '/logo/visalamenergy.webp',
  'visalamenergy': '/logo/visalamenergy.webp',
  'wheels india': '/logo/wheelsindiapvt.webp',
  'wheels india eepd division': '/logo/wheelsindiapvt.webp',
  'wheels india fab unit': '/logo/wheelsindiapvt.webp',
  'wheels india sriperampudur unit': '/logo/wheelsindiapvt.webp',
  'wheelsindiapvt': '/logo/wheelsindiapvt.webp',
  'whirlpool': '/logo/whirlpool.webp',
  'whirlpool - pune': '/logo/whirlpool.webp',
  'whirlpool - pondichery': '/logo/whirlpool.webp',
};

const normalizeClientKey = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/(ltd|pvt|limited|private|industries|technologies|group|corp|india|unit|division)/g, '');
};

export const getClientPresetLogo = (name?: string | null): string | null => {
  if (!name || typeof name !== 'string' || !name.trim()) return null;
  const clean = name.toLowerCase().trim();
  if (CLIENT_LOGOS_MAP[clean]) return CLIENT_LOGOS_MAP[clean];

  const normTarget = normalizeClientKey(name);
  if (!normTarget || normTarget.length < 3) return null;

  for (const [key, logoPath] of Object.entries(CLIENT_LOGOS_MAP)) {
    const normKey = normalizeClientKey(key);
    if (normKey && normKey.length >= 3) {
      if (normTarget === normKey || normTarget.startsWith(normKey) || normKey.startsWith(normTarget)) {
        return logoPath;
      }
    }
  }
  return null;
};

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
    name: 'Thana Karthik',
    roleLevel: 'SENIOR_ENERGY',
    roleTitle: 'Energy Auditor',
    siteWorkCost: 10000,
    reportWorkCost: 5000,
    foodRatePerDay: 600,
  },
  {
    name: 'Pratheep',
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
    reportWorkCost: 0,
    foodRatePerDay: 400,
  },
  {
    name: 'Raja Prabakar',
    roleLevel: 'IOT_ENGINEER',
    roleTitle: 'IoT Engineer',
    siteWorkCost: 3500,
    reportWorkCost: 0,
    foodRatePerDay: 400,
  },
  {
    name: 'Vignesh Babu',
    roleLevel: 'TRAINEE_ENERGY',
    roleTitle: 'Trainee Energy Engineer',
    siteWorkCost: 2000,
    reportWorkCost: 0,
    foodRatePerDay: 300,
  },
  {
    name: 'Sub contract',
    roleLevel: 'IOT_ENGINEER',
    roleTitle: 'Sub contract Cable Specialist',
    siteWorkCost: 3500,
    reportWorkCost: 0,
    foodRatePerDay: 500,
  },
];

export interface ManpowerOverride {
  name?: string;
  roleTitle?: string;
  roleLevel?: ManpowerRow['roleLevel'];
  siteWorkCost?: number;
  reportWorkCost?: number;
  foodRatePerDay?: number;
}

export const getManpowerOverrides = (): Record<string, ManpowerOverride> => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('dealbyte_manpower_overrides');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
  }
  return {};
};

export const getActiveTeamMembers = (): PresetTeamMember[] => {
  const overrides = getManpowerOverrides();
  const baseMembers: PresetTeamMember[] = PRESET_TEAM_MEMBERS.map((m, idx) => {
    const key = `mp-preset-${idx}`;
    const override = overrides[key] || overrides[m.name];
    if (override) {
      return {
        ...m,
        name: override.name || m.name,
        roleTitle: override.roleTitle || m.roleTitle,
        roleLevel: override.roleLevel || m.roleLevel,
        siteWorkCost: override.siteWorkCost !== undefined ? Number(override.siteWorkCost) : m.siteWorkCost,
        reportWorkCost: override.reportWorkCost !== undefined ? Number(override.reportWorkCost) : m.reportWorkCost,
        foodRatePerDay: override.foodRatePerDay !== undefined ? Number(override.foodRatePerDay) : m.foodRatePerDay,
      };
    }
    return m;
  });

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('dealbyte_custom_team_members');
      if (saved) {
        const custom: any[] = JSON.parse(saved);
        const mappedCustom: PresetTeamMember[] = custom.map((c) => {
          const override = overrides[c.id] || overrides[c.name];
          return {
            name: override?.name || c.name,
            roleLevel: override?.roleLevel || c.roleLevel || 'SENIOR_ENERGY',
            roleTitle: override?.roleTitle || c.role || c.roleTitle || 'Energy Engineer',
            siteWorkCost: override?.siteWorkCost !== undefined ? Number(override.siteWorkCost) : Number(c.siteWorkCost) || 0,
            reportWorkCost: override?.reportWorkCost !== undefined ? Number(override.reportWorkCost) : Number(c.reportWorkCost) || 0,
            foodRatePerDay: override?.foodRatePerDay !== undefined ? Number(override.foodRatePerDay) : Number(c.foodRatePerDay) || 0,
          };
        });
        return [...baseMembers, ...mappedCustom];
      }
    } catch (e) {
      // ignore
    }
  }
  return baseMembers;
};

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

export interface EmsHardwareCatalogItem {
  name: string;
  description: string;
  category?: string;
  uom: string;
  unitCost: number;
}

export const STANDARD_EMS_GATEWAY_HARDWARE_CATALOG: EmsHardwareCatalogItem[] = [
  {
    name: '4G IoT Gateway - Edge Pro',
    description: 'Supply of 4G IoT Gateway for Communication with SIM card, SMPS & Antenna - Edge Pro',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 11000,
  },
  {
    name: '4G IoT Gateway - Advantech',
    description: 'Supply of 4G IoT Gateway for Communication with SIM card, SMPS & Antenna – Advantech',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 16000,
  },
  {
    name: '4G IoT Gateway - Edge Lite',
    description: 'Supply of 4G IoT Gateway for Communication with SIM card, SMPS & Antenna – Edge Lite',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 6000,
  },
  {
    name: '2" Water Flow Meter with Accessories',
    description: "2' Inch water flow meter including accessories",
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 24245,
  },
  {
    name: '2" Flange with Gaskets & Bolts',
    description: '2" flange with gaskets & bold',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Set',
    unitCost: 1905,
  },
  {
    name: 'STP Electromagnetic Flow Meter - DN50',
    description: 'STP Electromagnetic Flow Meter - DN50',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 27635,
  },
  {
    name: 'WTP Electromagnetic Flow Meter - DN40',
    description: 'WTP Electromagnetic Flow Meter - DN40',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 24780,
  },
  {
    name: 'Electromagnetic Flowmeter (Integral) - DN25',
    description: 'Electromagnetic Flowmeter with Integral Transmitter - DN25',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 23540,
  },
  {
    name: 'Electromagnetic Flowmeter (Integral) - DN40',
    description: 'Electromagnetic Flowmeter with Integral Transmitter - DN40',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 22637,
  },
  {
    name: 'Electromagnetic Flowmeter (Integral) - DN50 (Domestic/Process)',
    description: 'Electromagnetic Flowmeter with Integral Transmitter - DN50 (Domestic / Process Water)',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 24086,
  },
  {
    name: 'Electromagnetic Flowmeter (Integral) - DN50 (STP Water)',
    description: 'Electromagnetic Flowmeter with Integral Transmitter - DN50 (STP Water)',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 26429,
  },
  {
    name: 'Electromagnetic Flowmeter (Integral) - DN80',
    description: 'Electromagnetic Flowmeter with Integral Transmitter - DN80',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 42925,
  },
  {
    name: 'Electromagnetic Flowmeter (Integral) - DN100',
    description: 'Electromagnetic Flowmeter with IntegralTransmitter - DN100',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 49530,
  },
  {
    name: 'Electromagnetic Flowmeter (Integral) - DN150',
    description: 'Electromagnetic Flowmeter with Integral Transmitter - DN150',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 66050,
  },
  {
    name: 'Electromagnetic Flowmeter (Integral) - DN200',
    description: 'Electromagnetic Flowmeter with Integral Transmitter - DN200',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 79850,
  },
  {
    name: 'Electromagnetic Flowmeter (Integral) - DN250',
    description: 'Electromagnetic Flowmeter with Integral Transmitter - DN250',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 98160,
  },
  {
    name: 'Electromagnetic Flowmeter (Integral) - DN300',
    description: 'Electromagnetic Flowmeter with Integral Transmitter - DN300',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 138635,
  },
  {
    name: 'Electromagnetic Flowmeter (MEGA SROAT Integral) - DN400',
    description: 'Electromagnetic Flowmeter (MEGA SROAT ) with Integral Transmitter - DN400',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 215525,
  },
  {
    name: 'Electromagnetic Flowmeter (MEGA SROAT Integral) - DN500',
    description: 'Electromagnetic Flowmeter (MEGA SROAT ) with Integral Transmitter DN500',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 295405,
  },
  {
    name: 'Electromagnetic Flowmeter (Remote) - DN25',
    description: 'Electromagnetic Flowmeter with Remote Transmitter DN25',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 24245,
  },
  {
    name: 'Electromagnetic Flowmeter (Remote) - DN40',
    description: 'Electromagnetic flow meter with Remote Transmitter DN40',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 23342,
  },
  {
    name: 'Electromagnetic Flowmeter (Remote) - DN50',
    description: 'Electromagnetic Flowmeter with Remote Transmitter DN50',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 24791,
  },
  {
    name: 'Electromagnetic Flowmeter (Remote) - DN65',
    description: 'Electromagnetic flow meter with Remote Transmitter DN65',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 26088,
  },
  {
    name: 'Electromagnetic Flowmeter (Remote) - DN80',
    description: 'Electromagnetic flowmeter with Remote transmitter DN80',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 28607,
  },
  {
    name: 'Electromagnetic Flowmeter (Remote) - DN100',
    description: 'Electromagnetic Flowmeter with Remote Transmitter DN100',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 32894,
  },
  {
    name: 'Mating Flanges, Nut Bolts & Gasket - DN25',
    description: 'Mating flanges,Nut bolts & Gasket DN25',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Set',
    unitCost: 1372,
  },
  {
    name: 'Mating Flanges, Nut Bolts & Gasket - DN40',
    description: 'Mating flanges,Nut bolts & Gasket DN40',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Set',
    unitCost: 1664,
  },
  {
    name: 'Mating Flanges, Nut Bolts & Gasket - DN50',
    description: 'Mating flanges,Nut bolts & Gasket DN50',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Set',
    unitCost: 1902,
  },
  {
    name: 'Mating Flanges, Nut Bolts & Gasket - DN65',
    description: 'Mating flanges,Nut bolts & Gasket DN65',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Set',
    unitCost: 2812,
  },
  {
    name: 'Mating Flanges, Nut Bolts & Gasket - DN80',
    description: 'Mating flanges,Nut bolts & Gasket DN80',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Set',
    unitCost: 3237,
  },
  {
    name: 'Mating Flanges, Nut Bolts & Gasket - DN100',
    description: 'Mating flanges,Nut bolts & Gasket DN100',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Set',
    unitCost: 4154,
  },
  {
    name: 'RS485 Energy Meter, CT & Accessories',
    description: 'Supply of Energy Meter with RS485 Communication, CT & wiring accessories',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 11000,
  },
  {
    name: 'VA520 Flow Meter 1"',
    description: 'VA520 Flow Meter 1"',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 90552,
  },
  {
    name: 'VA520 Flow Meter 1" (Indian Pipe)',
    description: 'VA520 Flow Meter 1" (Indian Pipe)',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 55000,
  },
  {
    name: 'VA520 Flow Meter 2"',
    description: 'VA520 Flow Meter 2"',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 108000,
  },
  {
    name: 'VD520 Inline DP Flow Sensor',
    description: 'VD520 Inline Differential Pressure Flow Sensor',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 208450,
  },
  {
    name: 'VA500 Thermal Flow Meter (With Pressure Sensor)',
    description: 'VA500 Thermal Mass Flow Meter with Integrated Pressure Sensor',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 188000,
  },
  {
    name: 'VA500 Thermal Flow Meter (Without Pressure Sensor)',
    description: 'VA500 Thermal Mass Flow Meter without Pressure Sensor',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 158800,
  },
  {
    name: 'FA 500 – Dew Point Sensor (Standard)',
    description: 'FA 500 – Dew Point Sensor',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 85460,
  },
  {
    name: 'FA 500 – Dew Point Sensor (High Precision)',
    description: 'FA 500 – Dew Point Sensor (High Precision)',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 101345,
  },
  {
    name: 'FA515 – Dew Point Sensor (50 Bar)',
    description: 'FA515 – Dew Point Sensor with Pressure of 50 Bar',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 40000,
  },
  {
    name: 'FA515 – Dew Point Sensor (500 Bar)',
    description: 'FA515 – Dew Point Sensor with Pressure of 500 Bar',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 55885,
  },
 
  {
    name: 'Flanged Type Vortex Flow Meter - Pride',
    description: 'Flanged Type Vortex Precious Flow Meter High Pressure with digital communication feasibility (RS 485)',
    category: '1. Compressed Air Automation',
    uom: 'Nos',
    unitCost: 175000,
  },
  {
    name: 'Gateway with Panel Board, DDC Controller & AI Insights',
    description: 'Gateway with Panel Board, DDC Controller, I/O Module, Relay Module & services including AI-based insights, leakage identification using ultrasonic acoustic leak detector, re-verification support and IM&V support',
    category: '1. Compressed Air Automation',
    uom: 'Nos',
    unitCost: 400000,
  },
  {
    name: 'Energy Meter with Wall Mounting Panel',
    description: 'Supply of Energy Meter with necessary accessories and wall mounting Panel',
    category: '1. Compressed Air Automation',
    uom: 'Nos',
    unitCost: 8500,
  },
  {
    name: 'Vibration Sensor - IFM',
    description: 'Vibration Sensor for Compressors, ',
    category: '1. Compressed Air Automation',
    uom: 'Nos',
    unitCost: 15000,
  },
  {
    name: 'Temperature & Humidity Sensor',
    description: 'Temperature & Humidity Sensor',
    category: '1. Compressed Air Automation',
    uom: 'Nos',
    unitCost: 9800,
  },
  {
    name: 'Pressure Sensor',
    description: 'Pressure',
    category: '1. Compressed Air Automation',
    uom: 'Nos',
    unitCost: 6000,
  },
  {
    name: 'DP Sensor',
    description: 'DP',
    category: '1. Compressed Air Automation',
    uom: 'Nos',
    unitCost: 7500,
  },
  {
    name: 'Communication & Power Cables',
    description: 'Communication Cable (RS 485) & Power Cables',
    category: '1. Compressed Air Automation',
    uom: 'Job',
    unitCost: 25000,
  },
  {
    name: 'Custom Gateway / IoT Hardware',
    description: 'Custom Sustainabyte Edge IoT Gateway / Sensor Hardware component',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    uom: 'Nos',
    unitCost: 0,
  },
];

export const STANDARD_EMS_ELECTRICAL_HARDWARE_CATALOG: EmsHardwareCatalogItem[] = [
  {
    name: 'Supply of 2 core RS 485 Shielded cable for IoT Gateway communication',
    description: 'Supply of 2 core RS 485 Shielded cable for IoT Gateway communication',
    category: 'Electrical Hardware',
    uom: 'Coil',
    unitCost: 4000,
  },
  {
    name: 'Supply of 1" conduit pipes',
    description: 'Supply of 1" conduit pipes',
    category: 'Electrical Hardware',
    uom: 'Nos',
    unitCost: 70,
  },
  {
    name: 'Supply of electrical consumables such as flexible hose, cable ties and all other accessories',
    description: 'Supply of electrical consumables such as flexible hose, cable ties and all other accessories',
    category: 'Electrical Hardware',
    uom: 'Job',
    unitCost: 3000,
  },
  {
    name: '60/5A CT Coil',
    description: '60/5A CT Coil',
    category: 'Electrical Hardware',
    uom: 'Nos',
    unitCost: 450,
  },
  {
    name: '63/5A CT Coil',
    description: '63/5A CT Coil',
    category: 'Electrical Hardware',
    uom: 'Nos',
    unitCost: 550,
  },
  {
    name: '100/5A CT Coil',
    description: '100/5A CT Coil',
    category: 'Electrical Hardware',
    uom: 'Nos',
    unitCost: 550,
  },
  {
    name: '250/5A CT Coil',
    description: '250/5A CT Coil',
    category: 'Electrical Hardware',
    uom: 'Nos',
    unitCost: 550,
  },
  {
    name: '400/5A CT Coil',
    description: '400/5A CT Coil',
    category: 'Electrical Hardware',
    uom: 'Nos',
    unitCost: 650,
  },
  {
    name: '300Mm Cable Tie',
    description: '300Mm Cable Tie',
    category: 'Electrical Hardware',
    uom: 'Pkt',
    unitCost: 120,
  },
  {
    name: '200Mm Cable Tie',
    description: '200Mm Cable Tie',
    category: 'Electrical Hardware',
    uom: 'Pkt',
    unitCost: 110,
  },
  {
    name: '3Core Shield Cable',
    description: '3Core Shield Cable',
    category: 'Electrical Hardware',
    uom: 'Coil',
    unitCost: 5194,
  },
  {
    name: '2Core Cable 1100V',
    description: '2Core Cable 1100V',
    category: 'Electrical Hardware',
    uom: 'Coil',
    unitCost: 4125,
  },
  {
    name: '2Core Screen Shielded Cable',
    description: '2Core Screen Shielded Cable',
    category: 'Electrical Hardware',
    uom: 'Mtr',
    unitCost: 51,
  },
  {
    name: '3Core Round INDL Cable 1.1KV',
    description: '3Core Round INDL Cable 1.1KV',
    category: 'Electrical Hardware',
    uom: 'Mtr',
    unitCost: 60,
  },
  {
    name: '2Core Unscreened Cable',
    description: '2Core Unscreened Cable',
    category: 'Electrical Hardware',
    uom: 'Mtr',
    unitCost: 40,
  },
  {
    name: '2Core Screened Shielded Cable',
    description: '2Core Screened Shielded Cable',
    category: 'Electrical Hardware',
    uom: 'Mtr',
    unitCost: 70,
  },
  {
    name: '7Core Unscreened Shielded Cable',
    description: '7Core Unscreened Shielded Cable',
    category: 'Electrical Hardware',
    uom: 'Mtr',
    unitCost: 92,
  },
  {
    name: 'Flanged Type Vortex Flow Meter (CAM) - Pride',
    description: 'Flanged Type Vortex Precious Flow Meter High Pressure with digital communication feasibility (RS 485), Make: Pride',
    category: '2. Compressed Air Monitoring',
    uom: 'Nos',
    unitCost: 175000,
  },
  {
    name: 'Insertion Type Thermal Mass Flow Meter - CS Instruments',
    description: 'Insertion Type Thermal Mass Flow Meter with digital communication, ',
    category: '2. Compressed Air Monitoring',
    uom: 'Nos',
    unitCost: 236800,
  },
  {
    name: 'Gateway with Panel Board',
    description: 'Gateway with Panel Board',
    category: '2. Compressed Air Monitoring',
    uom: 'Nos',
    unitCost: 15000,
  },
  {
    name: 'Communication Cable (RS 485) & Power Cables (CAM)',
    description: 'Communication Cable (RS 485) & Power Cables',
    category: '2. Compressed Air Monitoring',
    uom: 'Job',
    unitCost: 7500,
  },
  {
    name: 'Custom Electrical Accessory',
    description: 'Custom Electrical Hardware / Cable / Accessory',
    category: 'Electrical Hardware',
    uom: 'Nos',
    unitCost: 0,
  },
];

export interface HardwareOverride {
  id?: string;
  name?: string;
  description?: string;
  unitCost?: number;
  uom?: string;
  category?: string;
}

export const getHardwareOverrides = (): Record<string, HardwareOverride> => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('dealbyte_hardware_overrides');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
  }
  return {};
};

export const getActiveGatewayHardwareCatalog = (): EmsHardwareCatalogItem[] => {
  const overrides = getHardwareOverrides();
  const baseCatalog: EmsHardwareCatalogItem[] = STANDARD_EMS_GATEWAY_HARDWARE_CATALOG.map((item, idx) => {
    const key = `gw-preset-${idx}`;
    const byKey = overrides[key];
    const byDesc = overrides[item.description] || overrides[item.name];
    const override = byKey || byDesc;
    if (override) {
      return {
        ...item,
        name: override.name || item.name,
        description: override.description || override.name || item.description,
        uom: override.uom || item.uom,
        unitCost: override.unitCost !== undefined ? Number(override.unitCost) : item.unitCost,
      };
    }
    return item;
  });

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('dealbyte_custom_hardware_items');
      if (saved) {
        const custom: any[] = JSON.parse(saved);
        const gatewayCustom: EmsHardwareCatalogItem[] = custom
          .filter((c) => (c.category || '').toLowerCase().includes('gateway') || !(c.category || '').toLowerCase().includes('electrical'))
          .map((c) => ({
            name: c.name,
            description: c.name,
            category: c.category || '1. Sustainabyte Edge IoT Gateway Hardware',
            uom: c.uom || 'Nos',
            unitCost: Number(c.unitCost) || 0,
          }));
        return [...baseCatalog, ...gatewayCustom];
      }
    } catch (e) {}
  }
  return baseCatalog;
};

export const getActiveElectricalHardwareCatalog = (): EmsHardwareCatalogItem[] => {
  const overrides = getHardwareOverrides();
  const baseCatalog: EmsHardwareCatalogItem[] = STANDARD_EMS_ELECTRICAL_HARDWARE_CATALOG.map((item, idx) => {
    const key = `el-preset-${idx}`;
    const byKey = overrides[key];
    const byDesc = overrides[item.description] || overrides[item.name];
    const override = byKey || byDesc;
    if (override) {
      return {
        ...item,
        name: override.name || item.name,
        description: override.description || override.name || item.description,
        uom: override.uom || item.uom,
        unitCost: override.unitCost !== undefined ? Number(override.unitCost) : item.unitCost,
      };
    }
    return item;
  });

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('dealbyte_custom_hardware_items');
      if (saved) {
        const custom: any[] = JSON.parse(saved);
        const elCustom: EmsHardwareCatalogItem[] = custom
          .filter((c) => (c.category || '').toLowerCase().includes('electrical'))
          .map((c) => ({
            name: c.name,
            description: c.name,
            category: c.category || '2. Electrical Hardware & Accessories',
            uom: c.uom || 'Nos',
            unitCost: Number(c.unitCost) || 0,
          }));
        return [...baseCatalog, ...elCustom];
      }
    } catch (e) {}
  }
  return baseCatalog;
};

export const getInitialEmsGatewayHardwareRows = (): EmsHardwareRow[] => {
  const catalog = getActiveGatewayHardwareCatalog();
  return INITIAL_EMS_GATEWAY_HARDWARE_ROWS.map((r) => {
    const matched = catalog.find((c) => c.description === r.description || c.name === r.description);
    return matched ? { ...r, unitCost: matched.unitCost, uom: matched.uom } : r;
  });
};

export const getInitialEmsElectricalHardwareRows = (): EmsHardwareRow[] => {
  const catalog = getActiveElectricalHardwareCatalog();
  return INITIAL_EMS_ELECTRICAL_HARDWARE_ROWS.map((r) => {
    const matched = catalog.find((c) => c.description === r.description || c.name === r.description);
    return matched ? { ...r, unitCost: matched.unitCost, uom: matched.uom } : r;
  });
};

export const INITIAL_EMS_GATEWAY_HARDWARE_ROWS: EmsHardwareRow[] = [
  {
    id: 'ems_h1_1',
    code: '1a',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    description: 'Supply of 4G IoT Gateway for Communication with SIM card, SMPS & Antenna - Edge Pro',
    qty: 0,
    uom: 'Nos',
    unitCost: 11000,
    marginPct: 40,
  },
  {
    id: 'ems_h1_2',
    code: '1b',
    category: 'Sustainabyte Edge IoT Gateway Hardware',
    description: 'Supply of Energy Meter with RS485 Communication, CT & wiring accessories',
    qty: 0,
    uom: 'Nos',
    unitCost: 11000,
    marginPct: 40,
  },
];

export const INITIAL_COMPRESSED_AIR_AUTOMATION_GATEWAY_ROWS: EmsHardwareRow[] = [
  {
    id: 'caa_h1_1',
    code: '1a',
    category: '1. Compressed Air Automation',
    description: 'Flanged Type Vortex Precious Flow Meter High Pressure with digital communication feasibility (RS 485)',
    qty: 0,
    uom: 'Nos',
    unitCost: 175000,
    marginPct: 40,
  },
  {
    id: 'caa_h1_2',
    code: '1b',
    category: '1. Compressed Air Automation',
    description: 'Gateway with Panel Board, DDC Controller, I/O Module, Relay Module & services including AI-based insights, leakage identification using ultrasonic acoustic leak detector, re-verification support and IM&V support',
    qty: 0,
    uom: 'Nos',
    unitCost: 400000,
    marginPct: 40,
  },
  {
    id: 'caa_h1_3',
    code: '1c',
    category: '1. Compressed Air Automation',
    description: 'Supply of Energy Meter with necessary accessories and wall mounting Panel',
    qty: 0,
    uom: 'Nos',
    unitCost: 8500,
    marginPct: 40,
  },
  {
    id: 'caa_h1_4',
    code: '1d',
    category: '1. Compressed Air Automation',
    description: 'Vibration Sensor for Compressors',
    qty: 0,
    uom: 'Nos',
    unitCost: 15000,
    marginPct: 40,
  },
  {
    id: 'caa_h1_5',
    code: '1e',
    category: '1. Compressed Air Automation',
    description: 'Temperature & Humidity Sensor',
    qty: 0,
    uom: 'Nos',
    unitCost: 9800,
    marginPct: 40,
  },
  {
    id: 'caa_h1_6',
    code: '1f',
    category: '1. Compressed Air Automation',
    description: 'Pressure',
    qty: 0,
    uom: 'Nos',
    unitCost: 6000,
    marginPct: 40,
  },
  {
    id: 'caa_h1_7',
    code: '1g',
    category: '1. Compressed Air Automation',
    description: 'DP',
    qty: 0,
    uom: 'Nos',
    unitCost: 7500,
    marginPct: 40,
  },
  {
    id: 'caa_h1_8',
    code: '1h',
    category: '1. Compressed Air Automation',
    description: 'Communication Cable (RS 485) & Power Cables',
    qty: 0,
    uom: 'Job',
    unitCost: 25000,
    marginPct: 40,
  },
];

export const INITIAL_EMS_ELECTRICAL_HARDWARE_ROWS: EmsHardwareRow[] = [
  {
    id: 'ems_h2_1',
    code: '2a',
    category: 'Electrical Hardware',
    description: 'Supply of 2 core RS 485 Shielded cable for IoT Gateway communication',
    qty: 0,
    uom: 'Coil',
    unitCost: 4000,
    marginPct: 40,
  },
  {
    id: 'ems_h2_2',
    code: '2b',
    category: 'Electrical Hardware',
    description: 'Supply of 1" conduit pipes',
    qty: 0,
    uom: 'Nos',
    unitCost: 70,
    marginPct: 40,
  },
  {
    id: 'ems_h2_3',
    code: '2c',
    category: 'Electrical Hardware',
    description: 'Supply of electrical consumables such as flexible hose, cable ties and all other accessories',
    qty: 0,
    uom: 'Job',
    unitCost: 3000,
    marginPct: 40,
  },
];

export const INITIAL_COMPRESSED_AIR_MONITORING_ELECTRICAL_ROWS: EmsHardwareRow[] = [
  {
    id: 'cam_h2_1',
    code: '2a',
    category: '2. Compressed Air Monitoring',
    description: 'Flanged Type Vortex Precious Flow Meter High Pressure with digital communication feasibility (RS 485),',
    qty: 0,
    uom: 'Nos',
    unitCost: 175000,
    marginPct: 40,
  },
  {
    id: 'cam_h2_2',
    code: '2b',
    category: '2. Compressed Air Monitoring',
    description: 'Insertion Type Thermal Mass Flow Meter with digital communication',
    qty: 0,
    uom: 'Nos',
    unitCost: 236800,
    marginPct: 40,
  },
  {
    id: 'cam_h2_3',
    code: '2c',
    category: '2. Compressed Air Monitoring',
    description: 'Gateway with Panel Board',
    qty: 0,
    uom: 'Nos',
    unitCost: 15000,
    marginPct: 40,
  },
  {
    id: 'cam_h2_4',
    code: '2d',
    category: '2. Compressed Air Monitoring',
    description: 'Communication Cable (RS 485) & Power Cables',
    qty: 0,
    uom: 'Job',
    unitCost: 7500,
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
    reportWorkingDays: 0,
  },
];

export const INITIAL_COMPRESSED_AIR_AUTOMATION_MANPOWER_ROWS: ManpowerRow[] = [
  {
    id: 'caa_m1',
    name: 'Vijayan',
    roleLevel: 'SENIOR_ENERGY',
    foodRatePerDay: 350,
    siteWorkCost: 5000,
    reportWorkCost: 0,
    siteWorkingDays: 0,
    reportWorkingDays: 0,
  },
  {
    id: 'caa_m2',
    name: 'Raja Prabakar',
    roleLevel: 'IOT_ENGINEER',
    foodRatePerDay: 350,
    siteWorkCost: 4000,
    reportWorkCost: 0,
    siteWorkingDays: 0,
    reportWorkingDays: 0,
  },
  {
    id: 'caa_m3',
    name: 'Karthikeyan',
    roleLevel: 'JUNIOR_ENERGY',
    foodRatePerDay: 350,
    siteWorkCost: 3000,
    reportWorkCost: 0,
    siteWorkingDays: 0,
    reportWorkingDays: 0,
  },
  {
    id: 'caa_m4',
    name: 'Jowshva',
    roleLevel: 'IOT_ENGINEER',
    foodRatePerDay: 350,
    siteWorkCost: 3000,
    reportWorkCost: 0,
    siteWorkingDays: 0,
    reportWorkingDays: 0,
  },
  {
    id: 'caa_m5',
    name: 'Sub contract',
    roleLevel: 'IOT_ENGINEER',
    foodRatePerDay: 350,
    siteWorkCost: 6000,
    reportWorkCost: 0,
    siteWorkingDays: 0,
    reportWorkingDays: 0,
  },
];

export const INITIAL_COMPRESSED_AIR_INSTALLATION_MANPOWER_ROWS: ManpowerRow[] = [
  {
    id: 'cai_m1',
    name: 'Electrical Technician',
    roleLevel: 'CUSTOM',
    foodRatePerDay: 350,
    siteWorkCost: 3000,
    reportWorkCost: 0,
    siteWorkingDays: 0,
    reportWorkingDays: 0,
  },
  {
    id: 'cai_m2',
    name: 'Field Specialist',
    roleLevel: 'IOT_ENGINEER',
    foodRatePerDay: 350,
    siteWorkCost: 3500,
    reportWorkCost: 0,
    siteWorkingDays: 0,
    reportWorkingDays: 0,
  },
];

export const INITIAL_EMS_PLATFORM_ROWS: EmsPlatformRow[] = [
  {
    id: 'ems_p1',
    description:
      'IoT device configuration, protocol setup (Modbus, BACnet, MQTT), and integration with BMS/EMS platforms\nNetwork connectivity, dashboard mapping, alarm configuration, and cloud/server integration support\nSystem commissioning including startup, functional testing, calibration, and performance verification\nTroubleshooting, integration testing, client demonstration, and final handover support\nElectrical power/control cable laying, routing, termination, tagging, and insulation testing as per standard',
    qty: 0,
    uom: 'Nodes',
    unitCost: 1000,
    marginPct: 40,
  },
];

export const INITIAL_EMS_RECURRING_ROWS: EmsRecurringRow[] = [
  {
    id: 'ems_r1',
    code: '1a',
    description: 'Recurring Charges for GSM-GPRS communication enabled IoT SIM Card and valid for one year period.',
    qty: 0,
    uom: 'Nos',
    unitCostPerMonth: 125,
    marginPct: 40,
  },
  {
    id: 'ems_r2',
    code: '1b',
    description:
      'OptiByte Dashboard, Intelligent reporting, Group and machine level reporting, Email on any threshold value breach, Alert on Mobile(via SMS), Auto detection of anomalies, water flow rate, water capacity. We will check with the pH and TDS meter, if we can integrate it with our dashboard',
    qty: 0,
    uom: 'Nodes',
    unitCostPerMonth: 100,
    marginPct: 40,
  },
];

// ─── Energy Audit Solution Template Defaults ─────────────────────────────────

export const DEFAULT_ENERGY_AUDIT_STEP5_TEXT = `Scope of Work:
Energy Audit Scope of Work:

The Energy Audit will be carried out at the facility to evaluate the overall energy performance of the plant and identify opportunities for energy cost reduction, performance improvement, and sustainability enhancement.
The scope will comprehensively cover electrical, thermal, and utility systems as detailed below:

Production and Process Systems:
• Study of production pattern, shift operation, and loading profile to determine the specific energy consumption (kWh/unit of production).
• Performance assessment of Induction Electrical Heaters, Heating Systems, and EOT Cranes to identify areas of operational inefficiency and potential for optimization.
• Observation of idle run hours, no-load losses, and assessment of equipment scheduling to reduce wastage during non-productive hours.

Electrical Energy Distribution System:
• Transformer Performance Evaluation – Measurement of loading pattern, power factor, voltage unbalance, and temperature rise to assess operating efficiency.
• Power Quality Analysis – Measurement of harmonics, voltage imbalance, and reactive power flow using power analyzers.
• Capacitor Bank Study – Evaluation of automatic power factor correction (APFC) system functionality and reactive power compensation adequacy.

Compressed Air System:
• Compressor Performance Assessment – Measurement of Free Air Delivery (FAD), discharge pressure, power consumption, and operating efficiency.
• Leakage Survey – Ultrasonic detection and quantification of air leakages to determine leakage loss percentage.
• Air Network Study – Review of header layout, receiver capacity, and pressure drop from compressor to point of use.
• Recommendations for optimization of pressure levels, sequencing control, and air demand management to minimize energy wastage.

Lighting System:
• Measurement of lux levels in production areas, offices, and common spaces to compare with IS standards.
• Evaluation of fixture efficiency, control systems, and lighting layout.
• Identification of retrofit options such as LED upgrades, daylight integration, and occupancy sensors for further reduction in lighting energy consumption.

Diesel Generator (DG) System:
• Analysis of DG load, power factor, and efficiency at different loading conditions.
• Calculation of specific fuel consumption (litre/kWh) and comparison with standard benchmarks.
• Identification of potential for waste heat recovery from DG exhaust gases.

HVAC Systems Split Units – Sample Basis:
• Measurement of input power, airflow, and temperature differential to calculate cooling capacity and Coefficient of Performance (COP).
• Review of maintenance schedule, refrigerant charging, and control settings.
• Identification of opportunities for temperature setpoint optimization, filter cleaning schedule, and load balancing across units.

Pumps and Water Systems:
• Performance evaluation of Borewell, WTP, RO, and STP pumps including flow, head, and input power.
• Calculation of pump efficiency and identification of oversized or throttled pumps.
• Suggestion of VFD integration, impeller trimming, and parallel operation optimization for energy savings.

Waste Heat Recovery Opportunities:
• Identification and quantification of recoverable heat from DG exhaust, compressor after-coolers, or process systems.
• Preliminary analysis of possible recovery systems such as heat exchangers, pre-heaters, or condensate recovery units.

Energy Performance Indicators (EnPIs) and Benchmarking:
• Establishment of baseline energy consumption and development of system-wise Energy Performance Indicators.
• Benchmarking against industry standards or similar facilities to identify gaps and improvement potential.

Energy Conservation Opportunities (ENCON):
• Identification and quantification of energy-saving opportunities in each system.
• Estimation of energy savings potential, investment required, and payback period for each recommendation.
• Prioritization of measures based on cost-benefit analysis and feasibility.

Reporting and Presentation:
• Preparation of a comprehensive audit report covering system-wise analysis, observations, and recommendations.
• Submission of backup calculation sheets, measurement data, and trend graphs.
• Presentation of findings to the client team, including a roadmap for implementation of identified ENCON measures.

Water Audit Scope of Work:
• Estimation of water mass balance using ultrasonic flow meters.
• Quantification of baseline water mapping for process and domestic use.
• Measurement of pressure, flow, and quality at feasible locations.
• Identification and quantification of inefficiencies and leakages.
• Assessment of fresh and process water quality and treatment requirements.
• Development of water balance charts and mapping of user-wise water quality needs.
• Evaluation of wastewater treatment and reuse strategies.
• Identification of technologies for high recycling percentage and water neutrality.
• Analysis of water usage patterns by departments or zones.
• Compilation of best practices and case studies for water conservation.

Deliverables:
1. Data Collection Format – Structured data sheets for system-wise measurement.
2. Opening Meeting Presentation – Kick-off presentation outlining objectives, scope, and methodology.
3. Preliminary Findings / Closing Meeting Presentation – Summary of key observations and immediate opportunities.
4. Detailed Audit Report – Comprehensive report covering observations, analysis, and recommendations.
5. Backup Calculation Files – Excel files with system-wise energy and water balance, efficiency calculations, and saving potential.
6. Comprehensive Water Assessment Report: Includes baseline water mapping, flow and pressure measurements, quality analysis, identification of inefficiencies/leakages, water balance charts, department-wise usage patterns, and recommendations for water treatment, reuse, and high-recycling technologies.
7. Implementation & Best Practices Guide: Provides actionable strategies for water conservation, case studies, and technology recommendations to achieve water neutrality and optimize process and domestic water usage.`;

export const DEFAULT_ENERGY_AUDIT_STEP6_TEXT = `Payment Terms:
• 50% Completion of on-site assessment
• 50% submission of final report
• Applicable taxes and duties will be extra
• Boarding and Travel Expenses are exclusive`;

export const DEFAULT_ENERGY_AUDIT_SCOPE_CARDS = [
  {
    id: 'ea-1',
    title: '1. Production & Process Systems',
    description: 'Specific energy consumption (kWh/unit), induction heaters, heating systems, cranes, and idle run hours optimization.',
  },
  {
    id: 'ea-2',
    title: '2. Electrical Distribution & Power Quality',
    description: 'Transformer loading, temperature, harmonics, power factor, and APFC capacitor bank adequacy analysis.',
  },
  {
    id: 'ea-3',
    title: '3. Compressed Air & Ultrasonic Leak Tagging',
    description: 'FAD efficiency, pressure drop, demand sequencing, and ultrasonic leak detection with physical ID tags.',
  },
  {
    id: 'ea-4',
    title: '4. HVAC, DG & Waste Heat Recovery',
    description: 'Split units COP, DG specific fuel consumption (L/kWh), and waste heat recovery from exhaust and compressors.',
  },
  {
    id: 'ea-5',
    title: '5. Pumps, Water Systems & Water Audit',
    description: 'Borewell/WTP/RO/STP pump efficiency, VFD potential, ultrasonic water mass balance, and recycling strategies.',
  },
  {
    id: 'ea-6',
    title: '6. EnPIs, Benchmarking & ENCON Roadmap',
    description: 'Baseline EnPI establishment, industry benchmarking, prioritized ECMs with ROI calculations, and final presentation.',
  },
];

export const ENERGY_AUDIT_TRACK_RECORD_CLIENTS = [
  'Aatral Engineering',
  'Velmurugan Heavy Engineering Industries Private Limited',
  '20cube Logistics Solutions Private Limited',
  'Danfoss Industries Private Limited',
  'Knowledge Bridge',
  'S G Snacks India Pvt. Ltd.',
  '20cube Logistics Solutions Private Limited',
  'Parekhplast India Limited',
  'PMEL Oragadam Private Limited - Unit 3',
  'PMEL Oragadam Private Limited - Unit 4',
  'Lucas TVS Limited - Padi',
  'Visalam Technologies LLP',
  'Adspaas Polymer Solutions Limited',
  'Wheels India Limited',
  'India Metal One Steel Plate Processing Pvt. Ltd',
  'India Metal One Steel Plate Processing Pvt. Ltd',
  'Glow guard (A Unit Of Green Pearl Engineering Construction Corporation Pvt Ltd)(SRM University)',
  'Aisan Auto Parts India Private Limited',
  'India Metal One Steel Plate Processing Pvt. Ltd',
  'Whirlpool of India Limited',
  'ITC - Medak Ltd',
  'Kone Elevator India Private Limited',
  'KPR Mill Limited',
  'Arni Engineering Tech Private Ltd',
  'Growserve Enterprises - Ashirwad',
  'Vashi Integrated Solution Limited',
  'Development Environergy Services Limited - IIT Hyderabad',
];

export const ASHRAE_LEVEL_2_CLIENTS = [
  'Mazaya Business Avenue, Dubai',
  'ASHRAE Level 2 audit at 6 Commercial Building, Dubai',
  'Danat Al Emarat Hospital, Dubai by Aatral',
  'Capital Land by Orien Energy',
  'Casagrand Eco Tech, Sholinganallur',
  'Tidal Park, Pattabiram',
  'TNQ Software, Taramani',
  'Embassy Tech Village, Kadubeesanahalli Bengaluru',
  'Embassy ETZ, Pune',
  'First Source Limited, Vijayawada',
  'First Source Limited, Hyderabad',
  'First Source Limited, Chennai',
  'Valeo Software, Sholinganallur',
  'Solidpro, Chennai',
  'SRM University, Chennai',
  'Development Environergy Services Limited - IIT Hyderabad',
  'Aatral Engineering',
  'Velmurugan Heavy Engineering Industries Private Limited',
  '20cube Logistics Solutions Private Limited',
  'Danfoss Industries Private Limited',
  'Knowledge Bridge',
  'S G Snacks India Pvt. Ltd.',
  '20cube Logistics Solutions Private Limited',
  'Parekhplast India Limited',
  'PMEL Oragadam Private Limited - Unit 3 & 4',
  'Lucas TVS Limited - Padi',
  'Visalam Technologies LLP',
  'Adspaas Polymer Solutions Limited',
  'Wheels India Limited',
  'India Metal One Steel Plate Processing Pvt. Ltd',
  'Aisan Auto Parts India Private Limited',
  'Whirlpool of India Limited',
  'ITC - Medak Ltd',
  'Kone Elevator India Private Limited',
  'KPR Mill Limited',
  'Concorde Textiles Ltd',
  'Arni Engineering Tech Private Ltd',
  'Growserve Enterprises - Ashirwad',
  'Vashi Integrated Solution Limited',
  'Ahlstrom Fiber Composite Pvt Ltd',
];

export const DEFAULT_ASHRAE_LEVEL_2_STEP5_TEXT = `Scope of Work:
The objective of this study is to perform a detailed energy audit in accordance with ASHRAE Level 2 guidelines along with district cooling bill analysis to identify energy saving and cost optimization opportunities.

Data Collection and Review:
• The audit team will collect the last 12 months of electricity bills and district cooling bills for detailed analysis.
• The team will gather building-related information such as total built-up area, occupancy pattern, and operating hours.
• The inventory of major equipment including AHUs, FCUs, pumps, heat exchangers, lighting systems, and transformers will be compiled.
• All available technical documents such as single line diagrams, HVAC schematics, and operation manuals will be reviewed to understand system configuration.

Electricity Bill Analysis:
• The electricity bills will be analyzed to study monthly energy consumption, maximum demand, and power factor trends.
• The analysis will identify demand peaks, penalties, and opportunities for tariff optimization.

District Cooling Bill Analysis:
• The district cooling billing structure will be reviewed to understand fixed and variable components of the bill.
• The study will analyze monthly TRh consumption trends and compare them with contracted TR capacity.
• The assessment will identify any over-contracting or underutilization of cooling capacity.
• The billed consumption will be validated against actual usage to identify discrepancies or overbilling issues.

CDD-Based Consumption Analysis:
• Cooling Degree Days will be used to normalize cooling consumption and eliminate the impact of weather variations.
• The study will establish correlation between CDD and cooling energy consumption to identify abnormal performance trends.

AHU Performance Assessment:
• Air Handling Units will be evaluated on a sampling basis covering approximately 20% to 30% of total units.
• The selection of AHUs will be based on capacity, location, and operational diversity.
• Where measurement provision is available, airflow, temperature, humidity, and static pressure will be measured.
• The analysis will assess cooling coil performance, fan efficiency, and filter pressure drop.

FCU and Terminal Equipment Assessment:
• Fan Coil Units and other terminal equipment will be assessed to evaluate temperature control and valve operation.
• The study will identify issues such as overcooling, improper control, and inefficient operation.

Pump Performance Study:
• Pump systems will be analyzed on a sampling basis covering approximately 20% to 30% of total pumps.
• Flow rate, head, and power consumption will be measured to calculate pump efficiency.
• The analysis will identify inefficiencies such as oversizing, throttling losses, and potential for VFD implementation.

Heat Exchanger Efficiency Evaluation:
• Heat exchangers will be assessed by measuring inlet and outlet temperatures and flow rates.
• The efficiency will be calculated and compared with design performance to identify degradation due to fouling or scaling.

Heat Pump / Boiler Assessment:
• The performance of heat pump or boiler systems will be evaluated by calculating efficiency under operating conditions.
• The study will identify opportunities for optimization and waste heat recovery.

Lighting System Assessment:
• Lux level measurements will be conducted across different areas such as retail spaces, corridors, and parking areas.
• The measured values will be compared with recommended standards to identify over-illumination or under-lighting.
• Opportunities for energy savings through LED retrofits and control strategies will be identified.

Electrical System and Power Quality Study:
• Transformer performance will be evaluated by measuring voltage, current, loading, and power factor.
• Power quality analysis will be conducted to assess harmonics, phase imbalance, and system losses.
• The distribution system will be reviewed to identify inefficiencies and improvement opportunities.

Measurement and Instrumentation:
• Field measurements will be carried out using calibrated instruments such as power analyzers, flow meters, anemometers, temperature sensors, and lux meters.
• The collected data will be used for detailed performance analysis and validation.

Energy Conservation Measures (ECMs):
• Energy saving opportunities will be identified and categorized as low-cost, medium-cost, and high-cost measures.
• Each recommendation will include estimated energy savings, cost savings, investment, and payback period.

Key Performance Indicators:
• Key performance indicators such as kW/TR, TRh/m², load factor, and cost per TRh will be calculated to benchmark system performance.

Deliverables:
• A detailed energy audit report along with district cooling analysis will be submitted.
• The report will include graphical trends, CDD correlation, and identified energy conservation measures with financial analysis.
• An executive summary highlighting key findings and recommendations will be provided for management review.`;

export const DEFAULT_COMPRESSOR_AIR_LEAKAGE_RECTIFICATION_STEP5_TEXT = `What is Compressed Air Audit?

A Compressed Air Audit is a systematic study of the compressed air system to identify:
• energy losses
• Inefficiencies
• opportunities for cost savings

It involves analysing compressors, air distribution lines, storage tanks, valves, dryers, and end-use equipment. The main purpose is to measure air demand, detect leakages, check pressure drops, and evaluate operating patterns. By doing this, we can highlight unnecessary energy consumption, calculate the financial loss, and suggest corrective measures for improving system reliability and reducing operating costs. In short, a compressed air audit helps customers save energy, lower production costs, and ensure a more reliable and sustainable operation.

A Compressed Air Audit is like a health check-up for your compressed air system. It helps identify hidden leaks, pressure losses, and inefficient operations that quietly increase your power bills. With our audit, we can show you exactly where your system is wasting energy and how much money you can save by fixing it. Many industries reduce their compressor power cost by 20–30% after an audit, while also improving reliability and productivity. This is a fast-return investment that directly lowers your operating cost.

Compressed Air Audit Includes:
Phase-1 Collecting data, Savings Calculation & Documentation (Completed)
Phase-2 Implementing the scopes of identified in the Phase-1`;

export const DEFAULT_COMPRESSOR_AIR_LEAKAGE_RECTIFICATION_STEP6_TEXT = `Commercials:
Support required from the client:
• SPOC (Single point of Contact) for support and coordination during the audit phase.
• Accessibility to each area.
• 1 person required from client side with knowledge on Compressed air line to reach out from the generation to end use for leakage identifications.

Terms and Conditions:
• Payment schedule: 70% advance along with the Purchase Order (PO) towards material procurement, and the remaining 30% upon completion of the work.
• Applicable taxes and duties will be extra.
• Boarding and Travel Expenses are inclusive of the cost mentioned above.

Note:
• PU hoses are under the client’s scope of supply.
• Need Machines Downtime for Leak Corrections.

Bank Account details:
Bank – Bank of Baroda
Account Number – 35860200000750
IFSC – BARB0VELACH (fifth letter is ZERO)
Branch – VELACHERY BRANCH
GSTIN NO – 33ABNCS4869A1Z7
PAN Number – ABNCS4869A`;

export const DEFAULT_COMPRESSOR_AIR_AUDIT_STEP5_TEXT = `What is Compressed Air Audit?
• A Compressed Air Audit is a systematic study of the compressed air system to identify:
  - energy losses 
  - Inefficiencies
  - opportunities for cost savings
• It involves analysing compressors, air distribution lines, storage tanks, valves, dryers, and end-use equipment. 
• The main purpose is to measure air demand, detect leakages, check pressure drops, and evaluate operating patterns. 
• By doing this, we can highlight unnecessary energy consumption, calculate the financial loss, and suggest corrective measures for improving system reliability and reducing operating costs. 
• In short, a compressed air audit helps customers save energy, lower production costs, and ensure a more reliable and sustainable operation.
• A Compressed Air Audit is like a health check-up for your compressed air system. It helps identify hidden leaks, pressure losses, and inefficient operations that quietly increase your power bills. 
• With our audit, we can show you exactly where your system is wasting energy and how much money you can save by fixing it. 
• Many industries reduce their compressor power cost by 20–30% after an audit, while also improving reliability and productivity. This is a fast-return investment that directly lowers your operating cost.

How the compressed air wasting your money?
• Compressed air is often called the “fourth utility” in industries, but it is also one of the costliest utilities to generate. Every leak in the system is like leaving a tap open only worse, because producing compressed air costs 7–8 times more energy than water pumping.
• For example:
  - A single 3 mm leak can waste up to 30–35 CFM, which equals ₹2–3 lakhs per year in electricity cost (depending on power tariff).
  - Leaks also force compressors to run longer, increasing maintenance cost and reducing equipment life.
  - As more air leaks out, the system pressure drops, which can affect production quality and efficiency.
• By repairing leaks and optimizing the air system, customers typically save 20–30% of their compressed air cost. That means direct profit without changing production.
• Every hissing sound you hear in your plant is not just air — it’s your money leaking out. A small investment in leak detection and repair will save you lakhs of rupees every year.

Benefits of Compressed Air Audit:
• Reduce artificial air demand
• Operate compressors at high efficiency
• Reduce the losses in filters, dryers
• Know the actual air delivered by the compressor against design value
• Find out the volume of air leakage in the plant
• Identification of air leakage spots in the plant
• Compressed air cost is recovered through reduced system costs over a short period.

Compressed Air Audit Includes:
• Phase-1: Collecting data, Savings Calculation & Documentation
• Phase-2: Implementing the scopes of identified in the Phase-1 (By Customer Preference)
• Phase-3: Implementation Validation

Phase-2 Implementing the scopes of identified in the Phase-1 (By Customer Preference):
Correcting air leakages and addressing other compressed air optimization opportunities are among the most effective ways to prove tangible savings to customers. Once leaks are repaired, and improvements such as pressure optimization, proper compressor sequencing, or storage enhancement are implemented, the results can be validated through energy meters or flow data. By comparing the baseline measurements with post-implementation readings, the reduction in power consumption or compressed air demand becomes evident. This data-driven validation not only quantifies the savings achieved but also builds customer confidence, as the improvements are backed by measurable reductions in kW usage, flow demand, or operating hours, directly translating into cost savings and improved system reliability. Additionally, supplying the required materials and spares during implementation ensures timely execution, smooth operation, and sustainability of the optimization measures.

Phase-3 Implementation Validation:
Implementation Validation ensures that the recommended energy conservation measures and rectification works in the compressed air system are executed as planned and deliver the expected results. This process involves verifying the corrective actions, re-measuring the system parameters such as pressure, flow, and power consumption, and comparing them with the baseline data. Successful validation confirms that leak rectification, drain automation, and compressor optimization measures are effectively reducing losses and improving efficiency. Documented results provide transparency, build customer confidence, and prove the actual energy and cost savings achieved through the implementation.

Other Audit Services:
Compressor Efficiency (FAD):
A Compressor Efficiency Study is as if an energy audit focused only on your air compressors. It helps you understand how efficiently your compressors are converting electricity into usable compressed air. In many plants, compressors consume up to 20–30% of total electricity, but often operate below optimal efficiency due to wrong sizing, poor controls, pressure drops, and leakages. During the study, we measure actual power consumption, flow (CFM), pressure levels, and operating patterns. From this data, we calculate the specific power (kW per CFM), which is the true indicator of compressor efficiency. By comparing this with industry benchmarks, we can show you how much extra energy (and money) your system is consuming.
The outcome is a clear set of recommendations such as right-sizing compressors, optimizing load/unload cycles, reducing pressure band, and fixing leaks, which lead to lower energy bills, reduced maintenance, and more reliable compressed air supply.

Demand Flow Measurement:
Demand Flow Measurement is the process of accurately measuring how much compressed air is actually being consumed by the plant at different times of the day. It is done using a flow meter installed in the pipeline. This data helps identify the true air requirement of the plant, instead of relying only on compressor capacity.
• Right-sizing compressors: Often, plants run oversized compressors, wasting electricity. Flow data shows the actual demand so you can optimize.
• Leak detection: By measuring flow during non-production hours, leaks can be quantified in terms of CFM and cost.
• Energy savings: With clear demand patterns, compressors can be operated efficiently, saving up to 20–30% of power cost.

Scope of Work:
Leakage Identification: 
• Leakage identification and tagging is a systematic approach to controlling compressed air losses. 
• During an audit, each leakage point is detected using ultrasonic detectors and then physically tagged with a unique identification label. 
• This tagging ensures that every leak location is documented, prioritized, and can be easily tracked for repair. 
• By tagging each leak point, plants gain a clear action plan for maintenance teams, enabling them to fix the leaks in a structured way instead of random patchwork. 
• This process not only quantifies the cost of each leakage but also helps in monitoring recurring problem areas, ensuring long-term energy savings and reliable system performance.

Our Leakage Detector Overview:
• Leak Detection Principle – Identifies high-frequency ultrasonic sound waves generated when compressed air, gas, or vacuum escapes through small openings.
• Frequency Range – Typically operates between 20 kHz to 100 kHz, beyond the range of human hearing.
• Detection Capability – Can locate very small leaks (as small as 0.05 mm at ~7 bar) from several meters away.
• Feedback System – Provides both audio (headphones) and visual (display or LED bar graph) indications to pinpoint leaks.
• Sensitivity & Adjustability – Equipped with adjustable sensitivity to distinguish between background noise and actual leak sounds.
• Portability & Power – Lightweight, handheld device powered by rechargeable or replaceable batteries with 6–10 hours’ runtime.
• Applications – Used for compressed air systems, gas pipelines, vacuum systems, steam traps, and refrigerant leak detection without interrupting operations.`;

export const DEFAULT_COMPRESSOR_AIR_AUDIT_STEP6_TEXT = `Commercials: Support required from the client:
• SPOC (Single point of Contact) for support and coordination during the audit phase
• Accessibility to each area.
• 1 person required from client side with knowledge on Compressed air line to reach out from the generation to end use for leakage identifications.

Terms and Conditions:
• Payment schedule: 50% advance against the PO and remaining 50% against the report submission.
• Applicable taxes and duties will be extra.
• Boarding and Travel Expenses are inclusive of the cost mentioned above.

Submitted By,
Thanakarthik Kumar
Founder & Managing Director
+91-8377007638
thanakarthik@sustainabyte.ai

Bank Account details:
Bank – Bank of Baroda
Account Number – 35860200000750
IFSC – BARB0VELACH (fifth letter is ZERO)
Branch – VELACHERY BRANCH
GSTIN NO – 33ABNCS4869A1Z7
PAN Number – ABNCS4869A`;

export const DEFAULT_MIXTURE_GAS_LEAKAGE_AUDIT_STEP5_TEXT = `Gas System Leakage Audit

System Mapping and Data Collection: Conduct a comprehensive mapping of the entire gas system, including Gas Yard to end-use equipment.

Leakage Audit: Perform a detailed inspection to identify and quantify gas leaks throughout the system, evaluating their impact on overall system
• The audit will be conducted using precision acoustic imager to detect leakage in compressed air and Gas system

Reporting:
• Provide a comprehensive report detailing including Provide actionable recommendations for optimizing the gas system based on leakage audit including leak repairs and potential energy-saving opportunities.
• Tagging each leakage with mentioned details about location of the leakage, intensity of the leakage, replacement part and repair instruction.

Timeline:
• Day 1: Data Collection, Leakage Audit (Pre Audit).
• Day 2: Analysis and Report Submission. (Off Site).
• Day 3: Post Audit (Once the Rectifications Completed).

Our Leakage Detector Overview:
• Leak Detection Principle – Identifies high-frequency ultrasonic sound waves generated when compressed air, gas, or vacuum escapes through small openings.
• Frequency Range – Typically operates between 20 kHz to 100 kHz, beyond the range of human hearing.
• Detection Capability – Can locate very small leaks (as small as 0.05 mm at ~7 bar) from several meters away.
• Feedback System – Provides both audio (headphones) and visual (display or LED bar graph) indications to pinpoint leaks.
• Sensitivity & Adjustability – Equipped with adjustable sensitivity to distinguish between background noise and actual leak sounds.
• Portability & Power – Lightweight, handheld device powered by rechargeable or replaceable batteries with 6–10 hours’ runtime.
• Applications – Used for compressed air systems, gas pipelines, vacuum systems, steam traps, and refrigerant leak detection without interrupting operations.`;

export const DEFAULT_MIXTURE_GAS_LEAKAGE_AUDIT_STEP6_TEXT = `Mixture Gas Leakage Audit Commercials: Support required from the client:
• SPOC (Single point of Contact) for support and coordination during the audit phase
• Accessibility to each area.
• 1 person required from client side with knowledge on Mixed Gas line to reach out from the generation to end use for leakage identifications

Terms and Conditions:
• Payment schedule: 50% advance against the PO and remaining 50% against the report submission.
• Applicable taxes and duties will be extra.
• Boarding and Travel Expenses are inclusive of the cost mentioned above.

Submitted by,
Thanakarthik
Founder & Managing Director
+91-8377007638
thanakarthik@sustainabyte.ai

Bank Account details:
Bank – Bank of Baroda
Account Number – 35860200000750
IFSC – BARB0VELACH (fifth letter is ZERO)
Branch – VELACHERY BRANCH
GSTIN NO – 33ABNCS4869A1Z7
PAN Number – ABNCS4869A`;

export const DEFAULT_NITROGEN_GAS_LEAKAGE_AUDIT_STEP5_TEXT = `Leakage Identification:

Leakage identification and tagging is a systematic approach to controlling gas losses.
During an audit, each leakage point is detected using ultrasonic detectors and then physically tagged with a unique identification label.
This tagging ensures that every leak location is documented, prioritized, and can be easily tracked for repair.
By tagging each leak point, plants gain a clear action plan for maintenance teams, enabling them to fix the leaks in a structured way instead of random patchwork.
This process not only quantifies the cost of each leakage but also helps in monitoring recurring problem areas, ensuring long-term energy savings and reliable system performance.

Our Leakage Detector Overview:
• Leak Detection Principle – Identifies high-frequency ultrasonic sound waves generated when compressed air, gas, or vacuum escapes through small openings.
• Frequency Range – Typically operates between 20 kHz to 100 kHz, beyond the range of human hearing.
• Detection Capability – Can locate very small leaks (as small as 0.05 mm at ~7 bar) from several meters away.
• Feedback System – Provides both audio (headphones) and visual (display or LED bar graph) indications to pinpoint leaks.
• Sensitivity & Adjustability – Equipped with adjustable sensitivity to distinguish between background noise and actual leak sounds.
• Portability & Power – Lightweight, handheld device powered by rechargeable or replaceable batteries with 6–10 hours’ runtime.
• Applications – Used for compressed air systems, gas pipelines, vacuum systems, steam traps, and refrigerant leak detection without interrupting operations.`;

export const DEFAULT_NITROGEN_GAS_LEAKAGE_AUDIT_STEP6_TEXT = `Commercials: Support required from the client:
• SPOC (Single point of Contact) for support and coordination during the audit phase
• Accessibility to each area.
• 1 person required from client side with knowledge on gas line to reach out from the generation to end use for leakage identifications.

Terms and Conditions:
• Payment schedule: 50% advance against the PO and remaining 50% against the report submission
• Applicable taxes and duties will be extra.
• Boarding and Travel Expenses are inclusive of the cost mentioned above.

Submitted by,
Thanakarthik Kumar
Founder & Managing Director
+91-8377007638
thanakarthik@sustainabyte.ai

Bank Account details:
Bank – Bank of Baroda
Account Number – 35860200000750
IFSC – BARB0VELACH (fifth letter is ZERO)
Branch – VELACHERY BRANCH
GSTIN NO – 33ABNCS4869A1Z7
PAN Number – ABNCS4869A`;

export const DEFAULT_ISO_50001_STEP5_TEXT = `Scope of Work:
Energy Management System  
This Energy Management System includes:
1. Energy Review & Baseline Establishment
• Conduct a detailed energy review of all major energy-consuming systems.
• Develop the Energy Baseline (EnB) based on historical data.
• Identify Significant Energy Uses (SEUs) and opportunities for improvement.
2. Energy Performance Indicators (EnPIs) Development
• Define suitable EnPIs for monitoring and evaluating energy performance.
• Establish system for periodic tracking and reporting.
3. Gap Analysis & Compliance Assessment
• Perform a gap analysis of current practices against ISO 50001 requirements.
• Provide a roadmap and action plan to achieve compliance.
4. Energy Management System Documentation
• Prepare and implement mandatory ISO 50001 documents:
  - Energy Policy
  - Procedures, SOPs, and Work Instructions
  - Roles, Responsibilities & Authorities
  - Risk assessment and operational control documents
• Create templates for monitoring, measurement, and reporting.
5. Training & Capacity Building
• Conduct awareness training for employees at all levels.
• Conduct specialized training for the Energy Team on EnMS implementation and SEU management.
6. Identification of Energy Saving Opportunities
• Evaluate operational controls, processes, and equipment efficiency.
• Provide a detailed list of energy conservation measures (ECMs) with estimated savings.
7. Internal Audit Preparation & Support
• Develop an internal audit plan, checklist, and guidelines.
• Conduct mock/internal audits and issue audit reports.
8. Management Review Facilitation
• Guide management review meetings as per ISO 50001 requirements.
• Ensure top management involvement and decision-making for continual improvement.
9. Implementation Monitoring & Corrective Actions
• Review implementation status, assign corrective actions, and track closure.
• Update EnMS documents based on feedback.

Energy Monitoring System Implementation:
• Creating Basic Energy Monitoring infrastructure including connecting 2 existing energy meters and additional 6 Energy meters and applicable modems and consumables.
• Implementing equipment level energy monitoring system using meters with critical alerts and alarms.
• Providing Custom dashboards and enabling alerts & reports.`;

export const DEFAULT_ISO_50001_STEP6_TEXT = `Cost Estimate:
Terms and Conditions:
• Payment schedule 40% advance against PO , 20% after Site Completion and 40% against Report Submission
• Applicable taxes and duties will be extra
• Boarding and Travel Expenses are inclusive .

List of Customers:
1. Aatral Engineering
2. Velmurugan Heavy Engineering Industries Private Limited
3. 20cube Logistics Solutions Private Limited
4. Danfoss Industries Private Limited
5. Knowledge Bridge
6. S G Snacks India Pvt. Ltd.
7. 20cube Logistics Solutions Private Limited
8. Parekhplast India Limited
9. PMEL Oragadam Private Limited - Unit 3
10. PMEL Oragadam Private Limited - Unit 4
11. Lucas Tvs Limited-Padi
12. Visalam Technologies LLP
13. Adspaas Polymer Solutions Limited
14. Wheels India Limited
15. India Metal One Steel Plate Processing Pvt. Ltd
16. India Metal One Steel Plate Processing Pvt. Ltd
17. Glow guard (A Unit Of Green Pearl Engineering Construction Corporation Pvt Ltd) (SRM University)
18. Aisan Auto Parts India Private Limited
19. India Metal One Steel Plate Processing Pvt. Ltd
20. Whirlpool of India Limited
21. ITC - Medak Ltd
22. Kone Elevator India Private Limited
23. KPR Mill Limited
24. Arni Engineering Tech Private Ltd
25. Growserve Enterprises-Ashirwad
26. Vashi Integrated Solution Limited
27. Development Environergy Services Limited - IIT Hyderabad

Submitted by,
Thanakarthik
Founder & Managing Director
+91-8377007638
thanakarthik@sustainabyte.ai

Bank Account details:
Bank – Bank of Baroda
Account Number – 35860200000750
IFSC – BARB0VELACH (fifth letter is ZERO)
Branch – VELACHERY BRANCH
GSTIN NO – 33ABNCS4869A1Z7
PAN Number – ABNCS4869A

THANK YOU`;


export interface CompressorRoiData {
  phaseTitle: string;
  phaseDesc: string;
  quantity: string;
  leakCfm: number;
  monthlyKwhLoss: number;
  annualKwhLoss: number;
  electricityCostPerKwh: number;
  monthlyLossRs: number;
  annualLossRs: number;
  totalAnnualRecoverableSavingRs: number;
  investmentRs: number;
  paybackYears: number;
  paybackMonths: number;
}

export const DEFAULT_COMPRESSOR_ROI_DATA: CompressorRoiData = {
  phaseTitle: 'PHASE-2',
  phaseDesc: 'Air Leakage Rectification at Scopes Identified in the Phase-1 with Materials.',
  quantity: '5 Days',
  leakCfm: 68,
  monthlyKwhLoss: 6114,
  annualKwhLoss: 73368,
  electricityCostPerKwh: 9.0,
  monthlyLossRs: 55026,
  annualLossRs: 660312,
  totalAnnualRecoverableSavingRs: 660312,
  investmentRs: 175000,
  paybackYears: 0.27,
  paybackMonths: 3,
};

export const DEFAULT_ASHRAE_LEVEL_2_STEP6_TEXT = `Payment Terms:
• 40% advance against receipt of Purchase Order (PO)
• 30% upon completion of site assessment
• 15% upon Submission of Draft Report
• 15% upon submission of the final report
• Applicable taxes and duties shall be charged extra, as applicable
• All lodging, boarding, and travel expenses are included
• The quote is valid for 45 days from the date of submission
• Payment within 15 days from the date of invoice

Other Terms and Conditions:
• The customer shall be responsible for facilitating work visa applications and issuance, including managing all required documentation and bearing the associated application fees, as well as handling customs clearance of instruments.
• Customer shall arrange a skilled individual (Authorized technicians) for the entire duration of the audit period for local co-ordination with site team for seeking approval or work permits and installation of energy auditing equipment with proper safety measures.`;

export const DEFAULT_HVAC_DESIGN_STEP5_TEXT = `Objective:
The objective of this study is to evaluate and design a system to replace the existing chilled water supply (18°C) to the Temperature Control Units (TCUs) serving Zones 1–3 of Mixers 11, 12, 13, 14, and 16, with cooling tower water at 30–31°C.
The goal is to ensure that all TCUs continue to meet the required outlet temperature and process performance when supplied from the new cooling tower water system.

Scope of Work:
The study will determine the design, equipment specification, piping layout and operational implications to ensure the TCUs reliably achieve required outlet temperatures under the proposed cooling tower water system.
The scope includes:
• Technical assessment and design development for replacing existing chilled water with new cooling tower water.
• Mixer Phase 2 (3nos of cooling tower each 300TR Capacity) and Phase 3 (3nos of cooling tower each 400 TR capacity) actual heat load Design Vs Actual.
• Identification of all related mechanical
• Preparation of cost for execution.

Site Visit and Data Collection:
1) Data Collection & Site Survey – Review existing system parameters, layouts, and space availability.
2) Thermal & Hydraulic Sizing – For cooling tower, circulation pumps, and headers.
3) Distribution System Design – Piping layout, balancing valves, and routing optimization.

Assumptions:
• Cooling tower inlet water temperature available at 30–31°C.
• Adequate space available for installation of cooling tower, basin, and ancillary equipment.
• Existing TCUs are compatible for operation with 30–31°C inlet water after required modifications.

Exclusions:
• Detailed procurement, fabrication, and installation works (to be covered under a separate contract).
• Civil and structural design are not included in this scope
• Electrical and controls are not included in this scope
• Water parameters requirement are not in scope
• Any unrelated process modifications outside the defined TCU scope`;

export const DEFAULT_HVAC_DESIGN_STEP6_TEXT = `Terms and Conditions:
• Payment schedule 40% advance against PO , 20% after Site Completion and 40% against Report Submission.
• Applicable taxes and duties will be extra.
• Boarding and Travel Expenses are inclusive .

Bank Account details:
Bank – Bank of Baroda
Account Number – 35860200000750
IFSC – BARB0VELACH (fifth letter is ZERO)
Branch – VELACHERY BRANCH
GSTIN NO – 33ABNCS4869A1Z7
PAN Number – ABNCS4869A`;

export const DEFAULT_EC_FAN_STEP5_TEXT = `Scope of Work:
The scope of this proposal includes the supply of EC Fans as per the agreed specifications and quantity requirements.

Key Features:
• High-efficiency EC motor technology.
• Lower power consumption compared to conventional AC motor-driven fans.
• Integrated speed control for precise airflow regulation.
• Reduced maintenance requirements.
• Improved reliability and operational performance.
• Lower noise levels and heat generation.

Benefits:
• Energy savings through high motor efficiency and optimized speed control.
• Improved system performance and airflow management.
• Reduced carbon footprint and operating expenses.
• Enhanced equipment life due to reduced mechanical stress.`;

export const DEFAULT_EC_FAN_STEP6_TEXT = `Payment Terms:
• 50% advance against receipt of Purchase Order (PO)
• 50% before dispatch of EC Fans
• Installation and commissioning charges are exclusive.
• Transportation/Freight charges as actual.
• Electrical cabling and accessories beyond the scope of supply.
• Civil or structural modifications, if any.
• Applicable GST.
• The quote is valid for 45 days from the date of submission
• Payment within 7 days from the date of invoice

Bank Account details:
Bank – Bank of Baroda
Account Number – 35860200000750
IFSC – BARB0VELACH (fifth letter is ZERO)
Branch – VELACHERY BRANCH
GSTIN NO – 33ABNCS4869A1Z7
PAN Number – ABNCS4869A`;

// ─── Water Management Solution Template Defaults ─────────────────────────────────

export const DEFAULT_WATER_MANAGEMENT_STEP5_TEXT = `Scope of Work:

The scope of work for the Water Management System (WMS) includes the design, supply, installation, and commissioning of a comprehensive solution to monitor and manage water consumption across the facility. The system will enable real-time tracking of water usage through flow meters and sensors installed at key points such as inlet sources, storage tanks, and distribution lines. It will provide automated data collection, analysis, and reporting to identify consumption patterns, leakages, and inefficiencies.

The solution will include a centralized dashboard for monitoring, alert generation for abnormal usage, and integration with existing systems if required. Additionally, the scope covers calibration of instruments, user training, and technical support during the implementation and maintenance phases to ensure optimal system performance and sustainability.

Water Management System:
Digitalization is poised to revolutionize water management, making it more efficient, sustainable, and resilient in the face of growing demands and climate change impacts. While challenges exist, the benefits of adopting these technologies are significant for ensuring a water-secure future. Water management digitalization refers to the application of digital technologies to monitor, analyse, and manage water resources across various sectors, including municipal, industrial, and agricultural. It is about using technology to make water management smarter, more efficient, and more sustainable.

Key Digitalization Pillars:
• Real-time Data Collection
• Data Analytics and AI insights`;

export const DEFAULT_WATER_MANAGEMENT_STEP6_TEXT = `Support required from the client:
• Consumables and related activities need to be handled by the customer as per actual requirements.
• Data confirmation and report acceptance sign off will be customer SPOC scope.
• Water shutdown and fixing of meter line to be arranged by the customer.
• All meter changes and cable looping work to be carried out by customer’s qualified technicians.
• A dedicated SPOC (Single Point of Contact) to be assigned for support and coordination during installation and commissioning.
• SPOC is responsible for reviewing alerts and reports as per requirements.
• Customer to ensure accessibility to all required areas.
• Shutdown to be arranged by the customer for new energy meter integration, if required.

Terms and Conditions:

Payment schedule
• Supply of hardware – 100% upfront
• Software payment – 70% advance payment & remaining 30% after dashboard finalization 
• Installation and commissioning – 70% advance payment & remaining 30% after work completion 
• Applicable taxes and duties will be extra
• Project timelines depend on Shutdowns provided for fixing sensors. The timelines for execution will be mutually discussed and agreed during the project kick-off discussion.
• All kinds of approvals, work permission and site pass if required.
• Clients should do any third-party contractor’s co-ordination at site.
• Secure onsite storage area and all soft integration support.
• Any material beyond current scope will be charged as actual.`;

export const INITIAL_WATER_MANAGEMENT_GATEWAY_HARDWARE_ROWS: EmsHardwareRow[] = [
  {
    id: 'wms_h1a',
    code: '1a',
    category: 'Water Management IoT Gateway Hardware',
    description: 'Supply of 4G IoT Gateway for Water Monitoring with SIM card, SMPS & High-gain Antenna - Edge Pro',
    qty: 0,
    uom: 'Nos',
    unitCost: 0,
    marginPct: 40,
  },
  {
    id: 'wms_h1b',
    code: '1b',
    category: 'Water Flow & Level Instrumentation',
    description: 'Supply of Electromagnetic / Ultrasonic Water Flow Meter with RS485 Modbus Communication',
    qty: 0,
    uom: 'Nos',
    unitCost: 0,
    marginPct: 40,
  },
  {
    id: 'wms_h1c',
    code: '1c',
    category: 'Water Flow & Level Instrumentation',
    description: 'Supply of Hydrostatic / Ultrasonic Water Level Transmitter for Storage Tanks',
    qty: 0,
    uom: 'Nos',
    unitCost: 0,
    marginPct: 40,
  },
];

export const INITIAL_WATER_MANAGEMENT_ELECTRICAL_HARDWARE_ROWS: EmsHardwareRow[] = [
  {
    id: 'wms_h2a',
    code: '2a',
    category: 'Electrical & Communication Cabling',
    description: 'Supply of 2 core RS 485 Shielded & Armoured Communication Cable for Water Meters & Gateway',
    qty: 0,
    uom: 'Coil',
    unitCost: 0,
    marginPct: 40,
  },
  {
    id: 'wms_h2b',
    code: '2b',
    category: 'Piping & Protection Conduit',
    description: 'Supply of 1" Heavy Duty Conduit Pipes and UV Protected Sleeves',
    qty: 0,
    uom: 'Nos',
    unitCost: 0,
    marginPct: 40,
  },
  {
    id: 'wms_h2c',
    code: '2c',
    category: 'Installation Consumables',
    description: 'Supply of IP67 Weatherproof Junction Boxes, Glands, Flange Gaskets, Fasteners & Mounting Accessories',
    qty: 0,
    uom: 'Job',
    unitCost: 0,
    marginPct: 40,
  },
];

export const INITIAL_WATER_MANAGEMENT_PLATFORM_ROWS: EmsPlatformRow[] = [
  {
    id: 'wms_p1',
    description:
      'Water Management System (WMS) Configuration, Modbus/RS485 sensor mapping, and centralized cloud dashboard setup\nReal-time water consumption tracking, leakage detection rule configuration, and alert notification triggers\nEnd-to-end sensor calibration, functional validation, water flow benchmarking, and handover documentation\nUser training for operations team and technical support during implementation phase',
    qty: 0,
    uom: 'Nodes',
    unitCost: 0,
    marginPct: 40,
  },
];

export const INITIAL_WATER_MANAGEMENT_RECURRING_ROWS: EmsRecurringRow[] = [
  {
    id: 'wms_r1',
    code: '1a',
    description: 'Recurring GSM-GPRS 4G IoT SIM Card telemetry charges with annual cloud connectivity for Water Gateway.',
    qty: 0,
    uom: 'Nos',
    unitCostPerMonth: 125,
    marginPct: 40,
  },
  {
    id: 'wms_r2',
    code: '1b',
    description:
      'OptiByte Water Management Cloud Platform: Real-time Water Flow & Tank Level Monitoring, AI-driven Leakage & Anomaly Alerts, Daily/Monthly Consumption Reports, Automated SPOC Notifications.',
    qty: 0,
    uom: 'Nodes',
    unitCostPerMonth: 100,
    marginPct: 40,
  },
];

export const SERVICE_CATEGORY_OPTIONS = [
  'Energy Audit Services',
  'IoT & Controls',
  'Chiller Management',
  'Welding',
  'Automation',
  'IR Blaster',
  'BMS',
  'Hardware',
];

export const IR_BLASTER_SUB_SERVICES = [
  'Old IR Blaster',
  'New IR Blaster',
];

export const BMS_CATEGORY_SUB_SERVICES = [
  'BMS',
];

export const AUTOMATION_SUB_SERVICES = [
  'Compressed Air Automation',
  'Water Automation',
];

export const CHILLER_MANAGEMENT_SUB_SERVICES = [
  'CPM (Chiller Plant Management)',
];

export const ENERGY_AUDIT_SUB_SERVICES = [
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

export const PROJECTS_SUB_SERVICES = [
  'Optibyte',
  'Digiweld',
  'Tec Byte',
  'Fix Byte',
  'Compass',
];

export const IOT_SERVICES_SUB_SERVICES = [
  'Energy Management Solution',
  'Compressed Air Monitoring',
  'IoT Platform',
  'Water Management Solution',
];

export const WELDING_IOT_SUB_SERVICES = [
  'Welding IoT & Kit',
  'Digiweld',
];

export const INITIAL_CPM_HARDWARE_ROWS: CpmHardwareRow[] = [
  {
    id: 'cpm_1',
    slNo: 1,
    brand: '',
    itemDescription: 'Server PC / Workstation',
    modelNo: '',
    qty: 0,
    uom: 'Nos',
    unitCost: 80000,
    marginPct: 40,
  },
  {
    id: 'cpm_2',
    slNo: 2,
    brand: '',
    itemDescription: '21" Colour Monitor',
    modelNo: '',
    qty: 0,
    uom: 'Nos',
    unitCost: 15000,
    marginPct: 40,
  },
  {
    id: 'cpm_3',
    slNo: 3,
    brand: '',
    itemDescription: 'RTD Sensor for Both Evaporator & Condesor',
    modelNo: '',
    qty: 0,
    uom: 'Nos',
    unitCost: 10000,
    marginPct: 40,
  },
  {
    id: 'cpm_4',
    slNo: 4,
    brand: '',
    itemDescription: 'DP transmitter',
    modelNo: '',
    qty: 0,
    uom: 'Nos',
    unitCost: 28000,
    marginPct: 40,
  },
  {
    id: 'cpm_5',
    slNo: 5,
    brand: '',
    itemDescription: 'Flow Switch',
    modelNo: '',
    qty: 0,
    uom: 'Nos',
    unitCost: 8000,
    marginPct: 40,
  },
  {
    id: 'cpm_6',
    slNo: 6,
    brand: '',
    itemDescription: 'Atmospheric humidity & Temperature',
    modelNo: '',
    qty: 0,
    uom: 'Nos',
    unitCost: 10000,
    marginPct: 40,
  },
  {
    id: 'cpm_7',
    slNo: 7,
    brand: 'BACSYS',
    itemDescription: 'BACsys APEX 200A IoT Edge Gateway (2× RS485, 1× GbE)',
    modelNo: 'APEX200A',
    qty: 0,
    uom: 'Nos',
    unitCost: 36985,
    marginPct: 40,
  },
  {
    id: 'cpm_8',
    slNo: 8,
    brand: 'BACSYS',
    itemDescription: 'BACsys NEXIS RT-M26 Main Controller (UI×8, AO×4, DI×8, DO×6)',
    modelNo: 'NEXISRTM26',
    qty: 0,
    uom: 'Nos',
    unitCost: 14764,
    marginPct: 40,
  },
  {
    id: 'cpm_9',
    slNo: 9,
    brand: 'BACSYS',
    itemDescription: 'BACsys NEXIS RT-D16 Digital Expander (DI×12, DO×4)',
    modelNo: 'NEXISRTD16',
    qty: 0,
    uom: 'Nos',
    unitCost: 8957,
    marginPct: 40,
  },
  {
    id: 'cpm_10',
    slNo: 10,
    brand: 'Generic/OEM',
    itemDescription: 'Control Panel Enclosure, DIN rail, terminal blocks, wiring (per plant)',
    modelNo: 'PANEL-BMS-STD',
    qty: 0,
    uom: 'Nos',
    unitCost: 60000,
    marginPct: 40,
  },
];

export const INITIAL_CPM_ELECTRICAL_ROWS: CpmHardwareRow[] = [
  {
    id: 'cpm_e_11',
    slNo: 11,
    brand: 'Generic/OEM',
    itemDescription: 'Screened shielded twisted-pair RS-485 cable, per meter',
    modelNo: 'CBL-RS485-9841',
    qty: 0,
    uom: 'Mtr',
    unitCost: 50,
    marginPct: 40,
  },
  {
    id: 'cpm_e_12',
    slNo: 12,
    brand: 'Generic/OEM',
    itemDescription: 'Unscreened shielded 2 core 1 sqmm, per meter',
    modelNo: '',
    qty: 0,
    uom: 'Mtr',
    unitCost: 50,
    marginPct: 40,
  },
  {
    id: 'cpm_e_13',
    slNo: 13,
    brand: 'Cable tray',
    itemDescription: '300mm widthX 50mm Height - GI tray',
    modelNo: '',
    qty: 0,
    uom: 'Mtr',
    unitCost: 250,
    marginPct: 40,
  },
  {
    id: 'cpm_e_14',
    slNo: 14,
    brand: 'Cable tray',
    itemDescription: '100mm widthX 50mm Height - GI tray',
    modelNo: '',
    qty: 0,
    uom: 'Mtr',
    unitCost: 200,
    marginPct: 40,
  },
  {
    id: 'cpm_e_15',
    slNo: 15,
    brand: '',
    itemDescription: 'PVC Conduct pipe',
    modelNo: '',
    qty: 0,
    uom: 'Mtr',
    unitCost: 25,
    marginPct: 40,
  },
  {
    id: 'cpm_e_16',
    slNo: 16,
    brand: '',
    itemDescription: 'Other accessories',
    modelNo: '',
    qty: 0,
    uom: 'Set',
    unitCost: 20000,
    marginPct: 40,
  },
];

export const INITIAL_CPM_COMMISSIONING_MANPOWER_ROWS: ManpowerRow[] = [
  {
    id: 'cpm_comm_1',
    name: 'Vijayan',
    roleLevel: 'SENIOR_ENERGY',
    foodRatePerDay: 600,
    siteWorkCost: 80000,
    reportWorkCost: 0,
    siteWorkingDays: 0,
    reportWorkingDays: 0,
  },
];

export const INITIAL_CPM_INSTALLATION_ROWS: CpmHardwareRow[] = [
  {
    id: 'cpm_inst_1',
    slNo: 1,
    brand: '',
    itemDescription: 'Installation and Commissioning Charges (IoT devices, gateways, modems, electrical/control components, cable routing, conduit laying, network setup & validation)',
    modelNo: '',
    qty: 0,
    uom: 'Job',
    unitCost: 115000,
    marginPct: 40,
  },
];

export const INITIAL_CPM_INSTALLATION_MANPOWER_ROWS: ManpowerRow[] = [
  {
    id: 'cpm_inst_m1',
    name: 'Lead Installation Engineer',
    roleLevel: 'IOT_ENGINEER',
    foodRatePerDay: 500,
    siteWorkCost: 3500,
    reportWorkCost: 0,
    siteWorkingDays: 0,
    reportWorkingDays: 0,
  },
  {
    id: 'cpm_inst_m2',
    name: 'Electrical & Cabling Technician',
    roleLevel: 'JUNIOR_ENERGY',
    foodRatePerDay: 400,
    siteWorkCost: 2500,
    reportWorkCost: 0,
    siteWorkingDays: 0,
    reportWorkingDays: 0,
  },
];

export const INITIAL_CPM_ON_PREMISE_ROWS: CpmOnPremiseRow[] = [
  {
    id: 'cpm_onprem_1',
    commercialLayer: 'Controller-Gateway To OptiByte Platform',
    qty: 0,
    unitCost: 100000,
    marginPct: 40,
  },
  {
    id: 'cpm_onprem_2',
    commercialLayer: 'Application / Configuration Charge',
    qty: 0,
    unitCost: 100000,
    marginPct: 40,
  },
];

export const INITIAL_CPM_CLOUD_CHARGE_ROWS: CpmCloudChargeRow[] = [
  {
    id: 'cpm_cld_1',
    basis: 'Monthly',
    calculation: 'Base cost',
    qty: 0,
    unitCost: 20000,
    marginPct: 40,
  },
  {
    id: 'cpm_cld_2',
    basis: 'Annual',
    calculation: 'Month × 12',
    qty: 0,
    unitCost: 240000,
    marginPct: 40,
  },
];

export const INITIAL_CPM_CLOUD_ROWS: any[] = [];




export const INITIAL_WELDING_HARDWARE_ROWS: WeldingHardwareRow[] = [
  { id: 'wh_1', slNo: 1, componentName: 'Microcontroller (Sim based) & components', qty: 0, unitCost: 8300, marginPct: 40, unitPrice: 13833 },
  { id: 'wh_2', slNo: 2, componentName: 'I²C GPIO Expander', qty: 0, unitCost: 1000, marginPct: 40, unitPrice: 1667 },
  { id: 'wh_3', slNo: 3, componentName: 'Voltage sensor', qty: 0, unitCost: 7000, marginPct: 40, unitPrice: 11667 },
  { id: 'wh_4', slNo: 4, componentName: 'Current sensor', qty: 0, unitCost: 9000, marginPct: 40, unitPrice: 15000 },
  { id: 'wh_5', slNo: 5, componentName: 'Gas flow sensor', qty: 0, unitCost: 20000, marginPct: 40, unitPrice: 33333 },
  { id: 'wh_6', slNo: 6, componentName: 'RFID', qty: 0, unitCost: 1500, marginPct: 40, unitPrice: 2500 },
  { id: 'wh_7', slNo: 7, componentName: 'OLED Display 2.4” I²C', qty: 0, unitCost: 800, marginPct: 40, unitPrice: 1333 },
  { id: 'wh_8', slNo: 8, componentName: 'Keyboard Matrix', qty: 0, unitCost: 4000, marginPct: 40, unitPrice: 6667 },
  { id: 'wh_9', slNo: 9, componentName: 'USB Pendrive (8GB industrial grade)', qty: 0, unitCost: 600, marginPct: 40, unitPrice: 1000 },
  { id: 'wh_10', slNo: 10, componentName: 'USB Host Shield', qty: 0, unitCost: 2400, marginPct: 40, unitPrice: 4000 },
  { id: 'wh_11', slNo: 11, componentName: 'DS3231 RTC Module', qty: 0, unitCost: 400, marginPct: 40, unitPrice: 667 },
  { id: 'wh_12', slNo: 12, componentName: 'SMPS 24V 3A Power Supply (Industrial)', qty: 0, unitCost: 2400, marginPct: 40, unitPrice: 4000 },
  { id: 'wh_13', slNo: 13, componentName: 'Industrial Grade Enclosure', qty: 0, unitCost: 4000, marginPct: 40, unitPrice: 6667 },
  { id: 'wh_14', slNo: 14, componentName: 'Miscellaneous Components', qty: 0, unitCost: 8000, marginPct: 40, unitPrice: 13333 },
  { id: 'wh_15', slNo: 15, componentName: 'Kit Development', qty: 0, unitCost: 30000, marginPct: 40, unitPrice: 50000 },
];

export const INITIAL_DIGIWELD_SOFTWARE_ROWS: WeldingSoftwareRow[] = [
  { id: 'dw_1', item: 'UI/UX Table Design for Documents (Mobile)', description: 'UI/UX Table Design for Documents (Mobile)', qty: 0, uom: 'Job', unitCost: 20000, marginPct: 40, unitPrice: 33333, price: 0 },
  { id: 'dw_2', item: 'Backend API for Table (Mobile)', description: 'Backend API for Table (Mobile)', qty: 0, uom: 'Job', unitCost: 20000, marginPct: 40, unitPrice: 33333, price: 0 },
  { id: 'dw_3', item: 'Dashboard Report Generation UI/UX & Backend API (Web)', description: 'Dashboard Report Generation UI/UX & Backend API (Web)', qty: 0, uom: 'Job', unitCost: 10000, marginPct: 40, unitPrice: 16667, price: 0 },
  { id: 'dw_4', item: 'Paint Defect Mapping with Weld Tracker Sheet UI & Backend (Mobile)', description: 'Paint Defect Mapping with Weld Tracker Sheet UI & Backend (Mobile)', qty: 0, uom: 'Job', unitCost: 15000, marginPct: 40, unitPrice: 25000, price: 0 },
  { id: 'dw_5', item: '785HP ETO – 6770030 Data Conversion', description: '785HP ETO – 6770030 Data Conversion', qty: 0, uom: 'Job', unitCost: 3000, marginPct: 40, unitPrice: 5000, price: 0 },
  { id: 'dw_6', item: '785 HP Updated Floor Data Conversion', description: '785 HP Updated Floor Data Conversion', qty: 0, uom: 'Job', unitCost: 3000, marginPct: 40, unitPrice: 5000, price: 0 },
  { id: 'dw_7', item: '785HP ETO NDT Report Integration', description: '785HP ETO NDT Report Integration', qty: 0, uom: 'Job', unitCost: 2500, marginPct: 40, unitPrice: 4167, price: 0 },
  { id: 'dw_8', item: 'Weld Try Out Report Integration', description: 'Weld Try Out Report Integration', qty: 0, uom: 'Job', unitCost: 1000, marginPct: 40, unitPrice: 1667, price: 0 },
  { id: 'dw_9', item: 'LPA Checksheet Integration', description: 'LPA Checksheet Integration', qty: 0, uom: 'Job', unitCost: 1000, marginPct: 40, unitPrice: 1667, price: 0 },
  { id: 'dw_10', item: 'Paint Defect Mapping Backend Creation', description: 'Paint Defect Mapping Backend Creation', qty: 0, uom: 'Job', unitCost: 10000, marginPct: 40, unitPrice: 16667, price: 0 },
  { id: 'dw_11', item: 'Paint Defect Mapping UI Creation', description: 'Paint Defect Mapping UI Creation', qty: 0, uom: 'Job', unitCost: 10000, marginPct: 40, unitPrice: 16667, price: 0 },
  { id: 'dw_12', item: 'Paint Defect Mapping – Per 5 Files', description: 'Paint Defect Mapping – Per 5 Files', qty: 0, uom: 'Job', unitCost: 5000, marginPct: 40, unitPrice: 8333, price: 0 },
  { id: 'dw_13', item: 'Weld Station Planned Method Conformance Audit Checksheet', description: 'Weld Station Planned Method Conformance Audit Checksheet', qty: 0, uom: 'Job', unitCost: 1000, marginPct: 40, unitPrice: 1667, price: 0 },
  { id: 'dw_14', item: 'Work Station Audit Integration', description: 'Work Station Audit Integration', qty: 0, uom: 'Job', unitCost: 1000, marginPct: 40, unitPrice: 1667, price: 0 },
  { id: 'dw_15', item: 'Testing & Deployment', description: 'Testing & Deployment', qty: 0, uom: 'Job', unitCost: 5000, marginPct: 40, unitPrice: 8333, price: 0 },
  { id: 'dw_16', item: 'Buffer / Miscellaneous', description: 'Buffer / Miscellaneous', qty: 0, uom: 'Job', unitCost: 500, marginPct: 40, unitPrice: 833, price: 0 },
];

export const INITIAL_DIGIWELD_CLOUD_ROWS: WeldingCloudRow[] = [
  { id: 'dwc_1', component: 'Database Hosting (MongoDB Atlas)', description: 'MongoDB Atlas Dedicated/Shared Cloud Database', type: 'MongoDB Atlas', qty: 0, uom: 'Month', unitMonthlyCost: 1000, monthlyCost: 0, marginPct: 40, unitMonthlyPrice: 1667, monthlyPrice: 0, yearlyPrice: 0 },
  { id: 'dwc_2', component: 'Firebase Authentication', description: 'User security, OTP & Multi-role Auth', type: 'Firebase', qty: 0, uom: 'Month', unitMonthlyCost: 1000, monthlyCost: 0, marginPct: 40, unitMonthlyPrice: 1667, monthlyPrice: 0, yearlyPrice: 0 },
  { id: 'dwc_3', component: 'Push Notifications (FCM / One Signal)', description: 'Critical quality alerts, audit notifications', type: 'FCM / OneSignal', qty: 0, uom: 'Month', unitMonthlyCost: 500, monthlyCost: 0, marginPct: 40, unitMonthlyPrice: 833, monthlyPrice: 0, yearlyPrice: 0 },
  { id: 'dwc_4', component: 'Monitoring & Backup (Basic)', description: 'Daily database snapshots, uptime monitoring', type: 'Backup', qty: 0, uom: 'Month', unitMonthlyCost: 2000, monthlyCost: 0, marginPct: 40, unitMonthlyPrice: 3333, monthlyPrice: 0, yearlyPrice: 0 },
  { id: 'dwc_5', component: 'Support & Maintenance (Basic)', description: 'Bug fixes, ticket response & platform SLA support', type: 'SLA Support', qty: 0, uom: 'Month', unitMonthlyCost: 2000, monthlyCost: 0, marginPct: 40, unitMonthlyPrice: 3333, monthlyPrice: 0, yearlyPrice: 0 },
];

export const DEFAULT_DIGIWELD_STEP5_TEXT = `Scope of Work:
Development of a centralized digital platform for BIQ data digitalization, Weld Engineering Documents & NDT Reports management, Paint Defect Mapping, and Weld Audit monitoring. The solution includes real-time dashboards, defect trend analysis, process traceability, audit tracking, and AI-powered reporting to improve manufacturing quality, compliance, and operational efficiency.

BIQ Data Digitalization:
Digitalization of BIQ inspection and quality records through a centralized platform for real-time monitoring and traceability. The system enables defect tracking, inspection logging, and dashboard-based analytics for improved quality control and reporting.

Weld Engineering Data Digitalization:
Development of a digital weld engineering management system to capture weld process data, WPS records, welding parameters, and joint-wise traceability. The platform provides process monitoring, parameter analysis, and centralized documentation management.

Paint Defect Mapping:
Implementation of a paint defect mapping and analysis system for recording, categorizing, and monitoring paint-related defects across production stages. The solution includes trend analysis, Pareto charts, and dashboard visualization for continuous quality improvement.

Weld Audit Documents Digitalization:
Digitalization of weld audit documents, inspection checklists, and compliance records through a structured audit management system. The platform supports audit tracking, corrective action monitoring, document archival, and real-time audit dashboards.

Technologies Used:
● Frontend: Flutter (Android Only)
● Backend: Firebase (Firestore, Auth, Cloud Functions)
● Web App: Next.js, Tailwind css
● Email Notifications: Firebase Email Service or 3rd Party API (e.g., Send Grid)
● State Management: Provider / Riverpod / Bloc

Timeline Estimate:
● UI/UX Design: 2 weeks
● Development (All Features): 4 weeks
● Testing & QA: 2 weeks
● Deployment & Training: 1 week
● Total: 9 weeks

Deliverables:
● Complete mobile app (Android and Web)
● Source code and Firebase configuration
● User manual and technical documentation
● One year of basic support and updates`;

export const DEFAULT_DIGIWELD_STEP6_TEXT = `Support required from the client:
• SPOC (Single point of Contact) from the client’s team is required to coordinate and facilitate smooth implementation, testing, and ongoing support for the system.

Terms and Conditions:
1. Payment schedule:
   • 40% advance against the Purchase Order (PO)
   • 40% upon completion of the Proof of Concept (PoC) period
   • 20% one month after full implementation and successful handover
2. Applicable taxes and duties will be extra
3. Boarding and Travel Expenses are inclusive of the cost mentioned above
4. Sustainabyte Technologies Pvt. Ltd. is committed to maintaining the confidentiality and security of all customer data. Appropriate measures will be taken to prevent unauthorized access or data loss.
5. In case of any data breach due to negligence, the company shall be legally accountable.`;

export const INITIAL_WELDING_SOFTWARE_ROWS: WeldingSoftwareRow[] = [
  {
    id: 'ws_1',
    item: 'Software Development',
    description:
      'UI/UX Design, Email generation, Logic addition (Travel speed, Heat input joint wise, Gas consumption joint wise, Weld deposition joint wise, Arc on time, Energy consumption, Machine calibration due date, Flow meter calibration due date) testing, debugging and further assistance',
    qty: 0,
    uom: 'Units',
    unitPrice: 20000,
    price: 0,
  },
];

export const INITIAL_WELDING_CLOUD_ROWS: WeldingCloudRow[] = [
  { id: 'wc_1', component: 'Cloud VM / MQTT Broker', description: '1 vCPU, 2 GB RAM, 50 GB storage', type: 'Azure B1s', qty: 0, uom: 'Nos', unitMonthlyCost: 600, monthlyCost: 0, marginPct: 40, unitMonthlyPrice: 1000, monthlyPrice: 0, yearlyPrice: 0 },
  { id: 'wc_2', component: 'Database (PostgreSQL)', description: 'Up to 1GB for PoC, expandable', type: 'InfluxDB', qty: 0, uom: 'Nos', unitMonthlyCost: 180, monthlyCost: 0, marginPct: 40, unitMonthlyPrice: 300, monthlyPrice: 0, yearlyPrice: 0 },
  { id: 'wc_3', component: 'Cloud Storage (Backups)', description: 'Daily logs, welding session history', type: '10GB', qty: 0, uom: 'Nos', unitMonthlyCost: 180, monthlyCost: 0, marginPct: 40, unitMonthlyPrice: 300, monthlyPrice: 0, yearlyPrice: 0 },
  { id: 'wc_4', component: 'Subdomain / SSL', description: 'Subdomain naming for IP address', type: 'DNS + SSL', qty: 0, uom: 'Nos', unitMonthlyCost: 60, monthlyCost: 0, marginPct: 40, unitMonthlyPrice: 100, monthlyPrice: 0, yearlyPrice: 0 },
  { id: 'wc_5', component: 'IoT Sim Card', description: 'To transmit data to cloud', type: 'Airtel', qty: 0, uom: 'Nos', unitMonthlyCost: 240, monthlyCost: 0, marginPct: 40, unitMonthlyPrice: 400, monthlyPrice: 0, yearlyPrice: 0 },
];

export const INITIAL_WELDING_INSTALLATION_ROWS: WeldingInstallationRow[] = [
  {
    id: 'wi_1',
    item: 'Installation and Commissioning',
    qty: 0,
    uom: 'Nos',
    unitCost: 15000,
    marginPct: 40,
    unitPrice: 25000,
    price: 0,
  },
];

export const DEFAULT_WELDING_STEP5_TEXT = `Scope of Work:
Scope of Supply:
1. IOT based weld data acquisition & control system including
Hardware: - Current Sensor, Direct Voltage Sensor; Gas flow Sensor (Electronic) and separate digital display to indicate the actual value of the sensors.
a. RFID for Welder tracking
b. I/O Module for Feedback control system
c. Suitable power supply for IoT Kit

2. IOT Kit for tapping analog signals & data transfer to IOT server (wireless) via MQTT protocol

3. IOT server – data communication from MIG/MAG welding power source to Cloud platform

4. Software: - Cloud based Web Software (IOT server)

Customer dependencies and Exclusion in POC (Phase 1)
1. Customer shall to provide necessary access and approval to facility and equipment to perform installation and commissioning activities
2. Customer shall provide internet via WIFI router near to the welding machine for wireless communication between IoT 4.0 hardware kit and Cloud software
3. Customer shall provide required limits and logics to enable the alarms as mentioned above. Upon successful completion of POC customer to provide approval for phase 2 with multiple welding machines

POC / Phase 1 Success Criteria:
1. Completion of hardware installation and Commissioning as per requirement
2. Demonstration of deviation through Online weld parameter deviation indicator
3. Demonstration of live and historic data trends in cloud with deviation alerts and alarms

Timeline:
• 4 Weeks: Kit Production and testing
• 1 Week: Installation and Commissioning of Kits in welding machines
• 1 Week: Configuration of Welding machines to Cloud platform
• 2 Weeks: Validation of POC success criteria

IoT 4.0 Welding benefits:

Phase 1: Hardware Integration, Monitoring, and Control
1. Increased Productivity:
• Minimized Downtime: Automatic restart feature reduces manual intervention.
• Idle Detection: Orange status (idle) highlights non-productive periods for process optimization.
2. Improved Process Control:
• Consistent Welding Quality: Maintains stable voltage, current, and gas flow to reduce weld defects.
• Extended Equipment Life: Protects equipment from over-voltage, over-current, and improper gas flow.
3. Cost Savings:
• Reduced Wastage: Optimizes gas and energy usage, lowering operational costs.
• Preventive Maintenance: Early alerts help avoid costly repairs and unexpected downtime.

Phase 2: Advanced Reporting, Data Analytics & Cloud Integration
1. Data-Driven Decision Making:
• Comprehensive Reporting: Daily, shift-wise, and monthly reports on welding operations; Exportable Excel Reports for detailed analysis.
• Customizable Dashboards: OptiByte Integration visualizes real-time and historical data; Trend Analysis supports predictive maintenance and process optimization.
2. Enhanced Resource Management:
• Energy & Gas Consumption Tracking: Identifies inefficiencies to reduce utility costs; Promotes sustainable practices by setting benchmarks for consumption.
• Arc On-Time Analysis: Monitors machine utilization and identifies high productivity or idle periods; Aids in shift planning and workload management.
3. Proactive Maintenance & Alerts:
• System Health Monitoring: Provides instant notifications if the system is not operational.
4. Increased Operational Efficiency:
• Historical Data Analysis: Improves welding parameters and reduces error rates.
• Predictive Analytics: Schedules maintenance to avoid unexpected failures.
5. Compliance & Reporting:
• Regulatory Compliance: Automated data logging meets safety and quality standards.
• Easy Documentation: Digital records simplify compliance and audits.
6. Financial & Operational Efficiency:
• Energy & Gas Consumption per Shift: Provides insights into operational costs.
• True Arc Energy (kW/hr): Supports cost calculation and efficiency improvements.
• Shielding Gas Consumption: Reduces material costs through efficient usage monitoring.

Use Case Benefits:
The IoT-based Welding Parameter Monitoring System was successfully implemented in a fabrication industry in Chennai, achieving a 100% success rate in real-time data acquisition and performance monitoring.
• Comprehensive Tracking: Monitored gas consumption, arc-on time, and energy usage, enabling precise performance analysis.
• Data-Driven Insights: Generated monthly reports for the customer, providing valuable insights to improve operational efficiency and reduce wastage.
• Real-Time Visibility: Implemented a customizable dashboard with live data and trend graphs, allowing quick decision-making and proactive maintenance.
• Enhanced Productivity: Improved welding process efficiency through continuous monitoring and data-based optimization.`;

export const DEFAULT_WELDING_STEP6_TEXT = `Support required from the client:
• SPOC (Single point of Contact) for support and coordination.
• Maintenance team support for installation. From the electrical team power supply connection, cabling etc.

Terms and Conditions:
1. Customer Shall purchase IOT4.0 Package of Qty: 1 kit for POC /Phase 1.
2. Customer shall monitor & validate the weld productivity & performance for an intended period of 1 month from the date of commissioning of these Qty: 1 kit as per the success criteria. Sustainabyte shall support all installations & service-based queries for IoT 4.0 system purchased under this agreement.
3. Payment Schedule:
   • 70% advance against PO for Hardware supply and installation charges
   • 30% after validating data and logics in Cloud platform
4. IOT 4.0 Online weld data monitoring & control system with Hooter with Tower lamp should be arranged by IOT4.0 System Supplier individually for each machine.
5. The Lead time to dispatch the IOT systems to your factory site is 30 days.
6. Warranty doesn't cover any physical damage, however shall cover the following:
7. Sustainabyte will be liable to replace any hardware parts (excl: under warranty claims) before completion of 1 Year from the date of purchase.
8. Sustainabyte shall not be responsible for any damage, loss or theft regardless of cause for the IOT kits during & after commissioning.
9. Sustainabyte should support & rectify any technical fault in sensor or software without causing any physical damage during entire warranty period.
10. BREAKDOWN SERVICE for IOT Kit Hardware spares & accessories not covered under warranty shall be done by Sustainabyte under additional service charges.
11. Documented Cost Reduction Study (DCRS) support period from Sustainabyte shall be availed after each month on initial 3-month period.`;

export const HARDWARE_SUB_SERVICES = [
  'Dew Point',
  'Flanges',
  'Flowmeter',
  'IAQ Sensor',
  'Temperature Sensor',
];

export const DEFAULT_DEW_POINT_STEP5_TEXT = `Scope of Work:
In this Current proposal, the scope of work is for the supply of an dew point sensor excluding installation and commissioning focuses solely on delivering the hardware to the specified site. This includes product specifications, delivery requirements, documentation, and quality standards, ensuring the meter is ready for later installation by others.

How are we different from other suppliers?
• End-to-end support: Sustainabyte assists with installation and commissioning, ensuring timely project completion.
• IoT based insights: Sustainabyte offers support for an IoT-based real-time online monitoring dashboard.
• Energy Savings: Sustainabyte evaluates and guides industries in achieving energy savings.
• The dashboard’s visualization can be tailored to meet each customer’s specific requirements.

Potential benefits of our platform – All 4 phases:
1. Up Time: Equipment Downtime reduction
2. Energy Savings: Energy consumption and Utility Cost Reduction (1-10 %)
3. Zero Carbon: Contribute to Net Carbon Zero (Scope 1 & Scope 2)
4. HC Optimization: Maintenance Head count optimization (approx. 1.5 HC worth Manual effort saved every day)
5. Capital Cost Saving: Up to 50% Capital Cost and 30-50% of commissioning cost savings compare with traditional BMS / SCADA system

Benefits of our Platform:
1. Real-time alerting: When an asset malfunctions, you can automatically alert the right engineer, and have it repaired before it gets worse.
2. Peak load reporting: Clear insights and tracking on peak load variations to optimize utility and operations.
3. Customization: The dashboard visualization can be tailored to meet each customer’s specific requirements.
4. AI led anomaly detection: Immediately act when anomalies occur (in performance or consumption) to massively reduce time and keep assets performing at their peak.
5. Data driven decision making: Daily report, Data available to download from minute, hourly, daily, monthly to yearly levels right from the tool level.`;

export const DEFAULT_DEW_POINT_STEP6_TEXT = `Commercials:
Terms and Conditions:
• Payment schedule: 100% payment for hardware advance against the PO.
• Applicable taxes and duties will be extra
• Delivery Period: Within 6-8 weeks from date of receipt of advance along with P.O.
• Installation & Commissioning will be done at extra cost
• Warranty: 12 months from the date of supply.

Submitted by,
Mr. Thanakarthik Kumar K
Founder & Managing Director
+91-8377007638
thanakarthik@sustainabyte.ai

Bank Account details:
Bank – Bank of Baroda
Account Number – 35860200000750
IFSC – BARB0VELACH (fifth letter is ZERO)
Branch – VELACHERY BRANCH
GSTIN NO – 33ABNCS4869A1Z7
PAN Number – ABNCS4869A`;

export const DEFAULT_FLANGES_STEP5_TEXT = `Scope of Supply:
In this current proposal, the scope of work is for the supply of industrial flanges focusing solely on delivering the hardware to the specified site. This includes product specifications, delivery requirements, manufacturer documentation, and quality standards, ensuring all flange components and accessories are ready for installation by site engineers.`;

export const DEFAULT_FLANGES_STEP6_TEXT = `Commercials:
Support required from the client:
• SPOC (Single point of Contact) for support and coordination during the audit phase 
• Accessibility to each area. 

Terms and Conditions:
• Payment schedule: 70% advance against the PO and 30% Against Delivery
• Applicable taxes and duties will be extra
• Boarding and Travel Expenses are inclusive of the cost mentioned above.

Submitted by,
Satish Kumar N
Manager - Sales & Operations
+91-7502244664

Bank Account details:
Name: SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED
Account number: 35860200000750
IFSC: BARB0VELACH (fifth letter is ZERO)
Bank name: Bank of Baroda
Branch: VELACHERY BRANCH`;

export const DEFAULT_CPM_STEP5_TEXT = `Annexure – I: Scope of Supply & System Architecture:
Central Plant Monitoring (CPM) System Architecture & Chiller Automation:
• 3 Water Cooled Chillers, 4 Primary CHW Pumps, 4 Secondary CHW Pumps, 6 Condenser Water Pumps, 2 Cooling Tower Fans, 1 Make-up Water Pump
• DDC Control Panel with Power Supply 24VDC, Ethernet Port, AI Module, AO Module, DI Module, DO Module
• Local Server / Workstation (Visualization Web HMI + MQTT Broker)
• Common Hardwired Sensors: CHW Supply & Return Temp, Outdoor Temp & RH, Differential Pressure Transmitter
• Energy Meters (Modbus RTU - RS485 Soft Integration)
• Cloud Dashboard & Analytics Uplink via HTTPS REST API

Notes:
▪ Cabling quantity is considered as per BOQ/Thumb-rule Basis. Any increase/decrease in the quantity shall be billed against the consumed quantity after complete execution of project.
▪ Controller quantity is calculated as per the provided IO summary/equipment quantity, any changes in the same will have price impact.
▪ Mod-bus card for the VFD/ chiller in client's scope.
▪ Installation and services of Sensors, Valves, BTU meters, Flow meters, VFD etc. is not in our scope.
▪ Any Civil work and electrical works not in our scope.
▪ Water, Power & Scaffolding to be provided at FOC at site, unless otherwise agreed mutually.
▪ Any change in the quantity will have price impact on the quoted price.
▪ Adapter box & Network Switch is not in our scope of supply/installation.
▪ Field devices are considered as per the standard design/as per BOQ. Any changes in quantity will have price impact.
▪ Drawings need to be shared for optimization of the project.`;

export const DEFAULT_CPM_STEP6_TEXT = `Annexure – III: Terms & Conditions:
1) Offer Validity: One Month (30 Days)
2) Payment Terms:
   • 50% advance against Pro-Forma Invoice
   • 40% against Supply within 15 days
   • 10% after completion of the project
3) Taxes: As per GST @ 18% (Material Packing & Forwarding / Transport: Inclusive).
4) Delivery: 10 to 12 Weeks from the approved date of PO and Design Document by Customer as per site requirement.
5) Warranty for Supply: 1 year from the date of Delivery of the material at site.
6) If any Power fluctuations / variations for input voltage to Field devices / controllers, device failure is in customer scope.
7) For any environmental effects, damages of devices / controller failure customer is responsible.
8) 5 to 6 weeks after receiving the materials at site Installation & Commissioning will be completed.

Limitation to Liability:
The maximum liability of the Seller for any and all claims, losses, damages, costs and expenses arising from or in connection with this Agreement shall not exceed the amounts actually received by the Seller under this Agreement.

Submitted by,
Thanakarthik
Founder & CEO
+91-8377007638
thanakarthik@sustainabyte.ai

Bank Account details:
Name: SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED
Account number: 35860200000750
IFSC: BARB0VELACH (fifth letter is ZERO)
Bank name: Bank of Baroda
Branch: VELACHERY BRANCH`;

export const DEFAULT_IR_BLASTER_STEP5_TEXT = `Scope of Work:
In this proposal, we will carry out the supply, installation, testing, and commissioning of Seven IR Blasters.

About IR Blaster – AC Energy Solutions:
• Turns standalone AC units into smart, connected systems.
• Eliminates operational inconsistencies and aligns cooling with defined standards.
• Operates on a secure, cloud-connected framework for remote configuration, logging, and diagnostics.
• Plug & Play retrofit – No wiring required.
• Works with major HVAC brands – compatible with split, cassette, and package AC units.

Key Features:
• Smart Alarms – Alerts for AC units left ON during idle hours.
• Centralized Control – Manage multiple AC units from one platform.
• Setpoint Management – Enforce temperature limits to avoid overcooling/overheating.
• Scheduling – Automate ON/OFF based on occupancy or operating hours.

Benefits:
• 10–15% energy savings by eliminating unnecessary runtime and correcting setpoints.
• Ensures measurable temperature discipline in line with BEE recommendations.
• Every 1°C increase in set point can deliver 6–10% energy savings.
• Supports Net Zero strategy by lowering HVAC-related carbon emissions.
• Improves operational efficiency and reduces energy costs.`;

export const DEFAULT_IR_BLASTER_STEP6_TEXT = `Support required from the client:
• SPOC (Single point of Contact) for support and coordination during the installation and Commissioning phase.
• Accessibility to each area.
• 1 person required from the client side with knowledge of electrical routing and provide manpower support for installation.

Terms and Conditions:
• Payment schedule:
   - Supply of hardware – 100% upfront
   - Installation and commissioning – 50% Advance and Balance 50% After successful installation.
• Applicable taxes and duties will be extra.
• The timelines for execution will be mutually discussed and agreed upon during the project kick-off discussion.
• All kinds of authority approvals, work permission, and site passes if required.
• Secure onsite storage area and all soft integration support.
• Any material beyond the current scope will be charged at actuals.

Submitted By:
Thanakarthik
Founder & CEO, Sustainabyte Technologies
+91-8377007638 • thanakarthik@sustainabyte.ai

Bank Account details:
Name: SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED
Account number: 35860200000750
IFSC: BARB0VELACH (fifth letter is ZERO)
Bank name: Bank of Baroda
Branch: VELACHERY BRANCH`;

export const INITIAL_IOT_CONTROLS_HARDWARE_ROWS: IotControlsHardwareRow[] = [
  { id: 'ich_1', slNo: '1', productDescription: 'IR blaster', quantity: 0, unitCost: 4500, marginPct: 40, unitPrice: 7500 },
  { id: 'ich_2', slNo: '2', productDescription: 'Installation and commisioing', quantity: 0, unitCost: 500, marginPct: 40, unitPrice: 833.33 },
  { id: 'ich_3', slNo: '3', productDescription: 'CT', quantity: 0, unitCost: 1500, marginPct: 40, unitPrice: 2500 },
  { id: 'ich_4', slNo: '4', productDescription: 'Energy Meter', quantity: 0, unitCost: 5000, marginPct: 40, unitPrice: 8333.33 },
  { id: 'ich_5', slNo: '5', productDescription: 'Gateway lite', quantity: 0, unitCost: 6000, marginPct: 40, unitPrice: 10000 },
  { id: 'ich_6', slNo: '6', productDescription: 'Gateway pro', quantity: 0, unitCost: 11000, marginPct: 50, unitPrice: 22000 },
  { id: 'ich_7', slNo: '7', productDescription: 'Installation and commisioing(Cable Laying ,Meter Conifguration,Panel Fixing,CT connection,Gateway Conifguration)', quantity: 0, unitCost: 3000, marginPct: 40, unitPrice: 5000 },
  { id: 'ich_8', slNo: '8', productDescription: 'Temperature sensor', quantity: 0, unitCost: 2800, marginPct: 40, unitPrice: 4666.67 },
  { id: 'ich_9', slNo: '9', productDescription: 'HVAC Controller', quantity: 0, unitCost: 7500, marginPct: 40, unitPrice: 12500 },
  { id: 'ich_10', slNo: '10', productDescription: 'Lighting Controller', quantity: 0, unitCost: 7500, marginPct: 40, unitPrice: 12500 },
  { id: 'ich_11', slNo: '11', productDescription: 'Control Panel Box(contactor,selecter switch,wiring, I/O Module)', quantity: 0, unitCost: 9000, marginPct: 40, unitPrice: 15000 },
  { id: 'ich_12', slNo: '12', productDescription: 'Installation and commisioing(Controll logic,cable laying,wiring)', quantity: 0, unitCost: 2000, marginPct: 40, unitPrice: 3333.33 },
];

export const INITIAL_NEW_IR_BLASTER_HARDWARE_ROWS: IotControlsHardwareRow[] = [
  { id: 'nich_1', slNo: '1', productDescription: 'IR blaster', quantity: 0, unitCost: 5000, marginPct: 40, unitPrice: 8333.33 },
  { id: 'nich_2', slNo: '2', productDescription: 'Installation, Commissioning and M&V Charges', quantity: 0, unitCost: 800, marginPct: 40, unitPrice: 1333.33 },
];

export const INITIAL_NEW_IR_BLASTER_OPEX_ROWS: IotControlsOpexRow[] = [
  { id: 'nico_1', slNo: '1', item: 'Annual Recurring Charge Cloud Charges', quantity: 0, unitCost: 900, marginPct: 40, unitPrice: 1500, yearlyPrice: 0, description: 'Annual cloud analytics and remote device telemetry' },
];

export const INITIAL_IOT_CONTROLS_MANDAYS_ROWS: IotControlsMandaysRow[] = [
  { id: 'icm_1', designation: 'Senior IoT Automation & Integration Engineer', mandays: 0, ratePerDay: 0, totalCost: 0, description: 'Gateway provisioning, cloud MQTT setup, controller logic & system commissioning' },
  { id: 'icm_2', designation: 'Field Commissioning Specialist', mandays: 0, ratePerDay: 0, totalCost: 0, description: 'Sensor integration, CT calibration, panel testing, and site validation' },
  { id: 'icm_3', designation: 'Certified Electrical Technician', mandays: 0, ratePerDay: 0, totalCost: 0, description: 'Cable routing, panel box mounting, termination & electrical wiring' },
];

export const INITIAL_IOT_CONTROLS_TRAVEL_ROWS: IotControlsTravelRow[] = [
  { id: 'ict_1', item: 'Intercity Travel & Train/Flight Tickets', qty: 0, rate: 0, totalCost: 0, remarks: 'Round trip travel for technical commissioning team' },
  { id: 'ict_2', item: 'Hotel Accommodation & Lodging (8 Nights)', qty: 0, rate: 0, totalCost: 0, remarks: 'Site stay for 2 engineers during installation & testing' },
  { id: 'ict_3', item: 'Daily Food & Boarding Allowance (DA)', qty: 0, rate: 0, totalCost: 0, remarks: 'Per diem meal allowance for deployment engineers' },
  { id: 'ict_4', item: 'Local Site Conveyance & Tool Logistics', qty: 0, rate: 0, totalCost: 0, remarks: 'Local cabs, materials freight and equipment handling' },
];

export const INITIAL_IOT_CONTROLS_OPEX_ROWS: IotControlsOpexRow[] = [
  { id: 'ico_1', slNo: '1', item: 'Cloud charges (IR Blaster)', quantity: 0, unitCost: 800, marginPct: 40, unitPrice: 1333.33, yearlyPrice: 0, description: 'Cloud infrastructure & telemetry for IR Blaster' },
  { id: 'ico_2', slNo: '2', item: 'Cloud Charges (Energy Meter)', quantity: 0, unitCost: 1500, marginPct: 40, unitPrice: 2500, yearlyPrice: 0, description: 'Energy meter data logging & analytics' },
  { id: 'ico_3', slNo: '3', item: 'HVAC & Lighting', quantity: 0, unitCost: 800, marginPct: 40, unitPrice: 1333.33, yearlyPrice: 0, description: 'HVAC & lighting control logic monitoring' },
  { id: 'ico_4', slNo: '4', item: 'SIM Charges', quantity: 0, unitCost: 1800, marginPct: 40, unitPrice: 3000, yearlyPrice: 0, description: 'Annual cellular data & SIM card connectivity' },
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

export const DEFAULT_IAQ_SENSOR_STEP5_TEXT = `Scope of Supply & System Specifications — IAQ Sensor (Indoor Air Quality Solutions):
In this proposal, Sustainabyte will supply and deploy advanced Indoor Air Quality (IAQ) Multi-Parameter Sensors with cloud/on-premise telemetry monitoring.

About IAQ Sensor – Air Intelligence Solutions:
• Real-time multi-gas & particulate matter sensing for occupational health, safety, and energy optimization.
• Integrated Parameters:
  - CO2 (Carbon Dioxide): 400 – 5000 ppm
  - PM2.5 & PM10 (Particulate Matter): 0 – 1000 µg/m³
  - Temperature: -10°C to +60°C
  - Relative Humidity: 0 – 100% RH
  - TVOC (Total Volatile Organic Compounds): 0 – 60,000 ppb
  - Overall IAQ Index Score (0 – 100 Gauge: Excellent, Good, Moderate, Poor)
• Communication: RS485 Modbus RTU / 4G IoT Gateway / Wi-Fi Cloud Connectivity.
• Plug & Play deployment with pre-calibrated industrial grade sensing elements.

Key Features & Dashboard Telemetry:
• Live Air Quality Dashboard with multi-parameter telemetry tables and color-coded status badges.
• Intelligent Threshold Alarms (SMS, Email & Webhook alerts on threshold breach).
• HVAC Integration: Modulate fresh air dampers & ventilation systems based on real-time CO2 and VOC levels.
• Historic Analytics & CSV Reporting for compliance reporting (WELL, LEED, OSHA & ASHRAE 62.1).`;

export const DEFAULT_IAQ_SENSOR_STEP6_TEXT = `Terms and Conditions:
1) Payment schedule: 100% payment for hardware advance against the PO.
2) Taxes: Applicable taxes and duties will be extra (GST @ 18%).
3) Delivery Period: Within 5-6 weeks from date of receipt of advance along with P.O.
4) Warranty: 12 months from the date of installation or 18 months from the date of dispatch whichever is earlier.
5) Validity of Offer: 30 days from the date of proposal submission.
6) Installation & Support: Site access, electrical cabling provisions, and network access to be facilitated by the client.

Submitted by,
Sustainabyte Technologies Private Limited

Bank Account details:
Name: SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED
Account number: 35860200000750
IFSC: BARB0VELACH (fifth letter is ZERO)
Bank name: Bank of Baroda
Branch: VELACHERY BRANCH`;

export const DEFAULT_COMPRESSED_AIR_AUTOMATION_STEP5_TEXT = `Scope of Supply & Technical Specifications — Compressed Air Automation:
Introduction:
This scope outlines the monitoring and automation of an industrial facility, focusing on analysing plant air demand, evaluating compressor efficiency, and optimizing lead–lag sequencing to enhance performance and achieve energy savings.

Compressed Air Digitalization Deliverables:
1. Plant Demand Monitoring:
• Flow & Demand Profile Analytics (Min, Avg, Peak CFM / m³/hr).
• Artificial Demand & Header Pressure Stabilization.
• Right-Sizing & Balancing Recommendations.

2. Compressor Efficiency Monitoring (SEC & FAD):
• Specific Energy Consumption (kW/100 CFM or kWh/m³).
• Free Air Delivery (FAD) at operating pressure.
• Merit-Order Compressor Efficiency Ranking.

3. Intelligent Sequencing & Lead-Lag Optimization:
• Automated lead-lag sequencing logic to match varying loads.
• Unloaded running hour elimination (saving 15–30% energy).
• Equalized run hours and narrow header pressure band (±0.1 bar).

4. IoT Monitoring in HP Compressors:
• Continuous telemetry: pressure, discharge temperature, power, vibration.
• Real-time web dashboard analytics, alerts, and predictive health.

5. Additional Scope: Ultrasonic Leakage Identification & Tagging:
• Systematic detection (20–100 kHz) down to 0.05 mm @ 7 bar.
• Serialized physical tagging and annualized loss quantification.

6. Implementation Validation:
• Post-rectification audit comparing baseline vs post-implementation parameters.`;

export const DEFAULT_COMPRESSED_AIR_AUTOMATION_STEP6_TEXT = `Support Required from Client:
• For HP Compressors Oil Tank Provisions for installing sensors is Danfoss Scope which requires OEM support. Sensor supply is under Sustainabyte Scope.
• Dedicated SPOC for coordination and access approvals.
• 1 pipeline specialist from client side to assist during flow meter tapping.
• 1/2" Ball valve tapping points for pressure sensors and counter-flanges/gaskets for flow meters under client scope.
• 230V AC UPS power supply point and safe onsite storage.
• Site ladders, scaffoldings, safety caution boards, and lifts under client scope.

Terms and Conditions:
1) Offer Validity: 1 Month from quotation date.
2) Payment Terms: 50% advance against Pro-Forma Invoice; 40% against Supply within 15 days; 10% after completion of the project.
3) Taxes: GST @ 18% extra.
4) Freight: Material Packing & Forwarding / Transport is Inclusive.
5) Delivery Period: 10 to 12 Weeks from approved date of PO.
6) Warranty for Supply: 1 year from the date of material delivery at site.
7) Installation & Commissioning: 6 to 8 weeks after receiving materials at site.
8) Project timelines depend on shutdowns provided for fixing sensors.
9) Power fluctuations / voltage variations to field devices to be managed under client care.

General Exclusions:
• Site accommodation and boarding.
• Removal and disposal of redundant equipment and materials.
• Builders work, panel bases, wall chasing, cutting holes, and painting.
• Provision and cost of fuel and power for installation and testing.

Submitted by,
Sustainabyte Technologies Private Limited

Bank Account Details:
Name: SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED
Account Number: 35860200000750
IFSC: BARB0VELACH (fifth letter is ZERO)
Bank: Bank of Baroda
Branch: VELACHERY BRANCH`;



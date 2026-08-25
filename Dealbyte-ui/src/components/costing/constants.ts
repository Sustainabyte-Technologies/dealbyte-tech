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
  CpmCloudRow,
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

export const getActiveTeamMembers = (): PresetTeamMember[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('dealbyte_custom_team_members');
      if (saved) {
        const custom: any[] = JSON.parse(saved);
        const mappedCustom: PresetTeamMember[] = custom.map((c) => ({
          name: c.name,
          roleLevel: c.roleLevel || 'SENIOR_ENERGY',
          roleTitle: c.role || c.roleTitle || 'Energy Engineer',
          siteWorkCost: Number(c.siteWorkCost) || 0,
          reportWorkCost: Number(c.reportWorkCost) || 0,
          foodRatePerDay: Number(c.foodRatePerDay) || 0,
        }));
        return [...PRESET_TEAM_MEMBERS, ...mappedCustom];
      }
    } catch (e) {
      // ignore
    }
  }
  return PRESET_TEAM_MEMBERS;
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
    name: 'Custom Electrical Accessory',
    description: 'Custom Electrical Hardware / Cable / Accessory',
    category: 'Electrical Hardware',
    uom: 'Nos',
    unitCost: 0,
  },
];

export const getActiveGatewayHardwareCatalog = (): EmsHardwareCatalogItem[] => {
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
        return [...STANDARD_EMS_GATEWAY_HARDWARE_CATALOG, ...gatewayCustom];
      }
    } catch (e) {}
  }
  return STANDARD_EMS_GATEWAY_HARDWARE_CATALOG;
};

export const getActiveElectricalHardwareCatalog = (): EmsHardwareCatalogItem[] => {
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
        return [...STANDARD_EMS_ELECTRICAL_HARDWARE_CATALOG, ...elCustom];
      }
    } catch (e) {}
  }
  return STANDARD_EMS_ELECTRICAL_HARDWARE_CATALOG;
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
The objective of this study is to perform a detailed energy audit to identify energy saving and cost optimization opportunities.

Data Collection and Review:
• The audit team will collect the last 12 months of electricity bills and district cooling bills for detailed analysis.
• The team will gather building-related information such as total built-up area, occupancy pattern, and operating hours.
• The inventory of major equipment including AHUs, FCUs, pumps, heat exchangers, lighting systems, and transformers will be compiled.
• All available technical documents such as single line diagrams, HVAC schematics, and operation manuals will be reviewed to understand system configuration.

Electricity Bill Analysis:
• The electricity bills will be analyzed to study monthly energy consumption, maximum demand, and power factor trends.
• The analysis will identify demand peaks, penalties, and opportunities for tariff optimization.

Chiller Plant Performance Assessment:
• The performance of 350 TR × 6 Nos chillers will be evaluated under actual operating conditions.
• Parameters such as: Chilled water inlet/outlet temperature, Condenser water inlet/outlet temperature, Flow rate, Power consumption.
• Chiller loading will be measured and analyzed. Chiller efficiency in terms of kW/TR will be calculated and benchmarked.
• The study will identify opportunities for: Sequencing optimization, Low load operation improvement, Set point optimization, Energy savings through operational improvements.

VRV Performance Assessment:
• VRV/VRF will be evaluated for performance study.
• Parameters including: Temperature of Compressor side, Condenser flow measurement, VRV power consumption, Indoor Temperature assessment.

CDD-Based Consumption Analysis:
• Cooling Degree Days will be used to normalize cooling consumption and eliminate the impact of weather variations.
• The study will establish correlation between CDD and cooling energy consumption to identify abnormal performance trends.

AHU Performance Assessment:
• Air Handling Units will be evaluated on a sampling basis covering approximately 20% to 30% of total units.
• The selection of AHUs will be based on capacity, location, and operational diversity.
• Where measurement provision is available, airflow, temperature, humidity, and static pressure will be measured.
• The analysis will assess cooling coil performance, fan efficiency, and filter pressure drop.

Pump Performance Study:
• Pump systems will be analyzed on a sampling basis covering approximately 20% to 30% of total pumps.
• Flow rate, head, and power consumption will be measured to calculate pump efficiency.
• The analysis will identify inefficiencies such as oversizing, throttling losses, and potential for VFD implementation.

Compressor Study & Leakage Identification:
• Flow Study across Generation & Demand Side (If existing tapping available or possible to provide tapping).
• Compressor Efficiency (FAD) (Only if provision available / Shutdown possible).
• Demand Flow Measurement & Distribution Loss Identification.
• Leakage Identification & Tagging: Each leakage point is detected using ultrasonic detectors and physically tagged with a unique identification label for structured repair tracking.

Lighting System Assessment:
• Lux level measurements across retail spaces, corridors, and parking areas compared against recommended standards to identify over-illumination or under-lighting.
• Opportunities for energy savings through LED retrofits and control strategies.

Electrical System and Power Quality Study:
• Transformer performance evaluation (voltage, current, loading, and power factor).
• Power quality analysis to assess harmonics, phase imbalance, and system losses.
• Distribution system review for inefficiencies and improvement opportunities.

Electrical Thermography Study:
• Electrical thermography for major electrical panels, switchboards, transformers, and distribution systems.
• Thermal scanning to identify: Hotspots, Loose connections, Phase imbalance, Overloaded circuits, Abnormal heating.
• Improves system reliability and safety.

Measurement and Instrumentation:
• Field measurements using calibrated instruments (power analyzers, flow meters, anemometers, temperature sensors, and lux meters).

Energy Conservation Measures (ECMs):
• Categorized into low-cost, medium-cost, and high-cost measures with estimated energy savings, cost savings, investment, and payback period.

Deliverables:
• Detailed energy audit report with graphical trends, CDD correlation, identified ECMs with financial analysis, and executive summary for management review.`;

export const DEFAULT_ENERGY_AUDIT_STEP6_TEXT = `Payment Terms:
• 30 days from the date of invoice and invoice will be raised after the work completion at site.
• Applicable taxes and duties shall be charged extra, as applicable.
• All lodging, boarding, and travel expenses are as actual or Customer scope.
• The quote is valid for 45 days from the date of submission.

Other Terms and Conditions:
• Customer shall arrange a skilled individual (Authorized technicians) for the entire duration of the audit period for local co-ordination with site team for seeking approval or work permits and installation of energy auditing equipment with proper safety measures.`;

export const DEFAULT_ENERGY_AUDIT_SCOPE_CARDS = [
  {
    id: 'ea-1',
    title: '1. Data Collection, Review & Bill Analysis',
    description: '12-month billing review, maximum demand, power factor, tariff optimization, and single line diagram study.',
  },
  {
    id: 'ea-2',
    title: '2. Chiller Plant & VRV Performance',
    description: 'Performance evaluation (e.g. 350 TR × 6 chillers), kW/TR benchmark, chilled/condenser delta-T, and VRV profiling.',
  },
  {
    id: 'ea-3',
    title: '3. CDD Weather Normalization & AHUs',
    description: 'Cooling Degree Days correlation to eliminate weather skew, plus 20-30% sampling of AHU airflow and coil efficiency.',
  },
  {
    id: 'ea-4',
    title: '4. Pump Performance & Throttling Losses',
    description: 'Flow rate, operating head, hydraulic power, motor loading, throttling loss identification, and VFD retrofit savings.',
  },
  {
    id: 'ea-5',
    title: '5. Compressed Air & Ultrasonic Leak Tagging',
    description: 'FAD study, demand vs generation dynamics, and ultrasonic leak detection with physical unique ID tagging labels.',
  },
  {
    id: 'ea-6',
    title: '6. Power Quality, Thermography & ECMs',
    description: 'Harmonic analysis, electrical thermography hotspot detection, lux survey, and categorized ECMs with ROI calculations.',
  },
];

export const ENERGY_AUDIT_TRACK_RECORD_CLIENTS = [
  'Mazaya Business Avenue, Dubai',
  'ASHRAE Level 2 audit at 6 Commercial Building, Dubai',
  'Danat Al Emarat Hospital, Dubai by Aatral',
  'Suzlon Energy Pvt Ltd',
  'Velmurugan Industries Ltd',
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
  'Welding IoT',
  'Hardware',
  'Custom',
];

export const CHILLER_MANAGEMENT_SUB_SERVICES = [
  'CPM (Chiller Plant Management)',
  'CPM',
  'Chiller Plant Monitoring',
  'Chiller Automation & Optimization',
  'Chiller Digitization',
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
  'CPM (Chiller Plant Management)',
  'CPM',
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

export const INITIAL_CPM_CLOUD_ROWS: CpmCloudRow[] = [
  {
    id: 'cpm_cloud_1',
    itemDescription: 'Chiller Plant Management & AI Optimization SaaS License (Annual Cloud Platform Access)',
    billingCycle: 'Annual',
    qty: 0,
    uom: 'Year',
    unitCost: 120000,
    marginPct: 40,
  },
  {
    id: 'cpm_cloud_2',
    itemDescription: 'Cloud Server Infrastructure, Telemetry Ingestion & Time-Series DB Storage (PostgreSQL / InfluxDB)',
    billingCycle: 'Annual',
    qty: 0,
    uom: 'Year',
    unitCost: 36000,
    marginPct: 40,
  },
  {
    id: 'cpm_cloud_3',
    itemDescription: 'Industrial 4G/5G M2M Gateway IoT Data SIM Pack with Multi-Operator Roaming (Annual)',
    billingCycle: 'Annual',
    qty: 0,
    uom: 'Nos/Year',
    unitCost: 6000,
    marginPct: 40,
  },
  {
    id: 'cpm_cloud_4',
    itemDescription: 'Automated Fault Detection & Diagnostics (FDD), KPI Reports & Instant WhatsApp / Email Alerts',
    billingCycle: 'Annual',
    qty: 0,
    uom: 'Year',
    unitCost: 18000,
    marginPct: 40,
  },
];




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
  'Hardware Costing',
  'IoT Controls Costing',
  'IoT Controls',
  'Hardware Installation',
  'Hardware Supply',
  'Custom',
];

export const INITIAL_IOT_CONTROLS_HARDWARE_ROWS: IotControlsHardwareRow[] = [
  { id: 'ich_1', slNo: '1a', productDescription: 'IR blaster', quantity: 0, unitCost: 0, marginPct: 40, unitPrice: 0 },
  { id: 'ich_2', slNo: '1b', productDescription: 'Installation and commissioning', quantity: 0, unitCost: 0, marginPct: 40, unitPrice: 0 },
  { id: 'ich_3', slNo: '2a', productDescription: 'CT', quantity: 0, unitCost: 0, marginPct: 40, unitPrice: 0 },
  { id: 'ich_4', slNo: '2b', productDescription: 'Energy Meter', quantity: 0, unitCost: 0, marginPct: 40, unitPrice: 0 },
  { id: 'ich_5', slNo: '2c', productDescription: 'Gateway lite', quantity: 0, unitCost: 0, marginPct: 40, unitPrice: 0 },
  { id: 'ich_6', slNo: '2d', productDescription: 'Gateway pro', quantity: 0, unitCost: 0, marginPct: 40, unitPrice: 0 },
  { id: 'ich_7', slNo: '2e', productDescription: 'Installation and commissioning (Cable Laying, Meter Configuration, Panel Fixing, CT connection, Gateway Configuration)', quantity: 0, unitCost: 0, marginPct: 40, unitPrice: 0 },
  { id: 'ich_8', slNo: '3a', productDescription: 'Temperature sensor', quantity: 0, unitCost: 0, marginPct: 40, unitPrice: 0 },
  { id: 'ich_9', slNo: '3b', productDescription: 'HVAC Controller', quantity: 0, unitCost: 0, marginPct: 40, unitPrice: 0 },
  { id: 'ich_10', slNo: '3c', productDescription: 'Lighting Controller', quantity: 0, unitCost: 0, marginPct: 40, unitPrice: 0 },
  { id: 'ich_11', slNo: '3d', productDescription: 'Control Panel Box(contactor,selecter switch,wiring, I/O Module)', quantity: 0, unitCost: 0, marginPct: 40, unitPrice: 0 },
  { id: 'ich_12', slNo: '3e', productDescription: 'Installation and commisioing(Controll logic,cable laying,wiring)', quantity: 0, unitCost: 0, marginPct: 40, unitPrice: 0 },
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
  { id: 'ico_1', item: 'Cloud Platform & Analytical Services', yearlyPrice: 0, description: 'Cloud infrastructure, analytics algorithms, alerting engine & automated reporting' },
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



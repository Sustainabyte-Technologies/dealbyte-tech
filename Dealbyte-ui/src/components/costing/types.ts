export interface ManpowerRow {
  id: string;
  name: string;
  roleLevel: 'JUNIOR_ENERGY' | 'SENIOR_ENERGY' | 'IOT_ENGINEER' | 'TRAINEE_ENERGY' | 'CUSTOM';
  customRoleName?: string;
  foodRatePerDay: number;
  siteWorkCost: number;
  reportWorkCost: number;
  siteWorkingDays: number;
  reportWorkingDays: number;
  overrideCost?: number;
}

export interface PresetTeamMember {
  name: string;
  roleLevel: 'JUNIOR_ENERGY' | 'SENIOR_ENERGY' | 'IOT_ENGINEER' | 'TRAINEE_ENERGY' | 'CUSTOM';
  roleTitle: string;
  siteWorkCost: number;
  reportWorkCost: number;
  foodRatePerDay: number;
}

export interface InstrumentRow {
  id: string;
  name: string;
  customName?: string;
  rentalCost: number;
  sets: number;
  siteWorkingDays: number;
}

export interface ExtraExpenseRow {
  id: string;
  category: 'FOOD' | 'TRAVEL' | 'ACCOMMODATION' | 'CUSTOM';
  description: string;
  rate: number;
  qty: number;
  days: number;
}

// ─── EMS (Energy Management System) Interfaces ───
export interface EmsHardwareRow {
  id: string;
  code?: string;
  category: string;
  description: string;
  qty: number;
  uom: string;
  unitCost: number;
  marginPct: number;
}

export interface EmsManpowerRow {
  id: string;
  memberName: string;
  role: string;
  ratePerDay: number;
  siteWorkingDays: number;
  foodCostPerDay: number;
  stayCostPerDay: number;
  marginPct: number;
}

export interface EmsPlatformRow {
  id: string;
  description: string;
  qty: number;
  uom: string;
  unitCost: number;
  marginPct: number;
}

export interface EmsRecurringRow {
  id: string;
  code: string;
  description: string;
  qty: number;
  uom: string;
  unitCostPerMonth: number;
  marginPct: number;
}

// ─── Welding IoT Interfaces ───
export interface WeldingHardwareRow {
  id: string;
  slNo: number;
  componentName: string;
  qty: number | string;
  unitCost: number;
  unitPrice: number;
  marginPct?: number;
}

export interface WeldingSoftwareRow {
  id: string;
  item: string;
  description: string;
  qty?: number;
  uom?: string;
  unitCost?: number;
  marginPct?: number;
  unitPrice?: number;
  price: number;
}

export interface WeldingCloudRow {
  id: string;
  component: string;
  description: string;
  type: string;
  qty?: number;
  uom?: string;
  unitMonthlyCost?: number;
  monthlyCost?: number;
  marginPct?: number;
  unitMonthlyPrice?: number;
  monthlyPrice: number;
  yearlyPrice: number;
}

export interface WeldingInstallationRow {
  id: string;
  item: string;
  qty?: number;
  uom: string;
  unitCost?: number;
  marginPct?: number;
  unitPrice?: number;
  price: number;
}

// ─── IoT Controls & Hardware Interfaces ───
export interface IotControlsHardwareRow {
  id: string;
  slNo: string;
  productDescription: string;
  quantity: number;
  unitCost?: number;
  marginPct?: number;
  unitPrice: number;
}

export interface IotControlsMandaysRow {
  id: string;
  designation: string;
  mandays: number;
  ratePerDay: number;
  totalCost?: number;
  description?: string;
}

export interface IotControlsTravelRow {
  id: string;
  item: string;
  qty: number;
  rate: number;
  totalCost?: number;
  remarks?: string;
}

export interface IotControlsOpexRow {
  id: string;
  slNo?: string | number;
  item: string;
  quantity?: number;
  unitCost?: number;
  marginPct?: number;
  unitPrice?: number;
  yearlyPrice: number;
  description: string;
}

export interface IotControlsRoiState {
  annualEnergyCostBaseline: number;
  energyInflationPct: number;
  savingsPctY1: number;
  savingsPctY2: number;
  savingsPctY3: number;
  savingsPctY4: number;
  savingsPctY5: number;
  acLoadingAssumption: string;
  acSchedulingAssumption: string;
  opexAssumption: string;
}

// ─── Chiller Plant Management (CPM) Interfaces ───
export interface CpmHardwareRow {
  id: string;
  slNo: number;
  brand: string;
  itemDescription: string;
  modelNo: string;
  qty: number;
  uom: string;
  unitCost: number;
  marginPct: number;
}

export interface CpmOnPremiseRow {
  id: string;
  slNo?: number;
  commercialLayer: string;
  qty: number;
  unitCost: number;
  marginPct: number;
}

export interface CpmCloudChargeRow {
  id: string;
  slNo?: number;
  basis: string;
  calculation: string;
  qty: number;
  unitCost: number;
  marginPct: number;
}

export interface CpmCloudRow {
  id: string;
  itemDescription: string;
  billingCycle?: string;
  qty: number;
  uom: string;
  unitCost: number;
  marginPct: number;
}




export type PropertyType = '' | 'Land and Buildings' | 'Flat';

export interface BasicInformationData {
  propertyType: PropertyType;
  inspectionDate: string;
  valuationDate: string;
}

export interface LocationData {
  state: string;
  district: string;
  mandal: string;
  village: string;
  syNos: string;
  plotNo: string;
  buildingName?: string;
  houseNo?: string;
  pincode: string;
  apartmentName?: string;
  flatNo?: string;
  floor?: string;
}

export interface LandDetailsData {
  landA: number;
  landB: number;
  landC: number;
  units: string;
  affectedType: string;
  rea: number;
  nea: number;
  grossSource: string;
  netArea: number;
  areaVal: number;
}

export interface LandValuationData {
  guidelineRate: number;
  unitRate: number;
  guidelineValue: number;
  landValue: number;
}

export interface BuildingDetailsData {
  buildings: BuildingData[];
}

export interface BuildingData {
  building: string;
  floorName: string;
  type: string;
  buaPlan: number;
  buaActual: number;
  permissibleArea: number;
  areaConsidered: number;
}

export interface FlatValuationData {
  flatSBUA: number;
  carpetArea: number;
  flatUDS: number;
  totalLandArea: number;
  guidelineRate: number;
  unitRate: number;
  replacementCost: number;
  guidelineValue: number;
  flatValue: number;
  replacementValue: number;
}

export interface UtilityBillData {
  type: 'Electricity' | 'Water' | '';
  bills: (ElectricityBill | WaterBill)[];
}

export interface ElectricityBill {
  type: 'Electricity';
  scNo: string;
  uscNo: string;
  houseNo: string;
  name: string;
  paidTo: string;
}

export interface WaterBill {
  type: 'Water';
  canNo: string;
  houseNo: string;
  name: string;
}
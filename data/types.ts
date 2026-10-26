export type ReagentStatus = 'Available' | 'At-Risk' | 'Reserved' | 'AT RISK - EMERGENCY SWAP';
export type StorageTemp = -80 | -20 | 4;
export type FreezerStatus = 'Stable' | 'Warning' | 'Critical';
export type AlertType = 'SMS' | 'WhatsApp' | 'Dashboard';

export type Lab = {
  id: string;
  name: string;
  university: string;
  state: string;
  specialty: string;
};

export type Reagent = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  storageTemp: StorageTemp;
  status: ReagentStatus;
  ownerLab: string;
  university: string;
  locationState: string;
  priceNGN: number;
  isEmergencySwap: boolean;
};

export type Freezer = {
  id: string;
  name: string;
  labId: string;
  currentTemp: number;
  targetTemp: StorageTemp;
  status: FreezerStatus;
  reagentsInside: string[];
};

export type Alert = {
  id: string;
  freezerId: string;
  timestamp: string;
  temp: number;
  message: string;
  type: AlertType;
};

export type MockData = {
  labs: Lab[];
  reagents: Reagent[];
  freezers: Freezer[];
  alerts: Alert[];
};

export const DEMO_LAB_NAME = 'FUTA Molecular Diagnostics Lab';
export const DEMO_UNIVERSITY = 'FUTA';
export const WHATSAPP_RECIPIENT = '+2348091565868';

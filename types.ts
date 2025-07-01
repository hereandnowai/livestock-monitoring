

export enum HealthStatus {
  Healthy = 'Healthy',
  Warning = 'Warning',
  Critical = 'Critical',
}

export enum BreedingStatus {
  Normal = 'Normal',
  InHeat = 'In-Heat',
  Pregnant = 'Pregnant',
}

export enum AnimalType {
  Cow = 'Cow',
  Sheep = 'Sheep',
  Pig = 'Pig',
  Goat = 'Goat',
}

export interface Animal {
  id: string;
  name: string;
  type: AnimalType;
  age: number; // in years
  healthStatus: HealthStatus;
  location: {
    lat: number;
    lng: number;
  };
  temperature: number; // in Celsius
  heartRate: number; // bpm
  activityLevel: number; // % of daily target
  lastFed: string; // ISO date string
  breedingStatus: BreedingStatus;
}

export enum AlertType {
  Health = 'Health',
  Geofence = 'Geofence',
  Feeding = 'Feeding',
  Breeding = 'Breeding'
}

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  timestamp: string; // ISO date string
  animalId: string;
}

export interface CornPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface FeedConsumption {
  date: string; // ISO Date string
  amount: number; // in tons
}

export interface FeedStock {
  name: string;
  currentAmount: number; // in tons
  capacity: number; // in tons
  unit: string;
  reorderLevel: number; // percentage
}

// Types for the new Analysis feature
export interface Anomaly {
  animalId: string;
  metric: string;
  value: number | string;
  timestamp: string;
  description: string;
}

export interface AnimalSummary {
  animalId: string;
  avgTemperature: number;
  avgHeartRate: number;
  avgActivityLevel: number;
  healthStatus: string;
}

export interface GeneratedAlert {
    animalId: string;
    message: string;
    priority: 'High' | 'Medium' | 'Low';
}

export interface AnalysisResult {
  anomalies: Anomaly[];
  animalSummaries: AnimalSummary[];
  alerts: GeneratedAlert[];
  suggestedActions: string[];
  overallSummary: string;
}

export interface CsvData {
  'Animal ID': string;
  'Date': string;
  'Time': string;
  'Body Temperature': number;
  'Heart Rate': number;
  'Activity Level': number;
  'Location': string;
  'timestamp': number; // Combined date and time for charting
}

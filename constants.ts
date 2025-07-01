import { Animal, Alert, HealthStatus, BreedingStatus, AnimalType, AlertType, CornPrice, FeedStock, FeedConsumption } from './types';

export const mockAnimals: Animal[] = [
  { id: 'cow-001', name: 'Bessie', type: AnimalType.Cow, age: 4, healthStatus: HealthStatus.Healthy, location: { lat: 34.0522, lng: -118.2437 }, temperature: 38.5, heartRate: 65, activityLevel: 85, lastFed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), breedingStatus: BreedingStatus.Normal },
  { id: 'cow-002', name: 'Daisy', type: AnimalType.Cow, age: 3, healthStatus: HealthStatus.Warning, location: { lat: 34.055, lng: -118.245 }, temperature: 39.8, heartRate: 88, activityLevel: 45, lastFed: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), breedingStatus: BreedingStatus.InHeat },
  { id: 'sheep-001', name: 'Shaun', type: AnimalType.Sheep, age: 2, healthStatus: HealthStatus.Healthy, location: { lat: 34.053, lng: -118.248 }, temperature: 39.0, heartRate: 75, activityLevel: 92, lastFed: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), breedingStatus: BreedingStatus.Normal },
  { id: 'cow-003', name: 'Molly', type: AnimalType.Cow, age: 5, healthStatus: HealthStatus.Critical, location: { lat: 34.050, lng: -118.242 }, temperature: 40.5, heartRate: 95, activityLevel: 20, lastFed: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), breedingStatus: BreedingStatus.Pregnant },
  { id: 'pig-001', name: 'Wilbur', type: AnimalType.Pig, age: 1, healthStatus: HealthStatus.Healthy, location: { lat: 34.056, lng: -118.250 }, temperature: 39.2, heartRate: 80, activityLevel: 78, lastFed: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), breedingStatus: BreedingStatus.Normal },
  { id: 'goat-001', name: 'Billy', type: AnimalType.Goat, age: 3, healthStatus: HealthStatus.Healthy, location: { lat: 34.051, lng: -118.246 }, temperature: 39.5, heartRate: 85, activityLevel: 95, lastFed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), breedingStatus: BreedingStatus.Normal },
  { id: 'cow-004', name: 'Annabelle', type: AnimalType.Cow, age: 6, healthStatus: HealthStatus.Warning, location: { lat: 34.058, lng: -118.239 }, temperature: 39.7, heartRate: 85, activityLevel: 55, lastFed: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), breedingStatus: BreedingStatus.Normal },
];

export const mockAlerts: Alert[] = [
    { id: 'alert-1', animalId: 'cow-003', type: AlertType.Health, message: 'Critical temperature spike detected.', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { id: 'alert-2', animalId: 'cow-002', type: AlertType.Breeding, message: 'Estrus (in-heat) behavior detected. Optimal time for insemination.', timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
    { id: 'alert-3', animalId: 'cow-004', type: AlertType.Geofence, message: 'Exited designated grazing area Zone A.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'alert-4', animalId: 'cow-003', type: AlertType.Feeding, message: 'Missed scheduled feeding time.', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
    { id: 'alert-5', animalId: 'cow-002', type: AlertType.Health, message: 'Low activity and high heart rate. Possible distress.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
];

export const mockCornPrice: CornPrice = {
  symbol: 'CORN',
  price: 17.72,
  change: 0.15,
  changePercent: 0.85,
};

export const mockFeedStock: FeedStock = {
  name: 'Corn Feed',
  currentAmount: 1250,
  capacity: 2000,
  unit: 'tons',
  reorderLevel: 25, // reorder when stock is below 25%
};

export const mockDailyConsumptionTarget = 35; // tons

// Last 30 days of consumption data
export const mockFeedConsumptionHistory: FeedConsumption[] = Array.from({ length: 30 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i)); // end with today
  return {
    date: date.toISOString(),
    // random-ish consumption around the target
    amount: mockDailyConsumptionTarget + (Math.random() - 0.5) * 8,
  };
});

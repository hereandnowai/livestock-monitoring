
import React from 'react';
import { Animal, HealthStatus } from '../types';

interface MapPlaceholderProps {
  animals: Animal[];
}

const getStatusColor = (status: HealthStatus) => {
  switch (status) {
    case HealthStatus.Healthy:
      return 'bg-green-500';
    case HealthStatus.Warning:
      return 'bg-yellow-500';
    case HealthStatus.Critical:
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

function MapPlaceholder({ animals }: MapPlaceholderProps) {
  // Normalize coordinates to fit within a 100x100 grid for positioning
  const lats = animals.map(a => a.location.lat);
  const lngs = animals.map(a => a.location.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;

  return (
    <div className="relative w-full h-full bg-gray-800 rounded-md overflow-hidden border-2 border-brand-border">
      {/* Geofence visualisation */}
      <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] border-2 border-dashed border-brand-primary rounded-2xl flex items-center justify-center">
        <span className="text-brand-primary opacity-50 font-semibold">Grazing Zone A</span>
      </div>
       <div className="absolute top-[5%] right-[5%] w-[30%] h-[40%] border-2 border-dashed border-sky-400 rounded-2xl flex items-center justify-center">
        <span className="text-sky-400 opacity-50 font-semibold">Zone B</span>
      </div>

      {animals.map(animal => {
        const top = ((animal.location.lat - minLat) / latRange) * 80 + 10; // % position
        const left = ((animal.location.lng - minLng) / lngRange) * 80 + 10; // % position

        return (
          <div
            key={animal.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ top: `${top}%`, left: `${left}%` }}
          >
            <div className={`w-4 h-4 rounded-full ${getStatusColor(animal.healthStatus)} ring-2 ring-white/50 transition-all duration-300 group-hover:scale-125`}></div>
            <div className="absolute bottom-full mb-2 w-max bg-brand-card text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none left-1/2 -translate-x-1/2">
              {animal.name} ({animal.healthStatus})
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MapPlaceholder;

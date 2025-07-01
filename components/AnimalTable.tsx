
import React from 'react';
import { Animal, HealthStatus, BreedingStatus } from '../types';
import { HeartIcon, ThermometerIcon } from './icons';

interface AnimalTableProps {
  animals: Animal[];
}

function HealthStatusBadge({ status }: { status: HealthStatus }) {
  const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
  const colorClasses = {
    [HealthStatus.Healthy]: 'bg-green-500/20 text-green-400',
    [HealthStatus.Warning]: 'bg-yellow-500/20 text-yellow-400',
    [HealthStatus.Critical]: 'bg-red-500/20 text-red-400',
  };
  return <span className={`${baseClasses} ${colorClasses[status]}`}>{status}</span>;
};

function BreedingStatusBadge({ status }: { status: BreedingStatus }) {
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
    const colorClasses = {
      [BreedingStatus.Normal]: 'bg-gray-500/20 text-gray-400',
      [BreedingStatus.InHeat]: 'bg-pink-500/20 text-pink-400',
      [BreedingStatus.Pregnant]: 'bg-sky-500/20 text-sky-400',
    };
    return <span className={`${baseClasses} ${colorClasses[status]}`}>{status}</span>;
  };

function AnimalTable({ animals }: AnimalTableProps) {
  return (
    <div className="bg-brand-card shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 border-b border-brand-border">
        <h2 className="text-xl font-bold text-gray-200">Livestock Roster</h2>
        <p className="text-sm text-gray-400">Detailed information for all animals in the herd.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-gray-400">
          <thead className="bg-gray-900/50 text-xs text-gray-300 uppercase tracking-wider">
            <tr>
              <th className="p-4">ID / Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Health Status</th>
              <th className="p-4">Vitals</th>
              <th className="p-4">Activity</th>
              <th className="p-4">Breeding Status</th>
              <th className="p-4">Last Fed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {animals.map((animal) => (
              <tr key={animal.id} className="hover:bg-brand-border/50">
                <td className="p-4">
                  <div className="font-medium text-gray-200">{animal.name}</div>
                  <div className="text-xs text-gray-500">{animal.id}</div>
                </td>
                <td className="p-4">{animal.type}</td>
                <td className="p-4">
                  <HealthStatusBadge status={animal.healthStatus} />
                </td>
                <td className="p-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1" title="Temperature">
                            <ThermometerIcon className="h-5 w-5 text-red-400" />
                            <span>{animal.temperature.toFixed(1)}°C</span>
                        </div>
                        <div className="flex items-center space-x-1" title="Heart Rate">
                            <HeartIcon className="h-5 w-5 text-pink-400" />
                            <span>{animal.heartRate} bpm</span>
                        </div>
                    </div>
                </td>
                <td className="p-4">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${animal.activityLevel}%` }}></div>
                    </div>
                    <span className="text-xs">{animal.activityLevel}% of target</span>
                </td>
                <td className="p-4">
                  <BreedingStatusBadge status={animal.breedingStatus} />
                </td>
                <td className="p-4 whitespace-nowrap">{new Date(animal.lastFed).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnimalTable;

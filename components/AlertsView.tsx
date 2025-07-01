
import React from 'react';
import { Alert, Animal, AlertType } from '../types';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, HeartIcon } from './icons';

interface AlertsViewProps {
  alerts: Alert[];
  animals: Animal[];
}

const getAlertIconAndColor = (type: AlertType) => {
  switch (type) {
    case AlertType.Health:
      return { icon: <XCircleIcon className="h-6 w-6" />, color: 'text-red-400' };
    case AlertType.Geofence:
      return { icon: <ExclamationCircleIcon className="h-6 w-6" />, color: 'text-yellow-400' };
    case AlertType.Feeding:
      return { icon: <CheckCircleIcon className="h-6 w-6" />, color: 'text-blue-400' };
    case AlertType.Breeding:
        return { icon: <HeartIcon className="h-6 w-6" />, color: 'text-pink-400' };
    default:
      return { icon: <ExclamationCircleIcon className="h-6 w-6" />, color: 'text-gray-400' };
  }
};

const getAnimalName = (animalId: string, animals: Animal[]) => {
    const animal = animals.find(a => a.id === animalId);
    return animal ? `${animal.name} (${animal.id})` : 'Unknown Animal';
};

function AlertsView({ alerts, animals }: AlertsViewProps) {
  // Sort alerts from most recent to oldest
  const sortedAlerts = [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="bg-brand-card shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 border-b border-brand-border">
        <h2 className="text-xl font-bold text-gray-200">Alerts & Notifications</h2>
        <p className="text-sm text-gray-400">Chronological log of all system-generated alerts.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-gray-400">
          <thead className="bg-gray-900/50 text-xs text-gray-300 uppercase tracking-wider">
            <tr>
              <th className="p-4">Type</th>
              <th className="p-4">Animal</th>
              <th className="p-4">Message</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {sortedAlerts.map((alert) => {
                const { icon, color } = getAlertIconAndColor(alert.type);
                return (
                    <tr key={alert.id} className="hover:bg-brand-border/50">
                        <td className="p-4">
                            <div className="flex items-center space-x-2">
                                <span className={color}>{icon}</span>
                                <span className={`${color} font-semibold`}>{alert.type}</span>
                            </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-200">{getAnimalName(alert.animalId, animals)}</div>
                        </td>
                        <td className="p-4">{alert.message}</td>
                        <td className="p-4 whitespace-nowrap">{new Date(alert.timestamp).toLocaleString()}</td>
                    </tr>
                );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertsView;

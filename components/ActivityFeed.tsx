
import React from 'react';
import { Alert, Animal, AlertType } from '../types';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, HeartIcon } from './icons';

interface ActivityFeedProps {
  alerts: Alert[];
  animals: Animal[];
}

const getAlertIcon = (type: AlertType) => {
  switch (type) {
    case AlertType.Health:
      return <XCircleIcon className="h-6 w-6 text-red-500" />;
    case AlertType.Geofence:
      return <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />;
    case AlertType.Feeding:
      return <CheckCircleIcon className="h-6 w-6 text-brand-primary" />;
    case AlertType.Breeding:
        return <HeartIcon className="h-6 w-6 text-pink-500" />;
    default:
      return <ExclamationCircleIcon className="h-6 w-6 text-gray-500" />;
  }
};

function ActivityFeed({ alerts, animals }: ActivityFeedProps) {
  const getAnimalName = (animalId: string) => {
    const animal = animals.find(a => a.id === animalId);
    return animal ? `${animal.name} (${animal.id})` : 'Unknown Animal';
  };

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {alerts.slice(0, 5).map((alert, alertIdx) => (
          <li key={alert.id}>
            <div className="relative pb-8">
              {alertIdx !== alerts.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-brand-border" aria-hidden="true" />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div>
                  <div className="relative px-1">
                    <div className="h-8 w-8 bg-brand-dark rounded-full ring-4 ring-brand-card flex items-center justify-center">
                      {getAlertIcon(alert.type)}
                    </div>
                  </div>
                </div>
                <div className="min-w-0 flex-1 py-1.5">
                  <div className="text-sm text-gray-400">
                    <span className="font-medium text-gray-200">{getAnimalName(alert.animalId)}</span>
                    <span className="ml-1">{alert.message}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;

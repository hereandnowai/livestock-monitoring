
import React, { useState } from 'react';
import { DownloadIcon, HeartIcon, ThermometerIcon, TrashIcon } from './icons';

// A simple reusable toggle switch component
const ToggleSwitch = ({ label, enabled, setEnabled }: { label: string, enabled: boolean, setEnabled: (enabled: boolean) => void }) => (
    <div className="flex items-center justify-between">
        <span className="text-gray-300">{label}</span>
        <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-brand-primary' : 'bg-gray-600'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    </div>
);

// Reusable component for threshold settings
const ThresholdInput = ({ label, value, setValue, unit, icon }: { label: string, value: string, setValue: (value: string) => void, unit: string, icon: React.ReactNode }) => (
    <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2">
            {icon}
            <label className="text-gray-300">{label}</label>
        </div>
        <div className="flex items-center space-x-2">
            <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-24 bg-brand-dark border border-brand-border rounded-md px-3 py-1 text-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
            />
            <span className="text-gray-400">{unit}</span>
        </div>
    </div>
);


const Settings = () => {
    // State for Farm Profile
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [farmName, setFarmName] = useState("HERE AND NOW AI Ranch");
    const [owner, setOwner] = useState("Farmer John");

    // State for Notifications
    const [healthNotifications, setHealthNotifications] = useState(true);
    const [geofenceNotifications, setGeofenceNotifications] = useState(true);
    const [feedingNotifications, setFeedingNotifications] = useState(false);
    const [breedingNotifications, setBreedingNotifications] = useState(true);

    // State for Alert Thresholds
    const [tempThreshold, setTempThreshold] = useState("40.5");
    const [heartRateThreshold, setHeartRateThreshold] = useState("95");
    const [activityThreshold, setActivityThreshold] = useState("25");


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Settings & Customization</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Column 1 */}
                <div className="space-y-8">
                    {/* Farm Profile */}
                    <div className="bg-brand-card shadow-lg rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-200">Farm Profile</h2>
                            <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-sm font-semibold text-brand-primary hover:text-yellow-300">
                                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-400">Farm Name</label>
                                {isEditingProfile ? (
                                    <input type="text" value={farmName} onChange={e => setFarmName(e.target.value)} className="w-full bg-brand-dark border border-brand-border rounded-md px-3 py-2 mt-1 text-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none" />
                                ) : (
                                    <p className="text-gray-300 mt-1">{farmName}</p>
                                )}
                            </div>
                             <div>
                                <label className="text-sm font-medium text-gray-400">Owner</label>
                                {isEditingProfile ? (
                                    <input type="text" value={owner} onChange={e => setOwner(e.target.value)} className="w-full bg-brand-dark border border-brand-border rounded-md px-3 py-2 mt-1 text-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none" />
                                ) : (
                                    <p className="text-gray-300 mt-1">{owner}</p>
                                )}
                            </div>
                            {isEditingProfile && (
                                <button onClick={() => setIsEditingProfile(false)} className="w-full bg-brand-primary text-brand-secondary font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors">
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Data Management */}
                    <div className="bg-brand-card shadow-lg rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Data Management</h2>
                        <div className="space-y-3">
                           <button className="w-full flex items-center justify-center space-x-2 bg-transparent border border-brand-border text-gray-300 font-semibold py-2 px-4 rounded-md hover:bg-brand-border/50 transition-colors">
                               <DownloadIcon className="h-5 w-5" />
                               <span>Export All Data (CSV)</span>
                           </button>
                           <button className="w-full flex items-center justify-center space-x-2 bg-red-900/50 border border-red-500/50 text-red-400 font-semibold py-2 px-4 rounded-md hover:bg-red-900/80 transition-colors">
                                <TrashIcon className="h-5 w-5" />
                               <span>Clear Local Data Cache</span>
                           </button>
                        </div>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-8">
                     {/* Notification Preferences */}
                    <div className="bg-brand-card shadow-lg rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Notification Preferences</h2>
                        <div className="space-y-4">
                            <ToggleSwitch label="Critical Health Alerts" enabled={healthNotifications} setEnabled={setHealthNotifications} />
                            <ToggleSwitch label="Geofence Breaches" enabled={geofenceNotifications} setEnabled={setGeofenceNotifications} />
                            <ToggleSwitch label="Feeding Reminders" enabled={feedingNotifications} setEnabled={setFeedingNotifications} />
                            <ToggleSwitch label="Breeding Status Changes" enabled={breedingNotifications} setEnabled={setBreedingNotifications} />
                        </div>
                    </div>

                    {/* Alert Thresholds */}
                    <div className="bg-brand-card shadow-lg rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-200 mb-4">Custom Alert Thresholds</h2>
                        <div className="space-y-4">
                            <ThresholdInput 
                                label="Critical Temperature >"
                                value={tempThreshold}
                                setValue={setTempThreshold}
                                unit="°C"
                                icon={<ThermometerIcon className="h-5 w-5 text-red-400" />}
                            />
                             <ThresholdInput 
                                label="Critical Heart Rate >"
                                value={heartRateThreshold}
                                setValue={setHeartRateThreshold}
                                unit="bpm"
                                icon={<HeartIcon className="h-5 w-5 text-pink-400" />}
                            />
                              <ThresholdInput 
                                label="Low Activity Level <"
                                value={activityThreshold}
                                setValue={setActivityThreshold}
                                unit="%"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                            />
                        </div>
                         <p className="text-xs text-gray-500 mt-4">Set the values that trigger a 'Critical' alert.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

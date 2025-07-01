
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Animal, Alert, HealthStatus, BreedingStatus, AlertType } from '../types';
import { mockFeedStock } from '../constants';
import StatCard from './StatCard';
import HealthStatusChart from './HealthStatusChart';
import ActivityFeed from './ActivityFeed';
import MapPlaceholder from './MapPlaceholder';
import { AnimalIcon, CheckCircleIcon, ExclamationCircleIcon, XCircleIcon, GrainIcon, HeartIcon, SpinnerIcon } from './icons';
import type { View } from '../App';

interface DashboardProps {
  animals: Animal[];
  alerts: Alert[];
  setActiveView: (view: View) => void;
}

function Dashboard({ animals, alerts, setActiveView }: DashboardProps) {
  const [briefing, setBriefing] = useState('');
  const [isLoadingBriefing, setIsLoadingBriefing] = useState(false);
  const [briefingError, setBriefingError] = useState('');

  const healthyCount = animals.filter(a => a.healthStatus === HealthStatus.Healthy).length;
  const warningCount = animals.filter(a => a.healthStatus === HealthStatus.Warning).length;
  const criticalCount = animals.filter(a => a.healthStatus === HealthStatus.Critical).length;
  const inHeatCount = animals.filter(a => a.breedingStatus === BreedingStatus.InHeat).length;
  
  const feedStockPercentage = (mockFeedStock.currentAmount / mockFeedStock.capacity) * 100;

  const generateBriefing = async () => {
    setIsLoadingBriefing(true);
    setBriefingError('');
    setBriefing('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const animalSummary = `Total animals: ${animals.length}. Health status: ${healthyCount} healthy, ${warningCount} with warnings, ${criticalCount} in critical condition.`;
      const alertSummary = `There are ${alerts.length} recent alerts. Types: ${alerts.reduce((acc, alert) => ({...acc, [alert.type]: (acc[alert.type] || 0) + 1}), {} as Record<AlertType, number> )}`;

      const prompt = `You are an expert agricultural AI assistant from HERE AND NOW AI. Based on the following data, provide a concise daily briefing (max 3 sentences) for a farmer. Highlight the most critical issue and suggest one actionable step. Be friendly and direct.
      Data: ${animalSummary}. Alerts: ${alertSummary}.`;
      
      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-04-17",
          contents: prompt
      });

      setBriefing(response.text);

    } catch (error) {
      console.error("Failed to generate briefing:", error);
      setBriefingError("Sorry, I couldn't generate the briefing right now. Please try again later.");
    } finally {
      setIsLoadingBriefing(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard title="Total Livestock" value={animals.length.toString()} icon={<AnimalIcon className="h-8 w-8 text-brand-primary"/>} onClick={() => setActiveView('animals')} />
        <StatCard title="Healthy" value={healthyCount.toString()} icon={<CheckCircleIcon className="h-8 w-8 text-green-500"/>} />
        <StatCard title="Warnings" value={warningCount.toString()} icon={<ExclamationCircleIcon className="h-8 w-8 text-yellow-500"/>} onClick={() => setActiveView('animals')} />
        <StatCard title="Critical" value={criticalCount.toString()} icon={<XCircleIcon className="h-8 w-8 text-red-500"/>} onClick={() => setActiveView('animals')} />
        <StatCard title="Feed Stock" value={`${feedStockPercentage.toFixed(0)}%`} icon={<GrainIcon className="h-8 w-8 text-brand-primary"/>} onClick={() => setActiveView('feed')} />
        <StatCard title="Animals In-Heat" value={inHeatCount.toString()} icon={<HeartIcon className="h-8 w-8 text-pink-500"/>} onClick={() => setActiveView('animals')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map and Health Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-brand-card p-4 rounded-lg shadow-lg h-[400px]">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Herd Location & Geofence</h3>
            <MapPlaceholder animals={animals} />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-brand-card p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Health Overview</h3>
            <HealthStatusChart animals={animals} />
          </div>
            <div className="bg-brand-card p-4 rounded-lg shadow-lg flex flex-col justify-center min-h-[160px]">
             <h3 className="text-lg font-semibold text-gray-200 mb-2">AI Daily Briefing</h3>
             {isLoadingBriefing ? (
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                    <SpinnerIcon className="h-6 w-6" />
                    <span>Generating your briefing...</span>
                </div>
             ) : briefingError ? (
                 <p className="text-sm text-red-400">{briefingError}</p>
             ) : briefing ? (
                <div>
                  <p className="text-sm text-gray-400 mb-4">{briefing}</p>
                  <button onClick={generateBriefing} className="text-sm font-semibold text-brand-primary hover:text-yellow-300">Regenerate</button>
                </div>
             ) : (
                <div>
                    <p className="text-sm text-gray-400 mb-4">Click the button to get a real-time summary of your herd's status from your HERE AND NOW AI Assistant.</p>
                    <button onClick={generateBriefing} className="w-full bg-brand-primary text-brand-secondary font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors">
                        Generate Briefing
                    </button>
                </div>
             )}
         </div>
        </div>
      </div>
      
       {/* Activity Feed */}
      <div className="bg-brand-card p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Recent Activity & Alerts</h3>
        <ActivityFeed alerts={alerts} animals={animals} />
      </div>

    </div>
  );
};

export default Dashboard;

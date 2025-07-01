
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AnimalTable from './components/AnimalTable';
import FeedManagement from './components/FeedManagement';
import Analysis from './components/Analysis';
import AlertsView from './components/AlertsView';
import Settings from './components/Settings';
import { mockAnimals, mockAlerts } from './constants';

export type View = 'dashboard' | 'animals' | 'feed' | 'alerts' | 'settings' | 'analysis';

function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard animals={mockAnimals} alerts={mockAlerts} setActiveView={setActiveView} />;
      case 'animals':
        return <AnimalTable animals={mockAnimals} />;
      case 'feed':
        return <FeedManagement />;
      case 'analysis':
        return <Analysis />;
      case 'alerts':
        return <AlertsView alerts={mockAlerts} animals={mockAnimals} />;
      case 'settings':
          return <Settings />;
      default:
        return <Dashboard animals={mockAnimals} alerts={mockAlerts} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-dark text-gray-300 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-dark p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
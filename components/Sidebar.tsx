
import React from 'react';
import { DashboardIcon, AnimalIcon, AlertIcon, SettingsIcon, GrainIcon, AnalysisIcon, BlogIcon, LinkedinIcon, InstagramIcon, GithubIcon, XIcon, YoutubeIcon } from './icons';
import type { View } from '../App';

interface NavItemProps {
  view: View;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ view, label, icon, isActive, onClick }: NavItemProps) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive
          ? 'bg-brand-primary text-brand-secondary shadow-lg'
          : 'text-gray-400 hover:bg-brand-card hover:text-gray-200'
      }`}
    >
      {icon}
      <span className="mx-4 font-medium">{label}</span>
    </li>
  );
}


interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const navItems = [
    { view: 'dashboard' as View, label: 'Dashboard', icon: <DashboardIcon className="h-6 w-6" /> },
    { view: 'animals' as View, label: 'Animals', icon: <AnimalIcon className="h-6 w-6" /> },
    { view: 'feed' as View, label: 'Feed', icon: <GrainIcon className="h-6 w-6" /> },
    { view: 'analysis' as View, label: 'Analysis', icon: <AnalysisIcon className="h-6 w-6" /> },
    { view: 'alerts' as View, label: 'Alerts', icon: <AlertIcon className="h-6 w-6" /> },
    { view: 'settings' as View, label: 'Settings', icon: <SettingsIcon className="h-6 w-6" /> },
  ];

  const socialMedia = [
      { name: 'Blog', icon: <BlogIcon className="h-5 w-5"/>, href: 'https://hereandnowai.com/blog' },
      { name: 'LinkedIn', icon: <LinkedinIcon className="h-5 w-5"/>, href: 'https://www.linkedin.com/company/hereandnowai/' },
      { name: 'Instagram', icon: <InstagramIcon className="h-5 w-5"/>, href: 'https://instagram.com/hereandnow_ai' },
      { name: 'GitHub', icon: <GithubIcon className="h-5 w-5"/>, href: 'https://github.com/hereandnowai' },
      { name: 'X', icon: <XIcon className="h-4 w-4"/>, href: 'https://x.com/hereandnow_ai' },
      { name: 'YouTube', icon: <YoutubeIcon className="h-5 w-5"/>, href: 'https://youtube.com/@hereandnow_ai' },
  ];

  return (
    <div className="flex flex-col w-64 bg-brand-card border-r border-brand-border">
      <div className="flex items-center justify-center h-20 px-4 border-b border-brand-border">
         <img src="https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png" alt="HERE AND NOW AI Logo" className="h-12" />
      </div>
      <div className="flex-1 p-4">
        <nav>
          <ul>
            {navItems.map((item) => (
              <NavItem
                key={item.view}
                view={item.view}
                label={item.label}
                icon={item.icon}
                isActive={activeView === item.view}
                onClick={() => setActiveView(item.view)}
              />
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-4 border-t border-brand-border text-center">
        <div className="flex justify-center items-center space-x-3 mb-3">
            {socialMedia.map(item => (
                <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-primary transition-colors">
                    <span className="sr-only">{item.name}</span>
                    {item.icon}
                </a>
            ))}
        </div>
        <p className="text-xs text-gray-500">&copy; 2024 HERE AND NOW AI</p>
        <p className="text-xs text-gray-500 mt-1 italic">"designed with passion for innovation"</p>
      </div>
    </div>
  );
};

export default Sidebar;

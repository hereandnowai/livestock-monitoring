
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

function StatCard({ title, value, icon, onClick }: StatCardProps) {
  const isClickable = !!onClick;
  return (
    <div 
        className={`bg-brand-card p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105 ${isClickable ? 'cursor-pointer' : ''}`}
        onClick={onClick}
    >
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-100">{value}</p>
      </div>
      <div className="bg-gray-800 p-3 rounded-full">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;

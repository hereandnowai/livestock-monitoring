
import React from 'react';

function Header() {
  return (
    <header className="bg-brand-card shadow-md z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 border-b border-brand-border">
        <div>
           <h1 className="text-xl font-semibold text-gray-200">Livestock Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
            <span className="text-gray-400">Welcome, Farmer John</span>
            <img 
                className="h-10 w-10 rounded-full object-cover" 
                src="https://picsum.photos/id/1005/100/100" 
                alt="User avatar" 
            />
        </div>
      </div>
    </header>
  );
};

export default Header;
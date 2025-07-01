
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockCornPrice, mockFeedStock, mockFeedConsumptionHistory, mockDailyConsumptionTarget } from '../constants';
import { DownloadIcon } from './icons';

function FeedStatCard({ title, value, subValue, isPositive }: { title: string, value: string, subValue?: string, isPositive?: boolean }) {
    const subValueColor = isPositive === undefined ? 'text-gray-400' : isPositive ? 'text-green-400' : 'text-red-400';
    return (
        <div className="bg-brand-card p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-100">{value}</p>
            {subValue && <p className={`text-sm font-semibold ${subValueColor}`}>{subValue}</p>}
        </div>
    );
}

function ConsumptionGauge() {
    const todayConsumption = mockFeedConsumptionHistory[mockFeedConsumptionHistory.length - 1].amount;
    const consumptionPercentage = Math.min((todayConsumption / mockDailyConsumptionTarget) * 100, 100);

    return (
        <div className="bg-brand-card p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-medium text-gray-200 mb-2">Daily Consumption</h3>
            <div className="relative w-36 h-36">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="3.5"
                    />
                    <path
                        className="transition-all duration-500"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={consumptionPercentage > 90 ? '#ef4444' : consumptionPercentage > 75 ? '#eab308' : '#FFDF00'}
                        strokeWidth="3.5"
                        strokeDasharray={`${consumptionPercentage}, 100`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{todayConsumption.toFixed(1)}</span>
                    <span className="text-sm text-gray-400">/ {mockDailyConsumptionTarget} tons</span>
                </div>
            </div>
        </div>
    );
}

function InventoryStatus() {
    const { currentAmount, capacity, reorderLevel } = mockFeedStock;
    const stockPercentage = (currentAmount / capacity) * 100;

    let statusColor = 'bg-brand-primary';
    let statusText = 'Healthy';
    if (stockPercentage < reorderLevel) {
        statusColor = 'bg-red-500';
        statusText = 'Critical - Reorder';
    } else if (stockPercentage < reorderLevel + 15) {
        statusColor = 'bg-yellow-500';
        statusText = 'Low - Reorder Soon';
    }

    const statusTextColor = stockPercentage < reorderLevel 
        ? 'text-red-400' 
        : stockPercentage < reorderLevel + 15 
        ? 'text-yellow-400' 
        : 'text-yellow-300';


    return (
        <div className="bg-brand-card p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Inventory Status</h3>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                <div className={`${statusColor} h-4 rounded-full transition-all duration-500`} style={{ width: `${stockPercentage}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-4">
                <span>0%</span>
                <span>{currentAmount.toLocaleString()} / {capacity.toLocaleString()} tons</span>
                <span>100%</span>
            </div>
            <div className="text-center bg-brand-dark p-3 rounded-lg">
                <p className="text-2xl font-bold text-white">{stockPercentage.toFixed(1)}%</p>
                <p className={`text-sm font-semibold ${statusTextColor}`}>{statusText}</p>
            </div>
        </div>
    );
}

function FeedManagement() {
    const [manualConsumption, setManualConsumption] = useState('');
    
    const { price, change, changePercent } = mockCornPrice;
    const todayConsumption = mockFeedConsumptionHistory[mockFeedConsumptionHistory.length - 1].amount;
    const pricePerTon = price * 39.37; // Approx conversion from bushel to ton
    const dailyCost = todayConsumption * pricePerTon;
    const forecastDays = mockFeedStock.currentAmount / todayConsumption;

    const chartData = mockFeedConsumptionHistory.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        consumption: parseFloat(item.amount.toFixed(2)),
        target: mockDailyConsumptionTarget,
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Livestock Feed Management</h1>
                <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 bg-brand-primary text-brand-secondary font-semibold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors">
                        <DownloadIcon className="h-5 w-5" />
                        <span>Export PDF</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-transparent border border-brand-primary text-brand-primary font-semibold py-2 px-4 rounded-md hover:bg-brand-primary/10 transition-colors">
                       <DownloadIcon className="h-5 w-5" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeedStatCard 
                    title="Teucrium Corn Fund (CORN)"
                    value={`$${price.toFixed(2)}`}
                    subValue={`${change > 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)`}
                    isPositive={change > 0}
                />
                <ConsumptionGauge />
                <FeedStatCard 
                    title="Forecast"
                    value={`${Math.floor(forecastDays)} Days`}
                    subValue="Feed stock remaining"
                />
                <FeedStatCard 
                    title="Estimated Daily Cost"
                    value={`$${dailyCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    subValue={`${todayConsumption.toFixed(1)} tons consumed`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-brand-card p-4 rounded-lg shadow-lg h-[400px]">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Historical Consumption (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tick={{ fill: '#9ca3af' }} />
                            <YAxis stroke="#9ca3af" fontSize={12} label={{ value: 'Tons', angle: -90, position: 'insideLeft', fill: '#9ca3af', dy: 40 }} tick={{ fill: '#9ca3af' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                                labelStyle={{ color: '#d1d5db' }}
                            />
                            <Legend wrapperStyle={{ color: '#9ca3af' }}/>
                            <Line type="monotone" name="Consumption" dataKey="consumption" stroke="#FFDF00" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" name="Target" dataKey="target" stroke="#9ca3af" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-6">
                    <InventoryStatus />
                     <div className="bg-brand-card p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Log Today's Consumption</h3>
                        <div className="flex space-x-2">
                            <input 
                                type="number"
                                placeholder={`e.g. ${mockDailyConsumptionTarget} tons`}
                                className="w-full bg-brand-dark border border-brand-border rounded-md px-3 py-2 text-white focus:ring-1 focus:ring-brand-primary focus:border-brand-primary outline-none"
                                value={manualConsumption}
                                onChange={(e) => setManualConsumption(e.target.value)}
                            />
                            <button className="bg-brand-primary text-brand-secondary font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors">
                                Log
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Overrides auto-synced data for today.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedManagement;

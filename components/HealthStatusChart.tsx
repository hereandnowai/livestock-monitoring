import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Animal, HealthStatus } from '../types';

interface HealthStatusChartProps {
  animals: Animal[];
}

function HealthStatusChart({ animals }: HealthStatusChartProps) {
  const data = [
    { name: 'Healthy', value: animals.filter(a => a.healthStatus === HealthStatus.Healthy).length },
    { name: 'Warning', value: animals.filter(a => a.healthStatus === HealthStatus.Warning).length },
    { name: 'Critical', value: animals.filter(a => a.healthStatus === HealthStatus.Critical).length },
  ];

  const COLORS = {
    [HealthStatus.Healthy]: '#22c55e', // green-500
    [HealthStatus.Warning]: '#eab308', // yellow-500
    [HealthStatus.Critical]: '#ef4444', // red-500
  };

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as HealthStatus]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#d1d5db' }}
          />
          <Legend iconType="circle" wrapperStyle={{ color: '#9ca3af', fontSize: '14px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthStatusChart;
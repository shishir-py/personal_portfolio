'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// Sample data (normally this would come from the database)
const SKILLS_DATA = [
  { name: 'Python', level: 95, category: 'Programming' },
  { name: 'SQL', level: 90, category: 'Database' },
  { name: 'MongoDB', level: 85, category: 'Database' },
  { name: 'TensorFlow', level: 80, category: 'ML' },
  { name: 'Data Visualization', level: 90, category: 'Analysis' },
  { name: 'Google Analytics', level: 75, category: 'Tools' },
  { name: 'Looker', level: 85, category: 'Tools' },
  { name: 'ETL Pipelines', level: 80, category: 'Data Engineering' }
];

export function SkillsChart() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const categories = ['All', ...Array.from(new Set(SKILLS_DATA.map(item => item.category)))];
  
  const filteredData = activeCategory === 'All' 
    ? SKILLS_DATA 
    : SKILLS_DATA.filter(skill => skill.category === activeCategory);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-100 p-3 border border-gray-700 shadow-lg rounded-md">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-primary-400">{`Proficiency: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-dark-200 text-gray-300 hover:bg-dark-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={filteredData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fill: '#94a3b8' }} 
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="level" 
            fill="#0ea5e9" 
            barSize={20} 
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
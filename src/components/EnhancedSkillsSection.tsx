'use client';

import { motion } from 'framer-motion';
import { Code, Database, Brain, BarChart3, Zap, Globe, Eye, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const skillIcons: Record<string, any> = {
  'Programming Languages': Code,
  'Data Science': BarChart3,
  'Machine Learning': Brain,
  'Databases': Database,
  'Tools & Technologies': Zap,
  'Frameworks': Globe,
  'Soft Skills': Target,
  'default': Eye
};

export const EnhancedSkillsSection = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [groupedSkills, setGroupedSkills] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills');
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const rawSkills = result.skills || [];
            setSkills(rawSkills);

            // Process data for chart (Average level per category)
            const categoryMap = rawSkills.reduce((acc: any, skill: any) => {
              const cat = skill.category || 'Other';
              if (!acc[cat]) {
                acc[cat] = { total: 0, count: 0, skills: [] };
              }
              acc[cat].total += skill.level || 0;
              acc[cat].count += 1;
              acc[cat].skills.push(skill);
              return acc;
            }, {});

            const data = Object.keys(categoryMap).map(cat => ({
              subject: cat,
              A: Math.round(categoryMap[cat].total / categoryMap[cat].count),
              fullMark: 100
            }));
            setChartData(data);
            setGroupedSkills(categoryMap);
          }
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-dark-200 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
            Technical Proficiency
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Visualizing my technical strengths and expertise across different domains.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[400px] w-full bg-dark-100/50 rounded-3xl p-4 border border-gray-700/50 relative"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Skill Level"
                  dataKey="A"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fill="#8B5CF6"
                  fillOpacity={0.3}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                  itemStyle={{ color: '#A78BFA' }}
                />
              </RadarChart>
            </ResponsiveContainer>
            <div className="absolute top-4 right-4 text-xs text-gray-500">
              * Average proficiency by category
            </div>
          </motion.div>

          {/* Category Overview Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white">Balanced Skill Set</h3>
            <p className="text-gray-300 leading-relaxed">
              My expertise spans across the full stack of data science and software engineering.
              From building robust backend systems to creating intuitive frontend interfaces,
              and deriving actionable insights from complex datasets.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {chartData.slice(0, 4).map((item, idx) => (
                <div key={idx} className="bg-dark-100 p-4 rounded-xl border border-gray-700/30">
                  <div className="text-2xl font-bold text-primary-400 mb-1">{item.A}%</div>
                  <div className="text-sm text-gray-400">{item.subject}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Detailed Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedSkills).map(([category, data]: [string, any], index) => {
            const Icon = skillIcons[category] || skillIcons.default;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-dark-100 rounded-2xl p-6 border border-gray-700/50 hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary-500/10 rounded-lg text-primary-400">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{category}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill: any) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1.5 bg-dark-200 text-gray-300 rounded-lg text-sm border border-gray-700 hover:border-primary-500/50 hover:text-white transition-colors cursor-default"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

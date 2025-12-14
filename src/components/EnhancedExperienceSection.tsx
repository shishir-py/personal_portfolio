'use client';

import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Experience {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
}

export const EnhancedExperienceSection = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const response = await fetch('/api/experience');
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        // Sort by start date descending
                        const sorted = (result.experience || []).sort((a: Experience, b: Experience) =>
                            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                        );
                        setExperiences(sorted);
                    }
                }
            } catch (error) {
                console.error('Error fetching experience:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExperience();
    }, []);

    if (isLoading) {
        return (
            <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-dark-300">
                <div className="max-w-7xl mx-auto flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </section>
        );
    }

    if (experiences.length === 0) {
        return null;
    }

    return (
        <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-dark-300">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                        Professional Experience
                    </h2>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                        My journey through the tech industry, building impactful solutions and leading teams.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gray-700/50 rounded-full"></div>

                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Timeline dot */}
                                <div className="absolute left-[-5px] md:left-1/2 transform md:-translate-x-1/2 top-0 w-3.5 h-3.5 bg-primary-500 rounded-full border-4 border-dark-300 z-10"></div>

                                {/* Content */}
                                <div className="flex-1 md:w-1/2">
                                    <div className={`bg-dark-200 p-6 rounded-2xl border border-gray-700/50 hover:border-primary-500/30 transition-all duration-300 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                                        }`}>
                                        <div className={`flex items-center gap-3 mb-2 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                                            }`}>
                                            <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                                            {exp.current && (
                                                <span className="px-2 py-1 text-xs bg-primary-500/20 text-primary-400 rounded-full border border-primary-500/30">
                                                    Current
                                                </span>
                                            )}
                                        </div>

                                        <div className={`flex items-center gap-2 text-primary-400 font-medium mb-4 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                                            }`}>
                                            <Building2 size={16} />
                                            <span>{exp.company}</span>
                                        </div>

                                        <div className={`flex flex-wrap gap-4 text-sm text-gray-400 mb-4 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                                            }`}>
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                <span>
                                                    {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
                                                    {exp.current ? ' Present' : (exp.endDate ? ` ${new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : '')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                <span>{exp.location}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Spacer for the other side */}
                                <div className="hidden md:block flex-1"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

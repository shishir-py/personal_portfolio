'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Education {
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
    gpa?: string;
}

export const EnhancedEducationSection = () => {
    const [educationList, setEducationList] = useState<Education[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const response = await fetch('/api/education');
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        // Sort by start date descending
                        const sorted = (result.education || []).sort((a: Education, b: Education) =>
                            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                        );
                        setEducationList(sorted);
                    }
                }
            } catch (error) {
                console.error('Error fetching education:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEducation();
    }, []);

    if (isLoading) {
        return (
            <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-dark-200">
                <div className="max-w-7xl mx-auto flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </section>
        );
    }

    if (educationList.length === 0) {
        return null;
    }

    return (
        <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-dark-200">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                        Education
                    </h2>
                    <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                        Academic background and qualifications.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {educationList.map((edu, index) => (
                        <motion.div
                            key={edu.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -5, transition: { duration: 0.3 } }}
                            className="bg-dark-100 rounded-2xl p-8 border border-gray-700/50 hover:border-primary-500/30 transition-all duration-300 group relative overflow-hidden"
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                                <GraduationCap size={120} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-primary-500/10 rounded-xl text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                                        <GraduationCap size={24} />
                                    </div>
                                    {edu.current && (
                                        <span className="px-3 py-1 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full border border-primary-500/30">
                                            Current
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors duration-300">
                                    {edu.degree}
                                </h3>

                                <div className="text-lg text-gray-300 font-medium mb-4">
                                    {edu.institution}
                                </div>

                                <div className="space-y-3 text-sm text-gray-400 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-primary-500" />
                                        <span>
                                            {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
                                            {edu.current ? ' Present' : (edu.endDate ? ` ${new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : '')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-primary-500" />
                                        <span>{edu.location}</span>
                                    </div>
                                    {edu.gpa && (
                                        <div className="flex items-center gap-2">
                                            <Award size={16} className="text-primary-500" />
                                            <span>GPA: {edu.gpa}</span>
                                        </div>
                                    )}
                                </div>

                                {edu.description && (
                                    <p className="text-gray-300 leading-relaxed border-t border-gray-700/50 pt-4">
                                        {edu.description}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

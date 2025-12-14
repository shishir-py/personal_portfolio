'use client';
import { Navbar } from '@/components/EnhancedNavbar';
import { Footer } from '@/components/Footer';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Award, Users, Coffee, Heart } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ProfileData {
  fullName?: string;
  title?: string;
  bio?: string;
  location?: string;
  profilePic?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export default function AboutPage() {
  const [profile, setProfile] = useState<ProfileData>({});
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const profileResponse = await fetch('/api/profile');
        if (profileResponse.ok) {
          const profileResult = await profileResponse.json();
          if (profileResult.success && profileResult.profile) {
            setProfile(profileResult.profile);
          }
        }

        // Fetch experience
        const experienceResponse = await fetch('/api/experience');
        if (experienceResponse.ok) {
          const experienceResult = await experienceResponse.json();
          if (experienceResult.success) {
            setExperiences(experienceResult.experience);
          }
        }

        // Fetch education
        const educationResponse = await fetch('/api/education');
        if (educationResponse.ok) {
          const educationResult = await educationResponse.json();
          if (educationResult.success) {
            setEducation(educationResult.education);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const achievements = [
    { icon: Award, title: 'Certified Data Scientist', description: 'Advanced certification in data science and analytics' },
    { icon: Users, title: '50+ Projects Completed', description: 'Successfully delivered projects across various industries' },
    { icon: Coffee, title: '1000+ Coffee Cups', description: 'Fueled by coffee and passion for data' },
    { icon: Heart, title: 'Community Contributor', description: 'Active contributor to open-source projects' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-100 relative">
      <AnimatedBackground />
      <Navbar />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                  About Me
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Passionate about transforming data into meaningful insights and building solutions that make a difference.
                </p>
              </div>
            </ScrollReveal>

            {/* Personal Story */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <ScrollReveal direction="left">
                <div className="relative">
                  <div className="aspect-square max-w-md mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
                    <Image
                      src={profile.profilePic || "/1000079466.jpg"}
                      alt={profile.fullName || "Tara Prasad Pandey"}
                      fill
                      className="object-cover rounded-2xl border-4 border-gray-700/50 relative z-10"
                    />
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white mb-6">My Journey</h2>
                  
                  <div className="space-y-4 text-gray-300">
                    <p>
                      Born and raised in the beautiful hills of Nepal 🇳🇵, I discovered my passion for data and technology 
                      during my university years. What started as curiosity about how data could tell stories evolved 
                      into a full-fledged career in data science and machine learning.
                    </p>
                    
                    <p>
                      With over 5 years of experience in the field, I've had the privilege of working on diverse projects 
                      ranging from predictive analytics for healthcare to automation systems for financial services. 
                      I believe in the power of data to drive positive change in the world.
                    </p>
                    
                    <p>
                      When I'm not coding or analyzing data, you'll find me exploring the mountains of Nepal, 
                      contributing to open-source projects, or sharing knowledge with the next generation of data enthusiasts.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex items-center gap-2 text-primary-400">
                      <MapPin className="w-4 h-4" />
                      <span>Kathmandu, Nepal</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>5+ Years Experience</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-dark-200/50">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                Professional Experience
              </h2>
            </ScrollReveal>

            <div className="space-y-8">
              {experiences.length > 0 ? experiences.map((exp, index) => (
                <ScrollReveal key={exp.id} delay={index * 0.2}>
                  <div className="bg-dark-100 rounded-2xl p-8 border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                        <p className="text-primary-400 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-gray-400 mt-2 lg:mt-0">
                        {new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
                      </div>
                    </div>
                    
                    {exp.location && <p className="text-gray-400 text-sm mb-2">{exp.location}</p>}
                    <p className="text-gray-300 mb-4">{exp.description}</p>
                  </div>
                </ScrollReveal>
              )) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No work experience added yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                Achievements & Milestones
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <div className="bg-dark-100 rounded-2xl p-6 text-center border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 group">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500/20 to-primary-600/20 group-hover:from-primary-500/30 group-hover:to-primary-600/30 transition-all">
                        <Icon className="w-8 h-8 text-primary-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{achievement.description}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-dark-200/50">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                My Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Innovation</h3>
                  <p className="text-gray-300">
                    Always seeking creative solutions to complex problems using cutting-edge technology.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Integrity</h3>
                  <p className="text-gray-300">
                    Maintaining ethical standards in data handling and delivering honest, transparent results.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">Impact</h3>
                  <p className="text-gray-300">
                    Focused on creating data-driven solutions that make a meaningful difference.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
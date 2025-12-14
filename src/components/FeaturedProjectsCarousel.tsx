'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useProjectStore } from '@/lib/store';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  content?: string;
  featured?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export function FeaturedProjectsCarousel() {
  const { featuredProjects, loading, error, fetchProjects } = useProjectStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  const nextProject = () => {
    if (!featuredProjects || featuredProjects.length === 0) return;
    setCurrentIndex((prevIndex: number) => (prevIndex === featuredProjects.length - 1 ? 0 : prevIndex + 1));
  };
  
  const prevProject = () => {
    if (!featuredProjects || featuredProjects.length === 0) return;
    setCurrentIndex((prevIndex: number) => (prevIndex === 0 ? featuredProjects.length - 1 : prevIndex - 1));
  };
  
  // If we're loading, show a placeholder
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-dark-100 shadow-xl animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-[300px] md:h-[400px] bg-dark-200"></div>
          <div className="p-6 md:p-8">
            <div className="h-8 bg-dark-200 rounded w-3/4 mb-4"></div>
            <div className="flex gap-2 mt-3">
              <div className="h-6 w-16 bg-dark-200 rounded-full"></div>
              <div className="h-6 w-16 bg-dark-200 rounded-full"></div>
            </div>
            <div className="h-20 bg-dark-200 rounded w-full mt-4"></div>
            <div className="mt-auto pt-6 flex gap-4">
              <div className="h-10 w-24 bg-dark-200 rounded-md"></div>
              <div className="h-10 w-24 bg-dark-200 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // If there's an error or no projects, show an error message
  if (error || !featuredProjects || featuredProjects.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-dark-100 shadow-xl p-6">
        <h3 className="text-xl font-medium text-center">
          {error || "No featured projects available"}
        </h3>
      </div>
    );
  }
  
  const currentProject = featuredProjects[currentIndex];
  
  return (
    <div className="relative overflow-hidden rounded-xl bg-dark-100 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image section */}
        <div className="relative h-[300px] md:h-[400px]">
          <Image
            src={currentProject.coverImage || '/assets/projects/placeholder.jpg'}
            alt={currentProject.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-dark-300/80 to-transparent md:bg-none"></div>
        </div>
        
        {/* Content section */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <div>
                <h3 className="text-2xl font-bold">{currentProject.title}</h3>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {currentProject.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 text-xs rounded-full bg-primary-900/30 text-primary-400">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <p className="mt-4 text-gray-300">
                  {currentProject.description}
                </p>
              </div>
              
              <div className="mt-auto pt-6 flex gap-4">
                {currentProject.githubUrl && (
                  <Link 
                    href={currentProject.githubUrl} 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-dark-200 hover:bg-dark-100 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub />
                    Code
                  </Link>
                )}
                
                {currentProject.demoUrl && (
                  <Link 
                    href={currentProject.demoUrl}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary-700 hover:bg-primary-600 transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <FaExternalLinkAlt />
                    Live Demo
                  </Link>
                )}
                
                <Link 
                  href={`/projects/${currentProject.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary-700/50 hover:bg-primary-700/70 transition-colors"
                >
                  Details
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Navigation arrows - Only show if we have more than one project */}
      {featuredProjects.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button 
            onClick={prevProject}
            className="p-2 rounded-full bg-dark-200/50 backdrop-blur-sm hover:bg-dark-100 transition-colors"
            aria-label="Previous project"
          >
            <FaChevronLeft className="text-sm" />
          </button>
          <button 
            onClick={nextProject}
            className="p-2 rounded-full bg-dark-200/50 backdrop-blur-sm hover:bg-dark-100 transition-colors"
            aria-label="Next project"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      )}
      
      {/* Indicators - Only show if we have more than one project */}
      {featuredProjects.length > 1 && (
        <div className="absolute bottom-4 left-4 flex gap-1.5">
          {featuredProjects.map((project: Project, index: number) => (
            <button
              key={project.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary-400' : 'bg-gray-500'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
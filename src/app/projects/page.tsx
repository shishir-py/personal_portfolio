'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Eye, Filter, Search, Grid, List, ArrowLeft } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Navbar } from '@/components/EnhancedNavbar';
import { Footer } from '@/components/Footer';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  tags: string[];
  category?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.projects) {
            // Transform API data to match Project interface
            const transformedProjects = data.projects.map((project: any) => ({
              id: project.id,
              title: project.title,
              slug: project.slug,
              description: project.description,
              coverImage: project.coverImage,
              githubUrl: project.githubUrl,
              demoUrl: project.demoUrl,
              featured: project.featured || false,
              tags: Array.isArray(project.technologies) ? project.technologies : [],
              category: project.category || 'Web Development'
            }));
            
            setProjects(transformedProjects);
            
            // Extract unique tags
            const uniqueTags = Array.from(
              new Set(transformedProjects.flatMap((project: Project) => project.tags || []))
            ) as string[];
            setAllTags(uniqueTags);
          } else {
            console.error('No projects data received');
            setProjects([]);
            setAllTags([]);
          }
        } else {
          throw new Error('Failed to fetch projects');
        }
      } catch (err) {
        setError('Failed to load projects');
        console.error('Error fetching projects:', err);
        setProjects([]);
        setAllTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = activeTag 
    ? (projects || []).filter(project => project.tags?.includes(activeTag))
    : (projects || []).filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-100 relative">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="flex flex-col justify-center items-center h-64 space-y-8">
            <LoadingSpinner size="lg" />
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-300 text-center"
            >
              Loading amazing projects...
            </motion.p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-100 relative">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-100 relative">
      <AnimatedBackground />
      <Navbar />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
              My Projects
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A comprehensive showcase of my work in data science, machine learning, and web development.
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 space-y-6"
          >
            {/* Search and View Mode */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-100 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              
              <div className="flex items-center gap-2 bg-dark-100 p-1 rounded-full border border-gray-600">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-primary-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTag(null)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeTag === null
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-dark-100 text-gray-300 hover:bg-dark-200 border border-gray-600'
                }`}
              >
                All Projects ({projects.length})
              </motion.button>
              
              {allTags.map((tag) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    activeTag === tag
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-dark-100 text-gray-300 hover:bg-dark-200 border border-gray-600'
                  }`}
                >
                  {tag} ({projects.filter(p => p.tags?.includes(tag)).length})
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Projects Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTag}-${searchTerm}-${viewMode}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
              }
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`group relative bg-dark-100 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3' : ''}`}>
                    <div className={`bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center ${
                      viewMode === 'list' ? 'h-full' : 'aspect-video'
                    }`}>
                      {project.coverImage ? (
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-gray-500 text-4xl">📊</div>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-300/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                        {project.githubUrl && (
                          <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                          >
                            <Github className="w-5 h-5" />
                          </motion.a>
                        )}
                        {project.demoUrl && (
                          <motion.a
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </motion.a>
                        )}
                        <Link href={`/projects/${project.slug || project.id}`}>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center justify-center w-10 h-10 bg-primary-500/80 backdrop-blur-sm rounded-full text-white hover:bg-primary-600/80 transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.div>
                        </Link>
                      </div>
                    </div>

                    {project.featured && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {(project.tags?.length || 0) > 3 && (
                        <span className="px-3 py-1 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full">
                          +{(project.tags?.length || 0) - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{project.category || 'Project'}</span>
                      <Link
                        href={`/projects/${project.slug || project.id}`}
                        className="text-primary-400 hover:text-primary-300 font-medium text-sm flex items-center gap-1"
                      >
                        Learn More
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-gray-500 text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-medium text-gray-400 mb-2">No projects found</h3>
              <p className="text-gray-500 mb-6">
                {activeTag 
                  ? `No projects with the tag "${activeTag}" found.`
                  : searchTerm 
                    ? `No projects matching "${searchTerm}" found.`
                    : 'No projects available at the moment.'
                }
              </p>
              {(activeTag || searchTerm) && (
                <button
                  onClick={() => {
                    setActiveTag(null);
                    setSearchTerm('');
                  }}
                  className="px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
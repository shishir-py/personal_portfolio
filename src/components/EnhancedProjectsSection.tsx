'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Eye, Filter, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { LikeButton } from './LikeButton';
import { FeedbackSection } from './FeedbackSection';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  featured: boolean;
  likes?: number;
  _count?: {
    comments: number;
  };
}

export const EnhancedProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Web Development', 'Data Science', 'Machine Learning', 'Automation'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();

        // Handle API response structure
        let projectsArray = [];
        if (data && data.success && Array.isArray(data.projects)) {
          projectsArray = data.projects;
        } else if (Array.isArray(data)) {
          projectsArray = data;
        }

        setProjects(projectsArray);
        setFilteredProjects(projectsArray);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Ensure projects is always an array before filtering
    const safeProjects = Array.isArray(projects) ? projects : [];

    if (selectedCategory === 'All') {
      setFilteredProjects(safeProjects);
    } else {
      setFilteredProjects(safeProjects.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory, projects]);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-dark-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-dark-200 rounded-2xl p-6 animate-pulse">
                <div className="bg-gray-700 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-700 h-6 rounded mb-2"></div>
                <div className="bg-gray-700 h-4 rounded mb-4 w-3/4"></div>
                <div className="flex gap-2">
                  <div className="bg-gray-700 h-6 rounded-full w-16"></div>
                  <div className="bg-gray-700 h-6 rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-dark-100">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
            Featured Projects
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
            A showcase of my work in data science, machine learning, and web development
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 relative ${selectedCategory === category
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-dark-200 text-gray-300 hover:bg-dark-300 hover:text-white border border-gray-600'
                  }`}
              >
                <span className="flex items-center gap-2 relative z-10">
                  <Filter className="w-4 h-4" />
                  {category}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {(filteredProjects || []).map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group relative bg-dark-200 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title || 'Project image'}
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
                      {project.liveUrl && (
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </motion.a>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center justify-center w-10 h-10 bg-primary-500/80 backdrop-blur-sm rounded-full text-white hover:bg-primary-600/80 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {project.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {project.title || 'Untitled Project'}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {project.description || 'No description available'}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(project.technologies || []).slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {(project.technologies || []).length > 3 && (
                      <span className="px-3 py-1 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full">
                        +{(project.technologies || []).length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-4">
                      <LikeButton id={project.id} initialLikes={project.likes || 0} type="project" />
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <span className="font-medium">{project._count?.comments || 0}</span>
                        <span>comments</span>
                      </div>
                    </div>

                    <Link
                      href={`/projects/${project.id || 'unknown'}`}
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

        {(!filteredProjects || filteredProjects.length === 0) && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-500 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-400 mb-2">No projects found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-full hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-primary-500/25"
          >
            View All Projects
            <ExternalLink className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      <div className="mt-20">
        <FeedbackSection />
      </div>
    </section>
  );
};
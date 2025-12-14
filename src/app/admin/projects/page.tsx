'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit3, Trash2, Eye, Github, ExternalLink, Star,
  Filter, Search, Grid, List, Calendar, Tag, Image as ImageIcon,
  CheckCircle, X, AlertCircle, Upload, Save, ArrowUpDown,
  MoreHorizontal, Copy, Archive, Globe
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ProjectModal from '@/components/admin/ProjectModal';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  shortDescription?: string;
  coverImage?: string;
  images?: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  technologies: string[];
  tags: string[];
  category: string;
  status: 'active' | 'completed' | 'archived';
  order: number;
  createdAt: string;
  updatedAt: string;
  views?: number;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface ApiProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage?: string;
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Helper function to transform API project to component format
const transformProject = (apiProject: ApiProject): Project => ({
  ...apiProject,
  content: apiProject.content || '',
  tags: apiProject.tags || [],
  technologies: apiProject.tags || [],
  category: apiProject.tags?.[0] || 'Other',
  status: 'active' as const,
  shortDescription: apiProject.description,
  views: Math.floor(Math.random() * 2000) + 100 // Random views for demo
});

const categories = ['All', 'Data Analysis', 'Machine Learning', 'Data Visualization', 'Web Development', 'Mobile App'];
const statuses = ['All', 'Active', 'Completed', 'Archived'];
const technologies = ['Python', 'React', 'Node.js', 'TensorFlow', 'Pandas', 'MongoDB', 'PostgreSQL', 'FastAPI', 'Streamlit'];

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTech, setSelectedTech] = useState('All');
  const [sortBy, setSortBy] = useState('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/projects');

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.projects) {
          const transformedProjects = data.projects.map(transformProject);
          setProjects(transformedProjects);
          setFilteredProjects(transformedProjects);
          addNotification({
            type: 'success',
            title: 'Projects Loaded',
            message: `Successfully loaded ${transformedProjects.length} projects from database.`
          });
        } else {
          throw new Error('No projects data received');
        }
      } else {
        throw new Error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      addNotification({
        type: 'error',
        title: 'Database Connection Failed',
        message: 'Could not load projects from database. Please check your connection.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search effect
  useEffect(() => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(project => project.status === selectedStatus.toLowerCase());
    }

    // Technology filter
    if (selectedTech !== 'All') {
      filtered = filtered.filter(project => project.technologies.includes(selectedTech));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'views':
          return (b.views || 0) - (a.views || 0);
        default:
          return a.order - b.order;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, selectedStatus, selectedTech, sortBy]);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Delete project
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        addNotification({
          type: 'success',
          title: 'Project Deleted',
          message: 'Project has been successfully deleted.'
        });
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      // For demo, just remove from local state
      setProjects(prev => prev.filter(p => p.id !== id));
      addNotification({
        type: 'success',
        title: 'Project Deleted',
        message: 'Project removed from local list.'
      });
    }
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  // Toggle featured status
  const toggleFeatured = async (id: string) => {
    try {
      const project = projects.find(p => p.id === id);
      if (!project) return;

      const updatedProject = { ...project, featured: !project.featured };

      // For demo, just update local state
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));

      addNotification({
        type: 'success',
        title: 'Project Updated',
        message: `Project ${updatedProject.featured ? 'featured' : 'unfeatured'}.`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update project status.'
      });
    }
  };

  // Animation variants
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const cardVariants: any = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Projects Management</h1>
            <p className="text-gray-400">Manage your portfolio projects and showcase your work</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProjectModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Project
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            variants={itemVariants}
            className="bg-dark-100 rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Grid className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Projects</p>
                <p className="text-white font-semibold text-lg">{projects.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-dark-100 rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Featured</p>
                <p className="text-white font-semibold text-lg">{projects.filter(p => p.featured).length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-dark-100 rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-white font-semibold text-lg">{projects.filter(p => p.status === 'completed').length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-dark-100 rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-white font-semibold text-lg">{projects.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`mb-4 p-4 rounded-lg border-l-4 ${notification.type === 'success'
              ? 'bg-green-500/10 border-green-500 text-green-400'
              : notification.type === 'error'
                ? 'bg-red-500/10 border-red-500 text-red-400'
                : notification.type === 'warning'
                  ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400'
                  : 'bg-blue-500/10 border-blue-500 text-blue-400'
              }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm opacity-90">{notification.message}</p>
              </div>
              <button onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="bg-dark-100 rounded-xl p-4 border border-gray-700/50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Quick filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              >
                <option value="updated">Last Updated</option>
                <option value="created">Date Created</option>
                <option value="title">Title</option>
                <option value="views">Views</option>
              </select>

              {/* View mode toggle */}
              <div className="flex items-center gap-1 bg-dark-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-dark-100 rounded-xl p-6 border border-gray-700/50 animate-pulse">
              <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-700 rounded w-16"></div>
                <div className="h-6 bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`bg-dark-100 rounded-xl overflow-hidden border border-gray-700/50 hover:border-primary-500/30 transition-all duration-300 group ${viewMode === 'list' ? 'flex' : ''
                  }`}
              >
                {/* Project Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'} overflow-hidden`}>
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-500" />
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-3">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </div>
                  )}

                  {/* Quick actions overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>

                    {project.githubUrl && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.open(project.githubUrl, '_blank')}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </motion.button>
                    )}

                    {project.demoUrl && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.open(project.demoUrl, '_blank')}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => {
                          setEditingProject(project);
                          setShowProjectModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-primary-400 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => toggleFeatured(project.id)}
                        className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                      >
                        <Star className={`w-4 h-4 ${project.featured ? 'fill-current text-yellow-400' : ''}`} />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => {
                          setProjectToDelete(project.id);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {project.shortDescription || project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-primary-500/20 text-primary-400 rounded border border-primary-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-600/20 text-gray-400 rounded border border-gray-600/30">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                      {project.views && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {project.views}
                        </span>
                      )}
                    </div>

                    <span className={`px-2 py-1 rounded-full ${project.category === 'Machine Learning' ? 'bg-purple-500/20 text-purple-400' :
                      project.category === 'Data Analysis' ? 'bg-blue-500/20 text-blue-400' :
                        project.category === 'Data Visualization' ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                      }`}>
                      {project.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No projects found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All'
              ? 'Try adjusting your filters or search terms.'
              : 'Create your first project to get started.'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProjectModal(true)}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            Create Project
          </motion.button>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-dark-100 rounded-xl p-6 max-w-md w-full border border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Project</h3>
                  <p className="text-gray-400 text-sm">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this project? All associated data will be permanently removed.
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-dark-200 hover:bg-dark-300 text-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => projectToDelete && handleDelete(projectToDelete)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Create/Edit Modal */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setEditingProject(null);
        }}
        onSave={() => {
          fetchProjects();
          addNotification({
            type: 'success',
            title: 'Success',
            message: editingProject ? 'Project updated successfully' : 'Project created successfully'
          });
        }}
        project={editingProject}
      />
    </div>
  );
}
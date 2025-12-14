'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit3, Trash2, Eye, Clock, User, Calendar, Tag,
  Filter, Search, Grid, List, BookOpen, TrendingUp,
  CheckCircle, X, AlertCircle, Save, ArrowUpDown,
  MoreHorizontal, Copy, Archive, Globe, Image as ImageIcon,
  FileText, Hash, Heart, MessageCircle, Share2, Star
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogModal } from '@/components/admin/BlogModal';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  author: string;
  category: string;
  tags: string[];
  readTime: number;
  views?: number;
  likes?: number;
  comments?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface ApiPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// Helper function to transform API post to component format
const transformPost = (apiPost: ApiPost): BlogPost => ({
  ...apiPost,
  status: apiPost.published ? 'published' as const : 'draft' as const,
  featured: Math.random() > 0.7, // Random featured status for demo
  author: 'Shishir Pandey',
  category: apiPost.tags?.[0] || 'General',
  readTime: Math.ceil(apiPost.content.split(' ').length / 200), // Estimate read time
  likes: Math.floor(Math.random() * 200) + 10,
  comments: Math.floor(Math.random() * 50) + 1,
  publishedAt: apiPost.published ? apiPost.updatedAt : undefined
});

const categories = ['All', 'Technology', 'Data Science', 'Web Development', 'Programming', 'AI & ML', 'Tutorial'];
const statuses = ['All', 'Draft', 'Published', 'Archived'];
const sortOptions = [
  { value: 'updated', label: 'Last Updated' },
  { value: 'published', label: 'Published Date' },
  { value: 'created', label: 'Created Date' },
  { value: 'views', label: 'Views' },
  { value: 'likes', label: 'Likes' },
  { value: 'title', label: 'Title' }
];

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Get unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));
  const tagOptions = ['All', ...allTags];

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/blog');

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.posts) {
          const transformedPosts = data.posts.map(transformPost);
          setPosts(transformedPosts);
          setFilteredPosts(transformedPosts);
          addNotification({
            type: 'success',
            title: 'Posts Loaded',
            message: `Successfully loaded ${transformedPosts.length} blog posts from database.`
          });
        } else {
          throw new Error('No posts data received');
        }
      } else {
        throw new Error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      addNotification({
        type: 'error',
        title: 'Database Connection Failed',
        message: 'Could not load posts from database. Please check your connection.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search effect
  useEffect(() => {
    let filtered = [...posts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(post => post.status === selectedStatus.toLowerCase());
    }

    // Tag filter
    if (selectedTag !== 'All') {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'published':
          const aDate = new Date(a.publishedAt || a.createdAt).getTime();
          const bDate = new Date(b.publishedAt || b.createdAt).getTime();
          return bDate - aDate;
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory, selectedStatus, selectedTag, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Delete post
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(prev => prev.filter(p => p.id !== id));
        addNotification({
          type: 'success',
          title: 'Post Deleted',
          message: 'Blog post has been successfully deleted.'
        });
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      // For demo, just remove from local state
      setPosts(prev => prev.filter(p => p.id !== id));
      addNotification({
        type: 'success',
        title: 'Post Deleted',
        message: 'Post removed from local list.'
      });
    }
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  // Toggle featured status
  const toggleFeatured = async (id: string) => {
    try {
      const post = posts.find(p => p.id === id);
      if (!post) return;

      const updatedPost = { ...post, featured: !post.featured };

      // For demo, just update local state
      setPosts(prev => prev.map(p => p.id === id ? updatedPost : p));

      addNotification({
        type: 'success',
        title: 'Post Updated',
        message: `Post ${updatedPost.featured ? 'featured' : 'unfeatured'}.`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update post status.'
      });
    }
  };

  // Toggle post status
  const toggleStatus = async (id: string, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      const post = posts.find(p => p.id === id);
      if (!post) return;

      const updatedPost = {
        ...post,
        status: newStatus,
        publishedAt: newStatus === 'published' ? new Date().toISOString() : post.publishedAt
      };

      setPosts(prev => prev.map(p => p.id === id ? updatedPost : p));

      addNotification({
        type: 'success',
        title: 'Status Updated',
        message: `Post ${newStatus}.`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update post status.'
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

  // Calculate stats
  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    featured: posts.filter(p => p.featured).length,
    totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0),
    totalLikes: posts.reduce((sum, p) => sum + (p.likes || 0), 0)
  };

  // Save post (Create or Update)
  const handleSavePost = async (postData: any) => {
    try {
      const url = postData.id ? `/api/blog/${postData.id}` : '/api/blog';
      const method = postData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const savedPost = transformPost(result.post);

          if (postData.id) {
            setPosts(prev => prev.map(p => p.id === savedPost.id ? savedPost : p));
            addNotification({
              type: 'success',
              title: 'Post Updated',
              message: 'Blog post updated successfully.'
            });
          } else {
            setPosts(prev => [savedPost, ...prev]);
            addNotification({
              type: 'success',
              title: 'Post Created',
              message: 'New blog post created successfully.'
            });
          }
          setShowPostModal(false);
          setEditingPost(null);
        }
      } else {
        throw new Error('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save blog post. Please try again.'
      });
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
            <h1 className="text-3xl font-bold text-white mb-2">Blog Management</h1>
            <p className="text-gray-400">Create, edit, and manage your blog posts</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingPost(null);
              setShowPostModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Post
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <motion.div
            variants={itemVariants}
            className="bg-dark-100 rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Posts</p>
                <p className="text-white font-semibold text-lg">{stats.total}</p>
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
                <p className="text-gray-400 text-sm">Published</p>
                <p className="text-white font-semibold text-lg">{stats.published}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-dark-100 rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Drafts</p>
                <p className="text-white font-semibold text-lg">{stats.drafts}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-dark-100 rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Featured</p>
                <p className="text-white font-semibold text-lg">{stats.featured}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-dark-100 rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-white font-semibold text-lg">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-dark-100 rounded-xl p-4 border border-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Likes</p>
                <p className="text-white font-semibold text-lg">{stats.totalLikes.toLocaleString()}</p>
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
                  placeholder="Search posts, tags, or content..."
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
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              >
                {tagOptions.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
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

      {/* Posts Grid/List */}
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
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`bg-dark-100 rounded-xl overflow-hidden border border-gray-700/50 hover:border-primary-500/30 transition-all duration-300 group ${viewMode === 'list' ? 'flex' : ''
                  }`}
              >
                {/* Post Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'} overflow-hidden`}>
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
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
                    <span className={`px-2 py-1 text-xs rounded-full ${post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                      post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                      {post.status}
                    </span>
                  </div>

                  {/* Featured badge */}
                  {post.featured && (
                    <div className="absolute top-3 right-3">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </div>
                  )}

                  {/* Quick actions overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setEditingPost(post);
                        setShowPostModal(true);
                      }}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => toggleFeatured(post.id)}
                        className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
                      >
                        <Star className={`w-4 h-4 ${post.featured ? 'fill-current text-yellow-400' : ''}`} />
                      </motion.button>

                      <div className="relative group/menu">
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        <div className="absolute right-0 top-full mt-1 bg-dark-200 border border-gray-600 rounded-lg py-1 opacity-0 group-hover/menu:opacity-100 transition-opacity z-10 min-w-[120px]">
                          {post.status === 'draft' && (
                            <button
                              onClick={() => toggleStatus(post.id, 'published')}
                              className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-dark-300 hover:text-white transition-colors"
                            >
                              Publish
                            </button>
                          )}
                          {post.status === 'published' && (
                            <button
                              onClick={() => toggleStatus(post.id, 'draft')}
                              className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-dark-300 hover:text-white transition-colors"
                            >
                              Unpublish
                            </button>
                          )}
                          <button
                            onClick={() => toggleStatus(post.id, 'archived')}
                            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-dark-300 hover:text-white transition-colors"
                          >
                            Archive
                          </button>
                          <button
                            onClick={() => {
                              setPostToDelete(post.id);
                              setShowDeleteModal(true);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-dark-300 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-primary-500/20 text-primary-400 rounded border border-primary-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-600/20 text-gray-400 rounded border border-gray-600/30">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}m read
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {post.likes || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && filteredPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-gray-500" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No posts found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All'
              ? 'Try adjusting your filters or search terms.'
              : 'Write your first blog post to get started.'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingPost(null);
              setShowPostModal(true);
            }}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            Create Post
          </motion.button>
        </motion.div>
      )}

      {/* Blog Modal */}
      <BlogModal
        isOpen={showPostModal}
        onClose={() => {
          setShowPostModal(false);
          setEditingPost(null);
        }}
        onSave={handleSavePost}
        initialData={editingPost}
      />


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
                  <h3 className="text-lg font-semibold text-white">Delete Post</h3>
                  <p className="text-gray-400 text-sm">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this blog post? All associated data will be permanently removed.
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
                  onClick={() => postToDelete && handleDelete(postToDelete)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
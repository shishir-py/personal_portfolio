'use client';

import type { Metadata } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, User, ArrowRight, BookOpen, Filter } from 'lucide-react';
import { Navbar } from '@/components/EnhancedNavbar';
import { Footer } from '@/components/Footer';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  category?: string;
  tags: string[];
  readTime?: number;
  featured?: boolean;
  published?: boolean;
  views?: number;
  coverImage?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Machine Learning', 'Data Visualization', 'Data Engineering', 'Statistics', 'MLOps'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.posts) {
            // Transform API data to match BlogPost interface
            const transformedPosts = data.posts.map((post: any) => ({
              id: post.id,
              title: post.title,
              excerpt: post.excerpt,
              content: post.content,
              slug: post.slug,
              publishedAt: post.createdAt,
              tags: Array.isArray(post.tags) ? post.tags : [],
              featured: post.published || false,
              published: post.published || false,
              views: post.views || 0,
              coverImage: post.coverImage,
              category: post.tags?.[0] || 'General',
              author: 'Shishir Pandey',
              readTime: Math.ceil(post.content?.length / 1000) || 5
            }));
            setPosts(transformedPosts);
            setFilteredPosts(transformedPosts);
          } else {
            console.error('No posts data received');
            setPosts([]);
            setFilteredPosts([]);
          }
        } else {
          throw new Error('Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts([]);
        setFilteredPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchTerm]);

  const featuredPosts = posts.filter(post => post.featured);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-100 relative">
        <AnimatedBackground />
        <Navbar />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-xl text-gray-300"
            >
              Loading blog posts...
            </motion.p>
          </div>
        </div>
      </div>
    );
  }

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
                  Blog & Insights
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Sharing knowledge, experiences, and insights from the world of data science, machine learning, and technology.
                </p>
              </div>
            </ScrollReveal>

            {/* Search and Filter */}
            <ScrollReveal delay={0.2}>
              <div className="mb-12 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-4xl mx-auto">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-dark-100 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                          : 'bg-dark-100 text-gray-300 hover:bg-dark-200 border border-gray-600'
                      }`}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="pb-20 px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Articles</h2>
              </ScrollReveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {featuredPosts.slice(0, 3).map((post, index) => (
                  <ScrollReveal key={post.id} delay={index * 0.1}>
                    <motion.article
                      whileHover={{ y: -10 }}
                      className="group bg-dark-100 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300"
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary-400" />
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
                          <span className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full text-xs">
                            {post.category}
                          </span>
                          <span>{post.readTime} min read</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.publishedAt || post.createdAt || '')}</span>
                          </div>
                          
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-primary-400 hover:text-primary-300 font-medium text-sm flex items-center gap-1"
                          >
                            Read More
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="pb-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-dark-200/50">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-white mb-12 text-center">
                All Articles
                {filteredPosts.length > 0 && (
                  <span className="text-gray-400 font-normal text-xl ml-2">
                    ({filteredPosts.length})
                  </span>
                )}
              </h2>
            </ScrollReveal>

            <AnimatePresence mode="wait">
              {filteredPosts.length > 0 ? (
                <motion.div
                  key={`${selectedCategory}-${searchTerm}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {filteredPosts.map((post, index) => (
                    <ScrollReveal key={post.id} delay={index * 0.1}>
                      <motion.article
                        whileHover={{ scale: 1.02 }}
                        className="bg-dark-100 rounded-2xl p-6 border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="lg:w-32 lg:flex-shrink-0">
                            <div className="aspect-square bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                              <BookOpen className="w-8 h-8 text-primary-400" />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm">
                                {post.category}
                              </span>
                              <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(post.publishedAt || post.createdAt || '')}</span>
                              </div>
                              <span className="text-gray-400 text-sm">•</span>
                              <span className="text-gray-400 text-sm">{post.readTime} min read</span>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-3 hover:text-primary-400 transition-colors">
                              {post.title}
                            </h3>
                            
                            <p className="text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > 4 && (
                                <span className="px-2 py-1 text-xs bg-primary-500/20 text-primary-400 rounded-full">
                                  +{post.tags.length - 4} more
                                </span>
                              )}
                            </div>
                            
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
                            >
                              Read Full Article
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </motion.article>
                    </ScrollReveal>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-gray-500 text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-medium text-gray-400 mb-2">No articles found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm 
                      ? `No articles matching "${searchTerm}" found.`
                      : `No articles in the "${selectedCategory}" category found.`
                    }
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <div className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-2xl p-8 border border-primary-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
                <p className="text-gray-300 mb-6">
                  Subscribe to get notified when I publish new articles about data science, machine learning, and technology.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-dark-100 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <button className="px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors font-medium">
                    Subscribe
                  </button>
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
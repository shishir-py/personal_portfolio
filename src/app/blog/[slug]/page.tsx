'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Navbar } from '@/components/EnhancedNavbar';
import { Footer } from '@/components/Footer';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LikeButton } from '@/components/LikeButton';
import { CommentSection } from '@/components/CommentSection';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  category?: string;
  tags: string[];
  readTime?: number;
  published?: boolean;
  views?: number;
  coverImage?: string;
  likes?: number;
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.slug}`);

        if (response.ok) {
          const data = await response.json();

          if (data.success && data.post) {
            // Transform API data to match BlogPost interface
            const transformedPost: BlogPost = {
              id: data.post.id,
              title: data.post.title,
              content: data.post.content,
              excerpt: data.post.excerpt,
              slug: data.post.slug,
              publishedAt: data.post.createdAt,
              createdAt: data.post.createdAt,
              updatedAt: data.post.updatedAt,
              tags: Array.isArray(data.post.tags) ? data.post.tags : [],
              published: data.post.published || false,
              views: data.post.views || 0,
              coverImage: data.post.coverImage,
              category: data.post.tags?.[0] || 'General',
              author: 'Shishir Pandey',
              readTime: Math.ceil(data.post.content?.length / 1000) || 5,
              likes: data.post.likes || 0
            };

            setPost(transformedPost);
          } else {
            setError('Blog post not found');
          }
        } else if (response.status === 404) {
          setError('Blog post not found');
        } else {
          throw new Error('Failed to fetch post');
        }
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title || '')}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
      color: 'hover:text-blue-500'
    }
  ];

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
              Loading blog post...
            </motion.p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-100 relative">
        <AnimatedBackground />
        <Navbar />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-3xl font-bold text-white mb-4">Post Not Found</h2>
            <p className="text-gray-400 mb-8">{error}</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
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
        <article className="pt-32 pb-20 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <ScrollReveal>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </ScrollReveal>

            {/* Article Header */}
            <ScrollReveal delay={0.1}>
              <header className="mb-12">
                <div className="mb-6 flex items-center justify-between">
                  <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  <LikeButton id={post.id} initialLikes={post.likes || 0} type="post" />
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.publishedAt || post.createdAt || '')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              </header>
            </ScrollReveal>

            {/* Article Content */}
            <ScrollReveal delay={0.2}>
              <div className="bg-dark-100 rounded-2xl p-8 lg:p-12 border border-gray-700/50 mb-12">
                <div
                  className="prose prose-invert prose-lg max-w-none
                    prose-headings:text-white prose-headings:font-bold
                    prose-p:text-gray-300 prose-p:leading-relaxed
                    prose-a:text-primary-400 prose-a:no-underline hover:prose-a:text-primary-300
                    prose-strong:text-white
                    prose-code:text-primary-400 prose-code:bg-dark-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-dark-200 prose-pre:border prose-pre:border-gray-600
                    prose-ul:text-gray-300 prose-ol:text-gray-300
                    prose-li:text-gray-300
                    prose-blockquote:border-l-primary-500 prose-blockquote:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
                />
              </div>
            </ScrollReveal>

            {/* Tags */}
            <ScrollReveal delay={0.3}>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Share Section */}
            <ScrollReveal delay={0.4}>
              <div className="bg-dark-100 rounded-2xl p-6 border border-gray-700/50 mb-12">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-semibold text-white mb-1">Share this article</h3>
                    <p className="text-gray-400 text-sm">Help others discover this content</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Share2 className="w-5 h-5 text-gray-400" />
                    {shareLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <motion.a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center justify-center w-10 h-10 bg-dark-200 rounded-full border border-gray-600 text-gray-400 transition-all duration-300 ${social.color} hover:border-current`}
                        >
                          <Icon className="w-4 h-4" />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Comments Section */}
            <ScrollReveal delay={0.5}>
              <CommentSection postId={post.id} />
            </ScrollReveal>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
}
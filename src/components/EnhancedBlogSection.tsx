'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LikeButton } from './LikeButton';
import { FeedbackSection } from './FeedbackSection';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string;
    publishedAt: string;
    readTime: number;
    category: string;
    tags: string[];
    likes?: number;
    _count?: {
        comments: number;
    };
}

export const EnhancedBlogSection = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/blog?limit=3&status=published');
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setPosts(result.posts || []);
                    }
                }
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
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

    if (posts.length === 0) {
        return null;
    }

    return (
        <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-dark-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                            Latest Thoughts
                        </h2>
                        <p className="text-gray-300 text-lg max-w-xl">
                            Insights and tutorials on data science, machine learning, and software engineering.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link
                            href="/blog"
                            className="group flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors font-medium"
                        >
                            View all posts
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="group bg-dark-200 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-primary-500/30 transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Image */}
                            <Link href={`/blog/${post.slug}`} className="relative h-48 overflow-hidden block">
                                {post.coverImage ? (
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-dark-100 flex items-center justify-center group-hover:bg-dark-400 transition-colors">
                                        <BookOpen size={40} className="text-gray-600 group-hover:text-primary-500 transition-colors" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 text-xs font-medium bg-dark-100/90 backdrop-blur-sm text-primary-400 rounded-full border border-primary-500/30">
                                        {post.category}
                                    </span>
                                </div>
                            </Link>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        <span>{post.readTime} min read</span>
                                    </div>
                                </div>

                                <Link href={`/blog/${post.slug}`} className="block mb-3">
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                </Link>

                                <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
                                    <div className="flex items-center gap-4">
                                        <LikeButton id={post.id} initialLikes={post.likes || 0} type="post" />
                                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                                            <span className="font-medium">{post._count?.comments || 0}</span>
                                            <span>comments</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
                                    >
                                        Read Article
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>

            <div className="mt-20">
                <FeedbackSection />
            </div>
        </section>
    );
};

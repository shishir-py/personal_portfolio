'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, Search, Filter, Calendar, User, ExternalLink, X, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
    id: string;
    content: string;
    author: string;
    createdAt: string;
    projectId?: string;
    postId?: string;
    project?: {
        title: string;
        slug: string;
    };
    post?: {
        title: string;
        slug: string;
    };
}

export default function CommentsManagementPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'project' | 'post'>('all');

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/comments');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setComments(data.comments);
                    setFilteredComments(data.comments);
                }
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    useEffect(() => {
        let result = comments;

        // Filter by type
        if (filterType === 'project') {
            result = result.filter(c => c.projectId);
        } else if (filterType === 'post') {
            result = result.filter(c => c.postId);
        }

        // Search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(c =>
                c.content.toLowerCase().includes(term) ||
                c.author.toLowerCase().includes(term) ||
                c.project?.title.toLowerCase().includes(term) ||
                c.post?.title.toLowerCase().includes(term)
            );
        }

        setFilteredComments(result);
    }, [comments, searchTerm, filterType]);

    const handleDelete = async () => {
        if (!commentToDelete) return;

        try {
            const response = await fetch(`/api/comments/${commentToDelete}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setComments(prev => prev.filter(c => c.id !== commentToDelete));
                setShowDeleteModal(false);
                setCommentToDelete(null);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Comments Management</h1>
                <p className="text-gray-400">View and manage comments from projects and blog posts</p>
            </div>

            {/* Filters */}
            <div className="bg-dark-100 rounded-xl p-4 border border-gray-700/50 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search comments, authors, or titles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                            className="px-3 py-2 bg-dark-200 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500"
                        >
                            <option value="all">All Comments</option>
                            <option value="project">Projects Only</option>
                            <option value="post">Blog Posts Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading comments...</p>
                </div>
            ) : filteredComments.length === 0 ? (
                <div className="text-center py-16 bg-dark-100 rounded-xl border border-gray-700/50">
                    <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No comments found</h3>
                    <p className="text-gray-400">
                        {searchTerm ? 'Try adjusting your search filters' : 'No comments have been posted yet'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredComments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-dark-100 rounded-xl p-6 border border-gray-700/50 hover:border-primary-500/30 transition-colors group"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center gap-2 text-primary-400 font-medium">
                                                <User className="w-4 h-4" />
                                                {comment.author}
                                            </div>
                                            <span className="text-gray-600">•</span>
                                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                <Calendar className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                            </div>
                                        </div>

                                        <p className="text-gray-300 mb-4 leading-relaxed">
                                            {comment.content}
                                        </p>

                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-500">Posted on:</span>
                                            {comment.project ? (
                                                <a
                                                    href={`/projects/${comment.project.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                                                >
                                                    Project: {comment.project.title}
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : comment.post ? (
                                                <a
                                                    href={`/blog/${comment.post.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-green-400 hover:text-green-300"
                                                >
                                                    Blog: {comment.post.title}
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-gray-500">Unknown Item</span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setCommentToDelete(comment.id);
                                            setShowDeleteModal(true);
                                        }}
                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete Comment"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                                    <h3 className="text-lg font-semibold text-white">Delete Comment</h3>
                                    <p className="text-gray-400 text-sm">This action cannot be undone</p>
                                </div>
                            </div>

                            <p className="text-gray-300 mb-6">
                                Are you sure you want to delete this comment? It will be permanently removed.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-2 bg-dark-200 hover:bg-dark-300 text-gray-300 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

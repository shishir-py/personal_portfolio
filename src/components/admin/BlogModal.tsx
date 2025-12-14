'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Code, Eye, Save } from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    status: 'draft' | 'published' | 'archived';
    featured: boolean;
    tags: string[];
}

interface BlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (post: BlogPost) => Promise<void>;
    initialData?: BlogPost | null;
}

export const BlogModal = ({ isOpen, onClose, onSave, initialData }: BlogModalProps) => {
    const [formData, setFormData] = useState<BlogPost>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        status: 'draft',
        featured: false,
        tags: []
    });
    const [tagInput, setTagInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                coverImage: '',
                status: 'draft',
                featured: false,
                tags: []
            });
        }
    }, [initialData, isOpen]);

    // Auto-generate slug from title
    useEffect(() => {
        if (!initialData && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, initialData]);

    const handleTagAdd = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tagInput.trim()]
                }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving post:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-dark-200 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-dark-300">
                        <h2 className="text-2xl font-bold text-white">
                            {initialData ? 'Edit Post' : 'Create New Post'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-dark-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                                        placeholder="Enter post title"
                                    />
                                </div>

                                {/* Slug */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Slug</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        className="w-full px-4 py-2 bg-dark-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white font-mono text-sm"
                                        placeholder="post-url-slug"
                                    />
                                </div>
                            </div>

                            {/* Cover Image */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Cover Image URL</label>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                            <input
                                                type="url"
                                                value={formData.coverImage}
                                                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2 bg-dark-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                    </div>
                                    {formData.coverImage && (
                                        <div className="w-16 h-10 relative rounded-lg overflow-hidden border border-gray-700">
                                            <Image
                                                src={formData.coverImage}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Excerpt</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full px-4 py-2 bg-dark-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white resize-none"
                                    placeholder="Brief summary of the post..."
                                />
                            </div>

                            {/* Content Editor */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-300">Content (Markdown)</label>
                                    <div className="flex bg-dark-100 rounded-lg p-1 border border-gray-700">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('edit')}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'edit'
                                                    ? 'bg-primary-500 text-white'
                                                    : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            <Code className="w-3 h-3 inline mr-1" /> Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('preview')}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'preview'
                                                    ? 'bg-primary-500 text-white'
                                                    : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            <Eye className="w-3 h-3 inline mr-1" /> Preview
                                        </button>
                                    </div>
                                </div>

                                {activeTab === 'edit' ? (
                                    <textarea
                                        required
                                        rows={15}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2 bg-dark-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white font-mono text-sm"
                                        placeholder="# Write your post content here...&#10;&#10;You can use Markdown for formatting, including code blocks:&#10;&#10;```javascript&#10;console.log('Hello World');&#10;```"
                                    />
                                ) : (
                                    <div className="w-full h-[380px] px-4 py-2 bg-dark-100 border border-gray-700 rounded-lg overflow-y-auto prose prose-invert max-w-none">
                                        {/* Simple markdown preview - in production use react-markdown */}
                                        <div className="whitespace-pre-wrap">{formData.content}</div>
                                    </div>
                                )}
                            </div>

                            {/* Tags & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Tags</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.tags.map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-md text-sm flex items-center gap-1 border border-primary-500/30">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagAdd}
                                        className="w-full px-4 py-2 bg-dark-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                                        placeholder="Type tag and press Enter"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                            className="w-full px-4 py-2 bg-dark-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-700 bg-dark-100 text-primary-500 focus:ring-primary-500"
                                        />
                                        <label htmlFor="featured" className="text-sm font-medium text-gray-300">
                                            Feature this post
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-700 bg-dark-300 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-400 hover:text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="blog-form"
                            disabled={isSaving}
                            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Post
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

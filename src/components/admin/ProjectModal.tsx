'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Project {
  id?: string;
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
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  project?: Project | null;
}

export default function ProjectModal({ isOpen, onClose, onSave, project }: ProjectModalProps) {
  const isEditMode = !!project;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    coverImage: '',
    githubUrl: '',
    demoUrl: '',
    featured: false,
    tags: '',
    order: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Reset form when modal opens or project changes
  useEffect(() => {
    if (isOpen) {
      if (project) {
        setFormData({
          title: project.title || '',
          description: project.description || '',
          content: project.content || '',
          coverImage: project.coverImage || '',
          githubUrl: project.githubUrl || '',
          demoUrl: project.demoUrl || '',
          featured: project.featured || false,
          tags: project.tags ? project.tags.join(', ') : '',
          order: project.order || 0
        });
      } else {
        setFormData({
          title: '',
          description: '',
          content: '',
          coverImage: '',
          githubUrl: '',
          demoUrl: '',
          featured: false,
          tags: '',
          order: 0
        });
      }
      setError(null);
    }
  }, [isOpen, project]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setLoading(true);
      
      if (!formData.title || !formData.description || !formData.content) {
        throw new Error('Please fill all required fields');
      }
      
      const tagsArray = formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];
      
      const projectData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        coverImage: formData.coverImage || null,
        githubUrl: formData.githubUrl || null,
        demoUrl: formData.demoUrl || null,
        featured: formData.featured,
        tags: tagsArray,
        order: Number(formData.order)
      };
      
      const url = isEditMode && project?.id
        ? `/api/projects/${project.id}` 
        : '/api/projects';
      
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save project');
      }
      
      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the project`);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload (Mock implementation for now, or use existing API if available)
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
     // In a real app, implement Cloudinary or S3 upload here
     // For now, we'll just use a placeholder or ask for URL
     const file = e.target.files?.[0];
     if (!file) return;
     
     // Mock upload delay
     setUploadingImage(true);
     setTimeout(() => {
         setUploadingImage(false);
         // Just a placeholder logic, in real app we'd get a URL back
         alert("Image upload requires backend configuration. Please enter a URL manually for now.");
     }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-dark-100 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl"
          >
            <div className="sticky top-0 bg-dark-100 z-10 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {isEditMode ? 'Edit Project' : 'New Project'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleChange}
                        className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Demo URL
                      </label>
                      <input
                        type="url"
                        name="demoUrl"
                        value={formData.demoUrl}
                        onChange={handleChange}
                        className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="React, Node.js, MongoDB"
                      className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center h-full pt-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleCheckboxChange}
                          className="h-5 w-5 bg-dark-300 border border-gray-700 rounded text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-300">Featured Project</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                        className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Cover Image URL
                    </label>
                    <div className="flex gap-2">
                        <input
                        type="text"
                        name="coverImage"
                        value={formData.coverImage}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    {formData.coverImage && (
                        <div className="mt-2 relative h-32 w-full rounded-md overflow-hidden border border-gray-700">
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

                <div className="space-y-6">
                  <div className="h-full flex flex-col">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Content (Markdown) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      className="w-full flex-1 bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono min-h-[400px]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-dark-300 hover:bg-dark-400 text-gray-300 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave />
                  {loading ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectFormProps {
  projectId?: string;
}

interface Project {
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
}

export default function ProjectForm({ projectId }: ProjectFormProps) {
  const isEditMode = !!projectId;
  const router = useRouter();
  const { user } = useAuth();
  
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
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Fetch project data if in edit mode
  useEffect(() => {
    if (isEditMode && projectId) {
      const fetchProject = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/projects/${projectId}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch project');
          }
          
          const data = await response.json();
          const project = data.project;
          
          setFormData({
            title: project.title,
            description: project.description,
            content: project.content,
            coverImage: project.coverImage || '',
            githubUrl: project.githubUrl || '',
            demoUrl: project.demoUrl || '',
            featured: project.featured,
            tags: project.tags.join(', '),
            order: project.order
          });
        } catch (err: any) {
          setError(err.message || 'An error occurred while fetching project');
          console.error('Error fetching project:', err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProject();
    }
  }, [isEditMode, projectId]);
  
  // Handle form input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      setLoading(true);
      
      // Validate form data
      if (!formData.title || !formData.description || !formData.content) {
        throw new Error('Please fill all required fields');
      }
      
      // Prepare tags array
      const tagsArray = formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];
      
      // Prepare request data
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
      
      // Make API request (POST or PUT)
      const url = isEditMode 
        ? `/api/projects/${projectId}` 
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
      
      // Show success message
      setSuccess(`Project ${isEditMode ? 'updated' : 'created'} successfully!`);
      
      // Redirect to projects list after a short delay
      setTimeout(() => {
        router.push('/admin/projects');
      }, 1500);
    } catch (err: any) {
      setError(err.message || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the project`);
      console.error('Error saving project:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle image upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'portfolio-uploads');
    
    try {
      setUploadingImage(true);
      
      // Upload to Cloudinary (this would need to be implemented)
      // For now, this is a placeholder
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      
      // Set the cover image URL in the form data
      setFormData(prev => ({
        ...prev,
        coverImage: data.url
      }));
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while uploading image');
      console.error('Error uploading image:', err);
    } finally {
      setUploadingImage(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          {isEditMode ? 'Edit Project' : 'New Project'}
        </h1>
        <button
          onClick={() => router.push('/admin/projects')}
          className="bg-dark-300 hover:bg-dark-400 text-gray-300 px-4 py-2 rounded-md flex items-center"
        >
          <FaTimes className="mr-2" /> Cancel
        </button>
      </div>
      
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/20 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {loading && !isEditMode ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-dark-100 rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              {/* GitHub URL */}
              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-300 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* Demo URL */}
              <div>
                <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-300 mb-1">
                  Demo URL
                </label>
                <input
                  type="url"
                  id="demoUrl"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={handleChange}
                  className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="React, TypeScript, UI/UX"
                />
              </div>
              
              {/* Featured and Order */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                    className="h-5 w-5 bg-dark-300 border border-gray-700 rounded text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm font-medium text-gray-300">
                    Featured Project
                  </label>
                </div>
                
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                    className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cover Image
                </label>
                <div className="mt-1 flex items-center">
                  {formData.coverImage ? (
                    <div className="relative">
                      <img 
                        src={formData.coverImage} 
                        alt="Project cover" 
                        className="h-32 w-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, coverImage: '' })}
                        className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 text-white hover:bg-red-700"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <label className="cursor-pointer bg-dark-300 hover:bg-dark-400 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-300 flex items-center">
                        <FaUpload className="mr-2" /> 
                        {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column - Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={20}
                className="w-full bg-dark-300 border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                Markdown formatting supported
              </p>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
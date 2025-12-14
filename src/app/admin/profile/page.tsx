'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, Upload, User, Mail, Phone, MapPin, Calendar, 
  Briefcase, Camera, X, CheckCircle, AlertCircle, 
  FileText, Globe, Github, Linkedin, Twitter, 
  Eye, EyeOff, Edit2, Plus, Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

interface ProfileData {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  bio: string;
  shortBio?: string;
  dateOfBirth?: string;
  experience?: string;
  profilePic: string;
  resume?: string;
  socialLinks: SocialLinks;
}

interface NotificationMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  id: string;
}

const defaultProfileData: ProfileData = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  title: '',
  bio: '',
  shortBio: '',
  dateOfBirth: '',
  experience: '',
  profilePic: '/1000079466.jpg',
  resume: '',
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
    website: ''
  }
};

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);

  // Add notification
  const addNotification = useCallback((notification: Omit<NotificationMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile');
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.profile) {
          setProfileData(prev => ({
            ...prev,
            ...result.profile,
            socialLinks: result.profile.socialLinks || {}
          }));
        } else {
          addNotification({
            type: 'warning',
            title: 'No Profile Data',
            message: 'No profile data found. Using default values.'
          });
        }
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      addNotification({
        type: 'error',
        title: 'Fetch Error',
        message: 'Failed to load profile data. Using default values.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1] as keyof SocialLinks;
      setProfileData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateImageFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      addNotification({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please select a valid image file (JPG, PNG, GIF).'
      });
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      addNotification({
        type: 'error',
        title: 'File Too Large',
        message: 'Image size should be less than 5MB.'
      });
      return false;
    }

    return true;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) return;

    try {
      setIsUploading(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target?.result as string);
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'profile');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', data);

      if (response.ok && data.success) {
        setProfileData(prev => ({ ...prev, profilePic: data.url }));
        addNotification({
          type: 'success',
          title: 'Upload Successful',
          message: 'Profile image updated successfully!'
        });
      } else {
        throw new Error(data.message || `Upload failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: error instanceof Error ? error.message : 'Failed to upload image. Please try again.'
      });
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      addNotification({
        type: 'error',
        title: 'Invalid File Type',
        message: 'Please select a PDF file for your resume.'
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addNotification({
        type: 'error',
        title: 'File Too Large',
        message: 'Resume file should be less than 10MB.'
      });
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Resume upload response:', data);

      if (response.ok && data.success) {
        setProfileData(prev => ({ ...prev, resume: data.url }));
        addNotification({
          type: 'success',
          title: 'Upload Successful',
          message: 'Resume updated successfully!'
        });
      } else {
        throw new Error(data.message || `Upload failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: error instanceof Error ? error.message : 'Failed to upload resume. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const validateFormData = (): boolean => {
    if (!profileData.fullName.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Full name is required.'
      });
      return false;
    }

    if (!profileData.email.trim() || !/\S+@\S+\.\S+/.test(profileData.email)) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a valid email address.'
      });
      return false;
    }

    if (!profileData.title.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Professional title is required.'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormData()) return;

    try {
      setIsSaving(true);
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          addNotification({
            type: 'success',
            title: 'Profile Updated',
            message: 'Your profile has been updated successfully!'
          });
          setPreviewImage(null);
        } else {
          throw new Error(result.message || 'Update failed');
        }
      } else {
        throw new Error('Update request failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <User className="w-4 h-4" /> },
    { id: 'media', label: 'Media', icon: <Camera className="w-4 h-4" /> },
    { id: 'social', label: 'Social Links', icon: <Globe className="w-4 h-4" /> },
    { id: 'preview', label: 'Preview', icon: <Eye className="w-4 h-4" /> }
  ];

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Profile Management</h1>
        <p className="text-gray-400">Manage your personal information and professional profile</p>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className={`mb-4 p-4 rounded-lg border-l-4 ${
              notification.type === 'success' 
                ? 'bg-green-500/10 border-green-500 text-green-400'
                : notification.type === 'error'
                ? 'bg-red-500/10 border-red-500 text-red-400'
                : notification.type === 'warning'
                ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400'
                : 'bg-blue-500/10 border-blue-500 text-blue-400'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                {notification.type === 'success' && <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                {notification.type === 'error' && <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                {notification.type === 'warning' && <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                {notification.type === 'info' && <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
                <div>
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm opacity-90">{notification.message}</p>
                </div>
              </div>
              <button 
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-1 bg-dark-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors font-medium ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-dark-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-dark-100 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Professional Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={profileData.title || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="e.g., Data Scientist & ML Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="+977 9841234567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profileData.location || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="City, Country"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={profileData.experience || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="5+ years"
                  />
                </div>
              </div>
            </div>

            <div className="bg-dark-100 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Professional Bio
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Short Bio (for cards and previews)
                  </label>
                  <textarea
                    name="shortBio"
                    value={profileData.shortBio || ''}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors resize-none"
                    placeholder="A brief one-liner about yourself..."
                    maxLength={150}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {(profileData.shortBio || '').length}/150 characters
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Detailed Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio || ''}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors resize-none"
                    placeholder="Tell your professional story in detail..."
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {(profileData.bio || '').length} characters
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Profile Picture Section */}
            <div className="bg-dark-100 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Profile Picture
              </h2>
              
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-gray-600 shadow-xl">
                    {previewImage || profileData.profilePic ? (
                      <Image
                        src={previewImage || profileData.profilePic || '/1000079466.jpg'}
                        alt="Profile"
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500"></div>
                      </div>
                    )}
                  </div>
                  
                  <label className="absolute bottom-2 right-2 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-lg font-medium text-white mb-2">Update Profile Picture</h3>
                  <p className="text-gray-400 mb-4">
                    Upload a professional photo that represents you well. This will be used across your portfolio.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>• Recommended size: 400x400px or larger</p>
                    <p>• Supported formats: JPG, PNG, GIF</p>
                    <p>• Maximum file size: 5MB</p>
                  </div>
                  
                  <label className="inline-flex items-center gap-2 px-6 py-3 mt-4 bg-dark-200 border border-gray-600 rounded-lg text-gray-300 hover:bg-dark-300 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    {isUploading ? 'Uploading...' : 'Choose New Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-dark-100 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume/CV
              </h2>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1">
                  {profileData.resume ? (
                    <div className="p-4 bg-dark-200 rounded-lg border border-gray-600">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary-500" />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">Current Resume</h4>
                          <p className="text-gray-400 text-sm">{profileData.resume.split('/').pop()}</p>
                        </div>
                        <a
                          href={profileData.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 transition-colors"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border-2 border-dashed border-gray-600 rounded-lg text-center text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3" />
                      <p>No resume uploaded yet</p>
                    </div>
                  )}
                  
                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    <p>• Upload your latest resume/CV in PDF format</p>
                    <p>• Maximum file size: 10MB</p>
                    <p>• This will be available for download on your portfolio</p>
                  </div>
                </div>
                
                <label className="flex items-center gap-2 px-6 py-3 bg-dark-200 border border-gray-600 rounded-lg text-gray-300 hover:bg-dark-300 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {isUploading ? 'Uploading...' : 'Upload Resume'}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* Social Links Tab */}
        {activeTab === 'social' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark-100 rounded-2xl p-6 border border-gray-700/50"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Social Media & Links
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Github className="w-4 h-4 inline mr-2" />
                  GitHub Profile
                </label>
                <input
                  type="url"
                  name="socialLinks.github"
                  value={profileData.socialLinks?.github || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="https://github.com/yourusername"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Linkedin className="w-4 h-4 inline mr-2" />
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="socialLinks.linkedin"
                  value={profileData.socialLinks?.linkedin || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Twitter className="w-4 h-4 inline mr-2" />
                  Twitter/X Profile
                </label>
                <input
                  type="url"
                  name="socialLinks.twitter"
                  value={profileData.socialLinks?.twitter || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Personal Website
                </label>
                <input
                  type="url"
                  name="socialLinks.website"
                  value={profileData.socialLinks?.website || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-dark-100 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Profile Preview
              </h2>
              
              {/* Profile Card Preview */}
              <div className="max-w-md mx-auto bg-gradient-to-br from-dark-200 to-dark-300 rounded-2xl p-6 border border-gray-600">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-primary-500 mb-4">
                    <Image
                      src={previewImage || profileData.profilePic || '/1000079466.jpg'}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {profileData.fullName || 'Your Name'}
                  </h3>
                  <p className="text-primary-400 mb-2">
                    {profileData.title || 'Your Title'}
                  </p>
                  <p className="text-gray-300 text-sm mb-4">
                    {profileData.shortBio || 'Your short bio will appear here...'}
                  </p>
                  
                  <div className="flex justify-center gap-3">
                    {profileData.socialLinks?.github && (
                      <a href={profileData.socialLinks.github} className="text-gray-400 hover:text-white">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {profileData.socialLinks?.linkedin && (
                      <a href={profileData.socialLinks.linkedin} className="text-gray-400 hover:text-white">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {profileData.socialLinks?.twitter && (
                      <a href={profileData.socialLinks.twitter} className="text-gray-400 hover:text-white">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={fetchProfile}
            className="px-6 py-3 bg-dark-200 border border-gray-600 rounded-lg text-gray-300 hover:bg-dark-300 transition-colors"
            disabled={isLoading || isSaving}
          >
            Reset Changes
          </button>
          
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
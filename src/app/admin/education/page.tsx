'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Save, X, GraduationCap, Briefcase, Calendar } from 'lucide-react';

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  gpa?: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export default function EducationExperiencePage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [activeTab, setActiveTab] = useState<'education' | 'experience'>('education');
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | Experience | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [newEducation, setNewEducation] = useState<Omit<Education, 'id'>>({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    gpa: ''
  });

  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch education data from API
      const educationResponse = await fetch('/api/education');
      if (educationResponse.ok) {
        const educationResult = await educationResponse.json();
        if (educationResult.success) {
          setEducation(educationResult.education);
        }
      }

      // Fetch experience data from API
      const experienceResponse = await fetch('/api/experience');
      if (experienceResponse.ok) {
        const experienceResult = await experienceResponse.json();
        if (experienceResult.success) {
          setExperience(experienceResult.experience);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to fetch data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEducation = async () => {
    if (!newEducation.degree.trim() || !newEducation.institution.trim()) {
      setMessage({ type: 'error', text: 'Please enter degree and institution' });
      return;
    }

    try {
      const response = await fetch('/api/education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEducation,
          field: newEducation.degree, // Map degree to field
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setEducation(prev => [...prev, result.education]);
        setNewEducation({
          degree: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          gpa: ''
        });
        setIsAddingNew(false);
        setMessage({ type: 'success', text: 'Education added successfully!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to add education' });
      }
    } catch (error) {
      console.error('Error adding education:', error);
      setMessage({ type: 'error', text: 'Failed to add education. Please try again.' });
    }
  };

  const handleAddExperience = async () => {
    if (!newExperience.title.trim() || !newExperience.company.trim()) {
      setMessage({ type: 'error', text: 'Please enter job title and company' });
      return;
    }

    try {
      const response = await fetch('/api/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExperience),
      });

      const result = await response.json();
      
      if (result.success) {
        setExperience(prev => [...prev, result.experience]);
        setNewExperience({
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        });
        setIsAddingNew(false);
        setMessage({ type: 'success', text: 'Experience added successfully!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to add experience' });
      }
    } catch (error) {
      console.error('Error adding experience:', error);
      setMessage({ type: 'error', text: 'Failed to add experience. Please try again.' });
    }
  };

  const handleDelete = async (id: string, type: 'education' | 'experience') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/${type}?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        if (type === 'education') {
          setEducation(prev => prev.filter(item => item.id !== id));
        } else {
          setExperience(prev => prev.filter(item => item.id !== id));
        }
        setMessage({ type: 'success', text: `${type} deleted successfully!` });
      } else {
        setMessage({ type: 'error', text: result.message || `Failed to delete ${type}` });
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      setMessage({ type: 'error', text: `Failed to delete ${type}. Please try again.` });
    }
  };

  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Education & Experience</h1>
          <p className="text-gray-400">Manage your educational background and work experience</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-dark-200 p-1 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab('education')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'education'
              ? 'bg-primary-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <GraduationCap className="inline-block mr-2" size={16} />
          Education
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'experience'
              ? 'bg-primary-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Briefcase className="inline-block mr-2" size={16} />
          Experience
        </button>
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingNew(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add {activeTab === 'education' ? 'Education' : 'Experience'}
        </motion.button>
      </div>

      {/* Message Display */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-600/20 text-green-300 border border-green-600/30' :
              'bg-red-600/20 text-red-300 border border-red-600/30'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add New Form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-dark-100 rounded-xl p-6 mb-8 border border-dark-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Add New {activeTab === 'education' ? 'Education' : 'Experience'}
              </h2>
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            {activeTab === 'education' ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Degree *
                  </label>
                  <input
                    type="text"
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Master of Science in Computer Science"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={newEducation.institution}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Stanford University"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEducation.location}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Stanford, CA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GPA/Grade
                  </label>
                  <input
                    type="text"
                    value={newEducation.gpa}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, gpa: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. 3.8"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newEducation.startDate}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newEducation.endDate}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, endDate: e.target.value }))}
                    disabled={newEducation.current}
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      id="currentEducation"
                      checked={newEducation.current}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, current: e.target.checked, endDate: e.target.checked ? '' : prev.endDate }))}
                      className="w-4 h-4 text-primary-600 bg-dark-200 border-dark-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="currentEducation" className="text-sm text-gray-300">
                      Currently studying here
                    </label>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newEducation.description}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of your studies, achievements, etc."
                  />
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={newExperience.title}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Senior Data Scientist"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Google"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newExperience.location}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Mountain View, CA"
                  />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="currentJob"
                      checked={newExperience.current}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, current: e.target.checked, endDate: e.target.checked ? '' : prev.endDate }))}
                      className="w-4 h-4 text-primary-600 bg-dark-200 border-dark-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="currentJob" className="text-sm text-gray-300">
                      Currently working here
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newExperience.startDate}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newExperience.endDate}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, endDate: e.target.value }))}
                    disabled={newExperience.current}
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newExperience.description}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe your responsibilities, achievements, and key projects..."
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={activeTab === 'education' ? handleAddEducation : handleAddExperience}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save size={16} />
                Add {activeTab === 'education' ? 'Education' : 'Experience'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Display */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'education' ? (
            education.length > 0 ? (
              education.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="bg-dark-100 rounded-xl p-6 border border-dark-300 hover:border-primary-500/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <GraduationCap className="text-primary-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">{item.degree}</h3>
                      </div>
                      <p className="text-primary-300 font-medium mb-1">{item.institution}</p>
                      {item.location && (
                        <p className="text-gray-400 mb-2">{item.location}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-300 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>
                            {new Date(item.startDate).toLocaleDateString()} - 
                            {item.current ? ' Present' : (item.endDate ? ` ${new Date(item.endDate).toLocaleDateString()}` : '')}
                          </span>
                        </div>
                        {item.gpa && (
                          <span>GPA: {item.gpa}</span>
                        )}
                      </div>
                      
                      {item.description && (
                        <p className="text-gray-400">{item.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-gray-400 hover:text-primary-400 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, 'education')}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-dark-100 rounded-lg border border-dark-300">
                <GraduationCap className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-400 text-lg mb-4">No education entries yet</p>
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Add Your First Education Entry
                </button>
              </div>
            )
          ) : (
            experience.length > 0 ? (
              experience.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="bg-dark-100 rounded-xl p-6 border border-dark-300 hover:border-primary-500/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="text-primary-400" size={24} />
                        <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      </div>
                      <p className="text-primary-300 font-medium mb-1">{item.company}</p>
                      {item.location && (
                        <p className="text-gray-400 mb-2">{item.location}</p>
                      )}
                      
                      <div className="flex items-center gap-1 text-sm text-gray-300 mb-3">
                        <Calendar size={16} />
                        <span>
                          {new Date(item.startDate).toLocaleDateString()} - 
                          {item.current ? ' Present' : (item.endDate ? ` ${new Date(item.endDate).toLocaleDateString()}` : '')}
                        </span>
                      </div>
                      
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-gray-400 hover:text-primary-400 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, 'experience')}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-dark-100 rounded-lg border border-dark-300">
                <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-400 text-lg mb-4">No work experience entries yet</p>
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Add Your First Work Experience
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
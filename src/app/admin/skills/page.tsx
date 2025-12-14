'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  order?: number;
}

const skillCategories = [
  'Programming Languages',
  'Data Science', 
  'Machine Learning',
  'Databases',
  'Tools & Technologies',
  'Frameworks',
  'Soft Skills'
];

export default function SkillsManagementPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    name: '',
    level: 50,
    category: 'Programming Languages'
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSkills(data.skills);
        }
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setMessage({ type: 'error', text: 'Failed to fetch skills' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) {
      setMessage({ type: 'error', text: 'Please enter a skill name' });
      return;
    }

    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSkill),
      });

      const data = await response.json();
      
      if (data.success) {
        setSkills(prev => [...prev, data.skill]);
        setNewSkill({
          name: '',
          level: 50,
          category: 'Programming Languages'
        });
        setIsAddingNew(false);
        setMessage({ type: 'success', text: 'Skill added successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to add skill' });
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      setMessage({ type: 'error', text: 'Failed to add skill. Please try again.' });
    }
  };

  const handleUpdateSkill = async (skill: Skill) => {
    try {
      const response = await fetch('/api/skills', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skill),
      });

      const data = await response.json();
      
      if (data.success) {
        setSkills(prev => prev.map(s => s.id === skill.id ? data.skill : s));
        setEditingSkill(null);
        setMessage({ type: 'success', text: 'Skill updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update skill' });
      }
    } catch (error) {
      console.error('Error updating skill:', error);
      setMessage({ type: 'error', text: 'Failed to update skill. Please try again.' });
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      const response = await fetch(`/api/skills?id=${skillId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setSkills(prev => prev.filter(s => s.id !== skillId));
        setMessage({ type: 'success', text: 'Skill deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to delete skill' });
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      setMessage({ type: 'error', text: 'Failed to delete skill. Please try again.' });
    }
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
          <h1 className="text-3xl font-bold text-white mb-2">Skills Management</h1>
          <p className="text-gray-400">Manage your technical skills and proficiency levels</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingNew(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add New Skill
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

      {/* Add New Skill Form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-dark-100 rounded-xl p-6 mb-8 border border-dark-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Add New Skill</h2>
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Python, Machine Learning"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {skillCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Proficiency Level: {newSkill.level}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkill}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save size={16} />
                Add Skill
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills Display */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="bg-dark-100 rounded-xl p-6 border border-dark-300">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                {category}
                <span className="text-sm text-gray-400 bg-dark-200 px-2 py-1 rounded">
                  {categorySkills.length}
                </span>
              </h3>
              
              <div className="grid gap-4">
                {categorySkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    layout
                    className="bg-dark-200 rounded-lg p-4 border border-dark-300"
                  >
                    {editingSkill?.id === skill.id ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Skill Name
                            </label>
                            <input
                              type="text"
                              value={editingSkill.name}
                              onChange={(e) => setEditingSkill(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                              className="w-full px-3 py-2 bg-dark-100 border border-dark-300 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Category
                            </label>
                            <select
                              value={editingSkill.category}
                              onChange={(e) => setEditingSkill(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
                              className="w-full px-3 py-2 bg-dark-100 border border-dark-300 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              {skillCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Proficiency Level: {editingSkill.level}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editingSkill.level}
                            onChange={(e) => setEditingSkill(prev => prev ? ({ ...prev, level: parseInt(e.target.value) }) : null)}
                            className="w-full h-2 bg-dark-100 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setEditingSkill(null)}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateSkill(editingSkill)}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                          >
                            <Save size={16} />
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-medium text-white">{skill.name}</h4>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 max-w-xs">
                              <div className="flex justify-between text-sm text-gray-300 mb-1">
                                <span>Proficiency</span>
                                <span>{skill.level}%</span>
                              </div>
                              <div className="w-full bg-dark-300 rounded-full h-2">
                                <div
                                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => setEditingSkill(skill)}
                            className="p-2 text-gray-400 hover:text-primary-400 transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          
          {skills.length === 0 && (
            <div className="text-center py-12 bg-dark-100 rounded-lg border border-dark-300">
              <p className="text-gray-400 text-lg mb-4">No skills added yet</p>
              <button
                onClick={() => setIsAddingNew(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Add Your First Skill
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
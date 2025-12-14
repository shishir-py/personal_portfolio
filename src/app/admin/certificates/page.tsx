'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Save, X, Award, Calendar, ExternalLink } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  description?: string;
  issueDate: string;
  expiryDate?: string;
  certificateUrl?: string;
  credentialId?: string;
}

export default function CertificatesManagementPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [newCertificate, setNewCertificate] = useState<Omit<Certificate, 'id'>>({
    title: '',
    issuer: '',
    description: '',
    issueDate: '',
    expiryDate: '',
    certificateUrl: '',
    credentialId: ''
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/certificates');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCertificates(result.certificates);
        }
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setMessage({ type: 'error', text: 'Failed to fetch certificates' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCertificate = async () => {
    if (!newCertificate.title.trim() || !newCertificate.issuer.trim()) {
      setMessage({ type: 'error', text: 'Please enter certificate title and issuer' });
      return;
    }

    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCertificate.title, // Map title to name
          issuer: newCertificate.issuer,
          description: newCertificate.description,
          issueDate: newCertificate.issueDate,
          expiryDate: newCertificate.expiryDate,
          credentialUrl: newCertificate.certificateUrl, // Map certificateUrl to credentialUrl
          credentialId: newCertificate.credentialId,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCertificates(prev => [...prev, {
          ...result.certificate,
          title: result.certificate.name, // Map back for display
          certificateUrl: result.certificate.credentialUrl
        }]);
        setNewCertificate({
          title: '',
          issuer: '',
          description: '',
          issueDate: '',
          expiryDate: '',
          certificateUrl: '',
          credentialId: ''
        });
        setIsAddingNew(false);
        setMessage({ type: 'success', text: 'Certificate added successfully!' });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to add certificate' });
      }
    } catch (error) {
      console.error('Error adding certificate:', error);
      setMessage({ type: 'error', text: 'Failed to add certificate. Please try again.' });
    }
  };

  const handleUpdateCertificate = async (certificate: Certificate) => {
    try {
      // Mock success - replace with actual API call
      setCertificates(prev => prev.map(c => c.id === certificate.id ? certificate : c));
      setEditingCertificate(null);
      setMessage({ type: 'success', text: 'Certificate updated successfully!' });
    } catch (error) {
      console.error('Error updating certificate:', error);
      setMessage({ type: 'error', text: 'Failed to update certificate. Please try again.' });
    }
  };

  const handleDeleteCertificate = async (certificateId: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) {
      return;
    }

    try {
      // Mock success - replace with actual API call
      setCertificates(prev => prev.filter(c => c.id !== certificateId));
      setMessage({ type: 'success', text: 'Certificate deleted successfully!' });
    } catch (error) {
      console.error('Error deleting certificate:', error);
      setMessage({ type: 'error', text: 'Failed to delete certificate. Please try again.' });
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
          <h1 className="text-3xl font-bold text-white mb-2">Certificates Management</h1>
          <p className="text-gray-400">Manage your professional certificates and credentials</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingNew(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Certificate
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

      {/* Add New Certificate Form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-dark-100 rounded-xl p-6 mb-8 border border-dark-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Add New Certificate</h2>
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
                  Certificate Title *
                </label>
                <input
                  type="text"
                  value={newCertificate.title}
                  onChange={(e) => setNewCertificate(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. AWS Solutions Architect"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  value={newCertificate.issuer}
                  onChange={(e) => setNewCertificate(prev => ({ ...prev, issuer: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Amazon Web Services"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newCertificate.description}
                  onChange={(e) => setNewCertificate(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief description of the certificate..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={newCertificate.issueDate}
                  onChange={(e) => setNewCertificate(prev => ({ ...prev, issueDate: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={newCertificate.expiryDate}
                  onChange={(e) => setNewCertificate(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Certificate URL
                </label>
                <input
                  type="url"
                  value={newCertificate.certificateUrl}
                  onChange={(e) => setNewCertificate(prev => ({ ...prev, certificateUrl: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Credential ID
                </label>
                <input
                  type="text"
                  value={newCertificate.credentialId}
                  onChange={(e) => setNewCertificate(prev => ({ ...prev, credentialId: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Certificate ID or credential number"
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
                onClick={handleAddCertificate}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save size={16} />
                Add Certificate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificates Display */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {certificates.map((certificate) => (
            <motion.div
              key={certificate.id}
              layout
              className="bg-dark-100 rounded-xl p-6 border border-dark-300 hover:border-primary-500/30 transition-colors"
            >
              {editingCertificate?.id === certificate.id ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Certificate Title
                      </label>
                      <input
                        type="text"
                        value={editingCertificate.title}
                        onChange={(e) => setEditingCertificate(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                        className="w-full px-3 py-2 bg-dark-200 border border-dark-300 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Issuing Organization
                      </label>
                      <input
                        type="text"
                        value={editingCertificate.issuer}
                        onChange={(e) => setEditingCertificate(prev => prev ? ({ ...prev, issuer: e.target.value }) : null)}
                        className="w-full px-3 py-2 bg-dark-200 border border-dark-300 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setEditingCertificate(null)}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateCertificate(editingCertificate)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="text-primary-400" size={24} />
                      <h3 className="text-xl font-semibold text-white">{certificate.title}</h3>
                    </div>
                    <p className="text-primary-300 font-medium mb-2">{certificate.issuer}</p>
                    
                    {certificate.description && (
                      <p className="text-gray-400 mb-3">{certificate.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                      </div>
                      {certificate.expiryDate && (
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>Expires: {new Date(certificate.expiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    {certificate.credentialId && (
                      <p className="text-xs text-gray-400 mt-2">ID: {certificate.credentialId}</p>
                    )}
                    
                    {certificate.certificateUrl && (
                      <a
                        href={certificate.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm mt-2 transition-colors"
                      >
                        <ExternalLink size={16} />
                        View Certificate
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setEditingCertificate(certificate)}
                      className="p-2 text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCertificate(certificate.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          
          {certificates.length === 0 && (
            <div className="text-center py-12 bg-dark-100 rounded-lg border border-dark-300">
              <Award className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-400 text-lg mb-4">No certificates added yet</p>
              <button
                onClick={() => setIsAddingNew(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Add Your First Certificate
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
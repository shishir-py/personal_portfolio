'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Github, Linkedin, Twitter, Calendar, Clock } from 'lucide-react';
import { Navbar } from '@/components/EnhancedNavbar';
import { Footer } from '@/components/Footer';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactForm>>({});

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'tara.prasad@example.com',
      description: 'Send me an email anytime',
      link: 'mailto:tara.prasad@example.com'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+977 9841234567',
      description: 'Mon-Fri from 9am to 6pm',
      link: 'tel:+9779841234567'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Kathmandu, Nepal',
      description: 'Available for remote work worldwide',
      link: 'https://maps.google.com/?q=Kathmandu,Nepal'
    }
  ];

  const socialLinks = [
    { icon: Github, name: 'GitHub', url: 'https://github.com/taraprasadpandey', color: 'hover:text-gray-300' },
    { icon: Linkedin, name: 'LinkedIn', url: 'https://linkedin.com/in/taraprasadpandey', color: 'hover:text-blue-400' },
    { icon: Twitter, name: 'Twitter', url: 'https://twitter.com/taraprasadpandey', color: 'hover:text-blue-400' },
  ];

  const projectBudgets = [
    'Under $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000+'
  ];

  const projectTimelines = [
    'Less than 1 month',
    '1-3 months',
    '3-6 months',
    '6+ months',
    'Ongoing project'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit form');
      }

      console.log('Form submitted:', formData);

      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        budget: '',
        timeline: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      // In a real app, you might want to show an error message to the user here
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof ContactForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-300 via-dark-200 to-dark-100 relative">
        <AnimatedBackground />
        <Navbar />

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
            <p className="text-gray-300 mb-6">
              Your message has been sent successfully. I'll get back to you within 24 hours.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
            >
              Send Another Message
            </motion.button>
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
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
                  Let's Work Together
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Have a project in mind or want to discuss data science opportunities?
                  I'd love to hear from you. Let's create something amazing together.
                </p>
              </div>
            </ScrollReveal>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <ScrollReveal key={index} delay={index * 0.1}>
                    <motion.a
                      href={info.link}
                      target={info.link.startsWith('http') ? '_blank' : '_self'}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                      whileHover={{ y: -10 }}
                      className="block group bg-dark-100 rounded-2xl p-8 border border-gray-700/50 hover:border-primary-500/50 transition-all duration-300 text-center"
                    >
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500/20 to-primary-600/20 group-hover:from-primary-500/30 group-hover:to-primary-600/30 transition-all">
                        <Icon className="w-8 h-8 text-primary-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                        {info.title}
                      </h3>
                      <p className="text-lg text-gray-300 mb-1">{info.value}</p>
                      <p className="text-sm text-gray-400">{info.description}</p>
                    </motion.a>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="pb-20 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <ScrollReveal>
                <div className="bg-dark-100 rounded-2xl p-8 border border-gray-700/50">
                  <h2 className="text-3xl font-bold text-white mb-6">Send a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-dark-200 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-600'
                            }`}
                          placeholder="Your full name"
                        />
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 bg-dark-200 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-600'
                            }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-dark-200 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors ${errors.subject ? 'border-red-500' : 'border-gray-600'
                          }`}
                        placeholder="What's this about?"
                      />
                      {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Project Budget
                        </label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-colors"
                        >
                          <option value="">Select budget range</option>
                          {projectBudgets.map(budget => (
                            <option key={budget} value={budget}>{budget}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Timeline
                        </label>
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-dark-200 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-colors"
                        >
                          <option value="">Select timeline</option>
                          {projectTimelines.map(timeline => (
                            <option key={timeline} value={timeline}>{timeline}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-dark-200 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors resize-none ${errors.message ? 'border-red-500' : 'border-gray-600'
                          }`}
                        placeholder="Tell me about your project, goals, and how I can help..."
                      />
                      {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-primary-500/25 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </ScrollReveal>

              {/* Additional Info */}
              <ScrollReveal delay={0.2}>
                <div className="space-y-8">
                  <div className="bg-dark-100 rounded-2xl p-8 border border-gray-700/50">
                    <h3 className="text-2xl font-bold text-white mb-6">Let's Connect</h3>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Clock className="w-5 h-5 text-primary-400" />
                        <span>Usually responds within 24 hours</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Calendar className="w-5 h-5 text-primary-400" />
                        <span>Available for new projects</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">Follow me on social media</h4>
                      <div className="flex space-x-4">
                        {socialLinks.map((social, index) => {
                          const Icon = social.icon;
                          return (
                            <motion.a
                              key={index}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`flex items-center justify-center w-12 h-12 bg-dark-200 rounded-xl border border-gray-600 text-gray-400 transition-all duration-300 ${social.color} hover:border-current`}
                            >
                              <Icon className="w-5 h-5" />
                            </motion.a>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-2xl p-8 border border-primary-500/30">
                    <h3 className="text-2xl font-bold text-white mb-4">What to Expect</h3>
                    <div className="space-y-3 text-gray-300">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Quick response within 24 hours</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Detailed project discussion and planning</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Transparent pricing and timeline</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Regular updates throughout the project</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
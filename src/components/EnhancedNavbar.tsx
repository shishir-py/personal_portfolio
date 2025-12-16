'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, User, Briefcase, FileText, Mail, ExternalLink } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const profile = useProfile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Derive initials from full name
  const getInitials = (name: string) => {
    if (!name) return 'TP';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(profile.fullName);

  const navLinks = [
    { title: 'Home', path: '/', icon: Home },
    { title: 'About', path: '/about', icon: User },
    { title: 'Projects', path: '/projects', icon: Briefcase },
    { title: 'Blog', path: '/blog', icon: FileText },
    { title: 'Contact', path: '/contact', icon: Mail },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.25, 0.25, 0.75] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
            ? 'bg-dark-200/95 backdrop-blur-md border-b border-gray-700/50 shadow-xl'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-500/25 transition-shadow">
                    <span className="text-white font-bold text-lg">{initials}</span>
                  </div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity blur"></div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                    {profile.fullName || 'Tara Prasad'}
                  </span>
                  <div className="text-xs text-gray-400 -mt-1">{profile.title || 'Data Scientist'}</div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link
                      href={link.path}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 group ${active
                          ? 'text-white'
                          : 'text-gray-300 hover:text-white'
                        }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="navbar-active"
                          className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg"
                          transition={{ duration: 0.3, ease: [0.25, 0.25, 0.25, 0.75] }}
                        />
                      )}
                      <Icon className={`w-4 h-4 relative z-10 transition-transform group-hover:scale-110 ${active ? 'text-white' : ''
                        }`} />
                      <span className="relative z-10">{link.title}</span>

                      {!active && (
                        <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Link
                  href="/contact"
                  className="relative px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-full hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-primary-500/25 flex items-center space-x-2 group overflow-hidden"
                >
                  <span className="relative z-10">Hire Me</span>
                  <ExternalLink className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />

                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-dark-100 border border-gray-600 text-gray-300 hover:text-white hover:border-primary-500 transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.25, 0.25, 0.25, 0.75] }}
              className="fixed top-0 right-0 h-full w-80 bg-dark-200/95 backdrop-blur-md border-l border-gray-700/50 z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                  <span className="text-xl font-bold text-white">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-dark-100 border border-gray-600 text-gray-300 hover:text-white hover:border-primary-500 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6">
                  <div className="space-y-2 px-6">
                    {navLinks.map((link, index) => {
                      const Icon = link.icon;
                      const active = isActive(link.path);

                      return (
                        <motion.div
                          key={link.path}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <Link
                            href={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${active
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                                : 'text-gray-300 hover:text-white hover:bg-dark-100'
                              }`}
                          >
                            <Icon className={`w-5 h-5 ${active ? 'text-white' : ''}`} />
                            <span className="font-medium">{link.title}</span>
                            {active && (
                              <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile CTA */}
                <div className="p-6 border-t border-gray-700/50">
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg"
                  >
                    <span>Let's Work Together</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <div className="mt-4 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} {profile.fullName || 'Tara Prasad Pandey'}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
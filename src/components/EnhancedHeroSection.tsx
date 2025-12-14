'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Download, Mail, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ProfileData {
  fullName?: string;
  title?: string;
  bio?: string;
  location?: string;
  profilePic?: string;
  resume?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export const EnhancedHeroSection = () => {
  const [profile, setProfile] = useState<ProfileData>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.profile) {
            setProfile(result.profile);
          }
        } else {
          // Fallback to default profile data
          setProfile({
            fullName: 'Shishir Pandey',
            title: 'Data Scientist & AI Engineer',
            bio: 'Passionate about machine learning, data visualization, and solving real-world problems through data-driven insights.',
            location: 'Kathmandu, Nepal',
            profilePic: '/1000079466.jpg'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to default profile data
        setProfile({
          fullName: 'Shishir Pandey',
          title: 'Data Scientist & AI Engineer',
          bio: 'Passionate about machine learning, data visualization, and solving real-world problems through data-driven insights.',
          location: 'Kathmandu, Nepal',
          profilePic: '/1000079466.jpg'
        });
      }
    };

    fetchProfile();
  }, []);
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  };

  const floatingAnimation: any = {
    y: [-20, 20, -20],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-300 via-dark-200 to-dark-100">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Text Content */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2 text-primary-400 font-medium"
              >
                <MapPin className="w-4 h-4" />
                <span>{profile.location || 'Based in Nepal 🇳🇵'}</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                <motion.span
                  variants={itemVariants}
                  className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
                >
                  {profile.fullName?.split(' ').slice(0, -1).join(' ') || 'Tara Prasad'}
                </motion.span>
                <motion.span
                  variants={itemVariants}
                  className="block bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600"
                >
                  {profile.fullName?.split(' ').slice(-1).join(' ') || 'Pandey'}
                </motion.span>
              </h1>

              <motion.div variants={itemVariants} className="space-y-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-200">
                  {profile.title || 'Data Scientist & ML Engineer'}
                </h2>
                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                  <span className="px-3 py-1 bg-primary-500/20 rounded-full border border-primary-500/30">
                    Data Analysis
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                    Machine Learning
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                    Automation
                  </span>
                </div>
              </motion.div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-400 mb-8 leading-relaxed max-w-2xl"
            >
              {profile.bio || 'Passionate about transforming data into actionable insights and building intelligent systems that solve real-world problems. Specializing in machine learning, deep learning, and advanced analytics with a focus on innovation and impact.'}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-full hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-primary-500/25"
                >
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="/tara_prasad_cv.pdf"
                  download="Tara_Prasad_Pandey_CV.pdf"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-gray-600 text-gray-300 font-medium rounded-full hover:border-primary-500 hover:text-primary-400 transition-all duration-300"
                >
                  <Download className="w-5 h-5" />
                  Download CV
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 pt-6 text-gray-400 text-sm"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Available for new projects</span>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            variants={itemVariants}
            className="relative flex justify-center lg:justify-end"
          >
            <motion.div
              animate={floatingAnimation}
              className="relative"
            >
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>

                {/* Profile image container */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-gray-700/50 shadow-2xl">
                  <Image
                    src={profile.profilePic || "/1000079466.jpg"}
                    alt={profile.fullName || "Tara Prasad Pandey"}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-300/20 to-transparent"></div>
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 w-20 h-20 border-2 border-primary-500/30 rounded-full flex items-center justify-center"
                >
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                </motion.div>

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-6 -left-6 w-16 h-16 border-2 border-purple-500/30 rounded-full flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-400 cursor-pointer"
        >
          <span className="text-sm">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};
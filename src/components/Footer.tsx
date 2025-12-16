'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope, FaTwitter } from 'react-icons/fa';
import { useProfile } from '@/contexts/ProfileContext';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const profile = useProfile();

  const socialLinks = profile.socialLinks as { linkedin?: string; github?: string; twitter?: string } || {};

  return (
    <footer className="bg-dark-300 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">{profile.fullName || 'Data Science'} Portfolio</h3>
            <p className="text-sm">
              {profile.shortBio || 'Professional data analysis and machine learning solutions with a focus on clear visualization and actionable insights.'}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-primary-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-sm hover:text-primary-400 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              {socialLinks.github && (
                <Link href={socialLinks.github}
                  className="text-xl hover:text-primary-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub />
                  <span className="sr-only">GitHub</span>
                </Link>
              )}
              {socialLinks.linkedin && (
                <Link href={socialLinks.linkedin}
                  className="text-xl hover:text-primary-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              )}
              {socialLinks.twitter && (
                <Link href={socialLinks.twitter}
                  className="text-xl hover:text-primary-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                  <span className="sr-only">Twitter</span>
                </Link>
              )}
              <Link href={`mailto:${profile.email}`}
                className="text-xl hover:text-primary-400 transition-colors"
              >
                <FaEnvelope />
                <span className="sr-only">Email</span>
              </Link>
            </div>
            <p className="text-sm">
              {profile.location || 'Kathmandu, Nepal'}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} {profile.fullName || 'Tara Prasad Pandey'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
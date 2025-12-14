'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark-300 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">TP Analytics</h3>
            <p className="text-sm">
              Professional data analysis and machine learning solutions with a focus on 
              clear visualization and actionable insights.
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
              <Link href="https://github.com/taraprasad" 
                    className="text-xl hover:text-primary-400 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
              >
                <FaGithub />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://linkedin.com/in/taraprasadpandey" 
                    className="text-xl hover:text-primary-400 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
              >
                <FaLinkedin />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="mailto:taraprasad@example.com" 
                    className="text-xl hover:text-primary-400 transition-colors"
              >
                <FaEnvelope />
                <span className="sr-only">Email</span>
              </Link>
            </div>
            <p className="text-sm">
              Kathmandu, Nepal
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} Tara Prasad Pandey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
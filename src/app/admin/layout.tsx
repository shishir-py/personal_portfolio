'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  FaHome,
  FaNewspaper,
  FaProjectDiagram,
  FaCertificate,
  FaGraduationCap,
  FaUserTie,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCog,
  FaComments
} from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  // Sidebar links
  const sidebarLinks = [
    { name: 'Dashboard', icon: <FaHome />, path: '/admin/dashboard' },
    { name: 'Profile', icon: <FaUserTie />, path: '/admin/profile' },
    { name: 'Skills', icon: <FaCog />, path: '/admin/skills' },
    { name: 'Blog Posts', icon: <FaNewspaper />, path: '/admin/blog' },
    { name: 'Projects', icon: <FaProjectDiagram />, path: '/admin/projects' },
    { name: 'Comments', icon: <FaComments />, path: '/admin/comments' },
    { name: 'Certificates', icon: <FaCertificate />, path: '/admin/certificates' },
    { name: 'Education & Experience', icon: <FaGraduationCap />, path: '/admin/education' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // If we're on the login page, render children (which is the login page)
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // For all other admin routes, protect them
  if (!user) {
    // The middleware will handle the redirect
    return null;
  }

  return (
    <div className="flex h-screen bg-dark-200">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-dark-100 text-gray-400 hover:text-white focus:outline-none"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-dark-100 transition-transform duration-300 ease-in-out transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary-400">TP Analytics</span>
          </Link>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="mt-5 px-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`group flex items-center px-4 py-3 mt-1 text-sm font-medium rounded-md transition-colors ${pathname === link.path
                ? 'text-white bg-primary-800/50'
                : 'text-gray-300 hover:bg-dark-300 hover:text-white'
                }`}
            >
              <span className="mr-3 text-lg">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-dark-300 hover:text-white transition-colors"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-dark-200 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
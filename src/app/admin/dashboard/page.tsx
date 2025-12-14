'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaEdit,
  FaEye, 
  FaChartLine,
  FaNewspaper, 
  FaProjectDiagram, 
  FaUserGraduate,
  FaSignOutAlt
} from 'react-icons/fa';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for dashboard stats
const mockData = {
  stats: {
    totalProjects: 12,
    publishedPosts: 8,
    totalVisitors: 1542,
    certificates: 5
  },
  recentVisitors: [
    { date: 'Oct 1', visits: 45 },
    { date: 'Oct 2', visits: 62 },
    { date: 'Oct 3', visits: 58 },
    { date: 'Oct 4', visits: 71 },
    { date: 'Oct 5', visits: 92 },
    { date: 'Oct 6', visits: 85 },
    { date: 'Oct 7', visits: 78 }
  ],
  projectsByCategory: [
    { name: 'Machine Learning', value: 5 },
    { name: 'Automation', value: 3 },
    { name: 'Dashboards', value: 4 }
  ],
  recentPosts: [
    { id: 1, title: 'Introduction to Data Visualization with D3.js', views: 345, date: '2023-09-28' },
    { id: 2, title: 'Machine Learning Techniques for Time Series Analysis', views: 212, date: '2023-09-15' },
    { id: 3, title: 'Automating Data Pipelines with Python', views: 178, date: '2023-09-02' }
  ]
};

// Colors for pie chart
const COLORS = ['#0284c7', '#c8102e', '#8b5cf6', '#059669'];

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // If not logged in and not loading, redirect to login page
    if (!user && !loading) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);
  
  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name || 'Admin'}</p>
        </div>
        <button 
          onClick={() => logout()} 
          className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
        >
          <FaSignOutAlt /> Logout
        </button>
      </header>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-dark-100 rounded-xl shadow-md p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Projects</p>
              <h3 className="text-3xl font-bold text-white mt-1">{mockData.stats.totalProjects}</h3>
            </div>
            <div className="bg-primary-900/30 p-3 rounded-lg">
              <FaProjectDiagram className="text-xl text-primary-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/projects" className="text-xs text-primary-400 hover:text-primary-300 flex items-center">
              <span>View projects</span>
              <FaEye className="ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="bg-dark-100 rounded-xl shadow-md p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 text-sm">Published Posts</p>
              <h3 className="text-3xl font-bold text-white mt-1">{mockData.stats.publishedPosts}</h3>
            </div>
            <div className="bg-primary-900/30 p-3 rounded-lg">
              <FaNewspaper className="text-xl text-primary-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/posts" className="text-xs text-primary-400 hover:text-primary-300 flex items-center">
              <span>View posts</span>
              <FaEye className="ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="bg-dark-100 rounded-xl shadow-md p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Visitors</p>
              <h3 className="text-3xl font-bold text-white mt-1">{mockData.stats.totalVisitors}</h3>
            </div>
            <div className="bg-primary-900/30 p-3 rounded-lg">
              <FaChartLine className="text-xl text-primary-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs text-gray-400">Updated today</span>
          </div>
        </div>
        
        <div className="bg-dark-100 rounded-xl shadow-md p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-400 text-sm">Certificates</p>
              <h3 className="text-3xl font-bold text-white mt-1">{mockData.stats.certificates}</h3>
            </div>
            <div className="bg-primary-900/30 p-3 rounded-lg">
              <FaUserGraduate className="text-xl text-primary-400" />
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/certificates" className="text-xs text-primary-400 hover:text-primary-300 flex items-center">
              <span>View certificates</span>
              <FaEye className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-dark-100 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-white mb-4">Visitors Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockData.recentVisitors}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                <Area type="monotone" dataKey="visits" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-dark-100 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-white mb-4">Projects by Category</h3>
          <div className="h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.projectsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockData.projectsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Posts Table */}
      <div className="bg-dark-100 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Recent Blog Posts</h3>
          <Link href="/admin/posts/new" className="text-sm text-primary-400 hover:text-primary-300 flex items-center">
            <span>New Post</span>
            <FaEdit className="ml-1" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {mockData.recentPosts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(post.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{post.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/posts/${post.id}`} className="text-primary-400 hover:text-primary-300 mr-4">
                      Edit
                    </Link>
                    <Link href={`/blog/${post.id}`} className="text-gray-400 hover:text-white">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
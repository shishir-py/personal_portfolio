import { create } from 'zustand';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

interface ProjectStore {
  projects: Project[];
  featuredProjects: Project[];
  skills: Skill[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchSkills: () => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => void;
}

// Rich mock data for development and testing
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Nepal Tourism Analytics Dashboard',
    slug: 'nepal-tourism-analytics',
    description: 'Interactive dashboard analyzing tourism trends in Nepal using Python, Pandas, and Plotly. Features visitor statistics, regional analysis, and seasonal patterns with beautiful data visualizations.',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop',
    tags: ['Python', 'Pandas', 'Plotly', 'Data Analysis', 'Tourism'],
    githubUrl: 'https://github.com/taraprasad/nepal-tourism-dashboard',
    demoUrl: 'https://nepal-tourism-analytics.vercel.app',
    featured: true
  },
  {
    id: '2',
    title: 'Machine Learning for Agriculture',
    slug: 'ml-agriculture-prediction',
    description: 'ML model predicting crop yields in Nepalese farms using weather data, soil conditions, and historical patterns. Built with scikit-learn and deployed using FastAPI.',
    coverImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
    tags: ['Machine Learning', 'Python', 'scikit-learn', 'FastAPI', 'Agriculture'],
    githubUrl: 'https://github.com/taraprasad/agriculture-ml',
    demoUrl: 'https://agriculture-ml-api.herokuapp.com',
    featured: true
  },
  {
    id: '3',
    title: 'COVID-19 Impact Analysis',
    slug: 'covid-impact-analysis',
    description: 'Comprehensive analysis of COVID-19 impact on Nepal\'s economy and healthcare system. Data scraping, cleaning, analysis and visualization using Python ecosystem.',
    coverImage: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&h=400&fit=crop',
    tags: ['Data Science', 'Web Scraping', 'Matplotlib', 'Seaborn', 'Public Health'],
    githubUrl: 'https://github.com/taraprasad/covid-nepal-analysis',
    demoUrl: 'https://covid-nepal-dashboard.netlify.app',
    featured: true
  },
  {
    id: '4',
    title: 'Real Estate Price Predictor',
    slug: 'real-estate-predictor',
    description: 'Web application predicting real estate prices in Kathmandu using regression models. Features interactive maps and neighborhood analysis.',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
    tags: ['React', 'Python', 'Flask', 'Leaflet', 'Real Estate'],
    githubUrl: 'https://github.com/taraprasad/ktm-real-estate',
    demoUrl: 'https://ktm-property-predictor.vercel.app',
    featured: false
  },
  {
    id: '5',
    title: 'Social Media Sentiment Analysis',
    slug: 'social-sentiment-analysis',
    description: 'NLP project analyzing sentiment of social media posts about Nepal using BERT and transformers. Real-time data collection and processing pipeline.',
    coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    tags: ['NLP', 'BERT', 'Transformers', 'Twitter API', 'Sentiment Analysis'],
    githubUrl: 'https://github.com/taraprasad/nepal-sentiment',
    demoUrl: 'https://nepal-sentiment.streamlit.app',
    featured: false
  }
];

const mockSkills: Skill[] = [
  // Programming Languages
  { id: '1', name: 'Python', level: 95, category: 'Programming' },
  { id: '2', name: 'SQL', level: 90, category: 'Programming' },
  { id: '3', name: 'R', level: 85, category: 'Programming' },
  { id: '4', name: 'JavaScript', level: 80, category: 'Programming' },
  { id: '5', name: 'TypeScript', level: 75, category: 'Programming' },
  
  // Data Science & ML
  { id: '6', name: 'Pandas', level: 95, category: 'Data Science' },
  { id: '7', name: 'NumPy', level: 90, category: 'Data Science' },
  { id: '8', name: 'Scikit-learn', level: 88, category: 'Machine Learning' },
  { id: '9', name: 'TensorFlow', level: 82, category: 'Machine Learning' },
  { id: '10', name: 'PyTorch', level: 78, category: 'Machine Learning' },
  
  // Visualization
  { id: '11', name: 'Matplotlib', level: 92, category: 'Visualization' },
  { id: '12', name: 'Seaborn', level: 90, category: 'Visualization' },
  { id: '13', name: 'Plotly', level: 88, category: 'Visualization' },
  { id: '14', name: 'D3.js', level: 75, category: 'Visualization' },
  
  // Tools & Frameworks
  { id: '15', name: 'Git', level: 90, category: 'Tools' },
  { id: '16', name: 'Docker', level: 85, category: 'Tools' },
  { id: '17', name: 'AWS', level: 80, category: 'Cloud' },
  { id: '18', name: 'MongoDB', level: 78, category: 'Database' },
  { id: '19', name: 'PostgreSQL', level: 85, category: 'Database' },
  { id: '20', name: 'React', level: 82, category: 'Frontend' }
];

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: mockProjects,
  featuredProjects: mockProjects.filter(p => p.featured),
  skills: mockSkills,
  loading: false,
  error: null,
  
  fetchProjects: async () => {
    try {
      set({ loading: true, error: null });
      
      // Try to fetch from API, fallback to mock data
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.projects) {
          set({ 
            projects: data.projects,
            featuredProjects: data.projects.filter((p: Project) => p.featured),
            loading: false 
          });
          return;
        }
      }
      
      // Fallback to mock data
      set({ 
        projects: mockProjects,
        featuredProjects: mockProjects.filter(p => p.featured),
        loading: false 
      });
    } catch (error) {
      console.log('Using mock data for projects:', error);
      set({ 
        projects: mockProjects,
        featuredProjects: mockProjects.filter(p => p.featured),
        loading: false,
        error: null // Don't show error for development
      });
    }
  },

  fetchSkills: async () => {
    try {
      set({ loading: true, error: null });
      
      // Try to fetch from API, fallback to mock data
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.skills) {
          set({ skills: data.skills, loading: false });
          return;
        }
      }
      
      // Fallback to mock data
      set({ skills: mockSkills, loading: false });
    } catch (error) {
      console.log('Using mock data for skills:', error);
      set({ 
        skills: mockSkills,
        loading: false,
        error: null
      });
    }
  },
  
  addProject: (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: Date.now().toString() };
    const projects = [...get().projects, newProject];
    set({ 
      projects,
      featuredProjects: projects.filter(p => p.featured)
    });
  }
}));
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.visitor.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.certificate.deleteMany({});
    await prisma.project.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.education.deleteMany({});
    await prisma.experience.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'admin'
      }
    });

    // Create profile
    console.log('📝 Creating profile...');
    await prisma.profile.create({
      data: {
        fullName: 'Shishir Pandey',
        title: 'Data Scientist & AI Engineer',
        bio: 'Passionate data scientist with expertise in machine learning, statistical analysis, and data visualization. Experienced in building end-to-end ML solutions that drive business value and solve real-world problems.',
        shortBio: 'Data Scientist specializing in ML, Analytics & AI Solutions',
        location: 'Kathmandu, Nepal',
        email: 'shishir@example.com',
        phone: '+977-9841234567',
        profilePic: '/1000079466.jpg',
        resume: '/tara_prasad_cv.pdf',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/shishirpandey',
          github: 'https://github.com/shishirpandey',
          twitter: 'https://twitter.com/shishirpandey'
        }
      }
    });

    // Create skills
    console.log('🎯 Creating skills...');
    const skills = [
      { name: 'Python', level: 95, category: 'Programming Languages', order: 1 },
      { name: 'R', level: 85, category: 'Programming Languages', order: 2 },
      { name: 'SQL', level: 90, category: 'Programming Languages', order: 3 },
      { name: 'JavaScript', level: 80, category: 'Programming Languages', order: 4 },
      { name: 'Machine Learning', level: 92, category: 'Data Science', order: 5 },
      { name: 'Deep Learning', level: 88, category: 'Data Science', order: 6 },
      { name: 'Data Visualization', level: 90, category: 'Data Science', order: 7 },
      { name: 'Statistical Analysis', level: 93, category: 'Data Science', order: 8 },
      { name: 'TensorFlow', level: 85, category: 'Machine Learning', order: 9 },
      { name: 'PyTorch', level: 82, category: 'Machine Learning', order: 10 },
      { name: 'Scikit-learn', level: 95, category: 'Machine Learning', order: 11 },
      { name: 'Pandas', level: 98, category: 'Machine Learning', order: 12 },
      { name: 'MongoDB', level: 85, category: 'Databases', order: 13 },
      { name: 'PostgreSQL', level: 88, category: 'Databases', order: 14 },
      { name: 'MySQL', level: 82, category: 'Databases', order: 15 },
      { name: 'Docker', level: 75, category: 'Tools & Technologies', order: 16 },
      { name: 'Git', level: 92, category: 'Tools & Technologies', order: 17 },
      { name: 'AWS', level: 78, category: 'Tools & Technologies', order: 18 },
      { name: 'React', level: 85, category: 'Frameworks', order: 19 },
      { name: 'Next.js', level: 82, category: 'Frameworks', order: 20 },
      { name: 'FastAPI', level: 88, category: 'Frameworks', order: 21 },
      { name: 'Problem Solving', level: 95, category: 'Soft Skills', order: 22 },
      { name: 'Communication', level: 90, category: 'Soft Skills', order: 23 },
      { name: 'Team Leadership', level: 85, category: 'Soft Skills', order: 24 }
    ];

    for (const skill of skills) {
      await prisma.skill.create({ data: skill });
    }

    // Create experiences
    console.log('💼 Creating experiences...');
    const experiences = [
      {
        title: 'Senior Data Scientist',
        company: 'Tech Solutions Nepal',
        location: 'Kathmandu, Nepal',
        startDate: new Date('2022-06-01'),
        endDate: null,
        current: true,
        description: 'Leading data science initiatives, developing machine learning models for predictive analytics, and mentoring junior data scientists. Built end-to-end ML pipelines that improved business efficiency by 40%.',
        order: 1
      },
      {
        title: 'Data Analyst',
        company: 'Analytics Hub',
        location: 'Kathmandu, Nepal',
        startDate: new Date('2021-01-15'),
        endDate: new Date('2022-05-30'),
        current: false,
        description: 'Analyzed large datasets to extract business insights, created interactive dashboards using Python and R, and collaborated with cross-functional teams to drive data-driven decision making.',
        order: 2
      },
      {
        title: 'Junior Data Scientist',
        company: 'Data Insights Co.',
        location: 'Kathmandu, Nepal',
        startDate: new Date('2020-03-01'),
        endDate: new Date('2020-12-31'),
        current: false,
        description: 'Developed predictive models for customer behavior analysis, performed statistical analysis on market trends, and automated data preprocessing workflows.',
        order: 3
      }
    ];

    for (const experience of experiences) {
      await prisma.experience.create({ data: experience });
    }

    // Create education
    console.log('🎓 Creating education...');
    const educations = [
      {
        institution: 'Tribhuvan University',
        degree: 'Master of Science',
        field: 'Data Science and Analytics',
        location: 'Kathmandu, Nepal',
        startDate: new Date('2018-08-01'),
        endDate: new Date('2020-07-30'),
        current: false,
        description: 'Specialized in machine learning algorithms, statistical modeling, and big data technologies. Thesis on "Predictive Analytics for Agricultural Yield in Nepal".',
        order: 1
      },
      {
        institution: 'Kathmandu University',
        degree: 'Bachelor of Science',
        field: 'Computer Science and Information Technology',
        location: 'Dhulikhel, Nepal',
        startDate: new Date('2014-08-01'),
        endDate: new Date('2018-06-30'),
        current: false,
        description: 'Foundation in computer science, algorithms, and software development. Final year project on "Machine Learning for Nepali Language Processing".',
        order: 2
      }
    ];

    for (const education of educations) {
      await prisma.education.create({ data: education });
    }

    // Create projects
    console.log('🚀 Creating projects...');
    const projects = [
      {
        title: 'Nepal Tourism Analytics Dashboard',
        slug: 'nepal-tourism-analytics',
        description: 'Comprehensive analytics platform for tourism data in Nepal featuring interactive charts, real-time statistics, and predictive modeling.',
        content: 'A comprehensive analytics platform built to analyze tourism patterns, visitor demographics, and economic impact of tourism in Nepal. The dashboard provides real-time insights and predictive analytics to support tourism policy decisions. Built with Python, Streamlit, Plotly, and machine learning models for forecasting tourist arrivals.',
        coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/shishirpandey/nepal-tourism-analytics',
        demoUrl: 'https://nepal-tourism-dashboard.streamlit.app',
        featured: true,
        tags: ['Python', 'Streamlit', 'Plotly', 'Machine Learning', 'Data Analysis'],
        order: 1
      },
      {
        title: 'AI-Powered Crop Prediction System',
        slug: 'ai-crop-prediction',
        description: 'Machine learning system for predicting optimal crop yields based on weather patterns, soil conditions, and historical agricultural data.',
        content: 'Developed an AI system that analyzes multiple factors to predict optimal crops and expected yields. The system uses weather data analysis, soil condition assessment, historical yield patterns, and market price trends to provide recommendations to farmers. Achieved 87% accuracy in crop yield prediction and helped 500+ farmers increase yield by average 25%.',
        coverImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/shishirpandey/crop-prediction-ml',
        demoUrl: 'https://crop-predictor.herokuapp.com',
        featured: true,
        tags: ['Python', 'TensorFlow', 'Scikit-learn', 'IoT', 'Agriculture'],
        order: 2
      },
      {
        title: 'COVID-19 Impact Analysis Nepal',
        slug: 'covid-impact-analysis',
        description: 'Comprehensive data analysis of COVID-19 impact on various sectors in Nepal with predictive modeling for recovery scenarios.',
        content: 'A comprehensive analysis project to understand and visualize the impact of COVID-19 on various sectors in Nepal including health, economy, education, and tourism. Used data from Ministry of Health, Nepal Rastra Bank, and WHO to provide insights and policy recommendations. Built interactive dashboards for real-time monitoring.',
        coverImage: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/shishirpandey/covid-analysis-nepal',
        demoUrl: null,
        featured: false,
        tags: ['Python', 'Data Analysis', 'Statistics', 'Public Health', 'R'],
        order: 3
      },
      {
        title: 'Nepali Text Classification System',
        slug: 'nepali-text-classification',
        description: 'Deep learning model for classifying Nepali text documents into categories with support for news, social media, and academic content.',
        content: 'A deep learning-based text classification system specifically designed for Nepali language content. The system can classify text into multiple categories and perform sentiment analysis. Built custom tokenization for Devanagari script and used LSTM-based neural network with attention mechanism. Achieved 92% accuracy on text classification tasks.',
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/shishirpandey/nepali-text-classification',
        demoUrl: 'https://nepali-nlp-api.herokuapp.com',
        featured: false,
        tags: ['Deep Learning', 'NLP', 'TensorFlow', 'Nepali Language', 'BERT'],
        order: 4
      }
    ];

    for (const project of projects) {
      await prisma.project.create({ data: project });
    }

    // Create certificates
    console.log('🏆 Creating certificates...');
    const certificates = [
      {
        name: 'Machine Learning Specialization',
        issuer: 'Stanford University (Coursera)',
        issueDate: new Date('2023-05-15'),
        expiryDate: null,
        credentialId: 'ML-CERT-2023-001',
        credentialUrl: 'https://coursera.org/verify/specialization/ML123456',
        description: 'Comprehensive machine learning course covering supervised learning, unsupervised learning, and neural networks.',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
        order: 1
      },
      {
        name: 'AWS Certified Machine Learning - Specialty',
        issuer: 'Amazon Web Services',
        issueDate: new Date('2023-08-20'),
        expiryDate: new Date('2026-08-20'),
        credentialId: 'AWS-ML-2023-789',
        credentialUrl: 'https://aws.amazon.com/verification',
        description: 'Validates expertise in building, training, tuning, and deploying machine learning models on AWS.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
        order: 2
      },
      {
        name: 'Deep Learning Specialization',
        issuer: 'DeepLearning.AI (Coursera)',
        issueDate: new Date('2022-12-10'),
        expiryDate: null,
        credentialId: 'DL-SPEC-2022-456',
        credentialUrl: 'https://coursera.org/verify/specialization/DL789012',
        description: 'Advanced deep learning course covering neural networks, CNNs, RNNs, and transformer architectures.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        order: 3
      },
      {
        name: 'Google Data Analytics Certificate',
        issuer: 'Google (Coursera)',
        issueDate: new Date('2021-09-30'),
        expiryDate: null,
        credentialId: 'GDA-2021-321',
        credentialUrl: 'https://coursera.org/verify/professional-cert/GDA456789',
        description: 'Professional certificate in data analytics covering data cleaning, analysis, and visualization.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        order: 4
      }
    ];

    for (const certificate of certificates) {
      await prisma.certificate.create({ data: certificate });
    }

    // Create blog posts
    console.log('📝 Creating blog posts...');
    const posts = [
      {
        title: 'The Future of Machine Learning in Nepal: Opportunities and Challenges',
        slug: 'future-machine-learning-nepal',
        excerpt: 'Exploring the potential of machine learning in Nepal\'s context, examining current opportunities, challenges, and the path forward for AI adoption in various sectors.',
        content: 'Nepal stands at a unique crossroads in the digital revolution. While the country faces traditional development challenges, it also possesses tremendous potential to leapfrog technological barriers through strategic adoption of machine learning and artificial intelligence. This article explores the current landscape, opportunities in agriculture, healthcare, education, tourism, and financial services, along with the challenges of infrastructure, human resources, and data availability.',
        coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
        tags: ['Machine Learning', 'Nepal', 'AI', 'Technology', 'Development'],
        published: true,
        views: 1247,
      },
      {
        title: 'Data Visualization Best Practices: Making Data Tell Compelling Stories',
        slug: 'data-visualization-best-practices',
        excerpt: 'A comprehensive guide to creating effective data visualizations that communicate insights clearly and drive decision-making.',
        content: 'Effective data visualization bridges the gap between raw data and understanding, enabling stakeholders to make informed decisions quickly. This guide covers core principles like knowing your audience, choosing the right chart type, and designing for clarity. Learn about advanced techniques, popular tools, and common pitfalls to avoid when creating compelling data stories.',
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        tags: ['Data Visualization', 'Analytics', 'Design', 'Best Practices', 'Storytelling'],
        published: true,
        views: 892,
      },
      {
        title: 'Building Scalable Machine Learning Pipelines: From Development to Production',
        slug: 'scalable-ml-pipelines',
        excerpt: 'Learn how to design and implement robust machine learning pipelines that can handle real-world scale and complexity.',
        content: 'Moving machine learning models from development to production is one of the most challenging aspects of data science. This comprehensive guide covers essential components including data ingestion, feature engineering, model training, deployment, and monitoring. Learn about technology stacks, best practices, real-world examples, and strategies for building reliable, scalable ML systems.',
        coverImage: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop',
        tags: ['Machine Learning', 'MLOps', 'Scalability', 'Production', 'DevOps'],
        published: false,
        views: 0,
      }
    ];

    for (const post of posts) {
      await prisma.post.create({ data: post });
    }

    console.log('✅ Database seeded successfully!');
    console.log(`Created:
    - 1 admin user (admin@example.com / admin123)
    - 1 profile
    - ${skills.length} skills
    - ${experiences.length} experiences  
    - ${educations.length} education records
    - ${projects.length} projects
    - ${certificates.length} certificates
    - ${posts.length} blog posts`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
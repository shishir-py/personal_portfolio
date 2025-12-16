import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    // Delete in order to avoid foreign key constraints (though MongoDB doesn't strictly enforce them, Prisma might check connected records)
    // Deleting child records first
    await prisma.comment.deleteMany({});
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
    const hashedPassword = await hash('admin123', 12);

    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Tara Prasad Pandey',
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('Admin user created');

    // Create profile
    console.log('📝 Creating profile...');
    await prisma.profile.create({
      data: {
        fullName: 'Tara Prasad Pandey',
        title: 'Senior Data Scientist & AI Engineer',
        bio: 'Passionate data scientist with 5+ years of experience in machine learning, artificial intelligence, and data analytics. Experienced in creating automated reporting systems, machine learning models, and interactive dashboards that help businesses make data-driven decisions.',
        shortBio: 'Data Scientist specializing in ML, Analytics & AI Solutions',
        location: 'Kathmandu, Nepal',
        email: 'tara.prasad@example.com', // Updated email
        phone: '+977 9812345678',
        profilePic: '/1000079466.jpg',
        resume: '/tara_prasad_cv.pdf',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/taraprasad',
          github: 'https://github.com/taraprasad',
          twitter: 'https://twitter.com/taraprasad'
        }
      },
    });
    console.log('Profile created');

    // Create skills (Comprehensive list from seed-final.js)
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
    console.log(`Created ${skills.length} skills`);

    // Create experiences (Using companies from seed.ts but updated titles/descriptions to be more impactful)
    console.log('💼 Creating experiences...');
    const experiences = [
      {
        title: 'Data And Automation Analyst', // Upgraded title based on Profile Title
        company: 'Rippey AI',
        location: 'Kathmandu, Nepal',
        startDate: new Date('2022-03-01'),
        current: true,
        description: 'Leading AI and data analysis initiatives. Developed an automated reporting system that saved 15 hours of manual work weekly. Architected and deployed deep learning classification systems for customer feedback analysis using TensorFlow and NLP.',
        order: 1,
      },
      {
        title: 'Data Analyst',
        company: 'Tech Innovations Nepal',
        location: 'Kathmandu, Nepal',
        startDate: new Date('2020-06-01'),
        endDate: new Date('2022-02-28'),
        current: false,
        description: 'Analyzed business data to identify trends and opportunities. Created interactive dashboards using Tableau and PowerBI. Automated monthly reporting pipelines using Python and SQL.',
        order: 2,
      },
      {
        title: 'Junior Data Scientist',
        company: 'DataMinds',
        location: 'Kathmandu, Nepal',
        startDate: new Date('2018-08-01'),
        endDate: new Date('2020-05-31'),
        current: false,
        description: 'Assisted in developing predictive models using Python and TensorFlow. Performed extensive data cleaning and preprocessing. Created data visualization reports for stakeholders.',
        order: 3,
      },
    ];

    for (const experience of experiences) {
      await prisma.experience.create({ data: experience });
    }
    console.log('Experience entries created');

    // Create education (From seed.ts)
    console.log('🎓 Creating education...');
    const educations = [
      {
        institution: 'Tribhuvan University',
        degree: 'Master of Science',
        field: 'Computer Science', // specialized in Data Science
        location: 'Kathmandu, Nepal',
        startDate: new Date('2016-08-01'),
        endDate: new Date('2018-05-31'),
        current: false,
        description: 'Focused on machine learning and data mining. Thesis on "Predictive Analytics for Agricultural Yield in Nepal". Graduated with distinction.',
        order: 1,
      },
      {
        institution: 'Kathmandu University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'Dhulikhel, Nepal',
        startDate: new Date('2012-08-01'),
        endDate: new Date('2016-05-31'),
        current: false,
        description: 'Specialized in software engineering and database systems. Final year project on "Machine Learning for Nepali Language Processing".',
        order: 2,
      },
    ];

    for (const education of educations) {
      await prisma.education.create({ data: education });
    }
    console.log('Education entries created');

    // Create projects (From seed-final.js - rich content)
    console.log('🚀 Creating projects...');
    const projects = [
      {
        title: 'Nepal Tourism Analytics Dashboard',
        slug: 'nepal-tourism-analytics',
        description: 'Comprehensive analytics platform for tourism data in Nepal featuring interactive charts, real-time statistics, and predictive modeling.',
        content: `# Nepal Tourism Analytics Dashboard

## Overview
A comprehensive analytics platform built to analyze tourism patterns, visitor demographics, and economic impact of tourism in Nepal. The dashboard provides real-time insights and predictive analytics to support tourism policy decisions.

## Features
- Interactive data visualizations using Plotly and D3.js
- Real-time tourism statistics
- Predictive models for tourist arrivals
- Economic impact analysis
- Seasonal trend analysis
- Geographic distribution mapping

## Technologies Used
- **Backend**: Python, FastAPI, PostgreSQL
- **Frontend**: Streamlit, Plotly, D3.js
- **ML**: Scikit-learn, Prophet, Pandas
- **Data Sources**: Nepal Tourism Board, World Bank Data

## Impact
- Helped identify peak tourism seasons with 95% accuracy
- Provided insights that influenced national tourism policies
- Reduced data analysis time by 60% for tourism stakeholders`,
        coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/taraprasad/nepal-tourism-analytics',
        demoUrl: 'https://nepal-tourism-dashboard.streamlit.app',
        featured: true,
        tags: ['Python', 'Streamlit', 'Plotly', 'Machine Learning', 'Data Analysis'],
        order: 1
      },
      {
        title: 'AI-Powered Crop Prediction System',
        slug: 'ai-crop-prediction',
        description: 'Machine learning system for predicting optimal crop yields based on weather patterns, soil conditions, and historical agricultural data.',
        content: `# AI-Powered Crop Prediction System

## Problem Statement
Farmers in Nepal face challenges in crop selection and yield prediction due to unpredictable weather patterns and limited access to scientific farming guidance.

## Solution
Developed an AI system that analyzes multiple factors to predict optimal crops and expected yields:
- Weather data analysis
- Soil condition assessment  
- Historical yield patterns
- Market price trends

## Technical Implementation
- **Data Collection**: IoT sensors, satellite imagery, weather APIs
- **ML Models**: Random Forest, XGBoost, Neural Networks
- **Features**: 45+ engineered features from weather, soil, and market data
- **Accuracy**: 87% accuracy in crop yield prediction

## Results
- Helped 500+ farmers increase yield by average 25%
- Reduced crop failure rates by 40%
- Improved farmer income by 30% on average`,
        coverImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/taraprasad/crop-prediction-ml',
        demoUrl: 'https://crop-predictor.herokuapp.com',
        featured: true,
        tags: ['Python', 'TensorFlow', 'Scikit-learn', 'IoT', 'Agriculture'],
        order: 2
      },
      {
        title: 'COVID-19 Impact Analysis Nepal',
        slug: 'covid-impact-analysis',
        description: 'Comprehensive data analysis of COVID-19 impact on various sectors in Nepal with predictive modeling for recovery scenarios.',
        content: `# COVID-19 Impact Analysis Nepal

## Project Overview
A comprehensive analysis project to understand and visualize the impact of COVID-19 on various sectors in Nepal including health, economy, education, and tourism.

## Data Sources
- Ministry of Health and Population Nepal
- Nepal Rastra Bank economic data
- World Health Organization
- Our World in Data
- Custom surveys and data collection

## Analysis Components
1. **Epidemiological Analysis**: Case trends, mortality rates, vaccination progress
2. **Economic Impact**: GDP analysis, employment effects, business closures
3. **Healthcare System**: Hospital capacity, resource allocation
4. **Social Impact**: Education disruption, mental health indicators

## Key Insights
- Identified critical periods requiring intervention
- Predicted recovery timelines for different sectors
- Provided policy recommendations based on data analysis

## Technical Stack
- **Analysis**: Python, Pandas, NumPy, SciPy
- **Visualization**: Matplotlib, Seaborn, Plotly
- **Web Dashboard**: Streamlit
- **Statistical Testing**: R, Stan for Bayesian analysis`,
        coverImage: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/taraprasad/covid-analysis-nepal',
        demoUrl: null,
        featured: false,
        tags: ['Python', 'Data Analysis', 'Statistics', 'Public Health', 'R'],
        order: 3
      },
      {
        title: 'Nepali Text Classification System',
        slug: 'nepali-text-classification',
        description: 'Deep learning model for classifying Nepali text documents into categories with support for news, social media, and academic content.',
        content: `# Nepali Text Classification System

## Overview
A deep learning-based text classification system specifically designed for Nepali language content. The system can classify text into multiple categories and sentiment analysis.

## Challenges
- Limited Nepali language datasets
- Complex grammar and multiple writing systems
- Lack of pre-trained models for Nepali

## Solution
1. **Data Collection**: Scraped and curated 50,000+ Nepali text samples
2. **Preprocessing**: Custom tokenization for Devanagari script
3. **Model Architecture**: LSTM-based neural network with attention mechanism
4. **Fine-tuning**: Transfer learning from multilingual BERT

## Features
- Text classification (News, Social Media, Academic, etc.)
- Sentiment analysis (Positive, Negative, Neutral)
- Named Entity Recognition for Nepali
- API for easy integration

## Performance
- 92% accuracy on text classification
- 89% accuracy on sentiment analysis
- Processing speed: 1000 documents/minute

## Applications
- News categorization for media houses
- Social media monitoring
- Academic research tool`,
        coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
        githubUrl: 'https://github.com/taraprasad/nepali-text-classification',
        demoUrl: 'https://nepali-nlp-api.herokuapp.com',
        featured: false,
        tags: ['Deep Learning', 'NLP', 'TensorFlow', 'Nepali Language', 'BERT'],
        order: 4
      }
    ];

    for (const project of projects) {
      await prisma.project.create({ data: project });
    }
    console.log(`Created ${projects.length} projects`);

    // Create certificates (From seed-final.js)
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
    console.log(`Created ${certificates.length} certificates`);

    // Create blog posts (From seed-final.js - rich content)
    console.log('📝 Creating blog posts...');
    const posts = [
      {
        title: 'The Future of Machine Learning in Nepal: Opportunities and Challenges',
        slug: 'future-machine-learning-nepal',
        excerpt: 'Exploring the potential of machine learning in Nepal\'s context, examining current opportunities, challenges, and the path forward for AI adoption in various sectors.',
        content: `# The Future of Machine Learning in Nepal: Opportunities and Challenges

## Introduction

Nepal stands at a unique crossroads in the digital revolution. While the country faces traditional development challenges, it also possesses tremendous potential to leapfrog technological barriers through strategic adoption of machine learning and artificial intelligence.

## Current Landscape

### Opportunities
1. **Agriculture**: With 65% of the population dependent on agriculture, ML can revolutionize crop prediction, yield optimization, and market analysis
2. **Healthcare**: Remote diagnostics and predictive healthcare models can address the shortage of medical professionals
3. **Education**: Personalized learning systems can overcome geographical barriers
4. **Tourism**: Intelligent recommendation systems and predictive analytics for tourism planning
5. **Financial Services**: ML-powered financial inclusion and risk assessment

### Success Stories
- **Digital Payment Systems**: The rapid adoption of digital payments shows Nepal's readiness for technological change
- **Hydropower Optimization**: ML models for predicting water flow and optimizing energy production
- **Disaster Management**: Early warning systems using satellite data and ML algorithms

## Challenges

### Infrastructure
- Limited internet connectivity in rural areas
- Insufficient computing infrastructure
- Power supply inconsistencies

### Human Resources
- Shortage of skilled ML practitioners
- Limited specialized educational programs
- Brain drain to international markets

### Data Availability
- Lack of structured datasets
- Data privacy and security concerns
- Limited government data accessibility

## Recommendations

1. **Government Initiatives**
   - Establish national AI strategy
   - Invest in digital infrastructure
   - Create data sharing policies

2. **Educational Reforms**
   - Integrate ML/AI in university curricula
   - Establish research centers
   - Industry-academia partnerships

3. **Private Sector Engagement**
   - Encourage ML startups
   - Corporate training programs
   - International collaborations

## Conclusion

Nepal has the potential to become a significant player in the ML ecosystem. With proper planning, investment in education and infrastructure, and strategic partnerships, the country can harness the power of machine learning to solve its unique challenges and create new opportunities for economic growth.

The journey requires collective effort from government, academia, and industry, but the potential rewards – improved healthcare, increased agricultural productivity, better education, and enhanced disaster preparedness – make this investment crucial for Nepal's future.`,
        coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
        tags: ['Machine Learning', 'Nepal', 'AI', 'Technology', 'Development'],
        published: true,
        views: 1247,
      },
      {
        title: 'Data Visualization Best Practices: Making Data Tell Compelling Stories',
        slug: 'data-visualization-best-practices',
        excerpt: 'A comprehensive guide to creating effective data visualizations that communicate insights clearly and drive decision-making.',
        content: `# Data Visualization Best Practices: Making Data Tell Compelling Stories

## Why Data Visualization Matters

In our data-driven world, the ability to transform complex datasets into clear, actionable insights is invaluable. Effective data visualization bridges the gap between raw data and understanding, enabling stakeholders to make informed decisions quickly.

## Core Principles

### 1. Know Your Audience
- **Executive Level**: High-level summaries, key metrics, trends
- **Analysts**: Detailed breakdowns, drill-down capabilities
- **General Public**: Simple, intuitive charts with clear messages

### 2. Choose the Right Chart Type
- **Bar Charts**: Comparing categories
- **Line Charts**: Showing trends over time
- **Scatter Plots**: Exploring relationships
- **Heatmaps**: Displaying patterns in large datasets
- **Geographic Maps**: Location-based data

### 3. Design for Clarity
- Use consistent color schemes
- Avoid chart junk (unnecessary decorative elements)
- Ensure adequate white space
- Make text readable (appropriate font sizes)
- Include clear titles and labels

## Advanced Techniques

### Interactive Dashboards
Modern data visualization tools allow for:
- **Filtering**: Users can focus on specific data subsets
- **Drill-down**: Navigate from summary to detailed views
- **Real-time Updates**: Display live data streams
- **Cross-filtering**: Selections in one chart affect others

### Color Psychology in Data Viz
- **Red**: Urgency, danger, negative values
- **Green**: Success, positive trends, go-ahead
- **Blue**: Trust, stability, neutral information
- **Orange**: Caution, moderate priority
- **Gray**: Supporting information, inactive states

## Tools and Technologies

### Popular Visualization Libraries
1. **Python**
   - Matplotlib: Foundation library for plotting
   - Seaborn: Statistical data visualization
   - Plotly: Interactive web-based visualizations
   - Bokeh: Interactive visualization for web applications

2. **R**
   - ggplot2: Grammar of graphics implementation
   - Shiny: Interactive web applications
   - Leaflet: Interactive maps

3. **JavaScript**
   - D3.js: Data-driven documents
   - Chart.js: Simple yet flexible charting
   - Highcharts: Feature-rich charting library

## Conclusion

Effective data visualization is both an art and a science. It requires understanding of design principles, knowledge of appropriate tools, and most importantly, deep empathy for the end user's needs and context.`,
        coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        tags: ['Data Visualization', 'Analytics', 'Design', 'Best Practices', 'Storytelling'],
        published: true,
        views: 892,
      },
      {
        title: 'Building Scalable Machine Learning Pipelines: From Development to Production',
        slug: 'scalable-ml-pipelines',
        excerpt: 'Learn how to design and implement robust machine learning pipelines that can handle real-world scale and complexity.',
        content: `# Building Scalable Machine Learning Pipelines: From Development to Production

## Introduction

Moving machine learning models from development to production is one of the most challenging aspects of data science. This guide covers the essential components and best practices for building scalable ML pipelines that work in real-world scenarios.

## Pipeline Architecture

### Core Components

1. **Data Ingestion**
   - Batch processing systems
   - Real-time streaming
   - Data validation and quality checks
   - Schema evolution handling

2. **Feature Engineering**
   - Feature stores for consistency
   - Automated feature generation
   - Feature versioning and lineage
   - Real-time feature computation

3. **Model Training**
   - Automated hyperparameter tuning
   - Cross-validation strategies
   - Model versioning and registry
   - Distributed training capabilities

4. **Model Deployment**
   - A/B testing frameworks
   - Canary deployments
   - Load balancing and scaling
   - Rollback mechanisms

5. **Monitoring and Observability**
   - Performance monitoring
   - Data drift detection
   - Model degradation alerts
   - Business metric tracking

## Technology Stack

### Cloud Platforms
- **AWS**: SageMaker, Lambda, Kinesis
- **Google Cloud**: AI Platform, DataFlow, BigQuery ML
- **Azure**: Machine Learning Studio, Data Factory

### Open Source Tools
- **Orchestration**: Airflow, Prefect, Kubeflow
- **Feature Stores**: Feast, Tecton, Hopsworks
- **Model Serving**: MLflow, Seldon, KServe
- **Monitoring**: Evidently AI, Whylabs, Fiddler

## Conclusion

Building scalable ML pipelines requires careful consideration of architecture, tooling, and operational practices. The key is to start simple and evolve incrementally, always keeping production requirements in mind.`,
        coverImage: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop',
        tags: ['Machine Learning', 'MLOps', 'Scalability', 'Production', 'DevOps'],
        published: false,
        views: 0,
      }
    ];

    for (const post of posts) {
      await prisma.post.create({ data: post });
    }
    console.log(`Created ${posts.length} blog posts`);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user
    console.log('👤 Creating admin user...');
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@taraprasad.com' }
    });

    let adminUser;
    if (!adminExists) {
      const hashedPassword = await hash('admin123', 12);
      
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@taraprasad.com',
          name: 'Tara Prasad Pandey',
          password: hashedPassword,
          role: 'admin'
        }
      });
      console.log('✅ Admin user created');
    } else {
      adminUser = adminExists;
      console.log('✅ Admin user already exists');
    }

    // Create profile
    console.log('📄 Creating profile...');
    const profileExists = await prisma.profile.findFirst();
    
    if (!profileExists) {
      await prisma.profile.create({
        data: {
          fullName: 'Tara Prasad Pandey',
          title: 'Data Analyst from Nepal',
          bio: 'Passionate data analyst from Nepal specializing in machine learning, data visualization, and automation. I have extensive experience working with Python ecosystem, R, and modern data science tools to solve real-world problems in agriculture, tourism, and public health sectors.',
          shortBio: 'Data Analyst specializing in ML, automation, and data visualization using Python ecosystem.',
          location: 'Kathmandu, Nepal',
          email: 'tara.prasad@example.com',
          phone: '+977-98XXXXXXXX',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/taraprasad',
            github: 'https://github.com/taraprasad',
            twitter: 'https://twitter.com/taraprasad_np',
            website: 'https://taraprasad.dev'
          }
        }
      });
      console.log('✅ Profile created');
    } else {
      console.log('✅ Profile already exists');
    }

    // Create skills
    console.log('🛠 Creating skills...');
    const skillsData = [
      // Programming Languages
      { name: 'Python', level: 95, category: 'Programming', order: 1 },
      { name: 'SQL', level: 90, category: 'Programming', order: 2 },
      { name: 'R', level: 85, category: 'Programming', order: 3 },
      { name: 'JavaScript', level: 80, category: 'Programming', order: 4 },
      { name: 'TypeScript', level: 75, category: 'Programming', order: 5 },
      
      // Data Science & ML
      { name: 'Pandas', level: 95, category: 'Data Science', order: 1 },
      { name: 'NumPy', level: 90, category: 'Data Science', order: 2 },
      { name: 'Scikit-learn', level: 88, category: 'Machine Learning', order: 1 },
      { name: 'TensorFlow', level: 82, category: 'Machine Learning', order: 2 },
      { name: 'PyTorch', level: 78, category: 'Machine Learning', order: 3 },
      
      // Visualization
      { name: 'Matplotlib', level: 92, category: 'Visualization', order: 1 },
      { name: 'Seaborn', level: 90, category: 'Visualization', order: 2 },
      { name: 'Plotly', level: 88, category: 'Visualization', order: 3 },
      { name: 'D3.js', level: 75, category: 'Visualization', order: 4 },
      
      // Tools & Database
      { name: 'Git', level: 90, category: 'Tools', order: 1 },
      { name: 'Docker', level: 85, category: 'Tools', order: 2 },
      { name: 'AWS', level: 80, category: 'Cloud', order: 1 },
      { name: 'MongoDB', level: 78, category: 'Database', order: 1 },
      { name: 'PostgreSQL', level: 85, category: 'Database', order: 2 },
    ];

    for (const skill of skillsData) {
      const exists = await prisma.skill.findFirst({
        where: { name: skill.name }
      });
      
      if (!exists) {
        await prisma.skill.create({ data: skill });
      }
    }
    console.log(`✅ Created ${skillsData.length} skills`);

    // Create projects
    console.log('📊 Creating projects...');
    const projectsData = [
      {
        title: 'Nepal Tourism Analytics Dashboard',
        slug: 'nepal-tourism-analytics',
        description: 'Interactive dashboard analyzing tourism trends in Nepal using Python, Pandas, and Plotly. Features visitor statistics, regional analysis, and seasonal patterns with beautiful data visualizations.',
        content: `# Nepal Tourism Analytics Dashboard

This comprehensive analytics dashboard provides deep insights into Nepal's tourism industry, helping stakeholders make data-driven decisions.

## Key Features

- **Visitor Statistics**: Track tourist arrivals by country, month, and region
- **Seasonal Analysis**: Identify peak seasons and travel patterns  
- **Regional Breakdown**: Compare tourism across different regions of Nepal
- **Interactive Visualizations**: Dynamic charts and graphs using Plotly
- **Data Export**: Export insights and reports in various formats

## Technology Stack

- **Backend**: Python, Pandas for data processing
- **Visualization**: Plotly, Matplotlib, Seaborn
- **Data Sources**: Nepal Tourism Board API, Government statistics
- **Deployment**: Streamlit Cloud

## Impact

This dashboard has been used by tourism agencies and government officials to:
- Plan marketing campaigns for off-peak seasons
- Allocate resources to high-traffic regions
- Understand international visitor preferences
- Monitor recovery post-COVID-19`,
        coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop',
        githubUrl: 'https://github.com/taraprasad/nepal-tourism-dashboard',
        demoUrl: 'https://nepal-tourism-analytics.streamlit.app',
        featured: true,
        tags: ['Python', 'Pandas', 'Plotly', 'Data Analysis', 'Tourism', 'Streamlit'],
        order: 1
      },
      {
        title: 'Machine Learning for Agriculture',
        slug: 'ml-agriculture-prediction',
        description: 'ML model predicting crop yields in Nepalese farms using weather data, soil conditions, and historical patterns. Built with scikit-learn and deployed using FastAPI.',
        content: `# Agricultural Yield Prediction System

A machine learning solution designed to help Nepalese farmers optimize their crop yields through data-driven insights.

## Problem Statement

Farmers in Nepal face challenges in predicting crop yields due to:
- Unpredictable weather patterns
- Limited access to soil quality data
- Lack of historical yield analysis
- Traditional farming methods

## Solution

Developed a comprehensive ML system that analyzes:
- **Weather Data**: Temperature, rainfall, humidity patterns
- **Soil Conditions**: pH levels, nutrient content, moisture
- **Historical Yields**: Past crop performance data
- **Farming Practices**: Fertilizer use, irrigation methods

## Models Used

- **Random Forest**: For yield prediction (85% accuracy)
- **XGBoost**: For crop recommendation (92% accuracy)
- **Linear Regression**: For fertilizer optimization

## API Integration

RESTful API built with FastAPI providing:
- Real-time yield predictions
- Crop recommendations
- Optimal planting dates
- Fertilizer suggestions

## Impact

- Helped 500+ farmers increase yields by 20%
- Reduced fertilizer costs by 15%
- Improved crop selection accuracy by 85%`,
        coverImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
        githubUrl: 'https://github.com/taraprasad/agriculture-ml',
        demoUrl: 'https://agriculture-ml-api.herokuapp.com',
        featured: true,
        tags: ['Machine Learning', 'Python', 'scikit-learn', 'FastAPI', 'Agriculture', 'XGBoost'],
        order: 2
      },
      {
        title: 'COVID-19 Impact Analysis',
        slug: 'covid-impact-analysis',
        description: 'Comprehensive analysis of COVID-19 impact on Nepal\'s economy and healthcare system. Data scraping, cleaning, analysis and visualization using Python ecosystem.',
        content: `# COVID-19 Impact Analysis for Nepal

A comprehensive data science project analyzing the multi-faceted impact of COVID-19 on Nepal's society, economy, and healthcare system.

## Objectives

- Analyze infection trends and healthcare capacity
- Study economic impact across different sectors  
- Examine social and demographic factors
- Provide actionable insights for policy makers

## Data Sources

- **Health Data**: WHO, Nepal Ministry of Health
- **Economic Data**: Nepal Rastra Bank, World Bank
- **Social Media**: Twitter sentiment analysis
- **News Sources**: Web scraping from major outlets

## Key Findings

### Healthcare Impact
- Hospital bed occupancy reached 95% during peaks
- ICU capacity became critical bottleneck
- Rural areas had 60% less access to testing

### Economic Impact  
- Tourism industry lost $2.5B in revenue
- Remittances dropped by 15% in 2020
- SMEs faced 40% revenue decline

### Social Impact
- Educational disruption affected 8M students
- Domestic violence cases increased by 35%
- Mental health services demand rose by 200%

## Technical Implementation

- **Data Collection**: Beautiful Soup, Scrapy, APIs
- **Analysis**: Pandas, NumPy, SciPy
- **Visualization**: Matplotlib, Seaborn, Plotly
- **NLP**: NLTK for sentiment analysis
- **Reporting**: Jupyter notebooks, interactive dashboards`,
        coverImage: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&h=400&fit=crop',
        githubUrl: 'https://github.com/taraprasad/covid-nepal-analysis',
        demoUrl: 'https://covid-nepal-dashboard.netlify.app',
        featured: true,
        tags: ['Data Science', 'Web Scraping', 'Matplotlib', 'Seaborn', 'Public Health', 'NLP'],
        order: 3
      }
    ];

    for (const project of projectsData) {
      const exists = await prisma.project.findUnique({
        where: { slug: project.slug }
      });
      
      if (!exists) {
        await prisma.project.create({ data: project });
      }
    }
    console.log(`✅ Created ${projectsData.length} projects`);

    console.log('🎉 Database seeding completed successfully!');
    
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
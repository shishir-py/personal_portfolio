import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create admin user
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }
  });
  
  if (!adminExists) {
    const hashedPassword = await hash('admin123', 12);
    
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin',
      },
    });
    
    console.log('Admin user created');
  }
  
  // Create profile
  const profileExists = await prisma.profile.findFirst();
  
  if (!profileExists) {
    await prisma.profile.create({
      data: {
        fullName: 'Tara Prasad Pandey',
        title: 'Data Analyst',
        bio: 'Data Analyst with expertise in machine learning, automation, and data visualization. Experience in creating automated reporting systems, machine learning models, and interactive dashboards that help businesses make data-driven decisions.',
        shortBio: 'Data Analyst specializing in ML and automation',
        location: 'Kathmandu, Nepal',
        email: 'taraprasad@example.com',
        phone: '+977 9812345678',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/taraprasadpandey',
          github: 'https://github.com/taraprasad',
          twitter: 'https://twitter.com/taraprasadpandey'
        }
      },
    });
    
    console.log('Profile created');
  }
  
  // Create experience entries
  const experienceExists = await prisma.experience.findFirst();
  
  if (!experienceExists) {
    await prisma.experience.createMany({
      data: [
        {
          title: 'Senior Data Analyst',
          company: 'Rippey AI',
          location: 'Kathmandu, Nepal',
          startDate: new Date('2022-03-01'),
          current: true,
          description: 'Leading data analysis initiatives and machine learning projects. Created an automated reporting system that saved 15 hours of manual work weekly. Developed a deep learning classification system for customer feedback.',
          order: 1,
        },
        {
          title: 'Data Analyst',
          company: 'Tech Innovations Nepal',
          location: 'Kathmandu, Nepal',
          startDate: new Date('2020-06-01'),
          endDate: new Date('2022-02-28'),
          current: false,
          description: 'Analyzed business data to identify trends and opportunities. Created dashboards using Tableau and PowerBI. Automated monthly reporting using Python and SQL.',
          order: 2,
        },
        {
          title: 'Junior Data Scientist',
          company: 'DataMinds',
          location: 'Kathmandu, Nepal',
          startDate: new Date('2018-08-01'),
          endDate: new Date('2020-05-31'),
          current: false,
          description: 'Assisted in developing predictive models using Python and TensorFlow. Performed data cleaning and preprocessing. Created data visualization reports.',
          order: 3,
        },
      ],
    });
    
    console.log('Experience entries created');
  }
  
  // Create education entries
  const educationExists = await prisma.education.findFirst();
  
  if (!educationExists) {
    await prisma.education.createMany({
      data: [
        {
          institution: 'Tribhuvan University',
          degree: 'Master of Science',
          field: 'Computer Science',
          location: 'Kathmandu, Nepal',
          startDate: new Date('2016-08-01'),
          endDate: new Date('2018-05-31'),
          description: 'Focused on machine learning and data mining. Graduated with distinction.',
          order: 1,
        },
        {
          institution: 'Kathmandu University',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          location: 'Dhulikhel, Nepal',
          startDate: new Date('2012-08-01'),
          endDate: new Date('2016-05-31'),
          description: 'Specialized in software engineering and database systems.',
          order: 2,
        },
      ],
    });
    
    console.log('Education entries created');
  }
  
  // Create skills
  const skillsExist = await prisma.skill.findFirst();
  
  if (!skillsExist) {
    await prisma.skill.createMany({
      data: [
        { name: 'Python', level: 95, category: 'Programming', order: 1 },
        { name: 'SQL', level: 90, category: 'Database', order: 2 },
        { name: 'MongoDB', level: 85, category: 'Database', order: 3 },
        { name: 'TensorFlow', level: 80, category: 'ML', order: 4 },
        { name: 'Data Visualization', level: 90, category: 'Analysis', order: 5 },
        { name: 'Google Analytics', level: 75, category: 'Tools', order: 6 },
        { name: 'Looker', level: 85, category: 'Tools', order: 7 },
        { name: 'ETL Pipelines', level: 80, category: 'Data Engineering', order: 8 },
      ],
    });
    
    console.log('Skills created');
  }
  
  // Create projects
  const projectsExist = await prisma.project.findFirst();
  
  if (!projectsExist) {
    await prisma.project.createMany({
      data: [
        {
          title: 'Automated Reporting System',
          slug: 'automated-reporting-system',
          description: 'An automated data reporting system built with Python, MongoDB, and Google Scripts that generates daily performance reports.',
          content: `
# Automated Reporting System

## Overview

This system automates the generation of daily performance reports by collecting data from multiple sources, processing it, and creating visually appealing reports that are automatically sent to stakeholders.

## Technologies Used

- Python (Pandas, Matplotlib)
- MongoDB
- Google Apps Script
- Airflow for scheduling

## Features

- Data collection from multiple APIs and databases
- Automated data cleaning and transformation
- Dynamic report generation with charts and KPIs
- Scheduled delivery via email
- Web dashboard for historical reports

## Results

This system saved approximately 15 hours of manual work weekly and improved decision-making through timely data delivery.
          `,
          coverImage: '/assets/projects/automated-reporting.jpg',
          githubUrl: 'https://github.com/taraprasad/automated-reporting',
          demoUrl: 'https://example.com/demo/automated-reporting',
          featured: true,
          tags: ['Automation', 'Python', 'MongoDB'],
          order: 1,
        },
        {
          title: 'Deep Learning Classification System',
          slug: 'deep-learning-classification',
          description: 'A deep learning system that classifies customer feedback into various categories using TensorFlow and natural language processing.',
          content: `
# Deep Learning Classification System

## Overview

This system analyzes customer feedback from various channels and automatically categorizes it into different sentiment and topic categories using deep learning techniques.

## Technologies Used

- Python
- TensorFlow
- NLTK
- FastAPI for serving the model

## Features

- Multi-class text classification
- Sentiment analysis
- Topic modeling
- REST API for integration with other systems
- Continuous training with new data

## Results

Achieved 92% classification accuracy and reduced manual review time by 75%.
          `,
          coverImage: '/assets/projects/dl-classification.jpg',
          githubUrl: 'https://github.com/taraprasad/dl-classification',
          demoUrl: 'https://example.com/demo/dl-classification',
          featured: true,
          tags: ['ML', 'TensorFlow', 'NLP'],
          order: 2,
        },
        {
          title: 'Data Visualization Dashboard',
          slug: 'data-visualization-dashboard',
          description: 'An interactive dashboard for visualizing complex data sets, built with React, D3.js, and a Flask backend.',
          content: `
# Data Visualization Dashboard

## Overview

This interactive dashboard provides real-time visualizations of complex datasets, allowing users to filter, drill down, and export insights.

## Technologies Used

- React
- D3.js
- Flask
- PostgreSQL
- Redis for caching

## Features

- Interactive charts and graphs
- Real-time data updates
- Customizable filters and views
- Export capabilities (PDF, CSV, Excel)
- Responsive design for mobile and desktop

## Results

The dashboard is used daily by over 50 team members and has become a critical tool for business intelligence.
          `,
          coverImage: '/assets/projects/data-viz-dashboard.jpg',
          githubUrl: 'https://github.com/taraprasad/data-viz-dashboard',
          demoUrl: 'https://example.com/demo/data-viz-dashboard',
          featured: true,
          tags: ['Dashboard', 'D3.js', 'React'],
          order: 3,
        },
      ],
    });
    
    console.log('Projects created');
  }
  
  // Create certificates
  const certificatesExist = await prisma.certificate.findFirst();
  
  if (!certificatesExist) {
    await prisma.certificate.createMany({
      data: [
        {
          name: 'Data Scientist Professional Certification',
          issuer: 'DataCamp',
          issueDate: new Date('2021-06-15'),
          credentialId: 'DSP-12345',
          credentialUrl: 'https://www.datacamp.com/certificate/DSP-12345',
          description: 'Comprehensive certification covering machine learning, statistical analysis, and data visualization.',
          image: '/assets/certificates/datacamp.jpg',
          order: 1,
        },
        {
          name: 'TensorFlow Developer Certificate',
          issuer: 'Google',
          issueDate: new Date('2022-02-10'),
          credentialId: 'TF-67890',
          credentialUrl: 'https://www.tensorflow.org/certificate/TF-67890',
          description: 'Professional certification for building and deploying machine learning models with TensorFlow.',
          image: '/assets/certificates/tensorflow.jpg',
          order: 2,
        },
        {
          name: 'Advanced SQL for Data Analysis',
          issuer: 'Kaggle',
          issueDate: new Date('2020-11-05'),
          credentialId: 'SQL-24680',
          credentialUrl: 'https://www.kaggle.com/certificate/SQL-24680',
          description: 'Advanced SQL techniques for complex data analysis and database optimization.',
          image: '/assets/certificates/sql.jpg',
          order: 3,
        },
      ],
    });
    
    console.log('Certificates created');
  }
  
  // Create blog posts
  const postsExist = await prisma.post.findFirst();
  
  if (!postsExist) {
    await prisma.post.createMany({
      data: [
        {
          title: 'Introduction to Data Visualization with D3.js',
          slug: 'intro-to-d3js',
          excerpt: 'Learn the basics of creating interactive data visualizations using D3.js, the powerful JavaScript library.',
          content: `
# Introduction to Data Visualization with D3.js

Data visualization is essential for understanding complex datasets and communicating insights effectively. D3.js (Data-Driven Documents) is a powerful JavaScript library that allows you to create custom, interactive visualizations in the web browser.

## Why D3.js?

Unlike other visualization libraries that provide pre-built chart types, D3 gives you complete control over your visualizations. This flexibility makes it perfect for creating custom, interactive visualizations that precisely match your needs.

## Getting Started

First, include D3 in your project:

\`\`\`html
<script src="https://d3js.org/d3.v7.min.js"></script>
\`\`\`

Or install via npm:

\`\`\`bash
npm install d3
\`\`\`

## Basic Example: Creating a Bar Chart

Here's a simple example of creating a bar chart with D3:

\`\`\`javascript
// Sample data
const data = [5, 10, 15, 20, 25];

// Create SVG container
const svg = d3.select("body")
  .append("svg")
  .attr("width", 400)
  .attr("height", 200);

// Create bars
svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d, i) => i * 70)
  .attr("y", (d) => 200 - d * 4)
  .attr("width", 65)
  .attr("height", (d) => d * 4)
  .attr("fill", "steelblue");
\`\`\`

## Key Concepts in D3.js

### Selections

D3 uses CSS-style selectors to select DOM elements. For example:

\`\`\`javascript
d3.select("body") // Selects the first body element
d3.selectAll("p") // Selects all paragraph elements
\`\`\`

### Data Binding

D3's data binding connects your data to DOM elements:

\`\`\`javascript
const paragraphs = d3.selectAll("p")
  .data([10, 20, 30])
  .text(d => d); // Sets each paragraph's text to its corresponding data value
\`\`\`

### Enter and Exit Selections

The \`enter()\` selection deals with data items that don't have corresponding DOM elements yet, while \`exit()\` handles elements that no longer have data.

## Conclusion

D3.js offers incredible flexibility for creating custom data visualizations. While it has a steeper learning curve than some alternatives, the control it provides makes it worth the effort for complex or unique visualization needs.

In future posts, I'll explore more advanced D3 techniques and showcase some interactive examples.
          `,
          coverImage: '/assets/blog/d3js.jpg',
          tags: ['Data Visualization', 'JavaScript', 'D3.js', 'Web Development'],
          published: true,
          views: 345,
        },
        {
          title: 'Machine Learning Techniques for Time Series Analysis',
          slug: 'ml-for-time-series',
          excerpt: 'Explore various machine learning approaches to analyze and forecast time series data with practical examples.',
          content: `
# Machine Learning Techniques for Time Series Analysis

Time series analysis is a critical component of many data science applications, from financial forecasting to IoT sensor data analysis. In this post, we'll explore how machine learning can be applied to time series data.

## Traditional vs. Machine Learning Approaches

Traditionally, time series analysis relied on statistical methods like ARIMA (AutoRegressive Integrated Moving Average). While these methods work well for many problems, machine learning approaches can capture more complex patterns and incorporate additional features.

## Feature Engineering for Time Series

Before applying machine learning to time series data, consider these feature engineering techniques:

1. **Lag Features**: Include previous values as features
2. **Rolling Statistics**: Add moving averages, standard deviations, etc.
3. **Seasonality Features**: Extract hour of day, day of week, month, etc.
4. **Fourier Features**: Transform seasonal patterns using sine and cosine components

## Machine Learning Models for Time Series

### Linear Models

Simple but effective for many problems:

\`\`\`python
from sklearn.linear_model import LinearRegression

# X contains lag features and other engineered features
# y contains the target values
model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)
\`\`\`

### Random Forests and Gradient Boosting

These ensemble methods often perform well on time series:

\`\`\`python
from sklearn.ensemble import RandomForestRegressor

model = RandomForestRegressor(n_estimators=100)
model.fit(X_train, y_train)
\`\`\`

### LSTM Networks

Long Short-Term Memory networks excel at capturing long-term dependencies:

\`\`\`python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

model = Sequential([
    LSTM(50, return_sequences=True, input_shape=(lookback, features)),
    LSTM(50),
    Dense(1)
])
model.compile(optimizer='adam', loss='mse')
model.fit(X_train, y_train, epochs=10, batch_size=32)
\`\`\`

## Evaluating Time Series Models

When evaluating time series models, consider these metrics:

- **RMSE**: Root Mean Square Error
- **MAPE**: Mean Absolute Percentage Error
- **SMAPE**: Symmetric Mean Absolute Percentage Error
- **Direction Accuracy**: Percentage of correct direction predictions

Also, use techniques like walk-forward validation to properly evaluate your model.

## Case Study: Forecasting Store Sales

In a recent project, I needed to forecast daily sales for a retail chain. By combining XGBoost with carefully engineered features, including:

- Lag features (previous 7, 14, and 28 days)
- Day of week, month, and holiday indicators
- Rolling 7-day statistics

The model achieved a 12% improvement over the previous forecasting system.

## Conclusion

Machine learning provides powerful tools for time series analysis, but success depends on thoughtful feature engineering and proper validation techniques. Start with simpler models before moving to more complex ones, and always consider the specific characteristics of your time series data.

In future posts, we'll explore specific algorithms in more detail and share code for implementing an end-to-end forecasting system.
          `,
          coverImage: '/assets/blog/time-series.jpg',
          tags: ['Machine Learning', 'Time Series', 'Forecasting', 'Python'],
          published: true,
          views: 212,
        },
        {
          title: 'Automating Data Pipelines with Python',
          slug: 'automating-data-pipelines',
          excerpt: 'Learn how to build robust, automated data pipelines with Python that save time and reduce errors in your data workflows.',
          content: `
# Automating Data Pipelines with Python

Data pipelines are the backbone of modern data analysis workflows. They handle the extraction, transformation, and loading (ETL) of data, ensuring that your analysis always uses fresh, properly processed data. In this post, we'll explore how to build automated data pipelines using Python.

## Why Automate Your Data Pipelines?

- **Consistency**: Eliminate human error in data preparation
- **Time Savings**: Free up valuable analyst time for higher-level tasks
- **Scalability**: Handle growing data volumes without proportional effort
- **Reproducibility**: Ensure consistent processing across different datasets

## Key Components of a Data Pipeline

### 1. Data Extraction

Extract data from various sources like databases, APIs, or files:

\`\`\`python
import pandas as pd
import requests

# Extract from API
def extract_from_api(api_url, headers=None):
    response = requests.get(api_url, headers=headers)
    response.raise_for_status()  # Raise exception for 4XX/5XX responses
    return response.json()

# Extract from database
def extract_from_db(query, connection):
    return pd.read_sql(query, connection)
\`\`\`

### 2. Data Transformation

Clean, validate, and transform the data:

\`\`\`python
def transform_data(data):
    # Convert to DataFrame if not already
    if not isinstance(data, pd.DataFrame):
        df = pd.DataFrame(data)
    else:
        df = data.copy()
    
    # Basic cleaning
    df = df.dropna(subset=['critical_field'])
    
    # Type conversions
    df['date'] = pd.to_datetime(df['date'])
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
    
    # Feature engineering
    df['year_month'] = df['date'].dt.strftime('%Y-%m')
    
    return df
\`\`\`

### 3. Data Loading

Save the processed data to its destination:

\`\`\`python
def load_data(df, destination_type, destination):
    if destination_type == 'csv':
        df.to_csv(destination, index=False)
    elif destination_type == 'database':
        df.to_sql(destination['table_name'], destination['connection'], 
                  if_exists='replace', index=False)
    elif destination_type == 'api':
        # Custom API posting logic here
        pass
\`\`\`

## Orchestrating the Pipeline

While you can start with simple scripts, as your pipelines grow in complexity, consider using a workflow orchestration tool like Apache Airflow:

\`\`\`python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'data_team',
    'depends_on_past': False,
    'start_date': datetime(2023, 1, 1),
    'email_on_failure': True,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'daily_sales_pipeline',
    default_args=default_args,
    description='Daily sales data processing',
    schedule_interval='0 1 * * *',  # Run at 1 AM every day
)

extract_task = PythonOperator(
    task_id='extract_sales_data',
    python_callable=extract_from_api,
    op_kwargs={'api_url': 'https://api.example.com/sales'},
    dag=dag,
)

transform_task = PythonOperator(
    task_id='transform_sales_data',
    python_callable=transform_data,
    dag=dag,
)

load_task = PythonOperator(
    task_id='load_sales_data',
    python_callable=load_data,
    op_kwargs={'destination_type': 'database'},
    dag=dag,
)

extract_task >> transform_task >> load_task
\`\`\`

## Error Handling and Monitoring

Robust pipelines need proper error handling and monitoring:

\`\`\`python
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    filename=f'pipeline_{datetime.now().strftime("%Y%m%d")}.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def run_pipeline(extract_func, transform_func, load_func, **kwargs):
    try:
        logging.info("Pipeline started")
        
        # Extract
        logging.info("Extraction started")
        raw_data = extract_func(**kwargs.get('extract_args', {}))
        logging.info(f"Extraction complete: {len(raw_data)} records")
        
        # Transform
        logging.info("Transformation started")
        transformed_data = transform_func(raw_data, **kwargs.get('transform_args', {}))
        logging.info(f"Transformation complete: {transformed_data.shape}")
        
        # Load
        logging.info("Loading started")
        load_func(transformed_data, **kwargs.get('load_args', {}))
        logging.info("Loading complete")
        
        logging.info("Pipeline completed successfully")
        return True
        
    except Exception as e:
        logging.error(f"Pipeline failed: {str(e)}", exc_info=True)
        # Send alert or notification here
        return False
\`\`\`

## Real-World Example: Daily Sales Report Pipeline

Here's a simplified version of a pipeline I built to automate daily sales reporting:

1. Extract sales data from the company database
2. Fetch weather data from an API (as it affects sales)
3. Join and transform the data
4. Generate summary statistics and visualizations
5. Export to an Excel report
6. Email the report to stakeholders

The automation saved about 3 hours of manual work daily and eliminated reporting errors.

## Conclusion

Automating data pipelines with Python can dramatically improve the efficiency and reliability of your data workflows. Start with simple scripts, add proper error handling, and consider workflow orchestration tools as complexity grows.

In future posts, I'll dive deeper into advanced pipeline techniques and share more detailed case studies from my work.
          `,
          coverImage: '/assets/blog/data-pipeline.jpg',
          tags: ['Automation', 'Python', 'ETL', 'Data Engineering'],
          published: true,
          views: 178,
        },
      ],
    });
    
    console.log('Blog posts created');
  }
  
  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
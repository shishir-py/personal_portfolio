# Tara Prasad Pandey - Portfolio Website

A full-stack professional portfolio website for Tara Prasad Pandey, a Data Analyst from Nepal, built with Next.js, TypeScript, Tailwind CSS, Prisma, and MongoDB.

## Features

- **Modern, Responsive Design**: Tailwind CSS with dark mode support
- **Dynamic Admin Panel**: Complete CRUD functionality
- **Authentication**: JWT-based admin login
- **Blog**: Markdown editor for creating and managing blog posts
- **Projects Showcase**: Display and filter projects with images, GitHub links, and descriptions
- **Certificates and Education**: Manage professional certifications and education history
- **Data Visualization**: Interactive charts showcasing skills and analytics
- **Contact Form**: Email integration for receiving messages
- **SEO Optimized**: Metadata and structured data for better search engine visibility
- **Nepali Flag Animation**: Representing cultural identity

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT with jose library
- **File Storage**: Local filesystem / Cloudinary
- **Deployment**: Docker ready, deployable to Vercel or Render

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tara-prasad-portfolio.git
cd tara-prasad-portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit the `.env.local` file with your MongoDB connection string and other configuration values.

4. Set up the database:

```bash
npx prisma db push
```

5. Seed the database with initial data (optional):

```bash
npm run seed
```

6. Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to see the website.

## Admin Panel

The admin panel is accessible at `/admin/login`. Use the following credentials for the first login:

- Email: admin@example.com
- Password: admin123

**Important**: Change these credentials immediately after the first login.

## Project Structure

```
├── public/             # Static assets
├── prisma/             # Database schema and migrations
├── src/                # Source code
│   ├── app/            # Next.js App Router
│   │   ├── admin/      # Admin panel routes
│   │   ├── api/        # API routes
│   │   └── ...         # Public-facing pages
│   ├── components/     # React components
│   ├── lib/            # Utility functions
│   └── styles/         # Global styles
├── .env.example        # Example environment variables
└── ...                 # Configuration files
```

## Deployment

### Vercel

The easiest way to deploy this application is with Vercel:

```bash
npm install -g vercel
vercel
```

### Docker

Build and run with Docker:

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Design inspiration from various portfolio websites
- Icons from React-Icons
- Animation powered by Framer Motion

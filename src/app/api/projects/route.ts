import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// Function to get mock data
function getMockData() {
  try {
    const mockDataPath = path.join(process.cwd(), 'mock-data.json');
    if (fs.existsSync(mockDataPath)) {
      const data = fs.readFileSync(mockDataPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('Could not load mock data:', error);
  }
  return null;
}

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    let projects;

    // Build where clause
    const where: any = {};

    // Filter by featured status if requested
    if (featured === 'true') {
      where.featured = true;
    }

    // Fetch projects with filters
    projects = await prisma.project.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      // Apply limit if provided
      ...(limit ? { take: parseInt(limit) } : {}),
      include: {
        _count: {
          select: { comments: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message || 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      title,
      description,
      content,
      coverImage,
      githubUrl,
      demoUrl,
      featured,
      tags,
      order
    } = body;

    // Validate required fields
    if (!title || !description || !content) {
      return NextResponse.json(
        { success: false, message: 'Title, description, and content are required' },
        { status: 400 }
      );
    }

    // Generate slug from title (with unique suffix if needed)
    let slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug }
    });

    // If slug exists, add a unique timestamp
    if (existingProject) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create new project
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        content,
        coverImage,
        githubUrl,
        demoUrl,
        featured: featured || false,
        tags: tags || [],
        order: order || 0
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create project' },
      { status: 500 }
    );
  }
}
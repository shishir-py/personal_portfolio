import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ProjectSlugParams {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: ProjectSlugParams) {
  try {
    const { slug } = params;
    
    // Validate slug
    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Project slug is required' },
        { status: 400 }
      );
    }
    
    // Fetch project by slug
    const project = await prisma.project.findUnique({
      where: { slug }
    });
    
    // Check if project exists
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Increment view count here if needed
    
    return NextResponse.json({ 
      success: true, 
      project 
    });
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
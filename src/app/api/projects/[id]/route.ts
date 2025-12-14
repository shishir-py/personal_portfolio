import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

interface ProjectParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: ProjectParams) {
  try {
    const { id } = params;
    
    // Validate ID
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch project by ID
    const project = await prisma.project.findUnique({
      where: { id }
    });
    
    // Check if project exists
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      project 
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: ProjectParams) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message || 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // Validate ID
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    });
    
    if (!existingProject) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
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
    
    // Prepare update data
    let updateData: any = {
      title,
      description,
      content,
      updatedAt: new Date()
    };
    
    // Only update slug if title has changed
    if (title !== existingProject.title) {
      let slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      // Check if new slug already exists (and is not the current project)
      const slugExists = await prisma.project.findFirst({
        where: { 
          slug,
          id: { not: id }
        }
      });
      
      // If slug exists, add a unique timestamp
      if (slugExists) {
        slug = `${slug}-${Date.now()}`;
      }
      
      updateData.slug = slug;
    }
    
    // Add optional fields if provided
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (demoUrl !== undefined) updateData.demoUrl = demoUrl;
    if (featured !== undefined) updateData.featured = featured;
    if (tags !== undefined) updateData.tags = tags;
    if (order !== undefined) updateData.order = order;
    
    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData
    });
    
    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: ProjectParams) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message || 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // Validate ID
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    });
    
    if (!existingProject) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Delete project
    await prisma.project.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
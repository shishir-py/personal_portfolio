import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Build where clause
    const where: any = {};
    
    // Filter by category if requested
    if (category) {
      where.category = {
        equals: category,
        mode: 'insensitive'
      };
    }
    
    // Fetch skills with filters
    const skills = await prisma.skill.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        { level: 'desc' }
      ]
    });
    
    return NextResponse.json({ 
      success: true, 
      skills 
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, proficiency, level } = body;

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { success: false, message: 'Name and category are required' },
        { status: 400 }
      );
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        level: level || proficiency || 50,
        order: 0
      }
    });

    return NextResponse.json({ success: true, skill }, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ success: false, message: 'Failed to create skill' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, category, proficiency, level } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Skill ID is required' }, { status: 400 });
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...((level !== undefined || proficiency !== undefined) && { level: level || proficiency })
      }
    });

    return NextResponse.json({ success: true, skill });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json({ success: false, message: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Skill ID is required' }, { status: 400 });
    }

    await prisma.skill.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete skill' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: [
        { current: 'desc' }, // Current first
        { endDate: 'desc' }, // Then by end date descending
        { startDate: 'desc' }
      ]
    });
    
    return NextResponse.json({ success: true, experience });
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch experience' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, company, location, startDate, endDate, current, description } = data;

    if (!title || !company) {
      return NextResponse.json(
        { success: false, message: 'Job title and company are required' },
        { status: 400 }
      );
    }

    const experience = await prisma.experience.create({
      data: {
        title,
        company,
        location: location || '',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current: current || false,
        description: description || '',
        order: 0
      }
    });

    return NextResponse.json({ success: true, experience }, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json({ success: false, message: 'Failed to create experience' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, title, company, location, startDate, endDate, current, description } = data;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Experience ID is required' }, { status: 400 });
    }

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(company && { company }),
        ...(location !== undefined && { location }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(current !== undefined && { current }),
        ...(description !== undefined && { description })
      }
    });

    return NextResponse.json({ success: true, experience });
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json({ success: false, message: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Experience ID is required' }, { status: 400 });
    }

    await prisma.experience.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete experience' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const education = await prisma.education.findMany({
      orderBy: [
        { current: 'desc' }, // Current first
        { endDate: 'desc' }, // Then by end date descending
        { startDate: 'desc' }
      ]
    });
    
    return NextResponse.json({ success: true, education });
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { institution, degree, field, location, startDate, endDate, current, description } = data;

    if (!institution || !degree) {
      return NextResponse.json(
        { success: false, message: 'Institution and degree are required' },
        { status: 400 }
      );
    }

    const education = await prisma.education.create({
      data: {
        institution,
        degree,
        field: field || '',
        location: location || '',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current: current || false,
        description: description || '',
        order: 0
      }
    });

    return NextResponse.json({ success: true, education }, { status: 201 });
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json({ success: false, message: 'Failed to create education' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, institution, degree, field, location, startDate, endDate, current, description } = data;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Education ID is required' }, { status: 400 });
    }

    const education = await prisma.education.update({
      where: { id },
      data: {
        ...(institution && { institution }),
        ...(degree && { degree }),
        ...(field !== undefined && { field }),
        ...(location !== undefined && { location }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(current !== undefined && { current }),
        ...(description !== undefined && { description })
      }
    });

    return NextResponse.json({ success: true, education });
  } catch (error) {
    console.error('Error updating education:', error);
    return NextResponse.json({ success: false, message: 'Failed to update education' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Education ID is required' }, { status: 400 });
    }

    await prisma.education.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete education' }, { status: 500 });
  }
}
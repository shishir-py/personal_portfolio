import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: [
        { issueDate: 'desc' },
        { order: 'asc' }
      ]
    });
    
    return NextResponse.json({ success: true, certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch certificates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, issuer, issueDate, expiryDate, credentialId, credentialUrl, description, image } = data;

    if (!name || !issuer) {
      return NextResponse.json(
        { success: false, message: 'Certificate name and issuer are required' },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.create({
      data: {
        name,
        issuer,
        issueDate: new Date(issueDate || new Date()),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialId: credentialId || null,
        credentialUrl: credentialUrl || null,
        description: description || null,
        image: image || null,
        order: 0
      }
    });

    return NextResponse.json({ success: true, certificate }, { status: 201 });
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json({ success: false, message: 'Failed to create certificate' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, name, issuer, issueDate, expiryDate, credentialId, credentialUrl, description, image } = data;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Certificate ID is required' }, { status: 400 });
    }

    const certificate = await prisma.certificate.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(issuer && { issuer }),
        ...(issueDate && { issueDate: new Date(issueDate) }),
        ...(expiryDate !== undefined && { expiryDate: expiryDate ? new Date(expiryDate) : null }),
        ...(credentialId !== undefined && { credentialId }),
        ...(credentialUrl !== undefined && { credentialUrl }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image })
      }
    });

    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    console.error('Error updating certificate:', error);
    return NextResponse.json({ success: false, message: 'Failed to update certificate' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Certificate ID is required' }, { status: 400 });
    }

    await prisma.certificate.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete certificate' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get profile from database or create default one
    let profile = await prisma.profile.findFirst();
    
    if (!profile) {
      // Create default profile if none exists
      profile = await prisma.profile.create({
        data: {
          fullName: 'Tara Prasad Pandey',
          title: 'Senior Data Scientist & AI Engineer',
          bio: 'Passionate data scientist with 5+ years of experience in machine learning, artificial intelligence, and data analytics. Skilled in Python, R, TensorFlow, and cloud platforms.',
          shortBio: 'Data Scientist & AI Engineer with expertise in ML and analytics',
          location: 'San Francisco, CA',
          email: 'tara.prasad@example.com',
          phone: '+1 (555) 123-4567',
          profilePic: '/1000079466.jpg',
          resume: '/tara_prasad_cv.pdf',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/taraprasad',
            github: 'https://github.com/taraprasad',
            twitter: 'https://twitter.com/taraprasad'
          }
        }
      });
    }
    
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get request body
    const data = await request.json();
    
    // Get current profile from database
    let profile = await prisma.profile.findFirst();
    
    if (!profile) {
      // Create new profile if none exists
      profile = await prisma.profile.create({
        data: {
          fullName: data.fullName || 'Tara Prasad Pandey',
          title: data.title || 'Senior Data Scientist & AI Engineer',
          bio: data.bio || 'Passionate data scientist with expertise in ML and analytics.',
          shortBio: data.shortBio || 'Data Scientist & AI Engineer',
          location: data.location || 'San Francisco, CA',
          email: data.email || 'tara.prasad@example.com',
          phone: data.phone,
          profilePic: data.profilePic || '/1000079466.jpg',
          resume: data.resume || '/tara_prasad_cv.pdf',
          socialLinks: data.socialLinks || {}
        }
      });
    } else {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: {
          ...(data.fullName && { fullName: data.fullName }),
          ...(data.title && { title: data.title }),
          ...(data.bio && { bio: data.bio }),
          ...(data.shortBio && { shortBio: data.shortBio }),
          ...(data.location && { location: data.location }),
          ...(data.email && { email: data.email }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.profilePic && { profilePic: data.profilePic }),
          ...(data.resume && { resume: data.resume }),
          ...(data.socialLinks && { socialLinks: data.socialLinks })
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      profile: profile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
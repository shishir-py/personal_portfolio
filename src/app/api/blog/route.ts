import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    const where: any = {};
    if (published === 'true') {
      where.published = true;
    } else if (published === 'false') {
      where.published = false;
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: [
        { createdAt: 'desc' }
      ],
      include: {
        _count: {
          select: { comments: true }
        }
      }
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, slug, excerpt, content, coverImage, tags, published } = data;

    if (!title || !slug) {
      return NextResponse.json(
        { success: false, message: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug }
    });

    if (existingPost) {
      return NextResponse.json(
        { success: false, message: 'Slug already exists' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content: content || '',
        coverImage: coverImage || null,
        tags: tags || [],
        published: published || false,
        views: 0
      }
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ success: false, message: 'Failed to create post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, title, slug, excerpt, content, coverImage, tags, published } = data;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Post ID is required' }, { status: 400 });
    }

    // Check if slug already exists for different post
    if (slug) {
      const existingPost = await prisma.post.findUnique({
        where: { slug }
      });

      if (existingPost && existingPost.id !== id) {
        return NextResponse.json(
          { success: false, message: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(tags && { tags }),
        ...(published !== undefined && { published })
      }
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ success: false, message: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Post ID is required' }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete post' }, { status: 500 });
  }
}
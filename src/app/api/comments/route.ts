import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const postId = searchParams.get('postId');

        // Allow fetching all comments if 'all' param is present or if we want to support it by default
        // For admin panel, we want to fetch all.

        const where: any = {};
        if (projectId) where.projectId = projectId;
        if (postId) where.postId = postId;

        // If neither is provided, it returns all comments (which is what we want for admin)
        // Previous code blocked this.

        const comments = await prisma.comment.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                project: { select: { title: true, slug: true } },
                post: { select: { title: true, slug: true } }
            }
        });

        return NextResponse.json({ success: true, comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, author, projectId, postId } = body;

        if (!content) {
            return NextResponse.json(
                { success: false, message: 'Content is required' },
                { status: 400 }
            );
        }

        if (!projectId && !postId) {
            return NextResponse.json(
                { success: false, message: 'Project ID or Post ID is required' },
                { status: 400 }
            );
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                author: author || 'Anonymous',
                projectId,
                postId
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Comment added successfully',
            comment
        }, { status: 201 });
    } catch (error) {
        console.error('Error adding comment:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to add comment' },
            { status: 500 }
        );
    }
}

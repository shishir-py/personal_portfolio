import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
    params: {
        id: string;
    };
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Comment ID is required' },
                { status: 400 }
            );
        }

        await prisma.comment.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete comment' },
            { status: 500 }
        );
    }
}

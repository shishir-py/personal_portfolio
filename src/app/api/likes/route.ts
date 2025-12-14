import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, id, action } = body;

        if (!id || !type) {
            return NextResponse.json(
                { success: false, message: 'ID and type are required' },
                { status: 400 }
            );
        }

        const incrementValue = action === 'unlike' ? -1 : 1;

        let updatedItem;

        if (type === 'project') {
            updatedItem = await prisma.project.update({
                where: { id },
                data: { likes: { increment: incrementValue } }
            });
        } else if (type === 'post') {
            updatedItem = await prisma.post.update({
                where: { id },
                data: { likes: { increment: incrementValue } }
            });
        } else {
            return NextResponse.json(
                { success: false, message: 'Invalid type' },
                { status: 400 }
            );
        }

        // Ensure likes don't go below 0 (though Prisma increment handles negative, we might want to clamp in DB or app logic if strict)
        // For simplicity, we assume the frontend logic + DB consistency is enough for now. 
        // Ideally, we'd have a check, but Prisma `increment: -1` is valid.

        return NextResponse.json({
            success: true,
            likes: updatedItem.likes
        });
    } catch (error) {
        console.error('Error updating likes:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update likes' },
            { status: 500 }
        );
    }
}

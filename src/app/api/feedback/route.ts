import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message, email, rating } = body;

        if (!message) {
            return NextResponse.json(
                { success: false, message: 'Message is required' },
                { status: 400 }
            );
        }

        const feedback = await prisma.feedback.create({
            data: {
                message,
                email,
                rating: rating || 0
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Feedback submitted successfully',
            feedback
        }, { status: 201 });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to submit feedback' },
            { status: 500 }
        );
    }
}

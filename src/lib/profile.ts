import { prisma } from '@/lib/prisma';
import { Profile } from '@prisma/client';

export async function getProfile() {
    try {
        const profile = await prisma.profile.findFirst();
        return profile;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}

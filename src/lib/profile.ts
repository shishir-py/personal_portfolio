import { prisma } from '@/lib/prisma';
import { Profile } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';

export async function getProfile() {
    noStore(); // Opt out of caching for this function
    try {
        const profile = await prisma.profile.findFirst();
        return profile;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}

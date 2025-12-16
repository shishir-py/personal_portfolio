'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Profile } from '@prisma/client';

// Default fallback data if no profile exists
const defaultProfile: Partial<Profile> = {
    fullName: 'Tara Prasad Pandey',
    title: 'Data Scientist & ML Engineer',
    email: 'tara.prasad@example.com',
    location: 'Kathmandu, Nepal',
    bio: 'Expert Data Scientist and Machine Learning Engineer',
    socialLinks: {}
};

const ProfileContext = createContext<Profile | null>(null);

export function ProfileProvider({
    children,
    profile
}: {
    children: ReactNode,
    profile: Profile | null
}) {
    return (
        <ProfileContext.Provider value={profile}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    // Return context or default data to prevent crashes if context is missing,
    // though optimally it should always be provided.
    return context || defaultProfile as Profile;
}

'use server';

import { revalidatePath } from 'next/cache';

/**
 * Revalidate multiple paths after admin updates
 * This ensures public pages and API routes get fresh data
 */
export async function revalidateAdminChanges(resource: string) {
  console.log(`🔄 Revalidating ${resource}...`);

  const pathsToRevalidate: Record<string, string[]> = {
    blog: ['/blog', '/admin/blog', '/api/blog'],
    projects: ['/projects', '/admin/projects', '/api/projects'],
    skills: ['/admin/skills', '/api/skills'],
    profile: ['/', '/about', '/admin/profile', '/api/profile'],
    education: ['/admin/education', '/api/education'],
    experience: ['/admin/experience', '/api/experience'],
    certificates: ['/admin/certificates', '/api/certificates'],
  };

  const paths = pathsToRevalidate[resource] || [];
  
  for (const path of paths) {
    revalidatePath(path);
    console.log(`  ✓ Revalidated: ${path}`);
  }

  // Also revalidate the root
  revalidatePath('/', 'layout');
}

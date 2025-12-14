'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaClock } from 'react-icons/fa';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { formatDistanceToNow } from 'date-fns';
import { LikeButton } from '@/components/LikeButton';
import { CommentSection } from '@/components/CommentSection';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage?: string;
  githubUrl?: string;
  demoUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes?: number;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/slug/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Project not found');
          }
          throw new Error('Failed to fetch project');
        }

        const data = await response.json();
        setProject(data.project);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching the project');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
      return 'Unknown date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-900/20 border border-red-500 text-red-300 px-6 py-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || 'Project not found'}</p>
        </div>
        <button
          onClick={() => router.push('/projects')}
          className="mt-8 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md inline-flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <Link
        href="/projects"
        className="inline-flex items-center text-gray-400 hover:text-white mb-8"
      >
        <FaArrowLeft className="mr-2" /> Back to all projects
      </Link>

      <FadeInSection>
        {/* Hero section */}
        <div className="mb-12">
          {project.coverImage && (
            <div className="w-full h-80 sm:h-96 relative rounded-xl overflow-hidden mb-8">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              {project.title}
            </h1>
            <LikeButton id={project.id} initialLikes={project.likes || 0} type="project" />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map(tag => (
              <span
                key={`${project.id}-${tag}`}
                className="bg-dark-100 text-sm font-medium text-gray-300 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-6">
            {project.updatedAt && (
              <div className="flex items-center">
                <FaClock className="mr-2" />
                <span>Updated {formatDate(project.updatedAt)}</span>
              </div>
            )}

            <div className="flex space-x-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-white"
                >
                  <FaGithub className="mr-2" /> GitHub Repository
                </a>
              )}

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-white"
                >
                  <FaExternalLinkAlt className="mr-2" /> Live Demo
                </a>
              )}
            </div>
          </div>

          <p className="text-xl text-gray-300 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Project content */}
        <div className="prose prose-invert prose-lg max-w-none mb-16">
          <div dangerouslySetInnerHTML={{ __html: project.content }} />
        </div>

        {/* Comments */}
        <CommentSection projectId={project.id} />
      </FadeInSection>

      <div className="mt-16 pt-8 border-t border-gray-800">
        <Link
          href="/projects"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md inline-flex items-center"
        >
          <FaArrowLeft className="mr-2" /> View all projects
        </Link>
      </div>
    </div>
  );
}
'use client';

import { useParams } from 'next/navigation';
import ProjectForm from '@/components/admin/ProjectForm';

export default function EditProjectPage() {
  const { id } = useParams();
  const projectId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';
  
  return <ProjectForm projectId={projectId} />;
}
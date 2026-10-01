import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTopicBySlug, getTopicSlugs } from '../../../lib/content';
import TopicPage from '../../../components/TopicPage';

export function generateStaticParams() {
  return getTopicSlugs('projects').map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicBySlug('projects', slug);
  return { title: topic ? `${topic.title} — Aaron Davis` : 'Project not found' };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopicBySlug('projects', slug);
  if (!topic) notFound();

  return (
    <TopicPage
      backHref="/projects"
      backLabel="Projects"
      title={topic.title}
      date={topic.date}
      status={topic.status}
      role={topic.role}
      obsidianUri={topic.obsidianUri}
      contentHtml={topic.contentHtml}
    />
  );
}

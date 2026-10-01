import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTopicBySlug, getTopicSlugs } from '../../../lib/content';
import TopicPage from '../../../components/TopicPage';

export function generateStaticParams() {
  return getTopicSlugs('research').map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicBySlug('research', slug);
  return { title: topic ? `${topic.title} — Aaron Davis` : 'Research topic not found' };
}

export default async function ResearchTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopicBySlug('research', slug);
  if (!topic) notFound();

  return (
    <TopicPage
      backHref="/research"
      backLabel="Research"
      title={topic.title}
      date={topic.date}
      tags={topic.tags}
      github={topic.github}
      obsidianUri={topic.obsidianUri}
      contentHtml={topic.contentHtml}
    />
  );
}

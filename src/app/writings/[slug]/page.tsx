import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTopicBySlug, getTopicSlugs } from '../../../lib/content';
import TopicPage from '../../../components/TopicPage';

export function generateStaticParams() {
  return getTopicSlugs('writings').map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicBySlug('writings', slug);
  return { title: topic ? `${topic.title} — Aaron Davis` : 'Writing not found' };
}

export default async function WritingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopicBySlug('writings', slug);
  if (!topic) notFound();

  return (
    <TopicPage
      backHref="/writings"
      backLabel="Writings"
      title={topic.title}
      date={topic.date}
      obsidianUri={topic.obsidianUri}
      contentHtml={topic.contentHtml}
    />
  );
}

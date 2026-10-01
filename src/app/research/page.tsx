// Machine Learning Research — list page. Content lives in
// content/research/*.md; add a Markdown file there to add a topic (see
// lib/content.ts for the frontmatter fields). The search/tag filtering
// below needs client-side state, so it lives in TopicSearchGrid — this file
// stays a server component so it can read the filesystem directly.

import { getAllTopics } from '../../lib/content';
import TopicSearchGrid from '../../components/TopicSearchGrid';

export default function MachineLearningResearch() {
  const topics = getAllTopics('research');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 mb-6">
      {/* Top Section */}
      <section className="text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Research</h2>
      </section>

      <TopicSearchGrid topics={topics} basePath="/research" />
    </div>
  );
}

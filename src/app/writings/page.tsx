// Papers, class material, and short pieces on ML topics. Add a piece by
// dropping a Markdown file into content/writings/ — see lib/content.ts for
// the frontmatter fields.

import { getAllTopics } from '../../lib/content';
import TopicSearchGrid from '../../components/TopicSearchGrid';

export default function Writings() {
  const writings = getAllTopics('writings');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 mb-6">
      {/* Top Section */}
      <section className="text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Writings</h2>
      </section>

      {/* Same search bar and card grid as Projects and Research. */}
      <TopicSearchGrid topics={writings} basePath="/writings" />
    </div>
  );
}

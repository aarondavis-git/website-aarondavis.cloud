// Completed professional / client work — distinct from the ML experiments
// on the Research page. Add a finished project by dropping a Markdown file
// into content/projects/ — see lib/content.ts for the frontmatter fields.

import { getAllTopics } from '../../lib/content';
import TopicSearchGrid from '../../components/TopicSearchGrid';

export default function Projects() {
  const projects = getAllTopics('projects');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 mb-6">
      {/* Top Section */}
      <section className="text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">Projects</h2>
      </section>

      {/* Same search bar and card grid as Research and Writings. */}
      <TopicSearchGrid topics={projects} basePath="/projects" />
    </div>
  );
}

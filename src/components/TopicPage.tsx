import Link from 'next/link';
import Tag from './Tag';

type TopicPageProps = {
  backHref: string;
  backLabel: string;
  title: string;
  date?: string;
  tags?: string[];
  status?: string;
  role?: string;
  github?: string;
  obsidianUri?: string;
  contentHtml: string;
};

function formatDate(date?: string) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// Renders one topic's full Markdown note as a page — the destination for
// every card across Projects, Research and Writings. `contentHtml` is
// pre-rendered at build time from the source .md file (see lib/content.ts),
// including any LaTeX math, which is why it's injected as raw HTML here
// rather than passed as children.
export default function TopicPage({
  backHref,
  backLabel,
  title,
  date,
  tags,
  status,
  role,
  github,
  obsidianUri,
  contentHtml,
}: TopicPageProps) {
  const formattedDate = formatDate(date);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 mb-6">
      <Link href={backHref} className="inline-block mb-8 text-sm opacity-70 hover:opacity-100">
        ← {backLabel}
      </Link>

      <article className="glass rounded-[2rem] p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">{title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            {status && <Tag label={status} />}
            {tags?.map((tag) => <Tag key={tag} label={tag} />)}
            {role && (
              <span className="text-xs font-semibold uppercase tracking-wider opacity-50">
                {role}
              </span>
            )}
            {formattedDate && (
              <span className="text-xs opacity-50 ml-auto">{formattedDate}</span>
            )}
          </div>
          {(github || obsidianUri) && (
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline opacity-80 hover:opacity-100"
                >
                  View on GitHub ↗
                </a>
              )}
              {/* Only rendered when OBSIDIAN_VAULT_NAME is set (see lib/content.ts). */}
              {obsidianUri && (
                <a href={obsidianUri} className="underline opacity-80 hover:opacity-100">
                  Open in Obsidian ↗
                </a>
              )}
            </div>
          )}
        </header>

        <div
          className="prose dark:prose-invert max-w-none prose-headings:font-semibold"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </div>
  );
}

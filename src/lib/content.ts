// ---------------------------------------------------------------------
// Content pipeline for Projects / Research / Writings — backed by an
// Obsidian vault.
//
// The vault is a plain folder of Markdown notes. By default it is the
// `content/` folder in this repo (open that folder in Obsidian via
// "Open folder as vault"); set OBSIDIAN_VAULT_PATH to point somewhere else.
//
//   <vault>/projects/*.md   -> /projects/<slug>
//   <vault>/research/*.md   -> /research/<slug>
//   <vault>/writings/*.md   -> /writings/<slug>
//   <vault>/<anything else> -> ignored (daily notes, drafts, .obsidian, ...)
//
// Section folder names are matched case-insensitively, so "Projects/" works.
// Every note becomes a card on its section page, and the card links to the
// note's own page.
//
// Obsidian syntax handled here:
//   [[Note]]  [[Note|alias]]  [[Note#Heading]]  [[#Heading]]
//                          -> links to the note's page (any of the three
//                             sections; matched by filename, title or alias)
//   ![[image.png]]         -> image, served from the vault (/vault-assets/)
//   > [!note] Title        -> blockquote with a bold title
//   %% comment %%          -> removed
//   $...$ and $$...$$      -> KaTeX math (same syntax as Obsidian)
//
// Frontmatter fields (all optional except `title`):
//   title    — card + page heading
//   summary  — card preview text (falls back to an excerpt of the body)
//   date     — "YYYY-MM-DD", used to sort newest-first
//   tags     — string[] (or a single string), used for search relevance
//   aliases  — alternative names other notes can [[link]] to this one by
//   status   — short badge shown on the page (e.g. "Completed")
//   role     — small caption line (Projects)
//   github   — optional external link, shown on the topic's page
//   publish  — set to false (or draft: true) to keep a note off the site
// ---------------------------------------------------------------------

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';

export type Section = 'projects' | 'research' | 'writings';

export const SECTIONS: Section[] = ['projects', 'research', 'writings'];

export type TopicFrontmatter = {
  title: string;
  summary?: string;
  date?: string;
  tags?: string[];
  aliases?: string[];
  status?: string;
  role?: string;
  github?: string;
  publish?: boolean;
  draft?: boolean;
};

export type TopicSummary = TopicFrontmatter & {
  slug: string;
  summary: string; // always resolved (falls back to a body excerpt)
};

export type Topic = TopicSummary & {
  contentHtml: string;
  // obsidian://open link for this note, only when OBSIDIAN_VAULT_NAME is set.
  obsidianUri?: string;
};

// ---------------------------------------------------------------------
// Vault location
// ---------------------------------------------------------------------

function vaultRoot(): string {
  const configured = process.env.OBSIDIAN_VAULT_PATH?.trim();
  if (configured) return path.resolve(process.cwd(), configured);
  return path.join(process.cwd(), 'content');
}

// Finds the on-disk folder for a section, ignoring case ("Research" ==
// "research"). Returns null when the vault has no such folder yet.
function sectionDir(section: Section): string | null {
  const root = vaultRoot();
  if (!fs.existsSync(root)) return null;
  const match = fs
    .readdirSync(root, { withFileTypes: true })
    .find((d) => d.isDirectory() && d.name.toLowerCase() === section);
  return match ? path.join(root, match.name) : null;
}

// ---------------------------------------------------------------------
// Note discovery
// ---------------------------------------------------------------------

type NoteEntry = {
  section: Section;
  slug: string;
  filename: string; // e.g. "My Note.md"
  fullPath: string;
  frontmatter: TopicFrontmatter;
  body: string;
};

// "My Note (v2).md" -> "my-note-v2". Files that are already kebab-case keep
// the exact same slug, so existing URLs don't change.
function slugify(stem: string): string {
  return stem
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Obsidian's Properties editor writes unquoted dates (`date: 2024-03-01`),
// which YAML parses into a Date object. Normalise to a "YYYY-MM-DD" string
// so sorting and passing to client components keeps working.
function normalizeDate(value: unknown): string | undefined {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value.toISOString().slice(0, 10);
  }
  if (typeof value === 'string' && value.trim()) return value.trim();
  return undefined;
}

// `tags: foo` and `tags: [foo, bar]` are both valid in Obsidian.
function normalizeStringList(value: unknown): string[] | undefined {
  if (Array.isArray(value)) return value.map(String).map((v) => v.replace(/^#/, ''));
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((v) => v.trim().replace(/^#/, '')).filter(Boolean);
  }
  return undefined;
}

function isPublished(fm: TopicFrontmatter): boolean {
  return fm.publish !== false && fm.draft !== true;
}

function loadSection(section: Section): NoteEntry[] {
  const dir = sectionDir(section);
  if (!dir) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.md') && !/^[._]/.test(d.name))
    .flatMap((d) => {
      const fullPath = path.join(dir, d.name);
      const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
      const stem = d.name.replace(/\.md$/, '');
      const frontmatter: TopicFrontmatter = {
        ...(data as TopicFrontmatter),
        // A note without a `title` property still gets a sensible card title.
        title: typeof data.title === 'string' && data.title.trim() ? data.title : stem,
        date: normalizeDate(data.date),
        tags: normalizeStringList(data.tags),
        aliases: normalizeStringList(data.aliases),
      };
      if (!isPublished(frontmatter)) return [];
      return [
        {
          section,
          slug: slugify(stem),
          filename: d.name,
          fullPath,
          frontmatter,
          body: content,
        },
      ];
    });
}

type VaultIndex = {
  notes: Record<Section, NoteEntry[]>;
  // lower-cased filename stem / title / alias -> note, for [[wikilinks]]
  lookup: Map<string, NoteEntry>;
  // image filename -> absolute path, for ![[embeds]]
  assets: Map<string, string>;
};

const ASSET_EXTENSIONS: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
};

function collectAssets(dir: string, into: Map<string, string>) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectAssets(full, into);
    else if (ASSET_EXTENSIONS[path.extname(entry.name).toLowerCase()]) {
      if (!into.has(entry.name)) into.set(entry.name, full);
    }
  }
}

let cachedIndex: VaultIndex | null = null;

function getIndex(): VaultIndex {
  // In dev, re-read the vault on every request so edits in Obsidian show up
  // on refresh; in production the site is built once, so cache it.
  if (cachedIndex && process.env.NODE_ENV === 'production') return cachedIndex;

  const notes = {} as Record<Section, NoteEntry[]>;
  const lookup = new Map<string, NoteEntry>();
  for (const section of SECTIONS) {
    notes[section] = loadSection(section);
    for (const note of notes[section]) {
      const stem = note.filename.replace(/\.md$/, '');
      for (const key of [stem, note.frontmatter.title, ...(note.frontmatter.aliases ?? [])]) {
        const k = key.trim().toLowerCase();
        if (k && !lookup.has(k)) lookup.set(k, note);
      }
    }
  }

  const assets = new Map<string, string>();
  const root = vaultRoot();
  if (fs.existsSync(root)) collectAssets(root, assets);

  cachedIndex = { notes, lookup, assets };
  return cachedIndex;
}

// ---------------------------------------------------------------------
// Obsidian syntax -> standard Markdown
// ---------------------------------------------------------------------

const FENCED_OR_INLINE_CODE = /(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]+`)/g;

// Runs `fn` over the parts of the text that are NOT code, so `[[x]]` inside a
// code block stays exactly as written.
function outsideCode(text: string, fn: (part: string) => string): string {
  return text
    .split(FENCED_OR_INLINE_CODE)
    .map((part, i) => (i % 2 === 1 ? part : fn(part)))
    .join('');
}

function headingAnchor(heading: string): string {
  return new GithubSlugger().slug(heading.trim());
}

function noteHref(note: NoteEntry, heading?: string): string {
  const base = `/${note.section}/${note.slug}`;
  return heading ? `${base}#${headingAnchor(heading)}` : base;
}

function resolveNote(target: string, lookup: VaultIndex['lookup']): NoteEntry | undefined {
  // [[research/pong-policy-gradients]] (path form) -> last segment
  const name = target.trim().split('/').pop()!.replace(/\.md$/, '').toLowerCase();
  return lookup.get(name);
}

const IMAGE_SIZE_ONLY = /^\d+(x\d+)?$/; // ![[img.png|300]] — Obsidian's resize hint

export function obsidianToMarkdown(body: string, index: VaultIndex = getIndex()): string {
  return outsideCode(body, (text) => {
    let out = text.replace(/%%[\s\S]*?%%/g, '');

    // Callouts: "> [!note] Title" -> a blockquote with a bold title line.
    out = out.replace(
      /^([ \t]*>[ \t]*)\[!(\w+)\][+-]?[ \t]*(.*)$/gm,
      (_m, prefix: string, type: string, title: string) => {
        const label = title.trim() || type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        return `${prefix}**${label}**\n${prefix.trimEnd()}`;
      },
    );

    // Embeds: ![[image.png]] -> image; ![[Some Note]] -> a link to it.
    out = out.replace(
      /!\[\[([^\]|#]+?)(?:#([^\]|]*))?(?:\|([^\]]*))?\]\]/g,
      (_m, target: string, heading?: string, alias?: string) => {
        const name = target.trim();
        const ext = path.extname(name).toLowerCase();
        if (ASSET_EXTENSIONS[ext]) {
          if (!index.assets.has(name)) return alias && !IMAGE_SIZE_ONLY.test(alias) ? alias : '';
          const alt = alias && !IMAGE_SIZE_ONLY.test(alias) ? alias : '';
          return `![${alt}](/vault-assets/${encodeURIComponent(name)})`;
        }
        const note = resolveNote(name, index.lookup);
        if (!note) return alias?.trim() || name;
        return `[${alias?.trim() || note.frontmatter.title}](${noteHref(note, heading)})`;
      },
    );

    // Links: [[Note]] / [[Note|alias]] / [[Note#Heading]] / [[#Heading]]
    out = out.replace(
      /\[\[([^\]|#]*)(?:#([^\]|]*))?(?:\|([^\]]*))?\]\]/g,
      (_m, target: string, heading?: string, alias?: string) => {
        const label = alias?.trim();
        if (!target.trim()) {
          // [[#Heading]] — an anchor on the current page
          return heading ? `[${label || heading}](#${headingAnchor(heading)})` : '';
        }
        const note = resolveNote(target, index.lookup);
        // Unresolved link (the note isn't published): keep the words, drop the link.
        if (!note) return label || target.trim();
        const text = label || (heading ? `${note.frontmatter.title} › ${heading}` : note.frontmatter.title);
        return `[${text}](${noteHref(note, heading)})`;
      },
    );

    return out;
  });
}

// A short plain-text excerpt of the body, used as the card summary when a
// note doesn't set one explicitly in its frontmatter.
function excerpt(markdown: string, maxLength = 160): string {
  const plain = markdown
    .replace(FENCED_OR_INLINE_CODE, ' ')
    .replace(/^#+\s+.*$/gm, '') // drop heading lines
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // drop images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> their text
    .replace(/\$\$[\s\S]*?\$\$/g, '') // display math
    .replace(/\$[^$]*\$/g, '') // inline math — unreadable as plain text
    .replace(/[#*_`>[\]]/g, '') // strip common markdown punctuation
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trimEnd() + '\u2026';
}

function toSummary(note: NoteEntry, index: VaultIndex): TopicSummary {
  const { frontmatter } = note;
  return {
    ...frontmatter,
    slug: note.slug,
    summary: frontmatter.summary?.trim() || excerpt(obsidianToMarkdown(note.body, index)),
  };
}

// ---------------------------------------------------------------------
// Public API (unchanged signatures)
// ---------------------------------------------------------------------

export function getAllTopics(section: Section): TopicSummary[] {
  const index = getIndex();
  return index.notes[section]
    .map((note) => toSummary(note, index))
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

export function getTopicSlugs(section: Section): string[] {
  return getIndex().notes[section].map((n) => n.slug);
}

export async function getTopicBySlug(section: Section, slug: string): Promise<Topic | null> {
  const index = getIndex();
  const note = index.notes[section].find((n) => n.slug === slug);
  if (!note) return null;

  const markdown = obsidianToMarkdown(note.body, index);

  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(markdown);

  const vaultName = process.env.OBSIDIAN_VAULT_NAME?.trim();
  const relative = path.relative(vaultRoot(), note.fullPath).split(path.sep).join('/');
  const obsidianUri = vaultName
    ? `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(relative.replace(/\.md$/, ''))}`
    : undefined;

  return {
    ...toSummary(note, index),
    contentHtml: processed.toString(),
    obsidianUri,
  };
}

// Absolute path + content type for an image embedded from the vault; used by
// the /vault-assets route.
export function getVaultAssetNames(): string[] {
  return [...getIndex().assets.keys()];
}

export function getVaultAsset(name: string): { fullPath: string; contentType: string } | null {
  const fullPath = getIndex().assets.get(name);
  if (!fullPath) return null;
  return { fullPath, contentType: ASSET_EXTENSIONS[path.extname(name).toLowerCase()] };
}

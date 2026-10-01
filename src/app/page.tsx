import Link from 'next/link';
import Tag from '../components/Tag';
import { NAV_LINKS } from '../lib/navLinks';

const STACK = ['RAG & LLM Systems', 'Data Engineering', 'React · Tailwind · Node.js', 'Flutter · Swift'];

// Placeholder — swap in real project cards once decided (could pull
// straight from /research, or list separate case studies here).
const PROJECTS = [
  { title: 'Research & Projects', blurb: 'Browse everything I\u2019ve built, searchable and tagged by topic.', href: '/research' },
];

// Placeholder testimonials — replace with real quotes when you have them.
const TESTIMONIALS = [
  { quote: 'Placeholder testimonial — swap in a real quote here.', name: 'Name, Role' },
  { quote: 'Placeholder testimonial — swap in a real quote here.', name: 'Name, Role' },
];

export default function Home() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-16">
      {/* Hero */}
      <section className="mt-8 md:mt-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-3 leading-tight">
          Aaron Davis
        </h1>
        <h2 className="text-base md:text-2xl font-semibold opacity-80 mb-6">
          AI Engineer, Data Engineering Roots
        </h2>
        <p className="max-w-xl mx-auto opacity-80 mb-8">
          Applying AI and RAG systems to real data engineering problems —
          from ingestion pipelines to production-ready workflows.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {NAV_LINKS.filter(({ to }) => to !== '/').map(({ to, label }) => (
            <Link
              key={to}
              href={to}
              className="glass px-6 py-2 rounded-full font-semibold"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {STACK.map((item) => (
            <Tag key={item} label={item} />
          ))}
        </div>
      </section>

      {/* About */}
      <section className="glass mt-16 rounded-[2rem] px-6 py-8 md:px-10 md:py-10 text-left">
        <h3 className="text-xl md:text-2xl font-bold mb-4">About</h3>
        {/* Placeholder bio — replace with your own wording. */}
        <p className="opacity-80 mb-3">
          Data engineer based in Munich, moving into AI engineering — building
          on a background in data pipelines and infrastructure to apply LLM
          and RAG techniques to real data problems.
        </p>
        <p className="opacity-80">
          Also teaches ML fundamentals and mentors students, and is open to
          freelance and collaborative work — see{' '}
          <Link href="/connect" className="underline rounded-md px-1 -mx-1">
            Connect
          </Link>{' '}
          for details.
        </p>
      </section>

      {/* Selected work */}
      <section className="mt-16 text-left">
        <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">Selected Work</h3>
        <div className="flex flex-col md:flex-row gap-6">
          {PROJECTS.map(({ title, blurb, href }) => (
            <Link
              key={title}
              href={href}
              className="glass flex-1 rounded-3xl px-6 py-8 text-center flex flex-col justify-center gap-2"
            >
              <span className="text-lg font-semibold">{title}</span>
              <span className="text-sm opacity-70">{blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mt-16 text-left">
        <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">What People Say</h3>
        <div className="flex flex-col md:flex-row gap-6">
          {TESTIMONIALS.map(({ quote, name }, i) => (
            <div key={i} className="glass flex-1 rounded-3xl px-6 py-6 text-left flex flex-col gap-3">
              <p className="opacity-80 italic">&ldquo;{quote}&rdquo;</p>
              <span className="text-sm font-semibold opacity-70">{name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

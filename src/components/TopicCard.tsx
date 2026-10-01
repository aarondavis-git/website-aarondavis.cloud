import Link from 'next/link';

type TopicCardProps = {
  href: string;
  title: string;
  summary: string;
};

// One shared card shape for every topic across Projects, Research and
// Writings — a fixed square (not a rectangle that happens to vary with how
// much text a card has), so a grid of them lines up cleanly at 3-per-row.
//
// The top quarter is a solid header — a fixed 25% of the card's height,
// regardless of how long the title is. Its colours are the card body's own
// colours swapped: header background = body text colour, header text = body
// background colour, in every state (see globals.css for the source values):
//   light mode  rest:  charcoal background,   page-blue text
//   light mode hover:  deep rose background,  page-blue text
//   dark mode   rest:  champagne background,  page-dark text
//   dark mode  hover:  light gold background, page-dark text
// All text on the card (header title and summary) is centred.
// The bottom three quarters stay the normal frosted glass card body for the
// summary text. Links straight to the topic's own page rather than
// expanding in place: once a note has real length (headings, math, a few
// paragraphs), a full page is easier to read, share and link to than an
// in-card expansion.
const TopicCard = ({ href, title, summary }: TopicCardProps) => {
  return (
    <Link
      href={href}
      className="group glass interactive flex flex-col rounded-2xl w-full aspect-square overflow-hidden"
    >
      <div
        className="h-1/4 shrink-0 flex items-center justify-center px-4 py-2 transition-colors duration-300
          bg-[#36454f] text-[var(--card-header-blue)]
          group-hover:bg-[var(--deep-rose)] group-hover:text-[var(--card-header-blue)]
          dark:bg-[#d4af7f] dark:text-[var(--card-header-dark)]
          dark:group-hover:bg-[var(--light-gold)] dark:group-hover:text-[var(--card-header-dark)]"
      >
        <span className="text-sm font-medium leading-snug line-clamp-2 text-center">{title}</span>
      </div>
      <div className="flex-1 px-4 py-3 overflow-hidden">
        <p className="text-sm opacity-70 line-clamp-5 text-center">{summary}</p>
      </div>
    </Link>
  );
};

export default TopicCard;

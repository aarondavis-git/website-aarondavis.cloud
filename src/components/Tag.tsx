'use client';

import Link from 'next/link';

interface TagProps {
  label: string;
  noBackground?: boolean;
  /** Marks the tag as currently selected (e.g. the applied filter). */
  active?: boolean;
  to?: string;
  onClick?: (label: string) => void;
}

// No hover/focus styling lives here — hover, click and selected states for
// anything interactive come from the global rule in globals.css. A Tag only
// has to be a real <a> / <button> to pick that up.
const Tag = ({ label, noBackground = false, active = false, to, onClick }: TagProps) => {
  const baseClass = noBackground
    ? 'block w-full px-3 py-1 text-center' // plain row (e.g. inside the floating tag menu)
    : 'glass px-3 py-1 rounded-full relative';

  // Link
  if (to) {
    return (
      <Link href={to} className={baseClass}>
        {label}
      </Link>
    );
  }

  // Clickable chip — a real button so it is focusable and can hold the
  // "clicked" state.
  if (onClick) {
    return (
      <button
        type="button"
        aria-pressed={active ? true : undefined}
        className={baseClass}
        onClick={() => onClick(label)}
      >
        {label}
      </button>
    );
  }

  // Purely decorative label — not interactive, so it does not react.
  return <span className={baseClass}>{label}</span>;
};

export default Tag;

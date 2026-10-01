'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import TopicCard from './TopicCard';
import type { TopicSummary } from '../lib/content';

// Relevance score for a topic against a search term — higher is more
// relevant, and a match at the start of the title counts for the most.
// Tags aren't shown anywhere in this UI anymore, but still count toward
// relevance here since they're a genuine (if invisible) signal of what a
// topic is about. Declared outside the component since it doesn't depend
// on any component state.
function relevanceScore(topic: TopicSummary, lowered: string) {
  let score = 0;
  const title = topic.title.toLowerCase();
  if (title.startsWith(lowered)) score += 4;
  else if (title.includes(lowered)) score += 3;
  (topic.tags ?? []).forEach((tag) => {
    if (tag.toLowerCase().includes(lowered)) score += 1;
  });
  return score;
}

type TopicSearchGridProps = {
  topics: TopicSummary[];
  // Route section the cards link into, e.g. '/projects' -> '/projects/<slug>'.
  basePath: string;
};

// Search bar + card grid shared by Projects, Research and Writings, so the
// three pages behave identically. Typing floats the best title matches to
// the top; the enter button (or the Enter key) narrows the grid to the
// topics whose title contains the search text; an empty search shows all.
export default function TopicSearchGrid({ topics, basePath }: TopicSearchGridProps) {
  const [filteredTopicSlugs, setFilteredTopicSlugs] = useState<string[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Search — title matches only; tags are no longer surfaced in this UI at
  // all, so they don't appear as suggestions either.
  const suggestions = useMemo(() => {
    if (searchTerm.trim() === '') return [];
    const lowered = searchTerm.toLowerCase();
    return topics.map((t) => t.title).filter((title) => title.toLowerCase().includes(lowered));
  }, [searchTerm, topics]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute filtered/sorted topics. While the person is actively typing in
  // the search bar (and hasn't locked in a suggestion), we don't hide
  // anything — we just bring the most relevant cards to the top.
  const filteredTopics = useMemo(() => {
    if (filteredTopicSlugs) {
      return topics.filter((topic) => filteredTopicSlugs.includes(topic.slug));
    }
    const lowered = searchTerm.trim().toLowerCase();
    if (lowered) {
      return [...topics].sort((a, b) => relevanceScore(b, lowered) - relevanceScore(a, lowered));
    }
    return topics;
  }, [topics, filteredTopicSlugs, searchTerm]);

  // Enter button / Enter key: lock the grid to the topics whose title
  // contains the search text. An empty search clears the filter.
  function applySearch() {
    const lowered = searchTerm.trim().toLowerCase();
    setShowSuggestions(false);
    if (!lowered) {
      setFilteredTopicSlugs(null);
      return;
    }
    setFilteredTopicSlugs(
      topics.filter((t) => t.title.toLowerCase().includes(lowered)).map((t) => t.slug),
    );
  }

  return (
    <>
      {/* Search */}
      <div className="relative mb-6" ref={wrapperRef}>
        {/* The form is the glass bar (so it lifts and highlights as one
            piece); the input inside is transparent and the enter button
            sits in its right corner. */}
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            applySearch();
          }}
          className="glass interactive flex items-center rounded-2xl"
        >
          <input
            type="text"
            aria-label="Search"
            placeholder=""
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
              setFilteredTopicSlugs(null);
            }}
            className="min-w-0 flex-1 bg-transparent bg-none pl-4 pr-2 py-2 rounded-2xl focus:outline-none"
          />
          <button type="submit" aria-label="Enter" className="shrink-0 mr-2 p-1 rounded-full">
            <ArrowUpCircleIcon className="size-7" aria-hidden="true" />
          </button>
        </form>
        {showSuggestions && suggestions.length > 0 && (
          <ul
            role="listbox"
            className="glass absolute top-[calc(100%+4px)] overflow-auto z-50 max-h-60 w-full rounded-2xl divide-y divide-black/10 dark:divide-white/10"
          >
            {suggestions.map((suggest, i) => (
              <li
                key={i}
                role="option"
                aria-selected={false}
                onClick={() => {
                  const matched = topics.find((t) => t.title === suggest);
                  if (matched) {
                    setFilteredTopicSlugs([matched.slug]);
                  }
                  setSearchTerm('');
                  setShowSuggestions(false);
                }}
                className="px-4 py-2"
              >
                {suggest}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Topics Section — fixed-square card grid, each card linking to the
          topic's own page rather than out to GitHub directly (GitHub is
          still linked from the topic's own page). No tag badge on the
          card — tags aren't shown anywhere on these pages anymore. */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
        style={{ alignItems: 'start' }}
      >
        <AnimatePresence mode="popLayout">
          {filteredTopics.map((topic) => (
            <motion.div
              key={topic.slug}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              <TopicCard
                href={`${basePath}/${topic.slug}`}
                title={topic.title}
                summary={topic.summary}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {filteredTopics.length === 0 && <p className="opacity-70">No matches.</p>}
    </>
  );
}

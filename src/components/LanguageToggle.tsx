'use client';

import { useEffect, useRef, useState } from 'react';
import { LanguageIcon } from '@heroicons/react/24/outline';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
];

// UI only for now — picking a language doesn't translate the site yet, it
// just gives the control a home. Selected state (bold + darker box) comes
// free from the global interaction rule via aria-selected, same as
// everything else clickable on the site.
const LanguageToggle = () => {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="glass no-pop flex items-center justify-center p-2 rounded-full"
      >
        <LanguageIcon className="w-5 h-5" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="glass absolute right-0 top-[calc(100%+8px)] w-32 rounded-2xl overflow-hidden divide-y divide-black/10 dark:divide-white/10"
        >
          {LANGUAGES.map(({ code, label }) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={language === code}
                onClick={() => {
                  setLanguage(code);
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageToggle;

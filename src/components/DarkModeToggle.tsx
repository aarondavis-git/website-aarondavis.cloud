'use client';

import { LightBulbIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

// A single, plain outline light-bulb icon for both states — no fill swap,
// no color tint. It just inherits the site's normal text color (charcoal
// in light mode, champagne in dark mode), same as everything else.
const DarkModeToggle = () => {
  const { toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      type="button"
      className="glass no-pop cursor-pointer flex items-center justify-center p-2 rounded-full"
    >
      <LightBulbIcon className="w-5 h-5" />
    </button>
  );
};

export default DarkModeToggle;

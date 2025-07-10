import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="px-4 py-2 rounded-full bg-white/30 dark:bg-black/30 text-sm text-gray-800 dark:text-gray-200 border border-gray-400 dark:border-gray-500 transition"
    >
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default DarkModeToggle;
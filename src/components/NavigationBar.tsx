'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import './NavigationBar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/services', label: 'Services' },
  { to: '/writings', label: 'Writings' },
  { to: '/contact', label: 'Contact' },
];

const NavigationBar = () => {
  const pathname = usePathname();
  const { toggleDarkMode } = useTheme();

  return (
    <nav className="sticky top-0 left-0 w-full h-fit px-4 md:px-6 z-50">
      <div className="max-w-4xl mx-auto flex justify-between items-center py-2">
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          className="navbar-title cursor-pointer"
          type="button"
        >
          <h1 className="text-2xl leading-none">Aaron</h1>
        </button>
        <ul className="navbar-links flex space-x-6 list-none font-medium">
          {NAV_LINKS.map(({ to, label }) => {
            // Mirrors react-router's default NavLink behavior: "/" only
            // matches exactly, other links match their whole subtree too
            // (e.g. "/portfolio" stays active on "/portfolio/machinelearningresearch").
            const isActive =
              to === '/' ? pathname === '/' : pathname.startsWith(to);
            return (
              <li key={to}>
                <Link href={to} className={isActive ? 'active' : ''}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;

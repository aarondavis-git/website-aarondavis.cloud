'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { NAV_LINKS, isNavLinkActive } from '../lib/navLinks';
import './Sidebar.css';

type SidebarProps = {
  collapsed: boolean;
  onToggleCollapsed: () => void;
};

// Desktop only — below md the bottom nav bar takes over navigation entirely,
// so this component doesn't render (or need drawer/mobile logic) at all.
const Sidebar = ({ collapsed, onToggleCollapsed }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`sidebar glass glass-solid fixed top-3 left-3 bottom-3 z-50 hidden md:flex flex-col py-5 rounded-[2rem] overflow-hidden
        ${collapsed ? 'w-14' : 'w-52'}`}
    >
      {/* Header — collapses/expands the rail. Same pl/pr/width pattern as the
          nav rows below: the icon sits at a fixed offset from the right
          edge, so it never shifts, and the whole row (not just the icon) is
          the click target once expanded, matching the row it's the mirror
          of, with the greeting filling the space that opens up on the left. */}
      <div className="px-1.5 pb-3 mb-3 border-b border-black/10 dark:border-white/10">
        <button
          type="button"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggleCollapsed}
          className={`flex items-center pl-2.5 pr-2.5 py-2 rounded-2xl overflow-hidden
            transition-[width] duration-300 ease-in-out ${collapsed ? 'w-10' : 'w-full'}`}
        >
          <span
            className={`whitespace-nowrap overflow-hidden text-left transition-all duration-300 ease-in-out
              ${collapsed ? 'w-0 mr-0 opacity-0' : 'w-32 mr-2.5 opacity-100'}`}
          >
            Menu
          </span>
          {/* Airplane points right by default: right = "expand" when collapsed,
              flipped to point left = "collapse" when expanded. */}
          <PaperAirplaneIcon
            className={`w-5 h-5 shrink-0 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
          />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1 px-1.5">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => {
            const isActive = isNavLinkActive(to, pathname);
            return (
              <li key={to}>
                {/* pl/pr/py stay identical in both states so the icon never
                    shifts — only the row's own width grows/shrinks, and the
                    label fades/slides in the space that opens up to its
                    right. That's what keeps this in sync with the rail. */}
                <Link
                  href={to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center pl-2.5 pr-2.5 py-2 rounded-2xl overflow-hidden
                    transition-[width] duration-300 ease-in-out ${collapsed ? 'w-10' : 'w-full'}`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out
                      ${collapsed ? 'w-0 ml-0 opacity-0' : 'w-36 ml-2.5 opacity-100'}`}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

'use client';

import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import DarkModeToggle from './DarkModeToggle';
import LanguageToggle from './LanguageToggle';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  // The language/theme toggle group only shows at the very top of the
  // page — the instant you scroll down it hides, and it stays hidden
  // until you're back at the top (not just scrolling back up).
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => setAtTop(window.scrollY <= 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((c) => !c)} />
      <BottomNav />

      {/* Language + theme toggle, grouped top-right. Mirrors <main>'s own
          sidebar-offset margin and px, then the same max-w-5xl/px-4 nesting
          each page's own container uses — so this lines up with the real
          content column instead of the raw viewport corner. */}
      <div
        className={`fixed top-4 inset-x-0 z-50 px-4 md:px-8 pointer-events-none
          transition-[margin,opacity,transform] duration-300 ease-in-out
          ${collapsed ? 'md:ml-[4.75rem]' : 'md:ml-[14.75rem]'}
          ${atTop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <div className="max-w-5xl mx-auto px-4 flex justify-end">
          <div className={`flex items-center gap-2 ${atTop ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <LanguageToggle />
            <DarkModeToggle />
          </div>
        </div>
      </div>

      <main
        className={`transition-[margin] duration-300 ease-in-out px-4 md:px-8 pt-8 pb-24 md:pb-8 ${
          collapsed ? 'md:ml-[4.75rem]' : 'md:ml-[14.75rem]'
        }`}
      >
        {children}
      </main>
    </>
  );
};

export default AppShell;

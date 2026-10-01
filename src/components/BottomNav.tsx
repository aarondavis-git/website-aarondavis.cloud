'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV_LINKS, isNavLinkActive } from '../lib/navLinks';

// Mobile only — the desktop Sidebar takes over at md and up. Five compact
// icon+label tabs still fit a bottom bar comfortably. The bar hides on
// scroll-down and reappears on scroll-up (like Safari's toolbar) to give
// content more room while reading, and always reappears near the top.
const BottomNav = () => {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      // Always show near the top, and ignore tiny jitters (e.g. iOS
      // rubber-band overscroll) so the bar doesn't flicker.
      if (currentY <= 24) {
        setVisible(true);
      } else if (Math.abs(delta) > 4) {
        setVisible(delta < 0);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`glass glass-solid fixed inset-x-3 bottom-3 z-50 flex md:hidden justify-around
        rounded-full mb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-in-out
        ${visible ? 'translate-y-0' : 'translate-y-[calc(100%+2rem)]'}`}
    >
      {NAV_LINKS.map(({ to, label, icon: Icon }) => {
        const isActive = isNavLinkActive(to, pathname);
        return (
          <Link
            key={to}
            href={to}
            aria-current={isActive ? 'page' : undefined}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 m-0.5 py-1.5 rounded-full text-[12px] font-medium"
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;

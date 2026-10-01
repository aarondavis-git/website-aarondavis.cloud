import {
  HomeIcon,
  BriefcaseIcon,
  BeakerIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

export type NavLink = {
  to: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export const NAV_LINKS: NavLink[] = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/projects', label: 'Projects', icon: BriefcaseIcon },
  { to: '/research', label: 'Research', icon: BeakerIcon },
  { to: '/writings', label: 'Writings', icon: PencilIcon },
  { to: '/connect', label: 'Connect', icon: ChatBubbleLeftRightIcon },
];

// Home matches only the exact path; everything else also matches its own
// subtree (e.g. a future /research/[slug] page keeps Research highlighted).
export const isNavLinkActive = (to: string, pathname: string) =>
  to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);

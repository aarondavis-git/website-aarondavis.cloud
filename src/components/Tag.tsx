import { NavLink } from "react-router-dom";

interface TagProps {
    label:string;
    noBackground?: boolean;
    to?: string;
    onClick?: (label: string) => void
}
const Tag = ({ label, noBackground = false, to, onClick }: TagProps) => {
    const baseClass = noBackground
        ? "bg-transparent px-3 py-1 rounded-full"
        : "px-3 py-1 rounded-full text-[#36454f] dark:text-[#d4af7f] bg-black/10 dark:bg-white/10 hover:bg-black/20 hover:text-[#2a353f] dark:hover:bg-white/20 dark:hover:text-[#f4dec2] transition-colors duration-300 relative";

    // If `to` is provided, render as a NavLink    
    if (to) {
        return (
            <NavLink to={to} className={baseClass}>
            {label}
            </NavLink>
        );
    }
    // Otherwise render as clickable <span>
    return (
        <span className={baseClass}
        onClick={() => onClick?.(label)}>
            {label}
        </span>
    );
};

export default Tag;

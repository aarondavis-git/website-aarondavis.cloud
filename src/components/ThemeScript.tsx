// Runs synchronously before hydration (via next/script beforeInteractive
// won't work for this since it still runs after first paint on some
// browsers) — we inline it directly in <head> instead so there is no
// flash of the wrong theme on load.
const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var isDark = stored === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {}
})();
`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}

import type { Metadata } from 'next';
import ThemeScript from '../components/ThemeScript';
import { ThemeProvider } from '../context/ThemeContext';
import AppShell from '../components/AppShell';
import './globals.css';
// Styles for the rendered LaTeX/math in Research (and anywhere else a note
// uses $...$ math) — imported once globally rather than per-page, since any
// section's notes could contain math.
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  title: 'Aaron Davis',
  description: 'AI Engineer with a data engineering background, based in Munich.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}

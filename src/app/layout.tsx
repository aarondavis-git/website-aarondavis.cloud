import type { Metadata } from 'next';
import ThemeScript from '../components/ThemeScript';
import { ThemeProvider } from '../context/ThemeContext';
import NavigationBar from '../components/NavigationBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aaron Davis',
  description: 'Machine Learning Engineer & Full-Stack Developer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <NavigationBar />
          <div className="container max-w-6xl mx-auto px-4 md:px-8 pt-32">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

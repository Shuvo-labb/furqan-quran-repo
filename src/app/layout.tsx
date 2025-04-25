import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import SupabaseProvider from '@/providers/SupabaseProvider';
import { FontSettingsProvider } from '@/providers/FontSettingsProvider';
import Header from '@/components/Header';
import './globals.css';

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'] 
});

export const metadata: Metadata = {
  title: 'Furqan',
  description: 'A beautiful Quran reading experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <SupabaseProvider>
          <FontSettingsProvider>
            <div className="app-container">
              <Header />
              <main className="main-content">
                {children}
              </main>
              <footer className="site-footer">
                <div className="container text-center text-secondary">
                  <p>© {new Date().getFullYear()} Furqan. All rights reserved.</p>
                </div>
              </footer>
            </div>
          </FontSettingsProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
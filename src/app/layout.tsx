import { ReactNode } from 'react';

import Header from '../components/Header/Header';
import './globals.scss';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
          <Header />
          <main>{children}</main>
      </body>
    </html>
  );
}

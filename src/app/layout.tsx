import { ReactNode } from 'react';

import Header from '../components/Header/Header';
import './globals.scss';

import AuthSession from "@/AuthSession";

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthSession>
          <Header/>
          {children}
        </AuthSession>
      </body>
    </html>
  );
}

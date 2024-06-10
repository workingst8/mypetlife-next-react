import { getServerSession, Session } from "next-auth"
import { ReactNode } from 'react';

import Header from '../components/Header/Header';

import { authOptions } from "@/pages/api/auth/[...nextauth]"
import './globals.scss';

export default async function RootLayout({ children }: { children: ReactNode }) {
  let session = await getServerSession(authOptions) as Session | null;
  console.log("session:",session)
  return (
    <html lang="en">
      <body>
          <Header session={session}/>
          <main>{children}</main>
      </body>
    </html>
  );
}

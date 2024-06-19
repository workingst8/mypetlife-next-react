import { getServerSession, Session } from "next-auth"

import IndexPage from './page.client';

import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function Page() {
  let session = await getServerSession(authOptions) as Session | null;
  return <IndexPage session={session} />;
}

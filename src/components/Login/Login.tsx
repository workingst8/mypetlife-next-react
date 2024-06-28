'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';

export default function Login(): React.ReactElement {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const returnUrl = searchParams.get('returnUrl');

      if (session && returnUrl) {
        router.push(decodeURIComponent(returnUrl));
      } else if (session) {
        router.push('/');
      }
    }
  }, [session, searchParams, router]);

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
      <img 
        src="/images/login_github.png" 
        alt="login_github" 
        style={{width: '300px', cursor: 'pointer'}}
        onClick={() => {
          const returnUrl = searchParams?.get('returnUrl') || '/';
          signIn('github', { redirect: true, callbackUrl: decodeURIComponent(returnUrl) });
        }}
      />
    </div>
  );
}

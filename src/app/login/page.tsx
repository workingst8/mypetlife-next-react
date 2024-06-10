'use client'

import { signIn } from 'next-auth/react'
import React from 'react';

export default function LoginPage(): React.ReactElement {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
      <img 
        src="/images/login_github.png" 
        alt="login_github" 
        style={{width: '300px', cursor:'poitner'}}
        onClick={()=>{ signIn() }} 
      />
    </div>
  );
}

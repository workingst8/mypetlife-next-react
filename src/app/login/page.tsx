import React, { Suspense } from 'react';

import Login from '@/components/Login/Login';

export default function LoginPage(): React.ReactElement {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}

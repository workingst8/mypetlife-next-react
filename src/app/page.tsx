'use client';

import { useEffect, useState } from 'react';

import HomePage from './home/page';
import IntroPage from './intro/page';

export default function IndexPage() {
  const [introComplete, setIntroComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const introStatus = sessionStorage.getItem('introComplete') === 'true';
      setIntroComplete(introStatus);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      sessionStorage.setItem('introComplete', introComplete.toString());
    }
  }, [introComplete, isMounted]);

  if (!introComplete) {
    return <IntroPage onComplete={() => setIntroComplete(true)} />;
  }

  return <HomePage />;
}

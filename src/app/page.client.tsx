'use client';

import { useEffect, useState } from 'react';

import useIntroStore from '../stores/useIntroStore';

import HomePage from './home/page';
import IntroPage from './intro/page';


export default function IndexPage() {
  const { introComplete, setIntroComplete } = useIntroStore();
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

  return (
    <>
      {!introComplete ? (
        <IntroPage onComplete={() => setIntroComplete(true)} />
      ) : (
        <HomePage />
      )}
    </>
  );

}

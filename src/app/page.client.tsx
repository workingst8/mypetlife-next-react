'use client';

import { Session } from 'next-auth';
import { useEffect, useState } from 'react';

import useIntroStore from '../stores/useIntroStore';

import Home from '@/components/home/Home';
import Intro from '@/components/Intro/Intro';

type IndexPageProps = {
  session: Session | null;
};

const IndexPage: React.FC<IndexPageProps> = ({ session }) => {
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
        <Intro onComplete={() => setIntroComplete(true)} />
      ) : (
        <Home session={session} />
      )}
    </>
  );
};

export default IndexPage;

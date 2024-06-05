'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import useIntroStore from '@/stores/useIntroStore';

interface IntroProps {
  onComplete: () => void;
}

const logoVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const setIntroComplete = useIntroStore((state) => state.setIntroComplete);
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        setIntroComplete(true);
        onComplete();
      }}
    >
      {showLogo && (
        <motion.div
          id="logoContainer"
          variants={logoVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 1.5 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Image src="/images/logo.png" alt="Logo" width={250} height={250} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Intro;

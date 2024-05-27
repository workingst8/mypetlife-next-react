'use client';

import Image from 'next/image';
import Link from 'next/link';

import styles from './Header.module.scss';

import useIntroStore from '@/stores/useIntroStore';

const Header: React.FC = () => {

  const introComplete = useIntroStore((state) => state.introComplete);

  if (!introComplete) {
    return null;
  }
  
    return (
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link href="/home">
            <Image src="/images/logo.png" alt="Logo" width={100} height={50} />
          </Link>
        </div>
        <nav className={styles.navigation}>
          <ul>
            <li>
              <Link href="/community">커뮤니티</Link>
            </li>
            <li>
              <Link href="/mypage" className={styles.loginButton}>마이페이지</Link>
              {/* <Link href="/login" className={styles.loginButton}>로그인</Link> */}
            </li>
          </ul>
        </nav>
      </header>
    );  
};

export default Header;

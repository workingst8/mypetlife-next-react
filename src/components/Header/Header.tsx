import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '../../contexts/AuthContext';

import styles from './Header.module.scss';

const Header: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/home">
          <a>
            <Image src="/images/logo.png" alt="Logo" width={100} height={50} />
          </a>
        </Link>
      </div>
      <nav className={styles.navigation}>
        <ul>
          <li>
            <Link href="/community">
              <a>커뮤니티</a>
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <Link href="/mypage">
                <a className={styles.loginButton}>마이페이지</a>
              </Link>
            ) : (
              <Link href="/login">
                <a className={styles.loginButton}>로그인</a>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

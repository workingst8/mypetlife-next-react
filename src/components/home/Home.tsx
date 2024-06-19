import { Session } from 'next-auth';
import { useEffect, useState } from 'react';

import styles from '@/app/page.module.scss';
import BoardList from '@/components/BoardList/BoardList';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import { Post } from '@/models/board';

type HomePageProps = {
  session: Session | null;
};

const HomePage: React.FC<HomePageProps> = ({ session }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/post');
        const data = await response.json();
        if (response.ok) {
          setPosts(data.posts);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to load posts');
      }
    }

    fetchPosts();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <ImageSlider session={session}/>
      <BoardList posts={posts} basePath1="community" basePath2="detail" />
    </div>
  );
}


export default HomePage;
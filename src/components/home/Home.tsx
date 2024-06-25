import { useEffect, useState } from 'react';

import styles from '@/app/page.module.scss';
import BoardList from '@/components/BoardList/BoardList';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import { Post } from '@/models/board';

const HomePage: React.FC = () => {
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
      <ImageSlider />
      <h2 style={{marginTop: '20px'}}>커뮤니티 최신글</h2>
      <BoardList posts={posts.slice(0,5)} basePath1="community" basePath2="detail" />
    </div>
  );
}


export default HomePage;
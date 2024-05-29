'use client';

import { useEffect, useState } from 'react';

import styles from '@/app/page.module.scss';
import BoardList from '@/components/BoardList/BoardList';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import { Post } from '@/models/board';

export default function HomePage() {
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
      <BoardList posts={posts} basePath1="community" basePath2="detail" />
    </div>
  );
}

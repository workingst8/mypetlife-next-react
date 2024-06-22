'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import styles from '@/app/page.module.scss';
import BoardList from '@/components/BoardList/BoardList';
import { Post } from '@/models/board';

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortBy, setSortBy] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch('/api/post');
      const data = await response.json();
      console.log(data);
      setPosts(data.posts);
    }

    fetchPosts();
  }, []);

  const handleWriteButtonClick = () => {
    if (session) {
      router.push('/community/write');
    } else {
      alert('로그인이 필요한 기능입니다.');
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {};

  return (
    <div className={styles.pageContainer}>
      <div className="fadeIn">
        <h1>커뮤니티</h1>
        <div className={styles.headerWithButton}>
          <div className={styles.filterSearchContainer}>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="latest">최신순</option>
              <option value="likes">추천순</option>
              <option value="views">조회순</option>
            </select>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder="검색어 입력"
            />
            <button onClick={handleSearchSubmit}>검색</button>
          </div>
          <button
            onClick={handleWriteButtonClick}
            className={styles.writeButton}
          >
            글쓰기
          </button>
        </div>
        <BoardList posts={posts} basePath1="community" basePath2='detail' />
      </div>
    </div>
  );
}

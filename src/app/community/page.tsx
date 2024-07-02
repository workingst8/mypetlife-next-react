'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';

import styles from '@/app/page.module.scss';
import BoardList from '@/components/BoardList/BoardList';
import Pagination from '@/components/Pagination/Pagination';
import { Post } from '@/models/board';

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortBy, setSortBy] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname() || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postsPerPage] = useState(5); 

  async function fetchPosts() {
    const params = new URLSearchParams({
      sortBy,
      searchTerm,
      page: currentPage.toString(),
      limit: postsPerPage.toString(),
    });

    const response = await fetch(`/api/post?${params.toString()}`);

    const data = await response.json();
    if (data.posts) {
      setPosts(data.posts);
      setTotalPosts(data.total);
    } else {
      console.error('Failed to fetch posts', data.error);
      setPosts([]);
      setTotalPosts(0);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [sortBy, currentPage, postsPerPage]);

  const handleWriteButtonClick = () => {
    if (session) {
      router.push('/community/write');
    } else {
      alert('로그인이 필요한 기능입니다.');
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
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

  const handleSearchSubmit = () => {
    fetchPosts();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
        <BoardList posts={posts} basePath1="community" basePath2="detail" />
        <Pagination currentPage={currentPage} totalPosts={totalPosts} postsPerPage={postsPerPage} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}

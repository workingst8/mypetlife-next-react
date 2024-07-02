import React from 'react';

import styles from '@/app/page.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPosts: number;
  postsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPosts, postsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const maxPageButtons = 10;
  
  const getPages = () => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const startPage = Math.max(currentPage - 5, 1);
    const endPage = Math.min(currentPage + 4, totalPages);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className={styles.pagination}>
      {pages.map((page, index) => (
        <button
          key={index}
          disabled={currentPage === page}
          onClick={() => typeof page === 'number' && onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;

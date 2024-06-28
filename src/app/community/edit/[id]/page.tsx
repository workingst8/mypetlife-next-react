'use client';

import DOMPurify from 'dompurify';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import styles from '@/app/page.module.scss';
import QuillEditor from '@/components/QuillEditor/QuillEditor';

interface EditPageProps {
  params: {
    id: string;
  };
}

function EditPage({ params }: EditPageProps): React.ReactElement {
  const { id } = params;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/post/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setTitle(data.post.title);
        setContent(data.post.content);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    }

    fetchData();
  }, [id]);

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleContentChange(newContent: string) {
    setContent(newContent);
  }

  async function handleSubmit() {
    if (!title || !content) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }

    if (!window.confirm('게시물을 수정하시겠습니까?')) {
      return;
    }

    const sanitizedContent = DOMPurify.sanitize(content);

    try {
      const response = await fetch(`/api/post/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content: sanitizedContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to update the post');
      }

      const result = await response.json();
      window.location.href = `/community/detail/${result.post.id}`;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className="fadeIn">
        <h1>글수정</h1>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.title}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <QuillEditor content={content} onChange={handleContentChange} />
        <div className={styles.btn}>
          <button onClick={handleSubmit}>수정</button>
          <Link href="/community">
            <button>목록으로</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EditPage;

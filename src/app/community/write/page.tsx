'use client';

import DOMPurify from 'dompurify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import styles from '@/app/page.module.scss';
import QuillEditor from '@/components/QuillEditor/QuillEditor';

export default function WritePage(): React.ReactElement {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { data: session } = useSession();

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setTitle(event.target.value);
  }

  function handleContentChange(newContent: string): void {
    setContent(newContent);
  }

  async function handleSubmit(): Promise<void> {
    if (!title || !content) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }

    if (!window.confirm('등록하시겠습니까?')) {
      return; 
    }

    const sanitizedContent = DOMPurify.sanitize(content);

    try {
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content: sanitizedContent, author: session?.user?.name, profilePic: session?.user?.image }),
      });

      if (!response.ok) {
        throw new Error('글 작성에 실패했습니다.');
      }

      const result = await response.json();
      router.push(`/community/detail/${result.post.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className="fadeIn">
        <h1>글쓰기</h1>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.title}>
          <label htmlFor="title">제목</label>
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
          <button onClick={handleSubmit}>등록</button>
          <Link href="/community"><button>목록으로</button></Link>
        </div>
      </div>
    </div>
  );
}
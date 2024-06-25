'use client'

import DOMPurify from 'dompurify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect, useRef } from 'react';

import styles from './PostDetail.module.scss';

import { Post } from '@/models/board';

interface PostDetailProps {
  postId: string;
}

const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [showChatOption, setShowChatOption] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch(`http://localhost:3000/api/post/${postId}`, {
        cache: 'no-cache',
      });
      const data = await res.json();
      console.log(data);
      if (data.post) {
        setPost({
          ...data.post,
          content: DOMPurify.sanitize(data.post.content),
        });
        setLikes(data.post.likes);
      }
    }

    fetchPost();
  }, [postId]);

  const handleChatClick = () => {
    router.push('/chat');
    setShowChatOption(false);
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  if (!post) {
    return <div>게시물을 찾을 수 없습니다</div>;
  }

  return (
    <div className={styles.postDetail}>
      <h1>{post.title}</h1>
      <div className={styles.authorInfo}>
        <img
          src={post.profilePic}
          alt="작성자 프로필"
          className={styles.profilePic}
          onClick={() => setShowChatOption(!showChatOption)}
        />
        <span>{post.author}</span>
        {showChatOption && (
          <div className={styles.chatOptions} ref={menuRef}>
            <ul>
              <li>
                <button onClick={handleChatClick}>채팅하기</button>
              </li>
            </ul>
          </div>
        )}
        <button className={styles.likeButton} onClick={toggleLike}>
          {liked ? '❤️' : '♡'} {likes}
        </button>
        <span>조회 {post.views}</span>
        <span>{post.createdAt}</span>
      </div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      <div className={styles.btn}>
        <Link href="/community">
          <button>목록으로</button>
        </Link>
        {session?.user?.name === post.author && (
          <div>
            <Link href={`/community/edit/${post.id}`}>
              <button>수정</button>
            </Link>
            <button
              onClick={async () => {
                if (window.confirm('게시물을 삭제하시겠습니까?')) {
                  const response = await fetch(`/api/post/${post.id}`, {
                    method: 'DELETE',
                  });
                  if (response.ok) {
                    alert('게시물이 성공적으로 삭제되었습니다.');
                    router.push('/community');
                  } else {
                    alert('게시물 삭제에 실패했습니다.');
                  }
                }
              }}
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;

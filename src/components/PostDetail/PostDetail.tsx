'use client'

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';

import { Post } from '../../models/board';

import styles from './PostDetail.module.scss';

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

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch(`http://localhost:3000/api/post/${postId}`, {
        cache: 'no-cache'
      });
      const data = await res.json();
      console.log(data);
      setPost(data.post);
      setLikes(data.post.likes);
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
        <span>작성일: {post.createdAt}</span>
      </div>
      <p>{post.content}</p>
    </div>
  );
};

export default PostDetail;

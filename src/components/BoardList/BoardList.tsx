import Link from 'next/link';

import { Post } from '../../models/board';

import styles from './BoardList.module.scss';

interface PostsProps {
    posts: Post[];
    basePath: string;
  }

  const BoardList: React.FC<PostsProps> = ({ posts, basePath }) => {
  return (
    <div className={styles.BoardListContainer}>
      <ul>
        {posts.map(post => 
          <li key={post.id.toString()} className={styles.postItem}>
            <div className={styles.postHeader}>
              <Link href={`/${basePath}/${post.id}`}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
              </Link>
              <span>추천 {post.likes}</span>
              <span>조회 {post.views}</span>
              <span className={styles.postDate}>{post.createdAt}</span>
            </div>
            <p className={styles.postContent}>{post.content}</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default BoardList;

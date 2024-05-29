import Link from 'next/link';

import { Post } from '../../models/board';

import styles from './BoardList.module.scss';

interface PostsProps {
  posts: Post[];
  basePath1: string;
  basePath2: string;
}

const BoardList: React.FC<PostsProps> = ({ posts, basePath1, basePath2 }) => {
  return (
    <div className={styles.BoardListContainer}>
      <ul>
        {posts.map(post => (
          <li key={post.id.toString()} className={styles.postItem}>
            <div className={styles.postHeader}>
              <Link href={`/${basePath1}/${basePath2}/${post.id}`}>
                <h3 className={styles.postTitle}>{post.title}</h3>
              </Link>
              <span>추천 {post.likes}</span>
              <span>조회 {post.views}</span>
              <span className={styles.postDate}>{post.createdAt}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardList;

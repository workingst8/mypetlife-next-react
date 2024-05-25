import Link from 'next/link';

import styles from "@/app/page.module.scss";
import PostDetail from "@/components/PostDetail/PostDetail";
import { Post } from "@/models/board";

interface DetailProps {
  params: {
    id: string;
  };
}

async function fetchPost(id: string) {
  const res = await fetch(`http://localhost:3000/api/posts?id=${id}`);
  const data = await res.json();
  return data.post as Post;
}

export default async function Detail({ params }: DetailProps) {
  const post = await fetchPost(params.id);
  console.log(post);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className="fadeIn">
        <PostDetail post={post} />
        <Link href="/home"><button>목록으로</button></Link>
      </div>
    </div>
  );
}

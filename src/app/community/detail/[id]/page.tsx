'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import styles from '@/app/page.module.scss';
import PostDetail from '@/components/PostDetail/PostDetail';

interface DetailProps {
  params: {
    id: string;
  };
}

export default function Detail({ params }: DetailProps) {
  const router = useRouter();
  return (
    <div className={styles.pageContainer}>
      <div className="fadeIn">
        <PostDetail postId={params.id} />
        <div className={styles.btn}>
          <Link href="/community">
            <button>목록으로</button>
          </Link>
          <Link href={`/community/edit/${params.id}`}>
            <button>수정</button>
          </Link>
          <button
            onClick={async () => {
                const response = await fetch(`/api/post/${params.id}`, {
                  method: 'DELETE',
                });
                if (response.ok) {
                  alert('게시물이 성공적으로 삭제되었습니다.');
                  router.push('/community');  
                } else {
                  alert('게시물 삭제에 실패했습니다.');
                }
            }}
          >삭제</button>
        </div>
      </div>
    </div>
  );
}

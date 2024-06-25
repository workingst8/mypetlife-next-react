import styles from '@/app/page.module.scss';
import PostDetail from '@/components/PostDetail/PostDetail';

interface DetailPageProps {
  params: {
    id: string;
  };
}

export default function DetailPage({ params }: DetailPageProps) {
  return (
    <div className={styles.pageContainer}>
      <div className="fadeIn">
        <PostDetail postId={params.id} />
      </div>
    </div>
  );
}

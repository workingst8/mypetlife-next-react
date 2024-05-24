import type { NextApiRequest, NextApiResponse } from 'next';

import { Post } from '@/models/board';
import { connectDB } from '@/util/database';

type Data = {
  posts?: Post[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let client;
  try {
    client = await connectDB;
    const db = client.db('MyPetLife');
    const posts = await db.collection('post').find().toArray();

    const transformedPosts: Post[] = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      author: post.author,
      profilePic: post.profilePic,
      comments: post.comments,
      likes: post.likes,
      views: post.views,
    }));

    res.status(200).json({ posts: transformedPosts });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    res.status(500).json({ error: 'Failed to load posts' });
  } finally {
    if (client && process.env.NODE_ENV !== 'development') {
      await client.close();
    }
  }
}

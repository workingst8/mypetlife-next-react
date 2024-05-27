import type { NextApiRequest, NextApiResponse } from 'next';

import { Post } from '@/models/board';
import { connectDB } from '@/util/database';

type Data = {
  posts?: Post[];
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    try {
      const client = await connectDB;
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

      return res.status(200).json({ posts: transformedPosts });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      return res.status(500).json({ error: 'Failed to load posts' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Post } from '@/models/board';
import { connectDB } from '@/util/database';

type Data = {
  post?: Post;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { id } = req.query;

  try {
    const objectId = new ObjectId(id as string);
    const client = await connectDB;
    const db = client.db('MyPetLife');
    
    const updateResult = await db.collection('post').findOneAndUpdate(
      { _id: objectId },
      { $inc: { views: 1 } },
      { returnDocument: 'after' } 
    );

    const post = updateResult;

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const transformedPost: Post = {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      author: post.author,
      profilePic: post.profilePic,
      comments: post.comments,
      likes: post.likes,
      views: post.views,
    };

    return res.status(200).json({ post: transformedPost });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
}

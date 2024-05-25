import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Post } from '@/models/board';
import { connectDB } from '@/util/database';

type Data = {
  posts?: Post[];
  post?: Post;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let client;

  try {
    client = await connectDB;
    const db = client.db('MyPetLife');

    console.log('Received query ID:', req.query.id);
    if (req.query.id) {
      try {
        const objectId = new ObjectId(req.query.id as string);
        const post = await db.collection('post').findOne({ _id: objectId });

        if (!post) {
          console.log('Post not found');
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
        console.error('Invalid ID format:', error);
        return res.status(400).json({ error: 'Invalid ID format' });
      }
    } else {
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
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return res.status(500).json({ error: 'Failed to load posts' });
  } finally {
    if (client && process.env.NODE_ENV !== 'development') {
      await client.close();
    }
  }
}


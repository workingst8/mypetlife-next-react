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

    switch (req.method) {
      case 'GET': {
        const documents = await db.collection('post').find().toArray();

        const posts: Post[] = documents.map(document => ({
          id: document._id.toString(),
          title: document.title,
          content: document.content,
          createdAt: document.createdAt,
          author: document.author,
          profilePic: document.profilePic,
          comments: document.comments || [],
          likes: document.likes,
          views: document.views,
        }));

        return res.status(200).json({ posts });
      }
      case 'POST': {
        const { title, content } = req.body;
        if (!title || !content) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const newPost: Omit<Post, 'id'> = {
          title,
          content,
          createdAt: new Date().toISOString().split('T')[0],
          author: req.body.author || 'Anonymous',
          profilePic: req.body.profilePic || '',
          views: 0,
          likes: 0,
          comments: [],
        };

        const result = await db.collection('post').insertOne(newPost);
        return res.status(201).json({ post: { ...newPost, id: result.insertedId.toString() } });
      }
      default:
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

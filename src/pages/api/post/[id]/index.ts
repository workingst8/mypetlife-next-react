import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Post } from '@/models/board';
import { connectDB } from '@/util/database';

type Data = {
  post?: Post;
  error?: string;
  message?:string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing ID' });
  }

  try {
    const objectId = new ObjectId(id as string);
    const client = await connectDB;
    const db = client.db('MyPetLife');

    if (req.method === 'GET') {
      const document = await db.collection('post').findOneAndUpdate(
        { _id: objectId },
        { $inc: { views: 1 } },
        { returnDocument: 'after' }
      );

      if (!document) {
        return res.status(404).json({ error: 'Post not found' });
      }

      return res.status(200).json({ post: transformPost(document) });
    } else if (req.method === 'PUT') {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const updateResult = await db.collection('post').findOneAndUpdate(
        { _id: objectId },
        { $set: { title, content } },
        { returnDocument: 'after' }
      );

      if (!updateResult) {
        return res.status(404).json({ error: 'Post not found' });
      }

      return res.status(200).json({ post: transformPost(updateResult) });
    } else if(req.method === 'DELETE'){
      const document = await db.collection('post').deleteOne(
        { _id: objectId}
      );
      console.log(document);
      return res.status(200).json({ message: 'Post deleted successfully' });
    }
      else {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
}

function transformPost(document: any): Post {
  return {
    id: document._id.toString(),
    title: document.title,
    content: document.content,
    createdAt: document.createdAt,
    author: document.author,
    profilePic: document.profilePic,
    comments: document.comments,
    likes: document.likes,
    views: document.views,
  };
}

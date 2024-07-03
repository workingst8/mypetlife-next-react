import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { connectDB } from '@/util/database';

interface Data {
  message?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing ID' });
  }

  const objectId = new ObjectId(id as string);
  const client = await connectDB;
  const db = client.db('MyPetLife');

  if (req.method === 'POST') {
    const { email, like } = req.body;

    try {
      if (like) {
        const updateResult = await db.collection('post').updateOne(
          { _id: objectId },
          { $addToSet: { likedBy: email }, $inc: { likes: 1 } }
        );
        if (!updateResult.modifiedCount) {
          return res.status(404).json({ error: 'Post not found or already liked' });
        }
      } else {
        const updateResult = await db.collection('post').updateOne(
          { _id: objectId },
          { $pull: { likedBy: email }, $inc: { likes: -1 } }
        );
        if (!updateResult.modifiedCount) {
          return res.status(404).json({ error: 'Post not found or not liked before' });
        }
      }
      res.status(200).json({ message: 'Like status updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

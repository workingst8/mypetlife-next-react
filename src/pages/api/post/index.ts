import type { NextApiRequest, NextApiResponse } from 'next';

import { Post } from '@/models/board';
import { connectDB } from '@/util/database';

interface Data {
  posts?: Post[];
  post?: Post;
  error?: string;
  total?: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  let client;

  try {
    client = await connectDB;
    const db = client.db('MyPetLife');
    const { sortBy: querySortBy, searchTerm, page, limit } = req.query;

    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { title: new RegExp(searchTerm.toString(), 'i') },
          { content: new RegExp(searchTerm.toString(), 'i') }
        ]
      };
    }

    type SortBy = 'latest' | 'likes' | 'views';

    let options = {};
    
    if (querySortBy) {
      const sortFields: { [key in SortBy]: any } = { 
        latest: { createdAt: -1 }, 
        likes: { likes: -1 }, 
        views: { views: -1 } 
      };
      options = { sort: sortFields[querySortBy as SortBy] || { createdAt: -1 } };
    } else {
      options = { sort: { createdAt: -1 } }; 
    }

    switch (req.method) {
      case 'GET': {
        const pageNumber = parseInt(page as string) || 1;
        const pageSize = parseInt(limit as string) || 5;

        const skip = (pageNumber - 1) * pageSize;
        const totalDocuments = await db.collection('post').countDocuments(query);
        
        const documents = await db.collection('post').find(query, options).skip(skip).limit(pageSize).toArray();
        
        const posts: Post[] = documents.map(document => ({
          id: document._id.toString(),
          title: document.title,
          content: document.content,
          createdAt: document.createdAt.toISOString().split('T')[0],
          author: document.author,
          profilePic: document.profilePic,
          comments: document.comments || [],
          likes: document.likes,
          likedBy: document.likedBy,
          views: document.views,
        }));
        
        return res.status(200).json({ posts, total: totalDocuments });
      }
      case 'POST': {
        const { title, content } = req.body;
        if (!title || !content) {
          return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
        }
        const newPost: Omit<Post, 'id'> = {
          title,
          content,
          createdAt: new Date(),
          author: req.body.author || 'Anonymous',
          profilePic: req.body.profilePic || '',
          views: 0,
          likes: 0,
          likedBy: [],
          comments: [],
        };
        const result = await db.collection('post').insertOne(newPost);
        return res.status(201).json({ post: { ...newPost, id: result.insertedId.toString() } });
      }
      default:
        return res.status(405).json({ error: '허용되지 않는 메소드입니다.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '서버 내부 오류' });
  }
}

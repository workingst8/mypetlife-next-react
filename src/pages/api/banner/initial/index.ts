import aws from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.BUCKET_NAME) {
    res.status(500).json({ error: 'BUCKET_NAME environment variable is not set' });
    return;
  }

  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: 'ap-northeast-2',
    signatureVersion: 'v4',
  });

  const s3 = new aws.S3();
  const params: aws.S3.ListObjectsV2Request = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: '',
  };

  try {
    const s3Response = await s3.listObjectsV2(params).promise();
    if (!s3Response.Contents) {
      res.status(404).json({ error: 'No files found in the bucket' });
      return;
    }

    const imageUrls = s3Response.Contents.map(content => {
      return `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${content.Key}`;
    });
    res.status(200).json(imageUrls);
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({ error: 'Failed to retrieve images', details: error });
  }
}

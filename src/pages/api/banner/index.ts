import aws from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    console.log("AWS Access Key:", process.env.ACCESS_KEY);
    console.log("AWS Secret Key:", process.env.SECRET_KEY);
    console.log("AWS Bucket Name:", process.env.BUCKET_NAME);

    aws.config.update({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
      region: 'ap-northeast-2',
      signatureVersion: 'v4',
    });

    const s3 = new aws.S3();

    if (!req.query.file) {
      throw new Error('File parameter is missing.');
    }

    const url = await s3.createPresignedPost({
      Bucket: process.env.BUCKET_NAME,
      Fields: { key: req.query.file },
      Expires: 60,
      Conditions: [
        ['content-length-range', 0, 1048576],
      ],
    });

    res.status(200).json(url);
  } catch (error) {
    console.error('Failed to generate S3 presigned URL:', error);
    res.status(500).json({ error: 'Internal Server Error'});
  }
}

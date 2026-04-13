import { NextResponse } from 'next/server';
import { getMinioClient, BUCKET_NAME } from '@/lib/minio';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Filename and contentType are required' }, { status: 400 });
    }

    const minioClient = getMinioClient();
    
    // Ensure bucket exists (in a real app, do this on startup or via migrations)
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME).catch(() => false);
    if (!bucketExists) {
      // Attempt to create, might fail if no permissions, but we try
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1').catch(console.error);
    }

    const ext = filename.split('.').pop();
    const objectName = `${uuidv4()}.${ext}`;

    // Generate presigned URL for PUT request (valid for 5 minutes)
    const presignedUrl = await minioClient.presignedPutObject(BUCKET_NAME, objectName, 5 * 60);

    // The public URL where the file will be accessible after upload
    // Note: In a real setup, MinIO needs to be configured for public read access on this bucket
    // or we need to generate presigned GET URLs later. Assuming public read for simplicity here.
    const publicUrl = `${process.env.MINIO_ENDPOINT ? `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}` : 'http://localhost:9000'}/${BUCKET_NAME}/${objectName}`;

    return NextResponse.json({ presignedUrl, publicUrl, objectName });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}

import * as Minio from 'minio'

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
})

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME!

export async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET_NAME)
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, 'us-east-1')
    const policy = JSON.stringify({
      Version: '2012-10-17',
      Statement: [{ Effect: 'Allow', Principal: { AWS: ['*'] }, Action: ['s3:GetObject'], Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`] }],
    })
    await minioClient.setBucketPolicy(BUCKET_NAME, policy)
  }
}

export async function uploadToMinio(buffer: Buffer, objectName: string, contentType: string): Promise<string> {
  await ensureBucket()
  await minioClient.putObject(BUCKET_NAME, objectName, buffer, buffer.length, { 'Content-Type': contentType })
  const useSSL = process.env.MINIO_USE_SSL === 'true'
  const protocol = useSSL ? 'https' : 'http'
  const port = process.env.MINIO_PORT || '9000'
  const endpoint = process.env.MINIO_ENDPOINT!
  return `${protocol}://${endpoint}:${port}/${BUCKET_NAME}/${objectName}`
}

export default minioClient

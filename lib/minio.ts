import * as Minio from 'minio';

// Lazy initialization to avoid crashing on startup if env vars are missing
let minioClientInstance: Minio.Client | null = null;

export function getMinioClient(): Minio.Client {
  if (!minioClientInstance) {
    minioClientInstance = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
      // Easypanel/Docker setups often require path style addressing
      // instead of virtual host style (bucket.domain.com)
      pathStyle: true,
    });
  }
  return minioClientInstance;
}

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'motorcycles';

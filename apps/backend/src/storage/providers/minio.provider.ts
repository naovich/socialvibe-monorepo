import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { IStorageProvider } from '../storage.interface';

@Injectable()
export class MinioStorageProvider implements IStorageProvider {
  private readonly logger = new Logger(MinioStorageProvider.name);
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get('MINIO_BUCKET') || 'socialvibe';

    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT') || 'localhost',
      port: parseInt(this.configService.get('MINIO_PORT') || '9000'),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY') || 'minioadmin',
      secretKey: this.configService.get('MINIO_SECRET_KEY') || 'minioadmin',
    });

    this.ensureBucket();
  }

  private async ensureBucket() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        
        // Set bucket policy to public-read
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(this.bucketName, JSON.stringify(policy));
        
        this.logger.log(`✅ Bucket "${this.bucketName}" created and made public`);
      }
    } catch (error) {
      this.logger.error(`Failed to ensure bucket: ${error.message}`);
    }
  }

  async upload(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}-${file.originalname.replace(/\s/g, '-')}`;

    try {
      await this.minioClient.putObject(
        this.bucketName,
        filename,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        }
      );

      return this.getPublicUrl(filename);
    } catch (error) {
      this.logger.error(`Upload failed: ${error.message}`);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async delete(url: string): Promise<void> {
    try {
      // Extract filename from URL
      const filename = url.split('/').slice(-2).join('/'); // folder/filename
      await this.minioClient.removeObject(this.bucketName, filename);
    } catch (error) {
      this.logger.error(`Delete failed: ${error.message}`);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  getPublicUrl(key: string): string {
    const endpoint = this.configService.get('MINIO_ENDPOINT') || 'localhost';
    const port = this.configService.get('MINIO_PORT') || '9000';
    const useSSL = this.configService.get('MINIO_USE_SSL') === 'true';
    const protocol = useSSL ? 'https' : 'http';
    
    return `${protocol}://${endpoint}:${port}/${this.bucketName}/${key}`;
  }
}

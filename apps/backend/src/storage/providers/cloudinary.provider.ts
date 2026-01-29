import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { IStorageProvider } from '../storage.interface';

@Injectable()
export class CloudinaryStorageProvider implements IStorageProvider {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async upload(file: Express.Multer.File, folder: string = 'socialvibe'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Upload failed'));
          resolve(result.secure_url);
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  async delete(url: string): Promise<void> {
    // Extract public_id from URL
    const parts = url.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${filename}`;

    await cloudinary.uploader.destroy(publicId);
  }

  getPublicUrl(key: string): string {
    // Cloudinary handles URLs directly
    return key;
  }
}

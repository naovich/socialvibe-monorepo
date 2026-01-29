export interface IStorageProvider {
  upload(file: Express.Multer.File, folder?: string): Promise<string>;
  delete(url: string): Promise<void>;
  getPublicUrl(key: string): string;
}

export enum StorageProvider {
  MINIO = 'minio',
  CLOUDINARY = 'cloudinary',
  S3 = 's3',
}

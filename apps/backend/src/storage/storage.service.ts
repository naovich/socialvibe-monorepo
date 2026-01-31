import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IStorageProvider, StorageProvider } from "./storage.interface";
import { MinioStorageProvider } from "./providers/minio.provider";
import { CloudinaryStorageProvider } from "./providers/cloudinary.provider";

@Injectable()
export class StorageService implements OnModuleInit {
  private provider!: IStorageProvider;

  constructor(
    private configService: ConfigService,
    private minioProvider: MinioStorageProvider,
    private cloudinaryProvider: CloudinaryStorageProvider,
  ) {}

  onModuleInit() {
    const providerType =
      (this.configService.get<string>("STORAGE_PROVIDER") as StorageProvider) ||
      StorageProvider.MINIO;

    switch (providerType) {
      case StorageProvider.CLOUDINARY:
        this.provider = this.cloudinaryProvider;
        console.log("📦 Storage: Cloudinary");
        break;
      case StorageProvider.MINIO:
      default:
        this.provider = this.minioProvider;
        console.log("📦 Storage: MinIO (S3-compatible)");
        break;
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<string> {
    return this.provider.upload(file, folder);
  }

  async deleteImage(url: string): Promise<void> {
    return this.provider.delete(url);
  }

  getPublicUrl(key: string): string {
    return this.provider.getPublicUrl(key);
  }
}

import { Module } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { MinioStorageProvider } from "./providers/minio.provider";
import { CloudinaryStorageProvider } from "./providers/cloudinary.provider";

@Module({
  providers: [StorageService, MinioStorageProvider, CloudinaryStorageProvider],
  exports: [StorageService],
})
export class StorageModule {}

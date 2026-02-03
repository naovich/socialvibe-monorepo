import { Injectable } from "@nestjs/common";
import { StorageService } from "../storage/storage.service";

@Injectable()
export class UploadService {
  constructor(private storageService: StorageService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return this.storageService.uploadImage(file, "socialvibe");
  }

  async deleteImage(url: string): Promise<void> {
    return this.storageService.deleteImage(url);
  }
}

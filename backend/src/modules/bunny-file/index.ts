import axios from "axios";
import { IFileService } from "@medusajs/file";
import { Readable } from "stream";

class BunnyFileService implements IFileService {
  protected readonly storageZoneName: string;
  protected readonly accessKey: string;
  protected readonly pullZoneUrl: string;

  constructor({}, options) {
    this.storageZoneName = options.storageZoneName;
    this.accessKey = options.accessKey;
    this.pullZoneUrl = options.pullZoneUrl;
  }

  async upload(file: Express.Multer.File): Promise<{ url: string }> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const uploadUrl = `https://storage.bunnycdn.com/${this.storageZoneName}/${fileName}`;

    await axios.put(uploadUrl, file.buffer, {
      headers: {
        AccessKey: this.accessKey,
        "Content-Type": file.mimetype,
      },
    });

    return { url: `${this.pullZoneUrl}/${fileName}` };
  }

  async delete(fileKey: string): Promise<void> {
    const deleteUrl = `https://storage.bunnycdn.com/${this.storageZoneName}/${fileKey}`;

    await axios.delete(deleteUrl, {
      headers: {
        AccessKey: this.accessKey,
      },
    });
  }

  async getUploadStreamDescriptor(fileData: {
    name: string;
    ext: string;
    mimeType: string;
  }): Promise<{ writeStream: Readable; url: string; fileKey: string }> {
    throw new Error("Method not implemented.");
  }

  async getDownloadStream(fileData: { fileKey: string }): Promise<Readable> {
    throw new Error("Method not implemented.");
  }
}

export default BunnyFileService;

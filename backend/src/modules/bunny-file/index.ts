import axios from "axios";
import type { Request } from "express";
import type multer from "multer";

class BunnyFileService {
  protected readonly storageZoneName: string;
  protected readonly accessKey: string;
  protected readonly pullZoneUrl: string;

  constructor({}, options) {
    this.storageZoneName = options.storageZoneName;
    this.accessKey = options.accessKey;
    this.pullZoneUrl = options.pullZoneUrl;
  }

  async upload(file: multer.File): Promise<{ url: string }> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const uploadUrl = `https://storage.bunnycdn.com/${this.storageZoneName}/${fileName}`;

    try {
      await axios.put(uploadUrl, file.buffer, {
        headers: {
          AccessKey: this.accessKey,
          "Content-Type": file.mimetype,
        },
      });

      return { url: `${this.pullZoneUrl}/${fileName}` };
    } catch (error) {
      console.error("BunnyCDN Upload Error:", error);
      throw new Error("Failed to upload file to BunnyCDN");
    }
  }

  async delete(fileKey: string): Promise<void> {
    const deleteUrl = `https://storage.bunnycdn.com/${this.storageZoneName}/${fileKey}`;

    try {
      await axios.delete(deleteUrl, {
        headers: {
          AccessKey: this.accessKey,
        },
      });
    } catch (error) {
      console.error("BunnyCDN Delete Error:", error);
      throw new Error("Failed to delete file from BunnyCDN");
    }
  }
}

export default BunnyFileService;

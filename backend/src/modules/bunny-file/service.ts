import { AbstractFileProviderService, MedusaError } from '@medusajs/framework/utils';
import { Logger } from '@medusajs/framework/types';
import { 
  ProviderUploadFileDTO,
  ProviderDeleteFileDTO,
  ProviderFileResultDTO,
  ProviderGetFileDTO
} from '@medusajs/framework/types';
import axios from 'axios';
import { ulid } from 'ulid';
import path from 'path';

type InjectedDependencies = {
  logger: Logger;
};

export interface BunnyFileProviderOptions {
  storageZoneName: string;
  accessKey: string;
  pullZoneUrl: string;
}

class BunnyFileProviderService extends AbstractFileProviderService {
  static identifier = 'bunny-file';
  protected readonly config_: BunnyFileProviderOptions;
  protected readonly logger_: Logger;

  constructor({ logger }: InjectedDependencies, options: BunnyFileProviderOptions) {
    super();
    this.logger_ = logger;
    this.config_ = {
      storageZoneName: options.storageZoneName,
      accessKey: options.accessKey,
      pullZoneUrl: options.pullZoneUrl,
    };

    this.logger_.info(`BunnyCDN service initialized for storage zone: ${this.config_.storageZoneName}`);
  }

  static validateOptions(options: Record<string, any>) {
    const requiredFields = ['storageZoneName', 'accessKey', 'pullZoneUrl'];

    requiredFields.forEach((field) => {
      if (!options[field]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `${field} is required in the provider's options`
        );
      }
    });
  }

  async upload(file: ProviderUploadFileDTO): Promise<ProviderFileResultDTO> {
    if (!file || !file.filename) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'Invalid file upload request'
      );
    }

    try {
      const parsedFilename = path.parse(file.filename);
      const fileKey = `${parsedFilename.name}-${ulid()}${parsedFilename.ext}`;
      const uploadUrl = `https://storage.bunnycdn.com/${this.config_.storageZoneName}/${fileKey}`;
      const content = Buffer.isBuffer(file.content)
      ? file.content
      : Buffer.from(file.content, 'binary') // or try 'base64' if from frontend

      await axios.put(uploadUrl, content, {
        headers: {
          AccessKey: this.config_.accessKey,
          'Content-Type': file.mimeType,
        },
      });

      const fileUrl = `${this.config_.pullZoneUrl}/${fileKey}`;
      this.logger_.info(`Uploaded file ${fileKey} to BunnyCDN`);

      return { url: fileUrl, key: fileKey };
    } catch (error) {
      this.logger_.error(`Failed to upload file to BunnyCDN: ${error.message}`);
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to upload file: ${error.message}`
      );
    }
  }

  async delete(fileData: ProviderDeleteFileDTO): Promise<void> {
    if (!fileData?.fileKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No file key provided for deletion'
      );
    }

    try {
      const deleteUrl = `https://storage.bunnycdn.com/${this.config_.storageZoneName}/${fileData.fileKey}`;

      await axios.delete(deleteUrl, {
        headers: {
          AccessKey: this.config_.accessKey,
        },
      });

      this.logger_.info(`Deleted file ${fileData.fileKey} from BunnyCDN`);
    } catch (error) {
      this.logger_.warn(`Failed to delete file from BunnyCDN: ${error.message}`);
    }
  }

  async getPresignedDownloadUrl(fileData: ProviderGetFileDTO): Promise<string> {
    if (!fileData?.fileKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        'No file key provided for download URL'
      );
    }

    return `${this.config_.pullZoneUrl}/${fileData.fileKey}`;
  }
}

export default BunnyFileProviderService;

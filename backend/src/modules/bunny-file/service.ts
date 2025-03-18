import {
    AbstractFileProviderService,
    MedusaError
  } from "@medusajs/framework/utils"
  import {
    ProviderUploadFileDTO,
    ProviderDeleteFileDTO,
    ProviderFileResultDTO,
    ProviderGetFileDTO
  } from "@medusajs/framework/types"
  import axios from "axios"
  import path from "path"
  import { ulid } from "ulid"
  
  export interface BunnyFileProviderOptions {
    storageZoneName: string
    accessKey: string
    pullZoneUrl: string
  }
  
  class BunnyFileProviderService extends AbstractFileProviderService {
    static identifier = "bunny"
  
    protected config_: BunnyFileProviderOptions
  
    constructor(_: Record<string, unknown>, options: BunnyFileProviderOptions) {
      super()
  
      // Store the Bunny config (storage zone, API key, etc.)
      this.config_ = {
        storageZoneName: options.storageZoneName,
        accessKey: options.accessKey,
        pullZoneUrl: options.pullZoneUrl
      }
  
      // Optionally validate any required fields
      BunnyFileProviderService.validateOptions(this.config_)
    }
  
    static validateOptions(options: Record<string, unknown>) {
      const requiredFields = ["storageZoneName", "accessKey", "pullZoneUrl"]
      for (const field of requiredFields) {
        if (!options[field]) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `${field} is required in the provider's options`
          )
        }
      }
    }
  
    /**
     * Upload a file to Bunny.net
     * @param file - File data
     * @returns { url, key } - The public URL and file key
     */
    async upload(file: ProviderUploadFileDTO): Promise<ProviderFileResultDTO> {
      if (!file?.filename) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "No filename provided"
        )
      }
  
      try {
        // Generate a unique file key
        const parsedFilename = path.parse(file.filename)
        const fileKey = `${parsedFilename.name}-${ulid()}${parsedFilename.ext}`
  
        // Bunny storage URL for PUT
        const uploadUrl = `https://storage.bunnycdn.com/${this.config_.storageZoneName}/${fileKey}`
  
        await axios.put(uploadUrl, file.content, {
          headers: {
            AccessKey: this.config_.accessKey,
            "Content-Type": file.mimeType ?? "application/octet-stream",
          },
        })
  
        // This is the public CDN URL where the file can be accessed
        const url = `${this.config_.pullZoneUrl}/${fileKey}`
  
        return { url, key: fileKey }
      } catch (error: any) {
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `Failed to upload file to BunnyCDN: ${error.message}`
        )
      }
    }
  
    /**
     * Delete a file from Bunny.net
     * @param fileData - Must include { fileKey }
     */
    async delete(fileData: ProviderDeleteFileDTO): Promise<void> {
      if (!fileData?.fileKey) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "No file key provided"
        )
      }
  
      try {
        const deleteUrl = `https://storage.bunnycdn.com/${this.config_.storageZoneName}/${fileData.fileKey}`
        await axios.delete(deleteUrl, {
          headers: {
            AccessKey: this.config_.accessKey,
          },
        })
      } catch (error: any) {
        // If the file doesn't exist or can't be deleted, just log
        // so your admin UI doesn't break.
        console.warn(`[BunnyFileProviderService]: ${error.message}`)
      }
    }
  
    /**
     * Generate a download URL for the stored file
     */
    async getPresignedDownloadUrl(fileData: ProviderGetFileDTO): Promise<string> {
      if (!fileData?.fileKey) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "No file key provided"
        )
      }
  
      // BunnyCDN doesn't have a "presigned" URL feature like S3,
      // so we just return the Pull Zone URL + fileKey.
      return `${this.config_.pullZoneUrl}/${fileData.fileKey}`
    }
  }
  
  export default BunnyFileProviderService
  
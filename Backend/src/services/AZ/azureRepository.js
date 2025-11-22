const fs = require("fs");
const path = require("path");
const azureClient = require("./azureClient");
const IStorageRepository = require("../IStorageRepository");
const {
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

class AzureRepository extends IStorageRepository {
  constructor() {
    super();
    this.client = azureClient.getClient();
    this.containerName = azureClient.getContainerName();
  }

  async getSignedUrl(fileName, fileType = "application/octet-stream") {
    try {
      if (!this.client) throw new Error("Azure client no inicializado");

      const containerClient = this.client.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      // Permisos correctos para subir archivos
      const sasOptions = {
        containerName: this.containerName,
        blobName: fileName,
        permissions: BlobSASPermissions.parse("cw"), // write + create
        startsOn: new Date(),
        expiresOn: new Date(Date.now() + 60 * 60 * 1000),
        contentType: fileType,
      };

      const sharedKeyCredential = new StorageSharedKeyCredential(
        process.env.AZURE_STORAGE_ACCOUNT_NAME,
        process.env.AZURE_STORAGE_ACCOUNT_KEY
      );

      const sasToken = generateBlobSASQueryParameters(
        sasOptions,
        sharedKeyCredential
      ).toString();

      return `${blockBlobClient.url}?${sasToken}`;
    } catch (error) {
      console.error("Error generando Azure SAS:", error);
      throw error;
    }
  }

  async listObjects(provider = "azure") {
    if (!this.client) {
      console.warn("Cliente Azure no disponible");
      return { bucket: this.containerName, objects: [] };
    }

    const containerClient = this.client.getContainerClient(this.containerName);
    const exists = await containerClient.exists();
    if (!exists) return { bucket: this.containerName, objects: [] };

    const objects = [];

    for await (const blob of containerClient.listBlobsFlat()) {
      objects.push({
        fileName: blob.name,
        size: blob.properties.contentLength,
        lastModified: blob.properties.lastModified,
        cloud: provider,
      });
    }

    return {
      bucket: this.containerName,
      objects,
    };
  }

  async upload() {
    throw new Error("Azure solo usa presigned URL para uploads");
  }
}

module.exports = AzureRepository;

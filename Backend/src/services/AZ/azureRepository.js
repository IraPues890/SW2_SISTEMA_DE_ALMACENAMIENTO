const fs = require("fs");
const path = require("path");
const azureClient = require("./azureClient");
const IStorageRepository = require("../IStorageRepository");
const { generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = require("@azure/storage-blob");

class AzureRepository extends IStorageRepository {
    constructor() {
        super();
        this.client = azureClient.getClient();
        this.containerName = azureClient.getContainerName();
    }

    async getSignedUrl(fileName) {
        try {
            if (!this.client) throw new Error("Cliente de Azure no inicializado");

            const containerClient = this.client.getContainerClient(this.containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(fileName);

            const sasOptions = {
                containerName: this.containerName,
                blobName: fileName,
                permissions: BlobSASPermissions.parse("c"),
                startsOn: new Date(),
                expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
            };

            const sharedKeyCredential = new StorageSharedKeyCredential(
                process.env.AZURE_STORAGE_ACCOUNT_NAME,
                process.env.AZURE_STORAGE_ACCOUNT_KEY
            );

            const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

            return `${blockBlobClient.url}?${sasToken}`;

        } catch (error) {
            console.error("Error generando SAS Token en Azure:", error);
            throw error;
        }
    }

    async listObjects(provider = 'azure') { 
        if (!this.client) {
            console.warn("Cliente Azure no disponible al listar");
            return { bucket: this.containerName, objects: [] };
        }

        try {
            const containerClient = this.client.getContainerClient(this.containerName);

            // Verificamos si existe antes de listar para evitar errores 404
            const exists = await containerClient.exists();
            if (!exists) {
                return { bucket: this.containerName, objects: [] };
            }

            const objects = [];

            // Azure usa un iterador asíncrono, hay que recorrerlo así:
            for await (const blob of containerClient.listBlobsFlat()) {
                objects.push({
                    fileName: blob.name,
                    size: blob.properties.contentLength,
                    lastModified: blob.properties.lastModified, 
                    cloud: provider                     
                });
            }

            return {
                bucket: this.containerName,
                objects,
            };
        } catch (error) {
            console.error("Error listando en Azure:", error);
            throw error;
        }
    }

    async downloadObject(fileName, destinationPath) {
        const containerClient = this.client.getContainerClient(this.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        const dir = path.dirname(destinationPath);
        await fs.promises.mkdir(dir, { recursive: true });

        const downloadBlockBlobResponse = await blockBlobClient.download(0);

        return new Promise((resolve, reject) => {
            const writableStream = fs.createWriteStream(destinationPath);
            downloadBlockBlobResponse.readableStreamBody.pipe(writableStream);

            writableStream.on("finish", () => {
                resolve({
                    fileName,
                    bucket: this.containerName,
                    destination: destinationPath,
                    downloaded: true
                });
            });
            writableStream.on("error", reject);
        });
    }

    async deleteObject(fileName) {
        const containerClient = this.client.getContainerClient(this.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        await blockBlobClient.delete();

        return {
            fileName,
            bucket: this.containerName,
            deleted: true
        };
    }


    async upload(filePath, fileName) {
        // Implementación opcional Server-Side...
        throw new Error("Utilice getSignedUrl para subidas desde el cliente en Azure.");
    }
}

module.exports = AzureRepository;
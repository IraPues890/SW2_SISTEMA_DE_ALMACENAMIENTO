const { BlockBlobClient } = require("@azure/storage-blob");
const fs = require("fs");
const azureClient = require("./azureClient");

class AzureRepository {
    constructor() {
        this.client = azureClient.getClient();
        this.containerName = "zaperoko-container";
        // Alternativa: this.containerName = process.env.AZURE_CONTAINER
    }
    async upload(filePath, fileName) {
        const containerClient = this.client.getContainerClient(this.containerName);

        // Creamos el container si no existe
        await containerClient.createIfNotExists();

        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.uploadStream(fs.createReadStream(filePath));
        return `Archivo ${blobName} subido a Azure Blob Storage`;
    }
}

module.exports = new AzureRepository();
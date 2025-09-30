const fs = require("fs");
const azureClient = require("./azureClient");
const IStorageRepository = require("../IStorageRepository");

class AzureRepository extends IStorageRepository {
    constructor() {
        super();
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
        return {
            bucket: this.containerName,
            fileName,
            uploaded: true,
        };
    }
    async listObjects() {
        const containerClient = this.client.getContainerClient(this.containerName);

        // Creamos el container si no existe
        await containerClient.createIfNotExists();
        return containerClient.listBlobsFlat;
    }
}

module.exports = AzureRepository;

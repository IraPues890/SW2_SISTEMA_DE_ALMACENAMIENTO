const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
require('dotenv').config();

class AzureClient {
    constructor() {
        try {
            const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
            const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
            const containerName = process.env.AZURE_CONTAINER_NAME;
            
            if (!accountName || !accountKey || !containerName) {
                throw new Error("Faltan variables de entorno: AZURE_STORAGE_ACCOUNT_NAME, AZURE_STORAGE_ACCOUNT_KEY o AZURE_CONTAINER_NAME");
            }

            const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
            this.client = new BlobServiceClient(
                `https://${accountName}.blob.core.windows.net`,
                sharedKeyCredential
            );
            
            this.containerName = containerName;
            console.log('CLIENTE AZURE INICIALIZADO CON ÉXITO!!');

        } catch (error) {
            console.warn('!!! CLIENTE AZURE FALLÓ: ', error.message);
            this.client = null;
            this.containerName = null;
        }
    }

    getClient() {
        return this.client;
    }

    getContainerName() {
        return this.containerName;
    }

    isAvailable() {
        return this.client !== null;
    }
}

module.exports = new AzureClient();

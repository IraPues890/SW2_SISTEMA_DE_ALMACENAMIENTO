const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
require('dotenv').config();

class AzureClient {
    constructor() {
        try {
            const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
            const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
            
            if (!accountName || !accountKey) {
                console.warn('⚠️  Azure credentials not found in .env - Azure storage will be disabled');
                this.client = null;
                this.containerName = null;
                return;
            }

            // Crear credenciales y cliente
            const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
            this.client = new BlobServiceClient(
                `https://${accountName}.blob.core.windows.net`,
                sharedKeyCredential
            );
            
            this.containerName = process.env.AZURE_CONTAINER_NAME;
            console.log('✅ Azure Blob Storage client initialized successfully');
        } catch (error) {
            console.warn('⚠️  Azure Blob Storage initialization failed:', error.message);
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

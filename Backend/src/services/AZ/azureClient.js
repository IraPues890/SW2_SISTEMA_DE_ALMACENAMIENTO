const { BlobServiceClient } = require("@azure/storage-blob");

class AzureClient {
    constructor() {
        // Debido a la configuración, se lee desde las variables de entorno de la VM
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error("Debes definir la variable AZURE_STORAGE_CONNECTION_STRING");
        }
        this.client = BlobServiceClient.fromConnectionString(connectionString);
    }
    getClient() {
        return this.client;
    }
}

module.exports = new AzureClient();
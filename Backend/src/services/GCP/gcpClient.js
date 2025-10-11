const { Storage } = require("@google-cloud/storage");
require('dotenv').config();

class GoogleClient {
    constructor() {
        try {
            const projectId = process.env.GCP_PROJECT_ID;
            const keyFilename = process.env.GCP_KEY_FILE_PATH;

            if (!projectId) {
                console.warn('⚠️  GCP credentials not found in .env - Google Cloud Storage will be disabled');
                this.client = null;
                this.bucketName = null;
                return;
            }

            // Configuración del cliente
            const config = {
                projectId: projectId
            };

            // Si hay un archivo de clave de servicio, usarlo
            if (keyFilename) {
                config.keyFilename = keyFilename;
            }

            this.client = new Storage(config);
            this.bucketName = process.env.GCP_BUCKET_NAME;
            console.log('✅ Google Cloud Storage client initialized successfully');
        } catch (error) {
            console.warn('⚠️  Google Cloud Storage initialization failed:', error.message);
            this.client = null;
            this.bucketName = null;
        }
    }

    getClient() {
        return this.client;
    }

    getBucketName() {
        return this.bucketName;
    }

    isAvailable() {
        return this.client !== null;
    }
}

module.exports = new GoogleClient();
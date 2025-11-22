const { Storage } = require("@google-cloud/storage");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

class GoogleClient {
    constructor() {
        try {
            const keyFilename = process.env.GCP_KEY_FILE_PATH;
            const bucketName = process.env.GCP_BUCKET_NAME;

            if (!keyFilename) {
                throw new Error("Falta la variable de entorno GCP_KEY_FILE_PATH para la autenticación");
            }
            
            if (!bucketName) {
                throw new Error("Falta la variable de entorno GCP_BUCKET_NAME");
            }

            this.client = new Storage({ keyFilename });
            this.bucketName = bucketName;
            
            console.log('CLIENTE GCP INICIALIZADO CON ÉXITO!!');

        } catch (error) {
            console.warn('!!! CLIENTE GCP FALLÓ: ', error.message);
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
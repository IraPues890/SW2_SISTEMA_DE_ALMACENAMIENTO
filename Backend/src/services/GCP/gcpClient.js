const { Storage } = require("@google-cloud/storage");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

class GoogleClient {
    constructor() {
        try {
            const keyFilename = process.env.GCP_KEY_FILE_PATH || null;

            if (!keyFilename) {
                console.warn('!!! NO SE ENCONTRÓ EL JSON DE AUTENTICACIÓN PARA GCP !!!');
                this.client = null;
                this.bucketName = null;
                return;
            }
            this.client = new Storage(keyFilename);
            if (!process.env.GCP_BUCKET_NAME) {
                console.warn('!!! NO SE ENCONTRÓ NINGÚN NOMBRE DE BUCKET PARA GCP EN .ENV !!!')
            }
            this.bucketName = process.env.GCP_BUCKET_NAME;
            console.log('CLIENTE DE GCP INICIALIZADO CON ÉXITO');
        } catch (error) {
            console.warn('!!! CLIENTE GCP FALLÓ !!!', error.message);
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
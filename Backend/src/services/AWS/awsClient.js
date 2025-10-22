const AWS = require('aws-sdk');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

class AmazonClient {
    constructor() {
        try {
            // ⚠️ Sobrescribe si detecta "test"
            if (process.env.AWS_ACCESS_KEY_ID === 'test') {
                console.warn('⚠️ Detectado entorno LocalStack: forzando uso de credenciales reales del .env');
                process.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID_REAL;
                process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY_REAL;
            }
            
            console.log("🔍 AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
            console.log("🔍 AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY);
            console.log("🔍 AWS_REGION:", process.env.AWS_REGION);
            console.log("🔍 AWS_BUCKET_NAME:", process.env.AWS_BUCKET_NAME);

            // Configurar AWS con credenciales del .env
            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            });

            // Crear cliente S3
            this.s3 = new AWS.S3();
            this.bucketName = process.env.AWS_BUCKET_NAME;
            console.log('✅ AWS S3 client initialized successfully');
        } catch (error) {
            console.warn('⚠️  AWS S3 initialization failed:', error.message);
            this.s3 = null;
            this.bucketName = null;
        }
    }

    getClient() {
        return this.s3;
    }

    getBucketName() {
        return this.bucketName;
    }

    isAvailable() {
        return this.s3 !== null;
    }
}

module.exports = new AmazonClient();

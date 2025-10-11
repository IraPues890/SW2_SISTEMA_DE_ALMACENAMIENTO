const AWS = require('aws-sdk');
require('dotenv').config();

class AmazonClient {
    constructor() {
        try {
            // Verificar si tenemos credenciales de AWS
            if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
                console.warn('⚠️  AWS credentials not found in .env - AWS storage will be disabled');
                this.s3 = null;
                this.bucketName = null;
                return;
            }

            // Configurar AWS con credenciales del .env
            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION || 'us-east-1'
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

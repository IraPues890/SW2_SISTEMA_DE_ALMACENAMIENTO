const AWS = require('aws-sdk');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

class AmazonClient {
    constructor() {
        try {
            if (process.env.AWS_ACCESS_KEY_ID === undefined 
                || process.env.AWS_ACCESS_KEY_ID === undefined  
                || process.env.AWS_SECRET_ACCESS_KEY === undefined) {
                throw new Error ("CREDENCIALES NO VALIDADAS DE AWS")
            }

            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            });

            // Crear cliente S3
            this.s3 = new AWS.S3();
            this.bucketName = process.env.AWS_BUCKET_NAME;
            console.log('CLIENTE DE AWS INCIALIZADO CON ÉXITO!!');
        } catch (error) {
            console.warn('CLIENTE DE AWS FALLÓ: ', error.message);
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

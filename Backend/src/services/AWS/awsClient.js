const { S3Client } = require("@aws-sdk/client-s3");

class AmazonClient {
    constructor() {
        // Crea el cliente y lo guarda en la clase
        this.client = new S3Client({
            region: process.env.AWS_REGION
        });
    }

    getClient() {
        return this.client;
    }
}

module.exports = new AmazonClient();

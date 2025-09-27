const { PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const awsClient = require("./awsClient");

class AmazonRepository {
    constructor() {
        this.client = awsClient.getClient();
        this.bucketName = "giomar-nos-debe-broster";
        // Alternativa: this.bucketName = process.env.AWS_BUCKET
    }
    async upload(filePath, fileName) {
        const putObjectCommand = new PutObjectCommand ({
            Bucket: this.bucketName,
            Key: fileName,
            Body: fs.createReadStream(filePath)
        });
        await this.client.send(putObjectCommand);
        return `Archivo ${fileName} subido a AWS S3`;
    }
}

module.exports = new AmazonRepository();

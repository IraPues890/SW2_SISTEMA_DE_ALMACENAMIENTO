const fs = require("fs");
const gcpClient = require("./gcpClient");

class GoogleRepository {
    constructor() {
        this.client = gcpClient.getClient();
        this.bucketName = "zaperoko-bucket";
        // Alternativa: this.bucketName = process.env.GSC_BUCKET
    }
    async upload(filePath, fileName) {
        const bucket = this.client.bucket(this.bucketName);
        await bucket.upload(filePath, {
            destination: fileName,
            resumable: false,
        });

        return `Archivo ${fileName} subido a Google Cloud Storage`;
    }
}
module.exports = new GoogleRepository();
const fs = require("fs");
const gcpClient = require("./gcpClient");

class GoogleRepository {
    constructor() {
        this.client = gcpClient.getClient();
        this.bucketName = "zaperoko-bucket";
        // Alternativa: this.bucketName = process.env.GSC_BUCKET
    }
    async upload(filePath, fileName) {
        const uploadRequest = {
            destination: fileName,
            resumable: false,
        }
        await this.client.upload(fs.createReadStream(filePath),uploadRequest);
        return `Archivo ${fileName} subido a Google Cloud Storage`;
    }
}
module.exports = new GoogleRepository();
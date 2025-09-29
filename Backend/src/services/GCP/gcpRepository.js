const fs = require("fs");
const gcpClient = require("./gcpClient");
const IStorageRepository = require("../IStorageRepository");

class GoogleRepository extends IStorageRepository {
    constructor() {
        super();
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
        return {
            fileName,
            bucket: this.bucketName,
            uploaded: true,
        };
    }
    async listObjects() {
        const bucket = this.client.bucket(this.bucketName);
        await bucket.getFiles();
    }
}
module.exports = GoogleRepository;

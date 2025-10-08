const fs = require("fs");
const path = require("path");
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
        const [files] = await bucket.getFiles();
        return files.map(file => ({
            fileName: file.name,
            bucket: this.bucketName,
            updated: file.metadata.updated,
        }));
    }


    async downloadObject(fileName, destinationPath) {
        const bucket = this.client.bucket(this.bucketName);
        const file = bucket.file(fileName);
        const dir = path.dirname(destinationPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        await file.download({ destination: destinationPath });

        return {
            fileName,
            bucket: this.bucketName,
            destination: destinationPath,
            downloaded: true,
        };
    }
    
    async deleteObject(fileName) {
        const bucket = this.client.bucket(this.bucketName);
        const file = bucket.file(fileName);
        await file.delete();

        return { fileName, bucket: this.bucketName, deleted: true };
    }
    
    async createFolder(folderName) {
        const bucket = this.client.bucket(this.bucketName);
        const folderKey = folderName.endsWith("/") ? folderName : `${folderName}/`;
        const file = bucket.file(folderKey);

        await file.save("");

        return {
          folderName: folderKey,
          bucket: this.bucketName,
          created: true,
        };
    }
}

module.exports = GoogleRepository;

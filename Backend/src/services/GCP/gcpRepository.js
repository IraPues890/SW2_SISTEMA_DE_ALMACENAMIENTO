const fs = require("fs");
const path = require("path");
const gcpClient = require("./gcpClient");
const IStorageRepository = require("../IStorageRepository");

class GoogleRepository extends IStorageRepository {
    constructor() {
        super();
        this.client = gcpClient.getClient();
        this.bucketName = gcpClient.getBucketName();
    }

    async getSignedUrl(fileName, fileType) {
        try {
            const bucket = this.client.bucket(this.bucketName);
            const file = bucket.file(fileName);

            const options = {
                version: 'v4',
                action: 'write',
                expires: Date.now() + 60 * 60 * 1000, 
                contentType: fileType, 
            };

            const [url] = await file.getSignedUrl(options);
            return url;

        } catch (error) {
            console.error("Error generando Signed URL en GCP:", error);
            throw error;
        }
    }

    async listObjects(provider) {
        const bucket = this.client.bucket(this.bucketName);
        const [files] = await bucket.getFiles();
        
        const objects = files.map(file => ({
            fileName: file.name,
            size: parseInt(file.metadata.size), 
            lastModified: file.metadata.updated,
            cloud: provider 
        }));

        return {
            bucket: this.bucketName,
            objects,
        };
    }

    async downloadObject(fileName, destinationPath) {
        const bucket = this.client.bucket(this.bucketName);
        const file = bucket.file(fileName);
        
        const dir = path.dirname(destinationPath);
        await fs.promises.mkdir(dir, { recursive: true });

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

        return { 
            fileName, 
            bucket: this.bucketName, 
            deleted: true 
        };
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
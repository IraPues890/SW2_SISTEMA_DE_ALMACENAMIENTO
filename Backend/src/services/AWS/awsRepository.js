const fs = require("fs");
const { PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const awsClient = require("./awsClient");
const IStorageRepository = require("../IStorageRepository");

class AmazonRepository extends IStorageRepository {
    constructor() {
        super();
        this.client = awsClient.getClient();
        this.bucketName = "giomar-nos-debe-broster";
        // Alternativa: this.bucketName = process.env.AWS_BUCKET
    }

    async upload(filePath, fileName) {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: fs.createReadStream(filePath),
        });

        await this.client.send(command);

        return {
            fileName,
            bucket: this.bucketName,
            uploaded: true,
        };
    }

    async listObjects() {
        const command = new ListObjectsV2Command({
            Bucket: this.bucketName,
        });

        const response = await this.client.send(command);

        const objects =
            response.Contents?.map((obj) => ({
                fileName: obj.Key,
                size: obj.Size,
                lastModified: obj.LastModified,
            })) || [];

        return {
            bucket: this.bucketName,
            objects,
        };
    }

    async downloadObject(fileName, destinationPath) {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
        });

        const response = await this.client.send(command);
        const writeStream = fs.createWriteStream(destinationPath);

        await new Promise((resolve, reject) => {
            response.Body.pipe(writeStream)
                .on("finish", resolve)
                .on("error", reject);
        });

        return {
            fileName,
            bucket: this.bucketName,
            destination: destinationPath,
            downloaded: true,
        };
    }

    async deleteObject(fileName) {

        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
        });

        await this.client.send(command);

        return {
            fileName,
            bucket: this.bucketName,
            deleted: true,
        };
    }
    
    async createFolder(folderName) {
        const params = {
          Bucket: this.bucketName,
          Key: folderName.endsWith("/") ? folderName : `${folderName}/`,
          Body: "",
        };

        await this.client.send(new PutObjectCommand(params));

        return {
          folderName: params.Key,
          bucket: this.bucketName,
          created: true,
        };
    }
}

module.exports = AmazonRepository;

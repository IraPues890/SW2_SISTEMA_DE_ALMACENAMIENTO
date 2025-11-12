const fs = require("fs");
const path = require("path");
const awsClient = require("./awsClient");
const IStorageRepository = require("../IStorageRepository");
const { PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

class AmazonRepository extends IStorageRepository {
    constructor() {
        super();
        this.s3 = awsClient.getClient();
        this.bucketName = awsClient.getBucketName();
    }

    async uploadFile(fileName, fileBuffer) {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: fileName,
                Body: fileBuffer,
                ServerSideEncryption: 'AES256'
            };

            const result = await this.s3.upload(params).promise();
            return result.Location;
        } catch (error) {
            throw new Error(`Error uploading to AWS S3: ${error.message}`);
        }
    }

    async downloadFile(fileName) {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: fileName
            };

            const result = await this.s3.getObject(params).promise();
            return result.Body;
        } catch (error) {
            throw new Error(`Error downloading from AWS S3: ${error.message}`);
        }
    }

    async deleteFile(fileName) {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: fileName
            };

            await this.s3.deleteObject(params).promise();
            return true;
        } catch (error) {
            throw new Error(`Error deleting from AWS S3: ${error.message}`);
        }
    }

    async listFiles(prefix = '') {
        try {
            const params = {
                Bucket: this.bucketName,
                Prefix: prefix
            };

            const result = await this.s3.listObjectsV2(params).promise();
            return result.Contents || [];
        } catch (error) {
            throw new Error(`Error listing files from AWS S3: ${error.message}`);
        }
    }

    // Mantener compatibilidad con métodos anteriores
    async upload(filePath, fileName) {
        const fileBuffer = fs.readFileSync(filePath);
        return await this.uploadFile(fileName, fileBuffer);
    }

    async listObjects() {

        const params = {
                Bucket: this.bucketName
            };
        const result = await this.s3.listObjectsV2(params).promise();
        console.log('Respuesta de S3:', result);
        const objects =
            result.Contents?.map((obj) => ({
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

        const dir = path.dirname(destinationPath);
        await fs.promises.mkdir(dir, { recursive: true });

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

const fs = require("fs");
const archiver = require('archiver');
const awsClient = require("./awsClient");
const IStorageRepository = require("../IStorageRepository");
const { PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { filestorage } = require("oci-sdk");

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

    async downloadObject(fileName) {
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

    async downloadBulk(fileNames) {
        try {
            const archive = archiver('zip', {
                zlib: { level: 9 }
            });
            const archiveName = `files.zip`;
            const processFiles = async () => {
                for (const fileName of fileNames) {
                    try {
                        const s3Object = await this.s3.getObject({
                            Bucket: this.bucketName,
                            Key: fileName
                        }).promise();

                        archive.append(s3Object.Body, { name: fileName });

                    } catch (s3Error) {
                        console.error(`Error al obtener ${fileName}: ${s3Error.message}`);
                        archive.append(`Error al obtener ${fileName}`, { name: `${fileName}-ERROR.txt` });
                    }
                }
                archive.finalize();
            };

            processFiles().catch(err => {
                archive.emit('error', err);
            });

            return { archiveStream: archive, archiveName: archiveName };

        } catch (error) {
            // Este catch solo atrapará errores ANTES de crear el stream
            throw new Error(`Error preparando el zip: ${error.message}`);
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

const { PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const fs = require("fs");
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
        const putObjectCommand = new PutObjectCommand ({
            Bucket: this.bucketName,
            Key: fileName,
            Body: fs.createReadStream(filePath)
        });
        await this.client.send(putObjectCommand);
        return `Archivo ${fileName} subido a AWS S3`;
    }
    async listObjects() {
        const listObjectsCommand = new ListObjectsV2Command({
            Bucket: this.bucketName
        });

        const response = await this.client.send(listObjectsCommand);

        const objects =
            response.Contents?.map(obj => ({
                fileName: obj.Key,
                size: obj.Size,
                lastModified: obj.LastModified,
            })) || [];

        return {
            bucket: this.bucketName,
            objects,
        };
    }

    /**/ 
    async downloadObject(fileName, destinationPath) {
      const getObjectRequest = {
        Bucket: this.bucketName,
        Key: fileName,
      };

      const response = await this.client.send(new GetObjectCommand(getObjectRequest));

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
}

module.exports = AmazonRepository;

const fs = require("fs");
const oracleClient = require("./oracleClient");
const IStorageRepository = require("../IStorageRepository");

class OracleRepository extends IStorageRepository {
  constructor() {
    super();
    this.client = oracleClient.getClient();
    this.bucketName = "mi_bucket";
    // Alternativa: this.bucketName = process.env.ORACLE_BUCKET
  }

  async upload(filePath, fileName) {
    const { value: namespaceName } = await this.client.getNamespace({});
    const putObjectRequest = {
      namespaceName,
      bucketName: this.bucketName,
      objectName: fileName,
      putObjectBody: fs.createReadStream(filePath),
    };

    await this.client.putObject(putObjectRequest);
    return {
      fileName,
      bucket: this.bucketName,
      uploaded: true,
    };
  }

  async listObjects() {
    const { value: namespaceName } = await this.client.getNamespace({});
    const listObjectsRequest = {
      namespaceName,
      bucketName: this.bucketName
    };
    
    const response = await this.client.listObjects(listObjectsRequest);
    return {
        bucket: this.bucketName,
        objects: response.listObjects.objects.map(obj => ({
            fileName: obj.name,
            size: obj.size,
            etag: obj.etag,
            storageTier: obj.storageTier
    })),
    };
  }

  /**/ 
  async downloadObject(fileName, destinationPath) {
    const { value: namespaceName } = await this.client.getNamespace({});
    const getObjectRequest = {
      namespaceName,
      bucketName: this.bucketName,
      objectName: fileName,
    };

    const response = await this.client.getObject(getObjectRequest);

    await fs.promises.writeFile(destinationPath, response.value);

    return {
      fileName,
      bucket: this.bucketName,
      destination: destinationPath,
      downloaded: true,
    };
  }
}

module.exports = OracleRepository;


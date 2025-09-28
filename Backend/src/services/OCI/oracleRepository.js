const fs = require("fs");
const oracleClient = require("./oracleClient");

class OracleRepository {
  constructor() {
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
    return response.listObjects.objects.map(obj => ({
        name: obj.name,
        size: obj.size,
        timeCreated: obj.timeCreated
    }));
  }
}

module.exports = new OracleRepository();


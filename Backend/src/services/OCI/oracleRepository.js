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
    return `Archivo ${fileName} subido a Oracle Object Storage`;
  }
}

module.exports = new OracleRepository();

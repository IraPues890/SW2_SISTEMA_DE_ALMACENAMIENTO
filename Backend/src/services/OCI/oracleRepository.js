const fs = require("fs");
const path = require("path");
const oracleClient = require("./oracleClient");
const IStorageRepository = require("../IStorageRepository");
const OCI = require("oci-objectstorage");

class OracleRepository extends IStorageRepository {
  constructor() {
    super();
    this.client = oracleClient.getClient();
    this.bucketName = oracleClient.getBucketName();
    this.namespace = oracleClient.getNamespace();
  }

  async getSignedUrl(fileName) {
    if (!this.client) {
      throw new Error("Cliente de Oracle no está disponible.");
    }

    const createParDetails = {
      name: `par-upload-${fileName}-${Date.now()}`,
      objectName: fileName,
      accessType: OCI.models.PreauthenticatedRequest.AccessType.ObjectWrite,
      timeExpires: new Date(Date.now() + 60 * 60 * 1000)
    };

    const createParRequest = {
      namespaceName: this.namespace,
      bucketName: this.bucketName,
      createPreauthenticatedRequestDetails: createParDetails
    };

    try {
      const response = await this.client.createPreauthenticatedRequest(createParRequest);
      const parUrl = `${this.client.endpoint}${response.preauthenticatedRequest.accessUri}`;
      return parUrl;

    } catch (err) {
      console.error("Error creando PAR de escritura en OCI:", err);
      throw err;
    }
  }

  async listObjects(provider) {
    const listObjectsRequest = {
      namespaceName: this.namespace,
      bucketName: this.bucketName,
      fields: "size,timeCreated",
    };
    
    const response = await this.client.listObjects(listObjectsRequest);

    const objects = response.listObjects.objects.map(obj => ({
      fileName: obj.name,
      size: obj.size,
      lastModified: obj.timeCreated,
      cloud: provider
    }));

    return {
      bucket: this.bucketName,
      objects,
    };
  }

  async downloadObject(fileName, destinationPath) {
    const { value: namespaceName } = await this.client.getNamespace({});

    const getObjectRequest = {
      namespaceName,
      bucketName: this.bucketName,
      objectName: fileName,
    };

    const dir = path.dirname(destinationPath);
    await fs.promises.mkdir(dir, { recursive: true });

    const response = await this.client.getObject(getObjectRequest);

    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(destinationPath);
      response.value
        .pipe(writeStream)
        .on("finish", () => {
          resolve({
            fileName,
            bucket: this.bucketName,
            destination: destinationPath,
            downloaded: true,
          });
        })
        .on("error", reject);
    });
  }

  async deleteObject(fileName) {

    const deleteObjectRequest = {
      namespaceName: this.namespace,
      bucketName: this.bucketName,
      objectName: fileName,
    };

    await this.client.deleteObject(deleteObjectRequest);

    return {
      fileName,
      bucket: this.bucketName,
      deleted: true,
    };
  }

  async createFolder(folderName) {
    const { value: namespaceName } = await this.client.getNamespace({});

    const folderKey = folderName.endsWith("/") ? folderName : `${folderName}/`;
    const putObjectRequest = {
      namespaceName,
      bucketName: this.bucketName,
      objectName: folderKey,
      putObjectBody: Buffer.from(""),
    };

    await this.client.putObject(putObjectRequest);

    return {
      folderName: folderKey,
      bucket: this.bucketName,
      created: true,
    };
  }
}

module.exports = OracleRepository;

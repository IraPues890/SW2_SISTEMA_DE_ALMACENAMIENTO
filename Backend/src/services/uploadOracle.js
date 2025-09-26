const fs = require("fs");
const common = require("oci-common");
const objectStorage = require("oci-objectstorage");

const provider = new common.ConfigFileAuthenticationDetailsProvider();
const client = new objectStorage.ObjectStorageClient({
  authenticationDetailsProvider: provider,
});

const bucketName = "mi_bucket";

async function uploadToOracle(filePath, fileName) {
  const { value: namespaceName } = await client.getNamespace({});

  const putObjectRequest = {
    namespaceName,
    bucketName,
    objectName: fileName,
    putObjectBody: fs.createReadStream(filePath),
  };

  await client.putObject(putObjectRequest);
}

module.exports = { uploadToOracle };


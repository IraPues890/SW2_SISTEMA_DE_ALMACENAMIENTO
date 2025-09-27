const fs = require("fs");
const { ConfigFileAuthenticationDetailsProvider } = require("oci-common");
const { ObjectStorageClient } = require("oci-objectstorage");

// Obtenemos credenciales de la VM
const provider = new ConfigFileAuthenticationDetailsProvider();

const client = new ObjectStorageClient({
  authenticationDetailsProvider: provider,
});

//Definimos el nombre del bucket
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



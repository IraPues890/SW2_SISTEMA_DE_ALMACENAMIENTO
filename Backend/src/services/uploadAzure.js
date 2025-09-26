const fs = require("fs");
const { BlobServiceClient } = require("@azure/storage-blob");

// URL de conexión de Azure Storage (lo obtienes desde el portal)
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = "mystoragecontainer";

async function uploadToAzure(filePath, fileName) {
  if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error("Debes definir la variable de entorno AZURE_STORAGE_CONNECTION_STRING");
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Crea el contenedor si no existe
  await containerClient.createIfNotExists();

  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  await blockBlobClient.uploadFile(filePath);
}

module.exports = { uploadToAzure };


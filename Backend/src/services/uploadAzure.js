const fs = require("fs");
const { BlobServiceClient } = require("@azure/storage-blob");

// Obtenemos variable de entorno de la VM
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw new Error("No se encuentra la variable de entorno o se debe definir AZURE_STORAGE_CONNECTION_STRING");
}

//Definimos el nombre del contenedor (bucket)
const containerName = "mystoragecontainer";

async function uploadToAzure(filePath, fileName) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Crea el contenedor si no existe
  await containerClient.createIfNotExists();

  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  await blockBlobClient.uploadFile(filePath);
}

module.exports = { uploadToAzure };


const path = require("path");
const { Storage } = require("@google-cloud/storage");

// Obtenemos credenciales almaneadas dentro de la VM (dentro de .env)
const storage = new Storage();

// Nombre del bucket
const bucketName = "zaperoko-bucket";
  
async function uploadToGCP(filePath, fileName) {  
  const bucket = storage.bucket(bucketName);
  await bucket.upload(filePath, {
    destination: fileName,
    resumable: false,
  });
  return `Archivo ${fileName} subido a GCP Storage`;
}

module.exports = { uploadToGCP };


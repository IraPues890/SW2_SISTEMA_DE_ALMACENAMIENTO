const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Definimos la región de S3
const s3 = new S3Client({ region: "us-east-1" });

//Definimos el nombre del bucket
const bucketName = "giomar-nos-debe-broster";

async function uploadToAws(filePath, fileName) {
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileStream,
  };

  await s3.send(new PutObjectCommand(uploadParams));
  return `Archivo ${fileName} subido a AWS S3`;
}

module.exports = { uploadToAws };


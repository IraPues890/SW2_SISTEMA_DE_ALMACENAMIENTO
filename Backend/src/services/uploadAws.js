const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: "us-east-1" });
const bucketName = "giomar-nos-debe-broster";

async function uploadToAws(filePath, fileName) {
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileStream,
  };

  await s3.send(new PutObjectCommand(uploadParams));
}

module.exports = { uploadToAws };


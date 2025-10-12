const AWS = require('aws-sdk');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

async function testUpload() {
  const bucket = process.env.AWS_BUCKET_NAME;
  if (!bucket) {
    console.error('AWS_BUCKET_NAME not set');
    process.exit(1);
  }

  const key = 'test-upload-' + Date.now() + '.txt';
  const body = 'Prueba de upload desde script - ' + new Date().toISOString();

  try {
    const res = await s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: body
    }).promise();

    console.log('Upload OK. Key:', key, 'ETag:', res.ETag);
    console.log(`Object URL (if public): https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`);
  } catch (err) {
    console.error('Upload failed:');
    console.error(err);
    process.exit(2);
  }
}

testUpload();

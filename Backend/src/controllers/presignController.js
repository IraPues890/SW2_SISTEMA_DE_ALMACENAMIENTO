const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

async function getS3Presign(req, res) {
  try {
    const { key, contentType } = req.query;
    if (!key || !contentType) {
      return res.status(400).json({ success: false, message: 'key and contentType are required' });
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Expires: 60,
      ContentType: contentType
    };

    // Debug logs to help diagnose presign/upload issues
    console.log('🔍 Presign request params:', {
      Bucket: params.Bucket,
      Key: params.Key,
      Expires: params.Expires,
      ContentType: params.ContentType,
      AWS_REGION: process.env.AWS_REGION,
    });

    const url = await s3.getSignedUrlPromise('putObject', params);

    // Log a truncated version of the URL (avoid printing secrets in full)
    try {
      const safeUrl = typeof url === 'string' ? url.replace(/([&?]X-Amz-Signature=)[^&]+/, '$1[REDACTED]') : url;
      console.log('✅ Presigned URL generated (truncated):', safeUrl.substring(0, 150) + (safeUrl.length > 150 ? '...': ''));
    } catch (e) {
      console.log('✅ Presigned URL generated');
    }

    return res.json({ success: true, url });
  } catch (err) {
    console.error('Error generating presigned URL:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getS3Presign };

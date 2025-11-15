const OCI = require('oci-sdk');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

class OracleClient {
  constructor() {
    try {
      const config = {
        tenancy: process.env.OCI_TENANCY_ID,
        user: process.env.OCI_USER_ID,
        fingerprint: process.env.OCI_FINGERPRINT,
        privateKey: process.env.OCI_PRIVATE_KEY_PATH.replace(/\\n/g, '\n'),
        region: process.env.OCI_REGION
      };

      this.client = new OCI.objectstorage.ObjectStorageClient(config);

      this.bucketName = process.env.OCI_BUCKET_NAME;
      console.log('CLIENTE ORACLE INICIALIZADO CON ÉXITO!!');

    } catch (error) {
      console.warn('CLIENTE ORACLE FALLÓ: ', error.message);
      // Fallback para desarrollo local
      this.client = null;
      this.bucketName = null;
    }
  }

  getClient() {
    return this.client;
  }

  getBucketName() {
    return this.bucketName;
  }

  isAvailable() {
    return this.client !== null;
  }
}

module.exports = new OracleClient();

const OCI = require("oci-objectstorage");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

class OracleClient {
  constructor() {
    try {
      const config = {
        tenancy: process.env.OCI_TENANCY_ID,
        user: process.env.OCI_USER_ID,
        fingerprint: process.env.OCI_FINGERPRINT,
        privateKey: process.env.OCI_PRIVATE_KEY_PATH,
        region: process.env.OCI_REGION
      };
      this.bucketName = process.env.OCI_BUCKET_NAME;
      this.namespace = process.env.OCI_BUCKET_NAMESPACE;

      if (!this.bucketName || !this.namespace ) {
        throw new Error("Variables de entorno OCI_BUCKET_NAME o OCI_BUCKET_NAMESPACE no encontradas");
      }
      this.client = new OCI.ObjectStorageClient(config);
      this.client.endpoint = `https://objectstorage.${config.region}.oraclecloud.com`;
      
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

  getNamespace() {
    return this.namespace;
  }

  isAvailable() {
    return this.client !== null;
  }
}

module.exports = new OracleClient();

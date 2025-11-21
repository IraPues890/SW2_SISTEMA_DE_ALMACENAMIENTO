const OCI = require("oci-objectstorage");
const common = require("oci-common");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

class OracleClient {
  constructor() {
    try {
      const provider = new common.SimpleAuthenticationDetailsProvider(
        process.env.OCI_TENANCY_ID,
        process.env.OCI_USER_ID,
        process.env.OCI_FINGERPRINT,
        process.env.OCI_PRIVATE_KEY_PATH,
        null,
        common.Region.fromRegionId(process.env.OCI_REGION)
      );

      this.bucketName = process.env.OCI_BUCKET_NAME;
      this.namespace = process.env.OCI_BUCKET_NAMESPACE;

      if (!this.bucketName || !this.namespace) {
        throw new Error("Variables de entorno OCI_BUCKET_NAME o OCI_BUCKET_NAMESPACE no encontradas");
      }

      this.client = new OCI.ObjectStorageClient({
        authenticationDetailsProvider: provider
      });

      console.log('CLIENTE ORACLE INICIALIZADO CON ÉXITO!!');

    } catch (error) {
      console.warn('!!! CLIENTE ORACLE FALLÓ: ', error.message);
      // Fallback para desarrollo local
      this.client = null;
      this.bucketName = null;
      this.namespace = null;
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

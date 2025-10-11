const oci = require('oci-sdk');
const fs = require('fs');
require('dotenv').config();

class OracleClient {
  constructor() {
    try {
      // Configuración usando variables de entorno
      const configurationFilePath = "~/.oci/config";
      const configProfile = "DEFAULT";

      // Crear configuración desde variables de entorno
      const provider = new oci.common.ConfigFileAuthenticationDetailsProvider(
        configurationFilePath,
        configProfile
      );

      // Configuración alternativa usando .env directamente
      const config = {
        tenancyId: process.env.OCI_TENANCY_ID,
        userId: process.env.OCI_USER_ID,
        fingerprint: process.env.OCI_FINGERPRINT,
        privateKey: process.env.OCI_PRIVATE_KEY_PATH ? 
          fs.readFileSync(process.env.OCI_PRIVATE_KEY_PATH, 'utf8') : null,
        region: process.env.OCI_REGION || 'us-ashburn-1',
        compartmentId: process.env.OCI_COMPARTMENT_ID
      };

      this.client = new oci.objectstorage.ObjectStorageClient({
        authenticationDetailsProvider: provider
      });

      this.bucketName = process.env.OCI_BUCKET_NAME;
      this.namespace = process.env.OCI_NAMESPACE;
      this.compartmentId = process.env.OCI_COMPARTMENT_ID;
      console.log('✅ Oracle Cloud Storage client initialized successfully');

    } catch (error) {
      console.warn('⚠️  Oracle Cloud Storage initialization failed:', error.message);
      // Fallback para desarrollo local
      this.client = null;
      this.bucketName = null;
      this.namespace = null;
      this.compartmentId = null;
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

  getCompartmentId() {
    return this.compartmentId;
  }

  isAvailable() {
    return this.client !== null;
  }
}

module.exports = new OracleClient();
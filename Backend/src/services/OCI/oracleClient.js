const { ConfigFileAuthenticationDetailsProvider } = require("oci-common");
const { ObjectStorageClient } = require("oci-objectstorage");

class OracleClient {
  constructor() {
    // Obtenemos credenciales de la VM
    const provider = new ConfigFileAuthenticationDetailsProvider();
    // Pasamos las credenciales hacia el cliente para la autenticación
    this.client = new ObjectStorageClient({
      authenticationDetailsProvider: provider,
    });
  }

  getClient() {
    return this.client;
  }
}

module.exports = new OracleClient();
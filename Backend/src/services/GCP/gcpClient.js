const { Storage } = require("@google-cloud/storage");

class GoogleClient {
    constructor() {
        // Crea el cliente usando "Application Default Credentials" y lo guarda en la clase
        this.client = new Storage();
    }
    getClient() {
        return this.client;
    }
}

module.exports = new GoogleClient();
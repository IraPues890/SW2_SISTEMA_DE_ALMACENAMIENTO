const AwsRepository = require("./AWS/awsRepository");
const OracleRepository = require("./OCI/oracleRepository");
const GcpRepository = require("./GCP/gcpRepository");
const AzureRepository = require("./AZ/azureRepository");

function StorageFactory(provider) {
  switch (provider.toLowerCase()) {
    case "aws":
      return new AmazonRepository();
    case "oracle":
      return new OracleRepository();
    case "gcp":
      return new GoogleRepository();
    case "azure":
      return new AzureRepository();
    default:
      throw new Error(`Proveedor no soportado o no existente: ${provider}`);
  }
}

module.exports = StorageFactory;

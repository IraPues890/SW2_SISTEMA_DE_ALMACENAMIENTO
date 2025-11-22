const StorageFactory = require('../src/services/storageFactory');

const AmazonRepository = require('../src/services/AWS/awsRepository');
const OracleRepository = require('../src/services/OCI/oracleRepository');
const GoogleRepository = require('../src/services/GCP/gcpRepository');
const AzureRepository = require('../src/services/AZ/azureRepository');

jest.mock('../src/services/AWS/awsRepository');
jest.mock('../src/services/OCI/oracleRepository');
jest.mock('../src/services/GCP/gcpRepository');
jest.mock('../src/services/AZ/azureRepository');

describe('Storage Factory Service', () => {
  
  it('debe retornar una instancia de AmazonRepository cuando el provider es "aws"', () => {
    const service = StorageFactory('aws');
    expect(service).toBeInstanceOf(AmazonRepository);
  });

  it('debe retornar una instancia de OracleRepository cuando el provider es "oracle"', () => {
    const service = StorageFactory('ORACLE');
    expect(service).toBeInstanceOf(OracleRepository);
  });

  it('debe retornar una instancia de GoogleRepository cuando el provider es "gcp"', () => {
    const service = StorageFactory('gcp');
    expect(service).toBeInstanceOf(GoogleRepository);
  });

  it('debe retornar una instancia de AzureRepository cuando el provider es "azure"', () => {
    const service = StorageFactory('azure');
    expect(service).toBeInstanceOf(AzureRepository);
  });

  it('debe lanzar un error si el proveedor no existe', () => {
    expect(() => {
      StorageFactory('proveedor_fantasma');
    }).toThrow(/Proveedor no soportado/);
  });
});
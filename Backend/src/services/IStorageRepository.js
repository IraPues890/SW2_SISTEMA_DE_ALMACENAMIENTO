class IStorageRepository {
  async upload(filePath, fileName) {
    throw new Error("Se debe implemetar el método upload()");
  }

  async listObjects() {
    throw new Error("Se debe implemetar el método listObjects()");
  }
}

module.exports = IStorageRepository;

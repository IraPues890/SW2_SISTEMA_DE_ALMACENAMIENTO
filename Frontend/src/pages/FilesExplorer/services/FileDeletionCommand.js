export default class FileDeletionCommand {
  constructor(deleteFn) {
    if (typeof deleteFn !== 'function') throw new Error('deleteFn must be a function');
    this.deleteFn = deleteFn; // ¡Esta es la función de 'useFiles'!
  }

  async execute(ids) {
    // 2. ¡Llama a la función que recibiste en el constructor!
    // Esta 'this.deleteFn' es la que ya sabe cómo llamar a la API
    // y cómo actualizar el estado.
    return await this.deleteFn(ids);
  }
}

// Simple Command object that encapsulates deletion logic.
// For now it executes a provided delete function (in-memory or API) — demonstrates Command pattern and DIP.
export default class FileDeletionCommand {
  constructor(deleteFn) {
    if (typeof deleteFn !== 'function') throw new Error('deleteFn must be a function');
    this.deleteFn = deleteFn;
  }

  async execute(ids) {
    // Could add logging, undo stack, or API calls here.
    return await this.deleteFn(ids);
  }
}

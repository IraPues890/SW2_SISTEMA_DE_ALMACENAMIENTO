// Small service that groups file operations. It is constructed with the UI-level delete function and a getter for files.
export default function createFileOperations({ deleteFn, getFiles }) {
  if (typeof deleteFn !== 'function') throw new Error('deleteFn required');
  if (typeof getFiles !== 'function') throw new Error('getFiles required');

  return {
    delete: async (ids) => {
      // Could add retries, logging, or call a backend here.
      return deleteFn(ids);
    },

    download: (ids) => {
      const files = getFiles();
      const idsToDownload = Array.isArray(ids) ? ids : [ids];
      console.debug('[FileOperations] download requested for ids:', idsToDownload);

      idsToDownload.forEach(rawId => {
        // Coerce matching types (numbers vs strings) to find file reliably
        const fileToDownload = files.find(f => {
          if (f.id === rawId) return true;
          // try string/number coercion
          return String(f.id) === String(rawId);
        });

        if (!fileToDownload) {
          console.debug(`[FileOperations] file not found for id=${rawId}`);
          return;
        }

        if (fileToDownload.type === 'folder') {
          console.debug(`[FileOperations] skipping folder id=${fileToDownload.id}`);
          return;
        }

        // Create a small blob (demo mode) and force download for every file.
        const content = `Archivo: ${fileToDownload.name}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileToDownload.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
    }
  };
}

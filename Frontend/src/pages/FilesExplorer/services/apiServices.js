const API_BASE = 'http://localhost:3000/api/storage';

// URLs por proveedor
const API_URL_AWS = 'http://localhost:3000/api/storage/aws/list';
const API_URL_OCI = 'http://localhost:3000/api/storage/oracle/list';
const API_URL_GCP = 'http://localhost:3000/api/storage/gcp/list';
const API_URL_AZURE = 'http://localhost:3000/api/storage/azure/list';

// Ahora sí, todos los proveedores vivos
const PROVIDERS = [
  API_URL_AWS,
  API_URL_OCI,
  API_URL_GCP,
  API_URL_AZURE
];

async function triggerBrowserDownload(response, id) {
    try {
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = id;
        document.body.appendChild(a);
        a.click();

        URL.revokeObjectURL(downloadUrl);
        a.remove();

    } catch (error) {
        console.error('Error al descargar el archivo:', error.message);
    }
}

export async function getAllFiles() {
  try {
    const allApiData = await Promise.all(
      PROVIDERS.map(url =>
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
      )
    );

    const allObjectArrays = allApiData.map(data => data.data);
    const combinedObjects = allObjectArrays.flat();

    return { objects: combinedObjects };
  } catch (err) {
    throw err;
  }
}

export async function downloadFiles(id) {
    try {
        if (Array.isArray(id)) {
            const response = await fetch(`${API_BASE}/aws/download-bulk/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileNames: id })
            });
            return triggerBrowserDownload(response, 'la-castro-bomba.zip');

        } else {
            const API_URL = `${API_BASE}/aws/download/?bucket=giomar-nos-debe-broster&fileName=${id}`;
            const response = await fetch(API_URL);
            return triggerBrowserDownload(response, id);
        }
    } catch (err) {
        throw err;
    }
}

export async function deleteFilesBatch(filesToDelete) {
  const API_URL = `${API_BASE}/delete-batch`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      files: filesToDelete 
    })
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || "Error en la solicitud de borrado por lotes.");
  }

  const data = await response.json();
  return data.results; 
}

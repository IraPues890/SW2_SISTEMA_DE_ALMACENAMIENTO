const API_BASE = 'http://localhost:3000/api/storage' // HARCODEADO PORQUE MATARON EL BACKEND MALDITOS
const API_BASE_BACKEND = 'http://localhost:3000/api'

const API_URL_AWS = 'http://localhost:3000/api/storage/aws/list'
const API_URL_OCI = 'http://localhost:3000/api/storage/oracle/list'
const API_URL_AZ = 'http://localhost:3000/api/storage/azure/list'
const API_URL_GCP = 'http://localhost:3000/api/storage/gcp/list'
const PROVIDERS = [
  API_URL_AWS,
  API_URL_OCI,
  API_URL_AZ,
  API_URL_GCP
];

async function triggerBrowserDownload(response, id) {
    try {
        const blob = await response.blob();
        console.log(blob);
        // Creamos una URL temporal en memoria
        const downloadUrl = URL.createObjectURL(blob);

        // Creamos un enlace <a> fantasma para hacer clic
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = id;

        // Simulamos el clic y limpiamos
        document.body.appendChild(a);
        a.click();

        // Limpiamos la URL de memoria y el enlace
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
    // Ahora combinedObjects es: [ file1, file2, file3, file4, file5 ]
    console.log(combinedObjects);
    return { objects: combinedObjects };

  } catch (err) {
    throw err;
  }
}

export async function downloadFiles(id) {
    try {
        if (Array.isArray(id)) {
            const response = await fetch('http://localhost:3000/api/storage/aws/download-bulk/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileNames: id })
            });
            return triggerBrowserDownload(response, 'la-castro-bomba.zip');

        } else {
            const API_URL = `http://localhost:3000/api/storage/aws/download/?bucket=giomar-nos-debe-broster&fileName=${id}`
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

// --- Funciones para compartir carpetas (simples) ---
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

export async function shareFolder(folderId, email) {
  const url = `${API_BASE_BACKEND}/folders/${folderId}/share`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email })
  });
  if (!resp.ok) throw new Error('Error compartiendo carpeta');
  return resp.json();
}

export async function listShared(folderId) {
  const url = `${API_BASE_BACKEND}/folders/${folderId}/shared`;
  const resp = await fetch(url, { headers: authHeaders() });
  if (!resp.ok) throw new Error('Error listando compartidos');
  return resp.json();
}

export async function revokeShare(folderId, shareId) {
  const url = `${API_BASE_BACKEND}/folders/${folderId}/share/${shareId}`;
  const resp = await fetch(url, { method: 'DELETE', headers: authHeaders() });
  if (resp.status === 204) return true;
  throw new Error('Error revocando permiso');
}
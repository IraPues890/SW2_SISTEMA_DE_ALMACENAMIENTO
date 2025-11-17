const API_URL = 'http://localhost:3000/api/storage/' // HARCODEADO PORQUE MATARON EL BACKEND MALDITOS

const API_URL_AWS = 'http://localhost:3000/api/storage/aws/list'
const API_URL_OCI = 'http://localhost:3000/api/storage/oracle/list'

const PROVIDERS = [
  API_URL_AWS,
  API_URL_OCI
];

async function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`Error de red: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    if (result.success === true) {
        return result.data;
    } else {
        throw new Error(result.message || 'Error en la respuesta del API');
    }
}

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

export async function deleteFiles(id) {
    try {
        const API_URL = `http://localhost:3000/api/storage/aws/delete/${id}`
        const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileName: id })
        });
        return handleResponse(response);
    } catch (err) {
        throw err; // Relanza el error para que useFiles lo atrape
    }
}
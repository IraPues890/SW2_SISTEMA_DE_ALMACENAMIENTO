const API_BASE = "http://localhost:3000";

export async function uploadFile(file, provider) {
  const API_URL = `${API_BASE}/api/storage/${provider}/upload`;

  let presignedUrl;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Error obteniendo la URL: ${err.message || response.statusText}`);
    }

    const data = await response.json();
    presignedUrl = data.url;
    console.log(presignedUrl)
  } catch (error) {
    console.error("Error en el Paso 1 (Obtener URL):", error);
    throw error;
  }

  const headers = {
    'Content-Type': file.type || 'application/octet-stream', 
  };

  if (provider === 'azure') {
    headers['x-ms-blob-type'] = 'BlockBlob';
    headers['x-ms-date'] = new Date().toUTCString();
    const sasVersion = new URL(presignedUrl).searchParams.get("sv");
    if (sasVersion) {
      headers['x-ms-version'] = sasVersion;
    }
  }

  try {
    const upload = await fetch(presignedUrl, {
      method: "PUT",
      body: file, 
      headers: headers
    });

    if (!upload.ok) {
      throw new Error(`Azure falló: ${upload.status} - ${errorText}`);
    }

    return presignedUrl.split("?")[0];

  } catch (error) {
    console.error("Error en el Paso 2 (Subir archivo):", error);
    throw error;
  }
}
// A esto lo podrías llamar: /services/storageService.js
const API_BASE = "http://localhost:3000";

/**
 * Sube un archivo a un proveedor de nube (AWS, OCI, etc.)
 * utilizando una URL pre-firmada/PAR obtenida del backend.
 * * @param {File} file - El objeto File del input.
 * @param {string} provider - El proveedor de nube (ej: 'aws', 'oci', 'gcp').
 * @returns {Promise<string>} La URL limpia del objeto subido.
 */
export async function uploadFile(file, provider) {
  
  // --- PASO 1: Pedir la URL pre-firmada (PAR) al backend ---
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

  } catch (error) {
    console.error("Error en el Paso 1 (Obtener URL):", error);
    throw error;
  }

  // --- PASO 2: Subir el archivo directamente a la nube (OCI/AWS) ---
  try {
    const upload = await fetch(presignedUrl, {
      method: "PUT",
      body: file, // El archivo real
      headers: {
        'Content-Type': file.type // Esencial. OCI lo requiere sí o sí.
      }
    });

    if (!upload.ok) {
      throw new Error(`Error subiendo el archivo a la nube: ${upload.statusText}`);
    }

    // Devolvemos la URL final del objeto (buena práctica)
    return presignedUrl.split("?")[0];

  } catch (error) {
    console.error("Error en el Paso 2 (Subir archivo):", error);
    throw error;
  }
}
const API_URL = 'http://localhost:3000/api/storage/aws/list?bucket=giomar-nos-debe-broster' // HARCODEADO PORQUE MATARON EL BACKEND MALDITOS
const API_URL2 = 'http://localhost:3000/api/storage/aws/download/?bucket=giomar-nos-debe-broster&fileName=mininon.jpg'

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

export async function getFiles() {
    try {
        const response = await fetch(API_URL);
        return handleResponse(response);
    } catch (err) {
        throw err; // Relanza el error para que useFiles lo atrape
    }
}

export async function downloadFiles() {
    try {
        const response = await fetch(API_URL2);
        return handleResponse(response);
    } catch (err) {
        throw err; // Relanza el error para que useFiles lo atrape
    }
}
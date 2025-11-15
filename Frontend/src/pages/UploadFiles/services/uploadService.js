const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
async function getPresignedUrl(file) {
  const res = await fetch(`${API_BASE}/api/storage/aws/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type
    })
  });

  const data = await res.json();
  return data.url;
}


export async function uploadFileToS3(file) {
  console.warn(file);
  const presignedUrl = await getPresignedUrl(file);

  const upload = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      headers: {
        "Content-Type": file.type,
      }
    }
  });

  if (!upload.ok) throw new Error("Error subiendo archivo");

  return presignedUrl.split("?")[0]; // URL final del objeto
}

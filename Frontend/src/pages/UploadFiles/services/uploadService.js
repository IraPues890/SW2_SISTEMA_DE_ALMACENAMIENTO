export async function getPresignedUrl(file, authToken) {
  const key = `${Date.now()}-${file.name}`;
  const params = new URLSearchParams({ key, contentType: file.type });
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const presignUrl = `${API_BASE}/api/files/s3-presign?${params}`;

  const res = await fetch(presignUrl, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Presign failed");

  return data.url;
}

export function uploadToS3(url, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.onload = () => {
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload failed ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

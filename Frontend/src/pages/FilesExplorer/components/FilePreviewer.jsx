import React from 'react';

const OfficeViewer = ({ url, title }) => {
  // Transforma una URL de Google Drive/Docs a una URL incrustable.
  const getEmbedUrl = (originalUrl) => {
    const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const docsRegex = /docs\.google\.com\/(?:spreadsheets|presentation|document)\/d\/([a-zA-Z0-9_-]+)/;

    const driveMatch = originalUrl.match(driveRegex);
    if (driveMatch && driveMatch[1]) {
      // Para archivos genéricos en Google Drive (PDF, CSV, etc.)
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    const docsMatch = originalUrl.match(docsRegex);
    if (docsMatch && docsMatch[1]) {
      if (originalUrl.includes('/spreadsheets/')) return `https://docs.google.com/spreadsheets/d/${docsMatch[1]}/preview`;
      if (originalUrl.includes('/presentation/')) return `https://docs.google.com/presentation/d/${docsMatch[1]}/embed`;
      if (originalUrl.includes('/document/')) return `https://docs.google.com/document/d/${docsMatch[1]}/preview`;
    }
    return originalUrl;
  };

  const viewerUrl = getEmbedUrl(url);
  return <iframe src={viewerUrl} title={title} className="w-full h-full border-0" />;
};

const ImageViewer = ({ url, alt }) => {
  // Este componente se mantiene por si en el futuro se usan URLs de imágenes directas (no de Google Drive)
  let imageUrl = url;
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const driveMatch = url.match(driveRegex);
  if (driveMatch && driveMatch[1]) {
    imageUrl = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }
  
  return <img src={imageUrl} alt={alt} className="w-full h-full object-contain" />;
};

const NoPreview = ({ fileType }) => {
  return (
    <div className="text-center text-slate-500 p-4 flex flex-col items-center justify-center h-full">
      <div className="text-4xl mb-2">🧐</div>
      <p className="font-semibold">Sin vista previa disponible</p>
      <p className="text-sm">No se puede previsualizar este tipo de archivo ({fileType}).</p>
    </div>
  );
};

export function FilePreviewer({ file, url }) {
  if (!file || !url) {
    return <NoPreview fileType={file?.type || "desconocido"} />;
  }

  const fileType = file.type.toLowerCase();
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileType);
  // Ahora, todos los tipos de archivo de Google Drive usarán el mismo visor.
  const isGoogleDriveLink = url.includes('drive.google.com') || url.includes('docs.google.com');

  // Si es un enlace de Google Drive, siempre usamos el OfficeViewer (iframe) porque es más fiable.
  if (isGoogleDriveLink) {
    return <OfficeViewer url={url} title={`Vista previa de ${file.name}`} />;
  }

  // Si no es de Google Drive pero es una imagen, usamos el ImageViewer.
  if (isImage) {
    return <ImageViewer url={url} alt={`Vista previa de ${file.name}`} />;
  }

  return <NoPreview fileType={fileType} />;
}
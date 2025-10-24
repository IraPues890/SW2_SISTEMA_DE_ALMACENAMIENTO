import { useState, useRef } from "react";

export function useUploadState(initial = {}) {
  const [selectedFile, setSelectedFile] = useState(initial.selectedFile || null);
  const [destFolder, setDestFolder] = useState(initial.destFolder || "Raíz > Proyectos");
  const [overwrite, setOverwrite] = useState(initial.overwrite || false);
  const [selectedCloud, setSelectedCloud] = useState(initial.selectedCloud || "aws");
  const [progress, setProgress] = useState(0);
  const xhrRef = useRef(null);

  const reset = () => {
    setSelectedFile(null);
    setProgress(0);
  };

  return {
    selectedFile, setSelectedFile,
    destFolder, setDestFolder,
    overwrite, setOverwrite,
    selectedCloud, setSelectedCloud,
    progress, setProgress,
    xhrRef,
    reset,
  };
}

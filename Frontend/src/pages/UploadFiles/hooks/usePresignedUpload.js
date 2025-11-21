import { useUploadState } from "./useUploadState";
import { uploadFile } from "../services/uploadService";

export function usePresignedUpload(initial = {}) {
  const state = useUploadState(initial);

  const startUpload = async () => {
    const { selectedFile, selectedCloud, setProgress, reset } = state;
    if (!selectedFile) return;
    try {
      setProgress(0);
      await uploadFile(selectedFile, selectedCloud);
      setProgress(100);
    } catch (err) {
      console.error("Upload failed:", err);
      reset();
      throw err;
    }
  };

  return { ...state, startUpload };
}

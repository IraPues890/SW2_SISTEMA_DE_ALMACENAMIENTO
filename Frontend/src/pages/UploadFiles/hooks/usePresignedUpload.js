import { useUploadState } from "./useUploadState";
import { uploadFileToS3 } from "../services/uploadService";

export function usePresignedUpload(initial = {}) {
  const state = useUploadState(initial);

  const startUpload = async () => {
    const { selectedFile, setProgress, reset } = state;
    if (!selectedFile) return;

    try {
      setProgress(0);
      await uploadFileToS3(selectedFile);
      setProgress(100);
    } catch (err) {
      console.error("Upload failed:", err);
      reset();
      throw err;
    }
  };

  return { ...state, startUpload };
}

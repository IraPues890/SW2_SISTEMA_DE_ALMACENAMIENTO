import { useUploadState } from "./useUploadState";
import { getPresignedUrl, uploadToS3 } from "../services/uploadService";

export function usePresignedUpload(initial = {}) {
  const state = useUploadState(initial);

  const startUpload = async (authToken) => {
    const { selectedFile, setProgress, reset } = state;
    if (!selectedFile) return;

    try {
      setProgress(0);
      const url = await getPresignedUrl(selectedFile, authToken);
      await uploadToS3(url, selectedFile, setProgress);
      setProgress(100);
    } catch (err) {
      console.error("Upload failed:", err);
      reset();
      throw err;
    }
  };

  return { ...state, startUpload };
}

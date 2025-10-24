import { usePresignedUpload } from "./usePresignedUpload";

export default function useUpload(initial = {}) {
  return usePresignedUpload(initial);
}
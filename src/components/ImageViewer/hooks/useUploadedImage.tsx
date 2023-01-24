import { useMemo, useState } from "react";

export const useUploadedImage = () => {
  const [imageUrl, setImageUrl] = useState("");

  return {
    url: imageUrl,
    setImageUrl,
  };
};

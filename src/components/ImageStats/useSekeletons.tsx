import { useState } from "react";

export default function useSkeletons() {
  const [skeletons] = useState<string[]>(
    Array(6)
      .fill(0)
      .map((_) => `${Math.random() * 100}%`)
  );

  return skeletons;
}
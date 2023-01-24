import * as THREE from "three";
import { useMemo } from "react";

export default function useMinMaxRGB(image: HTMLImageElement) {
  return useMemo(() => {
    const imgWidth = image.width;
    const imgHeight = image.height;
    const minRGB = new THREE.Vector3(1, 1, 1);
    const maxRGB = new THREE.Vector3(0, 0, 0);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      minRGB.x = Math.min(minRGB.x, r);
      minRGB.y = Math.min(minRGB.y, g);
      minRGB.z = Math.min(minRGB.z, b);
      maxRGB.x = Math.max(maxRGB.x, r);
      maxRGB.y = Math.max(maxRGB.y, g);
      maxRGB.z = Math.max(maxRGB.z, b);
    }
    return [minRGB, maxRGB];
  }, [image]);
}

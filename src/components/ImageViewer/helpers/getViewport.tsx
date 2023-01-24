import { ViewportProps } from "../hooks/useViewport";

export function getViewport({ image, zoom, width, height }: ViewportProps) {
  const imgRatio = image.width / image.height;
  const canvasRatio = width / height;
  if (imgRatio > canvasRatio) {
    return [width * zoom, (width / imgRatio) * zoom];
  } else {
    return [height * imgRatio * zoom, height * zoom];
  }
}

import { Canvas } from "@react-three/fiber";
import Image from "./Image";

export interface PixelData {
  data: Uint8ClampedArray;
  size: [number, number];
}

export interface Settings {
  /* Image Source Url\Uri */
  src?: string;
  setPixels?: (pixels: PixelData) => void;
  /* Spacial Filters */
  filterType: number;
  filterRadius: number;
  filterStrength: number;
  /* Color Filters */
  brightness: number;
  contrast: number;
  exposure: number;
  saturation: number;
  /* Noise */
  noise: number;
  noiseType: number;
  /* Settings */
  threshold: number[];
  thresholdType: number;
}

export default function ImageViewer(settings: Settings) {
  return (
    <div className="flex-1 w-[600px] h-[600px]">
      <Canvas>
        <Image {...settings} />
      </Canvas>
    </div>
  );
}

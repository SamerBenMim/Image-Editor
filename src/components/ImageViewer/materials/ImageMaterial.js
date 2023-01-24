import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import fragment_ from "./shaders/fragment.glsl";
import vertex_ from "./shaders/vertex.glsl";

const FRAGMENT = await fetch(fragment_).then((response) => response.text());
const VERTEX = await fetch(vertex_).then((response) => response.text());

export const INITIAL_SETTINGS_STATE = {
  filterRadius: 0,
  filterStrength: 1,
  filterType: 1,
  brightness: 0,
  contrast: 1,
  exposure: 0,
  saturation: 1,
  noise: 0,
  noiseType: 1,
  threshold: [0, 0, 0],
  thresholdType: 0,
};

export const MATERIAL_ARGS = {
  uTexture: new THREE.Texture(),
  imageResolution: new THREE.Vector2(),
  ...INITIAL_SETTINGS_STATE,
};

const ImageMaterial = shaderMaterial(MATERIAL_ARGS, VERTEX, FRAGMENT);

extend({ ImageMaterial });

export default ImageMaterial;

import { RootState } from "@react-three/fiber";
import * as THREE from "three";

export default function getPixelsArrayOfImage(
  state: RootState,
  element: React.MutableRefObject<
    THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
  >,
  viewPort: [number, number],
  image: HTMLImageElement
) {
  let { gl, camera } = state;
  const width = Math.min(image.width, 1280);
  const height = Math.min(image.height, 1280 * (image.height / image.width));  

  // modify renderer width and height to match the image size
  const oldSize = new THREE.Vector2();
  gl.getSize(oldSize);
  gl.setSize(width, height);

  // update the camera
  camera = camera as THREE.PerspectiveCamera;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  const oldPosition = element.current.position.clone();
  const oldScale = element.current.scale.clone();

  element.current.position.set(0, 0, 0);
  element.current.scale.set(viewPort[0], viewPort[1], 1);

  gl.render(state.scene, state.camera);

  const pixels = new Uint8ClampedArray(width * height * 4);
  const context = gl.getContext();
  context.readPixels(
    0,
    0,
    width,
    height,
    context.RGBA,
    context.UNSIGNED_BYTE,
    pixels
  );

  // restore canvas width and height
  gl.setSize(oldSize.x, oldSize.y);
  camera.aspect = oldSize.x / oldSize.y;
  camera.updateProjectionMatrix();

  element.current.position.copy(oldPosition);
  element.current.scale.copy(oldScale);
  gl.render(state.scene, state.camera);

  return {
    data: pixels,
    size: [width, height],
  };
}

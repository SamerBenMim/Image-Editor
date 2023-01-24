import * as THREE from "three";
import { RootState } from "@react-three/fiber";

export default function getIntersectionPosition(
  state: RootState,
  relative: boolean = false
) {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(state.mouse, state.camera);
  const intersects = raycaster.intersectObjects(state.scene.children);
  if (intersects.length > 0) {
    const intersect = intersects[0];
    const { x, y } = intersect.point;
    if (relative) {
      return new THREE.Vector2(
        x - intersects[0].object.position.x,
        y - intersects[0].object.position.y
      );
    }
    return new THREE.Vector2(x, y);
  }
  return null;
}

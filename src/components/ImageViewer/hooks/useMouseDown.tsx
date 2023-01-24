import { RootState, Vector2 } from "@react-three/fiber";
import { useEffect, useState } from "react";
import getIntersectionPosition from "../helpers/getIntersectionPosition";

export default function useMouseDown(
  state: RootState,
  callback?: (down: any) => void
) {
  const [mouseDown, setMouseDown] = useState<Vector2 | null>(null);
  useEffect(() => {
    const canvas = state.gl.domElement;
    canvas.style.cursor = "grab";
    const handleMouseDown = () => {
      canvas.style.cursor = "grabbing";
      const pos = getIntersectionPosition(state, true);
      setMouseDown(pos);
    };
    const handleMouseUp = () => {
      canvas.style.cursor = "grab";
      setMouseDown(null);
    };
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, []);
  return mouseDown;
}

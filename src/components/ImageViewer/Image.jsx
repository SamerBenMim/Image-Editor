import * as THREE from "three";
import { useLoader, useThree, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import ImageMaterial from "./materials/ImageMaterial";
import useViewport from "./hooks/useViewport";
import useZoom from "./hooks/useZoom";
import useMouseDown from "./hooks/useMouseDown";
import getIntersectionPosition from "./helpers/getIntersectionPosition";
import getPixelsArrayOfImage from "./helpers/getPixelsRelatedToImage";
import { getViewport } from "./helpers/getViewport";
import useDebounce from "../../hooks/useDebounce";
const unsplashImage = "nature.jpg";

export default function Image({
  src = unsplashImage,
  setPixels = (_) => {},
  ...other
}) {
  const ref = useRef();
  const [rendered, setRendered] = useState(false);
  const [image] = useLoader(THREE.TextureLoader, [src]);
  const state = useThree();
  const { width, height } = useThree((state) => state.viewport);
  const [zoom] = useZoom();
  const mouseDownVec = useMouseDown(state);

  const viewPort = useViewport({
    image: image.image,
    zoom,
    width,
    height,
  });

  useFrame((state) => {
    if (mouseDownVec) {
      const pos = getIntersectionPosition(state);
      // if (pos) {
      //   ref.current.position.set(
      //     pos.x - mouseDownVec.x,
      //     pos.y - mouseDownVec.y,
      //     0
      //   );
      //   state.gl.render(state.scene, state.camera);
      // }
    }
    if (!rendered) {
      state.gl.render(state.scene, state.camera);
      setRendered(true);
    }
  }, 1);

  const objectToValues = (obj) => {
    return Object.keys(obj).map((key) => obj[key]);
  };
  
  useDebounce(() => {
    const viewPort = getViewport({
      image: image.image,
      zoom: 1,
      width,
      height,
    });
    const pixels = getPixelsArrayOfImage(state, ref, viewPort, image.image);
    setPixels(pixels);
    setRendered(true);
  }, 200, [...objectToValues(other), src]);

  useEffect(() => {
    console.log("resetting");
    setRendered(false);
  }, [...objectToValues(other), 1, width, height, src]);

  return (
    <mesh ref={ref} scale={[...viewPort, 1]}>
      <planeGeometry />
      <Suspense fallback={null}>
        <imageMaterial
          key={ImageMaterial.key}
          imageResolution={[image?.image?.width, image?.image?.height]}
          uTexture={image}
          {...other}
        />
      </Suspense>
    </mesh>
  );
}

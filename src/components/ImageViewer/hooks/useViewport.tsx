import { useMemo } from "react";
import { getViewport } from "../helpers/getViewport";

export interface ViewportProps {
  width: number;
  height: number;
  image: HTMLImageElement;
  zoom: number;
}

export default function useViewport(props: ViewportProps) {
  const viewPort = useMemo(() => {
    if (!props.image) return null;
    return getViewport(props);
  }, [props]);

  return viewPort;
}

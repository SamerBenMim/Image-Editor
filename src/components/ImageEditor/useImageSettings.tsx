import { useState } from "react";
import { Settings } from "../ImageViewer";
import { INITIAL_SETTINGS_STATE } from "../ImageViewer/materials/ImageMaterial";

export default function useImageSettings(
  initialState: Settings = INITIAL_SETTINGS_STATE
): [Settings, (key: keyof Settings) => (value: any) => void] {
  const [settings, setSettings_] = useState(initialState);
  const setSettings = (key: keyof Settings) => (value: any) =>
    setSettings_((prev) => ({ ...prev, [key]: value }));

  return [settings, setSettings];
}

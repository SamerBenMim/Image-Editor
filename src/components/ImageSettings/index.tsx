import { Settings } from "../ImageViewer";
import RadioInput from "./RadioInput";
import RGBInput from "./RGBInput";
import SettingsSection from "./SettingsSection";
import SliderInput from "./SliderInput";

export interface ImageSettingsProps {
  settings: Settings;
  setSettings: (key: keyof Settings) => (value: any) => void;
  open: boolean;
  setOpen: (state: boolean) => void;
}

export default function ImageSettings({
  settings: {
    filterRadius,
    filterStrength,
    brightness,
    contrast,
    exposure,
    saturation,
    noise,
    filterType,
    noiseType,
    threshold,
    thresholdType,
  },
  setSettings,
}: ImageSettingsProps) {
  return (
    <div
      className={` max-w-[1000px] w-[500px] flex flex-col gap-8 justify-between py-7 px-10 text-white`}
    >
  <SettingsSection title="noise">
    <RadioInput
      value={noiseType}
      title="Noise Type"
      setValue={setSettings("noiseType")}
      options={[
        { label: "Pepper And Salt", value: 1 },
      ]}
    />
  
    <SliderInput
      label={`Noise: ${(noise * 100).toFixed(0)}%`}
      value={noise}
      setValue={setSettings("noise")}
      min="0"
      max="1"
      step="0.01"
    />
  </SettingsSection>
      <SettingsSection title="filters">
        <RadioInput
          title="Filter Type"
          value={filterType}
          setValue={setSettings("filterType")}
          options={[
            // { label: "Box Blur", value: 0b1 },
            { label: "Gaussian Blur", value: 0b10 },
            { label: "Median Filter", value: 0b100 },
            { label: "High Pass", value: 0b1000 },
            { label: "Edge Detection (Erosion)", value: 0b10000 },
            { label: "Dilation", value: 0b100000 },
          ]}
        />

        <SliderInput
          label={`Filter Size: ${filterRadius * 2 + 1}x${filterRadius * 2 + 1}`}
          value={filterRadius}
          setValue={setSettings("filterRadius")}
          min={0}
          max={10}
        />
{/* 
        <SliderInput
        label={`Filter Strength: ${filterStrength}`}
          value={filterStrength}
          setValue={setSettings("filterStrength")}
          min="1"
          max="10"
          step="0.1"
        /> */}
      </SettingsSection>

      <SettingsSection title="light">
        <SliderInput
          label={`Brightness: ${brightness}`}
          value={brightness}
          setValue={setSettings("brightness")}
          min="-0.5"
          max="0.5"
          step="0.01"
        />

        <SliderInput
          label={`Contrast: ${contrast}`}
          value={contrast}
          setValue={setSettings("contrast")}
          min="0"
          max="2"
          step="0.01"
        />

        <SliderInput
          label={`Exposure: ${exposure}`}
          value={exposure}
          setValue={setSettings("exposure")}
          min="-1"
          max="1"
          step="0.01"
        />

        <SliderInput
          label={`Saturation: ${saturation}`}
          value={saturation}
          setValue={setSettings("saturation")}
          min="0"
          max="2"
          step="0.01"
        />
      </SettingsSection>

      <SettingsSection title="Threshold">
        <RadioInput
          title="Threshold Type"
          value={thresholdType}
          setValue={setSettings("thresholdType")}
          options={[
            { label: "RGB", value: 0 },
          ]}
        />
        <RGBInput values={threshold} setValues={setSettings("threshold")} />
      </SettingsSection>

    </div>
  );
}

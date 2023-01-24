export interface RGBInputProps {
  values: number[];
  setValues: (values: number[]) => void;
}
export type Channel = "r" | "g" | "b";
export default function RGBInput({ values, setValues }: RGBInputProps) {
  const channels = ["r", "g", "b"] as Channel[];
  const setValue = (channel: Channel) => (value: number) => {
    const newValues = [...values];
    newValues[channels.indexOf(channel)] = value / 255;
    setValues(newValues);
  };
  return (
    <div className="flex flex-wrap justify-start items-end gap-3 text-sm">
      {channels.map((channel) => (
        <ChannelInput
          key={channel}
          channel={channel}
          value={values[channels.indexOf(channel)]}
          setValue={setValue(channel)}
        />
      ))}
    </div>
  );
}

interface ChannelInputProps {
  channel: Channel;
  value: number;
  setValue: (value: number) => void;
}

function ChannelInput({ channel, value, setValue }: ChannelInputProps) {
  return (
    <div className="flex flex-col items-center">
      <label>{channel.toUpperCase()}</label>
      <input
        type="number"
        min={0}
        max={255}
        value={Math.round(value * 255)}
        onChange={(e) => setValue(Number(e.target.value))}
        className="outline-none w-10 p-1  rounded text-center"
      />
    </div>
  );
}

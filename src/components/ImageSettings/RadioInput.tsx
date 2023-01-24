export interface RadioInputProps {
  title: string;
  value: number | string;
  setValue: (value: number | string) => void;
  options: { label: string; value: number | string }[];
}

export default function RadioInput({
  title,
  value,
  setValue,
  options,
}: RadioInputProps) {
  return (
    <form onChange={(e: any) => setValue(e.target.value)}>
      {options.map(({ label, value: v }) => (
        <div key={label} className="flex gap-3 items-center">
          <input
            id={label}
            type="radio"
            defaultChecked={value === v}
            value={v}
            name={title}
          />
          <label className="text-sm" htmlFor={label}>{label}</label>
        </div>
      ))}
    </form>
  );
}

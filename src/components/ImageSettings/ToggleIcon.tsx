import { IoIosArrowUp } from "react-icons/io";

export interface ToggleIconProps {
  open: boolean;
  setOpen: (state: boolean) => void;
}

export default function ToggleIcon({ open, setOpen }: ToggleIconProps) {
  return (
    <div
      className="w-36 h-8 rounded-b-[-15px] absolute flex justify-center
        rounded-t-xl -translate-y-full bg-inherit top-0 left-1/2 -translate-x-1/2"
      onClick={() => setOpen(!open)}
    >
      <IoIosArrowUp
        className={`text-3xl cursor-pointer transition-all duration-300 ${
          open ? "-scale-100" : ""
        }`}
      />
    </div>
  );
}

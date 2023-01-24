export interface HeaderProps {
  setImageUrl: (url: string) => void;
  handleDownload: () => void;
}
export const Header = ({ setImageUrl, handleDownload }: HeaderProps) => {
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file?.type?.includes("image")) {
      setImageUrl(URL.createObjectURL(file));
    } else {
      console.error("The file is not an image, please pick another image");
    }
  };
  return (
    <div style ={{position:"absolute" ,right :"-1300px" ,top:"10px" , width:"100%" ,    }}className="w-full py-5 flex flex-row justify-between items-center px-10 ">
      {/* <a
        href="https://github.com/MedAzizKhayati/react-glsl-image-editor"
        target="_blank"
        className="px-4 py-2 bg-[#2c2c2c] rounded-lg text-gray-400 transition-all duration-300 cursor-pointer hover:text-white hover:bg-buttonBlue"
      >
        Check our github
      </a> */}
      <div className="flex flex-row gap-4">
        <label className="bg-buttonBlue text-xs flex flex-col items-center justify-center rounded-lg px-4 py-2 cursor-pointer text-white transition-all duration-500 ease-out hover:-translate-y-1">
          Load Image
          <input
            className="hidden h-full w-full"
            id="file_input"
            type="file"
            onChange={handleFileSelected}
          />
        </label>
        {/* <div
          onClick={handleDownload}
          className="text-xs flex flex-col items-center justify-center px-4 py-2 bg-gray-50 rounded-lg text-buttonBlue cursor-pointer transition-all duration-500 ease-out hover:-translate-y-1"
        >
          Download Image
        </div> */}
      </div>
    </div>
  );
};

import ImageService from "../../services/image.service";
import { useEffect, useState } from "react";
import { PixelData } from "../ImageViewer";
import useDebounce from "../../hooks/useDebounce";
import { MdClose } from "react-icons/md";
import { HiOutlineInformationCircle } from "react-icons/hi";
import Chart from "react-apexcharts";
import RadioInput from "../ImageSettings/RadioInput";

export default function ImageStats({ pixels }: { pixels?: PixelData }) {
  const [toggle, setToggle] = useState<boolean>(true);
  const [stats, setStats] = useState<any>();
  const [chart, setChart] = useState<any>();
  const [chartType, setChartType] = useState<string | number>('histogram');
  const [skeletons] = useState<string[]>(
    Array(6)
      .fill(0)
      .map((_) => `${Math.random() * 100}%`)
  );
  useEffect(() => {
    if (!stats) return;
    const SUBDIVISIONS = 8;
    const options = {
      chart: {
        id: "Histogram",
      },
      xaxis: {
        categories: Array(SUBDIVISIONS).fill(0).map((_, i) => i * (256 / SUBDIVISIONS)),
      },
      title: {
        text: "Histogram",
        style: {
          color: 'white'
        }
      },
      stroke: {
        curve: 'smooth',
        lineCap: 'round',
        width: 3
      },

    };
    const colors = ['#f00', '#0f0', '#00f'];
    const histogram: number[][] = [];
    for (let i = 0; i < 256; i += (256 / SUBDIVISIONS)) {
      histogram.push(stats[chartType][i])
    }
    const series = ['red', 'green', 'blue'].map((color, i) => ({
      name: color,
      data: histogram.map((val) => val[i]),
      color: colors[i]
    }));
    setChart({ options, series });
  }, [chartType, stats]);

  const loading = useDebounce(
    () => {
      if (pixels) {
        const imageService = new ImageService(pixels);
        const stats = imageService.getStatistics();
        setStats(stats);
      }
    },
    50,
    [pixels]
  );

  return (
    <>
      <div
        className={`absolute top-[340px] left-[300px] p-5 w-[300px] h-[80px] z-10  backdrop-blur-md overflow-hidden
       bg-[white]/70 text-white rounded shadow-xl transition-all duration-300  ${toggle
            ? "w-64 h-56 "
            : "h-14 w-14 bg-[#353535]/70 flex-center rounded-[28rem] animate-pulse hover:animate-none cursor-pointer"
          }`}
        // onClick={() => !toggle && setToggle(false)}
      >
        {!toggle && (
          <MdClose 
            onClick={() => setToggle(true)}
            className="absolute text-white top-2 right-2 shadow-md text-2xl 
          transition-all hover:scale-125 cursor-pointer"
          />
        )}
        {toggle ? (
          loading ? (
            <div className="flex animate-fadein flex-col gap-3 h-full justify-around">
              {skeletons.map((val: string, i) => (
                <div key={i} className="animate-pulse flex justify-between gap-2">
                  <span
                    className="h-5 bg-gray-400 rounded-sm"
                    style={{
                      width: val,
                    }}
                  ></span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col h-full gap-5 animate-fadein h-10px">
              {/* <h1 className="font-bold text-center">STATISTICS</h1>
              <div className="flex flex-col justify-around h-full">
                <div className="flex gap-3 items-center justify-between">
                  <span className="text-sm">Minimum: </span>
                  <span className="text-sm w-1/2">{stats?.min}</span>
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <span className="text-sm">Maximum: </span>
                  <span className="text-sm w-1/2">{stats?.max}</span>
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <span className="text-sm">Mean: </span>
                  <span className="text-sm w-1/2">{stats?.mean}</span>
                </div>
                <div className="flex gap-3 items-center justify-between mb-3">
                  <span className="text-sm">Deviation: </span>
                  <span className="text-sm w-1/2">
                    {stats?.standardDeviation}
                  </span>
                </div> */}

                <RadioInput
                  title="Chart Type"
                  options={[
                    { label: 'Normal Histogram', value: 'histogram' },
                    { label: 'Cumulative Histogram', value: 'cumulativeHistogram' }
                  ]}
                  value={chartType}
                  setValue={setChartType}
                />

              </div>
            // </div>
          )
        ) : (
          <HiOutlineInformationCircle className="text-5xl text-gray-300 absolute" />
        )}
      </div>
      {chart  && <>
      {/* <div className={`absolute top-[380px] left-[300px]  py-2 backdrop-blur-md overflow-hidden
       bg-primaryBackground/80 text-gray-700 rounded shadow-xl transition-all duration-300 ${toggle
          ? "z-10"
          : "opacity-0 -z-10"
        }`}>
        <Chart
          options={chart?.options}
          series={chart?.series}
          type="line"
        />
        
      </div> */}
      <div className={`absolute top-24 left-[300px]  py-2 backdrop-blur-md overflow-hidden
       bg-red text-gray-700 rounded shadow-xl transition-all duration-300 ${toggle
          ? "z-10"
          : "opacity-0 -z-10"
        }`}>
        <Chart
          options={chart?.options}
          series={chart?.series}
          type="line"
        />
        
      </div>
      </>
      }
<div style={{position:"absolute", left:'320px',bottom:'150px' ,textAlign:"left"}}>

<h1 className="font-bold text-center">STATISTICS</h1>
              <div className="flex flex-col justify-around h-full">
                <div className="flex gap-3 items-center justify-between">
                  <span className="text-sm">Minimum: </span>
                  <span className="text-sm w-1/2">{stats?.min}</span>
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <span className="text-sm">Maximum: </span>
                  <span className="text-sm w-1/2">{stats?.max}</span>
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <span className="text-sm">Mean: </span>
                  <span className="text-sm w-1/2">{stats?.mean}</span>
                </div>
                <div className="flex gap-3 items-center justify-between mb-3">
                  <span className="text-sm">Deviation: </span>
                  <span className="text-sm w-1/2">
                    {stats?.standardDeviation}
                  </span>
                </div>
                </div>
              
</div>


    </>
  );
}

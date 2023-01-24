import { PixelData } from "@/components/ImageViewer";


export default class ImageService {
    private readonly data: Uint8ClampedArray;
    private readonly width: number;
    private readonly height: number;
    private mean: number[] = [];
    constructor(
        image: PixelData,
    ) {
        this.data = image.data;
        this.width = image.size[0];
        this.height = image.size[1];
    }
    getHistogram() {
        const histogram = this.data.reduce((acc, val, i) => {
            if(i % 4 === 3) return acc; // skip alpha channel (i % 4 === 3)
            acc[val][i % 4] += 1;
            return acc;
        }, Array(256).fill(0).map(() => [0, 0, 0]));
        return histogram;
    }

    getCumulativeHistogram() {
        const histogram = this.getHistogram();
        const cummulativeHistogram = histogram.reduce((acc, val, i) => {    
            if(i === 0) {
                acc[i] = val;
                return acc;
            }
            acc[i] = val.map((v: any, j:any) => v + acc[i - 1][j]);
            return acc;
        }, new Array(256).fill(0).map(() => [0, 0, 0]));
        return cummulativeHistogram;
    }

    getMinimum() {
        const min = this.data.reduce((acc, val, i) => {
            acc[i % 4] = Math.min(acc[i % 4], val);
            return acc;
        }, [Infinity, Infinity, Infinity, Infinity]);
        return min;
    }

    getMaximum() {
        const max = this.data.reduce((acc, val, i) => {
            acc[i % 4] = Math.max(acc[i % 4], val);
            return acc;
        }, [0, 0, 0, 0]);
        return max;
    }

    getStandardDeviation() {
        if (this.mean.length === 0) {
            this.mean = this.getMean();
        }
        const std = this.data.reduce((acc, val, i) => {
            acc[i % 4] += Math.pow(val - this.mean[i % 4], 2);
            return acc;
        }, [0, 0, 0, 0]).map(val => Math.sqrt(val / (this.data.length / 4)));
        return std;
    }

    getMean() {
        const mean = this.data.reduce((acc, val, i) => {
            acc[i % 4] += val;
            return acc;
        }, [0, 0, 0, 0]).map(val => (val / (this.data.length / 4)));
        this.mean = mean;
        return mean;
    }

    getStatistics() {
        const mean = this.getMean().map(v => v.toFixed(0));
        const standardDeviation = this.getStandardDeviation().map(v => v.toFixed(0));
        const histogram = this.getHistogram();
        const max = this.getMaximum();
        const min = this.getMinimum();
        const cumulativeHistogram = this.getCumulativeHistogram();
        return {
            mean: mean.slice(0, 3).join(", "),
            standardDeviation: standardDeviation.slice(0, 3).join(", "),
            histogram,
            cumulativeHistogram,
            max: max.slice(0, 3).join(", "),
            min: min.slice(0, 3).join(", "),
        };
    }

    downloadImage(filename = "image.jpg") {
        const imageData = new ImageData(this.data, this.width, this.height);
        const canvas = document.createElement("canvas");
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Failed to get canvas context");
        }

        // mirror image horizontally
        ctx.putImageData(imageData, 0, 0);
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        ctx.drawImage(canvas, 0, 0);

        const url = canvas.toDataURL("image/jpeg");
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        a.remove();
        return url;
    }
}

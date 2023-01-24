uniform sampler2D uTexture;
uniform vec3 threshold;
uniform vec2 imageResolution;
varying vec2 vUv;
uniform float brightness;
uniform float contrast;
uniform float exposure;
uniform float saturation;
uniform float noise;
uniform float filterStrength;
uniform int filterRadius;
uniform int filterType;
uniform int noiseType;
uniform int thresholdType; // 0 = or, 1 = or, 2 = single

float rand(vec2 uv, float seed) {
    return fract(sin(dot(uv, vec2(12.9898, 78.233 + seed))) * (43758.5453));
}

vec3 randomVec3(vec2 uv, float seed) {
    return vec3(rand(uv, seed + 0.1), rand(uv, seed + 0.5), rand(uv, seed + 0.9));
}

vec4 thresholdImage(vec4 color, vec3 threshold_) {
    // if color is less than threshold, return 0.0, else return the same color
    if(thresholdType == 0) {
        float r, g, b;
        if(color.r <= threshold_.r) {
            r = 0.0;
        } else {
            r = color.r;
        }
        if(color.g <= threshold_.g) {
            g = 0.0;
        } else {
            g = color.g;
        }
        if(color.b <= threshold_.b) {
            b = 0.0;
        } else {
            b = color.b;
        }
        return vec4(r, g, b, 1.0);
    } else if(thresholdType == 1) {
        if(color.r < threshold_.r && color.g < threshold_.g && color.b < threshold_.b) {
            return vec4(0.0, 0.0, 0.0, 1.0);
        } else {
            return color;
        }
    } else if(thresholdType == 2) {
        if(color.r < threshold_.r || color.g < threshold_.g || color.b < threshold_.b) {
            return vec4(0.0, 0.0, 0.0, 1.0);
        } else {
            return color;
        }
    }
    return color;
}

vec4 adjustBrightness(vec4 color, float value) {
    return color + vec4(value);
}

vec4 adjustContrast(vec4 color, float value) {
    return vec4((color.rgb - 0.5) * value + 0.5, color.a);
}

vec4 adjustExposure(vec4 color, float value) {
    return vec4(vec3(1.0 + value) * color.rgb, color.a);
}

vec4 adjustSaturation(vec4 color, float value) {
    vec3 gray = vec3(dot(vec3(0.2125, 0.7154, 0.0721), color.rgb));
    return vec4(mix(gray, color.rgb, value), color.a);
}

vec4 grayNoise(vec4 color, vec2 uv, float value) {
    float noise = rand(uv, 0.0);
    if(noise < value) {
        int random = int(noise * 100.0);
        if(random % 2 == 0) {
            return vec4(0.0, 0.0, 0.0, 1.0);
        } else {
            return vec4(vec3(0.5), 1.0);
        }
    }
    return color;
}

vec4 colorNoise(vec4 color, vec2 uv, float value) {
    vec3 noise = randomVec3(uv, 0.0);
    if(noise.x < value) {
        return vec4(noise, 1.0);
    }
    return color;
}

vec4 preProcess(vec4 color, vec2 uv) {
    switch(noiseType) {
        case 0:
            color = colorNoise(color, uv, noise);
            break;
        case 1:
            color = grayNoise(color, uv, noise);
            break;
        default:
            break;
    }
    return color;
}

vec4 getTextureColor(vec2 uv) {
    vec4 color = texture2D(uTexture, uv);
    return preProcess(color, uv);
}

vec4 applyBoxBlur(vec2 uv, int radius, float strength) {
    vec4 sum = vec4(0.0);
    vec2 onePixel = vec2(1.0) / imageResolution;
    float numberOfPixels = float((radius * 2 + 1) * (radius * 2 + 1));

    for(int x = -radius; x <= radius; x++) {
        for(int y = -radius; y <= radius; y++) {
            vec4 color;
            color = getTextureColor(uv + vec2(x, y) * onePixel * strength);
            sum += color;
        }
    }

    return sum / numberOfPixels;
}

vec4 applyHighPassFilter(vec2 uv, int radius, float strength) {
    vec3 sum = vec3(0.0);
    vec2 onePixel = vec2(1.0) / imageResolution;
    float numberOfPixels = float((radius * 2 + 1) * (radius * 2 + 1));

    for(int x = -radius; x <= radius; x++) {
        for(int y = -radius; y <= radius; y++) {
            vec4 color;
            if(x == 0 && y == 0) {
                color = getTextureColor(uv + vec2(x, y) * onePixel * strength) * numberOfPixels;
                sum += color.rgb;
            } else {
                color = getTextureColor(uv + vec2(x, y) * onePixel * strength);
                sum -= color.rgb;
            }
        }
    }

    return vec4(sum, 1.0);
}

vec4 applyGaussianBlur(vec2 uv, int radius, float sigma) {
    vec3 sum = vec3(0.0);
    vec2 onePixel = vec2(1.0) / imageResolution * 2.0;
    float avg = 0.0;

    float sigma_sq = sigma * sigma * 2.0;
    float dividend = (3.1415926 * sigma_sq);

    for(int x = -radius; x <= radius; x++) {
        for(int y = -radius; y <= radius; y++) {
            vec4 color;
            float weight = exp(-float(x * x + y * y) / sigma_sq) / dividend;
            color = getTextureColor(uv + vec2(x, y) * onePixel) * weight;
            avg += weight;
            sum += color.rgb;
        }
    }
    return vec4(sum / avg, 1.0);
}

vec4 applyMedianBlur(vec2 uv, int radius) {
    vec2 onePixel = vec2(1.0) / imageResolution;

    if(radius == 0) {
        return getTextureColor(uv);
    }
    radius = min(radius, 5);
    int N = radius * 4 + 1;
    vec3[21] pixels;
    float[21] avgs;
    int index = 0;
    int x = 0;
    int y = 0;
    for(x = -radius; x <= radius; x++) {
        pixels[index] = getTextureColor(uv + vec2(x, y) * onePixel).rgb;
        avgs[index] = (pixels[index].r + pixels[index].g + pixels[index].b);
        index++;
    }
    x = 0;
    for(y = -radius; y <= radius; y++) {
        if(y == 0)
            continue;
        pixels[index] = getTextureColor(uv + vec2(x, y) * onePixel).rgb;
        avgs[index] = (pixels[index].r + pixels[index].g + pixels[index].b);
        index++;
    }

    // sort the array
    for(x = 0; x < N; x++) {
        for(y = 0; y < N; y++) {
            if(avgs[x] < avgs[y]) {
                vec3 temp = pixels[x];
                pixels[x] = pixels[y];
                pixels[y] = temp;

                float temp2 = avgs[x];
                avgs[x] = avgs[y];
                avgs[y] = temp2;
            }
        }
    }

    // return the median value
    return vec4(pixels[N / 2], 1.0);
}

vec4 applyErosion(vec2 uv, int radius) {
    vec2 onePixel = vec2(1.0) / imageResolution;
    vec3 min_ = vec3(1.0);

    for(int x = -radius; x <= radius; x++) {
        for(int y = -radius; y <= radius; y++) {
            vec3 color = getTextureColor(uv + vec2(x, y) * onePixel).rgb;
            min_ = min(min_, color);
        }
    }

    return vec4(min_, 1.0);
}

vec4 applyDilation(vec2 uv, int radius) {
    vec2 onePixel = vec2(1.0) / imageResolution;
    vec3 max_ = vec3(0.0);

    for(int x = -radius; x <= radius; x++) {
        for(int y = -radius; y <= radius; y++) {
            vec3 color = getTextureColor(uv + vec2(x, y) * onePixel).rgb;
            max_ = max(max_, color);
        }
    }

    return vec4(max_, 1.0);
}

bool nThBit(int n, int x) {
    return (n & (1 << x)) != 0;
}

vec4 applySpacialFilters() {
    if(nThBit(filterType, 0)) {
        return applyBoxBlur(vUv, filterRadius, filterStrength);
    } else if(nThBit(filterType, 1)) {
        return applyGaussianBlur(vUv, filterRadius, filterStrength);
    } else if(nThBit(filterType, 2)) {
        return applyMedianBlur(vUv, filterRadius);
    } else if(nThBit(filterType, 3)) {
        return applyHighPassFilter(vUv, filterRadius, filterStrength);
    } else if(nThBit(filterType, 4)) {
        return applyErosion(vUv, filterRadius);
    } else if(nThBit(filterType, 5)) {
        return applyDilation(vUv, filterRadius);
    } else {
        return getTextureColor(vUv);
    }
}

void main() {
    /* Spacial Filters */
    gl_FragColor = applySpacialFilters();

    // /* Transform Filters */
    gl_FragColor = adjustContrast(gl_FragColor, contrast);
    gl_FragColor = adjustBrightness(gl_FragColor, brightness);
    gl_FragColor = adjustExposure(gl_FragColor, exposure);
    gl_FragColor = adjustSaturation(gl_FragColor, saturation);
    gl_FragColor = thresholdImage(gl_FragColor, threshold);
    // gl_FragColor = vec4(threshold, 1.0);
}
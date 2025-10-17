# Hardware Acceleration

Streamline automatically detects and utilizes GPU-based hardware encoders for significantly faster encoding speeds.

## Overview

Hardware acceleration uses your GPU (Graphics Processing Unit) to encode video much faster than CPU-based software encoding. This can result in:

* **5-10x faster encoding** compared to software encoding
* **Lower CPU usage** - freeing resources for other tasks
* **Lower power consumption** - GPUs are more efficient for video encoding
* **Reduced heat generation** - less thermal throttling

## Supported Hardware

### NVIDIA GPUs

**Encoder Technology**: NVENC (NVIDIA Encoder)

**Supported GPUs**:

* GeForce GTX 900 series and newer (Maxwell, Pascal, Turing, Ampere, Ada Lovelace)
* Quadro, Tesla, and RTX professional GPUs
* Most GPUs from 2014 onwards

**Supported Codecs**:

* H.264 (h264\_nvenc)
* H.265/HEVC (hevc\_nvenc)
* AV1 (av1\_nvenc) - RTX 40 series only

**Quality**:

* Excellent quality with recent drivers
* Comparable to x264 "fast" preset
* Multiple quality presets available

**Requirements**:

* NVIDIA GPU drivers 418.81 or newer
* CUDA support enabled

### AMD GPUs

**Encoder Technology**: AMF (Advanced Media Framework)

**Supported GPUs**:

* Radeon RX 400 series and newer (Polaris, Vega, RDNA, RDNA 2, RDNA 3)
* Some older GCN-based GPUs
* Most GPUs from 2016 onwards

**Supported Codecs**:

* H.264 (h264\_amf)
* H.265/HEVC (hevc\_amf)
* AV1 (av1\_amf) - RX 7000 series only

**Quality**:

* Good quality with recent drivers
* Improving with each driver update
* Similar to x264 "fast" preset

**Requirements**:

* AMD GPU drivers 21.10.2 or newer
* AMF runtime installed

### Intel GPUs

**Encoder Technology**: Quick Sync Video (QSV)

**Supported GPUs**:

* Intel HD Graphics 2000 and newer
* Intel Iris Graphics
* Intel Arc Graphics (A-series)
* 6th generation (Skylake) or newer recommended

**Supported Codecs**:

* H.264 (h264\_qsv)
* H.265/HEVC (hevc\_qsv)
* AV1 (av1\_qsv) - Arc GPUs and 11th gen+ iGPUs

**Quality**:

* Good quality with modern drivers
* Arc GPUs have excellent quality
* Older generations (6th-7th gen) have lower quality

**Requirements**:

* Intel Graphics drivers
* Intel Media SDK or oneVPL

### Apple Silicon

**Encoder Technology**: VideoToolbox

**Supported Processors**:

* M1, M1 Pro, M1 Max, M1 Ultra
* M2, M2 Pro, M2 Max, M2 Ultra
* M3, M3 Pro, M3 Max

**Supported Codecs**:

* H.264 (h264\_videotoolbox)
* H.265/HEVC (hevc\_videotoolbox)
* ProRes (prores\_videotoolbox)

**Quality**:

* Excellent quality
* Comparable to x264 "medium" preset
* Very efficient power usage

**Requirements**:

* macOS 11.0 (Big Sur) or newer

## How Streamline Uses Hardware Acceleration

### Automatic Detection

On startup, Streamline:

1. Probes for available hardware encoders
2. Tests each encoder with FFmpeg
3. Enables compatible encoders automatically
4. Falls back to software encoding if unavailable

### Preset Integration

Built-in presets automatically use hardware acceleration when:

* Hardware encoder is available
* Codec is supported by hardware
* Hardware acceleration is enabled in settings

For example:

* "Balanced" preset uses h264\_nvenc on NVIDIA GPUs
* Same preset uses h264\_amf on AMD GPUs
* Automatically falls back to libx264 if no GPU available

### Manual Control

Enable/disable hardware acceleration:

1. Click settings icon (gear)
2. Navigate to "General"
3. Toggle "Hardware Acceleration"
4. Restart encoding for changes to take effect

## Performance Comparison

### Speed Improvements

Typical encoding speed improvements with hardware acceleration:

| Resolution | Software (x264) | NVIDIA NVENC | AMD AMF | Intel QSV | Apple VideoToolbox |
| ---------- | --------------- | ------------ | ------- | --------- | ------------------ |
| 1080p      | 1.0x (baseline) | 8-10x        | 6-8x    | 5-7x      | 7-9x               |
| 4K         | 1.0x (baseline) | 10-15x       | 8-12x   | 6-10x     | 9-12x              |

_Note: Actual performance varies by GPU model, CPU, and content complexity_

### Quality Comparison

Hardware encoders trade a small amount of quality for massive speed gains:

| Encoder          | Quality (vs x264) | Speed (vs x264) | Best Use Case           |
| ---------------- | ----------------- | --------------- | ----------------------- |
| x264 slow        | Baseline (best)   | 1x              | Archival, master copies |
| x264 medium      | -1%               | 3x              | General purpose         |
| x264 fast        | -3%               | 5x              | Quick encodes           |
| NVENC (NVIDIA)   | -2% to -5%        | 10x             | Most video work         |
| AMF (AMD)        | -3% to -7%        | 8x              | Fast encoding           |
| QSV (Intel Arc)  | -2% to -4%        | 7x              | Balanced encoding       |
| QSV (Intel iGPU) | -5% to -10%       | 6x              | Laptop encoding         |
| VideoToolbox     | -2% to -4%        | 9x              | macOS encoding          |

_Percentages are approximate and vary by content_

## Optimizing Hardware Acceleration

### NVIDIA NVENC Settings

For best quality:

```
-preset p7        # Highest quality preset (RTX 20/30/40 series)
-tune hq          # High quality tuning
-rc vbr           # Variable bitrate
-multipass 2      # Two-pass encoding
```

For best speed:

```
-preset p1        # Fastest preset
-tune ll          # Low latency
```

### AMD AMF Settings

For best quality:

```
-quality quality   # Quality mode
-rc vbr           # Variable bitrate
```

For best speed:

```
-quality speed    # Speed mode
-rc cbr           # Constant bitrate
```

### Intel QSV Settings

For best quality:

```
-preset veryslow  # Best quality preset
-look_ahead 1     # Look-ahead encoding
```

For best speed:

```
-preset veryfast  # Fastest preset
```

## Troubleshooting Hardware Acceleration

### Hardware Encoder Not Detected

**Check GPU Drivers**

1. Ensure latest GPU drivers are installed
2. Restart computer after driver update
3. Verify GPU is recognized by system

**Verify FFmpeg Support**

```bash
ffmpeg -encoders | grep nvenc   # NVIDIA
ffmpeg -encoders | grep amf     # AMD
ffmpeg -encoders | grep qsv     # Intel
ffmpeg -encoders | grep videotoolbox  # Apple
```

**Check Settings**

1. Open Streamline settings
2. Verify "Hardware Acceleration" is enabled
3. Restart Streamline

### Poor Quality with Hardware Encoding

**Solutions**:

1. Use higher quality preset (slower encoding)
2. Lower CRF value for better quality
3. Enable two-pass encoding
4. Try different encoder (if multiple GPUs)
5. Fall back to software encoding for critical encodes

### Encoding Failures with Hardware Encoder

**Common Causes**:

* Outdated GPU drivers
* Incompatible codec/format combination
* Resolution exceeds GPU limits
* Corrupted source file

**Solutions**:

1. Update GPU drivers
2. Try software encoding for the file
3. Check source file integrity
4. Reduce resolution or complexity

### Lower Performance Than Expected

**Possible Issues**:

1. **Thermal throttling** - GPU overheating
   * Solution: Improve cooling, reduce GPU load
2. **CPU bottleneck** - File I/O or demuxing limited
   * Solution: Use faster storage (SSD)
3. **Multiple encodes** - GPU saturated
   * Solution: Reduce concurrent jobs
4. **Driver issues** - Outdated or buggy drivers
   * Solution: Update or rollback drivers

## Hardware Acceleration Limitations

### Resolution Limits

Most hardware encoders have limits:

* **Maximum**: Usually 8K (7680×4320)
* **Minimum**: Usually 128×128
* Check specific GPU documentation for exact limits

### Codec Support

Not all codecs are hardware accelerated:

* **VP9**: Limited hardware support
* **AV1**: Only newest GPUs (RTX 40 series, RX 7000, Arc, M3)
* **ProRes**: Only Apple Silicon

### Quality Ceiling

Hardware encoders have a quality ceiling:

* Cannot match x264 "slower" or "veryslow" presets
* Best for speed-critical workflows
* Use software encoding for archival/master copies

### Simultaneous Encoding Limits

Most consumer GPUs limit concurrent encoding sessions:

* **NVIDIA GeForce**: 3 concurrent NVENC sessions (driver limit)
* **AMD**: No hard limit, but performance degrades
* **Intel**: Depends on GPU model and generation
* **Apple**: System manages resources automatically

## Choosing the Right Encoder

### When to Use Hardware Acceleration

✅ **Use hardware acceleration for:**

* Quick encodes (draft reviews, previews)
* Batch processing large libraries
* Real-time or near-real-time encoding
* Reducing CPU load
* Laptop encoding (battery savings)
* Most general-purpose encoding

### When to Use Software Encoding

✅ **Use software encoding for:**

* Maximum quality (archival, masters)
* Codecs without hardware support (VP9, some AV1)
* Very old or very new GPU models
* Precise quality control
* Compatibility-critical encodes

## Multi-GPU Systems

If you have multiple GPUs:

### Selecting GPU (Advanced)

Streamline uses the first detected encoder by default. To manually specify:

1. Open Advanced Settings
2.  Add custom FFmpeg parameter:

    ```
    -gpu 0    # Use first GPU
    -gpu 1    # Use second GPU
    ```

### Load Balancing

For batch processing across multiple GPUs:

* Streamline doesn't currently support multi-GPU load balancing
* Process separate batches manually on each GPU
* Or use FFmpeg directly for advanced multi-GPU setups

## Future Hardware Support

Streamline will continue to add support for:

* New GPU generations and encoders
* Emerging codecs (VVC/H.266)
* Improved quality modes
* Better multi-GPU support

## Next Steps

* Compare quality with [Video Comparison](advanced-usage/video-comparison.md) tool
* Measure performance with [Quality Analysis](advanced-usage/quality-analysis.md)
* Optimize workflows in [Advanced Usage](advanced-usage/)
* Create hardware-specific [Custom Presets](advanced-usage/custom-presets.md)

# Benchmark Mode Guide

Benchmark Mode is a powerful feature in Streamline that allows you to test your system's encoding performance across different codecs and hardware acceleration options. This helps you make informed decisions about which settings provide the best balance between speed and quality for your workflow.

## Accessing Benchmark Mode

- **Menu**: Click the **Benchmark** tab in the top navigation
- **Keyboard Shortcut**: Press `Ctrl+4`

## Overview

The Benchmark Mode tests your system's performance by encoding standardized test videos using different codecs and hardware acceleration methods. Results include:
- Encoding duration
- Speed (encoding speed relative to realtime)
- Frames per second (FPS)
- Output file size
- Bitrate

## System Information Display

When you open Benchmark Mode, you'll see detailed information about your system:

### CPU Information
- **Processor**: Your CPU model and brand
- **Cores**: Number of CPU cores available
- **Clock Speed**: CPU frequency in GHz

### GPU Information
- **Primary GPU**: Your main graphics card (will filter out virtual displays)
- **VRAM**: Dedicated video memory
- **Additional GPUs**: If you have multiple GPUs, they'll all be listed

### Memory Information
- **Total RAM**: Total system memory with type (DDR4, DDR5, etc.)
- **Used**: Currently used RAM
- **Available**: Free RAM available for programs

### System Information
- **OS**: Operating system and version
- **Architecture**: System architecture (x86-64, ARM64, etc.)
- **Hostname**: Your computer's network name
- **Timezone**: Your system timezone
- **Uptime**: How long your system has been running
- **Date/Time**: Current date and time
- **Storage**: Primary drive type and capacity

## Step-by-Step Benchmarking

### 1. Select a Test Video

Choose from four standardized Big Buck Bunny test videos:
- **480p**: ~300MB - Good for quick tests
- **720p**: ~700MB - Balanced resolution
- **1080p**: ~350MB - Common HD resolution
- **4K**: ~750MB - Maximum resolution test

**Why standardized videos?** Using the same video for benchmarking ensures fair comparisons across different systems and over time.

### 2. Download Test Video

Click **"Download Test Video"** to download your selected test video. The download progress will show in the taskbar.

**Note**: Videos are downloaded to your system's temporary folder and are automatically cleaned up after benchmarking.

### 3. Run Benchmark

Click **"Start Benchmark"** to begin testing. The system will automatically detect and test all available encoding options:

#### Software Encoding
- H.264 (libx264)
- H.265 (libx265)
- AV1 (libaom-av1)

#### Hardware Acceleration (if available)

**NVIDIA (NVENC)**
- H.264
- H.265 (HEVC)
- AV1 (if supported)

**AMD (AMF)**
- H.264
- H.265 (HEVC)
- AV1 (if supported)

**Intel Quick Sync Video (QSV)**
- H.264
- H.265 (HEVC)
- AV1 (if supported)

**Apple VideoToolbox**
- H.264
- H.265 (HEVC)

**Progress Tracking**: Watch the real-time progress bar showing which codec is being tested and how many tests remain.

## Understanding the Results

Each result shows:

| Metric | Meaning |
|--------|---------|
| **Codec** | Video codec used (H.264, H.265, AV1) |
| **Acceleration** | Hardware accelerator used or "Software" |
| **Duration** | Total time taken to encode (mm:ss) |
| **Speed** | Encoding speed relative to video length (e.g., 2.5x means 4 seconds of video encodes in 1.6 seconds) |
| **FPS** | Frames per second achieved |
| **File Size** | Output file size in MB |
| **Bitrate** | Average bitrate in kbps |

## Visual Comparison

After benchmarking, a visual bar chart compares the encoding speeds of all tested codecs. The longest bar represents the fastest option for your system.

**Interpretation**:
- **Longer bars**: Faster encoding
- **Shorter bars**: Slower encoding, but may offer better quality or compression

## Saving Benchmarks

Click **"Save Benchmark"** to export results to a `.slbench` file. This file contains:

### Saved Data
- All encoding test results
- Full system specifications (CPU, GPU, RAM, storage info)
- Test video resolution
- Date, time, and timezone
- System uptime
- Hostname and architecture

### Benefits of Saving
- **Track Performance Over Time**: Re-run benchmarks after system updates or configuration changes
- **Compare Systems**: Share `.slbench` files to compare performance across different computers
- **Document Setup**: Keep records of your system configuration
- **Troubleshooting**: Use past results to diagnose performance issues

## Loading Previous Benchmarks

Click on any saved benchmark in the **"Saved Benchmarks"** section to load and view previous results.

## Performance Tips

### For Fastest Encoding
1. Use hardware-accelerated codecs if available (NVIDIA NVENC, AMD AMF, Intel QSV)
2. H.264 is generally faster than H.265 or AV1
3. Lower output resolution = faster encoding

### For Best Quality
1. Use H.265 or AV1 for better compression
2. Increase bitrate settings
3. Use higher quality presets if available

### Hardware Acceleration Notes
- **NVIDIA NVENC**: Highly efficient, excellent speed/quality ratio
- **AMD AMF**: Good performance, widely supported
- **Intel QSV**: Integrated graphics acceleration, energy efficient
- **Apple VideoToolbox**: Optimized for Apple silicon (M1/M2/M3)
- **Software**: No hardware dependency, works everywhere, slower

## Benchmark Best Practices

1. **Close Other Applications**: For accurate results, close other programs before benchmarking
2. **Consistent Environment**: Run benchmarks at roughly the same time for comparable results
3. **Use Same Resolution**: Always test the same resolution for consistent comparisons
4. **Multiple Tests**: Run benchmarks multiple times for average performance
5. **Monitor Temperature**: If CPU/GPU runs very hot, results may be throttled

## File Format (.slbench)

The `.slbench` format is a JSON-based format that stores:
- Benchmark results metadata
- Complete system information
- Test configuration
- Timestamp and timezone

This format is human-readable and can be shared, imported, or analyzed externally.

### Example .slbench File Structure

```json
{
  "results": [
    {
      "name": "H.264 (Software)",
      "codec": "h264",
      "hwAccel": null,
      "duration": 45.231,
      "fps": 22.45,
      "speed": 2.34,
      "fileSize": 52428800,
      "bitrate": 9242880,
      "timestamp": "2025-10-21T15:30:45.123Z"
    },
    {
      "name": "H.264 (NVIDIA NVENC)",
      "codec": "h264",
      "hwAccel": "nvidia",
      "duration": 8.956,
      "fps": 112.5,
      "speed": 11.87,
      "fileSize": 51380224,
      "bitrate": 9189120,
      "timestamp": "2025-10-21T15:31:00.456Z"
    }
  ],
  "systemInfo": {
    "cpu": "Intel Core i9-10900K",
    "cpuCores": 20,
    "cpuSpeed": "3.7GHz",
    "gpu": "NVIDIA GeForce RTX 2060",
    "gpuMemory": "6144MB",
    "ram": "32GB DDR4",
    "ramTotal": "32GB",
    "ramType": "DDR4",
    "ramUsed": "8GB",
    "ramAvailable": "24GB",
    "os": "Windows Windows 11 22631",
    "platform": "win32",
    "arch": "x64",
    "drive": "SSD - Samsung SSD 970 EVO (1.86TB)",
    "hostname": "GAMING-PC",
    "country": "America/New_York",
    "uptime": "48 hours",
    "timestamp": "2025-10-21T15:35:30.789Z",
    "date": "10/21/2025",
    "time": "3:35:30 PM",
    "allGpus": [
      {
        "model": "NVIDIA GeForce RTX 2060",
        "memory": 6144,
        "vendor": "NVIDIA",
        "type": "NVIDIA CUDA"
      }
    ]
  },
  "testVideo": {
    "name": "Big Buck Bunny 1080p 30fps",
    "url": "http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4",
    "resolution": "1080p",
    "size": "~350MB"
  },
  "timestamp": "2025-10-21T15:35:30.789Z"
}
```

### Interpreting the Results

**Duration**: Total time taken to encode the test video in seconds
- Software H.264: 45.23 seconds (slow)
- NVIDIA NVENC: 8.96 seconds (5x faster!)

**Speed**: Encoding speed relative to video playback
- 2.34x means the encoder is 2.34 times faster than realtime
- Higher numbers = faster encoding

**FPS**: Frames encoded per second
- Software: 22.45 FPS (for a 1080p video)
- Hardware: 112.5 FPS (5x faster!)

**File Size**: Output video size in bytes
- H.264 Software: ~50MB
- H.264 NVIDIA: ~48.5MB (slightly better compression)

**Bitrate**: Average bitrate of the encoded file
- Both around 9.2 Mbps (similar quality)

### Key Insights from Example

In this example:
1. **NVIDIA NVENC is 5x faster** (8.96s vs 45.23s)
2. **Quality is similar** (both ~9.2 Mbps bitrate)
3. **File sizes are comparable** (~50MB vs ~48.5MB)
4. **Conclusion**: Use NVIDIA NVENC for this system - massive speed boost with no quality loss!

## Troubleshooting

### "Download failed" error
- Check your internet connection
- Ensure your firewall allows downloads
- Try a different test video

### Benchmark takes very long
- This is normal for software encoding on older systems
- H.264 software encoding is fastest
- Consider using a smaller test video (480p)

### GPU not detected
- Ensure your GPU drivers are up to date
- The system filters out virtual displays - if you see "Unknown GPU", check your drivers
- Hardware acceleration may not be available for your hardware

### Results seem slow
- Background applications may be consuming CPU/GPU resources
- Thermal throttling (CPU/GPU overheating) can reduce performance
- Try with a smaller test video first

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+4` | Open Benchmark Mode |
| `Ctrl+/` | Show all keyboard shortcuts |
| `Escape` | Close dialogs |

## Exporting and Sharing Results

To share your benchmarks:
1. Complete a benchmark test
2. Click **"Save Benchmark"**
3. Share the `.slbench` file with others
4. Others can open it by clicking **"Load Benchmark"**

## Advanced: Manual Comparison

You can compare benchmarks by:
1. Loading one benchmark
2. Noting the results
3. Loading another benchmark
4. Comparing metrics side-by-side

## Future Enhancements

Planned improvements to Benchmark Mode:
- Cloud-based benchmark database for global comparisons
- Automatic driver/firmware update recommendations
- Custom test video upload
- Benchmark scheduling and automation
- Detailed statistical analysis
- Performance trend tracking

## Related Features

- **Encoding**: Use benchmark results to optimize your encoding settings
- **Hardware Support Detection**: Automatically detects available acceleration methods
- **Taskbar Progress**: Monitor encoding/benchmark progress in Windows taskbar

## Support

If you encounter issues with benchmarking:
1. Check the troubleshooting section above
2. Ensure FFmpeg and hardware drivers are up to date
3. Try with a different test video resolution
4. Check system logs for error messages

---

**Last Updated**: October 2025
**Version**: 0.6.0+

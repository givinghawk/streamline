# Quickstart Guide

Get started with Streamline in just a few minutes! This guide will walk you through the basics of encoding your first file.

## Prerequisites

Before using Streamline, you need to have FFmpeg installed on your system:

* **Windows**: Download from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) and add to PATH
* **macOS**: `brew install ffmpeg`
* **Linux**: `sudo apt install ffmpeg` (Ubuntu/Debian) or equivalent

Verify FFmpeg is installed:

```bash
ffmpeg -version
```

## Installation

### Download Pre-built Binary

1. Go to the [Releases page](https://github.com/givinghawk/streamline/releases)
2. Download the latest version for your platform:
   * Windows: `.exe` installer
   * macOS: `.dmg` file
   * Linux: `.AppImage` file
3. Install/run the application

### Build from Source

```bash
git clone https://github.com/givinghawk/streamline.git
cd streamline
npm install
npm run electron:dev
```

## Your First Encode

### Single File Encoding

1. **Launch Streamline**
   * Open the application from your Applications folder or Start menu
2. **Add a File**
   * Drag and drop a video or audio file into the application window
   * OR click the drop zone to browse for a file
3. **Select a Preset**
   * Choose from presets like "Balanced" or "High Quality"
   * For audio files, select an audio preset like "Standard (MP3)"
4. **Start Encoding**
   * Click the "Start Encode" button
   * Watch the progress bar as your file is encoded
   * A notification will appear when complete
5. **Find Your File**
   * By default, files are saved in the same directory with `_optimised` suffix
   * Example: `video.mp4` → `video_optimised.mp4`

### Batch Processing Multiple Files

1. **Drop Multiple Files**
   * Drag and drop several files into the application
   * Each file appears in the batch queue
2. **Configure Settings** (Optional)
   * Select presets for individual files
   * OR use the same preset for all files
3. **Enable Batch Mode** (Optional)
   * Click the settings icon
   * Go to Output Settings
   * Toggle "Batch Mode" to save files in `/optimised` subfolder
4. **Start Batch Processing**
   * Click "Start Batch"
   * Files are processed sequentially
   * Progress updates for each file

## Common Presets

### Video Presets

* **High Quality** - Best quality, larger file size (H.264, CRF 18)
* **Balanced** - Good quality, reasonable size (H.264, CRF 23) - _Recommended_
* **Fast Encoding** - Quick encode, smaller size (H.264, CRF 28)
* **HEVC Balanced** - Better compression with H.265 codec

### Audio Presets

* **High Quality (MP3)** - 320kbps MP3, universal compatibility
* **Standard (MP3)** - 128kbps MP3, good for most uses
* **High Quality** - 256kbps Opus, better quality than MP3
* **Lightweight** - 64kbps Opus, good for speech/podcasts

## Quick Tips

### Hardware Acceleration

* Streamline automatically detects and uses your GPU if available
* NVIDIA, AMD, Intel, and Apple Silicon are supported
* No configuration needed - it just works!

### Custom Output Location

1. Click the folder icon next to the output path
2. Choose a custom directory
3. All encoded files will be saved there

### Quality vs Speed

* Higher CRF values = smaller files, lower quality
* Lower CRF values = larger files, higher quality
* CRF 18-23 is the "sweet spot" for most videos

### Comparing Results

* After encoding, click the play button in the batch queue
* Use the comparison viewer to see original vs encoded side-by-side
* Useful for checking quality before committing to batch processing

## Next Steps

* Read the [User Guide](User-Guide.md) for detailed feature explanations
* Learn about [Advanced Usage](advanced-usage/) for power user features
* Create [Custom Presets](advanced-usage/custom-presets.md) tailored to your needs
* Check [Hardware Acceleration](Hardware-Acceleration.md) to optimize performance

## Need Help?

* Check the [Troubleshooting Guide](Troubleshooting.md)
* Report issues on [GitHub](https://github.com/givinghawk/streamline/issues)

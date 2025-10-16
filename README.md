# Streamline

A powerful desktop application for video and audio encoding with hardware acceleration support, built with Electron and React.

## 📚 Documentation

**[View the complete Wiki documentation](wiki/Home.md)** for comprehensive guides, tutorials, and reference materials.

Quick links:
- [Quickstart Guide](wiki/Quickstart-Guide.md) - Get started in minutes
- [User Guide](wiki/User-Guide.md) - Complete feature documentation
- [Advanced Usage](wiki/Advanced-Usage.md) - Power user features
- [Troubleshooting](wiki/Troubleshooting.md) - Common issues and solutions

## Features

### Core Functionality
- **Batch Processing** - Queue multiple files for sequential encoding
- **Hardware Acceleration** - Automatic detection and support for NVIDIA, AMD, Intel, and Apple Silicon
- **Quality Analysis** - PSNR, SSIM, and VMAF metrics for encoded files
- **Video Comparison** - Side-by-side playback of original and encoded videos
- **Preset System** - Built-in presets and custom preset creation
- **Real-time Progress** - Live encoding progress with speed and bitrate information
- **Custom File Formats** - Save and share queues, presets, analysis, and reports
  - `.slqueue` - Save and load batch processing queues
  - `.slpreset` - Export and import custom encoding presets
  - `.slanalysis` - Share video analysis data
  - `.slreport` - Generate encoding reports with statistics

### Encoding Capabilities
- **Video Codecs** - H.264, H.265/HEVC, VP9, AV1
- **Audio Codecs** - AAC, Opus, MP3, Vorbis
- **Format Support** - MP4, MKV, WebM, and more
- **Advanced Settings** - Custom bitrate, resolution, frame rate, and codec parameters
- **Two-pass Encoding** - Optional two-pass mode for better quality

### User Interface
- **Dark/Light Themes** - Switch between dark and light colour schemes
- **Drag-and-drop** - Drop files directly into the application
- **Thumbnail Generation** - Grid-based video previews
- **Custom Output Paths** - Configure output directories and file naming
- **Notification System** - Desktop notifications on completion
- **File Associations** - Double-click to open Streamline files (Windows, macOS, Linux)

## Prerequisites

- **FFmpeg** - Must be installed and available in system PATH
  - Windows: Download from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/)
  - macOS: `brew install ffmpeg`
  - Linux: `sudo apt install ffmpeg` or equivalent

## Installation

### From Source

1. Clone the repository
```bash
git clone https://github.com/givinghawk/streamline.git
cd streamline
```

2. Install dependencies
```bash
npm install
```

3. Run in development mode
```bash
npm run electron:dev
```

### From Release

Download the latest release for your platform from the [Releases](https://github.com/givinghawk/streamline/releases) page.

## Usage

### Single File Encoding

1. Drop a video or audio file into the application
2. Select a preset or configure custom settings
3. Choose output location (optional)
4. Click "Start Encode"

### Batch Processing

1. Drop multiple files into the application
2. Each file is added to the queue
3. Select presets for individual files or use the same for all
4. Toggle "Batch Mode" in Output Settings to save to `/optimised` subfolder
5. Click "Start Batch" to process all queued files

### Video Comparison

After encoding completes:
1. Find the completed file in the batch queue
2. Click the play button next to the file
3. Use the comparison viewer to see original vs encoded side-by-side

### Quality Analysis

Enable in Settings → General → Quality Analysis to automatically run PSNR, SSIM, and VMAF analysis on encoded video files.

## Configuration

### Settings

Access via the settings icon (gear) in the top-right corner.

**General**
- Hardware acceleration toggle
- Quality analysis enable/disable
- Notification preferences
- Maximum concurrent jobs

**Appearance**
- Dark/light theme selection

**Presets**
- Create custom encoding presets
- Edit existing presets
- Delete unwanted presets

### Output Settings

**Batch Mode**
- Enabled: Files saved to `/optimised` subfolder
- Disabled: Files saved in same directory with `_optimised` suffix

**Custom Output Directory**
- Override default output location
- Browse for directory

**Overwrite Files**
- Replace original files (use with caution)
- Default: Create new files with suffix

## Development

### Project Structure

```
streamline/
├── src/
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── constants/         # Presets and constants
│   ├── utils/             # Utility functions
│   └── electron/          # Electron main process modules
├── main.js                # Electron main process
├── preload.js            # Electron preload script
└── package.json
```

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run electron:dev` - Start Electron with hot reload
- `npm run build` - Build for production
- `npm run package` - Package application for distribution

### Building

Build for your platform:

```bash
npm run build
npm run package
```

Builds are output to the `release/` directory.

## Hardware Acceleration

The application automatically detects available hardware encoders:

- **NVIDIA** - h264_nvenc, hevc_nvenc
- **AMD** - h264_amf, hevc_amf
- **Intel** - h264_qsv, hevc_qsv
- **Apple** - h264_videotoolbox, hevc_videotoolbox

Presets automatically use hardware acceleration when available.

## Supported Formats

### Input Formats
- Video: MP4, MKV, AVI, MOV, WebM, FLV, WMV, and more
- Audio: MP3, AAC, FLAC, WAV, OGG, M4A, and more

### Output Formats
- Video: MP4, MKV, WebM
- Audio: MP3, AAC, OGG, OPUS

## Troubleshooting

### FFmpeg Not Found

Ensure FFmpeg is installed and available in your system PATH. Test by running:
```bash
ffmpeg -version
```

### Hardware Acceleration Not Working

- **NVIDIA**: Install latest GPU drivers
- **AMD**: Ensure AMD GPU drivers are up to date
- **Intel**: Intel Quick Sync requires compatible hardware and drivers

### Encoding Fails

Check the console for error messages. Common issues:
- Invalid input file format
- Insufficient disk space
- Codec not supported by output format

## Contributing

Contributions are welcome! Please read our [Contributing Guide](wiki/Contributing.md) for details on:

- How to report bugs
- How to suggest features
- Code style guidelines
- Pull request process
- Development setup

See also:
- [Development Guide](wiki/Development-Guide.md) - Setting up your dev environment
- [Roadmap](wiki/Roadmap.md) - Planned features and improvements

## Licence

MIT Licence - see [LICENCE](LICENCE) file for details.

## Acknowledgements

- Built with [Electron](https://www.electronjs.org/)
- UI powered by [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
- Encoding powered by [FFmpeg](https://ffmpeg.org/)

## Support

For issues, questions, or suggestions:

- 📖 Check the [Wiki documentation](wiki/Home.md)
- 🐛 Search or open an [issue](https://github.com/givinghawk/streamline/issues)
- 💬 Read the [Troubleshooting Guide](wiki/Troubleshooting.md)
- 🚀 See planned features in the [Roadmap](wiki/Roadmap.md)

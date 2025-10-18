# User Guide

This comprehensive guide covers all the core features and workflows in Streamline.

## Table of Contents

* [Interface Overview](User-Guide.md#interface-overview)
* [Adding Files](User-Guide.md#adding-files)
* [Selecting Presets](User-Guide.md#selecting-presets)
* [Output Settings](User-Guide.md#output-settings)
* [Encoding Process](User-Guide.md#encoding-process)
* [Managing the Queue](User-Guide.md#managing-the-queue)
* [Settings and Preferences](User-Guide.md#settings-and-preferences)

## Interface Overview

### Main Window

The Streamline interface consists of several key areas:

1. **Title Bar** - Window controls (minimize, maximize, close)
2. **Header** - Application logo, Start Encode button, and settings
3. **Mode Tabs** - Switch between different workflows (see below)
4. **Content Area** - Changes based on selected tab
5. **Batch Queue** - List of queued and processed files
6. **Progress Area** - Real-time encoding progress

### Mode Tabs

Streamline v0.5.0 features a tabbed interface for different workflows:

**📥 Import Tab**
- Drag and drop files to add them to the queue
- View basic file information
- Build your encoding queue

**⚙️ Encode Tab**
- Configure encoding settings for queued files
- Select presets and adjust advanced settings
- Set output location and options
- Start encoding process

**📊 Analysis Tab**
- View detailed file analysis
- See codec information, bitrate, and quality metrics
- Analyze before encoding

**✂️ Trim/Concat Tab**
- Trim video clips (remove unwanted sections)
- Concatenate multiple videos into one
- Set start/end times with preview

**⬇️ Download Tab**
- Download videos from YouTube and other sites
- Extract audio from videos
- Choose quality and format

**📦 Presets Tab**
- Browse preset library (built-in, custom, downloaded)
- Create custom presets with Preset Wizard
- Download community presets from GitHub
- Import/export preset files

### Theme Toggle

Switch between dark and light themes:

1. Click the settings icon (gear) in the header
2. Navigate to "Appearance"
3. Select "Dark Mode" or "Light Mode"

## Adding Files

### Drag and Drop

The easiest way to add files:

1. Drag one or more files from your file manager
2. Drop them onto the Streamline window
3. Files are automatically added to the queue

### Click to Browse

Alternative method:

1. Click the drop zone area
2. Browse and select files using the file dialog
3. Click "Open" to add files

### Supported File Types

**Video Input Formats**

* MP4, MKV, AVI, MOV, WebM, FLV, WMV, MPEG, MPG, M4V, 3GP

**Audio Input Formats**

* MP3, AAC, FLAC, WAV, OGG, M4A, WMA, OPUS, AIFF

**Image Input Formats**

* JPEG, PNG, GIF, BMP, TIFF, WebP

### File Information Display

After adding a file, Streamline displays:

* **File name and path**
* **Duration** (for video/audio)
* **Resolution** (for video/images)
* **File size**
* **Format and codecs**
* **Bitrate**
* **Frame rate** (for video)
* **Thumbnail preview** (for video/images)

## Selecting Presets

Presets provide pre-configured encoding settings for common use cases.

### Built-in Video Presets

**High Quality**

* Codec: H.264
* Quality: CRF 18
* Use case: Archival, master copies
* File size: Largest

**Balanced** (Recommended)

* Codec: H.264
* Quality: CRF 23
* Use case: General purpose, good quality/size balance
* File size: Medium

**Fast Encoding**

* Codec: H.264
* Quality: CRF 28
* Use case: Quick encodes, smaller files
* File size: Small

**HEVC High Quality**

* Codec: H.265
* Quality: CRF 20
* Use case: Better compression, modern devices
* File size: Medium (better compression than H.264)

**HEVC Balanced**

* Codec: H.265
* Quality: CRF 24
* Use case: Excellent compression for streaming
* File size: Small to Medium

**AV1 High Quality**

* Codec: AV1
* Quality: CRF 25
* Use case: Next-gen codec, best compression
* File size: Smallest (slow encoding)

### Built-in Audio Presets

**Lossless**

* Codec: FLAC
* Bitrate: Lossless
* Use case: Archival, maximum quality

**High Quality (MP3)**

* Codec: MP3
* Bitrate: 320 kbps
* Use case: Maximum MP3 quality, universal

**Standard (MP3)**

* Codec: MP3
* Bitrate: 128 kbps
* Use case: Typical quality, compatible

**High Quality**

* Codec: Opus
* Bitrate: 256 kbps
* Use case: Better than MP3 at same bitrate

**Standard**

* Codec: Opus
* Bitrate: 128 kbps
* Use case: Good quality, modern codec

**Lightweight**

* Codec: Opus
* Bitrate: 64 kbps
* Use case: Speech, podcasts

**Ultra Lightweight**

* Codec: Opus
* Bitrate: 32 kbps
* Use case: Voice-only content

### Built-in Image Presets

**WebP High Quality**

* Format: WebP
* Quality: 90
* Use case: Modern format, best compression

**WebP Balanced**

* Format: WebP
* Quality: 80
* Use case: Good quality/size balance

**JPEG High Quality**

* Format: JPEG
* Quality: 90
* Use case: Universal compatibility

**JPEG Web Optimized**

* Format: JPEG
* Quality: 75
* Use case: Web images

**PNG Lossless**

* Format: PNG
* Use case: Transparency, lossless

### Switching Presets

1. Select a file in the queue
2. Click the preset dropdown
3. Choose a different preset
4. Settings update automatically

## Output Settings

Configure where and how encoded files are saved.

### Output Location

**Same Directory (Default)**

* Files saved next to original
* Suffix `_optimised` added to filename
* Example: `video.mp4` → `video_optimised.mp4`

**Batch Mode**

* Enable in Output Settings
* Files saved to `/optimised` subfolder
* Original filenames preserved
* Example: `/videos/video.mp4` → `/videos/optimised/video.mp4`

**Custom Directory**

1. Click folder icon in Output Settings
2. Browse for destination directory
3. All files saved to chosen location
4. Original or batch mode naming applies

### File Naming Options

**Overwrite Original Files**

* ⚠️ Use with caution
* Replaces source files with encoded versions
* No backup created
* Enable in Output Settings

**Custom Suffix**

* Change the default `_optimised` suffix
* Available in advanced output settings

## Encoding Process

### Single File Encoding

1. Add a file
2. Select a preset
3. Configure output settings (optional)
4. Click "Start Encode"
5. Monitor progress in real-time
6. Notification on completion

### Progress Information

During encoding, Streamline displays:

* **Progress bar** - Overall completion percentage
* **Speed** - Encoding speed (e.g., "2.5x realtime")
* **Time remaining** - Estimated time to completion
* **Current frame** - Frame being processed
* **Bitrate** - Output bitrate
* **File size** - Current output file size

### Canceling an Encode

* Click "Cancel" button during encoding
* Partial output file is removed
* Queue item marked as canceled

## Managing the Queue

### Batch Queue Features

The batch queue shows all files:

* **Pending** - Not yet processed
* **Encoding** - Currently being processed
* **Complete** - Successfully encoded
* **Failed** - Encoding failed
* **Canceled** - User canceled

### Queue Actions

**Remove from Queue**

* Click the X button next to a file
* Removes file from queue (doesn't delete original)

**Clear Completed**

* Removes all completed files from queue
* Keeps pending files

**Reorder Queue**

* Drag files to change processing order
* Only works for pending files

**Retry Failed**

* Click retry button on failed files
* Re-attempts encoding with same settings

### Viewing Encoded Files

**Open File Location**

* Click folder icon next to completed file
* Opens file manager to output location

**Play Video**

* Click play button on completed video files
* Opens in [Video Comparison](advanced-usage/video-comparison.md) tool

**Quality Metrics**

* If enabled, click metrics button
* View PSNR, SSIM, VMAF scores

## Settings and Preferences

Access via the settings icon in the top-right corner.

### General Settings

**Hardware Acceleration**

* Enable/disable GPU encoding
* Automatic detection of available encoders
* See [Hardware Acceleration](Hardware-Acceleration.md)

**Quality Analysis**

* Enable automatic quality metric calculation
* Runs PSNR, SSIM, VMAF after encoding
* See [Quality Analysis](advanced-usage/quality-analysis.md)

**Notifications**

* Desktop notifications on completion
* Enable/disable per preference

**Maximum Concurrent Jobs**

* Number of files to encode simultaneously
* Default: 1 (recommended)
* Higher values use more resources

### Appearance Settings

**Theme**

* Dark Mode (default)
* Light Mode

### Preset Management

**Create Custom Presets**

* See [Custom Presets](advanced-usage/custom-presets.md)

**Import/Export Presets**

* Share presets with others
* Backup your custom configurations

**Delete Presets**

* Remove unwanted custom presets
* Built-in presets cannot be deleted

## Tips and Best Practices

### Quality vs File Size

* **Lower CRF** = Better quality, larger files
* **Higher CRF** = Smaller files, lower quality
* CRF 18-23 is ideal for most videos
* CRF 28-32 for web streaming

### Speed vs Quality Trade-offs

* **Encoding Preset**: "slow" = better quality, "fast" = quicker encode
* **Two-pass encoding**: Better quality, takes twice as long
* **Hardware acceleration**: Much faster, slightly lower quality

### Batch Processing Tips

1. Test one file first to ensure settings are correct
2. Use batch mode for organizing output
3. Enable quality analysis for the first file only (faster)
4. Sort files by size - encode small files first for quick wins

### Disk Space Management

* Check available disk space before encoding
* Encoded files may be larger with lossless codecs
* Use preview/test encodes for large batches

## Next Steps

* Explore [Advanced Usage](advanced-usage/) for power features
* Learn about [Batch Processing](advanced-usage/batch-processing.md) in detail
* Create [Custom Presets](advanced-usage/custom-presets.md) for your workflow
* Check [Troubleshooting](Troubleshooting.md) for common issues

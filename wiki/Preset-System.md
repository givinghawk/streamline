# Preset System

Streamline's preset system provides pre-configured encoding settings for common use cases, making it easy to achieve great results without deep technical knowledge.

## Overview

Presets are collections of encoding settings including:

* Video codec and quality
* Audio codec and bitrate
* Output format
* Encoding speed
* Additional parameters

## Built-in Presets

Streamline includes carefully tuned presets for video, audio, and images.

### Video Presets

#### High Quality

* **Codec**: H.264 (x264)
* **Quality**: CRF 18
* **Use Case**: Archival, master copies, maximum quality
* **File Size**: Largest
* **Encoding Speed**: Slow
* **Best For**: Videos where quality is paramount

#### Balanced (Recommended)

* **Codec**: H.264 (x264)
* **Quality**: CRF 23
* **Use Case**: General purpose, daily use
* **File Size**: Medium
* **Encoding Speed**: Medium
* **Best For**: Most use cases, excellent quality/size balance

#### Fast Encoding

* **Codec**: H.264 (x264)
* **Quality**: CRF 28
* **Use Case**: Quick encodes, lower quality acceptable
* **File Size**: Small
* **Encoding Speed**: Fast
* **Best For**: Quick previews, drafts, web uploads

#### HEVC High Quality

* **Codec**: H.265 (x265/HEVC)
* **Quality**: CRF 20
* **Use Case**: Better compression than H.264
* **File Size**: Medium (30% smaller than H.264)
* **Encoding Speed**: Very Slow
* **Best For**: Archival with space constraints

#### HEVC Balanced

* **Codec**: H.265 (x265/HEVC)
* **Quality**: CRF 24
* **Use Case**: Streaming, modern devices
* **File Size**: Small
* **Encoding Speed**: Slow
* **Best For**: 4K content, streaming services

#### AV1 High Quality

* **Codec**: AV1 (libaom)
* **Quality**: CRF 25
* **Use Case**: Next-generation codec, best compression
* **File Size**: Smallest (50% smaller than H.264)
* **Encoding Speed**: Extremely Slow
* **Best For**: Future-proofing, bandwidth-limited distribution

### Audio Presets

#### Lossless

* **Codec**: FLAC
* **Quality**: Lossless
* **Use Case**: Perfect audio preservation
* **File Size**: Largest
* **Best For**: Audio archival, production work

#### High Quality (MP3)

* **Codec**: MP3 (libmp3lame)
* **Bitrate**: 320 kbps
* **Use Case**: Maximum MP3 quality
* **File Size**: Large
* **Best For**: Music, universal compatibility needed

#### High Quality

* **Codec**: Opus
* **Bitrate**: 256 kbps
* **Use Case**: Better than MP3 at same bitrate
* **File Size**: Medium
* **Best For**: High-fidelity music, modern players

#### Standard (MP3)

* **Codec**: MP3 (libmp3lame)
* **Bitrate**: 128 kbps
* **Use Case**: Typical quality, compatible everywhere
* **File Size**: Medium
* **Best For**: Most music, voice recordings

#### Standard

* **Codec**: Opus
* **Bitrate**: 128 kbps
* **Use Case**: Better quality than MP3 at 128kbps
* **File Size**: Medium
* **Best For**: Music, audiobooks, modern devices

#### Lightweight

* **Codec**: Opus
* **Bitrate**: 64 kbps
* **Use Case**: Reduced file size, good for speech
* **File Size**: Small
* **Best For**: Podcasts, voice recordings, speech

#### Ultra Lightweight

* **Codec**: Opus
* **Bitrate**: 32 kbps
* **Use Case**: Minimum size for voice-only
* **File Size**: Very Small
* **Best For**: Voice-only podcasts, transcription audio

### Image Presets

#### WebP High Quality

* **Format**: WebP
* **Quality**: 90
* **Use Case**: Modern format with excellent compression
* **File Size**: Medium (smaller than JPEG)
* **Best For**: Web images, modern browsers

#### WebP Balanced

* **Format**: WebP
* **Quality**: 80
* **Use Case**: Good quality/size balance
* **File Size**: Small
* **Best For**: Web optimization

#### JPEG High Quality

* **Format**: JPEG
* **Quality**: 90
* **Use Case**: Universal compatibility
* **File Size**: Large
* **Best For**: Photos, maximum compatibility

#### JPEG Web Optimized

* **Format**: JPEG
* **Quality**: 75
* **Use Case**: Web images
* **File Size**: Small
* **Best For**: Website images, social media

#### PNG Lossless

* **Format**: PNG
* **Use Case**: Lossless, transparency support
* **File Size**: Largest
* **Best For**: Graphics, transparency, lossless

#### GIF

* **Format**: GIF
* **Use Case**: Animated or simple graphics
* **File Size**: Variable
* **Best For**: Animations, simple graphics (256 colors)

## Selecting a Preset

### Auto-Detection

Streamline suggests presets based on file type:

* **Video files** → "Balanced" preset
* **Audio files** → "Standard (MP3)" preset
* **Image files** → "JPEG Web Optimized" preset

### Manual Selection

1. Add a file to Streamline
2. Click the preset dropdown
3. Browse available presets
4. Select the desired preset
5. Settings update automatically

### Preset Categories

Presets are organized by type:

* **Video Presets** - For video encoding
* **Audio Presets** - For audio-only files
* **Image Presets** - For image conversion
* **Custom Presets** - User-created presets

## Understanding Preset Settings

### Video Quality (CRF)

**CRF (Constant Rate Factor)** controls quality:

* **Lower CRF** = Better quality, larger files
* **Higher CRF** = Smaller files, lower quality
* Range: 0 (lossless) to 51 (worst)

**Preset CRF Values**:

* High Quality: CRF 18
* Balanced: CRF 23
* Fast: CRF 28

### Audio Bitrate

**Bitrate** controls audio quality:

* **Higher bitrate** = Better quality, larger files
* **Lower bitrate** = Smaller files, lower quality

**Preset Bitrates**:

* Lossless: No bitrate limit (FLAC)
* High Quality: 256-320 kbps
* Standard: 128 kbps
* Lightweight: 64 kbps
* Ultra Lightweight: 32 kbps

### Encoding Speed

**Preset** controls encoding speed vs quality:

* **Slower presets** = Better quality, longer encoding
* **Faster presets** = Quicker encoding, slightly lower quality

Most built-in presets use "medium" for best balance.

## Hardware Acceleration in Presets

### Automatic GPU Detection

Built-in presets automatically use hardware encoding when:

* GPU encoder is available
* Codec is supported (H.264, H.265)
* Hardware acceleration is enabled

### Fallback to Software

If hardware encoding is not available:

* Preset automatically uses software encoder
* Same quality settings applied
* Encoding is slower but quality maintained

## Comparing Presets

### Quality Comparison

Use [Video Comparison](advanced-usage/video-comparison.md) to evaluate:

1. Encode same file with different presets
2. Open comparison tool for each
3. Visually compare quality
4. Choose best preset for your needs

### Metric Comparison

Use [Quality Analysis](advanced-usage/quality-analysis.md) to measure:

1. Encode with multiple presets
2. Run quality analysis
3. Compare VMAF/SSIM scores
4. Balance quality with file size

### File Size Comparison

**Example: 1080p 60fps, 10-minute video**

| Preset           | File Size | VMAF | Encode Time |
| ---------------- | --------- | ---- | ----------- |
| High Quality     | 1.2 GB    | 97.5 | 15 min      |
| Balanced         | 600 MB    | 92.1 | 8 min       |
| Fast Encoding    | 350 MB    | 85.3 | 4 min       |
| HEVC Balanced    | 380 MB    | 91.8 | 25 min      |
| AV1 High Quality | 280 MB    | 94.2 | 120 min     |

## When to Use Each Preset

### Video Presets

**Use "High Quality" for**:

* ✅ Master copies
* ✅ Archival footage
* ✅ Source material for further editing
* ✅ When storage is not a concern

**Use "Balanced" for**:

* ✅ General purpose encoding
* ✅ Personal video library
* ✅ Sharing with friends/family
* ✅ Local playback
* ✅ Most everyday use cases

**Use "Fast Encoding" for**:

* ✅ Quick previews
* ✅ Draft encodes
* ✅ Web uploads (platform re-encodes anyway)
* ✅ Temporary files

**Use "HEVC Balanced" for**:

* ✅ 4K video
* ✅ Large video libraries (space savings)
* ✅ Modern devices with H.265 support
* ✅ Streaming services

**Use "AV1 High Quality" for**:

* ✅ Future-proofing content
* ✅ Maximum compression needed
* ✅ Long-term archival with space constraints
* ✅ When encoding time is not critical

### Audio Presets

**Use "Lossless" for**:

* ✅ Music archival
* ✅ Audio production
* ✅ Master recordings

**Use "High Quality (MP3)" for**:

* ✅ Music library (maximum compatibility)
* ✅ When you need MP3 format specifically
* ✅ Older devices/players

**Use "High Quality" (Opus) for**:

* ✅ Music on modern devices
* ✅ Better quality than MP3 at same size
* ✅ Audiobooks

**Use "Standard" for**:

* ✅ Most audio files
* ✅ Balanced size/quality
* ✅ Streaming

**Use "Lightweight" for**:

* ✅ Podcasts
* ✅ Voice recordings
* ✅ Speech-focused content
* ✅ Mobile devices

### Image Presets

**Use "WebP" for**:

* ✅ Modern websites
* ✅ Best compression
* ✅ When browser compatibility is assured

**Use "JPEG High Quality" for**:

* ✅ Photography
* ✅ Universal compatibility
* ✅ Printing

**Use "JPEG Web Optimized" for**:

* ✅ Website images
* ✅ Social media
* ✅ Email attachments

**Use "PNG Lossless" for**:

* ✅ Graphics with transparency
* ✅ Screenshots
* ✅ Logos, icons

## Preset Limitations

### Cannot Modify Built-in Presets

Built-in presets are read-only:

* Settings cannot be changed
* Prevents accidental modification
* Ensures consistency

To customize:

1. Use [Advanced Settings](advanced-usage/) to override
2. Create a [Custom Preset](advanced-usage/custom-presets.md) based on built-in preset

### Format Compatibility

Some presets have format restrictions:

* **AV1 codec** → Must use MP4, MKV, or WebM
* **Opus audio** → Best in MKV or WebM
* **FLAC audio** → FLAC or MKV container

Streamline handles this automatically.

## Troubleshooting Presets

### Preset Not Working

**Problem**: Encoding fails with selected preset

**Solutions**:

1. Check source file is compatible
2. Verify FFmpeg supports the codec
3. Try a different preset (e.g., "Balanced")
4. Check error message for specifics

### Unexpected File Size

**Problem**: Output much larger/smaller than expected

**Reasons**:

* Source quality higher/lower than anticipated
* Different content complexity
* Resolution differences

**Solutions**:

* Use [Quality Analysis](advanced-usage/quality-analysis.md) to verify
* Adjust CRF in [Advanced Settings](advanced-usage/)
* Create custom preset with target bitrate

### Quality Not Acceptable

**Problem**: Preset quality too low

**Solutions**:

1. Use higher quality preset
2. Adjust CRF in Advanced Settings
3. Create [Custom Preset](advanced-usage/custom-presets.md) with lower CRF

## Downloading Community Presets

### Preset Browser (v0.5.0+)

Download presets from GitHub repositories directly in the app.

#### Opening Preset Browser

1. Navigate to **Presets** tab (storage icon)
2. Click **"Download Presets"** button
3. Browse available presets from the community

#### Browsing Presets

The Preset Browser shows:
* Preset name and description
* Codec information (video/audio)
* Category (Video, Audio, Image)
* Download status

**Features**:
* Search by name or description
* Filter by category
* Individual preset downloads
* Visual download status

#### Downloading a Preset

1. Find desired preset using search/filter
2. Click **"Download"** button
3. Button shows "Downloading..." with spinner
4. Changes to "✓ Downloaded" when complete
5. Preset appears in main library immediately

#### Managing Repositories

##### Adding Custom Repositories

1. Click **⚙️ (Settings)** icon in Preset Browser
2. Click **"+ Add Repository"**
3. Enter repository in format:
   * `owner/repo` (uses main branch)
   * `owner/repo/branch` (specific branch)
4. Examples:
   * `johndoe/ffmpeg-presets`
   * `company/work-presets/production`

##### Switching Repositories

1. Open repository manager (⚙️ icon)
2. Click **"Select"** on desired repository
3. Presets reload automatically
4. Button changes to **"Active"** (blue)

##### Removing Repositories

1. Open repository manager
2. Click **🗑️ (trash)** icon next to repository
3. Repository removed instantly
4. **Note**: Default repository cannot be removed

#### Repository Format

Compatible repositories must contain:
* `.slpreset` files (JSON format)
* Located in root or `presets/` folder
* Valid preset structure with settings

### Downloaded Preset Management

Downloaded presets:
* Stored in browser localStorage
* Appear in main library with "GitHub" badge
* Can be exported as .slpreset files
* Cannot be edited (create custom version instead)
* Tagged with source repository

### Preset Icons

| Icon | Action | Description |
|------|--------|-------------|
| ↓ | Download Presets | Open preset browser |
| 💾 | Save to File | Export preset as .slpreset |
| ✏️ | Edit | Modify custom preset |
| 🗑️ | Delete | Remove custom preset |

## Next Steps

* Use [Preset Wizard](Preset-Wizard-Guide.md) to create custom presets
* Create [Custom Presets](advanced-usage/custom-presets.md) for specific needs
* Learn about [Advanced Usage](advanced-usage/) to override preset settings
* Use [Quality Analysis](advanced-usage/quality-analysis.md) to compare presets
* Optimize with [Hardware Acceleration](Hardware-Acceleration.md)

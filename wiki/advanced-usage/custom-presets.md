# Custom Presets

Create and manage your own encoding presets tailored to your specific needs and workflows.

## Overview

Custom presets allow you to:

* **Save frequently used settings** for quick access
* **Standardize encoding** across projects or teams
* **Fine-tune parameters** for specific content types
* **Share configurations** with others

## Creating a Custom Preset

### From the Preset Creator

1. **Open Settings**
   * Click the settings icon (gear)
   * Navigate to "Presets" section
2. **Click "Create New Preset"**
   * Preset creator panel opens
3. **Configure Basic Settings**
   * **Name**: Give your preset a descriptive name (e.g., "YouTube 1080p")
   * **Description**: Add details about use case
   * **Category**: Select Video, Audio, or Image
4.  **Configure Encoding Settings**

    **For Video Presets:**

    * **Video Codec**: H.264, H.265, AV1, VP9, or Copy
    * **Quality Mode**: CRF, CBR, or VBR
    * **Quality Value**: CRF value (18-28 typical) or bitrate
    * **Audio Codec**: AAC, Opus, MP3, or Copy
    * **Audio Bitrate**: 64-320 kbps
    * **Resolution**: Original or specific (1080p, 720p, etc.)
    * **Frame Rate**: Original or specific (24, 30, 60 fps)
    * **Output Format**: MP4, MKV, or WebM

    **For Audio Presets:**

    * **Audio Codec**: AAC, Opus, MP3, FLAC, Vorbis
    * **Bitrate**: 32-320 kbps or lossless
    * **Sample Rate**: 44.1 kHz, 48 kHz, etc.
    * **Channels**: Stereo, Mono, 5.1, etc.
    * **Output Format**: MP3, OPUS, FLAC, AAC, etc.

    **For Image Presets:**

    * **Output Format**: JPEG, PNG, WebP, GIF
    * **Quality**: 1-100 (for lossy formats)
    * **Resolution**: Original or specific dimensions
5. **Advanced Options** (Optional)
   * **Encoding Preset**: ultrafast to veryslow
   * **Two-Pass Encoding**: Enable for better quality
   * **Hardware Acceleration**: Force enable/disable
   * **Custom FFmpeg Parameters**: Add advanced options
6. **Save Preset**
   * Click "Save"
   * Preset appears in preset list
   * Available immediately for use

### From Current Settings

Quick method to save current configuration:

1. Configure settings for a file (codec, quality, etc.)
2. Click "Save as Preset" button
3. Enter name and description
4. Preset created with current settings

## Example Custom Presets

### YouTube Upload Preset

**Name**: "YouTube 1080p Optimized"

**Settings**:

* Video Codec: H.264
* CRF: 20
* Resolution: 1920x1080
* Frame Rate: 30 fps
* Audio Codec: AAC
* Audio Bitrate: 192 kbps
* Format: MP4
* Encoding Preset: slow

**Use Case**: Videos for YouTube upload, balancing quality and upload time

### Podcast Preset

**Name**: "Podcast - Voice Optimized"

**Settings**:

* Audio Codec: Opus
* Bitrate: 48 kbps
* Sample Rate: 48 kHz
* Channels: Mono
* Format: OPUS

**Use Case**: Voice-only podcasts, minimum file size

### Instagram Reel Preset

**Name**: "Instagram Reel (1080x1920)"

**Settings**:

* Video Codec: H.264
* CRF: 23
* Resolution: 1080x1920 (9:16)
* Frame Rate: 30 fps
* Audio Codec: AAC
* Audio Bitrate: 128 kbps
* Format: MP4

**Use Case**: Vertical video for Instagram Reels/Stories

### 4K Archival Preset

**Name**: "4K Archival (HEVC)"

**Settings**:

* Video Codec: H.265
* CRF: 18
* Resolution: Original (4K)
* Frame Rate: Original
* Audio Codec: AAC
* Audio Bitrate: 256 kbps
* Format: MKV
* Encoding Preset: slower
* Two-Pass: Enabled

**Use Case**: High-quality 4K archival with excellent compression

### Web Thumbnail Preset

**Name**: "Web Thumbnail 720p"

**Settings**:

* Format: JPEG
* Quality: 85
* Resolution: 1280x720

**Use Case**: Video thumbnails for web

## Managing Custom Presets

### Editing Presets

1. Open Settings → Presets
2. Select custom preset from list
3. Click "Edit" button
4. Modify settings as needed
5. Click "Save" to update

**Note**: Built-in presets cannot be edited

### Deleting Presets

1. Open Settings → Presets
2. Select preset to delete
3. Click "Delete" button
4. Confirm deletion

**Warning**: Deletion is permanent. Consider exporting first if you might need it later.

### Duplicating Presets

To create a variation of an existing preset:

1. Select preset (built-in or custom)
2. Click "Duplicate" button
3. New preset created with same settings
4. Edit as needed
5. Save with new name

### Organizing Presets

**Naming Conventions**:

* Use descriptive names: "YouTube 1080p" not "Preset1"
* Include target resolution: "4K Archival", "720p Web"
* Mention use case: "Podcast Voice", "Instagram Reel"
* Add quality level: "High Quality", "Balanced", "Fast"

**Categories**: Custom presets automatically categorize by type:

* Video presets
* Audio presets
* Image presets
* Mixed presets (if applicable)

## Exporting and Importing Presets

### Exporting Presets

To share or backup presets:

1. Open Settings → Presets
2. Select preset to export
3. Click "Export" button
4. Choose save location
5. Preset saved as `.json` file

**Bulk Export**:

* Select multiple presets (Ctrl/Cmd + Click)
* Click "Export Selected"
* All saved to single file or individual files

### Importing Presets

To load presets from others:

1. Open Settings → Presets
2. Click "Import" button
3. Select `.json` file(s)
4. Presets added to your collection
5. Available immediately

**Auto-Import**:

* Place `.json` files in presets folder
* Streamline auto-loads on startup
* Location: `~/.streamline/presets/` (varies by OS)

### Sharing Presets

**With Team**:

1. Export preset to `.json`
2. Share file via email, cloud storage, etc.
3. Team members import preset
4. Everyone uses identical settings

**Community Sharing**:

* Create GitHub repository of presets
* Share on forums or communities
* Contribute to preset collections

## Advanced Preset Configuration

### Custom FFmpeg Parameters

Add advanced FFmpeg options to presets:

**Examples**:

```
# Denoise filter
-vf "hqdn3d=4:3:6:4.5"

# Sharpen filter
-vf "unsharp=5:5:1.0:5:5:0.0"

# Color grading
-vf "eq=brightness=0.05:contrast=1.1"

# Multiple filters
-vf "hqdn3d=4:3:6:4.5,unsharp=5:5:1.0"

# H.264 tuning
-tune film

# Audio normalization
-af "loudnorm"
```

### Conditional Settings

Create presets with logic (requires custom FFmpeg params):

**Example: Scale only if larger than 1080p**

```
-vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease"
```

**Example: Normalize audio only if needed**

```
-af "loudnorm=I=-16:TP=-1.5:LRA=11"
```

### Hardware-Specific Presets

Create presets optimized for specific GPUs:

**NVIDIA RTX Preset**:

* Codec: h264\_nvenc
* Preset: p7 (highest quality)
* Tune: hq
* RC: vbr
* Multipass: 2

**AMD Radeon Preset**:

* Codec: h264\_amf
* Quality: quality
* RC: vbr

**Intel Arc Preset**:

* Codec: h264\_qsv
* Preset: veryslow
* Look-ahead: enabled

## Preset Best Practices

### Testing Presets

Before using on large batches:

1. **Create test clip** (30-60 seconds)
2. **Encode with preset**
3. **Run quality analysis**
4. **Visual comparison**
5. **Adjust settings** if needed
6. **Update preset**

### Documenting Presets

Include in description:

* Target use case
* Expected quality level
* Typical file size reduction
* Encoding speed estimate
* Compatible formats
* Hardware requirements (if any)

**Example Description**:

```
YouTube 1080p upload preset. Optimized for:
- 1080p content
- Good quality/upload time balance
- CRF 20 provides ~85% size reduction
- ~5 min encoding time per hour of video (hardware accelerated)
- Compatible with all players
```

### Version Control

When updating presets:

1. Export current version before editing
2. Save with version number (e.g., "YouTube\_v2.json")
3. Test new version thoroughly
4. Keep old version as backup
5. Document changes

### Preset Collections

Organize presets by workflow:

**Content Creator Collection**:

* YouTube 4K
* YouTube 1080p
* Instagram Reel
* TikTok Vertical
* Twitter Post

**Archival Collection**:

* 4K HEVC High Quality
* 1080p Balanced
* Audio Lossless
* Audio High Quality

**Podcast Collection**:

* Voice Mono 48k
* Voice Stereo 64k
* Music Stereo 128k

## Troubleshooting Custom Presets

### Preset Doesn't Appear

**Problem**: Saved preset not showing in list

**Solutions**:

1. Restart Streamline
2. Check preset file exists in presets folder
3. Verify JSON syntax is valid
4. Re-import preset

### Encoding Fails with Custom Preset

**Problem**: Error when using custom preset

**Solutions**:

1. Test with built-in preset first (isolate issue)
2. Check FFmpeg supports codec/format combination
3. Verify custom parameters are valid
4. Check source file compatibility
5. Review error message for specifics

### Preset Produces Unexpected Results

**Problem**: Quality or file size not as expected

**Solutions**:

1. Verify CRF/bitrate settings
2. Check resolution and frame rate
3. Ensure correct codec selected
4. Test with sample file
5. Compare with built-in preset

### Import Fails

**Problem**: Cannot import preset file

**Solutions**:

1. Verify file is valid JSON
2. Check file extension is `.json`
3. Ensure preset format is compatible
4. Try re-exporting from source

## Integration with Batch Processing

### Applying Presets to Batches

1. Add multiple files to queue
2. Select files to apply preset to
3. Choose custom preset
4. Settings applied to all selected files

### Per-File Presets in Batch

Mix different custom presets in one batch:

1. File 1: "YouTube 1080p"
2. File 2: "Instagram Reel"
3. File 3: "Podcast Voice"
4. Process all at once

### Preset-Based Workflows

**Example Workflow**:

1. Receive raw footage
2. Apply "4K Archival" preset → Save master copy
3. Apply "YouTube 1080p" preset → Upload version
4. Apply "Instagram Reel" preset → Social media version
5. All from same source, different presets

## Next Steps

* Test presets with [Quality Analysis](quality-analysis.md)
* Validate results with [Video Comparison](video-comparison.md)
* Use in [Batch Processing](batch-processing.md) workflows
* Share with community or team
* Explore [Advanced Usage](./) for complex parameters

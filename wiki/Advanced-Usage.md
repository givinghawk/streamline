# Advanced Usage

This guide covers advanced features and techniques for power users who want to get the most out of Streamline.

## Table of Contents
- [Advanced Encoding Settings](#advanced-encoding-settings)
- [Two-Pass Encoding](#two-pass-encoding)
- [Custom FFmpeg Parameters](#custom-ffmpeg-parameters)
- [Working with Different Formats](#working-with-different-formats)
- [Optimizing for Different Use Cases](#optimizing-for-different-use-cases)
- [Scripting and Automation](#scripting-and-automation)

## Advanced Encoding Settings

Beyond presets, Streamline offers granular control over encoding parameters.

### Video Codec Selection

Available codecs and their use cases:

**H.264 (x264)**
- Most compatible codec
- Excellent quality/size ratio
- Hardware acceleration widely available
- Best for: General purpose, compatibility

**H.265 (x265/HEVC)**
- 25-50% better compression than H.264
- Requires more powerful devices for playback
- Hardware acceleration on modern GPUs
- Best for: Streaming, archival, modern devices

**AV1**
- Next-generation codec
- Best compression efficiency
- Very slow software encoding
- Limited hardware acceleration
- Best for: Future-proofing, bandwidth-limited streaming

**VP9**
- Google's codec, used by YouTube
- Good compression
- Slower than H.264
- Best for: Web video, YouTube uploads

**Copy (No Re-encode)**
- Copies video stream without transcoding
- Useful when only changing container or audio
- Instant processing
- Best for: Container conversion, audio-only changes

### Audio Codec Selection

**AAC**
- Universal compatibility
- Good quality at medium bitrates
- Default for MP4 containers
- Recommended bitrate: 128-256 kbps

**Opus**
- Best quality at low bitrates
- Superior to MP3 at all bitrates
- Less compatible than MP3
- Recommended bitrate: 64-256 kbps

**MP3**
- Universal compatibility
- Older codec, less efficient
- Recommended bitrate: 128-320 kbps

**FLAC**
- Lossless audio compression
- Larger file sizes
- Perfect quality preservation
- Best for: Audio archival

**Copy**
- Preserves original audio stream
- No quality loss
- Useful for video re-encoding only

### Resolution and Scaling

**Scaling Modes**
- Preserve aspect ratio automatically
- Scale to standard resolutions (4K, 1080p, 720p, etc.)
- Custom dimensions with aspect ratio maintenance

**Scaling Algorithms**
- **Lanczos**: Best quality, slower
- **Bicubic**: Good quality, faster
- **Bilinear**: Fast, acceptable quality

**Best Practices**
- Don't upscale video (rarely beneficial)
- Downscale in increments (4K → 1080p, not 4K → 480p)
- Maintain aspect ratio to avoid stretching

### Frame Rate Control

**Frame Rate Options**
- **Original**: Preserve source frame rate
- **60 fps**: Smooth motion, larger files
- **30 fps**: Standard for most content
- **24 fps**: Cinematic look, smaller files

**Frame Rate Conversion**
- Reducing frame rate saves file size
- Increasing frame rate doesn't add motion smoothness
- Use original frame rate when possible

### Bitrate Control Modes

**Constant Quality (CRF) - Recommended**
- Best quality/size balance
- Adapts bitrate based on complexity
- Range: 0 (lossless) to 51 (worst)
- Recommended: 18-28

**Constant Bitrate (CBR)**
- Fixed bitrate throughout
- Predictable file sizes
- Less efficient than CRF
- Best for: Streaming with bandwidth limits

**Variable Bitrate (VBR)**
- Adjusts bitrate based on complexity
- Better quality than CBR
- Less predictable sizes

**Two-Pass Encoding**
- Analyzes video first, then encodes
- Better quality than single-pass
- Takes approximately 2x longer
- Best for: Final production renders

## Two-Pass Encoding

Two-pass encoding provides superior quality by analyzing the video before encoding.

### How It Works

1. **First Pass**: Analyzes entire video, creates statistics
2. **Second Pass**: Uses statistics to optimize encoding

### Enabling Two-Pass

1. Open Advanced Settings
2. Check "Enable Two-Pass Encoding"
3. Start encoding

### When to Use Two-Pass

**Recommended For:**
- Final production outputs
- Broadcast quality
- Target file size accuracy
- Complex videos with varying scenes

**Skip For:**
- Quick encodes
- Test encodes
- Real-time encoding
- Simple/static videos

### Performance Impact

- Approximately 2x encoding time
- 5-15% quality improvement
- Better bitrate allocation
- More accurate file size prediction

## Custom FFmpeg Parameters

For ultimate control, add custom FFmpeg parameters.

### Adding Custom Parameters

1. Open Advanced Settings
2. Expand "Custom FFmpeg Parameters"
3. Enter parameters in the text field
4. Parameters are appended to FFmpeg command

### Useful Custom Parameters

**Video Filters**
```
-vf "eq=brightness=0.1:contrast=1.2"  # Adjust brightness/contrast
-vf "hqdn3d=4:3:6:4.5"               # Denoise
-vf "unsharp=5:5:1.0:5:5:0.0"        # Sharpen
```

**Audio Filters**
```
-af "volume=1.5"                     # Increase volume
-af "loudnorm"                       # Normalize audio levels
-af "highpass=f=200"                 # Remove low frequencies
```

**Codec-Specific Options**
```
-tune film                           # Optimize for film content
-preset slower                       # Slower preset for better quality
-profile:v high                      # H.264 profile
```

**Advanced H.264/H.265 Options**
```
-x264-params "ref=5:bframes=5"      # Reference frames and B-frames
-x265-params "ctu=32:max-tu-size=16" # H.265 block sizes
```

### Safety Notes

- Invalid parameters may cause encoding to fail
- Test on a small file first
- Refer to [FFmpeg documentation](https://ffmpeg.org/documentation.html)

## Working with Different Formats

### Container Formats

**MP4**
- Best compatibility
- Supports H.264, H.265, AAC
- Recommended for: General distribution

**MKV (Matroska)**
- Open format
- Supports all codecs
- Better chapter/subtitle support
- Recommended for: Archival, complex media

**WebM**
- Web-optimized format
- Supports VP9, AV1, Opus
- Recommended for: Web video

### Format Conversion

**Video Container Only**
1. Select "Copy" for video codec
2. Select "Copy" for audio codec
3. Choose different output format
4. Instant conversion (no re-encoding)

**Audio Extraction**
1. Select "Copy" for audio codec (or transcode)
2. Select audio-only format (MP3, FLAC, etc.)
3. Video is automatically discarded

### Handling Subtitles

Subtitles in source files:
- **Embedded subtitles**: Copied automatically (MKV)
- **External subtitles**: Not currently supported
- **Burn-in**: Use custom FFmpeg parameters

## Optimizing for Different Use Cases

### YouTube/Web Upload

**Settings:**
- Codec: H.264 or VP9
- CRF: 20-23
- Resolution: 1080p or 4K
- Frame Rate: Original or 60fps
- Audio: AAC 128kbps or Opus 128kbps

**Why:**
- H.264 for compatibility
- VP9 for better compression (YouTube re-encodes anyway)
- High quality ensures good quality after re-encode

### Streaming Services

**Settings:**
- Codec: H.264
- Bitrate: 5-8 Mbps for 1080p, 35-45 Mbps for 4K
- Profile: High
- Audio: AAC 192kbps

**Why:**
- Predictable quality for streaming
- Wide compatibility
- Sufficient quality for streaming platforms

### Archival/Master Copies

**Settings:**
- Codec: H.265 or Lossless
- CRF: 15-18 (or lossless)
- Resolution: Original
- Two-pass: Enabled
- Audio: FLAC or high-bitrate AAC

**Why:**
- Maximum quality preservation
- Future-proof with H.265
- Lossless for irreplaceable content

### Mobile Devices

**Settings:**
- Codec: H.264
- Resolution: 720p or 1080p
- CRF: 23-25
- Audio: AAC 128kbps

**Why:**
- H.264 hardware decoding on all devices
- Lower resolution saves space
- Balanced quality for small screens

### Social Media

**Settings:**
- Codec: H.264
- Resolution: 1080p (vertical: 1080x1920)
- CRF: 23
- Frame Rate: 30fps
- Audio: AAC 128kbps

**Why:**
- Platforms re-encode anyway
- Good balance of quality and size
- Fast upload times

### DVD/Blu-ray Ripping

**Settings:**
- Codec: H.264 or H.265
- CRF: 18-20
- Resolution: Original
- Two-pass: Enabled
- Audio: AAC 256kbps or FLAC

**Why:**
- Preserve original quality
- Reduce file size significantly
- Maintain compatibility

## Scripting and Automation

### Command Line Usage

While Streamline is a GUI app, you can use FFmpeg directly for scripting:

```bash
# Get FFmpeg command used by Streamline
# Available in console/developer tools during encoding

# Example H.264 encode
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
```

### Batch Processing via File System

1. Create a folder structure:
   ```
   /videos/
     /to-encode/
     /optimised/
   ```

2. Add files to `/to-encode/`

3. Enable Batch Mode in Streamline

4. Process all files

5. Results appear in `/optimised/`

### Preset Export/Import

**Export Presets:**
1. Settings → Presets
2. Select preset
3. Click Export
4. Save .json file

**Import Presets:**
1. Settings → Presets
2. Click Import
3. Select .json file
4. Preset added to list

**Share Presets:**
- Create a preset repository
- Share JSON files with team
- Maintain consistent encoding standards

## Performance Optimization

### Maximizing Encoding Speed

1. **Enable Hardware Acceleration**
   - Use GPU encoders when available
   - 5-10x faster than software encoding

2. **Adjust Encoding Preset**
   - "veryfast" or "ultrafast" for speed
   - Quality degradation is minimal for most content

3. **Reduce Resolution**
   - Encoding time scales with pixel count
   - 1080p is 4x faster than 4K

4. **Parallel Encoding**
   - Increase concurrent jobs (Settings)
   - Requires sufficient CPU/GPU resources

### Optimizing Quality

1. **Use Two-Pass Encoding**
   - Better bitrate allocation

2. **Slower Encoding Preset**
   - "slow" or "slower" for best quality
   - Diminishing returns beyond "slower"

3. **Test Different CRF Values**
   - Encode short clips at different CRF values
   - Use [Video Comparison](Video-Comparison.md) to evaluate

4. **Enable Quality Analysis**
   - Measure PSNR/SSIM/VMAF
   - Fine-tune settings based on metrics

## Troubleshooting Advanced Scenarios

### Large File Handling

- Files over 4GB: Use MKV instead of MP4 (FAT32 limit)
- 4K encoding: Ensure adequate RAM (16GB+)
- Very long videos: Consider splitting

### Quality Issues

- Banding: Increase bitrate or decrease CRF
- Blocking: Reduce compression or use deblock filter
- Blur: Check source quality, try sharpening filter

### Audio Sync Issues

- Usually from source file
- Try: `-async 1` custom parameter
- Check original with media player

## Next Steps

- Master [Custom Presets](Custom-Presets.md) for reusable configurations
- Learn about [Quality Analysis](Quality-Analysis.md) metrics
- Explore [Hardware Acceleration](Hardware-Acceleration.md) in depth
- Check [Troubleshooting](Troubleshooting.md) for specific issues

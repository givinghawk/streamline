# HDR and 10-bit Encoding

Streamline supports advanced HDR (High Dynamic Range) encoding and 10-bit color depth for professional-grade video compression.

## What is HDR?

HDR (High Dynamic Range) extends the range of brightness and colors in video compared to standard SDR (Standard Dynamic Range). This results in:
- **More lifelike colors** - Wider color gamut (BT.2020 vs BT.709)
- **Better brightness range** - From very dark to very bright
- **Smoother gradients** - Reduced banding with 10-bit color
- **Professional quality** - Required for modern streaming and broadcast

## HDR Formats Supported

### SDR (Standard Dynamic Range)
- **Description**: Traditional video format for standard displays
- **Bit Depth**: 8-bit (256 levels per channel)
- **Use Case**: Maximum compatibility, streaming to all devices
- **Container**: MP4, MKV, WebM

### HDR10
- **Description**: Most common HDR format with static metadata
- **Bit Depth**: 10-bit (1024 levels per channel)
- **Peak Brightness**: 1000 nits
- **Use Case**: Best balance of compatibility and quality
- **Container**: MP4, MKV, MOV
- **Playback**: Netflix, Apple TV, most HDR devices

### HDR10+
- **Description**: HDR10 with dynamic metadata for scene-by-scene optimization
- **Bit Depth**: 10-bit
- **Peak Brightness**: 4000 nits
- **Use Case**: Premium streaming (Amazon Prime Video)
- **Container**: MKV, MOV
- **Note**: Requires devices with HDR10+ support

### Dolby Vision
- **Description**: Premium proprietary HDR format
- **Bit Depth**: 10-bit or 12-bit
- **Peak Brightness**: 10,000 nits
- **Use Case**: Premium theatrical and streaming (requires license)
- **Container**: MP4, MOV, MKV
- **License**: Required for encoding

### HLG (Hybrid Log-Gamma)
- **Description**: Broadcast HDR standard
- **Bit Depth**: 10-bit
- **Use Case**: Professional broadcast and production
- **Container**: MKV
- **Note**: Standard for UK and European broadcasting

## Bit Depth Explained

### 8-bit (SDR)
- **Levels**: 256 per channel (8² = 256)
- **File Size**: Baseline
- **Quality**: Standard, risk of banding in gradients
- **Use**: SDR content, maximum compatibility

### 10-bit (HDR Standard)
- **Levels**: 1024 per channel (2¹⁰ = 1024)
- **File Size**: ~5-10% larger than 8-bit
- **Quality**: Smooth gradients, no visible banding
- **Use**: HDR content, professional work

### 12-bit (Professional)
- **Levels**: 4096 per channel (2¹² = 4096)
- **File Size**: ~15-20% larger than 8-bit
- **Quality**: Maximum precision for color grading
- **Use**: Professional mastering, archival
- **Note**: Limited device support

## Color Spaces

### BT.709 (SDR)
- **Primaries**: Standard color gamut
- **Luminance**: Rec. 709 (standard broadcast)
- **Use**: SDR video, standard displays
- **Coverage**: ~35% of the color spectrum

### BT.2020 (HDR)
- **Primaries**: Wide color gamut
- **Luminance**: Optimized for HDR
- **Use**: HDR video, modern displays
- **Coverage**: ~75% of the color spectrum

## Using HDR Settings in Streamline

### Accessing HDR Settings

1. Go to the **Encode** tab
2. Click **Customize Preset** to show advanced settings
3. Scroll to **HDR & 10-bit Encoding** section

### Configuration Steps

#### For HDR10 (Recommended)
```
1. HDR Mode: Select "HDR10"
2. Bit Depth: 10-bit (auto-selected)
3. Color Space: BT.2020 (auto-selected)
4. Container: .mkv or .mp4
5. Encoder: HEVC/H.265 (auto-selected)
```

#### For Standard Video (SDR)
```
1. HDR Mode: SDR (default)
2. Bit Depth: 8-bit
3. Color Space: BT.709
4. Encoder: H.264 or H.265
```

#### For Professional Broadcast (HLG)
```
1. HDR Mode: HLG
2. Bit Depth: 10-bit
3. Color Space: BT.2020
4. Container: .mkv
```

## Hardware Requirements

### Encoding
- **HDR10**: HEVC encoder required (libx265 or hardware encoder)
- **HLG**: HEVC encoder required
- **Dolby Vision**: Professional hardware/software license needed
- **H.264**: Cannot encode HDR (SDR only)

### Decoding/Playback
- **Windows**: Windows 10/11 with HEVC support
- **macOS**: macOS 11+
- **Streaming**: Netflix, Apple TV, Amazon Prime Video, YouTube
- **Displays**: HDR-capable monitor/TV (1000+ nits minimum)

## Encoder Recommendations

### For HDR Encoding
- **libx265**: Free, well-maintained, good quality
- **hevc_nvenc** (NVIDIA): Fast, requires RTX or newer
- **hevc_amf** (AMD): Fast, requires RDNA architecture
- **hevc_videotoolbox** (Apple): Integrated on Apple Silicon

### For SDR Encoding
- **libx264**: Excellent compatibility, baseline
- **libx265**: 20-30% smaller files than x264
- **libvpx-vp9**: Google's codec, good for web

## Container Format Support

| Format | HDR10 | HDR10+ | Dolby Vision | HLG | Notes |
|--------|-------|--------|--------------|-----|-------|
| MP4    | ✓     | ✗      | ✓            | ✗   | Limited HDR support |
| MKV    | ✓     | ✓      | ✓            | ✓   | Best for HDR (recommended) |
| MOV    | ✓     | ✗      | ✓            | ✗   | Apple standard |
| WebM   | ✗     | ✗      | ✗            | ✗   | SDR only |

## Quality Settings for HDR

### Recommended CRF Values (HEVC)
- **Streaming**: CRF 23-25 (quality/size balance)
- **High Quality**: CRF 18-22 (larger files)
- **Archival**: CRF 14-18 (highest quality)

### Preset Selection
- **Slow**: Best compression, longer encoding (~2-3x normal)
- **Medium**: Balanced (recommended)
- **Fast**: Quick encoding, larger files

## Common Workflows

### Convert SDR to HDR (Tone Mapping)
```
1. Select input video
2. Set HDR Mode: HDR10
3. Streamline applies automatic tone mapping
4. Result: SDR content displayed as HDR
⚠️ Note: This simulates HDR, not true HDR
```

### Preserve HDR from Original
```
1. Import HDR10 video
2. HDR Mode auto-detected (if supported)
3. Select "Preserve HDR" option
4. Encoder and settings auto-configured
```

### Create HDR Archive
```
1. Set Bit Depth: 12-bit (maximum quality)
2. Set Container: MKV (maximum format support)
3. Set Preset: Slow (best compression)
4. Result: Highest-quality archival copy
```

## Validation and Warnings

Streamline validates your HDR configuration and warns about:
- **Incompatible encoder**: H.264 cannot encode HDR
- **Low bit depth**: 8-bit with HDR may cause banding
- **Container mismatch**: Format doesn't support chosen HDR mode
- **License requirements**: Dolby Vision requires licensing

## Troubleshooting

### "H.264 cannot encode HDR"
- **Solution**: Select HEVC (H.265) encoder in advanced settings

### "Banding in gradients"
- **Solution**: Increase bit depth to 10-bit or higher

### HDR not detected on playback
- **Check**: 
  - Device supports HDR format
  - Display is HDR-capable
  - Player supports HDR
  - File contains HDR metadata

### File size too large
- **Solutions**:
  - Increase CRF value (lower quality)
  - Use "Fast" preset
  - Reduce resolution
  - Use HDR10 instead of 12-bit

### "Repository not found" error
- **Solution**: Ensure repository path is correct (owner/repo)

## Advanced Tips

### Tone Mapping for SDR to HDR
```
Quality: Medium (recommended)
Methods: Hable, Gamma, Linear, Clip
Use for: Creative tone mapping of SDR content
```

### Metadata Preservation
- Enable "Include HDR Metadata" to preserve:
  - Color primaries (BT.2020)
  - Transfer function (SMPTE 2084)
  - Color range (TV range)
  - Peak brightness values

### Batch HDR Encoding
1. Add multiple files to queue
2. Select HDR preset
3. Configure settings once
4. Encode all files with same settings

## Standards References

- **HDR10**: SMPTE ST.2086, ITU-R BT.2100
- **HDR10+**: Enhancement to HDR10 with dynamic metadata
- **Dolby Vision**: Proprietary from Dolby Laboratories
- **HLG**: ITU-R BT.2100, Rec. 2100-2
- **Color Spaces**: ITU-R BT.709, ITU-R BT.2020

## Performance Impact

### Encoding Time
- **10-bit vs 8-bit**: ~5-15% slower
- **Preset difference**: Slow is 3-5x slower than Fast
- **Hardware encoding**: 10-20x faster than software

### File Size
- **8-bit vs 10-bit**: ~5-10% larger
- **Compression factor**: Depends heavily on content
- **HDR metadata**: <1% additional size

## Future Enhancements

Planned improvements to HDR support:
- [ ] Automatic HDR detection and conversion
- [ ] Per-frame tone mapping
- [ ] HDR validation and quality reporting
- [ ] Batch HDR conversion
- [ ] HDR preview support
- [ ] Metadata inspection tools

## Resources

- [HDR10 Specification](https://en.wikipedia.org/wiki/HDR10)
- [HEVC/H.265 Codec](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding)
- [FFmpeg HDR Documentation](https://ffmpeg.org/ffmpeg-filters.html#hdr-filters)
- [Netflix HDR Best Practices](https://partnerhelp.netflixstudios.com/)
- [Apple HDR Guidelines](https://developer.apple.com/documentation/media/hdr_video)

## Support

For HDR-related questions or issues:
- [Report bugs](https://github.com/givinghawk/streamline/issues)
- [Join discussions](https://github.com/givinghawk/streamline/discussions)
- [Review examples](https://github.com/givinghawk/streamline/wiki)

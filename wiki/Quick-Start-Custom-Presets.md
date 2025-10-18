# Quick Start: Creating Custom Presets

## What are Presets?

Presets are saved encoding configurations that let you quickly apply your favorite settings to videos and audio files. Instead of manually configuring codecs, bitrates, and quality settings every time, you can create a preset once and reuse it.

## Accessing the Preset Manager

1. Open Streamline
2. Click the **"Presets"** tab in the top navigation
3. You'll see all available presets (built-in and custom)

## Creating Your First Custom Preset

### Step 1: Basic Information

1. Click **"Create Preset"** button
2. Enter a descriptive name (e.g., "YouTube 1080p Upload")
3. Select category: **Video**, **Audio**, or **Image**
4. Add a description (optional but recommended)
5. Choose output format (MP4, MKV, MP3, etc.)
6. Click **"Next"**

### Step 2: Video Settings (Basic)

Skip this if you selected "Audio" category.

1. **Video Codec**: Choose your encoder
   - **H.264 (libx264)** - Best compatibility, works everywhere
   - **H.265 (libx265)** - Better compression, smaller files
   - **Hardware encoders** - Faster encoding (NVENC, QSV, AMF, VideoToolbox)

2. **Hardware Acceleration**: Choose if available
   - CUDA (NVIDIA GPUs)
   - Quick Sync (Intel CPUs)
   - VideoToolbox (Apple Silicon)

3. **Quality (CRF)**: Lower = better quality
   - **18** - Near-lossless (large files)
   - **23** - Good balanced quality (recommended)
   - **28** - Smaller files, visible quality loss

4. **Encoding Speed**: How long you want to wait
   - **Fast** - Quick encoding, larger files
   - **Medium** - Good balance (recommended)
   - **Slow** - Takes longer, better compression

5. Click **"Next"**

### Step 3: Video Settings (Advanced)

Configure additional video parameters or skip to next step.

**Resolution:**
- Keep original or scale to 1080p, 720p, etc.

**Bitrate Control:**
- Leave empty to use CRF (recommended)
- Set specific bitrate for precise file size control

**Codec Settings:**
- Profile, level, tune options
- Most users can skip this

Click **"Next"**

### Step 4: Audio Settings

1. **Audio Codec**: Choose audio format
   - **AAC** - Best compatibility
   - **Opus** - Best quality-to-size ratio
   - **MP3** - Universal compatibility
   - **FLAC** - Lossless, perfect quality

2. **Bitrate**: Higher = better quality
   - **128kbps** - Standard quality
   - **192kbps** - High quality (recommended)
   - **320kbps** - Maximum quality

3. **Channels**:
   - Stereo (2.0) - Most common
   - 5.1 or 7.1 for surround sound

4. **Sample Rate**: 48000 Hz is standard

Click **"Next"**

### Step 5: Advanced Options

Optional settings for power users:

- **HDR & Color Space** - For HDR video
- **Video Filters** - Deinterlace, denoise
- **Subtitles** - Copy or burn subtitles
- **Metadata** - Preserve file information
- **Performance** - Multi-threading options

Most users can skip this step.

Click **"Next"**

### Step 6: Review & Save

1. Review your preset summary
2. Preview the FFmpeg command (for reference)
3. Choose one:
   - **Save Preset** - Add to your library
   - **Export .slpreset** - Save as file to share

## Using Your Custom Preset

1. Go to **"Encode"** tab
2. Import your video/audio file
3. Click **"Select Preset"**
4. Find your custom preset in the list
5. Click **"Encode"**

## Managing Presets

### Editing a Preset
1. Go to **"Presets"** tab
2. Find your custom preset
3. Click the **edit icon** (pencil)
4. Make changes in wizard
5. Click **"Update Preset"**

### Deleting a Preset
1. Go to **"Presets"** tab
2. Find your custom preset
3. Click the **trash icon**
4. Confirm deletion

### Exporting a Preset (Sharing)
1. Go to **"Presets"** tab
2. Find any preset (even built-in ones)
3. Click the **download icon**
4. Share the `.slpreset` file with others

### Importing a Preset
1. Go to **"Presets"** tab
2. Click **"Import"** button
3. Select a `.slpreset` file
4. Preset appears in your library

## Preset Examples

### YouTube Upload (1080p)
- **Codec**: H.264
- **CRF**: 23
- **Preset**: Medium
- **Audio**: AAC, 192kbps
- **Format**: MP4
- Fast start enabled

### Archive Quality (H.265)
- **Codec**: H.265
- **CRF**: 18
- **Preset**: Slow
- **Audio**: AAC, 256kbps
- **Format**: MP4
- Best quality, takes longer

### Quick Encode (Hardware)
- **Codec**: H.264 NVENC
- **CRF**: 23
- **Preset**: Fast
- **Audio**: AAC, 192kbps
- **Format**: MP4
- Very fast with GPU

### Lossless Audio Extract
- **Category**: Audio
- **Codec**: FLAC
- **Format**: FLAC
- Perfect quality preservation

### Small File (Web)
- **Codec**: H.264
- **CRF**: 28
- **Preset**: Fast
- **Audio**: AAC, 128kbps
- **Resolution**: 720p
- **Format**: MP4

## Tips & Tricks

### Quality Guidelines
- **CRF 18** - Near-lossless, for archival
- **CRF 20-23** - High quality, recommended for most uses
- **CRF 24-28** - Smaller files, good for web/sharing
- **CRF 28+** - Very small, noticeable quality loss

### Codec Selection
- **Need compatibility?** Use H.264 + AAC + MP4
- **Want smaller files?** Use H.265 + Opus + MKV
- **Have NVIDIA GPU?** Use H.264 NVENC for speed
- **Archiving important videos?** Use H.265 + FLAC + MKV

### Audio Bitrates
- **Speech/Podcasts**: 64-96kbps
- **Music (Standard)**: 128-160kbps
- **Music (High Quality)**: 192-256kbps
- **Music (Maximum)**: 320kbps or lossless

### When to Use Hardware Encoding
- ✅ Encoding many files quickly
- ✅ Real-time encoding (streaming)
- ✅ Don't need maximum compression
- ❌ Need smallest possible file size
- ❌ Maximum quality is priority

### Fast Start (MP4/MOV)
Always enable "fast start" for videos that will be:
- Uploaded to web (YouTube, Vimeo, etc.)
- Streamed online
- Shared on social media

This allows playback to start immediately without downloading entire file.

## Common Questions

**Q: Can I edit built-in presets?**  
A: No, but you can create a custom preset based on a built-in one by exporting and re-importing it.

**Q: How many custom presets can I create?**  
A: Unlimited! Create as many as you need.

**Q: Do presets work across different computers?**  
A: Yes! Export to `.slpreset` and import on another machine with Streamline.

**Q: What happens if I delete a preset I'm using?**  
A: The encoding will fail if you try to use a deleted preset. Create a new one or use a different preset.

**Q: Can I backup my presets?**  
A: Yes! Export each preset to `.slpreset` files and store them safely.

**Q: Why does my hardware encoder not appear?**  
A: Your GPU may not support it, or you need to update graphics drivers. Check the Analysis tab for hardware detection.

**Q: What's the difference between CRF and bitrate?**  
A: 
- **CRF** (Constant Rate Factor) - Maintains consistent quality, file size varies
- **Bitrate** - Maintains specific bitrate, quality may vary
- Most users should use CRF for better quality

## Need More Help?

- Check the **Analysis** tab to see what hardware encoders are available
- Test presets on short clips before encoding long videos
- Join the community to share and discover presets
- Read the full documentation in the wiki

## Keyboard Shortcuts

While in preset wizard:
- **Ctrl/Cmd + →** - Next step
- **Ctrl/Cmd + ←** - Previous step
- **Esc** - Cancel wizard
- **Ctrl/Cmd + S** - Save preset

Happy encoding! 🎥🎬

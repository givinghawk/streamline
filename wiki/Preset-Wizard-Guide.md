# Creating Custom Presets with the Preset Wizard

## What is the Preset Wizard?

The Preset Wizard is a step-by-step tool that helps you create custom encoding presets tailored to your specific needs. Whether you want to optimize videos for YouTube, create archival-quality files, or compress videos for mobile devices, the Preset Wizard guides you through all the options without requiring technical knowledge of FFmpeg.

## Why Use Custom Presets?

While Streamline includes many built-in presets, you might want to create your own when:

- You need specific quality settings for a particular use case
- You want to optimize for a specific device or platform
- You have unique requirements (e.g., specific resolution, bitrate)
- You want to save time by reusing your favorite settings
- You need to share consistent settings with your team

## Getting Started

### Opening the Preset Wizard

1. Click the **Presets** tab (📦 icon) in Streamline
2. Click the **"Create Preset"** button
3. The Preset Wizard opens with a 6-step process

### The 6 Steps

The wizard walks you through creating your preset in a logical order:

**Step 1: Basic Information** - Name your preset and describe what it's for  
**Step 2: Video Basics** - Choose codec, quality, and encoding speed  
**Step 3: Video Advanced** - Fine-tune resolution, bitrate, and codec settings  
**Step 4: Audio Settings** - Configure audio codec, quality, and channels  
**Step 5: Advanced Options** - HDR, filters, subtitles, and performance  
**Step 6: Review & Save** - Preview your settings and save or export

## Step-by-Step Guide

### Step 1: Basic Information

**What You'll Enter:**

- **Preset Name** - Give it a clear, descriptive name
  - Examples: "YouTube 1080p", "Mobile Optimized", "Archival H.265"
  
- **Category** - Choose what type of preset this is
  - **Video** - For video files
  - **Audio** - For audio-only files
  - **Image** - For image conversion
  
- **Description** - Explain what this preset is for
  - Example: "High quality encoding for YouTube uploads at 1080p with good compression"
  
- **Output Format** - Choose the container format
  - **MP4** - Most compatible, works everywhere
  - **MKV** - Supports all features, larger file sizes
  - **WebM** - Web optimized, good for streaming
  - **MOV** - Apple ecosystem
  - **AVI** - Legacy format, maximum compatibility

**Tips:**
- Use descriptive names that include codec and quality (e.g., "H.264 High Quality 1080p")
- Write descriptions that explain the use case, not just technical details
- Choose MP4 for maximum compatibility unless you have specific needs

### Step 2: Video Settings (Basic)

**What You'll Configure:**

**Video Codec** - The compression method for video
- **H.264 (x264)** - Universal compatibility, good quality
- **H.265 (x265)** - Better compression, smaller files, newer devices
- **Hardware Encoders** - Faster encoding using your GPU
  - NVENC (NVIDIA)
  - QSV (Intel)
  - VideoToolbox (Apple)
  - AMF (AMD)

**Quality (CRF)** - Lower numbers = better quality
- **18-20** - Near-lossless, archival quality (large files)
- **21-23** - Excellent quality, recommended for most uses
- **24-28** - Good quality, smaller files
- **29+** - Lower quality, very small files

**Encoding Speed** - How much time to spend encoding
- **Ultrafast** - Very quick, larger files
- **Fast/Medium** - Balanced
- **Slow/Slower** - Takes longer, smaller files, better quality
- **Veryslow** - Maximum compression (very slow)

**Hardware Acceleration** - Use your GPU for faster encoding
- Only available if your computer has compatible hardware
- Automatically detected by Streamline

**Tips:**
- Start with H.264 if unsure - it works on all devices
- Use CRF 23 for a good balance of quality and file size
- Use "medium" or "slow" preset for best results
- Enable hardware acceleration if available for much faster encoding

### Step 3: Video Settings (Advanced)

**When to Use:**
- You need a specific resolution or frame rate
- You want precise control over file size (bitrate)
- You're optimizing for a specific platform or device

**Resolution Scaling**
- Choose from common resolutions (4K, 1080p, 720p, etc.)
- Or enter custom width/height
- Leave blank to keep original resolution

**Frame Rate**
- 24 fps - Film look
- 30 fps - Standard video
- 60 fps - Smooth motion
- Leave blank to keep original

**Bitrate Control**
- Specify exact bitrate for predictable file sizes
- Higher bitrate = better quality but larger files
- Useful for streaming platforms with size limits

**Advanced Codec Settings**
- **Profile** - Compatibility level (use "high" for modern devices)
- **Level** - Technical compatibility setting (usually automatic)
- **Tune** - Optimize for content type (film, animation, etc.)
- **Pixel Format** - Color depth (yuv420p for compatibility)

**GOP Structure**
- **Keyframe Interval** - Seekability vs compression (default: 250)
- **B-frames** - Compression efficiency (default: 3)

**Tips:**
- Skip this step if you're happy with defaults
- Use 1080p (1920x1080) for YouTube/web
- Set bitrate only if you have specific file size requirements
- Leave advanced codec settings alone unless you know what they do

### Step 4: Audio Settings

**Audio Codec** - Choose how audio is compressed
- **AAC** - Universal, good quality (recommended)
- **MP3** - Maximum compatibility, slightly lower quality
- **Opus** - Best quality/size ratio, modern devices
- **FLAC** - Lossless (very large files)

**Audio Bitrate** - Quality of audio
- **64-96 kbps** - Speech, podcasts
- **128 kbps** - Standard music quality
- **192-256 kbps** - High quality music
- **320 kbps** - Maximum MP3/AAC quality

**Channels**
- **Mono** - Single channel, podcasts
- **Stereo** - Standard two-channel audio
- **5.1/7.1** - Surround sound

**Sample Rate**
- **44.1 kHz** - CD quality
- **48 kHz** - Video standard (recommended)
- **96/192 kHz** - High-resolution audio

**Tips:**
- Use AAC at 192 kbps for video - it's the best balance
- MP3 at 128 kbps is fine for most music
- Keep original sample rate if unsure (leave blank)
- Stereo is sufficient for most content

### Step 5: Advanced Options

**HDR & Color**
- Configure HDR (High Dynamic Range) if your source is HDR
- Most users can skip this section
- Only relevant for HDR content from cameras or streaming

**Video Filters**
- **Deinterlace** - Fix interlaced video (old camcorders)
- **Denoise** - Reduce video noise/grain
- **Custom Filters** - Advanced FFmpeg filters

**Subtitles**
- **Copy Subtitles** - Include subtitle tracks from source
- **Burn Subtitles** - Hardcode subtitles into video

**Container Options**
- **Copy Metadata** - Keep title, date, camera info
- **Fast Start** - Optimize for web streaming (recommended for web)

**Performance**
- **Thread Count** - How many CPU cores to use (automatic is best)
- **Two-Pass Encoding** - Better quality at target bitrate (slower)

**Custom Arguments**
- Add raw FFmpeg commands if you're an advanced user
- Not recommended for beginners

**Tips:**
- Enable "Fast Start" if uploading to web/streaming
- Copy metadata to preserve file information
- Skip video filters unless you have specific issues
- Leave thread count automatic for best performance

### Step 6: Review & Save

**What You'll See:**

**FFmpeg Command Preview**
- Shows the actual encoding command that will be used
- Useful for advanced users or troubleshooting
- Don't worry if it looks technical - Streamline handles this for you

**Preset Summary**
- Quick overview of all your settings
- Review before saving

**Save Options:**

1. **Save to Library** - Adds preset to your collection
   - Available immediately in the Encode tab
   - Appears with "Custom" badge
   - Can be edited or deleted later

2. **Export as File** - Save as `.slpreset` file
   - Share with other Streamline users
   - Backup important presets
   - Transfer between computers

3. **Both** - Save to library AND export file

**Tips:**
- Review the summary to make sure everything looks right
- Save to library for personal use
- Export to file if you want to share or backup
- You can always edit the preset later if needed

## Managing Your Presets

### Finding Your Presets

1. Go to the **Presets** tab
2. Your custom presets appear alongside built-in presets
3. Look for the **"Custom"** badge to identify your presets
4. Use search to find presets by name
5. Filter by category (Video, Audio, Image)

### Editing a Preset

1. Find your custom preset in the library
2. Click the ✏️ **Edit** button
3. The Preset Wizard opens with your current settings
4. Make changes in any step
5. Save your updates

**Note:** You can only edit your custom presets, not built-in ones.

### Deleting a Preset

1. Find your custom preset
2. Click the 🗑️ **Delete** button
3. Confirm deletion
4. Preset is permanently removed

**Note:** Deleted presets cannot be recovered unless you exported them as files.

### Exporting Presets

Export any preset (built-in or custom) to share or backup:

1. Find the preset in the library
2. Click the 💾 **Save to File** button
3. Choose where to save the `.slpreset` file
4. Share the file with others or keep as backup

### Importing Presets

Add presets from files:

1. Click the **"Import File"** button
2. Select a `.slpreset` file from your computer
3. Preset is added to your library with **"Imported"** badge
4. Use it like any other preset

## Using Your Custom Presets

### In the Encode Tab

1. Add files to queue in the **Import** tab
2. Switch to the **Encode** tab
3. Open the preset selector
4. Your custom presets appear in the list with **"Custom"** badge
5. Select your preset
6. Settings are automatically applied
7. Start encoding

### Preset Priority

The preset selector shows presets in this order:
1. Built-in presets (tested and reliable)
2. Downloaded presets from GitHub (community)
3. Your custom presets
4. Imported presets from files

## Common Preset Examples

### YouTube 1080p Upload
- **Name:** YouTube 1080p
- **Codec:** H.264
- **Quality:** CRF 21
- **Resolution:** 1920x1080
- **Audio:** AAC 192 kbps
- **Fast Start:** Enabled

### Mobile Device Optimized
- **Name:** Mobile H.265
- **Codec:** H.265
- **Quality:** CRF 24
- **Resolution:** 1280x720
- **Audio:** AAC 128 kbps
- **Profile:** Main

### Archival High Quality
- **Name:** Archival H.265
- **Codec:** H.265
- **Quality:** CRF 18
- **Preset:** Slower
- **Audio:** FLAC (lossless)
- **Copy Metadata:** Enabled

### Quick Compress
- **Name:** Fast Compress
- **Codec:** H.264 with hardware acceleration
- **Quality:** CRF 26
- **Preset:** Fast
- **Audio:** AAC 128 kbps

### Podcast Audio
- **Name:** Podcast MP3
- **Category:** Audio
- **Codec:** MP3
- **Bitrate:** 96 kbps
- **Channels:** Mono
- **Sample Rate:** 44.1 kHz

## Tips for Creating Great Presets

### Naming Convention

Use descriptive names that include:
- Target platform (YouTube, Mobile, Web)
- Codec (H.264, H.265)
- Quality level (High, Medium, Low)
- Resolution (1080p, 720p, 4K)

Examples:
- "YouTube H.264 1080p"
- "Mobile H.265 720p"
- "Web Balanced MP4"
- "Archival Lossless"

### Testing Your Preset

Before relying on a new preset:
1. Create the preset in the wizard
2. Test it on a short sample video
3. Check the output quality and file size
4. Adjust settings if needed
5. Re-save the preset

### Quality vs File Size

Finding the right balance:
- **CRF 18-20** - Excellent quality, large files
- **CRF 21-23** - Great quality, reasonable size (recommended)
- **CRF 24-27** - Good quality, smaller files
- **CRF 28+** - Lower quality, very small files

### Speed vs Compression

Encoding preset affects both speed and file size:
- **Ultrafast/Fast** - Quick encoding, larger files
- **Medium** - Balanced (recommended)
- **Slow/Slower** - Longer encoding, smaller files
- **Veryslow** - Very slow, maximum compression

### Platform-Specific Settings

**YouTube:**
- H.264, MP4 container
- 1080p recommended
- AAC audio 192 kbps
- Fast Start enabled

**Instagram/TikTok:**
- H.264, MP4
- 1080x1920 (vertical)
- 30 fps
- Small file size (CRF 24-26)

**Twitter:**
- H.264, MP4
- 1280x720 max
- File size under 512 MB

**Streaming (Plex/Jellyfin):**
- H.264 for compatibility
- Or H.265 for space savings
- Keep original resolution
- Fast Start enabled

## Troubleshooting

### Preset Not Saving

**Problem:** Preset doesn't appear in library after saving

**Solution:**
- Make sure you clicked "Save to Library" not just "Export"
- Check that name and category are filled in (required)
- Try restarting Streamline
- Check the Presets tab to see if it's there

### Settings Not Working as Expected

**Problem:** Output doesn't match expected quality or size

**Solution:**
- Test with a small sample file first
- Check the FFmpeg command preview for errors
- Verify your input file is compatible
- Try adjusting CRF or bitrate settings

### Can't Edit Built-in Preset

**Problem:** Edit button doesn't appear for built-in preset

**Solution:**
- Built-in presets cannot be edited
- Export the preset to a file
- Import it back (it becomes editable)
- Or create a new preset based on similar settings

### Export File Not Opening

**Problem:** Exported `.slpreset` file won't import on another computer

**Solution:**
- Make sure the file extension is `.slpreset`
- Don't edit the file in a text editor
- Re-export if the file was corrupted
- Check that both computers have same Streamline version

## Best Practices

1. **Start Simple** - Use basic settings first, add advanced options only if needed
2. **Test First** - Always test new presets on sample files
3. **Name Clearly** - Use descriptive names you'll remember
4. **Document Purpose** - Write good descriptions explaining use cases
5. **Backup Important Presets** - Export critical presets as files
6. **Organize by Category** - Use correct categories for easy filtering
7. **Share with Team** - Export and share presets for consistency
8. **Update as Needed** - Edit presets when you discover better settings

## Keyboard Shortcuts

While in Preset Wizard:
- **Ctrl/Cmd + Right Arrow** - Next step
- **Ctrl/Cmd + Left Arrow** - Previous step
- **Ctrl/Cmd + S** - Save preset
- **Ctrl/Cmd + E** - Export preset
- **Esc** - Cancel and close wizard

## Next Steps

- [Preset System](Preset-System.md) - Learn about built-in presets
- [Download Community Presets](advanced-usage/presetrepositories.md) - Browse GitHub presets
- [Batch Processing](advanced-usage/batch-processing.md) - Use presets with multiple files
- [Quality Analysis](advanced-usage/quality-analysis.md) - Test your presets' quality

---

**Added in**: v0.5.0  
**Location**: Presets tab → Create Preset button  
**File Format**: `.slpreset` (JSON)  
**Keyboard Shortcut**: `Ctrl/Cmd + 6`

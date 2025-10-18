# YouTube Video Download

Streamline v0.5.0 includes a built-in YouTube downloader for downloading videos and extracting audio.

## Overview

The Download feature allows you to:
- Download videos from YouTube and other platforms
- Extract audio from videos
- Choose quality and format
- Download to custom location
- Add to encoding queue after download

## Accessing the Tool

1. Open Streamline
2. Click the **Download** tab (⬇️ icon)
3. Paste video URL

## Downloading Videos

### Basic Download

1. **Paste URL**
   - Copy video URL from browser
   - Paste into URL field
   - Supported sites: YouTube, Vimeo, and many more

2. **Choose Quality**
   - Best Quality (highest available)
   - 1080p
   - 720p
   - 480p
   - 360p (smallest file)

3. **Select Format**
   - MP4 (recommended, universal)
   - WebM (efficient, modern)
   - MKV (all features)

4. **Download**
   - Click "Download Video"
   - Progress shows percentage and speed
   - File saves to specified location

### Download Options

**Video Quality**
- **Best**: Highest resolution available (may be 4K, 8K, etc.)
- **1080p**: Full HD, good quality
- **720p**: HD, smaller files
- **480p**: SD, compatible
- **360p**: Low quality, very small files

**Video Format**
- **MP4**: Universal compatibility
- **WebM**: Better compression, modern browsers
- **MKV**: All features, less compatible

## Audio Extraction

### Downloading Audio Only

1. **Paste URL**
   - Same as video download

2. **Select "Audio Only" option**
   - Checkbox below URL field

3. **Choose Audio Format**
   - MP3 (universal)
   - M4A (better quality)
   - Opus (best efficiency)
   - FLAC (lossless)

4. **Select Quality**
   - Best (highest bitrate)
   - High (256kbps)
   - Medium (128kbps)
   - Low (96kbps)

5. **Download**
   - Click "Download Audio"
   - Extracts and converts automatically

### Audio Formats

**MP3**
- Most compatible
- Good quality at 256-320kbps
- Supported everywhere

**M4A (AAC)**
- Better than MP3 at same bitrate
- Native iOS/Apple support
- Wide compatibility

**Opus**
- Best quality/size ratio
- Excellent for streaming
- Modern format

**FLAC**
- Lossless compression
- Largest files
- Archival quality

## Supported Platforms

Streamline uses yt-dlp, supporting 1000+ sites including:

**Video Platforms**
- YouTube
- Vimeo
- Dailymotion
- Twitch
- Facebook

**Social Media**
- Twitter
- Instagram
- TikTok
- Reddit

**Live Streaming**
- Twitch streams
- YouTube Live
- Livestreams from other platforms

## Output Settings

### Save Location

1. Default: Downloads folder
2. Custom: Click "Browse" to select folder
3. Per-download: Change before each download

### File Naming

- Default: Original video title
- Sanitized: Removes special characters
- Example: "How to Use Streamline - Tutorial" → "How_to_Use_Streamline_Tutorial.mp4"

### After Download

**Options**:
- **Open in Folder**: Shows file in file manager
- **Add to Queue**: Adds to encoding queue for further processing
- **Nothing**: Just downloads

## Use Cases

### Music Collection

Download audio from music videos:
1. Paste YouTube music video URL
2. Select "Audio Only"
3. Choose MP3 or M4A format
4. Download with best quality

### Podcast Archiving

Save podcast episodes:
1. Paste podcast video URL
2. Extract audio as MP3
3. Lower quality (96kbps) for speech
4. Organize in custom folder

### Video Tutorials

Download educational content:
1. Select appropriate quality (720p usually sufficient)
2. MP4 format for compatibility
3. Add to queue for compression if needed

### Livestream VODs

Save livestream recordings:
1. Paste VOD URL
2. Choose quality based on content
3. Consider re-encoding for smaller size

### Social Media Content

Download videos from social platforms:
1. Copy post URL
2. Best quality (resolution varies by platform)
3. Re-encode for consistent format

## Advanced Features

### Playlist Download

Download entire playlists:
1. Paste playlist URL
2. All videos added to queue
3. Download sequentially
4. Progress for each video

### Subtitle Download

Download subtitles with video:
1. Enable "Download Subtitles" option
2. Subtitles embedded in MKV
3. OR separate SRT files

### Thumbnail Download

Save video thumbnail:
1. Enable "Download Thumbnail" option
2. Saves as JPEG alongside video
3. Useful for collections

## Integration with Streamline

### Post-Download Encoding

After downloading:
1. File automatically added to Import tab
2. Switch to Encode tab
3. Select preset
4. Re-encode with custom settings

### Quality Optimization

Downloaded videos may be:
- Very high bitrate (large files)
- Incompatible format
- Non-standard settings

Re-encode to:
- Reduce file size
- Standardize format
- Apply custom settings

## Troubleshooting

### "Unsupported URL" error

**Problem**: Site not supported

**Solution**:
1. Check yt-dlp supported sites list
2. Verify URL is correct
3. Try different video from same site

### Download fails or hangs

**Problem**: Network issues or video restrictions

**Solution**:
1. Check internet connection
2. Try lower quality
3. Video may be private or deleted
4. Try different format

### "Video unavailable" message

**Problem**: Video removed or geo-restricted

**Solution**:
1. Verify video plays in browser
2. May require VPN for geo-restrictions
3. Check if video is private

### Poor video quality

**Problem**: Quality setting too low

**Solution**:
1. Select "Best Quality" option
2. Check if higher quality available
3. Original may be low quality

### Large file size

**Problem**: High quality download

**Solution**:
1. Choose lower quality (720p instead of 1080p)
2. Download and re-encode with Streamline
3. Use more efficient format

## Tips and Tricks

### Batch Downloads

1. Paste URLs one at a time
2. Queue multiple downloads
3. Process all at once

### Quick Audio Extraction

Keyboard shortcut:
1. Focus URL field
2. Paste URL
3. `Ctrl/Cmd + A` to select audio only
4. `Ctrl/Cmd + D` to start download

### Format Selection

- **Streaming/Web**: MP4 + H.264
- **Archival**: MKV + Best quality
- **Mobile**: MP4 + 720p
- **Podcast**: MP3 + 128kbps

### Network Optimization

- Lower quality for slow connections
- Resume failed downloads
- Download during off-peak hours

## Legal Considerations

**Important**: Only download content you have the right to download.

**Legal Uses**:
- Your own uploaded videos
- Creative Commons content
- Public domain videos
- Content with explicit download permission

**Terms of Service**:
- Respect platform terms of service
- YouTube TOS prohibits downloading in many cases
- Educational/personal use may have exceptions

## Next Steps

- [Video Trimming](video-trimming-concatenation.md) - Edit downloaded videos
- [Batch Processing](batch-processing.md) - Encode multiple downloads
- [Custom Presets](custom-presets.md) - Optimize downloaded content
- [Quality Analysis](quality-analysis.md) - Verify download quality

---

**Added in**: v0.5.0  
**Tab Icon**: ⬇️  
**Keyboard Shortcut**: `Ctrl/Cmd + 5`  
**Powered by**: yt-dlp

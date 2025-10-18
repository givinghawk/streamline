# Video Trimming and Concatenation

Streamline v0.5.0 includes built-in tools for trimming and concatenating video files without re-encoding.

## Overview

The Trim/Concat feature allows you to:
- **Trim** - Remove unwanted sections from videos
- **Concatenate** - Join multiple videos into one file
- Fast processing with stream copy (no quality loss)
- Preview before processing

## Accessing the Tool

1. Open Streamline
2. Click the **Trim/Concat** tab (✂️ icon)
3. Choose between Trim or Concatenate mode

## Video Trimming

### Basic Trimming

1. **Add Video File**
   - Click "Select Video" or drag and drop
   - File loads with duration information

2. **Set Time Range**
   - **Start Time**: Enter in format `HH:MM:SS` or `MM:SS`
   - **End Time**: Enter desired end time
   - Examples:
     - `00:00:10` - 10 seconds
     - `1:30` - 1 minute 30 seconds
     - `01:15:30` - 1 hour 15 minutes 30 seconds

3. **Preview Selection**
   - See selected duration
   - Verify start and end times

4. **Process**
   - Click "Trim Video"
   - Processing is fast (stream copy)
   - No quality loss

### Output

- Default: Same directory as source with `_trimmed` suffix
- Example: `video.mp4` → `video_trimmed.mp4`
- Custom output location can be set in settings

### Tips

- Use stream copy for fast processing (no re-encoding)
- For precise frame-accurate cuts, consider re-encoding
- Timestamps are accurate to keyframe boundaries

## Video Concatenation

### Joining Multiple Videos

1. **Add Videos**
   - Click "Add Videos" button
   - Select multiple video files
   - Files appear in list

2. **Arrange Order**
   - Drag and drop to reorder
   - Use arrow buttons to move up/down
   - Remove unwanted files with X button

3. **Verify Compatibility**
   - All videos should have:
     - Same resolution
     - Same codec
     - Same frame rate
   - Streamline shows warnings if incompatible

4. **Concatenate**
   - Click "Concatenate Videos"
   - Files are joined in order
   - Fast processing with stream copy

### Output

- Default: First video's directory with `_concat` suffix
- Example: `part1.mp4` + `part2.mp4` → `part1_concat.mp4`

### Compatibility Requirements

For stream copy (fast, lossless):
- ✅ Same resolution
- ✅ Same codec (e.g., all H.264)
- ✅ Same frame rate
- ✅ Same audio format

For incompatible videos:
- Enable re-encoding option
- Slower processing
- Ensures compatibility

## Use Cases

### Removing Intro/Outro

Trim unwanted sections from recordings:
```
Original: 00:00:00 - 01:30:00
Remove intro: Start at 00:00:15
Remove outro: End at 01:28:30
Result: 1 hour 28 minutes 15 seconds
```

### Creating Compilations

Combine multiple clips:
```
clip1.mp4 (00:05:00)
clip2.mp4 (00:03:30)
clip3.mp4 (00:07:15)
Result: compiled.mp4 (00:15:45)
```

### Splitting and Rejoining

1. Trim multiple sections from one video
2. Concatenate selected portions
3. Create highlight reels or edits

### Podcast/Livestream Editing

1. Record full session
2. Trim dead air at start/end
3. Optionally split into segments
4. Join segments with intro/outro

## Technical Details

### Stream Copy vs Re-encoding

**Stream Copy (Default)**
- Copies video/audio streams without processing
- Very fast (seconds for large files)
- No quality loss
- Limited to keyframe boundaries
- Works only with compatible videos

**Re-encoding**
- Processes video through encoder
- Slower (depends on file size and settings)
- Frame-accurate cuts
- Can join incompatible videos
- Small quality loss possible

### Keyframe Boundaries

- Videos compressed with keyframes every N frames
- Stream copy cuts at nearest keyframe
- May not be exactly at specified time
- Typical keyframe interval: 2-10 seconds

### File Formats

Supported formats:
- MP4 (recommended)
- MKV
- AVI
- MOV
- WebM
- FLV

## Keyboard Shortcuts

While in Trim/Concat mode:
- `Ctrl/Cmd + O` - Open file
- `Ctrl/Cmd + S` - Start processing
- `Ctrl/Cmd + A` - Add more files (concat)
- `Delete` - Remove selected file (concat)
- `Arrow Keys` - Reorder files (concat)

## Troubleshooting

### "Incompatible videos" warning

**Problem**: Videos have different formats

**Solution**:
1. Enable re-encoding in options
2. OR convert all videos to same format first
3. Use same preset for all videos

### Cut not at exact timestamp

**Problem**: Stream copy limits precision

**Solution**:
1. Enable re-encoding for frame-accurate cuts
2. OR accept keyframe boundary precision
3. Typical precision: ±2 seconds

### Output file is larger than expected

**Problem**: Re-encoding with higher quality settings

**Solution**:
1. Use stream copy when possible
2. Adjust quality settings if re-encoding
3. Choose more efficient codec

### Processing is slow

**Problem**: Re-encoding is enabled

**Solution**:
1. Use stream copy for compatible videos
2. Enable hardware acceleration
3. Process smaller sections

## Advanced Tips

### Batch Trimming

1. Open Trim/Concat tab
2. Trim first video
3. Note the timestamps
4. Use same timestamps for similar videos

### Creating Chapters

1. Trim video into segments
2. Keep segments separate
3. Use video player with chapter support
4. OR use MKV with chapter metadata

### Preserving Metadata

- Stream copy preserves most metadata
- Title, date, camera info retained
- Re-encoding may lose some metadata

## Next Steps

- [Video Comparison](video-comparison.md) - Compare trimmed results
- [Quality Analysis](quality-analysis.md) - Analyze concatenated output
- [Batch Processing](batch-processing.md) - Process multiple trims
- [Custom Presets](custom-presets.md) - Save trim settings

---

**Added in**: v0.5.0  
**Tab Icon**: ✂️  
**Keyboard Shortcut**: `Ctrl/Cmd + 4`

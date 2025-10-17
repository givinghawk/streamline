# Thumbnail Generation

Streamline automatically generates video thumbnails to provide visual previews of your media files.

## Overview

Thumbnail generation provides:

* **Visual file previews** - See content before encoding
* **Quick identification** - Distinguish files at a glance
* **Grid display** - Multiple frames from the video
* **Automatic generation** - No manual work required

## How Thumbnails Work

### Automatic Generation

When you add a video file:

1. Streamline analyzes the video duration
2. Extracts representative frames
3. Creates a grid of thumbnails
4. Displays in the file info panel

### Frame Selection

Thumbnails are extracted from:

* **Beginning** - 10% into video (skips intro/logos)
* **Middle sections** - Evenly distributed
* **End** - 90% point (before credits)

This ensures representative samples of the content.

## Thumbnail Grid

### Default Layout

* **3x3 grid** - 9 thumbnails per video
* **Even distribution** - Covers entire video duration
* **Aspect ratio preserved** - No stretching or cropping

### Grid Display

The thumbnail grid shows:

* Time stamp for each frame
* Position in video (e.g., "0:30", "1:45")
* Visual preview of video content

## Thumbnail Settings

### Grid Size

Configure number of thumbnails:

**Small Grid** (2x2):

* 4 thumbnails
* Faster generation
* Less detail

**Medium Grid** (3x3) - Default:

* 9 thumbnails
* Good balance
* Recommended

**Large Grid** (4x4):

* 16 thumbnails
* More detail
* Slower generation

### Quality Settings

**Low Quality**:

* Smaller file size
* Faster generation
* Suitable for quick preview

**Medium Quality** - Default:

* Balanced size/quality
* Good visual fidelity

**High Quality**:

* Larger thumbnails
* Best visual quality
* Slower generation

## Use Cases

### File Identification

Quickly identify videos by content:

* Spot the right recording from a batch
* Distinguish similar filenames
* Find specific scenes

### Quality Preview

Preview source quality:

* Check resolution and clarity
* Identify compression artifacts
* Verify color and exposure

### Scene Detection

Identify video content:

* Action vs static scenes
* Indoor vs outdoor
* Day vs night footage
* Scene changes and variety

### Batch Organization

Organize batch processing:

* Group similar content types
* Identify priority files
* Plan encoding strategy

## Thumbnail Performance

### Generation Speed

Thumbnail generation time varies:

| Video Length | Low Quality | Medium Quality | High Quality |
| ------------ | ----------- | -------------- | ------------ |
| 1-5 min      | <1 sec      | 1-2 sec        | 2-3 sec      |
| 5-30 min     | 1-2 sec     | 2-4 sec        | 4-6 sec      |
| 30-60 min    | 2-3 sec     | 4-6 sec        | 6-10 sec     |
| 60+ min      | 3-5 sec     | 6-10 sec       | 10-15 sec    |

### Caching

Streamline caches thumbnails:

* Generated once per file
* Reused when file added again
* Cleared when file modified
* Saves regeneration time

### Disabling Thumbnails

For faster file loading:

1. Open Settings
2. Navigate to General
3. Toggle "Generate Thumbnails"
4. Thumbnails disabled for new files

**When to disable**:

* Processing many audio files (no thumbnails needed)
* Very large video files (slow generation)
* Quick batch processing (thumbnails not needed)
* Limited system resources

## Thumbnail Storage

### Cache Location

Thumbnails stored in:

* **Windows**: `%APPDATA%/streamline/thumbnails/`
* **macOS**: `~/Library/Application Support/streamline/thumbnails/`
* **Linux**: `~/.config/streamline/thumbnails/`

### Cache Management

**Clear Thumbnail Cache**:

1. Settings → Advanced
2. Click "Clear Thumbnail Cache"
3. Frees disk space
4. Thumbnails regenerate as needed

**Cache Size**:

* Typical: 1-2 MB per video
* Automatic cleanup of old thumbnails
* Configurable cache size limit

## Advanced Features

### Custom Extraction Points

For custom thumbnail generation:

1. Advanced Settings → Thumbnails
2. Specify time points (e.g., "0:10,1:00,2:00")
3. Thumbnails extracted at exact times
4. Useful for specific frame previews

### Export Thumbnails

Save thumbnails as images:

1. Right-click thumbnail grid
2. Select "Export Thumbnails"
3. Choose save location
4. All thumbnails saved as individual images

**Use Cases**:

* Create video contact sheets
* Generate preview images
* Documentation purposes

### Thumbnail in Output

Add thumbnail to encoded file metadata:

1. Advanced Settings
2. Enable "Embed Thumbnail"
3. First thumbnail embedded in file
4. Visible in media players

## Troubleshooting

### Thumbnails Not Generating

**Problem**: No thumbnails appear for video

**Solutions**:

1. Verify file is a video format
2. Check thumbnail generation is enabled
3. Ensure FFmpeg can read the file
4. Try manually regenerating

**Manual Regeneration**:

* Right-click file info panel
* Select "Regenerate Thumbnails"

### Black Thumbnails

**Problem**: All thumbnails are black

**Possible Causes**:

* Video starts with black frames
* Encoding issue in source
* Interlaced video

**Solutions**:

1. Adjust extraction points to skip beginning
2. Use custom time points
3. Check source file plays correctly

### Slow Thumbnail Generation

**Problem**: Takes too long to generate thumbnails

**Solutions**:

1. Reduce grid size (3x3 → 2x2)
2. Lower quality setting
3. Disable for current file
4. Hardware acceleration for thumbnails (if available)

### Corrupted Thumbnails

**Problem**: Distorted or incorrect thumbnails

**Solutions**:

1. Clear thumbnail cache
2. Regenerate thumbnails
3. Check source file integrity
4. Update FFmpeg

## Tips and Best Practices

### Optimal Grid Size

* **Short videos (<5 min)**: 2x2 grid sufficient
* **Medium videos (5-30 min)**: 3x3 grid recommended
* **Long videos (30+ min)**: 4x4 grid for better coverage

### Performance Optimization

1. Generate thumbnails only when needed
2. Use lower quality for large batches
3. Cache thumbnails for reused files
4. Disable for audio-only workflows

### Visual Quality Check

Use thumbnails to:

* Verify source quality before encoding
* Check for interlacing
* Identify color issues
* Spot corrupt frames

## Integration with Other Features

### Batch Processing

Thumbnails help with:

* Identifying file order
* Grouping similar content
* Visual queue organization

### Video Comparison

Thumbnails preview:

* Source quality for comparison
* Expected output appearance
* Problem areas to watch

### Quality Analysis

Thumbnails indicate:

* Scenes to test quality metrics on
* Complex vs simple scenes
* High vs low motion content

## Future Enhancements

Planned thumbnail features:

* Interactive timeline thumbnails
* Hover-to-preview animation
* Scene detection and chapters
* AI-powered smart frame selection
* Thumbnail export templates

## Next Steps

* Configure thumbnail settings for your workflow
* Use thumbnails for [Batch Processing](batch-processing.md) organization
* Leverage for [Video Comparison](video-comparison.md) preview
* Optimize performance in [Advanced Usage](./)

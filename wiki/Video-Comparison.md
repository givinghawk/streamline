# Video Comparison

The Video Comparison tool allows you to view original and encoded videos side-by-side to visually assess encoding quality.

## Overview

Visual comparison helps you:
- **Validate encoding quality** - See actual quality differences
- **Identify artifacts** - Spot compression artifacts, banding, or blocking
- **Compare settings** - Evaluate different encoder settings
- **Make informed decisions** - Choose the right quality/size balance

## Opening the Comparison Tool

### From Batch Queue

After encoding completes:
1. Find the completed file in the batch queue
2. Click the play button (▶️) next to the file
3. Comparison viewer opens automatically
4. Both videos load side-by-side

### Manual Comparison

To compare any two videos:
1. Open Streamline
2. Click "Video Comparison" in the menu (if available)
3. Select original video
4. Select encoded video
5. Videos load for comparison

## Comparison Interface

### Layout

The comparison viewer displays:
- **Left panel**: Original video
- **Right panel**: Encoded video
- **Playback controls**: Shared controls for both videos
- **Zoom controls**: Magnify specific areas
- **A/B toggle**: Quick switching between videos

### Synchronized Playback

Both videos play in perfect sync:
- **Same timeline** - Both at exact same frame
- **Shared controls** - Play/pause affects both
- **Seek together** - Scrubbing moves both videos
- **Frame stepping** - Advance one frame at a time

## Using the Comparison Tool

### Basic Playback

**Play/Pause**
- Click play button or press spacebar
- Both videos play simultaneously

**Seek**
- Drag timeline slider
- Click anywhere on timeline
- Use arrow keys (← →) for fine control

**Volume**
- Adjust volume slider
- Mute/unmute with button
- Toggle between original and encoded audio

### Frame-by-Frame Analysis

**Frame Stepping**
1. Pause playback
2. Press → to advance one frame
3. Press ← to go back one frame
4. Examine differences closely

**Useful for**:
- Identifying specific artifacts
- Comparing fine details
- Analyzing motion blur
- Checking temporal artifacts

### Zoom and Pan

**Zooming In**
1. Use zoom slider or mouse wheel
2. Both videos zoom simultaneously
3. Pan by dragging the video
4. Reset zoom with "Fit" button

**Comparison Techniques**:
- Zoom to 100% or 200%
- Compare fine details and texture
- Check edge sharpness
- Examine color gradients

### A/B Comparison

**Quick Toggle**
1. Press 'A' key for original only
2. Press 'B' key for encoded only
3. Rapidly switch to spot differences
4. Back to split view with 'S' key

**Useful for**:
- Detecting subtle differences
- Identifying compression artifacts
- Comparing overall image quality

### Split View Modes

**Side-by-Side** (Default)
- Original on left, encoded on right
- Best for overall comparison

**Top/Bottom**
- Original on top, encoded on bottom
- Useful for wide videos

**Overlay**
- Blend original and encoded
- Adjust opacity slider
- Shows pixel-level differences

**Difference Map**
- Highlights differences in color
- Brighter = more difference
- Useful for technical analysis

## What to Look For

### Common Compression Artifacts

**Blocking**
- Visible square blocks, especially in gradients
- More common with high compression
- Check sky, water, or solid color areas

**Banding**
- Smooth gradients become stepped
- Visible color bands instead of smooth transitions
- Common in sky, sunset scenes

**Mosquito Noise**
- Flickering around edges and text
- Temporal artifacts that shimmer
- More visible in high-contrast areas

**Blur/Softness**
- Loss of fine detail
- Reduced sharpness
- Compare text, leaves, texture details

**Color Shift**
- Changes in color accuracy
- Saturation differences
- Hue shifts in specific tones

**Temporal Artifacts**
- Ghosting or trailing
- Frame blending issues
- Check during motion sequences

### Quality Indicators

**Excellent Quality**:
- No visible differences between original and encoded
- Preserved fine details and textures
- Smooth gradients remain smooth
- Sharp edges stay sharp

**Good Quality**:
- Minor differences only visible when zoomed
- Slight softening of fine details
- Artifacts only in extreme cases (very dark/complex scenes)

**Fair Quality**:
- Noticeable differences in complex scenes
- Some blocking or banding visible
- Fine details reduced
- Still acceptable for most viewing

**Poor Quality**:
- Obvious artifacts throughout
- Significant blocking or banding
- Loss of detail
- Noticeable blur

## Comparison Workflow

### Testing Encode Settings

1. **Encode test clips** at different quality levels
   - CRF 18, 23, 28, etc.
2. **Open comparison viewer** for each
3. **Visually compare** against original
4. **Find lowest CRF** that maintains acceptable quality
5. **Apply settings** to full batch

### Validating Batch Results

After batch processing:
1. **Select sample files** from batch (first, last, middle)
2. **Open comparisons** for each sample
3. **Verify quality** is consistent
4. **Re-encode if needed** with adjusted settings

### Codec Comparison

Compare different codecs:
1. Encode same file with H.264, H.265, AV1
2. Open comparison for each
3. Evaluate quality differences
4. Consider encoding time vs quality

## Advanced Comparison Techniques

### Difference Visualization

**Pixel Difference Mode**:
- Shows exact pixel differences
- White = identical, colors = different
- Useful for technical analysis

**Heat Map Mode**:
- Warmer colors = more difference
- Cooler colors = less difference
- Quickly identify problem areas

### Scene-Specific Analysis

Different scenes reveal different issues:

**Dark Scenes**:
- Watch for banding in shadows
- Check for noise reduction artifacts
- Compare shadow detail preservation

**Bright Scenes**:
- Check highlight retention
- Look for blown-out areas
- Verify color accuracy

**High Motion**:
- Watch for temporal artifacts
- Check motion blur handling
- Verify frame smoothness

**Complex Textures**:
- Compare detail preservation (foliage, fabric)
- Check for over-smoothing
- Verify texture clarity

**Gradients**:
- Look for banding (sky, water)
- Check smooth transitions
- Verify color depth

## Troubleshooting Comparison Tool

### Videos Out of Sync

**Problem**: Original and encoded don't align

**Solutions**:
1. Check both videos have same duration
2. Verify frame rate matches
3. Re-encode with same frame rate as original

### Performance Issues

**Problem**: Choppy playback, lag

**Solutions**:
1. Lower playback resolution
2. Close other applications
3. Reduce zoom level
4. Use lower resolution comparison files

### Can't See Differences

**Possible Reasons**:
1. **Encoding quality is excellent** - No visible differences expected
2. **Display limitations** - Monitor can't show differences
3. **Viewing distance** - Too far from screen
4. **Small screen** - Differences not visible on small displays

**Try**:
- Zoom to 100% or 200%
- Use difference map mode
- Check [Quality Analysis](Quality-Analysis.md) metrics
- View on larger/better display

## Interpreting Visual Results

### Matching Quality Metrics

Compare visual impressions with metrics:

**High VMAF (95+), No Visible Difference**:
- Quality is excellent
- Can consider higher compression

**Medium VMAF (80-90), Slight Visible Difference**:
- Balanced encoding
- Acceptable for most uses

**Low VMAF (<80), Obvious Differences**:
- Quality is too low
- Increase quality settings

**High VMAF, But Visible Differences**:
- Metrics can miss some artifacts
- Trust your eyes
- Adjust settings if not satisfied

### When to Re-encode

Re-encode if you notice:
- **Blocking** that bothers you visually
- **Banding** in important scenes
- **Loss of detail** in critical areas
- **Color shifts** that change the look
- **Temporal artifacts** during motion

Don't re-encode if:
- Differences only visible when zoomed 200%
- Artifacts only in extreme scenes (very dark/bright)
- Quality is acceptable for intended use
- File size savings justify minor quality loss

## Tips for Effective Comparison

### Viewing Conditions

For accurate comparison:
- **Good lighting** - Not too bright or dark
- **Calibrated display** - Accurate colors
- **Proper distance** - About 2-3x screen height
- **Full attention** - Minimize distractions

### Comparison Checklist

For each comparison, check:
- ✅ Overall sharpness and detail
- ✅ Color accuracy and saturation
- ✅ Gradient smoothness (no banding)
- ✅ Dark scene detail preservation
- ✅ Bright scene highlight retention
- ✅ Motion smoothness
- ✅ Absence of blocking or artifacts
- ✅ Text and fine detail clarity

### Save Time

- **Focus on problem areas** - Don't watch entire video
- **Jump to test scenes** - Known difficult scenes
- **Use A/B toggle** - Quick differences check
- **Check quality metrics first** - If VMAF > 95, quick visual check sufficient

## Integration with Quality Analysis

Combine comparison with metrics for best results:

1. **Run quality analysis** - Get VMAF/SSIM scores
2. **Open comparison** - Visual validation
3. **Verify metrics match perception** - Do scores align with what you see?
4. **Adjust if needed** - Fine-tune based on both

## Next Steps

- Use metrics from [Quality Analysis](Quality-Analysis.md) alongside visual comparison
- Create [Custom Presets](Custom-Presets.md) based on tested settings
- Optimize [Hardware Acceleration](Hardware-Acceleration.md) settings
- Learn [Advanced Usage](Advanced-Usage.md) techniques for difficult content

# Batch Processing

Streamline's batch processing system allows you to queue and process multiple files efficiently with minimal interaction.

## Overview

Batch processing enables you to:

* Queue multiple files for sequential encoding
* Apply different presets to different files
* Organize outputs automatically
* Monitor progress across all files
* Process files unattended

## Adding Files to the Batch Queue

### Drag and Drop Multiple Files

1. Select multiple files in your file manager
2. Drag them onto Streamline
3. All files are added to the queue
4. Each file can have individual settings

### Adding Files One at a Time

1. Drop or select a file
2. Configure its settings
3. Add another file
4. Repeat as needed

### Supported File Types

The batch queue accepts:

* Video files (MP4, MKV, AVI, MOV, WebM, etc.)
* Audio files (MP3, AAC, FLAC, WAV, etc.)
* Image files (JPEG, PNG, GIF, WebP, etc.)
* Mixed file types in the same queue

## Configuring Batch Settings

### Individual File Settings

Each queued file can have:

* **Different presets** - Mix video, audio, and image presets
* **Different output locations** - Per-file destinations
* **Different advanced settings** - Custom parameters per file

To configure:

1. Click on a file in the queue to select it
2. Adjust preset and settings
3. Changes apply only to selected file

### Applying Settings to All Files

To use the same settings for all files:

1. Configure settings for the first file
2. Select subsequent files
3. Apply the same preset
4. Or use preset import/export for consistency

### Batch Mode Toggle

**Disabled (Default)**

* Each file saves next to its original
* Files named with `_optimised` suffix
* Example: `video.mp4` → `video_optimised.mp4`

**Enabled**

* All files save to `/optimised` subfolder
* Original filenames preserved
* Example: `/videos/video.mp4` → `/videos/optimised/video.mp4`

To enable:

1. Click settings icon
2. Navigate to Output Settings
3. Toggle "Batch Mode"

## Starting Batch Processing

### Single File Execution

* Click "Start Encode" to encode the selected file only
* Useful for testing settings before batch

### Batch Execution

1. Ensure all files are configured
2. Click "Start Batch" button
3. Files are processed sequentially
4. Progress updates for each file

### Processing Order

Files process in queue order:

1. Drag files to reorder (only pending files)
2. Top to bottom processing
3. Failed files are skipped
4. Canceled files are skipped

## Monitoring Progress

### Queue Status Indicators

Each file in the queue shows:

* **Pending** - Waiting to be processed (gray)
* **Encoding** - Currently processing (blue, animated)
* **Complete** - Successfully encoded (green)
* **Failed** - Encoding failed (red)
* **Canceled** - User canceled (orange)

### Real-Time Information

For the file being encoded:

* **Progress bar** - Visual completion percentage
* **Current frame** - Frame number being processed
* **Speed** - Encoding speed (e.g., "2.5x realtime")
* **ETA** - Estimated time remaining
* **Bitrate** - Current output bitrate
* **File size** - Current output file size

### Overall Progress

* Number of completed files / total files
* Overall time elapsed
* Estimated time for remaining files

## Managing the Queue

### Removing Files

**Remove Single File**

* Click X button next to the file
* File removed from queue
* Original file unchanged

**Clear Completed Files**

* Removes all successfully encoded files
* Pending files remain in queue
* Use after batch completes to clean up

**Clear All**

* Removes all files from queue
* Useful to start fresh

### Pausing and Resuming

**Pause Current Encoding**

* Click "Pause" button
* Current file pauses
* Can resume later or cancel

**Resume Encoding**

* Click "Resume" to continue
* Picks up where it left off

**Cancel Current Encoding**

* Click "Cancel" button
* Current file stops
* Partial output is removed
* Next file in queue starts

### Handling Failed Files

When a file fails to encode:

1. Error message appears in queue
2. Processing continues with next file
3. Failed file marked in red

To retry:

1. Click retry button on failed file
2. Same settings applied
3. File processed again

To fix:

1. Check error message
2. Adjust settings (codec, format, etc.)
3. Retry encoding

## Advanced Batch Features

### Multiple Output Directories

While Streamline uses one output directory per batch, you can:

1. Process batch to `/optimised/`
2. Move completed files
3. Start new batch with different output directory

### Mixed File Types

Process different media types together:

* Video files with "Balanced" preset
* Audio files with "Standard (MP3)" preset
* Images with "WebP Balanced" preset

Streamline automatically:

* Detects file type
* Suggests appropriate presets
* Applies correct settings

### Priority Processing

To prioritize certain files:

1. Drag important files to top of queue
2. They process first
3. Lower priority files process later

### Unattended Processing

For overnight or long batches:

1. Queue all files
2. Configure settings
3. Start batch
4. Enable desktop notifications
5. Close monitor or let run

Streamline will:

* Process all files sequentially
* Notify on completion
* Keep computer awake during processing

## Output Organization

### Batch Mode Output Structure

With Batch Mode enabled:

```
/source-folder/
  ├── video1.mp4
  ├── video2.mp4
  └── optimised/
      ├── video1.mp4
      └── video2.mp4
```

### Single-File Mode Output Structure

With Batch Mode disabled:

```
/source-folder/
  ├── video1.mp4
  ├── video1_optimised.mp4
  ├── video2.mp4
  └── video2_optimised.mp4
```

### Custom Output Directory

When custom directory is set:

```
/source-folder/
  ├── video1.mp4
  └── video2.mp4

/custom-output/
  ├── video1_optimised.mp4
  └── video2_optimised.mp4
```

Or with Batch Mode:

```
/custom-output/
  ├── video1.mp4
  └── video2.mp4
```

## Tips and Best Practices

### Pre-Processing Checks

Before starting a large batch:

1. **Test one file** - Verify settings are correct
2. **Check disk space** - Ensure adequate space for all outputs
3. **Verify presets** - Confirm each file has appropriate preset
4. **Review output location** - Ensure it's correct

### Optimal Queue Size

* **Small batches (5-10 files)**: Interactive, can monitor closely
* **Medium batches (10-50 files)**: Good for daily work
* **Large batches (50+ files)**: Overnight processing

### Performance Considerations

**Single concurrent job** (Default)

* Uses less resources
* More stable
* Recommended for most users

**Multiple concurrent jobs**

* Faster overall completion
* Requires powerful hardware
* May cause thermal throttling
* Set in Settings → General → Max Concurrent Jobs

### Error Handling Strategy

1. **Let batch complete** - See all failures at once
2. **Review failed files** - Check error messages
3. **Group by error type** - Similar issues, similar fixes
4. **Fix and retry** - Adjust settings, retry batch

### File Naming Conflicts

If output files already exist:

* **Overwrite disabled**: Streamline adds suffix like `_optimised_1`
* **Overwrite enabled**: Original files replaced (⚠️ use carefully)

To avoid conflicts:

* Use Batch Mode for clean organization
* Clear output directory before starting
* Use unique custom output directory

## Quality Control in Batches

### Spot Checking

1. Process first few files
2. Review quality
3. Adjust settings if needed
4. Continue with remaining files

### Quality Analysis

When enabled (Settings → Quality Analysis):

* PSNR, SSIM, VMAF calculated for each file
* Adds time to each encode
* Useful for quality validation
* Consider enabling for sample files only

### Video Comparison

After batch completes:

1. Click play button on completed files
2. Compare original vs encoded
3. Verify quality is acceptable
4. Re-encode if necessary

## Troubleshooting Batch Processing

### Batch Stops After One File

* Check if "Start Encode" was used instead of "Start Batch"
* Ensure other files are in queue (pending status)

### Inconsistent Output Quality

* Verify each file has correct preset selected
* Check for different source quality levels
* Review advanced settings per file

### Files Skipped

* Failed files are skipped automatically
* Check error messages for skipped files
* Verify file integrity and format

### Slow Batch Processing

* Disable quality analysis for faster processing
* Use hardware acceleration
* Reduce encoding preset quality (e.g., "fast" instead of "slow")
* Reduce output resolution for very large files

## Next Steps

* Configure [Output Settings](../User-Guide.md#output-settings) for optimal organization
* Use [Quality Analysis](quality-analysis.md) to validate batch results
* Create [Custom Presets](custom-presets.md) for repetitive batch tasks
* Enable [Hardware Acceleration](../Hardware-Acceleration.md) for faster processing

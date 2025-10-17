# Target File Size

## Overview

The Target File Size feature allows you to automatically calculate the required video bitrate to achieve a specific output file size. This is useful when you need your encoded file to fit within storage constraints or upload limits.

## How It Works

Instead of manually choosing a bitrate or quality level, you simply specify your desired output file size. Streamline automatically calculates the optimal bitrate needed to reach that size:

1. **Input**: Target file size (MB or GB)
2. **Processing**: Streamline calculates: `video_bitrate = (total_bits - audio_bits) / duration`
3. **Output**: FFmpeg encodes with the calculated bitrate

### Calculation Details

The calculation accounts for:

* **Target file size** - Your desired output size
* **Video duration** - From the source file metadata
* **Audio bitrate** - Subtracts audio bits to determine available video bits
* **Minimum threshold** - Ensures minimum 50 kbps to prevent excessively low quality

### Formula

```
Video Bitrate (kbps) = (Target Size × 8 - Audio Bitrate × Duration) / Duration
```

## Using Target File Size

### Basic Steps

1. **Enable Advanced Settings**
   * Click the "Advanced" button in the encoding panel
   * Select your preset
2. **Enter Target Size**
   * Find the "Target File Size" field
   * Enter a number (e.g., 700)
   * Choose unit: MB or GB
3. **View Calculated Bitrate**
   * The calculated bitrate appears in a highlighted box
   * Shows both raw value (e.g., "2500k") and formatted value (e.g., "2.5 Mbps")
4. **Start Encoding**
   * Click "Start Encode"
   * FFmpeg uses the calculated bitrate automatically

## Common Use Cases

### 1. USB Drive Distribution

**Scenario**: You need a 2-hour movie to fit on a 700MB USB drive

* Target: 700 MB
* Result: Auto-calculates \~1200 kbps bitrate

### 2. Streaming Constraints

**Scenario**: Upload limit is 50MB

* Target: 50 MB
* Result: Calculates bitrate for your video duration

### 3. Archive Optimization

**Scenario**: Want to fit 10 videos on a 8GB drive

* Target: 800 MB per video
* Result: Consistent sizing across all videos

### 4. Platform Requirements

**Scenario**: Website requires files under 100MB

* Target: 100 MB
* Result: Automatic optimal bitrate calculation

## Configuration Options

### Target File Size Input

* **Type**: Number (positive integer)
* **Units**: MB or GB
* **Valid Range**: 1 MB - unlimited
* **Example**: 700 (for 700 MB)

### Unit Selection

* **MB** - Megabytes (default for most cases)
* **GB** - Gigabytes (useful for large files)

## Advanced Considerations

### Audio Bitrate Impact

The calculation reserves bits for audio. Account for:

* **Video codec audio bitrate** (if specified in settings)
* **Default 192 kbps** (if audio codec selected but no bitrate specified)
* **No audio** (0 kbps, if not encoding audio)

### Quality Trade-offs

* **Smaller targets** may require lower bitrates, affecting quality
* **Longer videos** may require lower per-second bitrates for same file size
* **Higher resolution** may need adjustment if target is very small

### Video Duration

The calculation depends on accurate duration detection:

* Duration is extracted from video metadata automatically
* If duration is unavailable, target file size feature won't activate
* Check file info in the UI to verify duration

## Settings Interaction

### Priority Order

1. **Target File Size** - If specified, overrides manual bitrate
2. **Video Bitrate** - Used if target file size not specified
3. **CRF (Quality)** - Used if neither bitrate nor target size specified

### Other Settings Still Apply

* **Video codec** - Selected codec still used
* **Audio settings** - Audio bitrate/codec still respected
* **Resolution** - Resolution scaling still applied
* **Frame rate** - FPS settings still applied
* **Hardware acceleration** - HW accel still enabled if available
* **Preset** - Encoding speed preset still applied

## Tips and Best Practices

### Estimate Output Size

Use the displayed bitrate to estimate:

* `Estimated Size (MB) = Bitrate (kbps) × Duration (sec) × 0.125 / 1000`

### Account for Overhead

* Video bitrate calculations are approximate
* Actual file size may vary ±5-10% due to:
  * Container overhead
  * Keyframe intervals
  * Audio codec overhead

### Testing

1. Encode a test clip with same settings
2. Compare actual vs. target size
3. Adjust audio bitrate if needed
4. Re-encode full file with refined settings

### Combining with Presets

* Works with any built-in preset
* Works with custom preset settings
* Can modify preset settings after selecting

## Troubleshooting

### No Target Size Calculation Shown

**Cause**: Duration not available from file metadata **Solution**:

* Try a different file format
* Check file is valid video/audio
* Use manual bitrate instead

### Calculated Bitrate Seems Too Low

**Cause**: Target size too small for video duration **Solution**:

* Increase target size
* Use MB instead of GB
* Consider downscaling resolution

### Output File Much Larger Than Target

**Cause**: Variable bitrate encoding or audio overhead **Solution**:

* Set lower audio bitrate in advanced settings
* Ensure target size accounts for audio
* Try reducing video resolution

### Bitrate Still Shows CRF After Entering Target Size

**Cause**: Target size not being applied **Solution**:

* Verify duration is shown in file info
* Re-enter target size value
* Check settings are saved before encoding

## Algorithm Details

### Bitrate Calculation Algorithm

```javascript
function calculateBitrateFromTargetSize(targetSize, durationSeconds, audioBitrateKbps) {
  // Total bits available
  const totalBits = targetSize * 8;
  
  // Audio bits needed
  const audioBits = audioBitrateKbps * 1000 * durationSeconds;
  
  // Video bits available
  const videoBits = totalBits - audioBits;
  
  // Video bitrate
  const videoBitrateKbps = Math.max(
    Math.floor(videoBits / 1000 / durationSeconds),
    50  // Minimum 50 kbps
  );
  
  return `${videoBitrateKbps}k`;
}
```

### Minimum Bitrate Safeguard

* Prevents excessively low bitrates (< 50 kbps)
* Ensures acceptable minimum quality
* Adjustable in future versions if needed

## Related Features

* [**Batch Processing**](batch-processing.md) - Apply target sizes to multiple files
* [**Quality Analysis**](quality-analysis.md) - Verify output quality after encoding
* [**Custom Presets**](custom-presets.md) - Save target size settings as presets
* [**Advanced Usage**](./) - Advanced encoding techniques

## See Also

* [**User Guide**](../User-Guide.md) - Basic encoding workflow
* [**Advanced Settings**](./) - Other advanced options
* [**Troubleshooting**](../Troubleshooting.md) - Common issues and solutions

## FAQ

**Q: Can I use target file size for audio-only files?** A: Yes, the calculation accounts for audio duration and adjusts video bitrate accordingly.

**Q: What if my file has multiple audio tracks?** A: Currently, the calculation uses the primary audio bitrate. For complex scenarios, use manual bitrate setting.

**Q: Can I combine target file size with resolution downscaling?** A: Yes, both settings work together. Target size calculates bitrate, and resolution scaling is still applied.

**Q: How accurate is the target size?** A: Usually within 5-10% of target due to variable bitrate encoding and container overhead.

**Q: Can I use target file size in advanced presets?** A: Yes, you can include targetFileSize in conditional preset logic.

## Support

For issues or questions:

* Check [Troubleshooting Guide](../Troubleshooting.md)
* Review this page FAQ section
* [Open an issue on GitHub](https://github.com/givinghawk/streamline/issues)

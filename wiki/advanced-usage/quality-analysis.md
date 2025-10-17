# Quality Analysis

Streamline can automatically measure the quality of encoded videos using industry-standard metrics: PSNR, SSIM, and VMAF.

## Overview

Quality analysis helps you:

* **Objectively measure** encoding quality
* **Compare** different settings and presets
* **Validate** that quality meets requirements
* **Optimize** encoding parameters for best quality/size ratio

## Quality Metrics Explained

### PSNR (Peak Signal-to-Noise Ratio)

**What it measures**: Pixel-by-pixel difference between original and encoded video

**Scale**:

* Measured in dB (decibels)
* Higher is better
* Range: 0 dB (worst) to ∞ (identical)

**Typical Values**:

* **50+ dB**: Excellent quality, visually lossless
* **40-50 dB**: Very good quality, minimal artifacts
* **30-40 dB**: Good quality, some visible compression
* **20-30 dB**: Fair quality, noticeable artifacts
* **<20 dB**: Poor quality, significant degradation

**Pros**:

* Fast to calculate
* Easy to understand
* Good for quick comparisons

**Cons**:

* Doesn't always correlate with perceived quality
* Treats all pixel differences equally
* Can miss perceptual artifacts

### SSIM (Structural Similarity Index)

**What it measures**: Structural similarity considering luminance, contrast, and structure

**Scale**:

* Range: 0 (completely different) to 1.0 (identical)
* Higher is better

**Typical Values**:

* **0.99-1.00**: Excellent quality, virtually identical
* **0.95-0.99**: Very good quality, barely noticeable differences
* **0.90-0.95**: Good quality, minor differences
* **0.80-0.90**: Fair quality, visible differences
* **<0.80**: Poor quality, significant degradation

**Pros**:

* Better correlation with human perception than PSNR
* Considers image structure
* Sensitive to blurring and noise

**Cons**:

* Slower to calculate than PSNR
* Still not perfect for perceptual quality

### VMAF (Video Multimethod Assessment Fusion)

**What it measures**: Perceptual video quality using machine learning

**Scale**:

* Range: 0 (worst) to 100 (best)
* Higher is better

**Typical Values**:

* **95-100**: Excellent quality, transparent
* **80-95**: Very good quality, minor artifacts
* **60-80**: Good quality, some visible compression
* **40-60**: Fair quality, noticeable artifacts
* **<40**: Poor quality, significant degradation

**Pros**:

* **Best correlation** with human perception
* Industry standard (used by Netflix, YouTube)
* Accounts for complex perceptual factors

**Cons**:

* Slowest to calculate
* Requires more computational resources
* More complex to interpret

## Enabling Quality Analysis

### In Settings

1. Click settings icon (gear)
2. Navigate to "General"
3. Toggle "Quality Analysis"
4. Quality metrics calculated automatically after encoding

### Per-File Basis

If quality analysis is disabled globally:

1. Encode file normally
2. Right-click completed file in queue
3. Select "Run Quality Analysis"
4. Metrics calculated on demand

## Viewing Quality Results

### In the Queue

After encoding with quality analysis enabled:

1. Find completed file in batch queue
2. Click metrics button (📊 icon)
3. View PSNR, SSIM, and VMAF scores
4. See detailed breakdown by frame

### Interpreting Results

**Example Quality Report**:

```
PSNR: 42.5 dB
SSIM: 0.972
VMAF: 91.3
```

**Interpretation**:

* PSNR of 42.5 dB = Very good quality
* SSIM of 0.972 = Minimal structural differences
* VMAF of 91.3 = Excellent perceptual quality

**Recommendation**: This encoding maintains high quality with good compression.

## Using Quality Metrics to Optimize Settings

### Finding the Optimal CRF Value

**Goal**: Find the lowest CRF (highest compression) that maintains acceptable quality

**Method**:

1. Encode a test clip at different CRF values:
   * CRF 18, 20, 23, 26, 28, 30
2. Run quality analysis on each
3. Compare VMAF scores
4. Choose CRF where VMAF drops below acceptable threshold

**Example Results**:

| CRF | File Size | VMAF Score | Recommendation         |
| --- | --------- | ---------- | ---------------------- |
| 18  | 100 MB    | 97.5       | Overkill for most uses |
| 20  | 75 MB     | 95.8       | Excellent quality      |
| 23  | 50 MB     | 92.1       | ✅ Best balance         |
| 26  | 35 MB     | 87.3       | Good for streaming     |
| 28  | 25 MB     | 82.5       | Fair quality           |
| 30  | 18 MB     | 75.2       | Noticeable artifacts   |

**Conclusion**: CRF 23 provides the best quality/size ratio with VMAF > 90

### Comparing Presets

**Scenario**: Compare "Balanced" vs "HEVC Balanced" presets

**Steps**:

1. Encode same file with both presets
2. Run quality analysis
3. Compare metrics and file sizes

**Example Comparison**:

```
Balanced (H.264, CRF 23):
- File Size: 50 MB
- VMAF: 92.1
- Encode Time: 2 min

HEVC Balanced (H.265, CRF 24):
- File Size: 32 MB  (36% smaller)
- VMAF: 91.8  (similar quality)
- Encode Time: 8 min  (4x slower)
```

**Conclusion**: HEVC provides significant size savings with similar quality, but takes much longer

### Testing Hardware vs Software Encoding

**Goal**: Determine quality difference between GPU and CPU encoding

**Steps**:

1. Encode with hardware acceleration enabled
2. Encode same file with hardware acceleration disabled
3. Compare quality metrics

**Example**:

```
Hardware (NVENC):
- VMAF: 89.5
- Encode Time: 30 seconds

Software (x264):
- VMAF: 92.3
- Encode Time: 5 minutes
```

**Conclusion**: Software encoding provides 3% better quality, hardware is 10x faster

## Quality Analysis Performance Impact

### Calculation Time

Quality analysis adds time to the encoding process:

| Resolution | PSNR Time | SSIM Time | VMAF Time |
| ---------- | --------- | --------- | --------- |
| 720p       | +5 sec    | +10 sec   | +30 sec   |
| 1080p      | +10 sec   | +20 sec   | +1 min    |
| 4K         | +30 sec   | +1 min    | +5 min    |

**Note**: Times are approximate and vary by system performance

### Resource Usage

* **PSNR**: Low CPU usage
* **SSIM**: Moderate CPU usage
* **VMAF**: High CPU usage, can use GPU acceleration if available

### Disabling for Faster Workflows

For batch processing without quality validation:

1. Disable quality analysis in settings
2. Encode entire batch
3. Enable quality analysis
4. Run analysis on sample files only

## Advanced Quality Analysis

### Frame-by-Frame Analysis

Some quality analysis tools provide per-frame metrics:

* Identify specific scenes with quality issues
* Detect temporal artifacts
* Find problematic frames

**Access** (if available):

1. View quality metrics
2. Expand to see frame-by-frame graph
3. Identify quality dips

### Quality Targets

Set quality targets based on use case:

**Streaming Services**:

* VMAF target: 90-95
* Ensures good quality after platform re-encoding

**Archival**:

* VMAF target: 95+
* SSIM target: 0.99+
* Preserves maximum quality

**Web/Social Media**:

* VMAF target: 80-90
* Balanced quality, platform will re-encode anyway

**Mobile**:

* VMAF target: 75-85
* Lower quality acceptable on small screens

## Quality vs File Size Trade-offs

### Understanding Diminishing Returns

Increasing quality has diminishing returns:

| Quality Increase          | File Size Increase |
| ------------------------- | ------------------ |
| Good → Very Good          | +30-40% size       |
| Very Good → Excellent     | +40-50% size       |
| Excellent → Near-lossless | +100-200% size     |

**Recommendation**: Target "Very Good" quality for most uses (VMAF 90-95)

### Compression Efficiency

Different codecs achieve different quality at same file size:

**1080p 60fps, 50 MB target**:

* **H.264**: VMAF 88
* **H.265**: VMAF 92 (same size, better quality)
* **AV1**: VMAF 94 (same size, even better quality)

**Conclusion**: Modern codecs are more efficient

## Troubleshooting Quality Issues

### Low Quality Scores

**Problem**: VMAF < 80, visible artifacts

**Solutions**:

1. **Lower CRF** - Increase quality (18-20)
2. **Slower preset** - Use "slow" or "slower"
3. **Two-pass encoding** - Better bitrate allocation
4. **Higher bitrate** - If using CBR/VBR
5. **Different codec** - Try H.265 or AV1

### Quality Analysis Fails

**Problem**: "Quality analysis failed" error

**Solutions**:

1. **Check source file** - Ensure it's not corrupted
2. **Verify output file** - Ensure encoding succeeded
3. **Update FFmpeg** - Requires FFmpeg with VMAF support
4. **Check file paths** - Ensure no special characters

### Inconsistent Metrics

**Problem**: Different metrics disagree (high PSNR, low VMAF)

**Explanation**:

* PSNR measures pixel difference, not perception
* VMAF measures perceptual quality
* Trust VMAF over PSNR for perceptual quality

**Example**:

* Slightly blurred video: High PSNR, low VMAF
* Sharp with some compression: Lower PSNR, higher VMAF

## Quality Analysis Best Practices

### Testing Workflow

1. **Select representative clips** - Use varied content (action, slow scenes, dark, bright)
2. **Test multiple settings** - Encode with different CRF/bitrates
3. **Run quality analysis** - Calculate metrics for all tests
4. **Compare results** - Find best quality/size balance
5. **Apply to batch** - Use optimal settings for full encode

### Sample Selection

For batch processing, run quality analysis on:

* **First file** - Verify settings
* **Most complex file** - Worst-case quality
* **Representative sample** - 10-20% of batch
* **Random selection** - Catch edge cases

### Documentation

Keep track of quality results:

* Create a spreadsheet of CRF vs VMAF
* Note optimal settings for different content types
* Build a library of tested presets

## Integration with Other Features

### Video Comparison

After quality analysis:

1. Open [Video Comparison](video-comparison.md) tool
2. View side-by-side playback
3. See if VMAF scores match visual perception
4. Adjust settings if needed

### Custom Presets

Save tested settings as custom presets:

1. Find optimal CRF/bitrate through quality testing
2. Create [Custom Preset](custom-presets.md) with these settings
3. Reuse for similar content

## Next Steps

* Use [Video Comparison](video-comparison.md) to visually validate quality
* Test different settings in [Advanced Usage](./)
* Create quality-optimized [Custom Presets](custom-presets.md)
* Optimize performance with [Hardware Acceleration](../Hardware-Acceleration.md)

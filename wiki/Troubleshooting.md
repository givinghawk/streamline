# Troubleshooting

Common issues and solutions for Streamline users.

## Installation Issues

### FFmpeg Not Found

**Problem**: "FFmpeg is not installed or not in PATH" error

**Solutions**:

1.  **Verify FFmpeg Installation**

    ```bash
    ffmpeg -version
    ```

    If this fails, FFmpeg is not installed or not in PATH.
2. **Windows**:
   * Download from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/)
   * Extract to `C:\ffmpeg`
   * Add `C:\ffmpeg\bin` to system PATH
   * Restart computer
3.  **macOS**:

    ```bash
    brew install ffmpeg
    ```
4.  **Linux**:

    ```bash
    sudo apt install ffmpeg  # Ubuntu/Debian
    sudo dnf install ffmpeg  # Fedora
    ```
5. **Restart Streamline** after installing FFmpeg

### Application Won't Launch

**macOS: "Cannot be opened because it is from an unidentified developer"**

**Solution**:

1. Right-click Streamline.app
2. Select "Open"
3. Click "Open" in the dialog
4. Grant necessary permissions

**Windows: "Windows protected your PC"**

**Solution**:

1. Click "More info"
2. Click "Run anyway"
3. Or download from official releases page

**Linux: Permission Denied**

**Solution**:

```bash
chmod +x Streamline-*.AppImage
./Streamline-*.AppImage
```

### Missing Dependencies (Linux)

**Problem**: "error while loading shared libraries"

**Solution**:

```bash
# Ubuntu/Debian
sudo apt install libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1

# Fedora
sudo dnf install gtk3 libnotify nss libXScrnSaver libXtst xdg-utils at-spi2-core libdrm mesa-libgbm

# Arch
sudo pacman -S gtk3 libnotify nss libxss libxtst xdg-utils at-spi2-core libdrm mesa
```

## Encoding Issues

### Encoding Fails Immediately

**Problem**: Encoding starts but fails within seconds

**Common Causes**:

1. **Unsupported codec/format combination**
   * Solution: Try different output format (MP4, MKV)
   * Use "Balanced" preset as baseline
2. **Corrupted source file**
   * Test file in media player
   * Try encoding a different file
   * Check file integrity
3. **Invalid custom parameters**
   * Remove custom FFmpeg parameters
   * Test with built-in preset
   * Verify parameter syntax
4. **Insufficient permissions**
   * Check write permissions on output directory
   * Choose different output location
   * Run as administrator (Windows) if needed

### Encoding Fails Partway Through

**Problem**: Encoding progresses but fails before completion

**Common Causes**:

1. **Insufficient disk space**
   * Check available disk space
   * Clear temporary files
   * Choose different output location
2. **Source file corruption**
   * File may have corrupt frames
   * Try re-downloading source
   * Use different input file
3. **System resource exhaustion**
   * Close other applications
   * Reduce concurrent encodes
   * Lower encoding complexity

**Solutions**:

* Check console/logs for specific error
* Try encoding short clip from same file
* Use two-pass encoding (can help with some errors)

### Hardware Acceleration Not Working

**Problem**: GPU encoding not being used

**Diagnostic Steps**:

1.  **Verify GPU is detected**:

    ```bash
    # NVIDIA
    nvidia-smi

    # AMD (Windows)
    dxdiag

    # Intel
    Check Device Manager / System Profiler
    ```
2.  **Check FFmpeg encoder support**:

    ```bash
    ffmpeg -encoders | grep nvenc   # NVIDIA
    ffmpeg -encoders | grep amf     # AMD
    ffmpeg -encoders | grep qsv     # Intel
    ```
3. **Update GPU drivers**:
   * NVIDIA: [GeForce Drivers](https://www.nvidia.com/drivers)
   * AMD: [AMD Drivers](https://www.amd.com/support)
   * Intel: [Intel Driver Support](https://www.intel.com/content/www/us/en/support/intel-driver-support-assistant.html)
4. **Enable in Streamline**:
   * Settings → General → Hardware Acceleration
   * Restart Streamline
5. **Force software encoding** as fallback:
   * Disable hardware acceleration
   * Use built-in software presets

### Slow Encoding Speed

**Problem**: Encoding much slower than expected

**Diagnostic**:

1. **Check CPU/GPU usage**:
   * Task Manager (Windows)
   * Activity Monitor (macOS)
   * htop/System Monitor (Linux)
2. **Common Causes**:
   * **Thermal throttling**: High temperatures reduce performance
     * Solution: Improve cooling, reduce load
   * **Background processes**: Other apps using resources
     * Solution: Close unnecessary programs
   * **Wrong encoder**: Software instead of hardware
     * Solution: Enable hardware acceleration
   * **Slow preset**: "slower" or "veryslow" preset
     * Solution: Use "medium" or "fast" preset
   * **High resolution**: 4K encoding is much slower than 1080p
     * Solution: Expected behavior, use hardware acceleration
   * **Multiple concurrent encodes**: System overloaded
     * Solution: Reduce max concurrent jobs

## Quality Issues

### Poor Output Quality

**Problem**: Encoded video has visible artifacts

**Solutions**:

1. **Lower CRF value** (better quality):
   * Try CRF 18 or 20 instead of 23
   * Use "High Quality" preset
2. **Use slower encoding preset**:
   * Change from "fast" to "medium" or "slow"
   * Better quality at cost of time
3. **Enable two-pass encoding**:
   * Advanced Settings → Two-Pass
   * Better quality distribution
4. **Check source quality**:
   * If source is low quality, output will be too
   * Can't improve beyond source quality
5. **Try different codec**:
   * H.265 often better quality than H.264
   * Software encoding better than hardware

### File Size Larger Than Expected

**Problem**: Output file larger than source

**Causes**:

1. **CRF too low**: Setting like CRF 15 creates huge files
   * Solution: Use CRF 20-23 for balanced size
2. **Lossless codec**: Using copy or lossless
   * Solution: Use lossy codec with appropriate quality
3. **Higher resolution**: Upscaling increases size
   * Solution: Keep original resolution
4. **Audio codec**: Lossless audio (FLAC) is large
   * Solution: Use AAC or Opus

### Audio/Video Out of Sync

**Problem**: Audio doesn't match video in output

**Solutions**:

1. **Check source file**:
   * Test source in media player
   * If source is out of sync, re-encode won't fix it
2.  **Use custom parameter**:

    ```
    -async 1
    ```

    Helps with some sync issues
3. **Match frame rate**:
   * Keep original frame rate
   * Don't change frame rate unless necessary
4. **Try different container**:
   * MKV is better at handling sync
   * Switch from MP4 to MKV

## Interface Issues

### Application Freezes or Crashes

**Problem**: Streamline becomes unresponsive

**Solutions**:

1. **Wait for process to complete**:
   * Large file analysis can take time
   * Check if process is actually frozen (CPU usage)
2. **Force quit and restart**:
   * Windows: Task Manager → End Task
   * macOS: Force Quit (Cmd+Opt+Esc)
   * Linux: killall streamline
3. **Clear application cache**:
   * Settings → Advanced → Clear Cache
   * Restart application
4. **Reinstall application**:
   * Backup custom presets first
   * Uninstall and reinstall
5. **Check system resources**:
   * Insufficient RAM
   * Low disk space
   * High CPU usage from other apps

### Settings Not Saving

**Problem**: Preferences reset after restart

**Solutions**:

1. **Check file permissions**:
   * Ensure write access to settings directory
   * Windows: `%APPDATA%\streamline`
   * macOS: `~/Library/Application Support/streamline`
   * Linux: `~/.config/streamline`
2. **Manually backup settings**:
   * Export custom presets
   * Note your preferences
   * Reapply after restart
3. **Reinstall application**:
   * Complete uninstall
   * Delete settings folder
   * Fresh install

### UI Elements Not Visible

**Problem**: Buttons, text, or panels missing

**Solutions**:

1. **Resize window**:
   * Maximize window
   * Drag to resize
   * Check if elements appear
2. **Reset layout**:
   * Settings → Appearance → Reset Layout
   * Returns to default UI state
3. **Change theme**:
   * Switch between dark and light mode
   * May resolve rendering issues
4. **Update graphics drivers**:
   * Electron uses GPU acceleration
   * Outdated drivers can cause issues

## File Handling Issues

### Can't Add Files

**Problem**: Drag-and-drop or file browse doesn't work

**Solutions**:

1. **File type not supported**:
   * Check file extension
   * Try with known-good file (MP4, MP3)
2. **File path issues**:
   * Move file to simple path (no special characters)
   * Avoid very long paths
   * No spaces in critical folders
3. **File permissions**:
   * Ensure read access to file
   * Check file isn't locked by another program
4. **Large file**:
   * Files over 100GB may take time to load
   * Wait for analysis to complete

### Output File Not Found

**Problem**: Encoding succeeds but can't find output

**Solutions**:

1. **Check output location**:
   * Click folder icon in queue
   * Verify output path in settings
2. **Batch mode**:
   * Look in `/optimised` subfolder
   * Check if batch mode enabled
3. **File overwrite**:
   * If overwrite enabled, original replaced
   * Check source location
4. **Disk full**:
   * Check disk space
   * File may not have completed

## Quality Analysis Issues

### Quality Analysis Fails

**Problem**: VMAF/PSNR/SSIM calculation fails

**Solutions**:

1. **FFmpeg missing VMAF**:
   * Update FFmpeg to version with VMAF support
   * Some builds don't include VMAF
2. **File compatibility**:
   * Try with different file
   * Some formats may not support analysis
3. **Insufficient resources**:
   * VMAF requires significant CPU
   * Close other applications
   * Try smaller resolution file first
4. **Disable and retry**:
   * Disable quality analysis
   * Complete encoding
   * Run analysis separately

### Unexpected Quality Scores

**Problem**: Metrics don't match visual perception

**Explanation**:

* PSNR doesn't always correlate with perception
* VMAF is most accurate for perceptual quality
* Different metrics measure different aspects

**Solution**:

* Trust VMAF over PSNR
* Use [Video Comparison](advanced-usage/video-comparison.md) to verify visually
* Scores are relative, compare between encodes

## Batch Processing Issues

### Batch Stops After One File

**Problem**: Only first file encodes

**Solutions**:

1. **Check button used**:
   * "Start Encode" = single file
   * "Start Batch" = all files
2. **Check for errors**:
   * First file may have failed
   * Check error message
   * Fix issue and retry batch
3. **Queue not populated**:
   * Verify files are in queue
   * Status should be "Pending"

### Inconsistent Results in Batch

**Problem**: Different files have different quality

**Causes**:

* Different source qualities
* Different content complexity
* Per-file preset variations

**Solutions**:

* Use same preset for all files
* Adjust CRF for consistent quality
* Test one file first, apply to all

## Performance Issues

### High CPU Usage

**Problem**: Streamline uses too much CPU

**Explanation**: Normal during encoding

**Solutions** (if excessive when idle):

1. Close unnecessary tabs/windows
2. Disable thumbnail generation
3. Lower encoding quality preset
4. Reduce concurrent encodes

### High Memory Usage

**Problem**: RAM usage very high

**Solutions**:

1. Process fewer files simultaneously
2. Close and reopen Streamline
3. Disable quality analysis
4. Process smaller files

### Overheating

**Problem**: Computer gets very hot

**Solutions**:

1. Improve ventilation
2. Use laptop cooling pad
3. Reduce concurrent encodes
4. Lower encoding preset speed
5. Take breaks between batches

## Getting Help

If issues persist:

1. **Check Error Messages**:
   * Screenshot error dialogs
   * Note exact error text
   * Check console for details
2. **Gather Information**:
   * Streamline version
   * Operating system
   * FFmpeg version
   * GPU model (if using hardware acceleration)
   * Source file details
3. **Search Existing Issues**:
   * [GitHub Issues](https://github.com/givinghawk/streamline/issues)
   * Look for similar problems
   * Check closed issues too
4. **Create New Issue**:
   * Describe problem clearly
   * Include steps to reproduce
   * Attach error messages/screenshots
   * Provide system information
5. **Community Help**:
   * Discord/Forums (if available)
   * Reddit communities
   * Stack Overflow

## Next Steps

* Review [User Guide](User-Guide.md) for feature details
* Check [Advanced Usage](advanced-usage/) for complex scenarios
* Consult [FAQ](Home.md) for quick answers
* Report bugs on [GitHub](https://github.com/givinghawk/streamline/issues)

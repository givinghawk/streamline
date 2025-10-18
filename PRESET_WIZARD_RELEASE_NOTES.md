# Release Notes - v0.5.0 Preset Wizard Update

## 🎨 New Features

### Advanced Preset Wizard
A comprehensive, step-by-step interface for creating custom encoding presets with all FFmpeg parameters organized into logical categories.

**Highlights:**
- **6-Step Wizard Interface** with progress tracking
  1. Basic Info (name, category, format)
  2. Video Settings - Basic (codec, quality, speed)
  3. Video Settings - Advanced (resolution, bitrate, GOP)
  4. Audio Settings (codec, bitrate, channels)
  5. Advanced Options (HDR, filters, metadata)
  6. Review & Save (FFmpeg command preview)

- **Comprehensive Parameter Coverage**:
  - 15+ video codec options (H.264, H.265, AV1, VP9, hardware encoders)
  - 10+ audio codec options (AAC, Opus, MP3, FLAC, etc.)
  - Hardware acceleration support (CUDA, QSV, AMF, VideoToolbox, VAAPI)
  - Quality control (CRF, bitrate, VBR)
  - Resolution & frame rate control
  - HDR & color space settings (BT.709, BT.2020, HDR10, HLG)
  - Video filters (deinterlace, denoise, custom filter chains)
  - Audio filters and processing
  - Subtitle handling (copy or burn)
  - Metadata control
  - Performance options (threading, two-pass)

- **Preset Management Interface**:
  - New "Presets" tab in main navigation
  - Visual library of all presets (built-in + custom)
  - Search and filter by category
  - Statistics dashboard (total, built-in, custom, imported)
  - Grid view with preset cards

- **Import/Export System**:
  - Export any preset to `.slpreset` format
  - Share presets with other Streamline users
  - Import community presets
  - One-click preset duplication

- **User Experience Enhancements**:
  - Real-time FFmpeg command generation
  - Inline help text and tooltips
  - Quick guide panels with recommendations
  - Parameter validation
  - Copy command to clipboard
  - Edit and delete custom presets
  - Visual badges for custom/imported presets

## 🔧 Technical Improvements

- New `PresetWizard.jsx` component (1,500+ lines)
- New `PresetManager.jsx` component (350+ lines)
- Integration with existing `SettingsContext`
- Persistent storage via Electron settings
- No breaking changes to existing preset system
- Compatible with all built-in presets

## 📚 Documentation

- **Preset Wizard Guide** - Complete technical documentation
- **Quick Start Guide** - User-friendly tutorial with examples
- FFmpeg parameter explanations
- Best practices and tips
- Troubleshooting guide

## 🎯 Use Cases

This feature is perfect for:
- Creating platform-specific presets (YouTube, Vimeo, Instagram)
- Building hardware-accelerated workflows
- Archival with specific quality requirements
- HDR/Dolby Vision encoding
- Custom filter chain applications
- Batch processing with consistent settings
- Sharing encoding configurations with team members

## 📊 Statistics

- **80+ Parameters**: Nearly every FFmpeg encoding option covered
- **6 Categories**: Logical organization (basic video, advanced video, audio, advanced options)
- **15+ Video Codecs**: Including all major software and hardware encoders
- **10+ Audio Codecs**: From lossless to highly compressed
- **Unlimited Presets**: Create as many custom presets as needed

## 🚀 Getting Started

1. Open Streamline
2. Click the **"Presets"** tab
3. Click **"Create Preset"**
4. Follow the 6-step wizard
5. Save or export your preset
6. Use it in the **"Encode"** tab

## 💡 Example Presets You Can Create

- YouTube 4K uploads (optimal quality/size balance)
- Fast hardware encoding with NVENC
- Lossless archival with H.265 + FLAC
- HDR10 preservation
- Custom denoising workflows
- Audio extraction to FLAC/MP3
- Instagram/TikTok optimized exports
- Stream-ready MP4s with fast start

## 🔄 Compatibility

- Works with all existing Streamline features
- Compatible with batch queue
- Integrates with hardware detection
- No changes to existing presets
- Backward compatible with previous versions

## 🐛 Known Limitations

- Custom FFmpeg arguments not validated (advanced users only)
- Some codec combinations may require specific FFmpeg builds
- Hardware encoder availability depends on system
- Two-pass encoding UI present but not fully implemented in backend

## 📝 Notes

The preset wizard uses the same FFmpeg command generation system as the existing encoding workflow, ensuring consistency and reliability. All presets created with the wizard will work identically to manually configured settings.

## 🙏 Credits

Designed to cover the most common FFmpeg encoding scenarios while remaining accessible to beginners through the step-by-step interface and helpful guides.

---

**Previous Version**: v0.4.0  
**Current Version**: v0.5.0  
**Release Date**: January 2025

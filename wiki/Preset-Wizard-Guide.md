# Preset Wizard Feature Documentation

## Overview
The Preset Wizard is an in-depth, step-by-step interface for creating custom encoding presets in Streamline. It provides a comprehensive set of FFmpeg encoding parameters organized into logical categories with both basic and advanced options.

## Architecture

### Components

#### 1. PresetWizard (`src/components/PresetWizard.jsx`)
The main wizard component that guides users through 6 steps to create or edit presets.

**Features:**
- Multi-step wizard interface with progress indicator
- Real-time FFmpeg command generation
- Export to `.slpreset` format
- Save to local preset library
- Comprehensive parameter coverage

**Steps:**
1. **Basic Info** - Name, category, description, output format
2. **Video Settings (Basic)** - Codec, hardware acceleration, quality (CRF), encoding speed
3. **Video Settings (Advanced)** - Resolution, bitrate control, codec-specific settings, GOP structure
4. **Audio Settings** - Codec, bitrate, channels, sample rate, filters
5. **Advanced Options** - HDR/color space, video filters, subtitles, metadata, performance
6. **Review & Save** - Preview FFmpeg command, export or save

#### 2. PresetManager (`src/components/PresetManager.jsx`)
The preset library management interface.

**Features:**
- Grid view of all presets (built-in + custom)
- Search and filter by category
- Statistics dashboard
- Import/export `.slpreset` files
- Edit/delete custom presets
- Export any preset to share

#### 3. Integration Points
- Added "Presets" mode to `ModeTabs.jsx`
- Routing added to `App.jsx`
- Uses existing `SettingsContext` for preset storage
- Compatible with existing preset system

## Parameter Categories

### Basic Video Settings
- Video codec selection (software & hardware encoders)
- Hardware acceleration (CUDA, QSV, VideoToolbox, etc.)
- Quality control (CRF 0-51)
- Encoding speed presets (ultrafast to veryslow)

### Advanced Video Settings
- **Resolution & Frame Rate**
  - Preset resolutions (4K, 2K, 1080p, 720p, etc.)
  - Custom width/height
  - Frame rate control (24, 30, 60, 120 fps)

- **Bitrate Control**
  - Target bitrate (for precise file size)
  - Max bitrate (rate control)
  - Buffer size (VBV)

- **Codec Settings**
  - Profile (baseline, main, high, high10, high422, high444)
  - Level (4.0, 5.1, etc.)
  - Tune (film, animation, grain, stillimage, fastdecode, zerolatency)
  - Pixel format (yuv420p, yuv420p10le, yuv422p, yuv444p)

- **GOP Structure**
  - GOP size (keyframe interval)
  - B-frames (consecutive B-frames)

### Audio Settings
- **Basic**
  - Audio codec (AAC, MP3, Opus, Vorbis, FLAC, ALAC, PCM)
  - Bitrate (64k to 640k)
  - Channels (mono, stereo, 5.1, 7.1)
  - Sample rate (22.05kHz to 192kHz)

- **Advanced**
  - VBR quality
  - Audio profile (AAC-LC, HE-AAC, HE-AAC v2)
  - Audio filters (FFmpeg filter chain)

### Advanced Options
- **HDR & Color Space**
  - Color space (BT.709, BT.2020)
  - Color primaries
  - Transfer characteristics (SDR, HDR10 PQ, HLG)
  - Color range (limited/TV or full/PC)

- **Video Filters**
  - Deinterlace (yadif)
  - Denoise (HQDN3D, NLMeans, removegrain)
  - Custom filter chains

- **Subtitles**
  - Copy subtitle streams
  - Burn subtitles (hardcode)

- **Metadata & Container**
  - Copy metadata from source
  - Fast start (web streaming optimization)

- **Performance**
  - Thread count
  - Two-pass encoding

- **Custom Arguments**
  - Raw FFmpeg arguments for advanced users

## File Format: .slpreset

Streamline preset files use the `.slpreset` extension and contain JSON data:

```json
{
  "name": "My Custom H.265 Preset",
  "description": "High quality H.265 encoding for archival",
  "category": "video",
  "version": "1.0",
  "createdAt": "2025-01-15T12:00:00.000Z",
  "settings": {
    "videoCodec": "libx265",
    "crf": "20",
    "preset": "slow",
    "audioCodec": "aac",
    "audioBitrate": "192k",
    "outputFormat": "mp4",
    "fastStart": true,
    // ... all other settings
  }
}
```

## Usage

### Creating a Preset
1. Navigate to the "Presets" tab
2. Click "Create Preset"
3. Follow the 6-step wizard:
   - Enter basic information
   - Configure video settings
   - Configure audio settings
   - Set advanced options
   - Review FFmpeg command
   - Save or export

### Editing a Preset
1. Find your custom preset in the library
2. Click the edit icon (pencil)
3. Modify settings in the wizard
4. Save changes

### Exporting a Preset
1. Find any preset in the library
2. Click the download icon
3. `.slpreset` file downloads automatically
4. Share with other Streamline users

### Importing a Preset
1. Click "Import" button in preset library
2. Select a `.slpreset` file
3. Preset is added to your library with "Imported" badge

## FFmpeg Command Generation

The wizard automatically generates FFmpeg commands based on selected parameters:

```bash
ffmpeg -hwaccel cuda -i input.mp4 \
  -c:v hevc_nvenc -preset slow -crf 20 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 \
  -movflags +faststart \
  output.mp4
```

The command preview shows exactly what will be executed during encoding.

## Integration with Existing System

### SettingsContext Integration
- Custom presets stored via `customPresets` array
- Automatic persistence to disk via Electron store
- Methods: `addCustomPreset()`, `updateCustomPreset()`, `deleteCustomPreset()`
- Built-in presets from `src/constants/presets.js` remain unchanged

### Preset Selection
- Custom presets appear alongside built-in presets in encoding workflow
- Marked with "Custom" badge for identification
- Fully compatible with existing preset system

## Benefits

1. **Comprehensive** - Covers nearly all FFmpeg encoding parameters
2. **User-Friendly** - Step-by-step wizard with helpful tooltips
3. **Categorized** - Parameters organized logically (basic vs advanced)
4. **Educational** - Quick guides and tips for quality settings
5. **Shareable** - Export/import presets between users
6. **Visual** - Real-time FFmpeg command preview
7. **Flexible** - Custom arguments for power users
8. **Validated** - Form validation and error prevention

## Future Enhancements

Potential improvements for future versions:

1. **Preset Templates** - Quick-start templates for common use cases
2. **Batch Preset Application** - Apply preset to multiple files
3. **Preset Testing** - Test encode a sample before saving
4. **Preset Marketplace** - Community-shared presets
5. **Preset Version History** - Track preset changes over time
6. **Hardware Detection** - Auto-select available hardware encoders
7. **Quality Presets** - Visual quality slider with automatic parameter selection
8. **Codec Compatibility Check** - Warn about unsupported combinations

## Technical Notes

### Component Structure
```
PresetManager
├── Search & Filter UI
├── Stats Dashboard
├── Preset Grid (by category)
│   └── PresetCard (for each preset)
│       ├── Export button
│       ├── Edit button (custom only)
│       └── Delete button (custom only)
└── PresetWizard (modal)
    ├── Progress Indicator
    ├── Step Content (6 steps)
    └── Navigation (Previous/Next/Save/Export)
```

### State Management
- Local state for wizard UI and form data
- SettingsContext for persistent storage
- No Redux or complex state management needed

### Validation
- Required fields enforced (name, category, output format)
- Numeric ranges validated (CRF 0-51, etc.)
- Conditional fields (e.g., audio settings hidden for audio-only presets)

### Performance
- Lazy rendering of step content
- Efficient preset filtering with useMemo potential
- No unnecessary re-renders

## Troubleshooting

### Preset Not Appearing
- Check if preset was saved successfully (alert confirmation)
- Verify category filter isn't hiding it
- Clear search query

### Export Not Working
- Check browser download permissions
- Verify file system access
- Try different output location

### Import Fails
- Verify `.slpreset` file format is valid JSON
- Check all required fields are present
- Ensure no corrupted data

### FFmpeg Command Issues
- Review command preview before saving
- Test with small sample file first
- Check FFmpeg version supports selected codec
- Verify hardware acceleration availability

## Best Practices

1. **Name Presets Clearly** - Include codec, quality, and use case
2. **Add Descriptions** - Explain what the preset is optimized for
3. **Test Before Sharing** - Verify preset works before exporting
4. **Use Appropriate CRF** - 18-23 for high quality, 23-28 for balanced
5. **Consider Compatibility** - H.264/AAC/MP4 for maximum compatibility
6. **Document Custom Args** - Comment complex custom arguments
7. **Export Important Presets** - Keep backups of critical presets
8. **Organize by Category** - Use categories to keep presets organized

## Related Files

- `src/components/PresetWizard.jsx` - Wizard component
- `src/components/PresetManager.jsx` - Library management
- `src/contexts/SettingsContext.jsx` - Storage and persistence
- `src/constants/presets.js` - Built-in presets
- `src/components/ModeTabs.jsx` - Navigation integration
- `src/App.jsx` - Routing integration

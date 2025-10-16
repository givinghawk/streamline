# Streamline File Formats

Streamline introduces custom file extensions to save and share various types of data. All formats use JSON under the hood for compatibility and readability.

## Overview

| Extension | Purpose | Use Case |
|-----------|---------|----------|
| `.slqueue` | Batch Queue | Save and resume batch encoding jobs |
| `.slpreset` | Encoding Preset | Share custom encoding configurations |
| `.slanalysis` | Video Analysis | Share detailed video analysis data |
| `.slreport` | Encoding Report | Archive encoding job results |

## File Formats

### .slqueue - Queue Files

Queue files store complete batch processing configurations, including:

- List of files to encode
- Selected presets for each file
- Custom encoding settings
- Output directories
- Processing status and progress
- Quality metrics (for completed items)

**Use Cases:**
- Save unfinished batch jobs to resume later
- Share encoding workflows with team members
- Archive encoding configurations for future reference

**Example:**
```json
{
  "version": "1.0.0",
  "type": "slqueue",
  "createdAt": "2025-10-16T12:00:00.000Z",
  "queue": [
    {
      "id": "abc123",
      "fileName": "video.mp4",
      "filePath": "/path/to/video.mp4",
      "fileSize": 1048576000,
      "preset": {
        "id": "balanced",
        "name": "Balanced"
      },
      "status": "pending"
    }
  ],
  "settings": {
    "overwriteFiles": false,
    "maxConcurrentJobs": 1
  }
}
```

**How to Use:**
1. In the Encode tab, click "Save Queue" button
2. Choose a location and filename
3. To load, click "Load Queue" or double-click the .slqueue file

### .slpreset - Preset Files

Preset files contain encoding configurations that can be shared and reused.

**Features:**
- Fully backwards compatible with JSON presets
- Includes all codec settings
- Preserves advanced settings
- Supports all encoding parameters

**Use Cases:**
- Share custom presets with other users
- Backup your favorite encoding settings
- Distribute recommended settings for specific scenarios

**Example:**
```json
{
  "version": "1.0.0",
  "type": "slpreset",
  "createdAt": "2025-10-16T12:00:00.000Z",
  "preset": {
    "id": "my-custom-preset",
    "name": "My Custom Preset",
    "description": "Optimized for web streaming",
    "category": "video",
    "settings": {
      "videoCodec": "libx264",
      "videoBitrate": "2500k",
      "audioCodec": "aac",
      "audioBitrate": "128k",
      "outputFormat": "mp4"
    }
  }
}
```

**How to Use:**
1. Select a preset in the Preset Selector
2. Click "Export" button to save
3. To import, click "Import" button or double-click the .slpreset file
4. Legacy .json presets are automatically converted

### .slanalysis - Analysis Files

Analysis files store detailed video analysis data that can be shared alongside video files.

**Contents:**
- File information (duration, codecs, bitrate)
- Bitrate distribution analysis
- Scene detection data
- Content analysis metrics
- Encoding recommendations
- Quality metrics

**Use Cases:**
- Share analysis with others to help them encode optimally
- Re-encode to multiple versions using saved analysis
- Keep detailed records of video characteristics
- Serve as a sidecar file for video sharing

**Example:**
```json
{
  "version": "1.0.0",
  "type": "slanalysis",
  "createdAt": "2025-10-16T12:00:00.000Z",
  "sourceFile": {
    "name": "video.mp4",
    "path": "/path/to/video.mp4",
    "size": 1048576000
  },
  "fileInfo": {
    "format": {
      "duration": 120.5,
      "bitrate": 8000000
    },
    "streams": [...]
  },
  "bitrateAnalysis": {
    "average": 5000,
    "peak": 12000,
    "min": 2000
  },
  "sceneDetection": {
    "scenes": 45,
    "averageLength": 2.7
  },
  "recommendations": {
    "codec": "libx265",
    "targetBitrate": "4000k"
  }
}
```

**How to Use:**
1. Analyze a file in the Analysis tab
2. Click "Export" button to save analysis
3. Share the .slanalysis file with the video
4. To load, click "Import" or double-click the file

### .slreport - Report Files

Report files contain comprehensive statistics about completed encoding jobs.

**Contents:**
- Summary statistics (total items, success/failure counts)
- Space savings calculations
- Compression ratios
- Quality metrics for each file
- Encoding settings used
- Item-by-item details

**Use Cases:**
- Archive completed batch encoding results
- Generate reports for clients or stakeholders
- Track encoding efficiency over time
- Document project deliverables

**Example:**
```json
{
  "version": "1.0.0",
  "type": "slreport",
  "createdAt": "2025-10-16T12:00:00.000Z",
  "reportType": "queue",
  "summary": {
    "totalItems": 10,
    "completedItems": 9,
    "failedItems": 1,
    "totalOriginalSize": 10737418240,
    "totalCompressedSize": 5368709120,
    "spaceSaved": 5368709120,
    "compressionRatio": 0.5
  },
  "items": [
    {
      "fileName": "video1.mp4",
      "status": "completed",
      "preset": "Balanced",
      "originalSize": 1073741824,
      "compressedSize": 536870912,
      "savings": "50.0%",
      "qualityMetrics": {
        "psnr": 42.5,
        "ssim": 0.98
      }
    }
  ]
}
```

**How to Use:**
1. Complete a batch encoding job
2. Click "Export Report" button in the queue
3. Reports are view-only and cannot be imported (future feature)

## File Association

All Streamline file formats are automatically associated with the application on installation:

- **Windows**: NSIS installer registers file associations
- **macOS**: DMG installation includes file associations
- **Linux**: AppImage registers associations on first run

**Opening Files:**
- Double-click any .sl* file to open it in Streamline
- Drag and drop .sl* files onto the Streamline window
- Use "Import" or "Load" buttons within the application

## Backwards Compatibility

### JSON Presets
Streamline maintains full backwards compatibility with JSON preset files:
- Existing .json preset files can be imported directly
- They are automatically converted to the new format
- No data loss or manual conversion required

### Future Versions
All file formats include a version field to ensure compatibility with future releases:
- New versions will support older format versions
- Migration paths will be provided for major format changes
- Version numbers follow semantic versioning

## Technical Details

### Format Structure
All formats share a common structure:
```json
{
  "version": "1.0.0",
  "type": "sl[queue|preset|analysis|report]",
  "createdAt": "ISO 8601 timestamp",
  ...
}
```

### Validation
Files are validated on load:
- Type field must match expected format
- Version must be supported
- Required fields must be present
- File paths are validated for existence (where applicable)

### Security
- Files are plain text JSON (human-readable)
- No executable code is stored or executed
- File paths are sanitized before use
- User confirmation is required for file operations

## See Also

- [Batch Processing](Batch-Processing.md) - Using queues effectively
- [Preset System](Preset-System.md) - Creating custom presets
- [Quality Analysis](Quality-Analysis.md) - Understanding analysis data
- [User Guide](User-Guide.md) - Complete feature documentation

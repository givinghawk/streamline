# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2025-10-16

### Added
- Custom file extensions for Streamline data formats
  - `.slqueue` - Queue files storing batch processing data
  - `.slpreset` - Encoding preset files (backwards compatible with JSON)
  - `.slanalysis` - Video analysis data for sharing and reuse
  - `.slreport` - Encoding reports with statistics and metrics
- File association support for Windows, macOS, and Linux
- Queue save/load functionality with file validation
- Preset export/import with custom settings preservation
- Analysis export/import for sharing video analysis data
- Report generation and export for completed encoding batches
- Double-click file opening support for all custom extensions
- UI buttons for import/export in Queue, Preset, and Analysis panels

### Changed
- Version bumped to 0.5.0
- Enhanced queue items to preserve more state information
- Improved file format handlers with comprehensive metadata

## [Unreleased]

### Added
- Initial release
- Batch processing queue system
- Hardware acceleration detection (NVIDIA, AMD, Intel, Apple)
- Quality analysis (PSNR, SSIM, VMAF)
- Video comparison tool (side-by-side playback)
- Custom preset system
- Dark and light themes
- Thumbnail generation
- Desktop notifications
- Real-time encoding progress
- Output directory configuration
- Batch mode toggle

### Fixed
- Electron preload script module loading
- Button border-radius in light theme
- Dropdown styling in dark mode
- Window controls (minimize, maximize, close)
- Path and filesystem operations in sandboxed environment

### Changed
- Moved path/fs operations to main process via IPC
- Updated to async API for path operations
- Changed default batch mode to single-file mode

## [1.0.0] - 2025-10-15

### Added
- First stable release
- Complete encoding functionality
- Multi-platform support (Windows, macOS, Linux)

[Unreleased]: https://github.com/givinghawk/streamline/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/givinghawk/streamline/releases/tag/v0.5.0
[1.0.0]: https://github.com/givinghawk/streamline/releases/tag/v1.0.0

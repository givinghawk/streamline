# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[Unreleased]: https://github.com/yourusername/ffmpegfrontend/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/ffmpegfrontend/releases/tag/v1.0.0

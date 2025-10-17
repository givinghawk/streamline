# Roadmap

This roadmap outlines planned features and improvements for Streamline. The timeline and priorities may change based on community feedback and development capacity.

## Current Version: 0.5.0

See [CHANGELOG.md](../CHANGELOG.md) for details on current release.

## Recently Completed (v0.5.0)

**File Format Support** ✅
- [x] **Custom file extensions** - .slqueue, .slpreset, .slanalysis, .slreport
- [x] **Queue save/load** - Save and resume batch jobs
- [x] **Preset export/import** - Share custom presets
- [x] **Analysis export/import** - Share video analysis data
- [x] **Report generation** - Export encoding reports
- [x] **File associations** - Double-click to open in Streamline

## Short Term (Next 3-6 Months)

### v1.2.0 - Enhanced Quality and Analysis

**Quality Improvements**
- [ ] **Per-frame quality graphs** - Visualize quality metrics over time
- [ ] **Target VMAF mode** - Encode to achieve specific VMAF score
- [ ] **Quality presets** - Presets optimized for VMAF targets
- [ ] **A/B comparison enhancements** - Difference heat maps, pixel diff view
- [ ] **Frame-accurate comparison** - Navigate to specific frames easily

**Analysis Features**
- [x] **Bitrate analysis** - Graph bitrate distribution over time (v0.3.0)
- [x] **Scene detection** - Identify scene changes for better encoding (v0.3.0)
- [x] **Content analysis** - Detect complexity for optimal settings (v0.3.0)
- [x] **Grain detection** - Preserve film grain in encoding (v0.3.0)
- [x] **Analysis mode UI** - Dedicated analysis tab with sub-categories (v0.3.0)
- [ ] **Automatic quality validation** - Flag encodes below quality threshold

**UI/UX Improvements**
- [x] **Mode-based interface** - Separate Import/Encode/Analysis tabs (v0.3.0)
- [x] **Update notifications** - GitHub release checking with beta/stable channels (v0.3.0)
- [x] **Keyboard shortcuts** - Full keyboard navigation (v0.3.0)
- [x] **Preset search** - Search and filter presets (v0.3.0)
- [x] **Community presets** - Download presets from GitHub repositories (v0.3.0)
- [x] **Advanced presets** - Conditional logic for intelligent encoding (v0.3.0)
- [ ] **Recent files** - Quick access to recent encodes
- [ ] **Favorites** - Mark favorite presets
- [ ] **Undo/Redo** - Undo setting changes

### v1.3.0 - Advanced Encoding

**Encoding Features**
- [x] **HDR support** - HDR10, HDR10+, Dolby Vision (v0.3.0)
- [x] **10-bit encoding** - 10-bit color depth support (v0.3.0)
- [x] **Target file size** - Automatic bitrate calculation for target file size (v0.3.0)
- [ ] **Segment encoding** - Encode specific time ranges
- [ ] **Chapter support** - Preserve and add chapters
- [ ] **Subtitle support** - Embed, extract, and burn-in subtitles
- [ ] **Multi-audio tracks** - Preserve multiple audio streams

**Batch Enhancements**
- [ ] **Queue reordering** - Drag-and-drop queue management
- [x] **Queue profiles** - Save and load queue configurations (.slqueue files) (v0.5.0)
- [ ] **Conditional encoding** - Skip files that meet criteria
- [ ] **Auto-retry on failure** - Retry failed encodes with adjusted settings
- [ ] **Parallel encoding** - Multiple files simultaneously (with limits)

**Performance**
- [ ] **GPU-accelerated thumbnails** - Faster thumbnail generation
- [ ] **Incremental encoding** - Resume interrupted encodes
- [ ] **Smart caching** - Cache analysis results
- [ ] **Memory optimization** - Lower memory footprint

### v1.4.0 - Workflow and Automation

**Workflow Features**
- [ ] **Watch folders** - Auto-encode files in specified folders
- [ ] **File naming templates** - Customizable output naming
- [ ] **Metadata preservation** - Keep file metadata, tags
- [ ] **Preset chains** - Apply multiple presets sequentially
- [ ] **Conditional workflows** - IF/THEN rules for encoding

**Automation**
- [ ] **Command-line interface** - Headless operation
- [ ] **REST API** - Control Streamline via API
- [ ] **Webhook integration** - Notify external services
- [ ] **Schedule encoding** - Run encodes at specific times
- [ ] **Priority queues** - High/medium/low priority

**Integration**
- [ ] **Cloud storage** - Direct upload to cloud services
- [ ] **FTP/SFTP** - Upload to servers automatically
- [ ] **YouTube integration** - Direct upload to YouTube
- [ ] **Dropbox/Google Drive** - Sync with cloud storage
- [ ] **Plugin system** - Extend functionality with plugins

### v1.5.0 - Professional Features

**Professional Tools**
- [ ] **Color grading** - Basic color correction tools
- [ ] **Audio normalization** - Loudness normalization (LUFS)
- [ ] **Audio mixing** - Mix multiple audio tracks
- [ ] **Custom filters** - Video and audio filters
- [ ] **Watermarking** - Add text/image watermarks

**Quality Control**
- [ ] **QC reports** - Generate quality control reports
- [ ] **Conformance checking** - Verify output meets specs
- [ ] **Automated testing** - Test encodes against criteria
- [ ] **Diff reports** - Detailed difference analysis
- [ ] **Compliance presets** - Broadcast/platform specifications

**Organization**
- [ ] **Project management** - Organize files into projects
- [ ] **Tags and labels** - Categorize files
- [ ] **Search and filter** - Find files quickly
- [ ] **Export/import projects** - Share project configurations
- [ ] **Workspace profiles** - Different layouts for different tasks

### v2.0.0 - Next Generation

**AI and Machine Learning**
- [ ] **AI-powered encoding** - Optimal settings from content analysis
- [ ] **Smart presets** - Learn from your encoding patterns
- [ ] **Upscaling** - AI-powered video upscaling
- [ ] **Noise reduction** - ML-based denoising
- [ ] **Content-aware encoding** - Adjust settings per scene

**Advanced Features**
- [ ] **Recording** - Record internet streams
- [ ] **Distributed encoding** - Encode across multiple machines
- [ ] **Cluster support** - Farm rendering
- [ ] **Real-time preview** - See encoding output in real-time
- [ ] **VR/360° support** - Encode VR and 360° video

**Platform Expansion**
- [ ] **Web interface** - Browser-based control panel
- [ ] **Server edition** - Dedicated encoding server
- [ ] **Cloud edition** - Cloud-based encoding service
- [ ] **Docker container** - Containerized deployment

## Community Requested Features

Features requested by the community, under consideration:

### High Priority
- [x] **Preset import/export improvements** - Bulk operations
- [ ] **Custom FFmpeg builds** - Support custom FFmpeg versions
- [ ] **Network share support** - Encode from network locations
- [ ] **Batch preset application** - Apply preset to all files easily
- [ ] **Progress notifications** - More detailed progress updates

### Medium Priority
- [ ] **Theming engine** - Community themes
- [ ] **Language support** - Internationalization
- [ ] **Statistics dashboard** - Encoding statistics and history
- [ ] **Comparison mode improvements** - More comparison tools
- [x] **Export queue** - Save queue for later (.slqueue files) (v0.5.0)

### Under Consideration
- [ ] **Format conversion** - More format conversion options
- [ ] **Audio visualization** - Waveform display
- [ ] **Timeline editor** - Basic video editing
- [ ] **Effects library** - Common video effects

## Platform-Specific Features

### Windows
- [ ] **Windows 11 snap layouts** - Better window management
- [ ] **Taskbar integration** - Progress in taskbar
- [ ] **Start menu integration** - Jump lists

### macOS
- [ ] **Touch Bar support** - MacBook Pro Touch Bar
- [ ] **Quick Actions** - Finder integration
- [ ] **Continuity Camera** - Use iPhone as source

### Linux
- [ ] **Flatpak distribution** - Flatpak package
- [ ] **Snap distribution** - Snap package
- [ ] **AppImage improvements** - Better integration

## Stability and Reliability

### v1.x Series
- [ ] <1% encode failure rate
- [ ] Full error recovery
- [ ] Data integrity guarantees

### v2.x Series
- [ ] <0.1% encode failure rate
- [ ] Automatic failure recovery
- [ ] Distributed encoding resilience

## Documentation

### Ongoing
- [ ] **Video tutorials** - YouTube tutorial series
- [ ] **Interactive guides** - In-app tutorials
- [ ] **API documentation** - Full API reference
- [ ] **Advanced guides** - Professional workflows
- [ ] **Troubleshooting database** - Searchable solutions

## How to Influence the Roadmap

We value community input! Here's how you can help shape Streamline's future:

### Vote on Features
- Comment on existing feature requests
- Use 👍 reactions on issues you want
- Share your use cases

### Propose New Features
- Open feature request issue
- Describe problem and solution
- Explain use case and value
- Discuss with community

### Contribute
- Implement features yourself
- Submit pull requests
- Help with testing
- Improve documentation

### Support Development
- Sponsor the project (if available)
- Spread the word
- Help other users
- Report bugs

## Release Schedule

### Regular Releases
- **Minor versions** (1.x.0): As available
- **Patch versions** (1.0.x): As needed for bugs
- **Major versions** (x.0.0): As available

### Beta Testing
- Beta releases 2-4 weeks before stable
- Community testing encouraged
- Early access to new features

## Versioning

Streamline follows [Semantic Versioning](https://semver.org/):
- **Major** (x.0.0): Breaking changes
- **Minor** (1.x.0): New features, backward compatible
- **Patch** (1.0.x): Bug fixes, backward compatible

## Stay Updated

- ⭐ Star the [GitHub repository](https://github.com/givinghawk/streamline)
- 📢 Watch for releases
- 📝 Read release notes
- 💬 Join discussions

## Notes

- Roadmap is subject to change
- Features may be added, removed, or delayed
- Community feedback influences priorities
- Dates are estimates, not commitments
- Focus is on stability and user value

## Next Steps

- Check [Contributing Guide](Contributing.md) to help implement features
- Vote on features in [GitHub Issues](https://github.com/givinghawk/streamline/issues)
- Share feedback on planned features
- Suggest new ideas for consideration

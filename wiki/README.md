# Streamline Wiki

This directory contains comprehensive documentation for Streamline, a powerful desktop application for video and audio encoding.

## Wiki Structure

The wiki is organized into the following sections:

### Getting Started
- **[Home](Home.md)** - Wiki homepage with navigation
- **[Quickstart Guide](Quickstart-Guide.md)** - Get started in minutes
- **[Installation](Installation.md)** - Detailed installation instructions
- **[User Guide](User-Guide.md)** - Complete user guide for core features

### Advanced Topics
- **[Advanced Usage](Advanced-Usage.md)** - Advanced features and techniques for power users
- **[Keyboard Shortcuts](KeyboardShortcuts.md)** - Full keyboard shortcut reference

### Feature Documentation
- **[Batch Processing](Batch-Processing.md)** - Process multiple files efficiently
- **[Hardware Acceleration](Hardware-Acceleration.md)** - GPU-accelerated encoding
- **[Quality Analysis](Quality-Analysis.md)** - PSNR, SSIM, and VMAF metrics
- **[Video Comparison](Video-Comparison.md)** - Side-by-side quality comparison
- **[Preset System](Preset-System.md)** - Built-in presets explained
- **[Custom Presets](Custom-Presets.md)** - Creating and managing custom presets
- **[Preset Repositories](PresetRepositories.md)** - Download presets from GitHub repositories
- **[Advanced Presets](AdvancedPresets.md)** - Conditional logic for intelligent encoding
- **[HDR Encoding](HDREncoding.md)** - HDR10, HDR10+, Dolby Vision, and HLG support
- **[Target File Size](Target-File-Size.md)** - Automatically calculate bitrate for target file size
- **[Thumbnail Generation](Thumbnail-Generation.md)** - Video preview thumbnails
- **[Themes and Appearance](Themes-and-Appearance.md)** - Customizing the interface

### Support and Development
- **[Troubleshooting](Troubleshooting.md)** - Common issues and solutions
- **[Development Guide](Development-Guide.md)** - Setting up development environment
- **[Contributing](Contributing.md)** - How to contribute to Streamline
- **[Roadmap](Roadmap.md)** - Future plans and features

## Using This Wiki

### For GitHub Wiki

To use these pages as a GitHub Wiki:

1. Clone the wiki repository:
   ```bash
   git clone https://github.com/givinghawk/streamline.wiki.git
   ```

2. Copy all `.md` files from this `wiki/` directory to the wiki repository

3. Commit and push:
   ```bash
   git add .
   git commit -m "Add comprehensive documentation"
   git push
   ```

4. The wiki will be available at: https://github.com/givinghawk/streamline/wiki

### For Local Documentation

You can also view these files locally:

1. **In a markdown viewer** - Use any markdown viewer or editor
2. **In VS Code** - Open with markdown preview (Ctrl/Cmd + Shift + V)
3. **In a static site generator** - Use MkDocs, Jekyll, or similar tools
4. **In GitHub** - View directly in the repository

### Converting to Other Formats

The markdown files can be converted to other formats:

**PDF**:
```bash
pandoc Home.md -o Streamline-Wiki.pdf
```

**HTML**:
```bash
pandoc Home.md -s -o index.html
```

**DOCX**:
```bash
pandoc Home.md -o Streamline-Wiki.docx
```

## Wiki Features

- **Cross-referenced** - Pages link to related topics
- **Comprehensive** - Covers all features in depth
- **Examples** - Practical examples throughout
- **Troubleshooting** - Common issues and solutions
- **Best Practices** - Tips and recommendations
- **Progressive** - From beginner to advanced topics

## Maintaining the Wiki

### Updating Documentation

When updating wiki content:

1. Edit the relevant `.md` file in the `wiki/` directory
2. Commit changes with clear message
3. If using GitHub Wiki, sync changes there
4. Update the table of contents if adding new pages

### Adding New Pages

To add a new wiki page:

1. Create new `.md` file in `wiki/` directory
2. Add link to `Home.md` in appropriate section
3. Add cross-references from related pages
4. Follow existing style and structure
5. Commit and push changes

### Style Guidelines

- Use clear, concise language
- Include examples and code snippets
- Add screenshots for UI features
- Cross-reference related topics
- Keep consistent formatting
- Use headers for organization
- Include troubleshooting sections

## Feedback and Contributions

Help improve the documentation:

- **Report issues** - Note unclear or incorrect content
- **Suggest improvements** - Propose better explanations
- **Add examples** - Share useful examples
- **Fix typos** - Submit corrections
- **Translate** - Help translate to other languages

See [Contributing.md](Contributing.md) for contribution guidelines.

## License

This documentation is part of the Streamline project and is licensed under the MIT License.

## Questions?

- Check the [Troubleshooting](Troubleshooting.md) guide
- Search [existing issues](https://github.com/givinghawk/streamline/issues)
- Open a new issue for documentation feedback
- Visit the main [README](../README.md) for project overview

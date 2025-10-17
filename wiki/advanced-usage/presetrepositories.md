# Community Preset Repositories

Streamline supports downloading encoding presets from GitHub repositories, allowing you to access community-created presets and share your own.

## Overview

The preset repository system allows you to:
- Download presets from multiple GitHub repositories
- Keep presets updated with a single click
- Share your custom presets with the community
- Tag presets by their source repository

## Default Repository

**givinghawk/streamline-presets** - Official community preset repository

This repository contains high-quality, tested presets for common encoding scenarios.

## Using Preset Repositories

### Accessing the Repository Manager

1. Click the **Repositories** button in the Preset Selector panel
2. Or navigate to Settings → Presets → Manage Repositories

### Adding a Repository

1. Open the Preset Repository Manager
2. Enter the repository name in format: `owner/repo-name`
3. Click **Add**
4. The repository will be validated and added to your list

### Downloading Presets

1. Find the repository in the list
2. Click **Download** to fetch all presets
3. Click **Update** to refresh presets from a repository you've already downloaded

### Removing a Repository

1. Click the trash icon next to a repository
2. Confirm the removal
3. All presets from that repository will be removed

## Creating Your Own Preset Repository

### Repository Structure

Your repository must have the following structure:

```
your-repo/
├── README.md
└── presets/
    ├── preset-1.json
    ├── preset-2.json
    └── preset-3.json
```

### Preset JSON Format

Each preset file should follow this structure:

```json
{
  "id": "my-custom-preset",
  "name": "My Custom Preset",
  "description": "A detailed description of what this preset does",
  "category": "video",
  "encoder": "libx264",
  "audioEncoder": "aac",
  "container": "mp4",
  "ffmpegArgs": [
    "-c:v", "libx264",
    "-crf", "20",
    "-preset", "medium",
    "-c:a", "aac",
    "-b:a", "128k"
  ]
}
```

### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier (lowercase, hyphens) |
| `name` | string | Yes | Display name |
| `description` | string | Yes | User-friendly description |
| `category` | string | Yes | `video`, `audio`, or `image` |
| `encoder` | string | Yes | Video encoder (e.g., `libx264`, `libx265`, `libaom-av1`) |
| `audioEncoder` | string | No | Audio encoder (e.g., `aac`, `libopus`, `libmp3lame`) |
| `container` | string | Yes | Output format (e.g., `mp4`, `mkv`, `webm`) |
| `ffmpegArgs` | array | Yes | Complete FFmpeg arguments array |

### Publishing Your Repository

1. Create a GitHub repository
2. Add your preset JSON files to a `presets/` folder
3. Test locally by adding the repository to Streamline
4. Share your repository name with the community

### Best Practices

- **Test thoroughly** - Test each preset with various input files
- **Document well** - Provide clear descriptions and use cases
- **Use semantic versioning** - Tag releases for preset updates
- **Include examples** - Show before/after comparisons in your README
- **Specify requirements** - Note any special hardware or FFmpeg version requirements

## Preset Discovery

### Finding Community Presets

- Search GitHub for repositories tagged with `streamline-presets`
- Check the discussions in the main Streamline repository
- Browse the [Awesome Streamline Presets](https://github.com/search?q=streamline-presets) list

### Sharing Your Presets

- Tag your repository with `streamline-presets`
- Post about it in Streamline discussions
- Submit a PR to add your repo to the official preset list

## Security Considerations

**Important:** Presets contain FFmpeg command arguments that will be executed on your system.

- Only add repositories from trusted sources
- Review preset files before downloading (they're plain JSON on GitHub)
- Downloaded presets are stored locally in browser storage
- You can remove presets at any time

## Preset Source Tags

Downloaded presets display a source tag showing which repository they came from:

- **Blue tag** - Repository name (e.g., `streamline-presets`)
- **Hover** - Shows full repository path
- Built-in presets have no tag

## Troubleshooting

### "Repository not found"
- Check the repository name format (`owner/repo`)
- Ensure the repository is public
- Verify the repository exists on GitHub

### "No presets folder"
- The repository must have a `presets/` directory
- JSON files must be directly inside `presets/`
- Check for typos in the folder name

### Presets not appearing
- Click **Update** to refresh from the repository
- Check browser console for errors
- Ensure JSON files are valid format

### Rate limiting
- GitHub API has rate limits for unauthenticated requests
- If you hit the limit, wait an hour or add a GitHub token (future feature)

## Future Enhancements

Planned improvements to the preset repository system:

- [ ] GitHub authentication for higher API limits
- [ ] Preset ratings and comments
- [ ] Automatic update checks
- [ ] Import/export preset collections
- [ ] Preset categories and filtering by tags
- [ ] Fork and customize downloaded presets

## Support

For issues with the preset repository system:
- [Report bugs](https://github.com/givinghawk/streamline/issues)
- [Join discussions](https://github.com/givinghawk/streamline/discussions)
- [View example presets](https://github.com/givinghawk/streamline-presets)

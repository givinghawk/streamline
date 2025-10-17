# Advanced Presets (Conditional Logic)

Advanced presets use if/else conditional logic to automatically adapt encoding settings based on input file characteristics. This enables single presets to handle diverse content intelligently.

## Overview

Instead of choosing different presets for different content, advanced presets analyze your file and apply optimal settings automatically.

**Example:** A single "Smart HDR" preset that:
- Detects if input is HDR → Uses 10-bit HDR10 encoding
- Detects if input is SDR → Uses 8-bit SDR encoding
- All automatically, no manual preset switching needed

## How They Work

Advanced presets contain a `conditions` array with if/else branches:

```json
{
  "id": "my-smart-preset",
  "name": "Smart Preset",
  "conditions": [
    {
      "if": { "input": "isHDR" },
      "then": { "hdrMode": "hdr10", "bitDepth": 10 }
    },
    {
      "else": { "hdrMode": "sdr", "bitDepth": 8 }
    }
  ]
}
```

When you use this preset:
1. Streamline analyzes your input file
2. Evaluates the conditions
3. Applies the matching "then" settings
4. Merges with other preset settings

## Accessing Advanced Presets

1. **Download from Repository**
   - Click "Repositories" in Preset Selector
   - Look for repos with `advanced-presets/` folder
   - Download to access advanced presets

2. **In Preset List**
   - Advanced presets show a purple **"Advanced Preset"** badge
   - Click to see conditions and resulting settings
   - Settings display shows what will be applied based on your file

3. **Auto-detection**
   - When file is imported, conditions are evaluated
   - "Resulting Settings" section shows what will be applied
   - Updated in real-time as file info loads

## Condition Types

### Input Properties

Check input file characteristics:

```json
{
  "if": { "input": "isHDR" }              // Is file HDR10/HLG/DolbyVision?
}

{
  "if": { "input": "is4K" }               // Is resolution 4K or higher?
}

{
  "if": { "input": "is1080p" }            // Is resolution 1080p or higher?
}

{
  "if": { "input": "is720p" }             // Is resolution 720p or higher?
}

{
  "if": { "input": "is60fps" }            // Is frame rate 60fps or higher?
}

{
  "if": { "input": "is30fps" }            // Is frame rate 30fps or higher?
}

{
  "if": { "input": "isH264" }             // Is codec H.264?
}

{
  "if": { "input": "isH265" }             // Is codec H.265/HEVC?
}

{
  "if": { "input": "isVP9" }              // Is codec VP9?
}

{
  "if": { "input": "isShort" }            // Duration < 5 minutes?
}

{
  "if": { "input": "isMedium" }           // Duration 5-60 minutes?
}

{
  "if": { "input": "isLong" }             // Duration > 60 minutes?
}

{
  "if": { "input": "hdrFormat" }          // Get exact HDR format
}
```

### Property Comparisons

Compare any property:

```json
{
  "if": { 
    "prop": "crf",
    "value": { "greaterThan": 20 }
  }
}

{
  "if": {
    "prop": "bitrate",
    "value": { "lessThanOrEqual": 5000000 }
  }
}

{
  "if": {
    "prop": "encoder",
    "value": { "equals": "libx265" }
  }
}
```

### Logical Operators

Combine conditions:

```json
{
  "if": {
    "and": [
      { "input": "is4K" },
      { "input": "isHDR" }
    ]
  }
}

{
  "if": {
    "or": [
      { "input": "is60fps" },
      { "input": "is4K" }
    ]
  }
}

{
  "if": {
    "not": { "input": "isH264" }
  }
}
```

## Condition Syntax

### If/Then/Else

```json
{
  "if": { condition },
  "then": { settings }
}

{
  "else": { settings }
}
```

### Else-If

```json
{
  "elseif": {
    "condition": { condition },
    "then": { settings }
  }
}
```

## Creating Advanced Presets

### Basic Structure

```json
{
  "id": "unique-preset-id",
  "name": "Human Readable Name",
  "description": "What this preset does",
  "category": "video",
  "conditions": [
    {
      "if": { "input": "isHDR" },
      "then": {
        "encoder": "libx265",
        "hdrMode": "hdr10",
        "bitDepth": 10,
        "crf": 20
      }
    },
    {
      "else": {
        "encoder": "libx265",
        "hdrMode": "sdr",
        "bitDepth": 8,
        "crf": 23
      }
    }
  ]
}
```

### Real-World Example: Smart Resolution Encoder

```json
{
  "id": "adaptive-quality",
  "name": "Adaptive Quality Encoder",
  "description": "Balances quality by resolution: High quality for 4K, standard for 1080p, fast for lower",
  "category": "video",
  "conditions": [
    {
      "if": { "input": "is4K" },
      "then": {
        "encoder": "libx265",
        "preset": "slow",
        "crf": 18,
        "description": "4K content gets high quality"
      }
    },
    {
      "elseif": {
        "condition": { "input": "is1080p" },
        "then": {
          "encoder": "libx265",
          "preset": "medium",
          "crf": 23,
          "description": "1080p content balanced"
        }
      }
    },
    {
      "else": {
        "encoder": "libx264",
        "preset": "fast",
        "crf": 25,
        "description": "Lower res content fast encoding"
      }
    }
  ]
}
```

### Real-World Example: Duration-Based Compression

```json
{
  "id": "duration-optimized",
  "name": "Duration-Optimized Preset",
  "description": "Optimizes encoding time based on video length",
  "category": "video",
  "conditions": [
    {
      "if": {
        "and": [
          { "input": "isShort" },
          { "input": "isHDR" }
        ]
      },
      "then": {
        "encoder": "libx265",
        "preset": "slow",
        "crf": 18,
        "description": "Short HDR - max quality"
      }
    },
    {
      "elseif": {
        "condition": { "input": "isShort" },
        "then": {
          "encoder": "libx265",
          "preset": "slow",
          "crf": 20,
          "description": "Short video - prioritize quality"
        }
      }
    },
    {
      "elseif": {
        "condition": { "input": "isMedium" },
        "then": {
          "encoder": "libx265",
          "preset": "medium",
          "crf": 23,
          "description": "Medium video - balance"
        }
      }
    },
    {
      "else": {
        "encoder": "libx265",
        "preset": "fast",
        "crf": 27,
        "description": "Long video - faster encoding"
      }
    }
  ]
}
```

## Publishing Advanced Presets

### Repository Structure

Create a repository with this structure:

```
your-repo/
├── README.md
├── presets/                     # Regular presets
│   └── youtube-1080p.json
└── advanced-presets/            # Advanced presets
    ├── smart-hdr.json
    ├── adaptive-quality.json
    └── duration-optimized.json
```

### README Example

```markdown
# Advanced Streamline Presets

Smart presets with conditional logic for intelligent encoding.

## Presets Included

- **smart-hdr**: Auto-detects HDR and applies optimal settings
- **adaptive-quality**: Balances quality by resolution
- **duration-optimized**: Optimizes encoding time by video length

## Usage

In Streamline:
1. Settings → Repositories
2. Add: `your-username/your-repo`
3. Download presets
4. Use "Smart HDR" and other advanced presets

## Requirements

- Streamline v0.3.0+
- FFmpeg with HEVC support (for HDR presets)
```

## Advanced Features

### Multiple Conditions

Chain multiple if/elseif/else branches:

```json
"conditions": [
  { "if": condition1, "then": settings1 },
  { "elseif": { "condition": condition2, "then": settings2 } },
  { "elseif": { "condition": condition3, "then": settings3 } },
  { "else": settingsDefault }
]
```

**Note:** Only the first matching condition is applied.

### Combining Conditions

Use `and`, `or`, `not` for complex logic:

```json
{
  "if": {
    "and": [
      { "input": "is4K" },
      { "input": "isHDR" },
      { "not": { "input": "is60fps" } }
    ]
  },
  "then": { ... }
}
```

### Fallback Settings

Include base settings that apply to all results:

```json
{
  "id": "my-preset",
  "name": "My Preset",
  "encoder": "libx265",              // Always applied
  "audioCodec": "aac",               // Always applied
  "container": "mp4",                // Always applied
  "conditions": [
    // Conditions override these base settings
  ]
}
```

## UI Display

When you select an advanced preset, you'll see:

1. **Advanced Preset badge** - Purple badge indicating advanced logic
2. **Detected Input** - Shows detected file characteristics
3. **Conditions list** - Expandable list of all conditions
4. **Resulting Settings** - What will be applied to your file
5. **Apply button** - Apply the evaluated settings

## Validation

Streamline validates presets for:

- [ ] Missing required fields (id, name)
- [ ] Invalid condition structure
- [ ] Missing "then" in if branches
- [ ] Malformed conditions

Validation errors prevent preset use; warnings are informational.

## Troubleshooting

### "Resulting Settings" is empty
- File info may not be loaded yet
- Wait a moment for analysis to complete
- Check that file is valid video file

### Conditions not evaluating correctly
- Check condition syntax is valid
- Verify input properties match file characteristics
- Check the validation section for errors

### Advanced presets not showing
- Ensure repository has `advanced-presets/` folder
- Check that JSON files are valid
- Verify presets downloaded (click "Update")

## Examples to Try

### Example 1: Smart HDR (Included)
Download from default `givinghawk/streamline-presets` repository

### Example 2: Create Your Own
1. Create `my-smart-preset.json` with conditions
2. Place in `advanced-presets/` folder
3. Push to GitHub repository
4. Add repository in Streamline
5. Download presets

## Best Practices

1. **Start Simple** - Begin with basic if/else logic
2. **Test Thoroughly** - Test with various file types
3. **Clear Names** - Use descriptive preset names
4. **Document** - Add descriptions explaining logic
5. **Fallbacks** - Always include default `else` clause
6. **Combine Conditions** - Use `and`/`or` for complex scenarios
7. **User Feedback** - Show what was applied in presets

## Performance Notes

- Conditions are evaluated instantly (< 1ms)
- File analysis is cached
- Settings applied after file info loads
- No encoding performance impact

## Limitations

Current version supports:
- Input file property detection
- Property value comparisons
- Logical operators (and, or, not)
- Up to ~20 conditions per preset

Not yet supported:
- External API calls
- Machine learning predictions
- Dynamic CRF based on content
- Per-frame analysis

## Future Enhancements

Planned improvements:
- [ ] Content complexity scoring
- [ ] Per-frame analysis conditions
- [ ] Machine learning recommendations
- [ ] A/B testing framework
- [ ] Condition templates
- [ ] Preset inheritance/composition

## Resources

- [View Examples](https://github.com/givinghawk/streamline-presets)
- [Join Discussions](https://github.com/givinghawk/streamline/discussions)
- [Report Issues](https://github.com/givinghawk/streamline/issues)

## Support

For help with advanced presets:
- Check [existing examples](https://github.com/givinghawk/streamline-presets/tree/main/advanced-presets)
- Review [JSON syntax guide](https://www.json.org/)
- Ask in [GitHub Discussions](https://github.com/givinghawk/streamline/discussions)

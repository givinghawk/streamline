# Themes and Appearance

Streamline offers customizable themes to suit your preferences and working environment.

## Available Themes

### Dark Mode (Default)

**Description**: Dark theme optimized for low-light environments

**Color Scheme**:
- **Background**: Dark gray (#121212)
- **Panels**: Medium dark gray (#1e1e1e)
- **Text**: Light gray/white
- **Accents**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)

**Best For**:
- ✅ Low-light environments
- ✅ Long editing sessions
- ✅ Reducing eye strain
- ✅ OLED displays (power savings)
- ✅ Night work

### Light Mode

**Description**: Clean, bright theme for well-lit environments

**Color Scheme**:
- **Background**: White/light gray (#f5f5f5)
- **Panels**: White (#ffffff)
- **Text**: Dark gray/black
- **Accents**: Blue (#2563eb)
- **Success**: Green (#059669)
- **Error**: Red (#dc2626)

**Best For**:
- ✅ Bright environments
- ✅ Daytime use
- ✅ Outdoor/sunlit workspaces
- ✅ Personal preference for light themes

## Switching Themes

### Via Settings

1. Click the settings icon (gear) in top-right
2. Navigate to "Appearance" section
3. Select theme:
   - **Dark Mode**
   - **Light Mode**
4. Theme changes immediately
5. Preference saved automatically

### Keyboard Shortcut

Quick theme toggle:
- **Windows/Linux**: `Ctrl + Shift + T`
- **macOS**: `Cmd + Shift + T`

### Auto-Detection

Streamline can match your system theme:

1. Settings → Appearance
2. Enable "Follow System Theme"
3. Theme changes with OS theme
4. Overrides manual selection

## Theme Customization

### Accent Colors

Customize the accent color:

1. Settings → Appearance → Accent Color
2. Choose from preset colors:
   - Blue (default)
   - Purple
   - Green
   - Orange
   - Red
   - Pink
3. Or use custom color picker

### Font Size

Adjust interface font size:

**Options**:
- **Small** - Compact, more content visible
- **Medium** - Default, balanced
- **Large** - Easier reading, accessibility

**How to Change**:
1. Settings → Appearance → Font Size
2. Select size
3. Interface updates immediately

### Window Transparency

Adjust window opacity (if supported):

1. Settings → Appearance → Window Opacity
2. Adjust slider: 85% - 100%
3. Lower values = more transparent
4. Useful for overlay workflows

## Interface Elements

### Title Bar

**Dark Mode**: Dark gray background
**Light Mode**: Light gray background

Features:
- Application name
- Window controls (minimize, maximize, close)
- Matches theme

### Panels and Sections

**Dark Mode**: Subtle elevation with darker/lighter grays
**Light Mode**: White panels with subtle shadows

### Buttons and Controls

**Dark Mode**:
- Primary buttons: Blue with white text
- Secondary buttons: Gray with light text
- Hover: Lighter shade

**Light Mode**:
- Primary buttons: Blue with white text
- Secondary buttons: Light gray with dark text
- Hover: Darker shade

### Progress Indicators

**Both Themes**:
- Active progress: Animated blue
- Complete: Green
- Failed: Red
- Pending: Gray

### Form Controls

**Input Fields**:
- Dark Mode: Dark background, light text, blue focus
- Light Mode: White background, dark text, blue focus

**Dropdowns**:
- Dark Mode: Dark menu, light text
- Light Mode: White menu, dark text

**Sliders**:
- Both themes: Blue accent color

## Accessibility Features

### High Contrast Mode

For visual accessibility:

1. Settings → Appearance → High Contrast
2. Increases contrast between elements
3. Bolder borders and separators
4. More distinct colors

**Recommended For**:
- Visual impairments
- Low vision
- Bright sunlight viewing

### Focus Indicators

**Enhanced focus outlines**:
- Keyboard navigation shows clear focus
- Blue outline on focused elements
- Easier to track position

**Enable**:
- Settings → Appearance → Enhanced Focus
- Always on with keyboard navigation

### Screen Reader Support

Streamline supports screen readers:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS)
- Orca (Linux)

**Optimization**:
- All controls labeled
- Status updates announced
- Progress notifications

## Color Blindness Modes

### Deuteranopia (Green-Blind)

Adjusted colors:
- Success: Blue instead of green
- Warning: Orange instead of yellow
- Error: Red maintained

### Protanopia (Red-Blind)

Adjusted colors:
- Error: Dark red with distinct icon
- Success: Blue
- Status: Enhanced text labels

### Tritanopia (Blue-Blind)

Adjusted colors:
- Blue accents: Purple
- Status: Yellow/Orange
- Enhanced contrast

**Enable**:
- Settings → Appearance → Color Blind Mode
- Select type
- Interface adjusts automatically

## Theme Persistence

### Saving Preferences

Streamline automatically saves:
- Selected theme (dark/light)
- Accent color
- Font size
- Accessibility settings

### Across Devices

Theme preferences are stored locally:
- Per-device settings
- Not synced across devices
- Separate preferences per OS user

### Reset to Defaults

To restore default appearance:

1. Settings → Appearance
2. Click "Reset to Defaults"
3. All appearance settings reset
4. Returns to dark mode

## UI Layout

### Compact Mode

Reduce spacing for more content:

1. Settings → Appearance → Compact Mode
2. Reduced padding and margins
3. Smaller icons and buttons
4. More files visible in queue

**Best For**:
- Smaller screens
- Laptop displays
- Power users
- Maximum information density

### Comfortable Mode (Default)

Balanced spacing:
- Standard padding
- Easy to click targets
- Good readability

### Spacious Mode

Increased spacing:
- Larger click targets
- More whitespace
- Easier navigation

**Best For**:
- Touch screens
- Large displays
- Accessibility
- Casual use

## Advanced Theming

### Custom CSS (Advanced Users)

Load custom CSS for advanced theming:

1. Create `custom.css` file
2. Place in: `~/.streamline/themes/custom.css`
3. Settings → Appearance → Enable Custom CSS
4. Restart Streamline

**Example Custom CSS**:
```css
/* Custom accent color */
.accent {
  color: #8b5cf6;
}

/* Custom background */
body {
  background-color: #1a1a2e;
}

/* Custom button style */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

**Warning**: Custom CSS can break UI. Use at your own risk.

## Troubleshooting Appearance

### Theme Not Changing

**Problem**: Theme selection doesn't apply

**Solutions**:
1. Restart Streamline
2. Check "Follow System Theme" is disabled
3. Reset appearance settings
4. Clear application cache

### High Contrast Makes UI Unusable

**Problem**: Can't see elements in high contrast

**Solutions**:
1. Settings → Appearance → Disable High Contrast
2. Or reset to defaults
3. Adjust system contrast settings

### Custom CSS Breaks UI

**Problem**: Interface broken after custom CSS

**Solutions**:
1. Settings → Appearance → Disable Custom CSS
2. Or delete `custom.css` file
3. Restart Streamline
4. Review CSS syntax

### Font Too Large/Small

**Problem**: Font size not comfortable

**Solutions**:
1. Adjust font size in settings
2. Use browser zoom (Ctrl/Cmd +/-)
3. Adjust system display scaling

## Platform-Specific Appearance

### Windows

- Native window controls
- Windows 11 rounded corners
- Snap assist integration
- Taskbar integration

### macOS

- Native title bar
- macOS window controls (traffic lights)
- Translucent sidebar (if enabled)
- Touch Bar support (if available)

### Linux

- GTK theme integration
- KDE Plasma integration
- Native window decorations
- System tray icon

## Performance Considerations

### Theme Switching

- Instant theme switching
- No performance impact
- Settings persist across sessions

### Transparency

- Window transparency may impact performance on older systems
- Disable if experiencing lag
- No impact on encoding performance

### Custom CSS

- Complex CSS can slow UI rendering
- Keep custom styles minimal
- Test on sample before using extensively

## Tips for Best Experience

### Lighting Conditions

- **Bright daylight**: Light mode recommended
- **Evening/Night**: Dark mode recommended
- **Mixed conditions**: Auto-switch with system

### Monitor Types

- **OLED**: Dark mode saves power, reduces burn-in
- **LCD**: Either mode works well
- **E-Ink**: High contrast mode for clarity

### Use Case

- **Long sessions**: Dark mode reduces eye strain
- **Quick tasks**: Either mode
- **Presentations**: Light mode for screenshots/sharing

## Next Steps

- Customize appearance to your preference
- Configure [Batch Processing](Batch-Processing.md) workflow
- Set up [Custom Presets](Custom-Presets.md)
- Explore [Advanced Usage](Advanced-Usage.md) features

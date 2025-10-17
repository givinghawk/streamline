# Development Guide

Learn how to set up a development environment and contribute to Streamline.

## Prerequisites

### Required Software

* **Node.js** 18.x or higher
* **npm** 9.x or higher
* **Git** 2.x or higher
* **FFmpeg** (for testing encoding)
* **Code editor** (VS Code recommended)

### Operating System

Development is supported on:

* Windows 10/11
* macOS 10.13+
* Linux (Ubuntu 18.04+, Fedora, Arch)

## Setting Up Development Environment

### 1. Clone the Repository

```bash
git clone https://github.com/givinghawk/streamline.git
cd streamline
```

### 2. Install Dependencies

```bash
npm install
```

This installs:

* Electron
* React and React DOM
* Vite (build tool)
* Tailwind CSS
* Development dependencies

### 3. Verify FFmpeg Installation

```bash
ffmpeg -version
```

If not installed, refer to [Installation Guide](./).

### 4. Run Development Server

```bash
npm run electron:dev
```

This starts:

* Vite development server (port 5173)
* Electron application with hot reload
* Development tools enabled

### 5. Verify Setup

1. Application window should open
2. Try adding a test video file
3. Check that encoding works
4. Verify thumbnails generate

## Project Structure

```
streamline/
├── src/
│   ├── components/          # React components
│   │   ├── AdvancedSettings.jsx
│   │   ├── BatchQueue.jsx
│   │   ├── DropZone.jsx
│   │   ├── EncodingProgress.jsx
│   │   ├── FileInfo.jsx
│   │   ├── Header.jsx
│   │   ├── OutputSettings.jsx
│   │   ├── PresetCreator.jsx
│   │   ├── PresetImporter.jsx
│   │   ├── PresetSelector.jsx
│   │   ├── SettingsPanel.jsx
│   │   ├── SplashScreen.jsx
│   │   ├── ThumbnailGrid.jsx
│   │   ├── TitleBar.jsx
│   │   ├── UpdateNotification.jsx
│   │   ├── VideoComparison.jsx
│   │   └── icons/
│   │       └── Icons.jsx
│   ├── contexts/            # React contexts
│   │   └── [context files]
│   ├── constants/           # Constants and presets
│   │   └── presets.js
│   ├── utils/               # Utility functions
│   │   ├── fileTypeDetection.js
│   │   └── themeUtils.js
│   ├── electron/            # Electron main process
│   │   ├── ffmpeg.js
│   │   └── thumbnails.js
│   ├── App.jsx              # Main React component
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── main.js                  # Electron main process entry
├── preload.js              # Electron preload script
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
└── README.md               # Project readme
```

## Development Workflow

### Hot Reload

Changes to React components reload automatically:

1. Edit component in `src/components/`
2. Save file
3. UI updates instantly

### Main Process Changes

Changes to Electron main process require restart:

1. Edit `main.js` or files in `src/electron/`
2. Stop development server (Ctrl+C)
3. Run `npm run electron:dev` again

### Debugging

#### React DevTools

1. In development mode, right-click → "Inspect Element"
2. React DevTools available in Chrome DevTools
3. Inspect component tree and props

#### Electron DevTools

```bash
# Open DevTools automatically in development
# Already enabled in electron:dev
```

Or use keyboard shortcut:

* **Windows/Linux**: `Ctrl + Shift + I`
* **macOS**: `Cmd + Option + I`

#### Main Process Debugging

Add to `main.js`:

```javascript
console.log('Debug message');
```

View in terminal where you ran `npm run electron:dev`

### Adding New Features

#### 1. Create Component

```javascript
// src/components/NewFeature.jsx
import React from 'react';

export default function NewFeature({ prop1, prop2 }) {
  return (
    <div className="new-feature">
      <h2>New Feature</h2>
      {/* Component content */}
    </div>
  );
}
```

#### 2. Add Styles (Tailwind)

```javascript
<div className="bg-gray-800 text-white p-4 rounded-lg">
  {/* Styled content */}
</div>
```

#### 3. Integrate with App

```javascript
// src/App.jsx
import NewFeature from './components/NewFeature';

// In component render:
<NewFeature prop1="value" prop2={state} />
```

#### 4. Test Feature

1. Run development server
2. Test functionality
3. Check for console errors
4. Verify UI responsiveness

### Working with FFmpeg

#### Calling FFmpeg from Main Process

```javascript
// src/electron/ffmpeg.js
const { spawn } = require('child_process');

function runFFmpeg(args) {
  const ffmpeg = spawn('ffmpeg', args);
  
  ffmpeg.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  ffmpeg.stderr.on('data', (data) => {
    // FFmpeg outputs to stderr
    console.log(`stderr: ${data}`);
  });
  
  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg exited with code ${code}`);
  });
  
  return ffmpeg;
}
```

#### IPC Communication

Renderer to Main:

```javascript
// Renderer process
window.electron.startEncode(options);
```

```javascript
// preload.js
contextBridge.exposeInMainWorld('electron', {
  startEncode: (options) => ipcRenderer.invoke('start-encode', options)
});
```

```javascript
// main.js
ipcMain.handle('start-encode', async (event, options) => {
  // Start encoding
  return result;
});
```

## Building and Packaging

### Development Build

```bash
npm run build
```

Creates production build in `dist/` directory.

### Package Application

```bash
npm run package
```

Creates distributable package in `release/` directory:

* **Windows**: `.exe` installer
* **macOS**: `.dmg` disk image
* **Linux**: `.AppImage` file

### Platform-Specific Builds

```bash
# Build for specific platform
npm run package -- --win
npm run package -- --mac
npm run package -- --linux
```

### Build Configuration

Edit `package.json` → `build` section:

```json
{
  "build": {
    "appId": "com.streamline.app",
    "productName": "Streamline",
    "files": [
      "dist/**/*",
      "main.js",
      "preload.js",
      "src/electron/**/*"
    ],
    "directories": {
      "buildResources": "assets",
      "output": "release"
    }
  }
}
```

## Testing

### Manual Testing

1. **Smoke Test**:
   * Launch application
   * Add test file
   * Select preset
   * Start encode
   * Verify output
2. **Feature Testing**:
   * Test each feature systematically
   * Check edge cases
   * Verify error handling
3. **Platform Testing**:
   * Test on target platforms
   * Verify platform-specific features
   * Check installers work correctly

### Automated Testing

Currently, Streamline uses manual testing. Future plans include:

* Unit tests (Jest)
* Integration tests (Playwright)
* E2E tests

## Code Style

### JavaScript/React

* **ES6+** syntax
* **Functional components** with hooks
* **Arrow functions** for callbacks
* **Destructuring** props and state
* **Meaningful variable names**

### Formatting

```javascript
// Good
const handleClick = (event) => {
  setIsActive(!isActive);
};

// Avoid
function handleClick(event) {
  setIsActive(!isActive);
}
```

### Component Structure

```javascript
import React, { useState, useEffect } from 'react';

export default function MyComponent({ prop1, prop2 }) {
  // State
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Handlers
  const handleAction = () => {
    // Handler logic
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### CSS (Tailwind)

* Use Tailwind utility classes
* Custom CSS in `index.css` only when necessary
* Responsive design: mobile-first
* Dark mode support: `dark:` prefix

## Git Workflow

### Branching

```bash
# Create feature branch
git checkout -b feature/my-new-feature

# Create bugfix branch
git checkout -b fix/bug-description
```

### Commits

Use conventional commit messages:

```bash
git commit -m "feat: Add video comparison tool"
git commit -m "fix: Resolve encoding crash on Windows"
git commit -m "docs: Update installation guide"
git commit -m "refactor: Simplify preset selection logic"
```

### Pull Requests

1. Create feature branch
2. Make changes and commit
3.  Push to fork:

    ```bash
    git push origin feature/my-new-feature
    ```
4. Open pull request on GitHub
5. Describe changes
6. Wait for review

## Common Development Tasks

### Adding a New Preset

```javascript
// src/constants/presets.js
export const PRESETS = [
  // ... existing presets
  {
    id: 'my-new-preset',
    name: 'My New Preset',
    description: 'Description of preset',
    category: 'video',
    settings: {
      videoCodec: 'libx264',
      crf: 23,
      // ... other settings
    }
  }
];
```

### Adding New Codec Support

1.  Add codec to constants:

    ```javascript
    // src/constants/presets.js
    export const VIDEO_CODECS = [
      // ... existing
      { value: 'new_codec', label: 'New Codec', hwAccel: false }
    ];
    ```
2.  Update FFmpeg command builder:

    ```javascript
    // src/electron/ffmpeg.js
    if (codec === 'new_codec') {
      args.push('-c:v', 'new_codec');
      // Codec-specific parameters
    }
    ```

### Adding UI Component

1. Create component file
2. Import Tailwind classes
3. Add to parent component
4. Test responsiveness
5. Add dark mode support

## Troubleshooting Development

### Port Already in Use

```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID [PID] /F

# macOS/Linux
lsof -ti:5173 | xargs kill -9
```

### Dependencies Not Installing

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Electron Not Starting

```bash
# Check for errors
npm run electron:dev

# Clear Electron cache
rm -rf ~/.electron
npm install
```

### Build Fails

1. Check Node.js version: `node --version` (should be 18+)
2. Clear build cache: `rm -rf dist release`
3. Reinstall dependencies: `npm install`
4. Try build again: `npm run package`

## Resources

### Documentation

* [Electron Documentation](https://www.electronjs.org/docs)
* [React Documentation](https://react.dev/)
* [Vite Documentation](https://vitejs.dev/)
* [Tailwind CSS](https://tailwindcss.com/docs)
* [FFmpeg Documentation](https://ffmpeg.org/documentation.html)

### Tools

* [VS Code](https://code.visualstudio.com/)
* [React DevTools](https://react.dev/learn/react-developer-tools)
* [Electron Devtools](https://www.electronjs.org/docs/latest/tutorial/devtools-extension)

## Next Steps

* Read [Contributing Guide](Contributing.md) for contribution guidelines
* Check [Roadmap](Roadmap.md) for planned features
* Join development discussions on GitHub
* Start with "good first issue" labeled issues

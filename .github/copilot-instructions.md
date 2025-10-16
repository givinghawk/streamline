# Copilot Instructions for Streamline

This file provides context and guidelines for GitHub Copilot when working on the Streamline project.

## Project Overview

Streamline is a desktop application for video and audio encoding with hardware acceleration support. It's built using:
- **Electron** - Desktop application framework
- **React** - UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling framework
- **FFmpeg** - Core encoding engine (external dependency)

## Technology Stack

### Frontend
- React 18 with functional components and hooks
- Tailwind CSS for styling
- ES6+ JavaScript (no TypeScript)

### Backend
- Node.js (Electron main process)
- FFmpeg integration via child processes
- IPC communication between renderer and main processes

### Build & Development
- Vite for bundling and dev server
- Electron Builder for packaging
- No automated testing framework currently

## Code Style & Conventions

### JavaScript/React
- Use ES6+ features (arrow functions, destructuring, async/await)
- Prefer functional components with hooks over class components
- Use meaningful variable and function names
- Add comments only for complex logic
- Follow existing code formatting patterns

### File Organization
```
src/
├── components/       # React UI components
├── contexts/        # React context providers  
├── constants/       # Preset definitions and constants
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
└── electron/        # Electron main process modules
```

### Commit Messages
Follow conventional commit format:
```
type(scope): description

Examples:
- feat(encoder): add VP9 encoding support
- fix(ui): resolve dropdown color in dark mode
- docs(readme): update installation instructions
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Development Workflow

### Running Locally
```bash
npm install          # Install dependencies
npm run electron:dev # Start dev server with Electron
```

### Building
```bash
npm run build        # Build frontend with Vite
npm run package      # Package Electron app
```

### Key Commands
- `npm run dev` - Start Vite dev server only
- `npm run build` - Production build
- `npm run electron:dev` - Start Electron with hot reload
- `npm run package` - Create distributable package

## Important Context

### FFmpeg Integration
- FFmpeg must be installed on the user's system
- All encoding operations use child processes
- FFmpeg commands are built dynamically based on user settings
- Hardware acceleration is auto-detected and enabled when available

### Electron IPC
- Main process handles file system operations and FFmpeg execution
- Renderer process contains the React UI
- Communication via IPC (see `preload.js` and `main.js`)

### Presets System
- Presets are defined in `src/constants/`
- Each preset contains codec, bitrate, and quality settings
- Hardware acceleration presets are separate from software presets

### State Management
- React Context API for global state (no Redux)
- Local state with hooks for component-specific state
- Settings persisted to file system via Electron

## Common Patterns

### Adding a New Component
1. Create in `src/components/`
2. Use functional component with hooks
3. Import and use Tailwind classes for styling
4. Export as default

### Adding FFmpeg Features
1. Update `src/electron/ffmpeg.js` for new FFmpeg operations
2. Add IPC handlers in `main.js`
3. Expose via preload script in `preload.js`
4. Use in React components via context or hooks

### Adding Presets
1. Define in `src/constants/presets.js` or related files
2. Follow existing preset structure
3. Include both hardware and software variants if applicable

## Things to Avoid

- Don't add TypeScript (project uses vanilla JavaScript)
- Don't add automated tests unless specifically requested (not currently set up)
- Don't modify core FFmpeg command structure without understanding implications
- Don't break IPC communication between main and renderer processes
- Don't remove existing comments that explain complex FFmpeg operations

## Dependencies

### Core Dependencies
- `react` and `react-dom` - UI framework
- `electron` - Desktop framework

### Dev Dependencies
- `vite` - Build tool
- `@vitejs/plugin-react` - React integration
- `tailwindcss` - CSS framework
- `electron-builder` - Packaging tool

### External Requirements
- FFmpeg must be installed and in system PATH
- Node.js 18+ required for development

## Documentation

- Main docs in `/wiki` directory (markdown files)
- User-facing changes should update `README.md`
- Complex features should have wiki documentation
- JSDoc comments for utility functions appreciated

## Platform Support

- Windows (NSIS installer)
- macOS (DMG)
- Linux (AppImage)

Hardware acceleration varies by platform:
- NVIDIA (NVENC) - All platforms
- AMD (AMF) - Windows
- Intel (QSV) - Windows, Linux
- Apple VideoToolbox - macOS

## Helpful Tips

1. **FFmpeg Commands**: Check existing commands in `src/electron/ffmpeg.js` before creating new ones
2. **Styling**: Use Tailwind utility classes; custom CSS should be minimal
3. **Dark Mode**: App supports dark/light themes via context
4. **File Handling**: Always use absolute paths for file operations
5. **Error Handling**: Provide user-friendly error messages for FFmpeg failures

## Questions or Issues?

- Check existing code patterns first
- Reference the wiki documentation in `/wiki`
- Follow the CONTRIBUTING.md guidelines
- See the Development Guide at `wiki/Development-Guide.md`

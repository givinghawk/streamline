# Installation

This guide provides detailed installation instructions for all supported platforms.

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10+, macOS 10.13+, or Linux (Ubuntu 18.04+)
- **RAM**: 4 GB (8 GB recommended for 4K video)
- **Storage**: 100 MB for application + space for encoded files
- **FFmpeg**: Required (see installation instructions below)

### Recommended for Hardware Acceleration
- **NVIDIA GPU**: GTX 900 series or newer with latest drivers
- **AMD GPU**: RX 400 series or newer with latest drivers
- **Intel GPU**: 6th generation (Skylake) or newer with Quick Sync
- **Apple Silicon**: M1, M2, M3, or newer

## Installing FFmpeg

Streamline requires FFmpeg to be installed and available in your system PATH.

### Windows

**Option 1: Using Chocolatey (Recommended)**
```bash
choco install ffmpeg
```

**Option 2: Manual Installation**
1. Download FFmpeg from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/)
2. Choose "ffmpeg-release-essentials.zip"
3. Extract the archive to `C:\ffmpeg`
4. Add `C:\ffmpeg\bin` to your system PATH:
   - Open System Properties → Advanced → Environment Variables
   - Under System Variables, select "Path" and click Edit
   - Click New and add `C:\ffmpeg\bin`
   - Click OK on all dialogs
5. Restart your terminal/command prompt

**Verify Installation:**
```bash
ffmpeg -version
```

### macOS

**Using Homebrew (Recommended)**
```bash
brew install ffmpeg
```

**Using MacPorts**
```bash
sudo port install ffmpeg
```

**Verify Installation:**
```bash
ffmpeg -version
```

### Linux

**Ubuntu/Debian**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Fedora**
```bash
sudo dnf install ffmpeg
```

**Arch Linux**
```bash
sudo pacman -S ffmpeg
```

**Verify Installation:**
```bash
ffmpeg -version
```

## Installing Streamline

### Option 1: Pre-built Binaries (Recommended)

1. **Download**
   - Visit the [Releases page](https://github.com/givinghawk/streamline/releases)
   - Download the latest version for your platform

2. **Install**

   **Windows**
   - Run the `.exe` installer
   - Follow the installation wizard
   - Launch from Start Menu or Desktop shortcut

   **macOS**
   - Open the `.dmg` file
   - Drag Streamline to Applications folder
   - Right-click and select "Open" on first launch (to bypass Gatekeeper)
   - Launch from Applications or Spotlight

   **Linux**
   - Make the `.AppImage` executable:
     ```bash
     chmod +x Streamline-*.AppImage
     ```
   - Run the AppImage:
     ```bash
     ./Streamline-*.AppImage
     ```
   - Optional: Install to system using AppImageLauncher

### Option 2: Build from Source

**Prerequisites**
- Node.js 18+ and npm
- Git
- FFmpeg (installed as described above)

**Steps**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/givinghawk/streamline.git
   cd streamline
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run in Development Mode**
   ```bash
   npm run electron:dev
   ```

4. **Build for Production** (Optional)
   ```bash
   npm run build
   npm run package
   ```
   
   Builds will be available in the `release/` directory.

## Post-Installation Setup

### First Launch

1. **Launch Streamline**
   - The application will perform initial setup
   - FFmpeg detection will run automatically

2. **Configure Settings** (Optional)
   - Click the settings icon (gear) in the top-right
   - Adjust preferences:
     - Enable/disable hardware acceleration
     - Toggle quality analysis
     - Set notification preferences
     - Choose theme (dark/light)

3. **Test Encoding**
   - Drop a small test file
   - Select the "Balanced" preset
   - Click "Start Encode"
   - Verify the output file is created successfully

### Troubleshooting Installation

**FFmpeg Not Found**
- Error: "FFmpeg is not installed or not in PATH"
- Solution: Verify FFmpeg is installed and accessible from command line
  ```bash
  ffmpeg -version
  ```
- Restart Streamline after installing FFmpeg

**Permission Issues (macOS)**
- Error: "Streamline cannot be opened because it is from an unidentified developer"
- Solution: Right-click Streamline → Open → Click "Open" in the dialog

**Permission Issues (Linux)**
- Error: AppImage won't execute
- Solution: Make it executable
  ```bash
  chmod +x Streamline-*.AppImage
  ```

**Missing Dependencies (Linux)**
- Error: "error while loading shared libraries"
- Solution: Install required libraries
  ```bash
  sudo apt install libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1
  ```

## Updating Streamline

### Auto-Update (Pre-built Binaries)
- Streamline checks for updates automatically
- Notification appears when an update is available
- Click to download and install

### Manual Update
1. Download the latest version from [Releases](https://github.com/givinghawk/streamline/releases)
2. Install over the existing version
3. Your settings and custom presets are preserved

### Building from Source
```bash
cd streamline
git pull origin main
npm install
npm run build
npm run package
```

## Uninstallation

### Windows
- Use "Add or Remove Programs" in Windows Settings
- Or run the uninstaller from the installation directory

### macOS
- Drag Streamline from Applications to Trash
- Remove settings (optional):
  ```bash
  rm -rf ~/Library/Application\ Support/streamline
  ```

### Linux
- Delete the AppImage file
- Remove settings (optional):
  ```bash
  rm -rf ~/.config/streamline
  ```

## Next Steps

- Follow the [Quickstart Guide](Quickstart-Guide.md) to encode your first file
- Read the [User Guide](User-Guide.md) for comprehensive feature documentation
- Configure [Hardware Acceleration](Hardware-Acceleration.md) for optimal performance

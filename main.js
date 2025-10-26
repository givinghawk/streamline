const { app, BrowserWindow, ipcMain, dialog, Notification, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const https = require('https');
const { exec, spawn } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

let mainWindow;
let appSettings = {};

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Settings file path
const settingsPath = path.join(app.getPath('userData'), 'settings.json');

// Load settings from file
function loadSettings() {
  try {
    if (fsSync.existsSync(settingsPath)) {
      const data = fsSync.readFileSync(settingsPath, 'utf8');
      appSettings = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
    appSettings = {};
  }
}

// Save settings to file
async function saveSettings() {
  try {
    await fs.writeFile(settingsPath, JSON.stringify(appSettings, null, 2));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

function createWindow() {
  console.log('Creating Electron window...');
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#121212',
    title: 'Streamline',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: false, // Remove the default frame
    titleBarStyle: 'hidden',
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  console.log('Electron app ready, loading settings...');
  loadSettings();
  console.log('Creating main window...');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle file opening on Windows/Linux (when file is double-clicked)
app.on('open-file', (event, filePath) => {
  event.preventDefault();
  if (mainWindow) {
    mainWindow.webContents.send('file-opened', filePath);
  }
});

// Handle command line arguments (Windows)
const fileArg = process.argv.find(arg => 
  arg.endsWith('.slqueue') || 
  arg.endsWith('.slpreset') || 
  arg.endsWith('.slanalysis') || 
  arg.endsWith('.slreport')
);

if (fileArg && !isDev) {
  app.whenReady().then(() => {
    setTimeout(() => {
      if (mainWindow) {
        mainWindow.webContents.send('file-opened', fileArg);
      }
    }, 1000);
  });
}


// IPC Handlers
let ffmpegHandler, thumbnailHandler, analysisHandler, fileFormatsHandler, sharpHandler;
try {
  sharpHandler = require('./src/electron/sharp');
  console.log('✓ Sharp handler loaded successfully');
} catch (error) {
  console.error('✗ Failed to load Sharp handler:', error);
  sharpHandler = null;
}

try {
  ffmpegHandler = require('./src/electron/ffmpeg');
  console.log('✓ FFmpeg handler loaded successfully');
} catch (error) {
  console.error('✗ Failed to load FFmpeg handler:', error);
  ffmpegHandler = null;
}

try {
  thumbnailHandler = require('./src/electron/thumbnails');
  console.log('✓ Thumbnail handler loaded successfully');
} catch (error) {
  console.error('✗ Failed to load thumbnail handler:', error);
  thumbnailHandler = null;
}

try {
  analysisHandler = require('./src/electron/analysis');
  console.log('✓ Analysis handler loaded successfully');
} catch (error) {
  console.error('✗ Failed to load analysis handler:', error);
  analysisHandler = null;
}

try {
  fileFormatsHandler = require('./src/electron/fileFormats');
  console.log('✓ File formats handler loaded successfully');
} catch (error) {
  console.error('✗ Failed to load file formats handler:', error);
  fileFormatsHandler = null;
}

ipcMain.handle('get-file-info', async (event, filePath) => {
  console.log('get-file-info called with path:', filePath); // Debug log
  if (!ffmpegHandler) {
    throw new Error('FFmpeg handler not loaded');
  }
  return await ffmpegHandler.getFileInfo(filePath);
});

ipcMain.handle('check-ffmpeg-presence', async () => {
  if (!ffmpegHandler) {
    console.error('FFmpeg handler not loaded, returning false');
    return {
      ffmpeg: false,
      ffprobe: false,
      ffmpegVersion: null,
      ffprobeVersion: null,
    };
  }
  return await ffmpegHandler.checkFFmpegPresence();
});

ipcMain.handle('check-hardware-support', async () => {
  if (!ffmpegHandler) {
    console.error('FFmpeg handler not loaded, returning empty hardware support');
    return {
      nvidia: { h264: false, hevc: false },
      amd: { h264: false, hevc: false },
      intel: { h264: false, hevc: false },
      apple: { h264: false, hevc: false },
    };
  }
  return await ffmpegHandler.checkHardwareSupport();
});

ipcMain.handle('encode-file', async (event, options) => {
  console.log('encode-file called with options:', options); // Debug log
  if (!ffmpegHandler) {
    const error = new Error('FFmpeg handler not loaded');
    error.type = 'system';
    error.suggestion = 'Try restarting the application or reinstalling FFmpeg.';
    throw error;
  }
  // Detect if input is a single image and output is webp
  const inputExt = path.extname(options.inputPath).toLowerCase();
  const outputExt = path.extname(options.outputPath).toLowerCase();
  const isImage = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff'].includes(inputExt);
  const isWebpOrImage = ['.webp', '.png', '.jpg', '.jpeg'].includes(outputExt);

  try {
    if (isImage && isWebpOrImage && sharpHandler) {
      // Use sharp for single image conversion
      return await sharpHandler.convertImage(options.inputPath, options.outputPath, {
        quality: options.preset?.settings?.quality || 80
      });
    } else {
      // Use ffmpeg for video/animated images
      const result = await ffmpegHandler.encodeFile(options, (progress) => {
        mainWindow.webContents.send('encoding-progress', progress);
        // Update taskbar progress
        if (mainWindow && progress.percent !== undefined) {
          const progressValue = progress.percent / 100;
          mainWindow.setProgressBar(progressValue);
        }
      });
      // Reset taskbar progress on completion
      if (mainWindow) {
        mainWindow.setProgressBar(-1);
      }
      return result;
    }
  } catch (error) {
    // Reset taskbar progress on error
    if (mainWindow) {
      mainWindow.setProgressBar(-1);
    }
    // Enhance error with additional context for better reporting
    const enhancedError = new Error(error.message);
    enhancedError.type = (isImage && isWebpOrImage) ? 'sharp' : 'ffmpeg';
    enhancedError.originalError = error;
    enhancedError.ffmpegOutput = error.message;
    enhancedError.ffmpegCommand = error.command || 'Unknown command';
    enhancedError.file = {
      name: path.basename(options.inputPath || ''),
      path: options.inputPath || '',
      outputPath: options.outputPath || ''
    };
    enhancedError.settings = {
      preset: options.preset,
      customSettings: options.customSettings,
      hardwareAccel: options.hardwareAccel
    };
    throw enhancedError;
  }
});

// Thumbnail generation
ipcMain.handle('generate-thumbnail-grid', async (event, filePath, options) => {
  if (!thumbnailHandler) {
    throw new Error('Thumbnail handler not loaded');
  }
  try {
    const thumbnailPath = await thumbnailHandler.generateThumbnailGrid(filePath, options);
    return { success: true, thumbnailPath };
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-image-data-url', async (event, imagePath) => {
  try {
    const data = await fs.readFile(imagePath);
    const base64 = data.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error reading image:', error);
    throw error;
  }
});

ipcMain.handle('cleanup-thumbnail', async (event, thumbnailPath) => {
  try {
    await thumbnailHandler.cleanupThumbnails(thumbnailPath);
    return true;
  } catch (error) {
    console.error('Error cleaning up thumbnail:', error);
    return false;
  }
});

ipcMain.handle('select-output-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('check-file-exists', async (event, filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
});

// Settings IPC handlers
ipcMain.handle('get-setting', async (event, key) => {
  return appSettings[key] || null;
});

ipcMain.handle('set-setting', async (event, key, value) => {
  appSettings[key] = value;
  await saveSettings();
  return true;
});

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  return result.canceled ? null : result.filePaths[0];
});

// Window control handlers
ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// Platform detection handler
ipcMain.handle('get-platform', () => {
  return process.platform;
});

// FFmpeg installer handler
ipcMain.handle('install-ffmpeg', async () => {
  const platform = process.platform;
  
  try {
    let command = '';
    let installMethod = '';
    
    if (platform === 'win32') {
      // Windows: Try winget first, then chocolatey
      try {
        // Check if winget is available
        await execAsync('winget --version');
        command = 'winget install -e --id Gyan.FFmpeg --accept-package-agreements --accept-source-agreements';
        installMethod = 'winget';
      } catch (wingetError) {
        // Try chocolatey as fallback
        try {
          await execAsync('choco --version');
          command = 'choco install ffmpeg -y';
          installMethod = 'chocolatey';
        } catch (chocoError) {
          return {
            success: false,
            error: 'Neither winget nor chocolatey found. Please install FFmpeg manually or install winget/chocolatey first.'
          };
        }
      }
    } else if (platform === 'darwin') {
      // macOS: Use Homebrew
      try {
        await execAsync('brew --version');
        command = 'brew install ffmpeg';
        installMethod = 'homebrew';
      } catch (brewError) {
        return {
          success: false,
          error: 'Homebrew not found. Please install Homebrew first: https://brew.sh'
        };
      }
    } else if (platform === 'linux') {
      // Linux: Try apt, dnf, then pacman
      try {
        await execAsync('which apt-get');
        command = 'pkexec apt-get install -y ffmpeg';
        installMethod = 'apt';
      } catch (aptError) {
        try {
          await execAsync('which dnf');
          command = 'pkexec dnf install -y ffmpeg';
          installMethod = 'dnf';
        } catch (dnfError) {
          try {
            await execAsync('which pacman');
            command = 'pkexec pacman -S --noconfirm ffmpeg';
            installMethod = 'pacman';
          } catch (pacmanError) {
            return {
              success: false,
              error: 'No supported package manager found (apt, dnf, or pacman).'
            };
          }
        }
      }
    } else {
      return {
        success: false,
        error: `Unsupported platform: ${platform}`
      };
    }
    
    console.log(`Installing FFmpeg using ${installMethod}: ${command}`);
    
    // Execute the installation command
    // For Linux, we need to use pkexec which will prompt for password
    // For Windows/macOS, the commands may require elevation
    const { stdout, stderr } = await execAsync(command, {
      timeout: 300000, // 5 minutes timeout
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    
    console.log('Installation output:', stdout);
    if (stderr) {
      console.log('Installation stderr:', stderr);
    }
    
    // Verify installation
    try {
      await execAsync('ffmpeg -version');
      return {
        success: true,
        method: installMethod,
        message: 'FFmpeg installed successfully!'
      };
    } catch (verifyError) {
      return {
        success: false,
        error: 'Installation completed but FFmpeg is not in PATH. You may need to restart your system.'
      };
    }
    
  } catch (error) {
    console.error('FFmpeg installation error:', error);
    return {
      success: false,
      error: error.message || 'Installation failed. Please try manual installation.'
    };
  }
});

// File stats handler for getting file sizes
ipcMain.handle('get-file-stats', async (event, filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return { size: stats.size };
  } catch (error) {
    throw new Error(`Failed to get file stats: ${error.message}`);
  }
});

// Quality analysis handler
ipcMain.handle('analyze-quality', async (event, { originalPath, encodedPath }) => {
  if (!ffmpegHandler) {
    throw new Error('FFmpeg handler not loaded');
  }
  return await ffmpegHandler.analyzeQuality(originalPath, encodedPath);
});

// Notification handler
ipcMain.handle('show-notification', async (event, { title, body }) => {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title,
      body,
    });
    notification.show();
    return true;
  }
  return false;
});

// Path utility handlers
ipcMain.handle('path-dirname', (event, p) => {
  return path.dirname(p);
});

ipcMain.handle('path-extname', (event, p) => {
  return path.extname(p);
});

ipcMain.handle('path-basename', (event, p, ext) => {
  return path.basename(p, ext);
});

ipcMain.handle('path-join', (event, paths) => {
  return path.join(...paths);
});

// File system utility handlers
ipcMain.handle('fs-exists-sync', (event, p) => {
  return fsSync.existsSync(p);
});

ipcMain.handle('fs-mkdir-sync', (event, p, options) => {
  try {
    fsSync.mkdirSync(p, options);
    return true;
  } catch (error) {
    console.error('Error creating directory:', error);
    return false;
  }
});

// Analysis handlers
ipcMain.handle('analyze-bitrate', async (event, filePath) => {
  if (!analysisHandler) {
    throw new Error('Analysis handler not loaded');
  }
  return await analysisHandler.analyzeBitrate(filePath);
});

ipcMain.handle('detect-scenes', async (event, filePath, threshold) => {
  if (!analysisHandler) {
    throw new Error('Analysis handler not loaded');
  }
  return await analysisHandler.detectScenes(filePath, threshold);
});

ipcMain.handle('analyze-content', async (event, filePath) => {
  if (!analysisHandler) {
    throw new Error('Analysis handler not loaded');
  }
  return await analysisHandler.analyzeContent(filePath);
});

ipcMain.handle('analyze-quality-metrics', async (event, originalPath, encodedPath, metric) => {
  if (!analysisHandler) {
    throw new Error('Analysis handler not loaded');
  }
  return await analysisHandler.analyzeQualityMetrics(originalPath, encodedPath, metric);
});

// Update checker
ipcMain.handle('check-for-updates', async (event, channel = 'stable') => {
  try {
    const currentVersion = app.getVersion();
    const owner = 'givinghawk';
    const repo = 'streamline';
    
    // Determine which API endpoint to use based on channel
    const apiUrl = channel === 'beta' 
      ? `https://api.github.com/repos/${owner}/${repo}/releases`
      : `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

    const data = await new Promise((resolve, reject) => {
      https.get(apiUrl, {
        headers: {
          'User-Agent': 'Streamline-App',
          'Accept': 'application/vnd.github.v3+json'
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });

    let latestRelease;
    if (channel === 'beta') {
      // For beta, get the first prerelease or latest release
      latestRelease = Array.isArray(data) ? data[0] : null;
    } else {
      // For stable, get the latest non-prerelease
      latestRelease = data;
    }

    if (!latestRelease || !latestRelease.tag_name) {
      return { available: false };
    }

    const latestVersion = latestRelease.tag_name.replace(/^v/, '');
    const isNewer = compareVersions(latestVersion, currentVersion) > 0;

    return {
      available: isNewer,
      version: latestRelease.tag_name,
      currentVersion: `v${currentVersion}`,
      url: latestRelease.html_url,
      body: latestRelease.body,
      isPrerelease: latestRelease.prerelease,
      publishedAt: latestRelease.published_at,
    };
  } catch (error) {
    console.error('Error checking for updates:', error);
    return { available: false, error: error.message };
  }
});

// Helper function to compare version strings
function compareVersions(v1, v2) {
  // Remove 'v' prefix and 'beta-' prefix if present
  v1 = v1.replace(/^v/, '').replace(/^beta-/, '');
  v2 = v2.replace(/^v/, '').replace(/^beta-/, '');
  
  const parts1 = v1.split('.').map(n => parseInt(n) || 0);
  const parts2 = v2.split('.').map(n => parseInt(n) || 0);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}

// Open external URLs
ipcMain.handle('open-external', async (event, url) => {
  try {
    await shell.openExternal(url);
    return true;
  } catch (error) {
    console.error('Error opening external URL:', error);
    return false;
  }
});

// File format handlers for custom extensions
ipcMain.handle('save-queue', async (event, filePath, queueData) => {
  if (!fileFormatsHandler) {
    throw new Error('File formats handler not loaded');
  }
  return await fileFormatsHandler.saveQueue(filePath, queueData);
});

ipcMain.handle('load-queue', async (event, filePath) => {
  if (!fileFormatsHandler) {
    throw new Error('File formats handler not loaded');
  }
  return await fileFormatsHandler.loadQueue(filePath);
});

ipcMain.handle('save-preset', async (event, filePath, presetData) => {
  if (!fileFormatsHandler) {
    throw new Error('File formats handler not loaded');
  }
  return await fileFormatsHandler.savePreset(filePath, presetData);
});

ipcMain.handle('load-preset', async (event, filePath) => {
  if (!fileFormatsHandler) {
    throw new Error('File formats handler not loaded');
  }
  return await fileFormatsHandler.loadPreset(filePath);
});

ipcMain.handle('save-analysis', async (event, filePath, analysisData) => {
  if (!fileFormatsHandler) {
    throw new Error('File formats handler not loaded');
  }
  return await fileFormatsHandler.saveAnalysis(filePath, analysisData);
});

ipcMain.handle('load-analysis', async (event, filePath) => {
  if (!fileFormatsHandler) {
    throw new Error('File formats handler not loaded');
  }
  return await fileFormatsHandler.loadAnalysis(filePath);
});

ipcMain.handle('save-report', async (event, filePath, reportData) => {
  if (!fileFormatsHandler) {
    throw new Error('File formats handler not loaded');
  }
  return await fileFormatsHandler.saveReport(filePath, reportData);
});

ipcMain.handle('load-report', async (event, filePath) => {
  if (!fileFormatsHandler) {
    throw new Error('File formats handler not loaded');
  }
  return await fileFormatsHandler.loadReport(filePath);
});

// Save file dialog with custom filter
ipcMain.handle('save-file-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result.canceled ? null : result.filePath;
});

// Open file dialog with custom filter
ipcMain.handle('open-file-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result.canceled ? null : result.filePaths[0];
});

// Trim video handler
ipcMain.handle('trim-video', async (event, options) => {
  const { inputPath, segments, outputPath } = options;
  
  if (!ffmpegHandler) {
    throw new Error('FFmpeg handler not loaded');
  }
  
  try {
    const result = await ffmpegHandler.trimVideo(inputPath, segments, outputPath);
    mainWindow.webContents.send('trim-video-complete', { success: true, result });
    return result;
  } catch (error) {
    mainWindow.webContents.send('trim-video-error', { error: error.message });
    throw error;
  }
});

// Concat videos handler
ipcMain.handle('concat-videos', async (event, options) => {
  const { inputPaths, outputPath } = options;
  
  if (!ffmpegHandler) {
    throw new Error('FFmpeg handler not loaded');
  }
  
  try {
    const result = await ffmpegHandler.concatVideos(inputPaths, outputPath);
    mainWindow.webContents.send('concat-videos-complete', { success: true, result });
    return result;
  } catch (error) {
    mainWindow.webContents.send('concat-videos-error', { error: error.message });
    throw error;
  }
});

// Get video info handler (YouTube/YTDL)
ipcMain.handle('get-video-info', async (event, url) => {
  try {
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      let output = '';
      let errors = '';
      
      const ytdlp = spawn('yt-dlp', [
        url,
        '--dump-json',
        '--no-warnings',
      ]);
      
      ytdlp.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      ytdlp.stderr.on('data', (data) => {
        errors += data.toString();
      });
      
      ytdlp.on('close', (code) => {
        if (code === 0 && output) {
          try {
            const videoData = JSON.parse(output);
            resolve({
              title: videoData.title || 'Unknown Title',
              duration: formatDuration(videoData.duration || 0),
              uploader: videoData.uploader || 'Unknown',
              description: videoData.description || '',
              videoId: videoData.id || '',
            });
          } catch (e) {
            reject(new Error(`Failed to parse video info: ${e.message}`));
          }
        } else {
          reject(new Error(`Failed to get video info: ${errors || 'Unknown error'}`));
        }
      });
      
      ytdlp.on('error', (err) => {
        reject(new Error(`yt-dlp not found or error: ${err.message}`));
      });
    });
  } catch (error) {
    throw new Error(`Failed to get video info: ${error.message}`);
  }
});

// Download video handler
ipcMain.handle('download-video', async (event, options) => {
  const { url, outputPath, format, audioOnly } = options;
  
  try {
    const { spawn } = require('child_process');
    const path = require('path');
    const fs = require('fs');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }
    
    // Build format string
    let formatString;
    if (audioOnly) {
      formatString = 'bestaudio/best';
    } else if (format === 'best') {
      formatString = 'bestvideo+bestaudio/best';
    } else if (format === 'worst') {
      formatString = 'worstvideo+worstaudio/worst';
    } else {
      // Quality-based filter (e.g., "720p" -> "bestvideo[height<=720]+bestaudio/best")
      const height = format.replace('p', '');
      formatString = `bestvideo[height<=${height}]+bestaudio/best`;
    }
    
    const outputTemplate = path.join(outputPath, '%(title)s.%(ext)s');
    
    return new Promise((resolve, reject) => {
      let lastProgress = 0;
      let downloadedFile = '';
      
      const args = [
        url,
        `-f${formatString}`,
        `-o${outputTemplate}`,
        '--progress',
        '--newline',
        '--no-warnings',
      ];
      
      if (audioOnly) {
        args.push('-x');
        args.push('--audio-format');
        args.push('mp3');
      }
      
      const ytdlp = spawn('yt-dlp', args);
      
      ytdlp.stdout.on('data', (data) => {
        const output = data.toString();
        
        // Parse progress from output
        const progressMatch = output.match(/\[download\]\s+(\d+\.?\d*)%/);
        if (progressMatch) {
          const progress = Math.round(parseFloat(progressMatch[1]));
          if (progress > lastProgress) {
            lastProgress = progress;
            mainWindow.webContents.send('download-progress', {
              progress,
              status: `Downloading... ${progress}%`,
            });
            // Update taskbar progress
            mainWindow.setProgressBar(progress / 100);
          }
        }
        
        // Extract filename from output
        const destinationMatch = output.match(/Destination:\s*(.+?)(?:\n|$)/);
        if (destinationMatch) {
          downloadedFile = destinationMatch[1].trim();
        }
      });
      
      ytdlp.stderr.on('data', (data) => {
        const output = data.toString();
        
        // Parse progress from stderr
        const progressMatch = output.match(/\[download\]\s+(\d+\.?\d*)%/);
        if (progressMatch) {
          const progress = Math.round(parseFloat(progressMatch[1]));
          if (progress > lastProgress) {
            lastProgress = progress;
            mainWindow.webContents.send('download-progress', {
              progress,
              status: `Downloading... ${progress}%`,
            });
            // Update taskbar progress
            mainWindow.setProgressBar(progress / 100);
          }
        }
      });
      
      ytdlp.on('close', (code) => {
        if (code === 0) {
          mainWindow.webContents.send('download-progress', {
            progress: 100,
            status: 'Download complete!',
          });
          // Reset taskbar progress
          mainWindow.setProgressBar(-1);
          
          // Try to find the downloaded file
          let finalPath = downloadedFile;
          if (!finalPath || !fs.existsSync(finalPath)) {
            // Fall back to finding newest file in directory
            const files = fs.readdirSync(outputPath);
            if (files.length > 0) {
              const newestFile = files
                .map(f => ({
                  name: f,
                  time: fs.statSync(path.join(outputPath, f)).mtime.getTime(),
                }))
                .sort((a, b) => b.time - a.time)[0];
              
              finalPath = path.join(outputPath, newestFile.name);
            }
          }
          
          resolve({
            success: true,
            filePath: finalPath || '',
            fileName: path.basename(finalPath || 'unknown'),
          });
        } else {
          reject(new Error(`Download failed with code ${code}`));
        }
      });
      
      ytdlp.on('error', (err) => {
        reject(new Error(`yt-dlp error: ${err.message}`));
      });
    });
  } catch (error) {
    throw new Error(`Download error: ${error.message}`);
  }
});

// Helper function to format duration
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

// Helper function to detect GPU memory on Windows
async function detectWindowsGpuMemory() {
  try {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    // Try using wmic (Windows Management Instrumentation Command-line) to get GPU VRAM
    // This is more reliable than systeminformation for GPU memory
    const { stdout } = await execAsync(
      'wmic path win32_videocontroller get name,adapterram /format:list',
      { encoding: 'utf8', timeout: 5000 }
    );
    
    const lines = stdout.split('\n');
    const gpuInfo = {};
    
    for (const line of lines) {
      if (line.includes('Name=')) {
        gpuInfo.name = line.replace('Name=', '').trim();
      }
      if (line.includes('AdapterRAM=')) {
        const ramBytes = parseInt(line.replace('AdapterRAM=', '').trim());
        if (ramBytes > 0) {
          gpuInfo.memory = Math.round(ramBytes / 1024 / 1024); // Convert to MB
        }
      }
    }
    
    return gpuInfo;
  } catch (error) {
    // wmic not available or failed, return empty
    return {};
  }
}

// Codec detection handler - tests which encoders are actually available
ipcMain.handle('detect-encoders', async (event) => {
  const cacheDir = path.join(app.getPath('userData'), '.streamline');
  const cacheFile = path.join(cacheDir, 'encoder-detection-cache.json');
  
  // Ensure cache directory exists
  if (!fsSync.existsSync(cacheDir)) {
    fsSync.mkdirSync(cacheDir, { recursive: true });
  }

  try {
    // Use app userData directory to avoid DOS short name issues
    const tempBase = path.join(app.getPath('userData'), 'benchmark-temp');
    if (!fsSync.existsSync(tempBase)) {
      fsSync.mkdirSync(tempBase, { recursive: true });
    }
    
    const testVideoPath = path.join(tempBase, 'test-detection.mp4');
    
    // Only generate test video if it doesn't exist
    if (!fsSync.existsSync(testVideoPath)) {
      await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
          '-f', 'lavfi',
          '-i', 'color=c=blue:s=1280x720:d=0.1',
          '-vf', 'fps=1',
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-y',
          testVideoPath
        ]);
        
        let stderr = '';
        ffmpeg.stderr.on('data', (data) => { stderr += data.toString(); });
        
        ffmpeg.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Failed to generate detection video: ${stderr}`));
        });
        
        ffmpeg.on('error', (err) => reject(err));
      });
    }
    
    // Define all codec/platform combinations to test
    const testsToRun = [
      // Software encoders (always test these as baseline)
      { codec: 'h264', hwAccel: null, name: 'H.264 (Software)' },
      { codec: 'h265', hwAccel: null, name: 'H.265 (Software)' },
      { codec: 'av1', hwAccel: null, name: 'AV1 (Software)' },
      // Hardware encoders
      { codec: 'h264', hwAccel: 'nvidia', name: 'H.264 (NVIDIA NVENC)' },
      { codec: 'h265', hwAccel: 'nvidia', name: 'H.265 (NVIDIA NVENC)' },
      { codec: 'av1', hwAccel: 'nvidia', name: 'AV1 (NVIDIA NVENC)' },
      { codec: 'h264', hwAccel: 'amd', name: 'H.264 (AMD AMF)' },
      { codec: 'h265', hwAccel: 'amd', name: 'H.265 (AMD AMF)' },
      { codec: 'av1', hwAccel: 'amd', name: 'AV1 (AMD AMF)' },
      { codec: 'h264', hwAccel: 'intel', name: 'H.264 (Intel QSV)' },
      { codec: 'h265', hwAccel: 'intel', name: 'H.265 (Intel QSV)' },
      { codec: 'av1', hwAccel: 'intel', name: 'AV1 (Intel QSV)' },
      { codec: 'h264', hwAccel: 'apple', name: 'H.264 (Apple VideoToolbox)' },
      { codec: 'h265', hwAccel: 'apple', name: 'H.265 (Apple VideoToolbox)' }
    ];

    const detectedEncoders = [];
    const failedEncoders = [];

    // Test each codec/platform combination
    for (const test of testsToRun) {
      try {
        const outputPath = path.join(tempBase, `detection_${test.codec}_${test.hwAccel || 'sw'}_${Date.now()}.mp4`);
        
        // Build codec arguments
        let codecArgs = [];
        if (test.hwAccel === 'nvidia') {
          if (test.codec === 'h264') codecArgs = ['-c:v', 'h264_nvenc', '-preset', 'fast'];
          else if (test.codec === 'h265') codecArgs = ['-c:v', 'hevc_nvenc', '-preset', 'fast'];
          else if (test.codec === 'av1') codecArgs = ['-c:v', 'av1_nvenc', '-preset', 'fast'];
        } else if (test.hwAccel === 'amd') {
          if (test.codec === 'h264') codecArgs = ['-c:v', 'h264_amf'];
          else if (test.codec === 'h265') codecArgs = ['-c:v', 'hevc_amf'];
          else if (test.codec === 'av1') codecArgs = ['-c:v', 'av1_amf'];
        } else if (test.hwAccel === 'intel') {
          if (test.codec === 'h264') codecArgs = ['-c:v', 'h264_qsv'];
          else if (test.codec === 'h265') codecArgs = ['-c:v', 'hevc_qsv'];
          else if (test.codec === 'av1') codecArgs = ['-c:v', 'av1_qsv'];
        } else if (test.hwAccel === 'apple') {
          if (test.codec === 'h264') codecArgs = ['-c:v', 'h264_videotoolbox'];
          else if (test.codec === 'h265') codecArgs = ['-c:v', 'hevc_videotoolbox'];
        } else {
          // Software
          if (test.codec === 'h264') codecArgs = ['-c:v', 'libx264'];
          else if (test.codec === 'h265') codecArgs = ['-c:v', 'libx265'];
          else if (test.codec === 'av1') codecArgs = ['-c:v', 'libaom-av1'];
        }

        // Use forward slashes for FFmpeg compatibility
        const testVideoForFFmpeg = testVideoPath.replace(/\\/g, '/');
        const outputForFFmpeg = outputPath.replace(/\\/g, '/');

        const args = [
          '-i', testVideoForFFmpeg,
          ...codecArgs,
          '-b:v', '1M',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-t', '0.1',
          '-y',
          outputForFFmpeg
        ];

        // Quick test with timeout
        const success = await new Promise((resolve) => {
          const timeoutId = setTimeout(() => {
            resolve(false);
          }, 10000); // 10 second timeout per encoder

          const ffmpeg = spawn('ffmpeg', args);
          let hasError = false;

          ffmpeg.stderr.on('data', (data) => {
            const stderr = data.toString().toLowerCase();
            if (stderr.includes('unknown encoder') || stderr.includes('encoder') && stderr.includes('not found')) {
              hasError = true;
            }
          });

          ffmpeg.on('close', (code) => {
            clearTimeout(timeoutId);
            resolve(code === 0 && !hasError);
          });

          ffmpeg.on('error', () => {
            clearTimeout(timeoutId);
            resolve(false);
          });
        });

        if (success) {
          detectedEncoders.push({
            name: test.name,
            codec: test.codec,
            hwAccel: test.hwAccel,
            available: true,
            timestamp: new Date().toISOString()
          });
        } else {
          failedEncoders.push({
            name: test.name,
            codec: test.codec,
            hwAccel: test.hwAccel,
            available: false,
            timestamp: new Date().toISOString()
          });
        }

        // Clean up test output
        if (fsSync.existsSync(outputPath)) {
          fsSync.unlinkSync(outputPath);
        }
      } catch (error) {
        console.log(`Encoder detection failed for ${test.name}: ${error.message}`);
        failedEncoders.push({
          name: test.name,
          codec: test.codec,
          hwAccel: test.hwAccel,
          available: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Save detection results to cache
    const detectionResults = {
      detectedEncoders,
      failedEncoders,
      totalTested: testsToRun.length,
      detectionDate: new Date().toISOString(),
      platform: process.platform
    };

    fsSync.writeFileSync(cacheFile, JSON.stringify(detectionResults, null, 2));

    return detectionResults;
  } catch (error) {
    console.error('Encoder detection error:', error);
    throw new Error(`Failed to detect encoders: ${error.message}`);
  }
});

// Load cached encoder detection results
ipcMain.handle('get-detected-encoders', async () => {
  try {
    const cacheFile = path.join(app.getPath('userData'), '.streamline', 'encoder-detection-cache.json');
    
    if (fsSync.existsSync(cacheFile)) {
      const data = fsSync.readFileSync(cacheFile, 'utf-8');
      return JSON.parse(data);
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load cached encoders:', error);
    return null;
  }
});

// Benchmark handlers
ipcMain.handle('get-system-info', async () => {
  const os = require('os');
  const si = require('systeminformation');
  
  try {
    const [cpu, graphics, osInfo, disk, memory, mainboard] = await Promise.all([
      si.cpu(),
      si.graphics(),
      si.osInfo(),
      si.diskLayout(),
      si.mem(),
      si.baseboard().catch(() => null)
    ]);

    // Extract real GPU info - filter out virtual displays
    let gpuInfo = 'Unknown GPU';
    let gpuMemory = 0;
    
    if (graphics && graphics.controllers && graphics.controllers.length > 0) {
      // Try to find a real GPU (not virtual monitor)
      for (const controller of graphics.controllers) {
        const model = controller.model || '';
        // Filter out virtual displays
        if (!model.toLowerCase().includes('virtual') && 
            !model.toLowerCase().includes('meta') &&
            model.length > 0) {
          gpuInfo = model;
          gpuMemory = controller.memory || 0;
          break;
        }
      }
      
      // If no real GPU found, try the first one that has memory
      if (gpuInfo === 'Unknown GPU' && graphics.controllers[0]) {
        for (const controller of graphics.controllers) {
          if (controller.memory && controller.memory > 0) {
            gpuInfo = controller.model || 'Unknown GPU';
            gpuMemory = controller.memory;
            break;
          }
        }
      }
      
      // Last resort - just use the first controller
      if (gpuInfo === 'Unknown GPU' && graphics.controllers[0]) {
        gpuInfo = graphics.controllers[0].model || 'Unknown GPU';
        gpuMemory = graphics.controllers[0].memory || 0;
      }
      
      // Additional memory detection for systems where systeminformation doesn't report it
      if (gpuMemory === 0 && graphics.controllers[0]) {
        // Try to get memory from vram property if available
        const primaryGPU = graphics.controllers[0];
        if (primaryGPU.vram) {
          gpuMemory = primaryGPU.vram;
        } else if (primaryGPU.memory_used !== undefined && primaryGPU.memory_total !== undefined) {
          gpuMemory = primaryGPU.memory_total;
        }
      }
    }
    
    // Windows-specific GPU memory detection using WMI
    if (osInfo.platform === 'win32' && gpuMemory === 0) {
      try {
        const windowsGpuInfo = await detectWindowsGpuMemory();
        if (windowsGpuInfo.name) {
          gpuInfo = windowsGpuInfo.name;
        }
        if (windowsGpuInfo.memory && windowsGpuInfo.memory > 0) {
          gpuMemory = windowsGpuInfo.memory;
        }
      } catch (e) {
        // Windows detection failed, continue with other methods
      }
    }

    // Get RAM type (DDR4, DDR5, etc.)
    let ramType = 'Unknown';
    try {
      if (mainboard && mainboard.memoryMax) {
        // Try to detect from mainboard info
        const boardStr = JSON.stringify(mainboard).toLowerCase();
        if (boardStr.includes('ddr5')) ramType = 'DDR5';
        else if (boardStr.includes('ddr4')) ramType = 'DDR4';
        else if (boardStr.includes('ddr3')) ramType = 'DDR3';
      }
    } catch (e) {
      // Fallback
      ramType = 'Unknown';
    }

    // Get drive info
    let driveInfo = 'Unknown';
    if (disk && disk.length > 0) {
      const mainDrive = disk[0];
      driveInfo = `${mainDrive.type || 'Unknown'} - ${mainDrive.name || 'Unknown'}`;
      if (mainDrive.size) {
        driveInfo += ` (${(mainDrive.size / 1024 / 1024 / 1024 / 1024).toFixed(2)}TB)`;
      }
    }

    const totalRamGB = Math.round(os.totalmem() / 1024 / 1024 / 1024);
    const ramString = `${totalRamGB}GB ${ramType}`;

    return {
      // CPU Info
      cpu: cpu.brand || 'Unknown CPU',
      cpuCores: cpu.cores || os.cpus().length,
      cpuSpeed: cpu.speed ? `${cpu.speed}GHz` : 'Unknown',
      
      // GPU Info
      gpu: gpuInfo,
      gpuMemory: gpuMemory > 0 ? `${gpuMemory}MB` : 'Unknown',
      
      // RAM Info
      ram: ramString,
      ramTotal: `${totalRamGB}GB`,
      ramType: ramType,
      ramUsed: `${Math.round((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024)}GB`,
      ramAvailable: `${Math.round(os.freemem() / 1024 / 1024 / 1024)}GB`,
      
      // OS Info
      os: `${osInfo.distro} ${osInfo.release}`,
      platform: osInfo.platform,
      arch: osInfo.arch,
      
      // Drive Info
      drive: driveInfo,
      
      // System Info
      hostname: os.hostname(),
      country: Intl.DateTimeFormat().resolvedOptions().timeZone,
      uptime: `${Math.round(os.uptime() / 3600)} hours`,
      
      // Additional Info
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      
      // All graphics controllers for detailed info
      allGpus: graphics.controllers ? graphics.controllers.map(c => ({
        model: c.model || 'Unknown',
        memory: c.memory || 0,
        vendor: c.vendor || 'Unknown',
        type: c.type || 'Unknown'
      })) : []
    };
  } catch (error) {
    console.error('Error getting detailed system info:', error);
    
    // Fallback if systeminformation fails
    const totalRamGB = Math.round(os.totalmem() / 1024 / 1024 / 1024);
    
    return {
      cpu: os.cpus()[0]?.model || 'Unknown CPU',
      cpuCores: os.cpus().length,
      cpuSpeed: `${os.cpus()[0]?.speed || 0}MHz`,
      gpu: 'Unknown GPU',
      gpuMemory: 'Unknown',
      ram: `${totalRamGB}GB Unknown Type`,
      ramTotal: `${totalRamGB}GB`,
      ramType: 'Unknown',
      ramUsed: `${Math.round((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024)}GB`,
      ramAvailable: `${Math.round(os.freemem() / 1024 / 1024 / 1024)}GB`,
      os: `${os.platform()} ${os.release()}`,
      platform: os.platform(),
      arch: os.arch(),
      drive: 'Unknown',
      hostname: os.hostname(),
      country: Intl.DateTimeFormat().resolvedOptions().timeZone,
      uptime: `${Math.round(os.uptime() / 3600)} hours`,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      allGpus: []
    };
  }
});

ipcMain.handle('download-benchmark-video', async (event, url) => {
  // Use app userData directory to avoid DOS short name issues with temp directory
  const benchmarkDir = path.join(app.getPath('userData'), 'benchmark-temp', 'downloads');
  
  // Create directory if it doesn't exist
  if (!fsSync.existsSync(benchmarkDir)) {
    fsSync.mkdirSync(benchmarkDir, { recursive: true });
  }

  try {
    const outputPath = benchmarkDir;
    
    return new Promise((resolve, reject) => {
      let lastProgress = 0;
      let downloadedFile = '';
      
      const args = [
        url,
        `-f`, `bestvideo+bestaudio/best`,
        `-o`, path.join(outputPath, '%(title)s.%(ext)s'),
        '--progress',
        '--newline',
        '--no-warnings',
      ];
      
      const ytdlp = spawn('yt-dlp', args);
      
      ytdlp.stdout.on('data', (data) => {
        const output = data.toString();
        
        const progressMatch = output.match(/\[download\]\s+(\d+\.?\d*)%/);
        if (progressMatch) {
          const progress = Math.round(parseFloat(progressMatch[1]));
          if (progress > lastProgress) {
            lastProgress = progress;
            mainWindow.webContents.send('download-progress', {
              progress,
              status: `Downloading benchmark video... ${progress}%`,
            });
            mainWindow.setProgressBar(progress / 100);
          }
        }
        
        const destinationMatch = output.match(/Destination:\s*(.+?)(?:\n|$)/);
        if (destinationMatch) {
          downloadedFile = destinationMatch[1].trim();
        }
      });
      
      ytdlp.stderr.on('data', (data) => {
        const output = data.toString();
        const progressMatch = output.match(/\[download\]\s+(\d+\.?\d*)%/);
        if (progressMatch) {
          const progress = Math.round(parseFloat(progressMatch[1]));
          if (progress > lastProgress) {
            lastProgress = progress;
            mainWindow.webContents.send('download-progress', {
              progress,
              status: `Downloading benchmark video... ${progress}%`,
            });
            mainWindow.setProgressBar(progress / 100);
          }
        }
      });
      
      ytdlp.on('close', (code) => {
        mainWindow.setProgressBar(-1);
        
        if (code === 0) {
          let finalPath = downloadedFile;
          if (!finalPath || !fsSync.existsSync(finalPath)) {
            const files = fsSync.readdirSync(outputPath);
            if (files.length > 0) {
              const newestFile = files
                .map(f => ({
                  name: f,
                  time: fsSync.statSync(path.join(outputPath, f)).mtime.getTime(),
                }))
                .sort((a, b) => b.time - a.time)[0];
              
              finalPath = path.join(outputPath, newestFile.name);
            }
          }
          
          // Validate that the file exists and has content
          if (!finalPath || !fsSync.existsSync(finalPath)) {
            reject(new Error(`Downloaded file not found or path is invalid: ${finalPath}`));
            return;
          }
          
          const fileStats = fsSync.statSync(finalPath);
          if (fileStats.size === 0) {
            reject(new Error(`Downloaded file is empty: ${finalPath}`));
            return;
          }
          
          console.log(`Successfully downloaded benchmark video: ${finalPath} (${fileStats.size} bytes)`);
          
          resolve({
            success: true,
            filePath: finalPath,
            fileName: path.basename(finalPath),
          });
        } else {
          reject(new Error(`Download failed with code ${code}`));
        }
      });
      
      ytdlp.on('error', (err) => {
        reject(new Error(`yt-dlp error: ${err.message}`));
      });
    });
  } catch (error) {
    throw new Error(`Download error: ${error.message}`);
  }
});

// Helper function to generate a minimal test video for benchmarking
async function generateTestVideo(outputPath) {
  return new Promise((resolve, reject) => {
    // Generate a 2-frame test video using FFmpeg's video generation filter
    // Output: 1280x720 video, 2 frames at 30fps (so it's about 1 second)
    const args = [
      '-f', 'lavfi',
      '-i', 'color=c=blue:s=1280x720:d=0.1',  // 0.1 seconds of blue video
      '-vf', 'fps=30',
      '-c:v', 'libx264',  // Use software H.264 for compatibility
      '-preset', 'ultrafast',
      '-y',
      outputPath
    ];
    
    const ffmpeg = spawn('ffmpeg', args);
    let stderr = '';
    
    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`Generated test video at: ${outputPath}`);
        resolve();
      } else {
        const error = stderr.split('\n').slice(-10).join('\n');
        reject(new Error(`Failed to generate test video: ${error}`));
      }
    });
    
    ffmpeg.on('error', (err) => {
      reject(new Error(`FFmpeg error generating test video: ${err.message}`));
    });
  });
}

ipcMain.handle('run-benchmark-test', async (event, options) => {
  const { inputPath, codec, hwAccel, resolution } = options;
  // Use a simpler temp directory to avoid DOS short name issues
  const tempBase = path.join(app.getPath('userData'), 'benchmark-temp');
  const outputDir = path.join(tempBase, 'output');
  
  // Ensure directories exist
  if (!fsSync.existsSync(tempBase)) {
    fsSync.mkdirSync(tempBase, { recursive: true });
  }
  if (!fsSync.existsSync(outputDir)) {
    fsSync.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate a test video if inputPath is 'builtin:2frame'
  let actualInputPath = inputPath;
  if (inputPath === 'builtin:2frame') {
    actualInputPath = path.join(tempBase, 'test-input-2frame.mp4');
    
    // Only generate if it doesn't exist
    if (!fsSync.existsSync(actualInputPath)) {
      try {
        await generateTestVideo(actualInputPath);
      } catch (genError) {
        throw new Error(`Failed to generate test video: ${genError.message}`);
      }
    }
  }

  // Validate that input file exists
  if (!fsSync.existsSync(actualInputPath)) {
    throw new Error(`Input file not found: ${actualInputPath}`);
  }
  
  const fileStats = fsSync.statSync(actualInputPath);
  if (fileStats.size === 0) {
    throw new Error(`Input file is empty: ${actualInputPath}`);
  }
  
  console.log(`Benchmark input file: ${actualInputPath} (${fileStats.size} bytes)`);
  
  const outputPath = path.join(outputDir, `test_${codec}_${hwAccel || 'sw'}_${Date.now()}.mp4`);
  
  try {
    const startTime = Date.now();
    
    // Build FFmpeg command based on codec and hardware acceleration
    let codecArgs = [];
    
    if (hwAccel === 'nvidia') {
      // NVIDIA NVENC - just use the encoder, FFmpeg will handle it
      if (codec === 'h264') {
        codecArgs = ['-c:v', 'h264_nvenc', '-preset', 'fast'];
      }
      else if (codec === 'h265') {
        codecArgs = ['-c:v', 'hevc_nvenc', '-preset', 'fast'];
      }
      else if (codec === 'av1') {
        codecArgs = ['-c:v', 'av1_nvenc', '-preset', 'fast'];
      }
    } else if (hwAccel === 'amd') {
      // AMD AMF - encoder only
      if (codec === 'h264') codecArgs = ['-c:v', 'h264_amf'];
      else if (codec === 'h265') codecArgs = ['-c:v', 'hevc_amf'];
      else if (codec === 'av1') codecArgs = ['-c:v', 'av1_amf'];
    } else if (hwAccel === 'intel') {
      // Intel QSV
      if (codec === 'h264') codecArgs = ['-c:v', 'h264_qsv'];
      else if (codec === 'h265') codecArgs = ['-c:v', 'hevc_qsv'];
      else if (codec === 'av1') codecArgs = ['-c:v', 'av1_qsv'];
      else if (codec === 'vp9') codecArgs = ['-c:v', 'vp9_qsv'];
    } else if (hwAccel === 'apple') {
      // Apple VideoToolbox
      if (codec === 'h264') codecArgs = ['-c:v', 'h264_videotoolbox'];
      else if (codec === 'h265') codecArgs = ['-c:v', 'hevc_videotoolbox'];
      else if (codec === 'prores') codecArgs = ['-c:v', 'prores_videotoolbox'];
    } else {
      // Software encoding
      if (codec === 'h264') codecArgs = ['-c:v', 'libx264', '-preset', 'medium'];
      else if (codec === 'h265') codecArgs = ['-c:v', 'libx265', '-preset', 'medium'];
      else if (codec === 'av1') codecArgs = ['-c:v', 'libaom-av1', '-cpu-used', '4'];
      else if (codec === 'vp9') codecArgs = ['-c:v', 'libvpx-vp9', '-cpu-used', '2'];
      else if (codec === 'vp8') codecArgs = ['-c:v', 'libvpx', '-cpu-used', '2'];
    }
    
    // Use forward slashes for FFmpeg compatibility, especially on Windows
    const inputForFFmpeg = actualInputPath.replace(/\\/g, '/');
    const outputForFFmpeg = outputPath.replace(/\\/g, '/');
    
    // For detection tests (builtin:2frame), don't use -t flag so all frames are encoded
    // For benchmark tests with real videos, use -t to limit test duration
    const args = [
      '-i', inputForFFmpeg,
      ...codecArgs,
      '-b:v', '5M',
      '-c:a', 'aac',
      '-b:a', '128k',
      ...(inputPath === 'builtin:2frame' ? [] : ['-t', '10']),  // Only limit real videos
      '-y',
      outputForFFmpeg
    ];
    
    console.log(`\n=== Starting Benchmark Test ===`);
    console.log(`Codec: ${codec}, Hardware: ${hwAccel || 'Software'}`);
    console.log(`Input: ${inputForFFmpeg}`);
    console.log(`Output: ${outputForFFmpeg}`);
    console.log(`Command: ffmpeg ${args.join(' ')}`);
    console.log(`=== ===\n`);
    
    const result = await executeFFmpegBenchmark(args, outputPath, startTime, codec, hwAccel, event);
    return result;
  } catch (error) {
    // Don't fall back for hardware acceleration - just mark it as failed
    // This allows the UI to show which encoders don't work
    throw new Error(`Benchmark test failed: ${error.message}`);
  }
});

// Helper function to execute FFmpeg benchmark
async function executeFFmpegBenchmark(args, outputPath, startTime, codec, hwAccel, event) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args);
    let stderr = '';
    let stdout = '';
    let lastProgressUpdate = 0;
    
    ffmpeg.stderr.on('data', (data) => {
      const chunk = data.toString();
      stderr += chunk;
      
      // Send real-time progress updates
      // Parse FFmpeg progress: frame=X fps=Y time=HH:MM:SS.ms
      const frameMatch = chunk.match(/frame=\s*(\d+)/);
      const fpsMatch = chunk.match(/fps=\s*(\d+\.?\d*)/);
      const timeMatch = chunk.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
      const speedMatch = chunk.match(/speed=\s*(\d+\.?\d*)x/);
      
      if (frameMatch || fpsMatch || timeMatch) {
        const now = Date.now();
        // Throttle progress updates to every 100ms
        if (now - lastProgressUpdate > 100) {
          lastProgressUpdate = now;
          
          let progress = {
            frame: frameMatch ? parseInt(frameMatch[1]) : 0,
            fps: fpsMatch ? parseFloat(fpsMatch[1]) : 0,
            speed: speedMatch ? parseFloat(speedMatch[1]) : 0,
          };
          
          if (timeMatch) {
            const hours = parseInt(timeMatch[1]);
            const minutes = parseInt(timeMatch[2]);
            const seconds = parseFloat(timeMatch[3]);
            progress.time = hours * 3600 + minutes * 60 + seconds;
          }
          
          // Send progress to renderer
          if (event && event.sender) {
            event.sender.send('benchmark-progress', {
              codec,
              hwAccel,
              progress
            });
          }
        }
      }
    });
    
    ffmpeg.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000; // in seconds
        
        // Parse FFmpeg output for stats
        const fpsMatch = stderr.match(/fps=\s*(\d+\.?\d*)/);
        const speedMatch = stderr.match(/speed=\s*(\d+\.?\d*)x/);
        
        try {
          const stats = fsSync.statSync(outputPath);
          
          resolve({
            success: true,
            duration,
            fps: fpsMatch ? parseFloat(fpsMatch[1]) : 0,
            speed: speedMatch ? parseFloat(speedMatch[1]) : duration > 0 ? 1 : 0,
            fileSize: stats.size,
            bitrate: (stats.size * 8) / duration, // bits per second
          });
        } catch (statError) {
          reject(new Error(`Failed to get output file stats: ${statError.message}`));
        }
      } else {
        // Get all output for debugging
        const allOutput = stderr + '\n' + stdout;
        const lines = allOutput.split('\n').filter(line => line.trim().length > 0);
        
        console.error(`FFmpeg failed with code ${code} for ${codec} (${hwAccel || 'software'})`);
        console.error(`Last 40 lines of FFmpeg output:`);
        lines.slice(-40).forEach((line, idx) => {
          console.error(`  ${idx}: ${line}`);
        });
        
        // Look for error/warning messages
        let errorMessage = `Encoding failed (code ${code})`;
        
        // Find lines with error keywords
        const errorLines = lines.filter(line => {
          const lower = line.toLowerCase();
          return /error|failed|unknown|invalid|not found|no such|cannot find|unrecognized|option/i.test(lower);
        });
        
        if (errorLines.length > 0) {
          // Get unique error messages and join them
          const uniqueErrors = [...new Set(errorLines.map(l => l.trim()))];
          errorMessage = uniqueErrors.slice(-2).join(' | ');
          
          // Limit length for display
          if (errorMessage.length > 300) {
            errorMessage = errorMessage.substring(0, 300) + '...';
          }
        }
        
        reject(new Error(errorMessage));
      }
      
      // Clean up output file regardless of success
      try {
        fsSync.unlinkSync(outputPath);
      } catch (e) {
        // File might not exist or already deleted, that's ok
      }
    });
    
    ffmpeg.on('error', (err) => {
      console.error(`FFmpeg process error: ${err.message}`);
      reject(new Error(`FFmpeg process failed: ${err.message}`));
    });
  });
}

ipcMain.handle('save-benchmark', async (event, benchmarkData) => {
  try {
    const filePath = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Benchmark Results',
      defaultPath: `benchmark_${new Date().toISOString().replace(/:/g, '-')}.slbench`,
      filters: [
        { name: 'Streamline Benchmark', extensions: ['slbench'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (filePath.filePath) {
      await fs.writeFile(filePath.filePath, JSON.stringify(benchmarkData, null, 2));
      return filePath.filePath;
    }
    
    return null;
  } catch (error) {
    throw new Error(`Failed to save benchmark: ${error.message}`);
  }
});

ipcMain.handle('load-benchmark', async (event, filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to load benchmark: ${error.message}`);
  }
});

ipcMain.handle('get-saved-benchmarks', async () => {
  try {
    const benchmarksDir = path.join(app.getPath('userData'), 'benchmarks');
    
    if (!fsSync.existsSync(benchmarksDir)) {
      return [];
    }
    
    const files = await fs.readdir(benchmarksDir);
    const benchmarks = [];
    
    for (const file of files) {
      if (file.endsWith('.slbench')) {
        const filePath = path.join(benchmarksDir, file);
        const stats = await fs.stat(filePath);
        const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
        
        benchmarks.push({
          name: file,
          path: filePath,
          timestamp: data.timestamp || stats.mtime.toISOString(),
          systemInfo: data.systemInfo
        });
      }
    }
    
    return benchmarks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Failed to get saved benchmarks:', error);
    return [];
  }
});

// Helper function to format duration
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}



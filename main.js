const { app, BrowserWindow, ipcMain, dialog, Notification, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const https = require('https');

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
let ffmpegHandler, thumbnailHandler, analysisHandler, fileFormatsHandler;

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
  if (!ffmpegHandler) {
    throw new Error('FFmpeg handler not loaded');
  }
  return await ffmpegHandler.encodeFile(options, (progress) => {
    mainWindow.webContents.send('encoding-progress', progress);
  });
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


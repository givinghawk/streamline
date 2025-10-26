const { contextBridge, ipcRenderer, webUtils } = require('electron');

console.log('Preload script starting...');

contextBridge.exposeInMainWorld('electron', {
  getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
  checkFFmpegPresence: () => ipcRenderer.invoke('check-ffmpeg-presence'),
  checkHardwareSupport: () => ipcRenderer.invoke('check-hardware-support'),
  encodeFile: (options) => ipcRenderer.invoke('encode-file', options),
  selectOutputDirectory: () => ipcRenderer.invoke('select-output-directory'),
  checkFileExists: (filePath) => ipcRenderer.invoke('check-file-exists', filePath),
  // File path utilities
  getPathForFile: (file) => webUtils.getPathForFile(file),
  onEncodingProgress: (callback) => {
    ipcRenderer.on('encoding-progress', (event, progress) => callback(progress));
  },
  removeEncodingProgressListener: () => {
    ipcRenderer.removeAllListeners('encoding-progress');
  },
  // Settings
  getSetting: (key) => ipcRenderer.invoke('get-setting', key),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  // Thumbnails
  generateThumbnailGrid: (filePath, options) => ipcRenderer.invoke('generate-thumbnail-grid', filePath, options),
  getImageDataUrl: (imagePath) => ipcRenderer.invoke('get-image-data-url', imagePath),
  cleanupThumbnail: (thumbnailPath) => ipcRenderer.invoke('cleanup-thumbnail', thumbnailPath),
  // Window controls
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),
  windowIsMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  // Platform detection
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  // FFmpeg installation
  installFFmpeg: () => ipcRenderer.invoke('install-ffmpeg'),
  // Batch processing
  getFileStats: (filePath) => ipcRenderer.invoke('get-file-stats', filePath),
  analyzeQuality: (options) => ipcRenderer.invoke('analyze-quality', options),
  showNotification: (options) => ipcRenderer.invoke('show-notification', options),
  // Path utilities - delegate to main process
  pathDirname: (p) => ipcRenderer.invoke('path-dirname', p),
  pathExtname: (p) => ipcRenderer.invoke('path-extname', p),
  pathBasename: (p, ext) => ipcRenderer.invoke('path-basename', p, ext),
  pathJoin: (...paths) => ipcRenderer.invoke('path-join', paths),
  // File system utilities - delegate to main process
  fsExistsSync: (p) => ipcRenderer.invoke('fs-exists-sync', p),
  fsMkdirSync: (p, options) => ipcRenderer.invoke('fs-mkdir-sync', p, options),
  // Updates
  checkForUpdates: (channel) => ipcRenderer.invoke('check-for-updates', channel),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  // Analysis
  analyzeBitrate: (filePath) => ipcRenderer.invoke('analyze-bitrate', filePath),
  detectScenes: (filePath, threshold) => ipcRenderer.invoke('detect-scenes', filePath, threshold),
  analyzeContent: (filePath) => ipcRenderer.invoke('analyze-content', filePath),
  analyzeQualityMetrics: (originalPath, encodedPath, metric) => ipcRenderer.invoke('analyze-quality-metrics', originalPath, encodedPath, metric),
  // File formats (custom extensions)
  saveQueue: (filePath, queueData) => ipcRenderer.invoke('save-queue', filePath, queueData),
  loadQueue: (filePath) => ipcRenderer.invoke('load-queue', filePath),
  savePreset: (filePath, presetData) => ipcRenderer.invoke('save-preset', filePath, presetData),
  loadPreset: (filePath) => ipcRenderer.invoke('load-preset', filePath),
  saveAnalysis: (filePath, analysisData) => ipcRenderer.invoke('save-analysis', filePath, analysisData),
  loadAnalysis: (filePath) => ipcRenderer.invoke('load-analysis', filePath),
  saveReport: (filePath, reportData) => ipcRenderer.invoke('save-report', filePath, reportData),
  loadReport: (filePath) => ipcRenderer.invoke('load-report', filePath),
  saveFileDialog: (options) => ipcRenderer.invoke('save-file-dialog', options),
  openFileDialog: (options) => ipcRenderer.invoke('open-file-dialog', options),
  onFileOpened: (callback) => {
    ipcRenderer.on('file-opened', (event, filePath) => callback(filePath));
  },
  removeFileOpenedListener: () => {
    ipcRenderer.removeAllListeners('file-opened');
  },
  // Trim and Concat
  trimVideo: (options) => ipcRenderer.invoke('trim-video', options),
  concatVideos: (options) => ipcRenderer.invoke('concat-videos', options),
  // Download
  getVideoInfo: (url) => ipcRenderer.invoke('get-video-info', url),
  downloadVideo: (options) => ipcRenderer.invoke('download-video', options),
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (event, data) => callback(data));
  },
  removeDownloadProgressListener: () => {
    ipcRenderer.removeAllListeners('download-progress');
  },
  // Benchmark
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  downloadBenchmarkVideo: (url) => ipcRenderer.invoke('download-benchmark-video', url),
  runBenchmarkTest: (options) => ipcRenderer.invoke('run-benchmark-test', options),
  saveBenchmark: (data) => ipcRenderer.invoke('save-benchmark', data),
  loadBenchmark: (filePath) => ipcRenderer.invoke('load-benchmark', filePath),
  getSavedBenchmarks: () => ipcRenderer.invoke('get-saved-benchmarks'),
  detectEncoders: () => ipcRenderer.invoke('detect-encoders'),
  getDetectedEncoders: () => ipcRenderer.invoke('get-detected-encoders'),
  onBenchmarkProgress: (callback) => {
    ipcRenderer.on('benchmark-progress', (event, data) => callback(data));
  },
  removeBenchmarkProgressListener: () => {
    ipcRenderer.removeAllListeners('benchmark-progress');
  },
});

console.log('Preload script completed - window.electron should be available');

import React, { useState, useEffect } from 'react';
import DropZone from './components/DropZone';
import PresetSelector from './components/PresetSelector';
import FileInfo from './components/FileInfo';
import BasicFileInfo from './components/BasicFileInfo';
import AdvancedSettings from './components/AdvancedSettings';
import EncodingProgress from './components/EncodingProgress';
import OutputSettings from './components/OutputSettings';
import Header from './components/Header';
import TitleBar from './components/TitleBar';
import SplashScreen from './components/SplashScreen';
import BatchQueue, { QueueStatus } from './components/BatchQueue';
import UpdateNotification from './components/UpdateNotification';
import ModeTabs from './components/ModeTabs';
import AnalysisPanel from './components/AnalysisPanel';
import VideoTrimConcat from './components/VideoTrimConcat';
import Download from './components/Download';
import PresetManager from './components/PresetManager';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import { useSettings } from './contexts/SettingsContext';
import { detectFileType, filterPresetsByFileType, getRecommendedPreset } from './utils/fileTypeDetection';
import { getThemeClasses } from './utils/themeUtils';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  const { getAllPresets, settings } = useSettings();
  const { batchMode } = settings;
  const [files, setFiles] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState({});
  const [fileInfo, setFileInfo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hardwareSupport, setHardwareSupport] = useState(null);
  const [encoding, setEncoding] = useState(false);
  const [encodingProgress, setEncodingProgress] = useState(null);
  const [outputDirectory, setOutputDirectory] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [fileType, setFileType] = useState(null);
  const [overwriteFiles, setOverwriteFiles] = useState(false);
  const [currentMode, setCurrentMode] = useState('import'); // 'import', 'encode', 'analysis'
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  
  // Batch queue state
  const [queue, setQueue] = useState([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [currentQueueItemId, setCurrentQueueItemId] = useState(null);
  const [maxConcurrentJobs, setMaxConcurrentJobs] = useState(1);

  // Debug: Check if Electron API is available
  useEffect(() => {
    console.log('Electron API available:', !!window.electron);
    if (window.electron) {
      console.log('Electron API methods:', Object.keys(window.electron));
    } else {
      console.error('⚠️ Electron API not loaded! Make sure you are running in Electron.');
    }
  }, []);

  useEffect(() => {
    // Setup progress listener
    if (window.electron) {
      window.electron.onEncodingProgress((progress) => {
        setEncodingProgress(progress);
        
        // Update queue item progress if processing batch
        if (currentQueueItemId) {
          setQueue(prevQueue => 
            prevQueue.map(item => 
              item.id === currentQueueItemId 
                ? { ...item, progress } 
                : item
            )
          );
        }
      });

      // Setup file opened listener for file associations
      window.electron.onFileOpened(async (filePath) => {
        console.log('File opened:', filePath);
        await handleFileAssociation(filePath);
      });
    }

    return () => {
      if (window.electron) {
        window.electron.removeEncodingProgressListener();
        window.electron.removeFileOpenedListener();
      }
    };
  }, [currentQueueItemId]);

  // Handle file association opening
  const handleFileAssociation = async (filePath) => {
    try {
      if (filePath.endsWith('.slqueue')) {
        const data = await window.electron.loadQueue(filePath);
        
        // Verify files still exist
        const validatedQueue = [];
        for (const item of data.queue) {
          const exists = await window.electron.checkFileExists(item.filePath);
          if (exists) {
            validatedQueue.push({
              ...item,
              file: {
                name: item.fileName,
                path: item.filePath,
                size: item.fileSize,
              },
            });
          }
        }
        
        setQueue(validatedQueue);
        setOverwriteFiles(data.settings.overwriteFiles ?? false);
        setMaxConcurrentJobs(data.settings.maxConcurrentJobs ?? 1);
        setCurrentMode('encode');
        
        if (window.electron.showNotification) {
          window.electron.showNotification({
            title: 'Queue Loaded',
            body: `Loaded ${validatedQueue.length} items from queue`,
          });
        }
      } else if (filePath.endsWith('.slpreset')) {
        const data = await window.electron.loadPreset(filePath);
        setSelectedPreset(data.preset);
        if (data.preset.settings) {
          setAdvancedSettings(data.preset.settings);
          setShowAdvanced(true);
        }
        setCurrentMode('encode');
        
        if (window.electron.showNotification) {
          window.electron.showNotification({
            title: 'Preset Loaded',
            body: `Preset "${data.preset.name}" loaded`,
          });
        }
      } else if (filePath.endsWith('.slanalysis')) {
        const data = await window.electron.loadAnalysis(filePath);
        setFileInfo(data.fileInfo);
        setCurrentMode('analysis');
        
        if (window.electron.showNotification) {
          window.electron.showNotification({
            title: 'Analysis Loaded',
            body: `Analysis for "${data.sourceFile.name}" loaded`,
          });
        }
      } else if (filePath.endsWith('.slreport')) {
        const data = await window.electron.loadReport(filePath);
        // For now, just show a notification. Could open a report viewer in the future.
        alert(`Report loaded:\n${data.summary.completedItems} completed, ${data.summary.failedItems} failed\nSpace saved: ${(data.summary.spaceSaved / 1024 / 1024).toFixed(2)} MB`);
      }
    } catch (error) {
      console.error('Failed to open file:', error);
      alert(`Failed to open file: ${error.message}`);
    }
  };


  // Keyboard shortcuts
  useKeyboardShortcuts({
    // Mode switching
    'ctrl+1': () => setCurrentMode('import'),
    'ctrl+2': () => setCurrentMode('encode'),
    'ctrl+3': () => setCurrentMode('analysis'),
    
    // Actions
    'ctrl+enter': () => {
      if (queue.length > 0 && !isProcessingBatch) {
        handleEncode();
      }
    },
    'ctrl+o': async () => {
      const result = await window.electron.selectFiles();
      if (result && result.length > 0) {
        handleFilesAdded(result);
      }
    },
    'ctrl+shift+delete': () => {
      if (queue.length > 0 && !isProcessingBatch) {
        if (confirm('Clear all items from the queue?')) {
          setQueue([]);
        }
      }
    },
    
    // Help
    'ctrl+/': () => setShowShortcutsHelp(true),
    'escape': () => setShowShortcutsHelp(false),
  }, !showSplash); // Only enable after splash screen

  const handleSplashComplete = (support) => {
    setHardwareSupport(support);
    setShowSplash(false);
  };

  const handleFilesAdded = async (newFiles) => {
    // Add files to batch queue instead of replacing
    const newQueueItems = await Promise.all(newFiles.map(async (file, index) => {
      const detectedType = detectFileType(file);
      const allPresets = getAllPresets();
      const recommended = getRecommendedPreset(detectedType, allPresets, file);
      
      // Get file info for duration calculation
      let fileInfo = null;
      if (file.path && window.electron?.getFileInfo) {
        try {
          fileInfo = await window.electron.getFileInfo(file.path);
        } catch (error) {
          console.error('Failed to get file info:', error);
        }
      }
      
      return {
        id: Date.now() + index,
        file,
        fileType: detectedType,
        preset: selectedPreset || recommended,
        customSettings: showAdvanced ? advancedSettings : {},
        fileInfo,
        status: QueueStatus.PENDING,
        progress: null,
        originalSize: file.size,
        compressedSize: null,
        error: null,
        qualityMetrics: null,
      };
    }));
    
    setQueue(prevQueue => [...prevQueue, ...newQueueItems]);
    
    // Analyze first file for preview
    if (newFiles.length > 0 && newFiles[0].path) {
      setFiles([newFiles[0]]);
      const detectedType = detectFileType(newFiles[0]);
      setFileType(detectedType);
      await analyzeFile(newFiles[0].path);
    }
  };

  const analyzeFile = async (filePath) => {
    if (!filePath || filePath === '') {
      console.warn('No file path provided for analysis');
      return;
    }
    
    if (!window.electron || !window.electron.getFileInfo) {
      console.error('Electron API not available for file analysis');
      setFileInfo(null);
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const info = await window.electron.getFileInfo(filePath);
      setFileInfo(info);
    } catch (error) {
      console.error('Failed to analyze file:', error);
      // Don't show alert here, file info is optional
      setFileInfo(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEncode = async () => {
    if (queue.length === 0) {
      alert('Please add files to the queue first');
      return;
    }

    await processBatchQueue();
  };

  const processBatchQueue = async () => {
    setIsProcessingBatch(true);
    
    const pendingItems = queue.filter(item => item.status === QueueStatus.PENDING);
    
    for (const item of pendingItems) {
      try {
        // Update status to processing
        setCurrentQueueItemId(item.id);
        setQueue(prevQueue => 
          prevQueue.map(q => 
            q.id === item.id 
              ? { ...q, status: QueueStatus.PROCESSING } 
              : q
          )
        );

        // Determine output path
        const inputPath = item.file.path;
        const outputPath = await getOutputPath(inputPath, item.preset, item.customSettings);

        // Ensure output directory exists
        if (window.electron && window.electron.pathDirname && window.electron.fsExistsSync) {
          const outputDir = await window.electron.pathDirname(outputPath);
          const exists = await window.electron.fsExistsSync(outputDir);
          if (!exists) {
            await window.electron.fsMkdirSync(outputDir, { recursive: true });
          }
        }

        // Determine hardware acceleration
        const hwAccel = getHardwareAcceleration();

        // Encode
        if (!window.electron || !window.electron.encodeFile) {
          throw new Error('Electron API not available');
        }
        
        const result = await window.electron.encodeFile({
          inputPath,
          outputPath,
          preset: item.preset,
          customSettings: {
            ...item.customSettings,
            duration: item.fileInfo?.format?.duration || null,
          },
          hardwareAccel: hwAccel,
        });

        // Get output file size
        const outputSize = await getFileSize(outputPath);
        
        // Run quality analysis if enabled in settings
        let qualityMetrics = null;
        if (settings.enableQualityAnalysis && item.fileType === 'video') {
          try {
            qualityMetrics = await window.electron.analyzeQuality({
              originalPath: inputPath,
              encodedPath: outputPath,
            });
          } catch (error) {
            console.error('Quality analysis failed:', error);
          }
        }

        // Update status to completed
        setQueue(prevQueue => 
          prevQueue.map(q => 
            q.id === item.id 
              ? { 
                  ...q, 
                  status: QueueStatus.COMPLETED,
                  compressedSize: outputSize,
                  qualityMetrics,
                  progress: null,
                } 
              : q
          )
        );

        console.log('Encoding completed:', result);
      } catch (error) {
        console.error('Encoding failed for item:', item.id, error);
        
        // Update status to failed
        setQueue(prevQueue => 
          prevQueue.map(q => 
            q.id === item.id 
              ? { 
                  ...q, 
                  status: QueueStatus.FAILED,
                  error: error.message,
                  progress: null,
                } 
              : q
          )
        );
      }
    }

    setCurrentQueueItemId(null);
    setIsProcessingBatch(false);
    setEncodingProgress(null);
    
    // Show completion notification
    if (settings.notifyOnCompletion && window.electron) {
      const completedCount = queue.filter(item => item.status === QueueStatus.COMPLETED).length;
      const failedCount = queue.filter(item => item.status === QueueStatus.FAILED).length;
      
      window.electron.showNotification({
        title: 'Batch Encoding Complete',
        body: `Completed: ${completedCount} | Failed: ${failedCount}`,
      });
    }
  };

  const getFileSize = async (filePath) => {
    try {
      const stats = await window.electron.getFileStats(filePath);
      return stats.size;
    } catch (error) {
      console.error('Failed to get file size:', error);
      return null;
    }
  };

  const handleRemoveQueueItem = (itemId) => {
    setQueue(prevQueue => prevQueue.filter(item => item.id !== itemId));
  };

  const handleClearCompleted = () => {
    setQueue(prevQueue => prevQueue.filter(item => item.status !== QueueStatus.COMPLETED));
  };

  const handleSaveQueue = async () => {
    try {
      const filePath = await window.electron.saveFileDialog({
        title: 'Save Queue',
        defaultPath: 'my-queue.slqueue',
        filters: [
          { name: 'Streamline Queue', extensions: ['slqueue'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (filePath) {
        await window.electron.saveQueue(filePath, {
          queue,
          overwriteFiles,
          maxConcurrentJobs,
        });
        
        if (window.electron.showNotification) {
          window.electron.showNotification({
            title: 'Queue Saved',
            body: `Queue saved to ${filePath}`,
          });
        }
      }
    } catch (error) {
      console.error('Failed to save queue:', error);
      alert(`Failed to save queue: ${error.message}`);
    }
  };

  const handleLoadQueue = async () => {
    try {
      const filePath = await window.electron.openFileDialog({
        title: 'Load Queue',
        filters: [
          { name: 'Streamline Queue', extensions: ['slqueue'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (filePath) {
        const data = await window.electron.loadQueue(filePath);
        
        // Verify files still exist
        const validatedQueue = [];
        for (const item of data.queue) {
          const exists = await window.electron.checkFileExists(item.filePath);
          if (exists) {
            validatedQueue.push({
              ...item,
              file: {
                name: item.fileName,
                path: item.filePath,
                size: item.fileSize,
              },
            });
          }
        }
        
        setQueue(validatedQueue);
        setOverwriteFiles(data.settings.overwriteFiles ?? false);
        setMaxConcurrentJobs(data.settings.maxConcurrentJobs ?? 1);
        
        if (window.electron.showNotification) {
          window.electron.showNotification({
            title: 'Queue Loaded',
            body: `Loaded ${validatedQueue.length} items from queue`,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load queue:', error);
      alert(`Failed to load queue: ${error.message}`);
    }
  };

  const handleExportReport = async () => {
    try {
      const completedItems = queue.filter(item => item.status === QueueStatus.COMPLETED);
      const failedItems = queue.filter(item => item.status === QueueStatus.FAILED);
      
      const totalOriginalSize = queue.reduce((sum, item) => sum + (item.originalSize || 0), 0);
      const totalCompressedSize = completedItems.reduce((sum, item) => sum + (item.compressedSize || 0), 0);
      const spaceSaved = totalOriginalSize - totalCompressedSize;
      const compressionRatio = totalOriginalSize > 0 ? (totalCompressedSize / totalOriginalSize) : 0;

      const filePath = await window.electron.saveFileDialog({
        title: 'Export Report',
        defaultPath: `streamline-report-${new Date().toISOString().split('T')[0]}.slreport`,
        filters: [
          { name: 'Streamline Report', extensions: ['slreport'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (filePath) {
        await window.electron.saveReport(filePath, {
          reportType: 'queue',
          totalItems: queue.length,
          completedItems: completedItems.length,
          failedItems: failedItems.length,
          totalOriginalSize,
          totalCompressedSize,
          spaceSaved,
          compressionRatio,
          items: queue.map(item => ({
            fileName: item.file.name,
            filePath: item.file.path,
            status: item.status,
            preset: item.preset?.name || 'Custom',
            originalSize: item.originalSize,
            compressedSize: item.compressedSize,
            savings: item.compressedSize ? ((item.originalSize - item.compressedSize) / item.originalSize * 100).toFixed(1) : null,
            qualityMetrics: item.qualityMetrics,
            error: item.error,
          })),
          settings: {
            overwriteFiles,
            outputDirectory,
          },
        });
        
        if (window.electron.showNotification) {
          window.electron.showNotification({
            title: 'Report Exported',
            body: `Report exported to ${filePath}`,
          });
        }
      }
    } catch (error) {
      console.error('Failed to export report:', error);
      alert(`Failed to export report: ${error.message}`);
    }
  };

  const handleExportPreset = async () => {
    if (!selectedPreset) {
      alert('Please select a preset to export');
      return;
    }

    try {
      const filePath = await window.electron.saveFileDialog({
        title: 'Export Preset',
        defaultPath: `${selectedPreset.name.replace(/\s+/g, '-').toLowerCase()}.slpreset`,
        filters: [
          { name: 'Streamline Preset', extensions: ['slpreset'] },
          { name: 'JSON', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (filePath) {
        await window.electron.savePreset(filePath, {
          ...selectedPreset,
          settings: advancedSettings,
        });
        
        if (window.electron.showNotification) {
          window.electron.showNotification({
            title: 'Preset Exported',
            body: `Preset "${selectedPreset.name}" exported`,
          });
        }
      }
    } catch (error) {
      console.error('Failed to export preset:', error);
      alert(`Failed to export preset: ${error.message}`);
    }
  };

  const handleImportPreset = async () => {
    try {
      const filePath = await window.electron.openFileDialog({
        title: 'Import Preset',
        filters: [
          { name: 'Streamline Preset', extensions: ['slpreset', 'json'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (filePath) {
        const data = await window.electron.loadPreset(filePath);
        
        // Apply the loaded preset
        setSelectedPreset(data.preset);
        if (data.preset.settings) {
          setAdvancedSettings(data.preset.settings);
          setShowAdvanced(true);
        }
        
        if (window.electron.showNotification) {
          window.electron.showNotification({
            title: 'Preset Imported',
            body: `Preset "${data.preset.name}" imported`,
          });
        }
      }
    } catch (error) {
      console.error('Failed to import preset:', error);
      alert(`Failed to import preset: ${error.message}`);
    }
  };

  const handleExportAnalysis = async () => {
    if (!files || files.length === 0 || !fileInfo) {
      alert('Please select and analyze a file first');
      return;
    }

    try {
      const file = files[0];
      const filePath = await window.electron.saveFileDialog({
        title: 'Export Analysis',
        defaultPath: `${file.name}-analysis.slanalysis`,
        filters: [
          { name: 'Streamline Analysis', extensions: ['slanalysis'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (filePath) {
        await window.electron.saveAnalysis(filePath, {
          fileName: file.name,
          filePath: file.path,
          fileSize: file.size,
          fileInfo,
          bitrateAnalysis: null, // Will be populated if available
          sceneDetection: null,
          contentAnalysis: null,
          recommendations: null,
          metadata: {
            analyzedAt: new Date().toISOString(),
            streamlineVersion: '0.5.0',
          },
        });
        
        if (window.electron.showNotification) {
          window.electron.showNotification({
            title: 'Analysis Exported',
            body: `Analysis exported to ${filePath}`,
          });
        }
      }
    } catch (error) {
      console.error('Failed to export analysis:', error);
      alert(`Failed to export analysis: ${error.message}`);
    }
  };

  const handleImportAnalysis = async () => {
    try {
      const filePath = await window.electron.openFileDialog({
        title: 'Import Analysis',
        filters: [
          { name: 'Streamline Analysis', extensions: ['slanalysis'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (filePath) {
        const data = await window.electron.loadAnalysis(filePath);
        
        // Apply the loaded analysis
        setFileInfo(data.fileInfo);
        
        if (window.electron.showNotification) {
          window.electron.showNotification({
            title: 'Analysis Imported',
            body: `Analysis for "${data.sourceFile.name}" imported`,
          });
        }
      }
    } catch (error) {
      console.error('Failed to import analysis:', error);
      alert(`Failed to import analysis: ${error.message}`);
    }
  };




  const getOutputPath = async (inputPath, preset, customSettings = {}) => {
    // Determine the output extension based on preset/custom settings
    const getOutputExtension = () => {
      // Check custom settings first
      if (customSettings?.outputFormat) {
        return `.${customSettings.outputFormat}`;
      }
      
      // Then check preset settings
      if (preset?.settings?.outputFormat) {
        return `.${preset.settings.outputFormat}`;
      }
      
      // Default: use original extension
      return null;
    };
    
    if (!window.electron || !window.electron.pathDirname) {
      // Fallback for browser environment
      const parts = inputPath.split(/[/\\]/);
      const fileName = parts[parts.length - 1];
      const dir = parts.slice(0, -1).join('/');
      const extMatch = fileName.match(/(\.[^.]+)$/);
      const originalExt = extMatch ? extMatch[1] : '';
      const baseName = fileName.replace(/(\.[^.]+)$/, '');
      
      const outputExt = getOutputExtension() || originalExt;
      
      if (batchMode) {
        const outputDir = outputDirectory || `${dir}/optimised`;
        const outputFileName = overwriteFiles ? `${baseName}${outputExt}` : `${baseName}_optimised${outputExt}`;
        return `${outputDir}/${outputFileName}`;
      } else {
        const outputFileName = overwriteFiles ? `${baseName}${outputExt}` : `${baseName}_optimised${outputExt}`;
        return `${dir}/${outputFileName}`;
      }
    }

    const dir = await window.electron.pathDirname(inputPath);
    const ext = await window.electron.pathExtname(inputPath);
    const base = await window.electron.pathBasename(inputPath, ext);
    
    const outputExt = getOutputExtension() || ext;
    
    if (batchMode) {
      const outputDir = outputDirectory || await window.electron.pathJoin(dir, 'optimised');
      const outputFileName = overwriteFiles ? `${base}${outputExt}` : `${base}_optimised${outputExt}`;
      return await window.electron.pathJoin(outputDir, outputFileName);
    } else {
      const outputFileName = overwriteFiles ? `${base}${outputExt}` : `${base}_optimised${outputExt}`;
      return await window.electron.pathJoin(dir, outputFileName);
    }
  };

  const getHardwareAcceleration = () => {
    if (!hardwareSupport) return { enabled: false };

    // Determine best available hardware acceleration
    if (hardwareSupport.nvidia.h264 || hardwareSupport.nvidia.hevc) {
      return { enabled: true, type: 'nvidia' };
    } else if (hardwareSupport.amd.h264 || hardwareSupport.amd.hevc) {
      return { enabled: true, type: 'amd' };
    } else if (hardwareSupport.intel.h264 || hardwareSupport.intel.hevc) {
      return { enabled: true, type: 'intel' };
    } else if (hardwareSupport.apple.h264 || hardwareSupport.apple.hevc) {
      return { enabled: true, type: 'apple' };
    }

    return { enabled: false };
  };

  // Get filtered presets based on file type (including custom presets)
  const allPresets = getAllPresets();
  const availablePresets = fileType && files.length > 0 
    ? filterPresetsByFileType(allPresets, fileType, files[0]) 
    : fileType 
      ? filterPresetsByFileType(allPresets, fileType)
      : allPresets;

  const themeClasses = getThemeClasses(settings.theme);

  if (showSplash) {
    return (
      <div className={settings.theme === 'light' ? 'light' : 'dark'}>
        <div className={themeClasses.container}>
          <TitleBar />
          <div className="pt-8">
            <SplashScreen onComplete={handleSplashComplete} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={settings.theme === 'light' ? 'light' : 'dark'}>
      <div className={themeClasses.container}>
        <TitleBar />
        <div className="pt-8">
          <Header 
            hardwareSupport={hardwareSupport}
            onStartEncode={handleEncode}
            isProcessingBatch={isProcessingBatch}
            queueLength={queue.length}
            onShowShortcuts={() => setShowShortcutsHelp(true)}
          />
          <ModeTabs currentMode={currentMode} onModeChange={setCurrentMode} />
        </div>
      
      <main className="container mx-auto px-4 py-8">
        {currentMode === 'analysis' ? (
          <AnalysisPanel 
            files={files} 
            fileInfo={fileInfo}
            onExportAnalysis={handleExportAnalysis}
            onImportAnalysis={handleImportAnalysis}
          />
        ) : currentMode === 'trimconcat' ? (
          <VideoTrimConcat />
        ) : currentMode === 'download' ? (
          <Download />
        ) : currentMode === 'presets' ? (
          <PresetManager />
        ) : currentMode === 'import' ? (
          /* Import Mode - Just drop zone and basic info */
          <div className="space-y-6">
            <DropZone onFilesAdded={handleFilesAdded} files={files} fileType={fileType} />
            
            {fileInfo && (
              <BasicFileInfo 
                fileInfo={fileInfo} 
                isAnalyzing={isAnalyzing}
              />
            )}

            {/* Batch Queue */}
            {queue.length > 0 && (
              <BatchQueue 
                queue={queue}
                onRemoveItem={handleRemoveQueueItem}
                onClearCompleted={handleClearCompleted}
                onStartBatch={handleEncode}
                isProcessing={isProcessingBatch}
                onSaveQueue={handleSaveQueue}
                onLoadQueue={handleLoadQueue}
                onExportReport={handleExportReport}
              />
            )}
          </div>
        ) : (
          /* Encode Mode - Full encoding interface */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Selected Files & Queue */}
          <div className="lg:col-span-2 space-y-6">
            {fileInfo && (
              <BasicFileInfo 
                fileInfo={fileInfo} 
                isAnalyzing={isAnalyzing}
              />
            )}

            {isProcessingBatch && encodingProgress && (
              <EncodingProgress progress={encodingProgress} />
            )}

            {/* Batch Queue */}
            {queue.length > 0 && (
              <BatchQueue 
                queue={queue}
                onRemoveItem={handleRemoveQueueItem}
                onClearCompleted={handleClearCompleted}
                onStartBatch={handleEncode}
                isProcessing={isProcessingBatch}
                onSaveQueue={handleSaveQueue}
                onLoadQueue={handleLoadQueue}
                onExportReport={handleExportReport}
              />
            )}
            
            {/* Show message if no files */}
            {queue.length === 0 && (
              <div className={`p-12 rounded-lg border-2 border-dashed text-center ${
                settings.theme === 'dark' 
                  ? 'border-gray-700 bg-surface-elevated' 
                  : 'border-gray-300 bg-gray-50'
              }`}>
                <svg className={`w-16 h-16 mx-auto mb-4 ${
                  settings.theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h3 className={`text-lg font-semibold mb-2 ${
                  settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  No Files Selected
                </h3>
                <p className={`${
                  settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Switch to Import tab to add files to the queue
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            <OutputSettings 
              outputDirectory={outputDirectory}
              onOutputDirectoryChange={setOutputDirectory}
              overwriteFiles={overwriteFiles}
              onOverwriteChange={setOverwriteFiles}
            />

            <PresetSelector
              selectedPreset={selectedPreset}
              onPresetSelect={setSelectedPreset}
              disabled={showAdvanced}
              presets={availablePresets}
              fileType={fileType}
              onExportPreset={handleExportPreset}
              onImportPreset={handleImportPreset}
            />

            <div className="card">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full text-left flex items-center justify-between"
              >
                <span className="font-semibold">Advanced Settings</span>
                <span className="text-2xl">{showAdvanced ? '−' : '+'}</span>
              </button>
            </div>

            {showAdvanced && (
              <AdvancedSettings
                settings={advancedSettings}
                onSettingsChange={setAdvancedSettings}
                hardwareSupport={hardwareSupport}
                selectedPreset={selectedPreset}
                fileType={fileType}
                fileInfo={fileInfo}
              />
            )}

            <button
              onClick={handleEncode}
              disabled={isProcessingBatch || queue.length === 0}
              className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingBatch 
                ? 'Processing...' 
                : queue.length > 1 
                  ? `Start Batch (${queue.filter(item => item.status === QueueStatus.PENDING).length})` 
                  : 'Start Encode'}
            </button>
          </div>
        </div>
        )}
      </main>
      </div>
      <UpdateNotification />
      <KeyboardShortcutsHelp 
        isOpen={showShortcutsHelp} 
        onClose={() => setShowShortcutsHelp(false)}
        theme={settings.theme}
      />
    </div>
  );
}

export default App;

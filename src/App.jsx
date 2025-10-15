import React, { useState, useEffect } from 'react';
import DropZone from './components/DropZone';
import PresetSelector from './components/PresetSelector';
import FileInfo from './components/FileInfo';
import AdvancedSettings from './components/AdvancedSettings';
import EncodingProgress from './components/EncodingProgress';
import OutputSettings from './components/OutputSettings';
import Header from './components/Header';
import TitleBar from './components/TitleBar';
import SplashScreen from './components/SplashScreen';
import BatchQueue, { QueueStatus } from './components/BatchQueue';
import { useSettings } from './contexts/SettingsContext';
import { detectFileType, filterPresetsByFileType, getRecommendedPreset } from './utils/fileTypeDetection';
import { getThemeClasses } from './utils/themeUtils';

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
    }

    return () => {
      if (window.electron) {
        window.electron.removeEncodingProgressListener();
      }
    };
  }, [currentQueueItemId]);

  const handleSplashComplete = (support) => {
    setHardwareSupport(support);
    setShowSplash(false);
  };

  const handleFilesAdded = async (newFiles) => {
    // Add files to batch queue instead of replacing
    const newQueueItems = newFiles.map((file, index) => {
      const detectedType = detectFileType(file);
      const allPresets = getAllPresets();
      const recommended = getRecommendedPreset(detectedType, allPresets, file);
      
      return {
        id: Date.now() + index,
        file,
        fileType: detectedType,
        preset: selectedPreset || recommended,
        customSettings: showAdvanced ? advancedSettings : {},
        status: QueueStatus.PENDING,
        progress: null,
        originalSize: file.size,
        compressedSize: null,
        error: null,
        qualityMetrics: null,
      };
    });
    
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
        const outputPath = await getOutputPath(inputPath);

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
          customSettings: item.customSettings,
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

  const getOutputPath = async (inputPath) => {
    if (!window.electron || !window.electron.pathDirname) {
      // Fallback for browser environment
      const parts = inputPath.split(/[/\\]/);
      const fileName = parts[parts.length - 1];
      const dir = parts.slice(0, -1).join('/');
      
      if (batchMode) {
        const outputDir = outputDirectory || `${dir}/optimised`;
        const outputFileName = overwriteFiles ? fileName : fileName.replace(/(\.[^.]+)$/, '_optimised$1');
        return `${outputDir}/${outputFileName}`;
      } else {
        const outputFileName = overwriteFiles ? fileName : fileName.replace(/(\.[^.]+)$/, '_optimised$1');
        return `${dir}/${outputFileName}`;
      }
    }

    const dir = await window.electron.pathDirname(inputPath);
    const ext = await window.electron.pathExtname(inputPath);
    const base = await window.electron.pathBasename(inputPath, ext);
    
    if (batchMode) {
      const outputDir = outputDirectory || await window.electron.pathJoin(dir, 'optimised');
      const outputFileName = overwriteFiles ? `${base}${ext}` : `${base}_optimised${ext}`;
      return await window.electron.pathJoin(outputDir, outputFileName);
    } else {
      const outputFileName = overwriteFiles ? `${base}${ext}` : `${base}_optimised${ext}`;
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
          <Header hardwareSupport={hardwareSupport} />
        </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - File Input */}
          <div className="lg:col-span-2 space-y-6">
            <DropZone onFilesAdded={handleFilesAdded} files={files} fileType={fileType} />
            
            {fileInfo && (
              <FileInfo 
                info={fileInfo} 
                isAnalyzing={isAnalyzing}
                filePath={files.length > 0 ? files[0].path : null}
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
              />
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
      </main>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

const TEST_VIDEOS = [
  {
    name: 'Built-in Test Pattern (30s, 1080p)',
    url: 'builtin:benchmark',
    resolution: '1080p',
    size: '~10MB',
    builtin: true
  },
  {
    name: 'Big Buck Bunny 480p',
    url: 'http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_surround-fix.avi',
    resolution: '480p',
    size: '~300MB'
  },
  {
    name: 'Big Buck Bunny 720p',
    url: 'http://mirror.bigbuckbunny.de/peach/bigbuckbunny_movies/big_buck_bunny_720p_surround.avi',
    resolution: '720p',
    size: '~700MB'
  },
  {
    name: 'Big Buck Bunny 1080p 30fps',
    url: 'http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4',
    resolution: '1080p',
    size: '~350MB'
  },
  {
    name: 'Big Buck Bunny 4K',
    url: 'http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_2160p_30fps_normal.mp4',
    resolution: '2160p',
    size: '~750MB'
  }
];

function Benchmark() {
  const { settings } = useSettings();
  const [selectedVideo, setSelectedVideo] = useState(TEST_VIDEOS[0]);
  const [downloadedPath, setDownloadedPath] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [testProgress, setTestProgress] = useState(0);
  const [totalTests, setTotalTests] = useState(0);
  const [results, setResults] = useState([]);
  const [systemInfo, setSystemInfo] = useState(null);
  const [savedBenchmarks, setSavedBenchmarks] = useState([]);
  const [availableCodecs, setAvailableCodecs] = useState([]);
  const [enabledTests, setEnabledTests] = useState({});
  const [showTestList, setShowTestList] = useState(false);
  const [cancelBenchmark, setCancelBenchmark] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [sortBy, setSortBy] = useState('speed');
  const [showComparison, setShowComparison] = useState(false);
  const [benchmarkStep, setBenchmarkStep] = useState('idle'); // 'idle' | 'detecting' | 'downloading' | 'benchmarking' | 'complete'
  const [detectionResults, setDetectionResults] = useState(null);
  const [detectionRunning, setDetectionRunning] = useState(false);
  const [detectionProgress, setDetectionProgress] = useState(0);
  const [currentBenchmarkProgress, setCurrentBenchmarkProgress] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [benchmarkVideoPaths, setBenchmarkVideoPaths] = useState([]);
  const [benchmarkStatuses, setBenchmarkStatuses] = useState({});  // Track status of each test

  const bgColor = settings.theme === 'dark' ? 'bg-surface' : 'bg-white';
  const borderColor = settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textColor = settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const cardBg = settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50';

  useEffect(() => {
    loadSystemInfo();
    loadSavedBenchmarks();
    loadCachedDetection();
  }, []);

  const buildAvailableCodecs = (detectedEncoders) => {
    // Build codec list from actually detected encoders
    if (!detectedEncoders || !Array.isArray(detectedEncoders)) return [];

    return detectedEncoders.map(encoder => ({
      name: encoder.name,
      codec: encoder.codec,
      hwAccel: encoder.hwAccel
    }));
  };

  const updateEstimatedTime = (enabledMap) => {
    const enabledCount = Object.values(enabledMap || enabledTests).filter(v => v).length;
    // Rough time estimates based on codec type and resolution
    const baseTime = selectedVideo.resolution === '2160p' ? 90 : 
                     selectedVideo.resolution === '1080p' ? 45 : 30;
    setEstimatedTime(enabledCount * baseTime);
  };

  const loadSystemInfo = async () => {
    try {
      const info = await window.electron.getSystemInfo();
      setSystemInfo(info);
    } catch (error) {
      console.error('Failed to get system info:', error);
    }
  };

  const loadSavedBenchmarks = async () => {
    try {
      const benchmarks = await window.electron.getSavedBenchmarks();
      setSavedBenchmarks(benchmarks);
    } catch (error) {
      console.error('Failed to load saved benchmarks:', error);
    }
  };

  const loadCachedDetection = async () => {
    // No longer using cached detection - user needs to run detection each time
    // This ensures fresh results and matches the first-time setup experience
  };

  const runEncoderDetection = async () => {
    setDetectionRunning(true);
    setBenchmarkStep('detecting');
    setDetectionProgress(0);

    try {
      // Test all possible codec combinations with a 2-frame test video
      // This matches the first-time setup experience logic
      const testsToRun = [
        // Software encoders (always test these as baseline)
        { codec: 'h264', hwAccel: null, name: 'H.264 (Software)' },
        { codec: 'h265', hwAccel: null, name: 'H.265 (Software)' },
        { codec: 'av1', hwAccel: null, name: 'AV1 (Software)' },
        { codec: 'vp9', hwAccel: null, name: 'VP9 (Software)' },
        { codec: 'vp8', hwAccel: null, name: 'VP8 (Software)' },
        // Hardware encoders - NVIDIA
        { codec: 'h264', hwAccel: 'nvidia', name: 'H.264 (NVIDIA NVENC)' },
        { codec: 'h265', hwAccel: 'nvidia', name: 'H.265 (NVIDIA NVENC)' },
        { codec: 'av1', hwAccel: 'nvidia', name: 'AV1 (NVIDIA NVENC)' },
        // Hardware encoders - AMD
        { codec: 'h264', hwAccel: 'amd', name: 'H.264 (AMD AMF)' },
        { codec: 'h265', hwAccel: 'amd', name: 'H.265 (AMD AMF)' },
        { codec: 'av1', hwAccel: 'amd', name: 'AV1 (AMD AMF)' },
        // Hardware encoders - Intel
        { codec: 'h264', hwAccel: 'intel', name: 'H.264 (Intel QSV)' },
        { codec: 'h265', hwAccel: 'intel', name: 'H.265 (Intel QSV)' },
        { codec: 'av1', hwAccel: 'intel', name: 'AV1 (Intel QSV)' },
        { codec: 'vp9', hwAccel: 'intel', name: 'VP9 (Intel QSV)' },
        // Hardware encoders - Apple
        { codec: 'h264', hwAccel: 'apple', name: 'H.264 (Apple VideoToolbox)' },
        { codec: 'h265', hwAccel: 'apple', name: 'H.265 (Apple VideoToolbox)' },
        { codec: 'prores', hwAccel: 'apple', name: 'ProRes (Apple VideoToolbox)' }
      ];

      const detectedEncoders = [];
      const failedEncoders = [];

      // Test each codec with a 2-frame test video
      for (let index = 0; index < testsToRun.length; index++) {
        const test = testsToRun[index];
        
        // Update progress
        setCurrentTest(test.name);
        setDetectionProgress(Math.round((index / testsToRun.length) * 100));
        
        try {
          await window.electron.runBenchmarkTest({
            inputPath: 'builtin:2frame',
            codec: test.codec,
            hwAccel: test.hwAccel,
            resolution: '1080p'
          });
          
          detectedEncoders.push({
            name: test.name,
            codec: test.codec,
            hwAccel: test.hwAccel,
            available: true
          });
        } catch (error) {
          failedEncoders.push({
            name: test.name,
            codec: test.codec,
            hwAccel: test.hwAccel,
            available: false,
            error: error.message
          });
        }
      }

      setDetectionProgress(100);
      setCurrentTest('');

      const results = {
        detectedEncoders,
        failedEncoders,
        totalTested: testsToRun.length,
        detectionDate: new Date().toISOString()
      };

      setDetectionResults(results);

      // Build available codecs from detected encoders
      const codecs = buildAvailableCodecs(results.detectedEncoders);
      setAvailableCodecs(codecs);
      
      // Enable all detected encoders by default
      const newEnabled = {};
      codecs.forEach(codec => {
        newEnabled[codec.name] = true;
      });
      setEnabledTests(newEnabled);
      updateEstimatedTime(newEnabled);

      // Move to next step after detection completes
      setBenchmarkStep('download');
    } catch (error) {
      alert(`Failed to detect encoders: ${error.message}`);
      setBenchmarkStep('idle');
    } finally {
      setDetectionRunning(false);
      setDetectionProgress(0);
      setCurrentTest('');
    }
  };

  const handleDownloadTestVideo = async () => {
    // Handle built-in test video generation
    if (selectedVideo.builtin && selectedVideo.url === 'builtin:benchmark') {
      setDownloading(true);
      setDownloadProgress(0);
      
      try {
        const result = await window.electron.generateBenchmarkVideo();
        setDownloadedPath(result.filePath);
        setBenchmarkStep('benchmark');
      } catch (error) {
        alert(`Failed to generate test video: ${error.message}`);
      } finally {
        setDownloading(false);
        setDownloadProgress(0);
      }
      return;
    }
    
    // Handle regular video downloads
    setDownloading(true);
    setDownloadProgress(0);

    try {
      window.electron.onDownloadProgress((data) => {
        // Only update if this is the download for our selected video
        if (data.url === selectedVideo.url) {
          setDownloadProgress(data.progress);
        }
      });

      const result = await window.electron.downloadBenchmarkVideo(selectedVideo.url);
      setDownloadedPath(result.filePath);
      window.electron.removeDownloadProgressListener();
      
      // Move to benchmarking step after download
      setBenchmarkStep('benchmark');
    } catch (error) {
      alert(`Failed to download test video: ${error.message}`);
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  const runBenchmark = async () => {
    if (!downloadedPath) {
      alert('Please download a test video first');
      return;
    }

    setRunning(true);
    setCancelBenchmark(false);
    setResults([]);
    setBenchmarkStep('benchmarking');
    setBenchmarkVideoPaths([]);

    // Initialize benchmark statuses
    const testsToRun = availableCodecs.filter(codec => enabledTests[codec.name]);
    const initialStatuses = {};
    testsToRun.forEach(codec => {
      initialStatuses[codec.name] = 'pending';
    });
    setBenchmarkStatuses(initialStatuses);

    // Set up benchmark progress listener
    window.electron.onBenchmarkProgress((data) => {
      setCurrentBenchmarkProgress(data.progress);
    });

    // Verify the downloaded file exists and is readable
    try {
      const fileExists = await window.electron.checkFileExists(downloadedPath);
      if (!fileExists) {
        throw new Error(`Downloaded file not found: ${downloadedPath}`);
      }
    } catch (checkError) {
      alert(`File validation failed: ${checkError.message}`);
      setRunning(false);
      setBenchmarkStep('download');
      window.electron.removeBenchmarkProgressListener();
      return;
    }

    setTotalTests(testsToRun.length);
    const benchmarkResults = [];
    const videoPaths = [];

    for (let index = 0; index < testsToRun.length; index++) {
      // Check if user clicked cancel
      if (cancelBenchmark) {
        console.log('Benchmark cancelled by user');
        break;
      }

      const codecTest = testsToRun[index];
      setCurrentTest(codecTest.name);
      setTestProgress(index);
      setCurrentBenchmarkProgress(null);
      
      // Mark as running
      setBenchmarkStatuses(prev => ({ ...prev, [codecTest.name]: 'running' }));

      try {
        const result = await window.electron.runBenchmarkTest({
          inputPath: downloadedPath,
          codec: codecTest.codec,
          hwAccel: codecTest.hwAccel,
          resolution: selectedVideo.resolution
        });

        benchmarkResults.push({
          ...codecTest,
          ...result,
          encoderType: codecTest.hwAccel ? 'hardware' : 'software',
          timestamp: new Date().toISOString()
        });

        // Mark as complete
        setBenchmarkStatuses(prev => ({ ...prev, [codecTest.name]: 'complete' }));

        // Collect video paths for later archiving/cleanup
        if (result.outputPath) {
          videoPaths.push(result.outputPath);
        }

        setResults([...benchmarkResults]);
      } catch (error) {
        console.error(`Benchmark failed for ${codecTest.name}:`, error);
        benchmarkResults.push({
          ...codecTest,
          error: error.message,
          encoderType: codecTest.hwAccel ? 'hardware' : 'software',
          timestamp: new Date().toISOString()
        });
        
        // Mark as failed
        setBenchmarkStatuses(prev => ({ ...prev, [codecTest.name]: 'failed' }));
        
        setResults([...benchmarkResults]);
      }
    }

    window.electron.removeBenchmarkProgressListener();
    setBenchmarkVideoPaths(videoPaths);
    setRunning(false);
    setCurrentTest(null);
    setTestProgress(0);
    setTotalTests(0);
    setCancelBenchmark(false);
    setCurrentBenchmarkProgress(null);
    setBenchmarkStep('complete');
    
    // Show completion modal after a small delay to ensure state updates
    setTimeout(() => {
      setShowCompletionModal(true);
    }, 100);
  };

  const toggleTest = (testName) => {
    const newEnabled = {
      ...enabledTests,
      [testName]: !enabledTests[testName]
    };
    setEnabledTests(newEnabled);
    updateEstimatedTime(newEnabled);
  };

  const selectAllTests = () => {
    const newEnabled = {};
    availableCodecs.forEach(codec => {
      newEnabled[codec.name] = true;
    });
    setEnabledTests(newEnabled);
    updateEstimatedTime(newEnabled);
  };

  const deselectAllTests = () => {
    const newEnabled = {};
    availableCodecs.forEach(codec => {
      newEnabled[codec.name] = false;
    });
    setEnabledTests(newEnabled);
    updateEstimatedTime(newEnabled);
  };

  const saveBenchmark = async () => {
    if (results.length === 0) {
      alert('No benchmark results to save');
      return;
    }

    try {
      const filePath = await window.electron.saveBenchmark({
        results,
        systemInfo,
        testVideo: selectedVideo,
        timestamp: new Date().toISOString()
      });

      if (filePath) {
        alert(`Benchmark saved to ${filePath}`);
        loadSavedBenchmarks();
      }
    } catch (error) {
      alert(`Failed to save benchmark: ${error.message}`);
    }
  };

  const saveBenchmarkReport = async () => {
    if (results.length === 0) {
      alert('No benchmark results to save');
      return;
    }

    try {
      const filePath = await window.electron.saveBenchmarkReport({
        results,
        systemInfo,
        testVideo: selectedVideo,
        timestamp: new Date().toISOString()
      });

      if (filePath) {
        alert(`Benchmark report saved to ${filePath}`);
      }
    } catch (error) {
      alert(`Failed to save benchmark report: ${error.message}`);
    }
  };

  const archiveBenchmarkWithVideos = async () => {
    if (results.length === 0 || benchmarkVideoPaths.length === 0) {
      alert('No benchmark results or videos to archive');
      return;
    }

    try {
      const result = await window.electron.archiveBenchmarkWithVideos({
        benchmarkData: {
          results,
          systemInfo,
          testVideo: selectedVideo,
          timestamp: new Date().toISOString()
        },
        videoPaths: benchmarkVideoPaths
      });

      if (result) {
        alert(`Benchmark archive saved to ${result.filePath} (${(result.size / 1024 / 1024).toFixed(2)} MB)`);
      }
    } catch (error) {
      alert(`Failed to create archive: ${error.message}`);
    }
  };

  const cleanupBenchmarkVideos = async () => {
    if (benchmarkVideoPaths.length === 0) {
      alert('No videos to cleanup');
      return;
    }

    try {
      const result = await window.electron.cleanupBenchmarkVideos(benchmarkVideoPaths);
      if (result.success) {
        alert(`Cleaned up ${result.deleted} video(s)`);
        setBenchmarkVideoPaths([]);
      }
    } catch (error) {
      alert(`Failed to cleanup videos: ${error.message}`);
    }
  };

  const loadBenchmark = async (filePath) => {
    try {
      const data = await window.electron.loadBenchmark(filePath);
      setResults(data.results);
      setSystemInfo(data.systemInfo);
    } catch (error) {
      alert(`Failed to load benchmark: ${error.message}`);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const formatEstimatedTime = (totalSeconds) => {
    if (totalSeconds < 60) return `~${totalSeconds}s`;
    const minutes = Math.floor(totalSeconds / 60);
    if (minutes < 60) return `~${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `~${hours}h ${remainingMins}m`;
  };

  const getVideoSizeDisplay = (video) => {
    // Only show download status for the currently selected video
    if (selectedVideo.url === video.url) {
      if (downloading) return `Downloading... ${downloadProgress}%`;
      if (downloadedPath) return '✓ Downloaded';
    }
    return video.size;
  };

  const sortResults = (results, sortBy) => {
    return [...results].sort((a, b) => {
      if (a.error && !b.error) return 1;
      if (!a.error && b.error) return -1;
      if (a.error && b.error) return 0;
      
      switch (sortBy) {
        case 'speed':
          return b.speed - a.speed; // Descending (faster first)
        case 'duration':
          return a.duration - b.duration; // Ascending (faster first)
        case 'fps':
          return b.fps - a.fps; // Descending (higher first)
        case 'fileSize':
          return a.fileSize - b.fileSize; // Ascending (smaller first)
        case 'codec':
          return a.codec.localeCompare(b.codec);
        default:
          return 0;
      }
    });
  };

  const getBestResult = (results, metric) => {
    const validResults = results.filter(r => !r.error);
    if (validResults.length === 0) return null;
    
    switch (metric) {
      case 'speed':
        return validResults.reduce((best, current) => 
          current.speed > best.speed ? current : best
        );
      case 'fps':
        return validResults.reduce((best, current) => 
          current.fps > best.fps ? current : best
        );
      case 'efficiency': // Best speed/fileSize ratio
        return validResults.reduce((best, current) => {
          const currentRatio = current.speed / (current.fileSize / 1024 / 1024);
          const bestRatio = best.speed / (best.fileSize / 1024 / 1024);
          return currentRatio > bestRatio ? current : best;
        });
      default:
        return validResults[0];
    }
  };

  const formatSpeed = (speed) => {
    return `${speed.toFixed(2)}x`;
  };

  return (
    <div className={`${bgColor} min-h-screen p-6`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary-400 mb-2">Benchmark Mode</h1>
          <p className={textColor}>
            Run standardized encoding tests to measure your system's performance with different codecs and hardware acceleration options.
          </p>
        </div>

        {/* Multi-Step Progress Indicator */}
        {benchmarkStep !== 'idle' && benchmarkStep !== 'complete' && (
          <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-primary-400">Benchmark Progress</h3>
              <span className="text-sm text-gray-500">
                {benchmarkStep === 'detecting' && 'Step 1/3: Detecting Encoders'}
                {benchmarkStep === 'download' && 'Step 2/3: Select Test Video'}
                {benchmarkStep === 'benchmark' && 'Step 3/3: Running Benchmark'}
              </span>
            </div>
            <div className="flex gap-2">
              {['detecting', 'download', 'benchmark'].map((step, idx) => (
                <div key={step} className="flex-1 flex items-center gap-2">
                  <div className={`flex-1 h-2 rounded ${
                    benchmarkStep === step || (
                      (benchmarkStep === 'download' && idx > 0) ||
                      (benchmarkStep === 'benchmark' && idx > 1)
                    ) ? 'bg-primary-500' : 'bg-gray-700'
                  }`}></div>
                  {idx < 2 && <div className="w-0.5 h-2 bg-gray-700"></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Encoder Detection */}
        {(benchmarkStep === 'idle' || benchmarkStep === 'detecting') && (
          <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
            <h2 className="text-xl font-semibold mb-4 text-primary-400">Step 1: Detect Available Encoders</h2>
            <p className={`${textColor} mb-4`}>
              The benchmark will detect which encoders actually work on your system by testing all possible codec and hardware acceleration combinations. All detected encoders will be benchmarked.
            </p>
            
            {detectionRunning && (
              <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded">
                <div className="mb-2">
                  <p className="text-blue-400 font-semibold">Testing: {currentTest}</p>
                  <p className="text-blue-300 text-sm">Progress: {detectionProgress}%</p>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${detectionProgress}%` }}
                  />
                </div>
              </div>
            )}
            
            {detectionResults && !detectionRunning && (
              <div className="mb-4 space-y-3">
                <div className={`border ${borderColor} rounded p-3 bg-green-500/10 border-green-500/30`}>
                  <p className="text-green-400 text-sm font-semibold mb-2">Detection Complete</p>
                  <p className="text-green-300 text-sm">
                    Found {detectionResults.detectedEncoders.length} working encoder(s) out of {detectionResults.totalTested}
                  </p>
                </div>
                
                {detectionResults.detectedEncoders.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-primary-300 mb-2">Available Encoders:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {detectionResults.detectedEncoders.map((encoder, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-green-400">
                          <span>✓</span>
                          <span>{encoder.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={runEncoderDetection}
              disabled={detectionRunning}
              className="btn-primary w-full md:w-auto"
            >
              {detectionRunning ? 'Detecting Encoders...' : 'Start Encoder Detection'}
            </button>
          </div>
        )}

        {/* System Info */}
        {systemInfo && (
          <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
            <h2 className="text-xl font-semibold mb-4 text-primary-400">System Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {/* CPU Section */}
              <div className="space-y-2">
                <div className="font-semibold text-primary-300 border-b border-gray-700 pb-2">CPU</div>
                <div>
                  <span className="text-gray-500">Processor:</span>
                  <p className={textColor}>{systemInfo.cpu}</p>
                </div>
                <div>
                  <span className="text-gray-500">Cores:</span>
                  <p className={textColor}>{systemInfo.cpuCores}</p>
                </div>
                <div>
                  <span className="text-gray-500">Clock Speed:</span>
                  <p className={textColor}>{systemInfo.cpuSpeed}</p>
                </div>
              </div>

              {/* GPU Section */}
              <div className="space-y-2">
                <div className="font-semibold text-primary-300 border-b border-gray-700 pb-2">GPU</div>
                <div>
                  <span className="text-gray-500">Primary GPU:</span>
                  <p className={textColor}>{systemInfo.gpu}</p>
                </div>
                <div>
                  <span className="text-gray-500">VRAM:</span>
                  <p className={textColor}>{systemInfo.gpuMemory}</p>
                </div>
                {systemInfo.allGpus && systemInfo.allGpus.length > 1 && (
                  <div>
                    <span className="text-gray-500">Additional GPUs:</span>
                    {systemInfo.allGpus.slice(1).map((gpu, idx) => (
                      <p key={idx} className={textColor} style={{ fontSize: '0.875rem' }}>
                        {gpu.model} ({gpu.memory}MB)
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* RAM Section */}
              <div className="space-y-2">
                <div className="font-semibold text-primary-300 border-b border-gray-700 pb-2">Memory</div>
                <div>
                  <span className="text-gray-500">Total RAM:</span>
                  <p className={textColor}>{systemInfo.ramTotal} {systemInfo.ramType}</p>
                </div>
                <div>
                  <span className="text-gray-500">Used:</span>
                  <p className={textColor}>{systemInfo.ramUsed}</p>
                </div>
                <div>
                  <span className="text-gray-500">Available:</span>
                  <p className={textColor}>{systemInfo.ramAvailable}</p>
                </div>
              </div>

              {/* OS Section */}
              <div className="space-y-2">
                <div className="font-semibold text-primary-300 border-b border-gray-700 pb-2">Operating System</div>
                <div>
                  <span className="text-gray-500">OS:</span>
                  <p className={textColor}>{systemInfo.os}</p>
                </div>
                <div>
                  <span className="text-gray-500">Architecture:</span>
                  <p className={textColor}>{systemInfo.arch}</p>
                </div>
                <div>
                  <span className="text-gray-500">Hostname:</span>
                  <p className={textColor}>{systemInfo.hostname}</p>
                </div>
              </div>

              {/* Storage Section */}
              <div className="space-y-2">
                <div className="font-semibold text-primary-300 border-b border-gray-700 pb-2">Storage</div>
                <div>
                  <span className="text-gray-500">Primary Drive:</span>
                  <p className={textColor}>{systemInfo.drive}</p>
                </div>
              </div>

              {/* System Section */}
              <div className="space-y-2">
                <div className="font-semibold text-primary-300 border-b border-gray-700 pb-2">System</div>
                <div>
                  <span className="text-gray-500">Timezone:</span>
                  <p className={textColor}>{systemInfo.country}</p>
                </div>
                <div>
                  <span className="text-gray-500">Uptime:</span>
                  <p className={textColor}>{systemInfo.uptime}</p>
                </div>
                <div>
                  <span className="text-gray-500">Date/Time:</span>
                  <p className={textColor}>{systemInfo.date} {systemInfo.time}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Video Selection */}
        {(benchmarkStep === 'download' || benchmarkStep === 'benchmark' || benchmarkStep === 'complete') && (
          <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
            <h2 className="text-xl font-semibold mb-3 text-primary-400">Step 2: Select Test Video</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TEST_VIDEOS.map((video) => (
                <button
                  key={video.url}
                  onClick={() => {
                    setSelectedVideo(video);
                    updateEstimatedTime();
                  }}
                  disabled={downloading || running}
                  className={`p-3 rounded border text-left transition-colors ${
                    selectedVideo.url === video.url
                      ? 'border-primary-500 bg-primary-500/10'
                      : `border-gray-600 hover:border-primary-400`
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="font-semibold">{video.name}</div>
                  <div className="text-sm text-gray-500">
                    {video.resolution} • {getVideoSizeDisplay(video)}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4">
              {!downloadedPath ? (
                <button
                  onClick={handleDownloadTestVideo}
                  disabled={downloading}
                  className="btn-primary w-full md:w-auto"
                >
                  {downloading ? `Downloading... ${downloadProgress}%` : 'Download Test Video'}
                </button>
              ) : (
                <div className="flex items-center gap-2 text-green-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Test video ready</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Benchmark Configuration - Only show after detection and download */}
        {(benchmarkStep === 'benchmark' || benchmarkStep === 'complete') && (
          <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
            <h2 className="text-xl font-semibold mb-3 text-primary-400">Step 3: Configure & Run Benchmark</h2>
            
            {/* Detected Encoders Summary */}
            {detectionResults && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                <p className="text-blue-400 text-sm font-semibold mb-2">Detected Encoders ({detectionResults.detectedEncoders.length}):</p>
                <div className="text-blue-300 text-sm">{detectionResults.detectedEncoders.map(e => e.name).join(', ')}</div>
              </div>
            )}

            {/* Codec Selection */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-primary-300">Select Codecs to Benchmark:</p>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllTests}
                    disabled={running}
                    className="px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAllTests}
                    disabled={running}
                    className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className={`p-4 border ${borderColor} rounded bg-opacity-50`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {availableCodecs.map(codec => (
                    <label key={codec.name} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={enabledTests[codec.name] || false}
                        onChange={() => toggleTest(codec.name)}
                        disabled={running}
                        className="w-4 h-4"
                      />
                      <span className={textColor}>{codec.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Estimation Summary */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded mb-4">
              <div className="text-blue-400 font-semibold">
                {Object.values(enabledTests).filter(v => v).length} tests selected • Estimated time: {formatEstimatedTime(estimatedTime)}
              </div>
              <div className="text-blue-300 text-sm mt-1">
                Actual time may vary based on your hardware performance
              </div>
            </div>
          </div>
        )}

        {/* Run Benchmark Button */}
        {(benchmarkStep === 'benchmark' || benchmarkStep === 'complete') && (
          <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
            <h2 className="text-xl font-semibold mb-3 text-primary-400">Step 4: Execute Benchmark</h2>
            
            <div className="mb-4">
              {running ? (
                <div className="space-y-3">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-blue-400 font-semibold">Currently testing: {currentTest}</p>
                        <p className="text-blue-300 text-sm">Progress: {testProgress + 1} of {totalTests}</p>
                        {currentBenchmarkProgress && (
                          <div className="text-blue-200 text-xs mt-1 space-y-0.5">
                            <div>Frame: {currentBenchmarkProgress.frame || 0} | FPS: {currentBenchmarkProgress.fps?.toFixed(1) || 0} | Speed: {currentBenchmarkProgress.speed?.toFixed(2) || 0}x</div>
                            {currentBenchmarkProgress.time && (
                              <div>Time: {Math.floor(currentBenchmarkProgress.time / 60)}:{(currentBenchmarkProgress.time % 60).toFixed(1).padStart(4, '0')}</div>
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setCancelBenchmark(true)}
                        className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${((testProgress + 1) / totalTests) * 100}%` }}
                    />
                  </div>
                  <div className="text-blue-300 text-sm mt-2">
                    Estimated time remaining: {formatEstimatedTime((totalTests - testProgress - 1) * (estimatedTime / totalTests))}
                  </div>
                </div>

                {/* Benchmark Status Checklist */}
                <div className={`p-4 border ${borderColor} rounded bg-opacity-50`}>
                  <p className="text-sm font-semibold text-primary-300 mb-2">Benchmark Status:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {Object.entries(benchmarkStatuses).map(([name, status]) => (
                      <div key={name} className="flex items-center gap-2 text-sm">
                        {status === 'pending' && (
                          <span className="text-gray-500">⏳</span>
                        )}
                        {status === 'running' && (
                          <span className="text-blue-400 animate-pulse">▶️</span>
                        )}
                        {status === 'complete' && (
                          <span className="text-green-400">✅</span>
                        )}
                        {status === 'failed' && (
                          <span className="text-red-400">❌</span>
                        )}
                        <span className={
                          status === 'pending' ? 'text-gray-500' :
                          status === 'running' ? 'text-blue-400' :
                          status === 'complete' ? 'text-green-400' :
                          'text-red-400'
                        }>{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-lg font-semibold text-primary-300 mb-2">
                  Ready to benchmark {Object.values(enabledTests).filter(v => v).length} codec(s)
                </div>
                <div className="text-gray-500 text-sm mb-4">
                  Using {selectedVideo.name} • Estimated total time: {formatEstimatedTime(estimatedTime)}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={runBenchmark}
            disabled={!downloadedPath || running || Object.values(enabledTests).filter(v => v).length === 0}
            className="btn-primary w-full text-lg py-3"
          >
            {running ? 'Running Benchmark...' : 'Start Benchmark'}
          </button>
          
          {!downloadedPath && (
            <p className="text-yellow-500 text-sm mt-2 text-center">
              ⚠ Please download a test video first
            </p>
          )}
          
          {Object.values(enabledTests).filter(v => v).length === 0 && downloadedPath && (
            <p className="text-yellow-500 text-sm mt-2 text-center">
              ⚠ Please select at least one codec to test
            </p>
          )}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-primary-400">Benchmark Results</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowComparison(!showComparison)}
                  className="btn-secondary text-sm"
                >
                  {showComparison ? 'Hide' : 'Show'} Comparison
                </button>
                <button onClick={saveBenchmark} className="btn-secondary">
                  Save Results
                </button>
              </div>
            </div>

            {/* Performance Summary */}
            {showComparison && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded">
                  <div className="text-green-400 font-semibold">🏆 Fastest Encoding</div>
                  {(() => {
                    const best = getBestResult(results, 'speed');
                    return best ? (
                      <div className="text-sm mt-1">
                        <div>{best.name || `${best.codec.toUpperCase()} (${best.hwAccel || 'Software'})`}</div>
                        <div className="text-green-300">{formatSpeed(best.speed)}</div>
                      </div>
                    ) : <div className="text-sm text-gray-500">No valid results</div>;
                  })()}
                </div>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded">
                  <div className="text-blue-400 font-semibold">⚡ Highest FPS</div>
                  {(() => {
                    const best = getBestResult(results, 'fps');
                    return best ? (
                      <div className="text-sm mt-1">
                        <div>{best.name || `${best.codec.toUpperCase()} (${best.hwAccel || 'Software'})`}</div>
                        <div className="text-blue-300">{best.fps.toFixed(1)} FPS</div>
                      </div>
                    ) : <div className="text-sm text-gray-500">No valid results</div>;
                  })()}
                </div>
                
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded">
                  <div className="text-purple-400 font-semibold">🎯 Most Efficient</div>
                  {(() => {
                    const best = getBestResult(results, 'efficiency');
                    return best ? (
                      <div className="text-sm mt-1">
                        <div>{best.name || `${best.codec.toUpperCase()} (${best.hwAccel || 'Software'})`}</div>
                        <div className="text-purple-300">Best speed/size ratio</div>
                      </div>
                    ) : <div className="text-sm text-gray-500">No valid results</div>;
                  })()}
                </div>
              </div>
            )}

            {/* Sort Controls */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="text-sm text-gray-500 flex items-center">Sort by:</span>
              {[
                { key: 'speed', label: 'Speed' },
                { key: 'duration', label: 'Duration' },
                { key: 'fps', label: 'FPS' },
                { key: 'fileSize', label: 'File Size' },
                { key: 'codec', label: 'Codec' }
              ].map(sort => (
                <button
                  key={sort.key}
                  onClick={() => setSortBy(sort.key)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    sortBy === sort.key 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2">Codec</th>
                    <th className="text-left p-2">Acceleration</th>
                    <th className="text-right p-2">Duration</th>
                    <th className="text-right p-2">Speed</th>
                    <th className="text-right p-2">FPS</th>
                    <th className="text-right p-2">File Size</th>
                    <th className="text-right p-2">Bitrate</th>
                  </tr>
                </thead>
                <tbody>
                  {sortResults(results, sortBy).map((result, index) => {
                    const isBest = {
                      speed: result === getBestResult(results, 'speed'),
                      fps: result === getBestResult(results, 'fps'),
                      efficiency: result === getBestResult(results, 'efficiency')
                    };
                    
                    return (
                      <tr key={index} className={`border-b border-gray-800 ${result.error ? 'text-red-400' : ''} ${
                        isBest.speed || isBest.fps || isBest.efficiency ? 'bg-green-500/5' : ''
                      }`}>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {result.codec.toUpperCase()}
                            {(isBest.speed || isBest.fps || isBest.efficiency) && (
                              <span className="text-xs">🏆</span>
                            )}
                          </div>
                        </td>
                        <td className="p-2">{result.hwAccel || 'Software'}</td>
                        {result.error ? (
                          <td colSpan={5} className="p-2 text-red-400 break-words whitespace-pre-wrap text-xs">
                            <details className="cursor-pointer">
                              <summary className="font-semibold">Error (click to expand)</summary>
                              <pre className="mt-2 bg-red-900/20 p-2 rounded overflow-x-auto text-red-300 text-xs">
                                {result.error}
                              </pre>
                            </details>
                          </td>
                        ) : (
                          <>
                            <td className="p-2 text-right">{formatDuration(result.duration)}</td>
                            <td className="p-2 text-right font-semibold">{formatSpeed(result.speed)}</td>
                            <td className="p-2 text-right">{result.fps?.toFixed(1)}</td>
                            <td className="p-2 text-right">{(result.fileSize / 1024 / 1024).toFixed(2)} MB</td>
                            <td className="p-2 text-right">{(result.bitrate / 1000).toFixed(0)} kbps</td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Visual Comparison */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-primary-400">Performance Comparison</h3>
              <div className="space-y-2">
                {results.filter(r => !r.error).map((result, index) => {
                  const maxSpeed = Math.max(...results.filter(r => !r.error).map(r => r.speed));
                  const percentage = (result.speed / maxSpeed) * 100;
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{result.name}</span>
                        <span>{formatSpeed(result.speed)}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Saved Benchmarks */}
        {savedBenchmarks.length > 0 && (
          <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
            <h2 className="text-xl font-semibold mb-3 text-primary-400">Saved Benchmarks</h2>
            <div className="space-y-2">
              {savedBenchmarks.map((benchmark, index) => (
                <button
                  key={index}
                  onClick={() => loadBenchmark(benchmark.path)}
                  className={`w-full p-3 rounded border ${borderColor} hover:border-primary-400 text-left transition-colors`}
                >
                  <div className="font-semibold">{benchmark.name}</div>
                  <div className="text-sm text-gray-500">{new Date(benchmark.timestamp).toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} border ${borderColor} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-primary-400 mb-4">Benchmark Complete!</h2>
              
              <div className="mb-6 space-y-3">
                <div className={`p-4 bg-green-500/10 border border-green-500/30 rounded`}>
                  <p className="text-green-400 font-semibold mb-2">Results Summary</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Total tests:</span>
                      <span className="ml-2 font-semibold text-green-300">{results.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Successful:</span>
                      <span className="ml-2 font-semibold text-green-300">{results.filter(r => !r.error).length}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Failed:</span>
                      <span className="ml-2 font-semibold text-red-400">{results.filter(r => r.error).length}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Playable videos:</span>
                      <span className="ml-2 font-semibold text-green-300">{results.filter(r => r.isPlayable).length}</span>
                    </div>
                  </div>
                </div>

                {results.some(r => !r.isPlayable && !r.error) && (
                  <div className={`p-4 bg-yellow-500/10 border border-yellow-500/30 rounded`}>
                    <p className="text-yellow-400 font-semibold mb-2">⚠️ Warning</p>
                    <p className="text-yellow-300 text-sm">
                      Some videos encoded successfully but may not be playable. This could indicate codec compatibility issues.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-primary-300 mb-2">Save Options</h3>
                
                <button
                  onClick={async () => {
                    await saveBenchmark();
                  }}
                  className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 rounded text-white transition-colors text-left flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <div>
                    <div className="font-semibold">Save .slbench file</div>
                    <div className="text-sm opacity-80">Save benchmark data for later analysis</div>
                  </div>
                </button>

                <button
                  onClick={async () => {
                    await saveBenchmarkReport();
                  }}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors text-left flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <div className="font-semibold">Save .slreport file</div>
                    <div className="text-sm opacity-80">Save report for web comparison system</div>
                  </div>
                </button>

                <button
                  onClick={async () => {
                    await archiveBenchmarkWithVideos();
                  }}
                  className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded text-white transition-colors text-left flex items-center gap-3"
                  disabled={benchmarkVideoPaths.length === 0}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <div>
                    <div className="font-semibold">Save archive with videos</div>
                    <div className="text-sm opacity-80">Create ZIP archive with benchmark data and encoded videos</div>
                  </div>
                </button>

                <button
                  onClick={async () => {
                    await cleanupBenchmarkVideos();
                  }}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded text-white transition-colors text-left flex items-center gap-3"
                  disabled={benchmarkVideoPaths.length === 0}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <div>
                    <div className="font-semibold">Cleanup video files</div>
                    <div className="text-sm opacity-80">Delete all encoded benchmark videos ({benchmarkVideoPaths.length} files)</div>
                  </div>
                </button>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Benchmark;

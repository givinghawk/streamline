import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

const TEST_VIDEOS = [
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
  const [hardwareSupport, setHardwareSupport] = useState(null);
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
  const [benchmarkPreset, setBenchmarkPreset] = useState('recommended');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [sortBy, setSortBy] = useState('speed');
  const [showComparison, setShowComparison] = useState(false);

  const bgColor = settings.theme === 'dark' ? 'bg-surface' : 'bg-white';
  const borderColor = settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textColor = settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const cardBg = settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50';

  useEffect(() => {
    loadHardwareSupport();
    loadSystemInfo();
    loadSavedBenchmarks();
  }, []);

  const loadHardwareSupport = async () => {
    try {
      const support = await window.electron.checkHardwareSupport();
      setHardwareSupport(support);
      
      // Initialize available codecs and enabled tests
      const codecs = buildAvailableCodecs(support);
      setAvailableCodecs(codecs);
      
      // Apply recommended preset by default
      const preset = BENCHMARK_PRESETS.recommended;
      const enabledMap = {};
      codecs.forEach(codec => {
        enabledMap[codec.name] = preset.filter(codec);
      });
      setEnabledTests(enabledMap);
      updateEstimatedTime(enabledMap);
    } catch (error) {
      console.error('Failed to check hardware support:', error);
    }
  };

  const buildAvailableCodecs = (support) => {
    if (!support) return [];

    const codecs = [];

    // Software encoding
    codecs.push({ name: 'H.264 (Software)', codec: 'h264', hwAccel: null });
    codecs.push({ name: 'H.265 (Software)', codec: 'h265', hwAccel: null });
    codecs.push({ name: 'AV1 (Software)', codec: 'av1', hwAccel: null });

    // Hardware encoding
    if (support.nvidia) {
      codecs.push({ name: 'H.264 (NVIDIA NVENC)', codec: 'h264', hwAccel: 'nvidia' });
      codecs.push({ name: 'H.265 (NVIDIA NVENC)', codec: 'h265', hwAccel: 'nvidia' });
      if (support.nvencAv1) {
        codecs.push({ name: 'AV1 (NVIDIA NVENC)', codec: 'av1', hwAccel: 'nvidia' });
      }
    }

    if (support.amd) {
      codecs.push({ name: 'H.264 (AMD AMF)', codec: 'h264', hwAccel: 'amd' });
      codecs.push({ name: 'H.265 (AMD AMF)', codec: 'h265', hwAccel: 'amd' });
      if (support.amfAv1) {
        codecs.push({ name: 'AV1 (AMD AMF)', codec: 'av1', hwAccel: 'amd' });
      }
    }

    if (support.intel) {
      codecs.push({ name: 'H.264 (Intel QSV)', codec: 'h264', hwAccel: 'intel' });
      codecs.push({ name: 'H.265 (Intel QSV)', codec: 'h265', hwAccel: 'intel' });
      if (support.qsvAv1) {
        codecs.push({ name: 'AV1 (Intel QSV)', codec: 'av1', hwAccel: 'intel' });
      }
    }

    if (support.apple) {
      codecs.push({ name: 'H.264 (Apple VideoToolbox)', codec: 'h264', hwAccel: 'apple' });
      codecs.push({ name: 'H.265 (Apple VideoToolbox)', codec: 'h265', hwAccel: 'apple' });
    }

    return codecs;
  };

  const BENCHMARK_PRESETS = {
    quick: {
      name: 'Quick Test',
      description: 'Test only H.264 with hardware acceleration if available (1-2 minutes)',
      filter: (codec) => codec.codec === 'h264' && codec.hwAccel !== null
    },
    recommended: {
      name: 'Recommended',
      description: 'Test H.264 and H.265 with hardware acceleration (3-5 minutes)',
      filter: (codec) => ['h264', 'h265'].includes(codec.codec) && codec.hwAccel !== null
    },
    comprehensive: {
      name: 'Comprehensive',
      description: 'Test all available codecs including software encoding (10-20 minutes)',
      filter: () => true
    },
    hardware_only: {
      name: 'Hardware Only',
      description: 'Test all hardware-accelerated encoders (5-8 minutes)',
      filter: (codec) => codec.hwAccel !== null
    },
    software_only: {
      name: 'Software Only',
      description: 'Test software encoders for compatibility testing (15-30 minutes)',
      filter: (codec) => codec.hwAccel === null
    }
  };

  const applyPreset = (presetKey) => {
    setBenchmarkPreset(presetKey);
    const preset = BENCHMARK_PRESETS[presetKey];
    const newEnabled = {};
    
    availableCodecs.forEach(codec => {
      newEnabled[codec.name] = preset.filter(codec);
    });
    
    setEnabledTests(newEnabled);
    updateEstimatedTime(newEnabled);
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

  const handleDownloadTestVideo = async () => {
    setDownloading(true);
    setDownloadProgress(0);

    try {
      window.electron.onDownloadProgress((data) => {
        setDownloadProgress(data.progress);
      });

      const result = await window.electron.downloadBenchmarkVideo(selectedVideo.url);
      setDownloadedPath(result.filePath);
      window.electron.removeDownloadProgressListener();
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

    // Filter tests to only enabled ones
    const testsToRun = availableCodecs.filter(codec => enabledTests[codec.name]);
    setTotalTests(testsToRun.length);
    const benchmarkResults = [];

    for (let index = 0; index < testsToRun.length; index++) {
      // Check if user clicked cancel
      if (cancelBenchmark) {
        console.log('Benchmark cancelled by user');
        break;
      }

      const codecTest = testsToRun[index];
      setCurrentTest(codecTest.name);
      setTestProgress(index);

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
          timestamp: new Date().toISOString()
        });

        setResults([...benchmarkResults]);
      } catch (error) {
        console.error(`Benchmark failed for ${codecTest.name}:`, error);
        benchmarkResults.push({
          ...codecTest,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        setResults([...benchmarkResults]);
      }
    }

    setRunning(false);
    setCurrentTest(null);
    setTestProgress(0);
    setTotalTests(0);
    setCancelBenchmark(false);
  };

  const toggleTest = (testName) => {
    const newEnabled = {
      ...enabledTests,
      [testName]: !enabledTests[testName]
    };
    setEnabledTests(newEnabled);
    updateEstimatedTime(newEnabled);
    setBenchmarkPreset('custom');
  };

  const selectAllTests = () => {
    const newEnabled = {};
    availableCodecs.forEach(codec => {
      newEnabled[codec.name] = true;
    });
    setEnabledTests(newEnabled);
    updateEstimatedTime(newEnabled);
    setBenchmarkPreset('custom');
  };

  const deselectAllTests = () => {
    const newEnabled = {};
    availableCodecs.forEach(codec => {
      newEnabled[codec.name] = false;
    });
    setEnabledTests(newEnabled);
    updateEstimatedTime(newEnabled);
    setBenchmarkPreset('custom');
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

      alert(`Benchmark saved to ${filePath}`);
      loadSavedBenchmarks();
    } catch (error) {
      alert(`Failed to save benchmark: ${error.message}`);
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

  const getVideoSizeDisplay = () => {
    if (downloading) return `Downloading... ${downloadProgress}%`;
    if (downloadedPath) return '✓ Downloaded';
    return selectedVideo.size;
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
        <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
          <h2 className="text-xl font-semibold mb-3 text-primary-400">Step 1: Select Test Video</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TEST_VIDEOS.map((video) => (
              <button
                key={video.url}
                onClick={() => {
                  setSelectedVideo(video);
                  updateEstimatedTime();
                }}
                className={`p-3 rounded border text-left transition-colors ${
                  selectedVideo.url === video.url
                    ? 'border-primary-500 bg-primary-500/10'
                    : `border-gray-600 hover:border-primary-400`
                }`}
              >
                <div className="font-semibold">{video.name}</div>
                <div className="text-sm text-gray-500">
                  {video.resolution} • {getVideoSizeDisplay()}
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

        {/* Benchmark Presets */}
        <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
          <h2 className="text-xl font-semibold mb-3 text-primary-400">Step 2: Choose Benchmark Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {Object.entries(BENCHMARK_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className={`p-4 rounded border text-left transition-colors ${
                  benchmarkPreset === key
                    ? 'border-primary-500 bg-primary-500/10'
                    : `border-gray-600 hover:border-primary-400`
                }`}
              >
                <div className="font-semibold text-primary-300">{preset.name}</div>
                <div className="text-sm text-gray-500 mt-1">{preset.description}</div>
              </button>
            ))}
          </div>

          {/* Advanced Options Toggle */}
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mb-3"
          >
            <span>{showAdvancedOptions ? '▼' : '▶'}</span>
            <span>Advanced Options</span>
          </button>

          {showAdvancedOptions && (
            <div className={`p-4 border ${borderColor} rounded bg-opacity-50`}>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={selectAllTests}
                  className="px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 rounded text-white transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={deselectAllTests}
                  className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-700 rounded text-white transition-colors"
                >
                  Deselect All
                </button>
                {benchmarkPreset === 'custom' && (
                  <span className="text-yellow-500 text-sm flex items-center">
                    ⚠ Custom selection
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {availableCodecs.map(codec => (
                  <label key={codec.name} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={enabledTests[codec.name] || false}
                      onChange={() => toggleTest(codec.name)}
                      className="w-4 h-4"
                    />
                    <span className={textColor}>{codec.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Estimation Summary */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
            <div className="text-blue-400 font-semibold">
              {Object.values(enabledTests).filter(v => v).length} tests selected • Estimated time: {formatEstimatedTime(estimatedTime)}
            </div>
            <div className="text-blue-300 text-sm mt-1">
              Actual time may vary based on your hardware performance
            </div>
          </div>
        </div>

        {/* Run Benchmark */}
        <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
          <h2 className="text-xl font-semibold mb-3 text-primary-400">Step 3: Run Benchmark</h2>
          
          <div className="mb-4">
            {running ? (
              <div className="space-y-3">
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-blue-400 font-semibold">Currently testing: {currentTest}</p>
                      <p className="text-blue-300 text-sm">Progress: {testProgress + 1} of {totalTests}</p>
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
                          <td colSpan={5} className="p-2 text-red-400">Error: {result.error}</td>
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
    </div>
  );
}

export default Benchmark;

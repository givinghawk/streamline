import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import {
  FilmIcon,
  GpuIcon,
  CheckIcon,
  CloseIcon,
  BulbIcon,
  VideoIcon,
  AudioIcon,
  DownloadIcon,
  ChartIcon,
  EditIcon,
  SparklesIcon,
  WarningIcon,
  ChipIcon,
  LightningIcon
} from './icons/Icons';

function FirstTimeSetup({ onComplete, isResetup = false }) {
  const { settings } = useSettings();
  const [step, setStep] = useState(1);
  const [systemInfo, setSystemInfo] = useState(null);
  const [hardwareSupport, setHardwareSupport] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [testRunning, setTestRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [loadingSystemInfo, setLoadingSystemInfo] = useState(true);
  const [testMode, setTestMode] = useState('detected'); // 'detected' or 'all'

  const bgColor = settings.theme === 'dark' ? 'bg-surface' : 'bg-white';
  const borderColor = settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textColor = settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const cardBg = settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50';

  const TOTAL_STEPS = 5;

  // Define all codecs to test
  const CODECS_TO_TEST = [
    { name: 'H.264', value: 'h264' },
    { name: 'H.265', value: 'h265' },
    { name: 'VP9', value: 'vp9' },
    { name: 'AV1', value: 'av1' }
  ];

  const HARDWARE_PLATFORMS = [
    { name: 'NVIDIA NVENC', key: 'nvidia', icon: ChipIcon },
    { name: 'AMD AMF', key: 'amd', icon: ChipIcon },
    { name: 'Intel QSV', key: 'intel', icon: ChipIcon },
    { name: 'Apple VideoToolbox', key: 'apple', icon: ChipIcon }
  ];

  const WALKTHROUGH_STEPS = [
    {
      number: 1,
      title: 'Welcome to Streamline',
      subtitle: 'Video & Audio Encoding Made Easy',
      description: 'This walkthrough will help you get started with video and audio encoding. We\'ll show you your system capabilities and walk through the key features.'
    },
    {
      number: 2,
      title: 'Your System Information',
      subtitle: 'Let\'s see what we\'re working with',
      description: 'Streamline can use your CPU, GPU, and specialized encoding hardware to speed up your workflow.'
    },
    {
      number: 3,
      title: 'Hardware Acceleration Test',
      subtitle: 'Check what encoding technologies are available',
      description: 'We\'ll run quick tests to see which hardware accelerators work on your system.'
    },
    {
      number: 4,
      title: 'Quick Tour',
      subtitle: 'Meet the main features',
      description: 'Learn about the Import, Encode, Analysis, Trim/Concat, Download, and Presets modes.'
    },
    {
      number: 5,
      title: 'You\'re Ready!',
      subtitle: 'Time to start encoding',
      description: 'You now understand the basics. Let\'s create your first encode!'
    }
  ];

  useEffect(() => {
    loadSystemInfo();
    loadHardwareSupport();
  }, []);

  const loadSystemInfo = async () => {
    try {
      const info = await window.electron.getSystemInfo();
      setSystemInfo(info);
    } catch (error) {
      console.error('Failed to load system info:', error);
    } finally {
      setLoadingSystemInfo(false);
    }
  };

  const loadHardwareSupport = async () => {
    try {
      const support = await window.electron.checkHardwareSupport();
      setHardwareSupport(support);
    } catch (error) {
      console.error('Failed to load hardware support:', error);
    }
  };

  const isEncoderDetected = (platform, codec) => {
    if (!hardwareSupport) return false;
    const platformData = hardwareSupport[platform];
    if (!platformData) return false;
    return platformData[codec] === true;
  };

  const runHardwareTests = async () => {
    setTestRunning(true);
    setTestResults([]);

    const tests = [];

    // Determine which encoders to test based on mode
    if (testMode === 'detected') {
      // Test only detected hardware encoders
      for (const codec of CODECS_TO_TEST) {
        for (const platform of HARDWARE_PLATFORMS) {
          if (isEncoderDetected(platform.key, codec.value)) {
            tests.push({ platform: platform.key, platformName: platform.name, codec: codec.value, codecName: codec.name });
          }
        }
      }
    } else {
      // Test all possible encoders
      for (const codec of CODECS_TO_TEST) {
        for (const platform of HARDWARE_PLATFORMS) {
          tests.push({ platform: platform.key, platformName: platform.name, codec: codec.value, codecName: codec.name });
        }
      }
    }

    // Test software encoding first
    try {
      setCurrentTest('H.264 (Software)');
      await window.electron.runBenchmarkTest({
        inputPath: 'builtin:2frame',
        codec: 'h264',
        hwAccel: null,
        resolution: '1080p'
      });
      setTestResults(prev => [...prev, { name: 'H.264 (Software)', status: 'success', platform: 'Software' }]);
    } catch (error) {
      setTestResults(prev => [...prev, { name: 'H.264 (Software)', status: 'failed', platform: 'Software', error: error.message }]);
    }

    // Test all hardware encoders
    for (const test of tests) {
      try {
        setCurrentTest(`${test.codecName} (${test.platformName})`);
        await window.electron.runBenchmarkTest({
          inputPath: 'builtin:2frame',
          codec: test.codec,
          hwAccel: test.platform,
          resolution: '1080p'
        });
        setTestResults(prev => [...prev, { 
          name: `${test.codecName} (${test.platformName})`, 
          status: 'success',
          platform: test.platformName,
          codec: test.codecName
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, { 
          name: `${test.codecName} (${test.platformName})`, 
          status: 'failed',
          platform: test.platformName,
          codec: test.codecName,
          error: error.message 
        }]);
      }
    }

    setCurrentTest('');
    setTestRunning(false);
  };

  const handleSkip = () => {
    if (window.confirm('Skip the setup walkthrough? You can re-run it anytime from Settings.')) {
      onComplete();
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    const currentStepInfo = WALKTHROUGH_STEPS[step - 1];

    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FilmIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-primary-400 mb-2">{currentStepInfo.title}</h2>
              <p className="text-xl text-primary-300 mb-4">{currentStepInfo.subtitle}</p>
              <p className={`${textColor} max-w-2xl mx-auto`}>{currentStepInfo.description}</p>
            </div>

            <div className={`${cardBg} border ${borderColor} rounded-lg p-6 space-y-4`}>
              <h3 className="font-semibold text-lg text-primary-300">What you can do with Streamline:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <VideoIcon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Import</div>
                    <div className="text-sm text-gray-500">Add video and audio files</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <LightningIcon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Encode</div>
                    <div className="text-sm text-gray-500">Convert with hardware acceleration</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <ChartIcon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Analysis</div>
                    <div className="text-sm text-gray-500">View detailed file information</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <EditIcon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Trim/Concat</div>
                    <div className="text-sm text-gray-500">Edit and combine videos</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <DownloadIcon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Download</div>
                    <div className="text-sm text-gray-500">Get videos from the internet</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <SparklesIcon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Presets</div>
                    <div className="text-sm text-gray-500">Save encoding configurations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-primary-400 mb-2">{currentStepInfo.title}</h2>
              <p className="text-xl text-primary-300">{currentStepInfo.subtitle}</p>
            </div>

            {loadingSystemInfo ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin">
                  <ChipIcon className="w-8 h-8 text-primary-400" />
                </div>
                <p className={`${textColor} mt-4`}>Gathering system information...</p>
              </div>
            ) : systemInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
                  <div className="font-semibold text-primary-300 mb-3 flex items-center gap-2">
                    <ChipIcon className="w-5 h-5" />
                    CPU
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Model:</span> <span className={textColor}>{systemInfo.cpu}</span></div>
                    <div><span className="text-gray-500">Cores:</span> <span className={textColor}>{systemInfo.cpuCores}</span></div>
                    <div><span className="text-gray-500">Speed:</span> <span className={textColor}>{systemInfo.cpuSpeed}</span></div>
                  </div>
                </div>

                <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
                  <div className="font-semibold text-primary-300 mb-3 flex items-center gap-2">
                    <GpuIcon className="w-5 h-5" />
                    GPU
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Primary:</span> <span className={textColor}>{systemInfo.gpu}</span></div>
                    <div><span className="text-gray-500">VRAM:</span> <span className={textColor}>{systemInfo.gpuMemory}</span></div>
                  </div>
                </div>

                <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
                  <div className="font-semibold text-primary-300 mb-3 flex items-center gap-2">
                    <VideoIcon className="w-5 h-5" />
                    Memory
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Total:</span> <span className={textColor}>{systemInfo.ramTotal} {systemInfo.ramType}</span></div>
                    <div><span className="text-gray-500">Available:</span> <span className={textColor}>{systemInfo.ramAvailable}</span></div>
                  </div>
                </div>

                <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
                  <div className="font-semibold text-primary-300 mb-3 flex items-center gap-2">
                    <AudioIcon className="w-5 h-5" />
                    Storage
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Primary:</span> <span className={textColor}>{systemInfo.drive}</span></div>
                    <div><span className="text-gray-500">OS:</span> <span className={textColor}>{systemInfo.os}</span></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-red-400">Failed to load system information</div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-primary-400 mb-2">{currentStepInfo.title}</h2>
              <p className="text-xl text-primary-300">{currentStepInfo.subtitle}</p>
              <p className={`${textColor} mt-2`}>We'll test all available hardware encoders and codecs</p>
            </div>

            {testResults.length === 0 && !testRunning && (
              <>
                {/* Test Mode Selection */}
                <div className={`${cardBg} border ${borderColor} rounded-lg p-6`}>
                  <h3 className="font-semibold text-lg text-primary-300 mb-4">Select Test Mode</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-500/5 cursor-pointer transition-colors border-2" style={{borderColor: testMode === 'detected' ? 'rgb(59, 130, 246)' : 'transparent'}}>
                      <input
                        type="radio"
                        value="detected"
                        checked={testMode === 'detected'}
                        onChange={(e) => setTestMode(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-medium text-primary-300">Test Detected Encoders Only</div>
                        <div className="text-sm text-gray-500">Faster - only tests hardware we think is available (recommended)</div>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-500/5 cursor-pointer transition-colors border-2" style={{borderColor: testMode === 'all' ? 'rgb(59, 130, 246)' : 'transparent'}}>
                      <input
                        type="radio"
                        value="all"
                        checked={testMode === 'all'}
                        onChange={(e) => setTestMode(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-medium text-primary-300">Test All Possible Codecs</div>
                        <div className="text-sm text-gray-500">Slower - thoroughly tests all H.264, H.265, VP9, AV1 codecs on all platforms</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Start Testing Button */}
                <div className={`${cardBg} border ${borderColor} rounded-lg p-6 text-center`}>
                  <p className={`${textColor} mb-4`}>This will take {testMode === 'detected' ? '1-2 minutes' : '3-5 minutes'}.</p>
                  <button
                    onClick={runHardwareTests}
                    className="btn-primary text-lg py-3 px-8 flex items-center justify-center gap-2 mx-auto"
                  >
                    <LightningIcon className="w-5 h-5" />
                    Run Hardware Tests
                  </button>
                </div>
              </>
            )}

            {testRunning && (
              <div className={`${cardBg} border ${borderColor} rounded-lg p-6`}>
                <div className="text-center">
                  <div className="inline-block animate-spin mb-4">
                    <ChipIcon className="w-8 h-8 text-primary-400" />
                  </div>
                  <p className={`${textColor} mb-2 font-medium`}>Testing: {currentTest}</p>
                  <p className="text-sm text-gray-500">Please wait...</p>
                  <div className="mt-4 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary-500 h-full animate-pulse w-1/3"></div>
                  </div>
                </div>
              </div>
            )}

            {testResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-primary-300">Test Results:</h3>
                  {!testRunning && (
                    <button
                      onClick={runHardwareTests}
                      className="text-sm btn-secondary px-3 py-1"
                    >
                      Re-test
                    </button>
                  )}
                </div>

                {/* Group results by platform */}
                {['Software', 'NVIDIA NVENC', 'AMD AMF', 'Intel QSV', 'Apple VideoToolbox'].map((platform) => {
                  const platformResults = testResults.filter(r => r.platform === platform || (platform === 'Software' && !r.platform));
                  if (platformResults.length === 0) return null;

                  const successCount = platformResults.filter(r => r.status === 'success').length;
                  const totalCount = platformResults.length;

                  return (
                    <div key={platform} className={`${cardBg} border ${borderColor} rounded-lg p-4 space-y-3`}>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-700">
                        <div>
                          <div className="font-medium text-primary-300">{platform}</div>
                          <div className="text-xs text-gray-500">{successCount}/{totalCount} working</div>
                        </div>
                        {successCount === totalCount && totalCount > 0 ? (
                          <CheckIcon className="w-5 h-5 text-green-400" />
                        ) : successCount > 0 ? (
                          <WarningIcon className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <CloseIcon className="w-5 h-5 text-red-400" />
                        )}
                      </div>

                      <div className="space-y-2">
                        {platformResults.map((result, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border flex items-start gap-3 ${
                              result.status === 'success'
                                ? 'bg-green-500/10 border-green-500/30'
                                : 'bg-red-500/10 border-red-500/30'
                            }`}
                          >
                            {result.status === 'success' ? (
                              <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            ) : (
                              <CloseIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className={result.status === 'success' ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                                {result.name}
                              </div>
                              {result.status === 'failed' && (
                                <div className="text-xs text-red-300 mt-1 break-words">{result.error}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-primary-400 mb-2">{currentStepInfo.title}</h2>
              <p className="text-xl text-primary-300">{currentStepInfo.subtitle}</p>
            </div>

            <div className="space-y-4">
              <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
                <h3 className="font-semibold text-primary-300 mb-2 flex items-center gap-2">
                  <VideoIcon className="w-5 h-5" /> Import Tab
                </h3>
                <p className={`${textColor} text-sm`}>Drop video or audio files here to add them to your encoding queue. Supports all major formats.</p>
              </div>

              <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
                <h3 className="font-semibold text-primary-300 mb-2 flex items-center gap-2">
                  <LightningIcon className="w-5 h-5" /> Encode Tab
                </h3>
                <p className={`${textColor} text-sm`}>Configure encoding settings, choose codecs, quality presets, and hardware acceleration options.</p>
              </div>

              <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
                <h3 className="font-semibold text-primary-300 mb-2 flex items-center gap-2">
                  <ChartIcon className="w-5 h-5" /> Analysis Tab
                </h3>
                <p className={`${textColor} text-sm`}>View detailed information about your video - resolution, bitrate, codec, duration, and more.</p>
              </div>

              <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
                <h3 className="font-semibold text-primary-300 mb-2 flex items-center gap-2">
                  <EditIcon className="w-5 h-5" /> Trim/Concat Tab
                </h3>
                <p className={`${textColor} text-sm`}>Trim videos to specific time ranges or concatenate multiple videos into one file.</p>
              </div>

              <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
                <h3 className="font-semibold text-primary-300 mb-2 flex items-center gap-2">
                  <DownloadIcon className="w-5 h-5" /> Download Tab
                </h3>
                <p className={`${textColor} text-sm`}>Download videos directly from URLs. Great for getting content for conversion.</p>
              </div>

              <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
                <h3 className="font-semibold text-primary-300 mb-2 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5" /> Presets Tab
                </h3>
                <p className={`${textColor} text-sm`}>Create and manage encoding presets. Save your favorite configurations for quick reuse.</p>
              </div>

              <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
                <h3 className="font-semibold text-primary-300 mb-2 flex items-center gap-2">
                  <ChipIcon className="w-5 h-5" /> Benchmark Tab
                </h3>
                <p className={`${textColor} text-sm`}>Test your system's encoding performance. Compare hardware acceleration options to find the best for your needs.</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm flex items-start gap-2">
                  <BulbIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Tip: Use keyboard shortcuts <span className="font-mono bg-gray-900 px-2 py-1 rounded">Ctrl+1</span> through <span className="font-mono bg-gray-900 px-2 py-1 rounded">Ctrl+7</span> to quickly switch between tabs!</span>
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-primary-400 mb-2">{currentStepInfo.title}</h2>
              <p className="text-xl text-primary-300">{currentStepInfo.subtitle}</p>
              <p className={`${textColor} mt-2`}>You're all set! Check out the comprehensive user guide to learn more.</p>
            </div>

            <div className={`${cardBg} border ${borderColor} rounded-lg p-6 space-y-4 text-center`}>
              <p className={`${textColor} mb-4`}>
                The Streamline user guide covers all features and tabs in detail, including:
              </p>
              <ul className="text-left space-y-2 inline-block">
                <li className="flex gap-2">
                  <VideoIcon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>Import - Adding and managing media files</span>
                </li>
                <li className="flex gap-2">
                  <LightningIcon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>Encode - Configuring encoding settings</span>
                </li>
                <li className="flex gap-2">
                  <ChartIcon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>Analysis - Inspecting file properties</span>
                </li>
                <li className="flex gap-2">
                  <EditIcon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>Trim/Concat - Editing videos</span>
                </li>
                <li className="flex gap-2">
                  <DownloadIcon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>Download - Getting videos from URLs</span>
                </li>
                <li className="flex gap-2">
                  <SparklesIcon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>Presets - Managing encoding configurations</span>
                </li>
                <li className="flex gap-2">
                  <ChipIcon className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span>Benchmark - Testing encoding performance</span>
                </li>
              </ul>
            </div>

            <a
              href="https://givinghawk.gitbook.io/streamline/user-guide"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <DownloadIcon className="w-5 h-5" />
              Open User Guide
            </a>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 text-sm flex items-start gap-2">
                <CheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>You can re-run this setup guide anytime from Settings → Re-run Setup Walkthrough</span>
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-surface-elevated border border-gray-700 rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary-400">
          {isResetup ? 'Setup Walkthrough' : 'Welcome to Streamline'}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Step {step} of {TOTAL_STEPS}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-700 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-primary-500 transition-all duration-300"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="min-h-64 mb-8">
        {renderStep()}
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-700">
        <button
          onClick={handleSkip}
          className="btn-secondary text-sm"
        >
          Skip Walkthrough
        </button>

        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={step === 1 || testRunning}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <button
            onClick={handleNext}
            disabled={testRunning}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === TOTAL_STEPS ? (
              <>
                Complete Setup →
              </>
            ) : (
              <>
                Next →
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FirstTimeSetup;

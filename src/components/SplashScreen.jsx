import React, { useEffect, useState } from 'react';
import { GpuIcon, CheckIcon, SparklesIcon } from './icons/Icons';

function SplashScreen({ onComplete }) {
  const [status, setStatus] = useState('Initializing...');
  const [progress, setProgress] = useState(0);
  const [hardwareInfo, setHardwareInfo] = useState([]);

  useEffect(() => {
    detectHardware();
  }, []);

  const detectHardware = async () => {
    // Step 1: Starting
    setStatus('Starting Streamline...');
    setProgress(20);
    await delay(300);

    // Step 2: Checking FFmpeg
    setStatus('Checking FFmpeg installation...');
    setProgress(40);
    await delay(400);

    // Step 3: Scanning Hardware
    setStatus('Testing hardware acceleration capabilities...');
    setProgress(60);
    
    try {
      const support = await window.electron.checkHardwareSupport();
      const detectedHardware = [];

      if (support.nvidia.h264 || support.nvidia.hevc || support.nvidia.av1) {
        detectedHardware.push({
          name: 'NVIDIA NVENC',
          codecs: [
            support.nvidia.h264 && 'H.264',
            support.nvidia.hevc && 'HEVC',
            support.nvidia.av1 && 'AV1'
          ].filter(Boolean),
        });
      }

      if (support.amd.h264 || support.amd.hevc || support.amd.av1) {
        detectedHardware.push({
          name: 'AMD AMF',
          codecs: [
            support.amd.h264 && 'H.264',
            support.amd.hevc && 'HEVC',
            support.amd.av1 && 'AV1'
          ].filter(Boolean),
        });
      }

      if (support.intel.h264 || support.intel.hevc || support.intel.av1) {
        detectedHardware.push({
          name: 'Intel Quick Sync',
          codecs: [
            support.intel.h264 && 'H.264',
            support.intel.hevc && 'HEVC',
            support.intel.av1 && 'AV1'
          ].filter(Boolean),
        });
      }

      if (support.apple.h264 || support.apple.hevc) {
        detectedHardware.push({
          name: 'Apple VideoToolbox',
          codecs: [
            support.apple.h264 && 'H.264',
            support.apple.hevc && 'HEVC'
          ].filter(Boolean),
        });
      }

      setHardwareInfo(detectedHardware);
      setProgress(90);
      await delay(400);

      // Step 4: Ready
      setStatus(detectedHardware.length > 0 ? 'Hardware acceleration ready!' : 'Ready (Software encoding)');
      setProgress(100);
      await delay(800);

      onComplete(support);
    } catch (error) {
      console.error('Hardware detection failed:', error);
      setStatus('Ready (Software encoding only)');
      setProgress(100);
      await delay(600);
      onComplete(null);
    }
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="fixed inset-0 bg-surface z-50 flex items-center justify-center">
      <div className="max-w-md w-full px-8">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-material-lg mb-4 animate-pulse-slow">
            <FilmIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Streamline</h1>
          <p className="text-gray-400">Professional Media Encoding</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">{status}</span>
            <span className="text-sm text-primary-400 font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-surface-elevated2 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-600 to-primary-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Hardware Detection Results */}
        {hardwareInfo.length > 0 && (
          <div className="bg-surface-elevated rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2 text-green-400 mb-3">
              <CheckIcon className="w-5 h-5" />
              <span className="font-semibold">Hardware Acceleration Detected</span>
            </div>
            {hardwareInfo.map((hw, index) => (
              <div key={index} className="flex items-start space-x-3 bg-surface-elevated2 rounded-md p-3">
                <GpuIcon className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{hw.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {hw.codecs.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hardwareInfo.length === 0 && progress >= 80 && (
          <div className="bg-surface-elevated rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <SparklesIcon className="w-5 h-5" />
              <span className="text-sm">Software encoding mode</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component (FilmIcon defined inline since we're in splash)
const FilmIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

export default SplashScreen;

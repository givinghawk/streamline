import React, { useState } from 'react';
import { FilmIcon, GpuIcon, SettingsIcon } from './icons/Icons';
import SettingsPanel from './SettingsPanel';
import { useSettings } from '../contexts/SettingsContext';
import packageJson from '../../package.json';

function Header({ hardwareSupport, onStartEncode, isProcessingBatch, queueLength, onShowShortcuts }) {
  const { settings } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  
  const getHardwareStatus = () => {
    if (!hardwareSupport) return 'Checking...';
    
    const supported = [];
    if (hardwareSupport.nvidia.h264 || hardwareSupport.nvidia.hevc) supported.push('NVIDIA');
    if (hardwareSupport.amd.h264 || hardwareSupport.amd.hevc) supported.push('AMD');
    if (hardwareSupport.intel.h264 || hardwareSupport.intel.hevc) supported.push('Intel QSV');
    if (hardwareSupport.apple.h264 || hardwareSupport.apple.hevc) supported.push('Apple VideoToolbox');
    
    return supported.length > 0 ? supported.join(', ') : 'Software Only';
  };

  return (
    <>
      <header className={`border-b ${settings.theme === 'dark' ? 'bg-surface-elevated border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-2 rounded-lg">
                <FilmIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className={`text-2xl font-bold ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Streamline
                  </h1>
                  <span className={`text-xs font-mono px-2 py-1 rounded ${
                    settings.theme === 'dark' 
                      ? 'text-gray-500 bg-gray-800' 
                      : 'text-gray-600 bg-gray-200'
                  }`}>
                    v{packageJson.version}
                  </span>
                </div>
                <p className={`text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Professional Media Encoding Suite
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Start Encode Button */}
              {queueLength > 0 && (
                <button
                  onClick={onStartEncode}
                  disabled={isProcessingBatch}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2
                    ${isProcessingBatch
                      ? 'bg-gray-600 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl'
                    }
                    text-white
                  `}
                >
                  {isProcessingBatch ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Start Encode ({queueLength})</span>
                    </>
                  )}
                </button>
              )}
              
              <div className="text-right">
                <div className={`text-xs flex items-center justify-end space-x-1 ${
                  settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <GpuIcon className="w-4 h-4" />
                  <span>Hardware Acceleration</span>
                </div>
                <div className="text-sm font-medium text-primary-400">
                  {getHardwareStatus()}
                </div>
              </div>
              
              <button
                onClick={onShowShortcuts}
                className={`p-2 rounded-lg transition-colors ${
                  settings.theme === 'dark'
                    ? 'hover:bg-surface-elevated2'
                    : 'hover:bg-gray-100'
                }`}
                title="Keyboard Shortcuts (Ctrl+/)"
              >
                <svg 
                  className={`w-6 h-6 transition-colors ${
                    settings.theme === 'dark'
                      ? 'text-gray-400 hover:text-primary-400'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className={`p-2 rounded-lg transition-colors ${
                  settings.theme === 'dark'
                    ? 'hover:bg-surface-elevated2'
                    : 'hover:bg-gray-100'
                }`}
                title="Settings"
              >
                <SettingsIcon className={`w-6 h-6 transition-colors ${
                  settings.theme === 'dark'
                    ? 'text-gray-400 hover:text-primary-400'
                    : 'text-gray-600 hover:text-primary-600'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}

export default Header;

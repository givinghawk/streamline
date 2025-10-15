import React, { useState } from 'react';
import { FilmIcon, GpuIcon, SettingsIcon } from './icons/Icons';
import SettingsPanel from './SettingsPanel';

function Header({ hardwareSupport }) {
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
      <header className="bg-surface-elevated border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-2 rounded-lg">
                <FilmIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Streamline</h1>
                <p className="text-sm text-gray-400">Professional Media Encoding Suite</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xs text-gray-400 flex items-center justify-end space-x-1">
                  <GpuIcon className="w-4 h-4" />
                  <span>Hardware Acceleration</span>
                </div>
                <div className="text-sm font-medium text-primary-400">
                  {getHardwareStatus()}
                </div>
              </div>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-surface-elevated2 rounded-lg transition-colors"
                title="Settings"
              >
                <SettingsIcon className="w-6 h-6 text-gray-400 hover:text-primary-400 transition-colors" />
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

import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

function BasicFileInfo({ fileInfo, isAnalyzing }) {
  const { settings } = useSettings();
  
  if (isAnalyzing) {
    return (
      <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin mr-3">
            <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          </div>
          <span className={`text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Analyzing file...
          </span>
        </div>
      </div>
    );
  }

  if (!fileInfo || !fileInfo.video || fileInfo.video.length === 0) {
    return null;
  }

  const video = fileInfo.video[0];
  const isHDR = video.hdr?.isHDR || false;

  return (
    <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'}`}>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Resolution
          </div>
          <div className={`font-medium ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            {video.resolution}
          </div>
        </div>
        
        <div>
          <div className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Frame Rate
          </div>
          <div className={`font-medium ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            {video.fps.toFixed(2)} fps
          </div>
        </div>
        
        <div>
          <div className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Dynamic Range
          </div>
          <div className="flex items-center space-x-2">
            <span className={`
              px-2 py-0.5 rounded text-xs font-semibold
              ${isHDR 
                ? 'bg-green-500/20 text-green-400' 
                : settings.theme === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-700'
              }
            `}>
              {isHDR ? video.hdr.type : 'SDR'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicFileInfo;

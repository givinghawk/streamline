import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/Icons';
import { useSettings } from '../contexts/SettingsContext';
import { getThemeClasses, themeColors } from '../utils/themeUtils';

function TitleBar() {
  const { settings } = useSettings();
  const [isMaximized, setIsMaximized] = useState(false);
  const themeClasses = getThemeClasses(settings.theme);

  useEffect(() => {
    // Check initial maximized state
    const checkMaximized = async () => {
      if (window.electron && window.electron.windowIsMaximized) {
        const maximized = await window.electron.windowIsMaximized();
        setIsMaximized(maximized);
      }
    };
    checkMaximized();
  }, []);

  const handleMinimize = () => {
    if (window.electron && window.electron.windowMinimize) {
      window.electron.windowMinimize();
    }
  };

  const handleMaximize = async () => {
    if (window.electron && window.electron.windowMaximize && window.electron.windowIsMaximized) {
      await window.electron.windowMaximize();
      const maximized = await window.electron.windowIsMaximized();
      setIsMaximized(maximized);
    }
  };

  const handleClose = () => {
    if (window.electron && window.electron.windowClose) {
      window.electron.windowClose();
    }
  };

  return (
    <div className={themeClasses.titleBar}>
      {/* Draggable area */}
      <div className="flex-1 h-full flex items-center px-4" style={{ WebkitAppRegion: 'drag' }}>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gradient-to-br from-primary-600 to-primary-800 rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <span className={`text-sm font-medium ${themeColors.text.secondary(settings.theme)}`}>Streamline</span>
          <span className={`text-xs font-mono ${themeColors.text.tertiary(settings.theme)}`}>v0.3.0</span>
        </div>
      </div>

      {/* Window controls */}
      <div className="flex h-full" style={{ WebkitAppRegion: 'no-drag' }}>
        {/* Minimize */}
        <button
          onClick={handleMinimize}
          className={`w-12 h-full flex items-center justify-center transition-colors ${settings.theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'}`}
          title="Minimize"
        >
          <svg className={`w-3 h-3 ${themeColors.text.tertiary(settings.theme)}`} fill="currentColor" viewBox="0 0 12 12">
            <rect y="5" width="10" height="1" />
          </svg>
        </button>

        {/* Maximize/Restore */}
        <button
          onClick={handleMaximize}
          className={`w-12 h-full flex items-center justify-center transition-colors ${settings.theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'}`}
          title={isMaximized ? 'Restore' : 'Maximize'}
        >
          {isMaximized ? (
            <svg className={`w-3 h-3 ${themeColors.text.tertiary(settings.theme)}`} fill="none" stroke="currentColor" viewBox="0 0 12 12" strokeWidth="1">
              <rect x="2" y="2" width="6" height="6" />
              <path d="M4 2V1a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H9" />
            </svg>
          ) : (
            <svg className={`w-3 h-3 ${themeColors.text.tertiary(settings.theme)}`} fill="none" stroke="currentColor" viewBox="0 0 12 12" strokeWidth="1">
              <rect x="1.5" y="1.5" width="8" height="8" />
            </svg>
          )}
        </button>

        {/* Close */}
        <button
          onClick={handleClose}
          className="w-12 h-full flex items-center justify-center hover:bg-red-600 transition-colors group"
          title="Close"
        >
          <svg className="w-3 h-3 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 12 12" strokeWidth="1.5">
            <path d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TitleBar;

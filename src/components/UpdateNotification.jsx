import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

const UpdateNotification = () => {
  const { settings } = useSettings();
  const [updateInfo, setUpdateInfo] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkForUpdates = async () => {
    try {
      setChecking(true);
      const result = await window.electron.checkForUpdates(settings.updateChannel || 'stable');
      
      if (result.available) {
        setUpdateInfo(result);
        setDismissed(false);
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    // Check for updates on mount
    checkForUpdates();

    // Check every 4 hours
    const interval = setInterval(checkForUpdates, 4 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [settings.updateChannel]);

  const handleDownload = () => {
    if (updateInfo?.url) {
      window.electron.openExternal(updateInfo.url);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (!updateInfo || dismissed) {
    return null;
  }

  const themeColors = {
    bg: settings.theme === 'dark' ? 'bg-blue-900/20 border-blue-500/50' : 'bg-blue-50 border-blue-300',
    text: settings.theme === 'dark' ? 'text-blue-100' : 'text-blue-900',
    button: settings.theme === 'dark' 
      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
      : 'bg-blue-500 hover:bg-blue-600 text-white',
    closeButton: settings.theme === 'dark'
      ? 'text-blue-300 hover:text-blue-100'
      : 'text-blue-600 hover:text-blue-800',
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md rounded-lg border-2 ${themeColors.bg} shadow-2xl p-4 animate-slide-in`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <h3 className={`font-semibold ${themeColors.text}`}>
            {updateInfo.isPrerelease ? 'Beta Update Available' : 'Update Available'}
          </h3>
        </div>
        <button 
          onClick={handleDismiss}
          className={`${themeColors.closeButton} hover:bg-white/10 rounded p-1`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className={`${themeColors.text} space-y-2`}>
        <p className="text-sm">
          <span className="font-semibold">{updateInfo.version}</span> is now available.
          {updateInfo.currentVersion && (
            <span className="text-xs opacity-75 ml-1">(You have {updateInfo.currentVersion})</span>
          )}
        </p>

        {updateInfo.body && (
          <div className="text-sm opacity-90 max-h-32 overflow-y-auto bg-black/10 rounded p-2">
            <p className="whitespace-pre-wrap">{updateInfo.body}</p>
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleDownload}
            className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${themeColors.button}`}
          >
            Download Update
          </button>
          <button
            onClick={handleDismiss}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              settings.theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;

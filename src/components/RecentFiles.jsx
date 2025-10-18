import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const RecentFiles = ({ onFileSelect, className = "" }) => {
  const { settings, clearRecentFiles } = useSettings();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleFileSelect = async (recentFile) => {
    try {
      if (onFileSelect) {
        onFileSelect(recentFile.filePath);
      }
    } catch (error) {
      console.error('Error selecting recent file:', error);
      alert('Error accessing file.');
    }
  };

  const openOutputFolder = async (outputPath) => {
    try {
      // Extract folder path from file path
      const folderPath = outputPath.substring(0, outputPath.lastIndexOf('\\') || outputPath.lastIndexOf('/'));
      await window.electron.openPath(folderPath);
    } catch (error) {
      console.error('Error opening output folder:', error);
    }
  };

  if (!settings.recentFiles || settings.recentFiles.length === 0) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <ClockIcon />
          <span className="ml-2 text-sm">No recent files</span>
        </div>
      </div>
    );
  }

  const displayedFiles = isExpanded ? settings.recentFiles : settings.recentFiles.slice(0, 5);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <ClockIcon />
          <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">Recent Files</h3>
        </div>
        <button
          onClick={clearRecentFiles}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Clear recent files"
        >
          <TrashIcon />
        </button>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {displayedFiles.map((recentFile) => (
          <div key={recentFile.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => handleFileSelect(recentFile)}
                  className="text-left block w-full"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {recentFile.filePath.split('/').pop() || recentFile.filePath.split('\\').pop()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                    {recentFile.filePath}
                  </p>
                </button>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                    {recentFile.presetName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(recentFile.timestamp)}
                  </span>
                </div>
              </div>
              {recentFile.outputPath && (
                <button
                  onClick={() => openOutputFolder(recentFile.outputPath)}
                  className="ml-4 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Open output folder"
                >
                  <FolderIcon />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {settings.recentFiles.length > 5 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isExpanded ? 'Show less' : `Show ${settings.recentFiles.length - 5} more`}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentFiles;
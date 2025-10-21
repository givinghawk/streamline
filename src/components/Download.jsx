import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

function Download() {
  const { settings } = useSettings();
  const [url, setUrl] = useState('');
  const [downloadPath, setDownloadPath] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('best');
  const [audioOnly, setAudioOnly] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState(null);

  const bgColor = settings.theme === 'dark' ? 'bg-surface' : 'bg-white';
  const borderColor = settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textColor = settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const inputBg = settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50';

  // Fetch video information
  const handleGetInfo = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setError(null);
    setStatus('Fetching video information...');

    try {
      const info = await window.electron.getVideoInfo(url);
      setVideoInfo(info);
      setStatus(`Video: ${info.title} (${info.duration})`);
    } catch (err) {
      setError(`Error: ${err.message || 'Failed to fetch video info'}`);
      setStatus('');
    }
  };

  // Start download
  const handleDownload = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!downloadPath.trim()) {
      setError('Please select a download directory');
      return;
    }

    setDownloading(true);
    setError(null);
    setProgress(0);
    setStatus('Starting download...');

    try {
      // Listen for progress updates
      window.electron.onDownloadProgress((data) => {
        setProgress(data.progress);
        setStatus(data.status);
      });

      const result = await window.electron.downloadVideo({
        url,
        outputPath: downloadPath,
        format: audioOnly ? 'audio' : selectedFormat,
        audioOnly,
      });

      setStatus(`Download complete! Saved to ${result.filePath}`);
      setUrl('');
      setVideoInfo(null);
      window.electron.removeDownloadProgressListener();
    } catch (err) {
      setError(`Download failed: ${err.message}`);
    } finally {
      setDownloading(false);
      setProgress(0);
    }
  };

  // Select output directory
  const handleSelectDirectory = async () => {
    try {
      const path = await window.electron.selectDirectory();
      if (path) {
        setDownloadPath(path);
      }
    } catch (err) {
      setError(`Error selecting directory: ${err.message}`);
    }
  };

  const formatOptions = [
    { value: 'best', label: 'Best Quality (Largest file)' },
    { value: 'worst', label: 'Worst Quality (Smallest file)' },
    { value: '1080p', label: '1080p' },
    { value: '720p', label: '720p' },
    { value: '480p', label: '480p' },
    { value: '360p', label: '360p' },
    { value: '240p', label: '240p' },
  ];

  return (
    <div className={`${bgColor} min-h-screen`}>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className={`text-3xl font-bold mb-6 ${settings.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Download Video
          </h1>

          {/* URL Input */}
          <div className={`border ${borderColor} rounded-lg p-6 mb-6`}>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Video URL
            </label>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter YouTube, Vimeo, or other video URL..."
                className={`flex-1 px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                onKeyPress={(e) => e.key === 'Enter' && handleGetInfo()}
              />
              <button
                onClick={handleGetInfo}
                disabled={downloading}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  downloading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Get Info
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-600 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Video Information */}
            {videoInfo && (
              <div className={`p-4 rounded-lg border ${borderColor} ${inputBg} mb-4`}>
                <h3 className={`font-semibold mb-2 ${textColor}`}>{videoInfo.title}</h3>
                <div className={`text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <p>Duration: {videoInfo.duration}</p>
                  <p>Uploader: {videoInfo.uploader}</p>
                  {videoInfo.description && (
                    <p className="mt-2 line-clamp-2">{videoInfo.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Status Message */}
            {status && (
              <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                <p className="text-blue-400">{status}</p>
              </div>
            )}
          </div>

          {/* Options */}
          {videoInfo && (
            <div className={`border ${borderColor} rounded-lg p-6 mb-6`}>
              <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Download Options</h2>

              {/* Audio Only Toggle */}
              <div className="mb-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={audioOnly}
                    onChange={(e) => setAudioOnly(e.target.checked)}
                    disabled={downloading}
                    className="w-4 h-4"
                  />
                  <span className={textColor}>Download audio only (MP3)</span>
                </label>
              </div>

              {/* Format Selection */}
              {!audioOnly && (
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                    Video Quality
                  </label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    disabled={downloading}
                    className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                  >
                    {formatOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Output Directory */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                  Save to Directory
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={downloadPath}
                    readOnly
                    placeholder="Select output directory..."
                    className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                  />
                  <button
                    onClick={handleSelectDirectory}
                    disabled={downloading}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      downloading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    Browse
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Download Progress */}
          {downloading && (
            <div className={`border ${borderColor} rounded-lg p-6 mb-6`}>
              <div className="mb-2 flex justify-between items-center">
                <span className={textColor}>Download Progress</span>
                <span className="text-primary-400">{Math.round(progress)}%</span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden border ${borderColor}`}>
                <div
                  className="h-full bg-gradient-to-r from-primary-600 to-primary-800 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Download Button */}
          {videoInfo && !downloading && (
            <button
              onClick={handleDownload}
              disabled={!downloadPath || downloading}
              className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all ${
                !downloadPath || downloading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              Download Video
            </button>
          )}

          {downloading && (
            <button
              disabled
              className="w-full px-6 py-4 rounded-lg font-semibold text-white bg-gray-600 cursor-not-allowed"
            >
              Downloading... {Math.round(progress)}%
            </button>
          )}

          {/* Info Box */}
          <div className={`mt-8 p-4 rounded-lg border ${borderColor} ${inputBg}`}>
            <h3 className={`font-semibold mb-2 ${textColor}`}>Supported Sites</h3>
            <p className={`text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              This downloader supports YouTube, Vimeo, Twitch, and over 1000+ other sites. 
              Just paste the video URL above and select your preferred quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Download;

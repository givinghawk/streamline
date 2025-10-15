import React, { useState, useEffect } from 'react';
import { ImageIcon, DownloadIcon, CloseIcon, SparklesIcon } from './icons/Icons';

function ThumbnailGrid({ filePath, onClose }) {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateThumbnail();

    return () => {
      // Cleanup when component unmounts
      if (thumbnailUrl) {
        window.electron.cleanupThumbnail(thumbnailUrl);
      }
    };
  }, [filePath]);

  const generateThumbnail = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await window.electron.generateThumbnailGrid(filePath, {
        rows: 3,
        cols: 4,
      });

      if (result.success) {
        // Convert file path to data URL for display
        const dataUrl = await window.electron.getImageDataUrl(result.thumbnailPath);
        setThumbnailUrl(dataUrl);
      } else {
        setError(result.error || 'Failed to generate thumbnails');
      }
    } catch (err) {
      console.error('Error generating thumbnails:', err);
      setError(err.message || 'Failed to generate thumbnail grid');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!thumbnailUrl) return;

    const a = document.createElement('a');
    a.href = thumbnailUrl;
    a.download = 'video-preview-grid.jpg';
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-elevated w-full max-w-6xl max-h-[95vh] rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <ImageIcon className="w-6 h-6 text-primary-400" />
            <h3 className="text-xl font-semibold">Video Preview Grid</h3>
          </div>
          <div className="flex items-center space-x-2">
            {thumbnailUrl && (
              <button
                onClick={handleDownload}
                className="btn-secondary flex items-center space-x-2"
                title="Download grid"
              >
                <DownloadIcon className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-elevated2 rounded-lg transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin mb-4">
                <SparklesIcon className="w-16 h-16 text-primary-400" />
              </div>
              <h4 className="text-lg font-medium mb-2">Generating Preview Grid...</h4>
              <p className="text-sm text-gray-400">
                Extracting 12 frames from your video
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-red-400 mb-2">
                Failed to Generate Thumbnails
              </h4>
              <p className="text-sm text-red-300">{error}</p>
              <button
                onClick={generateThumbnail}
                className="mt-4 btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {thumbnailUrl && !isGenerating && (
            <div className="space-y-4">
              <div className="bg-black rounded-lg overflow-hidden">
                <img
                  src={thumbnailUrl}
                  alt="Video preview grid"
                  className="w-full h-auto"
                />
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <ImageIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-1">Preview Grid (3×4)</p>
                    <p className="text-xs text-blue-400">
                      12 frames extracted evenly throughout the video duration. 
                      Each thumbnail is 480×270 pixels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThumbnailGrid;

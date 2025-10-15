import React, { useState } from 'react';
import { ChartIcon, SettingsIcon, ImageIcon } from './icons/Icons';
import ThumbnailGrid from './ThumbnailGrid';

function FileInfo({ info, isAnalyzing, filePath }) {
  const [showThumbnails, setShowThumbnails] = useState(false);
  
  if (isAnalyzing) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin">
            <SettingsIcon className="w-10 h-10 text-primary-400" />
          </div>
          <span className="ml-4 text-lg">Analyzing file...</span>
        </div>
      </div>
    );
  }

  if (!info) return null;

  const hasVideo = info.video && info.video.length > 0;

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <ChartIcon className="w-6 h-6 mr-2" />
            File Information
          </h2>
          
          {hasVideo && filePath && (
            <button
              onClick={() => setShowThumbnails(true)}
              className="btn-secondary flex items-center space-x-2"
              title="Generate preview grid"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Preview Grid</span>
            </button>
          )}
        </div>

      {/* Format Info */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-primary-400 mb-3">Container</h3>
        <div className="grid grid-cols-2 gap-4 bg-surface-elevated2 rounded-lg p-4">
          <div>
            <div className="text-xs text-gray-400">Format</div>
            <div className="font-medium">{info.format.container}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Duration</div>
            <div className="font-medium">{info.format.durationFormatted}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">File Size</div>
            <div className="font-medium">{info.format.sizeFormatted}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Overall Bitrate</div>
            <div className="font-medium">{info.format.bitrateFormatted}</div>
          </div>
        </div>
      </div>

      {/* Video Streams */}
      {info.video && info.video.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-primary-400 mb-3">
            Video Streams ({info.video.length})
          </h3>
          {info.video.map((video, index) => (
            <div key={index} className="bg-surface-elevated2 rounded-lg p-4 mb-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-400">Codec</div>
                  <div className="font-medium">{video.codec}</div>
                  <div className="text-xs text-gray-500">{video.codecShort}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Resolution</div>
                  <div className="font-medium">{video.resolution}</div>
                  <div className="text-xs text-gray-500">{video.aspectRatio}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Frame Rate</div>
                  <div className="font-medium">{video.fps.toFixed(2)} fps</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Bitrate</div>
                  <div className="font-medium">{video.bitrateFormatted}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Pixel Format</div>
                  <div className="font-medium">{video.pixelFormat}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Bit Depth</div>
                  <div className="font-medium">{video.bitDepth}-bit</div>
                </div>
              </div>

              {/* Color Information */}
              <div className="border-t border-gray-700 pt-3 mt-3">
                <div className="text-xs font-semibold text-gray-300 mb-2">Color Information</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-gray-400">Color Space</div>
                    <div className="text-sm">{video.colorSpace || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Color Transfer</div>
                    <div className="text-sm">{video.colorTransfer || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Color Primaries</div>
                    <div className="text-sm">{video.colorPrimaries || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Color Range</div>
                    <div className="text-sm">{video.colorRange || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* HDR Information */}
              {video.hdr && (
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-gray-300">HDR Information</div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                      video.hdr.isHDR 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {video.hdr.type}
                    </div>
                  </div>
                  {video.hdr.isHDR && (
                    <div className="text-xs text-gray-400">
                      This video contains {video.hdr.type} high dynamic range content
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Audio Streams */}
      {info.audio && info.audio.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-primary-400 mb-3">
            Audio Streams ({info.audio.length})
          </h3>
          {info.audio.map((audio, index) => (
            <div key={index} className="bg-surface-elevated2 rounded-lg p-4 mb-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-400">Codec</div>
                  <div className="font-medium">{audio.codec}</div>
                  <div className="text-xs text-gray-500">{audio.codecShort}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Channels</div>
                  <div className="font-medium">{audio.channelLayout || `${audio.channels} ch`}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Sample Rate</div>
                  <div className="font-medium">{audio.sampleRateFormatted}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Bitrate</div>
                  <div className="font-medium">{audio.bitrateFormatted}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Language</div>
                  <div className="font-medium">{audio.language}</div>
                </div>
                {audio.bitDepth && (
                  <div>
                    <div className="text-xs text-gray-400">Bit Depth</div>
                    <div className="font-medium">{audio.bitDepth}-bit</div>
                  </div>
                )}
              </div>
              {audio.title && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="text-xs text-gray-400">Title</div>
                  <div className="text-sm">{audio.title}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Subtitle Streams */}
      {info.subtitles && info.subtitles.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-primary-400 mb-3">
            Subtitle Streams ({info.subtitles.length})
          </h3>
          <div className="space-y-2">
            {info.subtitles.map((sub, index) => (
              <div key={index} className="bg-surface-elevated2 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="text-xs text-gray-400">Codec</div>
                    <div className="text-sm font-medium">{sub.codec}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Language</div>
                    <div className="text-sm font-medium">{sub.language}</div>
                  </div>
                </div>
                {sub.title && (
                  <div className="text-xs text-gray-400">{sub.title}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    
    {showThumbnails && filePath && (
      <ThumbnailGrid 
        filePath={filePath}
        onClose={() => setShowThumbnails(false)}
      />
    )}
    </>
  );
}

export default FileInfo;

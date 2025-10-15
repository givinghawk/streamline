import React, { useState, useRef, useEffect } from 'react';
import { CloseIcon, PlayIcon, CheckIcon } from './icons/Icons';

function VideoComparison({ originalPath, encodedPath, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showOriginal, setShowOriginal] = useState(true);
  const [showEncoded, setShowEncoded] = useState(true);
  const [syncVideos, setSyncVideos] = useState(true);
  
  const originalVideoRef = useRef(null);
  const encodedVideoRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const originalVideo = originalVideoRef.current;
    const encodedVideo = encodedVideoRef.current;

    if (!originalVideo || !encodedVideo) return;

    // Set volume
    originalVideo.volume = showOriginal ? volume : 0;
    encodedVideo.volume = showEncoded ? volume : 0;

    // Sync videos when playing
    const handleTimeUpdate = () => {
      if (syncVideos && isPlaying) {
        const timeDiff = Math.abs(originalVideo.currentTime - encodedVideo.currentTime);
        if (timeDiff > 0.1) {
          encodedVideo.currentTime = originalVideo.currentTime;
        }
      }
      setCurrentTime(originalVideo.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(originalVideo.duration);
    };

    originalVideo.addEventListener('timeupdate', handleTimeUpdate);
    originalVideo.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      originalVideo.removeEventListener('timeupdate', handleTimeUpdate);
      originalVideo.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [isPlaying, volume, showOriginal, showEncoded, syncVideos]);

  const togglePlayPause = () => {
    const originalVideo = originalVideoRef.current;
    const encodedVideo = encodedVideoRef.current;

    if (isPlaying) {
      originalVideo?.pause();
      encodedVideo?.pause();
    } else {
      originalVideo?.play();
      encodedVideo?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    if (originalVideoRef.current) originalVideoRef.current.currentTime = newTime;
    if (encodedVideoRef.current) encodedVideoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (originalVideoRef.current && showOriginal) originalVideoRef.current.volume = newVolume;
    if (encodedVideoRef.current && showEncoded) encodedVideoRef.current.volume = newVolume;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-7xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-semibold">Video Comparison</h2>
            <p className="text-sm text-gray-400 mt-1">Compare original and encoded videos side-by-side</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-elevated2 rounded-lg transition-colors"
            title="Close"
          >
            <CloseIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Video Display */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Original Video */}
            {showOriginal && (
              <div className="bg-surface-elevated2 rounded-lg overflow-hidden">
                <div className="bg-surface-elevated3 px-4 py-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">Original</span>
                  <span className="text-xs text-gray-400">Source File</span>
                </div>
                <div className="relative bg-black aspect-video">
                  <video
                    ref={originalVideoRef}
                    src={`file://${originalPath}`}
                    className="w-full h-full object-contain"
                    loop
                  />
                </div>
              </div>
            )}

            {/* Encoded Video */}
            {showEncoded && (
              <div className="bg-surface-elevated2 rounded-lg overflow-hidden">
                <div className="bg-surface-elevated3 px-4 py-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">Encoded</span>
                  <span className="text-xs text-green-400">Optimised File</span>
                </div>
                <div className="relative bg-black aspect-video">
                  <video
                    ref={encodedVideoRef}
                    src={`file://${encodedPath}`}
                    className="w-full h-full object-contain"
                    loop
                  />
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-surface-elevated2 rounded-lg p-4 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <span className="text-gray-400">
                  {duration > 0 ? Math.round((currentTime / duration) * 100) : 0}%
                </span>
              </div>
              <div
                ref={progressRef}
                className="w-full h-3 bg-surface-elevated3 rounded-full cursor-pointer overflow-hidden"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-primary-600 transition-all"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={togglePlayPause}
                className="btn-primary flex items-center space-x-2 px-6 py-3"
              >
                {isPlaying ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-5 h-5" />
                    <span>Play</span>
                  </>
                )}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-4">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-surface-elevated3 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-400 w-12 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Display Options */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOriginal}
                    onChange={(e) => setShowOriginal(e.target.checked)}
                    className="w-5 h-5 rounded bg-surface-elevated3 border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-sm">Show Original</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEncoded}
                    onChange={(e) => setShowEncoded(e.target.checked)}
                    className="w-5 h-5 rounded bg-surface-elevated3 border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-sm">Show Encoded</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syncVideos}
                    onChange={(e) => setSyncVideos(e.target.checked)}
                    className="w-5 h-5 rounded bg-surface-elevated3 border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-sm">Sync Playback</span>
                </label>
              </div>

              <div className="text-xs text-gray-400">
                Press Space to play/pause
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoComparison;

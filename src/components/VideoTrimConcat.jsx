import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

function VideoTrimConcat() {
  const { settings } = useSettings();
  const [mode, setMode] = useState('trim'); // 'trim' or 'concat'
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [segments, setSegments] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [outputPath, setOutputPath] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);

  const currentFile = selectedFiles[currentFileIndex];

  // Handle file selection
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files.map(f => ({
        name: f.name,
        path: f.path,
        size: f.size,
      })));
      setCurrentFileIndex(0);
      setSegments([]);
    }
  };

  // Update video metadata
  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setEndTime(dur);
    }
  };

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Add trim segment
  const addTrimSegment = () => {
    if (startTime >= endTime) {
      alert('Start time must be before end time');
      return;
    }

    const newSegment = {
      id: Date.now(),
      startTime,
      endTime,
      duration: endTime - startTime,
    };

    setSegments([...segments, newSegment]);
    setStartTime(endTime);
    setEndTime(duration);
  };

  // Remove segment
  const removeSegment = (id) => {
    setSegments(segments.filter(seg => seg.id !== id));
  };

  // Handle concat mode - reorder files
  const moveFile = (index, direction) => {
    if (direction === 'up' && index > 0) {
      const newFiles = [...selectedFiles];
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
      setSelectedFiles(newFiles);
    } else if (direction === 'down' && index < selectedFiles.length - 1) {
      const newFiles = [...selectedFiles];
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
      setSelectedFiles(newFiles);
    }
  };

  // Process trim/concat
  const handleProcess = async () => {
    if (!currentFile && selectedFiles.length === 0) {
      alert('No files selected');
      return;
    }

    if (mode === 'trim' && segments.length === 0) {
      alert('Please add at least one segment');
      return;
    }

    if (!outputPath) {
      alert('Please select output directory');
      return;
    }

    setIsProcessing(true);

    try {
      if (mode === 'trim') {
        await window.electron.trimVideo({
          inputPath: currentFile.path,
          segments: segments,
          outputPath: outputPath,
        });
      } else {
        await window.electron.concatVideos({
          inputPaths: selectedFiles.map(f => f.path),
          outputPath: outputPath,
        });
      }
      alert('Processing complete!');
      // Reset state
      setSelectedFiles([]);
      setSegments([]);
      setStartTime(0);
      setEndTime(0);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const bgColor = settings.theme === 'dark' ? 'bg-surface' : 'bg-white';
  const borderColor = settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textColor = settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const inputBg = settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50';

  return (
    <div className={`${bgColor} min-h-screen`}>
      <div className="container mx-auto px-4 py-6">
        {/* Mode Selector */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setMode('trim')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              mode === 'trim'
                ? 'bg-primary-600 text-white'
                : `${inputBg} ${textColor}`
            }`}
          >
            Trim Video
          </button>
          <button
            onClick={() => setMode('concat')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              mode === 'concat'
                ? 'bg-primary-600 text-white'
                : `${inputBg} ${textColor}`
            }`}
          >
            Concatenate Videos
          </button>
        </div>

        {/* Trim Mode */}
        {mode === 'trim' && (
          <div className={`border ${borderColor} rounded-lg p-6`}>
            <h2 className="text-2xl font-bold mb-6">Trim Video</h2>

            {/* File Upload */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Select Video File
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className={`w-full px-4 py-2 rounded-lg border ${borderColor}`}
              />
            </div>

            {/* Video Preview */}
            {currentFile && (
              <div className="mb-6">
                <video
                  ref={videoRef}
                  src={currentFile.path}
                  onLoadedMetadata={handleMetadataLoaded}
                  onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                  controls
                  className="w-full rounded-lg mb-4"
                />

                {/* Timeline */}
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                    Timeline: {formatTime(currentTime)} / {formatTime(duration)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => {
                      setCurrentTime(parseFloat(e.target.value));
                      videoRef.current.currentTime = parseFloat(e.target.value);
                    }}
                    className="w-full"
                  />
                </div>

                {/* Trim Controls */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                      Start Time: {formatTime(startTime)}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        value={startTime}
                        onChange={(e) => setStartTime(parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <button
                        onClick={() => setStartTime(currentTime)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                      >
                        Set
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                      End Time: {formatTime(endTime)}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        value={endTime}
                        onChange={(e) => setEndTime(parseFloat(e.target.value))}
                        className="flex-1"
                      />
                      <button
                        onClick={() => setEndTime(currentTime)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={addTrimSegment}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium"
                >
                  Add Segment ({formatTime(endTime - startTime)})
                </button>
              </div>
            )}

            {/* Segments List */}
            {segments.length > 0 && (
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-3 ${textColor}`}>
                  Segments ({segments.length})
                </h3>
                <div className="space-y-2">
                  {segments.map((seg, idx) => (
                    <div
                      key={seg.id}
                      className={`flex items-center justify-between p-3 border ${borderColor} rounded-lg`}
                    >
                      <span className={textColor}>
                        #{idx + 1}: {formatTime(seg.startTime)} - {formatTime(seg.endTime)}{' '}
                        ({formatTime(seg.duration)})
                      </span>
                      <button
                        onClick={() => removeSegment(seg.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Concat Mode */}
        {mode === 'concat' && (
          <div className={`border ${borderColor} rounded-lg p-6`}>
            <h2 className="text-2xl font-bold mb-6">Concatenate Videos</h2>

            {/* File Upload */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${textColor}`}>
                Select Video Files (order matters)
              </label>
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleFileSelect}
                className={`w-full px-4 py-2 rounded-lg border ${borderColor}`}
              />
            </div>

            {/* File List */}
            {selectedFiles.length > 0 && (
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-3 ${textColor}`}>
                  Video Files ({selectedFiles.length})
                </h3>
                <div className="space-y-2">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 border ${borderColor} rounded-lg`}
                    >
                      <span className={textColor}>
                        {idx + 1}. {file.name}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => moveFile(idx, 'up')}
                          disabled={idx === 0}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveFile(idx, 'down')}
                          disabled={idx === selectedFiles.length - 1}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Output Directory */}
        {(selectedFiles.length > 0 || currentFile) && (
          <div className={`border ${borderColor} rounded-lg p-6 mt-6`}>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Output Directory
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={outputPath}
                onChange={(e) => setOutputPath(e.target.value)}
                placeholder="Select output directory..."
                className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
              />
              <button
                onClick={async () => {
                  const path = await window.electron.selectDirectory();
                  if (path) setOutputPath(path);
                }}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium"
              >
                Browse
              </button>
            </div>

            {/* Process Button */}
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className={`w-full mt-6 px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                isProcessing
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isProcessing ? 'Processing...' : `Process ${mode === 'trim' ? 'Trim' : 'Concat'}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoTrimConcat;

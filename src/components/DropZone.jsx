import React, { useState } from 'react';
import { UploadIcon, FileIcon, VideoIcon, AudioIcon, ImageIcon, CloseIcon } from './icons/Icons';

function DropZone({ onFilesAdded, files, fileType }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).map(file => {
      // In Electron, file.path gives us the actual file system path
      // In browser, we use the webkitRelativePath or name
      const filePath = file.path || file.webkitRelativePath || file.name;
      
      return {
        name: file.name,
        path: filePath,
        size: file.size,
        type: file.type,
      };
    });

    onFilesAdded(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).map(file => {
      const filePath = file.path || file.webkitRelativePath || file.name;
      
      return {
        name: file.name,
        path: filePath,
        size: file.size,
        type: file.type,
      };
    });

    onFilesAdded(selectedFiles);
    e.target.value = ''; // Reset input to allow re-selecting the same files
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const videoExts = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm4v', 'mpg', 'mpeg', 'ts', 'mts', 'm2ts', '3gp', 'ogv'];
    const audioExts = ['mp3', 'aac', 'flac', 'wav', 'ogg', 'opus', 'm4a', 'wma', 'alac', 'ape', 'wv', 'tta'];
    const imageExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'tif', 'heic', 'heif', 'avif'];

    if (videoExts.includes(ext)) return <VideoIcon className="w-6 h-6 text-primary-400" />;
    if (audioExts.includes(ext)) return <AudioIcon className="w-6 h-6 text-green-400" />;
    if (imageExts.includes(ext)) return <ImageIcon className="w-6 h-6 text-yellow-400" />;
    return <FileIcon className="w-6 h-6 text-gray-400" />;
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesAdded(newFiles);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Input Files</h2>
      
      {fileType && (
        <div className="mb-4 bg-primary-500/10 border border-primary-500/30 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-primary-400 text-sm">
            <span className="font-semibold">Detected: {fileType.type.toUpperCase()}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">{fileType.supportedOutputFormats?.length || 0} output formats available</span>
          </div>
        </div>
      )}
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
          isDragging
            ? 'border-primary-500 bg-primary-500/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <div className="flex justify-center mb-4">
          <UploadIcon className="w-16 h-16 text-gray-400" />
        </div>
        <p className="text-lg mb-2">Drag and drop files here</p>
        <p className="text-sm text-gray-400 mb-4">or</p>
        <label className="btn-primary cursor-pointer inline-block">
          Browse Files
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            accept="video/*,audio/*,image/*"
          />
        </label>
        <p className="text-xs text-gray-500 mt-4">
          Supported: Video (MKV, MP4, AVI, MOV, etc.), Audio (MP3, AAC, FLAC, etc.), Images
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="font-semibold text-sm text-gray-300 mb-3">
            Selected Files ({files.length})
          </h3>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-surface-elevated2 rounded-md p-3 hover:bg-surface-elevated3 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="ml-4 text-red-400 hover:text-red-300 transition-colors p-1"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropZone;

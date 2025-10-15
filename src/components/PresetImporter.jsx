import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { CloseIcon, UploadIcon, CodeIcon, FileIcon } from './icons/Icons';

function PresetImporter({ onClose }) {
  const { importPreset, importPresetFromFFmpegCommand } = useSettings();
  const [mode, setMode] = useState('json');
  const [ffmpegCommand, setFfmpegCommand] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const [metadata, setMetadata] = useState({
    name: '',
    description: '',
    category: 'video',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonContent(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleImportJSON = () => {
    setError('');
    setSuccess('');

    if (!jsonContent.trim()) {
      setError('Please provide JSON content or upload a file');
      return;
    }

    const result = importPreset(jsonContent);
    if (result.success) {
      setSuccess(`Successfully imported preset: ${result.preset.name}`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(result.error);
    }
  };

  const handleImportFFmpeg = () => {
    setError('');
    setSuccess('');

    if (!ffmpegCommand.trim()) {
      setError('Please provide an FFmpeg command');
      return;
    }

    if (!metadata.name.trim()) {
      setError('Please provide a name for the preset');
      return;
    }

    const result = importPresetFromFFmpegCommand(ffmpegCommand, metadata);
    if (result.success) {
      setSuccess(`Successfully created preset: ${result.preset.name}`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-surface-elevated w-full max-w-2xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <UploadIcon className="w-6 h-6 text-primary-400" />
            <h3 className="text-xl font-semibold">Import Preset</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-elevated2 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setMode('json')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              mode === 'json'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FileIcon className="w-4 h-4" />
              <span>JSON File</span>
            </div>
          </button>
          <button
            onClick={() => setMode('ffmpeg')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              mode === 'ffmpeg'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <CodeIcon className="w-4 h-4" />
              <span>FFmpeg Command</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-400">{success}</p>
            </div>
          )}

          {mode === 'json' ? (
            /* JSON Import */
            <div className="space-y-4">
              <div>
                <label className="label">Upload Preset File</label>
                <input
                  type="file"
                  accept=".json,.preset.json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-600 file:text-white
                    hover:file:bg-primary-700
                    file:cursor-pointer cursor-pointer"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface-elevated text-gray-400">or paste JSON</span>
                </div>
              </div>

              <div>
                <label className="label">Preset JSON</label>
                <textarea
                  value={jsonContent}
                  onChange={(e) => setJsonContent(e.target.value)}
                  placeholder='{"id": "my-preset", "name": "My Preset", ...}'
                  rows="10"
                  className="input w-full font-mono text-sm"
                />
              </div>
            </div>
          ) : (
            /* FFmpeg Command Import */
            <div className="space-y-4">
              <div>
                <label className="label">Preset Name *</label>
                <input
                  type="text"
                  value={metadata.name}
                  onChange={(e) => setMetadata({ ...metadata, name: e.target.value })}
                  placeholder="e.g., My Custom Encoding"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="label">Category</label>
                <select
                  value={metadata.category}
                  onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
                  className="select w-full"
                >
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="image">Image</option>
                </select>
              </div>

              <div>
                <label className="label">Description</label>
                <input
                  type="text"
                  value={metadata.description}
                  onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                  placeholder="Optional description"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="label">FFmpeg Command *</label>
                <textarea
                  value={ffmpegCommand}
                  onChange={(e) => setFfmpegCommand(e.target.value)}
                  placeholder="ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 192k output.mp4"
                  rows="6"
                  className="input w-full font-mono text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Paste a complete FFmpeg command. Settings will be extracted automatically.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-400 mb-2">Supported Parameters</h4>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>• Video: <code className="text-blue-300">-c:v, -crf, -preset, -b:v, -r, -s</code></div>
                  <div>• Audio: <code className="text-blue-300">-c:a, -b:a, -ar, -ac</code></div>
                  <div>• Format: <code className="text-blue-300">-f</code></div>
                  <div>• Image: <code className="text-blue-300">-q:v, -qscale:v</code></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={mode === 'json' ? handleImportJSON : handleImportFFmpeg}
            className="btn-primary flex items-center space-x-2"
          >
            <UploadIcon className="w-4 h-4" />
            <span>Import Preset</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresetImporter;

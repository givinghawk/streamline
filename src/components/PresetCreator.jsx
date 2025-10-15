import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { CloseIcon, SaveIcon, CodeIcon } from './icons/Icons';

function PresetCreator({ preset, onClose }) {
  const { addCustomPreset, updateCustomPreset } = useSettings();
  const [mode, setMode] = useState(preset ? 'manual' : 'manual');
  const [formData, setFormData] = useState(preset || {
    id: '',
    name: '',
    category: 'video',
    description: '',
    settings: {},
    ffmpegCommand: '',
  });

  const [ffmpegCommand, setFfmpegCommand] = useState(preset?.ffmpegCommand || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Preset name is required');
      return;
    }

    if (mode === 'ffmpeg' && !ffmpegCommand.trim()) {
      setError('FFmpeg command is required');
      return;
    }

    try {
      const presetToSave = {
        ...formData,
        id: formData.id || `custom-${Date.now()}`,
        ffmpegCommand: mode === 'ffmpeg' ? ffmpegCommand : formData.ffmpegCommand,
      };

      if (preset) {
        updateCustomPreset(preset.id, presetToSave);
      } else {
        addCustomPreset(presetToSave);
      }

      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateSetting = (key, value) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, [key]: value }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-surface-elevated w-full max-w-3xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold">
            {preset ? 'Edit Preset' : 'Create New Preset'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-elevated2 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selection */}
        {!preset && (
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                mode === 'manual'
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Manual Setup
            </button>
            <button
              onClick={() => setMode('ffmpeg')}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                mode === 'ffmpeg'
                  ? 'text-primary-400 border-b-2 border-primary-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              From FFmpeg Command
            </button>
          </div>
        )}

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Basic Info */}
            <div>
              <label className="label">Preset Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="e.g., My Custom Preset"
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="label">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => updateFormData('category', e.target.value)}
                className="select w-full"
              >
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="image">Image</option>
              </select>
            </div>

            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Describe what this preset does..."
                rows="2"
                className="input w-full"
              />
            </div>

            {mode === 'ffmpeg' ? (
              /* FFmpeg Command Mode */
              <div>
                <label className="label flex items-center space-x-2">
                  <CodeIcon className="w-4 h-4" />
                  <span>FFmpeg Command</span>
                </label>
                <textarea
                  value={ffmpegCommand}
                  onChange={(e) => setFfmpegCommand(e.target.value)}
                  placeholder="ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac output.mp4"
                  rows="4"
                  className="input w-full font-mono text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Paste your complete FFmpeg command. The settings will be extracted automatically.
                </p>
              </div>
            ) : (
              /* Manual Settings Mode */
              <>
                {formData.category === 'video' && (
                  <>
                    <div>
                      <label className="label">Video Codec</label>
                      <input
                        type="text"
                        value={formData.settings.videoCodec || ''}
                        onChange={(e) => updateSetting('videoCodec', e.target.value)}
                        placeholder="e.g., libx264, libx265, h264_nvenc"
                        className="input w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">CRF Quality</label>
                        <input
                          type="number"
                          value={formData.settings.crf || ''}
                          onChange={(e) => updateSetting('crf', e.target.value)}
                          placeholder="0-51 (lower = better)"
                          className="input w-full"
                          min="0"
                          max="51"
                        />
                      </div>
                      <div>
                        <label className="label">Encoding Preset</label>
                        <input
                          type="text"
                          value={formData.settings.preset || ''}
                          onChange={(e) => updateSetting('preset', e.target.value)}
                          placeholder="e.g., medium, fast, slow"
                          className="input w-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Resolution</label>
                        <input
                          type="text"
                          value={formData.settings.resolution || ''}
                          onChange={(e) => updateSetting('resolution', e.target.value)}
                          placeholder="e.g., 1920x1080"
                          className="input w-full"
                        />
                      </div>
                      <div>
                        <label className="label">Frame Rate</label>
                        <input
                          type="text"
                          value={formData.settings.fps || ''}
                          onChange={(e) => updateSetting('fps', e.target.value)}
                          placeholder="e.g., 30, 60"
                          className="input w-full"
                        />
                      </div>
                    </div>
                  </>
                )}

                {(formData.category === 'video' || formData.category === 'audio') && (
                  <>
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">Audio Settings</h4>
                      <div>
                        <label className="label">Audio Codec</label>
                        <input
                          type="text"
                          value={formData.settings.audioCodec || ''}
                          onChange={(e) => updateSetting('audioCodec', e.target.value)}
                          placeholder="e.g., aac, libopus, libmp3lame, flac"
                          className="input w-full"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="label">Audio Bitrate</label>
                          <input
                            type="text"
                            value={formData.settings.audioBitrate || ''}
                            onChange={(e) => updateSetting('audioBitrate', e.target.value)}
                            placeholder="e.g., 192k, 320k"
                            className="input w-full"
                          />
                        </div>
                        <div>
                          <label className="label">Sample Rate</label>
                          <input
                            type="text"
                            value={formData.settings.audioSampleRate || ''}
                            onChange={(e) => updateSetting('audioSampleRate', e.target.value)}
                            placeholder="e.g., 48000, 44100"
                            className="input w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {formData.category === 'image' && (
                  <>
                    <div>
                      <label className="label">Output Format</label>
                      <select
                        value={formData.settings.outputFormat || ''}
                        onChange={(e) => updateSetting('outputFormat', e.target.value)}
                        className="select w-full"
                      >
                        <option value="">Select format...</option>
                        <option value="png">PNG</option>
                        <option value="jpg">JPEG</option>
                        <option value="webp">WebP</option>
                        <option value="gif">GIF</option>
                        <option value="bmp">BMP</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">Quality (1-100)</label>
                      <input
                        type="number"
                        value={formData.settings.quality || ''}
                        onChange={(e) => updateSetting('quality', e.target.value)}
                        placeholder="85"
                        className="input w-full"
                        min="1"
                        max="100"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="label">Output Format Extension</label>
                  <input
                    type="text"
                    value={formData.settings.outputFormat || ''}
                    onChange={(e) => updateSetting('outputFormat', e.target.value)}
                    placeholder="e.g., mp4, mkv, webm, mp3, flac, png"
                    className="input w-full"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    File extension for the output file
                  </p>
                </div>
              </>
            )}
          </div>
        </form>

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
            onClick={handleSubmit}
            className="btn-primary flex items-center space-x-2"
          >
            <SaveIcon className="w-4 h-4" />
            <span>{preset ? 'Update' : 'Create'} Preset</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresetCreator;

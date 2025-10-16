import React from 'react';
import {
  VIDEO_CODECS,
  AUDIO_CODECS,
  RESOLUTIONS,
  FRAME_RATES,
  ENCODING_PRESETS,
} from '../constants/presets';
import { calculateBitrateFromTargetSize, convertToBytes, parseBitrateString, formatBitrate } from '../utils/bitrateCalculator';
import HDRSettings from './HDRSettings';

function AdvancedSettings({ settings, onSettingsChange, hardwareSupport, selectedPreset, fileType, fileInfo }) {
  const updateSetting = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const hasHardwareAccel = hardwareSupport && (
    hardwareSupport.nvidia.h264 || hardwareSupport.nvidia.hevc ||
    hardwareSupport.amd.h264 || hardwareSupport.amd.hevc ||
    hardwareSupport.intel.h264 || hardwareSupport.intel.hevc ||
    hardwareSupport.apple.h264 || hardwareSupport.apple.hevc
  );

  // Determine what to show based on file type
  const isVideo = !fileType || fileType.type === 'video';
  const isAudio = fileType && fileType.type === 'audio';
  const isImage = fileType && fileType.type === 'image';

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Customize Preset</h2>

      {selectedPreset && (
        <div className="mb-4 bg-primary-500/10 border border-primary-500/30 rounded-lg p-3">
          <div className="text-sm">
            <span className="text-gray-400">Customizing:</span>
            <span className="ml-2 font-semibold text-primary-400">{selectedPreset.name}</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Video Settings - Only show for video files */}
        {isVideo && (
          <>
            {/* Hardware Acceleration */}
            {hasHardwareAccel && (
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.useHardwareAccel !== false}
                    onChange={(e) => updateSetting('useHardwareAccel', e.target.checked)}
                    className="w-5 h-5 rounded bg-surface-elevated2 border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
                  />
                  <div>
                    <div className="font-medium">Use Hardware Acceleration</div>
                    <div className="text-xs text-gray-400">
                      Faster encoding using GPU (recommended)
                    </div>
                  </div>
                </label>
              </div>
            )}

            {/* Video Codec */}
            <div>
              <label className="label">Video Codec</label>
              <select
                value={settings.videoCodec || ''}
                onChange={(e) => updateSetting('videoCodec', e.target.value)}
                className="select w-full"
              >
                <option value="">Default for preset</option>
                {VIDEO_CODECS.map((codec) => (
                  <option key={codec.value} value={codec.value}>
                    {codec.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Encoding Quality */}
            <div>
              <label className="label">
                Quality (CRF: {settings.crf || 23})
                <span className="ml-2 text-xs text-gray-400">(Lower = Better Quality)</span>
              </label>
              <input
                type="range"
                min="0"
                max="51"
                value={settings.crf || 23}
                onChange={(e) => updateSetting('crf', parseInt(e.target.value))}
                className="w-full h-2 bg-surface-elevated2 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Best Quality</span>
                <span>Smallest Size</span>
              </div>
            </div>

            {/* Encoding Preset */}
            <div>
              <label className="label">Encoding Speed</label>
              <select
                value={settings.preset || 'medium'}
                onChange={(e) => updateSetting('preset', e.target.value)}
                className="select w-full"
              >
                {ENCODING_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <div className="text-xs text-gray-400 mt-1">
                Slower = Better compression
              </div>
            </div>

            {/* Resolution */}
            <div>
              <label className="label">Resolution</label>
              <select
                value={settings.resolution || ''}
                onChange={(e) => updateSetting('resolution', e.target.value)}
                className="select w-full"
              >
                {RESOLUTIONS.map((res) => (
                  <option key={res.value} value={res.value}>
                    {res.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Frame Rate */}
            <div>
              <label className="label">Frame Rate</label>
              <select
                value={settings.fps || ''}
                onChange={(e) => updateSetting('fps', e.target.value)}
                className="select w-full"
              >
                {FRAME_RATES.map((fps) => (
                  <option key={fps.value} value={fps.value}>
                    {fps.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Video Bitrate */}
            <div>
              <label className="label">
                Video Bitrate (optional)
                <span className="ml-2 text-xs text-gray-400">(Leave empty to use CRF)</span>
              </label>
              <input
                type="text"
                value={settings.videoBitrate || ''}
                onChange={(e) => updateSetting('videoBitrate', e.target.value)}
                placeholder="e.g., 5M or 5000k"
                className="input w-full"
              />
            </div>

            {/* Target File Size */}
            <div>
              <label className="label">
                Target File Size (optional)
                <span className="ml-2 text-xs text-gray-400">(Auto-calculates bitrate)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={settings.targetFileSize || ''}
                  onChange={(e) => updateSetting('targetFileSize', e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="Size in MB"
                  min="1"
                  className="input w-full"
                />
                <select
                  value={settings.targetFileSizeUnit || 'MB'}
                  onChange={(e) => updateSetting('targetFileSizeUnit', e.target.value)}
                  className="select"
                >
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                </select>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Overrides video bitrate setting if specified
              </div>
              
              {/* Calculated bitrate display */}
              {settings.targetFileSize && fileInfo?.format?.duration && (
                <div className="mt-3 p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Resulting Video Bitrate:</div>
                  {(() => {
                    const targetBytes = convertToBytes(settings.targetFileSize, settings.targetFileSizeUnit || 'MB');
                    const audioBitrateKbps = settings.audioBitrate 
                      ? parseBitrateString(settings.audioBitrate)
                      : (settings.audioCodec ? 192 : 0);
                    const calculatedBitrate = calculateBitrateFromTargetSize(targetBytes, fileInfo.format.duration, audioBitrateKbps);
                    return (
                      <div className="text-sm font-semibold text-primary-400">
                        {calculatedBitrate} ({formatBitrate(parseInt(calculatedBitrate))})
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="border-t border-gray-700 pt-4"></div>

            {/* HDR Settings */}
            <HDRSettings 
              settings={settings}
              onSettingsChange={updateSetting}
              fileInfo={null}
            />

            <div className="border-t border-gray-700 pt-4"></div>
          </>
        )}

        {/* Audio Settings - Show for both video and audio files */}
        {(isVideo || isAudio) && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">
              {isAudio ? 'Audio Settings' : 'Audio Track Settings'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">Audio Codec</label>
                <select
                  value={settings.audioCodec || ''}
                  onChange={(e) => updateSetting('audioCodec', e.target.value)}
                  className="select w-full"
                >
                  <option value="">Default for preset</option>
                  {AUDIO_CODECS.map((codec) => (
                    <option key={codec.value} value={codec.value}>
                      {codec.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Audio Bitrate</label>
                <input
                  type="text"
                  value={settings.audioBitrate || ''}
                  onChange={(e) => updateSetting('audioBitrate', e.target.value)}
                  placeholder="e.g., 192k or 320k"
                  className="input w-full"
                />
              </div>

              <div>
                <label className="label">Audio Sample Rate</label>
                <select
                  value={settings.audioSampleRate || ''}
                  onChange={(e) => updateSetting('audioSampleRate', e.target.value)}
                  className="select w-full"
                >
                  <option value="">Original</option>
                  <option value="48000">48000 Hz</option>
                  <option value="44100">44100 Hz</option>
                  <option value="32000">32000 Hz</option>
                  <option value="22050">22050 Hz</option>
                </select>
              </div>

              <div>
                <label className="label">Audio Channels</label>
                <select
                  value={settings.audioChannels || ''}
                  onChange={(e) => updateSetting('audioChannels', e.target.value)}
                  className="select w-full"
                >
                  <option value="">Original</option>
                  <option value="2">Stereo (2 channels)</option>
                  <option value="1">Mono (1 channel)</option>
                  {isVideo && (
                    <>
                      <option value="6">5.1 Surround (6 channels)</option>
                      <option value="8">7.1 Surround (8 channels)</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Image Settings - Only show for images */}
        {isImage && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Image Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">
                  Quality: {settings.imageQuality || selectedPreset?.settings?.quality || 85}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={settings.imageQuality || selectedPreset?.settings?.quality || 85}
                  onChange={(e) => updateSetting('imageQuality', parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-elevated2 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Smallest Size</span>
                  <span>Best Quality</span>
                </div>
              </div>

              <div>
                <label className="label">Resize (optional)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={settings.imageWidth || ''}
                    onChange={(e) => updateSetting('imageWidth', e.target.value)}
                    placeholder="Width"
                    className="input"
                  />
                  <input
                    type="number"
                    value={settings.imageHeight || ''}
                    onChange={(e) => updateSetting('imageHeight', e.target.value)}
                    placeholder="Height"
                    className="input"
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Leave empty to keep original size
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Arguments - Always show */}
        <div className="border-t border-gray-700 pt-4">
          <label className="label">
            Additional FFmpeg Arguments
            <span className="ml-2 text-xs text-gray-400">(Advanced users only)</span>
          </label>
          <textarea
            value={settings.additionalArgs || ''}
            onChange={(e) => updateSetting('additionalArgs', e.target.value)}
            placeholder="e.g., -map 0 -metadata title=&quot;My Media&quot;"
            rows="3"
            className="input w-full font-mono text-sm"
          />
          <div className="text-xs text-gray-400 mt-1">
            Custom FFmpeg arguments will be appended to the command
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => onSettingsChange({})}
          className="w-full btn-secondary"
        >
          Reset Customizations
        </button>
      </div>
    </div>
  );
}

export default AdvancedSettings;

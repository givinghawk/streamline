import React from 'react';
import { PRESETS } from '../constants/presets';
import { 
  SparklesIcon, 
  BalanceIcon, 
  LightningIcon, 
  FilmIcon, 
  VideoIcon, 
  RocketIcon, 
  AudioIcon, 
  ImageIcon,
  CheckIcon,
  WarningIcon
} from './icons/Icons';

const PRESET_ICONS = {
  // Video presets
  'high-quality': SparklesIcon,
  'balanced': BalanceIcon,
  'fast': LightningIcon,
  'hevc-high': FilmIcon,
  'hevc-balanced': VideoIcon,
  'av1-high': RocketIcon,
  
  // Audio presets
  'audio-lossless': SparklesIcon,
  'audio-high-opus': SparklesIcon,
  'audio-high-mp3': SparklesIcon,
  'audio-standard-opus': BalanceIcon,
  'audio-standard-mp3': BalanceIcon,
  'audio-lightweight': LightningIcon,
  'audio-ultra-lightweight': RocketIcon,
  
  // Image presets
  'image-webp-high': SparklesIcon,
  'image-webp-balanced': BalanceIcon,
  'image-jpeg-high': SparklesIcon,
  'image-jpeg-web': BalanceIcon,
  'image-png': ImageIcon,
  'image-gif': ImageIcon,
};

function PresetSelector({ selectedPreset, onPresetSelect, disabled, presets, fileType }) {
  const presetsToShow = presets || PRESETS;
  const categories = {
    video: presetsToShow.filter(p => p.category === 'video'),
    audio: presetsToShow.filter(p => p.category === 'audio'),
    image: presetsToShow.filter(p => p.category === 'image'),
  };

  const getPresetIcon = (presetId) => {
    const IconComponent = PRESET_ICONS[presetId] || SparklesIcon;
    return IconComponent;
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Encoding Presets</h2>
      
      {disabled && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md p-3 mb-4">
          <div className="flex items-center space-x-2">
            <WarningIcon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-yellow-400">
              Presets are disabled when using advanced settings
            </p>
          </div>
        </div>
      )}

      {fileType && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-3 mb-4">
          <p className="text-sm text-blue-400">
            Showing presets for <span className="font-semibold">{fileType.type}</span> files
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Video Presets */}
        {categories.video.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Video</h3>
            <div className="space-y-2">
              {categories.video.map((preset) => {
                const IconComponent = getPresetIcon(preset.id);
                return (
                  <button
                    key={preset.id}
                    onClick={() => onPresetSelect(preset)}
                    disabled={disabled}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedPreset?.id === preset.id
                        ? 'bg-primary-600 shadow-lg'
                        : 'bg-surface-elevated2 hover:bg-surface-elevated3'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className="w-6 h-6 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {preset.description}
                        </div>
                      </div>
                      {selectedPreset?.id === preset.id && (
                        <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Audio Presets */}
        {categories.audio.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Audio</h3>
            <div className="space-y-2">
              {categories.audio.map((preset) => {
                const IconComponent = getPresetIcon(preset.id);
                return (
                  <button
                    key={preset.id}
                    onClick={() => onPresetSelect(preset)}
                    disabled={disabled}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedPreset?.id === preset.id
                        ? 'bg-primary-600 shadow-lg'
                        : 'bg-surface-elevated2 hover:bg-surface-elevated3'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className="w-6 h-6 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {preset.description}
                        </div>
                      </div>
                      {selectedPreset?.id === preset.id && (
                        <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Image Presets */}
        {categories.image.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Image</h3>
            <div className="space-y-2">
              {categories.image.map((preset) => {
                const IconComponent = getPresetIcon(preset.id);
                return (
                  <button
                    key={preset.id}
                    onClick={() => onPresetSelect(preset)}
                    disabled={disabled}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedPreset?.id === preset.id
                        ? 'bg-primary-600 shadow-lg'
                        : 'bg-surface-elevated2 hover:bg-surface-elevated3'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className="w-6 h-6 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {preset.description}
                        </div>
                      </div>
                      {selectedPreset?.id === preset.id && (
                        <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PresetSelector;

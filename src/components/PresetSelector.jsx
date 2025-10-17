import React, { useState, useEffect, useRef } from 'react';
import { PRESETS } from '../constants/presets';
import { getDownloadedPresets } from '../utils/presetRepository';
import { AdvancedPresetEngine } from '../utils/advancedPresets';
import PresetRepositoryManager from './PresetRepositoryManager';
import AdvancedPresetInfo from './AdvancedPresetInfo';
import { useSettings } from '../contexts/SettingsContext';
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
  WarningIcon,
  SaveIcon,
  UploadIcon
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

function PresetSelector({ selectedPreset, onPresetSelect, disabled, presets, fileType, onExportPreset, onImportPreset }) {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showRepoManager, setShowRepoManager] = useState(false);
  const [downloadedPresets, setDownloadedPresets] = useState([]);
  const searchInputRef = useRef(null);
  
  // Load downloaded presets
  useEffect(() => {
    loadDownloadedPresets();
  }, []);
  
  const loadDownloadedPresets = () => {
    const downloaded = getDownloadedPresets();
    setDownloadedPresets(downloaded);
  };
  
  // Combine built-in and downloaded presets
  const allPresets = presets || [...PRESETS, ...downloadedPresets];
  const presetsToShow = allPresets;
  
  // Filter presets by search query
  const filteredPresets = searchQuery.trim() === '' 
    ? presetsToShow 
    : presetsToShow.filter(preset => 
        preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  const categories = {
    video: filteredPresets.filter(p => p.category === 'video'),
    audio: filteredPresets.filter(p => p.category === 'audio'),
    image: filteredPresets.filter(p => p.category === 'image'),
  };

  const getPresetIcon = (presetId) => {
    const IconComponent = PRESET_ICONS[presetId] || SparklesIcon;
    return IconComponent;
  };
  
  // Render a single preset button
  const renderPresetButton = (preset) => {
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
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="font-medium">{preset.name}</span>
              {preset.source && (
                <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                  settings.theme === 'dark'
                    ? 'bg-blue-900/30 text-blue-400'
                    : 'bg-blue-100 text-blue-700'
                }`} title={`From ${preset.source}`}>
                  {preset.source.split('/')[1] || preset.source}
                </span>
              )}
            </div>
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
  };
  
  // Handle Ctrl+F to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Clear search on Escape
      if (e.key === 'Escape' && isSearchFocused) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Encoding Presets</h2>
        <div className="flex items-center space-x-2">
          {onImportPreset && (
            <button
              onClick={onImportPreset}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                settings.theme === 'dark'
                  ? 'bg-surface-elevated2 hover:bg-surface-elevated3 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Import preset from .slpreset file"
            >
              <span className="flex items-center space-x-1">
                <UploadIcon className="w-4 h-4" />
                <span>Import</span>
              </span>
            </button>
          )}
          {onExportPreset && (
            <button
              onClick={onExportPreset}
              disabled={!selectedPreset}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !selectedPreset ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                settings.theme === 'dark'
                  ? 'bg-surface-elevated2 hover:bg-surface-elevated3 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Export selected preset to .slpreset file"
            >
              <span className="flex items-center space-x-1">
                <SaveIcon className="w-4 h-4" />
                <span>Export</span>
              </span>
            </button>
          )}
          <button
            onClick={() => setShowRepoManager(true)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              settings.theme === 'dark'
                ? 'bg-surface-elevated2 hover:bg-surface-elevated3 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="Manage preset repositories"
          >
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Repositories</span>
            </span>
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search presets... (Ctrl+F)"
            className="w-full px-4 py-2 pl-10 bg-surface-elevated2 border border-gray-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                     placeholder-gray-500 text-gray-200"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-xs text-gray-500 mt-2">
            Found {filteredPresets.length} preset{filteredPresets.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      
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
        {/* No results message */}
        {filteredPresets.length === 0 && (
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-400">No presets found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-sm text-primary-400 hover:text-primary-300"
            >
              Clear search
            </button>
          </div>
        )}
        
        {/* Video Presets */}
        {categories.video.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Video</h3>
            <div className="space-y-2">
              {categories.video.map(renderPresetButton)}
            </div>
          </div>
        )}

        {/* Audio Presets */}
        {categories.audio.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Audio</h3>
            <div className="space-y-2">
              {categories.audio.map(renderPresetButton)}
            </div>
          </div>
        )}

        {/* Image Presets */}
        {categories.image.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Image</h3>
            <div className="space-y-2">
              {categories.image.map(renderPresetButton)}
            </div>
          </div>
        )}
      </div>
      
      {/* Selected Preset Details */}
      {selectedPreset && AdvancedPresetEngine.isAdvanced(selectedPreset) && (
        <div className="mt-6 border-t border-gray-700 pt-6">
          <AdvancedPresetInfo 
            preset={selectedPreset}
            fileInfo={null}
          />
        </div>
      )}

      <PresetRepositoryManager
        isOpen={showRepoManager}
        onClose={() => setShowRepoManager(false)}
        theme={settings.theme}
        onPresetsUpdated={loadDownloadedPresets}
      />
    </div>
  );
}

export default PresetSelector;

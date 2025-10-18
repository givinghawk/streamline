import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRESETS } from '../constants/presets';
import { getDownloadedPresets } from '../utils/presetRepository';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    autoOverwrite: false,
    defaultOutputPath: '',
    showAdvancedByDefault: false,
    hardwareAccelEnabled: true,
    rememberLastPreset: true,
    lastPresetId: null,
    enableQualityAnalysis: false,
    notifyOnCompletion: true,
    maxConcurrentJobs: 1,
    batchMode: false, // false = same directory with _optimised suffix (default), true = /optimised subfolder
    updateChannel: 'stable', // 'stable' or 'beta'
  });

  const [customPresets, setCustomPresets] = useState([]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await window.electron.getSetting('appSettings');
        const savedPresets = await window.electron.getSetting('customPresets');
        
        if (savedSettings) {
          setSettings(savedSettings);
        }
        if (savedPresets) {
          setCustomPresets(savedPresets);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await window.electron.setSetting('appSettings', settings);
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    };
    
    saveSettings();
  }, [settings]);

  // Save custom presets whenever they change
  useEffect(() => {
    const savePresets = async () => {
      try {
        await window.electron.setSetting('customPresets', customPresets);
      } catch (error) {
        console.error('Error saving presets:', error);
      }
    };
    
    savePresets();
  }, [customPresets]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const addCustomPreset = (preset) => {
    setCustomPresets(prev => [...prev, { ...preset, isCustom: true }]);
  };

  const updateCustomPreset = (id, updatedPreset) => {
    setCustomPresets(prev => 
      prev.map(p => p.id === id ? { ...updatedPreset, isCustom: true } : p)
    );
  };

  const deleteCustomPreset = (id) => {
    setCustomPresets(prev => prev.filter(p => p.id !== id));
  };

  const getAllPresets = () => {
    const downloadedPresets = getDownloadedPresets();
    return [...PRESETS, ...customPresets, ...downloadedPresets];
  };

  const exportPreset = (preset) => {
    const presetData = {
      ...preset,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(presetData, null, 2);
  };

  const importPreset = (jsonString) => {
    try {
      const preset = JSON.parse(jsonString);
      
      // Validate preset structure
      if (!preset.id || !preset.name || !preset.category) {
        throw new Error('Invalid preset format: missing required fields');
      }

      // Check if preset ID already exists
      const allPresets = getAllPresets();
      const existingPreset = allPresets.find(p => p.id === preset.id);
      
      if (existingPreset) {
        // Generate new ID if conflict
        preset.id = `${preset.id}-imported-${Date.now()}`;
      }

      // Remove export metadata
      delete preset.exportedAt;
      delete preset.version;

      addCustomPreset(preset);
      return { success: true, preset };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const importPresetFromFFmpegCommand = (command, metadata = {}) => {
    try {
      const preset = parseFFmpegCommand(command, metadata);
      addCustomPreset(preset);
      return { success: true, preset };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const parseFFmpegCommand = (command, metadata) => {
    const settings = {};
    const args = command.trim().split(/\s+/);

    // Extract common settings
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const nextArg = args[i + 1];

      switch (arg) {
        case '-c:v':
        case '-vcodec':
          settings.videoCodec = nextArg;
          i++;
          break;
        case '-c:a':
        case '-acodec':
          settings.audioCodec = nextArg;
          i++;
          break;
        case '-b:v':
          settings.videoBitrate = nextArg;
          i++;
          break;
        case '-b:a':
          settings.audioBitrate = nextArg;
          i++;
          break;
        case '-crf':
          settings.crf = parseInt(nextArg);
          i++;
          break;
        case '-preset':
          settings.preset = nextArg;
          i++;
          break;
        case '-r':
          settings.fps = nextArg;
          i++;
          break;
        case '-s':
        case '-vf':
          if (nextArg && nextArg.includes('scale=')) {
            const scaleMatch = nextArg.match(/scale=(-?\d+):(-?\d+)/);
            if (scaleMatch) {
              settings.resolution = `${scaleMatch[1]}x${scaleMatch[2]}`;
            }
          }
          i++;
          break;
        case '-ar':
          settings.audioSampleRate = nextArg;
          i++;
          break;
        case '-ac':
          settings.audioChannels = nextArg;
          i++;
          break;
        case '-f':
          settings.outputFormat = nextArg;
          i++;
          break;
        case '-q:v':
        case '-qscale:v':
          settings.imageQuality = parseInt(nextArg);
          i++;
          break;
      }
    }

    // Determine category based on codecs
    let category = 'video';
    if (settings.videoCodec === 'copy' || !settings.videoCodec) {
      if (settings.audioCodec) {
        category = 'audio';
      }
    }
    if (settings.outputFormat && ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp'].includes(settings.outputFormat)) {
      category = 'image';
    }

    const preset = {
      id: metadata.id || `custom-${Date.now()}`,
      name: metadata.name || 'Imported Preset',
      category: metadata.category || category,
      description: metadata.description || `Imported from FFmpeg command`,
      settings,
      ffmpegCommand: command,
      isCustom: true,
    };

    return preset;
  };

  const value = {
    settings,
    updateSetting,
    customPresets,
    addCustomPreset,
    updateCustomPreset,
    deleteCustomPreset,
    getAllPresets,
    exportPreset,
    importPreset,
    importPresetFromFFmpegCommand,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import {
  SettingsIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  FolderIcon,
  SaveIcon,
  UploadIcon,
  DeleteIcon,
  EditIcon,
  PlusIcon,
  CodeIcon,
  CheckIcon,
  CloseIcon,
} from './icons/Icons';
import PresetCreator from './PresetCreator';
import PresetImporter from './PresetImporter';

function SettingsPanel({ onClose }) {
  const { settings, updateSetting, customPresets, deleteCustomPreset, exportPreset } = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const [showPresetCreator, setShowPresetCreator] = useState(false);
  const [showPresetImporter, setShowPresetImporter] = useState(false);
  const [editingPreset, setEditingPreset] = useState(null);

  const handleExportPreset = (preset) => {
    const jsonString = exportPreset(preset);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${preset.id}.preset.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEditPreset = (preset) => {
    setEditingPreset(preset);
    setShowPresetCreator(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-elevated w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <SettingsIcon className="w-6 h-6 text-primary-400" />
            <h2 className="text-2xl font-semibold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-elevated2 rounded-lg transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'general'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'appearance'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'presets'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Presets ({customPresets.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Behavior</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-surface-elevated2 rounded-lg cursor-pointer hover:bg-surface-elevated2/80 transition-colors">
                    <div>
                      <div className="font-medium">Auto Overwrite Files</div>
                      <div className="text-sm text-gray-400">
                        Automatically overwrite existing files without asking
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoOverwrite}
                      onChange={(e) => updateSetting('autoOverwrite', e.target.checked)}
                      className="w-5 h-5 rounded bg-surface border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-surface-elevated2 rounded-lg cursor-pointer hover:bg-surface-elevated2/80 transition-colors">
                    <div>
                      <div className="font-medium">Hardware Acceleration</div>
                      <div className="text-sm text-gray-400">
                        Enable GPU acceleration when available
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.hardwareAccelEnabled}
                      onChange={(e) => updateSetting('hardwareAccelEnabled', e.target.checked)}
                      className="w-5 h-5 rounded bg-surface border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-surface-elevated2 rounded-lg cursor-pointer hover:bg-surface-elevated2/80 transition-colors">
                    <div>
                      <div className="font-medium">Remember Last Preset</div>
                      <div className="text-sm text-gray-400">
                        Automatically select the last used preset
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.rememberLastPreset}
                      onChange={(e) => updateSetting('rememberLastPreset', e.target.checked)}
                      className="w-5 h-5 rounded bg-surface border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-surface-elevated2 rounded-lg cursor-pointer hover:bg-surface-elevated2/80 transition-colors">
                    <div>
                      <div className="font-medium">Show Advanced Settings</div>
                      <div className="text-sm text-gray-400">
                        Expand advanced settings panel by default
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showAdvancedByDefault}
                      onChange={(e) => updateSetting('showAdvancedByDefault', e.target.checked)}
                      className="w-5 h-5 rounded bg-surface border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-surface-elevated2 rounded-lg cursor-pointer hover:bg-surface-elevated2/80 transition-colors">
                    <div>
                      <div className="font-medium">Quality Analysis</div>
                      <div className="text-sm text-gray-400">
                        Run PSNR/SSIM/VMAF analysis after encoding
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableQualityAnalysis}
                      onChange={(e) => updateSetting('enableQualityAnalysis', e.target.checked)}
                      className="w-5 h-5 rounded bg-surface border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-surface-elevated2 rounded-lg cursor-pointer hover:bg-surface-elevated2/80 transition-colors">
                    <div>
                      <div className="font-medium">Notify on Completion</div>
                      <div className="text-sm text-gray-400">
                        Show system notification when batch is complete
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifyOnCompletion}
                      onChange={(e) => updateSetting('notifyOnCompletion', e.target.checked)}
                      className="w-5 h-5 rounded bg-surface border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
                    />
                  </label>

                  <div className="p-4 bg-surface-elevated2 rounded-lg">
                    <label className="block mb-2">
                      <div className="font-medium">Max Concurrent Jobs</div>
                      <div className="text-sm text-gray-400 mb-2">
                        Number of files to encode simultaneously
                      </div>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={settings.maxConcurrentJobs}
                      onChange={(e) => updateSetting('maxConcurrentJobs', parseInt(e.target.value))}
                      className="input w-32"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Quality Validation</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-surface-elevated2 rounded-lg cursor-pointer hover:bg-surface-elevated2/80 transition-colors">
                    <div>
                      <div className="font-medium">Enable Quality Validation</div>
                      <div className="text-sm text-gray-400">
                        Automatically validate output quality and show warnings
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableQualityValidation}
                      onChange={(e) => updateSetting('enableQualityValidation', e.target.checked)}
                      className="w-5 h-5 rounded bg-surface border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
                    />
                  </label>

                  {settings.enableQualityValidation && (
                    <div className="p-4 bg-surface-elevated2 rounded-lg space-y-4">
                      <div>
                        <label className="block mb-2">
                          <div className="font-medium">PSNR Threshold (dB)</div>
                          <div className="text-sm text-gray-400 mb-2">
                            Minimum PSNR value to consider acceptable quality
                          </div>
                        </label>
                        <input
                          type="number"
                          min="20"
                          max="50"
                          step="0.1"
                          value={settings.qualityThresholds?.psnr || 30}
                          onChange={(e) => updateSetting('qualityThresholds', {
                            ...settings.qualityThresholds,
                            psnr: parseFloat(e.target.value)
                          })}
                          className="input w-32"
                        />
                      </div>

                      <div>
                        <label className="block mb-2">
                          <div className="font-medium">SSIM Threshold</div>
                          <div className="text-sm text-gray-400 mb-2">
                            Minimum SSIM value (0-1 scale) to consider acceptable quality
                          </div>
                        </label>
                        <input
                          type="number"
                          min="0.5"
                          max="1"
                          step="0.01"
                          value={settings.qualityThresholds?.ssim || 0.9}
                          onChange={(e) => updateSetting('qualityThresholds', {
                            ...settings.qualityThresholds,
                            ssim: parseFloat(e.target.value)
                          })}
                          className="input w-32"
                        />
                      </div>

                      <div>
                        <label className="block mb-2">
                          <div className="font-medium">VMAF Threshold</div>
                          <div className="text-sm text-gray-400 mb-2">
                            Minimum VMAF score (0-100 scale) to consider acceptable quality
                          </div>
                        </label>
                        <input
                          type="number"
                          min="50"
                          max="100"
                          step="1"
                          value={settings.qualityThresholds?.vmaf || 80}
                          onChange={(e) => updateSetting('qualityThresholds', {
                            ...settings.qualityThresholds,
                            vmaf: parseFloat(e.target.value)
                          })}
                          className="input w-32"
                        />
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-surface-elevated2 rounded-lg">
                    <label className="block mb-2">
                      <div className="font-medium">Max Recent Files</div>
                      <div className="text-sm text-gray-400 mb-2">
                        Maximum number of recent files to remember
                      </div>
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={settings.maxRecentFiles || 10}
                      onChange={(e) => updateSetting('maxRecentFiles', parseInt(e.target.value))}
                      className="input w-32"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Default Paths</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Default Output Directory</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={settings.defaultOutputPath}
                        onChange={(e) => updateSetting('defaultOutputPath', e.target.value)}
                        placeholder="Leave empty to use source folder"
                        className="input flex-1"
                      />
                      <button
                        onClick={async () => {
                          const path = await window.electron.selectDirectory();
                          if (path) {
                            updateSetting('defaultOutputPath', path);
                          }
                        }}
                        className="btn-secondary px-4"
                      >
                        <FolderIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Default location for encoded files
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Updates</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-surface-elevated2 rounded-lg">
                    <label className="block mb-2">
                      <div className="font-medium">Update Channel</div>
                      <div className="text-sm text-gray-400 mb-3">
                        Choose which releases to receive
                      </div>
                    </label>
                    <select
                      value={settings.updateChannel || 'stable'}
                      onChange={(e) => updateSetting('updateChannel', e.target.value)}
                      className="input w-full"
                    >
                      <option value="stable">Stable Releases Only</option>
                      <option value="beta">Beta Releases (Latest Features)</option>
                    </select>
                    <div className="text-xs text-gray-400 mt-2">
                      {settings.updateChannel === 'beta' 
                        ? 'You will receive the latest beta builds with new features'
                        : 'You will only receive tested stable releases'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Theme</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => updateSetting('theme', 'dark')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      settings.theme === 'dark'
                        ? 'border-primary-400 bg-primary-500/10'
                        : 'border-gray-700 bg-surface-elevated2 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <MoonIcon className="w-12 h-12 text-blue-400" />
                      <div>
                        <div className="font-semibold">Dark Mode</div>
                        <div className="text-xs text-gray-400">Easy on the eyes</div>
                      </div>
                      {settings.theme === 'dark' && (
                        <div className="flex items-center space-x-1 text-primary-400 text-sm">
                          <CheckIcon className="w-4 h-4" />
                          <span>Active</span>
                        </div>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => updateSetting('theme', 'light')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      settings.theme === 'light'
                        ? 'border-primary-400 bg-primary-500/10'
                        : 'border-gray-700 bg-surface-elevated2 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <SunIcon className="w-12 h-12 text-yellow-400" />
                      <div>
                        <div className="font-semibold">Light Mode</div>
                        <div className="text-xs text-gray-400">Bright and clean</div>
                      </div>
                      {settings.theme === 'light' && (
                        <div className="flex items-center space-x-1 text-primary-400 text-sm">
                          <CheckIcon className="w-4 h-4" />
                          <span>Active</span>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preset Management */}
          {activeTab === 'presets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Custom Presets</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingPreset(null);
                      setShowPresetImporter(true);
                    }}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <UploadIcon className="w-4 h-4" />
                    <span>Import</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingPreset(null);
                      setShowPresetCreator(true);
                    }}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Create Preset</span>
                  </button>
                </div>
              </div>

              {customPresets.length === 0 ? (
                <div className="text-center py-12">
                  <SparklesIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-400 mb-2">No custom presets yet</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Create your own presets or import from FFmpeg commands
                  </p>
                  <button
                    onClick={() => setShowPresetCreator(true)}
                    className="btn-primary"
                  >
                    Create Your First Preset
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {customPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className="bg-surface-elevated2 rounded-lg p-4 hover:bg-surface-elevated2/80 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold">{preset.name}</h4>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              preset.category === 'video' ? 'bg-blue-500/20 text-blue-400' :
                              preset.category === 'audio' ? 'bg-green-500/20 text-green-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {preset.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{preset.description}</p>
                          {preset.ffmpegCommand && (
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <CodeIcon className="w-3 h-3" />
                              <code className="font-mono">{preset.ffmpegCommand.substring(0, 60)}...</code>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEditPreset(preset)}
                            className="p-2 hover:bg-surface rounded transition-colors"
                            title="Edit preset"
                          >
                            <EditIcon className="w-4 h-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleExportPreset(preset)}
                            className="p-2 hover:bg-surface rounded transition-colors"
                            title="Export preset"
                          >
                            <SaveIcon className="w-4 h-4 text-green-400" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete preset "${preset.name}"?`)) {
                                deleteCustomPreset(preset.id);
                              }
                            }}
                            className="p-2 hover:bg-surface rounded transition-colors"
                            title="Delete preset"
                          >
                            <DeleteIcon className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showPresetCreator && (
        <PresetCreator
          preset={editingPreset}
          onClose={() => {
            setShowPresetCreator(false);
            setEditingPreset(null);
          }}
        />
      )}

      {showPresetImporter && (
        <PresetImporter
          onClose={() => setShowPresetImporter(false)}
        />
      )}
    </div>
  );
}

export default SettingsPanel;

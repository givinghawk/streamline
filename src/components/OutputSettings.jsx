import React from 'react';
import { FolderIcon, BulbIcon } from './icons/Icons';
import { useSettings } from '../contexts/SettingsContext';

function OutputSettings({ outputDirectory, onOutputDirectoryChange, overwriteFiles, onOverwriteChange }) {
  const { settings, updateSetting } = useSettings();
  
  const handleSelectDirectory = async () => {
    if (window.electron) {
      const directory = await window.electron.selectOutputDirectory();
      if (directory) {
        onOutputDirectoryChange(directory);
      }
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Output Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="label">Output Directory</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={outputDirectory}
              onChange={(e) => onOutputDirectoryChange(e.target.value)}
              placeholder="Default: /optimised subfolder in source directory"
              className="input flex-1"
            />
            <button
              onClick={handleSelectDirectory}
              className="btn-secondary whitespace-nowrap"
            >
              Browse
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            {outputDirectory 
              ? `Files will be saved to: ${outputDirectory}`
              : 'Files will be saved to an /optimised subfolder next to the source file'
            }
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.batchMode}
              onChange={(e) => updateSetting('batchMode', e.target.checked)}
              className="w-5 h-5 rounded bg-surface-elevated2 border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
            />
            <div>
              <div className="font-medium">Batch Mode (Use /optimised subfolder)</div>
              <div className="text-xs text-gray-400">
                {settings.batchMode
                  ? 'Files will be saved to an /optimised subfolder next to the source file'
                  : 'Files will be saved in the same directory with an "_optimised" suffix'}
              </div>
            </div>
          </label>
        </div>

        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={overwriteFiles}
              onChange={(e) => onOverwriteChange(e.target.checked)}
              className="w-5 h-5 rounded bg-surface-elevated2 border-gray-600 text-primary-600 focus:ring-2 focus:ring-primary-500"
            />
            <div>
              <div className="font-medium">Overwrite existing files</div>
              <div className="text-xs text-gray-400">
                Replace files instead of creating new ones with "_optimised" suffix
              </div>
            </div>
          </label>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <BulbIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-blue-400 mb-1">Tip</div>
              <div className="text-sm text-gray-300">
                {overwriteFiles 
                  ? 'Original files will be replaced. Make sure you have backups!'
                  : 'Output files will be named with an "_optimised" suffix to prevent overwriting originals.'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutputSettings;

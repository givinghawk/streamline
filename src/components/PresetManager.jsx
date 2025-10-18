import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import PresetWizard from './PresetWizard';
import { PRESETS } from '../constants/presets';

// Icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

function PresetManager() {
  const { settings, customPresets, addCustomPreset, updateCustomPreset, deleteCustomPreset } = useSettings();
  const [showWizard, setShowWizard] = useState(false);
  const [editingPreset, setEditingPreset] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleCreatePreset = (presetData) => {
    const newPreset = {
      ...presetData,
      id: `custom-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    addCustomPreset(newPreset);
    setShowWizard(false);
  };

  const handleEditPreset = (preset) => {
    setEditingPreset(preset);
    setShowWizard(true);
  };

  const handleUpdatePreset = (presetData) => {
    updateCustomPreset(editingPreset.id, presetData);
    setShowWizard(false);
    setEditingPreset(null);
  };

  const handleDeletePreset = (presetId) => {
    if (confirm('Are you sure you want to delete this preset?')) {
      deleteCustomPreset(presetId);
    }
  };

  const handleExportPreset = (preset) => {
    const exportData = {
      name: preset.name,
      description: preset.description,
      category: preset.category,
      settings: preset.settings,
      version: '1.0',
      createdAt: preset.createdAt || new Date().toISOString(),
    };

    const fileName = `${preset.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.slpreset`;
    const jsonString = JSON.stringify(exportData, null, 2);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPreset = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.slpreset,.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const presetData = JSON.parse(event.target.result);
            const newPreset = {
              ...presetData,
              id: `custom-${Date.now()}`,
              imported: true,
            };
            
            addCustomPreset(newPreset);
            alert(`Imported preset: ${presetData.name}`);
          } catch (error) {
            alert('Failed to import preset. Invalid file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Combine built-in and custom presets
  const allPresets = [...PRESETS, ...customPresets];

  // Filter presets
  const filteredPresets = allPresets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (preset.description && preset.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || preset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Group by category
  const groupedPresets = filteredPresets.reduce((acc, preset) => {
    const category = preset.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(preset);
    return acc;
  }, {});

  const PresetCard = ({ preset }) => (
    <div className={`
      ${settings.theme === 'dark' ? 'bg-surface-elevated border-gray-700' : 'bg-gray-50 border-gray-200'}
      border rounded-lg p-4 hover:border-primary-500 transition-all group
    `}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-200 group-hover:text-primary-400 transition-colors">
            {preset.name}
            {preset.isCustom && (
              <span className="ml-2 text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded">
                Custom
              </span>
            )}
            {preset.imported && (
              <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                Imported
              </span>
            )}
          </h3>
          {preset.description && (
            <p className="text-sm text-gray-400 mt-1">{preset.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span className="capitalize">{preset.category}</span>
          {preset.settings?.videoCodec && (
            <>
              <span>•</span>
              <span>{preset.settings.videoCodec}</span>
            </>
          )}
          {preset.settings?.audioCodec && (
            <>
              <span>•</span>
              <span>{preset.settings.audioCodec}</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleExportPreset(preset)}
            className="p-2 text-gray-400 hover:text-primary-400 transition-colors rounded"
            title="Export preset"
          >
            <DownloadIcon />
          </button>
          
          {preset.isCustom && (
            <>
              <button
                onClick={() => handleEditPreset(preset)}
                className="p-2 text-gray-400 hover:text-blue-400 transition-colors rounded"
                title="Edit preset"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDeletePreset(preset.id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded"
                title="Delete preset"
              >
                <TrashIcon />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Preset Library</h1>
            <p className="text-gray-400 mt-1">
              Create, manage, and organize your encoding presets
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleImportPreset}
              className="btn-secondary flex items-center space-x-2"
            >
              <UploadIcon />
              <span>Import</span>
            </button>
            <button
              onClick={() => {
                setEditingPreset(null);
                setShowWizard(true);
              }}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon />
              <span>Create Preset</span>
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search presets..."
              className="input w-full pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FilterIcon className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select"
            >
              <option value="all">All Categories</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="image">Image</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className={`${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'} rounded-lg p-3`}>
            <div className="text-2xl font-bold text-primary-400">{allPresets.length}</div>
            <div className="text-xs text-gray-400">Total Presets</div>
          </div>
          <div className={`${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'} rounded-lg p-3`}>
            <div className="text-2xl font-bold text-green-400">{PRESETS.length}</div>
            <div className="text-xs text-gray-400">Built-in</div>
          </div>
          <div className={`${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'} rounded-lg p-3`}>
            <div className="text-2xl font-bold text-blue-400">{customPresets.length}</div>
            <div className="text-xs text-gray-400">Custom</div>
          </div>
          <div className={`${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'} rounded-lg p-3`}>
            <div className="text-2xl font-bold text-purple-400">
              {customPresets.filter(p => p.imported).length}
            </div>
            <div className="text-xs text-gray-400">Imported</div>
          </div>
        </div>
      </div>

      {/* Preset Grid */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedPresets).length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No presets found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPresets).map(([category, presets]) => (
              <div key={category}>
                <h2 className="text-xl font-bold text-gray-200 mb-3 capitalize flex items-center">
                  {category}
                  <span className="ml-2 text-sm text-gray-400 font-normal">
                    ({presets.length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {presets.map(preset => (
                    <PresetCard key={preset.id} preset={preset} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <PresetWizard
          preset={editingPreset}
          onSave={editingPreset ? handleUpdatePreset : handleCreatePreset}
          onClose={() => {
            setShowWizard(false);
            setEditingPreset(null);
          }}
        />
      )}
    </div>
  );
}

export default PresetManager;

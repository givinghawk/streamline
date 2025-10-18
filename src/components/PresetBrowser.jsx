import React, { useState, useEffect } from 'react';
import { fetchPresetsFromRepo, DEFAULT_REPO } from '../utils/presetRepository';

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

function PresetBrowser({ isOpen, onClose, theme, onPresetDownloaded }) {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [downloadingPresets, setDownloadingPresets] = useState(new Set());
  const [downloadedPresets, setDownloadedPresets] = useState(new Set());
  const [showRepoManager, setShowRepoManager] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [currentRepo, setCurrentRepo] = useState(DEFAULT_REPO);

  useEffect(() => {
    if (isOpen) {
      loadRepositories();
      loadPresets();
      loadDownloadedPresets();
    }
  }, [isOpen, currentRepo]);

  const loadRepositories = () => {
    try {
      const stored = localStorage.getItem('preset-repositories');
      if (stored) {
        const repos = JSON.parse(stored);
        setRepositories(repos);
      } else {
        // Initialize with default repo
        const defaultRepos = [{ owner: 'givinghawk', repo: 'streamline-presets', branch: 'main' }];
        setRepositories(defaultRepos);
        localStorage.setItem('preset-repositories', JSON.stringify(defaultRepos));
      }
    } catch (e) {
      console.error('Failed to load repositories:', e);
    }
  };

  const addRepository = () => {
    const input = prompt('Enter GitHub repository (format: owner/repo or owner/repo/branch):');
    if (!input) return;
    
    const parts = input.trim().split('/');
    if (parts.length < 2) {
      alert('Invalid format. Use: owner/repo or owner/repo/branch');
      return;
    }
    
    const newRepo = {
      owner: parts[0],
      repo: parts[1],
      branch: parts[2] || 'main'
    };
    
    const repoString = `${newRepo.owner}/${newRepo.repo}`;
    
    // Check if already exists
    if (repositories.some(r => `${r.owner}/${r.repo}` === repoString)) {
      alert('Repository already added');
      return;
    }
    
    const updated = [...repositories, newRepo];
    setRepositories(updated);
    localStorage.setItem('preset-repositories', JSON.stringify(updated));
  };

  const removeRepository = (owner, repo) => {
    const repoString = `${owner}/${repo}`;
    if (repoString === DEFAULT_REPO) {
      alert('Cannot remove default repository');
      return;
    }
    
    const updated = repositories.filter(r => `${r.owner}/${r.repo}` !== repoString);
    setRepositories(updated);
    localStorage.setItem('preset-repositories', JSON.stringify(updated));
    
    // Switch to default if current repo was removed
    if (currentRepo === repoString) {
      setCurrentRepo(DEFAULT_REPO);
    }
  };

  const loadPresets = async () => {
    setLoading(true);
    setError('');
    try {
      const repo = repositories.find(r => `${r.owner}/${r.repo}` === currentRepo);
      const branch = repo?.branch || 'main';
      const fetchedPresets = await fetchPresetsFromRepo(currentRepo, branch);
      setPresets(fetchedPresets);
    } catch (e) {
      setError(`Failed to load presets: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadDownloadedPresets = () => {
    try {
      const stored = localStorage.getItem('downloaded-presets');
      if (stored) {
        const downloaded = JSON.parse(stored);
        const ids = new Set(downloaded.map(p => p.id));
        setDownloadedPresets(ids);
      }
    } catch (e) {
      console.error('Failed to load downloaded presets:', e);
    }
  };

  const handleDownloadPreset = async (preset) => {
    setDownloadingPresets(prev => new Set([...prev, preset.id]));
    
    try {
      // Get existing downloaded presets
      const stored = localStorage.getItem('downloaded-presets');
      const existing = stored ? JSON.parse(stored) : [];
      
      // Check if already exists
      const existingIndex = existing.findIndex(p => p.id === preset.id);
      
      if (existingIndex >= 0) {
        // Update existing
        existing[existingIndex] = preset;
      } else {
        // Add new
        existing.push(preset);
      }
      
      // Save back to localStorage
      localStorage.setItem('downloaded-presets', JSON.stringify(existing));
      
      // Update UI
      setDownloadedPresets(prev => new Set([...prev, preset.id]));
      
      // Notify parent
      onPresetDownloaded?.();
      
    } catch (e) {
      alert(`Failed to download preset: ${e.message}`);
    } finally {
      setDownloadingPresets(prev => {
        const updated = new Set(prev);
        updated.delete(preset.id);
        return updated;
      });
    }
  };

  const filteredPresets = presets.filter(preset => {
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={`max-w-5xl w-full mx-4 rounded-xl shadow-2xl ${
          theme === 'dark' ? 'bg-surface' : 'bg-white'
        } max-h-[85vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                Download Presets
              </h2>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Browse and download community encoding presets
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowRepoManager(!showRepoManager)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
                title="Manage repositories"
              >
                <SettingsIcon />
              </button>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Repository Manager */}
        {showRepoManager && (
          <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} ${
            theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Repositories
              </h3>
              <button
                onClick={addRepository}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm transition-colors"
              >
                <PlusIcon />
                <span>Add Repository</span>
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {repositories.map((repo) => {
                const repoString = `${repo.owner}/${repo.repo}`;
                const isDefault = repoString === DEFAULT_REPO;
                return (
                  <div
                    key={repoString}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      theme === 'dark' ? 'bg-surface' : 'bg-white'
                    } ${currentRepo === repoString ? 'ring-2 ring-primary-500' : ''}`}
                  >
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        {repoString}
                        {isDefault && (
                          <span className="ml-2 text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Branch: {repo.branch || 'main'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentRepo(repoString)}
                        className={`px-3 py-1 rounded text-xs transition-colors ${
                          currentRepo === repoString
                            ? 'bg-primary-500 text-white'
                            : theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {currentRepo === repoString ? 'Active' : 'Select'}
                      </button>
                      {!isDefault && (
                        <button
                          onClick={() => removeRepository(repo.owner, repo.repo)}
                          className={`p-1 rounded transition-colors ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                              : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title="Remove repository"
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search & Filter */}
        <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <SearchIcon />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search presets by name or description..."
                className={`
                  w-full pl-10 pr-4 py-2 rounded-lg border
                  ${theme === 'dark' 
                    ? 'bg-surface-elevated border-gray-700 text-gray-200 placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                `}
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`
                px-4 py-2 rounded-lg border min-w-[180px]
                ${theme === 'dark' 
                  ? 'bg-surface-elevated border-gray-700 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-900'
                }
                focus:outline-none focus:ring-2 focus:ring-primary-500
              `}
            >
              <option value="all">All Categories</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="image">Image</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
              <button
                onClick={loadPresets}
                className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
              >
                Retry
              </button>
            </div>
          ) : filteredPresets.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No presets found</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedPresets).map(([category, categoryPresets]) => (
                <div key={category}>
                  <h3 className="text-lg font-bold text-gray-200 mb-3 capitalize flex items-center">
                    {category}
                    <span className="ml-2 text-sm text-gray-400 font-normal">
                      ({categoryPresets.length})
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categoryPresets.map((preset) => {
                      const isDownloading = downloadingPresets.has(preset.id);
                      const isDownloaded = downloadedPresets.has(preset.id);

                      return (
                        <div
                          key={preset.id}
                          className={`
                            p-4 rounded-lg border transition-all
                            ${theme === 'dark'
                              ? 'bg-surface-elevated border-gray-700 hover:border-gray-600'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-semibold ${
                                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                              }`}>
                                {preset.name}
                              </h4>
                              {preset.description && (
                                <p className={`text-sm mt-1 line-clamp-2 ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  {preset.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-2 mt-2">
                                {preset.settings?.videoCodec && (
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    theme === 'dark'
                                      ? 'bg-blue-900/30 text-blue-400'
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {preset.settings.videoCodec}
                                  </span>
                                )}
                                {preset.settings?.audioCodec && (
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    theme === 'dark'
                                      ? 'bg-purple-900/30 text-purple-400'
                                      : 'bg-purple-100 text-purple-700'
                                  }`}>
                                    {preset.settings.audioCodec}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownloadPreset(preset)}
                              disabled={isDownloading || isDownloaded}
                              className={`
                                ml-3 px-3 py-2 rounded-lg text-sm font-medium
                                flex items-center space-x-1 transition-all
                                ${isDownloaded
                                  ? theme === 'dark'
                                    ? 'bg-green-900/30 text-green-400 cursor-default'
                                    : 'bg-green-100 text-green-700 cursor-default'
                                  : theme === 'dark'
                                    ? 'bg-primary-900/30 text-primary-400 hover:bg-primary-900/50'
                                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed
                              `}
                            >
                              {isDownloading ? (
                                <>
                                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span>Downloading...</span>
                                </>
                              ) : isDownloaded ? (
                                <>
                                  <CheckIcon />
                                  <span>Downloaded</span>
                                </>
                              ) : (
                                <>
                                  <DownloadIcon />
                                  <span>Download</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          theme === 'dark' ? 'border-gray-700 bg-surface-elevated' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Found {filteredPresets.length} preset{filteredPresets.length !== 1 ? 's' : ''} • {downloadedPresets.size} downloaded
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresetBrowser;

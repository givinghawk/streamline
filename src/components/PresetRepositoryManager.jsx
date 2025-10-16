import React, { useState, useEffect } from 'react';
import {
  getPresetRepositories,
  addPresetRepository,
  removePresetRepository,
  downloadPresetsFromRepo,
  getDownloadedPresets,
  removePresetsFromSource,
  fetchRepoInfo,
  DEFAULT_REPO,
} from '../utils/presetRepository';

function PresetRepositoryManager({ isOpen, onClose, theme, onPresetsUpdated }) {
  const [repositories, setRepositories] = useState([]);
  const [repoInput, setRepoInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [repoInfo, setRepoInfo] = useState({});
  const [downloadingRepo, setDownloadingRepo] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadRepositories();
    }
  }, [isOpen]);

  const loadRepositories = async () => {
    const repos = getPresetRepositories();
    setRepositories(repos);

    // Load info for each repository
    const info = {};
    for (const repo of repos) {
      try {
        info[repo] = await fetchRepoInfo(repo);
      } catch (e) {
        console.error(`Failed to load info for ${repo}:`, e);
        info[repo] = { error: true };
      }
    }
    setRepoInfo(info);
  };

  const handleAddRepository = async () => {
    if (!repoInput.trim()) return;

    // Validate format (owner/repo)
    if (!repoInput.includes('/') || repoInput.split('/').length !== 2) {
      setError('Repository must be in format: owner/repo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addPresetRepository(repoInput.trim());
      setRepoInput('');
      await loadRepositories();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRepository = async (repo) => {
    if (repo === DEFAULT_REPO) {
      if (!confirm('Remove the default preset repository? You can add it back later.')) {
        return;
      }
    } else {
      if (!confirm(`Remove ${repo} and all its downloaded presets?`)) {
        return;
      }
    }

    removePresetRepository(repo);
    removePresetsFromSource(repo);
    await loadRepositories();
    onPresetsUpdated?.();
  };

  const handleDownloadPresets = async (repo) => {
    setDownloadingRepo(repo);
    setError('');

    try {
      const info = repoInfo[repo];
      const branch = info?.defaultBranch || 'main';
      const presets = await downloadPresetsFromRepo(repo, branch);
      
      alert(`Downloaded ${presets.length} preset${presets.length !== 1 ? 's' : ''} from ${repo}`);
      onPresetsUpdated?.();
    } catch (e) {
      setError(`Failed to download presets from ${repo}: ${e.message}`);
    } finally {
      setDownloadingRepo(null);
    }
  };

  const getPresetCount = (repo) => {
    const downloaded = getDownloadedPresets();
    return downloaded.filter(p => p.source === repo).length;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={`max-w-3xl w-full mx-4 rounded-xl shadow-2xl ${
          theme === 'dark' ? 'bg-surface-elevated' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                Preset Repositories
              </h2>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Download community presets from GitHub repositories
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {/* Add Repository */}
          <div className="mb-6">
            <label className={`block text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Add Repository
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRepository()}
                placeholder="owner/repo-name"
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-surface-elevated2 border-gray-700 text-gray-200 placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
              <button
                onClick={handleAddRepository}
                disabled={loading || !repoInput.trim()}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-400 mt-2">{error}</p>
            )}
          </div>

          {/* Repository List */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Configured Repositories
            </h3>
            <div className="space-y-3">
              {repositories.map((repo) => {
                const info = repoInfo[repo];
                const presetCount = getPresetCount(repo);
                const isDownloading = downloadingRepo === repo;

                return (
                  <div 
                    key={repo}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-surface-elevated2 border-gray-700'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-semibold ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                            {repo}
                          </h4>
                          {repo === DEFAULT_REPO && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              theme === 'dark'
                                ? 'bg-blue-900/30 text-blue-400'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              Default
                            </span>
                          )}
                        </div>
                        
                        {info && !info.error && (
                          <p className={`text-sm mt-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {info.description || 'No description'}
                          </p>
                        )}
                        
                        <div className={`flex items-center space-x-4 mt-2 text-xs ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {info && !info.error && (
                            <>
                              <span className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>{info.stars}</span>
                              </span>
                              <span>Updated {new Date(info.lastUpdated).toLocaleDateString()}</span>
                            </>
                          )}
                          <span className={presetCount > 0 ? 'text-green-400 font-medium' : ''}>
                            {presetCount} preset{presetCount !== 1 ? 's' : ''} downloaded
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleDownloadPresets(repo)}
                          disabled={isDownloading}
                          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                            theme === 'dark'
                              ? 'bg-primary-900/30 text-primary-400 hover:bg-primary-900/50'
                              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {isDownloading ? (
                            <span className="flex items-center space-x-1">
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Downloading...</span>
                            </span>
                          ) : presetCount > 0 ? (
                            'Update'
                          ) : (
                            'Download'
                          )}
                        </button>
                        <button
                          onClick={() => handleRemoveRepository(repo)}
                          className={`p-1.5 rounded transition-colors ${
                            theme === 'dark'
                              ? 'hover:bg-red-900/30 text-red-400'
                              : 'hover:bg-red-100 text-red-600'
                          }`}
                          title="Remove repository"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-surface-elevated2' : 'border-gray-200 bg-gray-50'}`}>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="mb-1">
              <strong>How it works:</strong> Repositories must have a <code className="px-1 py-0.5 rounded bg-gray-800 text-gray-300 font-mono text-xs">presets/</code> folder containing JSON preset files.
            </p>
            <p>
              Default repository: <code className="px-1 py-0.5 rounded bg-gray-800 text-gray-300 font-mono text-xs">{DEFAULT_REPO}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresetRepositoryManager;

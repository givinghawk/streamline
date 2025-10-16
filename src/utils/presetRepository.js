/**
 * Preset Repository Manager
 * Handles downloading and managing presets from GitHub repositories
 */

const DEFAULT_REPO = 'givinghawk/streamline-presets';
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com';

/**
 * Fetch presets from a GitHub repository
 * @param {string} repo - Repository in format 'owner/repo'
 * @param {string} branch - Branch name (default: 'main')
 * @returns {Promise<Array>} Array of preset objects
 */
export async function fetchPresetsFromRepo(repo, branch = 'main') {
  try {
    const presets = [];

    // Fetch regular presets
    try {
      const regularPresets = await fetchPresetsFromFolder(repo, branch, 'presets');
      presets.push(...regularPresets);
    } catch (e) {
      console.warn(`No regular presets found in ${repo}:`, e.message);
    }

    // Fetch advanced presets
    try {
      const advancedPresets = await fetchPresetsFromFolder(repo, branch, 'advanced-presets');
      presets.push(...advancedPresets.map(p => ({ ...p, isAdvanced: true })));
    } catch (e) {
      console.warn(`No advanced presets found in ${repo}:`, e.message);
    }

    if (presets.length === 0) {
      throw new Error(`No presets found in ${repo} (checked presets/ and advanced-presets/ folders)`);
    }

    return presets;
  } catch (error) {
    console.error(`Error fetching presets from ${repo}:`, error);
    throw error;
  }
}

/**
 * Fetch presets from a specific folder in a repository
 * @private
 */
async function fetchPresetsFromFolder(repo, branch, folder) {
  const apiUrl = `${GITHUB_API_BASE}/repos/${repo}/contents/${folder}?ref=${branch}`;
  const response = await fetch(apiUrl, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Folder not found: ${folder}`);
  }

  const files = await response.json();
  
  // Filter for JSON files
  const presetFiles = files.filter(file => 
    file.type === 'file' && file.name.endsWith('.json')
  );

  // Fetch each preset file
  const presets = await Promise.all(
    presetFiles.map(async (file) => {
      const rawUrl = `${GITHUB_RAW_BASE}/${repo}/${branch}/${folder}/${file.name}`;
      const presetResponse = await fetch(rawUrl);
      
      if (!presetResponse.ok) {
        console.error(`Failed to fetch preset ${file.name}`);
        return null;
      }

      const presetData = await presetResponse.json();
      
      // Add metadata
      return {
        ...presetData,
        source: repo,
        sourceFile: file.name,
        sourceFolder: folder,
        downloadedAt: new Date().toISOString(),
      };
    })
  );

  // Filter out failed downloads
  return presets.filter(p => p !== null);
}

/**
 * Fetch repository information
 * @param {string} repo - Repository in format 'owner/repo'
 * @returns {Promise<Object>} Repository metadata
 */
export async function fetchRepoInfo(repo) {
  try {
    const apiUrl = `${GITHUB_API_BASE}/repos/${repo}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`Repository not found: ${repo}`);
    }

    const data = await response.json();
    
    return {
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      lastUpdated: data.updated_at,
      defaultBranch: data.default_branch,
      owner: data.owner.login,
    };
  } catch (error) {
    console.error(`Error fetching repo info for ${repo}:`, error);
    throw error;
  }
}

/**
 * Validate repository exists and has presets
 * @param {string} repo - Repository in format 'owner/repo'
 * @returns {Promise<boolean>}
 */
export async function validatePresetRepo(repo) {
  try {
    const info = await fetchRepoInfo(repo);
    const apiUrl = `${GITHUB_API_BASE}/repos/${repo}/contents/presets`;
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Get list of available preset repositories
 * @returns {Array<string>} Array of repository names
 */
export function getPresetRepositories() {
  const stored = localStorage.getItem('preset-repositories');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse preset repositories:', e);
    }
  }
  return [DEFAULT_REPO];
}

/**
 * Add a preset repository
 * @param {string} repo - Repository in format 'owner/repo'
 * @returns {Promise<boolean>} Success status
 */
export async function addPresetRepository(repo) {
  // Validate repository
  const isValid = await validatePresetRepo(repo);
  if (!isValid) {
    throw new Error(`Repository ${repo} does not exist or does not contain a presets folder`);
  }

  const repos = getPresetRepositories();
  if (!repos.includes(repo)) {
    repos.push(repo);
    localStorage.setItem('preset-repositories', JSON.stringify(repos));
  }
  
  return true;
}

/**
 * Remove a preset repository
 * @param {string} repo - Repository to remove
 */
export function removePresetRepository(repo) {
  const repos = getPresetRepositories();
  const filtered = repos.filter(r => r !== repo);
  localStorage.setItem('preset-repositories', JSON.stringify(filtered));
}

/**
 * Get downloaded presets from storage
 * @returns {Array} Array of downloaded presets
 */
export function getDownloadedPresets() {
  const stored = localStorage.getItem('downloaded-presets');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse downloaded presets:', e);
    }
  }
  return [];
}

/**
 * Save downloaded presets to storage
 * @param {Array} presets - Array of preset objects
 */
export function saveDownloadedPresets(presets) {
  localStorage.setItem('downloaded-presets', JSON.stringify(presets));
}

/**
 * Download presets from a repository
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @returns {Promise<Array>} Downloaded presets
 */
export async function downloadPresetsFromRepo(repo, branch = 'main') {
  const presets = await fetchPresetsFromRepo(repo, branch);
  
  // Get existing downloaded presets
  const existing = getDownloadedPresets();
  
  // Merge new presets, avoiding duplicates based on id+source
  const merged = [...existing];
  
  presets.forEach(newPreset => {
    const existingIndex = merged.findIndex(
      p => p.id === newPreset.id && p.source === newPreset.source
    );
    
    if (existingIndex >= 0) {
      // Update existing preset
      merged[existingIndex] = newPreset;
    } else {
      // Add new preset
      merged.push(newPreset);
    }
  });
  
  saveDownloadedPresets(merged);
  return presets;
}

/**
 * Remove downloaded presets from a specific source
 * @param {string} repo - Repository name
 */
export function removePresetsFromSource(repo) {
  const presets = getDownloadedPresets();
  const filtered = presets.filter(p => p.source !== repo);
  saveDownloadedPresets(filtered);
}

/**
 * Get presets grouped by source
 * @returns {Object} Presets grouped by repository
 */
export function getPresetsBySource() {
  const presets = getDownloadedPresets();
  const grouped = {};
  
  presets.forEach(preset => {
    const source = preset.source || 'unknown';
    if (!grouped[source]) {
      grouped[source] = [];
    }
    grouped[source].push(preset);
  });
  
  return grouped;
}

export { DEFAULT_REPO };

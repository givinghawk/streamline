/**
 * Detects file type and returns appropriate category and supported formats
 */
export function detectFileType(file) {
  const ext = getFileExtension(file.name || file.path);
  const mimeType = file.type || '';

  // Video files
  const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm4v', 'mpg', 'mpeg', 'ts', 'mts', 'm2ts', '3gp', 'ogv'];
  const audioExtensions = ['mp3', 'aac', 'flac', 'wav', 'ogg', 'opus', 'm4a', 'wma', 'alac', 'ape', 'wv', 'tta', 'ac3', 'dts', 'eac3'];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'tif', 'heic', 'heif', 'avif'];

  if (videoExtensions.includes(ext) || mimeType.startsWith('video/')) {
    return {
      type: 'video',
      category: 'video',
      supportedOutputFormats: getVideoOutputFormats(),
      supportedCodecs: getVideoCodecs(),
      icon: 'video',
    };
  }

  if (audioExtensions.includes(ext) || mimeType.startsWith('audio/')) {
    return {
      type: 'audio',
      category: 'audio',
      supportedOutputFormats: getAudioOutputFormats(ext),
      supportedCodecs: getAudioCodecs(),
      icon: 'audio',
    };
  }

  if (imageExtensions.includes(ext) || mimeType.startsWith('image/')) {
    return {
      type: 'image',
      category: 'image',
      supportedOutputFormats: getImageOutputFormats(),
      supportedCodecs: null,
      icon: 'image',
    };
  }

  return {
    type: 'unknown',
    category: 'unknown',
    supportedOutputFormats: [],
    supportedCodecs: null,
    icon: 'file',
  };
}

function getFileExtension(filename) {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

function getVideoOutputFormats() {
  return [
    { value: 'mp4', label: 'MP4 (H.264)', description: 'Universal compatibility' },
    { value: 'mkv', label: 'MKV (Matroska)', description: 'Best for archiving' },
    { value: 'webm', label: 'WebM', description: 'Web optimized' },
    { value: 'mov', label: 'MOV (QuickTime)', description: 'Apple ecosystem' },
  ];
}

function getAudioOutputFormats(sourceExt) {
  const formats = [
    { value: 'mp3', label: 'MP3', description: 'Universal compatibility' },
    { value: 'aac', label: 'AAC', description: 'High quality, efficient' },
    { value: 'opus', label: 'Opus', description: 'Best quality/size ratio' },
    { value: 'flac', label: 'FLAC', description: 'Lossless compression' },
    { value: 'wav', label: 'WAV', description: 'Uncompressed' },
    { value: 'ogg', label: 'OGG Vorbis', description: 'Open format' },
  ];

  // For lossless sources, highlight lossless options
  const losslessSource = ['flac', 'wav', 'alac', 'ape', 'wv', 'tta'].includes(sourceExt);
  
  if (losslessSource) {
    return formats.map(f => ({
      ...f,
      recommended: f.value === 'flac',
    }));
  }

  return formats.map(f => ({
    ...f,
    recommended: f.value === 'aac' || f.value === 'opus',
  }));
}

function getImageOutputFormats() {
  return [
    { value: 'webp', label: 'WebP', description: 'Best compression' },
    { value: 'jpg', label: 'JPEG', description: 'Universal compatibility' },
    { value: 'png', label: 'PNG', description: 'Lossless' },
    { value: 'avif', label: 'AVIF', description: 'Next-gen format' },
  ];
}

function getVideoCodecs() {
  return [
    { value: 'libx264', label: 'H.264 (x264)', hwAccel: true, description: 'Best compatibility' },
    { value: 'libx265', label: 'H.265 (x265)', hwAccel: true, description: 'Better compression' },
    { value: 'libaom-av1', label: 'AV1', hwAccel: true, description: 'Future-proof' },
    { value: 'libvpx-vp9', label: 'VP9', hwAccel: false, description: 'Web friendly' },
  ];
}

function getAudioCodecs() {
  return [
    { value: 'aac', label: 'AAC', description: 'High quality, efficient' },
    { value: 'libmp3lame', label: 'MP3', description: 'Universal' },
    { value: 'libopus', label: 'Opus', description: 'Best quality/size' },
    { value: 'flac', label: 'FLAC', description: 'Lossless' },
    { value: 'libvorbis', label: 'Vorbis', description: 'Open format' },
    { value: 'pcm_s16le', label: 'PCM (WAV)', description: 'Uncompressed' },
  ];
}

/**
 * Filters presets based on file type
 */
export function filterPresetsByFileType(presets, fileType, sourceFile) {
  if (!fileType || fileType.type === 'unknown') {
    return presets;
  }

  let filtered = presets.filter(preset => preset.category === fileType.category);

  // For images, filter out same-format conversions
  if (fileType.type === 'image' && sourceFile) {
    const sourceExt = getFileExtension(sourceFile.name || sourceFile.path);
    filtered = filtered.filter(preset => {
      if (!preset.settings?.outputFormat) return true;
      
      // Map extensions to output formats
      const extToFormat = {
        'jpg': 'jpg',
        'jpeg': 'jpg',
        'png': 'png',
        'webp': 'webp',
        'gif': 'gif',
        'bmp': 'bmp',
      };
      
      const sourceFormat = extToFormat[sourceExt];
      return sourceFormat !== preset.settings.outputFormat;
    });
  }

  return filtered;
}

/**
 * Gets recommended preset for a file type
 */
export function getRecommendedPreset(fileType, presets, sourceFile) {
  if (!fileType) return null;

  const filteredPresets = filterPresetsByFileType(presets, fileType, sourceFile);
  
  if (fileType.type === 'video') {
    return filteredPresets.find(p => p.id === 'balanced');
  } else if (fileType.type === 'audio') {
    // Check if source is lossless
    const sourceExt = sourceFile ? getFileExtension(sourceFile.name || sourceFile.path) : '';
    const losslessFormats = ['flac', 'wav', 'alac', 'ape'];
    
    if (losslessFormats.includes(sourceExt)) {
      // For lossless sources, recommend high quality
      return filteredPresets.find(p => p.id === 'audio-high-quality') || filteredPresets[0];
    } else {
      // For lossy sources, recommend standard
      return filteredPresets.find(p => p.id === 'audio-standard') || filteredPresets[0];
    }
  } else if (fileType.type === 'image') {
    // Recommend WebP balanced for most images
    return filteredPresets.find(p => p.id === 'image-webp-balanced') || filteredPresets[0];
  }

  return filteredPresets[0] || null;
}

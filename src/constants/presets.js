export const PRESETS = [
  // Video Presets
  {
    id: 'high-quality',
    name: 'High Quality',
    description: 'Best quality, larger file size (H.264, CRF 18)',
    category: 'video',
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Good quality with reasonable file size (H.264, CRF 23)',
    category: 'video',
  },
  {
    id: 'fast',
    name: 'Fast Encoding',
    description: 'Quick encoding, smaller file size (H.264, CRF 28)',
    category: 'video',
  },
  {
    id: 'hevc-high',
    name: 'HEVC High Quality',
    description: 'Excellent compression with high quality (H.265, CRF 20)',
    category: 'video',
  },
  {
    id: 'hevc-balanced',
    name: 'HEVC Balanced',
    description: 'Great compression with good quality (H.265, CRF 24)',
    category: 'video',
  },
  {
    id: 'av1-high',
    name: 'AV1 High Quality',
    description: 'Next-gen codec, best compression (AV1, CRF 25)',
    category: 'video',
  },
  {
    id: 'hls-standard',
    name: 'HLS Standard (m3u8)',
    description: 'Create HLS (m3u8) playlist with TS segments (H.264, AAC)',
    category: 'video',
    settings: {
      outputFormat: 'm3u8',
      videoCodec: 'libx264',
      audioCodec: 'aac',
      hlsSegmentTime: 6,
    },
  },
  {
    id: 'hls-low',
    name: 'HLS Low Quality',
    description: 'Low bitrate HLS for mobile/slow connections (H.264, AAC)',
    category: 'video',
    settings: {
      outputFormat: 'm3u8',
      videoCodec: 'libx264',
      audioCodec: 'aac',
      videoBitrate: '500k',
      audioBitrate: '64k',
      hlsSegmentTime: 6,
    },
  },
  {
    id: 'hls-high',
    name: 'HLS High Quality',
    description: 'High bitrate HLS for high quality streaming (H.264, AAC)',
    category: 'video',
    settings: {
      outputFormat: 'm3u8',
      videoCodec: 'libx264',
      audioCodec: 'aac',
      videoBitrate: '3000k',
      audioBitrate: '128k',
      hlsSegmentTime: 6,
    },
  },
  
  // Audio Presets
  {
    id: 'audio-lossless',
    name: 'Lossless',
    description: 'Perfect quality, no compression loss (FLAC)',
    category: 'audio',
    settings: {
      audioCodec: 'flac',
      outputFormat: 'flac',
    },
  },
  {
    id: 'audio-high-quality',
    name: 'High Quality',
    description: 'Excellent quality, great for music (Opus 256kbps)',
    category: 'audio',
    settings: {
      audioCodec: 'libopus',
      audioBitrate: '256k',
      outputFormat: 'opus',
    },
  },
  {
    id: 'audio-high-quality-mp3',
    name: 'High Quality (MP3)',
    description: 'Maximum MP3 quality, universal (320kbps)',
    category: 'audio',
    settings: {
      audioCodec: 'libmp3lame',
      audioBitrate: '320k',
      outputFormat: 'mp3',
    },
  },
  {
    id: 'audio-standard',
    name: 'Standard',
    description: 'Good quality, balanced size (Opus 128kbps)',
    category: 'audio',
    settings: {
      audioCodec: 'libopus',
      audioBitrate: '128k',
      outputFormat: 'opus',
    },
  },
  {
    id: 'audio-standard-mp3',
    name: 'Standard (MP3)',
    description: 'Typical MP3 quality (128kbps)',
    category: 'audio',
    settings: {
      audioCodec: 'libmp3lame',
      audioBitrate: '128k',
      outputFormat: 'mp3',
    },
  },
  {
    id: 'audio-lightweight',
    name: 'Lightweight',
    description: 'Small size, good for speech (Opus 64kbps)',
    category: 'audio',
    settings: {
      audioCodec: 'libopus',
      audioBitrate: '64k',
      outputFormat: 'opus',
    },
  },
  {
    id: 'audio-ultra-lightweight',
    name: 'Ultra Lightweight',
    description: 'Minimum size for podcasts/voice (Opus 32kbps)',
    category: 'audio',
    settings: {
      audioCodec: 'libopus',
      audioBitrate: '32k',
      outputFormat: 'opus',
    },
  },
  
  // Image Presets
  {
    id: 'image-webp-high',
    name: 'WebP High Quality',
    description: 'Modern format, excellent compression (Quality 90)',
    category: 'image',
    settings: {
      outputFormat: 'webp',
      quality: 90,
    },
  },
  {
    id: 'image-webp-balanced',
    name: 'WebP Balanced',
    description: 'Great compression and quality (Quality 80)',
    category: 'image',
    settings: {
      outputFormat: 'webp',
      quality: 80,
    },
  },
  {
    id: 'image-jpeg-high',
    name: 'JPEG High Quality',
    description: 'Universal format, high quality (Quality 90)',
    category: 'image',
    settings: {
      outputFormat: 'jpg',
      quality: 90,
    },
  },
  {
    id: 'image-jpeg-web',
    name: 'JPEG Web Optimized',
    description: 'Optimized for web (Quality 75)',
    category: 'image',
    settings: {
      outputFormat: 'jpg',
      quality: 75,
    },
  },
  {
    id: 'image-png',
    name: 'PNG Lossless',
    description: 'Lossless compression, transparency support',
    category: 'image',
    settings: {
      outputFormat: 'png',
    },
  },
  {
    id: 'image-gif',
    name: 'GIF',
    description: 'Animated or simple graphics (256 colors)',
    category: 'image',
    settings: {
      outputFormat: 'gif',
    },
  },
];

export const VIDEO_CODECS = [
  { value: 'libx264', label: 'H.264 (x264)', hwAccel: true },
  { value: 'libx265', label: 'H.265 (x265)', hwAccel: true },
  { value: 'libaom-av1', label: 'AV1 (libaom)', hwAccel: true },
  { value: 'libvpx-vp9', label: 'VP9', hwAccel: false },
  { value: 'copy', label: 'Copy (no re-encode)', hwAccel: false },
];

export const AUDIO_CODECS = [
  { value: 'aac', label: 'AAC' },
  { value: 'libmp3lame', label: 'MP3' },
  { value: 'libopus', label: 'Opus' },
  { value: 'libvorbis', label: 'Vorbis' },
  { value: 'flac', label: 'FLAC' },
  { value: 'copy', label: 'Copy (no re-encode)' },
];

export const RESOLUTIONS = [
  { value: '', label: 'Original' },
  { value: '3840:2160', label: '4K (3840x2160)' },
  { value: '2560:1440', label: '2K (2560x1440)' },
  { value: '1920:1080', label: 'Full HD (1920x1080)' },
  { value: '1280:720', label: 'HD (1280x720)' },
  { value: '854:480', label: 'SD (854x480)' },
  { value: '640:360', label: '360p' },
];

export const FRAME_RATES = [
  { value: '', label: 'Original' },
  { value: '60', label: '60 fps' },
  { value: '50', label: '50 fps' },
  { value: '30', label: '30 fps' },
  { value: '25', label: '25 fps' },
  { value: '24', label: '24 fps' },
];

export const ENCODING_PRESETS = [
  { value: 'ultrafast', label: 'Ultra Fast' },
  { value: 'superfast', label: 'Super Fast' },
  { value: 'veryfast', label: 'Very Fast' },
  { value: 'faster', label: 'Faster' },
  { value: 'fast', label: 'Fast' },
  { value: 'medium', label: 'Medium' },
  { value: 'slow', label: 'Slow' },
  { value: 'slower', label: 'Slower' },
  { value: 'veryslow', label: 'Very Slow' },
];

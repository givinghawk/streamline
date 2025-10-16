/**
 * HDR and 10-bit Encoding Support
 * Handles HDR10, HDR10+, Dolby Vision, and 10-bit color depth
 */

export const HDR_MODES = {
  SDR: 'sdr',
  HDR10: 'hdr10',
  HDR10_PLUS: 'hdr10+',
  DOLBY_VISION: 'dolby-vision',
  HLG: 'hlg',
};

export const BIT_DEPTHS = {
  8: '8-bit',
  10: '10-bit',
  12: '12-bit',
};

export const COLOR_SPACES = {
  BT709: 'bt709',     // SDR
  BT2020: 'bt2020',   // HDR
};

export const TRANSFER_FUNCTIONS = {
  BT709: 'bt709',           // SDR
  SMPTE2084: 'smpte2084',   // HDR10
  HLG: 'hlg',               // HLG HDR
  LINEAR: 'linear',         // Linear
};

/**
 * Generate FFmpeg args for HDR encoding
 * @param {Object} options - HDR configuration
 * @returns {Array} FFmpeg arguments
 */
export function generateHDRArgs(options = {}) {
  const {
    hdrMode = HDR_MODES.SDR,
    bitDepth = 8,
    colorSpace = COLOR_SPACES.BT709,
    transferFunction = TRANSFER_FUNCTIONS.BT709,
    encoder = 'libx265',
    includeMetadata = true,
  } = options;

  const args = [];

  // Set pixel format based on bit depth
  const pixelFormats = {
    8: colorSpace === COLOR_SPACES.BT2020 ? 'yuv420p' : 'yuv420p',
    10: colorSpace === COLOR_SPACES.BT2020 ? 'yuv420p10le' : 'yuv420p10le',
    12: 'yuv420p12le',
  };

  const pixelFormat = pixelFormats[bitDepth] || 'yuv420p';

  // Video codec arguments
  args.push('-c:v', encoder);
  args.push('-pix_fmt', pixelFormat);

  // HEVC-specific HDR settings (recommended for HDR)
  if (encoder === 'libx265') {
    // Profile for HDR
    if (hdrMode !== HDR_MODES.SDR) {
      if (bitDepth === 10) {
        args.push('-tag:v', 'hev1');
        args.push('-x265-params', 'profile=main-10');
      }
    }

    // CRF quality (0-51, lower is better)
    args.push('-crf', '20');
    args.push('-preset', 'slow');
  }

  // Color space parameters
  args.push('-colorspace', mapColorSpace(colorSpace));
  args.push('-color_primaries', getPrimaries(colorSpace));
  args.push('-color_trc', transferFunction);

  // HDR-specific metadata and flags
  if (hdrMode === HDR_MODES.HDR10) {
    if (includeMetadata) {
      // HDR10 metadata
      args.push('-color_range', 'tv');
    }
  } else if (hdrMode === HDR_MODES.HDR10_PLUS) {
    if (includeMetadata) {
      // HDR10+ requires tone mapping
      // This is handled separately with libhdr10plus
      args.push('-color_range', 'tv');
    }
  } else if (hdrMode === HDR_MODES.DOLBY_VISION) {
    if (includeMetadata) {
      args.push('-color_range', 'tv');
      // Dolby Vision requires specific profile
      if (encoder === 'libx265') {
        args.push('-x265-params', 'dv-profile=5');
      }
    }
  } else if (hdrMode === HDR_MODES.HLG) {
    args.push('-color_range', 'tv');
  }

  // Range
  args.push('-color_range', 'tv'); // TV range for video

  return args;
}

/**
 * Map color space to FFmpeg colorspace value
 */
function mapColorSpace(colorSpace) {
  const mapping = {
    [COLOR_SPACES.BT709]: 'bt709',
    [COLOR_SPACES.BT2020]: 'bt2020nc', // Non-constant luminance
  };
  return mapping[colorSpace] || 'bt709';
}

/**
 * Get color primaries for color space
 */
function getPrimaries(colorSpace) {
  const mapping = {
    [COLOR_SPACES.BT709]: 'bt709',
    [COLOR_SPACES.BT2020]: 'bt2020',
  };
  return mapping[colorSpace] || 'bt709';
}

/**
 * Detect if input file is HDR
 * @param {Object} fileInfo - File information from ffprobe
 * @returns {Object} HDR detection result
 */
export function detectHDR(fileInfo) {
  if (!fileInfo?.videoStreams || fileInfo.videoStreams.length === 0) {
    return { isHDR: false, format: null };
  }

  const stream = fileInfo.videoStreams[0];
  
  // Check color space
  const colorSpace = stream.color_space || '';
  const colorTransfer = stream.color_transfer || '';
  const colorPrimaries = stream.color_primaries || '';

  // Detect HDR format
  let format = null;
  let isHDR = false;

  if (colorTransfer === 'smpte2084') {
    // HDR10
    isHDR = true;
    format = HDR_MODES.HDR10;
  } else if (colorTransfer === 'arib-std-b67') {
    // HLG
    isHDR = true;
    format = HDR_MODES.HLG;
  } else if (colorTransfer === 'linear') {
    // Could be Dolby Vision profile 5
    isHDR = true;
    format = HDR_MODES.DOLBY_VISION;
  }

  // Check for Dolby Vision specifically
  if (stream['dv_profile'] !== undefined) {
    isHDR = true;
    format = HDR_MODES.DOLBY_VISION;
  }

  return {
    isHDR,
    format,
    colorSpace,
    colorTransfer,
    colorPrimaries,
    bitDepth: stream.bits_per_raw_sample || 8,
  };
}

/**
 * Get recommended encoder for HDR
 * @param {string} hdrMode - HDR mode
 * @returns {Object} Recommended encoder and settings
 */
export function getRecommendedHDREncoder(hdrMode) {
  const recommendations = {
    [HDR_MODES.SDR]: {
      encoder: 'libx264',
      bitDepth: 8,
      colorSpace: COLOR_SPACES.BT709,
      notes: 'Use H.264 for maximum compatibility',
    },
    [HDR_MODES.HDR10]: {
      encoder: 'libx265',
      bitDepth: 10,
      colorSpace: COLOR_SPACES.BT2020,
      notes: 'HEVC 10-bit required for HDR10',
    },
    [HDR_MODES.HDR10_PLUS]: {
      encoder: 'libx265',
      bitDepth: 10,
      colorSpace: COLOR_SPACES.BT2020,
      notes: 'Requires HDR10+ profile support in container',
    },
    [HDR_MODES.DOLBY_VISION]: {
      encoder: 'libx265',
      bitDepth: 10,
      colorSpace: COLOR_SPACES.BT2020,
      notes: 'Requires Dolby Vision license and profile support',
    },
    [HDR_MODES.HLG]: {
      encoder: 'libx265',
      bitDepth: 10,
      colorSpace: COLOR_SPACES.BT2020,
      notes: 'HLG for broadcast applications',
    },
  };

  return recommendations[hdrMode] || recommendations[HDR_MODES.SDR];
}

/**
 * Generate tone mapping filter for SDR to HDR conversion
 * @param {string} method - Tone mapping method
 * @returns {string} FFmpeg filter string
 */
export function generateToneMapFilter(method = 'hable') {
  const methods = {
    linear: 'tonemap=linear',
    gamma: 'tonemap=gamma:gamma=2.4',
    clip: 'tonemap=clip',
    hable: 'tonemap=hable',
    mobius: 'tonemap=mobius',
  };

  return methods[method] || methods.hable;
}

/**
 * Validate HDR encoding configuration
 * @param {Object} config - HDR configuration
 * @returns {Object} Validation result
 */
export function validateHDRConfig(config) {
  const issues = [];
  const warnings = [];

  const { hdrMode, bitDepth, encoder, container } = config;

  // Validate HDR mode
  if (!Object.values(HDR_MODES).includes(hdrMode)) {
    issues.push(`Invalid HDR mode: ${hdrMode}`);
  }

  // Validate bit depth
  if (![8, 10, 12].includes(bitDepth)) {
    issues.push(`Invalid bit depth: ${bitDepth}. Must be 8, 10, or 12.`);
  }

  // Validate encoder for HDR
  if (hdrMode !== HDR_MODES.SDR) {
    if (encoder === 'libx264') {
      issues.push('H.264 cannot encode HDR. Use HEVC (libx265) or VP9 (libvpx-vp9)');
    }
    
    if (bitDepth === 8 && hdrMode !== HDR_MODES.SDR) {
      warnings.push('HDR typically requires 10-bit or higher. 8-bit may cause banding.');
    }
  }

  // Validate container support
  const hdrContainers = {
    mp4: [HDR_MODES.HDR10],
    mkv: [HDR_MODES.HDR10, HDR_MODES.DOLBY_VISION, HDR_MODES.HLG],
    mov: [HDR_MODES.HDR10, HDR_MODES.DOLBY_VISION],
  };

  if (container && hdrContainers[container]) {
    if (!hdrContainers[container].includes(hdrMode)) {
      warnings.push(`${container} container may not fully support ${hdrMode}`);
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
  };
}

/**
 * Get HDR mode description
 */
export function getHDRModeDescription(mode) {
  const descriptions = {
    [HDR_MODES.SDR]: 'Standard Dynamic Range - 8-bit video for standard displays',
    [HDR_MODES.HDR10]: 'HDR10 - 10-bit HDR with static metadata (most compatible)',
    [HDR_MODES.HDR10_PLUS]: 'HDR10+ - HDR10 with dynamic metadata (better quality)',
    [HDR_MODES.DOLBY_VISION]: 'Dolby Vision - Premium HDR format (requires license)',
    [HDR_MODES.HLG]: 'Hybrid Log-Gamma - Broadcast HDR standard',
  };

  return descriptions[mode] || 'Unknown HDR mode';
}

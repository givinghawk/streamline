/**
 * Calculate bitrate needed to reach a target file size
 * @param {number} targetSize - Target file size in bytes
 * @param {number} durationSeconds - Video duration in seconds
 * @param {number} audioBitrateKbps - Audio bitrate in kbps (default 192k)
 * @returns {string} Bitrate string suitable for FFmpeg (e.g., "2500k")
 */
export function calculateBitrateFromTargetSize(targetSize, durationSeconds, audioBitrateKbps = 192) {
  if (!targetSize || !durationSeconds || durationSeconds <= 0) {
    return null;
  }

  // Total bits available for the file
  const totalBits = targetSize * 8;

  // Audio bits needed
  const audioBits = audioBitrateKbps * 1000 * durationSeconds;

  // Video bits available
  const videoBits = totalBits - audioBits;

  // Video bitrate in kbps
  const videoBitrateKbps = Math.max(Math.floor(videoBits / 1000 / durationSeconds), 50); // Minimum 50kbps

  return `${videoBitrateKbps}k`;
}

/**
 * Convert file size string to bytes
 * @param {number} size - Size value
 * @param {string} unit - Unit (MB or GB)
 * @returns {number} Size in bytes
 */
export function convertToBytes(size, unit = 'MB') {
  if (unit === 'GB') {
    return size * 1024 * 1024 * 1024;
  }
  return size * 1024 * 1024;
}

/**
 * Format bitrate display value
 * @param {number} kbps - Bitrate in kbps
 * @returns {string} Formatted bitrate (e.g., "2.5 Mbps")
 */
export function formatBitrate(kbps) {
  if (kbps >= 1000) {
    return `${(kbps / 1000).toFixed(2)} Mbps`;
  }
  return `${kbps} kbps`;
}

/**
 * Estimate file size from bitrate and duration
 * @param {number} videoBitrateKbps - Video bitrate in kbps
 * @param {number} audioBitrateKbps - Audio bitrate in kbps
 * @param {number} durationSeconds - Duration in seconds
 * @returns {number} Estimated file size in MB
 */
export function estimateFileSize(videoBitrateKbps, audioBitrateKbps, durationSeconds) {
  const totalBitrateKbps = videoBitrateKbps + audioBitrateKbps;
  const totalBits = totalBitrateKbps * 1000 * durationSeconds;
  const bytes = totalBits / 8;
  const megabytes = bytes / (1024 * 1024);
  return megabytes;
}

/**
 * Parse bitrate string to kbps
 * @param {string} bitrateStr - Bitrate string (e.g., "5M", "5000k", "5000")
 * @returns {number} Bitrate in kbps
 */
export function parseBitrateString(bitrateStr) {
  if (!bitrateStr) return 0;

  const str = bitrateStr.toString().toLowerCase().trim();

  if (str.endsWith('k')) {
    return parseInt(str);
  }
  if (str.endsWith('m')) {
    return parseInt(str) * 1000;
  }
  // Assume kbps if no unit
  return parseInt(str);
}

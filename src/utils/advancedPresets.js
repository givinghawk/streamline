/**
 * Advanced Preset System
 * Supports conditional logic for dynamic preset configuration
 * 
 * Example preset with conditionals:
 * {
 *   "id": "smart-hdr",
 *   "name": "Smart HDR Encoder",
 *   "conditions": [
 *     {
 *       "if": { "input": "isHDR" },
 *       "then": { "hdrMode": "hdr10", "bitDepth": 10, "colorSpace": "bt2020" }
 *     },
 *     {
 *       "else": { "hdrMode": "sdr", "bitDepth": 8, "colorSpace": "bt709" }
 *     }
 *   ]
 * }
 */

/**
 * Condition evaluator for advanced presets
 */
export class ConditionEvaluator {
  constructor(context = {}) {
    this.context = context;
  }

  /**
   * Evaluate a condition against the context
   * @param {Object} condition - Condition to evaluate
   * @returns {boolean} Result of condition evaluation
   */
  evaluate(condition) {
    if (!condition) return false;

    // Handle different condition types
    if (condition.input) {
      return this.evaluateInput(condition.input);
    }

    if (condition.prop) {
      return this.evaluateProperty(condition.prop, condition.value);
    }

    if (condition.and) {
      return condition.and.every(c => this.evaluate(c));
    }

    if (condition.or) {
      return condition.or.some(c => this.evaluate(c));
    }

    if (condition.not) {
      return !this.evaluate(condition.not);
    }

    return false;
  }

  /**
   * Evaluate input file properties
   * @param {string} property - Property to check
   * @returns {boolean}
   */
  evaluateInput(property) {
    const input = this.context.input || {};

    // HDR detection
    if (property === 'isHDR') {
      return input.isHDR || false;
    }

    if (property === 'hdrFormat') {
      return input.hdrFormat;
    }

    // Resolution checks
    if (property === 'is4K') {
      return (input.width >= 3840 && input.height >= 2160);
    }

    if (property === 'is1080p') {
      return (input.width >= 1920 && input.height >= 1080);
    }

    if (property === 'is720p') {
      return (input.width >= 1280 && input.height >= 720);
    }

    // Frame rate checks
    if (property === 'is60fps') {
      return input.fps >= 60;
    }

    if (property === 'is30fps') {
      return input.fps >= 30;
    }

    // Codec checks
    if (property === 'isH264') {
      return input.codec === 'h264' || input.codec === 'avc1';
    }

    if (property === 'isH265') {
      return input.codec === 'h265' || input.codec === 'hevc';
    }

    if (property === 'isVP9') {
      return input.codec === 'vp9';
    }

    // Duration checks
    if (property === 'isShort') {
      return (input.duration || 0) < 300; // < 5 minutes
    }

    if (property === 'isMedium') {
      return (input.duration || 0) >= 300 && (input.duration || 0) < 3600;
    }

    if (property === 'isLong') {
      return (input.duration || 0) >= 3600;
    }

    return false;
  }

  /**
   * Evaluate property comparisons
   * @param {string} property - Property name
   * @param {*} value - Value to compare
   * @returns {boolean}
   */
  evaluateProperty(property, value) {
    const propValue = this.context[property];

    if (value.equals !== undefined) {
      return propValue === value.equals;
    }

    if (value.greaterThan !== undefined) {
      return propValue > value.greaterThan;
    }

    if (value.lessThan !== undefined) {
      return propValue < value.lessThan;
    }

    if (value.greaterThanOrEqual !== undefined) {
      return propValue >= value.greaterThanOrEqual;
    }

    if (value.lessThanOrEqual !== undefined) {
      return propValue <= value.lessThanOrEqual;
    }

    if (value.includes !== undefined) {
      return Array.isArray(propValue) && propValue.includes(value.includes);
    }

    return false;
  }
}

/**
 * Advanced preset engine
 */
export class AdvancedPresetEngine {
  /**
   * Process an advanced preset with conditions
   * @param {Object} preset - Advanced preset with conditions
   * @param {Object} context - Context (input file info, etc.)
   * @returns {Object} Evaluated preset settings
   */
  static evaluate(preset, context = {}) {
    const evaluator = new ConditionEvaluator(context);
    const result = { ...preset };
    delete result.conditions; // Remove conditions from result

    if (!preset.conditions || !Array.isArray(preset.conditions)) {
      return result;
    }

    // Process each condition
    for (const branch of preset.conditions) {
      if (branch.if) {
        // If condition
        if (evaluator.evaluate(branch.if)) {
          Object.assign(result, branch.then || {});
          break; // Stop at first matching condition
        }
      } else if (branch.else) {
        // Else clause
        Object.assign(result, branch.else);
        break;
      } else if (branch.elseif) {
        // Else-if condition
        if (evaluator.evaluate(branch.elseif.condition)) {
          Object.assign(result, branch.elseif.then || {});
          break;
        }
      }
    }

    return result;
  }

  /**
   * Check if preset is advanced (has conditions)
   * @param {Object} preset - Preset to check
   * @returns {boolean}
   */
  static isAdvanced(preset) {
    return preset.conditions && Array.isArray(preset.conditions) && preset.conditions.length > 0;
  }

  /**
   * Validate advanced preset structure
   * @param {Object} preset - Preset to validate
   * @returns {Object} Validation result
   */
  static validate(preset) {
    const errors = [];
    const warnings = [];

    if (!preset.id) {
      errors.push('Preset must have an id');
    }

    if (!preset.name) {
      errors.push('Preset must have a name');
    }

    if (preset.conditions) {
      if (!Array.isArray(preset.conditions)) {
        errors.push('conditions must be an array');
      } else {
        preset.conditions.forEach((branch, index) => {
          if (branch.if && !branch.then) {
            warnings.push(`Condition ${index} has if but no then`);
          }

          if (!branch.if && !branch.else && !branch.elseif) {
            warnings.push(`Condition ${index} has no if/else/elseif`);
          }
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Convert input file info to context
   * @param {Object} fileInfo - File information from ffprobe
   * @returns {Object} Context object for evaluation
   */
  static createContext(fileInfo) {
    if (!fileInfo || !fileInfo.videoStreams) {
      return { input: {} };
    }

    const stream = fileInfo.videoStreams[0];

    // Detect HDR
    const isHDR = (stream.color_transfer === 'smpte2084' || 
                   stream.color_transfer === 'arib-std-b67' ||
                   stream['dv_profile'] !== undefined);

    const hdrFormat = isHDR
      ? (stream.color_transfer === 'smpte2084' ? 'hdr10' :
         stream.color_transfer === 'arib-std-b67' ? 'hlg' :
         stream['dv_profile'] !== undefined ? 'dolby-vision' : 'unknown')
      : null;

    return {
      input: {
        isHDR,
        hdrFormat,
        width: stream.width,
        height: stream.height,
        fps: stream.avg_frame_rate ? evaluateFrameRate(stream.avg_frame_rate) : 30,
        codec: stream.codec_name,
        duration: fileInfo.duration,
        bitrate: fileInfo.bit_rate,
        colorSpace: stream.color_space,
      },
    };
  }
}

/**
 * Helper to parse frame rate string like "30000/1001"
 */
function evaluateFrameRate(frameRateStr) {
  if (typeof frameRateStr !== 'string') return 30;

  const parts = frameRateStr.split('/');
  if (parts.length === 2) {
    return parseInt(parts[0]) / parseInt(parts[1]);
  }

  return parseInt(frameRateStr) || 30;
}

/**
 * Example advanced presets
 */
export const EXAMPLE_ADVANCED_PRESETS = [
  {
    id: 'smart-hdr',
    name: 'Smart HDR Encoder',
    description: 'Automatically uses HDR or SDR based on input file',
    category: 'video',
    conditions: [
      {
        if: { input: 'isHDR' },
        then: {
          encoder: 'libx265',
          hdrMode: 'hdr10',
          bitDepth: 10,
          colorSpace: 'bt2020',
          preset: 'slow',
          crf: 20,
        },
      },
      {
        else: {
          encoder: 'libx265',
          hdrMode: 'sdr',
          bitDepth: 8,
          colorSpace: 'bt709',
          preset: 'medium',
          crf: 23,
        },
      },
    ],
  },
  {
    id: 'adaptive-resolution',
    name: 'Adaptive Resolution',
    description: 'Adjusts encoding based on input resolution',
    category: 'video',
    conditions: [
      {
        if: { input: 'is4K' },
        then: {
          encoder: 'libx265',
          preset: 'slow',
          crf: 18,
        },
      },
      {
        elseif: {
          condition: { input: 'is1080p' },
          then: {
            encoder: 'libx265',
            preset: 'medium',
            crf: 23,
          },
        },
      },
      {
        else: {
          encoder: 'libx264',
          preset: 'fast',
          crf: 25,
        },
      },
    ],
  },
  {
    id: 'duration-based-preset',
    name: 'Duration-Based Compression',
    description: 'Longer videos get better compression, short videos keep quality',
    category: 'video',
    conditions: [
      {
        if: { input: 'isShort' },
        then: {
          encoder: 'libx265',
          preset: 'slow',
          crf: 18,
        },
      },
      {
        elseif: {
          condition: { input: 'isMedium' },
          then: {
            encoder: 'libx265',
            preset: 'medium',
            crf: 23,
          },
        },
      },
      {
        else: {
          encoder: 'libx265',
          preset: 'fast',
          crf: 27,
        },
      },
    ],
  },
];

import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import {
  HDR_MODES,
  BIT_DEPTHS,
  COLOR_SPACES,
  TRANSFER_FUNCTIONS,
  getHDRModeDescription,
  getRecommendedHDREncoder,
  validateHDRConfig,
} from '../utils/hdrEncoding';

function HDRSettings({ settings: advancedSettings, onSettingsChange, fileInfo }) {
  const { settings } = useSettings();
  const [hdrMode, setHdrMode] = useState(advancedSettings?.hdrMode || HDR_MODES.SDR);
  const [bitDepth, setBitDepth] = useState(advancedSettings?.bitDepth || 8);
  const [colorSpace, setColorSpace] = useState(advancedSettings?.colorSpace || COLOR_SPACES.BT709);
  const [includeMetadata, setIncludeMetadata] = useState(
    advancedSettings?.includeHDRMetadata !== false
  );

  // Validate and warn about configuration
  const validation = validateHDRConfig({
    hdrMode,
    bitDepth,
    encoder: advancedSettings?.encoder || 'libx265',
    container: advancedSettings?.container || 'mkv',
  });

  const handleChange = (key, value) => {
    const newSettings = {
      ...advancedSettings,
      [key]: value,
    };

    if (key === 'hdrMode' && value !== HDR_MODES.SDR) {
      // Auto-recommend settings for HDR
      const recommended = getRecommendedHDREncoder(value);
      newSettings.bitDepth = recommended.bitDepth;
      newSettings.colorSpace = recommended.colorSpace;
      setBitDepth(recommended.bitDepth);
      setColorSpace(recommended.colorSpace);
    }

    onSettingsChange?.(newSettings);
  };

  const recommendedEncoder = getRecommendedHDREncoder(hdrMode);

  return (
    <div className={`rounded-lg p-4 space-y-4 ${
      settings.theme === 'dark' ? 'bg-surface-elevated2' : 'bg-gray-50'
    }`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-semibold ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          HDR & 10-bit Encoding
        </h3>
        <span className={`text-xs px-2 py-1 rounded ${
          settings.theme === 'dark'
            ? 'bg-blue-900/30 text-blue-400'
            : 'bg-blue-100 text-blue-700'
        }`}>
          Advanced
        </span>
      </div>

      {/* HDR Mode */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          HDR Mode
        </label>
        <select
          value={hdrMode}
          onChange={(e) => {
            setHdrMode(e.target.value);
            handleChange('hdrMode', e.target.value);
          }}
          className={`w-full px-3 py-2 rounded-lg border ${
            settings.theme === 'dark'
              ? 'bg-surface-elevated border-gray-700 text-gray-200'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-primary-500`}
        >
          {Object.entries(HDR_MODES).map(([key, value]) => (
            <option key={value} value={value}>
              {key.replace(/_/g, ' ')} - {getHDRModeDescription(value).split(' - ')[1]}
            </option>
          ))}
        </select>
        <p className={`text-xs mt-1 ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          {getHDRModeDescription(hdrMode)}
        </p>
      </div>

      {/* Bit Depth */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Bit Depth
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[8, 10, 12].map((depth) => (
            <button
              key={depth}
              onClick={() => {
                setBitDepth(depth);
                handleChange('bitDepth', depth);
              }}
              className={`px-3 py-2 rounded-lg border font-medium transition-colors ${
                bitDepth === depth
                  ? settings.theme === 'dark'
                    ? 'border-primary-500 bg-primary-900/30 text-primary-400'
                    : 'border-primary-600 bg-primary-100 text-primary-700'
                  : settings.theme === 'dark'
                    ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {depth}-bit
            </button>
          ))}
        </div>
        <p className={`text-xs mt-1 ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          Higher bit depth = better color gradation, larger file size
        </p>
      </div>

      {/* Color Space */}
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Color Space
        </label>
        <select
          value={colorSpace}
          onChange={(e) => {
            setColorSpace(e.target.value);
            handleChange('colorSpace', e.target.value);
          }}
          className={`w-full px-3 py-2 rounded-lg border ${
            settings.theme === 'dark'
              ? 'bg-surface-elevated border-gray-700 text-gray-200'
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-primary-500`}
        >
          <option value={COLOR_SPACES.BT709}>
            BT.709 (SDR) - Standard display color space
          </option>
          <option value={COLOR_SPACES.BT2020}>
            BT.2020 (HDR) - Wide color gamut for HDR
          </option>
        </select>
      </div>

      {/* HDR Metadata */}
      {hdrMode !== HDR_MODES.SDR && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeMetadata"
            checked={includeMetadata}
            onChange={(e) => {
              setIncludeMetadata(e.target.checked);
              handleChange('includeHDRMetadata', e.target.checked);
            }}
            className="rounded border-gray-300 cursor-pointer"
          />
          <label
            htmlFor="includeMetadata"
            className={`text-sm cursor-pointer ${
              settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Include HDR Metadata
          </label>
        </div>
      )}

      {/* Recommended Settings */}
      {hdrMode !== HDR_MODES.SDR && (
        <div className={`p-3 rounded-lg border ${
          settings.theme === 'dark'
            ? 'bg-blue-900/20 border-blue-500/30'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className={`text-sm font-medium ${
            settings.theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
          }`}>
            Recommended for {hdrMode.toUpperCase()}
          </div>
          <ul className={`text-xs mt-1 space-y-1 ${
            settings.theme === 'dark' ? 'text-blue-200' : 'text-blue-600'
          }`}>
            <li>• Encoder: {recommendedEncoder.encoder}</li>
            <li>• Bit Depth: {recommendedEncoder.bitDepth}-bit</li>
            <li>• Container: .mkv recommended</li>
            <li>• {recommendedEncoder.notes}</li>
          </ul>
        </div>
      )}

      {/* Warnings */}
      {validation.warnings.length > 0 && (
        <div className={`p-3 rounded-lg border ${
          settings.theme === 'dark'
            ? 'bg-yellow-900/20 border-yellow-500/30'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className={`text-sm font-medium ${
            settings.theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
          }`}>
            Warnings
          </div>
          <ul className={`text-xs mt-1 space-y-1 ${
            settings.theme === 'dark' ? 'text-yellow-200' : 'text-yellow-600'
          }`}>
            {validation.warnings.map((warning, i) => (
              <li key={i}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Errors */}
      {validation.issues.length > 0 && (
        <div className={`p-3 rounded-lg border ${
          settings.theme === 'dark'
            ? 'bg-red-900/20 border-red-500/30'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className={`text-sm font-medium ${
            settings.theme === 'dark' ? 'text-red-300' : 'text-red-700'
          }`}>
            Configuration Issues
          </div>
          <ul className={`text-xs mt-1 space-y-1 ${
            settings.theme === 'dark' ? 'text-red-200' : 'text-red-600'
          }`}>
            {validation.issues.map((issue, i) => (
              <li key={i}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Information */}
      <div className={`p-3 rounded-lg border ${
        settings.theme === 'dark'
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-gray-100 border-gray-300'
      }`}>
        <div className={`text-xs space-y-1 ${
          settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <p><strong>What is HDR?</strong> High Dynamic Range extends the range of colors and brightness for more lifelike images.</p>
          <p><strong>HDR10:</strong> Standard HDR format, widely supported. Recommended for most users.</p>
          <p><strong>10-bit:</strong> 1024 color levels per channel vs 256 in 8-bit. Prevents color banding in gradients.</p>
        </div>
      </div>
    </div>
  );
}

export default HDRSettings;

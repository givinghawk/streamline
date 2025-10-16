import React, { useState } from 'react';
import { AdvancedPresetEngine } from '../utils/advancedPresets';
import { useSettings } from '../contexts/SettingsContext';

function AdvancedPresetInfo({ preset, fileInfo, onApply }) {
  const { settings } = useSettings();
  const [showDetails, setShowDetails] = useState(false);
  const [evaluatedSettings, setEvaluatedSettings] = useState(null);

  // Evaluate preset when it changes or fileInfo changes
  React.useEffect(() => {
    if (AdvancedPresetEngine.isAdvanced(preset) && fileInfo) {
      const context = AdvancedPresetEngine.createContext(fileInfo);
      const evaluated = AdvancedPresetEngine.evaluate(preset, context);
      setEvaluatedSettings(evaluated);
    }
  }, [preset, fileInfo]);

  if (!AdvancedPresetEngine.isAdvanced(preset)) {
    return null;
  }

  const validation = AdvancedPresetEngine.validate(preset);

  return (
    <div className={`rounded-lg p-4 border ${
      settings.theme === 'dark'
        ? 'bg-purple-900/20 border-purple-500/30'
        : 'bg-purple-50 border-purple-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
            </svg>
            <span className={`font-medium ${settings.theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
              Advanced Preset
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${
              settings.theme === 'dark'
                ? 'bg-purple-900/30 text-purple-400'
                : 'bg-purple-100 text-purple-700'
            }`}>
              Conditional Logic
            </span>
          </div>

          <p className={`text-sm mb-3 ${settings.theme === 'dark' ? 'text-purple-200' : 'text-purple-600'}`}>
            This preset adapts settings based on your input file characteristics.
          </p>

          {/* File Analysis */}
          {fileInfo && evaluatedSettings && (
            <div className={`p-3 rounded mb-3 ${settings.theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
              <div className={`text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Detected Input
              </div>
              <div className={`grid grid-cols-2 gap-2 text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {fileInfo.videoStreams && fileInfo.videoStreams[0] && (
                  <>
                    <div>Resolution: {fileInfo.videoStreams[0].width}x{fileInfo.videoStreams[0].height}</div>
                    <div>Duration: {(fileInfo.duration / 60).toFixed(1)} min</div>
                    {fileInfo.videoStreams[0].color_transfer && (
                      <div>Transfer: {fileInfo.videoStreams[0].color_transfer}</div>
                    )}
                    {fileInfo.videoStreams[0].codec_name && (
                      <div>Codec: {fileInfo.videoStreams[0].codec_name}</div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Conditions */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`text-sm font-medium flex items-center space-x-1 mb-2 ${
              settings.theme === 'dark'
                ? 'text-purple-400 hover:text-purple-300'
                : 'text-purple-600 hover:text-purple-700'
            }`}
          >
            <svg 
              className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-90' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>{preset.conditions?.length || 0} Condition{preset.conditions?.length !== 1 ? 's' : ''}</span>
          </button>

          {showDetails && preset.conditions && (
            <div className="space-y-2 mb-3">
              {preset.conditions.map((branch, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded text-xs ${
                    settings.theme === 'dark'
                      ? 'bg-gray-800/50 border border-gray-700'
                      : 'bg-gray-100 border border-gray-300'
                  }`}
                >
                  {branch.if && (
                    <>
                      <div className={`font-mono ${settings.theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                        if {formatCondition(branch.if)}
                      </div>
                      <div className={`font-mono ml-2 text-xs ${settings.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        → {formatSettings(branch.then)}
                      </div>
                    </>
                  )}
                  {branch.elseif && (
                    <>
                      <div className={`font-mono ${settings.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        else if {formatCondition(branch.elseif.condition)}
                      </div>
                      <div className={`font-mono ml-2 text-xs ${settings.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        → {formatSettings(branch.elseif.then)}
                      </div>
                    </>
                  )}
                  {branch.else && (
                    <>
                      <div className={`font-mono ${settings.theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                        else
                      </div>
                      <div className={`font-mono ml-2 text-xs ${settings.theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        → {formatSettings(branch.else)}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Evaluated Settings */}
          {evaluatedSettings && (
            <div className={`p-3 rounded ${settings.theme === 'dark' ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
              <div className={`text-sm font-medium mb-2 ${settings.theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                Resulting Settings
              </div>
              <div className={`text-xs space-y-1 ${settings.theme === 'dark' ? 'text-blue-200' : 'text-blue-600'}`}>
                {evaluatedSettings.encoder && <div>• Encoder: <code>{evaluatedSettings.encoder}</code></div>}
                {evaluatedSettings.hdrMode && <div>• HDR Mode: <code>{evaluatedSettings.hdrMode}</code></div>}
                {evaluatedSettings.bitDepth && <div>• Bit Depth: <code>{evaluatedSettings.bitDepth}-bit</code></div>}
                {evaluatedSettings.crf && <div>• Quality (CRF): <code>{evaluatedSettings.crf}</code></div>}
                {evaluatedSettings.preset && <div>• Speed: <code>{evaluatedSettings.preset}</code></div>}
              </div>
            </div>
          )}
        </div>

        {onApply && (
          <button
            onClick={() => onApply(evaluatedSettings)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-2 flex-shrink-0 ${
              settings.theme === 'dark'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            Apply
          </button>
        )}
      </div>

      {/* Validation */}
      {!validation.isValid && (
        <div className={`mt-3 p-2 rounded text-xs ${
          settings.theme === 'dark'
            ? 'bg-red-900/20 border border-red-500/30'
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className={`font-medium ${settings.theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>
            Validation Issues
          </div>
          <ul className={settings.theme === 'dark' ? 'text-red-300' : 'text-red-600'}>
            {validation.errors.map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className={`mt-2 p-2 rounded text-xs ${
          settings.theme === 'dark'
            ? 'bg-yellow-900/20 border border-yellow-500/30'
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className={`font-medium ${settings.theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}>
            Warnings
          </div>
          <ul className={settings.theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}>
            {validation.warnings.map((warn, i) => (
              <li key={i}>• {warn}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Format condition object for display
 */
function formatCondition(condition) {
  if (condition.input) {
    return `input.${condition.input}`;
  }
  if (condition.prop) {
    return `${condition.prop} ${Object.keys(condition.value)[0]}`;
  }
  if (condition.and) {
    return `(${condition.and.map(c => formatCondition(c)).join(' AND ')})`;
  }
  if (condition.or) {
    return `(${condition.or.map(c => formatCondition(c)).join(' OR ')})`;
  }
  if (condition.not) {
    return `NOT ${formatCondition(condition.not)}`;
  }
  return 'unknown';
}

/**
 * Format settings object for display
 */
function formatSettings(settings = {}) {
  const pairs = Object.entries(settings)
    .filter(([key]) => !key.startsWith('_'))
    .slice(0, 3)
    .map(([key, value]) => `${key}=${value}`);
  
  if (Object.keys(settings).length > 3) {
    pairs.push('...');
  }
  
  return pairs.join(', ');
}

export default AdvancedPresetInfo;

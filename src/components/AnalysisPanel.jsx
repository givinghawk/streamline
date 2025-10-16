import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { ChartIcon, ImageIcon, SparklesIcon, SaveIcon, UploadIcon } from './icons/Icons';

function AnalysisPanel({ files, fileInfo, onExportAnalysis, onImportAnalysis }) {
  const { settings } = useSettings();
  const [activeAnalysis, setActiveAnalysis] = useState('overview');
  const [analyzing, setAnalyzing] = useState(false);
  const [bitrateData, setBitrateData] = useState(null);
  const [qualityData, setQualityData] = useState(null);
  const [sceneData, setSceneData] = useState(null);
  const [contentData, setContentData] = useState(null);

  const analysisTabs = [
    { id: 'overview', name: 'Overview', icon: ChartIcon },
    { id: 'bitrate', name: 'Bitrate Analysis', icon: ChartIcon },
    { id: 'quality', name: 'Quality Metrics', icon: SparklesIcon },
    { id: 'scenes', name: 'Scene Detection', icon: ImageIcon },
    { id: 'content', name: 'Content Analysis', icon: ChartIcon },
  ];

  const handleAnalyze = async (type) => {
    if (!files || files.length === 0 || !files[0].path) {
      alert('Please select a file first');
      return;
    }

    setAnalyzing(true);
    try {
      const filePath = files[0].path;
      console.log(`Starting ${type} analysis for file: ${filePath}`);
      
      switch (type) {
        case 'bitrate':
          const bitrate = await window.electron.analyzeBitrate(filePath);
          console.log('Bitrate analysis result:', bitrate);
          setBitrateData(bitrate);
          break;
        case 'quality':
          // For quality metrics, we need both original and encoded
          // For now, just show placeholder
          alert('Quality metrics require both original and encoded files. This feature works after encoding.');
          break;
        case 'scenes':
          const scenes = await window.electron.detectScenes(filePath, 0.3);
          console.log('Scene detection result:', scenes);
          setSceneData(scenes);
          break;
        case 'content':
          const content = await window.electron.analyzeContent(filePath);
          console.log('Content analysis result:', content);
          setContentData(content);
          break;
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ChartIcon className={`w-16 h-16 mx-auto mb-4 ${settings.theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            No File Selected
          </h3>
          <p className={`${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Import a media file to analyze its properties and quality metrics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Analysis Type Tabs */}
      <div className={`border-b ${settings.theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center px-6 py-3">
          <div className="flex space-x-4">
            {analysisTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAnalysis === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAnalysis(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${isActive
                      ? settings.theme === 'dark'
                        ? 'bg-primary-900/30 text-primary-400'
                        : 'bg-primary-100 text-primary-700'
                      : settings.theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.name}</span>
                </button>
              );
            })}
          </div>
          
          {/* Export/Import buttons */}
          <div className="flex items-center space-x-2">
            {onImportAnalysis && (
              <button
                onClick={onImportAnalysis}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                  settings.theme === 'dark'
                    ? 'bg-surface-elevated2 hover:bg-surface-elevated3 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title="Import analysis from .slanalysis file"
              >
                <UploadIcon className="w-4 h-4" />
                <span>Import</span>
              </button>
            )}
            {onExportAnalysis && (
              <button
                onClick={onExportAnalysis}
                disabled={!fileInfo}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                  !fileInfo ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  settings.theme === 'dark'
                    ? 'bg-surface-elevated2 hover:bg-surface-elevated3 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title="Export analysis to .slanalysis file"
              >
                <SaveIcon className="w-4 h-4" />
                <span>Export</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeAnalysis === 'overview' && (
          <OverviewAnalysis fileInfo={fileInfo} settings={settings} />
        )}
        
        {activeAnalysis === 'bitrate' && (
          <BitrateAnalysis 
            files={files} 
            settings={settings} 
            analyzing={analyzing}
            onAnalyze={() => handleAnalyze('bitrate')}
            data={bitrateData}
          />
        )
        
        }
        
        {activeAnalysis === 'quality' && (
          <QualityAnalysis 
            files={files} 
            settings={settings}
            analyzing={analyzing}
            onAnalyze={() => handleAnalyze('quality')}
            data={qualityData}
          />
        )}
        
        {activeAnalysis === 'scenes' && (
          <SceneAnalysis 
            files={files} 
            settings={settings}
            analyzing={analyzing}
            onAnalyze={() => handleAnalyze('scenes')}
            data={sceneData}
          />
        )}
        
        {activeAnalysis === 'content' && (
          <ContentAnalysis 
            files={files} 
            settings={settings}
            analyzing={analyzing}
            onAnalyze={() => handleAnalyze('content')}
            data={contentData}
          />
        )}
      </div>
    </div>
  );
}

// Overview Analysis Component
function OverviewAnalysis({ fileInfo, settings }) {
  if (!fileInfo) {
    return <div className={settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading file information...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          File Overview
        </h3>
        <div className={`grid grid-cols-2 gap-4 p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'}`}>
          <div>
            <div className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Format</div>
            <div className={`font-medium ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              {fileInfo.format.container}
            </div>
          </div>
          <div>
            <div className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Duration</div>
            <div className={`font-medium ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              {fileInfo.format.durationFormatted}
            </div>
          </div>
          <div>
            <div className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>File Size</div>
            <div className={`font-medium ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              {fileInfo.format.sizeFormatted}
            </div>
          </div>
          <div>
            <div className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Bitrate</div>
            <div className={`font-medium ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              {fileInfo.format.bitrateFormatted}
            </div>
          </div>
        </div>
      </div>

      {fileInfo.video && fileInfo.video.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            Video Streams
          </h3>
          {fileInfo.video.map((video, index) => (
            <div key={index} className={`p-4 rounded-lg mb-3 ${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'}`}>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Codec</div>
                  <div className={`font-medium ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {video.codec}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Resolution</div>
                  <div className={`font-medium ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {video.resolution}
                  </div>
                </div>
                <div>
                  <div className={`text-xs ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>FPS</div>
                  <div className={`font-medium ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {video.fps.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Bitrate Analysis Component
function BitrateAnalysis({ files, settings, analyzing, onAnalyze, data }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-2 ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          Bitrate Distribution Analysis
        </h3>
        <p className={`text-sm mb-4 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Analyze bitrate distribution over time to identify spikes and optimization opportunities
        </p>
        <button
          onClick={onAnalyze}
          disabled={analyzing}
          className="btn-primary"
        >
          {analyzing ? 'Analyzing...' : 'Run Bitrate Analysis'}
        </button>
      </div>

      {data && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'}`}>
              <div className={`text-sm font-semibold mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Average Bitrate
              </div>
              <div className={`text-2xl font-bold ${settings.theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}>
                {data.summary.average.toFixed(0)} kbps
              </div>
            </div>
            <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'}`}>
              <div className={`text-sm font-semibold mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Peak Bitrate
              </div>
              <div className={`text-2xl font-bold ${settings.theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {data.summary.peak.toFixed(0)} kbps
              </div>
            </div>
            <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'}`}>
              <div className={`text-sm font-semibold mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Minimum Bitrate
              </div>
              <div className={`text-2xl font-bold ${settings.theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                {data.summary.min.toFixed(0)} kbps
              </div>
            </div>
          </div>

          {/* Line chart visualization */}
          <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'}`}>
            <h4 className={`text-sm font-semibold mb-4 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Bitrate Over Time
            </h4>
            <div className="relative h-64">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-right pr-2">
                <span className={settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                  {data.summary.peak.toFixed(0)}
                </span>
                <span className={settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                  {((data.summary.peak + data.summary.min) / 2).toFixed(0)}
                </span>
                <span className={settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                  {data.summary.min.toFixed(0)}
                </span>
              </div>

              {/* Chart area */}
              <div className="absolute left-16 right-0 top-0 bottom-8 border-l border-b border-gray-700">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
                  {/* Grid lines */}
                  <line x1="0" y1="0" x2="1000" y2="0" stroke="currentColor" strokeWidth="0.5" className={settings.theme === 'dark' ? 'text-gray-700' : 'text-gray-300'} />
                  <line x1="0" y1="50" x2="1000" y2="50" stroke="currentColor" strokeWidth="0.5" className={settings.theme === 'dark' ? 'text-gray-700' : 'text-gray-300'} strokeDasharray="4" />
                  <line x1="0" y1="100" x2="1000" y2="100" stroke="currentColor" strokeWidth="0.5" className={settings.theme === 'dark' ? 'text-gray-700' : 'text-gray-300'} />
                  
                  {/* Line chart */}
                  <polyline
                    fill="none"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="1"
                    points={data.data.slice(0, 200).map((point, index) => {
                      const x = (index / Math.min(data.data.length - 1, 199)) * 1000;
                      const y = 100 - ((point.bitrate - data.summary.min) / (data.summary.peak - data.summary.min)) * 100;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                  
                  {/* Area fill */}
                  <polygon
                    fill="rgba(59, 130, 246, 0.1)"
                    points={
                      `0,100 ` +
                      data.data.slice(0, 200).map((point, index) => {
                        const x = (index / Math.min(data.data.length - 1, 199)) * 1000;
                        const y = 100 - ((point.bitrate - data.summary.min) / (data.summary.peak - data.summary.min)) * 100;
                        return `${x},${y}`;
                      }).join(' ') +
                      ` 1000,100`
                    }
                  />
                </svg>
              </div>

              {/* X-axis labels */}
              <div className="absolute left-16 right-0 bottom-0 h-6 flex justify-between items-center text-xs">
                <span className={settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>0s</span>
                <span className={settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                  {Math.floor(data.data.length / 2)}s
                </span>
                <span className={settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                  {data.data.length}s
                </span>
              </div>
            </div>
            {data.data.length > 200 && (
              <p className={`text-xs mt-2 ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Showing first 200 seconds of {data.data.length} total data points
              </p>
            )}
          </div>
        </div>
      )}

      {!data && (
        <div className={`p-8 rounded-lg border-2 border-dashed ${settings.theme === 'dark' ? 'border-gray-700 bg-surface-elevated' : 'border-gray-300 bg-gray-50'}`}>
          <div className="text-center">
            <ChartIcon className={`w-12 h-12 mx-auto mb-3 ${settings.theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Click "Run Bitrate Analysis" to analyze the file
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Quality Analysis Component
function QualityAnalysis({ files, settings, analyzing, onAnalyze }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-2 ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          Quality Metrics & VMAF Analysis
        </h3>
        <p className={`text-sm mb-4 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Generate per-frame quality graphs for PSNR, SSIM, and VMAF metrics
        </p>
        <button
          onClick={onAnalyze}
          disabled={analyzing}
          className="btn-primary"
        >
          {analyzing ? 'Analyzing...' : 'Run Quality Analysis'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {['PSNR', 'SSIM', 'VMAF'].map((metric) => (
          <div key={metric} className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'}`}>
            <div className={`text-sm font-semibold mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {metric}
            </div>
            <div className={`text-2xl font-bold mb-1 ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              --
            </div>
            <div className={`text-xs ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              No data available
            </div>
          </div>
        ))}
      </div>

      <div className={`p-8 rounded-lg border-2 border-dashed ${settings.theme === 'dark' ? 'border-gray-700 bg-surface-elevated' : 'border-gray-300 bg-gray-50'}`}>
        <div className="text-center">
          <ChartIcon className={`w-12 h-12 mx-auto mb-3 ${settings.theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Per-frame quality graph will appear here
          </p>
          <p className={`text-sm mt-2 ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Feature coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

// Scene Detection Component
function SceneAnalysis({ files, settings, analyzing, onAnalyze, data }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-2 ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          Scene Detection & Analysis
        </h3>
        <p className={`text-sm mb-4 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Identify scene changes and analyze content complexity for optimal encoding settings
        </p>
        <button
          onClick={onAnalyze}
          disabled={analyzing}
          className="btn-primary"
        >
          {analyzing ? 'Detecting Scenes...' : 'Detect Scenes'}
        </button>
      </div>

      {data && (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'}`}>
            <div className={`text-sm font-semibold mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Scenes Detected
            </div>
            <div className={`text-3xl font-bold ${settings.theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}>
              {data.count}
            </div>
            <div className={`text-xs mt-1 ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Detection threshold: {data.threshold}
            </div>
          </div>

          <div className={`p-4 rounded-lg max-h-96 overflow-y-auto ${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'}`}>
            <h4 className={`text-sm font-semibold mb-3 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Scene Changes
            </h4>
            <div className="space-y-2">
              {data.scenes.map((scene, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded flex items-center justify-between ${
                    settings.theme === 'dark' ? 'bg-surface-elevated2' : 'bg-white'
                  }`}
                >
                  <div>
                    <div className={`font-medium ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      Scene {index + 1}
                    </div>
                    <div className={`text-xs ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                      {scene.timestamp}
                    </div>
                  </div>
                  <div className={`text-sm font-mono ${settings.theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}>
                    {scene.time.toFixed(2)}s
                  </div>
                </div>
              ))}
              {data.scenes.length === 0 && (
                <p className={`text-center py-4 ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  No scene changes detected at current threshold
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!data && (
        <div className={`p-8 rounded-lg border-2 border-dashed ${settings.theme === 'dark' ? 'border-gray-700 bg-surface-elevated' : 'border-gray-300 bg-gray-50'}`}>
          <div className="text-center">
            <ImageIcon className={`w-12 h-12 mx-auto mb-3 ${settings.theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Click "Detect Scenes" to analyze scene changes
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Content Analysis Component
function ContentAnalysis({ files, settings, analyzing, onAnalyze, data }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-2 ${settings.theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          Content Complexity Analysis
        </h3>
        <p className={`text-sm mb-4 ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Analyze video complexity, grain detection, and content characteristics for optimal settings
        </p>
        <button
          onClick={onAnalyze}
          disabled={analyzing}
          className="btn-primary"
        >
          {analyzing ? 'Analyzing Content...' : 'Analyze Content'}
        </button>
      </div>

      {data && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'}`}>
              <div className={`text-sm font-semibold mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Complexity Score
              </div>
              <div className={`text-2xl font-bold ${settings.theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}>
                {data.complexity.toFixed(1)}
              </div>
              <div className={`text-xs mt-1 ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Variance: {data.variance.toFixed(2)}
              </div>
            </div>

            <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-surface-elevated' : 'bg-gray-50'}`}>
              <div className={`text-sm font-semibold mb-2 ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Grain Level
              </div>
              <div className={`text-2xl font-bold ${
                data.grainLevel === 'High' ? 'text-orange-400' :
                data.grainLevel === 'Medium' ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {data.grainLevel}
              </div>
              <div className={`text-xs mt-1 ${settings.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                Film grain detection
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${settings.theme === 'dark' ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className={`font-semibold mb-1 ${settings.theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                  Recommendation
                </div>
                <p className={`text-sm ${settings.theme === 'dark' ? 'text-blue-200' : 'text-blue-600'}`}>
                  {data.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!data && (
        <div className={`p-8 rounded-lg border-2 border-dashed ${settings.theme === 'dark' ? 'border-gray-700 bg-surface-elevated' : 'border-gray-300 bg-gray-50'}`}>
          <div className="text-center">
            <SparklesIcon className={`w-12 h-12 mx-auto mb-3 ${settings.theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Click "Analyze Content" to begin analysis
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalysisPanel;

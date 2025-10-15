import React from 'react';
import { SettingsIcon } from './icons/Icons';

function EncodingProgress({ progress }) {
  if (!progress) return null;

  const percentage = Math.min(Math.round(progress.progress), 100);

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <div className="animate-spin mr-2">
          <SettingsIcon className="w-6 h-6" />
        </div>
        Encoding Progress
      </h2>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Progress</span>
            <span className="text-2xl font-bold text-primary-400">{percentage}%</span>
          </div>
          <div className="w-full bg-surface-elevated2 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-600 to-primary-400 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="bg-surface-elevated2 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Time</div>
            <div className="font-semibold">
              {formatTime(progress.currentTime)} / {formatTime(progress.duration)}
            </div>
          </div>
          
          <div className="bg-surface-elevated2 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Speed</div>
            <div className="font-semibold">
              {progress.speed ? `${progress.speed.toFixed(2)}x` : 'N/A'}
            </div>
          </div>
          
          <div className="bg-surface-elevated2 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">FPS</div>
            <div className="font-semibold">
              {progress.fps ? Math.round(progress.fps) : 'N/A'}
            </div>
          </div>
          
          <div className="bg-surface-elevated2 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Bitrate</div>
            <div className="font-semibold text-sm">
              {progress.bitrate || 'N/A'}
            </div>
          </div>
        </div>

        {/* ETA */}
        {progress.speed > 0 && (
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Estimated Time Remaining:</span>
              <span className="font-semibold text-primary-400">
                {calculateETA(progress)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(seconds) {
  if (!seconds || seconds === 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function calculateETA(progress) {
  const { currentTime, duration, speed } = progress;
  if (!speed || speed === 0) return 'Calculating...';
  
  const remaining = duration - currentTime;
  const eta = remaining / speed;
  
  return formatTime(eta);
}

export default EncodingProgress;

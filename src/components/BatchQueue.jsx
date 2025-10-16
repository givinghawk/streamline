import React, { useState } from 'react';
import {
  PlayIcon,
  CloseIcon,
  DeleteIcon,
  CheckIcon,
  WarningIcon,
  SettingsIcon,
  UploadIcon,
  DownloadIcon,
  SaveIcon,
} from './icons/Icons';
import VideoComparison from './VideoComparison';

const QueueStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

function BatchQueue({ queue, onRemoveItem, onClearCompleted, onStartBatch, isProcessing, onSaveQueue, onLoadQueue, onExportReport }) {
  const [expandedItem, setExpandedItem] = useState(null);
  const [comparisonItem, setComparisonItem] = useState(null);

  // Helper function to get the output path for a completed item
  const getOutputPath = (item) => {
    if (!item.outputPath) {
      // Construct output path from input path if not provided
      const path = item.file.path;
      const lastDot = path.lastIndexOf('.');
      const lastSlash = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
      const basePath = path.substring(0, lastDot);
      const ext = path.substring(lastDot);
      return `${basePath}_optimised${ext}`;
    }
    return item.outputPath;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case QueueStatus.PENDING:
        return 'text-gray-400 bg-gray-500/20';
      case QueueStatus.PROCESSING:
        return 'text-blue-400 bg-blue-500/20';
      case QueueStatus.COMPLETED:
        return 'text-green-400 bg-green-500/20';
      case QueueStatus.FAILED:
        return 'text-red-400 bg-red-500/20';
      case QueueStatus.CANCELLED:
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case QueueStatus.PROCESSING:
        return <SettingsIcon className="w-4 h-4 animate-spin" />;
      case QueueStatus.COMPLETED:
        return <CheckIcon className="w-4 h-4" />;
      case QueueStatus.FAILED:
        return <WarningIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const calculateSavings = (original, compressed) => {
    if (!original || !compressed) return null;
    const saved = original - compressed;
    const percent = ((saved / original) * 100).toFixed(1);
    return { saved, percent };
  };

  const pendingCount = queue.filter(item => item.status === QueueStatus.PENDING).length;
  const processingCount = queue.filter(item => item.status === QueueStatus.PROCESSING).length;
  const completedCount = queue.filter(item => item.status === QueueStatus.COMPLETED).length;
  const failedCount = queue.filter(item => item.status === QueueStatus.FAILED).length;

  const totalOriginalSize = queue.reduce((sum, item) => sum + (item.originalSize || 0), 0);
  const totalCompressedSize = queue
    .filter(item => item.status === QueueStatus.COMPLETED)
    .reduce((sum, item) => sum + (item.compressedSize || 0), 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Batch Queue</h2>
          <div className="flex items-center space-x-4 mt-1 text-sm">
            <span className="text-gray-400">
              {queue.length} total
            </span>
            {pendingCount > 0 && (
              <span className="text-gray-400">
                {pendingCount} pending
              </span>
            )}
            {processingCount > 0 && (
              <span className="text-blue-400">
                {processingCount} processing
              </span>
            )}
            {completedCount > 0 && (
              <span className="text-green-400">
                {completedCount} completed
              </span>
            )}
            {failedCount > 0 && (
              <span className="text-red-400">
                {failedCount} failed
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {queue.length > 0 && (
            <>
              <button
                onClick={onSaveQueue}
                className="btn-secondary text-sm flex items-center space-x-1"
                disabled={isProcessing}
                title="Save queue to .slqueue file"
              >
                <SaveIcon className="w-4 h-4" />
                <span>Save Queue</span>
              </button>
              {completedCount > 0 && (
                <button
                  onClick={onExportReport}
                  className="btn-secondary text-sm flex items-center space-x-1"
                  disabled={isProcessing}
                  title="Export report to .slreport file"
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
              )}
            </>
          )}
          <button
            onClick={onLoadQueue}
            className="btn-secondary text-sm flex items-center space-x-1"
            disabled={isProcessing}
            title="Load queue from .slqueue file"
          >
            <UploadIcon className="w-4 h-4" />
            <span>Load Queue</span>
          </button>
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="btn-secondary text-sm"
              disabled={isProcessing}
            >
              Clear Completed
            </button>
          )}
          
          {pendingCount > 0 && (
            <button
              onClick={onStartBatch}
              disabled={isProcessing}
              className="btn-primary flex items-center space-x-2"
            >
              <PlayIcon className="w-4 h-4" />
              <span>Start Batch</span>
            </button>
          )}
        </div>
      </div>

      {/* Overall Statistics */}
      {completedCount > 0 && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-400 mb-1">Original Size</div>
              <div className="text-lg font-semibold text-green-400">
                {formatFileSize(totalOriginalSize)}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Compressed Size</div>
              <div className="text-lg font-semibold text-green-400">
                {formatFileSize(totalCompressedSize)}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Total Saved</div>
              <div className="text-lg font-semibold text-green-400">
                {formatFileSize(totalOriginalSize - totalCompressedSize)}
                {totalOriginalSize > 0 && (
                  <span className="text-sm ml-2">
                    ({(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue Items */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {queue.length === 0 ? (
          <div className="text-center py-12">
            <UploadIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No files in queue</p>
            <p className="text-sm text-gray-500 mt-1">
              Drop multiple files to start batch processing
            </p>
          </div>
        ) : (
          queue.map((item) => {
            const savings = calculateSavings(item.originalSize, item.compressedSize);
            const isExpanded = expandedItem === item.id;

            return (
              <div
                key={item.id}
                className="bg-surface-elevated2 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          <span>{item.status.toUpperCase()}</span>
                        </div>
                        <span className="text-sm text-gray-400 truncate">
                          {item.file.name}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      {item.status === QueueStatus.PROCESSING && item.progress && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-400">
                              {item.progress.percent}% • {item.progress.fps} fps • {item.progress.speed}x
                            </span>
                            <span className="text-gray-400">
                              {item.progress.time} / {item.progress.duration}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${item.progress.percent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* File Info */}
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>{formatFileSize(item.originalSize)}</span>
                        {item.preset && (
                          <span>→ {item.preset.name}</span>
                        )}
                        {savings && (
                          <span className="text-green-400">
                            Saved: {formatFileSize(savings.saved)} ({savings.percent}%)
                          </span>
                        )}
                      </div>

                      {/* Error Message */}
                      {item.status === QueueStatus.FAILED && item.error && (
                        <div className="mt-2 text-xs text-red-400">
                          Error: {item.error}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {item.status === QueueStatus.COMPLETED && item.fileType === 'video' && (
                        <button
                          onClick={() => setComparisonItem(item)}
                          className="p-2 hover:bg-surface rounded transition-colors"
                          title="Compare videos"
                        >
                          <PlayIcon className="w-4 h-4 text-primary-400" />
                        </button>
                      )}
                      
                      {item.status === QueueStatus.COMPLETED && (
                        <button
                          onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                          className="p-2 hover:bg-surface rounded transition-colors"
                          title="View details"
                        >
                          <DownloadIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                      
                      {(item.status === QueueStatus.PENDING || item.status === QueueStatus.FAILED) && (
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-2 hover:bg-surface rounded transition-colors"
                          title="Remove"
                        >
                          <DeleteIcon className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && item.qualityMetrics && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h4 className="text-sm font-semibold mb-2">Quality Metrics</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {item.qualityMetrics.psnr && (
                          <div>
                            <div className="text-gray-400">PSNR</div>
                            <div className="font-medium">{item.qualityMetrics.psnr} dB</div>
                          </div>
                        )}
                        {item.qualityMetrics.ssim && (
                          <div>
                            <div className="text-gray-400">SSIM</div>
                            <div className="font-medium">{item.qualityMetrics.ssim}</div>
                          </div>
                        )}
                        {item.qualityMetrics.vmaf && (
                          <div>
                            <div className="text-gray-400">VMAF</div>
                            <div className="font-medium">{item.qualityMetrics.vmaf}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Video Comparison Modal */}
      {comparisonItem && (
        <VideoComparison
          originalPath={comparisonItem.file.path}
          encodedPath={getOutputPath(comparisonItem)}
          onClose={() => setComparisonItem(null)}
        />
      )}
    </div>
  );
}

export default BatchQueue;
export { QueueStatus };

import React from 'react';

const ErrorModal = ({ error, onClose, onCopyError, onReportError }) => {
  if (!error) return null;

  const formatErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return 'An unknown error occurred';
  };

  const formatErrorDetails = (error) => {
    const details = {
      timestamp: new Date().toISOString(),
      error: error.message || error,
      stack: error.stack || 'No stack trace available',
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      electronVersion: window.electron?.versions?.electron || 'Unknown',
      nodeVersion: window.electron?.versions?.node || 'Unknown',
      chromeVersion: window.electron?.versions?.chrome || 'Unknown'
    };

    if (error.ffmpegCommand) {
      details.ffmpegCommand = error.ffmpegCommand;
    }

    if (error.ffmpegOutput) {
      details.ffmpegOutput = error.ffmpegOutput;
    }

    if (error.file) {
      details.file = {
        name: error.file.name,
        path: error.file.path,
        size: error.file.size,
        type: error.file.type
      };
    }

    return JSON.stringify(details, null, 2);
  };

  const handleCopyError = () => {
    const errorDetails = formatErrorDetails(error);
    navigator.clipboard.writeText(errorDetails).then(() => {
      onCopyError && onCopyError();
    }).catch(err => {
      console.error('Failed to copy error to clipboard:', err);
    });
  };

  const handleReportError = () => {
    const errorDetails = formatErrorDetails(error);
    const issueTitle = encodeURIComponent(`Error: ${formatErrorMessage(error).substring(0, 50)}...`);
    const issueBody = encodeURIComponent(`## Error Report

**Error Message:**
${formatErrorMessage(error)}

**Error Details:**
\`\`\`json
${errorDetails}
\`\`\`

**Steps to Reproduce:**
1. [Please describe what you were doing when this error occurred]
2. 
3. 

**Expected Behavior:**
[Describe what you expected to happen]

**Additional Context:**
[Add any other context about the problem here]
`);

    const githubUrl = `https://github.com/givinghawk/streamline/issues/new?title=${issueTitle}&body=${issueBody}&labels=bug`;
    
    // Copy error details to clipboard first
    navigator.clipboard.writeText(errorDetails).then(() => {
      // Then open GitHub issues page
      window.open(githubUrl, '_blank');
      onReportError && onReportError();
    }).catch(err => {
      console.error('Failed to copy error details:', err);
      // Still open GitHub page even if clipboard fails
      window.open(githubUrl, '_blank');
      onReportError && onReportError();
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Error Occurred
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              An error occurred while processing your request:
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 font-medium">
                {formatErrorMessage(error)}
              </p>
            </div>
          </div>

          {error.ffmpegOutput && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Technical Details:
              </h4>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {error.ffmpegOutput}
                </pre>
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              What can you do?
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Check if your input file is valid and not corrupted</li>
              <li>• Try a different output format or quality setting</li>
              <li>• Report this issue to help us improve the application</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Ignore Error
          </button>
          
          <button
            onClick={handleCopyError}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copy Details</span>
          </button>
          
          <button
            onClick={handleReportError}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Report Issue</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
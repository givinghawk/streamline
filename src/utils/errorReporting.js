// Error reporting utilities

/**
 * Formats system information for error reports
 */
export const getSystemInfo = () => {
  return {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    electronVersion: window.electron?.versions?.electron || 'Unknown',
    nodeVersion: window.electron?.versions?.node || 'Unknown',
    chromeVersion: window.electron?.versions?.chrome || 'Unknown',
    appVersion: window.electron?.versions?.app || 'Unknown'
  };
};

/**
 * Formats an error object for reporting
 */
export const formatErrorForReport = (error, additionalContext = {}) => {
  const systemInfo = getSystemInfo();
  
  const errorReport = {
    ...systemInfo,
    error: {
      message: error.message || error.toString(),
      type: error.type || 'unknown',
      code: error.code,
      stack: error.stack,
      suggestion: error.suggestion
    },
    context: additionalContext
  };

  // Add FFmpeg-specific information if available
  if (error.type === 'ffmpeg') {
    errorReport.ffmpeg = {
      command: error.ffmpegCommand,
      output: error.ffmpegOutput,
      file: error.file ? {
        name: error.file.name,
        path: error.file.path,
        size: error.file.size,
        type: error.file.type
      } : null
    };
  }

  return errorReport;
};

/**
 * Generates a GitHub issue URL with pre-filled error information
 */
export const generateGitHubIssueUrl = (error, additionalContext = {}) => {
  const errorReport = formatErrorForReport(error, additionalContext);
  
  const title = `Error: ${error.message || 'Unknown error'}`.substring(0, 100);
  const body = `## Error Report

**Error Message:**
${error.message || 'Unknown error'}

${error.suggestion ? `**Suggested Solution:**
${error.suggestion}

` : ''}**Error Type:** ${error.type || 'Unknown'}

**Steps to Reproduce:**
1. [Please describe what you were doing when this error occurred]
2. 
3. 

**Expected Behavior:**
[Describe what you expected to happen]

**System Information:**
- Platform: ${errorReport.platform}
- Electron: ${errorReport.electronVersion}
- Node.js: ${errorReport.nodeVersion}
- Chrome: ${errorReport.chromeVersion}

${errorReport.ffmpeg ? `**FFmpeg Details:**
- Command: \`${errorReport.ffmpeg.command || 'Not available'}\`
- File: ${errorReport.ffmpeg.file ? `${errorReport.ffmpeg.file.name} (${errorReport.ffmpeg.file.type})` : 'Not available'}

**FFmpeg Output:**
\`\`\`
${errorReport.ffmpeg.output || 'No output available'}
\`\`\`

` : ''}**Full Error Details:**
\`\`\`json
${JSON.stringify(errorReport, null, 2)}
\`\`\`

**Additional Context:**
[Add any other context about the problem here]
`;

  const githubUrl = new URL('https://github.com/givinghawk/streamline/issues/new');
  githubUrl.searchParams.set('title', title);
  githubUrl.searchParams.set('body', body);
  githubUrl.searchParams.set('labels', 'bug,user-reported');

  return githubUrl.toString();
};

/**
 * Copies error details to clipboard
 */
export const copyErrorToClipboard = async (error, additionalContext = {}) => {
  try {
    const errorReport = formatErrorForReport(error, additionalContext);
    const errorText = JSON.stringify(errorReport, null, 2);
    
    await navigator.clipboard.writeText(errorText);
    return true;
  } catch (err) {
    console.error('Failed to copy error to clipboard:', err);
    return false;
  }
};

/**
 * Analyzes FFmpeg errors and provides helpful suggestions
 */
export const analyzeFFmpegError = (output) => {
  if (!output) return null;

  const analysis = {
    category: 'unknown',
    suggestion: 'Try different encoding settings or check the input file.',
    severity: 'medium'
  };

  // Format conversion errors
  if (output.includes('Impossible to convert between the formats')) {
    analysis.category = 'format_conversion';
    analysis.suggestion = 'The input format is not compatible with the selected output format. Try choosing a different output format or codec.';
    analysis.severity = 'high';
  }
  
  // File access errors
  else if (output.includes('No such file or directory')) {
    analysis.category = 'file_access';
    analysis.suggestion = 'The input file cannot be found. Please check the file path and ensure the file exists.';
    analysis.severity = 'high';
  }
  
  // Permission errors
  else if (output.includes('Permission denied')) {
    analysis.category = 'permissions';
    analysis.suggestion = 'Permission denied. Check that you have read access to the input file and write access to the output directory.';
    analysis.severity = 'high';
  }
  
  // Codec errors
  else if (output.includes('Unknown encoder') || output.includes('Unknown codec')) {
    analysis.category = 'codec';
    analysis.suggestion = 'The selected codec is not available. Try using a different codec or check your FFmpeg installation.';
    analysis.severity = 'medium';
  }
  
  // Filter errors
  else if (output.includes('No such filter') || output.includes('filter')) {
    analysis.category = 'filter';
    analysis.suggestion = 'There\'s an issue with video/audio filters. Try using different quality settings or disable advanced options.';
    analysis.severity = 'medium';
  }
  
  // Invalid input
  else if (output.includes('Invalid data found when processing input')) {
    analysis.category = 'invalid_input';
    analysis.suggestion = 'The input file appears to be corrupted or in an unsupported format. Try using a different file.';
    analysis.severity = 'high';
  }
  
  // Hardware acceleration errors
  else if (output.includes('hwaccel') || output.includes('cuda') || output.includes('nvenc')) {
    analysis.category = 'hardware_acceleration';
    analysis.suggestion = 'Hardware acceleration failed. Try disabling hardware acceleration in the advanced settings.';
    analysis.severity = 'medium';
  }

  return analysis;
};

/**
 * Creates a user-friendly error message from FFmpeg output
 */
export const createFriendlyErrorMessage = (ffmpegOutput) => {
  const analysis = analyzeFFmpegError(ffmpegOutput);
  
  if (!analysis) {
    return 'An unknown encoding error occurred. Please check your input file and settings.';
  }

  const categoryMessages = {
    format_conversion: 'Format Conversion Error',
    file_access: 'File Access Error',
    permissions: 'Permission Error',
    codec: 'Codec Error',
    filter: 'Filter Error',
    invalid_input: 'Invalid Input File',
    hardware_acceleration: 'Hardware Acceleration Error',
    unknown: 'Encoding Error'
  };

  return `${categoryMessages[analysis.category]}: ${analysis.suggestion}`;
};
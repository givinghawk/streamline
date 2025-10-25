import React, { createContext, useContext, useState, useCallback } from 'react';

const ErrorContext = createContext();

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [currentError, setCurrentError] = useState(null);
  const [errorHistory, setErrorHistory] = useState([]);

  const showError = useCallback((error, additionalInfo = {}) => {
    const errorObj = {
      ...error,
      ...additionalInfo,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString()
    };

    setCurrentError(errorObj);
    setErrorHistory(prev => [errorObj, ...prev.slice(0, 9)]); // Keep last 10 errors
  }, []);

  const clearError = useCallback(() => {
    setCurrentError(null);
  }, []);

  const clearAllErrors = useCallback(() => {
    setCurrentError(null);
    setErrorHistory([]);
  }, []);

  const handleFFmpegError = useCallback((error, file = null, command = null) => {
    let formattedError = {
      message: 'FFmpeg encoding failed',
      type: 'ffmpeg',
      file,
      ffmpegCommand: command
    };

    if (typeof error === 'string') {
      formattedError.message = error;
      formattedError.ffmpegOutput = error;
    } else if (error.message) {
      formattedError.message = error.message;
      formattedError.ffmpegOutput = error.output || error.stderr || error.stdout || '';
      formattedError.code = error.code;
    }

    // Parse common FFmpeg errors and provide helpful messages
    const output = formattedError.ffmpegOutput || '';
    
    if (output.includes('Impossible to convert between the formats')) {
      formattedError.message = 'Format conversion error: Unable to convert between input and output formats';
      formattedError.suggestion = 'Try using a different output format or codec that\'s compatible with your input file.';
    } else if (output.includes('No such file or directory')) {
      formattedError.message = 'File not found: The input file could not be accessed';
      formattedError.suggestion = 'Please check that the file exists and is accessible.';
    } else if (output.includes('Invalid data found when processing input')) {
      formattedError.message = 'Invalid input file: The file appears to be corrupted or in an unsupported format';
      formattedError.suggestion = 'Try using a different input file or check if the file is corrupted.';
    } else if (output.includes('Permission denied')) {
      formattedError.message = 'Permission denied: Cannot access the file or output directory';
      formattedError.suggestion = 'Check file permissions and ensure the output directory is writable.';
    } else if (output.includes('Conversion failed')) {
      formattedError.message = 'Media conversion failed';
      formattedError.suggestion = 'Try different encoding settings or a different output format.';
    }

    showError(formattedError);
  }, [showError]);

  const handleGenericError = useCallback((error, context = '') => {
    const formattedError = {
      message: error.message || error.toString(),
      type: 'generic',
      context,
      stack: error.stack,
      originalError: error
    };

    showError(formattedError);
  }, [showError]);

  const value = {
    currentError,
    errorHistory,
    showError,
    clearError,
    clearAllErrors,
    handleFFmpegError,
    handleGenericError
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContext;
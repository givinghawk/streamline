import React from 'react';

const WarningIcon = () => (
  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const QualityValidationAlert = ({ validationResult, className = "" }) => {
  if (!validationResult) return null;

  const { isValid, warnings } = validationResult;

  return (
    <div className={`rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {isValid ? <CheckIcon /> : <WarningIcon />}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${
            isValid ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'
          }`}>
            {isValid ? 'Quality validation passed' : 'Quality warnings detected'}
          </h3>
          {!isValid && warnings.length > 0 && (
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <ul className="list-disc list-inside space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
          {isValid && (
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              All quality metrics meet the configured thresholds.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityValidationAlert;
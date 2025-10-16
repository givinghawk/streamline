import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { themeColors } from '../utils/themeUtils';

const modes = [
  {
    id: 'import',
    name: 'Import',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    id: 'encode',
    name: 'Encode',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'analysis',
    name: 'Analysis',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

function ModeTabs({ currentMode, onModeChange }) {
  const { settings } = useSettings();

  return (
    <div className={`${settings.theme === 'dark' ? 'bg-surface-elevated border-b border-gray-700' : 'bg-gray-50 border-b border-gray-200'}`}>
      <div className="container mx-auto px-4">
        <div className="flex space-x-1">
          {modes.map((mode) => {
            const isActive = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={`
                  flex items-center space-x-2 px-6 py-3 font-medium transition-all duration-200
                  ${isActive
                    ? settings.theme === 'dark'
                      ? 'text-primary-400 border-b-2 border-primary-400 bg-surface'
                      : 'text-primary-600 border-b-2 border-primary-600 bg-white'
                    : settings.theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-surface/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <span className={isActive ? 'text-primary-400' : ''}>{mode.icon}</span>
                <span>{mode.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ModeTabs;

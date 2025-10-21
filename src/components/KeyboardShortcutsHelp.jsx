import React from 'react';
import { formatShortcut } from '../hooks/useKeyboardShortcuts';

function KeyboardShortcutsHelp({ isOpen, onClose, theme }) {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { key: 'ctrl+1', description: 'Switch to Import mode' },
        { key: 'ctrl+2', description: 'Switch to Encode mode' },
        { key: 'ctrl+3', description: 'Switch to Analysis mode' },
        { key: 'ctrl+4', description: 'Switch to Trim/Concat mode' },
        { key: 'ctrl+5', description: 'Switch to Download mode' },
        { key: 'ctrl+6', description: 'Switch to Presets mode' },
        { key: 'ctrl+7', description: 'Switch to Benchmark mode' },
      ],
    },
    {
      category: 'Actions',
      items: [
        { key: 'ctrl+enter', description: 'Start encoding queue' },
        { key: 'ctrl+o', description: 'Add files to queue' },
        { key: 'ctrl+shift+delete', description: 'Clear queue' },
        { key: 'ctrl+,', description: 'Open settings' },
      ],
    },
    {
      category: 'Search & Navigation',
      items: [
        { key: 'ctrl+f', description: 'Search presets' },
        { key: 'escape', description: 'Clear search / Close dialogs' },
      ],
    },
    {
      category: 'Help',
      items: [
        { key: 'ctrl+/', description: 'Show keyboard shortcuts' },
      ],
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={`max-w-2xl w-full mx-4 rounded-xl shadow-2xl ${
          theme === 'dark' ? 'bg-surface-elevated' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Keyboard Shortcuts
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200' 
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {shortcuts.map((section) => (
              <div key={section.category}>
                <h3 className={`text-sm font-semibold mb-3 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div 
                      key={item.key}
                      className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                        theme === 'dark' ? 'bg-surface-elevated2' : 'bg-gray-50'
                      }`}
                    >
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {item.description}
                      </span>
                      <kbd className={`
                        px-3 py-1 rounded font-mono text-sm font-semibold
                        ${theme === 'dark' 
                          ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                          : 'bg-white text-gray-700 border border-gray-300 shadow-sm'
                        }
                      `}>
                        {formatShortcut(item.key)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            Press <kbd className={`px-2 py-0.5 rounded font-mono text-xs ${
              theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}>Esc</kbd> or click outside to close
          </p>
        </div>
      </div>
    </div>
  );
}

export default KeyboardShortcutsHelp;

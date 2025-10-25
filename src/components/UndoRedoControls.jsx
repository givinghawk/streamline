import React from 'react';

const UndoIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
);

const RedoIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
  </svg>
);

const UndoRedoControls = ({ onUndo, onRedo, canUndo, canRedo, className = "" }) => {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`
          p-2 rounded transition-colors
          ${canUndo
            ? 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }
        `}
        title="Undo (Ctrl+Z)"
      >
        <UndoIcon />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`
          p-2 rounded transition-colors
          ${canRedo
            ? 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }
        `}
        title="Redo (Ctrl+Y)"
      >
        <RedoIcon />
      </button>
    </div>
  );
};

export default UndoRedoControls;
import { useEffect } from 'react';

/**
 * Hook to handle keyboard shortcuts
 * @param {Object} shortcuts - Object mapping keys to callbacks
 * @param {boolean} enabled - Whether shortcuts are enabled
 */
export function useKeyboardShortcuts(shortcuts, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Build a key string like "ctrl+s" or "ctrl+shift+p"
      const modifiers = [];
      if (event.ctrlKey) modifiers.push('ctrl');
      if (event.shiftKey) modifiers.push('shift');
      if (event.altKey) modifiers.push('alt');
      if (event.metaKey) modifiers.push('meta');
      
      const key = event.key.toLowerCase();
      const keyCombo = [...modifiers, key].join('+');
      
      // Check if this key combo has a handler
      if (shortcuts[keyCombo]) {
        event.preventDefault();
        shortcuts[keyCombo](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

/**
 * Common keyboard shortcuts configuration
 */
export const SHORTCUTS = {
  // Navigation
  IMPORT_TAB: 'ctrl+1',
  ENCODE_TAB: 'ctrl+2',
  ANALYSIS_TAB: 'ctrl+3',
  
  // Actions
  START_ENCODE: 'ctrl+enter',
  ADD_FILES: 'ctrl+o',
  CLEAR_QUEUE: 'ctrl+shift+delete',
  SETTINGS: 'ctrl+,',
  
  // Search
  SEARCH_PRESETS: 'ctrl+f',
  ESCAPE: 'escape',
  
  // Presets (number keys)
  PRESET_1: 'ctrl+shift+1',
  PRESET_2: 'ctrl+shift+2',
  PRESET_3: 'ctrl+shift+3',
  PRESET_4: 'ctrl+shift+4',
  PRESET_5: 'ctrl+shift+5',
};

/**
 * Get human-readable shortcut display
 */
export function formatShortcut(shortcut) {
  return shortcut
    .split('+')
    .map(key => {
      const mapping = {
        'ctrl': 'Ctrl',
        'shift': 'Shift',
        'alt': 'Alt',
        'meta': 'Cmd',
        'enter': 'Enter',
        'escape': 'Esc',
        'delete': 'Del',
      };
      return mapping[key] || key.toUpperCase();
    })
    .join(' + ');
}

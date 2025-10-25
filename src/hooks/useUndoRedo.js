import { useState, useCallback, useRef } from 'react';

export const useUndoRedo = (initialState, maxHistorySize = 50) => {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isUndoRedoOperation = useRef(false);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const updateState = useCallback((newState) => {
    if (isUndoRedoOperation.current) {
      isUndoRedoOperation.current = false;
      return;
    }

    setState(newState);
    
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        setCurrentIndex(prev => prev - 1);
        return newHistory;
      }
      
      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [currentIndex, maxHistorySize]);

  const undo = useCallback(() => {
    if (canUndo) {
      isUndoRedoOperation.current = true;
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setState(history[newIndex]);
    }
  }, [canUndo, currentIndex, history]);

  const redo = useCallback(() => {
    if (canRedo) {
      isUndoRedoOperation.current = true;
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setState(history[newIndex]);
    }
  }, [canRedo, currentIndex, history]);

  const clearHistory = useCallback(() => {
    setHistory([state]);
    setCurrentIndex(0);
  }, [state]);

  return {
    state,
    updateState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    historySize: history.length,
    currentIndex
  };
};

export default useUndoRedo;
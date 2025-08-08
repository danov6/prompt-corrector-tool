import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, MAX_HISTORY_ENTRIES } from '../../shared/constants';

const AppContext = createContext();

const initialState = {
  currentPrompt: '',
  currentScore: 0,
  suggestions: [],
  history: [],
  isLoading: false,
  showSuggestions: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PROMPT':
      return { ...state, currentPrompt: action.payload };
    case 'SET_SCORE':
      return { ...state, currentScore: action.payload };
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload, showSuggestions: true };
    case 'SET_SUGGESTIONS_AND_NAVIGATE':
      return { ...state, suggestions: action.payload, showSuggestions: true };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_TO_HISTORY':
      return { 
        ...state, 
        history: [action.payload, ...state.history.slice(0, MAX_HISTORY_ENTRIES - 1)] // Keep last entries
      };
    case 'LOAD_HISTORY':
      return { ...state, history: action.payload };
    case 'CLEAR_SUGGESTIONS':
      return { ...state, showSuggestions: false, suggestions: [] };
    case 'RESET_PROMPT':
      return { 
        ...state, 
        currentPrompt: '', 
        currentScore: 0, 
        suggestions: [], 
        showSuggestions: false 
      };
    case 'CLEAR_SESSION':
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      return { 
        ...state, 
        currentPrompt: '', 
        currentScore: 0, 
        suggestions: [], 
        showSuggestions: false 
      };
    case 'LOAD_SESSION':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    // Load history
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        dispatch({ type: 'LOAD_HISTORY', payload: parsedHistory });
      } catch (error) {
        console.error('Failed to load history from localStorage:', error);
      }
    }

    // Load current session data
    const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        dispatch({ type: 'LOAD_SESSION', payload: parsedSession });
      } catch (error) {
        console.error('Failed to load session from localStorage:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (state.history.length > 0) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(state.history));
    }
  }, [state.history]);

  // Save current session to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    // Only save if we have meaningful data or if we're explicitly clearing
    if (state.currentPrompt || state.showSuggestions || state.suggestions.length > 0) {
      const sessionData = {
        currentPrompt: state.currentPrompt,
        currentScore: state.currentScore,
        suggestions: state.suggestions,
        showSuggestions: state.showSuggestions
      };
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
    }
  }, [state.currentPrompt, state.currentScore, state.suggestions, state.showSuggestions]);

  const saveToHistory = useCallback((prompt, score, suggestions) => {
    const historyEntry = {
      id: Date.now(),
      prompt,
      score,
      suggestions,
      timestamp: new Date().toISOString()
    };
    dispatch({ type: 'ADD_TO_HISTORY', payload: historyEntry });
  }, [dispatch]);

  const value = {
    ...state,
    dispatch,
    saveToHistory
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
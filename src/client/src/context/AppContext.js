import React, { createContext, useContext, useReducer, useEffect } from 'react';

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
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_TO_HISTORY':
      return { 
        ...state, 
        history: [action.payload, ...state.history.slice(0, 49)] // Keep last 50 entries
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
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('promptGraderHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        dispatch({ type: 'LOAD_HISTORY', payload: parsedHistory });
      } catch (error) {
        console.error('Failed to load history from localStorage:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (state.history.length > 0) {
      localStorage.setItem('promptGraderHistory', JSON.stringify(state.history));
    }
  }, [state.history]);

  const saveToHistory = (prompt, score, suggestions) => {
    const historyEntry = {
      id: Date.now(),
      prompt,
      score,
      suggestions,
      timestamp: new Date().toISOString()
    };
    dispatch({ type: 'ADD_TO_HISTORY', payload: historyEntry });
  };

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
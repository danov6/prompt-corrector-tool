import React from 'react';
import { useApp } from '../context/AppContext';
import './SuggestionsList.css';

function SuggestionsList() {
  const { suggestions, currentPrompt, currentScore, showSuggestions, saveToHistory, dispatch } = useApp();

  React.useEffect(() => {
    if (showSuggestions && currentPrompt && suggestions.length > 0) {
      saveToHistory(currentPrompt, currentScore, suggestions);
    }
  }, [showSuggestions, currentPrompt, currentScore, suggestions, saveToHistory]);

  const handleNewPrompt = () => {
    dispatch({ type: 'RESET_PROMPT' });
  };

  if (!showSuggestions) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Persona': '👤',
      'Examples': '📝',
      'Length': '📏',
      'Specificity': '🎯',
      'Context': '🔍',
      'Structure': '🏗️',
      'Clarity': '💡'
    };
    return icons[category] || '💡';
  };

  return (
    <div className="suggestions-container">
      <div className="suggestions-header">
        <div className="result-summary">
          <div className="result-score" style={{ color: getScoreColor(currentScore) }}>
            {currentScore}% Score
          </div>
          <h2 className="suggestions-title">
            {suggestions.length > 0 ? 'Here\'s how to improve your prompt:' : 'Great job! Your prompt looks good.'}
          </h2>
        </div>
        
        <button 
          onClick={handleNewPrompt}
          className="new-prompt-button"
          aria-label="Start a new prompt"
        >
          New Prompt
        </button>
      </div>

      <div className="prompt-display">
        <h3>Your Prompt:</h3>
        <div className="prompt-text">
          {currentPrompt}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions-list">
          <h3>Suggestions for Improvement:</h3>
          <div className="suggestions-grid">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-card">
                <div className="suggestion-header">
                  <span className="suggestion-icon" aria-hidden="true">
                    {getCategoryIcon(suggestion.category)}
                  </span>
                  <span className="suggestion-category">
                    {suggestion.category}
                  </span>
                </div>
                <p className="suggestion-message">
                  {suggestion.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestions.length === 0 && currentScore >= 80 && (
        <div className="excellent-prompt">
          <div className="celebration-icon">🎉</div>
          <h3>Excellent Prompt!</h3>
          <p>Your prompt is well-structured and clear. It should generate great results!</p>
        </div>
      )}
    </div>
  );
}

export default SuggestionsList;
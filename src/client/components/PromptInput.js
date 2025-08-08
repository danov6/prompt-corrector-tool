import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { gradePrompt, getSuggestions } from "../services/api";
import "../styles/PromptInput.css";

function PromptInput() {
  const {
    currentPrompt,
    currentScore,
    isLoading,
    suggestions,
    showSuggestions,
    dispatch,
  } = useApp();
  const [localPrompt, setLocalPrompt] = useState(currentPrompt);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const navigate = useNavigate();

  // Debounced grading function
  const debouncedGrade = useCallback(
    debounce(async (prompt) => {
      if (prompt?.trim()) {
        try {
          const score = await gradePrompt(prompt);
          dispatch({ type: "SET_SCORE", payload: score });
        } catch (error) {
          console.error("Failed to grade prompt:", error);
        }
      } else {
        dispatch({ type: "SET_SCORE", payload: 0 });
      }
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    dispatch({ type: "SET_PROMPT", payload: localPrompt });
    debouncedGrade(localPrompt);
  }, [localPrompt, dispatch, debouncedGrade]);

  // Navigate to feedback page when suggestions are loaded and shouldNavigate is true
  useEffect(() => {
    if (shouldNavigate && showSuggestions && suggestions.length > 0) {
      setShouldNavigate(false);
      navigate("/feedback");
    }
  }, [shouldNavigate, showSuggestions, suggestions.length, navigate]);

  const handleInputChange = (e) => {
    setLocalPrompt(e.target.value);
  };

  const handleGradePrompt = async () => {
    if (!localPrompt.trim()) return;

    dispatch({ type: "SET_LOADING", payload: true });
    setShouldNavigate(true);

    try {
      const suggestions = await getSuggestions(localPrompt);
      dispatch({ type: "SET_SUGGESTIONS", payload: suggestions });
      // Navigation will happen in useEffect when suggestions are set
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      setShouldNavigate(false);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#22c55e"; // Green
    if (score >= 60) return "#f59e0b"; // Yellow
    if (score >= 40) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Great";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    if (score >= 40) return "Needs Work";
    if (score > 0) return "Poor";
    return "No Prompt";
  };

  return (
    <div className="prompt-input-container">
      <div className="score-display" aria-live="polite">
        <div
          className="score-circle"
          style={{ borderColor: getScoreColor(currentScore) }}
        >
          <span
            className="score-number"
            style={{ color: getScoreColor(currentScore) }}
          >
            {currentScore}
          </span>
          <span className="score-percent">%</span>
        </div>
        <div
          className="score-label"
          style={{ color: getScoreColor(currentScore) }}
        >
          {getScoreLabel(currentScore)}
        </div>
      </div>

      <div className="input-section">
        <div className="input-container">
          <textarea
            value={localPrompt}
            onChange={handleInputChange}
            placeholder="Enter your prompt here to get real-time feedback and suggestions..."
            className="prompt-textarea"
            rows={6}
            aria-label="Prompt input"
            aria-describedby="prompt-help"
          />
          <div id="prompt-help" className="sr-only">
            Enter your prompt and get real-time scoring and suggestions for
            improvement
          </div>
        </div>

        <div className="button-row">
          {/* <button className="feature-button" disabled>
            Enable Autocomplete
          </button>
          <button className="feature-button" disabled>
            Templates
          </button>
          <button className="feature-button" disabled>
            History
          </button> */}
          <button
            onClick={handleGradePrompt}
            disabled={!localPrompt.trim() || isLoading}
            className="grade-button"
            aria-label="Get detailed suggestions for improving your prompt"
          >
            {isLoading ? "Grading..." : "Grade My Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default PromptInput;

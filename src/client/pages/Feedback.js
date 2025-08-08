import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import SuggestionsList from "../components/SuggestionsList";
import "../styles/Feedback.css";

function Feedback() {
  const { currentPrompt, suggestions, showSuggestions } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Check for session data and wait for context to load
  useEffect(() => {
    const checkSessionData = () => {
      const savedSession = localStorage.getItem("promptGraderSession");

      if (!savedSession) {
        navigate("/");
        return;
      }

      try {
        const parsedSession = JSON.parse(savedSession);
        const hasValidData =
          parsedSession.currentPrompt &&
          parsedSession.showSuggestions &&
          parsedSession.suggestions &&
          parsedSession.suggestions.length > 0;

        if (!hasValidData) {
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Failed to parse session data:", error);
        navigate("/");
        return;
      }

      // Give the context time to load the session data
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    };

    checkSessionData();
  }, [navigate]);

  // Final check once context has loaded
  useEffect(() => {
    if (!isLoading) {
      if (!currentPrompt || !showSuggestions || suggestions.length === 0) {
        // Give one more moment for async loading
        const timer = setTimeout(() => {
          if (!currentPrompt || !showSuggestions || suggestions.length === 0) {
            navigate("/");
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [currentPrompt, showSuggestions, suggestions.length, navigate, isLoading]);

  // Show loading state while checking for data
  if (isLoading) {
    return (
      <div className="feedback-container">
        <main className="feedback-content" role="main">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your feedback...</p>
          </div>
        </main>
      </div>
    );
  }

  // Don't render if no valid data
  if (!currentPrompt || !showSuggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="feedback-container">
      <main className="feedback-content" role="main">
        <SuggestionsList />
      </main>
    </div>
  );
}

export default Feedback;

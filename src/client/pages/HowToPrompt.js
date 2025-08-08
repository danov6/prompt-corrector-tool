import React from "react";
import { PERFECT_PROMPT_EXAMPLE, CRITERIA_DATA, QUICK_TIPS, ROUTES } from '../../shared/constants';
import "../styles/HowToPrompt.css";

/**
 * HowToPrompt component - Educational page showing prompt engineering best practices
 * @returns {React.ReactElement} The HowToPrompt page component
 */
function HowToPrompt() {
  const criteriaData = CRITERIA_DATA;
  const perfectPromptExample = PERFECT_PROMPT_EXAMPLE;

  return (
    <div className="how-to-prompt-container">
      <main className="how-to-prompt-content" role="main">
        <div className="page-header">
          <h1 className="page-title">How to Write Perfect Prompts</h1>
          <p className="page-description">
            Master the art of prompt engineering and achieve 100% scores with
            our comprehensive guide. Learn the 7 key criteria that make prompts
            effective and get better AI results.
          </p>
        </div>

        <div className="criteria-overview">
          <h2 className="section-title">Grading Criteria Overview</h2>
          <div className="criteria-grid">
            {criteriaData.map((criteria, index) => (
              <div key={index} className="criteria-card">
                <div className="criteria-header">
                  <span className="criteria-icon">{criteria.icon}</span>
                  <div className="criteria-title-group">
                    <h3 className="criteria-title">{criteria.category}</h3>
                    <span className="criteria-weight">{criteria.weight}</span>
                  </div>
                </div>
                <p className="criteria-description">{criteria.description}</p>

                <div className="criteria-tips">
                  <h4>How to Excel:</h4>
                  <ul>
                    {criteria.tips.map((tip, tipIndex) => (
                      <li key={tipIndex}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="criteria-examples">
                  <div className="example-bad">
                    <strong>❌ Poor Example:</strong>
                    <p>"{criteria.examples.bad}"</p>
                  </div>
                  <div className="example-good">
                    <strong>✅ Great Example:</strong>
                    <p>"{criteria.examples.good}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="perfect-prompt-section">
          <h2 className="section-title">Perfect Prompt Example (100% Score)</h2>
          <div className="perfect-prompt-card">
            <div className="prompt-example">
              <h3>The Perfect Prompt:</h3>
              <div className="prompt-text">"{perfectPromptExample.prompt}"</div>
              <div className="prompt-score">
                Score:{" "}
                <span className="score-highlight">
                  {perfectPromptExample.score}
                </span>
              </div>
            </div>

            <div className="score-breakdown">
              <h3>Why This Scores 100%:</h3>
              <div className="breakdown-grid">
                {Object.entries(perfectPromptExample.breakdown).map(
                  ([key, value]) => (
                    <div key={key} className="breakdown-item">
                      <strong>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </strong>
                      <span>{value}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="quick-tips-section">
          <h2 className="section-title">Quick Tips for 100% Scores</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <h3>🚀 Start Strong</h3>
              <p>
                Begin with "Act as [role]" or "You are [expert]" to immediately
                establish context and persona.
              </p>
            </div>
            <div className="tip-card">
              <h3>📊 Be Specific</h3>
              <p>
                Include exact word counts, formats, and style requirements.
                Specificity always beats vagueness.
              </p>
            </div>
            <div className="tip-card">
              <h3>🎯 Show Examples</h3>
              <p>
                Reference existing work, styles, or provide sample formats to
                clarify your expectations.
              </p>
            </div>
            <div className="tip-card">
              <h3>🔍 Add Context</h3>
              <p>
                Explain who the audience is, what the purpose is, and why you
                need this content.
              </p>
            </div>
          </div>
        </div>

        <div className="practice-section">
          <h2 className="section-title">Ready to Practice?</h2>
          <p className="practice-description">
            Now that you understand the criteria, head back to our prompt grader
            and start practicing! Try to incorporate all 7 elements for the
            highest scores.
          </p>
          <a href={ROUTES.HOME} className="practice-button">
            Start Practicing →
          </a>
        </div>
      </main>
    </div>
  );
}

export default HowToPrompt;

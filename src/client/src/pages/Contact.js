import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-container">
      <main className="contact-content" role="main">
        <div className="contact-header">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-description">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">📧</div>
            <h3>Email Us</h3>
            <p>Send us your questions or feedback</p>
            <a href="mailto:hello@promptgrader.com" className="contact-link">
              hello@promptgrader.com
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">💬</div>
            <h3>Feedback</h3>
            <p>Help us improve the tool</p>
            <a href="mailto:feedback@promptgrader.com" className="contact-link">
              feedback@promptgrader.com
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">🐛</div>
            <h3>Report Issues</h3>
            <p>Found a bug? Let us know</p>
            <a href="mailto:support@promptgrader.com" className="contact-link">
              support@promptgrader.com
            </a>
          </div>
        </div>

        <div className="contact-info">
          <h2>About Prompt Grader</h2>
          <p>
            Prompt Grader is designed to help users create more effective prompts for AI systems. 
            Our real-time grading system analyzes your prompts across multiple criteria including 
            clarity, specificity, context, and structure to provide actionable feedback.
          </p>
          <p>
            Whether you're new to AI prompting or looking to refine your skills, our tool provides 
            instant feedback and suggestions to help you get better results from AI systems.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Contact;
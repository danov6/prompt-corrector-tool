import React from "react";
import PromptInput from "../components/PromptInput";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <main className="main-content" role="main">
        <div className="welcome-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Perfect Your Prompts with
              <span className="gradient-text"> AI-Powered Grading</span>
            </h1>
            <p className="hero-description">
              Get real-time feedback and expert suggestions to create prompts
              that deliver exceptional results. Start typing below and watch
              your prompt score improve instantly.
            </p>
          </div>
          <PromptInput />
        </div>
      </main>
    </div>
  );
}

export default Home;

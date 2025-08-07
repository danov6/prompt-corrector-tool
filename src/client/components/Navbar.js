import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo" aria-label="Prompt Grader Home">
            <div className="logo-icon">PG</div>
            <span className="logo-text">Prompt Grader</span>
          </Link>
        </div>
        
        <div className="navbar-menu">
          <Link 
            to="/contact" 
            className="navbar-link"
            aria-label="Contact page"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer className="minimal-footer">
      <div className="footer-grid">
        <div className="footer-section">
          <h4><span className="section-title">About</span></h4>
          <ul>
            <li><span className="footer-link">Our Story</span></li>
            <li><span className="footer-link">Privacy Policy</span></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4><span className="section-title">Resources</span></h4>
          <ul>
            <li><span className="footer-link">Popular Posts</span></li>
            <li><span className="footer-link">Subscribe</span></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4><span className="section-title">Connect</span></h4>
          <ul>
            <li><span className="footer-link">Twitter</span></li>
            <li><span className="footer-link">Contact</span></li>
          </ul>
        </div>
      </div>
      <div className="newsletter-bar">
        <span className="newsletter-text">Join our newsletter:</span>
        <div className="newsletter-form">
          <input type="email" placeholder="Email address" aria-label="Email address" />
          <button><span>Subscribe</span></button>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; 2025 <span className="brand-name">The Blog Spot</span></p>
      </div>
    </footer>
  );
}

export default Footer;
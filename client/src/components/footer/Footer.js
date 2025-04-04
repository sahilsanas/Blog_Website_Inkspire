import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer className="desktop-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3><span className="heading-accent">About</span></h3>
          <ul>
            <li><span className="footer-link">Our Story</span></li>
            <li><span className="footer-link">Meet the Writers</span></li>
            <li><span className="footer-link">Editorial Policy</span></li>
            <li><span className="footer-link">Privacy Policy</span></li>
            <li><span className="footer-link">Terms of Use</span></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3><span className="heading-accent">Resources</span></h3>
          <ul>
            <li><span className="footer-link">Popular Posts</span></li>
            <li><span className="footer-link">Writing Guidelines</span></li>
            <li><span className="footer-link">Submit a Guest Post</span></li>
            <li><span className="footer-link">Subscribe</span></li>
            <li><span className="footer-link">Newsletter Archive</span></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3><span className="heading-accent">Connect</span></h3>
          <ul>
            <li><span className="footer-link">Twitter</span></li>
            <li><span className="footer-link">Instagram</span></li>
            <li><span className="footer-link">Pinterest</span></li>
            <li><span className="footer-link">RSS Feed</span></li>
            <li><span className="footer-link">Contact Us</span></li>
          </ul>
        </div>
      </div>
      <div className="newsletter-signup">
        <h3><span className="heading-accent">Join Our Newsletter</span></h3>
        <p>Get the latest posts delivered straight to your inbox</p>
        <div className="email-form">
          <input type="email" placeholder="Your email address" />
          <button><span>Subscribe</span></button>
        </div>
      </div>
      <div className="footer-info">
        <p>
          &copy; 2025 <span className="highlight">The Blog Spot</span> | Made By <a target="_blank"><span className="highlight">Backend Team</span></a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
import React, { useState, useEffect } from "react";
import Breaker from "../components/home/breaker/Breaker";
import Posts from "../components/home/post/Posts";
import Navbar from "../components/Navbar";
import Card from "../components/home/card/Card";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Footer from "../components/footer/Footer";
import "./HomePage.css";

function HomePage({ user, category }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mpost, setmpost] = useState(category);
  const [flag, setflag] = useState(false);
  
  const handleLoad = async () => {
    if (user === null || user === undefined) {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/login/success`, {
        method: "POST",
        credentials: "include",
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
      })
        .then((data) => {
          if (data.status === 201) return data.json();
          throw new Error("Authentication Failed!");
        })
        .then((data) => {
          dispatch({ type: "LOGIN", payload: data });
          Cookies.set("user", JSON.stringify(data), { expires: 15 });
          navigate("/");
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  };
  
  useEffect(() => {
    handleLoad();
    // Apply dark theme to body
    document.body.classList.add('dark-blue-theme-body');
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('dark-blue-theme-body');
    };
  }, []);
  
  return (
    <div className="HomePage dark-blue-theme">
      <Navbar user={user} />
      
      <div className="hero-section">
        <div className="hero-content">
          <h1>
            <span className="title-accent">Illuminate</span> 
            <span className="title-main"> the Discourse</span>
          </h1>
          <p>
            <span className="subtitle">Discover thought-provoking perspectives that challenge conventional wisdom</span>
          </p>
          <div className="hero-cta">
            <button className="primary-button">
              <span className="button-text">Explore Collection</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="content-wrapper">
        <section className="category-section">
          <Card setmpost={setmpost} setflag={setflag} flag={flag} mpost={mpost} />
        </section>
        
        <Breaker text={<span className="breaker-text">Curated Insights</span>} />
        
        <section className="posts-section">
          <Posts category={category} />
        </section>
      </div>
      
      <div className="subscribe-banner">
        <div className="subscribe-content">
          <h2><span className="subscribe-title">Join Our Community</span></h2>
          <p><span className="subscribe-text">Subscribe to receive thought-provoking content and exclusive insights directly to your inbox</span></p>
          <div className="subscribe-form">
            <input type="email" placeholder="Enter your email address" className="subscribe-input" />
            <button className="subscribe-button">
              <span className="button-text">Subscribe</span>
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default HomePage;
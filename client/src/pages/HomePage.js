import React, { useState, useEffect } from "react";
import Breaker from "../components/home/breaker/Breaker";
import Posts from "../components/home/post/Posts";
import Navbar from "../components/Navbar";
import Card from "../components/home/card/Card";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Footer from "../components/footer/Footer";
import "./HomePage.css"; // Make sure to create this CSS file

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
    document.body.classList.add('dark-theme-body');
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('dark-theme-body');
    };
  }, []);
  
  return (
    <div className="HomePage dark-theme">
      <Navbar user={user} />
      <div className="hero-section">
        <h1><span className="title-accent">Insights</span> <span className="title-main">& Perspectives</span></h1>
        <p><span className="subtitle">Exploring ideas that shape our world</span></p>
      </div>
      <div className="content-wrapper">
        <Card setmpost={setmpost} setflag={setflag} flag={flag} mpost={mpost} />
        <Breaker text={<span className="breaker-text">Featured Posts</span>} />
        <Posts category={category} />
      </div>
      <div className="subscribe-banner">
        <div className="subscribe-content">
          <h2><span className="subscribe-title">Stay Updated</span></h2>
          <p><span className="subscribe-text">Get the latest posts delivered to your inbox</span></p>
          <div className="subscribe-form">
            <input type="email" placeholder="Your email address" />
            <button><span className="button-text">Subscribe</span></button>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default HomePage;
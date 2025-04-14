import React from "react";
import "./card.css";
import { Parallax } from 'react-parallax';
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

function Card({ setmpost, setflag, flag, mpost }) {
  const view1 = useMediaQuery({ query: "(max-width: 564px)" });
  const navigate = useNavigate();
  const categories = ["all", "tech", "lifestyle", "food", "travelling"];

  const handleCategoryChange = (category) => {
    if (category === "all") {
      setmpost("all");
      setflag(false);
      navigate("/");
    } else {
      setmpost(category);
      setflag(true);
      navigate(`/topic/${category}`);
    }
  };

  // Get a background image based on the current category
  const getCategoryBackground = (category) => {
    const backgrounds = {
      all: "/blog-dark-blue-abstract.jpg",
      tech: "/tech-blog-background.jpg",
      lifestyle: "/lifestyle-blog-background.jpg",
      food: "/food-blog-background.jpg",
      travelling: "/travel-blog-background.jpg"
    };
    
    return backgrounds[category] || backgrounds.all;
  };

  return (
    <div className="intro_section">
      <div className="category-pill-container">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className={`category-pill ${category === mpost ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category === "all" ? "All Topics" : category.charAt(0).toUpperCase() + category.slice(1)}
          </div>
        ))}
      </div>
      
      <Parallax 
        className="parallax-img" 
        bgClassName="bgimg" 
        bgImage={getCategoryBackground(mpost)}
        bgImageAlt="Blog category background" 
        blur={0} 
        strength={200}
      >
        <div className="card-overlay">
          <div className="featured-badge">Featured</div>
          
          <h2 className="blog-title">
            {mpost === "all" ? "Discover Our Latest Stories" :
              `Explore ${mpost.charAt(0).toUpperCase() + mpost.slice(1)} Insights`}
          </h2>

          <h3 className="card-text">
            {view1
              ? "Thoughtfully curated content for curious minds."
              : "Dive into our collection of thoughtfully curated articles crafted to inspire, inform, and spark meaningful conversations. Join our community of passionate readers and writers."}
          </h3>
        </div>
      </Parallax>
    </div>
  );
}

export default Card;
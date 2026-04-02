import React from "react";
import Navbar from "../Navbar/MainNavbar";
import "./Hero.css";
import heroImage from "../../assets/hero-products.png";
import HomeProduct from "../../pages/HomeProduct/homeproduct";
function Hero() {
  return (
    
    <>
    <div className="home">
      <Navbar />

      <div className="hero">
        {/* LEFT */}
        <div className="hero-left">
          <h1>
            Welcome to <br />
            <span>HELLO MOBILES</span>
          </h1>

          <h3>The Future, in Your Hands.</h3>

          <p>
            Discover the latest mobiles, accessories, perfumes, toys, and gifts —
            all in one place with unbeatable quality and price.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">Explore Collections</button>
            <button className="btn-secondary">Visit Store</button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-right">
          <img src={heroImage} alt="products" />
        </div>
      </div>
      
    </div>
    <HomeProduct/>
    </>
  );
}

export default Hero;
import React from "react";
import Navbar from "../Navbar/MainNavbar";
import "./Hero.css";
import heroImage from "../../assets/hero-products.png";

function Hero() {
  return (
    <div className="home">
      <Navbar />

      <div className="hero">
        <div className="hero-left">
          <h1>
            Welcome to <br />
            <span>HELLO MOBILES</span>
          </h1>

          <h3>The Future, in Your Hands.</h3>

          <p>
            Explore mobiles, accessories, perfumes, toys, gifts and more all
            under one roof.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">Explore Our Collections</button>

            <button className="btn-primary">Visit Our Store</button>
          </div>
        </div>

        <div className="hero-right">
          <img src={heroImage} alt="products" />
        </div>
      </div>
    </div>
  );
}

export default Hero;

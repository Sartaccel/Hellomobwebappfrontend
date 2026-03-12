import React from "react";
import CategoryNav from "../../components/CategoryNav/CategoryNav";
import Deals from "../../components/Deals/Deals";
import TopCategories from "../../components/TopCategories/TopCategories";
import "./Home.css";
import Header from "../../components/Header/Header";

function Home() {
  return (
    <div className="home-page-container">
      <Header/>
      <CategoryNav />
      <Deals />
      <TopCategories />
      <div className="home-footer-space"></div>
    </div>
  );
}

export default Home;
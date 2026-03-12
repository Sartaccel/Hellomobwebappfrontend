import React from "react";
import "./TopCategories.css";
import { Link } from "react-router-dom";
import mobileImg from "../../assets/mobile.png";
import watchImg from "../../assets/watch.png";
import cosmeticImg from "../../assets/cosmetic.png";
import electronicsImg from "../../assets/electronics.png";
import toysImg from "../../assets/toys.png";
import decorImg from "../../assets/decor.png";


const categories = [
  {
    name: "Mobiles",
    path: "mobiles",
    image: mobileImg,
    alt: "Smartphone category showing mobile devices"
  },
  {
    name: "Watches",
    path: "watches",
    image: watchImg,
    alt: "Wrist watches category"
  },
  {
    name: "Cosmetics",
    path: "cosmetics",
    image: cosmeticImg,
    alt: "Cosmetics and beauty products category"
  },
  {
    name: "Electronics",
    path: "electronics",
    image: electronicsImg,
    alt: "Electronic gadgets category"
  },
  {
    name: "Toys",
    path: "toys",
    image: toysImg,
    alt: "Toys and gaming items category"
  },
  {
    name: "Decor",
    path: "decor",
    image: decorImg,
    alt: "Home decor items category"
  }
];

function TopCategories() {
  return (
    <section className="top-categories" id="top-categories">
      <div className="top-categories-container">

        {categories.map((cat) => (
          <Link
            key={cat.path}
            to={`/category/${cat.path}`}
            className="category-card"
          >
            <div className="category-circle">
              <img src={cat.image} alt={cat.alt} />
            </div>

            <p className="category-title">{cat.name}</p>
          </Link>
        ))}

      </div>
    </section>
  );
}

export default TopCategories;
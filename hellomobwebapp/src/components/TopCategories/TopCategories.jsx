import React, { useRef } from "react";
import "./TopCategories.css";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import mobileImg from "../../assets/mobile.png";
import watchImg from "../../assets/watch.png";
import cosmeticImg from "../../assets/cosmetic.png";
import electronicsImg from "../../assets/electronics.png";
import toysImg from "../../assets/toys.png";
import decorImg from "../../assets/decor.png";

const categories = [
  { name: "Mobiles", path: "mobiles", image: mobileImg },
  { name: "Watches", path: "watches", image: watchImg },
  { name: "Cosmetics", path: "cosmetics", image: cosmeticImg },
  { name: "Electronics", path: "electronics", image: electronicsImg },
  { name: "Toys", path: "toys", image: toysImg },
  { name: "Decor", path: "decor", image: decorImg },
  { name: "Gifts", path: "gifts", image: "https://picsum.photos/200?random=1" },
  { name: "Clocks", path: "clocks", image: "https://picsum.photos/200?random=2" },
  { name: "Speakers", path: "speakers", image: "https://picsum.photos/200?random=3" },
  { name: "Perfumes", path: "perfumes", image: "https://picsum.photos/200?random=4" },
  { name: "Sweets & Nuts", path: "sweets-nuts", image: "https://picsum.photos/200?random=5" }
];

function TopCategories() {

  const scrollRef = useRef();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth"
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth"
    });
  };

  return (
    <section className="top-categories" id="top-categories">

      <div className="top-categories-wrapper">

        <button className="arrow left" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>

        <div className="top-categories-container" ref={scrollRef}>
          {categories.map((cat) => (
            <Link key={cat.path} to={`/category/${cat.path}`} className="category-card">

              <div className="category-circle">
                <img src={cat.image} alt={cat.name} />
              </div>

              <p className="topcategory-title">{cat.name}</p>

            </Link>
          ))}
        </div>

        <button className="arrow right" onClick={scrollRight}>
          <FaChevronRight />
        </button>

      </div>

    </section>
  );
}

export default TopCategories;
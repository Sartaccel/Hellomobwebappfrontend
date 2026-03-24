import React, { useRef } from "react";
import "./TopCategories.css";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import mobileImg from "../../assets/mobile.png";
import sweetnutsImg  from "../../assets/nuts.png"
import speakerImg from "../../assets/speaker.png"
import cosmeticImg from "../../assets/cosmetic.png";
import electronicsImg from "../../assets/electronics.png";
import toysImg from "../../assets/toys.png";
// import decorImg from "../../assets/decor.png";
import cameraImg from "../../assets/camera.png"
import clockImg from "../../assets/clock.png"
import watchesImg from "../../assets/watch.png"
const categories = [
  { name: "Mobiles", path: "mobiles", image: mobileImg },
  { name: "Watches", path: "watches", image: watchesImg },
  { name: "Accessories", path: "ACCESSORIES",image:electronicsImg },
  { name: "Gifts", path: "GIFT",image:toysImg },
  { name: "Watches", path: "WATCHES",image:watchesImg},
  { name: "Clocks", path: "CLOCK",image:clockImg },
  { name: "Sweets nuts", path: "SWEET_NUTS",image:sweetnutsImg },
  { name: "Perfume", path: "PERFUME",image:cosmeticImg },
  { name: "Camera", path: "CAMERA", image:cameraImg},
  { name: "Speakers", path: "SPEAKER",image:speakerImg }
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
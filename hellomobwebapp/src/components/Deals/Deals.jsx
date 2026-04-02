import React, { useEffect, useState } from "react";
import "./Deals.css";
import Banner1 from "../../assets/banner1.png"
import Banner2 from "../../assets/banner2.png"

const images = [
  Banner1, Banner2,Banner1
];

function Deals() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000); // change every 3 sec

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div className="carousel-slide" key={index}>
            <img src={img} alt={`slide-${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Deals;
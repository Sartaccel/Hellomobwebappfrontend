import React from "react";
import "./CategoryNav.css";
import { Link } from "react-router-dom";

const categories = [
  { name: "Mobiles", path: "mobiles" },
  { name: "Accessories", path: "accessories" },
  { name: "Gifts", path: "gifts" },
  { name: "Watches", path: "watches" },
  { name: "Clocks", path: "clocks" },
  { name: "Sweets nuts", path: "sweets-nuts" },
  { name: "Prefume", path: "perfume" },
  { name: "Camera", path: "camera" },
  { name: "Speakers", path: "speakers" }
];

function CategoryNav() {
  return (
    <div className="category-nav">
      <div className="category-nav-container">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            to={`/category/${cat.path}`}
            className="category-item"
          >
            <span>{cat.name}</span>

            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="14px"
              width="14px"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryNav;
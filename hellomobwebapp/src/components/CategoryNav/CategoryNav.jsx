import React from "react";
import "./CategoryNav.css";
import { NavLink } from "react-router-dom";

const categories = [
  { name: "Show All", path: "all-products" },
  { name: "Mobiles", path: "MOBILES" },
  { name: "Accessories", path: "ACCESSORIES" },
  { name: "Gifts", path: "GIFT" },
  { name: "Watches", path: "WATCHES" },
  { name: "Clocks", path: "CLOCK" },
  { name: "Sweets nuts", path: "SWEET_NUTS" },
  { name: "Perfume", path: "PERFUME" },
  { name: "Camera", path: "CAMERA" },
  { name: "Speakers", path: "SPEAKER" }
];

function CategoryNav() {
  return (
    <div className="category-nav">

      {/* Desktop Menu */}
      <div className="category-nav-container desktop-menu">
        {categories.map((cat, idx) => (
          <NavLink
            key={idx}
            to={`/category/${cat.path}`}
            className={({ isActive }) =>
              isActive ? "category-item active" : "category-item"
            }
          >
            {cat.name}
          </NavLink>
        ))}
      </div>

      {/* Mobile Menu */}
      <div className="mobile-category">
        <h2 className="mobile-title">Categories</h2>

        <div className="mobile-chip-container">
          {categories.map((cat, idx) => (
            <NavLink
              key={idx}
              to={`/category/${cat.path}`}
              className={({ isActive }) =>
                isActive ? "mobile-chip active-chip" : "mobile-chip"
              }
            >
              {cat.name}
            </NavLink>
          ))}
        </div>
      </div>

    </div>
  );
}

export default CategoryNav;
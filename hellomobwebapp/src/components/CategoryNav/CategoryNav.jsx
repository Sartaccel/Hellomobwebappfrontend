import React from "react";
import "./CategoryNav.css";
import { NavLink } from "react-router-dom";

const categories = [
  { name: "Show All", path: "all-products" },
  { name: "Mobiles", path: "mobiles" },
  { name: "Accessories", path: "accessories" },
  { name: "Gifts", path: "gifts" },
  { name: "Watches", path: "watches" },
  { name: "Clocks", path: "clocks" },
  { name: "Sweets nuts", path: "sweets-nuts" },
  { name: "Perfume", path: "perfume" },
  { name: "Camera", path: "camera" },
  { name: "Speakers", path: "speakers" }
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
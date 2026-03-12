import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <span className="brand-text-top">Hello</span>
          <span className="brand-text-bottom">Futurestore</span>
        </Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About Us</Link>
        <Link to="/products" className="nav-link">Our Products</Link>
        <Link to="/contact" className="nav-link">Contact Us</Link>
      </div>
      
      <div className="navbar-auth">
        <div className="divider"></div>
        <Link to="/register" className="auth-link">
          <FaUserCircle size={24} />
          <span>Sign Up/Sign In</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

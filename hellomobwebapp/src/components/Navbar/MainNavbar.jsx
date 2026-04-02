import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { FiUser, FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <img src={logo} alt="Hello Mobiles Logo" className="brand-logo" />
        </Link>
      </div>

      {/* TOGGLE BUTTON */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </div>

      {/* NAV LINKS */}
      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/" className="nav-link">Our Products</Link>
        <Link to="/contact" className="nav-link">Contact Us</Link>

        {/* AUTH */}
        <div className="navbar-auth">
          <Link to="/register" className="auth-link">
            <FiUser size={16} />
            <span>Sign Up</span>
          </Link>

          <Link to="/login" className="auth-link">
            <FiLogIn size={16} />
            <span>Sign In</span>
          </Link>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
import { useState } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <img src={logo} alt="Hello Futurestore Logo" className="brand-logo" />
        </Link>
      </div>

      {/* Toggle Button */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={22}/> : <FaBars size={22}/>}
      </div>

      {/* Links */}
      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <Link to="/Home" className="nav-link">Home</Link>
        <Link to="/category/:category" className="nav-link">Our Products</Link>
        <Link to="/contact" className="nav-link">Contact Us</Link>

        <div className="navbar-auth">
          <Link to="/register" className="auth-link">
            <FaUserCircle size={22}/>
            <span>Sign Up / Sign In</span>
          </Link>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
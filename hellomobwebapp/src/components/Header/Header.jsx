import "./Header.css";
import {
  FaHeart,
  FaShoppingCart,
  FaHome,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
function Header() {
  // Example registered user
  const firstName = "Dharani";
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="header">
      <div className="header-container">
        {/* LOGO */}
        <div className="logo">
          <img src={logo} alt="Hello Futurestore Logo" />
        </div>

        {/* SEARCH */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>

        {/* DESKTOP MENU */}
        <div className="menu-right">
          <Link to="/home" className="icon">
            <FaHome />
            <span className="text">Home</span>
          </Link>

          <span className="divider">|</span>

          <Link to="/wishlist"className="icon">
            <FaHeart />
            <span className="text">Wishlist</span>
          </Link>

          <span className="divider">|</span>

          <Link to="/cart" className="icon">
            <FaShoppingCart />
            <span className="text">Cart</span>
          </Link>

          <span className="divider">|</span>

          <span className="profile-avatar">{initial}</span>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="mobile-nav">
        <div className="mobile-icon">
          <FaHome />
        </div>

        <div className="mobile-icon">
          <FaHeart />
        </div>

        <div className="mobile-icon">
          <FaShoppingCart />
        </div>

        <div className="mobile-icon profile-avatar">{initial}</div>
      </div>
    </div>
  );
}

export default Header;

import "./Header.css";
import {
  FaHeart,
  FaShoppingCart,
  FaHome,
  // FaSearch,
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../api/api";

function Header() {
  const navigate = useNavigate();

  // ✅ STATE
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ FETCH USER FROM BACKEND
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data.data); // ✅ IMPORTANT
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ PROFILE INITIAL
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="header">
      <div className="header-container">
        {/* LOGO */}
        <div className="logo">
          <img src={logo} alt="Hello Futurestore Logo" />
        </div>

        {/* SEARCH */}
        {/* <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div> */}

        {/* DESKTOP MENU */}
        <div className="menu-right">
          <Link to="/" className="icon">
            <FaHome />
            <span className="text">Home</span>
          </Link>

          <span className="divider">|</span>

          <Link to="/wishlist" className="icon">
            <FaHeart />
            <span className="text">Wishlist</span>
          </Link>

          <span className="divider">|</span>

          <Link to="/cart" className="icon">
            <FaShoppingCart />
            <span className="text">Cart</span>
          </Link>

          <span className="divider">|</span>

          {/* ✅ PROFILE */}
          <div className="profile-container">
            <span
              className="profile-avatar"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {initial}
            </span>

            {showDropdown && (
              <div className="dropdown">
                <p className="name">{user?.name || "Guest User"}</p>
                <p className="username">{user?.username || "email"}</p>

                <hr />

                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="mobile-nav">
        <Link to="/home" className="mobile-icon">
          <FaHome />
        </Link>

        <Link to="/wishlist" className="mobile-icon">
          <FaHeart />
        </Link>

        <Link to="/cart" className="mobile-icon">
          <FaShoppingCart />
        </Link>

        {/* MOBILE PROFILE */}
        <div
          className="mobile-icon profile-avatar"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {initial}
        </div>

        {showDropdown && (
          <div className="dropdown mobile-dropdown">
            <p className="name">{user?.name}</p>
            <p className="username">@{user?.username}</p>

            <hr />

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
import "./Header.css";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

function Header() {
  return (
    <div className="header">

      <div className="logo">
        Hello <br /> Futurestore
      </div>

      <input className="search" placeholder="Search" />

      <div className="menu-right">
        <span>Home</span>

        <span>|</span>

        <span className="icon">
          <FaHeart /> Wishlist
        </span>

        <span>|</span>

        <span className="icon">
          <FaShoppingCart /> Cart
        </span>
      </div>

    </div>
  );
}

export default Header;
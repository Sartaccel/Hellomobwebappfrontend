import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import CategoryNav from "../../components/CategoryNav/CategoryNav";
import Header from "../../components/Header/Header";
import "./Wishlist.css";

function Wishlist() {

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(saved);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const moveToCart = (product) => {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find((item) => item.id === product.id);

    if (!exists) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    removeFromWishlist(product.id);
  };

  return (
    <>
      <Header />
      <CategoryNav />

      <div className="wishlist-container">

        <h2 className="wishlist-title">My Wishlist</h2>

        {wishlist.length === 0 ? (
          <p className="no-products">No products in wishlist</p>
        ) : (

          <div className="wishlist-grid">

            {wishlist.map((product) => (

              <div key={product.id} className="wishlist-card">

                <div
                  className="wishlist-heart"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <FaHeart color="red" />
                </div>

                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="wishlist-image"
                />

                <div className="wishlist-info">
                  <h4>{product.name}</h4>
                  <p>{product.price}</p>
                </div>

                <button
                  className="move-cart-btn"
                  onClick={() => moveToCart(product)}
                >
                  Move to Cart
                </button>

              </div>

            ))}

          </div>

        )}

      </div>
    </>
  );
}

export default Wishlist;
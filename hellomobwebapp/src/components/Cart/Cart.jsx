import React, { useEffect, useState } from "react";
import "./Cart.css";
import Header from "../Header/Header";
import CategoryNav from "../CategoryNav/CategoryNav";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(data);
  }, []);

  // Remove item
  const handleRemove = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Increase quantity
  const increaseQty = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Decrease quantity
  const decreaseQty = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Total calculation
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
      <Header />
      <CategoryNav />

      <div className="cart-container">
        <h2 className="cart-title">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Cart is empty</p>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => (
                <div className="cart-card" key={item.id}>
                  
                  {/* IMAGE */}
                  <img
                    src={item.image || "https://via.placeholder.com/100"}
                    alt={item.name}
                    className="cart-img"
                  />

                  {/* DETAILS */}
                  <div className="cart-details">
                    <h4>{item.name}</h4>
                    <p className="price">₹{item.price}</p>

                    {/* QUANTITY */}
                    <div className="qty-control">
                      <button onClick={() => decreaseQty(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)}>+</button>
                    </div>

                    {/* REMOVE */}
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="cart-summary">
              <h3>Total: ₹{total}</h3>
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Cart;
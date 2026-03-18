import React, { useState } from "react";
import "./Cart.css";
import Header from "../Header/Header";
import CategoryNav from "../CategoryNav/CategoryNav";

const initialCart = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1500,
    qty: 1,
    image: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 2500,
    qty: 2,
    image: "https://via.placeholder.com/100",
  },
];

function Cart() {
  const [cartItems, setCartItems] = useState(
    initialCart.map((item) => ({ ...item, selected: true })),
  );

  const [savedItems, setSavedItems] = useState([]);

  // ✅ Toggle checkbox
  const toggleSelect = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  // ✅ Quantity
  const increaseQty = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item,
      ),
    );
  };

  // ✅ Remove
  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  // ✅ Save for later
  const saveForLater = (item) => {
    setCartItems((items) => items.filter((i) => i.id !== item.id));
    setSavedItems((prev) => [...prev, item]);
  };

  // ✅ Move back to cart
  const moveToCart = (item) => {
    setSavedItems((items) => items.filter((i) => i.id !== item.id));
    setCartItems((prev) => [...prev, { ...item, selected: true }]);
  };

  // ✅ Subtotal (only selected items)
  const subtotal = cartItems
    .filter((item) => item.selected)
    .reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <>
      <Header />
      <CategoryNav />

      <div className="cart-container">
        <h2 className="cart-title">Shopping Cart</h2>

        <div className="cart-main">
          {/* LEFT */}
          <div className="cart-left-section">
            {cartItems.map((item) => (
              <div className="cart-row" key={item.id}>
                {/* ✅ CHECKBOX */}
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelect(item.id)}
                />

                {/* IMAGE */}
                <div className="cart-img-box">
                  <img src={item.image} alt={item.name} />
                </div>

                {/* DETAILS */}
                <div className="cart-details">
                  <h4>{item.name}</h4>
                  <p className="stock">In stock</p>

                  <div className="cart-actions">
                    <div className="qty-box">
                      <button onClick={() => decreaseQty(item.id)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => increaseQty(item.id)}>+</button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="link-btn"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => saveForLater(item)}
                      className="link-btn"
                    >
                      Save for later
                    </button>
                  </div>
                </div>

                {/* PRICE */}
                <div className="cart-price">₹{item.price * item.qty}</div>
              </div>
            ))}

            {/* ✅ SAVED ITEMS */}
            {savedItems.length > 0 && (
              <div className="saved-section">
                <h3>Saved for later</h3>

                {savedItems.map((item) => (
                  <div className="cart-row" key={item.id}>
                    <div className="cart-img-box">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="cart-details">
                      <h4>{item.name}</h4>

                      <button
                        onClick={() => moveToCart(item)}
                        className="link-btn"
                      >
                        Move to cart
                      </button>
                    </div>

                    <div className="cart-price">₹{item.price}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="cart-summary-box">
            <p className="subtotal-text">
              Subtotal ({cartItems.length} items):{" "}
              <strong>₹{subtotal.toLocaleString()}</strong>
            </p>

            <button className="checkout-btn">Proceed to Buy</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;

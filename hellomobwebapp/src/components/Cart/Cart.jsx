import React, { useState, useEffect, useCallback } from "react";
import "./Cart.css";
import Header from "../Header/Header";
import CategoryNav from "../CategoryNav/CategoryNav";
import API from "../../api/api";

/* ─────────────────────────────────────────
   TOASTER
───────────────────────────────────────── */
function Toaster({ toasts, onRemove }) {
  return (
    <div className="toaster-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">
            {t.type === "success" && "✔"}
            {t.type === "error"   && "✖"}
            {t.type === "info"    && "ℹ"}
            {t.type === "warning" && "⚠"}
          </span>
          <span className="toast-message">{t.message}</span>
          <button className="toast-close" onClick={() => onRemove(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}

/* ─────────────────────────────────────────
   CART COMPONENT
───────────────────────────────────────── */
function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading]     = useState(true);

  const { toasts, showToast, removeToast } = useToast();

  const token = localStorage.getItem("token");

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ─── Fetch cart from backend ───────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!token) {
      showToast("Please login to view your cart", "warning");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await API.get("/cart", authHeaders);

      // Backend returns: [{ id, userId, productId, quantity }]
      // We need product details — fetch each product or rely on what's stored.
      // Enrich with product details from localStorage / ProductDetails navigation state,
      // or fetch individually if needed.
      const rawItems = res.data; // [{ id, userId, productId, quantity }]

      // Try to enrich: fetch product details for each cartItem
      const enriched = await Promise.all(
        rawItems.map(async (item) => {
          try {
            const pRes = await API.get(`/products/${item.productId}`);
            const product = pRes.data.data || pRes.data;
            return {
              cartId:    item.id,
              productId: item.productId,
              name:      product.productName  || "Product",
              price:     product.salesPrice   || 0,
              image:     product.imageUrl     || "https://via.placeholder.com/100",
              qty:       item.quantity,
              selected:  true,
            };
          } catch {
            // Fallback if product fetch fails
            return {
              cartId:    item.id,
              productId: item.productId,
              name:      `Product #${item.productId}`,
              price:     0,
              image:     "https://via.placeholder.com/100",
              qty:       item.quantity,
              selected:  true,
            };
          }
        })
      );

      setCartItems(enriched);
    } catch (err) {
      showToast("Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ─── Toggle checkbox (local only — no backend call needed) ────────────────
  const toggleSelect = (productId) => {
    setCartItems((items) =>
      items.map((item) =>
        item.productId === productId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // ─── Increase quantity ────────────────────────────────────────────────────
  const increaseQty = async (item) => {
    const newQty = item.qty + 1;
    try {
      await API.put(
        `/cart/update/${item.productId}?qty=${newQty}`,
        {},
        authHeaders
      );
      setCartItems((items) =>
        items.map((i) =>
          i.productId === item.productId ? { ...i, qty: newQty } : i
        )
      );
    } catch {
      showToast("Failed to update quantity", "error");
    }
  };

  // ─── Decrease quantity ────────────────────────────────────────────────────
  const decreaseQty = async (item) => {
    if (item.qty <= 1) return;
    const newQty = item.qty - 1;
    try {
      await API.put(
        `/cart/update/${item.productId}?qty=${newQty}`,
        {},
        authHeaders
      );
      setCartItems((items) =>
        items.map((i) =>
          i.productId === item.productId ? { ...i, qty: newQty } : i
        )
      );
    } catch {
      showToast("Failed to update quantity", "error");
    }
  };

  // ─── Remove item ──────────────────────────────────────────────────────────
  const removeItem = async (item) => {
    try {
      await API.delete(`/cart/remove/${item.productId}`, authHeaders);
      setCartItems((items) => items.filter((i) => i.productId !== item.productId));
      showToast("Item removed from cart", "info");
    } catch {
      showToast("Failed to remove item", "error");
    }
  };

  // ─── Save for later (remove from backend cart, keep locally in savedItems) ─
  const saveForLater = async (item) => {
    try {
      await API.delete(`/cart/remove/${item.productId}`, authHeaders);
      setCartItems((items) => items.filter((i) => i.productId !== item.productId));
      setSavedItems((prev) => [...prev, item]);
      showToast("Saved for later", "info");
    } catch {
      showToast("Failed to save for later", "error");
    }
  };

  // ─── Move saved item back to cart ─────────────────────────────────────────
  const moveToCart = async (item) => {
    try {
      await API.post(`/cart/add/${item.productId}`, {}, authHeaders);
      // Update quantity if it was more than 1
      if (item.qty > 1) {
        await API.put(
          `/cart/update/${item.productId}?qty=${item.qty}`,
          {},
          authHeaders
        );
      }
      setSavedItems((items) => items.filter((i) => i.productId !== item.productId));
      setCartItems((prev) => [...prev, { ...item, selected: true }]);
      showToast("Moved back to cart", "success");
    } catch {
      showToast("Failed to move to cart", "error");
    }
  };

  // ─── Subtotal (selected items only) ──────────────────────────────────────
  const subtotal = cartItems
    .filter((item) => item.selected)
    .reduce((acc, item) => acc + item.price * item.qty, 0);

  const selectedCount = cartItems.filter((i) => i.selected).length;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <Toaster toasts={toasts} onRemove={removeToast} />
      <Header />
      <CategoryNav />

      <div className="cart-container">
        <h2 className="cart-title">Shopping Cart</h2>

        {loading ? (
          <p className="cart-loading">Loading your cart...</p>
        ) : !token ? (
          <p className="cart-empty">Please login to view your cart.</p>
        ) : cartItems.length === 0 && savedItems.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <div className="cart-main">
            {/* LEFT */}
            <div className="cart-left-section">
              {cartItems.map((item) => (
                <div className="cart-row" key={item.productId}>
                  {/* CHECKBOX */}
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item.productId)}
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
                        <button onClick={() => decreaseQty(item)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => increaseQty(item)}>+</button>
                      </div>

                      <button
                        onClick={() => removeItem(item)}
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
                  <div className="cart-price">₹{(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}

              {/* SAVED ITEMS */}
              {savedItems.length > 0 && (
                <div className="saved-section">
                  <h3>Saved for later</h3>

                  {savedItems.map((item) => (
                    <div className="cart-row" key={item.productId}>
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

                      <div className="cart-price">₹{item.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Summary */}
            <div className="cart-summary-box">
              <p className="subtotal-text">
                Subtotal ({selectedCount} item{selectedCount !== 1 ? "s" : ""}):{" "}
                <strong>₹{subtotal.toLocaleString()}</strong>
              </p>
              <button className="checkout-btn">Proceed to Buy</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
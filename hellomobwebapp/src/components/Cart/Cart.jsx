import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

// ✅ Key for localStorage persistence
const SAVED_ITEMS_KEY = "cart_saved_items";

function Cart() {
  const [cartItems, setCartItems]   = useState([]);
  const [savedItems, setSavedItems] = useState(() => {
    // ✅ Load saved items from localStorage on first render
    try {
      const stored = localStorage.getItem(SAVED_ITEMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading]   = useState(true);
  const [ordering, setOrdering] = useState(false);

  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // ✅ Persist savedItems to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(savedItems));
    } catch {
      // storage full or unavailable
    }
  }, [savedItems]);

  // ─── Fetch cart from backend ─────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!token) {
      showToast("Please login to view your cart", "warning");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await API.get("/cart", authHeaders);
      const rawItems = res.data;

      const enriched = await Promise.all(
        rawItems.map(async (item) => {
          try {
            const pRes = await API.get(`/products/${item.productId}`);
            const product = pRes.data.data || pRes.data;
            return {
              cartId:    item.id,
              productId: item.productId,
              name:      product.productName  || "Product",
              price:     product.productPrice || 0,
              image:     product.imageUrl     || "https://via.placeholder.com/100",
              category:  product.productCategory || "",   // ✅ include category
              qty:       item.quantity,
              selected:  true,
            };
          } catch {
            return {
              cartId:    item.id,
              productId: item.productId,
              name:      `Product #${item.productId}`,
              price:     0,
              image:     "https://via.placeholder.com/100",
              category:  "",
              qty:       item.quantity,
              selected:  true,
            };
          }
        })
      );

      setCartItems(enriched);
    } catch {
      showToast("Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ─── Toggle checkbox ──────────────────────────────────────────────────────
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
      await API.put(`/cart/update/${item.productId}?qty=${newQty}`, {}, authHeaders);
      setCartItems((items) =>
        items.map((i) => i.productId === item.productId ? { ...i, qty: newQty } : i)
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
      await API.put(`/cart/update/${item.productId}?qty=${newQty}`, {}, authHeaders);
      setCartItems((items) =>
        items.map((i) => i.productId === item.productId ? { ...i, qty: newQty } : i)
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

  // ─── Save for later ───────────────────────────────────────────────────────
  const saveForLater = async (item) => {
    try {
      await API.delete(`/cart/remove/${item.productId}`, authHeaders);
      setCartItems((items) => items.filter((i) => i.productId !== item.productId));
      // ✅ Avoid duplicates in savedItems
      setSavedItems((prev) => {
        const exists = prev.find((i) => i.productId === item.productId);
        return exists ? prev : [...prev, item];
      });
      showToast("Saved for later", "info");
    } catch {
      showToast("Failed to save for later", "error");
    }
  };

  // ─── Move saved item back to cart ─────────────────────────────────────────
  const moveToCart = async (item) => {
    try {
      await API.post(`/cart/add/${item.productId}`, {}, authHeaders);
      if (item.qty > 1) {
        await API.put(`/cart/update/${item.productId}?qty=${item.qty}`, {}, authHeaders);
      }
      // ✅ Remove from localStorage-backed savedItems
      setSavedItems((items) => items.filter((i) => i.productId !== item.productId));
      setCartItems((prev) => [...prev, { ...item, selected: true }]);
      showToast("Moved back to cart", "success");
    } catch {
      showToast("Failed to move to cart", "error");
    }
  };

  // ─── Remove saved item permanently ───────────────────────────────────────
  const removeSavedItem = (item) => {
    setSavedItems((items) => items.filter((i) => i.productId !== item.productId));
    showToast("Removed from saved items", "info");
  };

  // ─── Proceed to Buy ───────────────────────────────────────────────────────
  const handleProceedToBuy = async () => {
    if (selectedCount === 0) {
      showToast("Please select at least one item", "warning");
      return;
    }

    try {
      setOrdering(true);

      const orderRes = await API.post("/order/create", {}, authHeaders);
      const order = orderRes.data;

      // ✅ Pass full selected items to Payment page for product name display
      const selectedItems = cartItems
        .filter((item) => item.selected)
        .map((item) => ({
          productId:    item.productId,
          name:         item.name,
          category:     item.category,
          price:        item.price,
          quantity:     item.qty,
          image:        item.image,
        }));

      navigate("/payment", {
        state: {
          orderId:   order.id,
          amount:    order.amount,
          itemCount: selectedCount,
          items:     selectedItems,   // ✅ Now Payment page can show product names
        },
      });

    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create order";
      showToast(msg, "error");
    } finally {
      setOrdering(false);
    }
  };

  // ─── Subtotal ─────────────────────────────────────────────────────────────
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

            {/* ── LEFT ── */}
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
                      <button onClick={() => removeItem(item)} className="link-btn">
                        Delete
                      </button>
                      <button onClick={() => saveForLater(item)} className="link-btn">
                        Save for later
                      </button>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="cart-price">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </div>
                </div>
              ))}

              {/* ── SAVED FOR LATER ── */}
              {savedItems.length > 0 && (
                <div className="saved-section">
                  <h3>Saved for later ({savedItems.length})</h3>

                  {savedItems.map((item) => (
                    <div className="cart-row" key={item.productId}>
                      <div className="cart-img-box">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="cart-details">
                        <h4>{item.name}</h4>
                        <p className="cart-price-small">
                          ₹{item.price.toLocaleString()}
                        </p>
                        <div className="cart-actions">
                          <button onClick={() => moveToCart(item)} className="link-btn">
                            Move to cart
                          </button>
                          {/* ✅ Remove saved item button */}
                          <button onClick={() => removeSavedItem(item)} className="link-btn">
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="cart-price">
                        ₹{item.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT — Summary ── */}
            <div className="cart-summary-box">
              <p className="subtotal-text">
                Subtotal ({selectedCount} item{selectedCount !== 1 ? "s" : ""}):{" "}
                <strong>₹{subtotal.toLocaleString()}</strong>
              </p>
              <button
                className="checkout-btn"
                onClick={handleProceedToBuy}
                disabled={ordering || selectedCount === 0}
              >
                {ordering ? "Creating Order..." : "Proceed to Buy"}
              </button>
            </div>

          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
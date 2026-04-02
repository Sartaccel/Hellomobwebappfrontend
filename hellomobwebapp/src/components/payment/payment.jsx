import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api/api";
import Header from "../Header/Header";
import "./payment.css";

/* ───────────── TOASTER ───────────── */
function Toaster({ toasts, onRemove }) {
  return (
    <div className="toaster-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">
            {t.type === "success" && "✔"}
            {t.type === "error"   && "✖"}
            {t.type === "warning" && "⚠"}
          </span>
          <span className="toast-message">{t.message}</span>
          <button onClick={() => onRemove(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, removeToast };
}

/* ───────────── PAYMENT PAGE ───────────── */
function Payment() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  // items shape from Cart:
  // { productId, name, category, quantity, price, image }
  const { orderId, amount, itemCount, items = [] } = location.state || {};
  const [paying, setPaying] = useState(false);

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // ─── Redirect if no order ─────────────────────────────────────────────────
  useEffect(() => {
    if (!orderId || !amount) navigate("/cart");
  }, [orderId, amount, navigate]);

  // ─── Computed values ──────────────────────────────────────────────────────
  // ✅ Total item count = sum of all quantities (not just number of products)
  const totalQty = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // ─── Load Razorpay script ─────────────────────────────────────────────────
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src     = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload  = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // ─── Pay Function ─────────────────────────────────────────────────────────
  const handlePayNow = async () => {
    if (paying) return;
    try {
      setPaying(true);

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        showToast("Failed to load payment gateway. Check your internet.", "error");
        setPaying(false);
        return;
      }

      const res = await API.post(
        `/payment/create-order?orderId=${orderId}`,
        {},
        authHeaders
      );

      const razorpayOrder = typeof res.data === "string"
        ? JSON.parse(res.data)
        : res.data;

      const options = {
        key:         process.env.REACT_APP_RAZORPAY_KEY,
        amount:      razorpayOrder.amount,
        currency:    "INR",
        order_id:    razorpayOrder.id,
        name:        "Hello Mobiles",
        description: `Order #${orderId}`,

        handler: async (response) => {
          try {
            await API.post(
              "/payment/verify",
              {
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              },
              authHeaders
            );

            showToast("Payment Successful! 🎉", "success");

            setTimeout(() => {
              navigate("/OrderSuccess", {
                state: {
                  orderId,
                  amount,
                  itemCount: totalQty,   // ✅ pass real qty count
                  items,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId:   response.razorpay_order_id,
                  status: "SUCCESS",
                },
              });
            }, 1500);

          } catch (err) {
            showToast(err.response?.data || "Payment verification failed", "error");
          }
        },

        prefill: {
          name:  localStorage.getItem("userName")  || "",
          email: localStorage.getItem("userEmail") || "",
        },

        theme: { color: "#f57224" },

        modal: {
          ondismiss: () => {
            showToast("Payment cancelled", "warning");
            setPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        showToast("Payment failed ❌", "error");
        setTimeout(() => {
          navigate("/order-success", {
            state: {
              orderId,
              amount,
              itemCount: totalQty,   // ✅ pass real qty count
              items,
              razorpayPaymentId: response.error?.metadata?.payment_id || "—",
              razorpayOrderId:   response.error?.metadata?.order_id   || "—",
              status: "FAILED",
            },
          });
        }, 1500);
      });

      rzp.open();

    } catch (err) {
      showToast(err.response?.data || "Failed to initiate payment", "error");
    } finally {
      setPaying(false);
    }
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <>
      <Toaster toasts={toasts} onRemove={removeToast} />
      <Header />

      <div className="payment-container">
        <div className="payment-card">

          <h2 className="payment-title">Order Summary</h2>

          {/* ── ORDER META ── */}
          <div className="payment-details">
            <div className="payment-row">
              <span>Order ID</span>
              <span>#{orderId}</span>
            </div>
            {/* ✅ Show real total quantity */}
            <div className="payment-row">
              <span>Total Items</span>
              <span>{totalQty} item{totalQty !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* ── ITEM BREAKDOWN ── */}
          {items.length > 0 && (
            <div className="payment-items-section">
              <h3 className="items-heading">Items in this Order</h3>

              <div className="payment-items-list">
                {items.map((item, index) => (
                  <div key={index} className="payment-item-row">

                    {/* ✅ Product image */}
                    {item.image && (
                      <div className="payment-item-img">
                        <img
                          src={item.image}
                          alt={item.name || item.productName || "Product"}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/60";
                          }}
                        />
                      </div>
                    )}

                    {/* ✅ Product name + category — mapped from Product entity */}
                    <div className="item-info"><span className="pname">Product Name:</span>
                      <span className="item-name">
                         {item.name || item.productName || "—"}
                      </span>
                      <span className="item-category">
                        {item.category || "—"}
                      </span>
                    </div>

                    {/* ✅ Qty × Price */}
                    <div className="item-qty-price">
                      <span className="item-qty">Qty: {item.quantity}</span>
                      <span className="item-price">
                         ₹ {Number(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                  </div>
                ))}
              </div>

              {/* ✅ Items subtotal line */}
              <div className="payment-items-subtotal">
                <span>{totalQty} item{totalQty !== 1 ? "s" : ""}</span>
                <strong>₹{Number(amount).toLocaleString()}</strong>
              </div>
            </div>
          )}

          {/* ── TOTAL ── */}
          <div className="payment-details">
            <div className="payment-row total">
              <span>Total Amount</span>
              <strong>₹{Number(amount).toLocaleString()}</strong>
            </div>
          </div>

          {/* ── PAYMENT METHODS ── */}
          <div className="payment-methods">
            <p>Pay securely via</p>
            <div className="payment-icons">
              <span>💳 Card</span>
              <span>📱 UPI</span>
              <span>🏦 Net Banking</span>
              <span>💰 Wallet</span>
            </div>
          </div>

          <button
            className="pay-btn"
            onClick={handlePayNow}
            disabled={paying}
          >
            {paying
              ? "Opening Payment..."
              : `Pay ₹${Number(amount).toLocaleString()}`}
          </button>

          <button
            className="back-btn"
            onClick={() => navigate("/cart")}
          >
            ← Back to Cart
          </button>

        </div>
      </div>
    </>
  );
}

export default Payment;
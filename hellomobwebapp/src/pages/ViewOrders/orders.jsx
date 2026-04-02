import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
// import Header from "../Header/Header";
import "./orders.css";

function Orders() {
  const navigate  = useNavigate();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [expanded, setExpanded] = useState(null); // which order is expanded

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // ─── Fetch all orders ─────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const res = await API.get("/order/my", authHeaders);
      // sort newest first
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    } catch (err) {
      setError("Failed to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const toggleExpand = (id) =>
    setExpanded((prev) => (prev === id ? null : id));

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day:   "2-digit",
      month: "short",
      year:  "numeric",
    });
  };

  const statusClass = (status) => {
    if (!status) return "badge-default";
    const s = status.toUpperCase();
    if (s === "PAID"    || s === "SUCCESS"   || s === "DELIVERED") return "badge-success";
    if (s === "PENDING" || s === "PROCESSING")                      return "badge-warning";
    if (s === "FAILED"  || s === "CANCELLED")                       return "badge-failure";
    return "badge-default";
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* <Header /> */}

      <div className="orders-container">

        {/* ── PAGE HEADER ── */}
        <div className="orders-page-header">
          <button className="orders-back-btn" onClick={() => navigate("/")}>
            ← Back
          </button>
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-subtitle">
              {orders.length > 0
                ? `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`
                : "Track all your purchases here"}
            </p>
          </div>
        </div>

        {/* ── STATES ── */}
        {loading && (
          <div className="orders-state-box">
            <div className="orders-spinner" />
            <p>Loading your orders...</p>
          </div>
        )}

        {!loading && error && (
          <div className="orders-state-box orders-error">
            <span className="orders-state-icon">⚠</span>
            <p>{error}</p>
            <button className="btn-retry" onClick={fetchOrders}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-state-box orders-empty">
            <span className="orders-state-icon">🛍</span>
            <h3>No orders yet</h3>
            <p>Looks like you haven't placed any orders.</p>
            <button
              className="btn-shop"
              onClick={() => navigate("/")}
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* ── ORDER CARDS ── */}
        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order, idx) => {
              const isOpen    = expanded === order.id;
              const items     = order.items || order.orderItems || [];
              const totalQty  = items.reduce((s, i) => s + (i.quantity || 1), 0);
              const payStatus = order.paymentStatus || order.status || "PENDING";

              return (
                <div
                  key={order.id}
                  className={`order-card ${isOpen ? "order-card--open" : ""}`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {/* ── CARD HEADER (always visible) ── */}
                  <div
                    className="order-card-header"
                    onClick={() => toggleExpand(order.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && toggleExpand(order.id)}
                  >
                    {/* Left: Order meta */}
                    <div className="order-meta">
                      <div className="order-id-row">
                        <span className="order-label">Order ID</span>
                        <span className="order-id-value">#{order.id}</span>
                      </div>
                      <div className="order-date-row">
                        <span className="order-label">Placed on</span>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Center: Item count + amount */}
                    <div className="order-summary-center">
                      <span className="order-item-count">
                        {totalQty} item{totalQty !== 1 ? "s" : ""}
                      </span>
                      <span className="order-amount">
                        ₹{Number(order.amount || order.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Right: Status badge + chevron */}
                    <div className="order-status-group">
                      <span className={`badge ${statusClass(payStatus)}`}>
                        {payStatus}
                      </span>
                      <span className={`order-chevron ${isOpen ? "open" : ""}`}>
                        ▾
                      </span>
                    </div>
                  </div>

                  {/* ── EXPANDED DETAILS ── */}
                  {isOpen && (
                    <div className="order-card-body">

                      {/* Items table */}
                      {items.length > 0 ? (
                        <div className="order-items-section">
                          <h4 className="order-section-title">🛒 Items</h4>
                          <div className="order-items-table">

                            <div className="order-items-header">
                              <span>Product ID</span>
                              <span>Product</span>
                              <span>Qty</span>
                              <span>Price</span>
                            </div>

                            {items.map((item, i) => (
                              <div key={i} className="order-item-row">
                                <span className="item-id">
                                  #{item.productId || i + 1}
                                </span>
                                <span className="item-name">
                                  {item.name || item.productName || `Product #${item.productId}`}
                                </span>
                                <span className="item-qty">×{item.quantity || 1}</span>
                                <span className="item-price">
                                  ₹{Number((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                </span>
                              </div>
                            ))}

                            <div className="order-items-total">
                              <span>Total</span>
                              <span></span>
                              <span></span>
                              <strong>
                                ₹{Number(order.amount || order.totalAmount || 0).toLocaleString()}
                              </strong>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="order-no-items">No item details available.</p>
                      )}

                      {/* Payment info */}
                      <div className="order-detail-grid">
                        <div className="order-detail-card">
                          <h4 className="order-section-title">💳 Payment</h4>
                          <div className="detail-row">
                            <span>Status</span>
                            <span className={`badge ${statusClass(payStatus)}`}>
                              {payStatus}
                            </span>
                          </div>
                          {order.razorpayPaymentId && (
                            <div className="detail-row">
                              <span>Payment ID</span>
                              <span className="mono">{order.razorpayPaymentId}</span>
                            </div>
                          )}
                          {order.razorpayOrderId && (
                            <div className="detail-row">
                              <span>Razorpay ID</span>
                              <span className="mono">{order.razorpayOrderId}</span>
                            </div>
                          )}
                        </div>

                        {/* Delivery info if available */}
                        {order.shippingAddress && (
                          <div className="order-detail-card">
                            <h4 className="order-section-title">📦 Delivery</h4>
                            <div className="detail-row">
                              <span>Address</span>
                              <span>{order.shippingAddress}</span>
                            </div>
                            {order.shippingCity && (
                              <div className="detail-row">
                                <span>City</span>
                                <span>{order.shippingCity}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </>
  );
}

export default Orders;
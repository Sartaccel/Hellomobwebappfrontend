import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../api/api";
import Header from "../Header/Header";
import "./OrderSuccess.css";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    orderId,
    amount,
    itemCount,
    items = [],
    razorpayPaymentId,
    razorpayOrderId,
    status,
  } = location.state || {};

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // ─── Guard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  // ─── Fetch contact / delivery details ────────────────────────────────────
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await API.get("/contact/my", authHeaders);
        setContacts(res.data);
      } catch {
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const primaryContact = contacts[0] || null;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <Header />

      <div className="success-container">

        {/* ── STATUS BANNER ── */}
        <div className={`status-banner ${status === "SUCCESS" ? "success" : "failure"}`}>
          <span className="status-icon">
            {status === "SUCCESS" ? "✔" : "✖"}
          </span>
          <div>
            <h2>{status === "SUCCESS" ? "Payment Successful!" : "Payment Failed"}</h2>
            <p>
              {status === "SUCCESS"
                ? "Your order has been placed successfully."
                : "Something went wrong with your payment."}
            </p>
          </div>
        </div>

        <div className="success-body">

          {/* ── ORDER DETAILS ── */}
          <div className="success-card">
            <h3 className="card-title">Order Details</h3>
            <div className="detail-row">
              <span>Order ID</span>
              <span>{orderId}</span>
            </div>
            <div className="detail-row">
              <span>Total Items</span>
              <span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
            </div>
            <div className="detail-row">
              <span>Total Amount</span>
              <strong>₹{Number(amount).toLocaleString()}</strong>
            </div>
            <div className="detail-row">
              <span>Order Status</span>
              <span className={`badge ${status === "SUCCESS" ? "badge-success" : "badge-failure"}`}>
                {status === "SUCCESS" ? "PAID" : "FAILED"}
              </span>
            </div>
          </div>

          {/* ── ITEMS ORDERED ── */}
          {items.length > 0 && (
            <div className="success-card">
              <h3 className="card-title">Items Ordered</h3>
              <div className="items-table">

                {/* ✅ 5-column header with Product ID */}
                <div className="items-table-header">
                  <span>Product ID</span>
                  <span>Product</span>
                  {/* <span>Category</span> */}
                  <span>Qty</span>
                  <span>Price</span>
                </div>

                {/* ✅ Table Rows */}
                {items.map((item, index) => (
                  <div key={index} className="items-table-row">

                    {/* ✅ Product ID */}
                    <span className="item-id">
                      {item.productId || index + 1}
                    </span>

                    {/* Product Name */}
                    <span className="item-name">
                      {item.name || item.productName || "—"}
                    </span>

                    {/* Category */}
                    {/* <span className="item-category-badge">
                      {item.category || item.productCategory || "—"}
                    </span> */}

                    {/* Qty */}
                    <span className="item-qty">×{item.quantity}</span>

                    {/* Price */}
                    <span className="item-price">
                      ₹{Number(item.price * item.quantity).toLocaleString()}
                    </span>

                  </div>
                ))}

                {/* ✅ Total Row — 5 columns */}
                <div className="items-table-total">
                  <span>Total</span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <strong>₹{Number(amount).toLocaleString()}</strong>
                </div>

              </div>
            </div>
          )}

          {/* ── PAYMENT DETAILS ── */}
          <div className="success-card">
            <h3 className="card-title">Payment Details</h3>
            <div className="detail-row">
              <span>Payment ID</span>
              <span className="mono">{razorpayPaymentId || "—"}</span>
            </div>
            <div className="detail-row">
              <span>Razorpay Order ID</span>
              <span className="mono">{razorpayOrderId || "—"}</span>
            </div>
            <div className="detail-row">
              <span>Payment Status</span>
              <span className={`badge ${status === "SUCCESS" ? "badge-success" : "badge-failure"}`}>
                {status || "—"}
              </span>
            </div>
          </div>

          {/* ── DELIVERY / SHIPPING ADDRESS ── */}
          <div className="success-card">
            <h3 className="card-title">Delivery Address</h3>
            {loading ? (
              <p className="loading-text">Loading delivery details...</p>
            ) : primaryContact ? (
              <>
                {/* Full Name */}
                <div className="detail-row">
                  <span>Name</span>
                  <span>
                    {[primaryContact.firstName, primaryContact.lastName]
                      .filter(Boolean)
                      .join(" ") || "—"}
                  </span>
                </div>

                {/* Phone */}
                <div className="detail-row">
                  <span>Phone</span>
                  <span>{primaryContact.phoneNumber || "—"}</span>
                </div>

                {/* Email */}
                <div className="detail-row">
                  <span>Email</span>
                  <span>{primaryContact.email || "—"}</span>
                </div>

                {/* Flat / House No */}
                {primaryContact.shippingFlatNo && (
                  <div className="detail-row">
                    <span>Flat / House No</span>
                    <span>{primaryContact.shippingFlatNo}</span>
                  </div>
                )}

                {/* Street Address */}
                <div className="detail-row">
                  <span>Address</span>
                  <span>{primaryContact.shippingAddress || "—"}</span>
                </div>

                {/* City */}
                {primaryContact.shippingCity && (
                  <div className="detail-row">
                    <span>City</span>
                    <span>{primaryContact.shippingCity}</span>
                  </div>
                )}

                {/* State */}
                {primaryContact.shippingState && (
                  <div className="detail-row">
                    <span>State</span>
                    <span>{primaryContact.shippingState}</span>
                  </div>
                )}

                {/* Postal Code */}
                {primaryContact.shippingPostalCode && (
                  <div className="detail-row">
                    <span>Pincode</span>
                    <span>{primaryContact.shippingPostalCode}</span>
                  </div>
                )}

                {/* Landmark */}
                {primaryContact.shippingLandmark && (
                  <div className="detail-row">
                    <span>Landmark</span>
                    <span>{primaryContact.shippingLandmark}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="no-contact">
                No delivery address found.{" "}
                <span
                  className="link"
                  onClick={() => navigate("/contact")}
                >
                  Add now
                </span>
              </p>
            )}
          </div>

        </div>

        {/* ── ACTIONS ── */}
        <div className="success-actions">
          <button
            className="btn-primary"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/orders")}
          >
            View My Orders
          </button>
        </div>

      </div>
    </>
  );
}

export default OrderSuccess;
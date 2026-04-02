import React, { useState, useEffect, useCallback } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CategoryNav from "../../components/CategoryNav/CategoryNav";
import Header from "../../components/Header/Header";
import API from "../../api/api";
import "./Wishlist.css";

/* ─────────────────────────────────────────
   TOASTER — identical to ProductDetails
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
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return { toasts, showToast, removeToast };
}

/* ─────────────────────────────────────────
   PRODUCT DETAIL MODAL
   — exact same layout as ProductDetails.jsx
───────────────────────────────────────── */
function ProductDetailModal({ product, onClose, onAddToCart, onRemove, isRemoving }) {
  const [mainImage, setMainImage]       = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews]           = useState([]);
  const [rating, setRating]             = useState(0);
  const [reviewText, setReviewText]     = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating]           = useState(0);
  const [editText, setEditText]               = useState("");
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  const { toasts, showToast, removeToast } = useToast();

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const getCurrentUserId = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload.userId || payload.sub || null;
    } catch { return null; }
  };
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    if (!product) return;
    setMainImage(product.imageUrl);
    setCurrentIndex(0);
    setReviews([]);
    setRating(0);
    setReviewText("");
    setEditingReviewId(null);
    setDeletingReviewId(null);
    fetchReviews();
  }, [product]);

  if (!product) return null;

  const thumbnails = [product.imageUrl, product.imageUrl, product.imageUrl];

  // ── Reviews ──────────────────────────────────────────────────────────────
  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${product.id}`);
      setReviews(res.data);
    } catch { /* silent */ }
  };

  const submitReview = async () => {
    if (!token)           { showToast("Please login to write a review", "warning"); return; }
    if (!rating)          { showToast("Please select a star rating",    "warning"); return; }
    if (!reviewText.trim()){ showToast("Review text cannot be empty",   "warning"); return; }
    try {
      await API.post(`/reviews?productId=${product.id}`, { rating, comment: reviewText }, authHeaders);
      setRating(0); setReviewText("");
      fetchReviews();
      showToast("Review submitted!", "success");
    } catch { showToast("Failed to submit review", "error"); }
  };

  const handleEditClick  = (r) => { setEditingReviewId(r.id); setEditRating(r.rating); setEditText(r.comment); };
  const cancelEdit       = ()  => setEditingReviewId(null);
  const handleDeleteClick = (r) => setDeletingReviewId(r.id);
  const cancelDelete     = ()  => setDeletingReviewId(null);

  const handleEditSubmit = async () => {
    if (!editText.trim()) { showToast("Review text cannot be empty", "warning"); return; }
    try {
      await API.put(`/reviews/${editingReviewId}?productId=${product.id}`, { rating: editRating, comment: editText }, authHeaders);
      setEditingReviewId(null);
      fetchReviews();
      showToast("Review updated!", "success");
    } catch { showToast("Failed to update review", "error"); }
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/reviews/${deletingReviewId}?productId=${product.id}`, authHeaders);
      setDeletingReviewId(null);
      fetchReviews();
      showToast("Review deleted.", "info");
    } catch { showToast("Failed to delete review", "error"); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* inner toaster for modal */}
      <Toaster toasts={toasts} onRemove={removeToast} />

      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* ✕ close */}
        <button className="modal-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        {/* ── mirrors .review-section ── */}
        <div className="modal-review-section">

          {/* ── mirrors .product-details-container ── */}
          <div className="modal-product-details-container">

            {/* LEFT */}
            <div className="product-left">
              {/* desktop gallery */}
              <div className="image-gallery desktop-gallery">
                <div className="thumbnails">
                  {thumbnails.map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setMainImage(img)} />
                  ))}
                </div>
                <div className="main-image">
                  <img src={mainImage} alt={product.productName} />
                </div>
              </div>

              {/* mobile slider */}
              <div className="mobile-slider">
                {thumbnails.map((img, i) => (
                  <img key={i} src={img} alt=""
                    className={i === currentIndex ? "slide active" : "slide"} />
                ))}
                <div className="dots">
                  {thumbnails.map((_, i) => (
                    <span key={i}
                      className={i === currentIndex ? "dot active-dot" : "dot"}
                      onClick={() => setCurrentIndex(i)} />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="product-right">
              <h2 className="product-title">{product.productName}</h2>

              <div className="rating">⭐⭐⭐⭐☆ <span>4.5</span></div>

              <h3 className="price">₹{product.productPrice?.toLocaleString()}</h3>

              <div className="description">
                <h4>Description</h4>
                <ul>
                  {product.description
                    ? product.description.split("\n").map((line, i) => <li key={i}>{line}</li>)
                    : <li>No description available</li>
                  }
                </ul>
              </div>

              {/* mirrors .buttons — Move to Cart + Remove */}
              <div className="buttons">
                <button
                  className="add-cart-btn"
                  disabled={isRemoving}
                  onClick={() => { onAddToCart(product); onClose(); }}
                >
                  🛒 Move to Cart
                </button>
                <button
                  className="buy-now-btn"
                  disabled={isRemoving}
                  onClick={() => { onRemove(product.id); onClose(); }}
                >
                   Remove
                </button>
              </div>
            </div>
          </div>

          {/* ── REVIEWS — identical to ProductDetails ── */}
          <div className="reviews-section">
            <h2>Customer Reviews</h2>

            {token && (
              <div className="review-form">
                <h3>Write a Review</h3>
                <div className="star-input">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} onClick={() => setRating(star)}
                      className={star <= rating ? "active-star" : ""}>★</span>
                  ))}
                </div>
                <textarea
                  placeholder="Write your review..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <button onClick={submitReview}>Submit Review</button>
              </div>
            )}

            <div className="review-list">
              {reviews.length === 0 && (
                <p className="no-reviews">No reviews yet. Be the first to review!</p>
              )}

              {reviews.map((review) => {
                const isOwner   = currentUserId && review.user?.id &&
                  String(review.user.id) === String(currentUserId);
                const isEditing  = editingReviewId  === review.id;
                const isDeleting = deletingReviewId === review.id;

                return (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <strong>{review.user?.firstName || "User"}</strong>
                      <div className="review-header-right">
                        <span className="review-date">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString("en-IN",
                                { day: "numeric", month: "short", year: "numeric" })
                            : ""}
                        </span>
                        {isOwner && !isEditing && !isDeleting && (
                          <div className="review-actions">
                            <button className="review-action-btn edit-btn"
                              onClick={() => handleEditClick(review)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                              Edit
                            </button>
                            <button className="review-action-btn delete-btn"
                              onClick={() => handleDeleteClick(review)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6M14 11v6"/>
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="review-edit-form">
                        <div className="star-input">
                          {[1,2,3,4,5].map((star) => (
                            <span key={star} onClick={() => setEditRating(star)}
                              className={star <= editRating ? "active-star" : ""}>★</span>
                          ))}
                        </div>
                        <textarea value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          placeholder="Update your review..." />
                        <div className="edit-form-actions">
                          <button className="review-action-btn save-btn" onClick={handleEditSubmit}>Save Changes</button>
                          <button className="review-action-btn cancel-btn" onClick={cancelEdit}>Cancel</button>
                        </div>
                      </div>
                    ) : isDeleting ? (
                      <div className="delete-confirm">
                        <p>Are you sure you want to delete this review?</p>
                        <div className="delete-confirm-actions">
                          <button className="review-action-btn confirm-delete-btn" onClick={confirmDelete}>Yes, Delete</button>
                          <button className="review-action-btn cancel-btn" onClick={cancelDelete}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="review-stars">
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </div>
                        <p>{review.comment}</p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   WISHLIST
───────────────────────────────────────── */
function Wishlist() {
  const [wishlist, setWishlist]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [removingIds, setRemovingIds]         = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { toasts, showToast, removeToast } = useToast();

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  /* ── Fetch + enrich ── */
  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/wishlist", authHeaders);
      const raw = res.data.data || [];
      const enriched = await Promise.all(
        raw.map(async (item) => {
          if (item.productName) return item;
          try {
            const pRes = await API.get(`/products/${item.productId || item.id}`);
            return { ...(pRes.data.data || pRes.data), wishlistId: item.id };
          } catch {
            return { ...item, productName: `Product #${item.productId}` };
          }
        })
      );
      setWishlist(enriched);
    } catch {
      showToast("Failed to load wishlist", "error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  /* ── Remove ── */
  const removeFromWishlist = useCallback(async (productId, e) => {
    e?.stopPropagation();
    if (removingIds.has(productId)) return;
    setRemovingIds((prev) => new Set(prev).add(productId));
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    try {
      await API.delete(`/wishlist/remove/${productId}`, authHeaders);
      showToast("Removed from wishlist", "info");
    } catch {
      showToast("Failed to remove", "error");
      fetchWishlist();
    } finally {
      setRemovingIds((prev) => { const n = new Set(prev); n.delete(productId); return n; });
    }
  }, [token, removingIds]);

  /* ── Move to cart ── */
  const moveToCart = useCallback(async (product, e) => {
    e?.stopPropagation();
    try {
      await API.post(`/cart/add/${product.id}`, {}, authHeaders);
      showToast("Moved to cart ✔", "success");
    } catch {
      showToast("Failed to add to cart", "error");
    }
    removeFromWishlist(product.id);
  }, [token]);

  const totalValue = wishlist.reduce((acc, p) => acc + (p.productPrice || 0), 0);

  return (
    <>
      <Toaster toasts={toasts} onRemove={removeToast} />
      <Header />
      <CategoryNav />

      <div className="category-container">

        <div className="wishlist-header-row">
          <h2 className="category-title" style={{ marginBottom: 0 }}>
            My Wishlist
          </h2>
          {wishlist.length > 0 && (
            <span className="wishlist-count">
              {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} · ₹{totalValue.toLocaleString()}
            </span>
          )}
        </div>

        {loading && <p className="no-products">Loading wishlist...</p>}

        {!loading && wishlist.length === 0 && (
          <p className="no-products">No products in your wishlist</p>
        )}

        {!loading && wishlist.length > 0 && (
          <div className="product-grid">
            {wishlist.map((product) => (
              <div
                className="product-card"
                key={product.id}
                onClick={() => setSelectedProduct(product)}
              >
                {/* ❤️ same as CategoryProduct */}
                <div
                  className="wishlist wishlisted"
                  onClick={(e) => removeFromWishlist(product.id, e)}
                >
                  {removingIds.has(product.id)
                    ? <FiHeart size={20} />
                    : <FaHeart color="red" size={20} />}
                </div>

                {/* Image */}
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="product-image"
                  onError={(e) => { e.target.style.opacity = "0.2"; }}
                />

                {/* Info */}
                <div className="product-info">
                  <h4>{product.productName}</h4>
                  <p>₹{product.productPrice?.toLocaleString()}</p>
                </div>

                {/* Move to cart */}
                <button
                  className="wishlist-move-btn"
                  disabled={removingIds.has(product.id)}
                  onClick={(e) => moveToCart(product, e)}
                >
                  {removingIds.has(product.id) ? "Moving..." : "Move to Cart"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full ProductDetails modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={moveToCart}
        onRemove={removeFromWishlist}
        isRemoving={selectedProduct && removingIds.has(selectedProduct.id)}
      />
    </>
  );
}

export default Wishlist;
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./ProductDetails.css";
import Header from "../../components/Header/Header";
import CategoryNav from "../../components/CategoryNav/CategoryNav";
import API from "../../api/api";

/* ─────────────────────────────────────────
   TOASTER — zero dependencies, self-contained
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
/* ───────────────────────────────────────── */

function ProductDetails() {
  const { state } = useLocation();
  const { id } = useParams();

  const [product, setProduct]           = useState(state || null);
  const [loading, setLoading]           = useState(!state);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews]           = useState([]);
  const [rating, setRating]             = useState(0);
  const [reviewText, setReviewText]     = useState("");
  const [mainImage, setMainImage]       = useState("");

  // Edit / delete state
  const [editingReviewId, setEditingReviewId]   = useState(null);
  const [editRating, setEditRating]             = useState(0);
  const [editText, setEditText]                 = useState("");
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  // Toast hook
  const { toasts, showToast, removeToast } = useToast();

  const token = localStorage.getItem("token");

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const getCurrentUserId = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload.userId || payload.sub || null;
    } catch {
      return null;
    }
  };
  const currentUserId = getCurrentUserId();

  // ─── Fetch product ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!product) {
      API.get(`/products/${id}`)
        .then((res) => {
          setProduct(res.data.data);
          setMainImage(res.data.data.imageUrl);
        })
        .catch(() => showToast("Failed to load product", "error"))
        .finally(() => setLoading(false));
    } else {
      setMainImage(product.imageUrl);
    }
  }, [id]);

  // ─── Fetch reviews ────────────────────────────────────────────────────────
  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch {
      showToast("Could not load reviews", "error");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // ─── Add to Cart (backend) ────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!token) {
      showToast("Please login to add items to cart", "warning");
      return;
    }
    try {
      await API.post(`/cart/add/${product.id}`, {}, authHeaders);
      showToast("Item added to cart!", "success");
    } catch {
      showToast("Failed to add to cart. Try again.", "error");
    }
  };

  // ─── Submit Review ────────────────────────────────────────────────────────
  const submitReview = async () => {
    if (!token) {
      showToast("Please login to write a review", "warning");
      return;
    }
    if (!rating) {
      showToast("Please select a star rating", "warning");
      return;
    }
    if (!reviewText.trim()) {
      showToast("Review text cannot be empty", "warning");
      return;
    }
    try {
      await API.post(
        `/reviews/${id}`,
        { rating, comment: reviewText },
        authHeaders
      );
      setRating(0);
      setReviewText("");
      fetchReviews();
      showToast("Review submitted successfully!", "success");
    } catch {
      showToast("Only one review.", "error");
    }
  };

  // ─── Open Edit Mode ───────────────────────────────────────────────────────
  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditText(review.comment);
  };

  // ─── Submit Edit (✅ Fixed — uses editingReviewId in URL) ─────────────────
  const handleEditSubmit = async () => {
    if (!editText.trim()) {
      showToast("Review text cannot be empty", "warning");
      return;
    }
    try {
      await API.put(
        `/reviews/${id}`,
        { rating: editRating, comment: editText },
        authHeaders
      );
      setEditingReviewId(null);
      fetchReviews();
      showToast("Review updated successfully!", "success");
    } catch {
      showToast("Failed to update review. Try again.", "error");
    }
  };

  // ─── Delete Review ────────────────────────────────────────────────────────
  const handleDeleteClick = (review) => setDeletingReviewId(review.id);

  // ─── Confirm Delete (✅ Fixed — uses deletingReviewId in URL) ─────────────
  const confirmDelete = async () => {
    try {
      await API.delete(`/reviews/${id}`, authHeaders);
      setDeletingReviewId(null);
      fetchReviews();
      showToast("Review deleted.", "info");
    } catch {
      showToast("Failed to delete review. Try again.", "error");
    }
  };

  const cancelDelete = () => setDeletingReviewId(null);
  const cancelEdit   = () => setEditingReviewId(null);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  const thumbnails = [product.imageUrl, product.imageUrl, product.imageUrl];

  return (
    <>
      {/* ── Global Toaster ── */}
      <Toaster toasts={toasts} onRemove={removeToast} />

      <Header />
      <CategoryNav />

      <div className="review-section">
        <div className="product-details-container">

          {/* LEFT */}
          <div className="product-left">
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

            <div className="mobile-slider">
              {thumbnails.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={i === currentIndex ? "slide active" : "slide"}
                />
              ))}
              <div className="dots">
                {thumbnails.map((_, i) => (
                  <span
                    key={i}
                    className={i === currentIndex ? "dot active-dot" : "dot"}
                    onClick={() => setCurrentIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="product-right">
            <h2 className="product-title">{product.productName}</h2>

            

            <h3 className="price">
  <span className="discount-price">₹{product.discountPrice}</span>
  ₹{product.productPrice}
</h3>

            <div className="description">
              <h4>Description</h4>
              <ul>
                {product.description ? (
                  product.description.split("\n").map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <li>No description available</li>
                )}
              </ul>
            </div>

            <div className="buttons">
              <button className="add-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              {/* <button className="buy-now-btn">Buy Now</button> */}
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>

          {/* REVIEW FORM */}
          {token && (
            <div className="review-form">
              <h3>Write a Review</h3>
              <div className="star-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={star <= rating ? "active-star" : ""}
                  >
                    ★
                  </span>
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

          {/* REVIEW LIST */}
          <div className="review-list">
            {reviews.length === 0 && (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            )}

            {reviews.map((review) => {
              const isOwner =
                currentUserId &&
                review.user?.id &&
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
                          ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                          : ""}
                      </span>

                      {isOwner && !isEditing && !isDeleting && (
                        <div className="review-actions">
                          <button
                            className="review-action-btn edit-btn"
                            onClick={() => handleEditClick(review)}
                            title="Edit review"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            
                          </button>
                          <button
                            className="review-action-btn delete-btn"
                            onClick={() => handleDeleteClick(review)}
                            title="Delete review"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                            
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* EDIT MODE */}
                  {isEditing ? (
                    <div className="review-edit-form">
                      <div className="star-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => setEditRating(star)}
                            className={star <= editRating ? "active-star" : ""}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder="Update your review..."
                      />
                      <div className="edit-form-actions">
                        <button className="review-action-btn save-btn" onClick={handleEditSubmit}>
                          Save Changes
                        </button>
                        <button className="review-action-btn cancel-btn" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>

                  ) : isDeleting ? (
                    <div className="delete-confirm">
                      <p>Are you sure you want to delete this review?</p>
                      <div className="delete-confirm-actions">
                        <button className="review-action-btn confirm-delete-btn" onClick={confirmDelete}>
                          Yes, Delete
                        </button>
                        <button className="review-action-btn cancel-btn" onClick={cancelDelete}>
                          Cancel
                        </button>
                      </div>
                    </div>

                  ) : (
                    <>
                      <div className="review-stars">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
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
    </>
  );
}

export default ProductDetails;
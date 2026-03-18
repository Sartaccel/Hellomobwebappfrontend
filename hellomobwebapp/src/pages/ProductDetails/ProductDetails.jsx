import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./ProductDetails.css";
import Header from "../../components/Header/Header";
import CategoryNav from "../../components/CategoryNav/CategoryNav";

/* Simulated backend reviews */

const initialReviews = [
  {
    id: 1,
    user: "Parth Mehta",
    rating: 5,
    text: "Good quality product",
    date: "27 January 2026",
    images: []
  },
  {
    id: 2,
    user: "Amin Pattani",
    rating: 4,
    text: "Very good phone overall.",
    date: "15 February 2026",
    images: []
  }
];

function ProductDetails() {
  //Add to cart
const handleAddToCart = () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    cart = cart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
cart.push({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.imageUrl || product.image, // ✅ FIX
  quantity: 1
});
  }
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Added to cart");
};


const [currentIndex, setCurrentIndex] = useState(0);
  const { state: product } = useLocation();

const [mainImage, setMainImage] = useState(
  product?.imageUrl || product?.image || ""
);
  const [reviews, setReviews] = useState(initialReviews);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState([]);

  if (!product) return <p>Product not found</p>;

  const img = product.imageUrl || product.image;

const thumbnails = [img, img, img];

  /* Submit review */

  const submitReview = () => {

    const newReview = {
      id: Date.now(),
      user: "Current User",
      rating,
      text: reviewText,
      date: new Date().toLocaleDateString(),
      images: images.map(file => URL.createObjectURL(file))
    };

    setReviews([newReview, ...reviews]);

    setRating(0);
    setReviewText("");
    setImages([]);
  };

  return (
    <>
      <Header />
      <CategoryNav />
   <div className="review-section">
      <div className="product-details-container">

        {/* LEFT SIDE */}

        <div className="product-left">

         {/* DESKTOP VIEW */}

<div className="image-gallery desktop-gallery">

  <div className="thumbnails">
    {thumbnails.map((img, i) => (
      <img
        key={i}
        src={img}
        alt=""
        onClick={() => setMainImage(img)}
      />
    ))}
  </div>

  <div className="main-image">
    <img src={mainImage} alt={product.name} />
  </div>

</div>


{/* MOBILE SLIDER */}

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

        {/* RIGHT SIDE */}

        <div className="product-right">

          <h2 className="product-title">{product.name}</h2>

          <div className="rating">
            ⭐⭐⭐⭐☆ <span>4.5</span>
          </div>

          <h3 className="price">{product.price}</h3>

          <div className="description">

            <h4>Description</h4>

            <ul>
              <li>Unibody design with durable aluminum frame</li>
              <li>Advanced camera system</li>
              <li>Powerful processor</li>
              <li>Long lasting battery</li>
            </ul>

          </div>

          <div className="buttons">

            <button className="add-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>

            <button className="buy-now-btn">
              Buy Now
            </button>

          </div>

        </div>

      </div>

      {/* REVIEWS SECTION */}

      <div className="reviews-section">

        <h2>Customer Reviews</h2>

        {/* ADD REVIEW FORM */}

        <div className="review-form">

          <h3>Write a Review</h3>

          <div className="star-input">
            {[1,2,3,4,5].map(star => (
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
            onChange={(e)=>setReviewText(e.target.value)}
          />

          <input
            type="file"
            multiple
            onChange={(e)=>setImages([...e.target.files])}
          />

          <button onClick={submitReview}>
            Submit Review
          </button>

        </div>

        {/* DISPLAY REVIEWS */}

        <div className="review-list">

          {reviews.map(review => (

            <div key={review.id} className="review-card">

              <div className="review-header">
                <strong>{review.user}</strong>
                <span>{review.date}</span>
              </div>

              <div className="review-stars">
                {"★".repeat(review.rating)}
                {"☆".repeat(5-review.rating)}
              </div>

              <p>{review.text}</p>

              {review.images.length > 0 && (
                <div className="review-images">
                  {review.images.map((img,i)=>(
                    <img key={i} src={img} alt="" />
                  ))}
                </div>
              )}

            </div>

          ))}

        </div>

      </div>
</div>
    </>
  );
}

export default ProductDetails;
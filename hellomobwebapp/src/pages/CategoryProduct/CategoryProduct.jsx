import React, { useEffect, useState } from "react";
import "./CategoryProduct.css";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import CategoryNav from "../../components/CategoryNav/CategoryNav";
import Header from "../../components/Header/Header";
import API from "../../api/api";
import { toast } from "react-toastify";

const CategoryProduct = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingWishlist, setLoadingWishlist] = useState(new Set());

  // 📦 Fetch products
  useEffect(() => {
    setLoading(true);
    setError(null);

    const url =
      category === "all-products"
        ? "/products/all"
        : `/products/category/${category.toUpperCase()}`;

    API.get(url)
      .then((res) => setProducts(res.data.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load products. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [category]);

  // ❤️ Fetch wishlist
  useEffect(() => {
    API.get("/wishlist")
      .then((res) => {
        const ids = new Set(res.data.data.map((item) => item.id));
        setWishlist(ids);
      })
      .catch((err) => console.error("Failed to load wishlist", err));
  }, []);

  // 🔁 Toggle wishlist
  const toggleWishlist = (productId, e) => {
    e.stopPropagation(); // 🚫 prevent navigation

    if (loadingWishlist.has(productId)) return;

    const isWishlisted = wishlist.has(productId);

    setLoadingWishlist((prev) => new Set(prev).add(productId));

    // Optimistic update
    setWishlist((prev) => {
      const updated = new Set(prev);
      isWishlisted ? updated.delete(productId) : updated.add(productId);
      return updated;
    });

    const request = isWishlisted
      ? API.delete(`/wishlist/remove/${productId}`)
      : API.post(`/wishlist/add/${productId}`);

    request
      .then(() => {
        toast.success(
          isWishlisted
            ? "Removed from wishlist"
            : "Added to wishlist"
        );
      })
      .catch((err) => {
        console.error(err);

        // revert
        setWishlist((prev) => {
          const reverted = new Set(prev);
          isWishlisted ? reverted.add(productId) : reverted.delete(productId);
          return reverted;
        });

        toast.error("Wishlist update failed");
      })
      .finally(() => {
        setLoadingWishlist((prev) => {
          const updated = new Set(prev);
          updated.delete(productId);
          return updated;
        });
      });
  };

  return (
    <>
      <Header />
      <CategoryNav />

      <div className="category-container">

        <h2 className="category-title">
          {category
            ?.split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </h2>

        {loading && <p className="status-message">Loading products...</p>}
        {error && <p className="status-message error">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="status-message">
            No products found in "{category}"
          </p>
        )}

        <div className="product-grid">
          {products.map((product) => (
            <div
              className="product-card"
              key={product.id}
              onClick={() =>
                navigate(`/product/${product.id}`, { state: product })
              }
            >

              {/* ❤️ Wishlist */}
              <div
                className={`wishlist ${
                  wishlist.has(product.id) ? "wishlisted" : ""
                }`}
                onClick={(e) => toggleWishlist(product.id, e)}
              >
                {wishlist.has(product.id) ? (
                  <FaHeart color="red" size={18} />
                ) : (
                  <FiHeart size={18} />
                )}
              </div>

              {/* 🖼 Image */}
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="product-image"
              />

              {/* 📦 Info */}
              <div className="product-info">
                <h4>{product.productName}</h4>
                <p>₹{product.productPrice}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoryProduct;
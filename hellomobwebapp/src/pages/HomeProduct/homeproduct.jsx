import React, { useState, useEffect } from "react";
import "./homeproduct.css";
import heroImage from "../../assets/cam-1.png";
import herowatch from "../../assets/wat-1.png";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { toast } from "react-toastify";

const tabs = ["All Products", "Wishlist", "Featured", "Top Selling"];

const getAuth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

function HomeProduct() {
  const [activeTab, setActiveTab] = useState("All Products");
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    API.get("/products/all")
      .then((res) => {
        const all = res.data.data || [];
        setProducts(all.slice(-10).reverse());
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    API.get("/wishlist", getAuth())
      .then((res) => {
        const data = res.data.data || [];
        setWishlist(new Set(data.map((item) => item.id)));
        setWishlistItems(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleWishlist = (productId, e) => {
    e.stopPropagation();
    const isWishlisted = wishlist.has(productId);
    setWishlist((prev) => {
      const updated = new Set(prev);
      isWishlisted ? updated.delete(productId) : updated.add(productId);
      return updated;
    });
    const request = isWishlisted
      ? API.delete(`/wishlist/remove/${productId}`, getAuth())
      : API.post(`/wishlist/add/${productId}`, {}, getAuth());
    request
      .then(() => toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist"))
      .catch(() => {
        setWishlist((prev) => {
          const reverted = new Set(prev);
          isWishlisted ? reverted.add(productId) : reverted.delete(productId);
          return reverted;
        });
        toast.error("Wishlist update failed");
      });
  };

  const moveToCart = async (productId, e) => {
    e.stopPropagation();
    try {
      await API.post(`/cart/add/${productId}`, {}, getAuth());
      toast.success("Added to cart ✔");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const getDisplayedProducts = () => {
    if (activeTab === "All Products") return products;
    if (activeTab === "Wishlist")     return wishlistItems;
    if (activeTab === "Featured")     return products.slice(0, 6);
    if (activeTab === "Top Selling")  return products.slice(0, 8);
    return products;
  };

  const displayed = getDisplayedProducts();

  return (
    <>
      {/* ── Offer Cards ── */}
      <div className="offer-container">
        <div className="offer-card">
          <div className="offer-text">
            <p className="small-text">Find The Best Camera for You!</p>
            <h2>Smart Camera</h2>
            <h1 className="offer"><span>20%</span> Off</h1>
          </div>
          <div className="offer-image">
            <img src={heroImage} alt="products" className="image-float" />
          </div>
        </div>

        <div className="offer-card">
          <div className="offer-text">
            <p className="small-text">Find The Best Watches for You!</p>
            <h2>Smart Watch</h2>
            <h1 className="offer"><span>20%</span> Off</h1>
          </div>
          <div className="offer-image">
            <img src={herowatch} alt="watch" className="image-float" />
          </div>
        </div>
      </div>

      {/* ── Products Section ── */}
      <div className="products-container">
        <div className="ps-header">
          <h2 className="section-title">Our Products</h2>
          <div className="ps-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`ps-tab${activeTab === tab ? " active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="hp-status">Loading products...</p>}
        {!loading && displayed.length === 0 && (
          <p className="hp-status">No products found.</p>
        )}

        {!loading && displayed.length > 0 && (
          <div className="products-grid">
            {displayed.map((product) => (
              <div
                className="product-box"
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`, { state: product })}
              >
                {/* Left content */}
                <div className="box-content">
                  <p className="category">{product.category || "Product"}</p>
                  <h3>{product.productName}</h3>
                  <div className="price">
                    <span className="old">₹{(product.discountPrice)?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    <span className="new">₹{product.productPrice?.toLocaleString()}</span>
                  </div>
                  

                  {/* Wishlist heart */}
                  <div
                    className={`hp-heart ${wishlist.has(product.id) ? "hp-heart--active" : ""}`}
                    onClick={(e) => toggleWishlist(product.id, e)}
                  >
                    {wishlist.has(product.id)
                      ? <FaHeart color="red" size={16} />
                      : <FiHeart size={16} />
                    }
                  </div>

                  {/* Tab-specific buttons */}
                  {(activeTab === "Featured" || activeTab === "Wishlist") && (
                    <button
                      className="hp-cart-btn"
                      onClick={(e) => moveToCart(product.id, e)}
                    >
                      🛒 {activeTab === "Wishlist" ? "Move to Cart" : "Add to Cart"}
                    </button>
                  )}
                </div>

                {/* Right image */}
                <div className="box-image">
                  {/* <img src={product.imageUrl} alt={product.productName} /> */}
                  <img src={herowatch} alt="hero"/>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default HomeProduct;
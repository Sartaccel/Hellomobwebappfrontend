import React, { useEffect, useState } from "react";
import "./CategoryProduct.css";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useParams } from "react-router-dom";
import CategoryNav from "../../components/CategoryNav/CategoryNav";
import Header from "../../components/Header/Header";

const dummyProducts = [
  {
    id: 1,
    name: "iPhone 17 Pro Max",
    price: "₹1,49,900",
    category: "mobiles",
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
  },
  {
    id: 2,
    name: "Samsung Galaxy S25 Ultra",
    price: "₹1,29,999",
    category: "mobiles",
    imageUrl:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300",
  },
  {
    id: 3,
    name: "Vivo Y20G",
    price: "₹12,300",
    category: "mobiles",
    imageUrl:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300",
  },
  {
    id: 4,
    name: "Apple Watch Ultra",
    price: "₹79,999",
    category: "watches",
    imageUrl:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=300",
  },
  {
    id: 5,
    name: "Noise Smart Watch",
    price: "₹3,999",
    category: "watches",
    imageUrl:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: "₹2,499",
    category: "speakers",
    imageUrl:
      "https://images.unsplash.com/photo-1585386959984-a415522316e2?w=300",
  },
];

const CategoryProduct = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  /* Load wishlist from localStorage */
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  /* Filter products based on category */
  useEffect(() => {
    if (category === "all-products") {
      setProducts(dummyProducts);
    } else {
      const filteredProducts = dummyProducts.filter(
        (product) => product.category === category
      );
      setProducts(filteredProducts);
    }
  }, [category]);

  /* Add / Remove Wishlist */
  const toggleWishlist = (product) => {
    const existing = JSON.parse(localStorage.getItem("wishlist")) || [];

    const alreadyAdded = existing.find((item) => item.id === product.id);

    let updatedWishlist;

    if (alreadyAdded) {
      updatedWishlist = existing.filter((item) => item.id !== product.id);
    } else {
      updatedWishlist = [...existing, product];
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
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

        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => {
              const isWishlisted = wishlist.some(
                (item) => item.id === product.id
              );

              return (
                <div className="product-card" key={product.id}>
                  <div
                    className="wishlist"
                    onClick={() => toggleWishlist(product)}
                  >
                    {isWishlisted ? (
                      <FaHeart color="red" />
                    ) : (
                      <FiHeart />
                    )}
                  </div>

                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                  />

                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p>{product.price}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="no-products">No products found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryProduct;
import React, { useEffect, useState } from "react";
import "./CategoryProduct.css";
import { FiHeart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import CategoryNav from "../../components/CategoryNav/CategoryNav";
import Header from "../../components/Header/Header";

const dummyProducts = [
  {
    id: 1,
    name: "iPhone 17 Pro Max",
    price: "₹1,49,900",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300"
  },
  {
    id: 2,
    name: "Samsung Galaxy S25 Ultra",
    price: "₹1,29,999",
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300"
  },
  {
    id: 3,
    name: "Vivo Y20G",
    price: "₹12,300",
    imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300"
  },
  {
    id: 4,
    name: "Oppo Reno 15 Pro",
    price: "₹59,999",
    imageUrl: "https://images.unsplash.com/photo-1605236453806-6ff36852898a?w=300"
  },
  {
    id: 5,
    name: "Nothing Phone Pro",
    price: "₹31,990",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351cb31b?w=300"
  },
  {
    id: 6,
    name: "Poco X7 Pro 5G",
    price: "₹21,999",
    imageUrl: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=300"
  }
];

const CategoryProduct = () => {

  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {

    // Temporary dummy data until backend is ready
    setProducts(dummyProducts);

  }, [category]);

  return (
      <>
    <Header />
    <CategoryNav />

    <div className="category-container">

      <div className="product-grid">

        {products.map((product) => (
          <div className="product-card" key={product.id}>

            <div className="wishlist">
              <FiHeart />
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
        ))}

      </div>

    </div>
        </>
  );
};

export default CategoryProduct;
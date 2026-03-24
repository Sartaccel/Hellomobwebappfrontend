import React, { useEffect, useState } from "react";
import "./Deals.css";

function Deals() {

  const [dealItems, setDealItems] = useState([]);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {

      const response = await fetch("http://localhost:8080/api/products/deals");

      const result = await response.json();

      console.log("API Response:", result);

      // If backend returns {status, message, data}
      if (result && Array.isArray(result.data)) {
        setDealItems(result.data);
      } else if (Array.isArray(result)) {
        // If backend returns array directly
        setDealItems(result);
      } else {
        setDealItems([]);
      }

    } catch (error) {
      console.error("Error fetching deals:", error);
      setDealItems([]);
    }
  };

  return (
    <div className="deals-section">
      <div className="deals-container">

        <div className="deals-header">
          <p>
            Grab the best deals on <span className="highlight-link">Smartphones</span>
          </p>
          <span className="view-all">View all &gt;</span>
        </div>

        <div className="deals-scroll-container">

          {dealItems.length > 0 ? (
            dealItems.map((item) => (
              <div key={item.id} className="deal-card">

                <div className="deal-image-container">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>

                <div className="deal-info">
                  <p className="deal-name">{item.name}</p>
                  <p className="deal-price">₹ {item.price}</p>
                </div>

              </div>
            ))
          ) : (
            <p className="no-deals">No deals available</p>
          )}

        </div>

        <div className="shop-top-link">
          <a href="#top-categories">Shop From Top Categories</a>
          <div className="link-underline"></div>
        </div>

      </div>
    </div>
  );
}

export default Deals;
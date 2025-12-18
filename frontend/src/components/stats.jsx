import React from "react";
import "../styles/stats.css";

function Stats() {
  return (
    <div className="stats-container">
      <h1>Platform Statistics</h1>
      {/* take a max of 5 shops */}
      <div className="shoplist">
        <div className="num_shops">Shops</div>
        <div className="products_available">Customers</div>
        <div className="average_savings"> Products</div>
        {/* <div className="customer_rating">from Db</div> */}
      </div>
    </div>
  );
}

export default Stats;
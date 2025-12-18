import React from "react";
import FeaturedShops from "./FeaturedShops";
import "../styles/shoplist.css";

function ShopList() {
  return (
    <div className="shoplist-container">
      {/* Display shops */}
      <FeaturedShops requireLogin={true} maxShops={5} />
    </div>
  );
}

export default ShopList;
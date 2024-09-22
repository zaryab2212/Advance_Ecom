import React, { useState } from "react";
import Product from "./Product";

const Products = () => {
  const dummyData = [
    {
      name: "Awesome Widget",
      price: 49.99,
      category: "Electronics",
      image: "https://via.placeholder.com/150/24f355", // Tech gadget
    },
    {
      name: "Cozy Blanket",
      price: 25.5,
      category: "Home",
      image: "https://via.placeholder.com/600/92c952", // Fluffy blanket
    },
    {
      name: "Supercharged Sneakers",
      price: 129.95,
      category: "Clothing",
      image: "https://via.placeholder.com/150/771796",
    },
  ];
  const [products, setProducts] = useState(dummyData);

  return (
    <div className="grid grid-cols-3 gap-3">
      {products.map((product) => (
        <Product product={product} />
      ))}
    </div>
  );
};

export default Products;

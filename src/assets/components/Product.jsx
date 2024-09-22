import React from "react";

const Product = ({ product }) => {
  return (
    <div className="m-auto">
      <>
        <img
          className="w-[16rem] h-[16rem] object-cover"
          src={product?.image}
          alt="Product Image"
        />
      </>
      <div>{product.name}</div>
      <div>${product.price}</div>
    </div>
  );
};

export default Product;

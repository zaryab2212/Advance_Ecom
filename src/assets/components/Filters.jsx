import React, { useEffect, useState } from "react";
import { dummyData } from "../../data/products";

const Filters = () => {
  const [inputVal, setinputVal] = useState("");
  const [data, setData] = useState(dummyData);
  const [category, setCategory] = useState(null);
  const [priceRange, setPriceRange] = useState(getMaxPrice(dummyData));

  useEffect(() => {
    let FilterData = [...dummyData];
    FilterData = FilterData.filter((data) =>
      data.name.toLowerCase().includes(inputVal.toLowerCase()) ? data : null
    );
    if (category)
      FilterData = FilterData.filter((cat) => cat.category === category);

    setData(FilterData);
  }, [inputVal, category]);

  //helper func for max price
  function getMaxPrice(arr) {
    let maxPrice = 0;
    arr.forEach((element) => {
      maxPrice = Math.max(maxPrice, element.price);
    });
    return Math.ceil(maxPrice);
  }

  //Price Range Function
  const handlePriceRange = (e) => {
    setPriceRange(e.target.value);
  };

  //open Filter Options

  return (
    <div className="flex justify-start align-top flex-col p-4 border-[1px] min-h-screen   rounded-3xl m-2 gap-4 bg-slate-200">
      {/* Search Feild */}
      <div>
        <input
          className="rounded-2xl p-3 w-full"
          type="text"
          onChange={(e) => setinputVal(e.target.value)}
          placeholder="Search here.."
        />
      </div>
      {/* Category */}
      <select
        className="rounded-2xl p-3 w-full"
        onChange={(e) => setCategory(e.target.value)}
      >
        {dummyData?.map((cat) => (
          <option value={cat.category}>{cat.category}</option>
        ))}
      </select>

      {/* price range */}
      <div className="flex flex-col justify-center ">
        <label>Price</label>
        <div className="flex justify-between align-baseline  ">
          <div className="mt-2">Min</div>
          <div className="font-semibold text-2xl">${priceRange} </div>
          <div className="mt-2">Max </div>
        </div>
        <input
          type="range"
          onChange={handlePriceRange}
          min={0}
          max={getMaxPrice(dummyData)}
        />
      </div>
    </div>
  );
};

export default Filters;

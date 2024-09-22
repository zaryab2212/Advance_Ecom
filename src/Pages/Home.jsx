import React, { useState } from "react";
import Products from "../assets/components/Products";
import Filters from "../assets/components/Filters";
import { FaBuffer } from "react-icons/fa";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex container align-center justify-center gap-3 relative">
      <FaBuffer
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-2xl bg-slate-200 text-4xl cursor-pointer fixed top-2 left-[8rem]"
      ></FaBuffer>

      {isOpen && (
        <div className="basis-[20%]  ">
          <Filters />
        </div>
      )}

      <div className="mt-3">
        <Products />
      </div>
    </div>
  );
};

export default Home;

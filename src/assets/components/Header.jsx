import React from "react";
import { FaHome, FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="text-[1.2rem]  m-auto align-middle bg-slate-200 w-[35%] rounded-3xl">
      <nav className="p-2 m-2 flex gap-10 justify-center align-middle ">
        <Link to="/">
          {" "}
          <FaHome className="cursor-pointer hover:translate-y-1 " />{" "}
        </Link>
        <FaSearch className="cursor-pointer hover:translate-y-1 " />
        <FaShoppingCart className="cursor-pointer hover:translate-y-1 " />

        <FaUser className="cursor-pointer hover:translate-y-1" />
      </nav>
    </div>
  );
};

export default Header;

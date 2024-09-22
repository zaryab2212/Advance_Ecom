import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./assets/components/Header";
import "./App.css";
import Home from "./Pages/Home";
import Login from "./Pages/Login";

const App = () => {
  return (
    <div className="">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/lo" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

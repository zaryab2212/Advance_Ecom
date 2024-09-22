import React, { useState } from "react";

const AuthForm = ({ type = "login" }) => {
  const [inputVal, setinputVal] = useState({
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    setinputVal({
      ...inputVal,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="text-[1.2rem]  text-gray-400 m-auto align-middle bg-slate-200 w-[35%] p-5  content-center rounded-3xl">
      <h2 className="text-center text-3xl m-4">
        {type === "login" ? "Login Here" : "Register Here"}
      </h2>
      <div className="flex justify-center align-middle flex-col gap-4">
        <input
          className="rounded-2xl p-3"
          type="email"
          placeholder="Type Your Email"
          name="email"
          value={inputVal.email}
          onChange={handleChange}
        />

        <input
          className="rounded-2xl p-3"
          type="password"
          placeholder="Type Your Password"
          name="password"
          value={inputVal.password}
          onChange={handleChange}
        />
        <button className=" bg-white rounded-2xl p-3">
          {type === "login" ? "Login" : "Register"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;

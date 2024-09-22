const express = require("express");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const discountRoute = require("./routes/discount");
const dashBoardRoute = require("./routes/dashBoard");
const { connection } = require("./DbConnection/Db");
require("dotenv").config;
const bodyParser = require("body-parser");
const { handleError } = require("./Middleware/ErrorHandler");
const NodeCache = require("node-cache");
const Stripe = require("stripe");

//Constants
const port = process.env.PORT || 8080;
const stripeKey = process.env.STRIPE_KEY || "";
exports.myCache = new NodeCache();
exports.stripe = Stripe(
  "sk_test_51Njf8DSEgSLCI1a7ELXN1EF0U72UotJDlmGnHo7WxKbyHM3PCFfp8qTyeJ5sr4YHdbP5gJE8Y5fw7Ae14uz9dO3900q1x8F8w2"
);

const server = express();

//Middlewares
server.use(express.json());
server.use(bodyParser.json());
server.use("/uploads", express.static("uploads"));

// Routes
server.use("/user", userRoute);
server.use("/product", productRoute);
server.use("/order", orderRoute);
server.use("/payment", discountRoute);
server.use("/dashboard", dashBoardRoute);

// Error Handling Middleware
server.use(handleError);

//DB Connection
connection();

server.listen(port, () => {
  console.log(`server is woking on port ${port}`);
});

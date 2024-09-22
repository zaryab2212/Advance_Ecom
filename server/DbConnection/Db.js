const mongoose = require("mongoose");

exports.connection = async (req, res) => {
  try {
    await mongoose.connect("mongodb://localhost:27017/AdvanceEcom");
    console.log("Data Base is Connected Succesfully and Ready to be use");
  } catch (error) {
    console.log("server connection error", error.message);
  }
};

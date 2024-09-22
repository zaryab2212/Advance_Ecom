const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const newError = require("../Utils/ErrorCls");
const { uid } = require("uid");

//Create User
exports.createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Please Enter all required feilds",
      });
    }

    const ifUser = await User.findOne({ email });

    //verify if user already exist
    if (ifUser) {
      return res.status(400).json({
        status: false,
        message: "This user already exist",
      });
    }
    console.log(ifUser);

    //Encrypt userEnterd password
    const hashedPass = await bcrypt.hash(password, process.env.SALT || 10);

    if (!hashedPass) {
      return res.status(400).json({
        status: false,
        message: "password Encryption Faild",
      });
    }
    // creating unique id
    let uniqueId = uid();
    //creating User
    const newUser = await User.create({
      ...req.body,
      id: uniqueId,
      password: hashedPass,
    });

    if (!newUser) {
      return res.status(400).json({
        status: false,
        message: "user is not created",
      });
    }
    console.log(newUser);

    res.status(201).json({
      status: true,
      message: "User Created Succesfully",
      newUser,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Internal Server Error Creating user",
      error: error.message,
    });
  }
};

//get all user data
exports.getAllUsers = async (req, res, next) => {
  try {
    //TODO need to check weather the checker is admin

    const users = await User.find();

    if (!users.length) {
      return next(new newError("No user is founed", 400));
    }

    res.status(201).json({
      status: true,
      message: "All users Data Fetched Successfully",
      users,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to fetch the data of all user",
      error: error.message,
    });
  }
};

//get Singe user data
exports.getSingleUser = async (req, res, next) => {
  try {
    //TODO need to check weather the checker is admin

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return next(new newError("No user is founed", 400));
    }

    res.status(201).json({
      status: true,
      message: "user Data Fetched Successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to fetch the data of Single user",
      error: error.message,
    });
  }
};

//Remove User
exports.removeUser = async (req, res, next) => {
  try {
    //TODO need to check weather the checker is admin

    const { id } = req.query;

    const user = await User.findById(id);

    if (!user) {
      return next(new newError("No user is founed", 400));
    }

    const dell = await User.findByIdAndDelete(id);

    res.status(201).json({
      status: true,
      message: "user removed Successfully",
      dell,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Unable to remove user user",
      error: error.message,
    });
  }
};

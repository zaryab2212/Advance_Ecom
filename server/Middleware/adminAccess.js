const { User } = require("../models/user");
const newError = require("../Utils/ErrorCls");

exports.verfiAdmin = async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(new newError("Incorrect User Id", 400));
  }

  const user = await User.findById(id);
  if (!user) {
    return next(new newError("User not Found", 400));
  }

  if (user.role !== "admin") {
    return next(
      new newError(
        "This is not an Amin Account please Login with Admin credentials first",
        400
      )
    );
  }

  next();
};

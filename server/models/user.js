const validator = require("validator");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "user name is requiredd"],
    },
    email: {
      type: String,
      required: [true, "user email is requiredd"],
      unique: [true, "user email should be unique"],
      validator: validator.default.isEmail, //=> true
    },
    image: String,

    id: {
      type: String,
      required: [true, "user email is requiredd"],
      unique: [true, "user Id should be unique"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: [true, "user role is requiredd"],
    },
    gender: {
      type: String,

      enum: ["male", "female", "transgender"],
      default: "male",
      required: [true, "user gender is requiredd"],
    },
    role: {
      type: String,

      enum: ["admin", "user"],
      default: "user",
      required: [true, "user role is requiredd"],
    },
    Dob: {
      type: Date,
      required: [true, "Dob is requierd"],
    },
  },
  { timestamps: true }
);

//virual Schema for creating age to be generated automatically
userSchema.virtual("age").get(function () {
  let today = new Date();
  let dob = this.Dob;

  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDay() < dob.getDay())
  ) {
    --age;
  }

  return age;
});

exports.User = mongoose.model("User", userSchema);

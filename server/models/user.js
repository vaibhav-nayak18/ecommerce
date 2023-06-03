import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: [true, "email already exist"],
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    enum: ["admin", "seller", "customer"],
    default: "customer",
  },

  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      numberOfItem: {
        type: Number,
        default: 1,
      },
    },
  ],

  address: [
    {
      "house number": {
        type: String,
        required: true,
      },

      "street number": {
        type: Number,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      district: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pin: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isValidPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.getToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.TOKEN_CODE,
    {
      expiresIn: process.env.TOKEN_TIME,
    }
  );
};

export default mongoose.model("User", userSchema);

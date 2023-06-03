import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  price: {
    type: Number,
    require: true,
  },

  stock: {
    type: Number,
    default: 1,
  },

  imageUrl: [
    {
      imageUrl: {
        type: String,
        // required: true,
      },
    },
  ],

  discount: {
    type: Number,
    default: 0,
  },

  description: {
    type: String,
    required: true,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      rating: {
        type: String,
        required: true,
      },

      review: {
        type: String,
      },
    },
  ],
});

export const Product = mongoose.model("Product", productSchema);

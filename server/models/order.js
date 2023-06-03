import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  productCount: {
    type: Number,
    default: 1,
  },

  orderDate: {
    type: Date,
    default: Date.now,
  },

  deliveredDate: {
    type: Date,
  },

  deliveredStatus: {
    type: String,
    required: true,
    enum: ["ordered", "dispatched", "delivered"],
    default: "ordered",
  },
});

export const Order = mongoose.model("Order", orderSchema);

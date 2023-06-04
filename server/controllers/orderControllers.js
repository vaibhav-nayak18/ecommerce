import { BigPromise } from "../middlewares/BigPromise.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";

export const placeOrder = BigPromise(async (req, res, next) => {
  const { productId, noOfItems } = req.body;

  if (!(productId && noOfItems)) {
    return next(new Error("product id or number of items are important"));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new Error("There is no product in this id"));
  }

  if (product.stock <= noOfItems) {
    return next(new Error("no enough item left"));
  }

  product.stock = product.stock - noOfItems;

  let order = await Order.create({
    user: req.user._id,
    product: productId,
    productCount: noOfItems,
  });

  order = await Order.findById(order._id).populate({ path: "product" });

  if (!order) {
    return next(new Error("order could not created"));
  }

  await product.save();

  res.status(201).json({
    success: true,
    order,
  });
});

export const cancelOrder = BigPromise(async (req, res, next) => {
  const { orderId } = req.body;

  if (!orderId) {
    return next(new Error("order id is required"));
  }

  let order = await Order.findById(orderId);

  if (!order) {
    return next(new Error("order does not exist"));
  }

  if (order.deliveredStatus === "delivered") {
    return next(new Error("already delivered"));
  }

  order = await Order.findByIdAndRemove(orderId);

  res.status(201).json({
    success: true,
    order,
  });
});

export const getAllOrder = BigPromise(async (req, res, next) => {
  const orders = await Order.find().where("user").equals(req.user._id);

  if (!orders) {
    return next(new Error("could not fetch the orders"));
  }

  res.status(201).json({
    orders,
  });
});

import { BigPromise } from "../middlewares/BigPromise.js";
import { Product } from "../models/product.js";

export const addProduct = BigPromise(async (req, res, next) => {
  const { name, price, stock, description } = req.body;
  if (!(name && price && description)) {
    return next(new Error("name, price or description is required"));
  }

  const product = await Product.create({
    name,
    price,
    description,
    stock: stock >= 0 ? stock : 1,
    seller: req.user._id,
  });

  if (!product) {
    return next(new Error("something went wrong. Try again"));
  }

  res.status(201).json({
    success: true,
    product,
  });
});

export const deleteProduct = BigPromise(async (req, res, next) => {
  const { productId } = req.body;

  if (!productId) {
    return next(new Error("product id is required."));
  }

  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    return next(new Error("something went wrong with database. try again"));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

export const getSingleProduct = BigPromise(async (req, res, next) => {
  const productId = req.params.id;
  if (!productId) {
    return next(new Error("product id is required"));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new Error("something went wrong with database.Try again"));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

export const getAllProduct = BigPromise(async (req, res, next) => {
  const products = await Product.find();
  console.log("products", products);
  if (!products) {
    return next(new Error("something went wrong with database.try again"));
  }

  res.status(200).json({
    products,
    success: true,
  });
});

export const mySellingProduct = BigPromise(async (req, res, next) => {
  const products = await Product.find({ seller: req.user._id });

  if (!products) {
    return next(new Error("could not fetch data"));
  }

  res.status(201).json({
    success: true,
    products,
  });
});

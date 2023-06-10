import { BigPromise } from "../middlewares/BigPromise.js";
import { Product } from "../models/product.js";
import { WhereClause } from "../utils/whereClause.js";

export const addProduct = BigPromise(async (req, res, next) => {
  const { name, price, stock, description } = req.body;
  if (!(name && price && description)) {
    return next(new Error("name, price or description is required"));
  }

  if (stock && stock <= 0) {
    return next(new Error("stock should be in positive"));
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
  const { resultPerPage } = req.body;

  const productObj = new WhereClause(Product.find(), req.query)
    .search()
    .filter();
  // console.log("productObj", productObj);
  let products = await productObj.base;
  // console.log("products", products);
  const filteredProductLength = products.length;

  productObj.pager(resultPerPage);
  products = await productObj.base.clone();
  // console.log("products", products);
  if (!products) {
    return next(new Error("could not fetch the products"));
  }
  res.status(201).json({
    success: true,
    products,
    filteredProductLength,
    resultPerPage,
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

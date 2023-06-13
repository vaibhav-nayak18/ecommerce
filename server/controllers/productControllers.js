import { BigPromise } from "../middlewares/BigPromise.js";
import { Product } from "../models/product.js";
import user from "../models/user.js";
import User from "../models/user.js";
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

export const addToCart = BigPromise(async (req, res, next) => {
  const { productId, noOfItems } = req.body;

  if (!(productId && noOfItems)) {
    return next(new Error("product id and no of items is required"));
  }

  if (noOfItems <= 0) {
    return next(new Error("no of items should be positive"));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new Error("could not fetch the user"));
  }

  let isPresent = false;
  const items = user.cart;
  for (let index = 0; index < items.length; index++) {
    if (items[index].product.equals(productId)) {
      isPresent = true;
      items[index].numberOfItem += noOfItems;
      break;
    }
  }

  if (!isPresent) {
    items.push({
      product: productId,
      numberOfItem: noOfItems,
    });
  }

  user.cart = items;

  await user.save();

  res.status(200).json({
    success: true,
    cartItems: user.cart,
  });
});

export const getCartItems = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new Error("could not fetch the database"));
  }

  res.status(200).json({
    success: true,
    cartItems: user.cart,
  });
});

export const removeCart = BigPromise(async (req, res, next) => {
  const { productId, noOfItems } = req.body;

  if (!(productId && noOfItems)) {
    return next(new Error("product id and no of items is required"));
  }

  if (noOfItems <= 0) {
    return next(new Error("no of items should be positive"));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new Error("could not fetch the user"));
  }

  let isPresent = false;
  const items = user.cart;
  for (let index = 0; index < items.length; index++) {
    if (items[index].product.equals(productId)) {
      isPresent = true;
      items[index].numberOfItem -= noOfItems;
      break;
    }
  }

  if (!isPresent) {
    return next(new Error("this product does not exist. try again"));
  }

  user.cart = items;

  await user.save();

  res.status(200).json({
    success: true,
    cartItems: user.cart,
  });
});

export const removeAllCart = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new Error("could not fetch the data."));
  }
  user.cart = [];
  await user.save();

  res.status(201).json({
    success: true,
  });
});

import express from "express";
import {
  addProduct,
  getAllProduct,
  deleteProduct,
  getSingleProduct,
  mySellingProduct,
  addToCart,
  getCartItems,
  removeCart,
  removeAllCart,
} from "../controllers/productControllers.js";
import { isLoggedIn, isSeller } from "../middlewares/userAuth.js";

const router = express.Router();

router.route("/add").post(isLoggedIn, isSeller, addProduct);
router.route("/remove").delete(isLoggedIn, isSeller, deleteProduct);
router.route("/my-products").get(isLoggedIn, isSeller, mySellingProduct);

router.route("/add-to-cart").post(isLoggedIn, addToCart);
router.route("/get-cart-items").get(isLoggedIn, getCartItems);
router.route("/delete-cart").delete(isLoggedIn, removeAllCart);
router.route("/delete-cart-item").delete(isLoggedIn, removeCart);

// always last
router.route("/:id").get(isLoggedIn, getSingleProduct);
router.route("/").get(isLoggedIn, getAllProduct);

export default router;

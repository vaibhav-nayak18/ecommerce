import express from "express";
import { isLoggedIn, isSeller } from "../middlewares/userAuth.js";
import { getAllOrder, placeOrder } from "../controllers/orderControllers.js";

export const orderRouter = express.Router();

orderRouter.route("/place").post(isLoggedIn, placeOrder);
orderRouter.route("/cancel").delete(isLoggedIn, placeOrder);
orderRouter.route("/user-orders").get(isLoggedIn, getAllOrder);

orderRouter.route("/selling").get(isLoggedIn, isSeller, getAllOrder);

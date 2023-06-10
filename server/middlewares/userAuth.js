import User from "../models/user.js";
import { BigPromise } from "./BigPromise.js";
import jwt from "jsonwebtoken";

export const isLoggedIn = BigPromise(async (req, res, next) => {
  let token = req.cookies.token;
  if (!token && req.header("Authorization")) {
    token = req.header("Authorization").replace("Bearer ", "");
  }

  if (!token) {
    return next(new Error("please login first"));
  }

  const decoded = jwt.verify(token, process.env.TOKEN_CODE);

  const user = await User.findById(decoded.id);
  user.password = undefined;

  if (!user) {
    return next(new Error("db error, could not find user, try again"));
  }
  req.user = user;

  return next();
});

export const isSeller = BigPromise(async (req, res, next) => {
  if (req.user?.role === "seller") {
    return next();
  }

  return next(new Error("access denied"));
});

export const isAdmin = BigPromise(async (req, res, next) => {
  if (req?.user.role === "admin") {
    return next();
  }

  return next(new Error("access denied"));
});

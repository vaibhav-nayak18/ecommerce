import { BigPromise } from "../middlewares/BigPromise.js";
import User from "../models/user.js";
import { cookieToken } from "../utils/cookieToken.js";
import { roleArray } from "../utils/util.js";

export const login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return next(new Error("email and password are required"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new Error("user does not exist"));
  }

  const isCorrectPassword = await user.isValidPassword(password);

  if (!isCorrectPassword) {
    return next(new Error("password is incorrect"));
  }

  cookieToken(user, res);
  next();
});

export const register = BigPromise(async (req, res, next) => {
  const { firstname, lastname, email, password, role } = req.body;

  if (!(firstname && lastname && email && password && role)) {
    return next(new Error("every field is required"));
  }

  const isRoleExist = roleArray.some((item) => item === role);
  if (!isRoleExist) {
    return next(new Error(`${role} is not exist.`));
  }

  let user = await User.findOne({ email });

  if (user) {
    return next(new Error("Email is already exist. Enter new email"));
  }

  user = await User.create({
    firstname,
    lastname,
    email,
    password,
    role,
  });

  if (!user) {
    return next(new Error("something went wrong. Try again"));
  }

  cookieToken(user, res);
  next();
});

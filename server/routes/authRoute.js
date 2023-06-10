import express from "express";
import {
  authenticate,
  login,
  logout,
  register,
} from "../controllers/authControllers.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/authenticate").get(authenticate);
router.route("/logout").get(logout);

export default router;

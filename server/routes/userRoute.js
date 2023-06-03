import express from "express";
import { isLoggedIn } from "../middlewares/userAuth.js";
import { userDetails } from "../controllers/userControllers.js";
const router = express.Router();

router.route("/user").get(isLoggedIn, userDetails);

export default router;

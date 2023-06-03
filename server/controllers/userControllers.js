import { BigPromise } from "../middlewares/BigPromise.js";
import User from "../models/user.js";
export const userDetails = BigPromise(async (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    return next(new Error("please login"));
  }
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new Error("something went wrong with database.try again"));
  }
  user.password = undefined;
  res.status(200).json({
    user,
  });
});

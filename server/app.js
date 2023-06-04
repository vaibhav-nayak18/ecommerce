import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// middleware

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// import routes
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import { orderRouter } from "./routes/orderRoutes.js";

// router middleware
app.use("/", authRoute);
app.use("/", userRoute);
app.use("/product", productRoute);
app.use("/order", orderRouter);

export default app;

import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDb } from "./config/database.js";

// connecting to db
connectDb();

app.listen(process.env.PORT, () => {
  console.log(`server is running on the port ${process.env.PORT}`);
});

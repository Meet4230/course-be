import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import deserializeUser from "./src/middlewares/deserializeUser.middleware.js";
import connectDB from "./src/db/index.js";
import userRouter from "./src/routes/user.routes.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(deserializeUser);

app.listen(process.env.PORT, async () => {
  console.log(`App is running at ${process.env.PORT}`);

  await connectDB();

  app.use("/api/v1/users", userRouter);
});

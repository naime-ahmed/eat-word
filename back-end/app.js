// external imports
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// Internal imports
import connectDb from "./database/db.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/common/errorHandler.js";
import adminRouter from "./router/adminRouter.js";
import authRouter from "./router/authRouter.js";
import milestonesRouter from "./router/milestonesRouter.js";
import testimonialRouter from './router/testimonialRouter.js';
import usersRouter from "./router/usersRouter.js";
import wordRouter from "./router/wordRouter.js";

const app = express();
dotenv.config();

// database connection
connectDb();

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// handle authentication
app.use("/auth", authRouter);

// handler users
app.use("/users", usersRouter);

// handle milestones request
app.use("/milestones", milestonesRouter);

// handle words request
app.use("/words", wordRouter);

// handle admin request
app.use("/admin", adminRouter);

// handle testimonial request
app.use("/testimonial", testimonialRouter);

app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Server is active",
  });
});

// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);
// app listener
app.listen(process.env.PORT, () => {
  console.log(`app listening to port ${process.env.PORT}`);
});

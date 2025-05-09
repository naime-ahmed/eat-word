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
import emailRouter from './router/emailRouter.js';
import generativeAIRouter from './router/generativeAIRouter.js';
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

// Trust Proxies
app.set("trust proxy", 1);

// Enable CORS for specific uris
app.use(
  cors({
    origin: ["http://localhost:5173", "https://eat-word.pages.dev", "https://eatword.com"],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Origin',
      'Cache-Control',
      'If-Modified-Since',
      'If-None-Match',
      'Accept-Language',
      'User-Agent',
      'Cookie',
      'X-CSRF-Token'
    ],
    exposedHeaders: [
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
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

// handle review request
app.use("/review", testimonialRouter);

// handle email service
app.use("/email", emailRouter);

// Generate Learning Materials
app.use("/generative", generativeAIRouter)

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

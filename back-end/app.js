// external imports
import dotenv from "dotenv";
import express from "express";

// Internal imports
import connectDb from './database/db.js';
import { errorHandler, notFoundHandler } from './middlewares/common/errorHandler.js';


const app = express();
dotenv.config();

// database connection
connectDb();

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) =>{
    res.send({
        success: true,
        message: "Server is active",
    })
})


// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler) 
// app listener
app.listen(process.env.PORT, () => {
    console.log(`app listening to port ${process.env.PORT}`);
  });
  
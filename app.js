// PreBuilt Module Import
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { log } = require("console");
const cookieParser = require("cookie-parser");

//Env file configuration
require("dotenv").config();

// Web App using express
const app = express();

// User-Defined Module Import
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const { checkAuthenticationCookie } = require("./middleware/authentication");
const blog = require("./model/blog");

// Middleware
app.use(cookieParser());
app.use(checkAuthenticationCookie);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded());

// Mongoose Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => {
    log("MongoDb is Successfully Connected");
  })
  .catch((e) => {
    log("Error is: ", e);
  });

// View Engine set
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));

// Routes
app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.get("/", async (req, res) => {
  const Blog = await blog.find({});
  res.render("home", { user: req.user, blogs: Blog });
});

// Server Listening
app.listen(process.env.PORT || 8000, () => log("Server started successfully"));

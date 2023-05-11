var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");

//routes
var indexRouter = require("./routes/index");

//globals
var config = require("./middleware/appConfig");
const publicDirectory = path.join(__dirname, "public");

//middleware for production
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowsMs: 1 * 60 * 1000,
  max: 60,
});

var app = express();

//middleware setup
app.use(compression());
app.use(helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }));
app.use(limiter);
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(publicDirectory);
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
app.use(connectLiveReload());

//setup mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

//setup env variables
require("dotenv").config();
const mongodb = process.env.MONGODB_URI;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongodb);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// middlware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(publicDirectory));

//global config
app.use(function (req, res, next) {
  config.setMainTitle(req);
  next();
});

//router
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

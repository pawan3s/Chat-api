const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const globalErrorHandler = require("./middleware/ErrorController");
const AppError = require("./utils/appError");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const cors = require("cors");
var favicon = require("serve-favicon");
var path = require("path");

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

//Data compression
app.use(compression());
//error handling
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
//sanitize
app.use(xss());
app.use(mongoSanitize());
app.use(helmet());

app.use(cors());

const homeRouter = require("./routes/homeRoutes");
const userRouter = require("./routes/userRoutes");

app.use("/", homeRouter);
app.use("/api/v1/users", userRouter);

//routes not found
app.all("*", (req, res, next) => {
  return next(new AppError(`Cant find ${req.originalUrl} on this server.`));
});

app.use(globalErrorHandler);

module.exports = app;

const express = require("express");
const ErrorHandler = require("./middleware/error");
const connectDatabase = require("./db/Database");
const app = express();
const swaggerDocs = require("./swagger/swagger");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const { connectRedis } = require('./utils/redisClient');
connectRedis();



require("dotenv").config({
  path: "config/.env",
});

// connect db
connectDatabase();

// create server
const server = app.listen(process.env.PORT, () => {
  const backendUrl = process.env.BACKEND_SERVER_URL || `http://localhost:${process.env.PORT}`;
  console.log(`Server is running on ${backendUrl}`);
});

// middlewares
app.use(express.json());
app.use(cookieParser());
// Enable CORS for all routes

app.use(
  cors({
    origin: ["http://localhost:3000","https://bookcon-amber.vercel.app"],
    credentials: true,
  })
);

app.use("/", express.static("uploads"));

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(helmet());

// routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const message = require("./controller/message");
const conversation = require("./controller/conversation");
const withdraw = require("./controller/withdraw");
app.use("/api/v2/withdraw", withdraw);

// end points
app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);

swaggerDocs(app);

// it'for errhendel
app.use(ErrorHandler);

// Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling UNCAUGHT EXCEPTION! 💥`);
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});

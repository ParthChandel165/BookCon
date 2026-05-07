require("dotenv").config({ path: "config/.env" });

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { connectRedis } = require('./utils/redisClient');
const ErrorHandler = require("./middleware/error");
const connectDatabase = require("./db/Database");
const swaggerDocs = require("./swagger/swagger");

// Validate required environment variables
["PORT", "DB_URL", "JWT_SECRET_KEY"].forEach(env => {
  if (!process.env[env]) throw new Error(`${env} environment variable is missing`);
});

// Connect to Redis and Database
connectRedis();
connectDatabase();

const app = express();

// Security: Set HTTP headers
app.use(helmet());

// Performance: Compress responses
app.use(compression());

// Security: Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Enable CORS for all routes
app.use(
  cors({
    origin: ["http://localhost:3000","https://bookcon-amber.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files with cache control
app.use("/uploads", express.static("uploads", {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0
}));

// Test endpoint
app.get("/test", (req, res) => {
  res.send("Hello World!");
});

// Main endpoint
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Import routes
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

// API routes
app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/withdraw", withdraw);

// Swagger docs (only in development)
if (process.env.NODE_ENV === 'development') {
  swaggerDocs(app);
}

// Enhanced error logging
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  next(err);
});

// Global error handler
app.use(ErrorHandler);

// Start server
const server = app.listen(process.env.PORT, () => {
  const backendUrl = process.env.BACKEND_SERVER_URL || `http://localhost:${process.env.PORT}`;
  console.log(`Server is running on ${backendUrl}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Graceful shutdown on SIGTERM/SIGINT
const gracefulShutdown = () => {
  server.close(async () => {
    if (global.mongoose) await global.mongoose.disconnect();
    // If using Redis: if (redisClient) await redisClient.quit();
    console.log('Server closed gracefully');
    process.exit(0);
  });
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Export for Vercel serverless
module.exports = app;

const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");
const csrf = require("csurf");
const morgan = require("morgan");

// CSRF Protection Middleware
const csrfProtection = csrf({ cookie: true });

// Logger
const logger = morgan("combined");

// Check if user is authenticated or not
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  logger(req, res, () => {});
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  next();
});

exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  logger(req, res, () => {});
  const { seller_token } = req.cookies;
  if (!seller_token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }
  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
  req.seller = await Shop.findById(decoded.id);
  next();
});

exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    logger(req, res, () => {});
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} can not access this resource!`, 403)
      );
    }
    next();
  };
};

// Export CSRF Protection Middleware
exports.csrfProtection = csrfProtection;


// Why this auth?
// This auth is for the user to login and get the token
// This token will be used to access the protected routes like create, update, delete, etc. (autharization)

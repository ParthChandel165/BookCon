const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const ChartJS = require("chart.js");

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Book product management
 */

/**
 * @swagger
 * /product/create-product:
 *   post:
 *     summary: Create a new book product
 *     tags: [Product]
 *     security:
 *       - sellerCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *               description:
 *                 type: string
 *                 description: Product description
 *               category:
 *                 type: string
 *                 description: Product category (genre)
 *               price:
 *                 type: number
 *                 description: Original price
 *               discountPrice:
 *                 type: number
 *                 description: Discounted price
 *               stock:
 *                 type: integer
 *                 description: Available quantity
 *               shopId:
 *                 type: string
 *                 description: ID of the shop creating this product
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Product images
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid shop ID or invalid data
 */

/**
 * @swagger
 * /product/get-all-products-shop/{id}:
 *   get:
 *     summary: Get all products of a specific shop
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /product/genre-chart/{id}:
 *   get:
 *     summary: Get genre distribution chart data for a shop
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Chart data for genre distribution
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 chartData:
 *                   type: object
 *                   properties:
 *                     labels:
 *                       type: array
 *                       items:
 *                         type: string
 *                     datasets:
 *                       type: array
 *                       items:
 *                         type: object
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

/**
 * @swagger
 * /product/admin-all-products:
 *   get:
 *     summary: Get all products (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 */

// create product
router.post(
    "/create-product",
    upload.none(),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const shopId = req.body.shopId;
            console.log(`Shop ID : ${shopId}`);
            const shop = await Shop.findById(shopId);
            console.log(`Shop : ${shop}`);
            if (!shop) {
                return next(new ErrorHandler("Shop Id is invalid!", 400));
            } else {
                let imageUrls = req.body.images;
                
                if (!imageUrls) {
                    imageUrls = [];
                } else if (typeof imageUrls === "string") {
                imageUrls = [imageUrls]; // single image case
                }

                const productData = req.body;
                productData.images = imageUrls;
                productData.shop = shop;

                const product = await Product.create(productData);

                res.status(201).json({
                    success: true,
                    product,
                });
            }
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// get all products of a shop
router.get(
    "/get-all-products-shop/:id",
    catchAsyncErrors(async (req, res, next) => {
        const shopId = req.params.id;

        try {
            const products = await Product.find({ shopId });

            res.status(200).json({
                success: true,
                products,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// get all products
router.get(
    "/get-all-products",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const products = await Product.find().sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                products,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// delete product of a shop
router.delete(
    "/delete-shop-product/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const productId = req.params.id;
            console.log("Attempting to delete product with ID:", productId); // Debug log
            const product = await Product.findByIdAndDelete(productId);

            if (!product) {
                return next(
                    new ErrorHandler("Product not found with this id!", 500)
                );
            }

            res.status(200).json({
                success: true,
                message: "Product Deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// review for a product
router.put(
    "/create-new-review",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { user, rating, comment, productId, orderId } = req.body;

            const product = await Product.findById(productId);

            const review = {
                user,
                rating,
                comment,
                productId,
            };

            const isReviewed = product.reviews.find(
                (rev) => rev.user._id === req.user._id
            );

            if (isReviewed) {
                product.reviews.forEach((rev) => {
                    if (rev.user._id === req.user._id) {
                        rev.rating = rating;
                        rev.comment = comment;
                        rev.user = user;
                    }
                });
            } else {
                product.reviews.push(review);
            }

            let avg = 0;

            product.reviews.forEach((rev) => {
                avg += rev.rating;
            });

            product.ratings = avg / product.reviews.length;

            await product.save({ validateBeforeSave: false });

            await Order.findByIdAndUpdate(
                orderId,
                { $set: { "cart.$[elem].isReviewed": true } },
                { arrayFilters: [{ "elem._id": productId }], new: true }
            );

            res.status(200).json({
                success: true,
                message: "Reviewed successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// all products --- for admin
router.get(
    "/admin-all-products",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const products = await Product.find().sort({
                createdAt: -1,
            });
            res.status(200).json({
                success: true,
                products,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// GET: Product creation trend for admin dashboard
router.get(
    "/admin-product-stats",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
      try {
        const hourlyTrend = await Product.aggregate([
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d-%H", // Safe, colon-free format
                  date: "$createdAt"
                }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } },
          { $limit: 50 } // Limit to most recent 50 data points for performance
        ]);
  
        console.log("Sending hourly trend data:", hourlyTrend); // Confirm data structure
  
        res.status(200).json({
          success: true,
          hourlyTrend // The frontend expects this exact property name
        });
      } catch (error) {
        console.error("Error in admin-product-stats:", error);
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );
  

// Route to generate a genre distribution chart
router.get(
    "/genre-chart/:id", // shopId will be passed in the URL
    catchAsyncErrors(async (req, res, next) => {
        const shopId = req.params.id;

        try {
            // Find products for this particular shop
            const products = await Product.find({ shopId });

            if (!products || products.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No products found for this shop.",
                });
            }

            const genreCount = products.reduce((acc, product) => {
                const genre = product.category; // Assuming 'category' is the genre field
                if (genre) {
                    acc[genre] = (acc[genre] || 0) + 1;
                }
                return acc;
            }, {});

            if (Object.keys(genreCount).length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No valid genre data found in the products.",
                });
            }

            const chartData = {
                labels: Object.keys(genreCount),
                datasets: [
                    {
                        label: "Product Genre Distribution",
                        data: Object.values(genreCount),
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            };

            res.status(200).json({
                success: true,
                chartData,
            });
        } catch (error) {
            console.error("Error generating genre chart:", error);
            return next(new ErrorHandler(error.message, 400));
        }
    })
);
module.exports = router;

const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Withdraw = require("../model/withdraw");
const sendMail = require("../utils/sendMail");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Withdraw
 *   description: Seller withdraw operations
 */

/**
 * @swagger
 * /withdraw/create-withdraw-request:
 *   post:
 *     summary: Create a new withdraw request
 *     tags: [Withdraw]
 *     security:
 *       - sellerCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to withdraw
 *     responses:
 *       201:
 *         description: Withdraw request created successfully
 *       500:
 *         description: Error creating withdraw request
 */

/**
 * @swagger
 * /withdraw/get-all-withdraw-request:
 *   get:
 *     summary: Get all withdraw requests (Admin only)
 *     tags: [Withdraw, Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: List of all withdraw requests
 *       400:
 *         description: Error in fetching withdraw requests
 */

/**
 * @swagger
 * /withdraw/get-all-withdraws:
 *   get:
 *     summary: Get all withdrawals for a seller
 *     tags: [Withdraw]
 *     security:
 *       - sellerCookieAuth: []
 *     responses:
 *       201:
 *         description: List of all withdrawals
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /withdraw/update-withdraw-request/{id}:
 *   put:
 *     summary: Update withdraw request status (Admin only)
 *     tags: [Withdraw, Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Withdraw request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Processing, Succeed, Rejected]
 *     responses:
 *       201:
 *         description: Withdraw request updated successfully
 */

/**
 * @swagger
 * /withdraw/delete-withdraw-request/{id}:
 *   delete:
 *     summary: Delete a withdraw request
 *     tags: [Withdraw]
 *     security:
 *       - sellerCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Withdraw request ID
 *     responses:
 *       201:
 *         description: Withdraw request deleted successfully
 *       400:
 *         description: Invalid withdraw ID
 */

// create withdraw request --- only for seller
router.post(
    "/create-withdraw-request",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { amount } = req.body;

            const data = {
                seller: req.seller,
                amount,
            };

            try {
                await sendMail({
                    email: req.seller.email,
                    subject: "Withdraw Request",
                    message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is processing. It will take 3days to 7days to processing! `,
                });
                res.status(201).json({
                    success: true,
                });
            } catch (error) {
                return next(new ErrorHandler(error.message, 500));
            }

            const withdraw = await Withdraw.create(data);

            const shop = await Shop.findById(req.seller._id);

            shop.availableBalance = shop.availableBalance - amount;

            await shop.save();

            res.status(201).json({
                success: true,
                withdraw,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// get all withdraws --- admnin

router.get(
    "/get-all-withdraw-request",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const withdraws = await Withdraw.find().sort({ createdAt: -1 });

            res.status(201).json({
                success: true,
                withdraws,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update withdraw request ---- admin
router.put(
    "/update-withdraw-request/:id",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { sellerId } = req.body;

            const withdraw = await Withdraw.findByIdAndUpdate(
                req.params.id,
                {
                    status: "succeed",
                    updatedAt: Date.now(),
                },
                { new: true }
            );

            const seller = await Shop.findById(sellerId);

            const transection = {
                _id: withdraw._id,
                amount: withdraw.amount,
                updatedAt: withdraw.updatedAt,
                status: withdraw.status,
            };

            seller.transections = [...seller.transections, transection];

            await seller.save();

            try {
                await sendMail({
                    email: seller.email,
                    subject: "Payment confirmation",
                    message: `Hello ${seller.name}, Your withdraw request of ₹${withdraw.amount} is on the way. Delivery time depends on your bank's rules it usually takes 3days to 7days.`,
                });
            } catch (error) {
                return next(new ErrorHandler(error.message, 500));
            }
            res.status(201).json({
                success: true,
                withdraw,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

module.exports = router;

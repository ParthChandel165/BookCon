const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const CoupounCode = require("../model/coupounCode");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Coupon
 *   description: Discount coupon operations
 */

/**
 * @swagger
 * /coupon/create-coupon-code:
 *   post:
 *     summary: Create a new coupon code
 *     tags: [Coupon]
 *     security:
 *       - sellerCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - value
 *               - shopId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Coupon code name (e.g., SUMMER2023)
 *               value:
 *                 type: number
 *                 description: Discount percentage value
 *               minAmount:
 *                 type: number
 *                 description: Minimum order amount to apply this coupon
 *               maxAmount:
 *                 type: number
 *                 description: Maximum order amount for coupon validity
 *               shopId:
 *                 type: string
 *                 description: ID of the shop creating the coupon
 *               selectedProducts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs of products the coupon applies to
 *     responses:
 *       201:
 *         description: Coupon code created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 coupounCode:
 *                   $ref: '#/components/schemas/Coupon'
 */

/**
 * @swagger
 * /coupon/get-coupon/{id}:
 *   get:
 *     summary: Get all coupons of a shop
 *     tags: [Coupon]
 *     security:
 *       - sellerCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       201:
 *         description: List of coupon codes
 */

/**
 * @swagger
 * /coupon/delete-coupon/{id}:
 *   delete:
 *     summary: Delete a coupon code
 *     tags: [Coupon]
 *     security:
 *       - sellerCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       201:
 *         description: Coupon code deleted successfully
 */

/**
 * @swagger
 * /coupon/get-coupon-value/{name}:
 *   get:
 *     summary: Get coupon details by name
 *     tags: [Coupon]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon name
 *     responses:
 *       200:
 *         description: Coupon details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 couponCode:
 *                   $ref: '#/components/schemas/Coupon'
 */

// create coupoun code
router.post(
    "/create-coupon-code",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const isCoupounCodeExists = await CoupounCode.find({
                name: req.body.name,
            });

            if (isCoupounCodeExists.length !== 0) {
                return next(
                    new ErrorHandler("Coupoun code already exists!", 400)
                );
            }

            const coupounCode = await CoupounCode.create(req.body);

            res.status(201).json({
                success: true,
                coupounCode,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// get all coupons of a shop
router.get(
    "/get-coupon/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const couponCodes = await CoupounCode.find({
                shopId: req.seller.id,
            });
            res.status(201).json({
                success: true,
                couponCodes,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// delete coupoun code of a shop
router.delete(
    "/delete-coupon/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const couponCode = await CoupounCode.findByIdAndDelete(
                req.params.id
            );

            if (!couponCode) {
                return next(
                    new ErrorHandler("Coupon code dosen't exists!", 400)
                );
            }
            res.status(201).json({
                success: true,
                message: "Coupon code deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// get coupon code value by its name
router.get(
    "/get-coupon-value/:name",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const couponCode = await CoupounCode.findOne({
                name: req.params.name,
            });

            res.status(200).json({
                success: true,
                couponCode,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

module.exports = router;

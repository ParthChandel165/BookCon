const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const Event = require("../model/event");
const Order = require("../model/order");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const fs = require("fs");

/**
 * @swagger
 * tags:
 *   name: Event
 *   description: Book events and promotions
 */

/**
 * @swagger
 * /event/create-event:
 *   post:
 *     summary: Create a new book event
 *     tags: [Event]
 *     security:
 *       - sellerCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - start_Date
 *               - Finish_Date
 *               - discountPrice
 *               - stock
 *               - shopId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Event name
 *               description:
 *                 type: string
 *                 description: Event description
 *               category:
 *                 type: string
 *                 description: Book category or genre
 *               start_Date:
 *                 type: string
 *                 format: date
 *                 description: Event start date
 *               Finish_Date:
 *                 type: string
 *                 format: date
 *                 description: Event end date
 *               tags:
 *                 type: string
 *                 description: Related tags
 *               originalPrice:
 *                 type: number
 *                 description: Original price before discount
 *               discountPrice:
 *                 type: number
 *                 description: Discounted event price
 *               stock:
 *                 type: integer
 *                 description: Available quantity for this event
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Event book images
 *               shopId:
 *                 type: string
 *                 description: ID of the shop creating this event
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid shop ID or data
 */

/**
 * @swagger
 * /event/get-all-events:
 *   get:
 *     summary: Get all events
 *     tags: [Event]
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */

/**
 * @swagger
 * /event/get-all-events/{id}:
 *   get:
 *     summary: Get all events of a shop
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: List of events for a shop
 */

/**
 * @swagger
 * /event/delete-shop-event/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Event]
 *     security:
 *       - sellerCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       400:
 *         description: Invalid event ID
 */

/**
 * @swagger
 * /event/create-new-review-event:
 *   put:
 *     summary: Create or update a review for an event
 *     tags: [Event]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - rating
 *               - comment
 *               - productId
 *               - orderId
 *             properties:
 *               user:
 *                 type: object
 *                 description: User information
 *               rating:
 *                 type: number
 *                 description: Rating value (1-5)
 *               comment:
 *                 type: string
 *                 description: Review comment
 *               productId:
 *                 type: string
 *                 description: Event ID
 *               orderId:
 *                 type: string
 *                 description: Order ID
 *     responses:
 *       200:
 *         description: Review added successfully
 *       400:
 *         description: Error in adding review
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

/**
 * @swagger
 * /event/admin-all-events:
 *   get:
 *     summary: Get all events (Admin only)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: List of all events
 */

// create event
router.post(
    "/create-event",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const shopId = req.body.shopId;
            console.log(`Shop ID : ${shopId}`);
            const shop = await Shop.findById(shopId);
            console.log(`Shop : ${shop}`);
    
            if (!shop) {
            return next(new ErrorHandler("Shop ID is invalid!", 400));
            }
    
            const eventData = {
            ...req.body,
            images: req.body.images,
            shop: shop,
            };
    
            const product = await Event.create(eventData);
    
            res.status(201).json({
            success: true,
            product,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
        })
    );

// get all events
router.get("/get-all-events", async (req, res, next) => {
    try {
        const events = await Event.find();
        res.status(201).json({
            success: true,
            events,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});

// get all events of a shop
router.get(
    "/get-all-events/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const events = await Event.find({ shopId: req.params.id });

            res.status(201).json({
                success: true,
                events,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// delete event of a shop
router.delete(
    "/delete-shop-event/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const productId = req.params.id;

            const eventData = await Event.findById(productId);

            eventData.images.forEach((imageUrl) => {
                const filename = imageUrl;
                const filePath = `uploads/${filename}`;

                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            });

            const event = await Event.findByIdAndDelete(productId);

            if (!event) {
                return next(
                    new ErrorHandler("Event not found with this id!", 500)
                );
            }

            res.status(201).json({
                success: true,
                message: "Event Deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// all events --- for admin
router.get(
    "/admin-all-events",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const events = await Event.find().sort({
                createdAt: -1,
            });
            res.status(201).json({
                success: true,
                events,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// review for a Event
router.put(
    "/create-new-review-event",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { user, rating, comment, productId, orderId } = req.body;

            const event = await Event.findById(productId);

            const review = {
                user,
                rating,
                comment,
                productId,
            };

            const isReviewed = event.reviews.find(
                (rev) => rev.user._id === req.user._id
            );

            if (isReviewed) {
                event.reviews.forEach((rev) => {
                    if (rev.user._id === req.user._id) {
                        (rev.rating = rating),
                            (rev.comment = comment),
                            (rev.user = user);
                    }
                });
            } else {
                event.reviews.push(review);
            }

            let avg = 0;

            event.reviews.forEach((rev) => {
                avg += rev.rating;
            });

            event.ratings = avg / event.reviews.length;

            await event.save({ validateBeforeSave: false });

            await Order.findByIdAndUpdate(
                orderId,
                { $set: { "cart.$[elem].isReviewed": true } },
                { arrayFilters: [{ "elem._id": productId }], new: true }
            );

            res.status(200).json({
                success: true,
                message: "Reviwed succesfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

module.exports = router;

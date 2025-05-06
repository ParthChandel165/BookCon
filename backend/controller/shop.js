const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const { upload } = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");
const validator = require("validator");

/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: Seller shop management
 */

/**
 * @swagger
 * /shop/create-shop:
 *   post:
 *     summary: Create a new seller shop
 *     tags: [Shop]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - address
 *               - phoneNumber
 *               - zipCode
 *               - file
 *             properties:
 *               name:
 *                 type: string
 *                 description: Shop name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Seller's email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Seller's password
 *               address:
 *                 type: string
 *                 description: Shop address
 *               phoneNumber:
 *                 type: string
 *                 description: Contact phone number
 *               zipCode:
 *                 type: string
 *                 description: ZIP/Postal code
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Shop avatar/logo
 *     responses:
 *       201:
 *         description: Shop created successfully
 *       400:
 *         description: Invalid data or user already exists
 */

/**
 * @swagger
 * /shop/login-shop:
 *   post:
 *     summary: Login to seller account
 *     tags: [Shop]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /shop/getSeller:
 *   get:
 *     summary: Get logged in seller info
 *     tags: [Shop]
 *     security:
 *       - sellerCookieAuth: []
 *     responses:
 *       200:
 *         description: Seller information
 *       400:
 *         description: User doesn't exist
 */

/**
 * @swagger
 * /shop/logout:
 *   get:
 *     summary: Logout from seller account
 *     tags: [Shop]
 *     responses:
 *       201:
 *         description: Logout successful
 */

/**
 * @swagger
 * /shop/get-shop-info/{id}:
 *   get:
 *     summary: Get shop information by ID
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Shop ID
 *     responses:
 *       200:
 *         description: Shop information
 *       400:
 *         description: Shop not found
 */

/**
 * @swagger
 * /shop/update-shop-avatar:
 *   put:
 *     summary: Update shop avatar
 *     tags: [Shop]
 *     security:
 *       - sellerCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Shop avatar updated successfully
 */

/**
 * @swagger
 * /shop/update-seller-info:
 *   put:
 *     summary: Update seller information
 *     tags: [Shop]
 *     security:
 *       - sellerCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               zipCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Seller info updated successfully
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

/**
 * @swagger
 * /shop/admin-all-sellers:
 *   get:
 *     summary: Get all sellers (Admin only)
 *     tags: [Admin, Shop]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: List of all sellers
 */

/**
 * @swagger
 * /shop/delete-seller/{id}:
 *   delete:
 *     summary: Delete a seller (Admin only)
 *     tags: [Admin, Shop]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Seller ID
 *     responses:
 *       201:
 *         description: Seller deleted successfully
 */

/**
 * @swagger
 * /shop/admin-all-sellers:
 *   get:
 *     summary: Get all sellers (Admin only)
 *     tags: [Admin, Shop]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: List of all sellers
 */

/**
 * @swagger
 * /shop/delete-seller/{id}:
 *   delete:
 *     summary: Delete a seller (Admin only)
 *     tags: [Admin, Shop]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Seller ID
 *     responses:
 *       201:
 *         description: Seller deleted successfully
 */

/**
 * @swagger
 * /shop/update-payment-methods:
 *   put:
 *     summary: Update seller payment methods
 *     tags: [Shop]
 *     security:
 *       - sellerCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               withdrawMethod:
 *                 type: object
 *     responses:
 *       201:
 *         description: Payment method updated
 */

/**
 * @swagger
 * /shop/delete-withdraw-method:
 *   delete:
 *     summary: Delete seller withdraw method
 *     tags: [Shop]
 *     security:
 *       - sellerCookieAuth: []
 *     responses:
 *       200:
 *         description: Withdraw method deleted successfully
 */

// create shop
router.post("/create-shop", upload.none(), async (req, res, next) => {
    try {
        console.log("Inside create shop");
        const { email, phoneNumber } = req.body;

        // Email validation
        if (!validator.isEmail(email)) {
            return next(new ErrorHandler("Invalid email format", 400));
        }

        // Phone number validation (checks if it's exactly 10 digits)
        if (!/^\d{10}$/.test(phoneNumber)) {
            return next(
                new ErrorHandler("Phone number must be exactly 10 digits", 400)
            );
        }

        const sellerEmail = await Shop.findOne({ email });
        if (sellerEmail) {
            return next(new ErrorHandler("Shop already exits", 400));
        }
        console.log(req.body);
        const seller = {
            name: req.body.name,
            email: email,
            password: req.body.password,
            avatar: req.body.avatarUrl,
            address: req.body.address,
            phoneNumber: phoneNumber,
            zipCode: req.body.zipCode,
        };

        const activationToken = createActivationToken(seller);




        
        const activationUrl = `https://bookcon-amber.vercel.app/seller/activation/${activationToken}`;

        try {
            await sendMail({
                email: seller.email,
                subject: "Activate your Shop",
                message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `Please check your email: ${seller.email} to activate your shop!`,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// create activation token
const createActivationToken = (seller) => {
    console.log(seller);
    return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};

// activate user
router.post(
    "/activation",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { activation_token } = req.body;
            console.log(`Activation token : ${activation_token}`)
            const newSeller = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET
            );

            console.log(newSeller);

            if (!newSeller) {
                return next(new ErrorHandler("Invalid token", 400));
            }
            const {
                name,
                email,
                password,
                avatar,
                zipCode,
                address,
                phoneNumber,
            } = newSeller;

            let seller = await Shop.findOne({ email });

            if (seller) {
                return next(new ErrorHandler("User already exists", 400));
            }

            seller = await Shop.create({
                name,
                email,
                avatar,
                password,
                zipCode,
                address,
                phoneNumber,
            });

            sendShopToken(seller, 201, res);
        } catch (error) {
            console.log(error.message + " pussyyy");
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// login shop
router.post(
    "/login-shop",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Email validation
            if (!validator.isEmail(email)) {
                return next(new ErrorHandler("Invalid email format", 400));
            }

            if (!email || !password) {
                return next(
                    new ErrorHandler("Please provide all fields!", 400)
                );
            }

            const user = await Shop.findOne({ email }).select("+password");

            if (!user) {
                return next(new ErrorHandler("User doesn't exist!", 400));
            }

            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return next(
                    new ErrorHandler(
                        "Please provide the correct information",
                        400
                    )
                );
            }

            sendShopToken(user, 201, res);
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// load shop
router.get(
    "/getSeller",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const seller = await Shop.findById(req.seller._id);
            if (!seller) {
                return next(new ErrorHandler("User doesn't exist", 400));
            }

            res.status(200).json({
                success: true,
                seller,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// log out from shop
router.get(
    "/logout",
    catchAsyncErrors(async (req, res, next) => {
        try {
        res.cookie("seller_token", "", {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
        res.status(201).json({
            success: true,
            message: "Log out successful!",
        });
        } catch (error) {
        return next(new ErrorHandler(error.message, 500));
        }
    })
);

// get shop info
router.get(
    "/get-shop-info/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const shop = await Shop.findById(req.params.id);
            if (!shop) {
                return next(new ErrorHandler("Shop not found", 400));
            }

            res.status(200).json({
                success: true,
                shop,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update shop profile picture
router.put(
    "/update-shop-avatar",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const existsUser = await Shop.findById(req.seller._id);
            const { avatarUrl } = req.body; // Get the Cloudinary URL from the request body

            if (!avatarUrl) {
                return next(new ErrorHandler("No image URL provided", 400)); // Handle if the URL is missing
            }

            const seller = await Shop.findByIdAndUpdate(
                req.seller._id,
                { avatar: avatarUrl },
                { new: true } // Return the updated document
            );

            res.status(200).json({
                success: true,
                seller,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update seller info
router.put(
    "/update-seller-info",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { name, description, address, phoneNumber, zipCode } =
                req.body;

            const shop = await Shop.findById(req.seller._id);

            if (!shop) {
                return next(new ErrorHandler("User not found", 400));
            }

            shop.name = name;
            shop.description = description;
            shop.address = address;
            shop.phoneNumber = phoneNumber;
            shop.zipCode = zipCode;

            await shop.save();

            res.status(201).json({
                success: true,
                shop,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// all sellers --- for admin
router.get(
    "/admin-all-sellers",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const sellers = await Shop.find().sort({
                createdAt: -1,
            });
            res.status(201).json({
                success: true,
                sellers,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// delete seller --- admin
router.delete(
    "/delete-seller/:id",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const seller = await Shop.findById(req.params.id);

            if (!seller) {
                return next(
                    new ErrorHandler(
                        "Seller is not available with this id",
                        400
                    )
                );
            }

            await Shop.findByIdAndDelete(req.params.id);

            res.status(201).json({
                success: true,
                message: "Seller deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update seller withdraw methods --- sellers
router.put(
    "/update-payment-methods",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { withdrawMethod } = req.body;

            const seller = await Shop.findByIdAndUpdate(req.seller._id, {
                withdrawMethod,
            });

            res.status(201).json({
                success: true,
                seller,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// delete seller withdraw methods --- only seller
router.delete(
    "/delete-withdraw-method",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const seller = await Shop.findById(req.seller._id);

            if (!seller) {
                return next(new ErrorHandler("Seller not found", 400));
            }

            seller.withdrawMethod = null;
            await seller.save();

            res.status(200).json({
                success: true,
                message: "Withdraw method deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

module.exports = router;

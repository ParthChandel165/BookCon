const express = require("express");
const path = require("path");
const User = require("../model/user");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const crypto = require("crypto"); // For generating secure token
const bcrypt = require("bcryptjs"); // For hashing password

const router = express.Router();
const validator = require("validator");
const dotenv = require("dotenv");
dotenv.config();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management and authentication
 */

/**
 * @swagger
 * /user/create-user:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
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
 *               - file
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (min 6 characters)
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: User's avatar image
 *     responses:
 *       201:
 *         description: Activation email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Please check your email to activate your account!"
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin operations
 */

/**
 * @swagger
 * /user/admin-all-users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin, User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: List of all users
 */

/**
 * @swagger
 * /user/delete-user/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Admin, User]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       201:
 *         description: User deleted successfully
 */

router.post("/create-user", upload.single("file"), async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userEmail = await User.findOne({ email });

        if (userEmail) {
            // if user already exits account is not create and file is deleted
            const filename = req.file.filename;
            const filePath = `uploads/${filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Error deleting file" });
                }
            });

            return next(new ErrorHandler("User already exits", 400));
        }

        const filename = req.file.filename;
        const fileUrl = path.join(filename);

        const user = {
            name: name,
            email: email,
            password: password,
            avatar: fileUrl,
        };

        const activationToken = createActivationToken(user);

        const activationUrl = `https://bookcon-amber.vercel.app/activation/${activationToken}`;

        // send email to user
        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                message: `Hello  ${user.name}, please click on the link to activate your account ${activationUrl} `,
            });
            res.status(201).json({
                success: true,
                message: `please check your email:- ${user.email} to activate your account!`,
            });
        } catch (err) {
            return next(new ErrorHandler(err.message, 500));
        }
    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
});

// create activation token
const createActivationToken = (user) => {
    // why use create activatetoken?
    // to create a token for the user to activate their account  after they register
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};

/**
 * @swagger
 * /user/activation:
 *   post:
 *     summary: Activate user account
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activation_token
 *             properties:
 *               activation_token:
 *                 type: string
 *                 description: JWT token received in email
 *     responses:
 *       201:
 *         description: Account activated successfully
 *       400:
 *         description: Invalid token
 */
router.post(
    "/activation",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { activation_token } = req.body;

            const newUser = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET
            );
            if (!newUser) {
                return next(new ErrorHandler("Invalid token", 400));
            }
            const { name, email, password, avatar } = newUser;

            let user = await User.findOne({ email });

            if (user) {
                return next(new ErrorHandler("User already exists", 400));
            }
            user = await User.create({
                name,
                email,
                avatar,
                password,
            });
            sendToken(user, 201, res);
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

/**
 * @swagger
 * /user/login-user:
 *   post:
 *     summary: User login
 *     tags: [User]
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
 *       201:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post(
    "/login-user",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return next(
                    new ErrorHandler("Please provide the all filelds", 400)
                );
            }
            const user = await User.findOne({ email }).select("+password");
            // +password is used to select the password field from the database

            if (!user) {
                return next(new ErrorHandler("user doesn't exits", 400));
            }

            // compore password with database password
            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return next(
                    new ErrorHandler(
                        "Please provide the correct inforamtions",
                        400
                    )
                );
            }
            sendToken(user, 201, res);
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

//Forgot-password
router.post(
    "/forgot-password",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return next(new ErrorHandler("User not found", 404));
            }

            // Generate reset token
            const resetToken = crypto.randomBytes(20).toString("hex");

            // Set token and expiration in database
            user.resetPasswordToken = crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");

            user.resetPasswordTime = Date.now() + 10 * 60 * 1000; // 10 min expiry

            await user.save({ validateBeforeSave: false });

            // Reset URL
            const resetUrl = `https://bookcon-amber.vercel.app/reset-password/${resetToken}`;

            // Send email
            try {
                await sendMail({
                    email: user.email,
                    subject: "Password Reset Request",
                    message: `Hello ${user.name},\n\nClick the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
                });

                res.status(200).json({
                    success: true,
                    message: `Password reset email sent to ${user.email}`,
                });
            } catch (err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordTime = undefined;
                await user.save({ validateBeforeSave: false });

                return next(new ErrorHandler("Email could not be sent", 500));
            }
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

router.put(
    "/reset-password/:token",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { password } = req.body;

            // Hash the token to match the one in DB
            const resetPasswordToken = crypto
                .createHash("sha256")
                .update(req.params.token)
                .digest("hex");

            // Find user by token
            const user = await User.findOne({
                resetPasswordToken,
                resetPasswordTime: { $gt: Date.now() }, // Ensure token is valid
            });

            if (!user) {
                return next(new ErrorHandler("Invalid or expired token", 400));
            }

            // Hash new password before saving
            user.password = password;
            console.log(password);
            
            // Clear reset password fields
            user.resetPasswordToken = undefined;
            user.resetPasswordTime = undefined;

            await user.save();

            res.status(200).json({
                success: true,
                message: "Password reset successful!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// load user
router.get(
    "/getuser",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return next(new ErrorHandler("User doesn't exists", 400));
            }
            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// log out user
router.get(
    "/logout",
    catchAsyncErrors(async (req, res, next) => {
        try {
        res.cookie("token", "", {
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

// update user info
router.put(
    "/update-user-info",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { email, password, phoneNumber, name } = req.body;

            /* The line `const user = await User.findOne({ email }).select("+password");` is querying the database
to find a user with the specified email address. The `select("+password")` part is used to include
the password field in the returned user object. By default, the password field is not selected when
querying the database for security reasons. However, in this case, the password field is needed to
compare the provided password with the stored password for authentication purposes. */
            const user = await User.findOne({ email }).select("+password");

            if (!user) {
                return next(new ErrorHandler("User not found", 400));
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

            user.name = name;
            user.email = email;
            user.phoneNumber = phoneNumber;

            await user.save();

            res.status(201).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update user avatar
router.put(
    "/update-avatar",
    isAuthenticated,
    upload.single("image"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const existsUser = await User.findById(req.user.id);

            const existAvatarPath = `uploads/${existsUser.avatar}`;

            fs.unlinkSync(existAvatarPath); // Delete Priviuse Image

            const fileUrl = path.join(req.file.filename); // new image

            /* The code `const user = await User.findByIdAndUpdate(req.user.id, { avatar: fileUrl });` is
        updating the avatar field of the user with the specified `req.user.id`. It uses the
        `User.findByIdAndUpdate()` method to find the user by their id and update the avatar field
        with the new `fileUrl` value. The updated user object is then stored in the `user` variable. */
            const user = await User.findByIdAndUpdate(req.user.id, {
                avatar: fileUrl,
            });

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update user addresses
router.put(
    "/update-user-addresses",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);

            const sameTypeAddress = user.addresses.find(
                (address) => address.addressType === req.body.addressType
            );
            if (sameTypeAddress) {
                return next(
                    new ErrorHandler(
                        `${req.body.addressType} address already exists`
                    )
                );
            }

            const existsAddress = user.addresses.find(
                (address) => address._id === req.body._id
            );

            if (existsAddress) {
                Object.assign(existsAddress, req.body);
            } else {
                // add the new address to the array
                user.addresses.push(req.body);
            }

            await user.save();

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// delete user address
router.delete(
    "/delete-user-address/:id",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const userId = req.user._id;
            const addressId = req.params.id;

            //   console.log(addressId);

            await User.updateOne(
                {
                    _id: userId,
                },
                { $pull: { addresses: { _id: addressId } } }
            );

            const user = await User.findById(userId);

            res.status(200).json({ success: true, user });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update user password
router.put(
    "/update-user-password",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).select("+password");

            const isPasswordMatched = await user.comparePassword(
                req.body.oldPassword
            );

            if (!isPasswordMatched) {
                return next(
                    new ErrorHandler("Old password is incorrect!", 400)
                );
            }

            /* The line `if (req.body.newPassword !== req.body.confirmPassword)` is checking if the value of
    `newPassword` in the request body is not equal to the value of `confirmPassword` in the request
    body. This is used to ensure that the new password entered by the user matches the confirmation
    password entered by the user. If the two values do not match, it means that the user has entered
    different passwords and an error is returned. */
            if (req.body.newPassword !== req.body.confirmPassword) {
                return next(
                    new ErrorHandler(
                        "Password doesn't matched with each other!",
                        400
                    )
                );
            }
            user.password = req.body.newPassword;

            await user.save();

            res.status(200).json({
                success: true,
                message: "Password updated successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// find user infoormation with the userId
router.get(
    "/user-info/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);

            res.status(201).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// all users --- for admin
router.get(
    "/admin-all-users",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const users = await User.find().sort({
                createdAt: -1,
            });
            res.status(201).json({
                success: true,
                users,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// delete users --- admin
router.delete(
    "/delete-user/:id",
    isAuthenticated,
    isAdmin("Admin"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                return next(
                    new ErrorHandler("User is not available with this id", 400)
                );
            }

            await User.findByIdAndDelete(req.params.id);

            res.status(201).json({
                success: true,
                message: "User deleted successfully!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

module.exports = router;

const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Conversation
 *   description: Message conversation management
 */

/**
 * @swagger
 * /conversation/create-new-conversation:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupTitle
 *               - userId
 *               - sellerId
 *             properties:
 *               groupTitle:
 *                 type: string
 *                 description: Title for the conversation
 *               userId:
 *                 type: string
 *                 description: ID of the user
 *               sellerId:
 *                 type: string
 *                 description: ID of the seller
 *     responses:
 *       201:
 *         description: Conversation created successfully
 */

/**
 * @swagger
 * /conversation/get-all-conversation-seller/{sellerId}:
 *   get:
 *     summary: Get all conversations of a seller
 *     tags: [Conversation]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Seller ID
 *     responses:
 *       201:
 *         description: List of conversations
 */

/**
 * @swagger
 * /conversation/get-all-conversation-user/{userId}:
 *   get:
 *     summary: Get all conversations of a user
 *     tags: [Conversation]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       201:
 *         description: List of conversations
 */

/**
 * @swagger
 * /conversation/update-last-message/{id}:
 *   put:
 *     summary: Update last message in a conversation
 *     tags: [Conversation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lastMessage
 *               - lastMessageId
 *             properties:
 *               lastMessage:
 *                 type: string
 *               lastMessageId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Last message updated
 */

// create a new conversation
router.post(
    "/create-new-conversation",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { groupTitle, userId, sellerId } = req.body;

            const isConversationExist = await Conversation.findOne({
                groupTitle,
            });

            if (isConversationExist) {
                const conversation = isConversationExist;
                res.status(201).json({
                    success: true,
                    conversation,
                });
            } else {
                const conversation = await Conversation.create({
                    members: [userId, sellerId],
                    groupTitle: groupTitle,
                });

                res.status(201).json({
                    success: true,
                    conversation,
                });
            }
        } catch (error) {
            return next(new ErrorHandler(error.response.message), 500);
        }
    })
);

// get seller conversations
router.get(
    "/get-all-conversation-seller/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const conversations = await Conversation.find({
                members: {
                    $in: [req.params.id],
                },
            }).sort({ updatedAt: -1, createdAt: -1 });

            res.status(201).json({
                success: true,
                conversations,
            });
        } catch (error) {
            return next(new ErrorHandler(error), 500);
        }
    })
);

// get user conversations
router.get(
    "/get-all-conversation-user/:id",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const conversations = await Conversation.find({
                members: {
                    $in: [req.params.id],
                },
            }).sort({ updatedAt: -1, createdAt: -1 });

            res.status(201).json({
                success: true,
                conversations,
            });
        } catch (error) {
            return next(new ErrorHandler(error), 500);
        }
    })
);

// update the last message
router.put(
    "/update-last-message/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { lastMessage, lastMessageId } = req.body;

            const conversation = await Conversation.findByIdAndUpdate(
                req.params.id,
                {
                    lastMessage,
                    lastMessageId,
                }
            );

            res.status(201).json({
                success: true,
                conversation,
            });
        } catch (error) {
            return next(new ErrorHandler(error), 500);
        }
    })
);

module.exports = router;

const Messages = require("../model/messages");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { upload } = require("../multer");
const router = express.Router();
const path = require("path");

/**
 * @swagger
 * tags:
 *   name: Message
 *   description: User-seller messaging
 */

/**
 * @swagger
 * /message/create-new-message:
 *   post:
 *     summary: Create a new message
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *               - sender
 *               - text
 *             properties:
 *               conversationId:
 *                 type: string
 *                 description: ID of conversation
 *               sender:
 *                 type: string
 *                 description: ID of message sender
 *               text:
 *                 type: string
 *                 description: Message content
 *               images:
 *                 type: string
 *                 format: binary
 *                 description: Optional images with the message
 *     responses:
 *       201:
 *         description: Message sent successfully
 */

/**
 * @swagger
 * /message/get-all-messages/{id}:
 *   get:
 *     summary: Get all messages in a conversation
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       201:
 *         description: List of all messages
 */

// create new message
router.post(
  "/create-new-message",
  upload.single("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messageData = req.body;

      if (req.file) {
        const filename = req.file.filename;
        const fileUrl = path.join(filename);
        messageData.images = fileUrl;
      }

      messageData.conversationId = req.body.conversationId;
      messageData.sender = req.body.sender;
      messageData.text = req.body.text;

      const message = new Messages({
        conversationId: messageData.conversationId,
        text: messageData.text,
        sender: messageData.sender,
        images: messageData.images ? messageData.images : undefined,
      });

      await message.save();

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

// get all messages with conversation id
router.get(
  "/get-all-messages/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message), 500);
    }
  })
);

module.exports = router;

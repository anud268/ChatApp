const express = require("express");
const route = express.Router();
const { authMiddleWare, userOnly, adminOnly } = require("../middleware/authMiddleware");
const chatController = require("../controller/chatController");

route.get("/", authMiddleWare, userOnly, chatController.getmessenger);
route.get("/chat/:id", authMiddleWare, userOnly, chatController.chat);
route.get("/getMessage/:receiver/:logedinUser",authMiddleWare,chatController.messages);

module.exports = route;

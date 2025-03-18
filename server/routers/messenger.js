const express = require('express');
const User = require('../models/User');
const router = express.Router();    
const Chat = require("../models/Chat")
const {authMiddleWare,userOnly}=require("../middleware/authMiddleWare")

const chatController = require('../controller/chat-controller');

 


router.get('/messenger',authMiddleWare, userOnly, chatController.getmessenger);
router.get('/chat/:id',authMiddleWare,userOnly, chatController.chat);
router.get('/getMessage/:receiver/:logedinUser',authMiddleWare,chatController.messages);
router.get('/logout', chatController.chatLogout);

module.exports= router;
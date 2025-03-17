const express = require('express');
const User = require('../models/User');
const router = express.Router();    
const Chat = require("../models/Chat")
const {authMiddleWare,userOnly}=require("../middleware/authMiddleWare")

const controller = require('../controller/blog-controller');

 


router.get('/messenger',authMiddleWare, userOnly, controller.getmessenger);
router.get('/chat/:id',authMiddleWare,userOnly, controller.chat);
router.get('/getMessage/:receiver/:logedinUser',authMiddleWare,async (req,res)=>{
    const { receiver ,logedinUser} = req.params;
    console.log(receiver,logedinUser,"reciever") 
    
    try {
        const message = await Chat.find({$or:[
            {sender:logedinUser,receiver:receiver},
            {sender:receiver,receiver:logedinUser}
        ]}).sort({createdAt:1});
        console.log(message,"messages")
        res.json(message)
    } catch (error) {
        console.log(error.message)
    }
})
router.get('/logout', controller.logout);

module.exports= router;
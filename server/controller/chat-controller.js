const express = require('express');
const router = express.Router();    
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken');
// const { route } = require('./admin');
const {authMiddleWare,userOnly}=require("../middleware/authMiddleWare")
const adminLayout = '../views/layouts/admin';
const userLayout = '../views/layouts/users';
const otpLayout = '../views/layouts/otp';
const messLayout = '../views/layouts/messenger';
const jwtSecret = process.env.JWT_SECRET;
const multer = require('multer');
const path = require('path');
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const Chat = require('../models/Chat');
 
 
 

const getmessenger=  async (req, res) => {
    try {
        const userId = req.userId
        const data = await User.find({ _id: { $ne: userId } }).sort({createdAt:1});
        const mydata = await User.find({ _id: { $eq: userId } });
        
      
        
        res.render('users/messenger',{mydata: mydata,user:data,layout: messLayout});
        

    } catch (error) {
        console.log(error);
        return res.status(400).render('error',{errorMessage:"Server Error"})
    }
}
const chat = async (req, res) => {

    try{
        console.log(req.userId)
        let id = req.params.id;
        const user=await User.findById(id)
        
        const logedinUser = await User.findById(req.userId)
        res.render('chat',{user:user,logedinUser:logedinUser.username,layout: otpLayout});

       
    }catch(error){
        return res.status(400).render('error',{errorMessage:"Server Error"})
    }
    
}
const messages = async (req,res)=>{
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
}

const chatLogout = (req, res) => { 
    if (req.session) {
      req.session.destroy((err) => {
  
        if (err) {
          console.error('Error logging out:', err);
          return res.redirect('/');  // Redirect to home or error page
        }
        res.clearCookie('token'); // Clear the session cookie
        return res.redirect('/signIn');  // Redirect to login page
      });
    } else {
    //   If no session exists, just redirect to login
      return res.redirect('/signIn');
    }
  };




module.exports = {
    getmessenger,
    chat,
    messages,
    chatLogout
}
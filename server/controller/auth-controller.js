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
const nodemailer = require('nodemailer')
 
 
 
 const   extractDataFromToken = (req, res,next) => {
     try {
         const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
         if (!token) {
             return res.status(401).json({ error: "Access denied. No token provided." });
         }
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         const { userId, role, name } = decoded;
          return userId
     } catch (error) {
         console.error("Token verification error:", error);
         res.status(400).json({ error: "Invalid oken." });
     }
 };
//get signin

 const getSigin=async (req, res) => {
    
    try{ 
        if(req.cookies.token){
             res.redirect('/');
        }else{
            res.render('users/index');
        }
        
    }catch(err){ 
        console.log(err);
        return res.status(400).render("pages/error",{errorMessage:"Server Error"})
    }

};

//logout

const logout = (req, res) => {
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
      // If no session exists, just redirect to login
      return res.redirect('/signIn');
    }
  };



  //check user or admin   
  const checkUser = async (req, res) => {
      
      try{
  
          const { username, password}= req.body
         
          const user = await User.findOne({username})
          if(!user){
              return res.status(400).render('error',{errorMessage:"Your Username is Wrong!!!"})
              // return res.status(401).json({message:'Invalid'})
          }
          const isPasswordValid = await bcrypt.compare(password,user.password);
          if (!isPasswordValid){
              // return res.status(401).json({message:'Invalid'})
              return res.status(400).render('error',{errorMessage:"Your Password is Wrong!!!"})
          }
  
          const token = jwt.sign({userId:user._id},jwtSecret)
          res.cookie('token',token, {httpOnly:true});
  
          if(user.role=="admin"){
              res.redirect("/admin-dashboard")
          }else{
  
          res.redirect('/').json({ message: 'Server error' });
         
          }
      }catch(err){
          console.log(err);
          return res.status(400).render("views/error",{errorMessage:"Server Error"})
      }
  
  }




module.exports = {
    getSigin,
    logout,
    checkUser
}
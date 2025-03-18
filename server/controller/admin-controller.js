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
const postLayout = '../views/layouts/posts';
const jwtSecret = process.env.JWT_SECRET;
const multer = require('multer');
const path = require('path');
const crypto = require('crypto')
const nodemailer = require('nodemailer')
 
 
 




// ----------------------admin---------------------


//admin get dashboard
const getAdminDashboard = async (req, res) => {

    try{
        const locals={
            title: 'Dashboard',
            description: 'simple blog created with nodejs, express & mongoDB.'
        }
        const data = await Post.find().populate("author","username")     
        const users = await User.countDocuments() 
        const posts = await Post.countDocuments() 
        const del = await Post.find({ status: false }).countDocuments();
            
        res.render('admin/admin-dashboard',{
            locals,
            data,
            users,
            posts,
            del,
            layout :adminLayout
        });
    }catch(error){
        return res.status(400).render('error',{errorMessage:"Server Error"})
    }
    
}


//admin edit post

const adminEditpost = async (req, res) => {

    try{
        const locals={
            title: 'Edit Post',
            description: 'simple blog created with nodejs, express & mongoDB.'
        }
        const data = await Post.findOne({_id: req.params.id});
        res.render('admin/edit-post',{
            locals,
            data,
            layout :adminLayout
        });
    }catch(error){
        return res.status(400).render('error',{errorMessage:"Server Error"})
    }
    
}

//post admin edit post

const postAdminEditPost = async (req, res) => {

    try{
        await Post.findByIdAndUpdate(req.params.id,{
            title:req.body.title,
            body:req.body.body,
            updateAt: Date.now()
        })
        res.redirect('/admin-dashboard');
       
    }catch(error){
        return res.status(400).render('error',{errorMessage:"Server Error"})
    }
    
}

//delete post

const adminDeletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).render('error', { errorMessage: "Post not found" });
        }
console.log(post);

        
        await Post.findByIdAndUpdate ( { _id: req.params.id},{status:"false"},{new:true})
        console.log(`Post with id ${req.params.id} deleted successfully`);
        res.redirect('/admin-dashboard');
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', { errorMessage: "Server Error" });
    }
};


//logout

const adminLogout = (req, res) => { 
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
    getAdminDashboard,
    adminEditpost,
    postAdminEditPost,
    adminDeletePost,
    adminLogout
};
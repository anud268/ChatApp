const express = require('express');
const router = express.Router();    
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')
const {authMiddleWare,adminOnly}=require("../middleware/authMiddleWare")
const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;


const controller = require('../controller/blog-controller');



// router.get('/', controller.adminGetLogin);

// router.post('/admin', controller.adminPostLogin);

router.get('/admin-dashboard',authMiddleWare,adminOnly, controller.getAdminDashboard);

router.get('/edit-post/:id',authMiddleWare,adminOnly, controller.adminEditpost);

router.post('/edit-post/:id',authMiddleWare,adminOnly, controller.postAdminEditPost);

router.post('/delete-post/:id',authMiddleWare,adminOnly, controller.adminDeletePost);

router.get('/logout', controller.logout);








module.exports= router; 
const express = require('express');
const router = express.Router();    
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')
const {authMiddleWare,adminOnly}=require("../middleware/authMiddleWare")
const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;


const adminController = require('../controller/admin-controller');




router.get('/admin-dashboard',authMiddleWare,adminOnly, adminController.getAdminDashboard);

router.get('/edit-post/:id',authMiddleWare,adminOnly, adminController.adminEditpost);

router.post('/edit-post/:id',authMiddleWare,adminOnly, adminController.postAdminEditPost);

router.post('/delete-post/:id',authMiddleWare,adminOnly, adminController.adminDeletePost);

router.get('/logout', adminController.adminLogout);








module.exports= router; 
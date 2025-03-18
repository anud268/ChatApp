const express = require('express');
const router = express.Router();    
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken');
const { route } = require('./admin');
const {authMiddleWare,userOnly}=require("../middleware/authMiddleWare")
const adminLayout = '../views/layouts/users';
const jwtSecret = process.env.JWT_SECRET;
const multer = require('multer');
const path = require('path');

const controller = require('../controller/blog-controller');
const authController = require('../controller/chat-controller');

 




router.get('/signIn', controller.getSigin);

router.get('/logout', controller.logout);

router.post('/signIn', controller.checkUser);





router.get('/', authMiddleWare, userOnly,controller.uDashboard);

router.get('/myposts',authMiddleWare,userOnly, controller.profile);

router.get('/users-add-post',authMiddleWare,userOnly, controller.getCreatePost);

router.post('/users-add-post',authMiddleWare,userOnly, controller.postCreatePost);

router.get('/users-edit-post/:id',authMiddleWare,userOnly, controller.getEditPost);

router.post('/users-edit-post/:id',authMiddleWare,userOnly,controller.postEditPost);

router.post('/users-delete-post/:id',authMiddleWare,userOnly,controller.deletePost);


router.get('/post/:id',controller.getPostSearch );
router.post('/search', controller.postPostSearch);

router.get('/create', controller.getSignup);
router.post('/create', controller.postSignup);
router.post('/verifyotp/:id',controller.verifyOtp)




module.exports= router ; 
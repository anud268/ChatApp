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
const authController = require('../controller/auth-controller');

 

// image upload

// const storage = multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null,"public/uploads")
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
//     }
// });
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
//     if (extname && mimetype) {
//         return cb(null, true);
//     } else {
//         return (new Error("Only JPEG and PNG images are allowed!"), false);
//     }
// };
// const upload = multer({ storage: storage, fileFilter: fileFilter });
// // Configure Multer Storage
// const storages = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/uploads"); // Save images in 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//     },
// });
// const Upload = multer({ dest: "public/uploads" });


// router.post('/users-add-post', upload.single('image'), async (req, res) => {
//     try {
//         console.log(req.body);
        
//         const { title, body } = req.body;
//         const image = req.file.filename;
//         const userId = extractDataFromToken(req, res);
//         const data = await Post.create({
//             title,
//             body,
//             author,
//             image
//         });
//         res.redirect('/uDashboard',{data});
//     } catch (error) {
//         console.log(error);
//     }
// });





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
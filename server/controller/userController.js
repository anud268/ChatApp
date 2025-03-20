const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userLayout = "../views/layouts/users";
const otpLayout = "../views/layouts/otp";
const postLayout = "../views/layouts/posts";
const jwtSecret = process.env.JWT_SECRET;
const crypto = require("crypto");
const nodemailer = require("nodemailer");

//get signin

const getSigin = async (req, res) => {
  try {
    if (req.cookies.token) {
      res.redirect("/");
    } else {
      res.render("users/index");
    }
  } catch (err) {
    return res
      .status(400)
      .render("error", { errorMessage: "Server Error" });
  }
};

//logout

const logout = (req, res) => {
  try {
    if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            return res.redirect("/"); // Redirect to home or error page
          }
          res.clearCookie("token"); // Clear the session cookie
          return res.redirect("/signIn"); // Redirect to login page
        });
      } else {
        //   If no session exists, just redirect to login
        return res.redirect("/signIn");
      }
  } catch (error) {
    res.status(400).render("views/error", { errorMessage: "Server Error" });
  }
};

//check user or admin
const checkUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user ) { 
        return res
      .status(400)
      .render("error", {user, errorMessage: "Your Username is Wrong!!!" });
        
        
      // return res.status(401).json({message:'Invalid'})
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // return res.status(401).json({message:'Invalid'})
      return res
        .status(400)
        .render("error", { errorMessage: "Your Password is Wrong!!!" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      jwtSecret
    );
    res.cookie("token", token, { httpOnly: true });

    if (user.role == "admin") {
      res.redirect("/admin");
    } else {
      res.redirect("/")
    }
  } catch (err) {
    return res
      .status(400)
      .render("views/error", { errorMessage: "Server Error" });
  }
};

// get dashboard

const uDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const locals = {
      title: "Dashboard",
      description: "simple blog created with nodejs, express & mongoDB.",
    };
    const data = await Post.find({ status: "true" }).populate("author", "username").sort({ createdAt: -1 });
    const user = await User.find({ _id: { $eq: userId } });

    res.render("users/uDashboard", {
      locals,
      data,
      user,
      layout: userLayout,
    });
  } catch (error) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};

// profile

const profile = async (req, res) => {
  try {
    const userId = req.userId;

    const locals = {
      title: "Dashboard",
      description: "simple blog created with nodejs, express & mongoDB.",
    };
    const data = await Post.find({ author: { $eq: userId }, status: "true" })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    const user = await User.find({ _id: { $eq: userId } });

    res.render("profile", {
      locals,
      data,
      user,
      layout: postLayout,
    });
  } catch (error) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};

// get create post

const getCreatePost = async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "simple blog created with nodejs, express & mongoDB.",
    };

    res.render("users/usersAddPost", {
      locals,
      layout: postLayout,
    });
  } catch (error) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};

//post create post

const postCreatePost = async (req, res) => {
  try {
    const userId = req.userId;

    const { title, body } = req.body;

    const post = await Post.create({
      title: title,
      body: body,
      author: userId,
    });

    res.redirect("/myposts");
  } catch (error) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};

//get edit post

const getEditPost = async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "simple blog created with nodejs, express & mongoDB.",
    };
    const data = await Post.findOne({ _id: req.params.id });
    res.render("users/usersEditPost", {
      locals,
      data,
    });
  } catch (error) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};

//post edit post

const postEditPost = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updateAt: Date.now(),
    });
    res.redirect("/myposts");
  } catch (error) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};

//delte post

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(
      { _id: req.params.id },
      { status: "false" },
      { new: true }
    );
    res.redirect("/myposts");
  } catch (error) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};

//get post for search

const getPostSearch = async (req, res) => {
  try {
    const locals = {
      title: "Nodejs blog",
      body: "Welcome to my website",
    };

    let slug = req.params.id;

    const data = await Post.findById({ _id: slug }).sort({ createdAt: -1 });
    res.render("post", { locals, data });
  } catch (err) {
    res.status(404).render('errorNotFound', { errorMessage: ' Page Not Found' });
  }
};

//post post for search

const postPostSearch = async (req, res) => {
  try {
    const locals = {
      title: "Search",
      body: "Welcome to my website",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const data = await Post.find({
        status: "true",
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
          { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        ],
      });
      

    res.render("search", {
      data,
      locals,
    });
  } catch (err) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};

//get signup

const getSignup = async (req, res) => {
  try {
    res.render("users/create");
  } catch (err) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};

//post signup

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sentOtp = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `BlogApp<${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP verification",
      text: `Your OTP Code is: ${otp}`,
    });
  } catch (error) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};

const postSignup = async (req, res) => {
  try {
    const { username, password, email, confirm } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).render("error", {
        errorMessage: "User already exists with this email",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;
    try {
      if (password === confirm) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          username,
          password: hashedPassword,
          email,
          otp,
        });
        res.render("users/otpVerification", {
          user: user._id,
          layout: otpLayout,
        });
        await sentOtp(email, otp);
      }
    } catch (error) {
      if (error.code === 11000) {
        // return res.status(409).json({ message: 'User already in use' });
        return res
          .status(400)
          .render("error", { errorMessage: "User already in use" });
      }
      return res.status(400).render("error", { errorMessage: "Server Error" });
    }
  } catch (err) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};
const verifyOtp = async (req, res) => {
  try {
    const id = req.params.id;

    const { otp } = req.body;
    const user = await User.findById(id);

    if (otp.toString() === user.otp.toString()) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $unset: { otp: 1, otpExpire: 1 } },
        { new: true }
      );
      res.render("users/index");
    } else {
      const res = await User.findByIdAndDelete(id);
      return res.status(400).render("error", {
        errorMessage: "Please insert a valid email address.",
      });
    }
  } catch (error) {
    return res.status(400).render("error", {
      errorMessage: "Please insert a valid email address...",
    });
  }
};

module.exports = {
  getSigin,
  uDashboard,
  profile,
  getCreatePost,
  postCreatePost,
  getEditPost,
  postEditPost,
  deletePost,
  getPostSearch,
  postPostSearch,
  getSignup,
  postSignup,
  verifyOtp,
  checkUser,
  logout
};

const Post = require("../models/Post");
const User = require("../models/User");
const adminLayout = "../views/layouts/admin";

//admin get dashboard
const getAdminDashboard = async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "simple blog created with nodejs, express & mongoDB.",
    };
    const data = await Post.find().populate("author", "username").sort({ createdAt: -1 });;
    const users = await User.countDocuments();
    const posts = await Post.countDocuments();
    const del = await Post.find({ status: false }).countDocuments();

    res.render("admin/adminDashboard", {
      locals,
      data,
      users,
      posts,
      del,
      layout: adminLayout,
    });
  } catch (error) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};

//admin edit post

const adminEditpost = async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "simple blog created with nodejs, express & mongoDB.",
    };
    const data = await Post.findOne({ _id: req.params.id });
    res.render("admin/editPost", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};

//post admin edit post

const postAdminEditPost = async (req, res) => {
    
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updateAt: Date.now(),
    });
    
    
    res.redirect("/admin");

  } catch (error) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};



const viewPostAdminEditPost = async (req, res) => {
    
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updateAt: Date.now(),
    });
    
    res.redirect("/post/:id");

  } catch (error) {
    return res.status(400).render("error", { errorMessage: "Server Error" });
  }
};

//delete post

const adminDeletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).render('errorNotFound', { errorMessage: ' Page Not Found' });
    }

    await Post.findByIdAndUpdate(
      { _id: req.params.id },
      { status: "false" },
      { new: true }
    );
    res.redirect("/admin");
  } catch (error) {
    return res.status(500).render("error", { errorMessage: "Server Error" });
  }
};


 


module.exports = {
  getAdminDashboard,
  adminEditpost,
  postAdminEditPost,
  viewPostAdminEditPost,
  adminDeletePost
};

const express = require("express");
const route = express.Router();
const { authMiddleWare, userOnly } = require("../middleware/authMiddleware");
const controller = require("../controller/userController");

route.get("/signIn", controller.getSigin);
route.get("/logout", controller.logout);
route.post("/signIn", controller.checkUser);
route.get("/", authMiddleWare, userOnly, controller.uDashboard);
route.get("/myposts", authMiddleWare, userOnly, controller.profile);
route.get(
  "/addPost",
  authMiddleWare,
  userOnly,
  controller.getCreatePost
);
route.post(
  "/addPost",
  authMiddleWare,
  userOnly,
  controller.postCreatePost
);
route.get(
  "/editPost/:id",
  authMiddleWare,
  userOnly,
  controller.getEditPost
);
route.post(
  "/editPost/:id",
  authMiddleWare,
  userOnly,
  controller.postEditPost
);
route.post(
  "/deletePost/:id",
  authMiddleWare,
  userOnly,
  controller.deletePost
);
route.get("/post/:id", controller.getPostSearch);
route.post("/search", controller.postPostSearch);
route.get("/create", controller.getSignup);
route.post("/create", controller.postSignup);
route.post("/verifyotp/:id", controller.verifyOtp);

module.exports = route;

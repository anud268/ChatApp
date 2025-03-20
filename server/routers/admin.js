const express = require("express");
const route = express.Router();
const { authMiddleWare, adminOnly } = require("../middleware/authMiddleware");
const adminController = require("../controller/adminController");

route.get(
  "/",
  authMiddleWare,
  adminOnly,
  adminController.getAdminDashboard
);

route.get(
  "/editPost/:id",
  authMiddleWare,
  adminOnly,
  adminController.adminEditpost
);

route.post(
  "/editPost/:id",
  authMiddleWare,
  adminOnly,
  adminController.postAdminEditPost
);



route.post(
  "/deletePost/:id",
  authMiddleWare,
  adminOnly,
  adminController.adminDeletePost
);
module.exports = route;

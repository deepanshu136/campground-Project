const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require('../middleware');
const users=require('../controllers/usere')

router.get("/register", users.renderRegister );

router.post(
  "/register",
  catchAsync(users.register)
);

router.get("/login", users.renderLogin);

router.post(
  "/login",storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login
);

router.get("/logout", users.logout);

module.exports = router;

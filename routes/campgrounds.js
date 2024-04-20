const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schema");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const {storage}=require('../cloudinary');
const upload = multer({ storage});



//basic crud for camp ground
router.get("/", catchAsync(campgrounds.index));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.post(
  "/",
  isLoggedIn,upload.array("image"),
  validateCampground,
  catchAsync(campgrounds.createCampground)

  // upload.array("image"),
  // (req, res) => {
    
  //   console.log(req.body);
  //   console.log(req.files);
  //   res.send('It worked');
  // }
  );


router.get("/:id", catchAsync(campgrounds.showCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.editCampground)
);

router.put(
  "/:id",
  isLoggedIn,upload.array("image"),
  validateCampground,
  isAuthor,
  catchAsync(campgrounds.updateCampground)
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;

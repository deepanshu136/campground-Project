const express = require("express");
const router = express.Router({mergeParams:true});
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground=require('../models/campground')
const Review=require("../models/review"); 
const { reviewSchema} = require("../schema");
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware');
const review=require('../controllers/reviews')



// const validateReview=(req,res,next)=>{
//     const{error}=reviewSchema.validate(req.body);
//     if(error){
//       const msg = error.details.map((el) => el.message).join(",");
//       throw new ExpressError(msg, 400);
//     } else{
//       next()
//     }
//   };
  

router.post(
  "/",
  validateReview,isLoggedIn,
  catchAsync(review.createReview)
);

router.delete(
  "/:reviewId",isLoggedIn,isReviewAuthor,
  catchAsync(review.deleteReview)
);


module.exports=router;

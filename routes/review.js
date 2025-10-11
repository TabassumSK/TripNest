const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/reviews");
const ExpressError = require("../utils/ExpressError");


//Reviews
//Post review route
router.post("/", wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
}));

//Delete review route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

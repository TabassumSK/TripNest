// MVC - implement design pattern for listings
//model - database, view - frontend, controllers - backend

const Listing = require("../models/listing.js");
const axios = require("axios");

// ✅ Helper function here
async function getCoordinates(location) {
  const response = await axios.get(
    `https://api.maptiler.com/geocoding/${location}.json`,
    {
      params: { key: process.env.MAP_TOKEN }
    }
  );

  return response.data.features[0].center;
}

//index listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//show listing
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate({ path: "owner" });
  if (!listing) {
    // throw new ExpressError(404, "Listing not found");
    req.flash("error", "Listing you requested for does not exists");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

// create listing
module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  // Get coordinates from location
  const coords = await getCoordinates(req.body.listing.location);

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

   // Save geometry
  newListing.geometry = {
    type: "Point",
    coordinates: coords
  };

  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

//edit listing
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    // throw new ExpressError(404, "Listing not found");
    req.flash("error", "Listing you requested for does not exists");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit", { listing, originalImageUrl });
};

// update listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  await listing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

//delete listing
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

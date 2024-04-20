const Campground = require("../models/campground");
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapBoxToken});
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};


module.exports.createCampground = async (req, res, next) => {
  try {
    // Perform forward geocoding to get the location geometry
    const geoData = await geocoder.forwardGeocode({
      query: req.body.campground.location,
      limit: 1
    }).send();

    // Create a new campground document with the provided data
    const campground = new Campground({
      ...req.body.campground,
      author: req.user._id, // Set the author ID directly on the campground object
      geometry: geoData.body.features[0].geometry// Set the location geometry obtained from geocoding
    });

    // Map uploaded files to image objects and assign to campground
    const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    campground.images = images;

    // Save the campground document to the database
    await campground.save();

    // Log the saved campground object to the console
    console.log(campground);

    // Flash success message and redirect to the campground details page
    req.flash("success", "Successfully created a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
    req.flash("error", "Failed to create a new campground");
    res.redirect('/campgrounds/new');
  }
};




module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  console.log(campground);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground, currentUser: req.user });
};

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;

  const campground = await Campground.findById(id);

  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }

  if (req.files) {
    // Assuming you are using multer for file uploads
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
  }

  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body)
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
  campground.images.push(...imgs);
  await campground.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
     await cloudinary.uploader.destroy(filename)
    }
   await campground.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}});
   console.log(campground)
  }
  req.flash("success", "Sucessfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Sucessgully deleted a campground");
  res.redirect("/campgrounds");
};

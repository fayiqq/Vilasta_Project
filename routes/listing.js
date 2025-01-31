const express=require("express");
const router=express.Router();
const Listing = require("../models/listing");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLogged}=require("../middleware.js");
const {isOwnner}=require("../middleware.js");
const{storage}=require("../cloudinaryConfig.js")
const multer  = require('multer')
const upload = multer({storage });



//index route
router.get("", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listing/index.ejs", { allListing });

}))

//new route
router.get("/new",isLogged, (req, res) => {
    res.render("./listing/new.ejs");
})

//show route
router.get("/:id", wrapAsync(async (req, res,next) => {

        let { id } = req.params;
        let listing = await Listing.findById(id)
                                    .populate(
                                        {path:"review",populate:{path:"author"}})
                                    .populate("owner");
        if(!id){
            req.flash("error", "Listing does not exist")
            res.redirect("/listing");

        }
        res.render("./listing/show.ejs", {listing});

}));

//create route
router.post("", isLogged,upload.single("image"),wrapAsync(async (req, res) => {
    
    let { title, description, price, location, country} = req.body;
    let newLisiting = new Listing({ title, description, price, location, country});
    newLisiting.owner=req.user._id;
    if(req.file){
        const url=req.file.path;
        const filename=req.file.filename;
        newLisiting.image={url,filename};
    }

    
   await newLisiting.save();
   req.flash("success","Listing added successfully");
   
   res.redirect("/listing")
}))

//delete route
router.delete("/:id",isOwnner, wrapAsync(async (req, res) => {   
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully")
    res.redirect("/listing");


}))

//edit route
router.get("/:id/edit",isOwnner,wrapAsync(async (req, res) => {

        let { id } = req.params;
        let listing = await Listing.findById(id);
        res.render("./listing/edit.ejs", {listing });
    
    })) 



//update route
router.put("/:id",isOwnner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, { title, description, price, location, country });
    res.redirect(`/listing/${id}`)


}));

module.exports=router;
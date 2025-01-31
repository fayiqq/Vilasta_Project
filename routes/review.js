const express=require("express");
const routes=express.Router({mergeParams:true});  //now parent route k params child mai b aayenge
const Listing = require("../models/listing");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review = require("../models/review");
const {isLogged}=require("../middleware.js");
const {isAuthor}=require("../middleware.js");


//post review
routes.post("",isLogged,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);

    let{rating,comment}=req.body;

    let newReview=new Review({rating,comment});
    listing.review.push(newReview);

    newReview.author=req.user._id;

    await listing.save();
    await newReview.save(); 

    res.redirect(`/listing/${req.params.id}`)
   
}))

//delete review 
routes.delete("/:reviewId",isLogged,isAuthor, wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`)
   
}))

module.exports=routes;

const Listing=require("./models/listing.js")
const Review=require("./models/review.js")



module.exports.isLogged=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
      
        req.flash("error","You need to login first");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectedUrl=(req,res,next)=>{
    res.locals.returnTo=req.session.returnTo;
    next();
}

module.exports.isAuthor=async (req,res,next)=>{

    let { id ,reviewId} = req.params;
    let review=await Review.findById(reviewId);
  
    if (!req.user || !review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listing/${id}`);
    }
    next();


}


module.exports.isOwnner=async (req,res,next)=>{

    let { id } = req.params;
    let listing=await Listing.findById(id);
  
    if (!req.user || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();


}


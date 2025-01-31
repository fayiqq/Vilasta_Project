const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String
        },
        description: String,
        image: {
            filename: String,
            url: {
                type: String,
                default:"https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
            }
        },
        price: Number,
        location: String,
        country: String,
        review: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review"
            }
        ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
        
    }
);

//delete middleware

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.review.length){
        await Review.deleteMany({_id:{$in:listing.review}})
    };
    
})


const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
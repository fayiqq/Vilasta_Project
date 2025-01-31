const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/listing");

}
main();

async function addData(){
    let listing=await Listing.findOne({title:"TodoApp_Code"});

    let review1=new Review({rating:4, comment:"very good"});
    

    listing.rating.push(review1);

    listing.save();
    review1.save();

}
addData();
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate'); 

const listingRoutes=require("./routes/listing.js")
const reviewRoutes=require("./routes/review.js")
const userRoutes=require("./routes/user.js")

const ExpressError=require("./utils/ExpressError.js");
const wrapAsync=require("./utils/wrapAsync.js")

const session=require("express-session")
const flash=require("connect-flash");
const passport=require("passport")
const LocalStrategy=require("passport-local")

const MongoStore = require('connect-mongo');


const User=require("./models/user.js");

const { wrap } = require("module");

app.engine('ejs', ejsMate); // Use EJS-Mate as the rendering engine
const atlasUrl=process.env.ATLAS_URL

async function main() {
    await mongoose.connect(atlasUrl);

}
main();
const sessionOptions={
    secret:"secret-key",
    resave:false,
    saveUninitialized:true,
    store: MongoStore.create({
        mongoUrl: atlasUrl,
     
      })
    
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }))

app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')))
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.listen(3000, () => {
    console.log("server started");
});

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");

    res.locals.user=req.user;
    next();
})

//listing routes
app.use("/listing",listingRoutes);

//review routes
app.use("/listing/:id/review" ,reviewRoutes);

app.use("/" ,userRoutes);


//error handling middleware
app.use((err,req,res,next)=>{
    let{status=500,message="something went wrong"}=err;
    res.status(status).render("./includes/error.ejs",{message});

})

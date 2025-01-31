const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport")

let{saveRedirectedUrl}=require("../middleware.js");
router.get("/login",(req,res)=>{
    res.render("./user/login.ejs");
})

router.get("/signup",(req,res)=>{
    res.render("./user/signup.ejs");
})
router.post("/signup",async(req,res,next)=>{

    let{username,email,password}=req.body;
    let newUser=new User({email,username});
    await User.register(newUser,password);
    req.login(newUser,(err)=>{
        next(err);
        req.flash("success",`Welcome ${username}`);
    res.redirect("/listing");
    });
})
    


router.post("/login",saveRedirectedUrl,passport.authenticate("local" ,{failureRedirect:"login", failureFlash:true}),(req,res)=>{
    let{username}=req.body;
    req.flash("success",`Welcome Back ${username}`)

    const redirectUrl = res.locals.returnTo || "/listing"; 
    
    res.redirect(redirectUrl);

})

router.get("/logout", (req,res,next)=>{
   
    req.logout((err)=>{
        if(err) {
            return next(err)
        }
        req.flash("success","logged out successfully")
        res.redirect("/login")
    })
  
})


module.exports=router;
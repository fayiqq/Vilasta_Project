const cloudinary = require('cloudinary').v2

const {CloudinaryStorage}= require("multer-storage-cloudinary")

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API,
    api_secret:process.env.CLOUD_SECRET,
    
});

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder: "vilasta project",
        allowedFormats: ["jpg", "jpeg","png"]
    }
})

module.exports={cloudinary,storage};
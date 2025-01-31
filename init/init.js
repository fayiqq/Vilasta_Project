require("dotenv").config();
const mongoose=require("mongoose");
const listing=require("../models/listing");
const {data}=require("./data.js");
// const mongoDbUrl="mongodb://127.0.0.1:27017/airnb";
const atlasUrl=process.env.ATLAS_URL
async function main() {
   await mongoose.connect("mongodb+srv://fayiq:TYvenscjsiyDKW59@cluster0.7tjhg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    
}

console.log(data);


async function addData() {
   await listing.deleteMany({});
   let updatedData=data.map((e)=>({...e,owner:"679d076b11bcc1eb78bb772a"}))
   await listing.insertMany(updatedData);
   

   
}

(async () => {
   try {
       await main();
       await addData();
       console.log("Data added successfully!");
   } catch (err) {
       console.error("Error:", err);
   } finally {
       mongoose.connection.close(); // Close connection after operation
   }
})();




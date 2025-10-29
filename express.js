require('dotenv').config();
const express = require("express");
const app = express();
app.use(express.json());
const {StudentRouter} = require("./StudentRouter/index");
const {AdminRouter} = require("./AdminRouter/index");
const mongoose = require("mongoose");
app.use("/student" , StudentRouter);
app.use("/admin" , AdminRouter);
function main()
{
    try{
        mongoose.connect(process.env.MONGO_URL);
    app.listen(3000); 
    console.log("connected");
    }
    catch(e)
    { 
        console.log("Connection Problem Encountered ! : -" + e);
    }
} 
main();
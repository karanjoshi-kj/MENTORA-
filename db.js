const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);
const Schema = mongoose.Schema;

const Student = new Schema({
    Email : {unique : false , type : String} ,
    Password : String , 
    Name : String , 
    Dob : String , 
    Contact : {unique : true , type : Number} , 
    Address : String , 
    HSMaths : Number ,
    HSEnglish : Number ,
    HSScience : Number ,
    HSHindi : Number , 
    TTMaths : Number ,
    TTChemistry : Number ,
    TTPhysics : Number , 
    FeeStatus : Boolean , 
    Prefrence1 : String ,
    Prefrence2 : String ,
    Branch : String,
    Reciept : {
        data: Buffer,    
        contentType: String 
    }
});

const Admin = new Schema({
    Email : {unique : true , type : String} ,
    Password : String , 
    Name : String ,
});

const StudentModel = mongoose.model("Student", Student);
const AdminModel = mongoose.model("Admin" , Admin);

module.exports = {
    StudentModel,AdminModel
};
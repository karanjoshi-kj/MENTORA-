const express = require("express");
const { Router } = require("express");
const StudentRouter = Router();
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {StudentModel} = require("../db");
StudentRouter.use(express.json());
const {check} = require("../middleware/studentindex")
const cors = require("cors");
StudentRouter.use(cors());
const {STUDENT_SECRET} = require("../config");
StudentRouter.post("/signup" , async function(req,res)
{
    const safeobject = z.object({
            Name : z.string().min(1) , 
            Email : z.string().includes('@'),
            Password : z.string().min(9)
        });
        const finalobject = safeobject.safeParse(req.body);
        
        if(finalobject)
        {
            const Name = req.body.Name ; 
        const Email = req.body.Email ;
        const Password = req.body.Password;
    
        const hashedpassword = await bcrypt.hash(Password , 5);
    
        if(hashedpassword)
        {
            try{
                await StudentModel.create({
                    Name : Name , 
                    Email : Email , 
                    Password : hashedpassword,
                    FeeStatus : false , 
                    Prefrence1 : null , 
                    Prefrence2 : null , 
                    Branch : null ,
                    Reciept : null 
                });
                res.json({});
            }
            catch(e)
            {
                res.status(404).json({
                    msg : e
                });
            }
        }
        else
        {
            res.status(404).json({
                msg : "Error Occured while Signing Up !" 
            });
        }
        }
        else{
            res.status(404).json({
                msg : "Error Occured while Signing Up !" 
            });
        }
});
StudentRouter.post("/signin" , async function(req,res)
{
    const Email = req.body.Email ; 
    const Password = req.body.Password ; 

    try{
        const find = await StudentModel.findOne({
            Email : Email  
        }); 
        if(find)
        {   
            const check = await bcrypt.compare(Password , find.Password);
            if(check)
            {
                const token = await jwt.sign({
                    Id : find._id
                },STUDENT_SECRET);
                res.json({
                    token : token
                });
            }
            else
            {   
                 
                res.status(404).json({
                    msg : "Error Encountered while signing in ! haha"
                });
            }   
        }
        else
        {
            
            res.status(404).json({
                msg : "Error Encountered while signing in ! hihi"
            })
        }
    }
    catch(e)
    {
        console.log(e);
        res.status(404).json({
            msg : e
        });
    }
});
StudentRouter.post("/apply/seat" , async function(req,res){
    const safeobject = z.object({
        Dob : z.string() , 
        Contact : z.number(), 
        Address : z.string().min(1) ,
        HSMaths : z.number(), 
        HSEnglish : z.number(),
        HSScience :z.number(),
        HSHindi : z.number(), 
        TTMaths : z.number(),
        TTChemistry :z.number(),
        TTPhysics : z.number(),
        Prefrence1 : z.string(),
        Prefrence2 : z.string()  
    });
    const finalobject = safeobject.safeParse(req.body);
    const Email = req.body.Email;
    const Dob = req.body.Dob; 
    const Contact = req.body.Contact ; 
    const Address = req.body.Address;
    const HSMaths = req.body.HSMaths;
    const HSEnglish = req.body.HSEnglish;
    const HSScience = req.body.HSScience;
    const HSHindi = req.body.HSHindi;
    const TTMaths = req.body.TTMaths;
    const TTChemistry = req.body.TTChemistry;
    const TTPhysics  = req.body.TTPhysics;
    const Prefrence1 = req.body.Prefrence1 ;
    const Prefrence2 = req.body.Prefrence2 ;
    if(finalobject)
    {
        try{
             await StudentModel.updateOne(
                { Email: Email },              // Filter: which document to update
                { $set: { 
                         Dob : Dob , 
        Contact : Contact , 
        Address : Address ,
        HSMaths :  HSMaths ,
        HSEnglish : HSEnglish  ,
        HSScience : HSScience ,
        HSHindi : HSHindi , 
        TTMaths : TTMaths ,
        TTChemistry : TTChemistry ,
        TTPhysics : TTPhysics , 
        Prefrence1 : Prefrence1,
        Prefrence2 :  Prefrence2              
                } } // Update operation
            );    
            res.json({});
        }
        catch(e)
        {
            res.status(404).json({
            msg : "Error Encountered , Please Try Again !" 
        });
        }
    }
    else
    {
        res.status(404).json({
            msg : "Error Encountered , Please Try Again !" 
        });
    }
});
StudentRouter.use(check);
StudentRouter.get("/Profile/info" , async function(req,res)
{
    const StudentID = req.StudentID;
    try{
        const find = await StudentModel.findOne({
            _id : StudentID
        });

        if(find)
        {
            res.json({
                msg : find
            });
        }
        else
        {
            res.status(404).json({
                msg : "Error Encountered while Fetching the details of Student !"
            });
        }
    }
    catch(e)
    {
        res.status(404).json({
            msg : "Error Encountered while Fetching the details of Student !"
        });
    }
    
});
StudentRouter.post("/Payment/done" , async function(req,res)
{
    const StudentID = req.StudentID;
    try{
        await StudentModel.updateOne(
                { _id : StudentID },              // Filter: which document to update
                { $set: { 
                         FeeStatus : true             
                } } // Update operation
            );
            res.json({});
    }
    catch(e)
    {
        res.status(404).json({});
    }
});
StudentRouter.get("/paymentreciept/download", async function (req, res) {
const StudentID = req.StudentID;

  try {
    const student = await StudentModel.findOne({
        _id : StudentID
    });

    if (!student || !student.Reciept || !student.Reciept.data) {
        console.log("ihii")
      return res.status(404).json({ msg: "No receipt found" });
    }

    res.set({
      "Content-Type": student.Reciept.contentType,
      "Content-Disposition": `attachment; filename=receipt_${StudentID}.pdf`
    });

    res.send(student.Reciept.data);
  } catch (e) {
    console.log("error : - " + e);
  }
});
module.exports = {
    StudentRouter
};
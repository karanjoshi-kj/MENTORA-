const express = require("express");
const { Router } = require("express");
const AdminRouter = Router();
const bcrypt = require("bcrypt");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {StudentModel , AdminModel} = require("../db");
AdminRouter.use(express.json());
const {ADMIN_SECRET} = require("../config");
const {check} = require("../middleware/adminindex");
const cors = require("cors");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
AdminRouter.use(cors());
AdminRouter.post("/signup" , async function(req,res)
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
            await AdminModel.create({
                Name : Name , 
                Email : Email , 
                Password : hashedpassword,
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
AdminRouter.post("/signin" , async function(req,res)
{
    const Email = req.body.Email ; 
    const Password = req.body.Password ; 

    try{
        const find = await AdminModel.findOne({
            Email : Email  
        }); 
        if(find)
        {   
            const check = await bcrypt.compare(Password , find.Password);
            if(check)
            {
                const token = await jwt.sign({
                    Id : find._id
                },ADMIN_SECRET);
                res.json({
                    token : token
                });
            }
            else
            {   
                res.status(404).json({
                    msg : "Error Encountered while signing in !"
                });
            }   
        }
        else
        {
            res.status(404).json({
                msg : "Error Encountered while signing in !"
            })
        }
    }
    catch(e)
    {
        res.status(404).json({
            msg : e
        });
    }
});
AdminRouter.post("/paymentreciept/upload", upload.single("receipt"), async (req, res) => {
  try {
    const StudentID = req.body.StudentID;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    await StudentModel.updateOne(
      { _id: StudentID },
      {
        $set: {
          Reciept: {
            data: file.buffer, // <--- PDF/image as Buffer
            contentType: file.mimetype, // e.g. 'application/pdf'
          },
        },
      }
    );

    res.json({ msg: "Receipt uploaded successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error while uploading receipt" });
  }
});
AdminRouter.use(check);
AdminRouter.get("/candidates/info" , async function(req,res)
{
    try{
        const response = await StudentModel.find({});
        res.json({
            msg : response
        });
    }
    catch(e)
    {
        console.log(e);
        res.status(404).json({});
    }
});
AdminRouter.post("/branch/assign" , async function(req,res)
{
    const StudentID = req.body.StudentID;
    const branch = req.body.branch; 
    
    try{
        await StudentModel.updateOne(
                { _id: StudentID },              // Filter: which document to update
                { $set: { 
                    Prefrence1 : null , 
                    Prefrence2 : null , 
                    Branch : branch      
                } } // Update operation
            );
        res.json({});
    }
    catch(e)
    {
        res.status(404).json({});
    }
});
module.exports = {
    AdminRouter
};
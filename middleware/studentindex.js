const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
const {STUDENT_SECRET} = require("../config");

async function check(req,res,next)
{
    const token = req.headers.token;
        const verification = await jwt.verify(token , STUDENT_SECRET);
        if(verification)
        {
            req.StudentID = verification.Id;
            next();
        }
        else{
            res.status(404).json({});
        }
}

module.exports = {
    check
}
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
const {ADMIN_SECRET} = require("../config");

async function check(req,res,next)
{
    const token = req.headers.token;
        const verification = await jwt.verify(token , ADMIN_SECRET);
        if(verification)
        {
            req.AdminID = verification.Id;
            next();
        }
        else{
            res.status(404).json({});
        }
}

module.exports = {
    check
}
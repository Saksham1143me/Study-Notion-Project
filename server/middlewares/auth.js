const jwt=require('jsonwebtoken')
require('dotenv').config()
const User=require('../models/user')
exports.auth=async(req,res,next)=>{
    try {
        const token = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "");
    if(!token){
        return res.status(401).json({
          success:false,
          mesage:"token is missing"
        })
    }
    try {
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decode
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Token is Invalid"
        })
    }
    next()
} catch (error) {
    return res.status(401).json({
        success:false,
        message:"Error occured.Something went wrong while validating the token"
        })
    }
} 
  exports.isStudent=async (req,res,next)=>{
    try {
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected routes for Students"
            })
        }
        next()
    } catch (error) {
     return res.status(500).json({
        success:false,
        message:"User can't be verified"
     })   
    }
  }
  exports.isInstructor=async (req,res,next)=>{
    try {
		// const userDetails = await User.findOne({ email: req.user.email });
        // console.log(userDetails.accountType);   
        console.log('User Details in isInstructor:', req.user) 
        console.log(req.user.accountType);            
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected routes for Instructor"
            })
        }
        next()
    } catch (error) {
     return res.status(500).json({
        success:false,
        message:"User can't be verified"
     })   
    }
  }
  exports.isAdmin=async (req,res,next)=>{
    try {
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected routes for Admin"
            })
        }
        next()
    } catch (error) {
     return res.status(500).json({
        success:false,
        message:"User can't be verified"
     })   
    }}
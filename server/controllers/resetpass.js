const bcrypt=require("bcrypt")
// const { use } = require("bcrypt/promises")
const User=require("../models/user")
const mailSender=require('../utils/mailSender')
exports.resetPasswordToken=async (req,res)=>{
    try {
        
    const {email}=req.body
    const user=await User.findOne({email})
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User doesnt exist"
        })
    }
    const token=crypto.randomUUID()
    const updatedDetails=await User.findOneAndUpdate({email:email},{token:token,resetPasswordExpires:Date.now()+5*60*1000},{new:true})
    const url=`http://localhost:3000/update-password/${token}`
    console.log(url)
    console.log(email)
    const mailres=await mailSender(email,"Password reset Link",`Password Reset Link:${url}`)
    console.log(mailres)
    return res.json({
        success:true,
        message:"Email Sent Successfully"
    })
} catch (error) {
    return res.json({
        success:false,
        message:"Something Went Wrong"
    })
}
}

exports.resetPassword=async (req,res)=>{
    try{
    const {password,confirmPassword,token}=req.body
    if(password!==confirmPassword){
        return res.json({
            success:false,
            message:"both password must be same"
        })
    }
    const userDetails=User.findOne({token:token})
    if(!userDetails){
        return res.json({
            success:false,
            message:"Invalid token"

        })
    }
    if(userDetails.resetPasswordExpires > Date.now()){
        return res.json({
            success:false,
            message:"Token is expired.Please regenerate token"
        })
    }
    const hashedPass=await bcrypt.hash(password,10)
    await User.findOneAndUpdate({token},{password:hashedPass},{new:true})
    pass=undefined
    return res.status(200).json({
        success:true,
        message:"Passwords reset successfull"
    })}
    catch(err){
        console.log(err)
        return res.status(401).json({
            success:false,
            message:"Error occured while reseting password"
        })
    }
}
const User=require("../models/user")
const Otp=require("../models/otp")
const otpgenerator=require('otp-generator')
const bcrypt=require('bcrypt')
const Profile = require("../models/profile")
const jwt=require('jsonwebtoken')
const mailSender=require("../utils/mailSender")
const {passwordUpdated}=require("../mail/templates/passwordUpdate")
const otpTemplate = require("../mail/templates/emailVerificationTemplate");
const user = require("../models/user")
require('dotenv').config()
// sendOtp
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate OTP
    let otp = otpgenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    console.log("Generated OTP:", otp);

    // Ensure unique OTP
    let checkUniqueOtp = await Otp.findOne({ otp });
    while (checkUniqueOtp) {
      otp = otpgenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      checkUniqueOtp = await Otp.findOne({ otp });
    }

    // Save OTP to DB
    const otpPayload = { email, otp };
    await Otp.create(otpPayload);

    // Send OTP email
    const emailRes = await mailSender(
      email,
      "OTP FOR STUDYNOTION SIGNUP",
      otpTemplate(otp)
    );

    console.log("Email response:", emailRes);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error while sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Error while sending OTP",
    });
  }
};


exports.signup = async (req, res) => {
    try {
      // Destructure fields from the request body
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp,
      } = req.body
      // Check if All Details are there or not
      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !confirmPassword ||
        !otp
      ) {
        return res.status(403).send({
          success: false,
          message: "All Fields are required",
        })
      }
      // Check if password and confirm password match
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message:
            "Password and Confirm Password do not match. Please try again.",
        })
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists. Please sign in to continue.",
        })
      }
  
      // Find the most recent OTP for the email
      const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1)
      console.log(response)
      if (response.length === 0) {
        // OTP not found for the email
        return res.status(400).json({
          success: false,
          message: "The OTP is not valid",
        })
      } else if (otp !== response[0].otp) {
        // Invalid OTP
        return res.status(400).json({
          success: false,
          message: "The OTP is not valid",
        })
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10)
  
      // Create the user
      let approved = ""
      accountType === "Instructor" ? (approved = false) : (approved = true)
  
      // Create the Additional Profile For User
      const profileDetails = await Profile.create({
        gender:"Other",
        dateOfBirth: null,
        about: null,
        contactNumber: null,
      })
      const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password: hashedPassword,
        accountType: accountType,
        approved: approved,
        additionalDetails: profileDetails._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
      })
      const populatedUser = await User.findById(user._id).populate('additionalDetails').exec();
      return res.status(200).json({
        success: true,
        populatedUser,
        message: "User registered successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "User cannot be registered. Please try again.",
      })
    }
  }
exports.login=async (req,res)=>{
    try {
        const {email,password}=req.body;
        if(!password || !email){
            return res.status(403).json({
                success:false,
                message:"All fiels are required"
            })
        }
        const user=await User.findOne({email}).populate("additionalDetails")
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered.Please Signup first"
            })
        }
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"3d"})
            user.token=token
            user.password=undefined
            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Incorrect Password"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Login failed.Please try again later"
        })
        
    }
  }
exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id)
    const { oldPassword, newPassword } = req.body
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    console.log("Is Password Match:", isPasswordMatch);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse)
    } catch (error) {
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
  
}

// "password":"123456",
// "email":"4@gmail.com",
// "firstName":"2",
// "lastName":"2",
// "confirmPassword":"123456",
// "otp":"138985",
// "contact":"1234567890",
// "accountType":"Instructor"
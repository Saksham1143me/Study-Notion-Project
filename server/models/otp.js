const mongoose=require("mongoose")
const mailSender = require("../utils/mailSender")
const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
})

async function sendVerificationEmail(email,otp) {
    try {
        const mailRes=await mailSender(email,"Verification Email From StudyNotion",otp);
        console.log("Email sent successfully");
    } catch (error) {
        consoel.log("Error occured while sending mail")
        throw error;
    }
}
otpSchema.pre("save",async (next) => {
    await sendVerificationEmail(this.email,this.otp);
    next();
})
module.exports=mongoose.model("Otp",otpSchema)
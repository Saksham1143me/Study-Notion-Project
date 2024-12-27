const Ratingandreview=require("../models/ratingandreview")
const Course=require("../models/course")
const { default: mongoose } = require("mongoose")

exports.createRating=async(req,res)=>{
    try {
        const userId=req.user.id
        const {rating,review,courseId}=req.body
        const courseDetails=await Course.findOne({_id:courseId,studentsEnrollment:{$elemMatch:{$eq:userId}}})

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in course"
            })
        }
        const alreadyReveiwed=await Ratingandreview.findOne({user:userId,course:courseId})
        if(alreadyReveiwed){
            return res.status(403).json({
                success:false,
                message:"Course is already reviewd by user"
            })
        }
        const ratingReview=await Ratingandreview.create({rating,review,course:courseId,user:userId})
        console.log("rsatingn i",ratingReview)
       const updatedCourseDetails= await Course.findByIdAndUpdate(courseId,{
            $push:{ratingAndReviews:ratingReview._id}
        },{new:true})
        console.log(updatedCourseDetails)
        return res.status(200).json({
            success:true,
            message:"Course is successfully reviewed and rated",
            ratingReview
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error while rating course"
        })
    }
}
exports.getAvgRating=async(req,res)=>{
    try {
        const courseId=req.body.courseId
        const Result=await Ratingandreview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId)
                }
            },
            {
               $group:{
                   _id:null,
                   avgRating:{$avg:"$rating"},
               }
            }
        ])
        if(Result.length>0){
            return res.status(200).json({
                success:true,
              averageRating:Result[0].avgRating
            })
        }
            return res.status(200).json({
                success:true,
              averageRating:0,
              message:"No ratings found to this course"
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error while getting avg rating of course"
        })
    }
}
exports.getAllRatingReviews=async(req,res)=>{
    try {
        const allRatingReviews=await Ratingandreview.find({}).sort({rating:"desc"}).populate({
            path:"user",
              select:"firstName lastName email image"
           }).populate({
               path:"course",
               select:"courseName"
           }).exec()
         return res.status(200).json({
            success:true,
            message:"all reviews fetched successfully",
            data:allRatingReviews
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error while getting  rating and review  of course"
        })
    }
}
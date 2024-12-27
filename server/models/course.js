const mongoose=require("mongoose")
const courseSchema=new mongoose.Schema({
    courseName:{
        type:String
    },
    courseDescription:{
        type:String
    },
    whatYouWillLearn:{
        type:String
    },
     instructions:{
         type:[String]
     },
    tag: {
        type: [String],
        required: true,
    },
    status: {
        type: String,
        enum: ["Draft", "Published"],
      },
    price:{
        type:Number
    },
    thumbnail:{
        type:String
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }
    ],
    ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
    }],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    studentsEnrollment:[{
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: "User",
            }],
  createdAt: { type: Date, default: Date.now },


})
module.exports=mongoose.model("Course",courseSchema)
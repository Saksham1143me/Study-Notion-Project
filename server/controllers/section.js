const Section=require("../models/section")
const Course=require("../models/course")
const SubSection = require("../models/subsection")
const { populate } = require("../models/user")
const { default: mongoose } = require("mongoose")
 exports.createSection=async(req,res)=>{
    try {
        const {sectionName,courseId}=req.body
        // console.log("cid",courseId)
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            })
        }
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid courseId" });
          }
        const newSection=await Section.create({sectionName})
        const updatedCourse=await Course.findByIdAndUpdate(courseId,{$push:{
                                                               courseContent:newSection._id
                                                             }},{new:true}).populate
        ({
            path:"courseContent",
             populate:{
                path:"subSection",
             }
        })
                                                            // use populate to section and subsection
    return res.status(200).json({
        success:true,
        message:"Section created successfully",
        updatedCourse
    })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Section cant be created.Please try again",
            error:error.message
        })
    }
 }
 exports.updateSection=async(req,res)=>{
    try {
        const { sectionName, sectionId, courseId } = req.body
        const section = await Section.findByIdAndUpdate(
          sectionId,
          { sectionName },
          { new: true }
        )
        const course = await Course.findById(courseId)
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()
        console.log(course)
        res.status(200).json({
          success: true,
          message: section,
          data: course,
        })
      } catch (error) {
        console.error("Error updating section:", error)
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
      }
 }

 exports.deleteSection=async (req,res)=>{
  try {
    const { sectionId, courseId } = req.body
    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    })
    const section = await Section.findById(sectionId)
    console.log(sectionId, courseId)
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      })
    }
    // Delete the associated subsections
    await SubSection.deleteMany({ _id: { $in: section.subSection } })

    await Section.findByIdAndDelete(sectionId)

    // find the updated course and return it
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    })
  } catch (error) {
    console.error("Error deleting section:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
 }
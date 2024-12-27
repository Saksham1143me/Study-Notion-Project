const Course=require("../models/course")
const Category=require("../models/category")
const User=require("../models/user")
const CourseProgress=require("../models/courseprogress")
const {uploadImageToCloudinary} =require("../utils/imageUploader")
const Section=require("../models/section")
const Subsection=require("../models/subsection")
require("dotenv").config()
const {convertSecondsToDuration}=require("../utils/secToDuration")
const subsection = require("../models/subsection")
const { default: mongoose } = require("mongoose")
exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body
    // Get thumbnail image from request files
    const thumbnail = req.files.thumbnailImage

    // Convert the tag and instructions from stringified Array to Array
    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions)

    console.log("tag", tag)
    console.log("instructions", instructions)

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }
    if (!status || status === undefined) {
      status = "Draft"
    }
    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    })

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      })
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    )
    console.log(thumbnailImage)
    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    })

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    console.log("HEREEEEEEEE", categoryDetails2)
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    })
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })
  }
}

exports.showAllCourse=async(req,res)=>{
    try {
        const courses=await Course.find({},{courseName:true,courseDescription:true,price:true,instructor:true,ratingAndRewiews:true,studentsEnrollment:true,thumbnail:true}).populate("instructor").exec()
        console.log(courses)
        return res.status(200).json({
            success:true,
            message:" fetched course data successfully",
            courses
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"error while fetching course data",
            error:err.message
        })
    }
}
exports.editCourse = async (req, res) => {
    try {
      
      const { courseId } = req.body
      if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag") {
            course[key] = updates[key].split(" ")
          } 
          else if(key === "instructions"){
            course[key] = updates[key].split(",")
          }
            else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }
  exports.getInstructorCourses = async (req, res) => {
    try {
      const instructorId = req.user.id
        const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
        res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }
  exports.getCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
            // select: "-videoUrl",
          },
        })
        .exec()
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseId: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos || [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  exports.deleteCourse = async (req, res) => {
    try {
      console.log(req.body)
      const { courseId } = req.body
      console.log(courseId)
        const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
      const category=course.category
      console.log(category)
        await Category.findByIdAndUpdate(category,{
          $pull:{courses:courseId}
        })
        const studentsEnrolled = course.studentsEnrollment
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
      await User.findByIdAndUpdate(course.instructor,{
        $pull: { courses: courseId },
      })
        const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await Subsection.findByIdAndDelete(subSectionId)
          }
        }
          await Section.findByIdAndDelete(sectionId)
      }
        await Course.findByIdAndDelete(courseId)
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }
exports.searchCourses = async (req, res) => {
  try {
    const { searchQuery, token } = req.body;

    console.log("Search Query:", searchQuery);

    if (!searchQuery || searchQuery.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is required",
      });
    }

    // Verify the token and extract the user details
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key here
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Fetch the instructor from the database
    const instructor = await User.findById(decoded.id);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // Build the filter for fields that support $regex
    const filter = {
      $or: [
        { courseName: { $regex: searchQuery, $options: "i" } }, // Case-insensitive match
        { courseDescription: { $regex: searchQuery, $options: "i" } },
        { tags: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
        { status: { $regex: searchQuery, $options: "i" } },
      ],
    };

    // Fetch the courses and populate the instructor
    let courses = await Course.find(filter)
      .populate("instructor", "name email") // Populating instructor
      .populate("category", "name") // Populating category
      .exec();

    // If no courses are found
    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found matching the search query",
      });
    }

    // Return the matching courses
    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};
exports.deleteCourses = async (req, res) => {
  try {
    const { courseIds } = req.body;
    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ message: "No courses to delete" });
    }

    for (const courseId of courseIds) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: `Course with ID ${courseId} not found` });
      }
      const category=course.category
      console.log("category",category)
        await Category.findByIdAndUpdate(category,{
          $pull:{courses:courseId}
        })
      const studentsEnrolled = course.studentsEnrollment;
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        });
      }
      await User.findByIdAndUpdate(course.instructor,{
        $pull: { courses: courseId },
      })
      const courseSections = course.courseContent;
      for (const sectionId of courseSections) {
        const section = await Section.findById(sectionId);
        if (section) {
          const subSections = section.subSection;
          for (const subSectionId of subSections) {
            await Subsection.findByIdAndDelete(subSectionId);
          }
        }
        await Section.findByIdAndDelete(sectionId);
      }

      await Course.findByIdAndDelete(courseId);
    }

    return res.status(200).json({
      success: true,
      message: "Courses deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

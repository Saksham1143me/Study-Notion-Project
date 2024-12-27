const express = require("express")
const router = express.Router()
const {
  createCourse,
  showAllCourse,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
  deleteCourses,
  searchCourses
} = require("../controllers/course")
const {
  showAllcategories,
  createcategory,
  categoryPageDetails,
} = require("../controllers/category")
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/section")

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/subsection")
const {
  createRating,
  getAvgRating,
  getAllRatingReviews,
} = require("../controllers/ratingandreview")
const {
  updateCourseProgress,
  getProgressPercentage,
} = require("../controllers/courseProgress")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")
router.post("/createCourse", auth, isInstructor, createCourse)
router.post("/editCourse", auth, isInstructor, editCourse)
router.post("/searchCourse",searchCourses)
router.post("/addSection", auth, isInstructor, createSection)
router.post("/updateSection", auth, isInstructor, updateSection)
router.post("/deleteSection", auth, isInstructor, deleteSection)
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
router.post("/addSubSection", auth, isInstructor, createSubSection)
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.get("/getAllCourses", showAllCourse)
router.post("/getCourseDetails", getCourseDetails)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
router.delete("/deleteCourse", deleteCourse)
router.delete("/deleteCourses", deleteCourses)
router.post("/createCategory", auth, isInstructor, createcategory)
router.get("/showAllCategories", showAllcategories)
router.post("/getCategoryPageDetails", categoryPageDetails)
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAvgRating)
router.get("/getReviews", getAllRatingReviews)
module.exports = router

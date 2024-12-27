const category = require("../models/category")
const Category=require("../models/category")
const { findOne } = require("../models/user")
const { contactUsController } = require("./ContactUs")
function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
exports.createcategory=async(req,res)=>{
    try {
        const {name,description}=req.body
        console.log(req.user.accountType)
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const categoryDetails=await Category.create({name:name,description:description})
        console.log(categoryDetails)
        return res.status(200).json({
            success:true,
            message:"category created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"An error occured while creating category"
        })
    }
}

exports.showAllcategories = async (req, res) => {
  try {
    const allCategories = await Category.find({},{name:true,description:true,courses:true})
    res.status(200).json({
      success: true,
      data: allCategories,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      // console.log(categoryId)
      const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: 'courses',
        match: { status: 'Published' },
        populate: [
          {
            path: 'ratingAndReviews',
            model: 'RatingAndReview',
          },
          {
            path: "instructor",
            populate: {
              path: "additionalDetails",
            },
          },
        ],
      })
      .exec();
      // console.log("instructor voiiuyv",selectedCategory.courses)
      // console.log("instructor",selectedCategory.courses.instructor)
      // console.log("SELECTED COURSE", selectedCategory)
// console.log("after selected category")
      if (!selectedCategory) {
        // console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      if (!selectedCategory.courses.length) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
      .populate({
        path: 'courses',
        match: { status: 'Published' },
        populate: [
          {
            path: 'ratingAndReviews',
            model: 'RatingAndReview',
          },
          {
            path: "instructor",
            populate: {
              path: "additionalDetails",
            },
          },
        ],
      }).exec()
//         console.log("differentCategory",differentCategory)
// console.log("after difefrent category")
      const allCategories = await Category.find()
      .populate({
        path: 'courses',
        match: { status: 'Published' },
        populate: [
          {
            path: 'ratingAndReviews',
            model: 'RatingAndReview',
          },
          {
            path: "instructor",
            populate: {
              path: "additionalDetails",
            },
          },
        ],
      }).exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      // flatmap is same as forEach loop 
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold > a.sold)
        .slice(0, 10)
        // console.log("most Selling",mostSellingCourses)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
    
  }
  
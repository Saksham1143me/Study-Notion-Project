import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchCourseOnQuery, fetchInstructorCourses, deleteCourse, deleteCourses } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../common/iconBtn"
import CoursesTable from "./instructorCourses/coursesTable"
import { useRef } from "react"
import { BiSearch } from "react-icons/bi"
import toast from "react-hot-toast"
import { setLoading } from "../../../slices/authSlice"
import { RiDeleteBin6Line } from "react-icons/ri"
import ConfirmationModal from "../../common/confirmationModal"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const searchInputRef = useRef(null)
  const [selectedCourses, setSelectedCourses] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      const result = await fetchInstructorCourses(token)
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    }
    fetchCourses()
  },[])
//   const handleInputChange = async (e) => {
//     setSearchQuery(e.target.value.trim())
//     if (searchQuery !== "") {
//       setLoading(true)
//       const res = await fetchCourseOnQuery({ searchQuery, token })
//       if (res) {
//         setCourses(res)
//       }
//       setLoading(false)
//     } else {
//       setCourses(courses)
//     }
//   }
//   console.log(selectedCourses)

  

const handleDeleteCourses = async () => {
    setLoading(true)
  
    try {
      // Directly use the deleteCourses function from the API connector
      const result = await deleteCourses(selectedCourses, token)
  
      // Check if the result is successful, assuming it returns an object with a success field
      if (result && result.success) {
        toast.success("Selected courses deleted successfully")
  
        // Re-fetch courses after deletion
        const updatedCourses = await fetchInstructorCourses(token)
        setCourses([...updatedCourses])
      } else {
        // If result is falsy or doesn't indicate success
        toast.error("Failed to delete some courses")
      }
    } catch (error) {
      // Catch any errors and show error toast
      toast.error("An error occurred while deleting courses")
      console.error(error)
    } finally {
      // Cleanup actions
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }
  
  const isAllChecked = selectedCourses.length === courses.length && courses.length > 0;

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className=" text-3xl font-medium text-richblack-5">My Courses</h1>
       {courses.length>0 &&
        (<div className="flex items-center">
          <div className="relative bg-richblack-700 w-44 rounded-md">
            <BiSearch className="absolute top-3 ml-1 z-40 text-white" />
            <label htmlFor="searchCourses">
              <input
                ref={searchInputRef}
                // onChange={handleInputChange}
                name="searchCourses"
                id="searchCourses"
                value={searchQuery}
                placeholder="Search course by relative keyword or tag"
                className="w-40 pl-5 p-2 bg-transparent active:bg-richblack-700 focus:bg-blue-400 text-white rounded-md outline-none"
              />
            </label>
          </div>
        </div>)}
        { courses.length>0 &&
                <div className="flex gap-x-4 items-center">
          <div className="flex flex-col items-center justify-center"> 
             <label htmlFor="checkbox" 
             className="text-white text-sm">Select All</label>
          <input
            type="checkbox"
            name="checkbox"
            className="h-6 w-6"
            checked={isAllChecked}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedCourses(courses.map(course => course._id))
              } else {
                setSelectedCourses([])
              }
            }}
          /></div>
          <button
            onClick={selectedCourses.length>0?() => setShowDeleteConfirm(true): ()=>toast.error("No course selected")}
            className="bg-red-600 flex  text-pink-600 p-2 rounded-md hover:bg-red-700 transition duration-200"
          >
            <RiDeleteBin6Line size={20} />
            <span className="ml-2">Delete Selected</span>
          </button>
        </div>
}
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>

      {courses && <CoursesTable selectedCourses={selectedCourses} setSelectedCourses={setSelectedCourses} courses={courses} setCourses={setCourses} />}
      
      {/* Confirmation Modal */}
      {showDeleteConfirm && (
       <ConfirmationModal 
       modalData={{
         text1: `${selectedCourses?.length===1? selectedCourses.length+" "+"Course Is" : selectedCourses.length+" "+"Courses Are"} Selected`,
         text2: "Do You Want to Delete Selected Courses?",
         btn1Text: "Delete",
         btn2Text: "Cancel",
         btn1Handler: handleDeleteCourses,  // Pass the function reference
         btn2Handler: () => setShowDeleteConfirm(null)  // Pass the function reference wrapped in an anonymous function
       }}
     />
        
      )}
    </div>
  )
}

import { useDispatch, useSelector } from "react-redux";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../services/formatDate";
import { COURSE_STATUS } from "../../../../utils/constants";
import { deleteCourse, fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import toast from "react-hot-toast";
import ConfirmationModal from "../../../common/confirmationModal";

export default function CoursesTable({ courses, setCourses, selectedCourses, setSelectedCourses }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const TRUNCATE_LENGTH = 30;
  const { token } = useSelector((state) => state.auth);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [deletingCourseId, setDeletingCourseId] = useState(null);

  // Function to handle checkbox select/deselect
  const handleSelect = (courseId) => {
    setSelectedCourses((prevSelectedCourses) => {
      if (prevSelectedCourses.includes(courseId)) {
        // If the course is already selected, remove it
        return prevSelectedCourses.filter((id) => id !== courseId);
      } else {
        // If not selected, add it to the array
        return [...prevSelectedCourses, courseId];
      }
    });
  };

  const handleDeleteCourse = async (courseId) => {
    setLoading(true);
  
    try {
      // Directly use the deleteCourses function from the API connector
      const result = await deleteCourse(courseId, token);
  
      if (result) {  // Assuming result contains a 'success' property
        toast.success("Course deleted successfully");
        
        // Re-fetch courses after deletion
        const updatedCourses = await fetchInstructorCourses(token);
        setCourses(updatedCourses);
      }
    } catch (error) {
      toast.error("An error occurred while deleting the course");
      console.error(error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteBtn = (courseName, courseId) => {
    setShowDeleteConfirm(true);
    setDeletingCourse(courseName);
    setDeletingCourseId(courseId);
  };

  return (
    <>
      <Table className="rounded-xl border border-richblack-800">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Courses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Duration
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No courses found
              </Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              <Tr
                key={course._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
              >
                <Td className="flex flex-1 gap-x-4">
                  <input
                    type="checkbox"
                    className="h-6 w-6 top-[50%] relative"
                    checked={selectedCourses.includes(course._id)}  // Check if the course is selected
                    onChange={() => handleSelect(course._id)}  // Call handleSelect on change
                  />
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[148px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="text-lg font-semibold text-richblack-5">
                      {course.courseName}
                    </p>
                    <p className="text-xs text-richblack-300">
                      {course.courseDescription.split(" ").length >
                      TRUNCATE_LENGTH
                        ? course.courseDescription
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : course.courseDescription}
                    </p>
                    <p className="text-[12px] text-white">
                      Created: {formatDate(course.createdAt)}
                    </p>
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Drafted
                      </p>
                    ) : (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </div>
                        Published
                      </p>
                    )}
                  </div>
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  2hr 30min
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  ₹{course.price}
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`);
                    }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => handleDeleteBtn(course.courseName, course._id)}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {showDeleteConfirm && (
        <ConfirmationModal
          modalData={{
            text1: `Delete ${deletingCourse} Course?`,
            text2: "This lecture will be deleted",
            btn1Text: "Delete",
            btn2Text: "Cancel",
            btn1Handler: () => handleDeleteCourse(deletingCourseId),
            btn2Handler: () => setShowDeleteConfirm(false),
          }}
        />
      )}
    </>
  );
}

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {RxDropdownMenu} from "react-icons/rx"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import SubSectionModal from "./subSectionModal"
import ConfirmationModal from "../../../../common/confirmationModal"
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"

function NestedView ({handleChangeEditingSectionName}) {
 const {course}=useSelector((state)=>state.course)
 const {token}=useSelector((state)=>state.auth)
 const dispatch=useDispatch()
 const [addSubSection,setAddSubSection]=useState(null)
 const [viewSubSection,setViewSubSection]=useState(null)
 const [editSubSection,setEditSubSection]=useState(null)
 const [confirmationModal,setConfirmationModal]=useState(null)

 useEffect(()=>{
},[])
const handleDeleteSection=async (sectionId)=>{
  const result=await deleteSection({
    sectionId,
    courseId:course._id,
    token
  })
  if(result){
    dispatch(setCourse(result))
  }
  setConfirmationModal(null)
}
const handleDeleteSubSection=async(subSectionId,sectionId)=>{
  const result = await deleteSubSection({ subSectionId, sectionId, token })
  if (result) {
    // update the structure of course
    const updatedCourseContent = course.courseContent.map((section) =>
      section._id === sectionId ? result : section
    )
    const updatedCourse = { ...course, courseContent: updatedCourseContent }
    dispatch(setCourse(updatedCourse))
  }
  setConfirmationModal(null)
}
  return (
    <div>
      <div className="rounded-lg bg-richblack-700 p-6 px-8"
        id="nestedViewContainer">
        {course?.courseContent.map((section)=>(
            <details key={section?._id} open>
               <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                <div className="flex items-center gap-x-3">
                  <RxDropdownMenu className="text-2xl text-richblack-50"/>
                  <p className="font-semibold text-richblack-50">{section.sectionName}</p>
                </div>
                <div className="flex items-center gap-x-3">
                  <button
                  onClick={() =>
                    handleChangeEditingSectionName(
                      section._id,
                      section.sectionName
                    )
                  }>
                    <MdEdit className="text-xl text-richblack-300"/>
                  </button>
                  <button 
                  onClick={()=>{
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                    }}>
                    <RiDeleteBin6Line className="text-xl text-richblack-300"/>
                  </button>
                  <span className="font-medium text-richblack-300">|</span>
                <AiFillCaretDown className={`text-xl text-richblack-300`} />
                </div>
               </summary>
               <div>
                {
                section.subSection.map((data)=>(
                  <div
                  key={data?.id}
                  onClick={()=>{
                  setViewSubSection(data)
                }}
                  className="flex pl-4 pr-4 cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                  >
                  <div className="flex items-center gap-x-3 py-2 ">
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">
                      {data.title}
                    </p>
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-3"
                  >
                    <button
                      onClick={() =>
                        setEditSubSection({ ...data, sectionId: section._id })
                      }
                    >
                      <MdEdit className="text-xl text-richblack-300" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Sub-Section?",
                          text2: "This lecture will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                    >
                      <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                  </div>
                    </div>
                ))
                }
                <button
                onClick={() => setAddSubSection(section._id)}
                className="mt-3 flex items-center gap-x-1 text-yellow-50 p-1 text-sm"
              >
                <FaPlus className="text-sm" />
                <p>Add Lecture</p>
              </button>
                </div>
            </details>
        ))
        }
      </div>
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubSection}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : (
        <></>
      )}
      {/* Confirmation Modal */}
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}
    </div>
  )
}
export default NestedView
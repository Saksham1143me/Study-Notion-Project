import { useState } from "react"
import { useForm } from "react-hook-form"
import { IoAddCircleOutline } from "react-icons/io5"
import IconBtn from "../../../../common/iconBtn"
import { useDispatch, useSelector } from "react-redux"
import NestedView from "./nestedView"
import { MdNavigateNext } from "react-icons/md"
import { setCourse, setEditingCourse, setStep } from "../../../../../slices/courseSlice"
import toast from "react-hot-toast"
import { createSection, updateSection } from "../../../../../services/operations/courseDetailsAPI"

function CourseBuilderForm () {
    const {token}=useSelector((state)=>state.auth)
    const [loading, setLoading] = useState(false)
    const dispatch=useDispatch()
    const{course}=useSelector((state)=>state.course)
  const [editingSectionName, setEditingSectionName] = useState(null)
    const {
        register,
        handleSubmit,
        setValue,
        formState:{errors}
    }=useForm()

const onSubmit=async(data)=>{
   setLoading(true)
   let result;
   if(editingSectionName){
    result=await updateSection({
         sectionName:data.sectionName,
         sectionId:editingSectionName,
         courseId:course?._id,
    },token)
   }
   else{
    console.log(data.sectionName,course?._id)
    result=await createSection({
        sectionName:data.sectionName,
        courseId:course?._id,
    },token)
   }
   console.log("result",result)
   if(result){
    dispatch(setCourse(result))
    // localStorage.setItem("course",JSON.stringify(course))
    setEditingSectionName(null)
    setValue("sectionName","")
   }
   setLoading(false)
}


const cancelEdit=()=>{
setEditingSectionName(null)
setValue("sectionName","")
}


const goBack=()=>{
dispatch(setStep(1))
// localStorage.setItem("step",JSON.stringify(1))
dispatch(setEditingCourse(true))
}


const goToNext=()=>{
    if(course?.courseContent?.length===0){
        toast.error("Please add atleast one subsetion")
        return
    }
    if(course?.courseContent.some((section)=>section?.subSection?.length===0)){
        toast.error("Please add atleast one lecture in each section")
        return
    }
    dispatch(setStep(3))
    localStorage.setItem("step",JSON.stringify(3))
}

const handleChangeEditingSectionName=(sectionId,sectionName)=>{
    if(editingSectionName===sectionId){
        cancelEdit()
    }
    setEditingSectionName(sectionId)
    setValue("sectionName",sectionName)
}
  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
    <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style rounded-md p-2 bg-richblack-700 text-white w-full"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
          <IconBtn
            type="submit"
            disabled={loading}
            text={editingSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {editingSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

        {
            course?.courseContent?.length>0 &&(
                <NestedView
                handleChangeEditingSectionName={handleChangeEditingSectionName}
                />
            )
        }
             <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>

    </div>
  )
}
export default CourseBuilderForm
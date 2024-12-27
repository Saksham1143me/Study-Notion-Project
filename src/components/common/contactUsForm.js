import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { apiConnector } from "../../services/apiConnector"
import { contactusEndpoint } from "../../services/apis"
import CountryCode from "../../data/countrycode.json"
import Loader from "./loader"
function ContactUsForm () {
    const [selectedIndex,setSelectedIndex]=useState(0)
    // console.log(CountryCode[selectedIndex])
    const [loading,setLoading]=useState(false)
    const {
        register,
        handleSubmit,
        reset,
       formState:{errors,isSubmitSuccessful}
    }=useForm()

useEffect(()=>{
    if(isSubmitSuccessful){
        reset({
            email:"",
            firstName:"",
            lastName:"",
            message:"",
            phoneNo:""
        },[isSubmitSuccessful,reset])
    }
})
const submitHandler=async(data)=>{
try {
      setLoading(true)
      const res = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      )
      console.log("Email Res - ", res)
      setLoading(false)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
      setLoading(false)
    }
}
  return (
    <div>
    { loading?<Loader/>:
      <form onSubmit={handleSubmit(submitHandler)} 
      className="flex flex-col gap-7"
      >
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="lable-style">
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter first name"
            className="form-style bg-richblack-700 text-richblack-25 p-2 rounded-md"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please enter your name.
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="lable-style">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter last name"
            className="form-style  bg-richblack-700 text-richblack-25 p-2 rounded-md"
            {...register("lastname")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="lable-style">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          className="form-style  bg-richblack-700 text-richblack-25 p-2 rounded-md"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Email address.
          </span>
        )}
      </div>

{/* phoneNO */}
<div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="lable-style">
          Phone Number
        </label>
<div className="flex gap-5">
          <div className="flex w-[81px] flex-col gap-2">
            <select
              type="text"
              name="countryCode"
              id="countryCode"
              className="form-style  bg-richblack-700 font-semibold  text-richblack-25 p-2 rounded-md"
              {...register("countrycode", { required: true })}
              onChange={(e) => {
                 setSelectedIndex(CountryCode.findIndex(
                  (ele) => ele.code === e.target.value
                ));}}
            >
              {
              CountryCode.sort((a, b) =>
               a.country.localeCompare(b.country))
               .map((ele, i) => {
         return (
              <option key={i} value={ele.code}>
              {ele.code} - {ele.country}
           </option>
          );
               })}

            </select>
          </div>
          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type="number"
              name="phonenumber"
              id="phonenumber"
              maxLength={selectedIndex}
              placeholder="00000 00000"
              className="form-style no-arrows  bg-richblack-700   text-richblack-25 p-2 rounded-md"
              {...register("phoneNo", {
                required: {
                  value: true,
                  message: "Please enter your Phone Number.",
                },
                // validate: (value) => {
                //   const maxLength = CountryCode[selectedIndex]?.length || 10; // Get the length for the selected country
                //   return value.length === maxLength || `Invalid Phone Number. It must be ${maxLength} digits long.`;
                // },
              })}
              onWheel={(e) => e.target.blur()} // Disable increment/decrement on scroll
              inputMode="numeric" // Ensure only numeric input
            />
          </div>
        </div>
        {errors.phoneNo && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            {`Invalid Phone Number. It must be ${CountryCode[selectedIndex].length} digits long.`}
          </span>
        )}
      </div>
{/* message */}
<div className="flex flex-col gap-2">
        <label htmlFor="message" className="lable-style">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="7"
          placeholder="Enter your message here"
          className="form-style  bg-richblack-700 text-richblack-25 p-2 rounded-md"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your Message.
          </span>
        )}
      </div>

      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `}
      >
        Send Message
      </button>
      </form>
        }
    </div>
  )
}
export default ContactUsForm
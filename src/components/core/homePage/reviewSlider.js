import { Autoplay, FreeMode, Pagination } from "swiper"
import { Swiper,SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
// import "../../App.css"
import { useEffect, useState } from "react"
import { apiConnector } from "../../../services/apiConnector"
import { ratingsEndpoints } from "../../../services/apis"
import toast from "react-hot-toast"
import { FaStar } from "react-icons/fa"
import ReactStars from "react-rating-stars-component"
function ReviewSlider () {
  const [reviews,setReviews]=useState([])
  const truncateWords=15
  useEffect(()=>{
    const allReviews=async()=>{
      const toastId = toast.loading("Loading...")
      let success = false
      try {
        const response = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
        console.log("GET RATING API RESPONSE............", response)
        if (!response?.data?.success) {
          throw new Error("Could Not Get Rating")
        }
        success = true
        setReviews(response?.data?.data)
        console.log(response?.data?.data)
      } catch (error) {
        success = false
        console.log("CREATE RATING API ERROR............", error)
        toast.error(error.response?.data.message)
      }
      toast.dismiss(toastId)
      return success
    }
    allReviews()
   },[])
  return (
    <div className="text-white w-11/12 h-full">
    <div className="my-[50px] h-[184px]  max-w-maxContentTab lg:max-w-maxContent">
      <Swiper
        breakpoints={{
          // When window width is >= 320px
          320: {
            slidesPerView: 1,
          },
          // When window width is >= 480px
          480: {
            slidesPerView: 2,
          },
          // When window width is >= 768px
          768: {
            slidesPerView: 3,
          },
          // When window width is >= 1024px
          1024: {
            slidesPerView: 4,
          },
        }}
        spaceBetween={25}
        loop={true}
        freeMode={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="w-full"
      >
        {reviews.map((review, i) => {
          return (
            <SwiperSlide key={i}>
              <div className=" flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                    }
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                    <h2 className="text-[12px] font-medium text-richblack-500">
                      {review?.course?.courseName}
                    </h2>
                  </div>
                </div>
                <p className="font-medium text-richblack-25">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review?.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")} ...`
                    : `${review?.review}`}
                </p>
                <div className="flex items-center gap-2 ">
                  <h3 className="font-semibold text-yellow-100">
                    {review.rating.toFixed(1)}
                  </h3>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          )
        })}
        {/* <SwiperSlide>Slide 1</SwiperSlide> */}
      </Swiper>
    </div>
  </div>

  )
}
export default ReviewSlider
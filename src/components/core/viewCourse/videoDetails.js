import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"
import IconBtn from "../../common/iconBtn"
import "video-react/dist/video-react.css"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
function VideoDetails () {
    const [previewSource, setPreviewSource] = useState("")
     const {courseId,sectionId,subSectionId}=useParams()
     const navigate=useNavigate()
     const dispatch=useDispatch()
     const playerRef=useRef(null)
     const {token}=useSelector((state)=>state.auth)
     const {courseSectionData,courseEntireData,completedLectures}=useSelector((state)=>state.viewCourse)
     const [videoEnded,setVideoEnded]=useState(false)
     const [videoData,setVideoData]=useState(null)
     const [loading,setLoading]=useState(null)
     const location=useLocation()
     useEffect(() => {
      const setSpecificVideoDetails = () => {
        if (!courseSectionData) {
          return;
        }
    
        if (!courseId || !sectionId || !subSectionId) {
          navigate("/dashboard/enrolled-courses");
        } else {
          const filteredSection = courseSectionData?.filter(
            (section) => section?._id === sectionId
          );
    
          if (filteredSection?.length > 0) {
            const filteredVideoData = filteredSection[0]?.subSection?.filter(
              (subSection) => subSection?._id === subSectionId
            );
    
            if (filteredVideoData?.length > 0) {
              setVideoData(filteredVideoData[0]);
            }
          }
    
          setPreviewSource(courseEntireData?.thumbnail);
          setVideoEnded(false);
        }
      };
    
      setSpecificVideoDetails();
    }, [location.pathname, courseEntireData, courseSectionData]);
    
    const isFirstVideo=()=>{
        const currentSectionIndex=courseSectionData.findIndex((section)=>
            section._id===sectionId
        )
        const currentSubSectionIndex=courseSectionData[currentSectionIndex]?.subSection.findIndex((subSection)=>
            subSection._id===subSectionId
        )
        if(currentSectionIndex===0 && currentSubSectionIndex===0){
            return true
        }
        else{
            return false
        }
    }

    const isLastVideo=()=>{
        const currentSectionIndex=courseSectionData.findIndex((section)=>
            section._id===sectionId
        )
        const currentSubSectionIndex=courseSectionData[currentSectionIndex]?.subSection.findIndex((subSection)=>
            subSection._id===subSectionId
        )
        const totalNoOfSubSections=courseSectionData[currentSectionIndex]?.subSection?.length
        if(currentSectionIndex===courseSectionData.length-1 && currentSubSectionIndex===totalNoOfSubSections-1){
            return true
        }
        else{
            return false
        }
    }

    const goToNextVideo=()=>{
        const currentSectionIndex=courseSectionData.findIndex((section)=>
            section._id===sectionId
        )
        const currentSubSectionIndex=courseSectionData[currentSectionIndex]?.subSection.findIndex((subSection)=>
            subSection._id===subSectionId
        )
        const totalNoOfSubSections=courseSectionData[currentSectionIndex]?.subSection?.length

        if(currentSubSectionIndex!==totalNoOfSubSections-1){
            const nextSubSectionId=courseSectionData[currentSectionIndex]?.subSection[currentSubSectionIndex+1]
            ._id
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
        }

        else{
            const nextSectionId=courseSectionData[currentSectionIndex+1]._id
            const firstSubSectionId=courseSectionData[currentSectionIndex+1].subSection[0]._id
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${firstSubSectionId}`)
          }
          console.log(completedLectures?.includes(currentSubSectionIndex))
        if(!completedLectures?.includes(courseSectionData[currentSectionIndex]?.subSection[currentSubSectionIndex]
          ._id)){
          handleLectureCompletion()
          }
    }
    const goToPrevVideo=()=>{
        const currentSectionIndex=courseSectionData.findIndex((section)=>
            section._id===sectionId
        )
        const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex((subSection)=>
            subSection._id===subSectionId
        )
        if(currentSubSectionIndex!==0){
            const prevSubSectionId=courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex-1]
            ._id
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
        }

        else{
            const prevSectionId=courseSectionData[currentSectionIndex-1]._id
            const prevSectionLength=courseSectionData[currentSectionIndex-1].subSection?.length
            const lastSubSectionId=courseSectionData[currentSectionIndex-1].subSection[prevSectionLength-1]._id
            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${lastSubSectionId}`)
        }
        console.log(completedLectures?.includes(currentSubSectionIndex))
        if(!completedLectures?.includes(courseSectionData[currentSectionIndex]?.subSection[currentSubSectionIndex]
          ._id)){
          handleLectureCompletion()
          }
    }
    const handleLectureCompletion=async()=>{
        setLoading(true)
        const res = await markLectureAsComplete(
          { courseId: courseId, subsectionId: subSectionId },
          token
        )
        if (res) {
          dispatch(updateCompletedLectures(subSectionId))
        }
        setLoading(false)
    }
  return (
    <div>
        <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />
          {/* Render When Video Ends */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    // set the current time of the video to 0
                    playerRef?.current?.seek(0)
                    playerRef?.current?.play()
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
    </div>
  )
}
export default VideoDetails
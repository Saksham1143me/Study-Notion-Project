import { NavLink } from "react-router-dom"
import {    FaArrowRight} from "react-icons/fa"
import HighlightText from "../components/core/homePage/highlightText"
import CTAButton from "../components/core/homePage/cTAButton"
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from "../components/core/homePage/codeBlocks"
import TimelineSection from "../components/core/homePage/TimelineSection"
import LearningLanguageSection from "../components/core/homePage/LearningLanguageSection"
import ReviewSlider from "../components/core/homePage/reviewSlider"
import InstructorSection from "../components/core/homePage/instructorSection"
import Footer from "../components/common/foter"
import ExploreMore from "../components/core/homePage/exploreMore"
function Home () {
  return (
    <div>
      {/* section1 */}
      <div className="relative group mx-auto  flex flex-col w-9/12 max-w-maxContent items-center text-white justify-between">
        <NavLink to="/signup">
        <div className="mx-auto w-fit mt-16 p-1 rounded-full bg-richblack-800 border-2 border-richblack-800 font-bold text-richblack-200 transition-all duration-200 
        hover:scale-95  group-hover:bg-richblack-900">
            <div className="flex gap-1 items-center rounded-full px-10 py-[5px] transition-all duration-200">
                <p>Become An Instructor</p>
                <FaArrowRight/>
            </div>
        </div>
        </NavLink>
        <div className="w-fit flex gap-1 text-4xl text-center font-semibold mt-7">
          Empower Your Future With
          <HighlightText text={"Coding Skills"}></HighlightText>
        </div>
        <div className="mt-4 w-[90%] text-center  text-lg font-bold text-richblack-200">
          With Our online coding courses, you can learn at your own pace,from anywhere in the world, and get access to a 
          wealth of resources, including honds-on projects, quizzes,and personalized feedback from instructors
        </div>
        <div className="mt-8 flex gap-7">
          <CTAButton active={true} linkto={"/signup"}>Learn more</CTAButton>
          <CTAButton active={false} linkto={"/login"}>Book a Demo</CTAButton>
        </div>
        <div className="mx-3 my-12 shadow-[10px_-5px_50px_-5px] shadow-blue-200 ">
          <video muted loop autoPlay className="shadow-[20px_20px_10px_rgba(255,255,255)]">
            <source src={Banner} type="video/mp4"/>
            </video>
        </div>

        {/* codesection1: */}

        <div>
          <CodeBlocks 
          position={"lg:flex-row justify-between"}
          heading={<div className="text-4xl font-semibold">Unlock Your <HighlightText text={"Coding Courses"}></HighlightText>With Our Online Courses</div>}
          subHeading={"Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."}
          ctabtn1={
            {btnText:"Try it yourself",
             linkto:"/signup",
            active:true
            }
          }
          ctabtn2={
            {btnText:"Learn more",
             linkto:"/login",
            active:false
            }
          }
          codeColor={"text-white"}
            codeBlock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> \n<a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          ></CodeBlocks>
          {/* npm i react-type-animation */}
        </div>
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subHeading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              linkto: "/signup",
              active: false,
            }}
            codeColor={"text-white"}
            codeBlock={` import React from "react";\nimport CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>
            <ExploreMore/>
      </div>
      {/* section2 */}
      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[310px]">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto">
          <div className="h-[150px]"></div>
              <div className="flex flex-row gap-7 text-white">
                <CTAButton active={true} linkto={"/signup"}>
                <div className=" flex items-center gap-2">
                Explore Full Catalog
                <FaArrowRight/>
                </div>
                </CTAButton>
                <CTAButton active={false} linkto={"/signup"}>
                <div>
                Learn More
                </div>
                </CTAButton>
              </div>
          </div>
         
        </div>
        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between ma-auto gap-7">
             <div className=" flex gap-5 flex-row mb-10 mt-[95px]">
                  <div className="text-4xl font-semibold w-[45%]">
                    Get The Skills You Need For a 
                    <HighlightText text={"Job that is in Demand"}></HighlightText>
                  </div>
             <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className="text-[16px]">
             The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
                </div>
                <CTAButton active={true}  linkto={"/signup"}>
                   Learn More
                  </CTAButton> 
                </div>
             </div>
        <TimelineSection/>
        <LearningLanguageSection/>
        </div>
      </div>
      {/* section3 */}
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Become a instructor section */}
        <InstructorSection />

        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>
      {/* section4 */}
      {/* Footer */}
      <Footer/>
    </div>
  )
}
export default Home
import React, { useState, useEffect} from "react";
import CTAButton from "./cTAButton";
import { FaArrowRight } from "react-icons/fa";

const CodeBlocks = ({
  position,
  heading,
  subHeading,
  ctabtn1,
  ctabtn2,
  codeColor,
  codeBlock,
  backgroundGradient
}) => {
  const [displayedCode, setDisplayedCode] = useState(""); // For animated text
  const [showCursor, setShowCursor] = useState(true); // For blinking cursor

  useEffect(() => {
    let currentIndex = 0;
    let animationFrame;

    const animateCode = () => {
      if (currentIndex < codeBlock.length) {
        setDisplayedCode((prev) => prev + codeBlock[currentIndex]);
        currentIndex++;
        animationFrame = setTimeout(animateCode, 100); // Adjust typing speed
      }
    };

    // Clear previous animation and start new
    setDisplayedCode("");
    animateCode();

    return () => {
      clearTimeout(animationFrame); // Cleanup timeout
    };
  }, [codeBlock]);

  // Blink the cursor every 700ms
  useEffect(() => {
    const cursorBlink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 700);

    return () => clearInterval(cursorBlink); // Cleanup interval
  }, []);

  return (
    <div className={`flex ${position} my-20 justify-between flex-col lg:gap-16 gap-10`}>
      {/* Section 1 */}
      <div className="w-[100%] lg:w-[50%] flex flex-col gap-8">
        {heading}
        {/* Sub Heading */}
        <div className="text-richblack-300 text-base font-bold w-[85%] -mt-3">
          {subHeading}
        </div>
        {/* Button Group */}
        <div className="flex gap-7 mt-7">
          <CTAButton active={ctabtn1?.active} linkto={ctabtn1?.linkto}>
            <div className="flex items-center gap-2">
              {ctabtn1?.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>
          <CTAButton active={ctabtn2?.active} linkto={ctabtn2?.linkto}>
            {ctabtn2?.btnText}
          </CTAButton>
        </div>
      </div>

      {/* Section 2 */}
      <div className="h-fit code-border flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]">
        {backgroundGradient}

        {/* Indexing */}
        <div className="text-center flex flex-col w-[10%] select-none text-richblack-400 font-inter font-bold">
          {[...Array(11)].map((_, index) => (
            <p key={index}>&nbsp;{index + 1}</p>
          ))}
        </div>

        {/* Code Block with Cursor */}
        <div className={`w-[90%] h-14 flex flex-col font-bold font-mono ${codeColor} pr-1`}>
          <pre>
            {displayedCode}
            <span className={`${showCursor ? "opacity-100" : "opacity-0"} text-lg text-white`}>|</span>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;

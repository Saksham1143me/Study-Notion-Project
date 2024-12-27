import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"
import { BsFileX } from "react-icons/bs"
Chart.register(...registerables)
function InstructorChart ({courses}) {

    const generateRandomColors=(numColors)=>{
        const colors = []
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)})`
      colors.push(color)
    }
    return colors
    }

    const [currentChart,setCurrentChart]=useState("Students")
    const chartDataForStudents = {
        labels: courses.map((course) => course.courseName),
        datasets: [
          {
            data: courses.map((course) => course.totalStudentsEnrolled),
            backgroundColor: generateRandomColors(courses.length),
          },
        ],
      }
    
      // Data for the chart displaying income information
      const chartDataForIncome = {
        labels: courses.map((course) => course.courseName),
        datasets: [
          {
            data: courses.map((course) => course.totalAmountGenerated),
            backgroundColor: generateRandomColors(courses.length),
          },
        ],
      }

      const options = {
        responsive: true,
        plugins: {
          legend: {
            text:"bold",
            position: 'top',
            labels: {
                padding: 10, // Reduces space between the legend and the pie chart
                font: {
                  size: 14, // Adjusts font size
                  weight: 'bold', // Makes the font bold
                  family: 'Arial', // Changes font family (optional)
                  color: '#FF5733', // Sets label text color to a specific value (can be any CSS color)
                },
              },
            },
          tooltip: {
            enabled: true,
          },
        },
        elements: {
          arc: {
            borderWidth: 2,
          },
        },
        cutout: 0,
        responsive: true,
        maintainAspectRatio: false,
      };
  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      <div className="space-x-4 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrentChart("Students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currentChart === "Students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrentChart("Income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currentChart === "Income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>
      <div className="relative left-[40%] bottom-[10%]  aspect-square h-6/12 w-6/12">
        {/* Render the Pie chart based on the selected chart */}
        <Pie
          data={currentChart === "Students" ? chartDataForStudents : chartDataForIncome}
          options={options}
        />
      </div>
    </div>
  )
}
export default InstructorChart
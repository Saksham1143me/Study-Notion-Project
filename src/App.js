import { useEffect } from "react"
import "./App.css"
// Redux
import { useDispatch, useSelector } from "react-redux"
// React Router
import { Route, Routes, useNavigate } from "react-router-dom"

// Components
import Navbar from "./components/common/navbar"
import OpenRoute from "./components/core/Auth/openRoute"
import PrivateRoute from "./components/core/Auth/privateRoute"
import AddCourse from "./components/core/dashboard/addCourse/index"
import Cart from "./components/core/dashboard/cart/index"
import EditCourse from "./components/core/dashboard/editCourse/index"
import EnrolledCourses from "./components/core/dashboard/enrolledCourses"
import MyCourses from "./components/core/dashboard/myCourses"
import MyProfile from "./components/core/dashboard/myProfile"
import Settings from "./components/core/dashboard/Settings"
import InstructorDashboard from "./components/core/dashboard/instructorDashboard/instructorDashboard"
import VideoDetails from "./components/core/viewCourse/videoDetails"
import About from "./pages/about"
import Catalog from "./pages/catalog"
import Contact from "./pages/contact"
import CourseDetails from "./pages/courseDetails"
import Dashboard from "./pages/dashboard"
import Error from "./pages/error"
// Pages
import Home from "./pages/home"
import Login from "./pages/login"
import Signup from "./pages/signup"
import UpdatePassword from "./pages/updatePass"
import VerifyEmail from "./pages/verifyEmail"
import ViewCourse from "./pages/viewCourse"
import { getUserDetails } from "./services/operations/profileAPI"
import { ACCOUNT_TYPE } from "./utils/constants"
import ForgotPassword from "./pages/forgotPassword"
import { setUser } from "./slices/profileSlice"
function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {user}  = useSelector((state) => state.profile)
  // console.log("User:", user);
  // console.log("Account Type:", user?.accountType);  
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user")); // Get user details from localStorage
  
    // Only fetch user details if the token is available and no user data is in localStorage
    if (token && !storedUser) {
      dispatch(getUserDetails(token, navigate));
    } else if (storedUser) {
      // If user data exists in localStorage, set the user data in Redux
      dispatch(setUser(storedUser));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        {/* Open Route - for Only Non Logged in User */}
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
            <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
             </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
             </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
             </OpenRoute>
          }
        />
        {/* Private Route - for Only Logged in User */}
        <Route
          element={
            <PrivateRoute>
               <Dashboard />
             </PrivateRoute>
          }
        >
          {/* Route for all users */}
          <Route path="dashboard/my-profile" element={
            <MyProfile />
            } />
          <Route path="dashboard/Settings" element={<Settings />} />
          {/* Route only for Instructors */}
          {user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<InstructorDashboard />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
          {/* Route only for Students */}
          {user && user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route path="/dashboard/cart" element={<Cart />} />
            </>
          )}
          <Route path="dashboard/settings" element={<Settings />} />
        </Route>

        {/* For the watching course lectures */}
        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          {user && user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route>

        404 Page
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}

export default App

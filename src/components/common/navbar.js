import { Link, matchPath, NavLink, useLocation } from "react-router-dom"
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from '../../data/navbar-links'
import { useSelector } from "react-redux"
import {AiOutlineMenu, AiOutlineShoppingCart} from "react-icons/ai"
import {BsChevronDown} from "react-icons/bs"
import { useEffect, useState } from "react"
import { apiConnector } from "../../services/apiConnector"
import { categories } from "../../services/apis"
import ProfileDropdown from "../core/Auth/profileDropDown"
import Loader from "./loader"
function Navbar () {

    const {token}=useSelector((state)=>state.auth)
    const {user}=useSelector((state)=>state.profile)
    // console.log(user)
    // console.log(useSelector((state) => state));
    const totalItems=useSelector((state)=>state.cart)
    const location=useLocation()
    const [subLinks,setSubLinks]=useState([])
  const [loading, setLoading] = useState(false)
    useEffect(() => {
      ;(async () => {
        setLoading(true)
        try {
          const res = await apiConnector("GET", categories.CATEGORIES_API)
          console.log(res.data.data)
          setSubLinks(res.data.data)
        } catch (error) {
          console.log("Could not fetch Categories.", error)
        }
        setLoading(false)
      })()
    }, [])
    const matchRoute=(route)=>{
           return matchPath({path:route},location.pathname)
    }
  return (
    <div className="flex h-14 items-centre justify-center border-b-[1px] border-b-richblack-700">
    <div className="w-11/12 flex max-w-maxContent items-center justify-between ">
      <NavLink to="/">
      <img src={logo} alt="logo" w={160} h={42} loading="lazy"></img>
      </NavLink>
      <nav>
        <ul className="flex gap-x-6 text-richblack-25">
          {    
          NavbarLinks.map((link,index)=>(
             <li key={index}>
            {link.title==="Catalog" ?(
              <div className="relative flex items-center gap-2 group">
                <p>{link.title}</p>
               <BsChevronDown />
               <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-2 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
               <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
               {loading ? (
                          <Loader/>
                        ) : subLinks?.length ? (
                          <>
                            {subLinks
                              .filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              .map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(/[\s/]+/)
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-1 pl-1 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
               </div>
              </div>
            )
            :
            (<NavLink to={link?.path}>
                <p className={`${matchRoute(link?.path)?"text-yellow-25":"text-richblack-25"}`}>{link.title}</p>
            </NavLink>)
            }
              </li>
  ))}
        </ul>
      </nav>
      {/* Login,signup,dashboard */}
      <div className="flex items-center gap-x-4">

          {
          user&&user?.accountType!=="Instructor" &&
          (
             <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100"/>
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
             </Link>
          )
          }
          {
            token===null &&(
              <Link to="/login">
               <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
              </Link>
            )
          }
          {
            token===null &&(
              <Link to="/signup">
               <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
              </Link>
            )
          }
          {
            token!==null &&<ProfileDropdown></ProfileDropdown>
          }

      </div>
      <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
    </div>
    </div>
  )
}
export default Navbar
import { useSelector } from "react-redux"
import Loader from "../components/common/loader"
import Sidebar from "../components/core/dashboard/sidebar"
import { Outlet } from "react-router-dom"

function Dashboard () {
    const {loading:authLoading}=useSelector((state)=>state.auth)
    const {loading:profileLoading}=useSelector((state)=>state.profile)
    if(profileLoading || authLoading){
        return(
            <Loader></Loader>
        )
    }
  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <div className="lg:opacity-100 lg:w-max opacity-0 w-0">
      <Sidebar />
        </div>
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
export default Dashboard
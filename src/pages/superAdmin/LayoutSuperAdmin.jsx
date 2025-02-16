import { SuperAdminSidebar } from "@/components"
import withBaseTopping from "@/hocs/WithBaseTopping"
// import { getRoles } from "@/redux/actions"
import path from "@/ultils/path"
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const LayoutSuperAdmin = ({ dispatch }) => {
  const { current } = useSelector((s) => s.user)
  //   if (!current || +current.role !== 1010)
  //     return <Navigate to={`/${path.LOGIN}`} replace={true} />
  useEffect(() => {
    // dispatch(getRoles())
  }, [])
  return (
    <div className="grid grid-cols-12 gap-3 overflow-hidden max-h-screen">
      <div className="col-span-2 bg-white max-h-screen overflow-y-auto">
        <SuperAdminSidebar />
      </div>
      <div className="col-span-10 bg-white max-h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>

  )
}

export default withBaseTopping(LayoutSuperAdmin)

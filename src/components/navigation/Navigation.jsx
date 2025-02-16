import React, { memo, useEffect, useRef, useState } from "react"
import { Link, NavLink, useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"
// import avatarDefault from '@/assets/dfavatar.jpg'
import { logout } from "@/redux/userSlice"
import withBaseTopping from "@/hocs/WithBaseTopping"
import path from "@/ultils/path"
import { menu } from "@/ultils/constant"
import clsx from "clsx"
import { modal, resetFilter } from "@/redux/appSlice"
import { AiOutlineHeart } from "react-icons/ai"
import { Button, VerifyPhone } from ".."
import Swal from "sweetalert2"
import { formatMoney } from "@/ultils/fn"
import { apiValidManager } from "@/apis/user"
import { toast } from "react-toastify"

const activedStyle =
  "text-sm flex gap-2 items-center px-4 py-3 rounded-l-full rounded-r-full border border-white"
const notActivedStyle =
  "text-sm flex gap-2 items-center px-4 py-3 rounded-l-full rounded-r-full border border-emerald-800 hover:border-white"
const Navigation = ({ dispatch, location, navigate }) => {
  const [params] = useSearchParams()
  const [isShowOptions, setIsShowOptions] = useState(false)
  const { current, wishlist } = useSelector((state) => state.user)
  const handleShowOptions = (e) => {
    e.stopPropagation()
    if (!isShowOptions) setIsShowOptions(true)
    else setIsShowOptions(false)
  }
  useEffect(() => {
    const handleOffOptionsExternalClick = (e) => {
      const optionsElm = document.getElementById("options")
      if (optionsElm && optionsElm?.contains(e.target)) setIsShowOptions(true)
      else setIsShowOptions(false)
    }
    window.addEventListener("click", handleOffOptionsExternalClick)

    return () => {
      window.removeEventListener("click", handleOffOptionsExternalClick)
    }
  }, [])
  const handleClickCreatePost = (pathname) => {
    if (current?.roleList?.some((el) => el.name === "ROLE_MANAGE")) {
      navigate(pathname)
    } else {
      Swal.fire({
        icon: "info",
        title: "Oops!",
        text: "Bạn phải xác minh SĐT mới được truy cập",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: "Đi xác minh",
        cancelButtonText: "Bỏ qua",
      }).then((rs) => {
        if (rs.isConfirmed) {
          dispatch(modal({ isShowModal: true, modalContent: <VerifyPhone /> }))
        }
      })
    }
  }
  const handleCheckUltilManager = async () => {
    const response = await apiValidManager()
    if (response.success) navigate(`/${path.SUPER_ADMIN}/${path.DASHBOARD}`)
    else toast.error(response.message)
  }
  return (
    <div className="flex bg-emerald-800 py-6 justify-center">
      <div className="w-main flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Link className="text-3xl text-white font-bold" to={"/"}>
            trouytin.online
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 justify-center items-center">
              {!current && (
                <>
                  <button
                    onClick={() =>
                      navigate(`/${path.LOGIN}`, { state: "LOGIN" })
                    }
                    state={"LOGIN"}
                    className="text-emerald-800 rounded-md bg-gray-100 text-sm font-medium px-6 py-2"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/${path.LOGIN}`, { state: "REGISTER" })
                    }
                    state={"REGISTER"}
                    className="text-emerald-800 rounded-md bg-gray-100 text-sm font-medium px-6 py-2"
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </div>
            {current && (
              <>
                {current?.roleList?.some((el) => el.name === "ROLE_USER") && (
                  <Link
                    to={`/${path.MEMBER}/${path.WISHLIST}`}
                    className="rounded-md flex items-center gap-2 text-white text-sm font-medium px-6 py-2"
                  >
                    <span className="relative">
                      {wishlist && wishlist.length > 0 && (
                        <span className="text-[8px] text-white w-3 h-3 flex items-center justify-center bg-red-500 border border-white absolute -top-2 -right-2 p-2 rounded-full">
                          {wishlist?.length || 0}
                        </span>
                      )}
                      <AiOutlineHeart size={22} />
                    </span>
                    <span>Yêu thích</span>
                  </Link>
                )}

                <div className="relative">
                  <span className="animate-ping absolute inline-flex h-3 w-3 top-0 right-0 rounded-full bg-red-600 opacity-75"></span>
                  <span className="rounded-full absolute inline-flex h-3 w-3 top-0 right-0 bg-red-700"></span>
                  <Button
                    onClick={() =>
                      handleClickCreatePost(
                        `/${path.MANAGER}/${path.CREATE_POST}`
                      )
                    }
                    className="text-emerald-800-300 rounded-md flex items-center gap-2 border  bg-gradient-to-r to-main-yellow from-main-orange text-sm font-medium px-6 py-2"
                  >
                    Đăng tin mới
                  </Button>
                </div>
                <Button
                  onClick={() =>
                    handleCheckUltilManager(
                      `/${path.SUPER_ADMIN}/${path.DASHBOARD}`
                    )
                  }
                  className="text-emerald-800-300 rounded-md flex items-center gap-2 border  bg-gradient-to-r to-main-yellow from-main-orange text-sm font-medium px-6 py-2"
                  >
                  Quản lý trọ
                </Button>


                {current?.roleList?.some((el) => el.name === "ROLE_MANAGE") && (
                  <Link
                    to={`/${path.MANAGER}/${path.DEPOSIT}`}
                    className="text-emerald-800-300 rounded-md flex items-center gap-2 border  bg-gradient-to-r to-main-yellow from-main-orange text-sm font-medium px-6 py-2"
                    >
                    Nạp tiền
                  </Link>
                )}

                <div
                  onClick={handleShowOptions}
                  className="flex relative cursor-pointer items-center gap-2"
                >
                  {isShowOptions && (
                    <div
                      id="options"
                      className="absolute flex flex-col min-w-[150px] w-fit z-50 top-full right-0 bg-white rounded-md border text-gray-800"
                    >
                      {current?.roleList?.some(
                        (el) => el.name === "ROLE_USER"
                      ) && (
                          <Link
                            to={`/${path.MEMBER}/${path.PERSONAL}`}
                            className="p-3 hover:bg-gray-100 hover:text-emerald-600 font-medium"
                          >
                            Thông tin cá nhân
                          </Link>
                        )}
                      {current?.roleList?.some(
                        (el) => el.name === "ROLE_ADMIN"
                      ) && (
                          <Link
                            to={`/${path.ADMIN}/${path.DASHBOARD}`}
                            className="p-3 hover:bg-gray-100 whitespace-nowrap hover:text-emerald-600 font-medium"
                          >
                            Admin
                          </Link>
                        )}
                      {current?.roleList?.some(
                        (el) => el.name === "ROLE_ULTI_MANAGER"
                      ) && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCheckUltilManager()
                            }}
                            className="p-3 hover:bg-gray-100 cursor-pointer hover:text-emerald-600 font-medium whitespace-nowrap"
                          >
                            Quản lý trọ
                          </span>
                        )}
                      {current?.roleList?.some(
                        (el) => el.name === "ROLE_MANAGE"
                      ) && (
                          <Link
                            to={`/${path.MANAGER}/${path.CREATE_POST}`}
                            className="p-3 hover:bg-gray-100 hover:text-emerald-600 font-medium whitespace-nowrap">
                            Quản lý tin
                          </Link>
                        )}
                      <span
                        onClick={() => dispatch(logout())}
                        className="p-3 hover:bg-gray-100 hover:text-emerald-600 font-medium"
                      >

                        Đăng xuất
                      </span>
                    </div>
                  )}
                  <span className="text-sm flex flex-col text-white">
                    <span className="font-bold">{current?.userName}</span>
                    <span>{`TK chính: ${formatMoney(
                      +current?.balance
                    )} VND`}</span>
                  </span>
                  <img
                    src={current?.images || "/user.svg"}
                    alt="avatar"
                    className="w-12 h-12 object-cover rounded-full border"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 -ml-4 text-white">
          {menu.map((el) => (
            <NavLink
              to={el.path}
              key={el.id}
              onClick={() => dispatch(resetFilter(true))}
              className={({ isActive }) =>
                clsx(
                  params.get("type") === el.type
                    ? activedStyle
                    : notActivedStyle,
                  !params.get("type") && isActive && activedStyle
                )
              }
            >
              <span>{el.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default withBaseTopping(memo(Navigation))

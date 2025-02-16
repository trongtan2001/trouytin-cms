import { apiUpgradeRole, apiVerifyRole } from "@/apis/user"
import { Button, InputForm } from "@/components"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import { getCurrent } from "@/redux/actions"
import { login, logout } from "@/redux/userSlice"
import path from "@/ultils/path"
import clsx from "clsx"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
let intervelId
const VerifyOtpUpgradeRole = ({ navigate, dispatch }) => {
  const { current } = useSelector((s) => s.user)
  if (!current) return <Navigate to={`/${path.LOGIN}`} />
  const [countdown, setCountdown] = useState(60)
  const [expiredTime, setExpiredTime] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm()
  const onSubmit = async (data) => {
    data.userName = current?.userName
    const response = await apiUpgradeRole(data)
    if (response.token) {
      dispatch(login({ token: response.token }))
      setTimeout(() => {
        Swal.fire({
          title: "Congrads!",
          text: "Xác thực thành công. Bây giờ bạn có thể đăng tin rồi, đi tới đăng tin?",
          icon: "success",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Đăng tin",
        }).then((rs) => {
          if (rs.isConfirmed) {
            navigate(`/${path.MANAGER}/${path.CREATE_POST}`)
          }
        })
      }, 500)
    } else toast.error(response.message)
  }
  useEffect(() => {
    intervelId = setInterval(() => {
      console.log("here")
      if (countdown > 0) setCountdown((prev) => prev - 1)
      else {
        clearInterval(intervelId)
        setCountdown(0)
        setExpiredTime(true)
      }
    }, 1000)

    return () => {
      if (intervelId) clearInterval(intervelId)
    }
  }, [countdown, expiredTime])
  const handleResendOtp = async () => {
    if (expiredTime) {
      setIsLoading(true)
      const response = await apiVerifyRole({
        phoneNumber: current?.phoneNumber,
        userName: current?.userName,
      })
      setIsLoading(false)
      if (response.status === "DELIVERED") {
        toast.success(response.message)
        setExpiredTime(false)
        setCountdown(60)
      } else toast.error(response.message)
    } else toast.info(`Sau ${countdown} mới gửi lại mã`)
  }
  return (
    <div className="p-12">
      <div className="bg-white rounded-md p-4 max-w-[500px] mx-auto">
        <h1 className="font-bold text-gray-800 text-lg">
          Xác minh số điện thoại
        </h1>
        <small>
          Mã xác thực đã được gửi tới SĐT{" "}
          <span className="font-bold">{current?.phoneNumber}</span>. Vui lòng
          nhập mã vào bên dưới để tiếp tục.
        </small>
        <div className="pb-4 border-b">
          <InputForm
            id="otpNumber"
            register={register}
            errors={errors}
            validate={{ required: "Vui lòng nhập mã xác thực" }}
            placeholder="Nhập mã xác thực tại đây"
          />
          <Button onClick={handleSubmit(onSubmit)} className="mt-4 w-full">
            Xác thực tài khoản
          </Button>
        </div>
        <div className="mt-4">
          <small>Bạn vẫn chưa nhận được mã xác thực?</small>
          <Button
            onClick={handleResendOtp}
            disabled={isLoading}
            className={clsx(
              !expiredTime
                ? "mt-3 w-full bg-gray-200 text-black"
                : "border-emerald-700 mt-3 bg-transparent text-emerald-700 border w-full rounded-md"
            )}
          >
            <span>Gửi lại mã</span>
            {!expiredTime && <span>{`(${countdown}s)`}</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WithBaseTopping(VerifyOtpUpgradeRole)

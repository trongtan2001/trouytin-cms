import { apiChangePassword } from "@/apis/user"
import { Button, InputForm, Title } from "@/components"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import { logout } from "@/redux/userSlice"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"

const ChangePassword = ({ dispatch }) => {
  const [step, setStep] = useState("PHONE")
  const { current } = useSelector((s) => s.user)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm()
  const handleGetOtp = async (data) => {
    if (data.newPassword !== data.confirmationPassword)
      return toast.error("Nhập lại mật khẩu không đúng.")
    const response = await apiChangePassword(data)
    if (response.success) {
      toast.success(response.message)
      dispatch(logout())
    } else toast.error(response.message)
  }
  return (
    <div className="w-full">
      <Title title="Đổi mật khẩu" />
      <div className="p-4 flex flex-col gap-4 mx-auto w-[500px]">
        {step === "PHONE" && (
          <>
            <InputForm
              id="currentPassword"
              register={register}
              errors={errors}
              placeholder={"Nhập mật khẩu cũ"}
              label="Mật khẩu cũ"
              validate={{
                required: "Không được bỏ trống.",
                minLength: {
                  value: 6,
                  message: "Mật khẩu bắt buộc tối thiểu 6 ký tự.",
                },
              }}
              type="password"
            />
            <InputForm
              id="newPassword"
              register={register}
              errors={errors}
              placeholder={"Nhập mật khẩu mới"}
              label="Mật khẩu mới"
              validate={{
                required: "Không được bỏ trống.",
                minLength: {
                  value: 6,
                  message: "Mật khẩu bắt buộc tối thiểu 6 ký tự.",
                },
              }}
              type="password"
            />
            <InputForm
              id="confirmationPassword"
              register={register}
              errors={errors}
              placeholder={"Nhập lại mật khẩu mới"}
              label="Nhập lại mật khẩu mới"
              validate={{
                required: "Không được bỏ trống.",
                minLength: {
                  value: 6,
                  message: "Mật khẩu bắt buộc tối thiểu 6 ký tự.",
                },
              }}
              type="password"
            />
            <Button onClick={handleSubmit(handleGetOtp)} className="w-full">
              Đổi mật khấu
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default WithBaseTopping(ChangePassword)

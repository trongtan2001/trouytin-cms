import { apiChangePhone } from "@/apis/user"
import { Button, InputForm, Title } from "@/components"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import { getCurrent } from "@/redux/actions"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"

const ChangePhone = ({ dispatch }) => {
  const [step, setStep] = useState("PHONE")
  const { current } = useSelector((s) => s.user)
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm()
  const handleGetOtp = async (data) => {
    if (current?.phoneNumber !== `+84${Number(data.oldPhoneNumber)}`)
      return toast.error("SĐT cũ không đúng.")
    if (data.newPhoneNumber !== data.confirmPhoneNumber)
      return toast.error("Nhập lại SĐT không đúng.")
    const formatedDataArr = Object.entries(data).map((el) => [
      el[0],
      "0" + el[1].slice(1),
    ])
    const formatedData = Object.fromEntries(formatedDataArr)
    const response = await apiChangePhone(formatedData)
    if (response.success) {
      toast.success(response.message)
      dispatch(getCurrent())
      reset()
    } else toast.error(response.message)
  }
  return (
    <div className="w-full">
      <Title title="Cập nhật số điện thoại" />
      <div className="p-4 flex flex-col gap-4 mx-auto w-[500px]">
        {step === "PHONE" && (
          <>
            <InputForm
              id="oldPhoneNumber"
              register={register}
              errors={errors}
              placeholder={"Nhập điện thoại cũ"}
              label="Số điện thoại cũ"
              validate={{
                required: "Không được bỏ trống.",
                pattern: {
                  value: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
                  message: "Số điện thoại không hợp lệ",
                },
              }}
            />
            <InputForm
              id="newPhoneNumber"
              register={register}
              errors={errors}
              placeholder={"Nhập điện thoại mới"}
              label="Số điện thoại mới"
              validate={{
                required: "Không được bỏ trống.",
                pattern: {
                  value: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
                  message: "Số điện thoại không hợp lệ",
                },
              }}
            />
            <InputForm
              id="confirmPhoneNumber"
              register={register}
              errors={errors}
              placeholder={"Nhập lại điện thoại mới"}
              label="Nhập lại điện thoại mới"
              validate={{
                required: "Không được bỏ trống.",
                pattern: {
                  value: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
                  message: "Số điện thoại không hợp lệ",
                },
              }}
            />
            <Button onClick={handleSubmit(handleGetOtp)} className="w-full">
              Lấy mã xác thực
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default WithBaseTopping(ChangePhone)

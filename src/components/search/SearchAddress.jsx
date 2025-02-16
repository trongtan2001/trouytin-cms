import React, { useEffect, useState } from "react"
import { Button, InputForm, SelectLib } from ".."
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import clsx from "clsx"
import withBaseTopping from "@/hocs/WithBaseTopping"
import { modal } from "@/redux/appSlice"
import { apiGetProvince } from "@/apis/app"

const SearchAddress = ({ getAddress, dispatch }) => {
  const { provinces } = useSelector((state) => state.app)
  const {
    formState: { errors },
    setValue,
    watch,
    register,
    reset,
  } = useForm()
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const province = watch("province")
  const district = watch("district")
  const ward = watch("ward")
  const street = watch("street")
  const address = watch("address")
  const setCustomValue = (id, val) =>
    setValue(id, val, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  const getDataProvince = async (provinceCode) => {
    const response = await apiGetProvince(provinceCode)
    if (response.status === 200) {
      setDistricts(response.data?.districts)
    }
  }
  useEffect(() => {
    if (province) {
      setCustomValue("district", "")
      setCustomValue("ward", "")
      setCustomValue("street", "")
      getDataProvince(province.code)
    }
  }, [province])
  useEffect(() => {
    if (district) setWards(district.wards)
  }, [district])
  useEffect(() => {
    const text = clsx(
      street,
      street && ",",
      ward?.name,
      ward?.name && ",",
      district?.name,
      district?.name && ",",
      province?.name
    )
    const textModified = text
      ?.split(",")
      ?.map((el) => el.trim())
      ?.join(", ")
    setCustomValue("address", textModified)
  }, [province, district, ward, street])
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-[650px] bg-white rounded-md p-4"
    >
      <h1 className="text-lg font-bold tracking-tight pb-4 border-b">
        Tìm kiếm theo địa chỉ
      </h1>
      <div className="mt-6">
        <div className="grid grid-cols-3 gap-4">
          <SelectLib
            options={provinces?.map((el) => ({
              ...el,
              value: el.code,
              label: el.name,
            }))}
            onChange={(val) => setCustomValue("province", val)}
            value={province}
            className="col-span-1"
            label="Tỉnh/Thành phố"
          />
          <SelectLib
            options={districts?.map((el) => ({
              ...el,
              value: el.code,
              label: el.name,
            }))}
            onChange={(val) => setCustomValue("district", val)}
            value={district}
            className="col-span-1"
            label="Quận/Huyện"
          />
          <SelectLib
            options={wards?.map((el) => ({
              ...el,
              value: el.code,
              label: el.name,
            }))}
            onChange={(val) => setCustomValue("ward", val)}
            value={ward}
            className="col-span-1"
            label="Phường/Xã"
          />
        </div>
        <div className="mt-4">
          <InputForm
            label="Đường/Phố/Số nhà"
            register={register}
            errors={errors}
            id="street"
            fullWidth
            placeholder="Nhập số nhà, đường, phố cụ thể"
            inputClassName="border-gray-300 placeholder:text-base"
          />
        </div>
        <div className="mt-6 flex items-center justify-center">
          <Button
            onClick={() => {
              getAddress(address)
              dispatch(modal({ isShowModal: false, modalContent: null }))
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

export default withBaseTopping(SearchAddress)

import React, { useEffect } from "react"
import { Button } from ".."
import { CiSearch } from "react-icons/ci"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import withBaseTopping from "@/hocs/WithBaseTopping"
import { modal } from "@/redux/appSlice"
import path from "@/ultils/path"
import { createSearchParams } from "react-router-dom"
import { BiReset } from "react-icons/bi"
import SearchRange from "./SearchRange"
import SearchAddress from "./SearchAddress"

const Search = ({ dispatch, navigate, location }) => {
  const { prices, areas } = useSelector((s) => s.app)
  const { setValue, watch } = useForm()
  const categoryCode = watch("categoryCode")
  const priceRange = watch("priceRange")
  const areaRange = watch("areaRange")
  const address = watch("address")
  useEffect(() => {
    if (location.pathname === "/") reset()
  }, [location.pathname])
  const reset = () => {
    setValue("categoryCode", "")
    setValue("priceRange", "")
    setValue("areaRange", "")
    setValue("address", "")
  }

  const handleSearchPost = () => {
    const queries = {}
    if (categoryCode) queries.category = categoryCode.id
    if (priceRange) queries.price = priceRange.value
    if (areaRange) queries.acreage = areaRange.value
    if (address) queries.address = address
    navigate({
      pathname: `/${path.LIST}`,
      search: createSearchParams(queries).toString(),
    })
  }
  return (
    <div className="-mt-6 mb-6 w-main mx-auto bg-main-yellow p-2 rounded-md gap-2 grid grid-cols-4">
      <div
        onClick={() =>
          dispatch(
            modal({
              isShowModal: true,
              modalContent: (
                <SearchAddress getAddress={(val) => setValue("address", val)} />
              ),
            })
          )
        }
        className="col-span-1 p-2 rounded-[0.25rem] line-clamp-1 w-full flex items-center cursor-pointer text-gray-500 bg-white"
      >
        <span className="line-clamp-1">{address || "🚩 Địa chỉ"}</span>
      </div>
      <div
        className="col-span-1 p-2 rounded-[0.25rem] flex items-center cursor-pointer text-gray-500 bg-white"
        onClick={() =>
          dispatch(
            modal({
              isShowModal: true,
              modalContent: (
                <SearchRange
                  unit="triệu/tháng"
                  type="PRICE"
                  targetNumber={15}
                  options={prices}
                  getValue={(val) => setValue("priceRange", val)}
                  valRange={priceRange?.value}
                  exp={6}
                />
              ),
            })
          )
        }
      >
        <span className="line-clamp-1">
          {priceRange?.text || "💲 Giá thuê"}
        </span>
      </div>
      <div
        className="col-span-1 p-2 rounded-[0.25rem] flex items-center cursor-pointer text-gray-500 bg-white"
        onClick={() =>
          dispatch(
            modal({
              isShowModal: true,
              modalContent: (
                <SearchRange
                  unit="m2"
                  type="AREA"
                  targetNumber={90}
                  options={areas}
                  getValue={(val) => setValue("areaRange", val)}
                  valRange={areaRange?.value}
                  typeCode="AREA"
                />
              ),
            })
          )
        }
      >
        <span className="line-clamp-1">
          {areaRange?.text || "🔳 Diện tích"}
        </span>
      </div>
      <div className="col-span-1 h-full flex items-center justify-center gap-2">
        <Button className="flex-auto h-full" onClick={handleSearchPost}>
          <CiSearch size={18} />
          <span>Tìm kiếm</span>
        </Button>
        <Button className="bg-red-500 h-full flex-auto" onClick={reset}>
          <BiReset color="white" size={18} />
          <span>Reset</span>
        </Button>
      </div>
    </div>
  )
}

export default withBaseTopping(Search)
